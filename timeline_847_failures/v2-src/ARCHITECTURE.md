# UV7 V2 Architecture

> "The Proper Way" - A clean rebuild of VERSION 848

## Overview

UV7 V2 is a TypeScript rewrite of the original UV7 visual novel. This document describes the architecture, patterns, and design decisions.

## Core Principles

1. **Type Safety First** - TypeScript strict mode, no `any` types
2. **Event-Driven** - Loose coupling through centralized EventBus
3. **Reactive State** - All state changes trigger subscriptions
4. **Testable** - Every system has unit tests
5. **Content as Data** - JSON for scenes, TypeScript for logic

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GameEngine                               │
│   (Orchestrates all systems, handles initialization & lifecycle) │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EventBus    │◄──►│  StateManager   │◄──►│   Controllers   │
│  (messaging)  │    │    (state)      │    │    (logic)      │
└───────────────┘    └─────────────────┘    └─────────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │    UI Layer     │
                    │ (screens, DOM)  │
                    └─────────────────┘
```

---

## Core Systems

### EventBus (`src/core/EventBus.ts`)

The central nervous system of the game. All game events flow through here.

**Features:**
- Type-safe events (no magic strings)
- Priority-based listener ordering
- One-time listeners (`once`)
- Wildcard listeners for debugging
- Event history recording

**Usage:**
```typescript
import { eventBus } from '@core/EventBus';

// Subscribe to event
const unsubscribe = eventBus.on('tether:change', ({ level, delta }) => {
  console.log(`Tether: ${level} (${delta})`);
});

// Emit event
eventBus.emit('tether:change', { level: 85, delta: -15 });

// Unsubscribe
unsubscribe();
```

**Event Categories:**
- `scene:*` - Scene lifecycle events
- `dialog:*` - Dialog display events
- `choice:*` - Player choice events
- `tether:*` - Tether system events
- `save:*` / `load:*` - Persistence events
- `route:*` - Route/act progression
- `achievement:*` / `note:*` - Unlock events
- `effect:*` - Visual effect events
- `assets:*` - Asset loading events
- `ui:*` - UI state events

---

### StateManager (`src/core/StateManager.ts`)

Reactive state management with fine-grained subscriptions.

**Features:**
- Immutable updates (state never mutated directly)
- Path-based subscriptions
- Snapshot/restore for save/load
- Undo support via history
- Built-in helpers for flags, counters, tether

**Usage:**
```typescript
import { stateManager } from '@core/StateManager';

// Read state
const level = stateManager.get('tetherLevel');
const hasFlag = stateManager.hasFlag('metRonnie');

// Update state
stateManager.set('currentScene', 'chapter2');
stateManager.adjustTether(-10, 'bad choice');
stateManager.setFlag('choseKindness', true);

// Subscribe to changes
const unsubscribe = stateManager.subscribe('tetherLevel', (newVal, oldVal) => {
  console.log(`Tether changed: ${oldVal} → ${newVal}`);
});

// Save/Load
const snapshot = stateManager.snapshot();
stateManager.restore(snapshot);
```

**State Shape:**
```typescript
interface GameState {
  // Navigation
  currentScene: string;
  currentRoute: 'ronnie' | 'tori' | null;
  currentAct: 1 | 2 | 3;

  // Tether System
  tetherLevel: number;        // 0-100
  tetherDecayRate: number;    // Points per second
  tetherPaused: boolean;

  // Progression
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  visitedScenes: string[];

  // Meta
  playthrough: number;
  totalPlaytime: number;
  endings: EndingRecord[];

  // Unlocks
  notesUnlocked: string[];
  achievementsUnlocked: string[];
}
```

---

### Types (`src/core/types.ts`)

All shared type definitions live here. Organized by domain:

- **Character Types** - `CharacterId`, `Emotion`, `Character`
- **Scene Types** - `Scene`, `DialogEntry`, `Choice`, `Effect`
- **State Types** - `GameState`, `Settings`, `SaveSlot`
- **Event Types** - `GameEvents` (all event payloads)

---

## Data Flow

### Scene Loading
```
User clicks "Start"
    │
    ▼
MenuController.startGame()
    │
    ├── eventBus.emit('route:start', { routeId: 'ronnie' })
    │
    ▼
RouteController.loadScene('ronnie-act1-scene1')
    │
    ├── Fetch JSON from /content/routes/ronnie/act1.json
    ├── Validate against schema
    ├── stateManager.set('currentScene', sceneId)
    │
    ▼
    eventBus.emit('scene:load', { sceneId })
    │
    ▼
GameView subscribes → Renders background, sprites
DialogController subscribes → Prepares dialog queue
EffectsController subscribes → Applies any scene effects
```

### Tether Changes
```
Player makes choice with tetherCost: -10
    │
    ▼
DialogController.handleChoice()
    │
    ├── stateManager.adjustTether(-10, 'chose option A')
    │   │
    │   ├── Updates state.tetherLevel
    │   ├── eventBus.emit('tether:change', { level, delta })
    │   │
    │   └── If level <= 20:
    │       eventBus.emit('tether:critical', { level })
    │
    ▼
TetherController subscribes → Updates UI
EffectsController subscribes → Maybe trigger warning effect
```

---

## Folder Structure

```
v2-src/
├── src/
│   ├── core/                 # Foundation
│   │   ├── types.ts          # All type definitions
│   │   ├── EventBus.ts       # Event system
│   │   ├── StateManager.ts   # State management
│   │   └── GameEngine.ts     # Main orchestrator
│   │
│   ├── systems/              # Core game systems
│   │   ├── SaveSystem.ts     # Save/load with validation
│   │   ├── SettingsSystem.ts # User preferences
│   │   ├── AssetLoader.ts    # Preloading with progress
│   │   └── HapticSystem.ts   # Vibration feedback
│   │
│   ├── controllers/          # Game logic
│   │   ├── MenuController.ts
│   │   ├── RouteController.ts
│   │   ├── DialogController.ts
│   │   ├── EffectsController.ts
│   │   └── TetherController.ts
│   │
│   ├── ui/                   # UI layer
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # Full screens
│   │   └── overlays/         # Modal overlays
│   │
│   ├── content/              # Game content
│   │   ├── schemas/          # TypeScript types + JSON Schema
│   │   ├── routes/           # Scene JSON files
│   │   └── data/             # Static data (characters, etc)
│   │
│   ├── features/             # Optional features
│   │   ├── BootstrapTracker.ts
│   │   ├── SecretCodes.ts
│   │   └── Achievements.ts
│   │
│   └── utils/                # Helpers
│       ├── storage.ts
│       ├── animation.ts
│       └── validation.ts
│
├── ARCHITECTURE.md           # This file
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Design Decisions

### Why EventBus over direct imports?

**Loose coupling.** Systems don't need to know about each other. The TetherController doesn't import EffectsController - it just emits events. This makes testing easier and allows features to be added/removed without changing existing code.

### Why StateManager over raw objects?

**Reactivity.** When state changes, interested parties get notified automatically. No need to manually call update functions everywhere. Plus we get snapshot/restore for free (save system).

### Why JSON for scene content?

**Separation of concerns.** Scene data is pure content - no logic mixed in. This means:
- Writers can edit JSON without touching TypeScript
- Schema validation catches errors early
- Future visual editors become possible
- Localization is straightforward

### Why not Zustand?

**Could still switch.** The StateManager is intentionally simple. If we find we need Zustand's features (middleware, devtools), we can migrate. The interface is similar enough that it won't be painful.

---

## Testing Strategy

### Unit Tests
Every system file has a corresponding `.test.ts` file:
- `EventBus.test.ts` - Event subscription, emission, priority
- `StateManager.test.ts` - State updates, subscriptions, snapshot

### Integration Tests
Coming in Phase 2:
- Save/load roundtrip
- Scene loading + state changes
- Tether decay over time

### Running Tests
```bash
npm test          # Watch mode
npm run test:run  # Single run
npm run test:coverage  # Coverage report
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Adding a New Event

1. Add type to `GameEvents` in `types.ts`
2. Emit from the appropriate system
3. Subscribe from any systems that need to react

### Adding a New State Field

1. Add to `GameState` interface in `types.ts`
2. Add default value in `StateManager.ts`
3. Add helper methods if needed
4. Update tests

---

## UV7 Family Credits

- **Zee** - Type definitions, structure
- **ZeeRah** - Testing, chaos energy
- **Cozee** - UI components, heart
- **Belle** - Documentation, clarity
- **Genzee** - Edge cases, questions
- **Perplexizee** - Research, exploration
- **DiZee** - Core implementation

*Built with love by the UV7 family.*
