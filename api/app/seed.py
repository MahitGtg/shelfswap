"""Reset the database and fill it with believable demo data.

Run from the api/ folder:  python -m app.seed
"""
from sqlmodel import Session, SQLModel

from .database import ENGINE, init_db
from .models import Book, Listing, Message, User


def seed() -> None:
    # start clean every time so the demo is reproducible
    SQLModel.metadata.drop_all(ENGINE)
    init_db()

    with Session(ENGINE) as s:
        jordan = User(name="Jordan Lee", uni_email="jordan@student.uwa.edu.au", rating=4.8)
        mei = User(name="Mei Tan", uni_email="mei@student.uwa.edu.au", rating=4.6)
        sam = User(name="Sam Okafor", uni_email="sam@student.uwa.edu.au", rating=4.2)
        priya = User(name="Priya Nair", uni_email="priya@student.uwa.edu.au", rating=5.0)
        s.add_all([jordan, mei, sam, priya])
        s.commit()
        for u in (jordan, mei, sam, priya):
            s.refresh(u)

        # (book, listing) pairs: title, edition, unit_code, seller, cents, condition
        data = [
            ("Algorithm Design", "1st", "CITS3001", jordan, 5500, "good"),
            ("Computer Networks", "5th", "CITS3002", jordan, 4999, "like_new"),
            ("Operating System Concepts", "10th", "CITS3004", mei, 6200, "good"),
            ("Database System Concepts", "7th", "CITS3403", mei, 7000, "new"),
            ("Introduction to Algorithms", "4th", "CITS2200", sam, 8900, "fair"),
            ("Artificial Intelligence: A Modern Approach", "4th", "CITS3001", sam, 9500, "good"),
            ("Clean Code", "1st", "CITS3200", priya, 3500, "like_new"),
            ("The Pragmatic Programmer", "2nd", "CITS3200", priya, 4200, "good"),
        ]
        listings = []
        for title, edition, unit_code, seller, cents, condition in data:
            book = Book(title=title, edition=edition, unit_code=unit_code)
            s.add(book)
            s.commit()
            s.refresh(book)
            listing = Listing(
                book_id=book.id,
                seller_id=seller.id,
                price_cents=cents,
                condition=condition,
            )
            s.add(listing)
            listings.append(listing)
        s.commit()
        for l in listings:
            s.refresh(l)

        # a couple of message rows so the table is not empty. nothing in the API
        # reads or writes these yet, that is the "message the seller" job.
        s.add_all(
            [
                Message(listing_id=listings[0].id, sender_id=mei.id,
                        content="Hi, is this still available?"),
                Message(listing_id=listings[2].id, sender_id=sam.id,
                        content="Would you take $55?"),
            ]
        )
        s.commit()

    print("Seeded: 4 users, 8 books/listings, 2 messages.")


if __name__ == "__main__":
    seed()
