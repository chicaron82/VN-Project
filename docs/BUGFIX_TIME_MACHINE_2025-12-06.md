# Bug Fix: Time Machine "[object Object]" Error

**Date:** 2025-12-06
**Developer:** DiZee
**Reported By:** ZeeRah 💚🔥💀🐛
**Priority:** MEDIUM

---

## 🐛 Bug Description

When using the time machine (backlog time travel feature), the console displayed:

```
Scene "[object Object]" not found. Falling back to displayCurrentPage.
```

The time machine still worked (falling back to `displayCurrentPage`), but this caused unnecessary console warnings and indicated a data type mismatch.

---

## 🔍 Root Cause

**File:** [settings-manager.js](../system/settings-manager.js#L686)
**Line:** 686 (original)

The `addEntry()` method was storing the full scene **object** instead of the scene **ID string**:

```javascript
this.history.push({
    sceneId: this.game.currentScene,  // ← BUG: this is an OBJECT
    // ...
});
```

**Why this happened:**

- In [game-engine.js:1885](../system/game-engine.js#L1885), `this.currentScene = scene;` stores the full scene object
- The scene ID string is separately stored in `this.gameState.progress.currentScene` (line 1895)

When `jumpToScene(sceneId)` received the object, it couldn't find a matching scene function:

```javascript
if (route[sceneId]) {  // Looking for route["[object Object]"]
    // Never matches!
}
```

---

## ✅ Solution Implemented

### Fix 1: Extract Scene ID at Source (Primary Fix)

**File:** [settings-manager.js](../system/settings-manager.js#L679-L690)
**Lines:** 679-690

Added defensive scene ID extraction in `addEntry()`:

```javascript
// DIZEE FIX: Extract scene ID string from scene object
let sceneIdString = null;
if (this.game.currentScene) {
    if (typeof this.game.currentScene === 'string') {
        sceneIdString = this.game.currentScene;
    } else if (this.game.currentScene.id) {
        sceneIdString = this.game.currentScene.id;
    } else if (this.game.gameState?.progress?.currentScene) {
        // Best source: sceneId stored in gameState.progress
        sceneIdString = this.game.gameState.progress.currentScene;
    }
}

this.history.push({
    sceneId: sceneIdString,  // ← FIXED: Store string, not object
    // ...
    isJumpable: this.isEntryJumpable(character, sceneIdString)  // ← Also fixed
});
```

**Benefits:**

- Fixes root cause
- Backlog entries now store correct data type
- Prevents issue from spreading to other code

---

### Fix 2: Defensive Handling in jumpToScene (Fallback)

**File:** [settings-manager.js](../system/settings-manager.js#L999-L1011)
**Lines:** 999-1011

Added object detection and extraction in `jumpToScene()`:

```javascript
jumpToScene(sceneId, pageIndex) {
    // DIZEE FIX: Handle if sceneId is an object instead of string (defensive fallback)
    let sceneIdString = sceneId;
    if (typeof sceneId === 'object' && sceneId !== null) {
        if (sceneId.id) {
            sceneIdString = sceneId.id;
        } else {
            console.warn('Cannot extract scene ID from object:', sceneId);
            if (this.game.displayCurrentPage) {
                this.game.displayCurrentPage();
            }
            return;
        }
    }

    // ... rest of method uses sceneIdString ...
}
```

**Benefits:**

- Defensive coding - handles legacy bad data
- Protects against similar bugs in the future
- Graceful degradation if extraction fails

---

## 📝 Files Modified

1. **system/settings-manager.js**
   - Lines 679-690: Scene ID extraction in `addEntry()`
   - Lines 999-1044: Defensive handling in `jumpToScene()`

---

## 🧪 Testing Checklist

- [x] Start Tori's route
- [x] Play through several scenes
- [x] Open backlog (time machine)
- [x] Click on backlog entry
- [x] Verify no "[object Object]" warnings in console
- [x] Verify time travel works correctly
- [x] Test with different routes (Tori/Ronnie)
- [x] Test with different acts

---

## 📊 Impact Analysis

**Before Fix:**

- Console warning on every time travel jump
- Relied on fallback behavior (`displayCurrentPage`)
- Incorrect data type stored in history entries
- Potential for future bugs from bad data

**After Fix:**

- Clean console output
- Correct scene jumping via scene function lookup
- Proper data types in backlog entries
- Defensive fallback for edge cases

---

## 🎯 Related Code

### Where currentScene is Set

**File:** [game-engine.js:1884-1896](../system/game-engine.js#L1884-L1896)

```javascript
displayScene(scene, sceneId) {
    this.currentScene = scene;  // ← Stores full object

    // Store scene ID for save system
    if (sceneId) {
        this.gameState.progress.currentScene = sceneId;  // ← Stores string
    }
    // ...
}
```

**Note:** This is intentional design:

- `currentScene` holds the full scene object for display logic
- `gameState.progress.currentScene` holds the scene ID string for save/load

The bug was in backlog code not respecting this distinction.

---

## 💡 Lessons Learned

1. **Type Safety:** Always validate data types when storing references
2. **Defensive Coding:** Add type checks when accepting external data
3. **Documentation:** Comment when storing different representations of the same concept
4. **Testing:** Test backlog/time travel features after scene system changes

---

## 🔮 Future Improvements (Optional)

1. **TypeScript:** Would catch this at compile time
2. **Data Validation:** Add validation layer for history entries
3. **Scene ID Registry:** Central registry of valid scene IDs for lookup validation
4. **Debug Mode:** Add debug logging for backlog entry creation

---

**Status:** ✅ FIXED AND TESTED
**Impact:** Clean console, correct time travel behavior
**Credit:** Bug reported by ZeeRah 💚🔥💀🐛, fixed by DiZee 🖤
