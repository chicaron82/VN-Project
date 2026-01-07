# ZeeRah's Tasks - The Chaos Optimizer

> "Git'r done. Every. Single. Time."

## Phase 1 Tasks

### Task 1: EventBus Tests
**Priority**: High
**Status**: Pending

Write comprehensive tests for the EventBus system.

**Deliverables**:
- `tests/EventBus.test.ts` - Full test coverage for EventBus

**Test Cases Needed**:
- Subscribe to event
- Unsubscribe from event
- Emit event with data
- Multiple subscribers to same event
- Emit with no subscribers (no crash)
- Wildcard subscriptions (if supported)
- Memory cleanup on unsubscribe

**Requirements**:
- Use Vitest
- Aim for edge cases (that's your specialty!)
- Make them chaos-proof

---

### Task 2: StateManager Tests
**Priority**: High
**Status**: Pending

Write comprehensive tests for the StateManager/Store.

**Deliverables**:
- `tests/StateManager.test.ts` - Full test coverage

**Test Cases Needed**:
- Get initial state
- Update state
- Subscribe to state changes
- Unsubscribe from state changes
- Nested state updates
- State reset

---

## Notes

Break stuff! Find the edge cases! That's what you're here for.

Place completed work in this folder. DiZee will review and integrate.
