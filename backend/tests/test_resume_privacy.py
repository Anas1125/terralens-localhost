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
    return {"Authorization":"Bearer " + create_access_token({"sub":"test-manager","role":"manager"})}

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
