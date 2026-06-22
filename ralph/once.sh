#!/bin/bash
# ralph/once.sh — HITL: run ONE Ralph iteration locally so you can watch it.
#
# Reads every `ready-for-agent` issue under .scratch/*/issues/ (any feature, no
# path hardcoded), the last 5 commits, and ralph/prompt.md, then hands them to
# Claude with edits auto-accepted. Use this to rehearse the prompt on one task
# before trusting the AFK loop.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

issues=$(grep -rl "Status: ready-for-agent" .scratch 2>/dev/null | xargs cat 2>/dev/null || echo "No ready issues found")
commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")
prompt=$(cat ralph/prompt.md)

claude --permission-mode acceptEdits \
  "Previous commits: $commits

Issues: $issues

$prompt"
