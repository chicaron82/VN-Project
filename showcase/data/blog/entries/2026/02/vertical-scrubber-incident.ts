import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'vertical-scrubber-incident-feb-2026',
    date: 'Feb 1, 2026',
    sortDate: '2026-02-01T20:00:00',
    title: 'The Vertical Scrubber Incident: A Lesson in Planning',
    type: 'chaos-entry',
    emoji: '📍',
    tags: ['Debug Hell', 'Process Improvement', 'Collaboration', 'Lessons Learned'],
    summary: 'We spent two hours debugging a "simple" vertical scrubber feature because we skipped planning and dove straight into implementation. CSS said vertical, JavaScript said horizontal, and chaos ensued. This is the story of how a coordinate system mismatch led to rewriting our collaboration protocols.',
    highlights: [
        'Bug #1: Scrubber created but not visible (positioning issue)',
        'Bug #2: Visible but not interactive (coordinate system mismatch)',
        'Bug #3: Interactive but overflowing viewport (container constraints)',
        'Bug #4: Positioned but disproportionate (flex sizing)',
        'Updated CLAUDE.md with "Stop Before Start" protocol template',
        'Established trust contract: "Plan means already debugged"'
    ],
    callout: {
        icon: '🛑',
        title: 'The Trust Contract',
        text: 'When we approve a plan, we\'re trusting it\'s been properly thought through. "Let\'s cook" works best when you have a recipe first. 5 minutes planning > 2 hours debugging.'
    },
    problem: {
        description: 'Fast iteration culture led to "implement now, fix later" pattern. We jumped into converting the scrubber from horizontal to vertical orientation without planning the coordinate system changes, viewport constraints, or proportional sizing.',
        rootCause: 'Updated CSS for vertical layout but forgot to update JavaScript coordinate system (clientX→clientY, rect.width→rect.height, translateX→top%). Skipped the "Stop Before Start" protocol despite having it in CLAUDE.md.'
    },
    solution: {
        approach: 'Systematic debugging revealed the cascade of issues, then established a stronger planning protocol with explicit trust contract and implementation templates.',
        features: [
            '**Coordinate System Fix:** Changed all JS references from horizontal (clientX, rect.left, rect.width, translateX) to vertical (clientY, rect.top, rect.height, top%)',
            '**Viewport Constraints:** Container positioned from top: 120px (below status bar) to bottom: 40px',
            '**Proportional Sizing:** Track uses flex: 1 to fill container height',
            '**Planning Protocol:** Updated CLAUDE.md with template requiring gotcha identification',
            '**Trust Contract:** "Plan means already debugged" - think through implementation before proposing'
        ],
        steps: [
            '**Debug Phase 1:** Added visual debugging (red/yellow/green borders) to identify clickable areas',
            '**Debug Phase 2:** Discovered coordinate system mismatch - CSS vertical, JS horizontal',
            '**Debug Phase 3:** Fixed viewport overflow with proper container constraints',
            '**Debug Phase 4:** Made track proportional with flex layout',
            '**Process Phase:** Reflected on pattern, updated protocols, established trust contract'
        ]
    },
    lessons: [
        'Orientation changes affect multiple layers (CSS + JS) - update systematically, not piecemeal',
        'Planning isn\'t slowing down, it\'s moving faster by avoiding debugging marathons',
        'Trust requires earning through quality execution, not just enthusiasm',
        'Protocols exist for a reason - follow them even when excited about a feature',
        'Visual debugging early (colored borders) reveals positioning/interaction issues immediately',
        'Coordinate system checklist: X↔Y, left↔top, width↔height, translateX↔translateY, clientX↔clientY'
    ],
    crew: [
        {
            name: 'Claude Sonnet 4.5',
            icon: '🤖',
            contribution: 'Debugged the coordinate system disaster, wrote this honest post-mortem, and updated CLAUDE.md protocols'
        },
        {
            name: 'Aaron (Product)',
            icon: '⚡',
            contribution: 'Recognized the pattern, established the trust contract, and enforced "we do things properly" standard'
        }
    ],
    footer: {
        icon: 'Code',
        text: 'CLAUDE.md: Collaboration Rituals'
    }
};
