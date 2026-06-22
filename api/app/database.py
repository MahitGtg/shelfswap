"""SQLite engine and session helpers."""
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

# the database is a single file next to this package: api/shelfswap.db
DB_PATH = Path(__file__).resolve().parent.parent / "shelfswap.db"
ENGINE = create_engine(
    f"sqlite:///{DB_PATH}",
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    """Create every table that does not exist yet."""
    SQLModel.metadata.create_all(ENGINE)


def get_session():
    """FastAPI dependency: one session per request."""
    with Session(ENGINE) as session:
        yield session
