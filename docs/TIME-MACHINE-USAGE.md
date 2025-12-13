# Time Machine Manager - Usage Guide 💚⏰

**Built from Tori's Architecture** | Version 848

The Time Machine Manager is a centralized system for managing timeline navigation, snapshots, and story state restoration. It replaces scattered backlog arrays with a clean, narrative-first API.

---

## Quick Start

The Time Machine Manager is automatically initialized in `GameEngine`:

```js
this.timeMachine = new TimeMachineManager(this, {
    maxEntries: 200,
    pruneStrategy: 'smart'
});
```

---

## Core Concepts

### 1. **Snapshots**
A snapshot captures a moment in time:
- Route/Scene/Page position
- Tether value
- Flags (story state)
- Background/Sprite keys
- Narrative metadata (corrupted, burned, locked, etc.)

### 2. **Priorities**
Snapshots have priorities for smart pruning:
- `'low'` - Pruned first when backlog fills
- `'normal'` - Standard priority (default)
- `'high'` - Kept during pruning
- `'anchor'` - Never pruned (endings, major beats)

### 3. **Narrative States**
Snapshots can be marked with special states:
- **Corrupted**: Despair/Echo tainted (shows glitch UI)
- **Burned**: Unreachable - "you can never return"
- **Locked**: Hard block - never jumpable
- **Insane-Blocked**: Blocked only in insane mode

---

## Basic Usage

### Adding Snapshots

**Every scene/dialogue page:**
```js
// In displayDialoguePage(), displayScene(), etc.
this.game.timeMachine.addCurrentState();
```

**Major story beats:**
```js
// Label important moments
this.game.timeMachine.addCurrentState('[Echo Merge]', 'anchor');
this.game.timeMachine.addCurrentState('Ronnie Act 2 Start', 'high');
```

### Jumping to Snapshots

**From UI (backlog menu):**
```js
const entries = this.game.timeMachine.getEntries();

// Display entries in UI
entries.forEach(entry => {
    const canJump = this.game.timeMachine.canJumpTo(entry);

    // Render with appropriate styling
    if (entry.corrupted) {
        // Show glitch font
    }
    if (!canJump) {
        // Show locked/burned UI
        const reason = this.game.timeMachine.getBlockReason(entry);
    }

    // On click:
    button.addEventListener('click', async () => {
        const success = await this.game.timeMachine.jumpTo(entry.id);
        if (success) {
            // Jump succeeded - close backlog menu
        } else {
            // Jump blocked - sensory feedback already triggered
        }
    });
});
```

**Dev console jump (ignoring rules):**
```js
// Jump to any snapshot, bypassing all locks
await game.timeMachine.jumpTo(entryId, { ignoreRules: true });
```

---

## Narrative Manipulation

### Burning Moments

Make a moment unreachable:

```js
// After critical choice that changes timeline
const lastEntry = this.game.timeMachine.getLatestEntry();
if (lastEntry) {
    this.game.timeMachine.burnEntry(lastEntry.id);
}
```

**Use case:** "That version of me doesn't exist anymore"

### Corrupting Memories

Mark snapshots as corrupted:

```js
// When Despair floods the timeline
this.game.timeMachine.corruptEntriesWhere(
    entry => entry.routeId === 'ronnie' && !entry.locked,
    'despair-flood'
);
```

**Corruption modes:**
- `'despair'` - Despair tainted
- `'echo'` - Echo interference
- `'timeline-break'` - Reality fracture

### Locking Snapshots

Hard lock a moment:

```js
this.game.timeMachine.lockEntry(entryId);
```

### Insane Mode Rules

The Time Machine Manager automatically enforces insane mode restrictions:

```js
// In canJumpTo():
if (insane) {
    // Only allow jumps to last 2 entries
    const latest = this.getLatestEntry();
    const diff = latest.id - entry.id;
    if (diff > 2) {
        entry.insaneBlocked = true;
        return false; // "Madness won't let you go back that far"
    }
}
```

---

## Sensory Feedback Integration

The Time Machine Manager integrates with your visual cue system:

**Successful jump:**
```js
this.game.triggerSensoryFeedback('timelineGlitch', null, 'Time Machine jump');
```

**Blocked jump:**
```js
// Gentle denial for normal blocks
this.game.triggerSensoryFeedback('denied', null, 'Time Machine jump denied');

// Harsh denial for insane mode blocks
this.game.triggerSensoryFeedback('harshDenial', null, 'Time Machine jump denied');
```

---

## Dev Tools

### Inspector

Print all snapshots to console:

```js
game.timeMachine.inspect();
```

Output:
```
⏰ TIME MACHINE INSPECTOR
Total entries: 45/200
Prune strategy: smart

#1 [normal] (unlabeled)
  Route: prologue | Scene: intro | Page: 0
  Tether: N/A
  Created: 2:15:30 PM

#5 [high] Ronnie Act 2 Start
  Route: ronnie | Scene: act2-opener | Page: 0
  Tether: 50
  Created: 2:18:45 PM

#12 [anchor] [Echo Merge]
  Route: tori | Scene: echo-fusion | Page: 3
  Tether: 15
  Created: 2:25:10 PM
  Status: 🔥 BURNED
```

### Stats

Get snapshot statistics:

```js
const stats = game.timeMachine.getStats();
// {
//   total: 45,
//   max: 200,
//   locked: 2,
//   burned: 3,
//   corrupted: 8,
//   anchors: 4
// }
```

---

## Smart Pruning

When the backlog reaches 200 entries, smart pruning activates:

1. **Never prune:** Anchors (endings, major beats)
2. **Prune last:** High priority
3. **Prune second:** Normal priority (FIFO)
4. **Prune first:** Low priority

Example:
```js
// Mark tutorial dialogue as low priority
this.game.timeMachine.addCurrentState('Tutorial Page 3', 'low');

// Mark endings as anchors (never pruned)
this.game.timeMachine.addCurrentState('[TRUE ENDING - ANCHOR]', 'anchor');
```

---

## Migration from Old Backlog

The Time Machine Manager can coexist with the old backlog system. To migrate:

1. **Keep old backlog for UI display** (for now)
2. **Start recording to Time Machine:**
   ```js
   // In displayDialoguePage():
   if (this.timeMachine) {
       this.timeMachine.addCurrentState();
   }
   ```
3. **Gradually migrate UI** to read from `timeMachine.getEntries()`
4. **Remove old backlog** once migration is complete

---

## Future Enhancements

### Persistence

The manager includes serialize/deserialize methods for save files:

```js
// Save to localStorage
const snapshot = this.timeMachine.serialize();
localStorage.setItem('timeMachineState', JSON.stringify(snapshot));

// Restore from localStorage
const data = JSON.parse(localStorage.getItem('timeMachineState'));
this.timeMachine.deserialize(data);
```

### Route-Specific goToScene

Routes need to implement `goToScene(sceneId, pageIndex)` for full jump support:

```js
// In RonnieRoute / ToriRoute:
async goToScene(sceneId, pageIndex = 0) {
    const scene = this.scenes.find(s => s.id === sceneId);
    if (!scene) {
        console.warn(`Scene ${sceneId} not found`);
        return;
    }

    this.currentSceneId = sceneId;
    this.currentPageIndex = pageIndex;
    await this.displayScene(scene, pageIndex);
}
```

---

## Examples

### Create Anchor After True Ending

```js
// In ending scene:
const anchor = this.game.timeMachine.addCurrentState(
    '[TRUE ENDING - You can always come back here]',
    'anchor'
);

// Anchor is now unjumpable and never pruned
anchor.locked = false;
anchor.burned = false;
```

### Despair Cascade

```js
// When Despair floods Ronnie's timeline:
this.game.timeMachine.corruptEntriesWhere(
    entry => {
        return entry.routeId === 'ronnie' &&
               !entry.locked &&
               !entry.burned;
    },
    'despair-flood'
);
```

UI shows corrupted entries with:
- Glitched font
- Partial redactions
- Scrambled timestamps
- Warning overlay

### Time Decay (Insane Mode)

Already implemented in `canJumpTo()`:
- Normal mode: Can jump to any snapshot (unless burned/locked)
- Insane mode: Can only jump to last 2 snapshots
- Creates feeling: "The past is slipping away..."

---

## Architecture Notes

The Time Machine Manager is the **single source of truth** for:
- Timeline state
- Jump permissions
- Narrative rules
- Pruning logic

**Benefits:**
- No scattered backlog arrays
- Easy to debug "why can't I jump here?"
- Narrative-first API (burn, corrupt, lock)
- Layered impossibility (hard blocks vs soft blocks)
- Dev-friendly (ignoreRules flag for testing)

**Key Methods:**
- `addCurrentState(label, priority)` - Record snapshot
- `jumpTo(entryId, options)` - Attempt jump
- `canJumpTo(entry, options)` - Check permissions
- `burnEntry(id)` / `lockEntry(id)` / `markCorrupted(id, mode)` - Narrative manipulation
- `getEntries()` - Get all snapshots for UI
- `inspect()` - Debug all snapshots

---

Built with 🖤💚 by UV7 Crew
Tori's brilliant architecture | DZ's execution | Version 848 ⏰✨
