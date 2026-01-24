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

## Core Design Constraints ⚠️

### No Audio - Intentional Design Decision

**Version 848 is intentionally audio-free.** This is a deliberate design choice, not an oversight.

**Why No Audio:**
- Music licensing is expensive
- Audio files are heavy (2-5MB+ even compressed)
- Permission prompts interrupt the experience
- Players may have headphones or need silent play

**The Alternative: Haptic + Visual Cues System**

Instead of audio, Version 848 uses a **unified sensory feedback system** combining:
- **Haptic feedback** (vibration patterns on mobile)
- **Visual cues** (chromatic aberration, glitch effects, screen pulses)
- **Sensory metadata** (centralized config pairing haptics + visuals)

**This is not optional polish - it's the PRIMARY feedback mechanism.**

The haptic + visual cue system replaces audio cues entirely:
- Emotional moments → Haptic patterns + visual effects
- UI interactions → Light haptics + visual feedback
- Critical events → Strong haptics + chromatic/glitch effects
- Narrative beats → Channeled haptics (narrative/critical/ui) + matching visuals

**For V2 Rebuild:**
- **DO NOT** add audio support
- **DO NOT** suggest audio as an enhancement
- **DO PRESERVE** the haptic + visual cue system as the primary feedback
- **DO MAINTAIN** the sensory metadata system
- **DO ENSURE** all V1 haptic patterns and visual effects are preserved

See: `docs/DESIGN_DECISION_NO_AUDIO.md` for full rationale.

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
| State | Object mutations | Zustand (recommended) |
| Events | Mixed (DOM/callbacks) | Unified EventBus |
| Testing | Vitest (partial) | Vitest (comprehensive) |
| Styles | CSS files | CSS Modules (keeps UV7 aesthetic) |
| Types | @ts-check comments | Native TypeScript |
| **Content** | **JS functions** | **JSON + JSON Schema validation** ⭐ |

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
│   ├── schemas/                # Type definitions + JSON Schema
│   │   ├── Scene.ts            # TypeScript types
│   │   ├── scene.schema.json   # JSON Schema for validation
│   │   ├── Character.ts
│   │   └── Route.ts
│   ├── routes/
│   │   ├── ronnie/
│   │   │   ├── act1.json       # ⭐ Pure data (editable by non-devs)
│   │   │   ├── act2.json
│   │   │   └── act3.json
│   │   └── tori/
│   │       ├── act1.json
│   │       ├── act2.json
│   │       └── act3.json
│   └── data/
│       ├── characters.json     # Character definitions
│       ├── backgrounds.json    # Background assets
│       └── secrets.json        # Secret codes
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

### Phase 2: Core Systems + Micro-Migration (Weekend 2)

**Goal**: Game engine + essential systems + **VALIDATE SCHEMA EARLY**

**Session 3 (Saturday - 3 hours)**

- [ ] GameEngine orchestrator class
- [ ] Scene type definitions (TypeScript interfaces)
- [ ] JSON Schema for scene validation
- [ ] Basic scene loading with validation
- [ ] Integration with StateManager
- [ ] Tests for GameEngine

**Session 4 (Sunday - 3 hours)**

- [ ] SaveSystem with validation
- [ ] SettingsSystem with defaults
- [ ] AssetLoader with progress events
- [ ] **MICRO-MIGRATION**: Convert 1 V1 scene to JSON format
  - Include: 1 choice branch
  - Include: 1 note unlock
  - Include: 1 save/load roundtrip test
  - **GOAL**: Validate schema assumptions before Phase 5
- [ ] Tests for all systems

**Deliverables**:

- Functional game engine
- Save/load working
- Settings persisting
- Asset preloading with events
- **Proof that schema works with real V1 content** ⭐

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

### Phase 5: Iterative Content Migration (Weekend 5)

**Goal**: Complete content conversion using validated schema

**Context**: Schema already validated in Phase 2 micro-migration ✅

**Session 9 (Saturday - 3 hours)**

- [ ] Refine migration tooling based on Phase 2 learnings
- [ ] Ronnie Act 1 → JSON (with automated script)
- [ ] Ronnie Act 2 → JSON (with automated script)
- [ ] Manual cleanup of edge cases
- [ ] Verify all branches playable

**Session 10 (Sunday - 3 hours)**

- [ ] Ronnie Act 3 → JSON (with automated script)
- [ ] Tori Act 1-3 → JSON (batch conversion)
- [ ] All endings verification
- [ ] Content validation tests
- [ ] Compare V1 vs V2 playthrough side-by-side

**Deliverables**:

- All content migrated to JSON
- Type-safe scene data with runtime validation
- All paths playable and verified
- Automated content tests
- **Migration completed without surprises** (thanks to Phase 2 validation) ⭐

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
  // NOTE: No music field - Version 848 is intentionally audio-free
  // Feedback is provided via haptic + visual cues instead

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
  // NOTE: No voice field - Version 848 is intentionally audio-free
  // Feedback is provided via haptic + visual cues instead
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

### Developer Experience (Tori's Metrics) ⭐

- [ ] New dev can add a scene in <10 minutes using docs only
- [ ] New feature requires touching ≤3 modules
- [ ] Schema validation gives actionable error messages
- [ ] No "god objects" - clear separation of concerns

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

### Risk: Losing Polish & Personality ⚠️

**The Critical Concern**: A "clean" rebuild could make systems functional but lose the magic - the animations, the feel, the attention to detail that makes V1 special.

**Mitigation**: **Polish Preservation Checklist** (see below). Every system must preserve:
- Visual polish (animations, effects, transitions)
- Haptic feedback patterns and timing
- Sensory metadata system (haptic + visual pairing)
- Physics-based interactions (carousel momentum, friction)
- Comfort intensity scaling (Gentle/Normal/Amped/INSANE)
- All animation timings and easing curves

---

## Polish Preservation Checklist ⭐

**CRITICAL**: These are the details that make V1 special. Every system must preserve these elements, not just be "functionally equivalent."

### Visual Effects & Animations ⭐ **PRIMARY FEEDBACK MECHANISM**

**CRITICAL**: Visual cues work with haptics to replace audio. They're not just pretty - they're how the game communicates emotion and feedback.

- [ ] **Chromatic Aberration Effects** (`visual-cues.css`)
  - `toriHop`: Double flicker with chromatic split overlay
  - `tamaPull`: Inward squeeze with ripple effect
  - `timelineGlitch`: Screen glitch animations
  - All animations respect comfort intensity scaling
  - **These effects replace audio cues - preserve timing and intensity**

- [ ] **Matrix Rain Transitions** (`effects-controller.js`)
  - Loop init screen code rain animation
  - Scene transition effects
  - Version increment display with Matrix aesthetic

- [ ] **Sprite Animations** (`sprites.css`)
  - Fade in/out sequences
  - Sprite positioning and transitions
  - Highlight states for active speakers

- [ ] **UI Animations** (`overlays.css`, `menu.css`)
  - Fade in/out transitions (0.3s ease-out)
  - Shake animations for errors
  - Smooth overlay transitions

### Haptic Feedback System ⭐ **PRIMARY FEEDBACK MECHANISM**

**CRITICAL**: This system replaces audio entirely. It's not optional polish - it's how the game communicates with players.

- [ ] **Haptic Pattern Library** (12+ patterns from `game-config.js`)
  - Basic: `light`, `medium`, `strong`
  - Complex: `double`, `triple`, `pulse`, `success`, `warning`, `error`
  - Story-specific: `glitch`, `echo`, `heartbeat`, `denied`
  - All patterns preserved with exact timing values
  - **These patterns replace audio cues - preserve all of them**

- [ ] **Comfort Intensity Scaling** (`haptic-controller.js`)
  - Gentle (60%): Softer, shorter patterns
  - Normal (100%): Baseline
  - Amped (130%): Stronger, longer patterns
  - INSANE (200%): Maximum intensity boost
  - Critical channel NEVER scales (always full intensity)
  - **Scaling must match V1 exactly - this affects player experience**

- [ ] **Sensory Metadata System** (`game-config.js` SENSORY_CUES) ⭐
  - Unified haptic + visual cue pairing
  - Channel-based intensity (ui/narrative/critical)
  - Metadata-driven feedback (no hardcoded triggers)
  - **This is the core architecture - every feedback uses this system**
  - All SENSORY_CUES metadata must be preserved exactly

### Physics-Based Interactions

- [ ] **Carousel Momentum System** (`carousel-momentum.js`)
  - Friction-based deceleration (0.975 friction value)
  - Velocity caps (300px/s)
  - Snap thresholds (0.2 multiplier)
  - Infinite scroll with 3x clone buffer
  - "Price Is Right wheel" feel preserved

- [ ] **Gesture Interactions** (`simple-carousel.js`, `expandable-quick-actions.js`)
  - Tinder-style card swipes with rotation
  - Momentum-based exit timing (200-400ms dynamic)
  - Elastic spring-back animations
  - Velocity-based animations (fast = instant, slow = graceful)

### Notification & UI Systems

- [ ] **Notification Shade** (`notification-shade-controller.js`)
  - iOS-style pull-down shade
  - Frosted glass effect (backdrop-filter: blur)
  - Smooth spring animations
  - Quick actions carousel
  - Full-body sprite peeks

- [ ] **Status Notifications** (`status-notification-controller.js`)
  - Priority queue system
  - Auto-save, skip mode, echo comments
  - Haptic feedback integration
  - Fade in/out transitions

- [ ] **Time Machine Backlog** (`time-machine-manager.js`)
  - Full state restoration (tether, flags, scene context)
  - Smart pruning algorithm
  - Narrative blocking (lock/burn snapshots)
  - Click-to-jump functionality

### Meta-Narrative Systems

- [ ] **Echo Memory System** (`echo-memory-system.js`)
  - Persistent tracking across browser sessions
  - Escalating awareness (0-4 levels)
  - Three echo personalities (Hope, Gentle, Despair)
  - Contextual comments in status bar
  - Achievement integration

- [ ] **Bootstrap Paradox Tracker** (`bootstrap-tracker.js`)
  - Loop version tracking (848)
  - Timeline visualization
  - Failed attempt records
  - Meta-narrative integration

### Accessibility & Comfort

- [ ] **Comfort Mode** (`settings-manager.js`)
  - Reduce motion support
  - Comfort intensity slider (Gentle/Normal/Amped)
  - Visual cue scaling
  - Haptic pattern scaling
  - Respects `prefers-reduced-motion`

- [ ] **Keyboard Navigation**
  - Full keyboard support (Tab, Arrow, Enter)
  - Hierarchical ESC (close in order)
  - Quick shortcuts (Ctrl+S, Ctrl+L)
  - Focus indicators

- [ ] **Mobile UX**
  - Touch-optimized targets (Fitts's Law)
  - Haptic feedback (vibration patterns)
  - Swipe gestures
  - Double-tap fullscreen
  - Responsive design (flow-based positioning)

### Visual Design Details

- [ ] **Color Scheme & Branding**
  - UV7 cyan glow (#00ff88)
  - Error red (#ff0066)
  - Monospace fonts (Courier New)
  - Cyberpunk aesthetic preserved

- [ ] **Typography & Spacing**
  - Dialogue box styling
  - Character name styling
  - Internal thought bubbles
  - Scroll indicators (↓)

- [ ] **Responsive Breakpoints**
  - Mobile-first approach
  - Portrait/landscape adaptations
  - Desktop mobile emulator mode
  - Force-portrait class system

### Testing & Validation

- [ ] **Side-by-Side Comparison**
  - Playthrough V1 and V2 simultaneously
  - Compare animations frame-by-frame
  - Verify haptic patterns match exactly
  - Test all routes and endings
  - Verify all secret codes work

- [ ] **Polish Metrics**
  - Animation timings match V1 (±5ms tolerance)
  - Haptic patterns identical
  - Visual effects render correctly
  - Physics feel matches V1
  - No "bland" or "generic" feeling

**Remember**: The goal isn't just "it works" - it's "it feels the same, but the code is cleaner." A human dev shouldn't nitpick because V2 should feel just as polished and personality-rich as V1.

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

### For Your Dev Friends

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

## Tori's Critical Feedback (Added January 2026)

### What She Got Right About Our Risks

**1. Phase 5 (Content Migration) is Underestimated**

> "Even with tooling, content conversion is where you'll bleed time because you'll discover edge cases in your scene format."

**Her Fix**: Do a **micro-migration at end of Weekend 2 or 3**
- Migrate 1 complete scene + 1 choice + 1 note unlock + 1 save/load roundtrip
- Forces schema to become real before building 30 modules on assumptions
- Catches the edge cases EARLY when it's cheap to fix

**2. JSON vs TypeScript for Scenes - Critical Fork Decision**

Tori recommends: **JSON for scene content**

```
✅ GOOD: content/routes/ronnie/act1.json  (pure data)
❌ AVOID: content/routes/ronnie/act1.ts   (logic creeps in)
```

**Why**:
- Keeps logic OUT of content (huge maintainability win)
- Easy to validate with JSON Schema
- Future-proof for visual editors/localization
- "If you go TS for scenes, you'll accidentally slip logic into content"

**3. Schema Validation Must Be Non-Optional**

Every scene load validates (dev mode):
- Errors are actionable: `scene id, field path, expected vs got`
- This is the #1 reason V2 will feel "human-friendly"

**4. Don't Overbuild These**

- **Component library**: Keep it tiny (Button/Modal/Carousel/ProgressBar only)
- **80% coverage**: Focus tests on what bites:
  - save/load + migrations
  - secret codes parsing/dispatch
  - scene routing/conditions
  - tether/bootstrap thresholds

**5. Missing Success Metric - Add This**

Dev-experience proof:
- ✅ "New dev can add a scene in <10 minutes using docs only"
- ✅ "New feature requires touching ≤3 modules"

**6. The Big Strategic Shift**

> "Treat Phase 5 as 'iterative migration,' not 'one weekend conversion.'"

Spread content migration across phases instead of batching it all at the end.

---

## Suggested Improvements (Added by DiZee)

### 1. Content Migration Tooling

Phase 5 may be underestimated. Consider building a migration script in Phase 1:

- Parse V1 route files automatically
- Auto-generate TypeScript boilerplate
- Manual cleanup only for edge cases

### 2. JSON for Scene Content

Consider `.json` files for scene data instead of `.ts`:

```
content/routes/ronnie/act1.json  <- Pure data (editable by non-devs)
content/schemas/Scene.ts         <- Type definitions
```

Enables future visual editor and easier localization.

### 3. Use Zustand for State

Recommend Zustand over custom StateManager:

- ~1KB bundle size
- Great DevTools integration
- Handles subscriptions elegantly
- No need to reinvent the wheel

### 4. CSS Modules over Tailwind

Version 848's aesthetic is unique and handcrafted. CSS Modules give isolation without fighting the existing design language.

### 5. Priority Ranking (If Cutting Scope)

1. ✅ EventBus + StateManager (non-negotiable)
2. ✅ TypeScript + Vite (non-negotiable)
3. ✅ Scene schema + content separation
4. ✅ SaveSystem + TetherController
5. 🟡 Full UI component library (could simplify)
6. 🟡 E2E tests (nice to have)
7. 🟡 DevCommentary port (low priority)

---

*Document created: January 2026*
*UV7 Crew: Dizee, Zee, Tori, ZeeRah, Ronnie, Kai, Echo*
*Reviewed by: DiZee (AI Assistant)*
