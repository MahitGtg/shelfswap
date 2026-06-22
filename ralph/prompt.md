# ISSUES

Open issue files are passed in at the start of context: every file under
`.scratch/*/issues/` whose front-matter line reads `Status: ready-for-agent`.
Parse them to understand the open work. Each feature has its own
`.scratch/<feature>/issues/` directory — you are NOT scoped to a single feature.

Work ONLY on `ready-for-agent` issues (these are the AFK issues). Leave
`ready-for-human`, `needs-info`, and `needs-triage` issues alone — those need a
human.

You have also been passed the last few git commits. Their messages record the
decisions, files changed, and blockers from previous iterations — read them to
understand what has already been done and what to pick up next.

If there are no `ready-for-agent` issues left, output `<promise>NO MORE TASKS</promise>`.

# TASK SELECTION

Pick ONE issue to work on this iteration. Prioritize in this order:

1. **Critical bugfixes**
2. **Development infrastructure** — a test runner, type-checking, dev scripts.
   This repo has little of this yet; establishing it is high priority because
   every later feature depends on it.
3. **Tracer bullets for new features** — a tiny end-to-end slice through every
   layer (model, API, UI, test), demoable on its own, before expanding out.
4. **Polish and quick wins**
5. **Refactors**

# EXPLORATION

Explore the repo to understand the current state before changing anything.

# IMPLEMENTATION

Use `/tdd` to complete the task. Write the failing test first, make it pass,
then verify. Do not edit the test to make it pass.

# FEEDBACK LOOPS

Before committing, run the feedback loops for the layer(s) you changed and make
sure they pass. **Do not commit with a red loop.**

- **api** (FastAPI + SQLModel, in `api/`): run the Python tests with
  `python -m pytest` from `api/`. If no test setup exists yet, setting up pytest
  is itself a Development Infrastructure task (priority 2) — do that first.
- **web** (Vite + TypeScript, in `web/`): type-check with `npx tsc --noEmit` and
  build with `npm run build`, both from `web/`.

If a feedback loop you need does not exist yet, **creating it is the task.**

# COMMIT

Make ONE git commit for this iteration. The commit message MUST include:

1. Key decisions made
2. Files changed
3. Blockers or notes for the next iteration

The next iteration starts with a fresh context and only sees your commit
messages plus the issue files — this message is your handoff note.

# THE ISSUE

When you finish working an issue this iteration:

- If the task is **complete**, change the issue file's `Status:` line to
  `Status: done`.
- If the task is **not complete**, leave `Status: ready-for-agent` and append a
  note under a `## Comments` heading describing what was done and what remains.

Updating `Status:` is what stops the next iteration from re-picking finished
work, so always do it.
