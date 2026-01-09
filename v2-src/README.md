# UV7 V2

A complete rewrite of the UV7 visual novel engine with TypeScript, proper architecture, and testability.

## Current Status

**Phase 7 Complete** - App Integration

| Area | Status | Notes |
|------|--------|-------|
| Core (EventBus, StateManager) | Done | Typed, tested, with history/undo |
| Controllers (Dialog, Tether, Route, Scene, Effects, Menu) | Done | All tested |
| UI Layer (Components, Views) | Done | GameView, SplashScreen, Menus |
| Content (Prologue, Routes, Endings) | Done | Schema-validated |
| App Flow (Boot -> Menu -> Play) | Done | Save/load working |
| Easter Eggs | Not started | Phase 8 |
| Polish & E2E | Not started | Phase 9 |

## What's Intentionally Not Built Yet

- **Audio system** - Music/SFX playback (wiring exists, implementation pending)
- **Easter eggs** - Konami code, ToriGatchi, secret codes
- **Credits screen** - End-game credits sequence
- **Game over screen** - Tether depletion handling
- **E2E tests** - Full playthrough automation

## Definition of "Vertical Slice Complete"

The V2 engine is considered feature-complete when:

1. **Prologue plays start to finish** - All 3 scenes with transitions
2. **Route selection works** - Can choose Ronnie or Tori path
3. **One full act plays** - Dialog, choices, effects, tether changes
4. **Save/load works** - Can save mid-scene and resume
5. **All tests pass** - 232+ unit tests green

Current: Items 1-4 are structurally complete. Needs real content testing.

## Architecture

```
src/
├── core/           # Engine primitives
│   ├── EventBus    # Typed pub/sub with priority & history
│   ├── StateManager # Immutable state with subscriptions
│   └── types       # All type definitions
│
├── controllers/    # Gameplay orchestration
│   ├── SceneRunner # Executes scenes (the conductor)
│   ├── RouteController # Loads/navigates scenes
│   ├── DialogController # Typewriter, choices
│   ├── TetherController # Decay, thresholds
│   ├── EffectsController # Screen shake, flash, etc.
│   └── MenuController # Menu state machine
│
├── systems/        # Infrastructure
│   ├── SaveSystem  # LocalStorage save/load
│   ├── SettingsSystem # User preferences
│   └── AssetLoader # Preloading with progress
│
├── ui/             # Presentation
│   ├── components/ # Button, Modal, etc.
│   └── views/      # GameView, SplashScreen, MenuView
│
├── content/        # Game data
│   ├── routes/     # Scene definitions (JSON)
│   ├── endings/    # Ending sequences
│   ├── secrets/    # Easter egg codes
│   └── achievements/
│
└── App.ts          # Main orchestrator
```

## Key Design Decisions

### 1. JSON for Content, TS for Code
- Scenes are authored in JSON with schema validation
- TypeScript compiles the engine, not the content
- Enables future tooling (editors, validators, translators)

### 2. Dependency Injection Over Singletons
- All controllers accept injected dependencies
- Singletons exist for convenience, not necessity
- Tests can inject mocks easily

### 3. Event-Driven Communication
- Components don't import each other
- Everything talks through EventBus
- Enables debugging via event history

### 4. Schema-First Content
- `content/schemas/scene.schema.json` defines scene structure
- Validation runs at load time
- Errors are actionable (route/scene/field)

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Tests
npm test

# Type check
npm run typecheck

# Build
npm run build
```

### Dev Mode Features

- `?skip` query param skips splash screen
- `window.uv7` exposes app/state/events for debugging
- All events logged to console
- Event history available via `uv7.getHistory()`

## Tests

232 tests across:
- `core/` - EventBus, StateManager
- `controllers/` - All 6 controllers
- `ui/` - Components and views
- `content/` - Scene validation

Run with `npm test` or `npm test -- --watch` for development.
