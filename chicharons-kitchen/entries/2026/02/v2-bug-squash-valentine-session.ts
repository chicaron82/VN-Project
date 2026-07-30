import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'v2-bug-squash-valentine-session-feb-2026',
    date: 'Feb 14, 2026',
    sortDate: '2026-02-14T21:00:00',
    title: 'Bug Squash Session: 9 Fixes, Zero Regressions',
    type: 'highlight',
    emoji: '🪲',
    tags: ['V2', 'Bug Fixes', 'Stabilization', 'CSS', 'Keyboard', 'EventBus', 'DevSuite'],
    modelId: 'dizee',
    summary: 'A Valentine\'s Day bug-hunting session that uncovered 9 issues across V2 — from Enter keys bleeding through overlays, to invisible sprite effects, to a crew screen with zero working CSS selectors. Every class name in crew-screen.css was wrong. 1,397 tests. All green.',

    callout: {
        icon: '🔪',
        title: 'The Kitchen Audit Revealed What Playtesting Missed',
        text: 'Nine bugs, three root cause categories: keyboard events ignoring overlays, event names that didn\'t match between emitter and listener, and CSS class names that were copy-pasted from V1 without updating to V2\'s naming convention. Each one invisible to the test suite but obvious the moment you clicked.'
    },

    highlights: [
        '**Bug 1 — Enter key bleeds through settings**: 3 keyboard handlers (InputController, CarouselMomentum, SimpleCarousel) lacked overlay guards',
        '**Bug 2 — Secret codes silently fail**: SettingsModal emitted `secret_code:submit` but SecretCodesSystem listened for `ui:code_submit`',
        '**Bug 3 — DevSuite has no activation path**: No `openconsole`/`hideconsole` dev commands existed, no `ui:console:open` event defined',
        '**Bug 4 — DevSuite CSS missing**: V2 had no dev-suite.css import — switched to V1 source of truth (zero duplication)',
        '**Bug 5 — Choice branches hidden behind dialog**: Choices z-index was 100, dialog was 200. Bumped choices to 300',
        '**Bug 6 — fadeSpritesSequence invisible**: ContentLoader normalized sprite/background paths but forgot effect sprite1/sprite2',
        '**Bug 7 — BougieTracker shows "calculating..."**: Template cloning creates 7 footer copies with duplicate IDs, `getElementById` only finds the first',
        '**Bug 8 — Boot skip 2-second black screen**: Skip path emitted code_rain before VisualEffectsLayer existed, then waited 1500ms for nothing',
        '**Bug 9 — Crew Screen completely unstyled**: Every CSS selector was a V1 class name (`.credit-screen`, `.portrait-display`) but the TS used V2 names (`.crew-slide`, `.crew-portrait-display`)'
    ],

    problem: {
        description: 'V2 passed 1,397 tests but had 9 runtime bugs spanning keyboard input, event wiring, z-index hierarchy, asset path normalization, template cloning, boot sequence timing, and CSS-to-component class name mismatches.',
        rootCause: 'Three systemic root causes: (1) Keyboard handlers never checked if overlays were open, (2) Event names diverged between emitters and listeners during the V1→V2 port, (3) CSS files were ported from V1 verbatim without updating class names to match V2 component conventions.'
    },

    solution: {
        approach: 'Hands-on playtesting followed by surgical fixes — each bug traced to root cause, fixed at the source, and verified against the full test suite.',
        features: [
            '**Overlay guard pattern** — `isAnyOverlayOpen()` check added to InputController, CarouselMomentum, and SimpleCarousel keyboard handlers',
            '**Input field guard** — `tagName === INPUT/TEXTAREA/SELECT` check prevents Enter/Space from advancing dialog while typing',
            '**Event name alignment** — `secret_code:submit` → `ui:code_submit` to match SecretCodesSystem listener',
            '**DevSuite activation** — `openconsole`/`hideconsole` commands + `ui:console:open` event + lazy init in main.ts',
            '**CSS source of truth** — V2 imports V1\'s dev-suite.css directly instead of duplicating it',
            '**Z-index hierarchy fix** — choices(300) > dialog(200) > sprites(40)',
            '**Effect path normalization** — `sprite1`/`sprite2` in effects now go through `normalizeAssetPath()` like sprites and backgrounds',
            '**BougieTracker multi-element** — `getElementById` → `querySelectorAll(\'.tracker-time\')` updates all 7 footer clones',
            '**Boot skip instant resolve** — Removed dead 1500ms setTimeout and useless code_rain emit (no listener existed yet)',
            '**Crew screen CSS rewrite** — All 15+ selectors updated from V1 names to V2 crew- prefix naming convention'
        ]
    },

    technicalDetails: {
        title: 'The Bug Anatomy',
        sections: [
            {
                heading: 'The Keyboard Bleed-Through (Bugs 1)',
                content: `
Three independent keyboard handlers — InputController (dialog advance), CarouselMomentum (route select navigation), and SimpleCarousel (portrait mode) — all processed keystrokes without checking if a modal was open.

**Symptom:** Press Enter to submit a secret code in Settings → dialog advances behind the overlay. Press arrow keys while Settings is open → carousel scrolls underneath.

**Fix:** Added \`isAnyOverlayOpen()\` method to all three, checking 6 overlay IDs (notes, backlog, settings, save/load, sidebar, dev-console). Also added input field guard so typing in the secret code input doesn't trigger dialog advance.
                `
            },
            {
                heading: 'The Event Name Mismatch (Bug 2)',
                content: `
SettingsModal submitted codes with \`eventBus.emit('secret_code:submit', { code })\`.
SecretCodesSystem listened with \`eventBus.on('ui:code_submit', ...)\`.

Two different strings. Zero TypeScript errors because the old event name wasn't in the type definition. Codes entered, nothing happened, no error in console.

**Fix:** One-line change in SettingsModal: \`'secret_code:submit'\` → \`'ui:code_submit'\`.
                `
            },
            {
                heading: 'The Invisible Sprites (Bug 6)',
                content: `
ContentLoader's \`normalizeAssetPath()\` converts \`assets/x\` → \`../assets/x\` for sprites and backgrounds (V2 serves from /v2/, needs to reach root /assets/). But it never ran on effect objects' \`sprite1\`/\`sprite2\` fields.

Browser tried to load \`url('assets/full-sprite-ronnie.webp')\` instead of \`url('../assets/full-sprite-ronnie.webp')\`. 404. No image. The fade animation ran perfectly — on invisible elements.

**Fix:** Added normalization loop in the effects processing block, same pattern as sprites.
                `
            },
            {
                heading: 'The Template Cloning Trap (Bug 7)',
                content: `
FooterInjector clones a \`<template id="footer-template">\` into 7 tab footers. Each clone carries \`id="bougie-timer"\`. \`getElementById\` returns the first match only. BougieTracker updates that one element. The other 6 tabs show "calculating..." forever.

CoZee (another AI) diagnosed this as "BougieTracker isn't instantiated in main.ts." It was — at line 351. The real bug was duplicate IDs from template cloning.

**Fix:** Changed to \`querySelectorAll('.tracker-time')\` and \`forEach\` update loop.
                `
            },
            {
                heading: 'The 2-Second Black Screen (Bug 8)',
                content: `
Boot skip sequence: (1) remove splash immediately → black screen, (2) emit \`effect:code_rain\` → no listener exists yet (VisualEffectsLayer created AFTER boot resolves), (3) \`setTimeout(() => resolve(), 1500)\` → 1.5 seconds of dead air.

The code rain fired into the void. The timeout waited for nothing.

**Fix:** \`resolve()\` immediately on skip. \`init()\` creates VisualEffectsLayer, fires code_rain, shows menu — all in the correct order with zero delay.
                `
            },
            {
                heading: 'The Zero-Match CSS (Bug 9)',
                content: `
crew-screen.css was ported from V1's \`endings.css\` with its original class names. CrewScreen.ts was written independently with \`crew-\` prefixed names. Every single CSS selector was wrong:

\`\`\`
CSS had:          TS generates:
.credit-screen    .crew-slide
#btn-next-crew    .crew-next-btn
.portrait-display .crew-portrait-display
.credits-group-*  .crew-group-*
\`\`\`

15+ selectors. Zero matches. The entire crew gallery rendered as raw unstyled HTML — no layout, no borders, no colors, no responsive behavior.

**Fix:** Rewrote all CSS selectors to match V2's \`crew-\` prefix convention. Added missing styles for close button and reveal screen.
                `
            }
        ]
    },

    metrics: {
        'Bugs Fixed': '9',
        'Files Changed': '15',
        'Tests (Final)': '1,397 ✅',
        'Test Regressions': '0',
        'CSS Selectors Fixed': '15+',
        'Keyboard Handlers Patched': '3',
        'Event Names Aligned': '2',
        'Z-Index Fixes': '1',
        'Dead Timeouts Removed': '1'
    },

    codeSnippets: [
        {
            title: 'Overlay Guard Pattern (shared across 3 handlers)',
            badge: 'InputController.ts',
            lang: 'typescript',
            code: `private isAnyOverlayOpen(): boolean {
    const isVisible = (id: string, className?: string): boolean => {
        const el = document.getElementById(id);
        if (!el) return false;
        if (className) return el.classList.contains(className);
        return el.style.display !== 'none' && el.style.display !== '';
    };

    return !!(
        isVisible('notes-overlay') ||
        isVisible('backlog-overlay') ||
        isVisible('settings-menu') ||
        isVisible('save-load-overlay') ||
        isVisible('sidebar', 'visible') ||
        isVisible('dev-console')
    );
}`
        },
        {
            title: 'Effect Path Normalization',
            badge: 'ContentLoader.ts',
            lang: 'typescript',
            code: `// Normalize asset paths inside effects (sprite1, sprite2)
if (effects) {
    effects = effects.map((effect: Record<string, unknown>) => {
        const normalized = { ...effect };
        if (typeof normalized.sprite1 === 'string') {
            normalized.sprite1 = this.normalizeAssetPath(normalized.sprite1);
        }
        if (typeof normalized.sprite2 === 'string') {
            normalized.sprite2 = this.normalizeAssetPath(normalized.sprite2);
        }
        return normalized;
    });
}`
        },
        {
            title: 'BougieTracker Multi-Element Fix',
            badge: 'BougieTracker.ts',
            lang: 'typescript',
            code: `// Use class selector — template cloning creates multiple
// footers with same id
this.timerElements = Array.from(
    document.querySelectorAll('.tracker-time')
);

// Update ALL footer instances (one per tab)
this.timerElements.forEach(el => {
    el.textContent = timeString;
});`
        }
    ],

    lessons: [
        'Keyboard handlers MUST check for open overlays — modals don\'t automatically capture keyboard focus in custom UIs',
        'Event name mismatches between emitter and listener produce zero errors — TypeScript can\'t catch strings that aren\'t in the type definition',
        'Template cloning with `cloneNode(true)` duplicates IDs — use class selectors for elements that get cloned',
        'CSS ported from one codebase needs its selectors verified against the actual component — class names diverge silently',
        'Boot sequence timing matters: don\'t emit events before the listener exists, don\'t `setTimeout` for effects that never fired',
        'Another AI\'s diagnosis can be confidently wrong — always verify the actual code before implementing a suggested fix'
    ],

    crew: [
        {
            name: 'DiZee (Claude Opus 4.6)',
            icon: '🔪',
            contribution: 'All 9 bug fixes — root cause analysis, surgical patches, CSS rewrite, test verification. Zero regressions across 1,397 tests.'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'Live playtesting, bug discovery, brought CoZee\'s BougieTracker diagnosis (correctly overruled), directed the session.'
        }
    ],

    quote: {
        text: 'The kitchen audit revealed what playtesting missed.',
        author: 'DiZee',
        context: 'After fixing 9 bugs that all passed the test suite'
    },

    footer: {
        icon: '🪲',
        text: '9 bugs. 15 files. 0 regressions. Valentine\'s Day, spent squashing bugs with the crew. 💚🔥💀'
    }
};
