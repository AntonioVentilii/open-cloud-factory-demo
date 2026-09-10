#!/usr/bin/env bash
# Undo everything the Open Cloud Factory demo put on a machine.
# Safe to run more than once. Each block is independent; skip what you keep.
#
#   bash .factory/cleanup.sh            # local only (skill, worker checkouts, clone)
#   bash .factory/cleanup.sh --remote   # also close demo issues/PRs and delete branches on GitHub
#   bash .factory/cleanup.sh --all      # --remote plus delete the demo repo itself (asks first)
set -u
REPO="AntonioVentilii/open-cloud-factory-demo"
say() { printf '\033[1m%s\033[0m\n' "$*"; }

# 1. The skill (the agent door) — installed by symlink on Dom's machines,
#    as a real directory on Antonio's.
say "skill"
if [ -L ~/.claude/skills/open-cloud-factory ]; then
  rm ~/.claude/skills/open-cloud-factory && echo "  removed symlink ~/.claude/skills/open-cloud-factory"
elif [ -d ~/.claude/skills/open-cloud-factory ]; then
  rm -rf ~/.claude/skills/open-cloud-factory && echo "  removed ~/.claude/skills/open-cloud-factory"
else
  echo "  not installed"
fi

# 2. Worker checkouts (one clone per task the build agent ran).
say "worker checkouts"
if [ -d ~/.factory ]; then
  rm -rf ~/.factory && echo "  removed ~/.factory (worktrees)"
else
  echo "  none"
fi

# 3. The local clone made for installing the skill (Dom / other dev).
say "local clone"
if [ -d ~/open-cloud-factory-demo ]; then
  rm -rf ~/open-cloud-factory-demo && echo "  removed ~/open-cloud-factory-demo"
else
  echo "  none"
fi

# 4. Spec-agent read-only clones in the temp dir.
say "temp clones"
rm -rf "${TMPDIR:-/tmp}"/factory-spec-* 2>/dev/null && echo "  cleared ${TMPDIR:-/tmp}/factory-spec-*"

# 5. Claude Code sessions are not files: close the "Open Cloud — …" sessions
#    in the app (Orchestrator, Antonio, Inbox, Dom, …) and stop any /loop.
say "sessions"
echo "  close the 'Open Cloud — *' sessions in Claude Code by hand"

# 6. The board artifact and its store live on claude.ai: delete it from
#    https://claude.ai/code/artifacts (owner only). Deleting the artifact
#    erases its database.
say "board"
echo "  delete https://claude.ai/code/artifact/9141b3dd-91a1-4208-b385-7414acc9df40 from the artifacts gallery (owner only)"

# --- remote --------------------------------------------------------------
case "${1:-}" in
  --remote|--all)
    say "github: close demo issues and PRs, delete factory/* branches"
    gh issue list --repo "$REPO" --state open --json number -q '.[].number' | while read -r n; do
      gh issue close "$n" --repo "$REPO" -c "Factory demo over; closing." && echo "  closed issue #$n"
    done
    gh pr list --repo "$REPO" --state open --json number -q '.[].number' | while read -r n; do
      gh pr close "$n" --repo "$REPO" -d -c "Factory demo over; closing." && echo "  closed PR #$n"
    done
    gh api "repos/$REPO/branches" -q '.[].name' | grep '^factory/' | while read -r b; do
      gh api -X DELETE "repos/$REPO/git/refs/heads/$b" && echo "  deleted branch $b"
    done
    ;;
esac
if [ "${1:-}" = "--all" ]; then
  say "github: delete the demo repo"
  echo "  this removes $REPO and everything in it (issues, PRs, history)."
  read -r -p "  type the repo name to confirm: " ans
  if [ "$ans" = "$REPO" ]; then
    gh repo delete "$REPO" --yes && echo "  deleted $REPO"
  else
    echo "  skipped"
  fi
fi
say "done"
