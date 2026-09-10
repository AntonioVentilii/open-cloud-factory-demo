# Open Cloud Factory — demo runbook

| | |
|---|---|
| Board (human window) | https://claude.ai/code/artifact/9141b3dd-91a1-4208-b385-7414acc9df40 |
| Repo ("open-cloud" on the board) | https://github.com/AntonioVentilii/open-cloud-factory-demo (public) |
| Skill (the agent door) | `.factory/skill/open-cloud-factory/` in that repo |
| Proof run | `oc-mfe0v1a0` "GET /version": inbox → merged in 16 min, PR #1, 3 learnings on the board |

Three people, three machines, one store. Antonio joins remotely and hosts the
orchestrator. Nobody needs GitHub permissions: the orchestrator opens, reviews
and merges PRs with Antonio's login; the repo is public so everyone can open
the PR links.

## The one thing to test BEFORE the call (Antonio, 5 min)

The board's store is tied to the **artifact owner's claude.ai account**, and
Antonio's is a personal account, not the org. Whether Dom (on his own account)
can open it is unknown until tried:

1. Board → share menu → add Dom's email with *can view*. Send him the link.
2. Dom opens it. Two outcomes:
   - **He sees the columns** → Plan A below: Dom clicks and files from his own
     machine.
   - **"Sign in to view this page" / blank** → Plan B: Antonio screen-shares
     the board; Dom *says* the TODOs and Antonio's sessions type them; Antonio
     clicks the gates on Dom's word. Same story, one keyboard. Do not spend
     demo time fighting accounts.

Plan B is fully rehearsed (the proof run was exactly that). Plan A adds one
untested step: a non-owner's Claude session writing to the store. If Dom's
session says it cannot write, fall back to Plan B for filing only — he can
still click Approve on the board.

## Antonio — setup (before the call, ~10 min)

1. Do the share test above.
2. Board: leave `oc-mfe0v1a0` in Done and the three Learnings — they are the
   proof. Drop anything else.
3. Claude Code (desktop app), new session titled `Open Cloud — Orchestrator`:
   ```
   /open-cloud-factory orchestrate
   ```
   Within a minute the Connections panel shows `orchestrator` online. Leave
   it alone; it loops while the laptop is awake. Say in the demo: "today the
   orchestrator is a session on my laptop; in production it is a service."
4. Second session titled `Open Cloud — Antonio` — your own entry door, for
   filing TODOs in parallel with Dom (and for Plan B typing).
5. Optional third, `Open Cloud — Inbox`: `/open-cloud-factory inbox` — the
   operator console listing what waits on a human.
6. Screen-share the **board tab**. Cards moving is the demo; sessions are
   backstage.

## Dom and the other dev — setup (5 min, own machine) — Plan A only

1. Open the board link Antonio shared, signed in to the claude.ai account he
   shared it with.
2. Install the skill so *your* Claude becomes a factory agent:
   ```bash
   git clone https://github.com/AntonioVentilii/open-cloud-factory-demo.git ~/open-cloud-factory-demo
   ```
   ```bash
   ln -s ~/open-cloud-factory-demo/.factory/skill/open-cloud-factory ~/.claude/skills/open-cloud-factory
   ```
3. Claude Code session titled `Open Cloud — <name>`:
   ```
   /open-cloud-factory what's in the factory?
   ```
   If it lists the board's tasks, you are connected. If it says it cannot
   reach the store → Plan B for filing.
4. No `gh` login needed.

## The script (~15 min)

**Antonio, on the board:** "The factory is a shared store. This board is the
human window. Any Claude session becomes an agent by loading one skill — Dom,
ask your Claude to create a TODO. Anything you like."

**Dom files whatever he wants.** The pipeline is built for that:

| Dom's TODO is… | What happens |
|---|---|
| a small code change (endpoint, validation, rename) | full run, gate `none`, merged without a human — ~6–10 min |
| a visual change ("logo more tech-focused", "menu from side to bottom") | the console at `public/index.html` + `styles.css` exists for this; gate returns `review` ("user-visible UI change") → **Human verify** column; Dom approves |
| touches `src/auth.js` (e.g. "constant-time api-key compare") | gate `review` ("touches auth") → Human verify |
| vague or needs a decision ("make it faster", "add billing") | spec agent returns **blocked** with one sharp question → red stripe on the card; Dom clicks, answers, it resumes. Say: "the factory asks instead of guessing" |
| out of this repo's world ("deploy a subnet") | spec agent blocks with "this repo has no X — should it?" — same as above, and it *is* the honest answer |
| a duplicate of something already filed | the skill finds the existing card and says so instead of filing |

**Antonio files in parallel** from his own session (e.g. "move the menu to
the bottom") while Dom's is in flight → two cards, one queue, one orchestrator,
no collisions. Point at Connections: two sessions online.

**Watch the first card move** (≤ 2 min): Inbox → Speccing (pulse + agent name)
→ **Spec approval** (amber). Dom clicks the card: the spec has Goal / Change /
Verify / Risk, and the trail.

"First human gate. The spec is the only thing the builder will ever see — no
conversation leaks." **Dom clicks Approve spec.**

→ Planning → Building (real branch, real PR — open the link) → Reviewing (real
review on the PR) → Gate → Merge · deploy (CI ran, squash merged) → Done.

**Close on Learnings** (bottom right): the proof run already produced three —
one applied, two proposed. "Agents propose, humans merge. That is the meta
loop, and it already caught two things on the very first task."

## If something stalls

- Card pulsing > 5 min: the stage subagent is still working (builds take
  3–4 min). Antonio checks the orchestrator session. If it died: in that
  session, "re-run the current stage for <id>".
- Red stripe: an agent is blocked with a question. Click, answer, it resumes.
- Header "store unavailable": reload the board.
- Orchestrator session gone (laptop slept): restart with the same command; it
  resumes from the store — nothing is lost, the store is the state.
- Reviewer posts a comment instead of an approval: expected (same GitHub
  account can't self-approve). Fixed by a factory GitHub App later.

## What is real vs. thin (say it if asked)

Real: shared store, live board, skill-based agent connection, fresh-context
subagent per stage, PRs/reviews/merges on GitHub, CI, human gates on the
board, dedup at entry, retro proposals with evidence.
Thin: one repo; orchestrator is a session on a laptop (production: a service
with its own GitHub App and API key, store with an API such as GitHub Issues);
no staging deploy; stage prompts are first drafts — the retro loop is how
they stop being drafts.
