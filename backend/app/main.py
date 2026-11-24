import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine
from app import models
from app.storage import UPLOADS_DIR, USE_BLOB

from app.routers import (
    contact,
    jobs,
    admin,
    products,
    media,
    settings,
    services,
    projects,
    applications,
    partners,
    gallery,
    blog,
)


models.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="TerraLens API",
    version="1.0.0",
    description="Backend API for TerraLens Innovations",
)


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://terralens-localhost.pages.dev",
]

# Extra origins (comma separated), e.g. a custom domain.
ALLOWED_ORIGINS += [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # Cloudflare Pages preview deployments (<hash>.terralens-localhost.pages.dev)
    allow_origin_regex=r"https://[a-z0-9-]+\.terralens-localhost\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Retry-After", "Content-Disposition"],
)

@app.middleware("http")
async def private_api_cache(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith(("/admin/", "/applications", "/contact")):
        response.headers["Cache-Control"] = "private, no-store"
    return response


class PublicUploads(StaticFiles):
    async def get_response(self, path, scope):
        # StaticFiles normalizes paths; also reject symlinks resolving into resumes.
        target = (UPLOADS_DIR / path).resolve()
        root = UPLOADS_DIR.resolve()
        try:
            parts = target.relative_to(root).parts
        except ValueError:
            raise HTTPException(404)
        if not parts or parts[0].casefold() == "applications":
            raise HTTPException(404)
        return await super().get_response(path, scope)


# Local development only. In production files are served from Vercel Blob.
if not USE_BLOB and UPLOADS_DIR.exists():
    app.mount(
        "/uploads",
        PublicUploads(directory=str(UPLOADS_DIR)),
        name="uploads",
    )


app.include_router(
    contact.router,
    prefix="/contact",
    tags=["Contact"],
)

app.include_router(
    jobs.router,
    prefix="/jobs",
    tags=["Jobs"],
)

app.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"],
)

app.include_router(
    products.router,
    prefix="/products",
    tags=["Products"],
)

app.include_router(
    media.router,
    prefix="/media",
    tags=["Media"],
)

app.include_router(
    settings.router,
    prefix="/settings",
    tags=["Settings"],
)

app.include_router(
    services.router,
    prefix="/services",
    tags=["Services"],
)

app.include_router(
    projects.router,
    prefix="/projects",
    tags=["Projects"],
)

app.include_router(
    applications.router,
    prefix="/applications",
    tags=["Applications"],
)

app.include_router(
    partners.router,
    prefix="/partners",
    tags=["Partners"],
)

app.include_router(
    gallery.router,
    prefix="/gallery",
    tags=["Gallery"],
)

app.include_router(
    blog.router,
    prefix="/blogs",
    tags=["Blogs"],
)


@app.get("/")
def home():
    return {
        "message": "TerraLens Backend Running 🚀"
    }