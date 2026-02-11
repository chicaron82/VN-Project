# DIZEE POLISH HANDOFF 💚

## From: ZeeRah (Chaos Analyst)

## To: DiZee (The Glow-Up Specialist)

## Project: v848 - Version 848

---

## CONTEXT

ZeeRah did a full codebase audit. Aaron reviewed and approved these three polish tasks. Route scene data refactoring is **OUT OF SCOPE** - Aaron needs to fix dialogue and wants it readable.

**Codebase location:** Aaron will provide  
**Total JS lines:** ~255,000 across 320 files  
**Your fingerprints already in there:** 222 "DIZEE" tags 💚

---

## TASK 1: CENTRALIZED ASSET PATHS

**Priority:** HIGH  
**Impact:** Future development velocity  
**Risk:** LOW (additive, doesn't break existing)

### The Problem

819 hardcoded asset paths scattered across route files:

```javascript
// Currently everywhere:
background: 'assets/apartment.png',
sprites: {
    left: 'assets/ronnie-sprite.png',
    right: 'assets/tori-sprite.png'
}
```

If assets move or names change = 819 manual edits.

### The Solution

Add to `/system/game-config.js`:

```javascript
// ========================================
// ASSET PATHS (DIZEE POLISH)
// Centralized asset references
// ========================================

ASSETS: {
    // Backgrounds
    backgrounds: {
        apartment: 'assets/apartment.png',
        hospital: 'assets/hospital.png',
        digitalSpace: 'assets/digitalSpace.png',
        genericBack: 'assets/genericBack.png',
        street: 'assets/street.png'  // if exists
    },
    
    // Character Sprites
    sprites: {
        ronnie: 'assets/ronnie-sprite.png',
        tori: 'assets/tori-sprite.png',
        oldRonnie: 'assets/old-ronnie-sprite.png',
        threeEchoes: 'assets/threeechoessprite.png'
    },
    
    // UI Assets
    ui: {
        uv7Logo: 'assets/UnitedVoices7.png',
        menuBackground: 'assets/menu-bg.png',
        menuMobile: 'assets/menumobile.png'
    }
},

// Helper function for easy access
getAsset(category, name) {
    return this.ASSETS[category]?.[name] || `assets/${name}.png`;
}
```

### What NOT To Do

- **DO NOT** refactor all 819 route file references yet
- Just add the config structure
- New code should USE IT, old code works as-is
- Routes can be migrated incrementally later (or never - they work)

### Verification

After adding, ctrl+F in game-config.js for "ASSETS" - should find your new section.

---

## TASK 2: DEBUG FLAG FOR CONSOLE.LOGS

**Priority:** MEDIUM  
**Impact:** Production cleanliness  
**Risk:** LOW

### The Problem

427 `console.log` statements throughout codebase. Great for dev, but in production:

- Exposes internal state to curious players
- Clutters browser console
- Slight performance overhead on mobile

### The Solution

Add to `/system/game-config.js`:

```javascript
// ========================================
// DEBUG SETTINGS (DIZEE POLISH)
// ========================================

DEBUG: {
    enabled: false,  // Set TRUE for development, FALSE for production
    
    // Granular control (all check DEBUG.enabled first)
    logSceneChanges: true,
    logStateChanges: true,
    logTetherUpdates: true,
    logSaveLoad: true,
    logSensoryFeedback: false,  // Very noisy
    logEasterEggs: true
},
```

Create `/system/debug-logger.js`:

```javascript
// ========================================
// DEBUG LOGGER (DIZEE POLISH)
// Wrapper for console.log with DEBUG flag
// ========================================

class DebugLogger {
    static log(category, ...args) {
        if (!GameConfig.DEBUG.enabled) return;
        
        const categoryFlag = `log${category.charAt(0).toUpperCase() + category.slice(1)}`;
        if (GameConfig.DEBUG[categoryFlag] === false) return;
        
        console.log(`[${category.toUpperCase()}]`, ...args);
    }
    
    static scene(...args) { this.log('sceneChanges', ...args); }
    static state(...args) { this.log('stateChanges', ...args); }
    static tether(...args) { this.log('tetherUpdates', ...args); }
    static save(...args) { this.log('saveLoad', ...args); }
    static sensory(...args) { this.log('sensoryFeedback', ...args); }
    static easter(...args) { this.log('easterEggs', ...args); }
    
    // Always logs regardless of debug flag (errors, critical)
    static error(...args) { console.error('[ERROR]', ...args); }
    static warn(...args) { console.warn('[WARN]', ...args); }
}

// Global access
window.DebugLogger = DebugLogger;

export { DebugLogger };
```

### What NOT To Do

- **DO NOT** go replace all 427 console.logs
- Just add the infrastructure
- New code should use `DebugLogger.scene()` etc.
- Old console.logs can be migrated incrementally
- Critical emoji logs (like `console.log('✅ ...')`) are fine to keep

### Verification

Set `DEBUG.enabled = true` in config, open console, should see categorized logs.
Set `DEBUG.enabled = false`, console should be quiet.

---

## TASK 3: SAVE/LOAD ERROR HANDLING AUDIT

**Priority:** HIGH  
**Impact:** Player experience protection  
**Risk:** LOW (adding safety, not changing logic)

### The Problem

Save/Load is the ONE operation that can make players lose progress. Need bulletproof error handling.

### Files to Audit

1. `/system/save-manager.js` (546 lines)
2. `/ui/save-load-ui.js` (580 lines)
3. Any localStorage access in game-engine.js

### What To Check

**1. localStorage Access**

```javascript
// WRAP ALL localStorage calls:
try {
    localStorage.setItem('key', value);
} catch (e) {
    // Safari private mode, quota exceeded, etc.
    DebugLogger.error('Save failed:', e);
    // Show user-friendly message
    this.showSaveError('Could not save. Storage may be full or unavailable.');
}
```

**2. JSON Parse Safety**

```javascript
// WRAP ALL JSON.parse calls:
try {
    const data = JSON.parse(localStorage.getItem('save'));
} catch (e) {
    DebugLogger.error('Corrupted save data:', e);
    // Don't crash - return default/empty state
    return this.getDefaultState();
}
```

**3. Missing Data Graceful Handling**

```javascript
// CHECK before accessing nested properties:
const tether = saveData?.routeState?.tetherLevel ?? 100;
// NOT: saveData.routeState.tetherLevel (can crash)
```

### What To Add

A `showSaveError(message)` method if not exists:

```javascript
showSaveError(message) {
    // Use existing notification system or create simple alert
    if (this.game.achievementManager?.showNotification) {
        this.game.achievementManager.showNotification({
            id: 'save_error',
            icon: '⚠️',
            title: 'SAVE ERROR',
            description: message,
            rare: false
        });
    } else {
        alert(message);  // Fallback
    }
}
```

### Verification

1. Open DevTools > Application > Storage
2. Clear localStorage
3. Try loading a save - should fail gracefully with message
4. Try saving - should work
5. Corrupt a save value manually, try loading - should fail gracefully

---

## WHAT'S OUT OF SCOPE

❌ **Route scene data refactoring** - Aaron needs readable dialogue for edits  
❌ **Migrating existing console.logs** - infrastructure only  
❌ **Migrating existing asset paths** - infrastructure only  
❌ **Any narrative/dialogue changes**  
❌ **New features**

---

## SIGNATURE CONVENTION

**IMPORTANT:** These tasks came from ZeeRah's audit. Use ZEERAH tags:

```javascript
// ZEERAH POLISH: [description]
// ZEERAH FIX: [description]  
// ZEERAH GLOW-UP: [description]
```

Credit goes to the analysis, not just the implementation. Aaron's call. 💚

---

## QUESTIONS?

Route back through Aaron. He's the conductor.

ZEERAH OUT 💚🔥💀

---

*"The glow-up is in the details."*
