# V2 Refactoring Plan: Notification Consolidation & StatusBar Split

## Overview

Phase 26 revealed accumulated technical debt: multiple notification systems doing similar things, and StatusBar.ts approaching 2000 lines. This plan addresses both issues.

---

## Part 1: Notification System Consolidation

### Current State (4 systems!)

| System | Lines | Purpose | Events Listened |
|--------|-------|---------|-----------------|
| `ToastNotification` | 90 | Simple toasts | None (called directly) |
| `StatusNotificationController` | 459 | Status bar toasts + confirmations | None (called directly) |
| `AchievementToast` | 55 | Achievement popups | `achievement:unlocked` |
| `NotificationRail` | 946 | Stacked notifications | `achievement:unlocked`, `notification:show`, etc. |

**Problem**: Achievement unlocks trigger BOTH AchievementToast AND NotificationRail!

### Target State (1 unified system)

`NotificationRail` becomes the **canonical notification system**. Everything routes through it.

### Migration Steps

#### Step 1: Remove AchievementToast
- NotificationRail already handles `achievement:unlocked` with better UI
- Remove import and instantiation from main.ts
- Delete `AchievementToast.ts`

#### Step 2: Migrate ToastNotification callers to NotificationRail
- Search for `toastNotification.show()` calls in main.ts
- Replace with `eventBus.emit('notification:show', {...})`
- Remove ToastNotification import and instantiation
- Keep `ToastNotification.ts` for now (might be used elsewhere)

#### Step 3: Deprecate StatusNotificationController
- The `showConfirmation()` method is valuable - move to a `ConfirmationDialog` utility
- Status bar toast functionality → NotificationRail
- Keep enabled/disabled state management concept

#### Step 4: Add backwards-compatible convenience methods
- Add `showSave()`, `showError()`, etc. to NotificationRail
- Or create a thin `NotificationManager` wrapper

---

## Part 2: StatusBar.ts Refactoring

### Current State (1974 lines, 9 responsibilities)

1. **Context Detection** (~60 lines) - `detectContext()`, `getFeatures()`
2. **Color Tints** (~80 lines) - `applyColorTint()`, `updateAdaptiveTint()`
3. **Breadcrumbs** (~100 lines) - `buildBreadcrumbs()`, `renderBreadcrumbs()`
4. **App Switcher Preview** (~150 lines) - `setupAppSwitcherPreview()`, `getAppStates()`
5. **Gestures** (~400 lines) - Touch handling, context menus, long-press
6. **Mail/Unread System** (~100 lines) - `addUnreadNote()`, `markNoteAsRead()`
7. **Screenshot Mode** (~50 lines) - `toggleScreenshotMode()`
8. **Orientation Handling** (~50 lines) - `setupOrientationHandler()`
9. **Core Display** (~900 lines) - DOM, events, state updates

### Target State (5 focused modules)

```
src/ui/components/
├── StatusBar.ts              # Core display (~600 lines)
├── StatusBarContext.ts       # Context detection + feature flags (~150 lines)
├── StatusBarGestures.ts      # Touch/click handling (~450 lines)
├── StatusBarBreadcrumbs.ts   # Breadcrumb navigation (~150 lines)
└── StatusBarMail.ts          # Mail/unread system (~120 lines)
```

### Extraction Order

1. **StatusBarContext.ts** (low risk, no DOM)
   - Export `detectContext()`, `getFeatures()`, `UV7Context`, `StatusBarFeatures`
   - Export `COLOR_TINTS`, `ColorTint`, `NEUTRAL_TINT`

2. **StatusBarBreadcrumbs.ts** (low risk)
   - Export `buildBreadcrumbs()`, `BreadcrumbSegment`
   - Move `renderBreadcrumbs()` and `handleBreadcrumbClick()` to a class

3. **StatusBarGestures.ts** (medium risk, lots of state)
   - Extract gesture state and handlers
   - Pass StatusBar instance for callbacks

4. **StatusBarMail.ts** (low risk)
   - Extract unread notes system

5. **StatusBar.ts** cleanup
   - Import and wire up extracted modules
   - Should shrink to ~600 lines

---

## Part 3: main.ts Cleanup (Future)

main.ts is 1145 lines but it's an orchestration file. Potential extractions:

- `setupEventHandlers()` → `src/core/EventHandlers.ts`
- Screen management functions → `src/core/ScreenManager.ts`
- Debug helpers → `src/debug/DebugHelpers.ts`

**Lower priority** - the file is doing orchestration, not business logic.

---

## Implementation Order

1. **Notification Consolidation** (This session)
   - Remove AchievementToast duplicate listener
   - Migrate ToastNotification usages
   - Test that notifications work correctly

2. **StatusBar Split** (Next session)
   - Extract modules one at a time
   - Test after each extraction
   - Commit incrementally

3. **main.ts Cleanup** (Future)
   - Only if it keeps growing

---

## Success Criteria

- [x] Only ONE notification system (NotificationRail) ✅
- [ ] StatusBar.ts < 700 lines (Currently 1746 - partial progress)
- [x] No functionality regression ✅
- [x] TypeScript compiles cleanly ✅

---

## Completion Status (Phase 26 Follow-up)

### ✅ Completed

1. **Notification Consolidation**
   - Removed AchievementToast (duplicate of NotificationRail)
   - Migrated all toastNotification.show() → eventBus.emit('notification:show')
   - Deprecated ToastNotification (not instantiated)
   - One canonical system: NotificationRail

2. **StatusBar Module Extraction**
   - StatusBarContext.ts (180 lines) - context detection, feature flags, color tints
   - StatusBarBreadcrumbs.ts (213 lines) - breadcrumb logic + renderer
   - StatusBar.ts reduced from 1974 → 1746 lines (-12%)

### ⏸️ Deferred

1. **StatusBarGestures.ts** - ~420 lines deeply coupled to StatusBar state
   - Would require dependency injection refactoring
   - References: this.eventBus, this.stateManager, this.tetherLevel, this.features
   - Calls methods: toggleScreenshotMode(), pulseLoop(), markAllNotesAsRead()
   - Decision: Leave in StatusBar.ts for now, extract when needed

2. **main.ts Split** - 1145 lines
   - Orchestration file, lower priority
   - Could extract: setupEventHandlers(), ScreenManager, DebugHelpers

---

*"Refactoring is paying off technical debt before it bankrupts you."* 💚🔥💀
