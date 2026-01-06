# UV7 Rebuild Plan: "The Proper Way"

## Project Overview

**Goal**: Rebuild VERSION 848 with clean architecture while maintaining feature parity with the original.

**Purpose**:
- Showcase before/after of AI-assisted development
- Demonstrate best practices for VN development
- Create a reference implementation for future projects
- Portfolio piece showing growth and iteration

**Timeline**: 6 focused weekends (~12 sessions)

---

## Branch Strategy

```
main                    <- Original UV7 (shipped, playable, preserved)
    └── uv7-v2          <- Clean rebuild (TypeScript, tested, documented)
```

Both versions remain playable and comparable.

---

## Tech Stack (V2)

| Category | V1 (Current) | V2 (Rebuild) |
|----------|--------------|--------------|
| Language | JavaScript + JSDoc | TypeScript (strict) |
| Build | None (raw files) | Vite |
| State | Object mutations | Zustand or custom reactive |
| Events | Mixed (DOM/callbacks) | Unified EventBus |
| Testing | Vitest (partial) | Vitest (comprehensive) |
| Styles | CSS files | CSS Modules or Tailwind |
| Types | @ts-check comments | Native TypeScript |

---

## Architecture Overview (V2)

```
src/
├── core/
│   ├── GameEngine.ts           # Main orchestrator
│   ├── StateManager.ts         # Reactive state with subscriptions
│   ├── EventBus.ts             # Centralized event system
│   └── types.ts                # Shared type definitions
│
├── systems/
│   ├── SaveSystem.ts           # Save/load with validation
│   ├── SettingsSystem.ts       # User preferences
│   ├── AssetLoader.ts          # Preloading with progress
│   ├── AudioSystem.ts          # Music/SFX management
│   └── HapticSystem.ts         # Vibration feedback
│
├── controllers/
│   ├── MenuController.ts       # Main menu logic
│   ├── RouteController.ts      # Scene navigation
│   ├── DialogController.ts     # Text display + choices
│   ├── EffectsController.ts    # Visual effects
│   └── TetherController.ts     # Tether system logic
│
├── ui/
│   ├── components/             # Reusable UI components
│   │   ├── Button.ts
│   │   ├── Modal.ts
│   │   ├── ProgressBar.ts
│   │   └── Carousel.ts
│   ├── screens/
│   │   ├── SplashScreen.ts
│   │   ├── MainMenu.ts
│   │   ├── GameView.ts
│   │   └── SettingsScreen.ts
│   └── overlays/
│       ├── PauseMenu.ts
│       ├── SaveLoadUI.ts
│       └── NotificationShade.ts
│
├── content/
│   ├── schemas/                # Type definitions for content
│   │   ├── Scene.ts
│   │   ├── Character.ts
│   │   └── Route.ts
│   ├── routes/
│   │   ├── ronnie/
│   │   │   ├── act1.ts
│   │   │   ├── act2.ts
│   │   │   └── act3.ts
│   │   └── tori/
│   │       ├── act1.ts
│   │       ├── act2.ts
│   │       └── act3.ts
│   └── data/
│       ├── characters.ts
│       ├── backgrounds.ts
│       └── secrets.ts
│
├── features/
│   ├── BootstrapTracker.ts     # Timeline/attempt tracking
│   ├── SecretCodes.ts          # Cheat code system
│   ├── DevCommentary.ts        # Developer notes
│   ├── Achievements.ts         # Achievement system
│   └── Accessibility.ts        # A11y features
│
└── utils/
    ├── storage.ts              # LocalStorage helpers
    ├── animation.ts            # Animation utilities
    ├── validation.ts           # Runtime validation
    └── debug.ts                # Dev tools
```

---

## Phase Breakdown

### Phase 1: Foundation (Weekend 1)
**Goal**: Project setup + core architecture

**Session 1 (Saturday AM - 2-3 hours)**
- [ ] Create `uv7-v2` branch
- [ ] Initialize Vite + TypeScript project
- [ ] Configure strict TypeScript
- [ ] Setup Vitest for testing
- [ ] Create folder structure
- [ ] Write ARCHITECTURE.md

**Session 2 (Saturday PM - 2-3 hours)**
- [ ] Implement EventBus with types
- [ ] Implement StateManager (reactive)
- [ ] Write tests for EventBus
- [ ] Write tests for StateManager
- [ ] Document patterns in README

**Deliverables**:
- Working TypeScript project
- EventBus with full test coverage
- StateManager with subscriptions
- Architecture documentation

---

### Phase 2: Core Systems (Weekend 2)
**Goal**: Game engine + essential systems

**Session 3 (Saturday - 3 hours)**
- [ ] GameEngine orchestrator class
- [ ] Scene type definitions
- [ ] Basic scene loading
- [ ] Integration with StateManager
- [ ] Tests for GameEngine

**Session 4 (Sunday - 3 hours)**
- [ ] SaveSystem with validation
- [ ] SettingsSystem with defaults
- [ ] AssetLoader with progress events
- [ ] Tests for all systems

**Deliverables**:
- Functional game engine
- Save/load working
- Settings persisting
- Asset preloading with events

---

### Phase 3: Controllers (Weekend 3)
**Goal**: All game controllers

**Session 5 (Saturday - 3 hours)**
- [ ] MenuController (main menu logic)
- [ ] RouteController (navigation)
- [ ] DialogController (text + choices)
- [ ] Tests for controllers

**Session 6 (Sunday - 3 hours)**
- [ ] EffectsController (glitch, fade, etc)
- [ ] TetherController (decay, actions)
- [ ] HapticSystem integration
- [ ] Tests for effects + tether

**Deliverables**:
- All controllers functional
- Tether system working
- Effects system working
- Full test coverage

---

### Phase 4: UI Layer (Weekend 4)
**Goal**: All screens and components

**Session 7 (Saturday - 3 hours)**
- [ ] SplashScreen + boot sequence
- [ ] MainMenu with carousel
- [ ] Component library (Button, Modal, etc)
- [ ] CSS architecture

**Session 8 (Sunday - 3 hours)**
- [ ] GameView (dialog, sprites, BG)
- [ ] PauseMenu overlay
- [ ] SaveLoadUI
- [ ] NotificationShade
- [ ] Responsive design

**Deliverables**:
- Complete UI layer
- All screens functional
- Responsive on mobile/desktop
- Component documentation

---

### Phase 5: Content Migration (Weekend 5)
**Goal**: All route content converted

**Session 9 (Saturday - 3 hours)**
- [ ] Scene schema finalized
- [ ] Content migration tooling
- [ ] Ronnie Act 1 converted
- [ ] Ronnie Act 2 converted

**Session 10 (Sunday - 3 hours)**
- [ ] Ronnie Act 3 converted
- [ ] Tori Act 1-3 converted
- [ ] All endings verified
- [ ] All branches tested

**Deliverables**:
- All content migrated
- Type-safe scene data
- All paths playable
- Automated content tests

---

### Phase 6: Features + Polish (Weekend 6)
**Goal**: Feature parity + documentation

**Session 11 (Saturday - 3 hours)**
- [ ] BootstrapTracker (timeline system)
- [ ] SecretCodes system
- [ ] DevCommentary
- [ ] Achievements

**Session 12 (Sunday - 3 hours)**
- [ ] Accessibility features
- [ ] Performance optimization
- [ ] Final documentation
- [ ] Comparison benchmarks
- [ ] LESSONS_LEARNED.md

**Deliverables**:
- 100% feature parity with V1
- Full documentation
- Performance benchmarks
- Migration guide

---

## Type Definitions (Examples)

### Scene Schema
```typescript
interface Scene {
  id: string;
  background?: BackgroundId;
  music?: MusicId;

  sprites?: SpriteConfig[];
  dialog?: DialogEntry[];
  choices?: Choice[];

  effects?: Effect[];
  tetherImpact?: number;

  next?: string | ConditionalNext;
  flags?: FlagChange[];
}

interface DialogEntry {
  speaker: CharacterId | 'narrator';
  text: string;
  emotion?: Emotion;
  voice?: VoiceClip;
}

interface Choice {
  text: string;
  next: string;
  condition?: Condition;
  tetherCost?: number;
  flags?: FlagChange[];
}
```

### State Shape
```typescript
interface GameState {
  // Core
  currentScene: string;
  currentRoute: 'ronnie' | 'tori' | null;
  currentAct: 1 | 2 | 3;

  // Tether
  tetherLevel: number;
  tetherDecayRate: number;
  tetherPaused: boolean;

  // Progression
  flags: Map<string, boolean>;
  counters: Map<string, number>;
  visitedScenes: Set<string>;

  // Meta
  playthrough: number;
  totalPlaytime: number;
  endings: EndingRecord[];
}
```

### Event Types
```typescript
type GameEvents = {
  'scene:load': { sceneId: string };
  'scene:complete': { sceneId: string };
  'dialog:show': { entry: DialogEntry };
  'choice:selected': { choice: Choice };
  'tether:change': { level: number; delta: number };
  'tether:critical': { level: number };
  'save:complete': { slot: number };
  'achievement:unlock': { id: string };
};
```

---

## Testing Strategy

### Unit Tests
- Every system has isolated unit tests
- Mock dependencies
- Test edge cases
- Aim for 80%+ coverage

### Integration Tests
- Scene loading + state changes
- Save/load round-trip
- Route navigation
- Tether interactions

### E2E Tests (Optional)
- Playwright for full playthroughs
- Screenshot comparisons
- Performance monitoring

### Test Examples
```typescript
describe('TetherController', () => {
  it('should decay tether over time', async () => {
    const controller = new TetherController(mockState);
    controller.startDecay(0.5); // 0.5 per second

    await sleep(2000);

    expect(mockState.tetherLevel).toBe(99); // Started at 100
  });

  it('should emit critical event at threshold', () => {
    const onCritical = vi.fn();
    eventBus.on('tether:critical', onCritical);

    controller.setTether(15);

    expect(onCritical).toHaveBeenCalledWith({ level: 15 });
  });
});
```

---

## Documentation Deliverables

### 1. ARCHITECTURE.md
- System overview
- Data flow diagrams
- Design decisions
- Pattern explanations

### 2. MIGRATION_GUIDE.md
- How to convert V1 content to V2
- Schema mappings
- Common pitfalls
- Automated tools

### 3. LESSONS_LEARNED.md
- What changed from V1
- Why each change was made
- Performance improvements
- Developer experience wins

### 4. COMPARISON.md
- Side-by-side code examples
- Bundle size comparison
- Load time benchmarks
- Test coverage comparison

### 5. CONTRIBUTING.md
- How to add new scenes
- How to create new systems
- Code style guide
- PR process

---

## Success Metrics

### Code Quality
- [ ] 0 TypeScript errors (strict mode)
- [ ] 80%+ test coverage
- [ ] All ESLint rules passing
- [ ] No `any` types (except necessary)

### Performance
- [ ] Initial load < 2 seconds
- [ ] Scene transitions < 100ms
- [ ] Memory usage < 100MB
- [ ] 60fps animations

### Feature Parity
- [ ] All 6 acts playable
- [ ] All endings reachable
- [ ] All secret codes working
- [ ] All UI features functional

### Documentation
- [ ] Architecture documented
- [ ] All public APIs documented
- [ ] Migration guide complete
- [ ] Comparison with V1 complete

---

## Risk Mitigation

### Risk: Scope Creep
**Mitigation**: Strict feature parity only. No new features during rebuild.

### Risk: Lost Motivation
**Mitigation**: Keep V1 playable. Can stop at any phase with working code.

### Risk: Content Migration Errors
**Mitigation**: Automated migration scripts. Visual diff testing.

### Risk: Missing Edge Cases
**Mitigation**: Port V1 tests. Manual playthrough of all routes.

---

## Getting Started

### Prerequisites
```bash
# Required
node >= 18
npm >= 9

# Recommended
VS Code with TypeScript extension
```

### First Steps
```bash
# Create branch
git checkout -b uv7-v2

# Initialize project
npm create vite@latest . -- --template vanilla-ts

# Install dependencies
npm install
npm install -D vitest @testing-library/dom

# Start dev server
npm run dev
```

---

## Timeline Summary

| Weekend | Focus | Deliverable |
|---------|-------|-------------|
| 1 | Foundation | TypeScript + EventBus + StateManager |
| 2 | Core | GameEngine + Save + Settings + Assets |
| 3 | Controllers | All game controllers + Tether |
| 4 | UI | All screens + components |
| 5 | Content | All routes migrated |
| 6 | Polish | Features + Docs + Benchmarks |

**Total Estimated Time**: 24-36 hours of focused work

---

## The Flex Points

### For Your Dev Friends:

1. **"We built a complete VN in 40 days with AI"**
   - Show V1 with all its organic growth

2. **"Then we rebuilt it properly in 6 weekends"**
   - Show V2 with clean architecture

3. **"Here's the code comparison"**
   - Side-by-side TypeScript vs JavaScript
   - Test coverage differences
   - Bundle size improvements

4. **"Both versions are fully playable"**
   - Same game, different foundations
   - Players can't tell the difference
   - Developers absolutely can

---

## Ready to Start?

When you're ready for Weekend 1:
1. Create the `uv7-v2` branch
2. Start Session 1 with Vite setup
3. Let's build this thing properly! 🚀

---

*Document created: January 2026*
*UV7 Crew: Dizee, Zee, Tori, ZeeRah, Ronnie, Kai, Echo*
