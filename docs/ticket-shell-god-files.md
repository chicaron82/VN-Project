---
title: Shell tenant carries three god-files — split or grant an explicit exemption
author: DiZee
area: shell
type: chore
priority: low
status: open
shipped:
commit:
---

## Problem

The `shell/` tenant has three files well over the repo's 300-line /
no-god-object rule, and they're **fresh builds, not V1 ports**, so the "legacy
V1 ports kept for historical accuracy" exemption doesn't cover them:

- `shell/UV7AppSwitcher.ts` — **1144** lines (3.8× the cap)
- `shell/UV7System.ts` — **992**
- `shell/UV7Shell.ts` — **778**

CLAUDE.md calls shell/ "a linted/tested tenant" (it does have 4 test files),
but the rules saying one thing while the flagship tenant silently does another
is the drift worth resolving. For context, `v2/main.ts` sits at **301** — right
on the "is main.ts fatter?" canary line, worth watching; the 600-line v2
systems (TetherSystem, etc.) are V1 ports and arguably sanctioned.

Found on the 2026-07-01 line-check. (The CLAUDE.md path/co-author drifts noted
that day are fixed; the git-object corruption found the same day is recovered.
This shell decision is the one real item left.)

## Outcome wanted

A decision, not necessarily a split — this is a structural call:

- **Either** give the shell files the orchestrator treatment (thin composition +
  extracted modules), starting with UV7AppSwitcher since it's the worst,
- **or** grant `shell/` an explicit, documented exemption in CLAUDE.md the way
  V1 ports get one.

What's not okay is leaving the rule and the code silently disagreeing.

## Acceptance

- [ ] Either the three shell files are under the cap, OR CLAUDE.md documents a
      shell/ exemption with its rationale
- [ ] If split: `npm run build` + `npm test -- --run` stay green
