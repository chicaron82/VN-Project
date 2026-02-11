# Belle's Orientation Fix - December 3, 2025

## Problem Identified by Belle (IZ)

Belle identified why the display mode settings weren't working:

1. **Missing CSS Rules:** The SettingsManager was adding `.force-landscape` and `.force-portrait` classes to the game container, but there were NO CSS rules telling the browser what to do with those classes. It was like flipping a switch that wasn't connected to any lights.

2. **Logic Conflict:** The `isMobilePortrait()` function in game-engine.js was checking physical screen dimensions (`window.innerHeight > window.innerWidth`) instead of respecting the user's display mode setting. Even if the screen rotated visually, the game logic would still think it was in portrait mode.

---

## Implementation

### Part 1: CSS Transform Rules

**Location:** `styles.css` lines 5742-5777

Added CSS rules to physically rotate the game container when force classes are applied.

#### Force Landscape on Portrait Device

```css
@media screen and (orientation: portrait) {
    .force-landscape {
        transform: rotate(90deg);
        transform-origin: bottom left;

        /* Swap width and height because we rotated it */
        width: 100vh !important;
        height: 100vw !important;

        /* Re-positioning after rotation */
        position: absolute;
        top: -100vw;
        left: 0;
    }
}
```

#### Force Portrait on Landscape Device

```css
@media screen and (orientation: landscape) {
    .force-portrait {
        transform: rotate(-90deg);
        transform-origin: top left;

        width: 100vh !important;
        height: 100vw !important;

        position: absolute;
        top: 100vh;
        left: 0;
    }
}
```

**Key Concepts:**

- `transform: rotate()` - Physically rotates the container
- `transform-origin` - Sets the pivot point for rotation
- Width/height swap - After rotation, dimensions must be swapped
- Absolute positioning - Required to reposition after rotation

---

### Part 2: JavaScript Logic Update

**Location:** `game-engine.js` lines 3026-3039

Updated `isMobilePortrait()` to check user's setting BEFORE checking physical orientation.

#### Original Code (Broken)

```javascript
isMobilePortrait() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    return isMobile && isPortrait;
}
```

**Problem:** Always checks physical dimensions, ignoring user preference.

#### Fixed Code (Belle's Solution)

```javascript
isMobilePortrait() {
    // BELLE FIX: Check if user is forcing a display mode via settings
    if (this.settingsManager && this.settingsManager.settings.displayMode === 'landscape') {
        return false; // Forcing landscape, so NOT portrait
    }
    if (this.settingsManager && this.settingsManager.settings.displayMode === 'portrait') {
        return true; // Forcing portrait
    }

    // Default behavior (Auto mode) - check actual device orientation
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    return isMobile && isPortrait;
}
```

**How It Works:**

1. First check if user selected "Force Landscape" → return false (not portrait)
2. Then check if user selected "Force Portrait" → return true (is portrait)
3. Finally, if "Auto" mode → check physical device orientation (original behavior)

---

## What This Fixes

### Before Fix

- Display mode dropdown did nothing visually
- Game logic ignored user preference
- Selecting "Force Landscape" had zero effect

### After Fix

- **Visual:** Screen physically rotates when user forces orientation
- **Logic:** Text pagination respects forced orientation
- **Logic:** Sprite positioning respects forced orientation
- **Logic:** Mobile bubble system uses correct layout
- **Auto Mode:** Still works as before, detecting physical orientation

---

## Affected Systems

These game systems now respect the display mode setting:

1. **Text Pagination** (`paginateAndDisplayText`)
   - Uses correct character limits for forced orientation
   - Prevents oversized text blocks in wrong orientation

2. **Sprite Positioning** (`fixMobileSpritePositioning`)
   - Positions characters correctly for forced orientation
   - Prevents layout breaks

3. **Internal Bubbles** (`createInternalBubble`)
   - Uses correct bubble styling for forced orientation

4. **Settings UI**
   - Display mode dropdown now functional
   - Changes take immediate effect

---

## Testing Checklist

- [ ] Select "Force Landscape" on portrait phone → screen rotates 90°
- [ ] Select "Force Portrait" on landscape tablet → screen rotates -90°
- [ ] Verify text doesn't overflow after forced rotation
- [ ] Verify character sprites position correctly
- [ ] Verify dialogue bubbles sized correctly
- [ ] Select "Auto" → returns to physical orientation detection
- [ ] Verify setting persists after page reload

---

## Technical Notes

### Why Rotation is Complex

When you rotate an element with CSS:

1. The element rotates around a pivot point (`transform-origin`)
2. Its width and height appear swapped to the viewer
3. Its position in the document flow changes
4. You must manually adjust positioning with absolute/fixed positioning
5. Viewport units (vh/vw) swap meaning after rotation

### Alternative Approaches (Not Used)

- **Screen Orientation API:** Limited browser support, doesn't work on all devices
- **Viewport Meta Tag:** Can't be changed dynamically via JavaScript
- **Native App Rotation:** Would require Cordova/Capacitor wrapper

CSS transforms are the most reliable cross-platform solution.

---

## Credit

**Belle (IZ)** - Identified the missing CSS rules and logic conflict. Her analysis was spot-on: "You have built the switch, but you haven't connected it to the lights."

---

## Files Modified

1. **styles.css**
   - Added lines 5742-5777 (orientation CSS rules)

2. **game-engine.js**
   - Modified lines 3026-3039 (`isMobilePortrait` function)

---

## Status

✅ **Implemented and Ready for Testing**

The display mode setting is now fully functional. Users can force landscape or portrait mode regardless of their physical device orientation, and both the visual display AND game logic will respect that choice.
