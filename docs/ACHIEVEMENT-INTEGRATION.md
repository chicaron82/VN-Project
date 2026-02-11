# Achievement System Integration Guide

## Overview

The achievement system is now fully integrated! All hooks are automatic except for ending achievements.

## Automatic Triggers

### ✅ Already Hooked (No Action Needed)

- **Route Start Timer** - Automatically starts when `game.startRoute()` is called
- **Note Collection** - Automatically checks when `collectiblesManager.unlockNote()` is called
- **Backlog Views** - Automatically tracks when backlog is opened
- **ToriGatchi** - Automatically checks every 5 seconds

## Manual Trigger Required

### Ending Achievements

When a route reaches an ending, add this line:

```javascript
// In your ending scene (e.g., bad_ending, true_ending, digital_ending)
window.checkEndingAchievements('bad_ending'); // or 'true_ending', 'digital_ending'
```

**Example locations to add:**

- `routes/tori-route-act1.js` - In bad ending scene
- `routes/tori-route-act1.js` - In true ending scene  
- `routes/ronnie-route-act1.js` - In digital ending scene

## Achievement List

1. 🏃 **Speed Runner** - Complete any route in under 30 minutes
2. 📚 **Archivist** - Collect all 13 notes (Tori route)
3. 🔄 **Time Traveler** - Reach any ending
4. 💔 **Heartbreaker** - Reach the bad ending
5. ✨ **True Ending** - Reach the true ending
6. 🎮 **Completionist** - Unlock all endings
7. 🐣 **Pet Parent** - Unlock ToriGatchi
8. ⚡ **Insane** - Complete Insane Mode
9. 🔍 **Explorer** - View 100+ dialogue entries in backlog

## Testing

Open the achievements viewer from the main menu (🏆 ACHIEVEMENTS button) to see all achievements and their unlock status.

## Debugging

Check console for achievement logs:

- `🏃 Achievement: Route timer started`
- `🏆 Achievement hooks installed successfully`
- `🏆 Checked achievements for ending: [endingId]`
- `🏆 Achievement unlocked: [name]`
