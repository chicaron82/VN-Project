# UV7 Showcase CSS Architecture

**Single entry point:** `showcase.css` imports all stylesheets in logical order.

## Import Hierarchy

```
showcase.css (master)
├── 1. FOUNDATION
│   ├── base.css           - Variables, resets, typography
│   ├── theme-toggle.css   - Light/dark mode system
│   └── unified-design.css - Shared tokens across V1/V2/showcase
│
├── 2. SYSTEM (UV7 OS Chrome)
│   ├── uv7-system.css     - Status bar, app switcher, breadcrumbs
│   ├── sidebar.css        - Landscape navigation panel
│   ├── shade.css          - Portrait swipe-down panel
│   └── echo-system.css    - Meta-narrative state indicators
│
├── 3. LAYOUT & PAGES
│   ├── components.css     - Reusable UI components (cards, buttons, badges)
│   ├── pages.css          - Section-specific styles (Home, Who, etc.)
│   ├── code-comparison.css - Side-by-side code diffs
│   ├── evolution-v2.css   - Evolution section deep-dive
│   └── blog.css           - Timeline/Journey base layout
│
├── 4. BLOG FEATURES (Timeline Enhancements)
│   ├── blog-animations.css    - Fade-in, stagger, reveals
│   ├── blog-stats.css         - Fun metrics dashboard
│   ├── blog-scrubber.css      - Progress bar navigation
│   ├── blog-search.css        - Filter interface
│   ├── blog-hover-preview.css - Quick peek tooltips
│   ├── blog-playback.css      - Auto-scroll mode
│   ├── blog-heatmap.css       - Activity visualization
│   └── blog-export.css        - Data export UI
│
└── 5. EFFECTS & POLISH
    ├── keyboard-shortcuts.css - Keyboard nav modal
    └── cursor.css             - Custom cursor (disabled by default)
```

## Organization Principles

1. **Import order matters** - Base styles load first, overrides last
2. **One responsibility per file** - Each CSS file has a clear, single purpose
3. **Documented headers** - All files include purpose/usage comments
4. **No inline styles** - Extracted to CSS classes (Phase 1 cleanup)
5. **Semantic naming** - `.home-section-wrapper` not `.wrapper-1`

## When to Create a New CSS File

**DO create a new file if:**
- Feature is self-contained (new blog enhancement, new section)
- Styles exceed ~200 lines
- Feature can be disabled independently

**DON'T create a new file if:**
- Adding to existing component
- Less than 50 lines of styles
- Tightly coupled to existing file

## File Size Guidelines

| Size | Status | Action |
|------|--------|--------|
| < 500 lines | ✅ Healthy | None needed |
| 500-1000 lines | ⚠️ Large | Consider splitting by sub-feature |
| 1000-2000 lines | 🔴 Bloated | Refactor into logical modules |
| > 2000 lines | 💀 Critical | Immediate split required |

**Current largest files:**
- `base.css`: 5106 lines (acceptable - CSS variables + resets)
- `components.css`: 5558 lines (🔴 bloated - see navigation guide below)
- `pages.css`: 2620 lines (🔴 bloated - see navigation guide below)

## Navigating Large Files

### components.css (5558 lines) - Reusable UI Components

**📖 Section Index:**

| Lines | Section | Description |
|-------|---------|-------------|
| 1-275 | Hero Section | hero-container, hero-content, stats, split-container |
| 276-965 | Timeline Component | phases, toolbar, search, spotlight, scrubber |
| 966-1315 | App Switcher Cards | preview cards, gradients, overlays |
| 1316-1875 | Code Comparison Modal | split-screen, slider, syntax highlighting |
| 1876-2265 | Hero Banners | premium section headers, parallax, particles |
| 2266-2700 | Spotlight Carousel | technical cards, navigation, modal |
| 2701-3155 | Cooking Metaphor | recipe vs ingredients comparison |
| 3156-3485 | Soma Journey | V1 vs V2 phase comparison |
| 3486-4335 | Experiment Design | V3 recipe cards, agent cards, matrix |
| 4336-4715 | Experiment Dashboard | scorecards, mode toggles, badges |
| 4716-5095 | Experiment Reflections | post-mortem, failure analysis |
| 5096-5385 | Experiment Mimic | chaos variable, origin story, analysis |
| 5386-5558 | Belle Path Comparison | V1/V2, self-assessment, trade-offs |

**🔧 How to Navigate:**
- Use **Cmd/Ctrl+G** (Go to Line) in your editor
- Search for section headers like `/* ═══ HERO SECTION ═══ */`
- Each section is self-contained with its own media queries

**📋 Recommended Splits (Future Work):**
1. Extract `experiment-*.css` (lines 3486-5385) - 1900 lines of experiment-specific styles
2. Extract `carousel.css` (lines 2266-2700) - 435 lines reusable component
3. Extract `cooking-metaphor.css` (lines 2701-3155) - 455 lines feature-specific

### pages.css (2620 lines) - Page-Specific Styles

**📖 Section Index:**

| Lines | Section | Description |
|-------|---------|-------------|
| 1-485 | Who Page | creator hero, crew grid, crew cards, philosophy, Belle's mimic |
| 486-940 | Evolution Page | V1→V2 comparison, VS divider, metrics, architecture diagrams |
| 941-1550 | Spotlight Bento | bento grid, 3D tilt, glassmorphism, gradient borders, scroll reveal |
| 1551-1950 | Content Features | dark mode, timeline search, GitHub links, toasts, share buttons |
| 1951-2270 | Workflow Methodology | collapsible sections, review flow, diversity benefits, trade-offs |
| 2271-2385 | Experiment Visual Contrast | positive/negative comparison, user feedback, failure tables |
| 2386-2620 | Home Page | Version 848, story cards, route grid, themes grid, meta-philosophical boxes |

**🔧 How to Navigate:**
- Use **Cmd/Ctrl+G** (Go to Line) in your editor
- Search for section headers like `/* ═══ WHO PAGE ═══ */`
- Each page section includes its own responsive styles

**📋 Recommended Splits (Future Work):**
1. Extract `pages/who-page.css` (lines 1-485) - 485 lines
2. Extract `pages/evolution-page.css` (lines 486-940) - 455 lines  
3. Extract `pages/spotlight-bento.css` (lines 941-1550) - 610 lines complex component
4. Extract `pages/home-page.css` (lines 2386-2620) - 235 lines

### Why Not Split Now?

**Pragmatic Decision (Phase 3):**
- Splitting into 20 files adds maintenance overhead
- Current structure is navigable with table of contents
- Each section is self-contained (media queries included)
- Future extraction can happen incrementally as needed

**When to Extract:**
- When adding 500+ lines to a specific section
- When section becomes reused across multiple pages
- When working exclusively on one feature for extended period


## Import Performance

**Current setup:**
- `showcase.css` uses `@import` (22 files)
- **Build optimization:** Vite concatenates imports into single bundle
- **Dev mode:** Files load individually (easier debugging)
- **Production:** Single minified CSS file (~150KB gzipped)

**No performance penalty** - Vite handles bundling.

## Naming Conventions

### Classes
- **BEM-lite:** `.section-content`, `.crew-card`, `.crew-card__header`
- **State:** `.is-active`, `.is-expanded`, `.has-error`
- **Utility:** `.text-center`, `.mt-2`, `.hidden`

### CSS Variables
- **Colors:** `--accent-blue`, `--text-primary`, `--bg-dark`
- **Spacing:** `--spacing-xs`, `--spacing-md`, `--spacing-xl`
- **Timing:** `--transition-speed`, `--animation-duration`

## Adding New Styles

1. **Identify the right file** using hierarchy above
2. **Add to appropriate section** with clear comment
3. **Use semantic class names** (`.home-heading` not `.h3-style-2`)
4. **Test in both themes** (light/dark mode)
5. **Update this README** if creating new file

## Removing a Feature

1. **Remove import** from `showcase.css`
2. **Remove link** from `index.html` (if direct linked)
3. **Delete CSS file** (git tracks history)
4. **Update this README**

## History

- **Phase 1 (Feb 1, 2026):** Extracted all inline styles to CSS classes from HomeSection/WhoSection
- **Phase 3 (Feb 1, 2026):** Consolidated 22 files under `showcase.css` master import
- **Phase 4 (Feb 1, 2026):** Added comprehensive table of contents to components.css and pages.css
  - Added 13-section index to components.css (5558 lines)
  - Added 7-section index to pages.css (2620 lines)
  - Documented navigation strategies (Cmd/Ctrl+G, section headers)
  - Identified future extraction targets (experiment features, carousel, bento grid)
  - **Rationale:** Splitting into 20 files adds maintenance overhead; current TOC approach provides navigability without fragmentation
- **Before:** 22 individual `<link>` tags in HTML, no file navigation guidance
- **After:** 1 `<link>` tag, organized with `@import`, comprehensive section indices

## Questions?

Check `showcase.css` for the canonical import order and file descriptions.
