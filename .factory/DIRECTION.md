# Two factories, one shape, proposal for the 10 September demo

Two things were built this morning. They are not competing; they are two
layers of the same machine.

| | `dfinity/opencloud-factory` (Pietro, Yusef) | this repo (Antonio) |
|---|---|---|
| What it is | Dom's Open SaaS factory ported to opencloud: seats (worktree + local network), file queue, atomic claims, prioritizer, kanban dashboard | The layer *around* an execution engine: how work gets in, where humans must decide, how the agents get better |
| Runs where | one machine, one queue directory, CLI seats | a shared store + GitHub; agents are any Claude session that loads one skill |
| Entry | operator/producer sessions on that machine | anyone, any laptop, any account: "create a TODO in the factory" → a GitHub issue |
| Human touch | operator lane, inbox console | two explicit gates: spec approval before build; an independent gate agent decides if a human must look before merge |
| Learning | hand-written into SKILL.md after incidents | a retro agent proposes prompt changes with evidence after every task; humans merge |
| Proven today | task e2e in progress | two tasks inbox → merged ([#1](../../pull/1) no human needed, [#2](../../issues/2) gated as a visual change and approved with `/approve` on the issue) |

## The pipeline (what the second layer adds)

```
any Claude session ─"create a TODO"─► GitHub issue
                                          │ orchestrator mirrors it in, comments at every stage
   inbox ─► spec 🤖 ─► spec approval 👤 ─► plan 🤖 ─► build 🤖 ─► review 🤖 ─► gate 🤖 ─► human verify 👤 ─► merge 🤖 ─► done ─► retro 🤖
                        /approve on the issue                                   independent judge      /approve on the issue         proposals, humans merge
```

- Every 🤖 stage is a fresh-context subagent: the reviewer never remembers
  what the builder was thinking; the gate never sees either. Same idea as
  Dom's "judge from disk, never from memory", applied to every judgement.
- 👤 stages move only on a human's word, a click on the board or a
  `/approve` / `/changes <note>` comment on the issue. Approval on GitHub
  needs no permissions, no shared machine, no Claude org.
- The gate is rule-based first (touches `auth/`, migrations, deploy, CI,
  deleted public API, dependency bumps, visible UI → a human looks) and
  defaults to gating when unsure.
- The retro agent reads the whole trail, review rounds, CI reds, human
  send-backs, gate overrides, and files proposals against `agents/*.md`.
  First task already produced three; two were real (a `gh` self-approval
  quirk, a denied `rm -rf`) and are fixed.

## Why GitHub as the shared state, not a queue directory

Dom's factory coordinates through atomic renames on one filesystem. That is
exactly right for seats on one machine and exactly wrong for a team: three
people on three laptops with three different accounts cannot share a
directory, and a laptop that sleeps takes the factory down with it (Dom's
2026-08-20 incident). Issues, PRs, labels and comments already are a shared,
durable, audited store everyone can reach, and Copilot review and branch
protection plug into it for free.

## How the two fit together

The **build stage** of this pipeline is where an execution engine plugs in.
Today it is one subagent in a worktree; for Cloud Engines it should be a
seat from `opencloud-factory`, worktree plus the 4-replica + fake-NNS local
network, claimed through Dom's `factory.sh`. Everything before it (entry,
spec, approval, plan) and after it (review, gate, verify, merge, retro) stays
as it is here.

```
GitHub issue ─► spec/approve/plan ─► [ opencloud-factory seat builds it ] ─► review/gate/verify/merge ─► retro
```

## What is thin, honestly

- The orchestrator is a Claude Code session on one laptop today. Production:
  a small service on a VM with a factory GitHub App identity and an API key.
- Stage prompts are first drafts; the retro loop exists precisely so they stop
  being drafts.
- The live board is a window, not the store; it lives on one account. Fine.

## Proposal

Show both at the 10 September demo: Pietro's engine running a task on a seat; this pipeline
taking Dom's TODO from his own laptop through spec, gates and merge. Then
decide the shape together, the obvious one is the diagram above.

Agent door for this repo: `.factory/skill/open-cloud-factory/` (install with
one symlink, then `/open-cloud-factory` in any Claude Code session).
