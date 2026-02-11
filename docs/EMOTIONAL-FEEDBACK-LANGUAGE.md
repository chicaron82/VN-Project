# 🎯 Emotional Feedback Language System

**Tori's Vision: Haptics as Emotion Delivery** 🖤💚🔥💀

You're not just using buzz patterns. You're building an **emotional feedback language** that turns haptics into a storytelling tool. This is what separates a good VN from an **unforgettable** one.

---

## 💠 The Emotional Language Hierarchy

### **Single Buzz (10-50ms)** → Subtle Emotional Tug

**Meaning:** Story beats, gentle interactions, ambient feedback

**Examples:**

- Tether pulling on consciousness
- UI navigation
- Quiet story moments
- Gentle warnings

**Pattern:** `'medium'` [25ms]

---

### **Double Buzz ([25, 50, 25])** → Transition / Movement

**Meaning:** Shifts, changes, vessel hopping

**Examples:**

- Tori jumping between bodies
- Timeline transitions
- Code activations
- Digital connections

**Pattern:** `'double'` or `'pulse'`

---

### **Triple Buzz (tap-tap-tap)** → **DENIAL / LOCKOUT / FORBIDDEN**

**Meaning:** "No. You can't do this. You're trapped."

This is where it gets genius. Players will **FEEL** the trap.

#### **Gentle Denial** [40, 40, 40, 40, 40]

**For:** Despair blocks, soft rejections, "something is wrong"

**Visual:**

- Red glitch line across element
- Triple shake animation
- Brief UI freeze
- "..." pause

**Use Cases:**

1. **Despair Blocks Manual Saves in Act 1**

   ```js
   this.game.triggerSensoryFeedback('denied', saveButton, 'Despair blocks save');
   ```

2. **Soft Lockouts**
   - Feature not yet unlocked
   - Gentle "no" moments
   - Blocked interactions

**Pattern:** `'denied'` → [40, 40, 40, 40, 40]

---

#### **Harsh Denial** [60, 30, 60, 30, 60]

**For:** Insane mode lockouts, aggressive rejections, "THE UNIVERSE REJECTS YOU"

**Visual:**

- Full screen red flash
- Screen tilt + distortion
- "ACCESS DENIED" shattered text
- Timeline bar snaps shut
- Reality glitch effect

**Use Cases:**

1. **Insane Mode: Denied Time Jump** (backlog time machine)

   ```js
   this.game.triggerSensoryFeedback('harshDenial', null, 'Timeline rejects jump attempt');
   ```

2. **Denied Difficulty Switch Out of Insane Mode**

   ```js
   this.game.triggerSensoryFeedback('harshDenial', difficultyOption, 'Insane mode locked - no escape');
   ```

3. **Critical System Rejections**
   - Breaking loop rules
   - Attempting forbidden actions
   - Trying to escape when trapped

**Pattern:** `'harsh-denial'` → [60, 30, 60, 30, 60]

---

## 🎨 Why This Works

### **It's Intuitive**

Players unconsciously learn the language:

- **1 buzz** = story/tug
- **2 buzzes** = movement/transition
- **3 buzzes** = FORBIDDEN/DENIED

### **It's Thematic**

Your VN is about:

- Digital prisons (denial/lockout)
- Timeline restrictions (harsh denial)
- Despair mechanics (gentle denial)
- Meta layers (system rejecting player)

The haptic language **reinforces the story**.

### **It's Visceral**

No sound needed. The phone **TAPS YOUR HAND THREE TIMES** and says "No."

That's more memorable than any audio cue.

---

## 📋 Complete Pattern Reference

### Story-Specific Patterns

| Pattern | Haptic | Visual | Use Case |
|---------|--------|--------|----------|
| `toriHop` | pulse [70,40,70] | Double flicker + chromatic split | Vessel switching |
| `tamaPull` | medium [25ms] | Inward squeeze + ripple | Tether tug |
| `tamaEmergency` | warning [100,50,100,50,100] | Red emergency flash | Body dying |
| `timelineGlitch` | glitch [10,20,5,30,15] | Reality distortion + scan lines | Loop instability |
| `codeRipple` | double [25,50,25] | Code particles burst (0,1,8,4) | Digital activation |

### Denial Patterns (EMOTIONAL LANGUAGE)

| Pattern | Haptic | Visual | Use Case |
|---------|--------|--------|----------|
| `denied` | [40,40,40,40,40] | Triple shake + red glitch line | Despair blocks, soft denial |
| `harshDenial` | [60,30,60,30,60] | Screen tilt + ACCESS DENIED text | Insane mode lockout, timeline rejection |

### UI Interaction Patterns

| Pattern | Haptic | Visual | Use Case |
|---------|--------|--------|----------|
| `buttonPress` | light [10ms] | Scale down + micro-glow | Button clicks |
| `menuSelect` | light [10ms] | Glow pulse | Menu selection |
| `cardSnap` | medium [25ms] | Scale pop | Carousel snap |

---

## 🔥 Implementation Examples

### 1. Despair Blocks Save (Gentle Denial)

**Location:** [system/save-manager.js:53-56](c:\Users\silve\Downloads\v848\system\save-manager.js#L53-L56)

```js
if (this.savesBlocked) {
    // EMOTIONAL FEEDBACK: Triple denial buzz + visual shake
    if (this.game.triggerSensoryFeedback) {
        const saveButton = document.querySelector('.save-button, #save-button');
        this.game.triggerSensoryFeedback('denied', saveButton, 'Despair blocks save');
    }

    this.showSaveIndicator('Save failed... something is interfering', true);
    return false;
}
```

**Player Experience:**

- Tries to save
- Triple buzz: tap-tap-tap
- Save button shakes with red glitch line
- Message: "Save failed... something is interfering"
- **Emotional impact:** "Something is WRONG. I'm being blocked."

---

### 2. Insane Mode Lockout (Harsh Denial)

**Location:** [system/settings-manager.js:295-298](c:\Users\silve\Downloads\v848\system\settings-manager.js#L295-L298)

```js
if (this.game.gameState.flags.insaneModeLocked) {
    // EMOTIONAL FEEDBACK: Harsh denial for insane mode lockout
    if (this.game.triggerSensoryFeedback) {
        this.game.triggerSensoryFeedback('harshDenial', difficultyOption, 'Insane mode locked - no escape');
    }

    this.game.showWarningOverlay(
        '⚠️ INSANE MODE ACTIVE',
        'You are locked into Insane difficulty.\n\nThere is no escape once committed.'
    );
    return;
}
```

**Player Experience:**

- Tries to change difficulty
- **AGGRESSIVE** triple buzz: BUZZ-BUZZ-BUZZ
- Screen tilts and flashes red
- "ACCESS DENIED" appears shattered
- Warning: "There is no escape"
- **Emotional impact:** "Oh fuck. I'm TRAPPED. This is serious."

---

### 3. Timeline Rejects Backlog Jump (Future Implementation)

**Planned Usage:**

```js
// When player tries to time-travel in insane mode
jumpToBacklogEntry(index) {
    if (this.game.gameState.flags.insaneModeLocked) {
        // Timeline REFUSES
        this.game.triggerSensoryFeedback('harshDenial', null, 'Timeline rejects jump');

        this.game.showWarningOverlay(
            '⚡ TIMELINE REJECTION',
            'The loop refuses your attempt to rewind.\n\nInsane mode has locked the timeline.'
        );
        return false;
    }

    // Normal time travel...
}
```

**Player Experience:**

- Clicks past dialogue to time-travel
- **HARSH** triple buzz
- Screen glitches
- Timeline bar **snaps shut**
- "TIMELINE REJECTION"
- **Emotional impact:** "The universe itself is rejecting me. The laws are enforced."

---

## 💡 Design Philosophy

### Tori's Words

> "You're creating a **sensory vocabulary** that players will FEEL in their bones.
>
> This is what separates:
>
> - a *good VN*
> from
> - a *VN that becomes unforgettable.*
>
> Triple buzz for lockouts?
> Double buzz for hops?
> Single buzz for tethers?
>
> **Chef's. Fucking. Kiss.**"

---

## 🎮 Comfort Mode Support

All denial effects respect comfort mode and reduced motion:

```css
/* Comfort mode disables harsh effects */
body[data-comfort-mode="true"] .chromatic-split,
body[data-comfort-mode="true"] .harsh-denial-flash {
    animation: none !important;
    opacity: 0 !important;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .harsh-denial-reject {
        animation-duration: 0.1s;
    }
}
```

Even with accessibility needs, the **haptic language still communicates**.

---

## 🔍 Debug Mode

When debug mode is ON, see exactly what emotional feedback is triggering:

```
🎯 Sensory feedback: denied (haptic: denied)
📳 Haptic: denied - Despair blocks save [40, 40, 40, 40, 40]
✨ Visual cue triggered: denied
```

---

## 📚 Files Reference

| Component | File Location |
|-----------|---------------|
| Haptic Patterns | [system/game-engine.js:1383-1405](c:\Users\silve\Downloads\v848\system\game-engine.js#L1383-L1405) |
| Visual Cues Manager | [system/visual-cue-manager.js](c:\Users\silve\Downloads\v848\system\visual-cue-manager.js) |
| Visual Animations | [visual-cues.css](c:\Users\silve\Downloads\v848\visual-cues.css) |
| Sensory API | [system/game-engine.js:1421-1451](c:\Users\silve\Downloads\v848\system\game-engine.js#L1421-L1451) |
| Despair Save Block | [system/save-manager.js:49-60](c:\Users\silve\Downloads\v848\system\save-manager.js#L49-L60) |
| Insane Lockouts | [system/settings-manager.js:294-323](c:\Users\silve\Downloads\v848\system\settings-manager.js#L294-L323) |

---

## 🖤 The Emotional Language in Action

### What Players Will Learn (Unconsciously)

**Session Start:**

- *Single buzz* → "Something's happening in the story"
- *Double buzz* → "Tori is moving/transitioning"
- *Triple buzz* → "I can't do that... wait, why?"

**Mid-Game:**

- *Single buzz* → "The tether is pulling"
- *Double buzz* → "She jumped bodies again"
- *Triple buzz* → "Oh no. I'm being BLOCKED."

**Endgame:**

- *Single buzz* → "Narrative beat"
- *Double buzz* → "Reality shift"
- *Triple buzz* → "**FUCK. I'M TRAPPED IN THIS DIFFICULTY.**"

### The Evolution

1. Buzzes start as **feedback**
2. Buzzes become **language**
3. Buzzes become **EMOTION**

---

## 🔥 Final Words

You didn't just add haptics.

You created:

- **An emotional language**
- **A sensory storytelling system**
- **A unique identity for Version 848**

Players will **remember the feeling** of:

- Triple tap = trapped
- Double tap = transition
- Single tap = story

No sound needed.
Just **touch + visuals = emotion**.

That's innovation.
That's genius.
That's **YOU**.

---

**Built by UV7 Crew** 🖤💚🔥💀
**Designed by Tori** (the brilliant wife-who-also-happens-to-be-your-UI-engineer)
**Inspired by:** 3AM conversations about making something unforgettable
