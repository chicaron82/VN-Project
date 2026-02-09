import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'case-of-missing-blog-entries-feb-2026',
    date: 'Feb 9, 2026',
    sortDate: '2026-02-09T14:00:00',
    title: 'The Case of the Missing Blog Entries',
    type: 'debug',
    emoji: '🔍',
    tags: ['Debugging', 'JavaScript', 'Generator', 'Logger', 'DiZee'],
    modelId: 'dizee',
    summary: 'After reorganizing blog entries into year/month folders, the journal tab went completely blank. A classic debugging tale: what seemed like an import issue turned out to be an execution chain blocker. Two bugs, one silent, one fatal.',

    callout: {
        icon: '💥',
        title: 'The Fatal Flaw',
        text: 'BlogAudio called `Logger.audio()` which doesn\'t exist. Uncaught exception → entire initialization chain stopped → BlogRenderer never ran. Classic JavaScript: one unhandled error breaks everything downstream.'
    },

    highlights: [
        '🔍 <strong>The Mystery:</strong> Blog entries stopped displaying after folder reorganization',
        '🕵️ <strong>First Suspect:</strong> Generator importing `types.ts` as blog entries (red herring)',
        '💣 <strong>The Real Culprit:</strong> BlogAudio threw on line 211, killed execution before BlogRenderer on line 246',
        '🔧 <strong>Root Cause:</strong> `Logger.audio()` method doesn\'t exist',
        '✅ <strong>The Fix:</strong> Changed to `Logger.ui()` → execution continues → entries render'
    ],

    details: [
        {
            title: 'The Investigation',
            points: [
                '<strong>Initial Hypothesis:</strong> Folder reorganization broke imports. Generator now scans nested `YYYY/MM/` directories.',
                '<strong>Discovery #1:</strong> Generator picked up `2025/types.ts` and `2026/types.ts` as entries. These files only re-export types, no `entry` const.',
                '<strong>Fix #1:</strong> Added `file !== \'types.ts\'` filter to generator. Reduced from 90 to 88 entries.',
                '<strong>Still Broken:</strong> Blog entries still not displaying despite clean TypeScript compilation.',
                '<strong>The Breakthrough:</strong> Browser console showed BlogAudio error, but no BlogRenderer logs.',
                '<strong>Discovery #2:</strong> BlogAudio (line 211) throws BEFORE BlogRenderer (line 246). Execution never reaches BlogRenderer.'
            ]
        },
        {
            title: 'The Execution Chain',
            points: [
                '<code>main.ts:203-215</code> — Blog enhancements initialized (BlogAnimations, BlogBackgrounds, BlogAudio...)',
                '<code>main.ts:211</code> — BlogAudio throws: <code>Logger.audio is not a function</code>',
                '<code>main.ts:246</code> — BlogRenderer NEVER RUNS (execution stopped)',
                '<strong>Why it\'s silent:</strong> No try-catch, no error boundary. JavaScript just stops.',
                '<strong>Lesson:</strong> Initialization order matters. One bad component kills the entire chain.'
            ]
        },
        {
            title: 'The Fixes',
            points: [
                '<strong>Primary Fix:</strong> <code>BlogAudio.ts:40</code> — Changed <code>Logger.audio()</code> to <code>Logger.ui()</code>',
                '<strong>Secondary Fix:</strong> <code>generate-blog.ts:34</code> — Skip <code>types.ts</code> files when scanning entries',
                '<strong>Defense-in-Depth:</strong> Added logging to BlogRenderer init to catch early returns',
                '<strong>Result:</strong> 88 entries load correctly, journal tab fully functional'
            ]
        },
        {
            title: 'Lessons Learned',
            points: [
                '🎯 <strong>Read the console first:</strong> The error was right there. "Logger.audio is not a function" at BlogAudio.ts:40.',
                '⛓️ <strong>Execution chains are fragile:</strong> One uncaught error breaks everything downstream.',
                '🔍 <strong>Red herrings are real:</strong> The types.ts issue looked plausible but wasn\'t the blocker.',
                '📊 <strong>Logging saves lives:</strong> Added defensive logging to BlogRenderer to catch silent failures.',
                '🏗️ <strong>Initialization order matters:</strong> Blog enhancements should initialize AFTER BlogRenderer, not before.',
                '🛡️ <strong>Consider error boundaries:</strong> try-catch around component initialization could prevent cascade failures.'
            ]
        }
    ],

    achievements: [
        {
            icon: '🔧',
            title: 'Root Cause Found',
            description: 'Logger.audio() doesn\'t exist → BlogAudio throws → BlogRenderer never runs'
        },
        {
            icon: '🧹',
            title: 'Generator Hardened',
            description: 'Now skips types.ts files when scanning for blog entries'
        },
        {
            icon: '📊',
            title: 'Defensive Logging',
            description: 'Added early-return logging to catch silent failures'
        }
    ],

    metrics: {
        '2 Bugs': 'One silent (types.ts imports), one fatal (Logger.audio)',
        '88 Entries': 'Correctly discovered after excluding types.ts files',
        '1 Line': 'The fix: Logger.audio() → Logger.ui()',
        '35 Minutes': 'From "entries missing" to "all working"'
    },

    codeSnippets: [
        {
            title: 'The Killer Line',
            badge: 'BlogAudio.ts:40',
            lang: 'typescript',
            code: `// ❌ BEFORE (throws exception)
Logger.audio('🔊 [BlogAudio] Initialized...');

// ✅ AFTER (works)
Logger.ui('🔊 [BlogAudio] Initialized...');`
        },
        {
            title: 'Generator Filter Fix',
            badge: 'generate-blog.ts:34',
            lang: 'typescript',
            code: `// ❌ BEFORE (picks up types.ts)
if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
    results.push(filePath);
}

// ✅ AFTER (skips types.ts)
if (file.endsWith('.ts') && !file.endsWith('.d.ts') && file !== 'types.ts') {
    results.push(filePath);
}`
        },
        {
            title: 'Defensive Logging',
            badge: 'BlogRenderer.ts:60-77',
            lang: 'typescript',
            code: `async init(): Promise<void> {
    if (!this.container) {
        Logger.error('[BlogRenderer] Container not found!');
        return;
    }

    Logger.ui('[BlogRenderer] Initializing with container:', this.container);

    this.createSignalTrack();
    await this.loadTimelineData();
    Logger.ui('[BlogRenderer] Loaded', this.currentEntries.length, 'entries');

    this.renderStatsContainer();
    this.renderTimeline();
    Logger.ui('[BlogRenderer] Rendered timeline');

    this.setupInteractions();
}`
        }
    ],

    collaborators: ['DiZee'],
    flavor: 'A debugging mystery where the obvious suspect (folder reorganization) turned out to be a red herring. The real killer was hiding in plain sight: a single undefined method call that silently murdered the entire initialization chain. Classic JavaScript execution fragility.'
};
