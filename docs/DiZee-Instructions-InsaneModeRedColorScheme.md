# DiZee Instructions: Insane Mode Red Color Scheme

## OVERVIEW

In Insane Mode, change UI color scheme from cyan (#0ff) to red (#ff0066) to reinforce the horror/corruption aesthetic. Color scheme should dynamically activate when Insane Mode is active and revert to cyan when Insane Mode ends.

**Thematic reasoning:** Cyan = stable digital space. Red = corrupted hostile system.

---

## IMPLEMENTATION STRATEGY

Use a class-based approach:

1. Add `insane-mode-active` class to game container when Insane Mode starts
2. Remove class when Insane Mode ends
3. CSS overrides all cyan UI elements to red when class is present

---

## PART 1: JAVASCRIPT - CLASS MANAGEMENT

### FILE: `system/game-engine.js`

### Location 1: When Insane Mode Activates (startRoute)

Find the Insane Mode restoration block (approximately line 1096-1110).

**CURRENT CODE:**

```javascript
if (insaneLocked) {
    // Restore Insane Mode flags to gameState
    if (!this.gameState.flags) {
        this.gameState.flags = {};
    }
    this.gameState.flags.insaneModeActive = true;
    this.gameState.flags.insaneModeLocked = true;
    console.log('💀 Insane Mode restored from localStorage');

    // Trigger initial visual corruption on route start
    if (this.triggerInsaneVisuals) {
        this.triggerInsaneVisuals();
    }
}
```

**ADD THIS** after the `triggerInsaneVisuals()` call (before the closing brace):

```javascript
    // ZEE'S FIX: Apply Insane Mode color scheme (cyan → red) 🖤
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.add('insane-mode-active');
        console.log('🔴 Insane Mode color scheme activated');
    }
}
```

---

### Location 2: When Insane Mode Ends

Need to remove the class when:

- Player returns to main menu
- Player completes/fails route
- Player loads a non-Insane save

**ADD NEW METHOD** to GameEngine class (place near other Insane Mode methods around line 4600):

```javascript
deactivateInsaneMode() {
    console.log('💚 Deactivating Insane Mode color scheme');
    
    // Remove visual class
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.remove('insane-mode-active');
    }
    
    // Optional: Remove corruption styling
    if (this.dialogueBox) {
        this.dialogueBox.classList.remove('corruption-intense');
    }
}
```

---

### Location 3: Call Deactivation When Appropriate

**A. When returning to main menu** (find `returnToMainMenu` method, approximately line 3800-3850):

ADD this line near the start of the function:

```javascript
returnToMainMenu() {
    this.deactivateInsaneMode(); // ZEE: Revert color scheme 🖤
    
    // ... rest of existing code ...
}
```

**B. When loading saves** (find save restoration logic, approximately line 770-820 in save-manager.js):

After restoring gameState, check if Insane Mode is active:

```javascript
// After restoring state, check if Insane needs color scheme
if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.add('insane-mode-active');
    }
} else {
    // Make sure it's deactivated if loading non-Insane save
    this.game.deactivateInsaneMode();
}
```

---

## PART 2: CSS - COLOR OVERRIDES

### FILE: `styles.css`

### Location: Add new section after Insane Mode cage overlay styles (approximately line 5550+)

**ADD THIS ENTIRE SECTION:**

```css
/* ========================================
   INSANE MODE: RED COLOR SCHEME OVERRIDE
   ZEE'S FIX: Cyan → Red when Insane Mode active 🖤
   ========================================== */

/* Choice buttons - red borders and text */
.insane-mode-active .choice-option {
    border-color: #ff0066 !important;
    color: #ff0066 !important;
}

.insane-mode-active .choice-option:hover {
    background: rgba(255, 0, 102, 0.2) !important;
    box-shadow: 0 0 20px rgba(255, 0, 102, 0.5) !important;
    border-color: #ff0066 !important;
}

.insane-mode-active .choice-option.locked {
    border-color: #660033 !important;
    color: #660033 !important;
}

/* UI Buttons - pause, skip, notes, backlog */
.insane-mode-active #pause-button,
.insane-mode-active #skip-button,
.insane-mode-active #notes-button,
.insane-mode-active #backlog-button {
    color: #ff0066 !important;
    border-color: #ff0066 !important;
}

.insane-mode-active #pause-button:hover,
.insane-mode-active #skip-button:hover,
.insane-mode-active #notes-button:hover,
.insane-mode-active #backlog-button:hover {
    background: rgba(255, 0, 102, 0.2) !important;
    box-shadow: 0 0 15px rgba(255, 0, 102, 0.5) !important;
}

/* Settings button highlights */
.insane-mode-active .setting-button.active,
.insane-mode-active .mode-button.active {
    border-color: #ff0066 !important;
    color: #ff0066 !important;
    box-shadow: 0 0 10px rgba(255, 0, 102, 0.3) !important;
}

/* Tether UI - red from the start instead of cyan */
.insane-mode-active #tether-fill {
    background: linear-gradient(90deg, #ff0066, #ff0033) !important;
}

.insane-mode-active #tether-text {
    color: #ff0066 !important;
    text-shadow: 0 0 10px #ff0066 !important;
}

/* Character name box */
.insane-mode-active #character-name {
    border-color: #ff0066 !important;
    color: #ff0066 !important;
}

/* Dialogue box border accents */
.insane-mode-active #dialogue-box {
    border-color: rgba(255, 0, 102, 0.3) !important;
}

/* Internal thought bubbles */
.insane-mode-active .internal-thought {
    border-color: #ff0066 !important;
    color: #ff0066 !important;
}

/* Save/Load UI elements */
.insane-mode-active .save-slot:hover {
    border-color: #ff0066 !important;
    box-shadow: 0 0 15px rgba(255, 0, 102, 0.3) !important;
}

.insane-mode-active .mode-button:hover {
    border-color: #ff0066 !important;
    background: rgba(255, 0, 102, 0.1) !important;
}

/* Menu button hover states */
.insane-mode-active .menu-button:hover {
    border-color: #ff0066 !important;
    color: #ff0066 !important;
    box-shadow: 0 0 20px rgba(255, 0, 102, 0.5) !important;
}

/* Text selection highlight */
.insane-mode-active ::selection {
    background: rgba(255, 0, 102, 0.3) !important;
    color: #fff !important;
}

.insane-mode-active ::-moz-selection {
    background: rgba(255, 0, 102, 0.3) !important;
    color: #fff !important;
}

/* Links and interactive text */
.insane-mode-active a,
.insane-mode-active .clickable-text {
    color: #ff0066 !important;
}

.insane-mode-active a:hover,
.insane-mode-active .clickable-text:hover {
    color: #ff0033 !important;
    text-shadow: 0 0 10px #ff0066 !important;
}

/* Settings tabs/sections */
.insane-mode-active .tab-button.active {
    border-bottom-color: #ff0066 !important;
    color: #ff0066 !important;
}

/* Backlog items */
.insane-mode-active .backlog-entry:hover {
    background: rgba(255, 0, 102, 0.1) !important;
    border-left-color: #ff0066 !important;
}

/* Notes viewer */
.insane-mode-active .note-item {
    border-left-color: #ff0066 !important;
}

.insane-mode-active .note-item:hover {
    background: rgba(255, 0, 102, 0.05) !important;
}

/* Route select buttons (if somehow accessed) */
.insane-mode-active .route-button:hover {
    border-color: #ff0066 !important;
    box-shadow: 0 0 30px rgba(255, 0, 102, 0.6) !important;
}

/* Time Machine navigation (read-only in Insane) */
.insane-mode-active .time-machine-scene:hover {
    border-color: #ff0066 !important;
    background: rgba(255, 0, 102, 0.05) !important;
}

/* ZEE'S NOTE: All overrides use !important to ensure they take
   precedence over default cyan styling. When insane-mode-active
   class is removed, everything reverts to normal cyan. 🖤 */
```

---

## TESTING CHECKLIST

### Test Activation

1. Main Menu → Settings → Commit to Insanity
2. Route starts
3. **Expected:** All UI elements red (choices, buttons, highlights)
4. Console shows: "🔴 Insane Mode color scheme activated"
5. Verify during gameplay:
   - Choice buttons = red borders
   - Pause button = red
   - Notes button = red
   - Tether meter = red
   - All interactive elements = red

### Test Deactivation

1. Complete Insane Mode route (any ending)
2. Return to main menu
3. **Expected:** All UI elements revert to cyan
4. Console shows: "💚 Deactivating Insane Mode color scheme"

### Test Save/Load

1. Save during Insane Mode
2. Return to menu (colors revert to cyan)
3. Load Insane Mode save
4. **Expected:** Colors return to red
5. Load non-Insane save
6. **Expected:** Colors stay cyan

### Test Normal Mode (Sanity Check)

1. Start route in Normal/Intense difficulty
2. **Expected:** All UI remains cyan
3. **Expected:** No red color scheme applied

---

## EDGE CASES HANDLED

**Case 1: Player loads non-Insane save while in Insane Mode**

- Deactivation is called during save load
- Colors revert to cyan

**Case 2: Player returns to menu from Insane Mode**

- Deactivation called in `returnToMainMenu()`
- Colors revert to cyan

**Case 3: Player completes Insane Mode and immediately starts new game**

- Class is removed when returning to menu
- New game starts with cyan colors

**Case 4: Class persists after reload**

- On page load, no class is added until Insane Mode actually activates
- Fresh start always = cyan

---

## WHAT CHANGES

### Before

- All UI = cyan regardless of difficulty
- Insane Mode only differs by mechanics (no Hold On, tether cap)
- Visual corruption is temporary effects only

### After

- Normal modes = cyan UI (stable, safe)
- Insane Mode = red UI (hostile, corrupted)
- Color scheme reinforces narrative of system breakdown
- Dynamic activation/deactivation based on mode state

---

## CRITICAL REQUIREMENTS

### DO NOT

- ❌ Apply red colors to Normal/Intense modes
- ❌ Make color changes permanent (must be class-based)
- ❌ Forget to remove class when mode ends
- ❌ Apply red to non-UI elements (dialogue text, narration)

### DO

- ✅ Use `!important` to override default cyan styling
- ✅ Add class when Insane Mode activates
- ✅ Remove class when Insane Mode ends
- ✅ Handle save/load color scheme restoration
- ✅ Only recolor UI/interactive elements
- ✅ Keep regular dialogue/narration text as-is

---

**Priority:** MEDIUM (thematic enhancement, not critical)  
**Complexity:** LOW-MEDIUM (class management + CSS overrides)  
**Risk:** LOW (purely visual, easily reversible)

---

**ZEE'S SUMMARY:**
This transforms Insane Mode from "mechanically harder" to "visually hostile." The red UI reinforces that EVERYTHING is corrupted - not just the tether system or dialogue box, but the entire interface itself. Player sees the danger reflected in every interaction. 🖤🔥💀
