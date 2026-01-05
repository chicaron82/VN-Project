# SYSTEM ARCHITECTURE: PROJECT 848

## Overview

**Version 848** is a web-based visual novel engine built with a modular architecture, custom UI systems, and advanced state management. The codebase spans **~76,000 lines** across 119+ files, featuring production-grade polish, accessibility features, and meta-narrative systems.

---

## 1. Core Mechanics

### The Game Loop (GameEngine)

The `GameEngine` class (`system/game-engine.js`) is the central orchestrator. It manages:

- **State**: `gameState` object (flags, inventory, choices, tether level, etc.)
- **Scene flow**: `displayScene()` handles transitions, asset loading, and typewriter effects
- **Input**: Centralized handling via `InputBinder` and keyboard listeners
- **Sub-systems**: Instantiates and coordinates all managers (state, save, tether, collectibles, etc.)
- **Delegation**: Delegates specialized concerns to focused controllers (haptics, fullscreen, screenshot mode, etc.)

### Scene Progression Controller

Extracted from GameEngine, the `SceneProgressionController` orchestrates:

- **Story flow**: Prologue → route selection → route gameplay
- **Route transitions**: Cleanup → setup → start
- **Version tracking**: 848 loop counter logic
- **Route-specific UI**: Configuration and state management

### The Bootstrap Paradox

A meta-mechanic tracking "failed loops."

- **Persistence**: Uses `localStorage` to persist data across "full resets" (refreshing the page)
- **Version 848**: The narrative justification for the current stable build (847 previous failures)
- **Loop Controller**: Manages version increments and failure tracking

---

## 2. UI Architecture

### Hybrid Carousel System

To solve the "Desktop vs Mobile" UX challenge, we use a Strategy Pattern managed by `MenuCarousel.js`:

1. **SimpleCarousel** (Mobile/Portrait):
   - Touch-optimized, 1:1 swipe tracking
   - Performance focused for lower-end devices
   - Clean card-based interface

2. **MomentumAdapter** (Desktop/Landscape):
   - Wraps the `CarouselMomentum` physics engine
   - **Infinite Scrolling**: Uses a 3x buffer (cloned nodes) to create seamless loop
   - **Physics**: Friction-based deceleration and snapping
   - **Smooth animations**: 60fps momentum scrolling

### Notification System

Multi-layered notification architecture:

1. **StatusNotificationController** (`system/status-notification-controller.js`):
   - Status bar notifications (center screen)
   - Auto-save, skip mode, echo comments
   - Priority queue system
   - Haptic feedback integration

2. **NotificationShadeController** (`system/notification-shade-controller.js`):
   - iOS-style pull-down shade
   - Quick actions carousel
   - UV7 branding footer
   - Mobile-first design with depth layers

3. **ExpandableQuickActions** (`system/expandable-quick-actions.js`):
   - Momentum-based swipeable carousel
   - Expandable action cards
   - Navigation dots
   - Touch-optimized interactions

### Input Binder

All static UI interactions are decoupled from HTML.

- **Old Pattern**: `<button onclick="game.start()">` (Removed)
- **New Pattern**: `InputBinder` attaches listeners by ID at runtime
- **Keyboard Controller**: Centralized keyboard event handling

---

## 3. State Management

### StateManager

The `StateManager` class (`system/state-manager.ts`) provides:

- **Single source of truth** for all game state
- **Deep-clone safety** to prevent accidental mutations
- **Reactive subscriptions** for automatic UI updates
- **Persistence** via localStorage
- **TypeScript types** for compile-time safety

### Usage Pattern

```javascript
// Get value (deep cloned for safety)
const level = stateManager.get('tether.level');

// Set value (notifies subscribers)
stateManager.set('tether.level', 85);

// Subscribe to changes
const unsub = stateManager.subscribe('tether.level', (newVal, oldVal) => {
    updateTetherUI(newVal);
});
```

### State Shape

```typescript
interface GameState {
    game: { loopVersion, currentRoute, currentScene, paused };
    unlocks: { skipUnlocked, skipPrologueUnlocked, ronnieNotesUnlocked, insaneModeUnlocked };
    tether: { level, difficulty, decayRate, cap, frozen };
    settings: { textSpeed, autoAdvance, tetherDifficulty, hapticEnabled, comfortMode };
    collectibles: { unlockedNotes, readScenes };
    ui: { hidden, menuOpen };
}
```

---

## 4. Data Flow

### Save Management

`SaveManager` (`system/save-manager.js`) handles:

- **Slots**: Auto-save + 3 Manual Slots
- **Format**: JSON serialization of `gameState` + metadata (timestamp, route, preview text)
- **Safety**: Wrappers prevent crashes if storage is full/disabled
- **Echo Memory Integration**: Tracks save/load for save scumming detection

### Asset Pipelines

- **Preloading**: Critical assets (fonts, UI) load before splash
- **Lazy Loading**: Scene images load on demand with a `Promise`-based queue
- **Asset Loader**: UV7 splash screen with real asset loading

---

## 5. Key Systems

| System | File | Purpose | Lines |
|--------|------|---------|-------|
| GameEngine | `game-engine.js` | Core loop, scene management | ~3,930 |
| StateManager | `state-manager.ts` | Centralized state with subscriptions | ~400 |
| TetherSystem | `tether-system.js` | Visual/Haptic feedback, decay mechanics | ~750 |
| SaveManager | `save-manager.js` | Persistence, slots, metadata | ~350 |
| CollectiblesManager | `collectibles-manager.js` | Notes, achievements, unlockables | ~1,940 |
| AchievementManager | `achievement-manager.js` | Achievement tracking and notifications | ~350 |
| EchoMemorySystem | `echo-memory-system.js` | Meta-awareness, loop tracking, echo comments | ~533 |
| SceneProgressionController | `scene-progression-controller.js` | Route orchestration, transitions | ~400 |
| NotificationShadeController | `notification-shade-controller.js` | Mobile-first UI overlay | ~1,500 |
| StatusNotificationController | `status-notification-controller.js` | Status bar notifications | ~250 |
| **HapticController** | `haptic-controller.js` | Haptic/sensory feedback system | ~260 |
| **DirectorsCutController** | `directors-cut-controller.js` | Crew statements overlay | ~210 |
| **CrewController** | `crew-controller.js` | Credits screen navigation | ~128 |
| **FullscreenController** | `fullscreen-controller.js` | Cross-browser fullscreen toggle | ~118 |
| **ScreenshotController** | `screenshot-controller.js` | Screenshot mode UI toggle | ~178 |
| CutsceneEngine | `cutscene-engine.js` | Frame-by-frame animations | ~300 |
| DevConsole | `dev-console.js` | Runtime debugging (`~` key) | ~200 |
| AccessibilityManager | `accessibility-manager.js` | WCAG compliance, screen readers | ~300 |
| MobileUX | `mobile-ux.js` | Touch gestures, haptics, swipes | ~250 |

---

## 6. Advanced Features

### Echo Memory System (Belle's Meta-Awareness)

A persistent tracking system where the three echoes (Hope, Gentle, Despair) become aware of the player across loops:

**Architecture**:

- **Persistent Storage**: localStorage-based global tracking (survives browser close)
- **Awareness Levels**: 0 (dormant) → 4 (glitch/fourth wall)
- **Context-Specific Triggers**: Death locations, save scumming, note hunting, choice patterns
- **Echo Personalities**:
  - Hope (💫): Tracks persistence and comebacks
  - Gentle (🌙): Notices hesitation and note collecting
  - Despair (🖤): Mocks failures and hijacks choices

**Integration Hooks**:

- `recordLoop()` in scene-progression-controller
- `recordDeath()` in tether-system
- `recordSave()/recordLoad()` in save-manager (save scum detection)
- `recordChoice()` in scene-renderer
- `recordNotesViewerOpen()` in standalone-notes-viewer
- Despair hijack trigger in tori-route-act2 (ice cream scene)

**Memory Tracking**:

```javascript
{
    totalLoops: 0,
    routeCompletions: { ronnie: 0, tori: 0 },
    deathLocations: {}, // sceneId → count
    choiceHistory: {}, // choiceId → [selected options]
    saveScumCount: 0,
    notesViewerOpens: 0,
    echoAwareness: { hope: 0-4, gentle: 0-4, despair: 0-4 }
}
```

### Tether System

Advanced connection mechanic for Tori's route:

- **Decay Mechanics**: Configurable per difficulty (0.03% - 0.1%/sec)
- **Hold On Button**: Manual tether restoration
- **Visual Feedback**: Color-coded warnings (green → yellow → red → critical)
- **Haptic Feedback**: Mobile vibration patterns for warnings
- **Death Handler**: Custom route handlers for tether=0%
- **INSANE Mode**: Ghost button (visual only), 66% cap, restricted saves

### Time Machine Backlog

Full state restoration system:

- **Click Past Dialogue**: Jump back to any point in history
- **Complete State**: Restores tether, flags, scene context, choices
- **Read-Only Mode**: In INSANE difficulty
- **Performance**: Efficient history compression

### Achievement System

Persistent tracking with 12 achievements:

- **Storage**: localStorage with merge strategy
- **Notifications**: Haptic + visual feedback
- **Stats Tracking**: Route times, notes collected, loops completed
- **Viewer UI**: Achievement gallery with progress

### Developer Commentary

Meta-narrative system:

- **Unlock**: Secret code `chicharon`
- **Triggers**: 8+ commentary points throughout story
- **UI**: Toggle button in game view
- **Content**: Behind-the-scenes insights from Aaron

---

## 7. TypeScript Migration

### Status

- **StateManager**: Fully typed (`system/state-manager.ts`)
- **Types**: Defined in `system/types.ts`
- **Gradual Migration**: JS files can import TS types

### Commands

```bash
npm run type-check    # Validate TypeScript
npm run build         # Compile TS → JS
npm run build:watch   # Watch mode
```

---

## 8. Testing

### Framework

- **Vitest** with jsdom environment
- **Configuration**: `vitest.config.js`
- **Setup**: `tests/setup.js` (localStorage mock, DOM fixtures)

### Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test UI
npm run test:coverage # Coverage report
```

### Test Coverage

- StateManager: 23 tests ✓
- CollectiblesManager: 11 tests ✓
- GameEngine: 24 tests ✓
- UIController: 31 tests ✓
- **Total**: 89+ tests across core systems

---

## 9. Project Structure

```
VN-Project/ (~76,000 lines)
├── system/           # Core engine (67 files, ~33K lines)
│   ├── game-engine.js         # Main loop (~3,930 lines)
│   ├── state-manager.ts       # Centralized state
│   ├── save-manager.js        # Persistence
│   ├── tether-system.js       # Connection mechanics
│   ├── echo-memory-system.js  # Meta-awareness
│   ├── scene-progression-controller.js
│   ├── notification-shade-controller.js
│   ├── status-notification-controller.js
│   ├── expandable-quick-actions.js
│   ├── haptic-controller.js   # Haptic feedback (NEW)
│   ├── directors-cut-controller.js  # Crew statements (NEW)
│   ├── crew-controller.js     # Credits navigation (NEW)
│   ├── fullscreen-controller.js     # Fullscreen toggle (NEW)
│   ├── screenshot-controller.js     # Screenshot mode (NEW)
│   ├── achievement-manager.js
│   ├── collectibles-manager.js
│   ├── accessibility-manager.js
│   ├── mobile-ux.js
│   └── ... (50+ more)
│
├── routes/           # Story definitions (10 files, ~7.4K lines)
│   ├── shared-prologue.js
│   ├── tori-route-*.js        # Act 1-3 + endings
│   ├── ronnie-route-*.js      # Act 1-3
│   └── epilogue.js
│
├── ui/               # UI components (7 files, ~3.5K lines)
│   ├── menu-carousel.js       # Hybrid manager
│   ├── simple-carousel.js     # Portrait mode
│   ├── momentum-adapter.js    # Landscape mode
│   ├── carousel-momentum.js   # Physics engine
│   ├── save-load-ui.js
│   ├── standalone-notes-viewer.js
│   └── achievement-viewer.js
│
├── css/              # Styles (40 files, ~19.6K lines)
│   ├── accessibility.css
│   ├── mobile-polish.css
│   ├── notification-shade.css
│   ├── status-notifications.css
│   └── ... (36+ more)
│
├── tests/            # Unit tests (89+ tests)
├── docs/             # Documentation
│   ├── ARCHITECTURE.md (this file)
│   ├── ECHO_MEMORY_TESTING.md
│   ├── SECRET_CODES_GUIDE.md
│   └── ... (20+ more)
│
└── .agent/workflows/ # AI workflow docs
```

---

## 10. Performance Optimizations

### Carousel System

- **Virtual Scrolling**: Only renders visible cards + buffer
- **Momentum Physics**: 60fps smooth scrolling
- **Touch Optimization**: Passive event listeners
- **Memory Management**: Cloned node cleanup

### Asset Loading

- **Lazy Loading**: Images load on demand
- **Promise Queue**: Sequential loading prevents memory spikes
- **Cache Headers**: Browser caching for repeated assets

### State Management

- **Deep Clone on Get**: Prevents accidental mutations
- **Subscription Pruning**: Auto-cleanup on component unmount
- **Shallow Comparison**: Only notify on actual changes

### Mobile Optimizations

- **Reduced Motion**: Respects user preferences
- **Haptic Throttling**: Prevents vibration spam
- **Touch Target Sizing**: 44px minimum (WCAG AAA)

---

## 11. Accessibility Features

### WCAG Compliance

- **AA Contrast**: All text meets minimum ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels, semantic HTML
- **Focus Management**: Visible focus indicators
- **Skip Links**: Jump to main content

### Comfort Mode

- **Reduce Motion**: Disables animations
- **Haptic Toggle**: Optional vibration feedback
- **Auto-Advance**: Hands-free reading option
- **Text Speed**: Adjustable typewriter speed

### Mobile Accessibility

- **Touch Targets**: 44px+ (WCAG AAA)
- **Swipe Gestures**: Alternative input method
- **Viewport Scaling**: Respects user zoom
- **Orientation Lock**: Portrait/landscape support

---

## 12. Meta-Narrative Architecture

### Fourth Wall Breaking

- **Developer Commentary**: Aaron as Old Man Ronnie
- **AI Crew References**: UV7 team as in-universe characters
- **Echo System**: Characters aware of player behavior
- **Bootstrap Paradox**: Self-referential narrative loops

### Secret Codes System

- **Discovery Tracking**: Persistent unlock state
- **Lore Integration**: Codes reveal narrative layers
- **Dev Commands**: Runtime debugging without console
- **Easter Eggs**: Konami Code, hidden achievements

---

## 13. Development Philosophy

### Code Quality

- **SOLID Principles**: Single responsibility, dependency injection
- **Modular Architecture**: Clean separation of concerns via controller extraction
- **Comprehensive Testing**: 89+ unit tests
- **Type Safety**: Gradual TypeScript migration with JSDoc annotations
- **No Placeholders**: Every feature is production-ready
- **Continuous Refactoring**: GameEngine reduced from ~4,425 to ~3,930 lines via extraction

### Polish Over Features

- **Haptic Feedback**: Mobile vibration for key moments
- **Smooth Animations**: 60fps momentum physics
- **Visual Feedback**: Loading states, transitions, confirmations
- **Accessibility First**: WCAG compliance, keyboard navigation
- **Mobile-First**: Touch-optimized, responsive design

### Michelin Treatment

The project started as a "food truck" but received "full Michelin star" treatment:

- UV7 splash screen with real asset loading
- iOS-style notification shade with depth layers
- Momentum-based swipe carousels
- Meta-aware echo system
- Production-grade architecture

---

## 14. Stats Summary

**Total Codebase**: ~76,000 lines

- **JavaScript**: 54,078 lines (62 system files + 10 routes + 7 UI)
- **CSS**: 19,564 lines (40 files)
- **HTML**: 2,351 lines
- **Tests**: 89+ tests across core systems
- **Documentation**: 20+ markdown files

**Key Metrics**:

- 119+ total files
- 12 achievements
- 12+ secret codes
- 8+ developer commentary triggers
- 5 difficulty modes
- 4 save slots (3 manual + auto)
- 2 complete story routes

---

**Version 848: The timeline that worked.**
