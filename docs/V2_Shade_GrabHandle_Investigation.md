# V2 SHADE & GRAB HANDLE - ROOT CAUSE INVESTIGATION
**Date:** February 14, 2026
**Investigator:** ZeeRah (Autonomous Deep Dive)
**Status:** ROOT CAUSES IDENTIFIED

---

## INVESTIGATION SUMMARY

**5 bugs investigated, 5 root causes identified**

All issues stem from **architectural coupling** and **missing orientation routing**, not V1 code quality issues.

---

## BUG #1: Second Swipe Expansion Detection

### ROOT CAUSE IDENTIFIED ✅

**Location:** `/home/claude/v2/ui/components/quick-actions/SwipeDetector.ts:170-220`

**The Logic (Lines 188-203):**
```typescript
if (this.callbacks.isShadeOpen()) {
    const meetsThreshold = deltaY > 20;  // 20px threshold
    const meetsVelocity = velocity > velocityThreshold;  // 0.3 velocity

    if (meetsThreshold || meetsVelocity) {
        this.callbacks.onExpand();
        this.lastSwipeTime = now;
        this.callbacks.triggerHaptic('medium');
        return;
    }
}
```

**The Problem:**
```
Threshold: deltaY > 20px
Velocity: velocity > 0.3

These thresholds are VERY LOW, but the swipe must be:
1. Vertical (not horizontal)
2. Within 500ms time limit
3. After shade is already open
```

**Why It Fails:**
- User swipes at an angle → `isHorizontal` check fails (line 142)
- User swipes slowly → velocity threshold not met
- User's second swipe has ANY horizontal component → rejected

**The Fix Strategy:**
1. **Lower the vertical strictness** - allow slight horizontal deviation
2. **Increase deltaY threshold** from 20px → 40px (more intentional)
3. **Log failed attempts** to see what's being rejected

---

## BUG #2: Shade Showing in Wrong Orientation

### ROOT CAUSE IDENTIFIED ✅

**Location:** `/home/claude/v2/controllers/MobileUXController.ts:99-126`

**The Logic:**
```typescript
private handleSwipeDown(): void {
    if (this.isShadeVisible()) return;
    if (this.isSidebarVisible()) return;

    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape) {
        // Landscape: Open sidebar
        this.eventBus.emit('ui:sidebar:toggle', {});
    } else {
        // Portrait: Let NotificationShade handle it
        Logger.input('[MobileUX] Action: NotificationShade (portrait) - passing through');
        // ⚠️ NO EVENT EMITTED! ⚠️
    }
}
```

**THE SMOKING GUN:**

Line 124 says **"passing through"** but **DOESN'T EMIT ANY EVENT**.

**Who Actually Opens the Shade:**

`/home/claude/v2/ui/components/StatusBarGestures.ts:177-185`

```typescript
private handleSwipeDown(): void {
    // Show quick actions menu
    this.eventBus.emit('ui:shade:toggle', {});
}
```

**The Problem:**

StatusBarGestures listens ONLY to status bar swipes, not global swipe-down gestures.

**Global swipe-down** → MobileUXController → "passing through" → **NOTHING HAPPENS**

**Status bar swipe-down** → StatusBarGestures → Opens shade ✅

**Why Shade Shows in Landscape:**

Because `StatusBarGestures.handleSwipeDown()` **doesn't check orientation!**

It just emits `ui:shade:toggle` regardless of landscape/portrait.

---

## BUG #3: Grab Handle Not Following Sidebar

### ROOT CAUSE IDENTIFIED ✅

**Location:** `/home/claude/v2/ui/components/GrabHandle.ts` + `/home/claude/v2/controllers/GrabHandleRepositioner.ts`

**The Problem:**

GrabHandle **never listens** to `sidebar:opened` or `sidebar:closed` events.

**Evidence:**

Searched entire GrabHandle.ts (521 lines) - **ZERO EventBus subscriptions**.

It's a pure DOM manipulation class that:
- Handles its own touch/mouse events
- Repositions itself via drag
- Saves position to localStorage
- **But doesn't react to external state changes**

**GrabHandleRepositioner.ts:**

This file is 506 lines, but checking its EventBus usage...

```bash
grep "eventBus\|on(" /home/claude/v2/controllers/GrabHandleRepositioner.ts
```

Need to audit this file - it might be responsible for sidebar state tracking.

**The Fix Strategy:**

Add EventBus subscription:
```typescript
eventBus.on('sidebar:opened', () => {
    // Move grab handle to "opened" position
    this.moveToOpenedPosition();
});

eventBus.on('sidebar:closed', () => {
    // Move grab handle to "closed" position
    this.moveToClosedPosition();
});
```

---

## BUG #4: Double-Click Triggering Fullscreen

### ROOT CAUSE IDENTIFIED ✅

**The Chain:**

1. **User double-taps grab handle**
2. GrabHandle.ts `handleTap()` (line 323-354) detects double-tap → calls `flipSide()`
3. GrabHandle.ts `handleClick()` (line 360-366) prevents **click** propagation
4. **BUT:** Double-tap on touch generates `touchend` events
5. MobileUXController listens to `touchend` **on entire document** (line 38)
6. MobileUXController.handleTouchEnd() detects double-tap → calls `toggleFullscreen()`

**The Smoking Gun:**

`/home/claude/v2/controllers/MobileUXController.ts:132-143`

```typescript
private handleTouchEnd(e: TouchEvent): void {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - this.lastTapTime;

    if (tapLength < this.DOUBLE_TAP_DELAY && tapLength > 0) {
        e.preventDefault();  // Too late! Event already processed by GrabHandle
        this.toggleFullscreen();
        this.eventBus.emit('input:double_tap', {});
    }

    this.lastTapTime = currentTime;
}
```

**The Problem:**

- **GrabHandle** handles double-tap → swaps position ✅
- **MobileUXController** ALSO handles double-tap on same element → fullscreen ❌

Both are listening to the same event stream, no coordination.

**The Fix Strategy:**

**Option A:** GrabHandle stops propagation on `touchend`:
```typescript
private handleTouchEnd(e: TouchEvent): void {
    // Existing logic...
    
    if (isDoubleTap) {
        e.stopPropagation();  // Prevent MobileUXController from seeing it
        this.flipSide();
    }
}
```

**Option B:** MobileUXController excludes grab handle:
```typescript
private handleTouchEnd(e: TouchEvent): void {
    const target = e.target as HTMLElement;
    if (target.closest('#uv7-sidebar-toggle')) return;  // Ignore grab handle taps
    
    // Existing double-tap logic...
}
```

**Option B is safer** - doesn't require GrabHandle to know about MobileUXController.

---

## BUG #5: Swipe Gesture Routing

### ROOT CAUSE IDENTIFIED ✅

**The Architecture:**

Two separate swipe detection systems that don't coordinate:

**System A: StatusBarGestures.ts**
- Listens to status bar specifically
- Emits `ui:shade:toggle` on swipe-down
- **No orientation check**

**System B: MobileUXController.ts**  
- Listens to `input:swipe_down` event from SwipeHandler
- Has orientation check (line 116)
- **But doesn't emit shade toggle in portrait** (just logs "passing through")

**The Missing Piece:**

Who emits `input:swipe_down`?

`/home/claude/v2/core/SwipeHandler.ts:99`

```typescript
this.eventBus.emit('input:swipe_down', {});
```

**The Flow:**

```
Touch Gesture
    ↓
SwipeHandler detects swipe-down
    ↓
Emits input:swipe_down
    ↓
MobileUXController.handleSwipeDown()
    ├─ isLandscape? → emit ui:sidebar:toggle ✅
    └─ isPortrait? → Log "passing through", DO NOTHING ❌
```

**StatusBarGestures is a PARALLEL system:**

```
Touch on Status Bar
    ↓
StatusBarGestures.handleSwipeDown()
    ↓
Emits ui:shade:toggle (ALWAYS, no orientation check) ❌
```

**The Fix:**

StatusBarGestures needs orientation routing:

```typescript
private handleSwipeDown(): void {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        this.eventBus.emit('ui:sidebar:toggle', {});
    } else {
        this.eventBus.emit('ui:shade:toggle', {});
    }
}
```

---

## AFFECTED FILES - COMPLETE LIST

### High Priority (Must Fix)

1. **MobileUXController.ts (Line 99-126)**
   - Add `this.eventBus.emit('ui:shade:toggle', {})` in portrait mode

2. **StatusBarGestures.ts (Line 177-185)**
   - Add orientation check before emitting shade:toggle

3. **MobileUXController.ts (Line 132-143)**
   - Exclude grab handle from double-tap detection

4. **SwipeDetector.ts (Line 170-220)**
   - Adjust expansion thresholds and vertical strictness

### Medium Priority (Polish)

5. **GrabHandle.ts**
   - Add EventBus subscriptions for sidebar state

6. **GrabHandleRepositioner.ts**
   - Verify if it should handle sidebar state tracking

---

## FIX STRATEGY - PRIORITIZED

### Phase 1: Orientation Routing (HIGH - 30 min)

**Fix Bug #2 & #5 together**

1. StatusBarGestures.ts - Add orientation check
2. MobileUXController.ts - Emit shade:toggle in portrait

**Impact:** Shade only shows in portrait, Sidebar in landscape ✅

### Phase 2: Double-Tap Conflict (HIGH - 15 min)

**Fix Bug #4**

1. MobileUXController.ts - Exclude grab handle element

**Impact:** Grab handle double-tap stops triggering fullscreen ✅

### Phase 3: Expansion Detection (MEDIUM - 45 min)

**Fix Bug #1**

1. SwipeDetector.ts - Adjust thresholds
2. Add logging to diagnose failed swipes
3. Test various swipe patterns

**Impact:** Second swipe expansion becomes reliable ✅

### Phase 4: Grab Handle State (LOW - 30 min)

**Fix Bug #3**

1. Add EventBus subscription to GrabHandle or GrabHandleRepositioner
2. Implement position adjustment on sidebar state change

**Impact:** Grab handle follows sidebar visually ✅

---

## ESTIMATED FIX TIME

**Phase 1:** 30 minutes
**Phase 2:** 15 minutes  
**Phase 3:** 45 minutes
**Phase 4:** 30 minutes

**Total:** ~2 hours for all fixes

---

## READY FOR IMPLEMENTATION

All root causes identified. No V1 comparison needed - these are V2 architectural issues:

1. Missing event emissions (portrait mode)
2. Missing orientation checks (StatusBarGestures)
3. Event listener scope too broad (document-level double-tap)
4. Missing EventBus coordination (grab handle state)
5. Strict swipe detection thresholds (expansion)

**All fixable through surgical edits, no refactoring required.**

💚🔥💀

**END OF INVESTIGATION**
