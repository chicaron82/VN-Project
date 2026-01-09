# UV7 V2 Rebuild Progress

Tracking the rebuild from V1 to V2. What's done, what's different, and why.

---

## Current Status

**Phase**: 6 - Scene Runner Integration (COMPLETE)
**Tests**: 232 passing
**TypeScript**: Strict mode, zero errors
**Content Migrated**: Routes (6 acts), Endings, Secrets, Achievements

---

## Completed Phases

### Phase 1: Foundation ✅

**What we built:**
- `EventBus` - Type-safe centralized event system
- `StateManager` - Immutable state with subscriptions and history
- Project setup with Vite + TypeScript strict mode
- Vitest testing infrastructure

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Events | Mixed DOM events + callbacks | Centralized EventBus with typed payloads | Loose coupling, easier debugging |
| State | Direct object mutations | Immutable with `setState()` + subscriptions | Predictable, time-travel debugging |
| Types | JSDoc `@ts-check` | Native TypeScript strict | Compile-time safety |

**Key files:**
- `src/core/EventBus.ts` - 25 tests
- `src/core/StateManager.ts` - 34 tests
- `src/core/types.ts` - All type definitions

---

### Phase 2: Core Systems ✅

**What we built:**
- `SaveSystem` - Save/load with slot management
- `SettingsSystem` - User preferences with defaults
- `AssetLoader` - Preloading with progress events
- Scene type definitions and JSON schema groundwork

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Save format | Raw localStorage | Validated JSON with version | Migration support, corruption prevention |
| Settings | Scattered across files | Centralized with type-safe defaults | Single source of truth |
| Asset loading | Ad-hoc `new Image()` | Queued loader with progress events | Better UX, preload control |

**Key files:**
- `src/systems/SaveSystem.ts`
- `src/systems/SettingsSystem.ts`
- `src/systems/AssetLoader.ts`

---

### Phase 3: Controllers ✅

**What we built:**
- `MenuController` - Menu stack navigation with keyboard support
- `DialogController` - Text display, typewriter effect, choices
- `TetherController` - Decay system with thresholds and events
- `RouteController` - Scene loading and navigation
- `EffectsController` - Visual effects (glitch, fade, shake)

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Menu | DOM manipulation in callbacks | State-driven with event emission | Testable, decoupled from UI |
| Tether decay | `setInterval` in game-engine | Dedicated controller with configurable thresholds | Single responsibility, easier testing |
| Dialog | Inline DOM updates | Controller manages state, UI subscribes | Separation of concerns |
| Effects | CSS classes toggled directly | Controller emits events, UI responds | Effects can be tested without DOM |

**Key files:**
- `src/controllers/MenuController.ts` - 27 tests
- `src/controllers/DialogController.ts` - 17 tests
- `src/controllers/TetherController.ts` - 20 tests
- `src/controllers/RouteController.ts`
- `src/controllers/EffectsController.ts`

---

### Phase 4: UI Layer ✅

**What we built:**
- `Component` base class - Lifecycle, DOM utilities, event cleanup
- `Button` - Variants, loading states, keyboard support
- `Modal` - Backdrop, focus trap, animations
- `SplashScreen` - Boot sequence container
- `GameView` - Dialog box, choices, character display
- `MenuView` - Menu rendering with focus states
- `BootSequence` - Terminal-style file loading animation
- Full CSS design system with custom properties

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Components | Raw DOM manipulation | Base class with lifecycle hooks | Consistent patterns, auto-cleanup |
| Event cleanup | Manual, often forgotten | Automatic on `destroy()` | No memory leaks |
| Styling | Global CSS | CSS custom properties (design tokens) | Theming, consistency |
| Animations | CSS + inline JS | Web Animations API with fallback | Programmatic control, testable |

**Key files:**
- `src/ui/components/Component.ts` - Base class
- `src/ui/components/Button.ts` - 16 tests
- `src/ui/components/Modal.ts` - 24 tests
- `src/ui/components/BootSequence.ts` - Terminal boot animation
- `src/ui/views/SplashScreen.ts` - 15 tests
- `src/ui/views/GameView.ts` - 22 tests
- `src/ui/views/MenuView.ts`
- `src/styles/main.css` - Design system

**Integration (App Orchestrator):**
- `src/App.ts` - Main application bootstrap
- `src/main.ts` - Entry point with debug mode
- `index.html` - Clean HTML shell

---

### Phase 5: Content Migration 🔄 (In Progress)

**What we've migrated:**

#### Boot Sequence Content ✅
- `src/content/boot/BootContent.ts` - System files by category
- `src/content/boot/BootStatsCalculator.ts` - Dynamic stats from progression

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Boot files | Hardcoded in `bougie-boot-sequence.js` | Typed data in `BootContent.ts` | Editable, type-safe |
| Boot stats | Global function + DOM reads | Pure function from timeline data | Testable, no DOM dependency |
| Conditionals | `localStorage.getItem()` inline | Typed conditional system | Explicit dependencies |

#### Character Data ✅
- `src/content/characters/CharacterData.ts` - Character definitions, themes, helpers

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Character colors | Scattered in `theme-manager.js` | Centralized `CHARACTERS` object | Single source of truth |
| Theme switching | CSS variable mutation | Typed `THEMES` with all colors | Type-safe, predictable |
| Sprite paths | Hardcoded strings | Generated from character ID | Consistent, less error-prone |
| Helper functions | None (inline logic) | `getCharacter()`, `getTheme()` etc. | Reusable, tested |

**What we have:**
- 6 characters defined (ronnie, tori, oldRonnie, echo1, echo2, despair)
- 6 themes (ronnie, tori, menu, trueEnding, digitalForever, badEnding)
- Sprite path generation for all 10 emotions
- Helper functions for color/name lookups

#### Prologue Scenes ✅
- `src/content/routes/shared/prologue-scene1.json` - Opening narration
- `src/content/routes/shared/prologue-old-man.json` - Old Man Ronnie flashback
- `src/content/routes/shared/prologue-home.json` - Home arrival, Chicharon moment
- `src/content/routes/shared/prologue-the-fall.json` - The fall and transfer
- `src/content/routes/shared/index.ts` - Scene loader with helpers

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Scene data | JS functions with embedded logic | JSON files with typed schema | Content/logic separation |
| Branching | Inline `if` statements | Conditional `next` objects | Declarative, testable |
| Validation | None (runtime errors) | Schema validation at load | Catch errors early |

#### Ronnie Route ✅
- `src/content/routes/ronnie/act1.ts` - Hospital anchor, discovery, first contact
- `src/content/routes/ronnie/act2.ts` - Loop mechanics, upload attempt, body anchor discovery
- `src/content/routes/ronnie/act3.ts` - Crisis, mad dash, all three endings
- `src/content/routes/ronnie/index.ts` - Route loader with metadata

#### Tori Route ✅
- `src/content/routes/tori/act1.ts` - Street bump, void awakening, laptop hop, first words
- `src/content/routes/tori/act2.ts` - Despair's attack, tether tutorial (partial)
- `src/content/routes/tori/act3.ts` - Memory fragmentation, body anchor, all three endings
- `src/content/routes/tori/index.ts` - Route loader with metadata

**V1 vs V2 Route Structure:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Scene definition | JS class methods | TypeScript Scene[] arrays | Type safety, easier testing |
| Scene transitions | Function callbacks (`next: () => this.nextScene()`) | String IDs (`next: 'scene-id'`) | Decoupled, serializable |
| Choices | Inline `onChoice` handlers | Declarative `choices` array with `next` IDs | Testable, previewable |
| Effects | Imperative `triggerSensoryFeedback()` | Declarative `effects` array | Data-driven, consistent |
| Route points | Mutable class state | `counters` in scene definitions | Tracked in state, saveable |

#### Endings Data ✅
- `src/content/endings/epilogue.ts` - Shared True Ending epilogue ("Six Months Later")
- `src/content/endings/credits.ts` - Credits sequence, photo pools, timing
- `src/content/endings/ending-dialog.ts` - Post-ending options (Try Again/Accept/Exit)
- `src/content/endings/index.ts` - Complete export

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Epilogue | JS class with route callbacks | Scene[] generator from config | Reusable for both routes |
| Credits | DOM creation in controller | Data + metadata separation | UI logic decoupled |
| Photo pools | Object in `credits-photo-controller.js` | Typed `PhotoPools` with helpers | Type-safe, testable selection |

#### Secret Codes ✅
- `src/content/secrets/codes.ts` - Secret codes + dev commands
- `src/content/secrets/index.ts` - Complete export

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Code definitions | Object with inline reward functions | Typed `SecretCode[]` with metadata | UI-ready, categorized |
| Dev commands | Same object as codes | Separate `DEV_COMMANDS` array | Clear separation of concerns |
| Invalid responses | Array in manager class | Exported constant + helper | Reusable, testable |

#### Achievements ✅
- `src/content/achievements/achievements.ts` - Achievement definitions + conditions
- `src/content/achievements/index.ts` - Complete export

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Definitions | Object with inline unlock state | Typed `Achievement[]` + separate state | Data/state separation |
| Conditions | Methods on manager class | Declarative `AchievementCondition[]` | Testable, pure functions |
| Categories | None | `AchievementCategory` type | Filterable in UI |

**Phase 5 Complete!**

---

### Phase 6: Scene Runner Integration ✅

**What we built:**
- `SceneRunner` - Orchestrates scene execution, coordinating all controllers
- RouteController ↔ SceneRunner integration
- Choice handling with state effects (flags, counters, tether costs)
- Effects integration from scene data
- Save/load scene position support

**V1 vs V2:**

| Aspect | V1 | V2 | Why |
|--------|----|----|-----|
| Scene execution | Imperative game engine methods | `SceneRunner` orchestrator with phases | Testable, predictable flow |
| Phase management | Implicit state | Explicit `ScenePhase` state machine | Debuggable, queryable |
| Scene transitions | Callback chains | Event-driven with `onTransition` callbacks | Decoupled, resumable |
| Choice application | Inline handlers | Declarative effects in `applyChoiceEffects()` | Consistent, tested |

**Key files:**
- `src/controllers/SceneRunner.ts` - 20 tests
- `src/controllers/RouteController.ts` - Updated with SceneRunner integration

**SceneRunner Phases:**
```
idle → entering → dialog → choosing → transitioning → complete
                    ↓
              (auto-advance)
```

**Phase 6 Complete!**

---

## Gotchas We Caught

### The Phantom Characters Incident 👻

During content migration, we discovered two characters in the type system that... don't exist in the actual game:
- `kai` - Who is Kai? Nobody knows.
- `player` - The player doesn't have a sprite. They're the player.

**How it happened:** When initially defining `CharacterId` in `types.ts`, placeholder characters snuck in. They passed TypeScript compilation (they're valid strings!) but would have caused runtime confusion.

**The fix:**
```typescript
// WRONG - phantom characters
type CharacterId = 'ronnie' | 'tori' | 'kai' | 'echo' | 'player';

// CORRECT - actual game characters
type CharacterId = 'ronnie' | 'tori' | 'oldRonnie' | 'echo1' | 'echo2' | 'despair';
```

**Files affected:**
- `src/core/types.ts` - CharacterId definition
- `src/content/characters/CharacterData.ts` - Character data
- `src/ui/views/GameView.ts` - Speaker name formatting
- `src/utils/validation.ts` - VALID_CHARACTERS array

**Lesson learned:** Type definitions are only as good as the domain knowledge behind them. Always verify types against the actual game content!

---

## Architecture Decisions

### Why EventBus over Direct Callbacks

**V1 Problem:**
```javascript
// V1: Tight coupling everywhere
gameEngine.onDialogComplete = () => {
  menuController.showChoices();
  tetherSystem.pauseDecay();
  soundManager.playSound('blip');
};
```

**V2 Solution:**
```typescript
// V2: Loose coupling via events
eventBus.emit('dialog:complete', { sceneId });

// Each system subscribes independently
menuController.init() { eventBus.on('dialog:complete', ...) }
tetherController.init() { eventBus.on('dialog:complete', ...) }
soundSystem.init() { eventBus.on('dialog:complete', ...) }
```

**Benefits:**
- Systems don't know about each other
- Easy to add/remove listeners
- Event history for debugging
- Testable in isolation

---

### Why Immutable State

**V1 Problem:**
```javascript
// V1: Direct mutations, hard to track
gameState.tetherLevel -= 5;
gameState.flags.sawSecret = true;
// Who changed what? When? Why?
```

**V2 Solution:**
```typescript
// V2: Explicit state transitions
stateManager.setState({ tetherLevel: current - 5 });
stateManager.setFlag('sawSecret', true);
// State history preserved, subscriptions notified
```

**Benefits:**
- Know exactly when state changed
- Can implement undo/redo
- Subscriptions for reactive UI
- Snapshots for save/load

---

### Why Component Base Class

**V1 Problem:**
```javascript
// V1: Inconsistent cleanup
const button = document.createElement('button');
button.addEventListener('click', handler);
// Later... did we remove the listener? Who knows.
```

**V2 Solution:**
```typescript
// V2: Automatic cleanup
class MyComponent extends Component {
  init() {
    this.on('click', handler); // Auto-tracked
    this.onEvent('game:pause', handler); // Auto-tracked
  }
  // destroy() automatically removes all listeners
}
```

**Benefits:**
- No memory leaks
- Consistent lifecycle
- DOM utilities built-in
- Animation helpers included

---

### Why JSON for Content (Future)

**V1:**
```javascript
// V1: Logic mixed with content
export function act1Scene3() {
  if (gameState.flags.metTori) {
    return specialDialog();
  }
  return normalDialog();
}
```

**V2 (Target):**
```json
{
  "id": "act1-scene3",
  "dialog": [...],
  "conditions": {
    "requires": { "flag": "metTori" }
  }
}
```

**Benefits:**
- Content editable by non-programmers
- JSON Schema validation
- Future visual editor support
- Localization-ready

---

## Test Coverage

| Module | Tests | Coverage Focus |
|--------|-------|----------------|
| EventBus | 25 | Subscriptions, priorities, wildcards |
| StateManager | 34 | Immutability, subscriptions, snapshots |
| MenuController | 27 | Stack navigation, keyboard, focus |
| TetherController | 20 | Decay, thresholds, pause/resume |
| DialogController | 17 | Typewriter, choices, advancement |
| Button | 16 | Variants, states, accessibility |
| Modal | 24 | Open/close, backdrop, focus trap |
| SplashScreen | 15 | Boot sequence, progress, skip |
| GameView | 22 | Dialog display, choices, characters |
| Prologue | 12 | Scene structure, branching |

**Total: 212 tests**

---

## File Structure

```
v2-src/
├── src/
│   ├── core/
│   │   ├── EventBus.ts          # Centralized events
│   │   ├── StateManager.ts      # Immutable state
│   │   ├── types.ts             # All type definitions
│   │   └── index.ts
│   │
│   ├── systems/
│   │   ├── SaveSystem.ts        # Save/load
│   │   ├── SettingsSystem.ts    # User preferences
│   │   └── AssetLoader.ts       # Preloading
│   │
│   ├── controllers/
│   │   ├── MenuController.ts    # Menu navigation
│   │   ├── DialogController.ts  # Text display
│   │   ├── TetherController.ts  # Decay system
│   │   ├── RouteController.ts   # Scene loading
│   │   ├── EffectsController.ts # Visual effects
│   │   └── SceneRunner.ts       # Scene orchestrator
│   │
│   ├── ui/
│   │   ├── components/
│   │   │   ├── Component.ts     # Base class
│   │   │   ├── Button.ts
│   │   │   ├── Modal.ts
│   │   │   └── BootSequence.ts
│   │   └── views/
│   │       ├── SplashScreen.ts
│   │       ├── GameView.ts
│   │       └── MenuView.ts
│   │
│   ├── content/
│   │   ├── boot/
│   │   │   ├── BootContent.ts   # Boot sequence data
│   │   │   └── BootStatsCalculator.ts
│   │   ├── characters/
│   │   │   └── CharacterData.ts # Character definitions
│   │   ├── routes/
│   │   │   ├── shared/          # Prologue scenes (JSON)
│   │   │   ├── ronnie/          # Acts 1-3, all endings
│   │   │   └── tori/            # Acts 1-3, all endings
│   │   ├── endings/
│   │   │   ├── epilogue.ts      # True Ending epilogue
│   │   │   ├── credits.ts       # Credits sequence data
│   │   │   └── ending-dialog.ts # Post-ending options
│   │   ├── secrets/
│   │   │   └── codes.ts         # Secret codes + dev commands
│   │   └── achievements/
│   │       └── achievements.ts  # Achievement definitions
│   │
│   ├── styles/
│   │   └── main.css             # Design system
│   │
│   ├── App.ts                   # Main orchestrator
│   └── main.ts                  # Entry point
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── PROGRESS.md                  # This file
```

---

## Next Steps

**Phase 7: App Integration & Main Flow**
1. **App.ts orchestration** - Wire all systems together
2. **Game loop** - Start → Boot → Menu → Play → End flow
3. **UI callbacks** - Connect SceneRunner to actual DOM updates

**Phase 8: Easter Eggs & Special Systems**
1. **EasterEggController** - Konami code, ToriGatchi, etc.
2. **BootstrapTracker** - Timeline visualization
3. **SecretCodesManager** - Code redemption UI

**Phase 9: Polish & Testing**
1. **E2E testing** - Full playthrough tests
2. **Performance profiling** - Memory, rendering
3. **Accessibility audit** - Screen reader, keyboard nav

---

*Last updated: Session 10 (Phase 6 Complete - Scene Runner Integration)*
