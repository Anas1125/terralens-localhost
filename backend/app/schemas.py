from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    subject: str | None = Field(default=None, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactResponse(ContactCreate):
    id: int

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    department: str
    location: str
    employment_type: str
    description: str
    requirements: str


class JobResponse(JobCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=200)


class Token(BaseModel):
    access_token: str
    token_type: str


class AdminCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, max_length=200)
    role: str = Field(default="employee", pattern="^(manager|employee)$")


class AdminUpdate(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=200,
    )

    role: str | None = Field(
        default=None,
        pattern="^(manager|employee)$",
    )

    is_active: bool | None = None


class AdminResponse(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class SiteSettingsBase(BaseModel):
    company_name: str | None = None
    tagline: str | None = None

    logo: str | None = None
    favicon: str | None = None

    email: str | None = None
    phone: str | None = None
    whatsapp: str | None = None

    address: str | None = None
    google_maps: str | None = None

    hero_title: str | None = None
    hero_subtitle: str | None = None

    hero_button_text: str | None = None
    hero_button_link: str | None = None

    # =====================================================
    # ABOUT
    # =====================================================

    about_label: str | None = None
    about_title: str | None = None
    about_description: str | None = None

    about_expertise_label: str | None = None
    about_expertise_title: str | None = None
    about_expertise_description: str | None = None

    about_projects_count: str | None = None
    about_projects_label: str | None = None

    about_clients_count: str | None = None
    about_clients_label: str | None = None

    footer_text: str | None = None

    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None

    hero_video: str | None = None
    statement_image: str | None = None

    about_video: str | None = None
    about_videos: list[str] | None = None
    
    services_video: str | None = None

    products_video: str | None = None

    showcase_video: str | None = None
    showcase_label: str | None = None
    showcase_title: str | None = None
    showcase_subtitle: str | None = None
    showcase_button_text: str | None = None

    careers_video: str | None = None
    contact_video: str | None = None

    contact_label: str | None = None
    contact_title: str | None = None
    contact_subtitle: str | None = None
    contact_button_text: str | None = None
    business_hours: str | None = None


class SiteSettingsUpdate(SiteSettingsBase):
    pass


class SiteSettingsResponse(SiteSettingsBase):
    id: int

    class Config:
        from_attributes = True

class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    slug: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)

    description: str | None = Field(
        default=None,
        max_length=10000,
    )

    features: list[str] | None = Field(
        default=None,
        max_length=30,
    )

    image: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool = True


class ServiceResponse(ServiceCreate):
    id: int

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    subtitle: str | None = Field(default=None, max_length=300)

    client: str | None = Field(default=None, max_length=150)
    location: str | None = Field(default=None, max_length=150)
    year: str | None = Field(default=None, max_length=20)
    duration: str | None = Field(default=None, max_length=100)
    team: str | None = Field(default=None, max_length=200)

    description: str | None = Field(default=None, max_length=10000)
    challenge: str | None = Field(default=None, max_length=10000)
    solution: str | None = Field(default=None, max_length=10000)

    results: str | None = Field(default=None, max_length=10000)
    technologies: str | None = Field(default=None, max_length=1000)

    image: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    job_id: int
    full_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    resume: str | None = Field(default=None, max_length=500)
    cover_letter: str | None = Field(
        default=None,
        max_length=10000,
    )


class ApplicationResponse(ApplicationCreate):
    id: int
    job_title: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class PartnerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    logo: str | None = Field(default=None, max_length=500)
    type: str = Field(..., min_length=1, max_length=100)
    is_active: bool = True


class PartnerResponse(PartnerCreate):
    id: int

    class Config:
        from_attributes = True

class BlogCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    date: str = Field(..., min_length=1, max_length=30)
    author: str = Field(..., min_length=1, max_length=150)
    read_time: str = Field(..., min_length=1, max_length=50)

    title: str = Field(..., min_length=1, max_length=200)
    excerpt: str | None = Field(default=None, max_length=1000)
    content: str | None = Field(default=None, max_length=30000)

    image: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class BlogResponse(BlogCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GalleryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    image: str = Field(..., min_length=1, max_length=500)
    is_active: bool = True

class GalleryResponse(GalleryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True