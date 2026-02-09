import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'validate-noise-console-to-logger-feb-2026',
    date: 'Feb 8, 2026',
    sortDate: '2026-02-08T12:00:00',
    title: 'Chef Loop: Silencing validate spam (console → Logger)',
    type: 'hygiene',
    emoji: '🧼',
    tags: ['Logging', 'Testing', 'Hygiene', 'V2', 'Refactor'],
    summary: 'A focused hygiene session: migrate high-chatter runtime console logs to the centralized v2 Logger so `npm run validate` stays green and the output gets quieter. Small batches, behavior-preserving diffs, validate after each batch.',

    problem: {
        description: 'Validation runs were noisy because many runtime modules printed directly to console during tests (timers, auto-save, accessibility, collectibles, bootstrap timeline, etc.). The noise made it harder to spot real failures.',
        rootCause: 'Mixed logging strategies: V2 already has a category-based Logger, but several modules still used direct `console[\'log\']/console[\'warn\']/console[\'error\']/console[\'debug\']`, which Vitest surfaces as stdout/stderr in validate output.'
    },

    solution: {
        approach: 'Incrementally migrate `console.*` to `Logger.*` (category-based) to keep behavior the same while letting test runs suppress/centralize logging.',
        features: [
            'Converted loud modules to Logger categories (`system`, `input`, `ui`, `save`, plus `warn`/`error`)'
        ],
        steps: [
            'Target the worst offenders visible in validate output',
            'Replace `console.*` with `Logger.*` (no functional changes)',
            'Run `npm run validate` to confirm 117/117 files and 1170/1170 tests still pass'
        ]
    },

    highlights: [
        'Migrated AutoRead timer logs to Logger (quiet in tests)',
        'Migrated AccessibilityManager preference/init logs to Logger',
        'Migrated AutoSaveManager save/backup lifecycle logs to Logger',
        'Migrated BootstrapTracker / PauseManager / CollectiblesSystem / InputBinder / SaveLoadModal logs to Logger',
        'Re-ran `npm run validate` after batches: still green (1170 tests)'
    ],

    metrics: {
        'Validate': 'Green (1170 tests)',
        'Strategy': 'Small batch → validate → proceed'
    },

    nextSteps: [
        'Continue targeting remaining validate spam in UI components (UV7OS, Sidebar, StatusBar preview, SecretCodesSystem) while avoiding tests that assert on console output.'
    ],

    commits: [
        {
            hash: '7b1a265',
            message: 'chore(logging): migrate noisy v2 console output to Logger',
            files: [
                'v2/core/AutoReadController.ts',
                'v2/managers/AccessibilityManager.ts',
                'v2/managers/AutoSaveManager.ts',
                'v2/systems/CollectiblesSystem.ts',
                'v2/systems/InputBinder.ts',
                'v2/systems/BootstrapTracker.ts',
                'v2/managers/PauseManager.ts',
                'v2/ui/components/SaveLoadModal.ts'
            ]
        }
    ],

    crewAttribution: {
        systems: [
            {
                name: 'GPT-5.2 (GitHub Copilot)',
                icon: '🤖',
                contribution: 'Implemented small, behavior-preserving console→Logger migrations and verified with validate runs'
            },
            {
                name: 'Aaron (Chef-in-Chief)',
                icon: '🧠',
                contribution: 'Set the operating mode: “idea → test → proceed”, prioritize safety and keep validate green'
            }
        ]
    },

    footer: {
        icon: 'Logs',
        text: 'v2/utils/Logger.ts'
    },

    status: 'completed'
};
