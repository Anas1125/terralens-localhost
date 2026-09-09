from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..security import (
    verify_password,
    create_access_token,
    get_current_admin,
    get_current_manager,
    pwd_context,
)

import time
from collections import defaultdict

router = APIRouter()

# =====================================================
# LOGIN RATE LIMITING
# =====================================================

LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_ATTEMPTS = 5

_login_attempts = defaultdict(list)


def check_login_rate_limit(ip_address: str):
    now = time.time()
    window_start = now - LOGIN_WINDOW_SECONDS

    # Remove old attempts
    _login_attempts[ip_address] = [
        timestamp
        for timestamp in _login_attempts[ip_address]
        if timestamp > window_start
    ]

    if len(_login_attempts[ip_address]) >= LOGIN_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later.",
        )


def record_login_failure(ip_address: str):
    _login_attempts[ip_address].append(time.time())


def clear_login_attempts(ip_address: str):
    _login_attempts.pop(ip_address, None)


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin),
):
    total_jobs = db.query(models.Job).count()
    total_contacts = db.query(models.Contact).count()
    total_applications = db.query(models.Application).count()

    active_jobs = (
        db.query(models.Job)
        .filter(models.Job.is_active == True)
        .count()
    )

    return {
        "jobs": total_jobs,
        "contacts": total_contacts,
        "applications": total_applications,
        "active_jobs": active_jobs,
    }


@router.post("/login", response_model=schemas.Token)
def login(
    request: Request,
    admin: schemas.AdminLogin,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"

    check_login_rate_limit(client_ip)

    user = (
        db.query(models.Admin)
        .filter(models.Admin.username == admin.username)
        .first()
    )

    if not user or not user.is_active:
        record_login_failure(client_ip)

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not verify_password(
        admin.password,
        user.password,
    ):
        record_login_failure(client_ip)

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    # Successful login clears failed attempts
    clear_login_attempts(client_ip)

    token = create_access_token(
        {
            "sub": user.username,
            "role": user.role,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.get("/users", response_model=list[schemas.AdminResponse])
def get_admins(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_manager),
):
    return (
        db.query(models.Admin)
        .limit(100)
        .all()
    )

@router.post(
    "/users",
    response_model=schemas.AdminResponse,
)
def create_admin(
    admin: schemas.AdminCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_manager),
):
    existing = (
        db.query(models.Admin)
        .filter(models.Admin.username == admin.username)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
        )

    new_admin = models.Admin(
        username=admin.username,
        password=pwd_context.hash(admin.password),
        role=admin.role,
        is_active=True,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin

@router.put(
    "/users/{admin_id}",
    response_model=schemas.AdminResponse,
)
def update_admin(
    admin_id: int,
    admin_data: schemas.AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_manager),
):
    admin = (
        db.query(models.Admin)
        .filter(models.Admin.id == admin_id)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    if admin_data.username is not None:
        existing = (
            db.query(models.Admin)
            .filter(
                models.Admin.username == admin_data.username,
                models.Admin.id != admin_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Username already exists",
            )

        admin.username = admin_data.username

    if admin_data.password is not None:
        admin.password = pwd_context.hash(
            admin_data.password
        )

    if admin_data.role is not None:
        if admin_data.role not in ["manager", "employee"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid role",
            )

        if (
            admin.role == "manager"
            and admin_data.role == "employee"
            and admin.is_active
        ):
            active_managers = (
                db.query(models.Admin)
                .filter(
                    models.Admin.role == "manager",
                    models.Admin.is_active == True,
                )
                .count()
            )

            if active_managers <= 1:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot change the last active manager to employee",
                )

        admin.role = admin_data.role

    if admin_data.is_active is not None:
        if (
            not admin_data.is_active
            and admin.is_active
            and admin.role == "manager"
        ):
            active_managers = (
                db.query(models.Admin)
                .filter(
                    models.Admin.role == "manager",
                    models.Admin.is_active == True,
                )
                .count()
            )

            if active_managers <= 1:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot disable the last active manager",
                )

        admin.is_active = admin_data.is_active

    db.commit()
    db.refresh(admin)

    return admin

@router.delete("/users/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_manager),
):
    admin = (
        db.query(models.Admin)
        .filter(models.Admin.id == admin_id)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    if admin.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    if admin.role == "manager":
        active_managers = (
            db.query(models.Admin)
            .filter(
                models.Admin.role == "manager",
                models.Admin.is_active == True,
            )
            .count()
        )

        if active_managers <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete the last active manager",
            )

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted successfully"
    }

@router.patch("/users/{admin_id}/status")
def update_admin_status(
    admin_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_manager),
):
    admin = (
        db.query(models.Admin)
        .filter(models.Admin.id == admin_id)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    if admin.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot change your own account status",
        )

    if not is_active and admin.role == "manager":
        active_managers = (
            db.query(models.Admin)
            .filter(
                models.Admin.role == "manager",
                models.Admin.is_active == True,
            )
            .count()
        )

        if active_managers <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot disable the last active manager",
            )

    admin.is_active = is_active

    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin status updated successfully",
        "is_active": admin.is_active,
    }