# Echo Memory System Testing Guide

## Console Testing Commands

Open browser console (F12) and run these commands to test the Echo Memory System:

### 1. Verify System is Loaded
```javascript
console.log('Echo Memory System:', game.echoMemory);
console.log('Current Memory:', game.echoMemory.memory);
```

### 2. Test Awareness Levels
```javascript
// Set awareness levels manually for testing
game.echoMemory.memory.echoAwareness.hope = 2;
game.echoMemory.memory.echoAwareness.gentle = 2;
game.echoMemory.memory.echoAwareness.despair = 2;
game.echoMemory.saveMemory();
console.log('Awareness levels set to 2');
```

### 3. Test Echo Comments

**Test Hope Echo:**
```javascript
game.echoMemory.triggerEchoComment('hope', 'general');
```

**Test Gentle Echo:**
```javascript
game.echoMemory.triggerEchoComment('gentle', 'noteHunting');
```

**Test Despair Echo:**
```javascript
game.echoMemory.triggerEchoComment('despair', 'despairHijack');
```

### 4. Test Loop Recording
```javascript
game.echoMemory.recordLoop('tori');
console.log('Total loops:', game.echoMemory.memory.totalLoops);
console.log('Awareness levels:', game.echoMemory.memory.echoAwareness);
```

### 5. Test Death Recording
```javascript
game.echoMemory.recordDeath('test_scene', 'tether');
console.log('Tether deaths:', game.echoMemory.memory.tetherDeaths);
```

### 6. Test Save Scumming Detection
```javascript
game.echoMemory.recordSave();
setTimeout(() => {
    game.echoMemory.recordLoad();
    console.log('Save scum count:', game.echoMemory.memory.saveScumCount);
}, 1000);
```

### 7. Test Choice Recording
```javascript
game.echoMemory.recordChoice('test_choice', 0);
game.echoMemory.recordChoice('test_choice', 1); // Different choice
game.echoMemory.recordChoice('test_choice', 1); // Repeat wrong choice
console.log('Choice history:', game.echoMemory.memory.choiceHistory);
console.log('Wrong repeats:', game.echoMemory.memory.wrongChoiceRepeats);
```

### 8. Test Notes Viewer Tracking
```javascript
game.echoMemory.recordNotesViewerOpen();
console.log('Notes opens:', game.echoMemory.memory.notesViewerOpens);
```

### 9. Simulate Multiple Loops (Escalate Awareness)
```javascript
// Simulate 10 loops to trigger awareness level 3
for (let i = 0; i < 10; i++) {
    game.echoMemory.recordLoop('tori');
}
console.log('After 10 loops - Awareness:', game.echoMemory.memory.echoAwareness);
```

### 10. Test Glitch Comments (Level 4)
```javascript
// Set to high loop count for glitch text
game.echoMemory.memory.totalLoops = 25;
game.echoMemory.updateAwarenessLevels();
game.echoMemory.triggerEchoComment('hope', 'general');
```

### 11. Reset Everything
```javascript
localStorage.removeItem('echoMemory_v1');
game.echoMemory.loadMemory();
console.log('Echo memory reset');
```

---

## Gameplay Testing Checklist

### Hope Echo (Persistence)
- [ ] Start a new game (loop 1)
- [ ] Play through to any ending
- [ ] Start again (loop 2) - Hope should comment at awareness level 1
- [ ] Repeat 5 times total - Hope awareness should be level 2
- [ ] Repeat 10 times - Hope awareness should be level 3
- [ ] Repeat 20 times - Hope awareness should be level 4 (glitch text)

### Gentle Echo (Hesitation)
- [ ] Open notes viewer 3+ times - Gentle comments on note hunting
- [ ] Save the game
- [ ] Immediately load within 10 seconds - Save scum detected, Gentle comments
- [ ] Sit at a choice for 15+ seconds - Long pause detected

### Despair Echo (Failure)
- [ ] Let tether reach 0% - Despair comments on death
- [ ] Reach the ice cream scene in Tori's route Act 2
- [ ] Choose "Thank him" or "Be playful" (NOT Tiger Tail)
- [ ] Despair should hijack the choice and comment

### Achievement
- [ ] Trigger all three echoes (Hope, Gentle, Despair) at least once
- [ ] "Remembered" achievement should unlock

---

## Expected Behaviors

### Status Bar Display
- Echo comments should appear in the status notification bar
- Icons: 💫 (Hope), 🌙 (Gentle), 🖤 (Despair)
- Format: "Echo: [message]"
- Duration: 4 seconds
- Priority: high (appears above auto-save notifications)

### Awareness Escalation
- **Level 0 (Dormant):** No comments
- **Level 1 (Vague):** "Another loop begins..."
- **Level 2 (Aware):** "You're back again. Does that mean there's still hope?"
- **Level 3 (Fourth Wall):** "How many times have we said goodbye?"
- **Level 4 (Glitch):** "Y̶o̶u̶'̶v̶e̶ ̶b̶e̶e̶n̶ ̶h̶e̶r̶e̶..." (corrupted text)

### Persistence
- All tracking survives browser close/refresh
- Stored in localStorage as 'echoMemory_v1'
- Global across all save files

---

## Known Integration Points

### Files with Hooks
1. `system/scene-progression-controller.js:180` - recordLoop()
2. `system/tether-system.js:666` - recordDeath()
3. `system/save-manager.js:80` - recordSave()
4. `system/save-manager.js:203` - recordLoad()
5. `system/scene-renderer.js:167` - recordChoice()
6. `ui/standalone-notes-viewer.js:156` - recordNotesViewerOpen()
7. `routes/tori-route-act2.js:65` - Despair hijack trigger

### Initialization
- Imported in: `system/main.js:80`
- Initialized in: `index.html` (after StatusNotificationController)
- Available as: `game.echoMemory`
