# V2 SHADE & GRAB HANDLE BUG REPORT
**Reporter:** Aaron "Chicharon"
**Date:** February 14, 2026
**Status:** Triaged, ready for fix

---

## BUG SUMMARY

**5 distinct issues** affecting NotificationShade and GrabHandle systems:

---

## BUG #1: Second Swipe Expansion Detection

**Component:** NotificationShade.ts
**Severity:** HIGH (UX friction)

**Description:**
The two-stage shade expansion works inconsistently:
- **Stage 1:** Swipe down → Initial shade appears ✅
- **Stage 2:** Swipe down again → Expanded view **requires multiple attempts** ❌

**Expected Behavior:**
Second swipe should reliably trigger expansion (like V1)

**Actual Behavior:**
User must swipe multiple times to get expanded shade to show

**Likely Causes:**
1. Swipe threshold too strict for second expansion
2. Touch event not properly resetting between stages
3. State machine not tracking "ready for expansion" correctly
4. Collision with other gesture handlers

**Files to Audit:**
- `/home/claude/v2/ui/components/NotificationShade.ts`
- Swipe detection logic for expansion
- Stage transition handling

---

## BUG #2: Shade Showing in Wrong Orientation

**Component:** NotificationShade.ts + Orientation Detection
**Severity:** HIGH (Wrong UI behavior)

**Description:**
Shade appears in desktop/mobile landscape orientations where it shouldn't

**Expected Behavior:**
- **Desktop/Landscape:** Swipe down → Open Sidebar ✅
- **Mobile Portrait:** Swipe down → Open Shade ✅

**Actual Behavior:**
- **Desktop/Landscape:** Swipe down → Shade appears ❌ (should be Sidebar)

**Root Cause:**
Orientation detection not properly routing swipe gestures:
- Should detect landscape/desktop
- Should route to Sidebar instead of Shade
- Currently showing Shade regardless of orientation

**V1 Behavior (Correct):**
V1 correctly shows Sidebar in landscape, Shade in portrait

**Files to Audit:**
- `/home/claude/v2/ui/components/NotificationShade.ts` (orientation check)
- `/home/claude/v2/ui/components/Sidebar.ts` (gesture routing)
- Swipe handler that determines which component to open

---

## BUG #3: Grab Handle Not Following Sidebar

**Component:** GrabHandle.ts + GrabHandleRepositioner.ts
**Severity:** MEDIUM (Visual polish)

**Description:**
When Sidebar opens, GrabHandle stays in closed position

**Expected Behavior:**
- Sidebar closed → GrabHandle at default position
- Sidebar opens → GrabHandle moves to "opened" position
- Smooth transition between positions

**Actual Behavior:**
GrabHandle doesn't reposition when Sidebar state changes

**Likely Causes:**
1. GrabHandle not listening to `sidebar:opened` event
2. GrabHandleRepositioner not updating position on state change
3. Missing EventBus subscription

**V1 Behavior (Correct):**
V1's grab handle follows sidebar state changes

**Files to Audit:**
- `/home/claude/v2/ui/components/GrabHandle.ts`
- `/home/claude/v2/controllers/GrabHandleRepositioner.ts`
- EventBus listeners for sidebar state

---

## BUG #4: Double-Click Triggering Fullscreen

**Component:** GrabHandle.ts + FullscreenController.ts
**Severity:** HIGH (Unwanted behavior)

**Description:**
Double-clicking grab handle to swap positions accidentally triggers fullscreen

**Expected Behavior:**
- **Double-click grab handle:** Swap position (left/right) ✅
- **Fullscreen:** Only via dedicated button/shortcut ✅

**Actual Behavior:**
- **Double-click grab handle:** Swaps position AND enters fullscreen ❌

**Root Cause:**
Double-click event bubbling to fullscreen handler:
1. User double-clicks grab handle
2. Event handled by GrabHandle (position swap) ✅
3. Event bubbles/propagates to document
4. Fullscreen controller catches double-click ❌
5. Enters fullscreen mode unintentionally

**V1 Behavior (Correct):**
V1 handles double-click on grab handle without triggering fullscreen
- Likely uses `event.stopPropagation()` or similar

**Files to Audit:**
- `/home/claude/v2/ui/components/GrabHandle.ts` (double-click handler)
- `/home/claude/v2/controllers/FullscreenController.ts` (event listener scope)
- Event propagation between handlers

**Fix Strategy:**
```typescript
// In GrabHandle double-click handler:
handleDoubleClick(event: MouseEvent): void {
    event.stopPropagation();  // Prevent fullscreen trigger
    event.preventDefault();   // Stop default behavior
    this.swapPosition();
}
```

---

## BUG #5: (Implied) Swipe Gesture Routing

**Component:** Global Swipe Handler
**Severity:** MEDIUM (Architecture issue)

**Description:**
Single swipe-down gesture needs to route to different components based on context

**Current Behavior (Broken):**
Swipe down → Always shows Shade (even in landscape/desktop)

**Expected Routing:**
```
IF mobile portrait:
    Swipe down → NotificationShade

IF desktop OR mobile landscape:
    Swipe down → Sidebar

IF in UV7 Shell:
    Different behavior? (needs clarification)
```

**Files to Audit:**
- Core swipe gesture handler (where is this?)
- `/home/claude/v2/core/SwipeHandler.ts` ?
- Component-level gesture detection
- Orientation detection logic

---

## AFFECTED FILES (PRELIMINARY)

**High Priority:**
1. `/home/claude/v2/ui/components/NotificationShade.ts` - Expansion detection + Orientation routing
2. `/home/claude/v2/ui/components/GrabHandle.ts` - Position tracking + Double-click propagation
3. `/home/claude/v2/controllers/GrabHandleRepositioner.ts` - Sidebar state subscription
4. `/home/claude/v2/controllers/FullscreenController.ts` - Event scope limitation

**Medium Priority:**
5. `/home/claude/v2/ui/components/Sidebar.ts` - Grab handle integration
6. `/home/claude/v2/core/SwipeHandler.ts` - Global gesture routing

---

## V1 COMPARISON NEEDED

**Action Items:**
1. Compare V1 shade expansion thresholds with V2
2. Check V1 orientation detection logic
3. Verify V1 grab handle event listeners
4. Audit V1 double-click event handling

**V1 Files to Reference:**
- `/home/claude/v1/ui/notification-shade.js`
- `/home/claude/v1/ui/grab-handle.js`
- `/home/claude/v1/controllers/fullscreen-controller.js`

---

## REPRODUCTION STEPS

**Bug #1 - Expansion Detection:**
1. Open V2 in mobile portrait
2. Swipe down → Initial shade appears
3. Swipe down again → Expanded view doesn't show
4. Repeat swipe 2-3 times → Finally expands

**Bug #2 - Orientation:**
1. Open V2 in desktop browser OR mobile landscape
2. Swipe down
3. Observe: Shade appears (incorrect, should be Sidebar)

**Bug #3 - Grab Handle Position:**
1. Open V2
2. Open Sidebar (swipe or button)
3. Observe: Grab handle stays in closed position (doesn't follow)

**Bug #4 - Fullscreen:**
1. Double-click grab handle to swap position
2. Observe: Position swaps AND fullscreen activates (unwanted)

---

## NEXT STEPS

**Phase 1: Investigation (30 min)**
- [ ] Audit NotificationShade.ts swipe thresholds
- [ ] Check orientation detection logic
- [ ] Find global swipe gesture router
- [ ] Trace GrabHandle EventBus subscriptions
- [ ] Compare V1 vs V2 double-click handlers

**Phase 2: Fixes (60-90 min)**
- [ ] Fix expansion detection sensitivity
- [ ] Add orientation check to shade display
- [ ] Wire GrabHandle to sidebar state events
- [ ] Add stopPropagation to grab handle double-click
- [ ] Test all fixes across orientations

**Phase 3: QA (30 min)**
- [ ] Test expansion in mobile portrait
- [ ] Verify Sidebar shows in landscape/desktop
- [ ] Confirm grab handle follows sidebar
- [ ] Validate double-click doesn't fullscreen
- [ ] Cross-device testing

---

## QUESTIONS FOR AARON

1. **UV7 Shell behavior:** How should swipe gestures work in the shell context?
2. **Expansion threshold:** What feels "right" for the second swipe? (pixel distance, velocity?)
3. **Priority:** Tackle all 5 bugs or focus on specific ones first?

---

**STATUS:** Ready for deep dive and fixes
**ESTIMATED FIX TIME:** 2-3 hours for all 5 bugs

💚🔥💀

---

**END OF BUG REPORT**
