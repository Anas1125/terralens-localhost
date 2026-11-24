from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Request,
    Response,
)
from ..rate_limit import check_rate_limit, client_ip_from
from sqlalchemy.orm import Session
from pathlib import Path
import io

from PIL import Image

from ..database import get_db
from .. import models, schemas
from ..security import get_current_admin

router = APIRouter()

from .. import storage


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
}

MAX_RESUME_SIZE = 4 * 1024 * 1024  # Leave room for multipart overhead on Vercel

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
    client_ip = client_ip_from(request)

    check_rate_limit(
        key=f"application:{client_ip}",
        max_attempts=3,
        window_seconds=30 * 60,
    )
    # Check that the job exists
    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id, models.Job.is_active == True)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    resume_path = None
    resume_data = None
    resume_extension = None

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

        # =====================================================
        # READ INTO MEMORY WITH SIZE LIMIT
        # =====================================================

        buffer = io.BytesIO()
        total_size = 0

        try:
            while True:
                chunk = await resume.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_RESUME_SIZE:
                    raise HTTPException(
                        status_code=400,
                        detail="Resume file must be 4 MB or smaller.",
                    )

                buffer.write(chunk)
        finally:
            await resume.close()

        data = buffer.getvalue()

        # =================================================
        # VALIDATE ACTUAL FILE CONTENT
        # =================================================

        if extension == ".pdf":
            if data[:5] != b"%PDF-":
                raise HTTPException(
                    status_code=400,
                    detail="Invalid or corrupted PDF file.",
                )

        else:
            try:
                with Image.open(io.BytesIO(data)) as image:
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
        # STORE VALIDATED FILE
        # =================================================

        # New resumes never enter the public media store.
        resume_data = data
        resume_extension = extension

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
    db.flush()
    if resume_data is not None:
        new_application.resume = f"/applications/{new_application.id}/resume"
        db.add(models.PrivateResume(application_id=new_application.id,
                                    extension=resume_extension, data=resume_data))
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


# Resume downloads require authentication; never render applicant PDFs inline.
@router.get("/{application_id}/resume")
def download_resume(application_id: int, db: Session = Depends(get_db),
                    admin: models.Admin = Depends(get_current_admin)):
    application = db.get(models.Application, application_id)
    if not application or not application.resume:
        raise HTTPException(404, "Resume not found")
    stored = db.get(models.PrivateResume, application_id)
    if stored:
        data, extension = bytes(stored.data), stored.extension
    elif application.resume.startswith("/uploads/applications/"):
        root = (storage.UPLOADS_DIR / "applications").resolve()
        file = (root / Path(application.resume).name).resolve()
        if file.parent != root or not file.is_file():
            raise HTTPException(404, "Resume not found")
        extension = file.suffix.lower()
        if file.stat().st_size > MAX_RESUME_SIZE:
            raise HTTPException(413, "Legacy resume exceeds download limit")
        data = file.read_bytes()
    else:
        raise HTTPException(404, "Legacy resume requires migration")
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(404, "Resume not found")
    return Response(data, media_type="application/octet-stream", headers={
        "Content-Disposition": f'attachment; filename="resume-{application_id}{extension}"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
    })


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

    private_resume = db.get(models.PrivateResume, application_id)
    if private_resume:
        db.delete(private_resume)
    elif application.resume:
        try:
            storage.delete_stored_path(application.resume)
        except storage.StorageError:
            pass

    # =====================================================
    # DELETE DATABASE RECORD
    # =====================================================

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted successfully"
    }