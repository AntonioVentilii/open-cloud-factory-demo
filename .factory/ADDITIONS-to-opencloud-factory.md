# Four additions to `dfinity/opencloud-factory`

Context: Slack #cloud-engines, thread "DevEnv Deploy for OpenCloud Factory",
11 September 2026. The factory is Pietro's stage machine, running on a shared
devenv. These are increments on it, in the order they pay off. Each is one
PR against `opencloud-factory`, and each names the file it lands in.

What it already has and these do NOT re-add: a spec stage (`plan`, with the
one question), design as a human pick, two reviewers, human merge at
`approve`, a lessons file every agent reads first, `factory mine / answer /
reject`, dedup at `factory add`, heartbeat and stale reclaim, the board.

## 1. GitHub issues as the front door (the "from my own laptop" part)

Today work enters through `factory add` or the console session, on the
machine that runs the factory. On a shared devenv that means one keyboard.
An issue on `dfinity/open-cloud` with the label `factory` becomes the entry
anyone can use from anywhere, with the account they already have.

- `cloud-engines/bin/issues-in`: a poll script. `gh issue list --label
  factory --state open`; for each issue with no item carrying `issue: <n>`,
  write the item file (title, body, `issue:`, `owner: <login>`) and `factory
  add` it. Then `gh issue comment`: "Factory: picked up as `<id>`. I will
  comment at every stage." `factory poll` already runs scripts every pass;
  this is one more.
- `cloud-engines/bin/left-inbox`, `left-plan`, `left-review`, `left-pr`,
  `left-green`, `left-approve`: the existing post-advance hook
  (`bin/left-<stage> <id> <next> <file>`), one comment per transition on the
  item's issue: stage, one line, PR link when there is one.
- Human replies on the issue drive the existing commands: a comment
  `/answer <text>` runs `factory answer <id>`, `/reject <text>` runs
  `factory reject <id>`, `/approve` runs `factory advance <id> --yes` where
  the stage is a human checkpoint. `issues-in` reads comments newer than the
  item's last stamp; only comments by the item's `owner:` or by a login in
  `cloud-engines/OWNERS` count. A chat message to anyone is never an
  approval; the issue thread is the record of who decided.
- The `pr` stage adds `Closes #<n>` to the body when the item has `issue:`.

Effort: one day. Outcome: Dom types "create a TODO in the factory" to his
own Claude, an issue appears, and he follows and decides on that issue.

## 2. An owner on every item (the "three of us at once" part)

`factory mine` lists everything waiting on any human. With three people on
one factory, each needs their own list.

- Item frontmatter gains `owner: <github login>` (set by `issues-in` from
  the issue author, by the console from `gh api user`, by `factory add
  --owner`).
- `factory mine [--for <login>]`, default `--for` the current `gh` login.
- `bin/factory-ui`: an owner filter next to the stage filter; amber cards
  show the owner.
- `PLAN.md` line "Every engineer runs their own factory against their own
  checkout" becomes "one factory per project on the devenv; every engineer
  has an owner".

Effort: half a day.

## 3. A plan checkpoint before build (the spec-approval part)

Today the first human checkpoint is the merge. By then the agents have spent
`build` and `review` at opus xhigh on a plan nobody confirmed. The gate type
already exists (`manual`); it is just not used.

- `cloud-engines/stages.conf`: one line after `plan`:
  `plan-ok|manual|-|-|the owner approved the plan (feature, security); chores and fixes pass on class`
- `issues-in` posts the `## Plan` section on the issue when the item enters
  `plan-ok`, with "reply `/approve` or `/reject <why>`".
- Class rule in the `inbox` prompt: `chore` and `fix` set `plan-ok: auto` in
  frontmatter and `factory poll` moves them; `feature`, `security` and
  `idea` wait for the owner.

Effort: two hours. Outcome: the expensive stages run only on plans a human
has read.

## 4. A retro stage (the "it learns by itself" part)

`factory lessons` collects one-liners that agents choose to write. Nothing
reads a finished item end to end and asks what should change in the prompts.

- `cloud-engines/stages.conf`: after `live`, `retro|section:Retro|sonnet|medium|the item was read end to end and its lessons filed`.
- Retro prompt in `SKILL.md`: read the whole item file (every stage report,
  every reject, `factory cost <id>`), look for evidence only: a reject, a
  second review round, a park, a stage over its usual minutes, a gate that
  failed once. Output: `factory lessons <id> "<one line>"` for tool facts,
  and a `## Retro` section with at most three proposals of the form
  "`SKILL.md` stage `<name>`, add/change: `<the line>`, evidence: `<log
  entry>`". Proposals are never applied by the agent.
- Weekly console job (already the habit for pruning lessons): read the
  `## Retro` sections since last week, open one PR on `opencloud-factory`
  with the prompt changes worth keeping.

Effort: half a day. Outcome: the prompts improve from evidence, and a human
merges every change to them.

## Later, not now

- Risk-based auto-merge: a `risk:` line from review, and `approve` waived for
  `chore` + `risk: low`. Needs a factory GitHub App identity and a branch
  protection rule that still requires CODEOWNERS on protected paths. Not
  before the four above have run for a couple of weeks.
- The board over the network: `factory-ui` binds 127.0.0.1 on the devenv;
  the issue thread is the remote view until a `--bind` option exists.

## Where this came from

Two tickets ran end to end on 10 September through a small prototype of
exactly these four pieces (`AntonioVentilii/open-cloud-factory-demo`,
issues #2 and PR #1, #3). The prototype is not the proposal; the four PRs
above are.
