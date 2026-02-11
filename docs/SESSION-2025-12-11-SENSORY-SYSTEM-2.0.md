# Session Notes: Sensory System 2.0 & Time Machine Manager

**Date:** December 11, 2025
**Version:** 848
**Built by:** UV7 Crew (Tori's Architecture + DZ's Implementation)

---

## Overview

This session implemented two major systems designed by Tori, plus a critical carousel fix:

1. **Time Machine Manager** - Centralized snapshot/timeline navigation system
2. **Sensory System 2.0** - Unified haptic + visual feedback with channel-based scaling
3. **Infinite Carousel Loop Fix** - True infinite scroll with clone buffers and viewport centering

Both systems replace scattered implementations with clean, metadata-driven architectures.

---

## Part 1: Time Machine Manager ⏰

### What It Does

The Time Machine Manager replaces scattered backlog arrays with a centralized snapshot system for timeline navigation. It captures moments in the story and allows jumping back to them with narrative-aware rules.

### Core Features

- **Snapshot Building**: Captures route/scene/page position, tether, flags, visuals
- **Smart Pruning**: Priority-based system (low/normal/high/anchor) prevents bloat
- **Narrative Manipulation**: `burn()`, `lock()`, `corrupt()`, `insaneBlock` states
- **Jump Validation**: Respects insane mode (only last 2 snapshots) and narrative locks
- **Dev Console Integration**: `tm` command for inspection, `jump [id]` for time travel

### Files Created/Modified

#### New Files

- `system/time-machine-manager.js` (420 lines)
  - Core snapshot system
  - Smart pruning logic
  - Jump validation and execution
  - Narrative state manipulation

- `TIME-MACHINE-USAGE.md`
  - Complete usage guide
  - API reference
  - Examples and migration notes

#### Modified Files

- `system/game-engine.js`
  - Lines 365-369: TimeMachine initialization
  - Lines 1760-1880: Helper methods for snapshots
    - `getScenePosition()`
    - `loadSceneFromSnapshot(entry)`
    - `getSerializableFlags()` / `applySerializableFlags()`
    - `getCurrentBackgroundKey()` / `setBackgroundByKey()`
    - `getCurrentSpriteKey()` / `setSpriteByKey()`
  - Lines 2611-2616: Snapshot creation after scene display
  - Lines 3220-3225: Snapshot creation for paginated dialogue

- `system/dev-console.js`
  - Lines 180-182: Added commands to help text
  - Lines 349-430: Time Machine command implementation
    - `timemachine` / `tm` - Inspect all snapshots
    - `jump [id]` - Jump to snapshot (supports `force` flag)

- `index.html`
  - Line 1098: Added `<script src="system/time-machine-manager.js"></script>`

### Key Implementation Details

**Snapshot Structure:**

```javascript
{
    id: 1,
    label: "Ronnie Act 2 Start",
    priority: "high", // low | normal | high | anchor
    routeId: "ronnie",
    sceneId: "act2-opener",
    pageIndex: 0,
    tether: 50,
    flags: { /* game state */ },
    bgKey: "ronnie-room",
    spriteKey: "ronnie-neutral",
    createdAt: Date.now(),

    // Narrative state
    corrupted: false,
    corruptionMode: null, // 'despair' | 'echo' | 'timeline-break'
    locked: false,
    burned: false,
    insaneBlocked: false
}
```

**Smart Pruning Logic:**

1. Never prune: Anchors (endings, major beats)
2. Prune last: High priority
3. Prune second: Normal priority (FIFO)
4. Prune first: Low priority

**Insane Mode Rules:**

- Only last 2 snapshots are accessible
- Creates "the past is slipping away" feeling
- Harsh denial feedback when blocked

### Usage Examples

**Recording Snapshots:**

```javascript
// Every scene transition
this.game.timeMachine.addCurrentState();

// Major story beats
this.game.timeMachine.addCurrentState('[Echo Merge]', 'anchor');
this.game.timeMachine.addCurrentState('Ronnie Act 2 Start', 'high');
```

**Narrative Manipulation:**

```javascript
// Make moment unreachable
const lastEntry = this.game.timeMachine.getLatestEntry();
this.game.timeMachine.burnEntry(lastEntry.id);

// Corrupt Despair-tainted moments
this.game.timeMachine.corruptEntriesWhere(
    entry => entry.routeId === 'ronnie' && !entry.locked,
    'despair-flood'
);

// Hard lock a moment
this.game.timeMachine.lockEntry(entryId);
```

**Dev Console Commands:**

```
> tm
⏰ TIME MACHINE INSPECTOR
Total: 45/200 | Strategy: smart | Insane: Inactive

[Shows last 10 snapshots with labels, positions, flags]

> jump 12
⏰ Jumping to snapshot #12: [Echo Merge]
[Restores scene position, tether, flags, visuals]

> jump 5 force
⏰ Force jumping (ignoring all rules)...
```

---

## Part 2: Sensory System 2.0 ✨

### What It Does

Upgrades the sensory feedback system with:

- Central metadata map for all haptic + visual cues
- Channel-based scaling (ui, narrative, critical)
- Comfort intensity driving both visuals AND haptics
- Debounce anti-spam protection
- Debug logging for testing

### Core Features

- **SENSORY_CUES Metadata Map**: Central config for all feedback
- **Channel System**: Three-tier priority (ui, narrative, critical)
- **Comfort Scaling**: Gentle (0.6x), Normal (1.0x), Amped (1.3x)
- **Critical Immunity**: Denial/warning cues always full strength
- **Debounce**: 80ms cooldown prevents haptic spam
- **Debug Logger**: `sensory` command shows last 20 events

### Files Modified

#### `system/game-engine.js`

**Lines 201-282: SENSORY_CUES Metadata Map**

```javascript
const SENSORY_CUES = {
    // UI Interactions (scale with comfort)
    buttonPress: {
        channel: 'ui',
        basePattern: 'light',
        visualType: 'buttonPress'
    },
    menuSelect: {
        channel: 'ui',
        basePattern: 'light',
        visualType: 'menuSelect'
    },
    cardSnap: {
        channel: 'ui',
        basePattern: 'light',
        visualType: 'cardSnap'
    },

    // Narrative Moments (scale with comfort)
    toriHop: {
        channel: 'narrative',
        basePattern: 'pulse',
        visualType: 'toriHop'
    },
    tamaPull: {
        channel: 'narrative',
        basePattern: 'medium',
        visualType: 'tetherPull'
    },
    tamaEmergency: {
        channel: 'narrative',
        basePattern: 'warning',
        visualType: 'emergencyFlash'
    },
    timelineGlitch: {
        channel: 'narrative',
        basePattern: 'glitch',
        visualType: 'timelineGlitch'
    },
    codeRipple: {
        channel: 'narrative',
        basePattern: 'medium',
        visualType: 'codeRipple'
    },

    // Critical Feedback (NEVER scales)
    denied: {
        channel: 'critical',
        basePattern: 'denied',
        visualType: 'denied'
    },
    harshDenial: {
        channel: 'critical',
        basePattern: 'error',
        visualType: 'harshDenial'
    }
};
```

**Lines 404-408: Debounce & Debug Fields**

```javascript
this.lastHapticTime = 0;
this.hapticCooldownMs = 80;  // Anti-spam cooldown
this.sensoryLog = [];
this.maxSensoryLog = 20;     // Keep last 20 events
```

**Lines 1465-1571: Upgraded triggerHaptic**

- Added `getHapticPatterns()` method
- Added `scaleHapticPattern(pattern, comfortLevel)` method
- Implemented debounce check (80ms cooldown)
- Scales patterns based on comfort: 0.6x gentle, 1.3x amped
- Respects critical channel (no scaling)
- Added `logSensory()` debug logger

**Lines 1573-1607: Metadata-Driven triggerSensoryFeedback**

```javascript
triggerSensoryFeedback(cueType, target = null, description = '') {
    const meta = SENSORY_CUES[cueType];
    if (!meta) return;

    const { channel, basePattern, visualType } = meta;

    // Visual cue
    if (visualType) {
        this.visualCueManager.trigger(visualType, target, { channel });
    }

    // Haptic cue
    if (basePattern) {
        this.triggerHaptic(basePattern, description, { channel });
    }
}
```

#### `system/visual-cue-manager.js`

**Updated getScale(channel)** - Lines 20-39

- Now accepts channel parameter
- Critical channel NEVER scales (always 1.0)
- Other channels respect comfort intensity
- Updated scale values: Gentle 0.6x, Amped 1.35x

**Updated trigger(cueType, target, { channel })** - Lines 45-54

- Accepts channel in options object
- Stores channel for individual effect methods

**Updated Visual Effects:**

- **Narrative cues** (toriHop, tetherPull, timelineGlitch, codeRipple):
  - Duration scales with comfort
  - Particle distance scales with comfort
  - Opacity scales with comfort

- **Critical cues** (denied, harshDenial):
  - Never scale (always 1.0)
  - Full intensity preserved

- **UI cues** (buttonPress, menuSelect, cardSnap):
  - Duration scales with comfort
  - Glow intensity scales with comfort

**Updated createRipple(target, scale)** - Lines 399-421

- Accepts scale parameter
- Size, margin, duration all scale

#### `system/dev-console.js`

**Lines 183: Added to Help**

```
sensory           - Show last 20 sensory events
```

**Lines 433-469: Sensory Debug Command**

```
> sensory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ SENSORY EVENT LOG (Last 20 events)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current comfort: Normal | Insane mode: Inactive

🎮 [2:45:30 PM] light (1.00x)
   └─ Menu card selection
   └─ Channel: ui | Pattern: [25]ms

📖 [2:45:32 PM] pulse (0.60x)
   └─ Tori body hop
   └─ Channel: narrative | Pattern: [42, 24, 42]ms

🔥 [2:45:35 PM] denied (raw)
   └─ Locked menu item
   └─ Channel: critical | Pattern: [40, 40, 40, 40, 40]ms
```

#### `ui/carousel-momentum.js`

**Lines 14: Added Game Reference**

```javascript
this.game = config.game || null;  // Optional game instance
```

**Lines 270-276: Replaced Raw Vibrate**

```javascript
// Haptic feedback on snap (light pulse via sensory system)
if (this.game && this.game.triggerSensoryFeedback) {
    this.game.triggerSensoryFeedback('cardSnap', this.cards[clampedIndex], 'Carousel snap');
} else if (navigator.vibrate) {
    // Fallback for standalone usage
    navigator.vibrate(30);
}
```

#### `ui/menu-carousel.js`

**Line 82: Pass Game to CarouselMomentum**

```javascript
game: this.game,  // Pass game instance for haptic feedback
```

### Channel System Explained

**UI Channel** (`ui`)

- User interface interactions
- Button presses, menu selections, carousel snaps
- Scales with comfort intensity
- Examples: buttonPress, menuSelect, cardSnap

**Narrative Channel** (`narrative`)

- Story moments and character actions
- Tori body hops, tether pulls, timeline glitches
- Scales with comfort intensity
- Examples: toriHop, tamaPull, timelineGlitch, codeRipple

**Critical Channel** (`critical`)

- Denials, warnings, harsh feedback
- NEVER scales - always full intensity
- Preserves emotional impact
- Examples: denied, harshDenial

### Comfort Scaling Matrix

| Comfort Level | Multiplier | Haptic Example (50ms) | Visual Duration (0.4s) |
|---------------|------------|-----------------------|------------------------|
| Gentle (0)    | 0.6x       | 30ms                  | 0.24s                  |
| Normal (1)    | 1.0x       | 50ms                  | 0.40s                  |
| Amped (2)     | 1.3x       | 65ms                  | 0.54s                  |

**Critical Channel:** Always 1.0x regardless of comfort setting

### Debounce Behavior

**Anti-Spam Protection:**

- 80ms cooldown between haptic triggers
- Prevents rapid-fire button mashing from overwhelming device
- Can be bypassed with `{ force: true }` option

**Example:**

```javascript
// Rapid calls within 80ms
game.triggerHaptic('light', 'Button 1');  // ✅ Triggers
game.triggerHaptic('light', 'Button 2');  // ❌ Blocked (too soon)
// ... 80ms later ...
game.triggerHaptic('light', 'Button 3');  // ✅ Triggers

// Force through debounce (critical moments)
game.triggerHaptic('denied', 'Critical denial', { force: true });  // ✅ Always triggers
```

### Migration Notes

**Before (scattered raw calls):**

```javascript
// Menu carousel
if (navigator.vibrate) {
    navigator.vibrate(30);
}

// Button click
if (navigator.vibrate) {
    navigator.vibrate([25]);
}

// Denial
if (navigator.vibrate) {
    navigator.vibrate([40, 40, 40, 40, 40]);
}
```

**After (unified sensory system):**

```javascript
// Menu carousel
this.game.triggerSensoryFeedback('cardSnap', targetElement, 'Carousel snap');

// Button click
this.game.triggerSensoryFeedback('buttonPress', buttonElement, 'Button click');

// Denial
this.game.triggerSensoryFeedback('denied', targetElement, 'Locked content');
```

**Benefits:**

- One call handles both haptic + visual
- Automatic comfort scaling
- Debounce protection
- Debug logging
- Easy to add new cues (just update metadata)

---

## Testing & Validation

### Time Machine Testing

**Console Commands:**

```
> tm
> jump 5
> jump 10 force
```

**What to Check:**

- [ ] Snapshots created on scene transitions
- [ ] Smart pruning at 200 entries
- [ ] Insane mode blocks jumps beyond last 2
- [ ] Burned/locked entries show denial feedback
- [ ] Dev console inspector shows correct labels

### Sensory System Testing

**Console Commands:**

```
> sensory
```

**What to Check:**

- [ ] Comfort slider affects haptic intensity
- [ ] Comfort slider affects visual duration
- [ ] Critical cues never scale (test denial)
- [ ] Debounce prevents spam (rapid button clicks)
- [ ] Sensory log shows correct channels
- [ ] Carousel snap uses sensory system

**Test Scenarios:**

1. Set comfort to Gentle → Test button press → Should feel lighter
2. Set comfort to Amped → Test button press → Should feel stronger
3. Test denied cue → Should always feel full strength
4. Rapid-fire buttons → Should debounce after first
5. Check `sensory` log → Should show scale factors

---

## Architecture Benefits

### Time Machine Manager

✅ **Single Source of Truth** for timeline state
✅ **Narrative-First API** (burn, corrupt, lock verbs)
✅ **Layered Impossibility** (hard blocks vs soft blocks)
✅ **Dev-Friendly** (`ignoreRules` flag for testing)
✅ **Easy Debugging** ("why can't I jump here?")

### Sensory System 2.0

✅ **Metadata-Driven** (change behavior without logic changes)
✅ **Channel Separation** (ui/narrative/critical priorities)
✅ **Player Choice Preserved** (comfort scaling respects preferences)
✅ **Critical Moments Protected** (denials always hit hard)
✅ **Debug-Friendly** (sensory log shows full event history)

---

## Code Size Impact

**Lines of Code Added:**

- `time-machine-manager.js`: +420 lines
- `game-engine.js`: +180 lines (helpers + metadata)
- `dev-console.js`: +50 lines (commands)
- `TIME-MACHINE-USAGE.md`: +380 lines (docs)

**Lines of Code Modified:**

- `visual-cue-manager.js`: ~100 lines (channel support)
- `carousel-momentum.js`: ~10 lines (sensory integration)
- `menu-carousel.js`: ~5 lines (pass game reference)

**Total Session Impact:** ~1,145 lines added/modified

**Current Project Size:** ~41,500 lines (excluding comments/docs)

---

## Part 3: Infinite Carousel Loop Fix 🎠

### The Problem

The original carousel was "faking" the loop mathematically but not visually. It was a single linear strip of cards that hit walls at the edges, causing awkward behavior:

1. **Visual Wall**: Scrolling left from the first card hit empty space
2. **Rewind Jank**: Code had to awkwardly snap you to the end
3. **Off-Center Alignment**: Cards aligned to arbitrary points instead of screen center
4. **No Screen Width Awareness**: Fixed positioning didn't account for viewport size

### The Fix: Clone Buffer + Physics Teleportation

#### 1. Visual Loop (The "Clone Trick")

**Updated `menu-carousel.js` to render THREE sets of cards:**

```
[Clone Set] [Real Cards] [Clone Set]
   ↑            ↑             ↑
Pre-Buffer   Middle Set   Post-Buffer
```

- **Set 1 (Left)**: Full clone of all cards (Pre-Buffer)
- **Set 2 (Middle)**: The distinct "Real" cards
- **Set 3 (Right)**: Another clone set (Post-Buffer)

Now when you scroll left from Card #1, you see Card #10 from the clone set - instant visual loop!

#### 2. Physics Teleportation

**Upgraded `carousel-momentum.js` with invisible position tracking:**

```javascript
// If scrolling too far right (into right clones)
if (position > rightBoundary) {
    position -= totalCardsWidth;  // Teleport to middle set
}

// If scrolling too far left (into left clones)
if (position < leftBoundary) {
    position += totalCardsWidth;  // Teleport to middle set
}
```

Because the pixels match perfectly between clone sets, this jump is **invisible to the human eye**, creating true infinite scroll.

#### 3. Perfect Centering

**Passed viewport element into momentum engine:**

```javascript
centerOffset = (ViewportWidth / 2) - (CardWidth / 2)
```

Forces the active card to sit precisely in the middle of the container, regardless of device:

- ✅ Phone (small viewport)
- ✅ Tablet (medium viewport)
- ✅ Ultrawide monitor (massive viewport)

#### 4. Smart Initialization

**Fixed starting position:**

Instead of starting at Index 0 (first clone card on far left), the engine now initializes at `Index = TotalCards`, placing the user safely in the **Middle Set** from the start. This gives buffer room to scroll in either direction immediately.

### Files Modified

- `ui/menu-carousel.js`
  - Renders 3x card sets instead of 1x
  - Passes viewport to momentum engine
  - Initializes at middle set

- `ui/carousel-momentum.js`
  - Added teleportation boundaries
  - Calculates centerOffset from viewport width
  - Invisible position jumps for infinite scroll

### Result

🎯 **True infinite scroll** - no edges, no walls, no jank
🎯 **Perfect centering** - works on any screen size
🎯 **Smooth physics** - teleportation is imperceptible
🎯 **Clean code** - no hacky rewinding logic

---

## Future Enhancements

### Time Machine

- [ ] Persistence to localStorage/save files
- [ ] UI backlog menu (replace old system)
- [ ] Route-specific `goToScene()` implementations
- [ ] Corruption visual effects in backlog UI
- [ ] Timeline branching visualization

### Sensory System

- [ ] Custom vibration patterns per comfort level
- [ ] User-definable haptic profiles
- [ ] Visual intensity scaling beyond duration
- [ ] Accessibility mode (visuals-only, haptics-only)
- [ ] Haptic pattern editor in dev console

---

## Session Stats

**Duration:** ~2 hours
**Features Implemented:** 2 major systems + 1 critical fix
**Files Created:** 2
**Files Modified:** 9 (7 sensory + 2 carousel)
**Lines Added/Modified:** ~1,200+
**Bugs Fixed:** 1 (carousel edge case)
**Coffee Consumed:** Probably too much ☕

### What Got Done

- ✅ Time Machine Manager with smart pruning
- ✅ Sensory System 2.0 with channel-based scaling
- ✅ Dev console commands (tm, jump, sensory)
- ✅ Infinite carousel with clone buffer trick
- ✅ Perfect viewport centering
- ✅ Debounce anti-spam protection
- ✅ Comprehensive documentation

---

**Built with 🖤💚 by UV7 Crew**
Tori's brilliant architecture | DZ's execution | Version 848 ⏰✨
