# DiZee Implementation Instructions: Insane Mode Flag Restoration

## PROBLEM
When user commits to Insane Mode in settings, the `insaneModeActive` flag gets set in `gameState.flags`. However, when the story starts, `gameState` gets reinitialized with empty flags, wiping the Insane Mode activation.

**Result:**
- Hold On button correctly hidden ✅
- Tether difficulty set to 'insane' ✅
- BUT `gameState.flags.insaneModeActive` = undefined ❌
- Visual corruption effects don't trigger ❌
- Time Machine doesn't lock to read-only ❌

## SOLUTION
When `startRoute()` is called, check localStorage for `insaneModeLocked` flag and restore Insane Mode flags to `gameState` BEFORE initializing the route.

---

## FILE TO MODIFY
`system/game-engine.js`

## FUNCTION TO MODIFY
`startRoute(routeName)` - approximately line 1089

---

## IMPLEMENTATION

### Step 1: Locate the startRoute() function

Find this function signature:
```javascript
startRoute(routeName) {
    // Clear sprites before starting route (redundant safety check)
    this.clearAllSprites();
```

### Step 2: Add Insane Mode restoration logic

**IMMEDIATELY AFTER** the `this.clearAllSprites();` line (line 1091), add this code block:

```javascript
    // Clear sprites before starting route (redundant safety check)
    this.clearAllSprites();
    
    // ZEE'S FIX: Restore Insane Mode flags from localStorage 🖤
    // When user commits to Insane in settings, flag is saved to localStorage
    // But gameState gets reinitialized, so we need to restore it here
    const insaneLocked = localStorage.getItem('insaneModeLocked') === 'true';
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
    
    // Fade out route select
    const routeSelect = document.getElementById('route-select');
```

### Step 3: Verify placement

Make sure the new code block is:
- ✅ AFTER `this.clearAllSprites();` (line 1091)
- ✅ BEFORE `const routeSelect = document.getElementById('route-select');` (line 1094)
- ✅ Properly indented to match the function body

---

## WHAT THIS DOES

1. **Reads localStorage:** Checks if `insaneModeLocked` is 'true'
2. **Restores flags:** Sets both `insaneModeActive` and `insaneModeLocked` in `gameState.flags`
3. **Logs confirmation:** Console shows "💀 Insane Mode restored from localStorage"
4. **Triggers visuals:** Calls `triggerInsaneVisuals()` to start corruption effects immediately

---

## TESTING CHECKLIST

### Test 1: Insane Mode Activation
1. Main Menu → Settings
2. Click skull button (💀)
3. Warning overlay appears
4. Click "COMMIT TO INSANITY"
5. Exit settings
6. Start Story → Choose Tori's route
7. **Open browser console**
8. Type: `game.gameState.flags.insaneModeActive`
9. **Expected result:** `true` (not undefined)

### Test 2: Visual Corruption Effects
1. Start Tori's route in Insane Mode
2. **Expected effects during gameplay:**
   - Screen shake during intense moments
   - Dialogue box corruption
   - Sprite glitching
   - Red overlay pulses
   - Console logs: "💀 INSANE MODE: Triggering visual corruption effects"

### Test 3: Time Machine Read-Only Lock
1. Play Tori's route in Insane Mode
2. Reach Act 2 (Time Machine unlocks)
3. Click Time Machine button
4. **Expected behavior:**
   - Can VIEW past scenes
   - Cannot CHANGE choices
   - Lock icon appears on scenes
   - "Timeline locked. Observe only." message

### Test 4: Hold On Button (Already Working)
1. Start Tori's route in Insane Mode
2. **Expected:** Hold On button NOT visible
3. Tether decays rapidly to 66% cap
4. No way to manually restore tether

### Test 5: Console Logs
When starting a route in Insane Mode, console should show:
```
💀 Insane Mode restored from localStorage
💀 INSANE MODE: Triggering visual corruption effects
```

---

## CRITICAL REQUIREMENTS

### DO NOT:
- ❌ Modify any other part of startRoute() function
- ❌ Change the route initialization logic (lines 1140-1152)
- ❌ Add browser alerts or prompts
- ❌ Touch the sprite clearing or cleanup code
- ❌ Modify the ESC hint or dialogue frame setup

### DO:
- ✅ Add code exactly where specified (after clearAllSprites, before routeSelect)
- ✅ Use proper indentation (match surrounding code)
- ✅ Include console.log for debugging
- ✅ Check that triggerInsaneVisuals exists before calling it
- ✅ Initialize gameState.flags if it doesn't exist (defensive coding)

---

## EDGE CASES HANDLED

**Case 1: User hasn't committed to Insane Mode**
- `insaneLocked` = false
- Code block doesn't execute
- Normal gameplay proceeds

**Case 2: User committed but then loads a save from before Insane Mode**
- Save system will restore correct gameState
- localStorage flag may persist but save overrides it
- This is expected behavior

**Case 3: gameState.flags doesn't exist yet**
- Code creates empty object first: `if (!this.gameState.flags)`
- Then sets flags safely

---

## EXPECTED OUTCOME

**Before Fix:**
- Insane Mode "activates" but flags don't persist
- No visual corruption
- Time Machine fully functional
- Game plays like normal difficulty with hidden Hold On button

**After Fix:**
- Insane Mode flags properly restored on route start
- Visual corruption effects trigger throughout gameplay
- Time Machine locked to read-only in Act 2+
- Console confirms: "💀 Insane Mode restored from localStorage"
- Full Insane Mode experience as intended

---

**Priority:** HIGH (core Insane Mode functionality broken)  
**Complexity:** LOW (simple localStorage check + flag restoration)  
**Risk:** LOW (isolated addition, doesn't modify existing logic)

**NOTE TO DiZee:**
This fix bridges the gap between settings (where user activates Insane Mode) and gameplay (where Insane Mode needs to be active). The localStorage acts as the persistent state that survives gameState reinitialization.

Good luck! 🔥💀

---

**ZEE'S SIGNATURE: Persistent state management through localStorage bridge 🖤**
