# UV7 Architecture Notes

## HTML File Structure

### Current State ✅ FIXED!
- **`index.html`** (root) - UV7 Shell entry point
  - Built by Vite to `dist/index.html`
  - Contains only shade *container* - content is dynamic
  - Contains status bar, sidebar, etc.

- **`showcase/index.html`** - Standalone showcase entry point
  - Has its own shade structure (uses TypeScript, not shared template yet)
  - Runs independently without shell
  - ⚠️ TODO: Refactor to use ShadeTemplate.js

- **`shell/index.html`** - ~~DELETED~~ (was unused, caused confusion)

### ✅ SOLUTION IMPLEMENTED: Dynamic Shade Rendering

**Single Source of Truth**: [`shell/ShadeTemplate.js`](shell/ShadeTemplate.js)
- Exports `generateShadeContent()` function
- Returns HTML string for shade structure
- Used by `UV7Shell.js` on initialization
- Can be shared across shell and showcase

**How it works:**
1. Root `index.html` has empty `<div id="uv7-shade">` container
2. `UV7Shell.js` imports `generateShadeContent()` from `ShadeTemplate.js`
3. On init, calls `renderShade()` which populates container dynamically
4. No more duplicate HTML in index.html files!

**Benefits:**
- ✅ Single source of truth (DRY principle)
- ✅ Type-safe with JSDoc
- ✅ Easier to maintain
- ✅ Smaller HTML file size (14.49 kB → 11.31 kB)
- ✅ Can be shared by multiple contexts

## Remaining Work (TODO)

### Refactor Showcase to Use ShadeTemplate
Currently standalone showcase (`showcase/index.html` + `NotificationShade.ts`) still has its own shade rendering. Should be refactored to import and use `ShadeTemplate.js` for consistency.

## How to Modify Shade Structure

Now it's easy! Just edit [`shell/ShadeTemplate.js`](shell/ShadeTemplate.js):

1. Edit `generateShadeContent()` function in `shell/ShadeTemplate.js`
2. Run `npm run build`
3. Done! Changes apply everywhere the template is used

## Theme System
- **Source of truth**: `localStorage` keys `uv7-theme-auto` and `uv7-theme`
- **Shell → Iframe communication**: `postMessage` API
- **JavaScript logic**: `UV7Shell.js` `initSettings()` method (lines 99-246)
- **CSS**: `showcase/css/shade.css` and `showcase/css/theme-toggle.css`

## Files Modified During Theme System Implementation
- `index.html` - Added two-toggle shade structure
- `showcase/index.html` - Added two-toggle shade structure (standalone)
- `shell/UV7Shell.js` - Theme toggle logic with postMessage
- `showcase/ts/components/NotificationShade.ts` - postMessage listener
- `showcase/ts/main.ts` - initContentFeatures for toast
- `showcase/css/theme-toggle.css` - Force light/dark mode overrides
- ~~`shell/index.html`~~ - DELETED (was unused)
- ~~`shell/apps/ShowcaseApp.js`~~ - Removed duplicate AI Crew Settings button

---

*Last updated: 2026-01-27*
*848 is sacred. 💚🔥💀*
