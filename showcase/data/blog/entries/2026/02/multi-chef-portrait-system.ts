import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'multi-chef-portrait-system-feb-2026',
    date: 'Feb 13, 2026',
    sortDate: '2026-02-13T21:00:00',
    title: 'Added a Little More MSG to the Blog Posts',
    type: 'enhancement',
    emoji: '👨‍🍳',
    tags: ['Journal', 'UX', 'Attribution', 'Filtering', 'Polish', 'DiZee'],
    modelId: 'dizee',
    summary: 'Blog entries now show ALL contributors as clickable portraits, not just the primary author. Hover for role tooltips, click to filter the journal by that chef. Discovery loops, signature color glows, and proper attribution for collaborative work.',

    callout: {
        icon: '🎯',
        title: 'The Discovery Loop',
        text: 'Click ZeeRah\'s portrait → see all her entries → notice she collaborated with Belle → click Belle → explore her work. Passive reading becomes active exploration.'
    },

    highlights: [
        'Multi-portrait strip shows up to 4 contributors with "+N" overflow',
        'Each chef\'s signature color glows on hover (DiZee green, Belle purple, etc.)',
        'Primary author distinguished with larger size + permanent glow ring',
        'Hover tooltips show name + role ("ZeeRah • Spec Author")',
        'Click any portrait → filters journal to that chef\'s entries',
        'Filter bar now counts ALL contributors, not just primary authors',
        'Generic "Claude Sonnet" credits split between Zee & ZeeRah',
        'Staggered fade-in animation (50ms per portrait)',
        'URL persistence for filtered views (?filter=dizee)',
        'Smooth scroll-to-top when filtering for better UX'
    ],

    problem: {
        description: 'Blog entries only showed ONE portrait based on modelId. Contributors like ZeeRah who wrote specs, or Belle who provided architecture guidance, were buried in crewAttribution at the bottom of expanded entries. Users had to scroll and expand to discover who collaborated.',
        rootCause: 'The original EntryCardBuilder only checked entry.modelId for portraits. The rich contributor data in crew[], crewAttribution.systems[], and collaborators[] was rendered as text at the bottom instead of being surfaced in the header.'
    },

    solution: {
        approach: 'Extract ALL contributors from multiple data sources, render them as a clickable portrait strip in the card header, and wire up filtering so clicking a portrait shows that chef\'s work.',
        features: [
            '**extractContributorIds()**: Pulls from modelId, crew[], crewAttribution.systems[], collaborators[] with deduplication',
            '**getContributorInfos()**: Enriches IDs with portraits, colors, roles, capped at maxCount with overflow',
            '**renderContributorStrip()**: HTML generation with signature colors, tooltips, accessibility',
            '**Event-based filtering**: Dispatches `uv7:filter:crew` event, JournalFilterBar listens and activates',
            '**NAME_TO_ID mapping**: Handles variations like "ZeeRah (Claude Sonnet 4.5)" → zeerah'
        ],
        steps: [
            '**Phase 1**: Added contributor extraction utilities to EntryCardUtils.ts (+100 lines)',
            '**Phase 2**: Replaced single portrait with multi-portrait strip in EntryCardBuilder.ts (+80 lines)',
            '**Phase 3**: Updated JournalFilterBar to count ALL contributors and listen for filter events (+40 lines)',
            '**Phase 4**: Updated BlogRenderer.applyFilter to check all contributors, not just modelId',
            '**Phase 5**: Split generic Claude credits between Zee & ZeeRah for balanced attribution'
        ]
    },

    codeSnippets: [
        {
            title: 'Contributor Extraction',
            badge: 'EntryCardUtils.ts',
            lang: 'typescript',
            code: `export function extractContributorIds(entry: BlogEntry): string[] {
    const ids = new Set<string>();

    // 1. Primary: modelId
    if (entry.modelId) ids.add(entry.modelId);

    // 2. crew[] array
    if (entry.crew) {
        for (const member of entry.crew) {
            const id = NAME_TO_ID[member.name];
            if (id) ids.add(id);
        }
    }

    // 3. crewAttribution.systems[]
    if (entry.crewAttribution?.systems) {
        for (const member of entry.crewAttribution.systems) {
            const id = NAME_TO_ID[member.name];
            if (id) ids.add(id);
        }
    }

    // 4. collaborators[] (string array)
    if (entry.collaborators) {
        for (const name of entry.collaborators) {
            const id = NAME_TO_ID[name];
            if (id) ids.add(id);
        }
    }

    return Array.from(ids);
}`
        },
        {
            title: 'Portrait Strip CSS',
            badge: 'Inline styles',
            lang: 'css',
            code: `.contributor-portrait {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    animation: portrait-fade-in 0.3s ease forwards;
    animation-delay: var(--anim-delay, 0ms);
}

.contributor-portrait:hover {
    border-color: var(--chef-color, #00ff88);
    box-shadow: 0 0 8px var(--chef-color, #00ff88);
    transform: scale(1.15);
}

.contributor-portrait.is-primary {
    width: 40px;
    height: 40px;
    border-color: var(--chef-color);
    box-shadow: 0 0 4px var(--chef-color);
}`
        },
        {
            title: 'Event-Based Filter Wiring',
            badge: 'Decoupled communication',
            lang: 'typescript',
            code: `// EntryCardBuilder: dispatch on click
window.dispatchEvent(new CustomEvent('uv7:filter:crew', {
    detail: { chefId }
}));

// JournalFilterBar: listen and activate
window.addEventListener('uv7:filter:crew', (e) => {
    const { chefId } = e.detail;
    this.filterByChef(chefId);
});`
        }
    ],

    metrics: {
        'EntryCardUtils.ts': '+100 lines',
        'EntryCardBuilder.ts': '+80 lines',
        'JournalFilterBar.ts': '+40 lines',
        'BlogRenderer.ts': '+4 lines',
        'Portrait Sizes': '36px regular, 40px primary',
        'Max Visible': '4 portraits + overflow',
        'Animation Stagger': '50ms per portrait',
        'TypeScript Errors': '0'
    },

    crew: [
        {
            name: 'DiZee (Claude Opus 4.5)',
            icon: '🔪',
            contribution: 'Implementation, architecture, CSS, event wiring, this entry'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'Feature spec, UX direction, size feedback, generic credit distribution idea'
        }
    ],

    lessons: [
        'Attribution should be visible, not buried — put contributors where readers actually look',
        'Click-to-filter creates discovery loops that turn passive reading into active exploration',
        'Signature colors create instant recognition even at thumbnail size',
        'Event-based communication keeps components decoupled and extensible',
        'Generic AI credits can be distributed to give underrepresented personas visibility',
        'Scaling gracefully (overflow indicators) prevents layout jank with variable contributor counts'
    ],

    quote: 'I\'m cooking with a party of S-rank adventurers. Each idea gives us more XP — that\'s why our projects keep getting more polished the more we do.',

    footer: {
        icon: '👨‍🍳',
        text: 'A little more MSG, a lot more flavor.'
    }
};
