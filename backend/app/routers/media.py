from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)
from pathlib import Path
from PIL import Image
import shutil
import subprocess
import tempfile

from ..security import get_current_admin
from ..storage import UPLOADS_DIR

router = APIRouter()

UPLOAD_DIR = UPLOADS_DIR


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


def validate_image(file_path: Path) -> bool:
    """Validate the actual image contents using Pillow."""

    try:
        with Image.open(file_path) as image:
            image.verify()

            if image.format not in ALLOWED_IMAGE_FORMATS:
                return False

        return True

    except Exception:
        return False


def validate_video(file_path: Path) -> bool:
    """Validate the actual video using ffprobe."""

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
    files = []
    MAX_MEDIA_ITEMS = 1000

    if not UPLOAD_DIR.exists():
        return files

    for folder in UPLOAD_DIR.iterdir():
        if not folder.is_dir():
            continue

        for file in folder.iterdir():
            if not file.is_file():
                continue

            files.append({
                "folder": folder.name,
                "filename": file.name,
                "path": f"/uploads/{folder.name}/{file.name}",
            })

            if len(files) >= MAX_MEDIA_ITEMS:
                return files

    return files


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

    file_path = UPLOAD_DIR / folder / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    file_path.unlink()

    return {
        "message": "Deleted successfully",
    }


# =====================================================
# ADMIN ONLY — UPLOAD MEDIA
# =====================================================

@router.post("/upload/{folder}")
async def upload_file(
    folder: str,
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin),
):
    # -------------------------------------------------
    # Validate folder
    # -------------------------------------------------

    if not is_safe_name(folder):
        raise HTTPException(
            status_code=400,
            detail="Invalid upload folder.",
        )

    # -------------------------------------------------
    # Validate filename
    # -------------------------------------------------

    filename = Path(file.filename or "").name

    if not is_safe_name(filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )

    extension = Path(filename).suffix.lower()

    # -------------------------------------------------
    # Determine media type from allowed extension
    # -------------------------------------------------

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

    # -------------------------------------------------
    # Create upload directory
    # -------------------------------------------------

    folder_path = UPLOAD_DIR / folder

    folder_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    destination = folder_path / filename

    temp_path = None

    try:
        # -------------------------------------------------
        # Save upload to temporary file
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            dir=folder_path,
            suffix=extension,
        ) as temp_file:

            temp_path = Path(temp_file.name)

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

                temp_file.write(chunk)

        # -------------------------------------------------
        # Validate actual file contents
        # -------------------------------------------------

        if media_type == "image":
            valid = validate_image(temp_path)
        else:
            valid = validate_video(temp_path)

        if not valid:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is invalid or corrupted.",
            )

        # -------------------------------------------------
        # Move validated file to final destination
        # -------------------------------------------------

        shutil.move(
            str(temp_path),
            str(destination),
        )

        temp_path = None

    finally:
        # -------------------------------------------------
        # Clean up temporary file if anything failed
        # -------------------------------------------------

        if temp_path and temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass

    return {
        "filename": filename,
        "path": f"/uploads/{folder}/{filename}",
    }