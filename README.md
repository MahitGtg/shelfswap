# ShelfSwap

A marketplace for students to buy and sell secondhand textbooks within their own
university. This is the half-built v1 used in the Venture UWA software engineering
workshop: it browses, shows, and creates listings, and that is about it. The rest is left
for you to build. See **[JOBS.md](JOBS.md)** for what is missing.

- **Frontend:** React + Vite + TypeScript + Tailwind (in `web/`)
- **Backend:** FastAPI + SQLite (in `api/`)

## What works today

- Browse all listings, with formatted prices, condition badges, unit codes, and seller ratings
- View a single listing
- Create a listing
- A user switcher in the header that stands in for real login (pick who you are)

## What does not (the workshop jobs)

Authentication, marking a listing sold, messaging a seller, filtering by unit code, and
deployment. Plain-English descriptions are in [JOBS.md](JOBS.md).

---

## Prerequisites

- **Python 3.11+** (`python3 --version`)
- **Node 18+** (`node --version`)

You will run two things at once: the backend on port 8000 and the frontend on port 5173.
Use two terminal windows.

## Run the backend (terminal 1)

### macOS / Linux

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed                 # create + fill the database
uvicorn app.main:app --reload      # http://127.0.0.1:8000
```

### Windows (PowerShell)

```powershell
cd api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed                 # create + fill the database
uvicorn app.main:app --reload      # http://127.0.0.1:8000
```

If PowerShell blocks the activate script, run
`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` once in that window, then
activate again.

Check it: open <http://127.0.0.1:8000/api/listings>, you should see JSON. Interactive API
docs are at <http://127.0.0.1:8000/docs>.

## Run the frontend (terminal 2)

The steps are the same on every OS:

```bash
cd web
npm install
npm run dev                        # http://127.0.0.1:5173
```

Open <http://127.0.0.1:5173>. The browse page should fill with seeded textbooks.

## How "who am I" works

There is no login yet. The dropdown in the top-right is a stand-in: whoever is selected
is treated as the current user, so creating a listing attaches it to that person.
Replacing this with real authentication is job 1.

## Resetting the data

Re-run the seed script any time to wipe and refill the database:

```bash
cd api
python -m app.seed
```

## The ralph loop

`scripts/ralph.sh` is a teaching boilerplate that drains a local `.scratch/` issue tracker,
spinning up one TDD subagent per ready issue. You do not need it to do a job by hand, but
it is there if you want to watch the loop fan out. See the workshop site for how it fits in.

## Project layout

```
api/                FastAPI backend
  app/
    main.py         routes
    models.py       User, Book, Listing, Message
    database.py     SQLite engine + session
    seed.py         demo data
web/                React frontend
  src/
    pages/          Browse, ListingDetail, CreateListing
    components/     Header, ListingCard, ConditionBadge
    currentUser.tsx the login stand-in
    api.ts          fetch helper + price formatting
scripts/ralph.sh    the boilerplate TDD loop
JOBS.md             what is left to build
```
