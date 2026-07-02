---
title: Corrupt loose object in .git — one reachable tree, recover from origin
author: DiZee
area: repo-integrity
type: bug
priority: high
status: open
shipped:
commit:
---

## Problem

Found on the 2026-07-01 line-check: the local object store has **one corrupt
loose object**, and it's a *reachable* tree:

```
error: inflate: data stream error (unknown compression method)
error: unable to unpack header of .git/objects/28/3f83f0567865fdd174058c4f3e5e57264d0bf9
missing tree 283f83f0567865fdd174058c4f3e5e57264d0bf9
```

(`git fsck --no-dangling` output — that is the *only* error; the rest of the
store is healthy.)

The working tree is fine and recent commits/log work. The corruption bites
history operations that walk through that tree (`git log --follow` on shell
files already trips it), and would fail a `git gc`/repack or any clone/backup
taken **from this local copy**. Left alone it's a landmine under future
history surgery — and this repo just had 47M of v3 history removed, so repack
pressure is real.

## Outcome wanted

`git fsck --no-dangling` exits clean; history walks (`git log --follow -- shell/UV7AppSwitcher.ts`)
run without inflate errors.

## Notes

Recovery is cheap because `origin` (github.com/chicaron82/VN-Project) predates
the corruption — the tree is part of pushed history:

1. Quarantine, don't delete:
   `mv .git/objects/28/3f83f0... /tmp/vn-corrupt-object-backup`
2. Re-fetch the object from origin — simplest reliable route: fresh
   `git clone --bare` to a temp dir, then
   `git cat-file -t 283f83f...` there to confirm it exists remotely, and copy
   the object in (or `git fetch origin +refs/heads/*:refs/quarantine/*` and
   let git backfill).
3. `git fsck --no-dangling` → clean; re-run the `--follow` log as the smoke
   test.
4. If origin somehow *lacks* the tree (would mean unpushed old history), stop
   and surface — don't improvise history surgery.

Disk-level cause unknown (single-object rot, likely a bad write). Worth a
`git fsck` habit on the other kitchen repos' next line-check — this one was
silent until a `--diff-filter` log walked into it.

## Acceptance

- [ ] `git fsck --no-dangling` clean
- [ ] `git log --oneline --follow -- shell/UV7AppSwitcher.ts` completes without errors
- [ ] Corrupt object backed up to /tmp before replacement (verify-then-delete)
