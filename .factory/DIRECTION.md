# Two factories, one shape

Written 10 September 2026 before the demo, corrected 11 September after
reading `dfinity/opencloud-factory` properly. The concrete proposal that came
out of it is [opencloud-factory#17](https://github.com/dfinity/opencloud-factory/issues/17).

## TL;DR

Same goal in both: automate request, plan, implementation, review, PR, merge.
`opencloud-factory` (Pietro, Yusef) is the stronger machine: code-enforced
exit gates, a plan stage, design as a human pick, two reviewers, human merge,
a lessons file every agent reads first, a board. It is the base.

What this prototype has that it does not, and what a person filing a ticket
would notice:

1. **Entry from anywhere.** Here anyone, from their own laptop and account:
   "create a TODO" becomes a GitHub issue, and they follow and decide on that
   issue. `opencloud-factory` enters work through `factory add` or a console
   session on the machine that runs it, and is set up per engineer, per
   checkout.
2. **A human checkpoint before the expensive stages.** Here the plan is
   approved before anything is built. In `opencloud-factory` the first human
   checkpoint is the merge, after `build` and `review` have run at opus
   xhigh. (Its `manual` gate type exists for exactly this and is unused.)
3. **Learning from the whole trail.** Here a retro agent reads each finished
   item end to end and proposes prompt changes with evidence; humans merge
   them. `opencloud-factory` has `factory lessons`: one-liners agents choose
   to write, which is the input, not the loop.

Plus one thing neither had until three people wanted one factory: an owner on
every item, so `factory mine` is per person.

Everything else in this prototype (spec agent, reviewer, gate rules, board)
exists in `opencloud-factory` in a better form and is not proposed.

## What the prototype proved on 10 September

Two tickets, inbox to merged, in `AntonioVentilii/open-cloud-factory-demo`:

- [#1](../../pull/1): `GET /version`. Filed from a session, spec approved,
  PR, review, gate `none`, merged. No human needed after the spec. 16 min.
- [#2](../../issues/2) / [#3](../../pull/3): move the console menu to the
  bottom. Filed as a GitHub issue, `/approve` on the issue, PR, review, gate
  `review` (visible UI change), human verify, merged. The retro agent then
  flagged that the orchestrator had merged on a chat message with no
  on-record approval, and proposed the rule "a chat message is not an
  approval". Applied.

## How the two fit

```
GitHub issue (anyone) -> inbox -> plan -> [owner approves the plan] -> design -> ready -> build -> review -> pr -> green -> approve (human merge) -> dev -> live -> retro
                                  opencloud-factory as it is, on the shared devenv
```

The four additions are one PR each, on files that already exist there.
Details, effort and order: [opencloud-factory#17](https://github.com/dfinity/opencloud-factory/issues/17).
