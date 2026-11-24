"""
File storage for uploads.

Two backends:
- Vercel Blob (production): used when BLOB_READ_WRITE_TOKEN is set.
  Vercel's filesystem is read-only and wiped between requests, so files
  must live in Blob storage. Stored paths are full https:// URLs, which
  the frontend already uses as-is.
- Local disk (development): files go to backend/uploads (or DATA_DIR /
  UPLOADS_DIR) and are served by FastAPI under /uploads.

The Blob calls follow the REST protocol used by the official
@vercel/blob SDK (v2.9.0).
"""

import base64
import hashlib
import hmac
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = os.getenv("DATA_DIR")

if DATA_DIR:
    STORAGE_DIR = Path(DATA_DIR)
else:
    STORAGE_DIR = BASE_DIR

UPLOADS_DIR = Path(
    os.getenv("UPLOADS_DIR", str(STORAGE_DIR / "uploads"))
)

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN", "").strip()
USE_BLOB = bool(BLOB_TOKEN)

BLOB_API_URL = "https://vercel.com/api/blob"
BLOB_API_VERSION = "13"

if not USE_BLOB:
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


class StorageError(Exception):
    pass


# =====================================================
# VERCEL BLOB — LOW LEVEL
# =====================================================

def _store_id() -> str:
    parts = BLOB_TOKEN.split("_")
    return parts[3] if len(parts) > 3 else ""


def _blob_request(path: str, method: str, body=None, headers=None):
    req_headers = {
        "authorization": f"Bearer {BLOB_TOKEN}",
        "x-api-version": BLOB_API_VERSION,
        "x-vercel-blob-store-id": _store_id(),
    }
    req_headers.update(headers or {})

    request = urllib.request.Request(
        f"{BLOB_API_URL}{path}",
        data=body,
        method=method,
        headers=req_headers,
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            raw = response.read()
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")[:300]
        raise StorageError(f"Blob API {error.code}: {detail}") from error
    except urllib.error.URLError as error:
        raise StorageError(f"Blob API unreachable: {error.reason}") from error

    return json.loads(raw) if raw else {}


def _blob_put(pathname: str, data: bytes, content_type: str | None) -> str:
    headers = {
        "x-vercel-blob-access": "public",
        "x-add-random-suffix": "0",
        "x-allow-overwrite": "1",
        "x-content-length": str(len(data)),
    }

    if content_type:
        headers["x-content-type"] = content_type

    query = urllib.parse.urlencode({"pathname": pathname})
    result = _blob_request(f"/?{query}", "PUT", body=data, headers=headers)
    return result["url"]


def _blob_list(prefix: str = "", limit: int = 1000) -> list[dict]:
    blobs: list[dict] = []
    cursor = None

    while len(blobs) < limit:
        params = {"limit": str(min(1000, limit - len(blobs)))}

        if prefix:
            params["prefix"] = prefix
        if cursor:
            params["cursor"] = cursor

        result = _blob_request(
            f"?{urllib.parse.urlencode(params)}",
            "GET",
        )
        blobs.extend(result.get("blobs", []))

        if not result.get("hasMore"):
            break

        cursor = result.get("cursor")

    return blobs


def _blob_delete(urls: list[str]) -> None:
    if not urls:
        return

    _blob_request(
        "/delete",
        "POST",
        body=json.dumps({"urls": urls}).encode(),
        headers={"content-type": "application/json"},
    )


def create_client_token(
    pathname: str,
    allowed_content_types: list[str],
    maximum_size_in_bytes: int,
    valid_seconds: int = 600,
) -> str:
    """
    Short-lived token that lets the browser upload ONE file straight to
    Blob storage (bypasses Vercel's 4.5 MB request body limit).
    Same format as generateClientTokenFromReadWriteToken in @vercel/blob.
    """

    payload = base64.b64encode(
        json.dumps({
            "pathname": pathname,
            "allowedContentTypes": allowed_content_types,
            "maximumSizeInBytes": maximum_size_in_bytes,
            "addRandomSuffix": False,
            "allowOverwrite": True,
            "validUntil": int((time.time() + valid_seconds) * 1000),
        }, separators=(",", ":")).encode()
    ).decode()

    signature = hmac.new(
        BLOB_TOKEN.encode(),
        payload.encode(),
        hashlib.sha256,
    ).hexdigest()

    encoded = base64.b64encode(f"{signature}.{payload}".encode()).decode()
    return f"vercel_blob_client_{_store_id()}_{encoded}"


# =====================================================
# PUBLIC API (used by routers)
# =====================================================

def save_file(folder: str, filename: str, data: bytes, content_type: str | None = None) -> str:
    """Store a file and return the path/URL to save in the database."""

    if folder.casefold() == "applications":
        raise StorageError("Applicant documents must use private storage")
    if USE_BLOB:
        return _blob_put(f"{folder}/{filename}", data, content_type)

    folder_path = UPLOADS_DIR / folder
    folder_path.mkdir(parents=True, exist_ok=True)
    (folder_path / filename).write_bytes(data)
    return f"/uploads/{folder}/{filename}"


def list_files(limit: int = 1000) -> list[dict]:
    files = []

    if USE_BLOB:
        for blob in _blob_list(limit=limit):
            pathname = blob.get("pathname", "")

            if "/" not in pathname:
                continue

            folder, filename = pathname.split("/", 1)
            if folder.casefold() == "applications":
                continue
            files.append({
                "folder": folder,
                "filename": filename,
                "path": blob["url"],
            })

        return files

    if not UPLOADS_DIR.exists():
        return files

    for folder in UPLOADS_DIR.iterdir():
        if not folder.is_dir() or folder.is_symlink() or folder.name.casefold() == "applications":
            continue

        for file in folder.iterdir():
            if not file.is_file() or file.is_symlink() or file.name.startswith("."):
                continue

            files.append({
                "folder": folder.name,
                "filename": file.name,
                "path": f"/uploads/{folder.name}/{file.name}",
            })

            if len(files) >= limit:
                return files

    return files


def delete_file(folder: str, filename: str) -> bool:
    """Delete by folder/filename. Returns False if it did not exist."""

    if USE_BLOB:
        pathname = f"{folder}/{filename}"
        matches = [
            blob["url"]
            for blob in _blob_list(prefix=pathname, limit=50)
            if blob.get("pathname") == pathname
        ]

        if not matches:
            return False

        _blob_delete(matches)
        return True

    file_path = UPLOADS_DIR / folder / filename

    if not file_path.exists():
        return False

    file_path.unlink()
    return True


def delete_stored_path(stored: str) -> None:
    """Delete a file given the value saved in the database."""

    if not stored:
        return

    if stored.startswith("http"):
        if USE_BLOB and ".blob.vercel-storage.com/" in stored:
            _blob_delete([stored])
        return

    relative = stored.removeprefix("/uploads/")
    file_path = UPLOADS_DIR / relative

    if file_path.exists():
        file_path.unlink()
