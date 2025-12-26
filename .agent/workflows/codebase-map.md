---
description: Quick reference for VN-Project codebase structure and key files
---

# Codebase Quick Reference

## Project Structure

```
VN-Project/
├── system/           # Core engine systems (55 files)
├── routes/           # Story route definitions (10 files)
├── tests/            # Unit tests (Vitest)
├── docs/             # Documentation
├── ui/               # UI components
├── assets/           # Game assets
└── scripts/          # Build/utility scripts
```

## Core Systems (`system/`)

| File | Purpose |
|------|---------|
| `game-engine.js` | Main game orchestrator (146KB) |
| `state-manager.ts` | Centralized state (TYPED!) |
| `notification-shade-controller.js` | Mobile UI system |
| `collectibles-manager.js` | Notes/collectibles (68KB) |
| `tether-system.js` | Tori route tether mechanic |
| `settings-manager.js` | User preferences |
| `save-manager.js` | Save/load system |

## Type Definitions

- `system/types.ts` - GameState, SubscriberCallback, StateSnapshot, HistoryEntry

## Key Entry Points

- `index.html` - Main game entry
- `gateway.html` - Initial landing page
- `system/main.js` - Game initialization

## Common Commands

```bash
// turbo-all
npm test              # Run all tests
npm run type-check    # TypeScript validation
npm run build         # Compile TS → JS
```

## Routes

| Route | File |
|-------|------|
| Tori (main) | `routes/tori-route-main.js` |
| Ronnie | `routes/ronnie-route-main.js` |
| Prologue | `routes/prologue.js` |

## Testing

- Framework: Vitest + jsdom
- Config: `vitest.config.js`
- Setup: `tests/setup.js` (localStorage mock)

## State Access Pattern

```javascript
// Get value (deep cloned)
const level = stateManager.get('tether.level');

// Set value (notifies subscribers)
stateManager.set('tether.level', 85);

// Subscribe to changes
const unsub = stateManager.subscribe('tether.level', (newVal) => {
    updateUI(newVal);
});
```

## Special Notes

- Version "848" in game is narrative, don't change
- Tether mechanic only active in Tori route
- Notes are route-specific (Tori notes ≠ Ronnie notes)
