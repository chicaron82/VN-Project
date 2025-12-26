# SYSTEM ARCHITECTURE: PROJECT 848

## Overview
**Version 848** is a web-based visual novel engine built with a custom "Hybrid Carousel" UI and a robust state management system. The architecture prioritizes separation of concerns, modularity, and "premium" user experience.

---

## 1. Core Mechanics

### The Game Loop (GameEngine)
The `GameEngine` class (`system/game-engine.js`) is the central orchestrator. It manages:
- **State**: `gameState` object (flags, inventory, choices).
- **Scene flow**: `updateScene()` handles transitions and asset loading.
- **Input**: Centralized handling via `InputBinder` and keyboard listeners.

### The Bootstrap Paradox
A meta-mechanic tracking "failed loops."
- **Persistence**: Uses `localStorage` to persist data across "full resets" (refreshing the page).
- **Version 848**: The narrative justification for the current stable build.

---

## 2. UI Architecture

### Hybrid Carousel System
To solve the "Desktop vs Mobile" UX challenge, we use a Strategy Pattern managed by `MenuCarousel.js`:

1.  **SimpleCarousel** (Mobile/Portrait):
    -   Touch-optimized, 1:1 swipe tracking.
    -   Performance focused for lower-end devices.

2.  **MomentumAdapter** (Desktop/Landscape):
    -   Wraps the `CarouselMomentum` physics engine.
    -   **Infinite Scrolling**: Uses a 3x buffer (cloned nodes) to create a seamless loop.
    -   **Physics**: Friction-based deceleration and snapping.

### Input Binder
All static UI interactions are decoupled from HTML.
-   **Old Pattern**: `<button onclick="game.start()">` (Removed)
-   **New Pattern**: `InputBinder` attaches listeners by ID at runtime.

---

## 3. State Management (StateManager)

### Centralized State
The `StateManager` class (`system/state-manager.ts`) provides:
- **Single source of truth** for all game state
- **Deep-clone safety** to prevent accidental mutations
- **Reactive subscriptions** for automatic UI updates
- **Persistence** via localStorage

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
-   **Slots**: Auto-save + 3 Manual Slots.
-   **Format**: JSON serialization of `gameState` + metadata (timestamp, route, preview text).
-   **Safety**: Wrappers (`safeLocalStorageSet`) prevent crashes if storage is full/disabled.

### Asset Pipelines
-   **Preloading**: Critical assets (fonts, UI) load before splash.
-   **Lazy Loading**: Scene images load on demand with a `Promise`-based queue.

---

## 5. Key Systems

| System | File | Purpose |
|--------|------|---------|
| TetherSystem | `tether-system.js` | Visual/Haptic feedback for Tori route |
| CollectiblesManager | `collectibles-manager.js` | Notes, achievements, unlockables |
| NotificationShadeController | `notification-shade-controller.js` | Mobile-first UI overlay |
| CutsceneEngine | `cutscene-engine.js` | Frame-by-frame animations |
| Dev Console | `dev-console.js` | Runtime debugging (`~` key) |

---

## 6. TypeScript Migration

### Status
- **StateManager**: Fully typed (`system/state-manager.ts`)
- **Types**: Defined in `system/types.ts`

### Commands
```bash
npm run type-check    # Validate TypeScript
npm run build         # Compile TS → JS
npm run build:watch   # Watch mode
```

---

## 7. Testing

### Framework
- **Vitest** with jsdom environment
- **Configuration**: `vitest.config.js`
- **Setup**: `tests/setup.js` (localStorage mock)

### Commands
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test UI
```

### Test Coverage
- StateManager: 23 tests ✓
- CollectiblesManager: 11 tests ✓
- GameEngine: 24 tests ✓
- UIController: 31 tests ✓

---

## 8. Project Structure

```
VN-Project/
├── system/           # Core engine (55 files)
│   ├── game-engine.js
│   ├── state-manager.ts
│   ├── types.ts
│   └── ...
├── routes/           # Story definitions
├── tests/            # Unit tests
├── docs/             # Documentation
├── ui/               # UI components
└── .agent/workflows/ # AI workflow docs
```
