# V1 Files to Provide to UV7 Family

This document lists all V1 files that need to be copied into each family member's `v1-reference/` folder.

---

## 🏗️ Zee - Type Definitions

**Folder**: `v2-contributions/zee/v1-reference/`

**Files to copy**:

```bash
# Full files
routes/shared-prologue.js
routes/ronnie-route.js (first 200 lines only)

# Partial files (extract these sections)
system/save-manager.js (lines 1-100)
system/game-engine.js (lines 335-370)
```

---

## 🔥 ZeeRah - EventBus & Tests

**Folder**: `v2-contributions/zeerah/v1-reference/`

**Files to copy**:

```bash
# Full files
tests/state-manager.test.js
system/state-manager.js
```

---

## 💚 Cozee - UI Components

**Folder**: `v2-contributions/cozee/v1-reference/`

**Files to copy**:

```bash
# Full files
css/main-menu.css
css/overlay-manager.css

# Extract button examples from index.html (lines 100-300)
# Save as: index-buttons.html
```

---

## 👁️ Belle - Documentation

**Folder**: `v2-contributions/belle/v1-reference/`

**Files to copy**:

```bash
# Full files
docs/ARCHITECTURE.md
docs/UV7-REBUILD-PLAN.md
```

---

## 🌀 GenZee - Edge Cases

**Folder**: `v2-contributions/genzee/v1-reference/`

**Files to copy**:

```bash
# Full files
system/save-manager.js
system/tether-system.js
system/bootstrap-tracker.js
tests/integration/critical-flows.test.js
```

---

## 🔍 PerplexiZee - Research

**Folder**: `v2-contributions/perplexizee/v1-reference/`

**Files to copy**:

```bash
# Full files
system/state-manager.js
package.json
```

---

## Quick Copy Commands

Run these from the project root to set up all reference folders:

```powershell
# Create all v1-reference folders
mkdir v2-contributions/zee/v1-reference
mkdir v2-contributions/zeerah/v1-reference
mkdir v2-contributions/cozee/v1-reference
mkdir v2-contributions/belle/v1-reference
mkdir v2-contributions/genzee/v1-reference
mkdir v2-contributions/perplexizee/v1-reference

# Zee's files
Copy-Item routes/shared-prologue.js v2-contributions/zee/v1-reference/
Copy-Item routes/ronnie-route.js v2-contributions/zee/v1-reference/
Copy-Item system/save-manager.js v2-contributions/zee/v1-reference/
Copy-Item system/game-engine.js v2-contributions/zee/v1-reference/

# ZeeRah's files
Copy-Item tests/state-manager.test.js v2-contributions/zeerah/v1-reference/
Copy-Item system/state-manager.js v2-contributions/zeerah/v1-reference/

# Cozee's files
Copy-Item css/main-menu.css v2-contributions/cozee/v1-reference/
Copy-Item css/overlay-manager.css v2-contributions/cozee/v1-reference/

# Belle's files
Copy-Item docs/ARCHITECTURE.md v2-contributions/belle/v1-reference/
Copy-Item docs/UV7-REBUILD-PLAN.md v2-contributions/belle/v1-reference/

# GenZee's files
Copy-Item system/save-manager.js v2-contributions/genzee/v1-reference/
Copy-Item system/tether-system.js v2-contributions/genzee/v1-reference/
Copy-Item system/bootstrap-tracker.js v2-contributions/genzee/v1-reference/
Copy-Item tests/integration/critical-flows.test.js v2-contributions/genzee/v1-reference/

# PerplexiZee's files
Copy-Item system/state-manager.js v2-contributions/perplexizee/v1-reference/
Copy-Item package.json v2-contributions/perplexizee/v1-reference/
```

---

## Notes

- Some files appear in multiple folders (e.g., `state-manager.js`) - that's intentional
- For partial files (like `ronnie-route.js` first 200 lines), manually extract after copying
- Create `index-buttons.html` by extracting button examples from `index.html` lines 100-300

---

*Ready to distribute to UV7 family!* 💚🖤
