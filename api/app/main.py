"""ShelfSwap API.

A deliberately half-built FastAPI backend. What works: listing users, browsing
listings, viewing one listing, and creating a listing. What is intentionally
missing (the workshop jobs in JOBS.md): real authentication, marking a listing
sold, messaging a seller, filtering by unit code, and any deployment config.
"""
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select

from .database import get_session, init_db
from .models import Book, Listing, User

app = FastAPI(title="ShelfSwap API")

# the React dev server runs on 5173; allow it (and a deployed frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    init_db()


# ---------- response shapes (book + seller folded into each listing) ----------


class SellerOut(BaseModel):
    id: str
    name: str
    rating: float


class ListingOut(BaseModel):
    id: str
    title: str
    edition: str
    unit_code: str
    price_cents: int
    condition: str
    status: str
    seller: SellerOut


class NewListing(BaseModel):
    title: str
    edition: str
    unit_code: str
    price_cents: int
    condition: str
    seller_id: str


def _to_listing_out(listing: Listing, book: Book, seller: User) -> ListingOut:
    return ListingOut(
        id=listing.id,
        title=book.title,
        edition=book.edition,
        unit_code=book.unit_code,
        price_cents=listing.price_cents,
        condition=listing.condition,
        status=listing.status,
        seller=SellerOut(id=seller.id, name=seller.name, rating=seller.rating),
    )


# ---------- routes ----------


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/users", response_model=list[User])
def list_users(session: Session = Depends(get_session)) -> list[User]:
    """Every account. The frontend's user switcher stands in for real login."""
    return session.exec(select(User)).all()


@app.get("/api/listings", response_model=list[ListingOut])
def list_listings(session: Session = Depends(get_session)) -> list[ListingOut]:
    """Every listing, newest books first. Note: there is no unit_code filter and
    sold listings are not hidden yet, both are jobs."""
    rows = session.exec(
        select(Listing, Book, User)
        .join(Book, Listing.book_id == Book.id)
        .join(User, Listing.seller_id == User.id)
    ).all()
    return [_to_listing_out(listing, book, seller) for listing, book, seller in rows]


@app.get("/api/listings/{listing_id}", response_model=ListingOut)
def get_listing(
    listing_id: str, session: Session = Depends(get_session)
) -> ListingOut:
    listing = session.get(Listing, listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    book = session.get(Book, listing.book_id)
    seller = session.get(User, listing.seller_id)
    return _to_listing_out(listing, book, seller)


@app.post("/api/listings", response_model=ListingOut, status_code=201)
def create_listing(
    body: NewListing, session: Session = Depends(get_session)
) -> ListingOut:
    """Create a book + a listing for it, owned by the given seller."""
    seller = session.get(User, body.seller_id)
    if seller is None:
        raise HTTPException(status_code=404, detail="Seller not found")

    book = Book(title=body.title, edition=body.edition, unit_code=body.unit_code)
    session.add(book)
    session.commit()
    session.refresh(book)

    listing = Listing(
        book_id=book.id,
        seller_id=seller.id,
        price_cents=body.price_cents,
        condition=body.condition,
    )
    session.add(listing)
    session.commit()
    session.refresh(listing)
    return _to_listing_out(listing, book, seller)
