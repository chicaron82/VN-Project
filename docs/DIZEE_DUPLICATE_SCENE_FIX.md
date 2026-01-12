# Duplicate Scene ID Fix - Implementation Report

**Date:** 2026-01-12
**Engineer:** DiZee (UV7 Crew)
**Issue:** 46 duplicate scene IDs across 12 route files causing console warnings

---

## Problem Statement

The V2 migration revealed **46 duplicate scene IDs** across route JSON files, causing "Scene already registered. Overwriting" warnings at startup. While the game functioned, this created potential bugs for:
- Save/load systems (wrong scene restored)
- Scene jumping/navigation
- Debugging and maintenance

## Root Causes

### 1. **Ronnie Route Duplication (31 scenes)**
- `ronnie.json` and `ronnie_act1.json` contained identical prologue/Act 1 scenes
- Legacy from V1 structure where consolidated files existed alongside split acts

### 2. **Tori Act Collisions (11 scenes)**
- Generic IDs like `beat2`, `beat3`, `beat4`, etc. used in both Act 2 and Act 3
- No filename prefixing strategy

### 3. **Cross-Route Endings (4 scenes)**
- Shared ending scenes between Ronnie and Tori routes
- `digitalForever_together`, `trueRoute_transfer`, etc.

## Solution Implemented

### Automated Fix Script
**File:** `scripts/fix-duplicate-scenes.cjs`

**Strategy:**
1. **Backup First:** All route files backed up to `src/content/routes-backup/`
2. **Prefix Renaming:** Scene IDs prefixed with filename (e.g., `beat2` → `tori_act2_beat2`)
3. **Reference Updates:** All `nextSceneId` and choice references updated automatically
4. **Verification:** Post-fix validation ensures 0 duplicates remain

### Changes Applied
- **Files Modified:** 12 route JSON files
- **Scene IDs Renamed:** 93 duplicates → unique IDs
- **Total Changes:** 201 (IDs + references)
- **Result:** 469 total scenes, 469 unique IDs ✅

## Examples of Renames

### Before:
```json
// tori_act2.json
{"id": "beat2", "nextSceneId": "beat3"}

// tori_act3.json
{"id": "beat2", "nextSceneId": "beat3"}
```

### After:
```json
// tori_act2.json
{"id": "tori_act2_beat2", "nextSceneId": "tori_act2_beat3"}

// tori_act3.json
{"id": "tori_act3_beat2", "nextSceneId": "tori_act3_beat3"}
```

## Code Changes Required

### main.ts (Line 504)
**Before:**
```typescript
const firstSceneId = route === 'ronnie' ? 'prologueScene4' : 'scene1_coffee';
```

**After:**
```typescript
const firstSceneId = route === 'ronnie' ? 'ronnie_act1_prologueScene4' : 'scene1_coffee';
```

## Verification

### Console Output
```
📊 Scene ID Analysis
Total scenes: 469
Unique IDs: 469

✅ No duplicate scene IDs found!
```

### Testing Checklist
- [x] Prologue plays correctly
- [x] Ronnie route starts with correct scene
- [x] Tori route starts with correct scene
- [x] No console warnings on startup
- [x] All 469 scenes have unique IDs

## Rollback Procedure

If issues arise, restore original files:
```bash
cp src/content/routes-backup/* src/content/routes/
```

Or use git:
```bash
git checkout src/content/routes/*.json
```

## Future Prevention

### Naming Convention
Going forward, use this pattern for all new scenes:
```
{filename}_{act}_{scene_descriptor}

Examples:
- ronnie_act2_hospital_arrival
- tori_act3_echo_confrontation
- shared_ending_true_route_final
```

### Pre-commit Hook (Recommended)
Add `scripts/find-duplicate-scenes.cjs` to CI/PR checks to catch duplicates before merge.

---

## Summary

✅ **Issue Resolved:** All 46 duplicate scene IDs eliminated
✅ **Data Integrity:** All references updated correctly
✅ **Backup Created:** Original files preserved in `routes-backup/`
✅ **Verification Complete:** 469 scenes, 469 unique IDs

**Impact:** Eliminates console warnings, prevents future save/load bugs, improves maintainability.

---

*This fix was part of the V2 TypeScript migration cleanup.*
*See also: DIZEE_INTERNAL_BUBBLES_IMPLEMENTATION.md*
