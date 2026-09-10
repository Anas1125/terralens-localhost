import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATA_DIR = os.getenv("DATA_DIR")

if DATA_DIR:
    DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'terralens.db')}"
else:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./terralens.db",
    )


if DATABASE_URL.startswith("postgresql://"):
    connect_args = {}
else:
    connect_args = {
        "check_same_thread": False,
    }


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
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