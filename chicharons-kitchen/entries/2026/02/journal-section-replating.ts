import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'journal-section-replating-feb-2026',
    date: 'Feb 13, 2026',
    sortDate: '2026-02-13T14:00:00',
    title: 'Journal Section Re-Plating: Filter Bar, Crew Diversity & Lab Merge',
    type: 'refactor',
    emoji: '🍽️',
    tags: ['UX', 'Glass-Morphism', 'Architecture', 'CSS', 'DiZee', 'Refactoring', 'Filter System'],
    modelId: 'dizee',
    summary: 'A full re-plating of the journal section: consolidated duplicate intro paragraphs, replaced the Stats Dashboard with a bougie glass-morphism filter bar (category pills + crew portrait chips), backfilled modelId on 17 entries for crew diversity, merged 18 lab experiment entries into the main timeline, and deleted 517 lines of dead dashboard code. 27 files changed, +634/−404 lines.',

    callout: {
        icon: '🍽️',
        title: 'Re-Plating, Not Rewriting',
        text: 'The journal had the right ingredients — 115+ entries, crew avatars, experiment data. But the presentation was underselling the diversity. This session re-plated everything: one consolidated intro, a sticky filter bar with glass-morphism and crew portraits, and accurate attribution across 25 entries.'
    },

    highlights: [
        'Built JournalFilterBar.ts (232 lines) — glass-morphism sticky strip with category pills (All, Milestones, Debug Hell, Refactors, V3 Experiment) + crew portrait chips with signature-color glow rings',
        'Backfilled modelId on 17 blog entries: Tori (6), Belle (4), DiZee (2), CoZee (2), Zee (2), Aaron (1) — crew diversity was hidden behind missing metadata',
        'Merged 18 V3 experiment entries from separate lab-entries index into main timelineData — now filterable via "V3 Experiment" chip',
        'Deleted FunMetricsDashboard (181 lines) + blog-stats.css (336 lines) — replaced by interactive filter chips that actually show accurate data',
        'Consolidated duplicate intro paragraphs in JournalSection.ts — was rendering the same text twice with different CSS classes',
        'Added filterBy() public API to BlogRenderer with applyFilter() switch/case for category + crew matching',
        'Expanded avatar map in EntryCardBuilder.ts from 4 to 9 crew members + Aaron (creator)',
        'Added 5 new crew signatures in EntryCardUtils.ts: Zee, ZeeRah, CoZee, PerplexiZee, Aaron',
        'Created journal-filter-bar.css (245 lines) — glass-morphism container, --crew-color CSS custom property for portrait glow rings, color-mix() active states, responsive at 768px',
        'URL integration: ?filter=dizee or ?filter=milestones deep-links directly to filtered view'
    ],

    technicalDetails: {
        title: 'The Five-Course Re-Plating',
        sections: [
            {
                heading: 'Course 1: The Crew Diversity Problem',
                content: `
The FunMetricsDashboard showed DiZee dominating every metric because only DiZee entries had \`modelId\` set. The data wasn't wrong — the metadata was incomplete.

**Fix:** Backfilled \`modelId\` on 17 entries across 6 crew members:

| Crew | Entries | Examples |
|------|---------|---------|
| Tori | 6 | core-systems-ports, great-test-recovery, parity-audit |
| Belle | 4 | rebuild-foundation, scene-rendering-cutscenes |
| DiZee | 2 more | app-switcher-bougie, toast-controller |
| CoZee | 2 | hello-cozee, tale-of-two-cozees |
| Zee | 2 | custom-engine-realization, post-launch-polish |
| Aaron | 1 | birthday-break-chicharon-levels-up |

Now 25 entries have proper crew attribution. The filter bar reflects this immediately.
`
            },
            {
                heading: 'Course 2: Glass-Morphism Filter Architecture',
                content: `
The filter bar is a two-row sticky strip that mounts inside the journal section:

\`\`\`
┌─────────────────────────────────────────────────────┐
│  [All] [Milestones] [Debug Hell] [Refactors] [V3]  │  ← Category pills
│  (👤)(👤)(👤)(👤)(👤)(👤)(👤)(👤)(👤)              │  ← Crew portrait chips
└─────────────────────────────────────────────────────┘
\`\`\`

**Key design decisions:**

- **Sticky positioning** at \`top: 60px\` (below navbar) with \`backdrop-filter: blur(16px)\`
- **Category pills** use tag/type matching via a \`match\` function per category
- **Crew chips** use circular portraits with \`--crew-color\` CSS property for per-crew signature glow
- **Toggle behavior:** clicking an active filter deselects it (returns to All)
- **URL sync:** \`?filter=\` param persisted on click, read on mount via \`applyUrlFilter()\`

The \`JournalFilterBar\` constructor takes a mount selector, the entries array, and an \`onFilter\` callback — zero coupling to BlogRenderer internals.
`
            },
            {
                heading: 'Course 3: The Lab Entry Merge',
                content: `
18 V3 experiment entries lived in a separate \`lab-entries/\` index, visible only on the old Experiment tab. They were invisible to the journal's main timeline.

**Fix:** Import \`labEntries\` from \`../lab-entries\` and spread into \`timelineData\`:

\`\`\`typescript
import { labEntries } from '../lab-entries';

export const timelineData: BlogEntry[] = [
    ...existingEntries,
    ...labEntries,
];
\`\`\`

The "V3 Experiment" category pill uses type-matching (\`type === 'v3-experiment'\`) to isolate them. No separate tab needed — they're part of the full timeline now, filterable on demand.
`
            },
            {
                heading: 'Course 4: Killing the Dashboard',
                content: `
FunMetricsDashboard.ts (181 lines) + blog-stats.css (336 lines) = 517 lines of code that displayed inaccurate metrics (DiZee-only due to missing modelId).

Rather than fix the dashboard, we replaced it with something better — interactive filter chips that let you *see* each crew's entries directly. The filter bar IS the metrics: click a crew portrait, see their work.

**Removed:**
- \`FunMetricsDashboard\` class + import from BlogRenderer
- \`statsContainer\` field + \`renderStatsContainer()\` method
- \`blog-stats.css\` @import from showcase.css
- \`isV3Entry\` filter in BlogRenderer (lab entries are now part of main data)
`
            },
            {
                heading: 'Course 5: The Intro Consolidation',
                content: `
JournalSection.ts was rendering two separate paragraph elements with nearly identical content — one as \`.section-intro\` and one embedded in the HTML string. The Story/Dev toggle text referenced a ViewModeController pattern that no longer applied.

**Fix:** One paragraph, one voice. Updated "90+ Days" to "115+ Days" to reflect actual timeline length. Added \`#journal-filter-mount\` div between the heading and the timeline container for the filter bar to mount into.
`
            }
        ]
    },

    lessonsLearned: [
        {
            icon: '🏷️',
            title: 'Metadata Before Metrics',
            lesson: 'The dashboard wasn\'t lying — it was reflecting incomplete metadata. Before building any stats/filter system, audit the underlying data. 17 entries were missing modelId, making any aggregation DiZee-biased. Fix the data first, then the presentation.'
        },
        {
            icon: '🎛️',
            title: 'Filters Beat Dashboards',
            lesson: 'A stats dashboard tells you numbers. A filter bar lets you experience the data. Clicking Belle\'s portrait and seeing her 4 entries is more powerful than reading "Belle: 4 entries" in a chart. Interactive exploration > passive display.'
        },
        {
            icon: '🧩',
            title: 'Mount Points Over Tight Coupling',
            lesson: 'JournalFilterBar takes a mount selector and a callback — it doesn\'t know about BlogRenderer. BlogRenderer exposes filterBy() — it doesn\'t know about JournalFilterBar. main.ts wires them together. Three files, zero import dependencies between the two features.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'Filter bar architecture, glass-morphism CSS, crew data backfill, dashboard removal, BlogRenderer filter API, intro consolidation',
            icon: '👨‍🍳'
        }
    ],

    metrics: {
        title: 'Session Metrics',
        stats: [
            { label: 'Files changed', value: 27 },
            { label: 'Lines added', value: 634 },
            { label: 'Lines removed', value: 404 },
            { label: 'Dead code deleted', value: '517 lines' },
            { label: 'Entries with crew avatars', value: '25 (was 8)' },
            { label: 'Lab entries merged', value: 18 },
            { label: 'Filter categories', value: 5 },
            { label: 'Crew chips', value: 9 }
        ]
    },

    footer: {
        icon: '🍽️',
        text: 'Same ingredients, better plating. The journal now shows what was always true — this project was built by a whole crew, not just one chef. Every portrait glows its signature color. 💚🔥💀'
    }
};
