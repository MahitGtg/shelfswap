#!/usr/bin/env bash
# scripts/ralph.sh — drain the local .scratch tracker, one fresh /tdd subagent
# per ready issue. No GitHub: issues are markdown files labelled ready-for-agent.
# Issue front-matter uses "Status:" (see docs/agents/issue-tracker.md).
#
# This is a teaching boilerplate. Off-the-shelf "ralph" skills do the same thing
# for you. Run it from the repo root once you have issues under .scratch/.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
name="$(basename "$root")"

while true; do
  # ready issues = .scratch files whose front-matter Status is ready-for-agent
  ready=$(grep -rl "Status: ready-for-agent" "$root/.scratch" 2>/dev/null || true)
  [ -z "$ready" ] && { echo "Tracker drained, nothing ready."; break; }

  # fan out: one worktree + one subagent per ready issue, all in parallel
  pids=()
  for issue in $ready; do
    slug="$(basename "$issue" .md)"
    tree="$root/../$name-$slug"
    git worktree add "$tree" -b "$slug" >/dev/null

    (
      cd "$tree"
      # a fresh subagent, scoped to one issue file. the file says which files
      # to touch and what "done" means, so a clean context is enough.
      claude -p "/tdd Implement the issue in .scratch/$slug.md in this worktree.
                 Write the failing test first, make it pass, verify, then commit.
                 Do not edit the test."
    ) &
    pids+=($!)
  done

  # wait for this pass before re-reading the tracker
  for pid in "${pids[@]}"; do wait "$pid"; done

  # mark merged issues done, then loop: their dependents become ready next pass.
  echo "Pass complete. Mark merged issues done, re-run to pick up unblocked work."
done
