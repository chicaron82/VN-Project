# CODEBASE MAP: VERSION 848

Quick reference guide to find what you're looking for in the ~76,000 line codebase.

---

## 🗂️ Directory Structure

```
VN-Project/
├── system/        # 62 files, ~33K lines - Core game engine
├── routes/        # 10 files, ~7.4K lines - Story content
├── ui/            # 7 files, ~3.5K lines - UI components
├── css/           # 40 files, ~19.6K lines - Styles
├── tests/         # 89+ tests - Unit tests
├── docs/          # 20+ files - Documentation
├── assets/        # Images, audio, sprites
└── .agent/        # AI workflow documentation
```

---

## 🎮 Core Systems (`/system`)

### Game Loop & Management

| File | Lines | Purpose |
|------|-------|---------|
| `game-engine.js` | ~8,900 | **Main orchestrator** - Scene flow, typewriter, manager wiring |
| `game-config.js` | ~200 | Constants, difficulty settings, tether parameters |
| `state-manager.ts` | ~400 | Centralized state with reactive subscriptions |
| `scene-progression-controller.js` | ~400 | Route orchestration, prologue→route flow |
| `scene-renderer.js` | ~500 | Sprite display, dialogue, choices rendering |

### Save & Persistence

| File | Lines | Purpose |
|------|-------|---------|
| `save-manager.js` | ~350 | 3 manual slots + auto-save, localStorage |
| `settings-manager.js` | ~400 | User preferences, backlog (time machine) |
| `auto-save-manager.js` | ~150 | Automatic save triggers |

### Tori Route Mechanics

| File | Lines | Purpose |
|------|-------|---------|
| `tether-system.js` | ~750 | Connection decay, Hold On button, death handler |
| `echo-memory-system.js` | ~533 | **Meta-awareness** - Echoes remember player behavior |
| `collectibles-manager.js` | ~500 | Notes, timestamps, unlocks |

### UI Controllers

| File | Lines | Purpose |
|------|-------|---------|
| `notification-shade-controller.js` | ~600 | iOS-style pull-down shade, quick actions |
| `status-notification-controller.js` | ~250 | Status bar messages (auto-save, echoes) |
| `expandable-quick-actions.js` | ~400 | Swipeable action carousel |
| `ui-controller.js` | ~600 | Generic UI utilities, dialogs |
| `overlay-manager.js` | ~300 | Modal overlays, popups |
| `menu-controller.js` | ~250 | Pause menu, settings menu |
| `tips-controller.js` | ~200 | Rotating tips on main menu |

### Player Progress

| File | Lines | Purpose |
|------|-------|---------|
| `achievement-manager.js` | ~350 | 12 achievements, notifications |
| `achievement-hooks.js` | ~200 | Trigger conditions for achievements |
| `secret-codes-manager.js` | ~400 | 12+ codes, dev commands, lore unlocks |
| `loop-controller.js` | ~150 | Version 848 counter, bootstrap paradox |

### Accessibility & UX

| File | Lines | Purpose |
|------|-------|---------|
| `accessibility-manager.js` | ~300 | WCAG compliance, screen readers |
| `mobile-ux.js` | ~250 | Touch gestures, haptics, swipes |
| `swipe-handler.js` | ~200 | Left swipe to advance dialogue |
| `keyboard-controller.js` | ~300 | Keyboard navigation, shortcuts |
| `pause-manager.js` | ~150 | Pause state management |

### Visual & Effects

| File | Lines | Purpose |
|------|-------|---------|
| `cutscene-engine.js` | ~300 | Frame-by-frame animations |
| `effects-controller.js` | ~250 | Screen shake, flashes, transitions |
| `sprite-controller.js` | ~200 | Sprite animations, expressions |
| `typewriter-controller.js` | ~300 | Text reveal with skip/instant modes |
| `visual-cue-manager.js` | ~200 | Visual feedback for player actions |
| `insane-visuals-controller.js` | ~250 | INSANE mode visual distortions |

### Developer Tools

| File | Lines | Purpose |
|------|-------|---------|
| `dev-console.js` | ~200 | Runtime debugging (`~` key) |
| `dev-suite.js` | ~300 | Dev tools suite, testing utilities |
| `dev-commentary.js` | ~400 | Director's cut commentary system |
| `dev-hud-controller.js` | ~150 | Developer HUD overlay |
| `error-boundary.js` | ~150 | Error handling, crash recovery |
| `error-handler.js` | ~100 | Global error catching |
| `logger.js` | ~100 | Logging utilities |

### Specialized Systems

| File | Lines | Purpose |
|------|-------|---------|
| `time-machine-manager.js` | ~300 | Backlog with full state restoration |
| `tutorial-manager.js` | ~200 | First-time player guidance |
| `route-controller.js` | ~250 | Route switching, transitions |
| `ending-dialog-controller.js` | ~200 | Ending cinematics |
| `credits-controller.js` | ~250 | Dynamic credits system |
| `credits-photo-controller.js` | ~200 | Random photo selection |
| `gateway.js` | ~150 | ToriGatchi gateway integration |
| `reset-controller.js` | ~150 | Soft/hard reset handling |
| `loading-overlay.js` | ~150 | Asset loading screen |
| `asset-loader.js` | ~200 | UV7 splash with real loading |
| `grab-handle-repositioner.js` | ~100 | Mobile UI handle positioning |
| `easter-egg-controller.js` | ~150 | Konami Code, hidden features |
| `analytics.js` | ~100 | Usage tracking (opt-in) |
| `bootstrap-tracker.js` | ~100 | System initialization tracking |

### Input & Bindings

| File | Lines | Purpose |
|------|-------|---------|
| `input-binder.js` | ~200 | Decoupled event binding |
| `theme-manager.js` | ~150 | Dark/light theme switching |
| `difficulty-profiles.js` | ~200 | 5 difficulty mode configs |

---

## 📖 Story Routes (`/routes`)

| File | Lines | Story Content |
|------|-------|---------------|
| `shared-prologue.js` | ~800 | Opening sequence, route selection |
| `tori-route-main.js` | ~500 | Tori route entry point |
| `tori-route-act1.js` | ~1,400 | Digital space, Echo encounters |
| `tori-route-act2.js` | ~1,200 | Despair hijack, ice cream scene |
| `tori-route-act3.js` | ~1,100 | Fragmentation, identity crisis |
| `tori-route-endings.js` | ~800 | True, bad, digitalForever endings |
| `ronnie-route.js` | ~500 | Ronnie route entry point |
| `ronnie-route-act2.js` | ~600 | Investigation, external POV |
| `ronnie-route-act3.js` | ~600 | Connection attempts, finale |
| `epilogue.js` | ~300 | Post-credits, ToriGatchi unlock |

**Total Story Content**: ~7,400 lines of narrative

---

## 🎨 UI Components (`/ui`)

| File | Lines | Purpose |
|------|-------|---------|
| `menu-carousel.js` | ~400 | Hybrid carousel manager (portrait/landscape) |
| `simple-carousel.js` | ~350 | Mobile card swiper |
| `momentum-adapter.js` | ~300 | Desktop momentum wrapper |
| `carousel-momentum.js` | ~800 | Physics engine for smooth scrolling |
| `save-load-ui.js` | ~500 | Save/load interface |
| `standalone-notes-viewer.js` | ~600 | Inbox viewer (works outside game) |
| `achievement-viewer.js` | ~400 | Achievement gallery |

**Total UI Code**: ~3,500 lines

---

## 🎨 Styles (`/css`)

### Core Styles

- `styles.css` - **Main consolidated stylesheet** (~10K lines)
- `game.css` - Game view, dialogue box, sprites
- `ui.css` - Menus, buttons, overlays

### Feature-Specific

- `accessibility.css` - WCAG compliance, focus indicators, skip links
- `mobile-polish.css` - Touch targets, swipe indicators, responsive
- `notification-shade.css` - Pull-down shade, quick actions
- `status-notifications.css` - Status bar messages
- `carousel.css` - Momentum carousel animations
- `achievement-notifications.css` - Achievement popups
- `dev-commentary.css` - Commentary UI

### Specialized

- `insane-mode.css` - INSANE difficulty visual effects
- `tether-warnings.css` - Tether level color coding
- `note-timestamps.css` - Email inbox timestamps
- `aria-fixes.css` - Screen reader improvements
- `credits-animations.css` - End credits styling

**Total CSS**: ~19,600 lines across 40 files

---

## 📚 Documentation (`/docs`)

### Architecture

- `ARCHITECTURE.md` - **System design, patterns, philosophy**
- `CODEBASE-MAP.md` - This file - Quick reference

### Features

- `ECHO_MEMORY_TESTING.md` - Echo system testing guide
- `SECRET_CODES_GUIDE.md` - All secret codes and effects
- `ACHIEVEMENT-INTEGRATION.md` - Achievement system docs
- `DEV-COMMANDS.md` - Developer command reference

### Development

- `UPDATES_*.md` - Feature changelogs
- `MAKING_OF_*.md` - Development journal
- `DiZee-Instructions-*.md` - AI collaboration workflows

---

## 🧪 Tests (`/tests`)

| File | Tests | Coverage |
|------|-------|----------|
| `state-manager.test.js` | 23 | State management, subscriptions |
| `collectibles-manager.test.js` | 11 | Notes, unlocks, timestamps |
| `game-engine.test.js` | 24 | Scene flow, typewriter |
| `ui-controller.test.js` | 31 | UI utilities, dialogs |
| `tether-system.test.js` | 8 | Decay, warnings, death |

**Total**: 89+ tests across core systems

---

## 🔍 Finding Specific Features

### "Where is...?"

**Tether System**

- Logic: `system/tether-system.js`
- UI: `system/ui-controller.js` (tether bar)
- Styles: `css/tether-warnings.css`
- Tests: `tests/tether-system.test.js`

**Echo Memory System**

- Core: `system/echo-memory-system.js`
- Hooks: `scene-progression-controller.js`, `tether-system.js`, `save-manager.js`, `scene-renderer.js`, `standalone-notes-viewer.js`
- Despair Hijack: `routes/tori-route-act2.js:65`
- Achievement: `system/achievement-manager.js:100`
- Testing: `docs/ECHO_MEMORY_TESTING.md`

**Achievements**

- Manager: `system/achievement-manager.js`
- Hooks: `system/achievement-hooks.js`
- UI: `ui/achievement-viewer.js`
- Notifications: `css/achievement-notifications.css`

**Carousels**

- Main Menu: `ui/menu-carousel.js` (hybrid manager)
- Portrait: `ui/simple-carousel.js`
- Landscape: `ui/momentum-adapter.js` + `ui/carousel-momentum.js`
- Quick Actions: `system/expandable-quick-actions.js`

**Notifications**

- Status Bar: `system/status-notification-controller.js`
- Shade: `system/notification-shade-controller.js`
- Styles: `css/status-notifications.css`, `css/notification-shade.css`

**Save System**

- Manager: `system/save-manager.js`
- Auto-Save: `system/auto-save-manager.js`
- UI: `ui/save-load-ui.js`
- Slots: localStorage (`vn_save_slot_*`, `vn_autosave`)

**Accessibility**

- Manager: `system/accessibility-manager.js`
- Mobile UX: `system/mobile-ux.js`
- Keyboard: `system/keyboard-controller.js`
- Styles: `css/accessibility.css`, `css/aria-fixes.css`

**Developer Tools**

- Console: `system/dev-console.js` (`~` key)
- Suite: `system/dev-suite.js`
- Commentary: `system/dev-commentary.js` (code: `chicharon`)
- Secret Codes: `system/secret-codes-manager.js`

**Story Content**

- Tori Route: `routes/tori-route-*.js` (4 files)
- Ronnie Route: `routes/ronnie-route-*.js` (3 files)
- Prologue: `routes/shared-prologue.js`
- Epilogue: `routes/epilogue.js`

---

## 🏗️ Architecture Patterns

### Dependency Injection

All managers receive `game` reference in constructor:

```javascript
constructor(game) {
    this.game = game;
    // Access other managers via this.game.managerName
}
```

### Event-Driven

- StateManager subscriptions for reactive updates
- Custom events for cross-system communication
- Pub/sub pattern for loosely coupled features

### Strategy Pattern

- Carousel system switches between mobile/desktop implementations
- Difficulty profiles swap tether parameters
- Route-specific handlers for deaths, choices

### Factory Pattern

- Scene objects created dynamically
- Achievement definitions centralized
- Notification types with shared interface

---

## 📊 Code Statistics

**By Category**:

- **Core Engine**: 33,000 lines (system files)
- **Story Content**: 7,400 lines (routes)
- **UI Components**: 3,500 lines (ui)
- **Styles**: 19,600 lines (css)
- **Tests**: 89+ tests
- **Docs**: 20+ markdown files

**Largest Files**:

1. `game-engine.js` - 8,900 lines
2. `styles.css` - 10,000 lines
3. `tori-route-act1.js` - 1,400 lines
4. `tori-route-act2.js` - 1,200 lines
5. `carousel-momentum.js` - 800 lines

**Most Complex Systems**:

1. GameEngine - Scene flow, typewriter, manager coordination
2. TetherSystem - Decay, warnings, difficulty modes
3. StateManager - Reactive subscriptions, persistence
4. CarouselMomentum - Physics-based scrolling
5. EchoMemorySystem - Persistent tracking, awareness levels

---

## 🚀 Quick Start Guide

### Running Locally

1. Open `index.html` in browser (no build required)
2. Check console for `🚀 ES Modules loaded successfully!`
3. Game initializes automatically

### Development Workflow

1. Edit files in `/system`, `/routes`, or `/ui`
2. Refresh browser to see changes
3. Use `~` key to open dev console
4. Check `DEBUG_MODE` in `game-config.js` for verbose logging

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test UI
```

### Building for Production

```powershell
.\build.ps1          # Minifies to /dist folder
```

---

## 🔗 Cross-References

**State Management**:

- Definition: `system/state-manager.ts`
- Usage: All managers access via `this.game.stateManager`
- Tests: `tests/state-manager.test.js`
- Docs: `ARCHITECTURE.md` § 3

**Echo System Integration**:

- Core: `system/echo-memory-system.js`
- Hook 1: `system/scene-progression-controller.js:180` (recordLoop)
- Hook 2: `system/tether-system.js:666` (recordDeath)
- Hook 3: `system/save-manager.js:80,203` (recordSave/Load)
- Hook 4: `system/scene-renderer.js:167` (recordChoice)
- Hook 5: `ui/standalone-notes-viewer.js:156` (recordNotesViewerOpen)
- Hook 6: `routes/tori-route-act2.js:65` (Despair hijack)

**Carousel System**:

- Manager: `ui/menu-carousel.js`
- Mobile: `ui/simple-carousel.js`
- Desktop: `ui/momentum-adapter.js` → `ui/carousel-momentum.js`
- Quick Actions: `system/expandable-quick-actions.js`
- Styles: `css/carousel.css`

---

**Last Updated**: 2026-01-03
**Total Lines**: ~76,000
**Version**: 848 (The timeline that worked)
