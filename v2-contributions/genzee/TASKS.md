# Genzee's Tasks - The Reality Breaker

> "Question everything. Break the pattern."

## Phase 1 Tasks

### Task 1: Edge Case Test Scenarios
**Priority**: Medium
**Status**: Pending

Document edge cases that need testing across all systems.

**Deliverables**:
- `docs/EDGE-CASES.md` - Comprehensive edge case list

**Systems to Analyze**:
1. **Save/Load** - What breaks saves? Corrupted data? Version mismatches?
2. **Scene Navigation** - Invalid scene IDs? Circular references? Missing scenes?
3. **Tether System** - Below 0? Above 100? Decay during pause?
4. **Choices** - All conditions false? No valid next scene?
5. **Bootstrap Tracker** - 999+ attempts? Corrupted timeline data?
6. **Secret Codes** - Invalid codes? Codes during wrong state?

**Format**:
```
## System: [Name]
### Edge Case: [Description]
- **Trigger**: How to cause it
- **Expected**: What should happen
- **Risk**: What could go wrong
```

---

### Task 2: Break Testing Plan
**Priority**: Medium
**Status**: Pending

Create a plan for intentionally breaking V2 during development.

**Deliverables**:
- `docs/BREAK-TESTING.md` - How to stress test V2

**Include**:
- Rapid state changes
- Memory stress tests
- Invalid input handling
- Concurrent operations
- Browser edge cases (refresh during save, etc.)

---

## Notes

Your job is to find what breaks BEFORE users do. Question everything!

Place completed work in this folder. DiZee will review and integrate.
