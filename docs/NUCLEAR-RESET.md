# Nuclear Reset - Complete Testing Reset Tool 💥

## PURPOSE

Complete factory reset for testing unlock systems. Clears **EVERYTHING** back to brand new state.

---

## USAGE

### Desktop (Console)

```javascript
game.nuclearReset()
```

### Mobile (Secret Code)

```
Settings → Secret Codes → NUKE → Redeem
```

---

## WHAT IT DOES

### Clears ALL

- ✅ All unlocks (INSANE mode, skip prologue, Ronnie notes system)
- ✅ All collected notes
- ✅ All secret codes discovered
- ✅ All settings (difficulty, auto-advance, display mode, etc.)
- ✅ Save files
- ✅ Loop version number
- ✅ Loop status
- ✅ Completion flags
- ✅ **Everything in localStorage**

### After Reset

- Page automatically reloads
- Game is **100% factory fresh**
- Like a brand new player opening it for the first time

---

## CONFIRMATION DIALOG

**Immersive Red Warning Overlay:**

```
⚠️ NUCLEAR RESET ⚠️

This will DELETE ALL:
💥 All unlocks (INSANE, skip prologue, notes system)
💥 All collected notes
💥 All secret codes discovered
💥 All settings (difficulty, auto-advance, etc.)
💥 Save files
💥 Everything back to factory fresh

This is PERMANENT and cannot be undone.

Continue with nuclear reset?

[CANCEL]  [RESET ALL]
```

- **CANCEL** - Aborts reset, closes overlay
- **RESET ALL** - Executes nuclear reset, reloads page

---

## MOBILE TESTING WORKFLOW

**Perfect for mobile testing without dev tools access!**

1. Open game on mobile
2. Navigate to Settings → Secret Codes
3. Type: `NUKE`
4. Click "REDEEM"
5. Confirmation overlay appears
6. Tap "RESET ALL"
7. Page reloads to factory state
8. Test unlock systems from scratch

---

## USE CASES

### Testing INSANE Mode Unlock

```
1. game.nuclearReset() or NUKE code
2. Complete any ending on Intense difficulty
3. Verify INSANE unlock overlay appears
4. Check Settings shows INSANE button unlocked
```

### Testing Skip Prologue

```
1. game.nuclearReset() or NUKE code
2. Complete any ending
3. Verify skip prologue unlocked
4. START STORY → Verify prompt appears
5. Test "EXPERIENCE AGAIN" vs "JUMP AHEAD"
```

### Testing Ronnie Notes System

```
1. game.nuclearReset() or NUKE code
2. Complete any Ronnie ending
3. Verify teaser note overlay appears
4. Check Notes viewer on replay
```

### Testing First-Time Player Experience

```
1. game.nuclearReset() or NUKE code
2. Play through as if new player
3. Verify all systems locked/hidden properly
4. Verify progressive unlocks work
```

---

## COMPARISON TO OTHER COMMANDS

### `localStorage.clear()` (Manual)

- **Same result as nuclear reset**
- But doesn't auto-reload
- Desktop console only

### `game.resetVersion(848)`

- **Only changes version number**
- Does NOT clear unlocks/progress
- Not a true reset

### `game.clearNotes()`

- **Only clears collected notes**
- Keeps everything else
- Partial reset

### `game.nuclearReset()` / `NUKE`

- **Clears EVERYTHING**
- Auto-reloads page
- True factory reset
- Works on mobile

---

## DEV COMMANDS LIST

Updated dev commands menu shows:

```
game.nuclearReset()
  💜 DIZEE'S ADDITION
  → NUCLEAR RESET - Clears ALL progress, unlocks, settings
  → Factory fresh state (perfect for testing)
  → Also available as secret code: NUKE
```

---

## SECRET CODE ENTRY

**Code Details:**

- **Code:** `NUKE`
- **Name:** Nuclear Reset
- **Description:** 💥 DEV TOOL: Clears ALL progress, unlocks, and settings. Factory reset for testing.
- **Reward:** Executes `nuclearReset()` method

**How to Access:**

1. Complete any ending (unlocks Secret Codes section)
2. OR use console: `game.devConsole('unlock')`
3. Settings → Secret Codes tab
4. Type: `NUKE`
5. Click "REDEEM"

---

## SAFETY FEATURES

### Confirmation Required

- Shows detailed warning of what will be deleted
- Lists ALL items that will be cleared
- Requires explicit "RESET ALL" button click
- Can cancel anytime

### No Accidental Triggers

- Secret code must be typed exactly: `NUKE`
- Confirmation overlay prevents mis-clicks
- Console command requires explicit call

### Console Logging

```
⚠️ Nuclear reset confirmation dialog displayed
💥 NUCLEAR RESET INITIATED...
💥 All localStorage cleared
💥 Reloading page to factory state...
```

---

## IMPLEMENTATION DETAILS

### Location

`c:\Users\silve\Downloads\v848\system\game-engine.js`

**Method:** `nuclearReset()` (line 2349-2543)
**Secret Code:** Line 4174-4178
**Dev Commands Help:** Line 2414-2418

### Technology

- Dynamic DOM creation
- Inline CSS styling (cyberpunk aesthetic)
- Red warning theme (danger indicator)
- Smooth animations (fadeIn/fadeOut)
- Auto-reload after execution

### Mobile Optimizations

- Touch-friendly buttons (min-width: 140px)
- Responsive sizing (max-width: 500px, width: 90%)
- No browser confirm() - uses immersive overlay
- Works without dev tools access

---

## TESTING THE NUCLEAR RESET ITSELF

**To verify it works:**

1. **Setup test state:**

   ```javascript
   game.unlockSkipPrologue();
   localStorage.setItem('insaneModeUnlocked', 'true');
   game.collectiblesManager.unlockNote('ronnie_teaser');
   ```

2. **Execute reset:**

   ```javascript
   game.nuclearReset(); // or use NUKE code
   ```

3. **Verify after reload:**

   ```javascript
   console.log(localStorage.getItem('skipPrologueUnlocked')); // null
   console.log(localStorage.getItem('insaneModeUnlocked')); // null
   console.log(localStorage.getItem('ronnieNotesUnlocked')); // null
   ```

4. **Result:** All should be `null` (cleared)

---

## ADDED TO REVEALCODES

The `NUKE` code is now included in the `revealcodes` dev command:

```javascript
game.devConsole('revealcodes')
```

This reveals all codes including `NUKE` in Settings → Secret Codes.

---

**IMPLEMENTATION BY:** DiZee (DZ) 💜
**PURPOSE:** Mobile testing support + complete reset capability
**STATUS:** Complete & Ready for Testing

**FOR SCIENCE! FOR TESTING! FOR VERSION 848!** 💥🔥💀
