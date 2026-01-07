# Zee's Tasks - The Architect

> "Structure first. Chaos later."

## Phase 1 Tasks

### Task 1: Core Type Definitions
**Priority**: High
**Status**: Pending

Create TypeScript interfaces for the V2 rebuild. Reference V1 structure in `routes/` folder.

**Deliverables**:
- `types/Scene.ts` - Scene interface with all properties
- `types/Character.ts` - Character interface
- `types/Route.ts` - Route/Act interface
- `types/GameState.ts` - Full game state shape

**Requirements**:
- Strict TypeScript (no `any` types)
- Document each property with JSDoc comments
- Consider nullable vs optional carefully
- Reference V1 patterns but improve where needed

**V1 Reference Files**:
- `routes/shared-prologue.js`
- `routes/ronnie-route.js`
- `system/save-manager.js` (for state shape)

---

### Task 2: JSON Schema for Scenes
**Priority**: High
**Status**: Pending

Create JSON Schema for validating scene content files.

**Deliverables**:
- `schemas/scene.schema.json` - JSON Schema for scene validation

**Requirements**:
- Validate all required fields
- Provide clear error messages
- Match the TypeScript interfaces from Task 1

---

## Notes

Place completed work in this folder. DiZee will review and integrate.
