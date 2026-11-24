"""Isolated tests: never use a deployed database or Blob store."""
import io
import os
import secrets
import tempfile
from pathlib import Path

import pytest

_tmp = tempfile.TemporaryDirectory()
os.environ["DATABASE_URL"] = "sqlite:///" + str(Path(_tmp.name) / "test.db")
os.environ["UPLOADS_DIR"] = str(Path(_tmp.name) / "uploads")
os.environ["BLOB_READ_WRITE_TOKEN"] = " "
os.environ["SECRET_KEY"] = secrets.token_hex(32)

from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app import models, storage, rate_limit
from app.database import SessionLocal
from app.security import create_access_token, pwd_context

@pytest.fixture
def client():
    rate_limit._attempts.clear()
    with SessionLocal.begin() as db:
        db.query(models.PrivateResume).delete()
        db.query(models.Application).delete()
        db.query(models.Job).delete()
        db.query(models.Admin).delete()
        db.add(models.Admin(username="test-manager", password=pwd_context.hash("test-password"), role="manager", is_active=True))
        db.add(models.Job(id=1, title="Test", department="IT", location="Test", employment_type="Full time", description="Test", requirements="Test", is_active=True))
        db.add(models.Job(id=2, title="Closed", department="IT", location="Test", employment_type="Full time", description="Test", requirements="Test", is_active=False))
    with TestClient(app) as c:
        yield c

@pytest.fixture
def headers(client):
    with SessionLocal() as db:
        manager = db.query(models.Admin).filter_by(username="test-manager").one()
        return {"Authorization":"Bearer " + create_access_token(manager)}

def submit(client, job_id=1, content=None):
    if content is None:
        buf = io.BytesIO()
        Image.new("RGB",(8,8),"blue").save(buf,"PNG")
        content = buf.getvalue()
    return client.post("/applications/", data={"job_id":job_id,"full_name":"Test Applicant","email":"fixture@example.com"},
                       files={"resume":("resume.png", content,"image/png")})

def test_new_resume_is_private(client, headers, monkeypatch):
    def never_public(*args, **kwargs):
        pytest.fail("Resume must never enter public storage")
    monkeypatch.setattr(storage, "save_file", never_public)
    response = submit(client)
    assert response.status_code == 200, response.text
    body = response.json()
    url = body["resume"]
    assert url == f"/applications/{body['id']}/resume"
    with SessionLocal() as db:
        stored = db.get(models.PrivateResume, body["id"])
        assert stored is not None
        expected = bytes(stored.data)
    assert client.get(url).status_code in (401,403)
    assert client.get(url, headers={"Authorization":"Bearer invalid"}).status_code == 401
    download = client.get(url, headers=headers)
    assert download.status_code == 200
    assert download.content == expected
    assert download.headers["content-type"] == "application/octet-stream"
    assert download.headers["content-disposition"].startswith("attachment;")
    assert "no-store" in download.headers["cache-control"]
    assert client.delete(f"/applications/{body['id']}", headers=headers).status_code == 200
    assert client.get(url, headers=headers).status_code == 404
    with SessionLocal() as db:
        assert db.get(models.PrivateResume, body["id"]) is None

def test_legacy_local_resume_not_public(client, headers):
    folder = storage.UPLOADS_DIR / "applications"
    folder.mkdir(exist_ok=True)
    file = folder / "legacy.pdf"
    file.write_bytes(b"%PDF-test-fixture")
    with SessionLocal.begin() as db:
        row = models.Application(job_id=1, full_name="Fixture", email="fixture@example.com", resume="/uploads/applications/legacy.pdf")
        db.add(row)
        db.flush()
        identifier = row.id
    try:
        assert client.get("/uploads/applications/legacy.pdf").status_code == 404
        response = client.get("/media/")
        assert response.status_code == 200
        assert all(x["folder"] != "applications" for x in response.json())
        assert client.get(f"/applications/{identifier}/resume",headers=headers).content == file.read_bytes()
    finally:
        file.unlink(missing_ok=True)

def test_blob_listing_excludes_applications(client, monkeypatch):
    monkeypatch.setattr(storage,"USE_BLOB",True)
    monkeypatch.setattr(storage,"_blob_list",lambda **kw:[
        {"pathname":"applications/secret.pdf","url":"https://example.test/secret.pdf"},
        {"pathname":"logo/public.png","url":"https://example.test/logo.png"}])
    result = client.get("/media/").json()
    assert len(result) == 1
    assert result[0]["folder"] == "logo"

def test_reserved_folder_rejects_media_upload(client,headers):
    assert client.post("/media/upload-token/applications",headers=headers,json={"filename":"x.png","size":100}).status_code == 400
    assert client.post("/media/upload/applications",headers=headers,files={"file":("x.png",b"fake","image/png")}).status_code == 400

def test_closed_job_rejected(client):
    assert submit(client,job_id=2).status_code == 404

def test_fake_image_rejected(client):
    assert submit(client,content=b"not an image").status_code == 400

def test_oversized_resume_rejected(client):
    assert submit(client,content=b"x"*(4*1024*1024+1)).status_code == 400


# JWT regression tests share the isolated database fixture above.
from datetime import timedelta
from jose import jwt
from app.security import SECRET_KEY, require_secret


@pytest.mark.parametrize("secret", [None, "", "short", "x"*64, " "*64])
def test_reject_weak_secret(secret):
    with pytest.raises(RuntimeError):
        require_secret(secret)


def test_accept_random_secret():
    value = secrets.token_hex(32)
    assert require_secret(value) == value


def test_login_issues_one_hour_token(client):
    response = client.post("/admin/login", json={"username":"test-manager","password":"test-password"})
    assert response.status_code == 200, response.text
    assert response.json()["role"] == "manager"
    token = response.json()["access_token"]
    payload = jwt.get_unverified_claims(token)
    assert payload["exp"] - payload["iat"] == 3600
    assert payload["aud"] == "terralens-admin"
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+token}).status_code == 200


@pytest.mark.parametrize("claim", ["sub","aid","role","binding","iss","aud","iat","exp"])
def test_missing_claim_rejected(client, headers, claim):
    payload = jwt.get_unverified_claims(headers["Authorization"].split()[1])
    del payload[claim]
    token = jwt.encode(payload,SECRET_KEY,algorithm="HS256")
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+token}).status_code == 401


def test_expired_token_rejected(client):
    with SessionLocal() as db:
        user = db.query(models.Admin).filter_by(username="test-manager").one()
        token = create_access_token(user, timedelta(seconds=-1))
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+token}).status_code == 401


def test_wrong_signature_rejected(client, headers):
    payload = jwt.get_unverified_claims(headers["Authorization"].split()[1])
    token = jwt.encode(payload,secrets.token_hex(32),algorithm="HS256")
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+token}).status_code == 401


@pytest.mark.parametrize("change", ["password","role","username","inactive","recreated"])
def test_changed_account_invalidates_token(client,headers,change):
    with SessionLocal.begin() as db:
        admin = db.query(models.Admin).filter_by(username="test-manager").one()
        if change == "password":
            admin.password = pwd_context.hash("changed-password")
        elif change == "role":
            admin.role = "employee"
        elif change == "username":
            admin.username = "renamed"
        elif change == "inactive":
            admin.is_active = False
        else:
            identifier = admin.id
            db.delete(admin)
            db.flush()
            db.add(models.Admin(id=identifier, username="test-manager",password=pwd_context.hash("test-password"),role="manager",is_active=True))
    assert client.get("/admin/stats",headers=headers).status_code == 401


def test_employee_cannot_manage_admins(client):
    with SessionLocal.begin() as db:
        user = models.Admin(username="employee-test", password=pwd_context.hash("test-password"), role="employee",is_active=True)
        db.add(user)
        db.flush()
        token = create_access_token(user)
    headers = {"Authorization":"Bearer "+token}
    assert client.get("/admin/stats",headers=headers).status_code == 200
    assert client.get("/admin/users",headers=headers).status_code == 403
    assert client.post("/admin/users",headers=headers,json={"username":"new-manager","password":"test-password","role":"manager"}).status_code == 403


# Password migration regression tests (isolated SQLite only).
from passlib.hash import bcrypt
from app.security import verify_and_upgrade_password


def test_new_hash_is_argon2id():
    encoded = pwd_context.hash("correct-password")
    assert encoded.startswith("$argon2id$")
    assert "m=19456,t=2,p=1" in encoded
    assert verify_and_upgrade_password("correct-password", encoded) == (True, None)
    assert verify_and_upgrade_password("wrong-password", encoded) == (False, None)


def test_argon2_preserves_full_long_password():
    original = "a" * 72 + "first-suffix"
    encoded = pwd_context.hash(original)
    assert verify_and_upgrade_password(original, encoded)[0]
    assert not verify_and_upgrade_password("a" * 72 + "other-suffix", encoded)[0]


def test_bcrypt_overlength_not_silently_truncated():
    prefix = "a" * 72
    encoded = bcrypt.hash(prefix)
    assert verify_and_upgrade_password(prefix + "suffix", encoded) == (False, None)
    assert verify_and_upgrade_password(prefix, encoded)[0]


def test_bcrypt_utf8_limit_counts_bytes():
    prefix = "é" * 36
    encoded = bcrypt.hash(prefix)
    assert verify_and_upgrade_password(prefix + "a", encoded) == (False, None)
    assert verify_and_upgrade_password(prefix, encoded)[0]


@pytest.mark.parametrize("encoded", ["not-a-hash", "$2b$broken", "$argon2id$broken", None])
def test_invalid_stored_hash_fails_closed(encoded):
    assert verify_and_upgrade_password("test-password", encoded) == (False, None)


def test_legacy_login_migrates_and_revokes_old_token(client):
    with SessionLocal.begin() as db:
        user = db.query(models.Admin).filter_by(username="test-manager").one()
        user.password = bcrypt.hash("test-password")
        original = user.password
        old_token = create_access_token(user)
    response = client.post("/admin/login", json={"username":"test-manager","password":"test-password"})
    assert response.status_code == 200, response.text
    with SessionLocal() as db:
        current = db.query(models.Admin).filter_by(username="test-manager").one().password
        assert current != original
        assert current.startswith("$argon2id$")
    new_token = response.json()["access_token"]
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+new_token}).status_code == 200
    assert client.get("/admin/stats",headers={"Authorization":"Bearer "+old_token}).status_code == 401
    again = client.post("/admin/login", json={"username":"test-manager","password":"test-password"})
    assert again.status_code == 200
    with SessionLocal() as db:
        assert db.query(models.Admin).filter_by(username="test-manager").one().password == current


def test_wrong_legacy_password_does_not_migrate(client):
    with SessionLocal.begin() as db:
        user = db.query(models.Admin).filter_by(username="test-manager").one()
        user.password = bcrypt.hash("test-password")
        original = user.password
    assert client.post("/admin/login",json={"username":"test-manager","password":"incorrect"}).status_code == 401
    with SessionLocal() as db:
        assert db.query(models.Admin).filter_by(username="test-manager").one().password == original


def test_manager_creates_and_resets_argon2_password(client, headers):
    response = client.post("/admin/users",headers=headers,json={"username":"new-employee","password":"new-password","role":"employee"})
    assert response.status_code == 200, response.text
    identifier = response.json()["id"]
    assert "password" not in response.json()
    with SessionLocal() as db:
        encoded = db.get(models.Admin,identifier).password
        assert encoded.startswith("$argon2id$")
    response = client.put(f"/admin/users/{identifier}",headers=headers,json={"password":"changed-password"})
    assert response.status_code == 200, response.text
    with SessionLocal() as db:
        changed = db.get(models.Admin,identifier).password
        assert changed.startswith("$argon2id$")
        assert changed != encoded
        assert verify_and_upgrade_password("changed-password",changed)[0]
        assert not verify_and_upgrade_password("new-password",changed)[0]
