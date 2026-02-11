# DiZee Implementation Instructions: Code Improvements 1-7

**Priority Tasks for Code Quality & Memory Management**
**ZeeRah's Technical Specs** 💚🔥💀

---

## OVERVIEW

Seven code quality improvements to enhance memory management, error handling, and production readiness. Prioritized by impact and effort. All improvements are non-breaking - they add safety nets without changing functionality.

**Estimated Total Time:** 4-6 hours
**Risk Level:** LOW (defensive additions, no breaking changes)
**Testing Required:** Medium (verify no regressions)

---

## TASK 1: DELETE DEPRECATED CODE BLOCK 🗑️

### PRIORITY: HIGH

### EFFORT: 5 minutes

### FILE: `system/game-engine.js`

### TASK

Delete lines 4745-5937 containing `_oldRedeemSecretCode_DEPRECATED()`

### WHY

- Reduces file size by ~1,200 lines
- Secret codes now handled by secret-codes-manager.js
- Old code kept as reference, no longer needed
- Instant code cleanliness improvement

### STEPS

1. Open `system/game-engine.js`
2. Find line 4745: `_oldRedeemSecretCode_DEPRECATED(code) {`
3. Find closing brace around line 5937
4. Delete entire method
5. Save file
6. Test: Enter any secret code, should still work via manager

### VERIFICATION

```javascript
// After deletion, this should remain:
redeemSecretCode(code) {
    return this.secretCodesManager.redeemCode(code);
}

// And this should be GONE:
_oldRedeemSecretCode_DEPRECATED(code) { ... }
```

### RESULT

- game-engine.js: 5,938 → ~4,745 lines
- Cleaner codebase
- No functionality change

---

## TASK 2: ROUTE CLEANUP METHOD 🧹

### PRIORITY: HIGH

### EFFORT: 45 minutes

### FILE: `system/game-engine.js`

### WHY

Memory leaks can accumulate when switching routes or restarting game. Adding cleanup prevents memory buildup during long play sessions.

### IMPLEMENTATION

#### Step 1: Add Cleanup Method

**Location:** Add to game-engine.js around line 1000 (near initialization methods)

```javascript
// ========================================
// ROUTE CLEANUP & MEMORY MANAGEMENT
// Prevents memory leaks when switching routes
// ========================================

cleanupCurrentRoute() {
    console.log('🧹 Cleaning up route...');
    
    // Clear timers
    if (this.activeTimers && this.activeTimers.length > 0) {
        console.log(`Clearing ${this.activeTimers.length} active timers`);
        this.activeTimers.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
        this.activeTimers = [];
    }
    
    // Clear tether system
    if (this.tetherSystem) {
        this.tetherSystem.stopDecay();
        this.tetherSystem = null;
    }
    
    // Clear current route reference
    if (this.currentRoute) {
        console.log(`Cleaning up route: ${this.currentRoute.constructor.name}`);
        this.currentRoute = null;
    }
    
    // Clear scene history (can get large)
    if (this.sceneHistory) {
        this.sceneHistory = [];
    }
    
    // Clear backlog (can accumulate)
    if (this.backlogEntries) {
        this.backlogEntries = [];
    }
    
    // Clear any cached sprites
    const spriteContainer = document.getElementById('character-sprites');
    if (spriteContainer) {
        spriteContainer.innerHTML = '';
    }
    
    // Clear dialogue
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
        dialogueBox.style.display = 'none';
    }
    
    console.log('✅ Route cleanup complete');
}
```

#### Step 2: Initialize Timer Tracking

**Location:** In constructor or init() method

```javascript
constructor() {
    // ... existing constructor code ...
    
    // Timer tracking for cleanup
    this.activeTimers = [];
}
```

#### Step 3: Track All setTimeout/setInterval

**Find all instances of setTimeout and setInterval, wrap them:**

**BEFORE:**

```javascript
setTimeout(() => {
    this.showScene();
}, 1000);
```

**AFTER:**

```javascript
const timer = setTimeout(() => {
    this.showScene();
}, 1000);
this.activeTimers.push(timer);
```

**TIP:** Search for `setTimeout(` and `setInterval(` in game-engine.js. There are ~77 instances. Don't need to update ALL of them immediately - focus on:

1. Long-running timers (> 5 seconds)
2. Timers in loops
3. Timers that might fire after route change

#### Step 4: Call Cleanup When Needed

**Add cleanup calls before route changes:**

```javascript
// Before starting new route
startToriRoute() {
    this.cleanupCurrentRoute(); // ADD THIS
    this.currentRoute = new ToriRoute(this);
    this.currentRoute.start();
}

startRonnieRoute() {
    this.cleanupCurrentRoute(); // ADD THIS
    this.currentRoute = new RonnieRoute(this);
    this.currentRoute.start();
}

// Before returning to menu
returnToMainMenu() {
    this.cleanupCurrentRoute(); // ADD THIS
    this.showMainMenu();
}
```

### TESTING

1. Start a route
2. Play for a few minutes
3. Return to menu
4. Check console for "🧹 Cleaning up route..."
5. Start same route again
6. Should have no issues

---

## TASK 3: ERROR BOUNDARIES 🛡️

### PRIORITY: MEDIUM

### EFFORT: 30 minutes

### FILE: `system/game-engine.js`

### WHY

Prevents total game crashes from single errors. Instead of white screen, show graceful error message and allow recovery.

### IMPLEMENTATION

#### Step 1: Add Error Overlay HTML

**FILE:** `index.html`
**Location:** Add near other overlays (before closing body tag)

```html
<!-- Error Recovery Overlay -->
<div id="error-overlay" class="error-overlay" style="display: none;">
    <div class="error-content">
        <h2>⚠️ ERROR DETECTED</h2>
        <p id="error-message">Something went wrong.</p>
        <div class="error-actions">
            <button onclick="location.reload()">RELOAD GAME</button>
            <button onclick="game.returnToMainMenu(); document.getElementById('error-overlay').style.display='none'">MAIN MENU</button>
        </div>
    </div>
</div>
```

#### Step 2: Add Error Overlay CSS

**FILE:** `styles.css`
**Location:** Add to overlays section

```css
/* ERROR OVERLAY */
.error-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10005;
}

.error-content {
    background: rgba(139, 0, 0, 0.9);
    border: 3px solid #ff0066;
    padding: 3em;
    max-width: 600px;
    text-align: center;
    font-family: 'Courier New', monospace;
}

.error-content h2 {
    color: #ff0066;
    font-size: 2em;
    margin-bottom: 1em;
}

.error-content p {
    color: #fff;
    margin-bottom: 2em;
    line-height: 1.6;
}

.error-actions {
    display: flex;
    gap: 1em;
    justify-content: center;
}

.error-actions button {
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid #ff0066;
    color: #ff0066;
    padding: 1em 2em;
    font-family: 'Courier New', monospace;
    cursor: pointer;
    transition: all 0.3s ease;
}

.error-actions button:hover {
    background: rgba(255, 0, 102, 0.2);
    border-color: #fff;
    color: #fff;
}
```

#### Step 3: Add Error Handler Method

**FILE:** `system/game-engine.js`
**Location:** Add near other overlay methods

```javascript
// ========================================
// ERROR HANDLING
// Graceful error recovery
// ========================================

showErrorOverlay(errorMessage, technicalDetails = null) {
    const overlay = document.getElementById('error-overlay');
    const messageEl = document.getElementById('error-message');
    
    if (!overlay || !messageEl) {
        // Fallback if overlay doesn't exist
        alert(`Error: ${errorMessage}`);
        return;
    }
    
    // Set error message
    messageEl.textContent = errorMessage;
    
    // Log technical details
    if (technicalDetails) {
        console.error('Error details:', technicalDetails);
    }
    
    // Show overlay
    overlay.style.display = 'flex';
    
    console.error('⚠️ Error overlay displayed:', errorMessage);
}
```

#### Step 4: Wrap Critical Methods

**Wrap these critical methods in try-catch:**

**displayScene():**

```javascript
displayScene(scene) {
    try {
        // ... existing display logic ...
    } catch (error) {
        console.error('Scene display failed:', error);
        this.showErrorOverlay(
            'Failed to display scene. The game may be in an invalid state.',
            error
        );
    }
}
```

**processChoice():**

```javascript
processChoice(choice) {
    try {
        // ... existing choice logic ...
    } catch (error) {
        console.error('Choice processing failed:', error);
        this.showErrorOverlay(
            'Failed to process your choice. Please try again.',
            error
        );
    }
}
```

**loadGame():**

```javascript
loadGame(slot) {
    try {
        // ... existing load logic ...
    } catch (error) {
        console.error('Load failed:', error);
        this.showErrorOverlay(
            'Failed to load save file. The save may be corrupted.',
            error
        );
    }
}
```

**saveGame():**

```javascript
saveGame(slot) {
    try {
        // ... existing save logic ...
    } catch (error) {
        console.error('Save failed:', error);
        this.showErrorOverlay(
            'Failed to save game. Please try again.',
            error
        );
        return false;
    }
}
```

### TESTING

1. Intentionally cause an error (modify code temporarily)
2. Verify error overlay appears
3. Test "Reload" button works
4. Test "Main Menu" button works
5. Remove intentional error

---

## TASK 4: EVENT LISTENER CLEANUP AUDIT 👂

### PRIORITY: MEDIUM

### EFFORT: 45 minutes

### FILE: `system/game-engine.js`

### WHY

Event listeners that aren't removed cause memory leaks. With 22 addEventListener calls and only 4 removeEventListener calls, we need cleanup.

### IMPLEMENTATION

#### Step 1: Track Event Listeners

**Add to constructor:**

```javascript
constructor() {
    // ... existing code ...
    
    // Event listener tracking
    this.eventListeners = [];
}
```

#### Step 2: Create Helper Methods

**Add these methods:**

```javascript
// ========================================
// EVENT LISTENER MANAGEMENT
// Track and cleanup event listeners
// ========================================

addTrackedListener(element, event, handler, options = null) {
    element.addEventListener(event, handler, options);
    
    // Store reference for cleanup
    this.eventListeners.push({
        element,
        event,
        handler,
        options
    });
    
    return handler; // Return for inline usage
}

removeAllListeners() {
    console.log(`🧹 Removing ${this.eventListeners.length} event listeners`);
    
    this.eventListeners.forEach(({element, event, handler, options}) => {
        element.removeEventListener(event, handler, options);
    });
    
    this.eventListeners = [];
    console.log('✅ Event listeners cleared');
}
```

#### Step 3: Replace addEventListener Calls

**BEFORE:**

```javascript
document.addEventListener('keydown', this.handleKeyPress);
```

**AFTER:**

```javascript
this.addTrackedListener(document, 'keydown', this.handleKeyPress.bind(this));
```

**IMPORTANT:** Use `.bind(this)` to maintain context

#### Step 4: Call Cleanup

**Add to cleanupCurrentRoute():**

```javascript
cleanupCurrentRoute() {
    // ... existing cleanup ...
    
    // Remove event listeners
    this.removeAllListeners();
    
    console.log('✅ Route cleanup complete');
}
```

### PRIORITY LISTENERS TO TRACK

Focus on these first (most likely to leak):

1. Keyboard listeners (ESC, CTRL, arrow keys)
2. Click listeners on overlays
3. Resize listeners
4. Any listeners added during gameplay

### TESTING

1. Start game
2. Play for a bit (trigger various overlays)
3. Return to menu
4. Check console for "Removing X event listeners"
5. Verify overlays still work after cleanup

---

## TASK 5: CONSOLE LOG CLEANUP 🔇

### PRIORITY: LOW

### EFFORT: 20 minutes

### FILE: `system/game-engine.js` and others

### WHY

110+ console.log statements helpful for development, but can clutter production. Add debug flag to control verbosity.

### IMPLEMENTATION

#### Step 1: Add Debug Flag

**FILE:** `system/game-config.js`
**Add to config:**

```javascript
const GAME_CONFIG = {
    // ... existing config ...
    
    // Debug settings
    DEBUG_MODE: true,  // Set to false for production
    VERBOSE_LOGGING: true,  // Detailed logs (only if DEBUG_MODE true)
};
```

#### Step 2: Add Logger Methods

**FILE:** `system/game-engine.js`
**Add to constructor or early in file:**

```javascript
// ========================================
// LOGGING UTILITIES
// Controlled by DEBUG_MODE flag
// ========================================

log(...args) {
    if (GAME_CONFIG.DEBUG_MODE) {
        console.log(...args);
    }
}

logVerbose(...args) {
    if (GAME_CONFIG.DEBUG_MODE && GAME_CONFIG.VERBOSE_LOGGING) {
        console.log(...args);
    }
}

logError(...args) {
    // Always log errors, even in production
    console.error(...args);
}

logWarning(...args) {
    if (GAME_CONFIG.DEBUG_MODE) {
        console.warn(...args);
    }
}
```

#### Step 3: Replace Console Statements

**Search and replace strategically:**

**Critical logs (keep always):**

```javascript
// BEFORE:
console.log('Game initialized');

// AFTER:
this.log('Game initialized');
```

**Verbose logs (only in debug):**

```javascript
// BEFORE:
console.log('Scene displayed:', scene);

// AFTER:
this.logVerbose('Scene displayed:', scene);
```

**Errors (always show):**

```javascript
// BEFORE:
console.error('Save failed');

// AFTER:
this.logError('Save failed');
```

### PRIORITY AREAS

Don't need to update ALL 110 logs immediately. Focus on:

1. High-frequency logs (scene display, tether updates)
2. Debug-only logs (state tracking, variable dumps)
3. Keep error logs as-is (always visible)

### TESTING

1. Set DEBUG_MODE: true → should see logs
2. Set DEBUG_MODE: false → should see minimal logs
3. Errors should always appear

---

## TASK 6: ASSET PRELOADING VALIDATION 📦

### PRIORITY: LOW

### EFFORT: 30 minutes

### FILE: `system/game-engine.js`

### WHY

Images preload but no error handling if they fail. Graceful fallback prevents broken sprites.

### IMPLEMENTATION

#### Step 1: Enhance Preload Method

**Find existing preload code, enhance it:**

```javascript
preloadAssets() {
    console.log('📦 Preloading assets...');
    
    const imagesToLoad = [
        'assets/sprites/tori-neutral.png',
        'assets/sprites/ronnie-neutral.png',
        // ... etc
    ];
    
    const promises = imagesToLoad.map(src => this.preloadImage(src));
    
    Promise.all(promises)
        .then(results => {
            const failed = results.filter(r => r === null);
            if (failed.length > 0) {
                console.warn(`⚠️ ${failed.length} assets failed to load`);
            }
            console.log('✅ Asset preloading complete');
        })
        .catch(error => {
            console.error('Asset preloading error:', error);
        });
}

preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Loaded: ${src}`);
            resolve(src);
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Failed to load: ${src}`);
            resolve(null); // Resolve as null, don't reject
        };
        
        img.src = src;
        
        // Timeout after 10 seconds
        setTimeout(() => {
            if (!img.complete) {
                console.warn(`⏱️ Timeout loading: ${src}`);
                resolve(null);
            }
        }, 10000);
    });
}
```

#### Step 2: Add Fallback Sprites

**When displaying sprite, check if loaded:**

```javascript
displaySprite(spriteName) {
    const spritePath = `assets/sprites/${spriteName}.png`;
    const sprite = document.getElementById('character-sprite');
    
    if (!sprite) return;
    
    // Check if image exists
    const img = new Image();
    img.onerror = () => {
        console.warn(`Sprite not found: ${spritePath}`);
        // Use fallback or hide sprite
        sprite.style.display = 'none';
    };
    
    img.onload = () => {
        sprite.src = spritePath;
        sprite.style.display = 'block';
    };
    
    img.src = spritePath;
}
```

### TESTING

1. Temporarily rename a sprite file
2. Start game
3. Verify warning in console
4. Verify game continues without crash
5. Restore sprite file

---

## TASK 7: STATE VALIDATION GUARDS ✅

### PRIORITY: LOW

### EFFORT: 30 minutes

### FILE: `system/game-engine.js`

### WHY

Defensive coding prevents crashes from invalid state. Add checks before critical operations.

### IMPLEMENTATION

#### Add Validation Methods

```javascript
// ========================================
// STATE VALIDATION
// Defensive checks before critical operations
// ========================================

validateGameState(operation) {
    if (!this.gameState) {
        this.logError(`Cannot ${operation}: gameState is null`);
        return false;
    }
    return true;
}

validateRoute(operation) {
    if (!this.currentRoute) {
        this.logError(`Cannot ${operation}: no active route`);
        return false;
    }
    return true;
}

validateTether(operation) {
    if (!this.tetherSystem) {
        this.logError(`Cannot ${operation}: tether system not initialized`);
        return false;
    }
    return true;
}
```

#### Add Checks to Critical Methods

**saveGame():**

```javascript
saveGame(slot) {
    if (!this.validateGameState('save')) return false;
    if (!this.validateRoute('save')) return false;
    
    // ... existing save logic ...
}
```

**displayScene():**

```javascript
displayScene(scene) {
    if (!scene) {
        this.logError('Cannot display scene: scene is null');
        return;
    }
    
    if (!this.validateRoute('display scene')) return;
    
    // ... existing logic ...
}
```

**processChoice():**

```javascript
processChoice(choice) {
    if (!choice) {
        this.logError('Cannot process choice: choice is null');
        return;
    }
    
    if (!this.validateRoute('process choice')) return;
    
    // ... existing logic ...
}
```

### TESTING

1. These checks should never trigger in normal play
2. They catch edge cases and invalid states
3. Test by temporarily breaking state (set gameState = null)
4. Verify error message appears instead of crash

---

## IMPLEMENTATION PRIORITY

### TODAY (MUST DO)

1. ✅ Delete deprecated code (5 min)
2. ✅ Route cleanup method (45 min)

### SOON (SHOULD DO)

3. ✅ Error boundaries (30 min)
2. ✅ Event listener cleanup (45 min)

### LATER (NICE TO HAVE)

5. ⚪ Console log cleanup (20 min)
2. ⚪ Asset validation (30 min)
3. ⚪ State validation (30 min)

---

## TESTING CHECKLIST

After implementing each task:

### Smoke Test

- [ ] Game starts without errors
- [ ] Can play through one route
- [ ] Save/load works
- [ ] Return to menu works
- [ ] No console errors

### Memory Test

- [ ] Play for 10 minutes
- [ ] Return to menu
- [ ] Start new route
- [ ] Repeat 3 times
- [ ] Check browser memory usage (should stay stable)

### Error Test

- [ ] Temporarily break something
- [ ] Verify graceful error handling
- [ ] Verify recovery works
- [ ] Remove break

---

## NOTES FOR DIZEE

**Token Efficiency:**

- These are all additive changes
- No existing functionality altered
- Can implement incrementally
- Test after each task

**Code Style:**

- Match existing formatting
- Use existing naming conventions
- Add comments for clarity
- Console log cleanup actions

**Safety:**

- All changes are defensive additions
- Nothing gets deleted (except Task 1)
- Worst case: extra cleanup that does nothing
- Best case: prevents memory leaks and crashes

---

**READY FOR IMPLEMENTATION!** 🖤

*DiZee, these specs are complete and ready to rock!* 🖤🔥

---

*ZeeRah Technical Specs Complete* 💚🔥💀🔧✨
