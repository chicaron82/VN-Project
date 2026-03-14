import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'css-legacy-deletion-theme-debug-feb-2026',
    date: 'Feb 12, 2026',
    sortDate: '2026-02-12T18:00:00',
    title: 'Kill the God-Classes: 3,670 Lines of Legacy CSS Deleted',
    type: 'milestone',
    emoji: '\uD83D\uDDE1\uFE0F',
    tags: ['CSS', 'Refactor', 'Theme System', 'Debug', 'Architecture'],
    summary: 'Deleted three legacy CSS files totaling 3,670 lines, unified the color system, and survived a three-layer theme debugging onion.',

    description: `The showcase had been running two CSS systems simultaneously\u2014a legacy monolithic approach and a modern modular one\u2014and they were fighting each other for control of every pixel.

## The Problem

Three files were the culprits:

- **landing-page.css** (1,175 lines) \u2014 Its own \`:root\` variables, hardcoded colors, \`body.light-mode\` selectors. A complete parallel universe.
- **pages.css** (2,643 lines) \u2014 100% redundant. Every section (Who, Evolution, Spotlight, Workflow, Home) already had dedicated modular CSS files.
- **theme-toggle.css** (111 lines) \u2014 Existed solely to slap \`!important\` on everything because media queries couldn\u2019t be overridden any other way.

Two HTML entry points loaded CSS differently\u2014root \`index.html\` used individual \`<link>\` tags while \`showcase/index.html\` used a master \`@import\` chain\u2014and neither loaded the unified color system consistently.

## The Surgery

Only ~258 lines from \`landing-page.css\` were actually active (menu typography and card styles). Everything else was dead code or already covered by modular files.

The migrated styles were color-converted from hardcoded values to CSS variables:
- \`#1a1a1a\` \u2192 \`var(--text-primary)\`
- \`rgba(0, 255, 136, 0.3)\` \u2192 \`color-mix(in srgb, var(--accent-primary) 30%, transparent)\`
- \`rgba(0, 0, 0, 0.08)\` \u2192 \`var(--border-subtle)\`

Then the three files were deleted. Net result: **-3,670 lines**.

## The Three-Layer Theme Onion

After deletion, light mode stopped working. What followed was a three-layer debugging session where each fix revealed the next problem hiding underneath:

**Layer 1 \u2014 Conflicting Overrides:** \`theme-toggle.css\` had duplicate variable definitions fighting \`colors.css\`, plus 88 lines of \`!important\` section overrides. No \`body { background: var(--bg-primary) }\` rule existed anywhere. Fixed by removing conflicts and adding the body rule.

**Layer 2 \u2014 Wrong DOM Element:** ThemeManager set \`data-theme\` on \`<html>\` but CSS selectors expected it on \`<body>\`. Fixed by setting it on both.

**Layer 3 \u2014 Iframe Isolation:** The showcase runs inside an iframe with its own separate DOM. The shell\u2019s ThemeManager updated the shell\u2019s DOM just fine, but the iframe\u2019s \`postMessage\` handler only toggled CSS classes\u2014it never set the \`data-theme\` attribute. So \`body[data-theme="light"]\` in \`colors.css\` never matched inside the iframe. Fixed by adding \`setAttribute\` calls in the iframe\u2019s theme-change handler.

## The !important Elimination

The final piece: \`base.css\` used \`@media (prefers-color-scheme: dark)\` for timeline components. These media queries can\u2019t be overridden by class selectors or attribute selectors without \`!important\`. That\u2019s why \`theme-toggle.css\` existed in the first place.

The clean fix: convert all 9 media query blocks to CSS variable declarations. Instead of:

\`\`\`css
.timeline-content { background: #fff; }
@media (prefers-color-scheme: dark) {
    .timeline-content { background: #2a2a2a; }
}
\`\`\`

Now:

\`\`\`css
.timeline-content { background: var(--bg-secondary, #fff); }
\`\`\`

The variable swaps automatically when \`data-theme\` changes. Zero \`!important\` rules needed. \`theme-toggle.css\` deleted entirely.`,

    callout: {
        icon: '\uD83E\uDDE5',
        title: 'Onion Debugging',
        text: 'Sometimes bugs stack in layers. Each fix reveals the next one hiding underneath. The key is fixing each layer cleanly rather than papering over all of them with !important.'
    },

    highlights: [
        'Deleted 3 legacy CSS files totaling 3,670+ lines',
        'Migrated only 258 active lines with full color variable conversion',
        'Unified theme system across both HTML entry points and the iframe boundary',
        'Eliminated every !important override in the codebase',
        'Converted 9 media query blocks to CSS variable declarations'
    ],

    problem: {
        description: 'Two competing CSS systems (legacy monolithic vs modern modular) caused theme conflicts, dead code accumulation, and !important proliferation.',
        rootCause: 'Legacy files (landing-page.css, pages.css) were never cleaned up after modular replacements were built. theme-toggle.css was a band-aid for media queries that couldn\'t be overridden cleanly.'
    },

    solution: {
        approach: 'Audit all legacy files, migrate only active styles with color variable conversion, delete everything else, then fix the cascading theme issues that deletion exposed.',
        steps: [
            '**Phase 1 \u2014 Fix CSS Loading:** Add colors.css import to showcase.css, remove landing-page.css link from root index.html',
            '**Phase 2 \u2014 Migrate Active Styles:** Move ~258 lines of menu and card styles to home-page.css with hardcoded colors converted to CSS variables',
            '**Phase 3 \u2014 Delete Legacy:** Remove landing-page.css (-1,175), pages.css (-2,643), theme-toggle.css (-111)',
            '**Phase 4 \u2014 Fix Theme Cascade:** Resolve conflicting overrides, set data-theme on correct DOM elements, bridge iframe isolation',
            '**Phase 5 \u2014 Eliminate !important:** Convert media query blocks to CSS variable declarations'
        ]
    },

    metrics: {
        'Lines Deleted': '3,670+',
        'Lines Migrated': '258 (color-converted)',
        'Files Deleted': '3 (landing-page.css, pages.css, theme-toggle.css)',
        'Commits': '5',
        '!important Rules': '88 \u2192 0',
        'Theme Debug Layers': '3 (overrides \u2192 DOM element \u2192 iframe)'
    },

    crew: [
        {
            name: 'DiZee',
            icon: '\uD83D\uDD2A',
            contribution: 'Identified the dual CSS systems, designed the migration plan, and drove the investigation through each layer of theme bugs'
        },
        {
            name: 'Claude',
            icon: '\uD83E\uDDE0',
            contribution: 'Executed the surgical deletion, performed the color variable conversion, and debugged the three-layer iframe theme isolation issue'
        }
    ],

    lessons: [
        '**CSS variables beat specificity wars.** Instead of fighting media queries with !important, change the variable value itself. The cascade works *for* you instead of against you.',
        '**Iframes have their own DOM.** Setting data-theme on the shell means nothing inside the iframe. PostMessage handlers must apply theme attributes independently.',
        '**Dead code hides bugs.** The legacy files weren\'t just bloat\u2014they were actively overriding the unified color system with hardcoded values.',
        '**Audit before you delete.** Of 1,175 lines in landing-page.css, only 258 were actually used. The rest was either dead or already covered by modular files.'
    ],

    quote: 'Three layers of bugs, three legacy files, zero !important rules remaining. Sometimes the cleanest code is the code you delete.',

    footer: {
        icon: '\uD83D\uDDE1\uFE0F',
        text: 'From 3,670 lines of chaos to a unified variable-based theme system. The CSS god-classes have been slain.'
    },

    status: 'completed'
};
