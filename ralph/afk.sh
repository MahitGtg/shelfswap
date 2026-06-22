#!/bin/bash
# ralph/afk.sh — AFK: loop N iterations unattended inside a Docker sandbox.
#
# Each iteration gathers every `ready-for-agent` issue under .scratch/*/issues/
# (any feature, no path hardcoded), the last 5 commits, and ralph/prompt.md,
# runs a fresh headless Claude in the sandbox, streams its output live, and
# stops early when the agent reports <promise>NO MORE TASKS</promise>.
#
# State between iterations lives in the repo, not the agent: commit messages
# carry the handoff notes, and the Status: line on each issue file tracks what
# is done. Every iteration starts from a cold context.
#
# Usage: ralph/afk.sh <iterations>
set -eo pipefail
cd "$(git rev-parse --show-toplevel)"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# jq filters for the --output-format stream-json events
stream_text='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty'
final_result='select(.type == "result").result // empty'

for ((i=1; i<=$1; i++)); do
  echo "=== Ralph iteration $i/$1 ==="
  tmpfile=$(mktemp)
  trap 'rm -f "$tmpfile"' EXIT

  issues=$(grep -rl "Status: ready-for-agent" .scratch 2>/dev/null | xargs cat 2>/dev/null || echo "No ready issues found")
  commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")
  prompt=$(cat ralph/prompt.md)

  # `.` mounts the repo into the sandbox (writable) so the agent can edit and
  # commit. The sandbox is the safety boundary — if the agent stalls waiting on
  # a permission prompt, add `--dangerously-skip-permissions` after `--`; that
  # flag is only safe precisely because this runs sandboxed.
  docker sandbox run claude . -- \
    --verbose \
    --print \
    --output-format stream-json \
    "Previous commits: $commits

Issues: $issues

$prompt" \
  | grep --line-buffered '^{' \
  | tee "$tmpfile" \
  | jq --unbuffered -rj "$stream_text"

  result=$(jq -r "$final_result" "$tmpfile")
  if [[ "$result" == *"<promise>NO MORE TASKS</promise>"* ]]; then
    echo
    echo "Ralph complete after $i iterations."
    exit 0
  fi
done

echo "Reached iteration cap ($1)."
