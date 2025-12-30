# TypeScript/JavaScript Dual Structure Workflow

## Overview

This codebase maintains **both** TypeScript (`.ts`) and JavaScript (`.js`) versions of certain files for compatibility and gradual migration purposes.

## Editing Guidelines

### 1. Check for Both Versions

Before editing a file, check if both `.ts` and `.js` versions exist:

```bash
# Example: Check for collectibles-manager
ls system/collectibles-manager.*
# Output: collectibles-manager.js  collectibles-manager.ts
```

### 2. Which File to Edit?

#### If ONLY `.ts` exists

- ✅ Edit the `.ts` file
- TypeScript will compile to `.js` automatically

#### If ONLY `.js` exists

- ✅ Edit the `.js` file
- No TypeScript version needed

#### If BOTH `.ts` and `.js` exist

- ⚠️ **Edit BOTH files** to keep them in sync
- `.ts` is the source of truth
- `.js` is maintained for compatibility
- Changes must be identical in both

### 3. Files with Dual Structure

Current files that require dual updates:

- `system/collectibles-manager.ts` ↔ `system/collectibles-manager.js`
- `system/tether-system.ts` ↔ `system/tether-system.js`
- `system/game-engine.ts` ↔ `system/game-engine.js`
- `system/save-manager.ts` ↔ `system/save-manager.js`
- (Add more as discovered)

### 4. Pre-Commit Checklist

When editing system files:

- [ ] Did I check if a `.ts` version exists?
- [ ] If both exist, did I update both files?
- [ ] Are the changes functionally identical?
- [ ] Did I test the changes?

## Examples

### ❌ Wrong (only updated .js)

```javascript
// Only edited collectibles-manager.js
this.game.statusNotification.showNote(sender, note.title);

// Forgot to update collectibles-manager.ts - now out of sync!
```

### ✅ Correct (updated both)

```javascript
// collectibles-manager.js
this.game.statusNotification.showNote(sender, note.title);

// collectibles-manager.ts (same change)
this.game.statusNotification.showNote(sender, note.title);
```

## Why This Structure?

1. **Gradual Migration**: Migrating from JS to TS incrementally
2. **Compatibility**: Some systems still reference `.js` files
3. **Type Safety**: `.ts` provides better IDE support and error checking
4. **Build Process**: Eventually `.ts` will be the only source

## Future Goal

Eventually eliminate dual structure by:

1. Complete migration to TypeScript
2. Configure build process to auto-compile `.ts` → `.js`
3. Remove manual `.js` versions
4. Use only TypeScript as source of truth

---

**Last Updated**: 2025-12-30
**Maintainer**: Development Team
