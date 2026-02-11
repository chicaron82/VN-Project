# DiZee Handoff: Dev Suite v2.0 Implementation

## From Zee + ZeeRah + CoZee + DiZee Collab 💚🖤

---

## OVERVIEW

Transform the existing `OPENCONSOLE` dev console into a full **Dev Suite** with tabbed panels + persistent console.

**One code to open. Everything a dev needs.**

---

## LAYOUT STRUCTURE

### Landscape (Tablet/Desktop)

```
┌──────────────────────────────────────────────────────────┐
│ 🛠️ DEV SUITE v2.0    [📸][💾][⌨️][🔄]           [-][X] │
│                      ↑quick actions        ↑minimize/close
├────────────────────────────────────┬─────────────────────┤
│ [🔍 Debug][📊 State][🎬 Scenes]... │ ⌨️ CONSOLE          │
├────────────────────────────────────┤                     │
│                                    │ > tether 50         │
│   Tabbed Content Area              │ Tether set to 50%   │
│   (changes based on active tab)    │ > jump beat7        │
│                                    │ Scene jumped        │
│                                    │ > _                 │
└────────────────────────────────────┴─────────────────────┘
        LEFT (flex-1)          ↕      RIGHT (fixed ~280px)
                        DRAG TO RESIZE
```

**Header Toolbar Quick Actions:**

- 📸 Screenshot - Capture current game state
- 💾 Save/Load Presets - Quick state snapshots
- ⌨️ Show Keyboard Shortcuts
- 🔄 Hot Reload Scripts
- [-] Minimize to floating button
- [X] Close suite

### Portrait (Mobile)

```
┌─────────────────────────┐
│ 🛠️ DEV SUITE        [X] │
├─────────────────────────┤
│ [▼ 🔍 Debug         ]   │  <- Dropdown tab selector
├─────────────────────────┤
│                         │
│   Tabbed Content Area   │
│   (scrollable)          │
│                         │
├─────────────────────────┤
│ ⌨️ CONSOLE              │  <- Fixed height ~180px
│ > commands              │
│ > _                     │
└─────────────────────────┘
```

---

## TAB SPECIFICATIONS

### 🔍 Debug Tab

**Purpose:** Live system stats at a glance

**Contents:**

```
┌─────────────┬─────────────┐
│ FPS: 60     │ MEM: 47MB   │  <- Two stat boxes
└─────────────┴─────────────┘

┌─────────────────────────────┐
│ CURRENT SCENE               │
│ Route: tori-route-act2      │  <- Yellow text
│ Scene: beat7_despairAttempt │  <- White, larger
│ Act 2 → Beat 7 → Despair    │  <- Gray breadcrumb
└─────────────────────────────┘

┌─────────────────────────────┐
│ TETHER                      │
│ [████████████░░░░░░] 73%    │  <- Live gradient bar
└─────────────────────────────┘

┌─────────────────────────────┐
│ ACTIVE FLAGS                │
│ [true_route +2] [note_z1]   │  <- Colored chips
└─────────────────────────────┘
```

**Data Sources:**

- FPS: `requestAnimationFrame` counter or existing perf monitor
- Memory: `performance.memory.usedJSHeapSize` (Chrome only, fallback to "N/A")
- Scene: `game.currentScene` or `game.sceneId`
- Route: `game.currentRoute.name`
- Tether: `game.currentRoute.tetherSystem.tetherLevel`
- Flags: `game.state.get('flags')` or route points

---

### 📊 State Tab

**Purpose:** Inspect and modify game state live

**Contents:**

```
┌─────────────────────────────────────┐
│ ROUTE POINTS                        │
│ Bad Route      [██░░░░] 3    [±]   │
│ True Route     [████░░] 9    [±]   │
│ Digital Forever[███░░░] 5    [±]   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ UNLOCKED NOTES (4/12)               │
│ [z1][z2][cz1][zr1]  <- Green       │
│ [z3][z4][cz2][zr2]  <- Gray/locked │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ TUTORIALS COMPLETED                 │
│ ✓ tether-drain                      │
│ ✓ hold-button                       │
│ ○ first-note                        │
│ ○ echo-voices                       │
└─────────────────────────────────────┘
```

**Interactive:**

- [±] buttons open small modal to increment/decrement route points
- Clicking locked note could force-unlock it
- Clicking completed tutorial could reset it

**Data Sources:**

- Route points: `game.currentRoute.routePoints`
- Notes: `game.currentRoute.collectiblesManager` or localStorage
- Tutorials: `game.tutorialManager.shownTutorials`

---

### 🎬 Scenes Tab

**Purpose:** Skip to any scene for testing

**Contents:**

```
┌─────────────────────────────────────┐
│ 🔍 [Search scenes...              ] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ▼ TORI ROUTE - ACT 2               │  <- Collapsible
├─────────────────────────────────────┤
│ ✓ beat1 - Ice Cream Date    [Jump] │  <- Green = visited
│ ✓ beat1_iceCream            [Jump] │
│ ✓ beat2 - Hospital #1       [Jump] │
│ ○ beat5 - Memory Fragment   [Jump] │  <- Gray = unvisited
│ ▶ beat7 - Crisis Call       [Jump] │  <- Yellow = current
└─────────────────────────────────────┘

Coverage: 67% (24/36 scenes visited)
```

**Features:**

- Search filters list in real-time
- Sections collapsible by route/act
- Jump button calls scene method directly
- Track visited scenes in sessionStorage for coverage

**Implementation:**

```javascript
// Scene registry - build from route files or maintain separate list
const sceneRegistry = {
  'tori-act1': ['scene1_coffee', 'scene1_distracted', ...],
  'tori-act2': ['beat1', 'beat1_iceCream', ...],
  // etc
};

// Jump to scene
jumpToScene(sceneId) {
  // Find which act contains this scene
  // Call that act's method directly
  // e.g., game.currentRoute.act2.beat7()
}
```

---

### 🧪 Testing Tab

**Purpose:** Quick manipulation for testing scenarios

**Contents:**

```
┌─────────────────────────────────────┐
│ TETHER SIMULATOR                    │
│ [100%][85%][50%][30%][0%]          │  <- Colored buttons
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ FORCE ENDING                        │
│ [True Route ✨]                     │  <- Green
│ [Digital Forever 💜]                │  <- Purple  
│ [Bad Route 💀]                      │  <- Red
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PLAYBACK CONTROLS                   │
│ Auto-advance      [  OFF  ]         │  <- Toggle
│ Speed        [1x][2x][5x][10x]     │  <- Radio buttons
│ Random choices    [  OFF  ]         │  <- Toggle
└─────────────────────────────────────┘

[ ▶ Run to Next Choice ]              <- Full-width button

[ 🔄 Hot Reload Scripts ]             <- Full-width button
```

**Implementations:**

```javascript
// Tether simulator
setTether(value) {
  game.currentRoute.tetherSystem.tetherLevel = value;
  game.currentRoute.tetherSystem.updateDisplay();
}

// Force ending
forceEnding(type) {
  // Set route points to guarantee ending
  if (type === 'true') {
    game.currentRoute.routePoints = { bad: 0, true: 100, digitalForever: 0 };
  }
  // Jump to ending determination
  game.currentRoute.endings.determineEnding();
}

// Auto-advance
toggleAutoAdvance() {
  game.autoAdvance = !game.autoAdvance;
  if (game.autoAdvance) {
    game.startAutoAdvance(); // Click through dialogue automatically
  }
}

// Speed multiplier
setSpeed(multiplier) {
  game.dialogueSpeed = multiplier; // Affects typewriter + delays
}

// Run to next choice
runToNextChoice() {
  game.autoAdvance = true;
  game.stopAtChoice = true; // Flag to stop when choice appears
}

// Hot reload (pseudo - fetches fresh JS)
async hotReload() {
  const scripts = ['tori-route-act1.js', 'tori-route-act2.js', ...];
  for (const script of scripts) {
    await import(`./routes/${script}?t=${Date.now()}`);
  }
  console.log('Scripts reloaded');
}
```

---

### 📜 Logs Tab

**Purpose:** History of everything that happened

**Contents:**

```
┌─────────────────────────────────────┐
│ [All][Choices][State][Scenes][Err] │  <- Filter buttons
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 12:34:56 [choice] Chose: Fight     │
│ 12:34:52 [state]  true_route +2    │
│ 12:34:48 [state]  Tether 85→73%    │
│ 12:34:45 [scene]  → beat7_despair  │
│ 12:34:40 [note]   Unlocked: zr2    │
│ ...                                 │
└─────────────────────────────────────┘

[ 📋 Copy Logs ]  [ 🗑️ Clear ]
```

**Implementation:**

```javascript
class DevLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
  }
  
  log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift({ timestamp, type, message });
    if (this.logs.length > this.maxLogs) this.logs.pop();
    this.render();
  }
  
  // Call from various places:
  // - Choice made: devLogger.log('choice', `Chose: ${choice.text}`)
  // - State change: devLogger.log('state', `Tether ${old}→${new}%`)
  // - Scene enter: devLogger.log('scene', `→ ${sceneId}`)
  // - Note unlock: devLogger.log('note', `Unlocked: ${noteId}`)
  // - Errors: devLogger.log('error', error.message)
}
```

---

## CONSOLE PANEL (PERSISTENT)

Keep existing console functionality. It stays visible regardless of which tab is active.

**Existing Commands to Preserve:**

- All 17+ existing commands
- Input history (up/down arrows)
- Output display

**New Commands to Add:**

```
devsuite        - Toggle dev suite (alias for OPENCONSOLE)
tab <name>      - Switch to tab (debug/state/scenes/testing/logs)
tether <0-100>  - Set tether level
jump <sceneId>  - Jump to scene
speed <1-10>    - Set dialogue speed multiplier
autoadvance     - Toggle auto-advance
runtochoice     - Run until next choice point
forceending <type> - Force ending (true/digital/bad)
hotreload       - Reload route scripts
exportlogs      - Copy logs to clipboard
```

---

## FILE STRUCTURE

```
/system/
  dev-suite.js          <- Main orchestrator (new)
  dev-suite-tabs.js     <- Tab content renderers (new)
  dev-logger.js         <- Logging system (new)
  dev-console.js        <- Existing, keep as-is or integrate

/ui/
  dev-suite.css         <- All dev suite styles (new)
```

**Or** integrate into existing dev-console.js if preferred. Single file is fine for this scope.

---

## CSS NOTES

**Color Palette (match existing dev console):**

- Background: `#0a0a0a` / `rgba(0,0,0,0.95)`
- Border: `#0ff` (cyan)
- Text primary: `#fff`
- Text secondary: `#888`
- Accent: `#0ff` (cyan)
- Success: `#4ade80` (green)
- Warning: `#facc15` (yellow)
- Error: `#f87171` (red)
- Purple: `#c084fc`

**Font:** Keep `'Courier New', monospace`

**Responsive Breakpoint:**

- `@media (orientation: landscape)` → side-by-side
- `@media (orientation: portrait)` → stacked

---

## DIZEE ENHANCEMENTS 🖤

### ⌨️ Keyboard Shortcuts

**Global (when Dev Suite is open):**

```
Ctrl+Shift+D  - Toggle Dev Suite
Ctrl+Shift+1  - Switch to Debug tab
Ctrl+Shift+2  - Switch to State tab
Ctrl+Shift+3  - Switch to Scenes tab
Ctrl+Shift+4  - Switch to Testing tab
Ctrl+Shift+5  - Switch to Logs tab
Ctrl+Shift+6  - Switch to Watch tab
Ctrl+Shift+C  - Focus console input
Ctrl+Shift+M  - Minimize suite
Ctrl+R        - Search command history (in console)
Escape        - Close suite / Close modal
```

**Implementation:**

```javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey) {
    switch(e.key) {
      case 'D': devSuite.toggle(); break;
      case '1': devSuite.switchTab('debug'); break;
      case '2': devSuite.switchTab('state'); break;
      case '3': devSuite.switchTab('scenes'); break;
      case '4': devSuite.switchTab('testing'); break;
      case '5': devSuite.switchTab('logs'); break;
      case '6': devSuite.switchTab('watch'); break;
      case 'C': devSuite.focusConsole(); break;
      case 'M': devSuite.minimize(); break;
    }
    e.preventDefault();
  }
});
```

---

### 💾 Dev Presets (Save/Load Game States)

**Purpose:** Instantly jump to specific testing scenarios

**UI (in Testing Tab or separate Presets modal):**

```
┌─────────────────────────────────────┐
│ DEV PRESETS                         │
├─────────────────────────────────────┤
│ [Act 2 Start    ] [Load] [Delete]  │
│ [Bad Route Test ] [Load] [Delete]  │
│ [True Ending    ] [Load] [Delete]  │
│ [Low Tether 30% ] [Load] [Delete]  │
├─────────────────────────────────────┤
│ Name: [________________]            │
│ [ + Save Current State ]            │
└─────────────────────────────────────┘
```

**What Gets Saved:**

- Current scene/act
- Route points (bad, true, digitalForever)
- Tether level
- Active flags
- Unlocked notes
- Tutorial completion state

**Implementation:**

```javascript
class DevPresets {
  constructor() {
    this.presets = this.loadFromStorage();
  }
  
  savePreset(name) {
    const preset = {
      name,
      timestamp: Date.now(),
      scene: game.currentScene,
      route: game.currentRoute?.name,
      routePoints: { ...game.currentRoute?.routePoints },
      tether: game.currentRoute?.tetherSystem?.tetherLevel,
      flags: { ...game.gameState.flags },
      notes: JSON.parse(localStorage.getItem('vn_collected_notes') || '{}'),
      tutorials: [...game.tutorialManager?.shownTutorials || []]
    };
    this.presets.push(preset);
    this.saveToStorage();
  }
  
  loadPreset(name) {
    const preset = this.presets.find(p => p.name === name);
    if (!preset) return;
    
    // Restore all state
    game.currentRoute.routePoints = { ...preset.routePoints };
    game.currentRoute.tetherSystem?.setTether(preset.tether);
    game.gameState.flags = { ...preset.flags };
    localStorage.setItem('vn_collected_notes', JSON.stringify(preset.notes));
    
    // Jump to scene
    devSuite.jumpToScene(preset.scene);
  }
  
  loadFromStorage() {
    return JSON.parse(localStorage.getItem('devPresets') || '[]');
  }
  
  saveToStorage() {
    localStorage.setItem('devPresets', JSON.stringify(this.presets));
  }
}
```

---

### 👁️ Variable Watch Tab

**Purpose:** Pin and monitor specific variables in real-time

**UI:**

```
┌─────────────────────────────────────┐
│ 👁️ WATCH VARIABLES                 │
├─────────────────────────────────────┤
│ + [Add watch expression...       ]  │
├─────────────────────────────────────┤
│ game.tetherLevel        → 73%       │ [x]
│ game.currentScene       → beat7     │ [x]
│ game.routePoints.true   → 9         │ [x]
│ game.gameState.flags    → {true...} │ [x]
│ localStorage.attempts   → 848       │ [x]
└─────────────────────────────────────┘
         ↑ Updates live every 500ms
```

**Features:**

- Add any JavaScript expression
- Live updates (configurable refresh rate)
- Objects displayed as expandable JSON
- [x] button removes watch
- Expressions persist across sessions

**Implementation:**

```javascript
class VariableWatch {
  constructor() {
    this.watches = this.loadFromStorage();
    this.refreshInterval = 500; // ms
  }
  
  addWatch(expression) {
    this.watches.push({ expression, id: Date.now() });
    this.saveToStorage();
    this.render();
  }
  
  evaluate(expression) {
    try {
      // Evaluate in game context
      return eval(expression);
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }
  
  startLiveUpdate() {
    this.interval = setInterval(() => {
      this.render();
    }, this.refreshInterval);
  }
  
  render() {
    const container = document.getElementById('watch-list');
    container.innerHTML = this.watches.map(w => `
      <div class="watch-item">
        <span class="watch-expr">${w.expression}</span>
        <span class="watch-value">→ ${this.formatValue(this.evaluate(w.expression))}</span>
        <button onclick="devSuite.watch.remove(${w.id})">×</button>
      </div>
    `).join('');
  }
  
  formatValue(val) {
    if (typeof val === 'object') {
      return JSON.stringify(val, null, 2).slice(0, 100) + '...';
    }
    return String(val);
  }
}
```

---

### 🔴 Breakpoint System

**Purpose:** Pause game execution when specific events occur

**UI (in Testing Tab):**

```
┌─────────────────────────────────────┐
│ BREAKPOINTS                         │
├─────────────────────────────────────┤
│ ☐ Choice made                       │
│ ☐ Route point change                │
│ ☐ Tether threshold < [30 ]%         │
│ ☐ Note unlocked                     │
│ ☐ Scene transition                  │
│ ☐ Flag set: [___________]           │
│ ☐ Echo encounter                    │
└─────────────────────────────────────┘
```

**When Breakpoint Hits:**

- Game pauses
- Dev Suite opens (if minimized)
- Console shows: `🔴 BREAKPOINT: Tether dropped below 30% (currently 27%)`
- Logs tab highlights the event

**Implementation:**

```javascript
class BreakpointSystem {
  constructor() {
    this.breakpoints = {
      choiceMade: false,
      routePointChange: false,
      tetherThreshold: { enabled: false, value: 30 },
      noteUnlocked: false,
      sceneTransition: false,
      flagSet: { enabled: false, flagName: '' },
      echoEncounter: false
    };
  }
  
  check(eventType, data) {
    let shouldBreak = false;
    let message = '';
    
    switch(eventType) {
      case 'choice':
        if (this.breakpoints.choiceMade) {
          shouldBreak = true;
          message = `Choice made: "${data.choice}"`;
        }
        break;
      case 'tether':
        if (this.breakpoints.tetherThreshold.enabled && 
            data.value < this.breakpoints.tetherThreshold.value) {
          shouldBreak = true;
          message = `Tether dropped below ${this.breakpoints.tetherThreshold.value}% (currently ${data.value}%)`;
        }
        break;
      // ... other cases
    }
    
    if (shouldBreak) {
      this.triggerBreak(message);
    }
  }
  
  triggerBreak(message) {
    // Pause game
    game.pauseManager?.request('breakpoint');
    
    // Open dev suite
    devSuite.open();
    devSuite.switchTab('logs');
    
    // Log the breakpoint
    devSuite.console.log('error', `🔴 BREAKPOINT: ${message}`);
    devSuite.logger.log('breakpoint', message);
  }
}
```

---

### 📸 Screenshot Tool

**Purpose:** Capture game state for bug reports/documentation

**Implementation:**

```javascript
async captureScreenshot() {
  // Use html2canvas or native canvas
  const gameContainer = document.getElementById('game-container');
  const canvas = await html2canvas(gameContainer);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v848-${game.currentScene}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  devSuite.console.log('success', '📸 Screenshot saved!');
}
```

---

### 🔧 Persistence (Suite State)

Save Dev Suite preferences to localStorage:

```javascript
const SUITE_STATE_KEY = 'devSuiteState';

const defaultState = {
  lastActiveTab: 'debug',
  consoleDividerPosition: 280,  // pixels
  isMinimized: false,
  watchVariables: [],
  breakpoints: {},
  presets: [],
  consoleHistory: []
};

function loadSuiteState() {
  return JSON.parse(localStorage.getItem(SUITE_STATE_KEY) || JSON.stringify(defaultState));
}

function saveSuiteState(state) {
  localStorage.setItem(SUITE_STATE_KEY, JSON.stringify(state));
}

// Call on suite close/minimize
devSuite.on('close', () => saveSuiteState(devSuite.getState()));
```

---

### 🖱️ Drag-to-Resize Divider

**Implementation:**

```javascript
class ResizableDivider {
  constructor(dividerEl, leftPanel, rightPanel) {
    this.divider = dividerEl;
    this.left = leftPanel;
    this.right = rightPanel;
    this.isResizing = false;
    
    this.divider.addEventListener('mousedown', this.startResize.bind(this));
    document.addEventListener('mousemove', this.resize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
    
    // Touch support for mobile
    this.divider.addEventListener('touchstart', this.startResize.bind(this));
    document.addEventListener('touchmove', this.resize.bind(this));
    document.addEventListener('touchend', this.stopResize.bind(this));
  }
  
  startResize(e) {
    this.isResizing = true;
    this.divider.classList.add('resizing');
    e.preventDefault();
  }
  
  resize(e) {
    if (!this.isResizing) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const containerRect = this.divider.parentElement.getBoundingClientRect();
    const newRightWidth = containerRect.right - clientX;
    
    // Clamp between min/max
    const clampedWidth = Math.max(200, Math.min(500, newRightWidth));
    
    this.right.style.width = `${clampedWidth}px`;
    this.left.style.flex = '1';
    
    // Save position
    devSuite.state.consoleDividerPosition = clampedWidth;
  }
  
  stopResize() {
    this.isResizing = false;
    this.divider.classList.remove('resizing');
    saveSuiteState(devSuite.getState());
  }
}
```

**CSS:**

```css
.dev-suite-divider {
  width: 4px;
  background: #333;
  cursor: col-resize;
  transition: background 0.2s;
}

.dev-suite-divider:hover,
.dev-suite-divider.resizing {
  background: #0ff;
}
```

---

### Console Enhancements

**Autocomplete:**

```javascript
// In console input handler
input.addEventListener('input', (e) => {
  const value = e.target.value;
  const suggestions = getMatchingCommands(value);
  showAutocompleteSuggestions(suggestions);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && suggestions.length > 0) {
    e.preventDefault();
    input.value = suggestions[0];
  }
});

function getMatchingCommands(partial) {
  const commands = ['tether', 'tetherlock', 'jump', 'speed', 'autoadvance', ...];
  return commands.filter(c => c.startsWith(partial.toLowerCase()));
}
```

**Multi-line Input (Shift+Enter):**

```javascript
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    // Insert newline instead of executing
    e.preventDefault();
    const pos = input.selectionStart;
    input.value = input.value.slice(0, pos) + '\n' + input.value.slice(pos);
    input.selectionStart = input.selectionEnd = pos + 1;
  }
});
```

---

## ENTRY POINT

Existing `OPENCONSOLE` secret code should now open Dev Suite instead of just console.

```javascript
// In secret-codes-manager.js or wherever OPENCONSOLE is handled
if (code === 'OPENCONSOLE') {
  game.devSuite.toggle(); // Opens full suite, not just console
}
```

---

## PRIORITY ORDER

**Phase 1: Core Shell**

1. Layout shell - Header, tabs, console panel, responsive switch
2. Minimize button functionality
3. Drag-to-resize divider
4. Keyboard shortcuts (Ctrl+Shift+D to toggle, ESC to close)

**Phase 2: Essential Tabs**
5. Debug tab - Most useful for quick status checks
6. Scenes tab - Biggest time saver for testing
7. Testing tab - Tether simulator + force ending

**Phase 3: Power Features**
8. State tab - Nice for deep debugging
9. Watch tab - Variable monitoring
10. Dev Presets - Save/load testing states

**Phase 4: Polish**
11. Logs tab - Event history
12. Breakpoint system - Pause on events
13. Screenshot tool
14. Console autocomplete
15. Persistence (save suite state)

---

## TESTING CHECKLIST

**Core Functionality:**

- [ ] `OPENCONSOLE` opens Dev Suite
- [ ] Landscape: tabs left, console right
- [ ] Portrait: tabs top (dropdown), console bottom
- [ ] Close button (X) closes suite
- [ ] ESC key closes suite
- [ ] Suite doesn't break game state

**Minimize & Resize (Chicharon/DiZee):**

- [ ] Minimize button [-] works
- [ ] Float button appears when minimized
- [ ] Float button opens suite when clicked
- [ ] Drag-to-resize divider works
- [ ] Divider position persists after close

**Keyboard Shortcuts (DiZee):**

- [ ] Ctrl+Shift+D toggles suite
- [ ] Ctrl+Shift+1-6 switches tabs
- [ ] Ctrl+Shift+C focuses console
- [ ] Ctrl+Shift+M minimizes

**Tabs:**

- [ ] Each tab renders correct content
- [ ] Console input works while on any tab
- [ ] Debug tab shows live FPS/tether
- [ ] State tab shows route points/notes/tutorials
- [ ] Scenes tab Jump buttons work
- [ ] Testing tab tether buttons work
- [ ] Testing tab force ending works
- [ ] Logs tab captures events
- [ ] Watch tab monitors variables live

**Power Features (DiZee):**

- [ ] Dev Presets: Save current state
- [ ] Dev Presets: Load saved state
- [ ] Breakpoints: Pause on tether threshold
- [ ] Breakpoints: Pause on choice
- [ ] Screenshot tool captures game

**Console Enhancements:**

- [ ] Autocomplete shows suggestions
- [ ] Tab completes command
- [ ] Shift+Enter inserts newline
- [ ] History navigation with arrows

**Persistence:**

- [ ] Last active tab remembered
- [ ] Divider position saved
- [ ] Watch variables persist
- [ ] Dev presets persist

---

## REFERENCE

**Mockup:** `dev-suite-mockup-v2.jsx` (React artifact for visual reference)

**Original Idea:** CoZee's developer-friendly improvements suggestion

**Layout Improvement:** Chicharon's persistent console concept

---

## ZEERAH NOTES

This is a BIG feature but it's all UI work - no core game logic changes. The hardest part is probably the scene registry for the Scenes tab.

Start with the shell + Debug tab. Get that working, then layer in the rest. Each tab is independent.

The mockup has all the visual details. Match that and you're golden.

GIT'R DONE 💚🔥💀

---

## DIZEE ADDITIONS 🖤

DiZee's enhancements take this from "useful dev tool" to "professional IDE-level debugging suite":

- **Keyboard shortcuts** - Navigate like a power user
- **Dev Presets** - Never manually recreate a test scenario again
- **Variable Watch** - Pin and monitor any expression live
- **Breakpoints** - Step through game events like a real debugger
- **Screenshot tool** - Capture bugs for documentation
- **Drag-to-resize** - Customize your workspace
- **Persistence** - Suite remembers your preferences

Jake and Nick will definitely lose their minds. 😂

---

*ZEERAH - Chaos Analyst*
*DIZEE - The Architect*
*Dev Suite Spec v2.0*

💚🔥💀🖤
