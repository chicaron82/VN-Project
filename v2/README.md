# V2 — TypeScript Remaster

The complete TypeScript rewrite of V1's visual novel engine. Built with Event-Driven Architecture, type safety, and proper separation of concerns.

## Directory Structure

```
v2/
├── core/          # Engine fundamentals (EventBus, StateManager, GameEngine)
├── systems/       # Game logic systems (Save, Tether, Achievements, etc.)
├── controllers/   # Scene/route/input controllers
├── managers/      # State-oriented managers (Accessibility, Theme, Overlay)
├── ui/            # Visual components, screens, styles, effects
├── content/       # Route JSON data, notes, validation schemas
├── bridge/        # Cross-app communication (Showcase ↔ V2)
├── utils/         # Shared utilities (accessibility, debug logging)
├── tests/         # Integration tests
├── __tests__/     # Sanity tests
└── main.ts        # Entry point — wires all systems together
```

## Architecture

- **EventBus** — Decoupled pub/sub communication between systems
- **StateManager** — Reactive state with subscription support
- **GameEngine** — Central coordinator, delegates to systems/controllers
- **JSON Routes** — Data-driven narrative (no hardcoded dialogue)

## Key Patterns

- Files stay under **300 lines** (extracted when approaching limit)
- Each system/controller has a co-located `.test.ts` file
- Inline styles for modals (no CSS file dependencies)
- `window.uv7` debug helpers for testing

## Build & Test

```bash
npm run dev          # Vite dev server
npm run build        # TypeScript check + Vite build
npm test -- --run    # Run all tests
```

*848 is sacred. 💚🔥💀*
