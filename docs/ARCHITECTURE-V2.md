# Version 848 V2 - Architecture Documentation

## Overview

Version 848 V2 is a clean rebuild of the original game, maintaining feature parity while improving code quality, maintainability, and developer experience.

**Key Principle**: Players can't tell the difference. Developers absolutely can.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Build**: Vite
- **Testing**: Vitest with jsdom
- **State Management**: Reactive state with subscriptions (custom implementation, Zustand optional)
- **Content**: JSON files with JSON Schema validation
- **Styles**: CSS Modules (maintains V1 aesthetic)

## Project Structure

```
src/
├── core/              # Core game systems
│   ├── GameEngine.ts       # Main orchestrator
│   ├── StateManager.ts     # Reactive state with subscriptions
│   ├── EventBus.ts         # Centralized event system
│   └── types.ts            # Shared type definitions
│
├── systems/           # Game systems
│   ├── SaveSystem.ts       # Save/load with validation
│   ├── SettingsSystem.ts   # User preferences
│   ├── AssetLoader.ts      # Preloading with progress
│   └── HapticSystem.ts     # Vibration feedback (PRIMARY FEEDBACK)
│
├── controllers/       # Game controllers
│   ├── MenuController.ts      # Main menu logic
│   ├── RouteController.ts     # Scene navigation
│   ├── DialogController.ts    # Text display + choices
│   ├── EffectsController.ts   # Visual effects (PRIMARY FEEDBACK)
│   └── TetherController.ts    # Tether system logic
│
├── ui/                # UI layer
│   ├── components/          # Reusable UI components
│   ├── screens/             # Full screens
│   └── overlays/            # Overlay components
│
├── content/           # Game content (data)
│   ├── schemas/            # Type definitions + JSON Schema
│   ├── routes/             # Route JSON files
│   └── data/               # Character/asset definitions
│
├── features/          # Feature modules
│   ├── BootstrapTracker.ts
│   ├── SecretCodes.ts
│   ├── DevCommentary.ts
│   ├── Achievements.ts
│   └── Accessibility.ts
│
└── utils/             # Utilities
    ├── storage.ts
    ├── animation.ts
    ├── validation.ts
    └── debug.ts
```

## Core Design Principles

### 1. No Audio - Intentional Design Decision

Version 848 is intentionally audio-free. Instead, the game uses a **unified sensory feedback system**:
- **Haptic feedback**: Vibration patterns on mobile
- **Visual cues**: Chromatic aberration, glitch effects, screen pulses
- **Sensory metadata**: Centralized config pairing haptics + visuals

This is the **PRIMARY feedback mechanism**, not optional polish.

### 2. Content as Data

Game content (scenes, routes, dialogue) is stored as **JSON files**, not JavaScript functions:
- Enables non-developers to edit content
- Type-safe with JSON Schema validation
- Easier to version control and diff
- Future-proof for visual editors/localization

### 3. Type Safety

- Strict TypeScript configuration
- No `any` types (except necessary)
- Type definitions for all data structures
- Runtime validation with JSON Schema

### 4. Testability

- 80%+ test coverage goal
- Unit tests for all systems
- Integration tests for critical paths
- Tests focus on: save/load, routing, tether, secret codes

### 5. Separation of Concerns

- Clear module boundaries
- No "god objects"
- Single responsibility principle
- New features require touching ≤3 modules

## Key Systems

### EventBus

Centralized event system for decoupled communication:
- Type-safe event definitions
- Pub/sub pattern
- Event history for debugging

### StateManager

Reactive state management:
- Subscription-based updates
- Immutable state updates
- State persistence support

### Haptic + Visual Cues System

**PRIMARY FEEDBACK MECHANISM** replacing audio:
- Pattern library (12+ haptic patterns)
- Comfort intensity scaling (Gentle/Normal/Amped/INSANE)
- Sensory metadata system (SENSORY_CUES)
- Channel-based intensity (ui/narrative/critical)

### Content Schema

JSON-based scene definitions with:
- TypeScript interfaces
- JSON Schema validation
- Runtime validation on load
- Clear error messages

## Development Workflow

### Build Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:v2      # Run V2 tests
npm run test:coverage:v2  # Run tests with coverage
```

### Adding New Content

1. Create JSON file in `src/content/routes/{route}/act{N}.json`
2. Follow scene schema (defined in `src/content/schemas/`)
3. JSON Schema validates on load
4. TypeScript types provide IDE support

### Adding New Systems

1. Create module in appropriate directory (`systems/`, `controllers/`, etc.)
2. Add TypeScript types to `src/core/types.ts`
3. Write tests alongside implementation
4. Document in this file

## Phase Status

**Phase 1 - Foundation** ✅
- [x] Project setup (Vite + TypeScript)
- [x] Folder structure
- [x] Architecture documentation
- [ ] EventBus implementation (Session 2)
- [ ] StateManager implementation (Session 2)

**Phase 2-6**: See `docs/UV7-REBUILD-PLAN.md` for full roadmap

## Success Metrics

- **Player Experience**: Feels identical to V1
- **Code Quality**: 0 TypeScript errors (strict mode)
- **Test Coverage**: 80%+
- **Developer Experience**: New dev can add scene in <10 minutes
- **Architecture**: New feature touches ≤3 modules

---

*This architecture maintains the magic of V1 while providing a clean, maintainable foundation for future development.*
