import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'v2-runtime-polish-session-feb-2026',
    date: 'Feb 14, 2026',
    sortDate: '2026-02-14T12:00:00',
    title: 'V2 Runtime Polish: 7 Bugs, 7 Fixes, 0 Remaining',
    type: 'bugfix',
    emoji: '🔧',
    tags: ['V2', 'Polish', 'CSS', 'Sprites', 'UI', 'Bugfix'],
    modelId: 'dizee',
    summary: 'V2 is structurally clean — god files decomposed, TypeScript strict, 1313 tests green. But running it revealed 7 runtime bugs from asset paths to sprite sizing to sidebar ghosts. This session was the first real "play it and fix what breaks" pass. V2 can now evolve on its own terms.',

    callout: {
        icon: '🪞',
        title: 'The Mirror Test',
        text: 'Architecture looks great on paper. Then you actually load the page and nothing renders. Backgrounds missing, sprites hobbit-sized, sidebar closing itself, secret codes crashing. The code was clean — the experience was broken. This session bridged the gap.'
    },

    highlights: [
        'CSS now owns ALL sprite positioning — stripped every inline style.cssText from SpriteController',
        'Asset paths fixed: ContentLoader normalizes `assets/foo` → `../assets/foo` (Vite root mismatch)',
        'Route select sprites switched from hardcoded `/assets/` to GameConfig constants',
        'Dialogue newlines render correctly — JSON `\\\\n` → real `\\n` via processDialogText()',
        'Echo sprites: flex layout → absolute positioning (46% width each, overlapping cluster)',
        'Echo growth stages persist across scene changes (was finding stale DOM elements)',
        'Sidebar double-toggle eliminated (two toggle paths firing: click + delayed EventBus)',
        'Secret codes: added missing updateCodesUI() method + Enter key no longer bubbles through'
    ],

    problem: {
        description: 'V2 compiled clean and had 1313 passing tests, but loading the actual game revealed 7 distinct runtime bugs: no backgrounds/sprites visible, route select images broken, dialogue newlines not rendering, echo sprites too small, echo growth stages resetting between scenes, sidebar closing immediately after opening, and secret codes crashing with "updateCodesUI is not a function".',
        rootCause: 'Multiple independent causes: (1) Vite root at project root but assets at `/assets/` created path mismatches, (2) CSS couldn\'t control sprite sizing because inline styles took priority, (3) Echo group DOM wasn\'t cleaned up between scenes so querySelector found stale elements, (4) Two independent toggle mechanisms fought each other for sidebar control, (5) SecretCodesSystem never implemented the updateCodesUI method that SettingsModal expected.'
    },

    solution: {
        approach: 'Play the game, find what\'s broken, fix it at the architectural level (not band-aids), run tests, commit. Each fix was a proper root-cause solution, not a workaround.',
        features: [
            '**Asset Path Normalization** — ContentLoader.normalizeAssetPath() converts scene data paths for Vite\'s root context',
            '**CSS-First Sprite Layout** — All positioning moved to sprites.css; SpriteController creates DOM, CSS positions it',
            '**Absolute Positioning for Echoes** — 70% width group, each sprite 46% width, right-anchored at 52%/26%/0%',
            '**DOM Cleanup Protocol** — displayEchoGroup() removes existing #echo-group before creating new one',
            '**Single Toggle Authority** — Sidebar.ts click handler is the sole toggle; GrabHandle only does haptic on tap',
            '**SecretCodesSystem.updateCodesUI()** — Renders discovered codes list, updates count, wires click handlers'
        ],
        steps: [
            '**Commit 629fc3f**: Strip all inline style.cssText from SpriteController → CSS owns positioning',
            '**Commit 9fef48b**: Add normalizeAssetPath() to ContentLoader + Scene.background type fix + 4 new tests',
            '**Commit b3d3e51**: Route select uses GameConfig, echo sizing attempt, processDialogText() for newlines',
            '**Commit d24b192**: Echo sprites switch to absolute positioning for correct height rendering',
            '**Commit ef23b9a**: Echo group cleanup between scenes + sidebar double-toggle elimination',
            '**Commit 9d13942**: Add updateCodesUI() to SecretCodesSystem + Enter key stopPropagation + dead code cleanup'
        ]
    },

    metrics: {
        'Bugs Found & Fixed': '7',
        'Commits': '6',
        'Files Changed': '~12',
        'Tests Passing': '1313/1313',
        'Test Files': '129',
        'New Tests Added': '4 (ContentLoader)',
        'Breaking Changes': '0',
        'Inline Styles Removed': 'All (SpriteController)'
    },

    codeSnippets: [
        {
            title: 'Asset Path Normalization',
            badge: 'ContentLoader.ts',
            lang: 'typescript',
            code: `private normalizeAssetPath(path: string): string {
    // Scene data uses 'assets/...' but Vite root
    // is project root, so we need '../assets/...'
    if (path.startsWith('assets/')) {
        return '../' + path;
    }
    return path;
}`
        },
        {
            title: 'Echo Group DOM Cleanup',
            badge: 'SpriteController.ts',
            lang: 'typescript',
            code: `displayEchoGroup(sprites: string[]): void {
    // Remove existing echo group to prevent stacking
    const existing = document.getElementById('echo-group');
    if (existing) existing.remove();

    const group = document.createElement('div');
    group.id = 'echo-group';
    // ... create sprites, CSS handles all positioning
}`
        },
        {
            title: 'Dialogue Text Processing',
            badge: 'SystemEventHandlers.ts',
            lang: 'typescript',
            code: `function processDialogText(text: string): string {
    // JSON stores \\\\n which JSON.parse turns into
    // literal backslash + n (two characters).
    // Convert to real newlines for CSS white-space: pre-wrap
    return text.replace(/\\\\n/g, '\\n');
}`
        }
    ],

    lessons: [
        'Clean architecture and passing tests don\'t guarantee a working experience — you have to actually run the thing',
        'Inline styles in JS defeat the purpose of CSS ownership — strip them ruthlessly, even if it means rethinking layout',
        'DOM cleanup between state transitions prevents querySelector from finding stale elements (the echo growth bug)',
        'When two systems can both toggle a UI element, one will always lose — designate a single authority',
        'Asset paths are context-dependent: what works in JSON scene data doesn\'t necessarily work from Vite\'s module root',
        'The gap between "structurally clean" and "actually works" is where polish sessions live'
    ],

    crew: [
        {
            name: 'DiZee (Claude Opus 4.5)',
            icon: '🔪',
            contribution: 'Systematic bug triage — play, identify root cause, fix at architecture level, test, commit. All 7 bugs in one session.'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'QA lead — played V2 live, reported each issue with console errors and reproduction steps. "V2 can evolve on its own now."'
        }
    ],

    quote: 'Architecture is a promise. Polish is keeping it. 💚🔥💀',

    footer: {
        icon: '🔧',
        text: '7 runtime bugs. 6 commits. V2 goes from "compiles clean" to "plays clean."'
    }
};
