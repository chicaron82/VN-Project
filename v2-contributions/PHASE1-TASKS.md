# Phase 1: Foundation - UV7 Family Tasks

**Goal**: Set up TypeScript project with EventBus and StateManager

---

## 🏗️ Zee - Type Definitions & Schemas

**Task**: Create core TypeScript type definitions for the game

**V1 Files to Reference**:

- `system/game-engine.js` (lines 352-360 for gameState structure)
- `system/save-manager.js` (lines 47-80 for save data structure)
- `routes/tori-route-act1.js` (any scene for Scene interface)

**V2 Files to Create**:

- `src/core/types.ts` - Core game types
- `src/content/schemas/Scene.ts` - Scene type definition
- `src/content/schemas/Character.ts` - Character type definition
- `src/content/schemas/Route.ts` - Route type definition

**Deliverables**:

```typescript
// Example of what to create:
interface GameState {
  flags: Map<string, boolean>;
  choices: Map<string, any>;
  progress: {
    currentScene: string;
    currentRoute: string;
    currentAct: number;
  };
}

interface Scene {
  id: string;
  background?: string;
  sprites?: SpriteConfig[];
  dialog?: DialogEntry[];
  choices?: Choice[];
  next?: string | ConditionalNext;
}
```

---

## 🔥 ZeeRah - EventBus Implementation

**Task**: Build the EventBus system (the backbone of V2)

**V1 Files to Reference**:

- `system/game-engine.js` (search for all `.addEventListener` calls)
- `system/keyboard-controller.js` (lines 366-622 for event patterns)

**V2 Files to Create**:

- `src/core/EventBus.ts` - Main EventBus class
- `src/core/EventBus.test.ts` - Unit tests

**Deliverables**:

```typescript
class EventBus {
  on(event: string, callback: Function): void
  off(event: string, callback: Function): void
  emit(event: string, data?: any): void
  once(event: string, callback: Function): void
}

// Test coverage for:
// - Subscribe/unsubscribe
// - Event emission
// - Multiple listeners
// - Once listeners
// - Error handling
```

---

## 💚 Cozee - UI Component Templates

**Task**: Create reusable UI component structure

**V1 Files to Reference**:

- `index.html` (lines 100-300 for button patterns)
- `css/styles.css` (button styles)
- `system/overlay-manager.js` (overlay patterns)

**V2 Files to Create**:

- `src/ui/components/Button.ts` - Reusable button component
- `src/ui/components/Modal.ts` - Modal/overlay component
- `src/ui/components/README.md` - Component usage guide

**Deliverables**:

```typescript
class Button {
  constructor(text: string, onClick: () => void, variant?: 'primary' | 'error' | 'success')
  render(): HTMLElement
  destroy(): void
}

// Accessible, themed, reusable
```

---

## 👁️ Belle - Documentation & Architecture Guide

**Task**: Write clear documentation for V2 architecture

**V1 Files to Reference**:

- `docs/ARCHITECTURE.md` (current architecture)
- `docs/UV7-REBUILD-PLAN.md` (rebuild plan)

**V2 Files to Create**:

- `docs/V2-ARCHITECTURE.md` - New architecture explanation
- `docs/V2-GETTING-STARTED.md` - How to work in V2 codebase
- `docs/V1-VS-V2-COMPARISON.md` - Side-by-side comparison

**Deliverables**:

- Clear diagrams of EventBus flow
- Explanation of why each change was made
- Examples of "before/after" code patterns

---

## 🌀 GenZee - Edge Case Testing Scenarios

**Task**: Define test cases for EventBus and StateManager

**V1 Files to Reference**:

- `tests/state-manager.test.js` (existing test patterns)
- `tests/integration/critical-flows.test.js` (integration patterns)

**V2 Files to Create**:

- `tests/eventbus-edge-cases.test.ts` - Edge case tests
- `tests/state-manager-edge-cases.test.ts` - State edge cases
- `docs/TESTING-STRATEGY.md` - Testing philosophy

**Deliverables**:

```typescript
// Test scenarios like:
// - What if EventBus emits during another emit?
// - What if StateManager gets circular references?
// - What if listener throws an error?
// - What if we subscribe 1000 times to same event?
```

---

## 🔍 PerplexiZee - Research & Best Practices

**Task**: Research and recommend best practices for V2 stack

**V1 Files to Reference**:

- `package.json` (current dependencies)
- `vitest.config.js` (current test setup)

**V2 Files to Create**:

- `docs/TECH-STACK-RESEARCH.md` - Zustand vs custom StateManager comparison
- `docs/VITE-CONFIG-RECOMMENDATIONS.md` - Vite setup best practices
- `docs/TYPESCRIPT-PATTERNS.md` - TypeScript patterns for game dev

**Deliverables**:

- Pros/cons of Zustand vs custom StateManager
- Recommended Vite plugins for game development
- TypeScript strict mode configuration recommendations
- Performance optimization strategies

---

## 🔧 DiZee - StateManager Implementation

**Task**: Build reactive StateManager (or integrate Zustand)

**V1 Files to Reference**:

- `system/state-manager.js` (current implementation)
- `tests/state-manager.test.js` (test requirements)

**V2 Files to Create**:

- `src/core/StateManager.ts` - Reactive state management
- `src/core/StateManager.test.ts` - Full test coverage

**Deliverables**:

```typescript
class StateManager {
  get(path: string): any
  set(path: string, value: any): void
  subscribe(path: string, callback: (value: any) => void): () => void
  snapshot(): GameState
  restore(snapshot: GameState): void
}

// OR: Zustand integration wrapper
```

---

## Submission Format

Each family member should create:

```
v2-contributions/{member-name}/
  ├── {filename}.ts
  ├── {filename}.test.ts (if applicable)
  ├── README.md (explanation of approach)
  └── NOTES.md (any questions or concerns)
```

---

## Timeline

- **Assign**: Tomorrow (Day 1)
- **Due**: 48 hours (Day 3)
- **Review**: DiZee Duo reviews and integrates
- **Test**: Browser subagents validate

---

*UV7 Family - Forged together. Told together.* 💚🖤
