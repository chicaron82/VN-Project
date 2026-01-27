# Single Source of Truth Opportunities

Analysis of potential DRY violations and refactoring opportunities in the UV7 codebase.

## ✅ Already Fixed
- **Shade HTML Structure** - Fixed in Phase 80 (2026-01-27)
  - Created `shell/ShadeTemplate.js` as single source
  - Eliminated duplication across 3 files

## 🔴 High Priority Opportunities

### 1. Quick Action Buttons Definition
**Issue**: Quick action buttons (launch-v1, launch-v2, view-showcase, launch-torigatchi) are defined in multiple places:

**Locations**:
- `index.html` - Sidebar (4 buttons)
- `shell/ShadeTemplate.js` - Shade Quick Launch (4 buttons)
- `shell/UV7Shell.js` - Event listeners (4 handlers)
- `showcase/index.html` - Sidebar variant (2 buttons)
- `shell/apps/ShowcaseApp.js` - Custom sidebar (partial)

**Suggested Fix**:
```javascript
// shell/QuickActions.js
export const QUICK_ACTIONS = [
    { id: 'launch-v1', icon: '🎮', label: 'V1 Game', route: '/v1' },
    { id: 'launch-v2', icon: '⚡', label: 'V2 Engine', route: '/v2' },
    { id: 'view-showcase', icon: '📖', label: 'Showcase', route: '/showcase' },
    { id: 'launch-torigatchi', icon: '💖', label: 'Tori-gatchi', route: '/torigatchi' }
];

export function generateQuickActionButtons(actions = QUICK_ACTIONS) {
    return actions.map(action => `
        <button class="quick-action" data-action="${action.id}">
            <span class="quick-action-icon">${action.icon}</span>
            <span class="quick-action-label">${action.label}</span>
        </button>
    `).join('');
}
```

**Impact**:
- Removes duplication across 6 files
- Makes adding new apps easier
- Centralized action definitions

### 2. Default Sidebar Structure
**Issue**: Default sidebar HTML is duplicated in:
- `index.html` - Shell default sidebar
- `showcase/index.html` - Standalone sidebar

**Current State**:
- Shell sidebar can be overridden by apps via `getSidebarConfig()`
- But the DEFAULT sidebar is still hardcoded in HTML

**Suggested Fix**:
```javascript
// shell/SidebarTemplate.js
export function generateDefaultSidebar() {
    return `
        <div class="sidebar-header">
            <span class="sidebar-title">🏠 UV7 OS</span>
        </div>
        <div class="sidebar-content">
            ${generateQuickActionButtons()}
        </div>
    `;
}
```

**Impact**:
- Consistent default sidebar across contexts
- Can be dynamically rendered like shade

## 🟡 Medium Priority Opportunities

### 3. Dead Backup File
**Issue**: `index.landing-backup.html` (29 KB) is an old backup from before landing page was converted to an app.

**Evidence**:
- Not referenced anywhere in codebase
- Contains outdated landing page HTML
- Header says "UV7 PROJECT HUB - LANDING PAGE" (pre-shell architecture)

**Suggested Fix**: Delete the file
```bash
rm index.landing-backup.html
```

**Impact**:
- Cleaner codebase
- No confusion about which index.html is canonical

### 4. CSS Organization
**Current State**:
- `shell/shell.css` (444 lines) - Shell-specific styles
- `showcase/css/sidebar.css` (182 lines) - Sidebar styles
- `showcase/css/shade.css` (212 lines) - Shade styles

**Observation**:
- Shell imports showcase CSS files
- This is actually fine - showcase CSS is being reused
- NOT a violation of DRY

**Suggested Enhancement** (optional):
- Move shared UI CSS to `showcase/css/uv7-system.css` (already exists)
- Keep shell/shell.css only for shell-specific overrides

## 🟢 Low Priority / Not Issues

### 5. App Route Definitions
**Current State**: Apps are registered in `UV7Shell.js`:
```javascript
this.appRegistry.set('landing', () => import('./apps/LandingApp.js'));
this.appRegistry.set('v1', () => import('./apps/V1App.js'));
// etc.
```

**Analysis**: This is GOOD - single source of truth already exists
- Route → App mapping centralized in one place
- Lazy loading via dynamic imports

### 6. Status Bar Structure
**Current State**: Status bar HTML only in `index.html`
**Analysis**: Only one copy exists - not duplicated

### 7. Context-Aware Sidebar
**Current State**: Apps can override sidebar via `getSidebarConfig()`
**Analysis**: This is the INTENDED architecture
- Default sidebar in HTML
- Apps provide custom sidebars
- Not duplication, it's polymorphism

## Summary

### Recommended Actions
1. ✅ **High Priority**: Extract Quick Actions to shared template
2. ✅ **High Priority**: Template-ize default sidebar
3. ✅ **Medium Priority**: Delete `index.landing-backup.html`
4. ⏭️ **Low Priority**: Consider CSS consolidation (optional)

### Impact Estimate
- **Quick Actions Refactor**: ~80 lines eliminated across 6 files
- **Sidebar Template**: ~50 lines eliminated across 2 files
- **Delete Backup**: -29 KB dead code
- **Total**: ~130 lines cleaner + better maintainability

---

*Analysis Date: 2026-01-27*
*"Good coding practices afterall. 💚🔥💀"*
