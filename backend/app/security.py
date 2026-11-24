import os
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import get_db
from . import models

load_dotenv()


def require_secret(value: str | None) -> str:
    secret = value or ""
    if (len(secret.strip().encode("utf-8")) < 32
            or len(set(secret.strip())) < 8
            or secret != secret.strip()):
        raise RuntimeError("Set SECRET_KEY to a strong independent random secret of at least 32 bytes.")
    return secret


SECRET_KEY = require_secret(os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
ISSUER = "terralens-api"
AUDIENCE = "terralens-admin"

# Argon2id for new credentials; bcrypt remains verify-only during migration.
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated=["bcrypt"],
    argon2__type="ID",
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
    bcrypt__truncate_error=True,
)


def verify_and_upgrade_password(plain_password: str, hashed_password: str):
    """Return (valid, replacement_hash). Never upgrade a failed verification."""
    if not plain_password or len(plain_password) > 200:
        return False, None
    try:
        scheme = pwd_context.identify(hashed_password)
        if scheme == "bcrypt" and len(plain_password.encode("utf-8")) > 72:
            # Old bcrypt hashes cannot authenticate bytes beyond this boundary.
            # Affected accounts need an authorized password reset, not truncation.
            return False, None
        if scheme is None:
            return False, None
        return pwd_context.verify_and_update(plain_password, hashed_password)
    except (ValueError, TypeError):
        # Malformed hashes or unsupported password input must not produce a 500.
        return False, None


def verify_password(plain_password: str, hashed_password: str):
    return verify_and_upgrade_password(plain_password, hashed_password)[0]


def credential_binding(admin: models.Admin) -> str:
    message = json.dumps(
        ["terralens-admin-v1", admin.id, admin.username, admin.password, admin.role],
        separators=(",", ":"),
    ).encode("utf-8")
    return hmac.new(SECRET_KEY.encode("utf-8"), message, hashlib.sha256).hexdigest()


def create_access_token(admin: models.Admin, expires_delta: timedelta | None = None):
    now = datetime.now(timezone.utc)
    expiry = now + (expires_delta if expires_delta is not None else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return jwt.encode({
        "sub": admin.username,
        "aid": admin.id,
        "role": admin.role,
        "binding": credential_binding(admin),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int(expiry.timestamp()),
    }, SECRET_KEY, algorithm=ALGORITHM)


security = HTTPBearer(auto_error=False)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    error = HTTPException(401, "Invalid or expired authentication token",
                          headers={"WWW-Authenticate": "Bearer"})
    if not credentials:
        raise error
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM],
            issuer=ISSUER, audience=AUDIENCE,
            options={f"require_{claim}": True for claim in ("sub", "iss", "aud", "iat", "exp")},
        )
        username = payload["sub"]
        aid = payload["aid"]
        role = payload["role"]
        binding = payload["binding"]
        issued = payload["iat"]
        expires = payload["exp"]
        now = int(datetime.now(timezone.utc).timestamp())
        if (not isinstance(username, str) or not username
                or type(aid) is not int or not 0 < aid <= 2147483647
                or role not in ("manager", "employee")
                or not isinstance(binding, str) or not binding.isascii() or len(binding) != 64
                or type(issued) is not int or type(expires) is not int
                or not issued <= now < expires
                or expires - issued > ACCESS_TOKEN_EXPIRE_MINUTES * 60):
            raise error
    except (JWTError, KeyError, TypeError, ValueError, OverflowError):
        raise error from None

    admin = db.query(models.Admin).filter(
        models.Admin.id == aid, models.Admin.username == username,
        models.Admin.is_active == True,
    ).first()
    if not admin or admin.role != role or not hmac.compare_digest(binding, credential_binding(admin)):
        raise error
    return admin


def get_current_manager(current_admin: models.Admin = Depends(get_current_admin)):
    if current_admin.role != "manager":
        raise HTTPException(403, "Manager access required")
    return current_admin
