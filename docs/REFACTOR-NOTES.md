# Shade Template Refactor - Session Notes

## Problem

Shade HTML structure was duplicated in multiple files:

1. Root `index.html` (shell version)
2. `shell/index.html` (unused - caused confusion)
3. `showcase/index.html` (standalone version)

Any change to shade structure required manually updating all three files. Violates DRY principle.

## Solution Implemented

### Created Single Source of Truth

**File**: [`shell/ShadeTemplate.js`](shell/ShadeTemplate.js)

- Exports `generateShadeContent({ isShell })` function
- Returns HTML string for shade structure
- Supports both shell and standalone modes
- ~150 lines of clean, maintainable code

### Updated Shell to Use Template

**File**: [`shell/UV7Shell.js`](shell/UV7Shell.js)

- Added `import { generateShadeContent } from './ShadeTemplate.js'`
- Added `renderShade()` method (line 404)
- Called during `init()` after `cacheElements()`
- Dynamically populates shade on startup

### Simplified HTML Files

**File**: [`index.html`](index.html) (root)

- Removed all static shade HTML (79 lines → 3 lines)
- Now just empty container: `<div id="uv7-shade">`
- Content populated at runtime by JavaScript

**File**: `shell/index.html`

- **DELETED** - was completely unused, causing confusion

## Results

### File Size Improvements

- `index.html`: 14.49 kB → 11.31 kB (-22% smaller!)
- `main.js`: 27.07 kB → 30.93 kB (+14% - includes template code)
- Net: Cleaner separation of concerns

### Benefits

✅ Single source of truth (DRY principle)
✅ Type-safe with JSDoc comments
✅ Easier to maintain and modify
✅ Smaller HTML file size
✅ Can be shared by multiple contexts
✅ No more manual syncing between files

## How to Modify Shade Now

**Before** (old way - error-prone):

1. Edit root `index.html` shade HTML
2. Copy changes to `shell/index.html`
3. Copy changes to `showcase/index.html`
4. Hope you didn't miss anything
5. Rebuild and test

**After** (new way - single source):

1. Edit `shell/ShadeTemplate.js`
2. Run `npm run build`
3. Done!

## Remaining Work

### TODO: Refactor Showcase

Standalone showcase (`showcase/index.html` + `NotificationShade.ts`) still has its own shade rendering in TypeScript. Should be refactored to import and use `ShadeTemplate.js` for consistency.

### Future Enhancement: Web Components

Could further improve by creating a `<uv7-shade>` custom element with full encapsulation and shadow DOM. But current solution is already a massive improvement.

## Files Modified

- ✅ Created: `shell/ShadeTemplate.js` (new)
- ✅ Updated: `shell/UV7Shell.js` (added import, renderShade method, init call)
- ✅ Updated: `index.html` (simplified to empty container)
- ✅ Deleted: `shell/index.html` (unused file removed)
- ✅ Created: `ARCHITECTURE.md` (documentation)
- ✅ Created: `REFACTOR-NOTES.md` (this file)

## Commit Message Template

```text
refactor(shell): implement single source of truth for shade structure

PROBLEM:
- Shade HTML duplicated across 3 files (index.html, shell/index.html, showcase/index.html)
- Manual syncing required for any shade changes
- shell/index.html was unused and causing confusion

SOLUTION:
- Created shell/ShadeTemplate.js as single source of truth
- UV7Shell.js dynamically renders shade from template on init
- Removed static HTML from index.html (14.49 kB → 11.31 kB)
- Deleted unused shell/index.html

BENEFITS:
- DRY principle (no more duplication)
- Easier maintenance (edit one file)
- Type-safe with JSDoc
- Smaller HTML files

FILES:
+ shell/ShadeTemplate.js (new single source of truth)
+ ARCHITECTURE.md (architecture documentation)
+ REFACTOR-NOTES.md (refactor notes)
M shell/UV7Shell.js (added renderShade method)
M index.html (simplified to empty container)
D shell/index.html (removed unused file)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

> *Session: 2026-01-27*
> *Good coding practices afterall. 💚🔥💀*
