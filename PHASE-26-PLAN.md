# Phase 26: StatusBar Unification - BOUGIE EDITION 💎

**Status:** PLANNING
**Author:** Claude Opus 4.5
**Date:** January 16, 2026

---

## Overview

Unify the three separate StatusBar implementations (V1, V2, Showcase) into a single, context-aware, premium component that adapts based on environment.

### Current State

| Context | File | Lines | Features |
|---------|------|-------|----------|
| V1 Game | `system/notification-shade-controller.js` | 62K | Loop, route, notes, tether, mail |
| V2 Game | `src/ui/components/StatusBar.ts` | 927 | Same + App Switcher, mini-preview |
| Showcase | `showcase/index.html` + `uv7-os.js` | ~100 | Phase display, settings toggle |

### Target State

One unified `StatusBar` component with:
- Context detection (game vs showcase)
- Feature flags for conditional rendering
- Shared App Switcher across all contexts
- Premium animations and interactions
- Platform-native feel

---

## Phase Breakdown

### Phase 26a: Core Unification (Foundation)
**Priority:** HIGH
**Scope:** Structural changes

#### Tasks
1. **Extend StatusBarConfig interface**
   ```typescript
   interface StatusBarConfig {
       context: 'game' | 'showcase';
       loopVersion?: string;
       showcasePhase?: number;
       features: {
           appSwitcher: boolean;
           loopCounter: boolean;
           tetherDisplay: boolean;
           notesDisplay: boolean;
           mailIcon: boolean;
           phaseDisplay: boolean;      // Showcase only
           settingsToggle: boolean;    // Showcase only
           breadcrumbs: boolean;       // NEW
       };
   }
   ```

2. **Refactor createDOM() for conditional rendering**
   - Game mode: Logo | Loop | Route | Notes | Tether | Mail
   - Showcase mode: Logo | Context | Phase Title | Settings

3. **Context detection utility**
   ```typescript
   function detectContext(): 'game' | 'showcase' {
       return window.location.pathname.includes('showcase') ? 'showcase' : 'game';
   }
   ```

4. **Update showcase to use unified component**
   - Import StatusBar from V2
   - Remove inline status bar HTML
   - Configure with showcase-specific options

5. **Shared App Switcher state**
   - App Switcher shows all apps regardless of context
   - "Showcase" becomes an app in the switcher
   - Cross-context navigation works seamlessly

#### Files Modified
- `src/ui/components/StatusBar.ts` - Core changes
- `showcase/index.html` - Remove inline status bar
- `showcase/uv7-os.js` - Use unified StatusBar
- `src/ui/components/UV7AppSwitcher.ts` - Add showcase app

#### Success Criteria
- [x] Single StatusBar class handles both contexts
- [x] Showcase uses TypeScript StatusBar
- [x] App Switcher appears in both contexts
- [x] No visual regression in either context

---

### Phase 26b: Premium Interactions (Bougie Layer)
**Priority:** MEDIUM
**Scope:** UX enhancements

#### Tasks
1. **Smooth context transitions**
   - Morph animation when switching contexts
   - Fade out → reconfigure → fade in
   - Optional particle effects

2. **Gesture support**
   - Swipe down on status bar → Quick Actions
   - Long-press logo → App Switcher (with haptic)
   - Double-tap empty space → Screenshot mode
   - Pinch → Collapse to minimal mode

3. **Context menu (right-click / long-press)**
   - Loop counter: Jump to loop, reset, view history
   - Route indicator: Switch route, return to menu
   - App Switcher: Refresh all, clear saves, dev tools

4. **Breadcrumb navigation**
   - Game: `v.848 → Ronnie → Act 2 → Scene 5`
   - Showcase: `Showcase → Phase 25 → DirectorsCutController`
   - Each part is clickable

5. **Adaptive color temperature**
   - Ronnie route: Warm pink tint
   - Tori route: Cyan tint
   - Showcase Story mode: Green tint
   - Showcase Dev mode: Orange tint

#### Files Modified
- `src/ui/components/StatusBar.ts` - Gesture handlers
- `src/ui/styles/status-bar.css` - Transitions, tints
- `src/core/SwipeHandler.ts` - Status bar gestures

#### Success Criteria
- [ ] All gestures work on mobile
- [ ] Context menu appears on right-click/long-press
- [ ] Breadcrumbs update dynamically
- [ ] Color tints are subtle but noticeable

---

### Phase 26c: App Switcher Enhancement
**Priority:** MEDIUM
**Scope:** Cross-context integration

#### Tasks
1. **Live preview thumbnails**
   - Canvas snapshot of each app
   - Update on focus/blur
   - Lazy load for performance

2. **Background app indicators**
   - Mini-pill showing backgrounded app state
   - "ToriGatchi: Hungry in 5m"
   - Click to resume

3. **Enhanced app cards**
   - Heartbeat indicator for "alive" apps
   - Unsaved changes warning
   - Last active timestamp

4. **Showcase as an app**
   - Appears in App Switcher from game
   - Shows current phase as state
   - Click to jump to showcase

#### Files Modified
- `src/ui/components/UV7AppSwitcher.ts` - Major enhancements
- `src/ui/styles/app-switcher.css` - New card styles

#### Success Criteria
- [ ] Thumbnails load quickly
- [ ] Background indicator shows when app has activity
- [ ] Showcase navigable from game

---

### Phase 26d: Notification Rail (Polish)
**Priority:** LOW
**Scope:** Optional enhancement

#### Tasks
1. **Inline notification rail**
   - Slides in from right of status bar
   - Stacked notifications
   - Priority grouping

2. **Swipe-to-dismiss**
   - Individual notifications
   - "Clear all" option

3. **App-specific alerts**
   - ToriGatchi hunger warnings
   - Auto-save confirmations
   - Achievement unlocks

4. **Integration with App Switcher**
   - Notification click opens relevant app
   - Badge count on app cards

#### Files Modified
- `src/ui/components/NotificationRail.ts` - New component
- `src/ui/components/StatusBar.ts` - Rail integration

#### Success Criteria
- [ ] Notifications stack cleanly
- [ ] Swipe dismiss works on mobile
- [ ] Alerts route to correct app

---

## Visual Design

### Glassmorphism (Refined)
```css
.status-bar {
    background: linear-gradient(
        180deg,
        rgba(26, 26, 46, 0.8) 0%,
        rgba(15, 15, 26, 0.95) 100%
    );
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        0 4px 30px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Micro-Interactions
- Click: Scale bounce (0.95 → 1.05 → 1)
- Hover: Subtle glow
- Active: Color pulse
- Number change: Flip animation

### Color Palette
| Context | Primary | Accent |
|---------|---------|--------|
| Ronnie | `#ff6b9d` | `#ffb6c1` |
| Tori | `#00ffff` | `#00ff88` |
| Menu | `#9b59b6` | `#8e44ad` |
| Showcase Story | `#00ff88` | `#00cc6a` |
| Showcase Dev | `#ffa500` | `#ff8c00` |

---

## Accessibility

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Cycle through status items |
| `Enter` | Activate focused item |
| `Escape` | Close any open menu/switcher |
| `Ctrl+Shift+A` | Open App Switcher |
| `Ctrl+Shift+S` | Screenshot mode |

### Screen Reader
- All items have `aria-label`
- Live regions for dynamic updates
- Announce context changes

### High Contrast
- Auto-detect `prefers-contrast: high`
- Fallback to solid backgrounds
- Thicker borders

---

## Performance

### Targets
- First paint: < 50ms
- Context switch: < 200ms animation
- App Switcher open: < 100ms
- Thumbnail load: < 500ms (lazy)

### Optimizations
- CSS containment on status bar
- Will-change for animated elements
- Intersection Observer for thumbnails
- RequestAnimationFrame for smooth transitions

---

## Testing Strategy

### Unit Tests
- StatusBarConfig parsing
- Context detection
- Feature flag behavior
- DOM element creation

### Integration Tests
- Context switching
- App Switcher navigation
- Event bus communication
- State persistence

### Visual Regression
- Screenshot comparison for each context
- Mobile vs desktop layouts
- Light/dark mode (if applicable)

### Manual Testing
- Mobile gestures
- Keyboard navigation
- Screen reader flow
- Performance profiling

---

## Rollout Plan

### Step 1: Feature Flag
```typescript
const UNIFIED_STATUS_BAR = localStorage.getItem('feature:unified-statusbar') === 'true';
```

### Step 2: Parallel Implementation
- Build unified StatusBar alongside existing
- Test in isolation
- Compare side-by-side

### Step 3: Gradual Migration
- Enable for showcase first (lower risk)
- Then V2 game
- Finally V1 game (if applicable)

### Step 4: Cleanup
- Remove old StatusBar implementations
- Update documentation
- Remove feature flag

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Showcase breaks | HIGH | Feature flag, easy rollback |
| Performance regression | MEDIUM | Profiling, lazy loading |
| Mobile gesture conflicts | MEDIUM | Careful event handling |
| Accessibility regression | HIGH | WCAG audit before/after |
| App Switcher state issues | MEDIUM | Thorough state management |

---

## Timeline Estimate

| Phase | Scope | Sessions |
|-------|-------|----------|
| 26a | Core Unification | 1-2 |
| 26b | Premium Interactions | 1 |
| 26c | App Switcher Enhancement | 1 |
| 26d | Notification Rail | 1 (optional) |

**Total:** 3-5 sessions for full implementation

---

## Success Metrics

**How do we know it's bougie?**

- [ ] User doesn't think about navigation
- [ ] Context switches feel seamless
- [ ] Every interaction has personality
- [ ] Accessibility is invisible (it just works)
- [ ] First-time users intuitively understand it
- [ ] Power users discover hidden gestures
- [ ] Screenshots look premium

---

## Open Questions

1. **V1 Integration:** Should V1 game also use unified StatusBar, or keep separate?
2. **Sound Design:** Should we add optional audio feedback for interactions?
3. **Persistence:** How much StatusBar state should persist across sessions?
4. **Theming:** Should users be able to customize status bar appearance?

---

## Appendix: Current File Structure

```
src/ui/components/
├── StatusBar.ts          # V2 StatusBar (927 lines)
├── UV7AppSwitcher.ts     # App Switcher component
└── NotificationShade.ts  # Pull-down shade

showcase/
├── index.html            # Contains inline status bar
└── uv7-os.js             # Status bar logic (~100 lines)

system/
└── notification-shade-controller.js  # V1 status bar (62K)
```

---

**Ready to implement when you give the green light!** 💚🔥💀

*"Every pixel, every gesture, every animation—premium."* 💎
