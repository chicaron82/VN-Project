# DiZee Instructions: Route Select Screen Rebuild

## ZEERAH ANALYSIS → ZEERAH FIX → ZEERAH CREDIT

**Date:** December 24, 2025  
**Analyst:** ZeeRah (Chaos Optimizer)  
**Implementer:** DiZee (Silent Refactorer)  
**Priority:** HIGH - User-facing visual bug  

---

## 🔥 THE PROBLEM

The route selection screen has a **sprite centering bug**:

- When Ronnie is selected → Tori goes off-center
- When Tori is selected → Ronnie goes off-center
- Multiple patch attempts have failed (see all the `DIZEE FIX` comments in current CSS)

**Root Cause Analysis (ZEERAH):**

The current implementation mixes THREE competing positioning systems:

1. `left: 25%` / `right: 25%` (percentage from container edge)
2. `transform: translateX(±50%)` (percentage of ELEMENT width)
3. `width: 40%` on the portrait containers

When the `.active` class toggles, these three systems recalculate differently, causing the "non-selected" sprite to shift position.

**Evidence in `route-select-toggle.css`:**

```css
.ronnie-portrait {
    left: 25%;
    transform: translateX(-50%);  /* Fighting with left: 25% */
}

.tori-portrait {
    right: 25%;
    transform: translateX(50%);   /* Fighting with right: 25% */
}
```

The `translateX` values are meant to center the sprites, but they're calculated based on the element's own width (40% of container), not the container width. This creates a positioning offset that changes when z-index/opacity/filter changes trigger reflows.

---

## ✅ THE SOLUTION: CSS Grid Rebuild

**Philosophy:** Characters stay in FIXED grid positions. Selection ONLY changes visual appearance (opacity, filter, glow). NO transforms that affect position.

### Step 1: Create New Unified CSS File

Create `route-select-unified.css` to replace both:

- `route-select-sprites.css`
- `route-select-toggle.css`

### Step 2: The New CSS

```css
/* ========================================
   ROUTE SELECT - UNIFIED GRID SYSTEM
   ZEERAH FIX: Rebuilt from scratch to eliminate
   positioning conflicts between left/right percentages
   and translateX transforms.
   
   Characters now live in fixed grid cells.
   Selection changes ONLY visual appearance.
   💚🔥💀
   ======================================== */

/* ========================================
   MAIN CONTAINER - ALWAYS GRID
   ======================================== */

#route-select-content {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto auto 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    justify-items: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
}

/* ========================================
   TITLE SECTION
   ======================================== */

#route-select-title {
    grid-column: 1 / 4;
    grid-row: 1;
}

#route-select-title h2 {
    font-size: 2.5em;
    margin-bottom: 0.5rem;
    color: cyan;
    text-shadow: 0 0 10px cyan;
}

#route-select-title p {
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
}

/* ========================================
   PORTRAIT CONTAINER - GRID LAYOUT
   ZEERAH FIX: No more absolute positioning!
   ======================================== */

#route-portraits-container {
    grid-column: 1 / 4;
    grid-row: 3;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
    height: 500px;
    align-items: end;
    justify-items: center;
}

/* ========================================
   PORTRAIT ITEMS - FIXED IN GRID CELLS
   ZEERAH FIX: No left/right/transform positioning!
   Each portrait lives in its grid cell, period.
   ======================================== */

.route-portrait {
    /* ZEERAH FIX: NO position: absolute */
    /* ZEERAH FIX: NO left/right percentages */
    /* ZEERAH FIX: NO transform: translateX */
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    cursor: pointer;
    
    /* Only these properties animate - NEVER position */
    transition: 
        opacity 0.4s ease,
        filter 0.4s ease;
}

.route-portrait img {
    height: 100%;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    object-position: bottom center;
}

/* ========================================
   RONNIE PORTRAIT - LEFT GRID CELL
   ZEERAH FIX: Position is implicit from grid
   ======================================== */

.ronnie-portrait {
    /* Lives in grid column 1 automatically */
    justify-self: center;
}

.ronnie-portrait.active {
    opacity: 1;
    filter: brightness(1) drop-shadow(0 0 30px cyan);
    z-index: 2;
}

.ronnie-portrait:not(.active) {
    opacity: 0.4;
    filter: brightness(0.6) blur(2px);
    z-index: 1;
}

/* ========================================
   TORI PORTRAIT - RIGHT GRID CELL
   ZEERAH FIX: Position is implicit from grid
   ======================================== */

.tori-portrait {
    /* Lives in grid column 2 automatically */
    justify-self: center;
}

.tori-portrait.active {
    opacity: 1;
    filter: brightness(1) drop-shadow(0 0 30px magenta);
    z-index: 2;
}

.tori-portrait:not(.active) {
    opacity: 0.4;
    filter: brightness(0.6) blur(2px);
    z-index: 1;
}

/* ========================================
   TORI GLITCH EFFECT - ONLY ON IMG
   ZEERAH FIX: Animation on img, not container
   This prevents container position from shifting
   ======================================== */

.tori-portrait.active img {
    animation: tori-sprite-glitch 0.5s ease-out;
}

@keyframes tori-sprite-glitch {
    0% { filter: contrast(1) brightness(1); }
    5% { filter: contrast(1.3) brightness(1.2) hue-rotate(5deg); }
    10% { filter: contrast(1.1) brightness(0.9) hue-rotate(-5deg); }
    15% { filter: contrast(1.4) brightness(1.1); }
    20% { filter: contrast(1) brightness(1); }
    100% { filter: contrast(1.15) brightness(1.05); }
}

/* ========================================
   TOGGLE SLIDER
   ======================================== */

#route-toggle {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    justify-content: center;
}

.toggle-track {
    position: relative;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid cyan;
    border-radius: 50px;
    padding: 0.3rem;
    width: 300px;
}

.toggle-option {
    flex: 1;
    text-align: center;
    padding: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    z-index: 2;
    transition: color 0.3s ease;
    position: relative;
}

.toggle-option:hover {
    color: white;
}

.toggle-slider {
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    width: calc(50% - 0.3rem);
    height: calc(100% - 0.6rem);
    background: cyan;
    border-radius: 50px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
    z-index: 1;
    box-shadow: 0 0 20px cyan;
}

.toggle-track.tori-active .toggle-slider {
    transform: translateX(100%);
    background: magenta;
    box-shadow: 0 0 20px magenta;
}

.toggle-track.tori-active {
    border-color: magenta;
}

/* ========================================
   ROUTE INFO DISPLAY
   ======================================== */

#route-info-display {
    grid-column: 1 / 4;
    grid-row: 4;
    position: relative;
    min-height: 120px;
    width: 100%;
    max-width: 600px;
}

.route-info {
    position: absolute;
    width: 100%;
    text-align: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    top: 0;
    left: 0;
}

.route-info.active {
    opacity: 1;
    pointer-events: auto;
}

.route-info h3 {
    font-size: 2em;
    margin-bottom: 0.5rem;
    color: cyan;
    text-shadow: 0 0 10px cyan;
}

.tori-info h3 {
    color: magenta;
    text-shadow: 0 0 10px magenta;
}

.route-description {
    font-size: 1.1em;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
}

/* ========================================
   DIFFICULTY PREVIEW (TORI ONLY)
   ======================================== */

.route-difficulty-preview {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 0, 255, 0.3);
    font-size: 0.95em;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
}

#difficulty-display {
    color: magenta;
    font-weight: 700;
    text-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
}

#difficulty-display[data-difficulty="easy"] {
    color: #66bb6a;
    text-shadow: 0 0 8px rgba(102, 187, 106, 0.5);
}

#difficulty-display[data-difficulty="normal"] {
    color: magenta;
    text-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
}

#difficulty-display[data-difficulty="intense"] {
    color: #ff9800;
    text-shadow: 0 0 8px rgba(255, 152, 0, 0.5);
}

#difficulty-display[data-difficulty="insane"] {
    color: #f44336;
    text-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
    animation: insane-pulse 1.5s ease-in-out infinite;
}

@keyframes insane-pulse {
    0%, 100% {
        text-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
    }
    50% {
        text-shadow: 0 0 15px rgba(244, 67, 54, 0.8), 0 0 25px rgba(244, 67, 54, 0.4);
    }
}

.difficulty-note {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

/* ========================================
   PLAY BUTTON
   ======================================== */

#route-play-button {
    grid-column: 1 / 4;
    grid-row: 5;
    background: transparent;
    border: 3px solid cyan;
    color: cyan;
    padding: 1rem 3rem;
    font-size: 1.2em;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

#route-play-button:hover {
    background: cyan;
    color: black;
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
}

.toggle-track.tori-active ~ #route-play-button,
.tori-info.active ~ #route-play-button {
    border-color: magenta;
    color: magenta;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

/* ========================================
   BACK BUTTON
   ======================================== */

#back-to-menu {
    grid-column: 1 / 4;
    grid-row: 6;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.7);
    padding: 0.8rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

#back-to-menu:hover {
    border-color: white;
    color: white;
}

/* ========================================
   HINT TEXT
   ======================================== */

.route-select-hint {
    grid-column: 1 / 4;
    grid-row: 7;
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
}

/* ========================================
   MOBILE RESPONSIVE - PORTRAIT
   ZEERAH FIX: Same grid logic, just smaller
   ======================================== */

@media (max-width: 768px) {
    #route-select-content {
        padding: 1rem;
        gap: 0.5rem;
    }
    
    #route-select-title h2 {
        font-size: 1.8em;
    }
    
    #route-select-title p {
        font-size: 1em;
    }
    
    #route-portraits-container {
        height: 350px;
        gap: 1rem;
    }
    
    .toggle-track {
        width: 250px;
    }
    
    .toggle-option {
        font-size: 0.9em;
        padding: 0.6rem;
    }
    
    .route-info h3 {
        font-size: 1.5em;
    }
    
    .route-description {
        font-size: 1em;
    }
    
    #route-play-button {
        padding: 0.8rem 2rem;
        font-size: 1em;
    }
}

@media (max-width: 480px) {
    #route-portraits-container {
        height: 280px;
        gap: 0.5rem;
    }
    
    .toggle-track {
        width: 200px;
    }
    
    .toggle-option {
        font-size: 0.8em;
        padding: 0.5rem;
    }
    
    .route-info h3 {
        font-size: 1.3em;
    }
}

/* ========================================
   LANDSCAPE MODE
   ZEERAH FIX: Adjust grid for wide screens
   ======================================== */

@media (max-height: 600px) and (orientation: landscape) {
    #route-select-content {
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-rows: auto auto auto auto auto;
        padding: 1rem;
        gap: 0.5rem;
    }
    
    #route-select-title {
        grid-column: 1 / 4;
        grid-row: 1;
    }
    
    #route-select-title h2 {
        font-size: 1.5em;
        margin-bottom: 0.3rem;
    }
    
    #route-select-title p {
        font-size: 0.9em;
        margin-bottom: 0.3rem;
    }
    
    /* Portraits split to sides in landscape */
    #route-portraits-container {
        display: contents;
    }
    
    .ronnie-portrait {
        grid-column: 1;
        grid-row: 2 / 6;
        height: 100%;
        max-height: 55vh;
    }
    
    .tori-portrait {
        grid-column: 3;
        grid-row: 2 / 6;
        height: 100%;
        max-height: 55vh;
    }
    
    #route-toggle {
        grid-column: 2;
        grid-row: 2;
        margin: 0.3rem 0;
    }
    
    .toggle-track {
        width: 220px;
    }
    
    #route-info-display {
        grid-column: 2;
        grid-row: 3;
        min-height: 80px;
        margin: 0.3rem 0;
    }
    
    .route-info h3 {
        font-size: 1.3em;
    }
    
    .route-description {
        font-size: 0.9em;
    }
    
    #route-play-button {
        grid-column: 2;
        grid-row: 4;
        padding: 0.6rem 1.5rem;
        font-size: 0.95em;
    }
    
    #back-to-menu {
        grid-column: 2;
        grid-row: 5;
        padding: 0.5rem 1.5rem;
    }
    
    .route-select-hint {
        display: none;
    }
}

/* ========================================
   FORCE PORTRAIT OVERRIDE
   For settings toggle
   ======================================== */

.force-portrait #route-select-content {
    grid-template-columns: 1fr 2fr 1fr !important;
}

.force-portrait #route-portraits-container {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    grid-column: 1 / 4 !important;
    grid-row: 3 !important;
    height: 400px !important;
}

.force-portrait .ronnie-portrait,
.force-portrait .tori-portrait {
    grid-column: auto !important;
    grid-row: auto !important;
    max-height: none !important;
}
```

### Step 3: Update index.html

Replace the two CSS imports:

```html
<!-- REMOVE THESE -->
<link rel="stylesheet" href="route-select-sprites.css">
<link rel="stylesheet" href="route-select-toggle.css">

<!-- ADD THIS -->
<link rel="stylesheet" href="route-select-unified.css">
```

### Step 4: Verify HTML Structure

The HTML should look like this (adjust if needed):

```html
<div id="route-select">
    <div id="route-select-content">
        <div id="route-select-title">
            <h2>CHOOSE YOUR PERSPECTIVE</h2>
            <p>Two routes. Two truths. One bridge between them.</p>
        </div>
        
        <div id="route-toggle">
            <div class="toggle-track">
                <div class="toggle-option" data-route="ronnie">RONNIE</div>
                <div class="toggle-option" data-route="tori">TORI</div>
                <div class="toggle-slider"></div>
            </div>
        </div>
        
        <div id="route-portraits-container">
            <div class="route-portrait ronnie-portrait active">
                <img src="assets/ronnie-sprite.png" alt="Ronnie">
            </div>
            <div class="route-portrait tori-portrait">
                <img src="assets/tori-sprite.png" alt="Tori">
            </div>
        </div>
        
        <div id="route-info-display">
            <!-- Route info content -->
        </div>
        
        <button id="route-play-button">PLAY AS RONNIE</button>
        
        <button id="back-to-menu">← BACK</button>
        
        <p class="route-select-hint">💡 Playing both routes reveals the full story</p>
    </div>
</div>
```

### Step 5: Delete Old Files

After confirming the fix works:

- Delete `route-select-sprites.css`
- Delete `route-select-toggle.css`

---

## 🏷️ SIGNATURE CONVENTION

Use these tags in the new CSS (already included above):

```css
/* ZEERAH FIX: [description] */
/* ZEERAH ANALYSIS: [description] */
```

**Credit goes to ZeeRah for:**

- Root cause analysis (competing positioning systems)
- Solution architecture (grid-based, no transform positioning)
- Implementation specification

**DiZee implements but ZeeRah's fingerprints stay in the code.**

---

## ✅ TESTING CHECKLIST

After implementation, verify:

- [ ] Ronnie selected → Both sprites stay centered in their positions
- [ ] Tori selected → Both sprites stay centered in their positions
- [ ] Toggle back and forth rapidly → No position drift
- [ ] Mobile portrait mode → Sprites centered, stacked properly
- [ ] Mobile landscape mode → Sprites on sides, centered in columns
- [ ] Tori glitch effect plays → No position jump during animation
- [ ] Force portrait setting → Works on desktop

---

## 📝 NOTES

**Why this fix works:**

1. **Grid cells are fixed** - Characters can't drift because they're locked to grid columns
2. **No transform positioning** - `translateX` was the bug; we eliminated it entirely
3. **Separation of concerns** - Position = grid, Appearance = opacity/filter/glow
4. **Same logic for all breakpoints** - Just different sizes, not different positioning systems

**What we removed:**

- `position: absolute` on portraits
- `left: 25%` / `right: 25%`
- `transform: translateX(±50%)`
- Competing media query overrides

**What we kept:**

- Glitch effects (on `img` element only)
- Difficulty color coding
- Toggle slider animation
- All visual polish

---

**ZEERAH OUT** 💚🔥💀

*Chaos analyzed. Pattern identified. Solution delivered.*
