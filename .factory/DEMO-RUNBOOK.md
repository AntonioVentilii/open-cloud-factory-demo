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

## How Dom takes part without touching the board (the GitHub door)

The board's live store is tied to Antonio's claude.ai account and cannot be
opened from other accounts. That does not matter: **Dom files and approves
through GitHub**, which he already has.

- **File:** Dom tells his Claude "create a TODO in the open-cloud factory:
  …" → his session opens an issue on the public repo (anyone can). No
  collaborator rights, no Claude org, no skill strictly required — `gh`
  logged in is enough (the skill adds dedup and the right format).
- **Follow:** the orchestrator comments on the issue at every stage
  ("picked up as oc-…", "spec ready", "PR #4 opened", "merged"). Dom watches
  the issue thread in his own browser; Antonio screen-shares the board.
- **Approve:** when the issue says so, Dom replies `/approve` (or
  `/changes <note>`) on the issue. Commenting on a public repo needs no
  permission. Antonio can also click the board; first one wins.
- **Close:** the PR carries `Closes #n`; the issue closes on merge.

Rehearsed on issue #2 (the "menu to the bottom" visual change, which also
trips the gate and is approved with `/approve` on the issue).

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

## Dom and the other dev — setup (3 min, own machine)

They never open the board (it only works on Antonio's account). They use
GitHub.

1. `gh auth status` must be green on their machine (any GitHub account).
2. Optional but nicer — install the skill so their Claude knows the factory's
   format and dedups:
   ```bash
   git clone https://github.com/AntonioVentilii/open-cloud-factory-demo.git ~/open-cloud-factory-demo
   ```
   ```bash
   ln -s ~/open-cloud-factory-demo/.factory/skill/open-cloud-factory ~/.claude/skills/open-cloud-factory
   ```
   Without the skill, "open an issue on AntonioVentilii/open-cloud-factory-demo
   titled …" works just as well.
3. Claude Code session titled `Open Cloud — <name>`. To file:
   ```
   /open-cloud-factory create a TODO for open-cloud: <what should have happened>
   ```
   They get the issue URL back. They follow and approve **on the issue**.

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

## After the demo — cleanup

Everything the demo put on a machine comes off with one script (in the repo
at `.factory/cleanup.sh`; safe to re-run):

```bash
bash ~/open-cloud-factory-demo/.factory/cleanup.sh
```
Removes: the skill (`~/.claude/skills/open-cloud-factory`), worker checkouts
(`~/.factory`), the local clone (`~/open-cloud-factory-demo`), temp spec
clones. Then close the `Open Cloud — *` sessions in Claude Code by hand.

Antonio only, on top of the above:
```bash
bash .factory/cleanup.sh --remote
```
closes the demo issues and PRs and deletes `factory/*` branches;
`--all` also deletes the repo (asks for the name first). Delete the board
from https://claude.ai/code/artifacts — that erases its store too.

`gh repo delete` needs the `delete_repo` scope: `gh auth refresh -s delete_repo`
once, if it complains.

## What is real vs. thin (say it if asked)

Real: shared store, live board, skill-based agent connection, fresh-context
subagent per stage, PRs/reviews/merges on GitHub, CI, human gates on the
board, dedup at entry, retro proposals with evidence.
Thin: one repo; orchestrator is a session on a laptop (production: a service
with its own GitHub App and API key, store with an API such as GitHub Issues);
no staging deploy; stage prompts are first drafts — the retro loop is how
they stop being drafts.
