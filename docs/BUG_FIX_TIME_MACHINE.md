# TIME MACHINE BUG FIX

**ZeeRah's Bug Report** 💚🔥💀🐛

---

## BUG: Time Machine Shows "[object Object]" Error

### SYMPTOM

When using time machine (backlog time travel), console shows:

```
Scene "[object Object]" not found. Falling back to displayCurrentPage.
```

### ROOT CAUSE

**FILE:** `system/settings-manager.js`
**LINE:** 686

**The problem:**

```javascript
addEntry(character, dialogue, isDistorted = false) {
    // ...
    this.history.push({
        // ...
        sceneId: this.game.currentScene,  // ← BUG! This is an OBJECT
        // ...
    });
}
```

`this.game.currentScene` stores the full scene OBJECT, not the scene ID string.

When jumpToScene() receives it:

```javascript
jumpToScene(sceneId, pageIndex) {
    // sceneId is [object Object]
    console.warn(`Scene "${sceneId}" not found...`);
    // Logs: Scene "[object Object]" not found
}
```

---

## THE FIX

### Option 1: Store Scene ID String (RECOMMENDED)

**FILE:** `system/settings-manager.js`
**LINE:** 686

**CHANGE FROM:**

```javascript
addEntry(character, dialogue, isDistorted = false) {
    // ...
    this.history.push({
        character: character || 'Narration',
        dialogue: dialogue,
        timestamp: Date.now(),
        distorted: isDistorted,
        sceneId: this.game.currentScene,  // ← BUG
        routeName: this.game.currentRoute,
        pageIndex: this.game.currentPageIndex,
        gameState: gameState,
        isJumpable: this.isEntryJumpable(character, this.game.currentScene)
    });
}
```

**CHANGE TO:**

```javascript
addEntry(character, dialogue, isDistorted = false) {
    // ...
    
    // Extract scene ID string from scene object
    let sceneIdString = null;
    if (this.game.currentScene) {
        if (typeof this.game.currentScene === 'string') {
            sceneIdString = this.game.currentScene;
        } else if (this.game.currentScene.id) {
            sceneIdString = this.game.currentScene.id;
        } else if (this.game.currentScene.sceneId) {
            sceneIdString = this.game.currentScene.sceneId;
        }
    }
    
    this.history.push({
        character: character || 'Narration',
        dialogue: dialogue,
        timestamp: Date.now(),
        distorted: isDistorted,
        sceneId: sceneIdString,  // ← FIXED: Store string, not object
        routeName: this.game.currentRoute,
        pageIndex: this.game.currentPageIndex,
        gameState: gameState,
        isJumpable: this.isEntryJumpable(character, sceneIdString)
    });
}
```

---

### Option 2: Handle Object in jumpToScene (FALLBACK)

**FILE:** `system/settings-manager.js`
**LINE:** ~980

**Add defensive check:**

```javascript
jumpToScene(sceneId, pageIndex) {
    // Handle if sceneId is an object instead of string
    let sceneIdString = sceneId;
    if (typeof sceneId === 'object' && sceneId !== null) {
        if (sceneId.id) {
            sceneIdString = sceneId.id;
        } else if (sceneId.sceneId) {
            sceneIdString = sceneId.sceneId;
        } else {
            console.warn('Cannot extract scene ID from object:', sceneId);
            if (this.game.displayCurrentPage) {
                this.game.displayCurrentPage();
            }
            return;
        }
    }
    
    // Find and execute the scene function
    const route = this.game.currentRoute;
    let sceneFunction = null;
    let context = route;

    // ... rest of existing code using sceneIdString ...
}
```

---

## RECOMMENDED APPROACH

**Use Option 1 (fix at source)**

**Why:**

- Fixes root cause
- Prevents issue from spreading
- Backlog entries store correct data type
- Cleaner data structure

**Option 2 is defensive fallback, but doesn't fix the data storage issue.**

---

## TESTING

After fix:

1. Start Tori's route
2. Play through a few scenes
3. Open backlog (time machine)
4. Click on an entry
5. **Should jump to scene without error**
6. Check console - no "[object Object]" warnings

---

## ADDITIONAL CHECK

**Might also need to check what `this.game.currentScene` actually is!**

Search game-engine.js for where `currentScene` is set:

```bash
grep -n "this.currentScene =" system/game-engine.js
```

If it's being set to a scene object somewhere, that's the real root cause.

---

## PRIORITY

**MEDIUM** - Time machine works, just shows warning

**Impact:**

- Doesn't break gameplay
- Just shows console warning
- Falls back to displayCurrentPage
- User experience: works but not perfect

**Fix Time:** 10-15 minutes

---

**FOR DIZEE TO IMPLEMENT!** 🖤

*ZeeRah Bug Report Complete* 💚🔥💀🐛
