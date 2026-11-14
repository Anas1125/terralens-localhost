from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)
from pathlib import Path
from PIL import Image
from pydantic import BaseModel
import io
import shutil
import subprocess
import tempfile

from ..security import get_current_admin
from .. import storage

router = APIRouter()


# =====================================================
# UPLOAD SECURITY SETTINGS
# =====================================================

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

ALLOWED_IMAGE_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".webm",
    ".mov",
}

CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
}


# =====================================================
# HELPERS
# =====================================================

def is_safe_name(name: str) -> bool:
    """Prevent path traversal and invalid filenames."""

    if not name:
        return False

    path = Path(name)

    if path.name != name:
        return False

    if name in {".", ".."}:
        return False

    return True


def validate_image(data: bytes) -> bool:
    """Validate the actual image contents using Pillow."""

    try:
        with Image.open(io.BytesIO(data)) as image:
            image.verify()

            if image.format not in ALLOWED_IMAGE_FORMATS:
                return False

        return True

    except Exception:
        return False


def looks_like_video(data: bytes) -> bool:
    """Magic-byte check used when ffprobe is unavailable (e.g. on Vercel)."""

    if len(data) >= 12 and data[4:8] == b"ftyp":
        return True  # MP4 / MOV

    return data[:4] == b"\x1a\x45\xdf\xa3"  # WebM / Matroska


def validate_video(data: bytes, extension: str) -> bool:
    """Validate the actual video using ffprobe, or magic bytes as fallback."""

    if not shutil.which("ffprobe"):
        return looks_like_video(data)

    with tempfile.NamedTemporaryFile(suffix=extension) as temp_file:
        temp_file.write(data)
        temp_file.flush()
        return _ffprobe_is_video(Path(temp_file.name))


def _ffprobe_is_video(file_path: Path) -> bool:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=codec_type",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(file_path),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=15,
        )

        if result.returncode != 0:
            return False

        return "video" in result.stdout.splitlines()

    except (
        FileNotFoundError,
        subprocess.TimeoutExpired,
        OSError,
    ):
        return False


# =====================================================
# PUBLIC — LIST MEDIA
# =====================================================

@router.get("/")
def list_media():
    try:
        return storage.list_files(limit=1000)
    except storage.StorageError as error:
        raise HTTPException(status_code=502, detail=str(error))


# =====================================================
# ADMIN ONLY — DELETE MEDIA
# =====================================================

@router.delete("/{folder}/{filename}")
def delete_media(
    folder: str,
    filename: str,
    admin: str = Depends(get_current_admin),
):
    if not is_safe_name(folder) or not is_safe_name(filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid path.",
        )

    try:
        deleted = storage.delete_file(folder, filename)
    except storage.StorageError as error:
        raise HTTPException(status_code=502, detail=str(error))

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return {
        "message": "Deleted successfully",
    }


def _check_upload_target(folder: str, raw_filename: str) -> tuple[str, str, str]:
    """Validate folder + filename. Returns (filename, extension, media_type)."""

    if not is_safe_name(folder):
        raise HTTPException(
            status_code=400,
            detail="Invalid upload folder.",
        )

    filename = Path(raw_filename or "").name

    if not is_safe_name(filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )

    extension = Path(filename).suffix.lower()

    if extension in ALLOWED_IMAGE_EXTENSIONS:
        media_type = "image"
    elif extension in ALLOWED_VIDEO_EXTENSIONS:
        media_type = "video"
    else:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed images: JPG, JPEG, PNG, WEBP. "
                "Allowed videos: MP4, WEBM, MOV."
            ),
        )

    return filename, extension, media_type


# =====================================================
# ADMIN ONLY — DIRECT UPLOAD TOKEN (Vercel Blob)
# =====================================================

class UploadTokenRequest(BaseModel):
    filename: str
    size: int = 0


@router.post("/upload-token/{folder}")
def create_upload_token(
    folder: str,
    body: UploadTokenRequest,
    admin: str = Depends(get_current_admin),
):
    """
    On Vercel, request bodies are capped at 4.5 MB, so the admin panel
    uploads files straight to Blob storage using a one-file token from
    here. Locally (no Blob token) the frontend falls back to /upload.
    """

    if not storage.USE_BLOB:
        return {"mode": "server"}

    filename, extension, _ = _check_upload_target(folder, body.filename)

    if body.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File is too large. Maximum size is 100 MB.",
        )

    pathname = f"{folder}/{filename}"
    content_type = CONTENT_TYPES[extension]

    return {
        "mode": "direct",
        "pathname": pathname,
        "contentType": content_type,
        "token": storage.create_client_token(
            pathname=pathname,
            allowed_content_types=[content_type],
            maximum_size_in_bytes=MAX_FILE_SIZE,
        ),
    }


# =====================================================
# ADMIN ONLY — UPLOAD MEDIA (through the API)
# =====================================================

@router.post("/upload/{folder}")
async def upload_file(
    folder: str,
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin),
):
    filename, extension, media_type = _check_upload_target(
        folder, file.filename or ""
    )

    buffer = io.BytesIO()
    total_size = 0

    while True:
        chunk = await file.read(1024 * 1024)

        if not chunk:
            break

        total_size += len(chunk)

        if total_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File is too large. Maximum size is 100 MB.",
            )

        buffer.write(chunk)

    data = buffer.getvalue()

    if media_type == "image":
        valid = validate_image(data)
    else:
        valid = validate_video(data, extension)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is invalid or corrupted.",
        )

    try:
        path = storage.save_file(
            folder, filename, data, CONTENT_TYPES[extension]
        )
    except storage.StorageError as error:
        raise HTTPException(status_code=502, detail=str(error))

    return {
        "filename": filename,
        "path": path,
    }
