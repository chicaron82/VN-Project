# 🎯 Visual Cues System - Usage Guide

**Built by UV7 Crew | Tori's brilliant idea** 🖤💚🔥💀

The Visual Cue Manager creates a unified sensory language by pairing visual effects with haptic feedback. This allows you to tell your story through touch + visuals instead of audio.

---

## 🔥 Quick Start

### Basic Usage (Visual Only)

```js
// Trigger just a visual cue
this.game.visualCueManager.trigger('toriHop');
```

### Recommended Usage (Visual + Haptic)

```js
// Trigger both visual and haptic together
this.game.triggerSensoryFeedback('toriHop', targetElement, 'Description for debug');
```

---

## 📋 Available Visual Cues

### Story-Specific Cues

#### `toriHop` - Body Hopping Effect

**Visual:** Double flicker with chromatic aberration
**Haptic:** `pulse` pattern [70, 40, 70]
**Use for:** When Tori jumps between bodies/vessels

```js
this.game.triggerSensoryFeedback('toriHop', this.game.dialogueBox, 'Tori vessel switch');
```

---

#### `tamaPull` - Tether Pull

**Visual:** Quick inward squeeze + sprite ripple
**Haptic:** `medium` [35-50ms]
**Use for:** Tamagotchi tether tugging on her consciousness

```js
this.game.triggerSensoryFeedback('tamaPull', this.game.dialogueBox, 'Tether pulling');
```

---

#### `tamaEmergency` - Emergency Alert

**Visual:** Red warning flash
**Haptic:** `warning` [100, 50, 100, 50, 100]
**Use for:** Critical moments, danger, body dying

```js
this.game.triggerSensoryFeedback('tamaEmergency', null, 'Body critical');
```

---

#### `timelineGlitch` - Reality Break

**Visual:** Timeline distortion with scan lines
**Haptic:** `glitch` [10, 20, 5, 30, 15]
**Use for:** Loop resets, timeline instability, reality glitches

```js
this.game.triggerSensoryFeedback('timelineGlitch', null, 'Timeline fracture');
```

---

#### `codeRipple` - Code Particles

**Visual:** Burst of "0", "1", "8", "4" particles
**Haptic:** `double` [25, 50, 25]
**Use for:** Digital connections, code interactions, Tamagotchi activations

```js
this.game.triggerSensoryFeedback('codeRipple', this.game.dialogueBox, 'Code activation');
```

---

### UI Interaction Cues

#### `buttonPress` - Button Feedback

**Visual:** Scale down + micro-glow
**Haptic:** `light` [10ms]
**Use for:** Button presses, UI interactions

```js
button.addEventListener('click', () => {
    this.game.triggerSensoryFeedback('buttonPress', button, 'Button clicked');
});
```

---

#### `menuSelect` - Menu Selection

**Visual:** Glow pulse
**Haptic:** `light` [10ms]
**Use for:** Menu item selections

```js
this.game.triggerSensoryFeedback('menuSelect', menuItem, 'Menu item selected');
```

---

#### `cardSnap` - Carousel Snap

**Visual:** Scale pop
**Haptic:** `medium` [25ms]
**Use for:** Carousel card snapping into place

```js
this.game.triggerSensoryFeedback('cardSnap', card, 'Card snapped');
```

---

## 🎨 Design Philosophy

### Why Visual Cues?

1. **Accessibility** - Not all players can feel haptics (desktop, iOS limitations)
2. **Reinforcement** - Visual + haptic together = stronger emotional impact
3. **Unique Style** - Creates a signature sensory language for Version 848
4. **No Audio Needed** - You're building immersion through touch + visuals

### The Visual-Haptic Language

Players will learn to associate:

- **Buzz Buzz** = dimensional hop (toriHop)
- **Single buzz** = tether tug (tamaPull)
- **Micro flash** = glitch ripple (codeRipple)
- **Double flicker** = timeline instability (timelineGlitch)

This builds a **unique sensory vocabulary** that becomes part of your VN's identity.

---

## 🛠️ Advanced Usage

### Creating Custom Timing

```js
// Trigger visual first, then haptic after delay
this.game.visualCueManager.trigger('toriHop');
setTimeout(() => {
    this.game.triggerHaptic('pulse', 'Delayed haptic');
}, 100);
```

### Targeting Specific Elements

```js
// Target sprite instead of dialogue box
const sprite = document.querySelector('.sprite-right');
this.game.triggerSensoryFeedback('codeRipple', sprite, 'Sprite effect');
```

### Visual Only (No Haptic)

```js
// When you want visual feedback but no vibration
this.game.visualCueManager.trigger('timelineGlitch');
```

---

## 🎮 Comfort Mode Support

Visual cues automatically respect comfort mode:

```js
// In visual-cues.css
body[data-comfort-mode="true"] .chromatic-split,
body[data-comfort-mode="true"] .timeline-glitch {
    animation: none !important;
    opacity: 0 !important;
}
```

When comfort mode is enabled:

- Glitch effects are disabled
- Chromatic aberration removed
- Only gentle pulses remain

---

## 📱 Prefers Reduced Motion

The system respects OS-level motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
    .chromatic-split,
    .timeline-glitch {
        animation-duration: 0.1s;
        opacity: 0.5;
    }
}
```

---

## 🔍 Debug Mode

When debug mode is enabled, sensory feedback logs to console:

```
🎯 Sensory feedback: toriHop (haptic: pulse)
✨ Visual cue triggered: toriHop
📳 Haptic: pulse - Tori vessel switch [70, 40, 70]
```

---

## 💡 Best Practices

### DO

✅ Use `triggerSensoryFeedback()` for unified haptic + visual
✅ Match visual intensity to story moment (gentle ripple vs emergency flash)
✅ Target specific elements when possible (sprites, dialogue box)
✅ Add descriptive labels for debug mode

### DON'T

❌ Overuse effects (becomes distracting)
❌ Use emergency effects for minor moments
❌ Forget to test on desktop (no haptics, visual-only experience)
❌ Stack multiple effects without delays (creates chaos)

---

## 🎯 Examples from Routes

### Tamagotchi First Pickup (Prologue)

```js
scene1_pickup() {
    // Code ripple when picking up modified Tamagotchi
    if (this.game.triggerSensoryFeedback) {
        this.game.triggerSensoryFeedback('codeRipple', this.game.dialogueBox, 'Tamagotchi pickup - first connection');
    }

    this.game.displayScene({
        character: 'Tori',
        dialogue: '...Weird. Mine has never done that before.',
        // ...
    });
}
```

### Body Emergency (Ronnie Route Act 3)

```js
scene_bodyDying() {
    // Emergency flash when body is critical
    if (this.game.triggerSensoryFeedback) {
        this.game.triggerSensoryFeedback('tamaEmergency', null, 'Body critical - emergency');
    }

    this.game.displayScene({
        character: 'Tori',
        dialogue: 'Ronnie! I can feel it... this body is dying!',
        // ...
    });
}
```

### Timeline Glitch (Loop Events)

```js
loopReset() {
    // Reality glitch when loop resets
    if (this.game.triggerSensoryFeedback) {
        this.game.triggerSensoryFeedback('timelineGlitch', null, 'Loop reset - timeline fracture');
    }

    // ... loop reset logic
}
```

---

## 🖤 Credits

**Designed by:** Tori (the brilliant wife-who-also-happens-to-be-your-UI-engineer 💚)
**Implemented by:** DiZee & UV7 Crew
**Inspired by:** 3am thoughts and no audio constraints

> "You'll create sensations more immersive than many sound-enabled VNs."
> — Tori

---

## 📚 File Locations

- **Manager:** `system/visual-cue-manager.js`
- **Styles:** `visual-cues.css`
- **Integration:** `system/game-engine.js` (triggerSensoryFeedback method)
- **This Guide:** `docs/VISUAL-CUES-GUIDE.md`

---

**Ready to build your visual-haptic language!** 🔥💀🖤
