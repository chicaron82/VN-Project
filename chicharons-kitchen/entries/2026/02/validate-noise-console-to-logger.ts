import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'validate-noise-console-to-logger-feb-2026',
    date: 'Feb 9, 2026',
    sortDate: '2026-02-09T12:00:00',
    title: 'Chef Loop: Silencing validate spam (console → Logger)',
    type: 'hygiene',
    emoji: '🧼',
    tags: ['Logging', 'Testing', 'Hygiene', 'V2', 'Refactor'],
    summary: 'A focused hygiene session: migrate high-chatter runtime console logs to the centralized v2 Logger so `npm run validate` stays green and the output gets quieter. Small batches, behavior-preserving diffs, validate after each batch — and the console audit ends at 0 runtime matches.',

    problem: {
        description: 'Validation runs were noisy because many runtime modules printed directly to console during tests (timers, auto-save, accessibility, collectibles, bootstrap timeline, etc.). The noise made it harder to spot real failures.',
        rootCause: 'Mixed logging strategies: V2 already has a category-based Logger, but several modules still used direct `console[\'log\']/console[\'warn\']/console[\'error\']/console[\'debug\']`, which Vitest surfaces as stdout/stderr in validate output.'
    },

    solution: {
        approach: 'Incrementally migrate `console.*` to `Logger.*` (category-based) to keep behavior the same while letting test runs suppress/centralize logging. Verify progress with both `npm run validate` and the runtime console audit script.',
        features: [
            'Converted loud modules to Logger categories (`system`, `input`, `ui`, `save`, plus `warn`/`error`)'
        ],
        steps: [
            'Target the worst offenders visible in validate output',
            'Replace `console.*` with `Logger.*` (no functional changes)',
            'Run `npm run validate` to confirm 117/117 files and 1170/1170 tests still pass',
            'Run `node scripts/console-audit.mjs` until runtime matches reach 0'
        ]
    },

    highlights: [
        'Migrated AutoRead timer logs to Logger (quiet in tests)',
        'Migrated AccessibilityManager preference/init logs to Logger',
        'Migrated AutoSaveManager save/backup lifecycle logs to Logger',
        'Migrated BootstrapTracker / PauseManager / CollectiblesSystem / InputBinder / SaveLoadModal logs to Logger',
        'Migrated remaining V2 UI stragglers (AppSwitcher + dialogs + GameLayout/settings)',
        'Re-ran `npm run validate` after batches: still green (1170 tests)',
        'Console audit: runtime matches (excluding tests) reached 0'
    ],

    metrics: {
        'Validate': 'Green (1170 tests)',
        'Console audit': '0 runtime matches (excluding tests)',
        'Strategy': 'Small batch → validate → proceed → audit'
    },

    nextSteps: [
        'Keep new runtime logs going through `v2/utils/Logger.ts` so the audit stays at 0.'
    ],

    commits: [
        {
            hash: 'fb95bd0',
            message: 'chore(logging): batch migrate v2 console usage',
            files: [
                'v2/systems/InputBinder.ts',
                'v2/systems/SceneRenderer.ts',
                'v2/ui/components/appswitcher/AppCatalog.ts'
            ]
        },
        {
            hash: '0e5bacc',
            message: 'chore(logging): migrate v2 appswitcher+dialog logs',
            files: [
                'v2/ui/components/ConfirmationDialog.ts',
                'v2/ui/components/appswitcher/AppSwitcherSaveManager.ts',
                'v2/ui/components/appswitcher/BackgroundMonitor.ts'
            ]
        },
        {
            hash: '36806e3',
            message: 'chore(logging): remove remaining v2 runtime console',
            files: [
                'v2/ui/components/GameLayout.ts',
                'v2/ui/components/UV7AppSwitcher.ts',
                'v2/ui/components/settings/SettingsPersistence.ts'
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
