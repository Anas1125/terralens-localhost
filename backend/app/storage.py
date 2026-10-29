import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = os.getenv("DATA_DIR")

if DATA_DIR:
    STORAGE_DIR = Path(DATA_DIR)
else:
    STORAGE_DIR = BASE_DIR

UPLOADS_DIR = Path(
    os.getenv("UPLOADS_DIR", str(STORAGE_DIR / "uploads"))
)

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)