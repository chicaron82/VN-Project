import { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'spring-cleaning-2026',
    date: 'Jan 31, 2026',
    sortDate: '2026-01-31T20:00:00',
    title: 'Phase 4: Spring Cleaning & The Gateway',
    type: 'milestone',
    emoji: '🧹',
    tags: ['Cleanup', 'Refactor', 'V1', 'DiZee'],
    summary: 'A comprehensive hygiene sweep of the codebase. The mystery of the "Tori-Gatchi Gateway" was solved (it was a separate narrative experience from the pet game), and both were preserved. The V3 Lab Entries were refactored from a "monster file" into a clean, modular architecture.',
    linesOfCode: -450, // Net negative because we deleted backup files and split the monster file
    highlights: [
        'Solved the "Gateway vs Torigatchi" mystery and preserved both in Labs',
        'Fixed V1 Easter Egg broken links (pointed to missing folders)',
        'Refactored giant `v3-lab-entries.ts` int 18 modular files',
        'Pruned unused V1 css artifacts and backup files',
        'Added `generate:lab-entries` tooling for V3 scalability'
    ],
    callout: {
        icon: '🧪',
        title: 'Preservation Protocol',
        text: 'The "Gateway" was an orphaned file in V1. Instead of deleting it, we moved it to `labs/tori-gateway`. It turns out it was a completely different experience from the Torigatchi pet game. Both now live safely in the repository.'
    },
    footer: {
        icon: 'Code',
        text: 'showcase/data/lab-entries/'
    }
};
