# V1 vs V2 Feature Audit

> What v1 has that v2 is missing — the "seasoning" that makes v1 feel polished and engaging.

---

## Summary

**V1** has **75 system files**, **24 CSS files**, and **12 UI components** with deep visual polish.  
**V2** has **8 controllers**, **10 UI components**, and **2 CSS files** focused on clean architecture.

V2 has the **foundation right** (EventBus, StateManager, TypeScript, tests), but is missing the **visual richness** and **special sauce** that makes v1 feel premium.

---

## 🔴 Critical Missing Features (High Visual Impact)

### 1. Notification Shade System

**V1 Files:**

- `system/notification-shade-controller.js` (62KB)
- `system/notification-shade.css` (44KB)
- `system/status-notification-controller.js` (10KB)

**What it does:**

- Mobile-style pull-down notification panel
- Quick actions carousel with paging
- Status details display
- Note preview cards (email-style inbox)
- UV7 carrier-style footer

**V2 Status:** ❌ Not implemented

---

### 2. Theme Manager & Dynamic Theming

**V1 Files:**

- `system/theme-manager.js` (12KB)

**What it does:**

- Route-based theme switching (Ronnie blue, Tori pink, True green, etc.)
- Dynamic CSS variable mutation
- 6 distinct visual themes
- Smooth theme transitions

**V2 Status:** ⚠️ Partial - `ThemeManager.ts` (180 lines) exists with route-based switching

- Has 3 themes defined (ronnie, tori, menu)
- Listens to `route:change` events
- Emits `theme:change` events
- CSS variable mutation implemented
- **TODO:** Add remaining themes (true, bad, digital_forever), smooth transitions

---

### 3. Visual Effects System

**V1 Files:**

- `system/effects-controller.js` (15KB)
- `css/effects.css` (22KB)
- `system/insane-visuals-controller.js` (5KB)

**What it does:**

- Glitch effects (screen distortion, RGB split)
- Shake effects (trauma-based intensity)
- Fade/blur transitions
- Scanline overlays
- CRT aesthetic
- "Insane" mode extreme visuals

**V2 Status:** ⚠️ Partial (EffectsController exists but effects.css is only 5KB vs 22KB)

---

### 4. Menu Carousel (Momentum Scrolling)

**V1 Files:**

- `ui/carousel-momentum.js` (27KB)
- `ui/simple-carousel.js` (25KB)
- `ui/momentum-adapter.js` (11KB)
- `menu-carousel.css` (23KB)

**What it does:**

- iOS-style inertia scrolling
- Snap-to-item behavior
- Touch/swipe support
- Keyboard navigation
- Rotating tips on menu

**V2 Status:** ✅ **MIGRATED** (2026-01-10)

**Migration Notes:**

- `CarouselMomentum.ts` (607 lines) - Physics engine with friction 0.975 "Price Is Right" spin
- `MenuCarouselView.ts` (374 lines) - New component integrating carousel with menu cards
- App.ts updated to use MenuCarouselView instead of MenuView
- CSS in `main.css` (200+ lines) - Card styling, landscape/portrait modes, Tinder-style stacking
- Features: 3x clone buffer for infinite scroll, haptic feedback, keyboard navigation, tutorial overlay

---

### 5. Bougie Boot Sequence

**V1 Files:**

- `ui/bougie-boot-sequence.js` (21KB)
- `ui/bougie-boot-sequence.css` (12KB)
- `ui/boot-stats-calculator.js` (9KB)

**What it does:**

- Terminal-style file loading animation
- Dynamic stats from save data
- Conditional boot messages
- Hardware-style file categories (CPU, RAM, GPU, etc.)
- Skip functionality

**V2 Status:** ⚠️ Partial (`BootSequence.ts` exists but less feature-complete)

---

## 🟠 Important Missing Features (Polish & UX)

### 6. Sidebar System (Desktop/Landscape)

**V1 Files:**

- HTML in `index.html` (lines 297-400)
- Controls in `notification-shade-controller.js`

**What it does:**

- iOS-style depth layers
- Swipe between "Core" and "Tools" panels
- Status details section
- Note preview

**V2 Status:** ❌ Not implemented

---

### 7. Tutorial/Onboarding System

**V1 Files:**

- `system/tutorial-manager.js` (7KB)
- `ui/tutorial.css` (3KB)

**What it does:**

- First-time user hand gesture overlays
- Tutorial state tracking
- Reset tutorials option
- Contextual help

**V2 Status:** ❌ Not implemented

---

### 8. Visual Cue Manager

**V1 Files:**

- `system/visual-cue-manager.js` (16KB)
- `visual-cues.css` (8KB)

**What it does:**

- Pulsing attention indicators
- Directional arrows
- "New" badges
- Skip indicators

**V2 Status:** ❌ Not implemented

---

### 9. Haptic Feedback Controller

**V1 Files:**

- `system/haptic-controller.js` (8KB)

**What it does:**

- Vibration patterns for key moments
- Pattern library (tap, double-tap, warning, critical)
- Mobile-optimized (Android/iOS handling)

**V2 Status:** ❌ Not implemented (mentioned in ARCHITECTURE.md but not created)

---

### 10. Accessibility Features

**V1 Files:**

- `system/accessibility-manager.js` (9KB)
- `system/accessibility.js` (5KB)
- `system/accessibility.css` (1KB)
- `css/accessibility.css` (5KB)

**What it does:**

- Reduce motion support
- Comfort mode (disable glitch effects)
- Screen reader optimization
- High contrast options
- ARIA label fixes

**V2 Status:** ❌ Not implemented

---

### 11. Echo Memory System

**V1 Files:**

- `system/echo-memory-system.js` (20KB)

**What it does:**

- Tori route: competing voices display
- Echo voice positioning (floating whispers)
- Despair voice intrusion
- Memory fragmentation visuals

**V2 Status:** ❌ Not implemented (no corresponding V2 system)

---

### 12. Secret Codes Manager (UI)

**V1 Files:**

- `system/secret-codes-manager.js` (31KB)

**What it does:**

- Code input modal with terminal aesthetic
- Invalid code responses
- Unlock animations
- Dev command processing

**V2 Status:** ⚠️ Partial (codes data exists, but no UI/input system)

---

## 🟡 Nice-to-Have Missing Features

### 13. Easter Egg Controller

**V1 Files:**

- `system/easter-egg-controller.js` (102KB!)

**What it does:**

- Konami code
- Tori-Gatchi integration
- Hidden features unlocks
- Developer mode

**V2 Status:** ❌ Not implemented (planned for Phase 8)

---

### 14. Dev Suite

**V1 Files:**

- `system/dev-suite.js` (49KB)
- `system/dev-hud-controller.js` (8KB)
- `css/dev-suite.css` (17KB)
- `css/dev-tools.css` (6KB)

**What it does:**

- In-game developer tools
- Scene jumping
- Flag/counter manipulation
- State inspection
- Performance overlay

**V2 Status:** ⚠️ Partial (`DevErrorOverlay.ts` exists, but not full suite)

---

### 15. Directors Cut / Dev Commentary

**V1 Files:**

- `system/directors-cut-controller.js` (10KB)
- `system/dev-commentary.js` (8KB)
- `system/dev-commentary.css` (4KB)

**What it does:**

- Behind-the-scenes commentary bubbles
- Scene-by-scene annotations
- Toggle on/off

**V2 Status:** ❌ Not implemented

---

### 16. Screenshot Tool

**V1 Files:**

- `system/screenshot-controller.js` (6KB)
- `system/screenshot-tool.js` (6KB)

**What it does:**

- In-game screenshot capture
- Download naming
- Share functionality

**V2 Status:** ❌ Not implemented

---

### 17. Time Machine Manager

**V1 Files:**

- `system/time-machine-manager.js` (15KB)

**What it does:**

- Scene history navigation
- "Rewind" capability
- Branching visualization

**V2 Status:** ❌ Not implemented

---

### 18. Bootstrap Tracker

**V1 Files:**

- `system/bootstrap-tracker.js` (13KB)

**What it does:**

- Loop version timeline visualization
- Progress tracking across playthroughs
- "847 previous failures" display

**V2 Status:** ❌ Not implemented (mentioned for Phase 8)

---

## 📊 CSS Comparison

| Category | V1 Files | V2 Files | Missing |
|----------|---------|----------|---------|
| **Effects** | `css/effects.css` (22KB) | `effects.css` (5KB) | Glitch variants, screen tears |
| **Gameplay** | `css/gameplay.css` (21KB) | (in main.css) | Character animations, stance effects |
| **Notes** | `css/notes.css` (29KB) | ❌ None | Notes viewer, inbox-style UI |
| **Settings** | `css/settings.css` (23KB) | ❌ None | Settings modal, tab panels |
| **Backlog** | `css/backlog.css` (12KB) | ❌ None | Dialogue history viewer |
| **Tether** | `css/tether.css` (11KB) | ❌ None | Tether meter styling, pulse effects |
| **Loop Init** | `css/loop-init.css` (14KB) | ❌ None | Loop initialization sequence |
| **Sprites** | `css/sprites.css` (12KB) | ❌ None | Character pose animations |
| **Endings** | `css/endings.css` (14KB) | ❌ None | Ending screens, credits roll |
| **Responsive** | `css/responsive.css` (14KB) | ❌ None | Mobile/tablet layouts |
| **Pause Menu** | `css/pause-menu.css` (9KB) | ❌ None | Pause overlay styling |
| **Overlays** | `css/overlays.css` (7KB) | ❌ None | Confirmation dialogs, modals |
| **Splash** | `css/splash.css` (8KB) | (in main.css) | UV7 logo animation |
| **Difficulty** | `css/difficulty.css` (5KB) | ❌ None | Difficulty selector styling |

**Total V1 CSS:** ~250KB across 24 specialized files  
**Total V2 CSS:** ~58KB across 2 files

---

## 💡 Recommendations

### Immediate Priorities (Visual Impact)

1. **Theme Manager** - Runtime theme switching is core to the VN's identity
2. **Notification Shade** - The mobile UX signature feature
3. **Effects CSS** - Glitch/distortion effects give Tori's route its feel
4. **Tether UI** - The meter styling is essential for gameplay

### Medium Priority (Polish)

1. **Tutorial System** - First-time UX
2. **Visual Cues** - Attention management
3. **Accessibility** - Player comfort options
4. **Haptics** - Mobile experience

### Lower Priority (Features)

1. **Easter Eggs** - Fun but not core
2. **Dev Suite** - Development convenience
3. **Directors Cut** - Bonus content

---

## Files to Reference for Migration

| Feature | Primary V1 File | Size |
|---------|----------------|------|
| Themes | `system/theme-manager.js` | 12KB |
| Notification Shade | `system/notification-shade-controller.js` | 62KB |
| Effects | `system/effects-controller.js` + `css/effects.css` | 37KB |
| Tether Visuals | `system/tether-system.js` + `css/tether.css` | 41KB |
| Carousel | `ui/carousel-momentum.js` | 27KB |
| Tutorial | `system/tutorial-manager.js` | 7KB |
| Visual Cues | `system/visual-cue-manager.js` | 16KB |
| Haptics | `system/haptic-controller.js` | 8KB |
| Echo System | `system/echo-memory-system.js` | 20KB |

---

*Audit generated: 2026-01-10*
