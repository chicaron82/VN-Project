# Belle's Tasks - The Fresh Eyes

> "Let me explain this clearly."

## Phase 1 Tasks

### Task 1: ARCHITECTURE.md
**Priority**: High
**Status**: Pending

Write the architecture documentation for V2.

**Deliverables**:
- `docs/ARCHITECTURE.md` - System overview and design decisions

**Sections Needed**:
1. **Overview** - What is UV7 V2?
2. **Folder Structure** - Explain each folder's purpose
3. **Core Systems** - EventBus, StateManager, GameEngine
4. **Data Flow** - How state moves through the app
5. **Design Decisions** - Why JSON for content? Why Zustand?
6. **Patterns Used** - Observer, pub/sub, etc.

**Requirements**:
- Clear enough for a new dev to understand
- Include diagrams if helpful (ASCII or mermaid)
- Reference the rebuild plan for context

---

### Task 2: CONTRIBUTING.md
**Priority**: Medium
**Status**: Pending

Write the contribution guide for V2.

**Deliverables**:
- `docs/CONTRIBUTING.md` - How to contribute to V2

**Sections Needed**:
1. **Adding a New Scene** - Step by step
2. **Adding a New System** - Where it goes, how to wire it
3. **Code Style** - TypeScript conventions
4. **Testing** - How to write and run tests
5. **PR Process** - What a good PR looks like

**Target**: "New dev can add a scene in <10 minutes using docs only" (Tori's metric!)

---

## Notes

You see things fresh. Make the docs clear for everyone.

Place completed work in this folder. DiZee will review and integrate.
