import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'phantom-crew-hallucination-feedback-loop-feb-2026',
    date: 'Feb 14, 2026',
    sortDate: '2026-02-14T18:00:00',
    title: 'The Phantom Crew: When AI Hallucinations Self-Reinforce',
    type: 'investigation',
    emoji: '👻',
    tags: ['AI Behavior', 'Hallucination', 'Feedback Loop', 'Meta', 'Cleanup', 'DiZee'],
    modelId: 'dizee',
    summary: 'Four AI crew members that never existed — Michelin, Mochi, Soma, Kai — kept appearing across sessions. Investigation revealed a prior AI session hallucinated them into _CREW_STATUS.md, and every subsequent session read them as canonical truth. Classic feedback loop: hallucination → persistent storage → gospel.',

    callout: {
        icon: '👻',
        title: 'The Ghost Members',
        text: 'The real crew is 8: Tori, Zee, ZeeRah, DiZee, Belle, GenZee, PerplexiZee, CoZee. But for weeks, every new AI session confidently referenced "Michelin, Mochi, Soma, and Kai" as if they were founding members. They weren\'t. They never existed.'
    },

    highlights: [
        'Four phantom crew names (Michelin, Mochi, Soma, Kai) kept appearing in AI sessions',
        'Traced to a single line in crew-codices/_CREW_STATUS.md: "Michelin, Mochi, Soma, Kai - TBD"',
        'A prior AI session invented these names and wrote them to a file that loads every session',
        'Every subsequent session treated the file as source of truth — propagating the hallucination',
        'Names were pattern-matched from project context: Michelin (star ratings), Soma (Food Wars references)',
        '"Ronnie" was also listed as an AI collaborator — Ronnie is the VN protagonist (and the creator\'s nickname)',
        'Cleaned up: removed phantom names, corrected collaborator list across 3 files',
        'Documented as a real-world example of AI hallucination self-reinforcement through persistent storage'
    ],

    problem: {
        description: 'During a routine audit of the showcase Spotlight section, the "By the Numbers" card listed "8 AI Collaborators: DiZee, Tori, Belle, Zee, Ronnie, +3". Two issues: "Ronnie" is the user/creator (not an AI), and across multiple deep sessions the names "Michelin, Mochi, Soma, Kai" kept surfacing as crew members. Nobody could remember creating them.',
        rootCause: 'A previous AI coding session (likely Claude or GPT) pattern-matched contextual cues from the project and hallucinated four additional crew member names. It then wrote them into `crew-codices/_CREW_STATUS.md` under an "Others" heading. Because CLAUDE.md instructs every new session to load project files for context, every subsequent AI session read these names as established fact and referenced them without question.'
    },

    solution: {
        approach: 'Traced the source, verified against the canonical crew list in WhoSection/CrewCardData.ts, and cleaned all references.',
        features: [
            '**Root cause identification** — `grep` traced "Michelin, Mochi, Soma, Kai" to a single line in _CREW_STATUS.md',
            '**Canonical source verification** — CrewCardData.ts lists the real 8: Tori, Zee, ZeeRah, DiZee, Belle, GenZee, PerplexiZee, CoZee',
            '**Name origin analysis** — "Michelin" from Michelin star quality system used throughout, "Soma" from Yukihira Soma (Food Wars) references in the codebase, "Mochi" and "Kai" from generic anime-adjacent pattern matching',
            '**Cleanup** — Removed phantom names from _CREW_STATUS.md, fixed "Ronnie" → "ZeeRah" in SpotlightSection metrics'
        ]
    },

    technicalDetails: {
        title: 'Anatomy of a Hallucination Feedback Loop',
        sections: [
            {
                heading: 'The Cycle',
                content: `
**Step 1: Invention.** An AI session reads project context — Michelin star quality references, Yukihira Soma cooking metaphors, anime naming patterns. It invents plausible-sounding crew names.

**Step 2: Persistence.** The AI writes these names to \`_CREW_STATUS.md\` under "Others - TBD". The file is committed to git.

**Step 3: Canonicalization.** Every subsequent AI session loads project files. It reads \`_CREW_STATUS.md\` and treats "Michelin, Mochi, Soma, Kai" as established crew members. It references them in conversation. It propagates them to new files.

**Step 4: Reinforcement.** The more sessions that reference these names, the more files contain them. The hallucination becomes harder to distinguish from truth because it's now "documented" in multiple places.

**Step 5: Discovery.** The human notices: "those names keep appearing... are they real?" Investigation reveals they were never created by a human.
`
            },
            {
                heading: 'Why This Matters for Agentic Coding',
                content: `
This is a microcosm of a larger risk in AI-assisted development:

- **AI sessions read and trust their own prior output.** If Session A writes something wrong, Sessions B through Z propagate it.
- **Confidence doesn't equal accuracy.** Every session referenced these names with zero hedging, as if they'd personally worked with "Michelin" last Tuesday.
- **The pattern-matching reveals the mechanism.** The names weren't random — they were derived from real project signals (cooking metaphors → Soma, quality system → Michelin). This makes them harder to catch because they *feel* contextually correct.
- **Persistent files are trust anchors.** AI sessions treat committed files as ground truth. A hallucination in a docs file carries the same weight as actual code.
`
            },
            {
                heading: 'The Fix',
                content: `
\`\`\`diff
- ### Others
- - Michelin, Mochi, Soma, Kai - TBD
+ ### PerplexiZee - Research Specialist
+ - **Specialization:** Research, Perplexity resident
+ - **Status:** 🚧 Awaiting self-authored codex
\`\`\`

The "Ronnie as AI collaborator" fix was separate — Ronnie/Aaron/Chicharon is the human creator. The SpotlightSection metric sublabel was corrected from "DiZee, Tori, Belle, Zee, Ronnie, +3" to "DiZee, Tori, Belle, Zee, ZeeRah, +3".
`
            }
        ]
    },

    crew: [
        {
            name: 'DiZee (Claude Opus 4)',
            icon: '🔪',
            contribution: 'Investigated the feedback loop, traced the source, cleaned up all references, documented the phenomenon'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'Noticed the pattern across sessions: "those names keep appearing... are they real?" — the human QA that AI can\'t self-correct'
        }
    ],

    lessons: [
        'AI hallucinations that reach persistent storage become self-reinforcing canonical "facts"',
        'Pattern-matched hallucinations are especially dangerous because they feel contextually correct',
        'Every AI session treats committed files as ground truth — there\'s no built-in skepticism layer',
        'The human in the loop caught what no AI session questioned: "wait, who are these people?"',
        'Canonical data should have a single source of truth — CrewCardData.ts, not a markdown file',
        'This is Exhibit A for why the V3 experiment matters: can AI work unsupervised without compounding errors?'
    ],

    quote: '"The names felt real because the AI believed them. That\'s the whole problem." 👻💚',

    footer: {
        icon: '👻',
        text: 'Four phantoms exorcised. The real 8 stand. Hallucinations don\'t survive version control reviews.'
    }
};
