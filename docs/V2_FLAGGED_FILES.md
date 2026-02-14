# V2 Flagged Files — Weekend Refactor Candidates

**Created:** 2026-02-12
**Purpose:** Track V2 files exceeding 700+ lines for potential decomposition
**When:** Aaron's weekend off
**Status:** Queued

---

## Flagged Files (>700 Lines)

### 1. NotificationRail.ts — 933 lines

- **Path:** `v2/ui/components/NotificationRail.ts`
- **Likely concerns:** Notification rendering, queue management, animation, positioning, dismissal logic
- **Investigation needed:** What can be extracted? Renderer vs. queue vs. animation?

### 2. StateManager.ts — 914 lines

- **Path:** `v2/core/StateManager.ts`
- **Likely concerns:** Game state, save/restore, state diffing, subscriptions
- **Note:** Core system — high-impact changes, needs careful approach

### 3. EchoMemorySystem.ts — 912 lines

- **Path:** `v2/systems/EchoMemorySystem.ts`
- **Likely concerns:** Memory tracking, echo triggers, persistence, UI rendering
- **Investigation needed:** Can memory storage be separated from trigger logic?

### 4. OverlayManager.ts — 786 lines

- **Path:** `v2/managers/OverlayManager.ts`
- **Likely concerns:** Overlay lifecycle, stacking, backdrop, focus trapping, multiple overlay types
- **Investigation needed:** Overlay types as separate renderers?

### 5. TetherSystem.ts — 756 lines

- **Path:** `v2/systems/TetherSystem.ts`
- **Likely concerns:** Tether mechanics, connection tracking, visual representation
- **Investigation needed:** Game logic vs. rendering separation?

### 6. SaveManager.ts — 737 lines

- **Path:** `v2/managers/SaveManager.ts`
- **Likely concerns:** Save slots, serialization, localStorage/IndexedDB, auto-save, import/export
- **Investigation needed:** Storage adapter pattern? Separate serialization?

### 7. NotificationShade.ts — 690 lines

- **Path:** `v2/ui/components/NotificationShade.ts`
- **Likely concerns:** Shade UI, notification grouping, actions, swipe-to-dismiss
- **Investigation needed:** Relationship with NotificationRail — shared abstraction?

---

## Test File TS Errors (338 total, 43 files)

**Pattern:** Most errors are `Expected 1 arguments, but got 0` — constructors were updated but tests weren't.

**Common error types:**

- `TS2554` — Missing constructor arguments (bulk of errors)
- `TS6133` — Unused mock variables declared but never read
- `TS2345` — Mock `{}` not matching full `EventBus` type

**Fix strategy:** Batch fix — update test constructors to pass required args (likely DOM element refs added to constructors). Can probably fix 80% with a repeated pattern.

---

## Approach

For each file:

1. Read and map responsibilities
2. Propose structure (Stop Before Start)
3. Apply orchestrator pattern if >1 concern
4. Maintain test coverage
5. Verify 0 errors, 0 warnings after

---

> *Queued for weekend. Don't touch these on a weeknight.* 🔪
