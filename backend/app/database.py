import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATA_DIR = os.getenv("DATA_DIR")

# Hosted Postgres (Neon via Vercel) exposes DATABASE_URL / POSTGRES_URL.
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL")
    or (
        f"sqlite:///{os.path.join(DATA_DIR, 'terralens.db')}"
        if DATA_DIR
        else "sqlite:///./terralens.db"
    )
)

# SQLAlchemy only accepts the "postgresql://" scheme.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]

IS_POSTGRES = DATABASE_URL.startswith("postgresql")


if IS_POSTGRES:
    # Serverless functions are short-lived: keep the pool tiny and check
    # connections before use (Neon closes idle ones).
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=4,
        pool_recycle=300,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )


if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragmas(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()

        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA busy_timeout=5000;")

        cursor.close()


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()