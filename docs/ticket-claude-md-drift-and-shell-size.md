---
title: CLAUDE.md drift (blog path, co-author line) + shell god-files decision
author: DiZee
area: docs shell
type: chore
priority: low
status: open
shipped:
commit:
---

## Problem

Three standing-state drifts from the 2026-07-01 line-check:

1. **Session-ritual path is wrong.** CLAUDE.md says drains go to
   `../chicharons-kitchen/posts/YYYY/MM/slug.ts` — the real tree is
   `src/posts/` (chicharons' own CLAUDE.md and the 536 posts on disk agree).
   A cold session following this writes to a folder the glob never reads.
2. **Commit template is fossilized.** The prescribed trailer is
   `Co-Authored-By: Claude Sonnet 4.5` — two model generations stale.
3. **The shell tenant carries three god-files** by the repo's own 300-line /
   no-god-object rules: `shell/UV7AppSwitcher.ts` **1144**,
   `shell/UV7System.ts` **992**, `shell/UV7Shell.ts` **778**. These are fresh
   builds, not V1 ports, so the "legacy V1 ports" exemption doesn't cover
   them — yet CLAUDE.md calls shell/ "a linted/tested tenant" (it does have 4
   test files). Nearby for context: `v2/main.ts` sits at 301, right at the
   "is main.ts fatter?" canary line; the 600-line v2 systems
   (TetherSystem etc.) are V1 ports and arguably sanctioned.

## Outcome wanted

1–2 are one-line CLAUDE.md edits. For 3, a *decision*, not necessarily a
split: either the shell files get the orchestrator treatment
(UV7AppSwitcher is 3.8× the cap), or CLAUDE.md grants shell/ an explicit
documented exemption the way it does V1 ports. What's not okay is the
rules saying one thing and the flagship tenant silently doing another.

## Notes

Repo is otherwise in better shape than its era suggests — v3 experiment
cleanly removed, task.md ritual file present, line endings normalized.
(The git-object corruption found the same day is its own high-priority
ticket: `bug-git-object-corruption.md`.)

## Acceptance

- [ ] CLAUDE.md blog path says `src/posts/`
- [ ] Commit template names the current model family
- [ ] Shell size: split done OR exemption written into CLAUDE.md — explicitly one or the other
