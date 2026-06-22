# The jobs

ShelfSwap v1 works, but it is thin. Below is what is missing, in plain English. There
are no implementation hints on purpose: working out *how* is your grilling session. Pick
one job, grill it into a sharp plan, turn it into issues, then build it.

### 1. Add authentication

Right now there is no real login. You just pick who you are from a dropdown in the header,
and the whole app trusts that. There is no sign-up, no password, no sessions, and nothing
stops you from acting as someone else. Real accounts need to exist.

### 2. Mark as sold

A seller has no way to say a book is gone. Once something sells it should not keep showing
up for buyers as if it is still available, and the seller should be the only one who can
mark their own listing sold.

### 3. Message the seller

There is no way to contact a seller about a listing. You can see their name, but you cannot
reach them. A buyer should be able to send a message about a specific listing, and the
seller should be able to read it.

### 4. Filter by unit code

Every listing already shows a unit code, but you cannot use it. Finding the textbook for one
unit means scrolling the whole page. Buyers should be able to narrow listings down to a unit.

### 5. Deploy to Vercel and Railway

The app only runs on a laptop. There is no live URL anyone else can open. The frontend and
backend need to be hosted so a real person could use ShelfSwap from their phone.
