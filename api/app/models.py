"""The ShelfSwap data model.

Four tables: users sell books as listings, and buyers message sellers about a
listing. The `message` table exists here but nothing in the API writes to it yet:
wiring it up is one of the workshop jobs (see JOBS.md).
"""
from datetime import datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel


def _id() -> str:
    return uuid4().hex


class User(SQLModel, table=True):
    id: str = Field(default_factory=_id, primary_key=True)
    name: str
    uni_email: str
    rating: float = 4.5  # 0-5, shown on each listing


class Book(SQLModel, table=True):
    id: str = Field(default_factory=_id, primary_key=True)
    title: str
    edition: str
    unit_code: str  # e.g. "CITS3403". Listings already carry this; the browse
    # page just has no way to filter by it yet (a workshop job).


class Listing(SQLModel, table=True):
    id: str = Field(default_factory=_id, primary_key=True)
    book_id: str = Field(foreign_key="book.id")
    seller_id: str = Field(foreign_key="user.id")
    price_cents: int  # stored as integer cents, formatted to dollars in the UI
    condition: str  # one of: new, like_new, good, fair, poor
    status: str = "available"  # available | sold (nothing flips this to sold yet)


class Message(SQLModel, table=True):
    id: str = Field(default_factory=_id, primary_key=True)
    listing_id: str = Field(foreign_key="listing.id")
    sender_id: str = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
