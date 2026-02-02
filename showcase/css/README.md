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
│   ├── COMPONENTS/ (modular)
│   │   ├── hero.css                    - Hero sections
│   │   ├── timeline.css                - Timeline component
│   │   ├── app-switcher-cards.css      - Preview cards
│   │   ├── code-comparison-modal.css   - Side-by-side diffs
│   │   ├── hero-banners.css            - Section headers
│   │   └── spotlight-carousel.css      - Tech carousel
│   ├── PAGES/ (modular)
│   │   ├── who-page.css                - Crew section
│   │   ├── evolution-page.css          - V1→V2 comparison
│   │   ├── spotlight-bento.css         - Feature grid
│   │   ├── workflow-methodology.css    - Process section
│   │   └── home-page.css               - Landing content
│   ├── FEATURES/ (modular)
│   │   ├── cooking-metaphor.css        - Recipe comparison
│   │   ├── soma-journey.css            - V1/V2 phases
│   │   ├── experiment-design.css       - V3 cards
│   │   ├── experiment-dashboard.css    - Scorecards
│   │   ├── experiment-reflections.css  - Post-mortem
│   │   ├── experiment-mimic.css        - Chaos analysis
│   │   ├── belle-path-comparison.css   - Self-assessment
│   │   ├── content-features.css        - UI elements
│   │   └── experiment-visual-contrast.css - Positive/negative
│   ├── code-comparison.css - Legacy compat (deprecated)
│   ├── evolution-v2.css   - Evolution deep-dive
│   └── blog.css           - Timeline base layout
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

**Current file structure:**
- `base.css`: 5106 lines (acceptable - CSS variables + resets)
- ✅ **Modular architecture** - 20 files split by feature/component
  - 6 component files (hero, timeline, cards, modals, banners, carousel)
  - 5 page files (who, evolution, spotlight-bento, workflow, home)
  - 9 feature files (cooking, soma, experiments, content, contrast)


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
TOC to components.css and pages.css (temporary navigation solution)
- **Phase 5 (Feb 1, 2026):** **Proper modular architecture**
  - Split components.css (5558 lines) → 6 component modules + 7 feature modules
  - Split pages.css (2620 lines) → 5 page modules + 2 feature modules
  - Created proper directory structure: `components/`, `pages/`, `features/`
  - Updated showcase.css to import 20 modular files
  - Backed up bloated files as `.backup`
- **Before:** 2 bloated files (8178 lines total), 22 `<link>` tags in HTML
- **After:** 20 modular files (avg 200-400 lines each), 1 `<link>` tag, proper separation of concern