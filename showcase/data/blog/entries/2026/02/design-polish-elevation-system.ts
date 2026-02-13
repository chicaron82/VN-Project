import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'design-polish-elevation-system-feb-2026',
    date: 'Feb 12, 2026',
    sortDate: '2026-02-12T18:00:00',
    title: 'Design Polish: The Elevation System & Kitchen Cleanup',
    type: 'refactor',
    emoji: '✨',
    tags: ['CSS Architecture', 'Design System', 'Typography', 'Accessibility', 'DiZee', 'Refactoring'],
    modelId: 'dizee',
    summary: 'A two-phase session: first, structural cleanup (CSS extraction, duplicate keyframe removal, 3 TypeScript file splits). Then, design polish — building an elevation system, extracting 8 inline styles, unifying 3 competing card hover systems, punching up typography, adding gradient accents, and upgrading link animations. Zero errors throughout.',

    callout: {
        icon: '🔥',
        title: 'Two Sessions, One Kitchen',
        text: 'Phase 1 cleaned the kitchen (CSS extraction, TS splits). Phase 2 plated the food (elevation system, typography, gradients). Both phases: 0 TS source errors, 0 ESLint warnings.'
    },

    highlights: [
        'Built elevation system: --shadow-hover, --shadow-active, --shadow-focus + timing tokens (--ease-bounce, --ease-smooth, --duration-hover)',
        'Extracted 8 inline style= attributes from HomeSection.ts + WhoSection.ts → proper CSS classes',
        'Unified 3 competing card hover systems (CSS .premium-hover, CSS .card.clickable:hover, JS initCardHovers) into one CSS-only system',
        'Gutted JS initCardHovers() — was applying inline transforms that conflicted with CSS rules',
        'Added :focus-visible states to all interactive cards (accessibility win)',
        'Typography punch-up: hero titles from fixed 3rem → responsive clamp(2.2rem, 5vw, 4rem), weight 700→900',
        'Section h2 headers get gradient accent underlines (::after pseudo-element, green→cyan)',
        'Created reusable gradient text utilities: .gradient-text, .gradient-text-v1, .gradient-text-v2, .gradient-text-cosmic',
        'Link underlines upgraded: currentColor → gradient, added :focus-visible outline, expanded exclusion list',
        'Phase 1: components.css reduced 5,297→~3,150 lines, 3 TS splits saved ~660 lines across 6 files'
    ],

    technicalDetails: {
        title: 'The Dependency-Aware Execution Order',
        sections: [
            {
                heading: 'Why Order Mattered',
                content: `
The six design changes had real dependencies between them. Getting the order wrong would mean fighting CSS specificity or hardcoding values that should reference tokens.

**The sequence:**
1. **Shadow elevation system** — create the vars first so everything downstream references them
2. **Inline style extraction** — remove the overrides so CSS changes actually take effect
3. **Card hover/focus unification** — now using the new shadow vars, no inline conflicts
4. **Typography punch-up** — inline overrides gone, base changes land properly
5. **Section header gradients** — independent, uses existing color vars
6. **Animated link underlines** — independent, uses timing tokens from step 1

Dependencies flow downhill instead of fighting each other.
`
            },
            {
                heading: 'The Three-Way Hover Conflict',
                content: `
Before this session, card hovers were defined in three places with different values:

\`\`\`css
/* 1. CSS in components.css */
.premium-hover:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

/* 2. CSS in components.css (different section) */
.split-container .card.clickable:hover {
    transform: translateY(-4px);  /* different value! */
}

/* 3. JavaScript in premium-animations.ts */
card.style.transform = 'translateY(-8px)';  /* inline style wins specificity */
card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
\`\`\`

The JS version was the worst offender — it applied inline \`style.transform\` which overrides any CSS rule regardless of specificity. And it used a blanket \`.card, .technical-card, .crew-card\` selector that hit everything.

**Fix:** Gutted the JS function (replaced with a no-op for API compat), unified all CSS hovers to reference the elevation vars:

\`\`\`css
/* One system to rule them all */
.unified-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

.unified-card:focus-visible {
    box-shadow: var(--shadow-focus);
    outline: none;
}
\`\`\`
`
            },
            {
                heading: 'Inline Style Extraction Strategy',
                content: `
HomeSection.ts had 7 inline \`style=\` attributes, the worst being a 10-property monster on a link element. The inline styles were actively fighting the CSS cascade — the hero h1 was being shrunk from its base \`clamp(3.5rem, 7vw, 7rem)\` down to \`clamp(1.2rem, 3.5vw, 2.2rem)\` via inline override.

The approach: create semantic CSS classes scoped to the section:

\`\`\`css
/* Before: inline chaos */
<h1 style="font-size: clamp(1.2rem, 3.5vw, 2.2rem); line-height: 1.6; ...">

/* After: scoped class in home-page.css */
.hero-banner.home .hero-banner-title {
    font-size: clamp(1.4rem, 3.5vw, 2.4rem);
    line-height: 1.5;
    max-width: 1000px;
    margin: 2rem auto 1rem;
    text-transform: none;
    min-height: auto;
}
\`\`\`

New classes created: \`.hero-subtitle-attribution\`, \`.hero-subtitle-tagline\`, \`.hero-subtitle-cta\`, \`.demon-lord-link\`, \`.crew-section-intro\`, \`.entrees-header\`
`
            },
            {
                heading: 'Phase 1: The Structural Cleanup',
                content: `
Before design work could start, the kitchen needed cleaning:

**CSS Extraction:** Removed ~2,069 lines of experiment blocks from components.css (5,297→3,150). Discovered existing individual feature files (experiment-dashboard.css, etc.) already had the same content — trimmed the new experiment-design.css to 664 lines of core-only styles.

**Duplicate Keyframes:** Removed 6 identical duplicates across base.css, components.css, and experiment-dashboard.css. Identified 4 naming conflicts (same name, different definitions) and deliberately left them alone.

**TypeScript Splits:**
| File | Before | After | Extracted To |
|------|--------|-------|-------------|
| GlobalSearch.ts | 587 | 453 | SearchEngine.ts (168) |
| EntryCardBuilder.ts | 518 | 451 | EntryCardUtils.ts (74) |
| BannerPreviewCard.ts | 421 | 217 | AppStateReader.ts (211) |
`
            }
        ]
    },

    lessonsLearned: [
        {
            icon: '🔗',
            title: 'Dependencies Flow Downhill',
            lesson: 'Plan the execution order so each step builds on the last. Creating shadow vars before using them in hover rules. Extracting inline styles before changing base typography. Sequence matters more than speed.'
        },
        {
            icon: '⚔️',
            title: 'JS Inline Styles Always Win (And That\'s Bad)',
            lesson: 'JavaScript element.style.transform always beats CSS rules. If you have JS applying hover transforms AND CSS hover rules, the JS wins by specificity — and you end up debugging why your CSS "doesn\'t work." Kill the JS version.'
        },
        {
            icon: '🎨',
            title: 'Design Tokens Before Design Changes',
            lesson: 'Build the elevation system (vars, timing, easing) before touching any component styles. Otherwise you hardcode values that should be tokens, then refactor again later. Mise en place applies to CSS too.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'Structural cleanup (CSS extraction, TS splits) + design polish (elevation system, typography, hovers, gradients, link animations)',
            icon: '👨‍🍳'
        }
    ],

    metrics: {
        title: 'Session Metrics',
        stats: [
            { label: 'Inline styles eliminated', value: 8 },
            { label: 'Hover systems unified', value: '3 → 1' },
            { label: 'CSS vars added', value: 6 },
            { label: 'Utility classes created', value: 4 },
            { label: 'TS source errors', value: 0 },
            { label: 'ESLint warnings', value: 0 },
            { label: 'Focus-visible states added', value: 5 }
        ]
    },

    footer: {
        icon: '🔥',
        text: 'Clean plate, no crumbs. The elevation system is in, the inline styles are out, and every card has a :focus-visible state. Mise en place, then cook.'
    }
};
