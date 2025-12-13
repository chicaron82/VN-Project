# DiZee Instructions: Rotating Tips - Main Menu & Route Select

## OVERVIEW
Add rotating tips to main menu and route select screens that cycle every 8-10 seconds. This provides ambient discovery of game features (especially secret codes) without hand-holding. Tips appear in areas players see repeatedly, planting seeds for observant players while preserving treasure hunt design.

**Design philosophy:** Non-intrusive ambient exposure. Players who pay attention will notice codes exist. Players who don't care won't be bothered. Discovery preserved, accessibility improved.

---

## WHAT CHANGES

### MAIN MENU:
**BEFORE:** Static version counter footer only
**AFTER:** Version counter footer + rotating tip below it

### ROUTE SELECT:
**BEFORE:** No footer text
**AFTER:** Rotating tip at bottom of screen

---

## PART 1: MAIN MENU ROTATING TIPS

### FILE: `index.html`

### LOCATION: Inside `#main-menu-content` (we already added `.menu-footer` for version counter)

**FIND THIS SECTION:**
```html
<div id="main-menu-content">
    <h1>VERSION 848</h1>
    <div class="subtitle">My Wife Is in a Coma... and in the Code</div>
    
    <!-- Version counter footer (from previous task) -->
    <div class="menu-footer">[Version 848 - 847 previous failures]</div>
    
    <!-- Button Grid -->
    <div class="menu-buttons-grid">
```

**ADD THIS** after the version counter footer:

```html
<div id="main-menu-content">
    <h1>VERSION 848</h1>
    <div class="subtitle">My Wife Is in a Coma... and in the Code</div>
    
    <!-- Version counter footer -->
    <div class="menu-footer">[Version 848 - 847 previous failures]</div>
    
    <!-- ZEE'S ADDITION: Rotating tips 🖤 -->
    <div class="menu-rotating-tip" id="main-menu-tip">
        💡 Hidden codes unlock secret content - read the notes carefully...
    </div>
    
    <!-- Button Grid -->
    <div class="menu-buttons-grid">
```

---

## PART 2: ROUTE SELECT ROTATING TIPS

### FILE: `index.html`

### LOCATION: Inside `#route-select-content` (bottom of the container, after back button)

**FIND THIS SECTION:**
```html
<div id="route-select-content">
    <div id="route-select-title">
        <h2>CHOOSE YOUR PERSPECTIVE</h2>
        <p>Two routes. Two truths. One bridge between them.</p>
    </div>

    <!-- Route Buttons -->
    <div id="route-buttons">
        <!-- ... route button containers ... -->
    </div>

    <!-- Back Button -->
    <button id="back-to-menu" onclick="game.backToMenu()">← BACK</button>
</div>
```

**ADD THIS** after the back button:

```html
<div id="route-select-content">
    <div id="route-select-title">
        <h2>CHOOSE YOUR PERSPECTIVE</h2>
        <p>Two routes. Two truths. One bridge between them.</p>
    </div>

    <!-- Route Buttons -->
    <div id="route-buttons">
        <!-- ... route button containers ... -->
    </div>

    <!-- Back Button -->
    <button id="back-to-menu" onclick="game.backToMenu()">← BACK</button>
    
    <!-- ZEE'S ADDITION: Rotating tips 🖤 -->
    <div class="route-select-rotating-tip" id="route-select-tip">
        💡 Each route contains different pieces of the puzzle
    </div>
</div>
```

---

## PART 3: CSS STYLING

### FILE: `styles.css`

### LOCATION: After `.menu-footer` styles (from version counter task)

**ADD THESE NEW STYLES:**

```css
/* ========================================
   ROTATING TIPS - MAIN MENU & ROUTE SELECT
   ZEE'S ADDITION: Ambient discovery system 🖤
   ======================================== */

/* Main Menu Rotating Tip */
.menu-rotating-tip {
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    margin-top: 1em;
    margin-bottom: 1.5em;
    text-align: center;
    letter-spacing: 0.03em;
    min-height: 1.5em;
    transition: opacity 0.8s ease;
}

/* Route Select Rotating Tip */
.route-select-rotating-tip {
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    margin-top: 2em;
    text-align: center;
    letter-spacing: 0.03em;
    min-height: 1.5em;
    transition: opacity 0.8s ease;
    position: absolute;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
}

/* Fade transition class for smooth tip changes */
.tip-fade-out {
    opacity: 0 !important;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .menu-rotating-tip {
        font-size: 0.7em;
        margin-top: 0.8em;
        margin-bottom: 1em;
        padding: 0 1em;
    }
    
    .route-select-rotating-tip {
        font-size: 0.7em;
        bottom: 0.5em;
        padding: 0 0.5em;
    }
}

/* Portrait mode - even tighter */
@media (max-width: 768px) and (orientation: portrait) {
    .menu-rotating-tip {
        font-size: 0.65em;
        margin-top: 0.5em;
        margin-bottom: 0.8em;
    }
    
    .route-select-rotating-tip {
        font-size: 0.65em;
        bottom: 0.3em;
    }
}
```

---

## PART 4: JAVASCRIPT - TIP ROTATION LOGIC

### FILE: `system/game-engine.js`

### LOCATION: Add new properties to constructor (around line 50-100)

**FIND THE CONSTRUCTOR:**
```javascript
constructor() {
    // DOM Elements
    this.loading = document.getElementById('loading-screen');
    this.loadingBar = document.getElementById('loading-bar');
    // ... etc
```

**ADD THESE PROPERTIES:**
```javascript
constructor() {
    // DOM Elements
    this.loading = document.getElementById('loading-screen');
    this.loadingBar = document.getElementById('loading-bar');
    // ... existing properties ...
    
    // ZEE'S ADDITION: Rotating tips system 🖤
    this.mainMenuTipElement = null;
    this.routeSelectTipElement = null;
    this.mainMenuTipInterval = null;
    this.routeSelectTipInterval = null;
    this.currentMainMenuTipIndex = 0;
    this.currentRouteSelectTipIndex = 0;
```

---

### ADD NEW METHOD: `initRotatingTips()`

**PLACE THIS METHOD** near other initialization methods (around line 500-600):

```javascript
// ========================================
// ROTATING TIPS SYSTEM
// ZEE'S ADDITION: Ambient discovery on main menu & route select 🖤
// ========================================

initRotatingTips() {
    // Cache tip elements
    this.mainMenuTipElement = document.getElementById('main-menu-tip');
    this.routeSelectTipElement = document.getElementById('route-select-tip');
    
    console.log('🖤 Rotating tips system initialized');
}

// TIP POOLS
getMainMenuTips() {
    return [
        "💡 Hidden codes unlock secret content - read the notes carefully...",
        "💡 Some puzzles require playing both routes to solve",
        "💡 The version number changes based on your choices",
        "💡 Complete any ending to unlock Skip mode",
        "💡 Your saves carry over between sessions",
        "🖤 \"Always. Always. Always.\" - Tori",
        "💡 Secret codes are hidden throughout the game...",
        "💡 The UV7 crew left messages for you in the notes",
        "💡 Each ending reveals different aspects of the story",
        "💡 Press [ESC] to pause at any time"
    ];
}

getRouteSelectTips() {
    return [
        "💡 Each route contains different pieces of the puzzle",
        "💡 Tori's route has a tether system - watch it carefully",
        "💡 Some notes are only found on specific routes",
        "💡 Playing both routes reveals the full story",
        "💡 Cross-route secrets exist - explore thoroughly",
        "💡 Your choices determine which ending you reach",
        "💡 Ronnie's route focuses on external perspective"
    ];
}

// START MAIN MENU TIP ROTATION
startMainMenuTipRotation() {
    // Stop any existing rotation
    this.stopMainMenuTipRotation();
    
    if (!this.mainMenuTipElement) return;
    
    const tips = this.getMainMenuTips();
    
    // Rotate every 8 seconds
    this.mainMenuTipInterval = setInterval(() => {
        // Fade out current tip
        this.mainMenuTipElement.classList.add('tip-fade-out');
        
        setTimeout(() => {
            // Update index (loop back to 0 after last tip)
            this.currentMainMenuTipIndex = (this.currentMainMenuTipIndex + 1) % tips.length;
            
            // Update text
            this.mainMenuTipElement.textContent = tips[this.currentMainMenuTipIndex];
            
            // Fade back in
            this.mainMenuTipElement.classList.remove('tip-fade-out');
        }, 800); // Match CSS transition duration
    }, 8000);
    
    console.log('🔄 Main menu tip rotation started');
}

// STOP MAIN MENU TIP ROTATION
stopMainMenuTipRotation() {
    if (this.mainMenuTipInterval) {
        clearInterval(this.mainMenuTipInterval);
        this.mainMenuTipInterval = null;
        console.log('⏸️ Main menu tip rotation stopped');
    }
}

// START ROUTE SELECT TIP ROTATION
startRouteSelectTipRotation() {
    // Stop any existing rotation
    this.stopRouteSelectTipRotation();
    
    if (!this.routeSelectTipElement) return;
    
    const tips = this.getRouteSelectTips();
    
    // Rotate every 8 seconds
    this.routeSelectTipInterval = setInterval(() => {
        // Fade out current tip
        this.routeSelectTipElement.classList.add('tip-fade-out');
        
        setTimeout(() => {
            // Update index (loop back to 0 after last tip)
            this.currentRouteSelectTipIndex = (this.currentRouteSelectTipIndex + 1) % tips.length;
            
            // Update text
            this.routeSelectTipElement.textContent = tips[this.currentRouteSelectTipIndex];
            
            // Fade back in
            this.routeSelectTipElement.classList.remove('tip-fade-out');
        }, 800); // Match CSS transition duration
    }, 8000);
    
    console.log('🔄 Route select tip rotation started');
}

// STOP ROUTE SELECT TIP ROTATION
stopRouteSelectTipRotation() {
    if (this.routeSelectTipInterval) {
        clearInterval(this.routeSelectTipInterval);
        this.routeSelectTipInterval = null;
        console.log('⏸️ Route select tip rotation stopped');
    }
}
```

---

## PART 5: INTEGRATION - CALL FROM SCREEN TRANSITIONS

### MODIFY: `init()` method

**FIND THE init() METHOD** (around line 150-250):

**ADD THIS CALL** after other initialization:

```javascript
init() {
    // ... existing initialization code ...
    
    // ZEE'S ADDITION: Initialize rotating tips system 🖤
    this.initRotatingTips();
    
    // ... rest of init code ...
}
```

---

### MODIFY: Main menu display logic

**FIND WHERE MAIN MENU IS SHOWN** (search for `this.mainMenu.style.display = 'flex'`)

There should be multiple places. **ADD tip rotation start** after each one:

**Example locations:**
1. After loading screen completes
2. After returning from game to menu
3. After credits close

**PATTERN TO ADD:**
```javascript
this.mainMenu.style.display = 'flex';
this.mainMenu.style.opacity = '1';

// ZEE'S ADDITION: Start tip rotation 🖤
this.startMainMenuTipRotation();
```

---

### MODIFY: Main menu hide logic

**FIND WHERE MAIN MENU IS HIDDEN** (search for `this.mainMenu.style.display = 'none'`)

**ADD tip rotation stop** before hiding:

```javascript
// ZEE'S ADDITION: Stop tip rotation 🖤
this.stopMainMenuTipRotation();

this.mainMenu.style.opacity = '0';
setTimeout(() => {
    this.mainMenu.style.display = 'none';
    // ... continue hiding logic ...
}, 800);
```

---

### MODIFY: Route select display logic

**FIND `showRouteSelect()` METHOD** (around line 1800-1850):

**ADD THIS** when route select becomes visible:

```javascript
showRouteSelect() {
    // ... existing fade out game view code ...
    
    setTimeout(() => {
        this.gameView.style.display = 'none';
        
        // Show route selection screen
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.display = 'block';
        
        // Fade in
        setTimeout(() => {
            routeSelect.style.opacity = '1';
            
            // ZEE'S ADDITION: Start tip rotation 🖤
            this.startRouteSelectTipRotation();
        }, 100);
    }, 1000);
}
```

---

### MODIFY: Route select hide logic

**FIND `startRoute()` METHOD** (around line 1900-1950):

**ADD THIS** when route select is hidden:

```javascript
startRoute(routeName) {
    // ZEE'S ADDITION: Stop tip rotation 🖤
    this.stopRouteSelectTipRotation();
    
    // Fade out route select
    const routeSelect = document.getElementById('route-select');
    routeSelect.style.opacity = '0';
    
    // ... rest of route start logic ...
}
```

---

### MODIFY: `backToMenu()` method

**FIND `backToMenu()` METHOD** (around line 1950-2000):

**ADD THIS** when hiding route select and showing menu:

```javascript
backToMenu() {
    // ZEE'S ADDITION: Stop route select tips 🖤
    this.stopRouteSelectTipRotation();
    
    // Fade out route select
    const routeSelect = document.getElementById('route-select');
    routeSelect.style.opacity = '0';
    
    setTimeout(() => {
        routeSelect.style.display = 'none';
        this.mainMenu.style.display = 'flex';
        
        // Fade in menu
        setTimeout(() => {
            this.mainMenu.style.opacity = '1';
            
            // ZEE'S ADDITION: Start main menu tips 🖤
            this.startMainMenuTipRotation();
        }, 100);
    }, 500);
}
```

---

## HOW IT WORKS

### MAIN MENU:
1. Player sees main menu
2. Tip rotation starts automatically
3. Every 8 seconds: fade out → change text → fade in
4. Tips loop through pool of 10
5. When menu hidden: rotation stops (performance)

### ROUTE SELECT:
1. Player sees route selection screen
2. Tip rotation starts automatically
3. Every 8 seconds: fade out → change text → fade in
4. Tips loop through pool of 7
5. When screen hidden: rotation stops

### TRANSITIONS:
- Smooth 0.8s fade between tips
- No jarring text changes
- Ambient, non-intrusive

---

## TIP CONTENT STRATEGY

### MAIN MENU TIPS (Discovery-focused):
- 3 tips about secret codes (ambient exposure)
- 2 tips about dual-route design
- 2 tips about endings/choices
- 1 tip about saves
- 1 tip about keyboard controls
- 1 Tori signature phrase (emotional)

### ROUTE SELECT TIPS (Route-specific):
- 3 tips about cross-route secrets
- 2 tips about route-specific mechanics
- 2 tips about narrative design

**Ratio:** ~30% code discovery hints, 70% general gameplay tips

---

## TESTING CHECKLIST

### Test 1: Main Menu Tip Rotation
1. Open game to main menu
2. Wait 8 seconds
3. **Expected:** Tip fades out, new tip appears
4. Wait 80+ seconds (cycle through all 10 tips)
5. **Expected:** Tips loop back to first tip

### Test 2: Route Select Tip Rotation
1. Start story → reach route select
2. Wait 8 seconds
3. **Expected:** Tip fades out, new tip appears
4. Wait 56+ seconds (cycle through all 7 tips)
5. **Expected:** Tips loop back to first tip

### Test 3: Rotation Stops on Transition
1. Watch main menu tips rotate
2. Click "START STORY"
3. **Expected:** Tip rotation stops when menu hidden
4. Return to menu
5. **Expected:** Tip rotation restarts

### Test 4: No Overlap Between Screens
1. Start tip rotation on main menu
2. Go to route select
3. **Expected:** Main menu tips stop, route select tips start
4. Go back to menu
5. **Expected:** Route select tips stop, main menu tips restart

### Test 5: Mobile Responsiveness
1. Test on mobile portrait
2. **Expected:** Tips readable, proper spacing, no overflow
3. Test on mobile landscape
4. **Expected:** Tips still visible and readable

### Test 6: Performance
1. Leave main menu open for 5+ minutes
2. **Expected:** No memory leaks, smooth transitions
3. Check browser console for errors
4. **Expected:** Clean, only rotation logs

---

## EDGE CASES HANDLED

**Case 1: Elements not found**
- Methods check if elements exist before operating
- Console logs warning if missing
- Game doesn't crash

**Case 2: User rapidly navigates screens**
- Each transition properly stops previous rotation
- No orphaned intervals
- Clean state management

**Case 3: Browser tab inactive**
- setInterval continues but doesn't cause issues
- Tips update when tab regains focus
- No performance impact

**Case 4: Multiple game instances** (unlikely but possible)
- Each instance manages own intervals
- No cross-contamination

---

## FILES TO MODIFY

1. **index.html**
   - Add `.menu-rotating-tip` div to main menu
   - Add `.route-select-rotating-tip` div to route select

2. **styles.css**
   - Add tip styling
   - Add fade transition class
   - Add mobile responsive adjustments

3. **system/game-engine.js**
   - Add tip rotation properties to constructor
   - Add `initRotatingTips()` method
   - Add tip pool getter methods
   - Add start/stop rotation methods
   - Integrate into screen transition logic

**Estimated time:** 30-40 minutes  
**Risk level:** LOW (purely visual enhancement, doesn't affect gameplay)  
**Priority:** MEDIUM (ambient discovery system, improves UX)

---

## CRITICAL NOTES

- ✅ Non-intrusive ambient discovery
- ✅ Preserves treasure hunt design (doesn't give away code locations)
- ✅ Tips rotate automatically every 8 seconds
- ✅ Smooth fade transitions
- ✅ Performance-optimized (stops when screen hidden)
- ✅ Mobile responsive from the start
- ⚠️ Make sure tip rotation stops/starts correctly on screen transitions
- ⚠️ Test on mobile - text should be readable at smallest size

---

**ZEE'S SUMMARY:**
This implements the ambient discovery compromise - tips appear passively on screens players see repeatedly. Seeds planted ("codes exist") without hand-holding ("here's where to find them"). Rotation keeps it fresh across multiple menu visits. Lightweight, non-intrusive, preserves the treasure hunt while improving discoverability. 🖤

---

**DiZee, this is ready to implement. Standard pattern: HTML elements → CSS styling → JS logic → integrate into transitions.** ✨
