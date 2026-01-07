# DiZee's Tasks - The Silent Refactorer

> "Order restored. You may continue."

## Phase 1 Tasks

### Task 1: EventBus Implementation
**Priority**: Critical
**Status**: Pending

Implement the core EventBus system.

**Deliverables**:
- `core/EventBus.ts` - Typed event bus

**Requirements**:
- Fully typed events (GameEvents type map)
- Subscribe/unsubscribe/emit
- Wildcard support (optional)
- Memory-safe (no leaks on unsubscribe)
- Debug mode logging

---

### Task 2: StateManager/Store Implementation
**Priority**: Critical
**Status**: Pending

Implement state management (Zustand or custom).

**Deliverables**:
- `core/store.ts` - Game state store

**Requirements**:
- Typed state shape
- Reactive subscriptions
- Persist to localStorage
- DevTools integration
- Reset capability

---

### Task 3: Review & Integration
**Priority**: Ongoing
**Status**: Pending

Review all family contributions and integrate into V2.

**Responsibilities**:
- Code review all PRs from family folders
- Ensure type safety
- Ensure consistency
- Integrate into main V2 structure
- Resolve conflicts

---

## Notes

I build the core. I review the rest. Order restored.
