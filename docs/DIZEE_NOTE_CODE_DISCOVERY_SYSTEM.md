# DiZee Instructions: Difficulty-Gated Notes + RNG Code Discovery System

**Revolutionary Replayability System**
**Aaron's Concept + Tori's Refinements + ZeeRah's Implementation Specs** 💚🔥💀

---

## OVERVIEW

Transform notes and secret codes from "collect once" to "hunt across multiple playthroughs." Notes are gated by difficulty (Easy/Normal/Intense/INSANE), and discoverable codes drop randomly from notes with smart pity systems.

**Key Innovation:**

- Notes unlock progressively with harder difficulties
- Secret codes have chance to drop from notes (RNG per save)
- Utility codes guaranteed, lore codes RNG-based
- Dev commands NEVER appear in notes (testing only)

**Result:**

- Massive replay value
- Difficulty choice matters
- Each playthrough feels different
- Completionists play multiple times

**Estimated Effort:** 6-8 hours
**Priority:** HIGH (post-current-tasks OR launch feature)
**Risk:** MEDIUM (requires careful save data management)

---

## DESIGN PRINCIPLES

### Core Concepts

**1. Difficulty Gates Content**

- Easy: 4 base notes
- Normal: +6 notes (10 total)
- Intense: +4 notes (14 total)
- INSANE: +3 exclusive notes (17 total)

**2. RNG Locked Per Save**

- Roll code drop ONCE when note first viewed in that save
- Store result in save data
- Consistent within playthrough, different across saves
- **NOT a slot machine every click!**

**3. Two Code Categories**

- **Discoverable Codes (12):** Appear in notes, tracked in codes tab
  - 9 Lore codes (RNG drops)
  - 3 Utility codes (guaranteed drops)
- **Dev Commands (20+):** NEVER in notes, manual entry only

**4. Pity System**

- Track times viewed per note
- After 2-3 views without drop → force drop
- Feels like luck, actually guaranteed

**5. Visual Feedback**

- "ENCRYPTED SIGNAL DETECTED" when code drops
- "ENCRYPTED SIGNAL: ███████ (unstable)" when no drop
- Makes RNG feel intentional

---

## PART 1: NOTE METADATA STRUCTURE

### FILE: `system/game-config.js`

Add complete note metadata with difficulty gates and code pools.

```javascript
// ========================================
// NOTES SYSTEM - DIFFICULTY GATING & CODE DROPS
// ========================================

const GAME_NOTES = {
    // ========================================
    // BASE NOTES (Available in ALL difficulties)
    // ========================================
    
    'welcome_email': {
        difficulty: 'easy',
        title: 'Welcome to the System',
        type: 'tutorial',
        pool: null,  // No codes in tutorial notes
        dropChance: 0,
        guaranteed: null
    },
    
    'first_contact': {
        difficulty: 'easy',
        title: 'First Connection Log',
        type: 'story',
        pool: ['torigatchi'],
        dropChance: 0.3,
        guaranteed: null
    },
    
    'hospital_admission': {
        difficulty: 'easy',
        title: 'Hospital Admission Report',
        type: 'story',
        pool: ['bootstrap', '848'],
        dropChance: 0.3,
        guaranteed: null
    },
    
    'device_basics': {
        difficulty: 'easy',
        title: 'Device Operation Manual',
        type: 'tutorial',
        pool: ['ronniegatchi'],
        dropChance: 0.4,
        guaranteed: 'saveanywhere'  // Tutorial utility code
    },
    
    // ========================================
    // NORMAL DIFFICULTY NOTES
    // ========================================
    
    'tori_background': {
        difficulty: 'normal',
        title: 'Personal File: Victoria Chen',
        type: 'story',
        pool: ['always3', 'torigatchi'],
        dropChance: 0.4,
        guaranteed: null
    },
    
    'echo_emergence': {
        difficulty: 'normal',
        title: 'Echo Voice Analysis',
        type: 'technical',
        pool: ['echo', 'always3'],
        dropChance: 0.4,
        guaranteed: 'echobreak'  // Utility code for Echo control
    },
    
    'fragmentation_study': {
        difficulty: 'normal',
        title: 'Consciousness Fragmentation Study',
        type: 'technical',
        pool: ['echo', 'bootstrap'],
        dropChance: 0.4,
        guaranteed: null
    },
    
    'connection_theory': {
        difficulty: 'normal',
        title: 'Digital Connection Theory',
        type: 'technical',
        pool: ['torigatchi', 'ronniegatchi'],
        dropChance: 0.4,
        guaranteed: null
    },
    
    'old_man_letter': {
        difficulty: 'normal',
        title: 'Letter from Future Self',
        type: 'story',
        pool: ['bootstrap', '848'],
        dropChance: 0.5,
        guaranteed: null
    },
    
    'cassandra_log': {
        difficulty: 'normal',
        title: 'Cassandra Protocol Log',
        type: 'technical',
        pool: ['848', 'bootstrap'],
        dropChance: 0.4,
        guaranteed: null
    },
    
    // ========================================
    // INTENSE DIFFICULTY NOTES
    // ========================================
    
    'bootstrap_paradox': {
        difficulty: 'intense',
        title: 'The Bootstrap Paradox Explained',
        type: 'technical',
        pool: ['bootstrap'],
        dropChance: 0.6,
        guaranteed: null
    },
    
    'timeline_documentation': {
        difficulty: 'intense',
        title: 'Timeline Analysis: Attempts 1-847',
        type: 'technical',
        pool: ['bootstrap', '848'],
        dropChance: 0.5,
        guaranteed: null
    },
    
    'attempt_log_847': {
        difficulty: 'intense',
        title: 'Final Failure: Attempt 847',
        type: 'story',
        pool: ['848'],
        dropChance: 0.5,
        guaranteed: 'tetherlock'  // Utility code for tether control
    },
    
    'merge_failure_analysis': {
        difficulty: 'intense',
        title: 'Merge Failure Analysis',
        type: 'technical',
        pool: ['echo', 'bootstrap'],
        dropChance: 0.5,
        guaranteed: null
    },
    
    // ========================================
    // INSANE DIFFICULTY NOTES (Exclusive)
    // ========================================
    
    'uv7_collaboration': {
        difficulty: 'insane',
        title: 'United Voices 7: The Team',
        type: 'meta',
        pool: ['uv7crew', 'dizee', 'chicharon'],
        dropChance: 0.8,
        guaranteed: null
    },
    
    'dev_commentary': {
        difficulty: 'insane',
        title: 'Developer Commentary: The Journey',
        type: 'meta',
        pool: ['chicharon', 'dizee'],
        dropChance: 0.8,
        guaranteed: null
    },
    
    'version_848_truth': {
        difficulty: 'insane',
        title: 'The Truth About Version 848',
        type: 'meta',
        pool: ['848', 'bootstrap', 'uv7crew'],
        dropChance: 1.0,  // Always drops one code
        guaranteed: null
    }
};

// ========================================
// CODE CATEGORIES
// ========================================

const DISCOVERABLE_CODES = {
    // Lore codes (9) - RNG drops from notes
    lore: [
        'torigatchi',
        'ronniegatchi',
        'always3',
        'uv7crew',
        'chicharon',
        'bootstrap',
        'echo',
        '848',
        'dizee'
    ],
    
    // Utility codes (3) - Guaranteed drops from specific notes
    utility: [
        'echobreak',      // From echo_emergence note
        'tetherlock',     // From attempt_log_847 note
        'saveanywhere'    // From device_basics note
    ]
};

// Dev commands - NEVER appear in notes, manual entry only
const DEV_COMMANDS = [
    'clearnotes', 'reset848', 'reset849',
    'unlockskip', 'skipintro', 'unlockcodes',
    'revealcodes', 'freezetether', 'resumetether',
    'settethermax', 'settether50', 'unlockact1saves',
    'enableinsane', 'disableinsane', 'clearall',
    'nuke', 'devhelp', 'devhud', 'succeeding', 'accepting'
];

// ========================================
// HELPER FUNCTIONS
// ========================================

function getAvailableNotes(difficulty) {
    const difficultyOrder = ['easy', 'normal', 'intense', 'insane'];
    const currentIndex = difficultyOrder.indexOf(difficulty.toLowerCase());
    
    if (currentIndex === -1) {
        console.warn('Invalid difficulty, defaulting to normal');
        return getAvailableNotes('normal');
    }
    
    // Get all notes up to and including current difficulty
    const availableDifficulties = difficultyOrder.slice(0, currentIndex + 1);
    
    const notes = [];
    for (const [noteId, noteMeta] of Object.entries(GAME_NOTES)) {
        if (availableDifficulties.includes(noteMeta.difficulty)) {
            notes.push(noteId);
        }
    }
    
    return notes;
}

function getNoteMetadata(noteId) {
    return GAME_NOTES[noteId] || null;
}

function getTotalDiscoverableCodes() {
    return DISCOVERABLE_CODES.lore.length + DISCOVERABLE_CODES.utility.length;
}

function isCodeDiscoverable(code) {
    return DISCOVERABLE_CODES.lore.includes(code) || 
           DISCOVERABLE_CODES.utility.includes(code);
}

function isDevCommand(code) {
    return DEV_COMMANDS.includes(code);
}
```

---

## PART 2: SAVE DATA EXTENSIONS

### FILE: `system/save-manager.js`

Extend save data to track note views and code drops per save.

```javascript
// ========================================
// SAVE DATA STRUCTURE (EXTENDED)
// ========================================

// Add to existing save data structure:
{
    // ... existing save data ...
    
    // Note discovery system
    noteDiscovery: {
        // Track times viewed per note (for pity system)
        seenNotes: {
            [noteId]: timesViewed
        },
        
        // Track code drops per note (RNG locked per save)
        noteCodeDrops: {
            [noteId]: {
                hasCode: true/false,
                code: 'bootstrap' or null,
                timestamp: Date.now()
            }
        },
        
        // Track which notes have been collected (unlocked)
        collectedNotes: [noteId1, noteId2, ...]
    }
}
```

### Implementation

```javascript
// In SaveManager class

// ========================================
// NOTE DISCOVERY SAVE/LOAD
// ========================================

saveNoteDiscovery(slot) {
    const discoveryData = {
        seenNotes: this.game.collectiblesManager.seenNotes || {},
        noteCodeDrops: this.game.collectiblesManager.noteCodeDrops || {},
        collectedNotes: [...this.game.collectiblesManager.collectedNotes]
    };
    
    try {
        localStorage.setItem(`noteDiscovery_${slot}`, JSON.stringify(discoveryData));
    } catch (e) {
        console.error('Failed to save note discovery data:', e);
    }
}

loadNoteDiscovery(slot) {
    const saved = localStorage.getItem(`noteDiscovery_${slot}`);
    if (!saved) return null;
    
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to load note discovery data:', e);
        return null;
    }
}

// Modify existing saveGame() to include note discovery
saveGame(slot, isAutoSave = false) {
    // ... existing save logic ...
    
    // DIZEE: Save note discovery data
    this.saveNoteDiscovery(slot);
    
    // ... rest of save logic ...
}

// Modify existing loadGame() to restore note discovery
loadGame(slot) {
    // ... existing load logic ...
    
    // DIZEE: Load note discovery data
    const discoveryData = this.loadNoteDiscovery(slot);
    if (discoveryData) {
        this.game.collectiblesManager.seenNotes = discoveryData.seenNotes || {};
        this.game.collectiblesManager.noteCodeDrops = discoveryData.noteCodeDrops || {};
        this.game.collectiblesManager.collectedNotes = new Set(discoveryData.collectedNotes || []);
    }
    
    // ... rest of load logic ...
}
```

---

## PART 3: COLLECTIBLES MANAGER UPDATES

### FILE: `system/collectibles-manager.js`

Add note discovery logic with RNG, pity system, and difficulty filtering.

```javascript
// ========================================
// COLLECTIBLES MANAGER - NOTE DISCOVERY
// ========================================

class CollectiblesManager {
    constructor(game) {
        this.game = game;
        this.collectedNotes = new Set();
        
        // DIZEE: Note discovery tracking
        this.seenNotes = {};           // { noteId: timesViewed }
        this.noteCodeDrops = {};       // { noteId: { hasCode, code, timestamp } }
        this.unreadCount = 0;
        this.readNotes = new Set();
        
        this.loadCollectedNotes();
        this.loadReadNotes();
    }
    
    // ========================================
    // AVAILABLE NOTES (DIFFICULTY FILTERING)
    // ========================================
    
    getAvailableNotes() {
        const difficulty = this.game.settings?.difficulty || 'normal';
        return getAvailableNotes(difficulty);
    }
    
    canCollectNote(noteId) {
        const noteMeta = getNoteMetadata(noteId);
        if (!noteMeta) return false;
        
        const availableNotes = this.getAvailableNotes();
        return availableNotes.includes(noteId);
    }
    
    // ========================================
    // NOTE UNLOCKING (WITH DIFFICULTY CHECK)
    // ========================================
    
    unlockNote(noteId) {
        // Check if note is available at current difficulty
        if (!this.canCollectNote(noteId)) {
            console.log(`Note ${noteId} not available at current difficulty`);
            return false;
        }
        
        if (this.collectedNotes.has(noteId)) {
            return false; // Already collected
        }

        this.collectedNotes.add(noteId);
        this.saveCollectedNotes();
        
        // Update unread count
        this.updateUnreadCount();
        
        // Animate inbox button
        this.animateNewMail();
        
        // Show notification
        const noteMeta = getNoteMetadata(noteId);
        const title = noteMeta ? noteMeta.title : 'New Message';
        this.game.showNotification(`📧 ${title}`, 'info');
        
        return true;
    }
    
    // ========================================
    // CODE DROP SYSTEM (RNG + PITY)
    // ========================================
    
    processNoteDrop(noteId) {
        const noteMeta = getNoteMetadata(noteId);
        if (!noteMeta) return null;
        
        // Check if we already have a drop result for this note (in this save)
        if (this.noteCodeDrops[noteId]) {
            return this.noteCodeDrops[noteId];
        }
        
        // Track times viewed
        this.seenNotes[noteId] = (this.seenNotes[noteId] || 0) + 1;
        const timesViewed = this.seenNotes[noteId];
        
        // Check for guaranteed code (utility codes)
        if (noteMeta.guaranteed) {
            const dropData = {
                hasCode: true,
                code: noteMeta.guaranteed,
                timestamp: Date.now(),
                wasGuaranteed: true
            };
            
            this.noteCodeDrops[noteId] = dropData;
            this.discoverCode(noteMeta.guaranteed);
            
            console.log(`✅ Guaranteed code drop: ${noteMeta.guaranteed}`);
            return dropData;
        }
        
        // Check if note has a code pool
        if (!noteMeta.pool || noteMeta.pool.length === 0) {
            const dropData = { hasCode: false, code: null };
            this.noteCodeDrops[noteId] = dropData;
            return dropData;
        }
        
        // Pity system: Force drop after 3 views
        const PITY_THRESHOLD = 3;
        let shouldDrop = false;
        
        if (timesViewed >= PITY_THRESHOLD) {
            shouldDrop = true;
            console.log(`🎁 Pity system triggered for ${noteId} after ${timesViewed} views`);
        } else {
            // Normal RNG check
            shouldDrop = Math.random() < noteMeta.dropChance;
        }
        
        if (shouldDrop) {
            // Pick random code from pool
            const code = noteMeta.pool[Math.floor(Math.random() * noteMeta.pool.length)];
            
            const dropData = {
                hasCode: true,
                code: code,
                timestamp: Date.now(),
                wasGuaranteed: false
            };
            
            this.noteCodeDrops[noteId] = dropData;
            this.discoverCode(code);
            
            console.log(`🎲 RNG code drop: ${code} from ${noteId}`);
            return dropData;
        } else {
            const dropData = { hasCode: false, code: null };
            this.noteCodeDrops[noteId] = dropData;
            
            console.log(`❌ No drop from ${noteId} (${timesViewed}/${PITY_THRESHOLD} views)`);
            return dropData;
        }
    }
    
    discoverCode(code) {
        // Delegate to secret codes manager
        if (this.game.secretCodesManager) {
            this.game.secretCodesManager.discoverCode(code);
        }
    }
    
    // ========================================
    // NOTE DISPLAY (WITH CODE DROP)
    // ========================================
    
    displayNote(noteId) {
        const noteMeta = getNoteMetadata(noteId);
        if (!noteMeta) {
            console.error(`Note metadata not found: ${noteId}`);
            return;
        }
        
        // Mark as read
        this.markNoteAsRead(noteId);
        
        // Get/generate code drop for this note
        const dropData = this.processNoteDrop(noteId);
        
        // Display note content
        this.renderNoteContent(noteId, noteMeta, dropData);
    }
    
    renderNoteContent(noteId, noteMeta, dropData) {
        // ... existing note display logic ...
        
        // DIZEE: Add code drop footer
        if (dropData.hasCode) {
            this.renderCodeDropFooter(dropData.code);
        } else if (noteMeta.pool && noteMeta.pool.length > 0) {
            // Show hint that code exists but didn't drop
            this.renderCodeHintFooter();
        }
    }
    
    renderCodeDropFooter(code) {
        const footer = document.createElement('div');
        footer.className = 'note-code-footer code-detected';
        footer.innerHTML = `
            <div class="code-divider">━━━━━━━━━━━━━━━━━━━━━━</div>
            <div class="code-signal">
                <div class="signal-header">ENCRYPTED SIGNAL DETECTED</div>
                <div class="signal-code">${code.toUpperCase()}</div>
            </div>
            <div class="code-divider">━━━━━━━━━━━━━━━━━━━━━━</div>
        `;
        
        // Append to note display
        const noteContainer = document.getElementById('note-content');
        if (noteContainer) {
            noteContainer.appendChild(footer);
        }
        
        // Haptic feedback
        if (this.game.settings?.hapticEnabled) {
            this.game.triggerHaptic('success');
        }
    }
    
    renderCodeHintFooter() {
        const footer = document.createElement('div');
        footer.className = 'note-code-footer code-hint';
        footer.innerHTML = `
            <div class="code-divider">━━━━━━━━━━━━━━━━━━━━━━</div>
            <div class="code-signal-hint">
                <div class="signal-header">ENCRYPTED SIGNAL: ███████</div>
                <div class="signal-status">(signal unstable)</div>
            </div>
            <div class="code-divider">━━━━━━━━━━━━━━━━━━━━━━</div>
        `;
        
        // Append to note display
        const noteContainer = document.getElementById('note-content');
        if (noteContainer) {
            noteContainer.appendChild(footer);
        }
    }
    
    // ... rest of existing CollectiblesManager methods ...
}
```

---

## PART 4: CSS STYLING

### FILE: `styles.css`

Add styles for code drop footers and hints.

```css
/* ========================================
   NOTE CODE DROP FOOTERS
   ======================================== */

.note-code-footer {
    margin-top: 2em;
    padding-top: 1em;
    font-family: 'Courier New', monospace;
}

.code-divider {
    color: rgba(0, 255, 136, 0.5);
    text-align: center;
    font-size: 0.9em;
    margin: 0.5em 0;
}

/* Code Detected (Successful Drop) */
.code-detected .signal-header {
    text-align: center;
    color: #00ff88;
    font-weight: bold;
    font-size: 0.9em;
    margin-bottom: 0.5em;
    animation: signalPulse 1.5s ease-in-out infinite;
}

.code-detected .signal-code {
    text-align: center;
    color: #00ff88;
    font-size: 1.5em;
    font-weight: bold;
    letter-spacing: 0.2em;
    padding: 0.5em;
    background: rgba(0, 255, 136, 0.1);
    border: 2px solid #00ff88;
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
    animation: codeReveal 0.6s ease-out;
}

@keyframes signalPulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

@keyframes codeReveal {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Code Hint (No Drop) */
.code-hint .signal-header {
    text-align: center;
    color: rgba(0, 255, 136, 0.4);
    font-weight: bold;
    font-size: 0.9em;
    margin-bottom: 0.3em;
}

.code-hint .signal-status {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8em;
    font-style: italic;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .code-detected .signal-code {
        font-size: 1.2em;
        letter-spacing: 0.1em;
    }
}
```

---

## PART 5: SECRET CODES MANAGER INTEGRATION

### FILE: `system/secret-codes-manager.js`

Update codes tab to only show discoverable codes (not dev commands).

```javascript
// ========================================
// CODES TAB - DISCOVERABLE CODES ONLY
// ========================================

getAllDiscoverableCodes() {
    // Get all lore and utility codes
    const loreCodes = DISCOVERABLE_CODES.lore.map(code => ({
        id: code,
        category: 'lore'
    }));
    
    const utilityCodes = DISCOVERABLE_CODES.utility.map(code => ({
        id: code,
        category: 'utility'
    }));
    
    return [...loreCodes, ...utilityCodes];
}

renderCodesTab() {
    const allCodes = this.getAllDiscoverableCodes();
    const totalCodes = getTotalDiscoverableCodes();
    
    let html = `
        <div class="code-progress">
            CODES DISCOVERED: ${this.discoveredCodes.size} / ${totalCodes}
        </div>
    `;
    
    allCodes.forEach(codeData => {
        const discovered = this.discoveredCodes.has(codeData.id);
        const locked = !discovered;
        const codeInfo = this.getCodeInfo(codeData.id);
        
        html += `
            <div class="code-entry ${locked ? 'locked' : ''}" data-category="${codeData.category}">
                <div class="code-name">${discovered ? codeInfo.name : '???'}</div>
                <div class="code-status">
                    ${discovered ? codeInfo.description : 'Undiscovered'}
                </div>
            </div>
        `;
    });
    
    return html;
}

getCodeInfo(codeId) {
    // Return code name and description
    // This should match existing secret codes structure
    const codeDefinitions = {
        'torigatchi': { name: 'TORIGATCHI', description: 'The Reverse Door' },
        'ronniegatchi': { name: 'RONNIEGATCHI', description: 'The Inspiration' },
        'always3': { name: 'ALWAYS3', description: 'Storm Dragon Signature' },
        'uv7crew': { name: 'UV7CREW', description: 'Director\'s Cut' },
        'chicharon': { name: 'CHICHARON', description: 'Dev Commentary' },
        'bootstrap': { name: 'BOOTSTRAP', description: 'Loop Timeline' },
        'echo': { name: 'ECHO', description: 'Voices of 847' },
        '848': { name: '848', description: 'True Attempt Number' },
        'dizee': { name: 'DIZEE', description: 'The Architect\'s Signature' },
        'echobreak': { name: 'ECHOBREAK', description: 'Silence the Voices' },
        'tetherlock': { name: 'TETHERLOCK', description: 'Freeze Connection' },
        'saveanywhere': { name: 'SAVEANYWHERE', description: 'Break the Rules' }
    };
    
    return codeDefinitions[codeId] || { name: codeId.toUpperCase(), description: 'Unknown' };
}

// ========================================
// DISCOVERY TRACKING (ONLY DISCOVERABLE CODES)
// ========================================

discoverCode(code) {
    // Only track discoverable codes
    if (!isCodeDiscoverable(code)) {
        console.log(`Code ${code} is a dev command, not tracking discovery`);
        return;
    }
    
    if (this.discoveredCodes.has(code)) {
        return; // Already discovered
    }
    
    this.discoveredCodes.add(code.toLowerCase());
    this.saveDiscoveredCodes();
    console.log(`🔓 Code discovered: ${code}`);
    
    // Update UI if codes tab is open
    this.updateCodesUI();
}
```

---

## PART 6: LOCKED NOTE HINTS (UX ENHANCEMENT)

### FILE: `system/collectibles-manager.js`

Show hints for notes locked behind difficulty.

```javascript
// ========================================
// LOCKED NOTE HINTS
// ========================================

renderNotesWithDifficultyHints() {
    const availableNotes = this.getAvailableNotes();
    const currentDifficulty = this.game.settings?.difficulty || 'normal';
    
    let html = '';
    
    // Render available notes
    availableNotes.forEach(noteId => {
        if (this.collectedNotes.has(noteId)) {
            const noteMeta = getNoteMetadata(noteId);
            html += this.renderNoteEntry(noteId, noteMeta);
        }
    });
    
    // Show hints for locked notes (next difficulty tier)
    const lockedHints = this.getLockedNoteHints(currentDifficulty);
    if (lockedHints.length > 0) {
        html += `<div class="locked-notes-divider">━━━━━━━━━━━━━━━━━━━━━━</div>`;
        html += `<div class="locked-notes-header">RESTRICTED ACCESS</div>`;
        
        lockedHints.forEach(hint => {
            html += `
                <div class="note-entry locked">
                    <div class="note-title">🔒 ${hint.title}</div>
                    <div class="note-hint">${hint.hint}</div>
                </div>
            `;
        });
    }
    
    return html;
}

getLockedNoteHints(currentDifficulty) {
    const difficultyOrder = ['easy', 'normal', 'intense', 'insane'];
    const currentIndex = difficultyOrder.indexOf(currentDifficulty.toLowerCase());
    
    if (currentIndex === -1 || currentIndex >= difficultyOrder.length - 1) {
        return []; // At max difficulty or invalid
    }
    
    const nextDifficulty = difficultyOrder[currentIndex + 1];
    const hints = [];
    
    // Show 1-2 hints for notes in next tier
    for (const [noteId, noteMeta] of Object.entries(GAME_NOTES)) {
        if (noteMeta.difficulty === nextDifficulty && hints.length < 2) {
            hints.push({
                title: noteMeta.title,
                hint: `Available in ${nextDifficulty.toUpperCase()} mode`
            });
        }
    }
    
    return hints;
}
```

### CSS for Locked Hints

```css
/* LOCKED NOTE HINTS */
.locked-notes-divider {
    color: rgba(255, 0, 102, 0.5);
    text-align: center;
    margin: 2em 0 1em 0;
    font-family: 'Courier New', monospace;
}

.locked-notes-header {
    text-align: center;
    color: rgba(255, 0, 102, 0.7);
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    margin-bottom: 1em;
    font-weight: bold;
}

.note-entry.locked {
    opacity: 0.6;
    border: 2px dashed rgba(255, 0, 102, 0.3);
    background: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
}

.note-entry.locked .note-title {
    color: rgba(255, 0, 102, 0.7);
}

.note-hint {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    margin-top: 0.5em;
}
```

---

## PART 7: TESTING CHECKLIST

### Save/Load System

- [ ] Note discovery data saves correctly
- [ ] Note discovery data loads correctly
- [ ] seenNotes counts persist
- [ ] noteCodeDrops locked per save
- [ ] Different saves have different RNG results

### Difficulty Gating

- [ ] Easy mode shows 4 base notes
- [ ] Normal mode shows 10 notes (4 + 6)
- [ ] Intense mode shows 14 notes (10 + 4)
- [ ] INSANE mode shows 17 notes (14 + 3)
- [ ] Locked note hints appear
- [ ] Hints show correct next difficulty

### Code Drops

- [ ] Guaranteed codes always drop
- [ ] RNG codes drop at correct rate
- [ ] Pity system triggers after 3 views
- [ ] Code drop locked per save (consistent)
- [ ] Different playthroughs have different drops
- [ ] Code footer displays correctly
- [ ] Code hint displays when no drop

### Secret Codes Integration

- [ ] Codes tab shows 12 discoverable codes
- [ ] Dev commands NOT shown in codes tab
- [ ] Discovered codes marked correctly
- [ ] Locked codes show "???"
- [ ] Progress counter accurate (X / 12)

### Visual Feedback

- [ ] "ENCRYPTED SIGNAL DETECTED" animates
- [ ] Code reveals with animation
- [ ] Unstable signal hint displays
- [ ] Haptic feedback on code drop (mobile)
- [ ] All animations smooth

### Edge Cases

- [ ] Note unlocked but not available at difficulty → doesn't show
- [ ] Loading save from higher difficulty → notes still locked at lower
- [ ] Changing difficulty mid-game → notes filter correctly
- [ ] Pity counter doesn't reset on reload
- [ ] Multiple code pools work correctly

---

## IMPLEMENTATION ORDER

### Phase 1: Core Structure (2 hours)

1. Add GAME_NOTES metadata to game-config.js
2. Add helper functions (getAvailableNotes, etc.)
3. Extend save data structure
4. Update SaveManager save/load

### Phase 2: Note Discovery Logic (2 hours)

5. Update CollectiblesManager with seenNotes tracking
2. Implement processNoteDrop() with RNG + pity
3. Add difficulty filtering to getAvailableNotes()
4. Wire up code discovery to SecretCodesManager

### Phase 3: UI & Visual Feedback (2 hours)

9. Add code drop footer rendering
2. Add code hint rendering
3. Add CSS for footers and hints
4. Add locked note hints system

### Phase 4: Integration & Testing (2 hours)

13. Update codes tab to show only discoverable codes
2. Test save/load with note discovery
3. Test difficulty transitions
4. Test RNG consistency
5. Test pity system
6. Balance drop rates

---

## BALANCING RECOMMENDATIONS

### Drop Rates (Starting Points)

- **Easy Notes:** 30% (players just learning)
- **Normal Notes:** 40% (standard experience)
- **Intense Notes:** 50% (reward for challenge)
- **INSANE Notes:** 60-100% (exclusive content)

### Pity System

- **Threshold:** 3 views (guaranteed on 3rd)
- **Rationale:** Feels like luck, but prevents endless grinding

### Note Distribution

- **Easy:** 4 notes (tutorial + basics)
- **Normal:** 6 notes (main story)
- **Intense:** 4 notes (deep lore)
- **INSANE:** 3 notes (meta content)
- **Total:** 17 notes

### Code Distribution

- **Guaranteed (3):** Utility codes from specific notes
- **RNG (9):** Lore codes from various pools
- **Dev (20+):** Never in notes, manual entry only

---

## FUTURE ENHANCEMENTS (POST-LAUNCH)

### Advanced Features

- [ ] Code drop rate scaling per playthrough (higher rates after first completion)
- [ ] "New Game+" difficulty that shows all notes
- [ ] Statistics tracking (codes per difficulty, drop rates, etc.)
- [ ] Achievement for finding all codes
- [ ] Special note for players who find all codes in INSANE mode

### Quality of Life

- [ ] Filter codes tab by category (Lore / Utility)
- [ ] Show which note dropped each code
- [ ] "Replay note for code chance" button in codes tab
- [ ] Visual indicator on notes that can drop codes

---

## NOTES FOR DIZEE

**Implementation Philosophy:**

- RNG locked per save = consistent but varied
- Pity system = prevents frustration
- Difficulty gates = natural progression
- Visual feedback = makes RNG feel intentional

**Critical Points:**

- NEVER let dev commands appear in notes
- ONLY track discoverable codes (12 total)
- Save noteCodeDrops per save slot
- Test thoroughly with multiple playthroughs

**Performance Considerations:**

- Note metadata lookup is O(1)
- Code drops processed once per note per save
- No performance impact on save/load
- Minimal memory footprint

**Mobile Optimization:**

- Touch-friendly note entries
- Responsive code footers
- Haptic feedback on code drops
- Scrollable locked hints

---

**READY FOR IMPLEMENTATION!** 🖤

*This system transforms a single-playthrough experience into a multi-playthrough treasure hunt* ✨

**Estimated Total Time:** 6-8 hours
**Impact:** MASSIVE replayability boost
**Complexity:** Medium (careful save management required)

---

*Aaron's Vision + Tori's Refinements + ZeeRah's Implementation*  
*United Voices 7 - Design Complete* 💚🔥💀💝✨

**FOR SCIENCE! FOR REPLAYABILITY! FOR CODE HUNTING!** 🎯🚀👑
