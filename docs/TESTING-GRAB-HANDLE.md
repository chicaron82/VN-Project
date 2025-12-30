# Grab Handle Manual Testing Checklist

**Feature:** Triple-Threat Repositionable Sidebar Toggle
**File:** `system/grab-handle-repositioner.js`
**Test Date:** ___________
**Tester:** ___________

---

## Pre-Testing Setup

- [x] Clear localStorage: Open DevTools → Application → Storage → Clear site data
- [x] Refresh page to ensure clean state
- [x] Verify grab handle (☰) is visible on desktop (≥769px width)
- [x] Initial position: Left side, vertically centered (50%)

---

## 1. Vertical Repositioning (Drag Up/Down)

### Desktop (Mouse)
- [x] **Press and hold** grab handle for 300ms
- [x] Handle shows dragging state (cyan glow, scales to 1.1x)
- [x] **Drag up** toward top of screen
- [x] Handle moves smoothly with mouse
- [x] **Release** - position locks in place
- [ ] Handle stays above 10% from top (can't overlap status bar)
- [x] **Press and hold** again
- [x] **Drag down** toward bottom of screen
- [ ] Handle stops at 90% from top (safe zone enforced)
- [x] **Release** - position saved

### Mobile/Touch
- [x] **Press and hold** grab handle for 300ms
- [x] Handle vibrates (if device supports haptic)
- [x] **Drag finger up/down**
- [x] Handle follows finger position
- [x] **Release** - position locks with light haptic feedback
- [ ] Constraints work (10%-90% range enforced)

### Persistence
- [x] Reposition handle to 75% from top
- [x] **Refresh page** (F5 or Ctrl+R)
- [x] Handle returns to 75% position (localStorage working)

---

## 2. Side Flipping - Double-Tap Method

### Left → Right
- [x] Handle starts on **left** side
- [x] **Tap** grab handle once
- [x] **Tap** again within 300ms (quick double-tap)
- [x] Handle flips to **right** side with animation
- [x] Border radius changes (now rounded on left edge)
- [x] Heavy haptic feedback (double-pulse vibration on mobile)
- [ ] Sidebar toggle still works from right side

### Right → Left
- [x] Handle currently on **right** side
- [x] **Double-tap** grab handle
- [x] Handle flips back to **left** side
- [x] Border radius changes (rounded on right edge)
- [x] Heavy haptic feedback

### Timing Test
- [ ] **Tap** once
- [ ] **Wait 400ms** (longer than 300ms window)
- [ ] **Tap** again
- [ ] Handle does NOT flip (double-tap window expired)
- [ ] Normal sidebar toggle behavior instead

---

## 3. Side Flipping - Horizontal Drag Method

### Drag Left → Right
- [x] Handle on **left** side
- [x] **Press and hold** for 300ms
- [x] **Drag horizontally toward right** side of screen
- [x] When past 50% of screen width, handle gets **green glow + pulsing animation**
- [x] Visual feedback shows "crossing threshold"
- [x] **Release**
- [x] Handle flips to **right** side
- [x] Heavy haptic feedback

### Drag Right → Left
- [x] Handle on **right** side
- [x] **Press and hold** for 300ms
- [x] **Drag horizontally toward left** side
- [x] Green glow + pulse when past 50% threshold
- [x] **Release**
- [x] Handle flips to **left** side

### Below Threshold
- [x] **Drag horizontally** but only 30% of screen width
- [x] Green glow does NOT appear
- [x] **Release**
- [x] Handle does NOT flip (below 50% threshold)
- [x] Returns to original side

---

## 4. Sidebar Integration

### Left Side Behavior
- [ ] Handle on **left**, sidebar collapsed
- [ ] **Click** grab handle (normal click, not drag)
- [ ] Sidebar slides out from **left** edge
- [ ] Handle moves to right edge of expanded sidebar (left: 300px)
- [ ] Sidebar content readable and not flipped
- [ ] **Click** handle again to close
- [ ] Sidebar slides back to left
- [ ] Handle returns to left edge (left: 0)

### Right Side Behavior
- [ ] Flip handle to **right** side
- [ ] **Click** grab handle
- [ ] Sidebar slides out from **right** edge
- [ ] Handle moves to left edge of expanded sidebar (right: 300px)
- [ ] Sidebar has `.right-side` class applied
- [ ] Sidebar content still readable (not mirrored)
- [ ] **Click** handle again to close
- [ ] Sidebar slides back to right
- [ ] Handle returns to right edge (right: 0)

---

## 5. Drag Direction Detection

### Horizontal vs Vertical Priority
- [ ] **Drag diagonally** (more horizontal than vertical movement)
- [ ] System detects **horizontal** drag
- [ ] Crossing threshold logic applies (green glow if > 50%)
- [ ] **Drag diagonally** (more vertical than horizontal movement)
- [ ] System detects **vertical** drag
- [ ] Position updates vertically within 10%-90% range

---

## 6. Visual Feedback States

### Normal State
- [x] Cursor: `grab` (open hand icon)
- [x] Background: Subtle cyan (rgba(0, 255, 255, 0.1))
- [x] Border: 1px cyan outline
- [x] Border radius: Rounded on edge away from screen edge

### Hover State (Desktop)
- [x] Cursor: `grab`
- [x] Background brightens slightly
- [x] Width expands from 40px → 45px
- [x] Smooth transition

### Dragging State
- [x] Cursor: `grabbing` (closed hand icon)
- [x] Background: Brighter cyan (rgba(0, 255, 255, 0.3))
- [x] Border: Thicker/brighter cyan
- [x] Box shadow: Glowing effect (0 0 20px cyan)
- [x] Scale: 1.1x larger
- [x] Width: 50px
- [x] Transition: `none` (instant position updates)

### Crossing Threshold (Horizontal Drag)
- [ ] Background: **Green** (rgba(0, 255, 0, 0.3))
- [ ] Border: Green (rgba(0, 255, 0, 0.8))
- [ ] Box shadow: Bright green glow (0 0 30px green)
- [ ] Animation: Pulsing (scales 1.1x → 1.15x → 1.1x)
- [ ] Opacity: 0.8

---

## 7. Persistence & Reset

### localStorage Saving
- [x] Reposition handle to 25% from top, right side
- [x] Verify `grabHandlePosition` key exists
- [x] Value contains `{"topPercent":25,"side":"right","timestamp":...}`
- [x] **Refresh page**
- [x] Handle returns to 25% from top, right side

### Reset to Default (via DevTools)
- [ ] Open browser console (F12)
- [ ] Type: `game.grabHandleRepositioner.resetToDefault()`
- [ ] Press Enter
- [ ] Handle animates to **left side, 50% from top**
- [ ] localStorage updated to default values

---

## 8. Edge Cases & Error Handling

### Missing Elements
- [ ] Open DevTools → Elements
- [ ] Delete `#sidebar-toggle` element from DOM
- [ ] **Refresh page**
- [ ] No JavaScript errors in console
- [ ] Repositioner fails gracefully (console warning only)

### Invalid localStorage
- [ ] Open DevTools → Application → localStorage
- [ ] Edit `grabHandlePosition` to invalid JSON: `"broken{json"`
- [ ] **Refresh page**
- [ ] Handle resets to default (left, 50%)
- [ ] No JavaScript errors

### Extreme Viewport Sizes
- [ ] **Resize browser** to very narrow (400px width)
- [ ] Horizontal drag threshold still at 50% (200px)
- [ ] Flipping works correctly
- [ ] **Resize browser** to very wide (2000px width)
- [ ] Horizontal drag threshold at 50% (1000px)
- [ ] Flipping still works

### Mobile Landscape
- [x] Rotate mobile device to landscape
- [x] Grab handle repositioning still works
- [x] Touch events function correctly
- [x] Haptic feedback triggers

---

## 9. Haptic Feedback (Mobile Only)

**Note:** Requires physical mobile device with vibration support

### Light Haptic
- [x] Reposition handle vertically and **release**
- [x] Feel **short single vibration** (10ms)

### Medium Haptic
- [x] **Press and hold** to start drag
- [x] Feel **medium vibration** (20ms) when drag starts

### Heavy Haptic (Double-Pulse)
- [x] **Double-tap** to flip sides
- [x] Feel **double-pulse** pattern: buzz-pause-buzz (30ms, 10ms, 30ms)
- [x] OR **Drag horizontally** past threshold and release
- [x] Same double-pulse pattern

---

## 10. Performance & Responsiveness

### Smooth Dragging
- [x] Drag handle up/down rapidly
- [ ] Position updates smoothly without lag
- [ ] No jittering or stuttering
- [ ] Frame rate stays smooth (≥30 FPS)

### Quick Flipping
- [ ] Flip side via double-tap 5 times rapidly
- [ ] Each flip completes before next starts
- [ ] No race conditions or visual glitches
- [ ] Animations don't overlap

### Prevent Click When Dragging
- [ ] **Press and hold** grab handle
- [ ] **Drag** slightly (vertical or horizontal)
- [ ] **Release**
- [ ] Sidebar does NOT open (drag prevents click)
- [ ] Only position updates

---

## 11. Cross-Browser Testing

### Chrome/Edge (Chromium)
- [x] All features work
- [ ] Haptic API available
- [x] Smooth animations

### Firefox
- [ ] All features work
- [ ] Haptic API may not be available (expected)
- [ ] Visual feedback still works

### Safari (Desktop)
- [ ] All features work
- [ ] Check border-radius rendering
- [ ] Transform animations smooth

### Safari (iOS)
- [ ] Touch events work
- [ ] Haptic feedback works
- [ ] Double-tap detection accurate
- [ ] No scroll interference

### Chrome (Android)
- [x] Touch events work
- [x] Haptic feedback works
- [x] Horizontal drag threshold detection
- [x] No conflicts with browser gestures

---

## 12. Accessibility

### Keyboard Navigation
- [ ] **Tab** to grab handle
- [ ] Handle receives focus (outline visible)
- [ ] **Enter** or **Space** opens/closes sidebar
- [ ] **Arrow keys** - (Not implemented, expected behavior)

### Screen Reader
- [ ] Focus grab handle
- [ ] Screen reader announces element (e.g., "Sidebar toggle button")
- [ ] State changes announced when sidebar opens/closes

---

## Test Results Summary

**Total Tests:** _____ / _____
**Passed:** _____
**Failed:** _____
**Blocked:** _____

### Critical Issues Found:
1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

### Minor Issues Found:
1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

### Notes:
_________________________________________________
_________________________________________________
_________________________________________________

---

## Sign-Off

**Tester Signature:** ___________________________
**Date:** ___________
**Build/Commit:** ___________________________

**Ready for Production?** [ ] Yes  [ ] No  [ ] With Fixes

---

**Generated with Claude Code 💚🖤**
DiZee + UV7 Crew Collaboration
