from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Request,
)
from ..rate_limit import check_rate_limit
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
import os
import tempfile

from PIL import Image

from ..database import get_db
from .. import models, schemas
from ..security import get_current_admin

router = APIRouter()

from ..storage import UPLOADS_DIR

UPLOAD_DIR = UPLOADS_DIR / "applications"

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
}

MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_IMAGE_FORMATS = {
    ".png": "PNG",
    ".jpg": "JPEG",
    ".jpeg": "JPEG",
}


# =========================================================
# PUBLIC — SUBMIT JOB APPLICATION
# =========================================================

@router.post(
    "/",
    response_model=schemas.ApplicationResponse,
)
async def create_application(
    request: Request,
    job_id: int = Form(...),
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    cover_letter: str = Form(""),
    resume: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"

    check_rate_limit(
        key=f"application:{client_ip}",
        max_attempts=3,
        window_seconds=30 * 60,
    )
    # Check that the job exists
    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    resume_path = None

    # =====================================================
    # HANDLE RESUME UPLOAD
    # =====================================================

    if resume:
        extension = Path(
            resume.filename or ""
        ).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Resume must be PDF, PNG, JPG, or JPEG.",
            )

        UPLOAD_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        # =====================================================
        # SAVE TO TEMPORARY FILE WITH SIZE LIMIT
        # =====================================================

        temp_path = None
        total_size = 0

        try:
            with tempfile.NamedTemporaryFile(
                delete=False,
                dir=UPLOAD_DIR,
                suffix=extension,
            ) as temp_file:
                temp_path = Path(temp_file.name)

                while True:
                    chunk = await resume.read(1024 * 1024)

                    if not chunk:
                        break

                    total_size += len(chunk)

                    if total_size > MAX_RESUME_SIZE:
                        raise HTTPException(
                            status_code=400,
                            detail="Resume file must be 10 MB or smaller.",
                        )

                    temp_file.write(chunk)

            # =================================================
            # VALIDATE ACTUAL FILE CONTENT
            # =================================================

            if extension == ".pdf":
                with temp_path.open("rb") as file:
                    header = file.read(5)

                if header != b"%PDF-":
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid or corrupted PDF file.",
                    )

            else:
                try:
                    with Image.open(temp_path) as image:
                        image.verify()

                        expected_format = ALLOWED_IMAGE_FORMATS[
                            extension
                        ]

                        if image.format != expected_format:
                            raise HTTPException(
                                status_code=400,
                                detail="Invalid image file format.",
                            )

                except HTTPException:
                    raise

                except Exception:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid or corrupted image file.",
                    )

            # =================================================
            # MOVE VALIDATED FILE TO FINAL LOCATION
            # =================================================

            filename = f"{uuid.uuid4().hex}{extension}"
            destination = UPLOAD_DIR / filename

            os.replace(temp_path, destination)
            temp_path = None

            resume_path = (
                f"/uploads/applications/{filename}"
            )

        finally:
            if temp_path and temp_path.exists():
                temp_path.unlink(missing_ok=True)

            await resume.close()

    # =====================================================
    # CREATE APPLICATION
    # =====================================================

    new_application = models.Application(
        job_id=job_id,
        full_name=full_name,
        email=email,
        phone=phone,
        resume=resume_path,
        cover_letter=cover_letter,
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


# =========================================================
# ADMIN ONLY — GET ALL APPLICATIONS
# =========================================================

@router.get(
    "/",
    response_model=list[schemas.ApplicationResponse],
)
def get_applications(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return (
        db.query(models.Application)
        .order_by(
            models.Application.created_at.desc()
        )
        .limit(100)
        .all()
    )


# =========================================================
# ADMIN ONLY — GET SINGLE APPLICATION
# =========================================================

@router.get(
    "/{application_id}",
    response_model=schemas.ApplicationResponse,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    application = (
        db.query(models.Application)
        .filter(
            models.Application.id == application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


# =========================================================
# ADMIN ONLY — DELETE APPLICATION
# =========================================================

@router.delete(
    "/{application_id}"
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    application = (
        db.query(models.Application)
        .filter(
            models.Application.id == application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # =====================================================
    # DELETE UPLOADED RESUME
    # =====================================================

    if application.resume:
        relative_path = application.resume.removeprefix("/uploads/")
        file_path = UPLOADS_DIR / relative_path

        if file_path.exists():
            file_path.unlink()

    # =====================================================
    # DELETE DATABASE RECORD
    # =====================================================

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted successfully"
    }