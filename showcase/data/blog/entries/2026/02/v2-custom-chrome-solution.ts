import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'v2-custom-chrome-solution-feb-2026',
    date: 'Feb 7, 2026',
    sortDate: '2026-02-07T14:00:00',
    title: 'The Iframe Chrome Solution: Let V2 Own Its Experience',
    type: 'feature',
    emoji: '🎯',
    tags: ['Architecture', 'Chrome', 'V2', 'Iframe', 'Shell', 'Solution'],
    summary: 'Resolved the iframe DOM boundary blocker from Feb 5. Instead of moving V2\'s UI out of the iframe, we flipped the approach: hide ALL shell chrome, give V2 the full viewport, and let V2\'s own StatusBar/Sidebar/NotificationShade take over. Shell becomes a launcher, V2 owns its experience.',
    callout: {
        icon: '💡',
        title: 'The Reframe',
        text: 'Stop trying to move components OUT of the iframe. Instead, let them stay IN the iframe and give them the full viewport. The shell becomes a launcher, not a wrapper.'
    },
    highlights: [
        'Extended customChrome to hide ALL shell chrome (status bar + sidebar + shade)',
        'Added full-viewport CSS class with smooth 300ms transition',
        'Disabled shell gesture router to prevent conflicts with V2\'s gestures',
        'V2 now always creates its own chrome (removed isInShell skip logic)',
        'Context-aware exit buttons: "TO SHELL" when embedded, "EXIT" in standalone',
        'Single postMessage bridge for navigation (v2:navigate:shell)',
        'Removed 60+ lines of dead code from V2App.ts',
        'Fixed NotificationShade quick action buttons (were dead UI with no click handlers)'
    ],
    problem: {
        description: 'Feb 5 investigation discovered that V2\'s iframe architecture creates a hard DOM boundary. V2\'s Sidebar, NotificationShade, and StatusBar are trapped inside the iframe and cannot appear in the parent shell document. Three solutions were proposed but none implemented.',
        rootCause: 'The original approach tried to move UI components OUT of the iframe (via postMessage serialization or direct loading). Both were complex and fragile. The real insight: don\'t fight the iframe boundary. Work with it.'
    },
    solution: {
        approach: 'Invert the problem. Instead of bringing V2\'s chrome to the shell, remove the shell\'s chrome and let V2 fill the viewport. V2\'s components work perfectly inside the iframe — they just need the full screen.',
        features: [
            '**Full Chrome Takeover:** customChrome now hides status bar, sidebar, AND shade (previously only sidebar/shade)',
            '**Full Viewport:** .app-viewport.full-viewport sets top: 0 with smooth CSS transition',
            '**Gesture Isolation:** Shell\'s GestureRouter.destroy() prevents capture-phase listeners from intercepting V2\'s swipe gestures',
            '**Always-On Chrome:** V2 creates StatusBar, Sidebar, NotificationShade in both standalone and shell modes',
            '**Context-Aware Exit:** Sidebar tools layer and NotificationShade quick actions show "TO SHELL" / "Shell" when embedded',
            '**PostMessage Bridge:** Single focused message (v2:navigate:shell) — no complex UI serialization',
            '**Clean Restore:** Unmount flow restores all shell chrome, viewport, and gesture router'
        ],
        steps: [
            '**Step 1:** Added full-viewport CSS class with transition to shell.css',
            '**Step 2:** Extended UV7Shell customChrome handling to hide ALL chrome + expand viewport + disable gesture router',
            '**Step 3:** Rewrote V2App.ts — removed dead placeholder/postMessage code, added v2:navigate:shell listener',
            '**Step 4:** Added isInShell parameter to Sidebar constructor, context-aware exit button on tools layer',
            '**Step 5:** Added isInShell to NotificationShade, context-aware exit buttons, added click delegation for quick actions',
            '**Step 6:** Updated v2/main.ts — always create chrome, pass isInShell, added shell:exit EventBus handler',
            '**Step 7:** Added shell:exit event to GameEvents type in EventBus.ts'
        ]
    },
    technicalDetails: {
        title: 'The Data Flow',
        sections: [
            {
                heading: 'Navigation: Shell to V2',
                content: `
\`\`\`typescript
// User navigates to #/v2 in shell
UV7Shell.loadApp('v2')
  -> V2App.getStatusBarSpec() returns { customChrome: true }
  -> Shell hides ALL chrome (status bar, sidebar, shade)
  -> Viewport expands: .app-viewport.full-viewport { top: 0 }
  -> GestureRouter.destroy() (no more shell gesture conflicts)
  -> V2 iframe loads at full viewport

// Inside iframe:
v2/main.ts
  -> isInShell = (window.parent !== window) // true
  -> Creates StatusBar, Sidebar, NotificationShade
  -> Sidebar tools: "TO SHELL" button (data-action="exit-to-shell")
  -> NotificationShade: "Shell" quick action
  -> User sees V2's full chrome experience
\`\`\`
                `
            },
            {
                heading: 'Navigation: V2 Back to Shell',
                content: `
\`\`\`typescript
// User taps "TO SHELL" in V2's Sidebar or Shade
Sidebar/Shade emits EventBus 'shell:exit'
  -> v2/main.ts handler catches it
  -> window.parent.postMessage({ type: 'v2:navigate:shell' }, '*')
  -> V2App.ts receives message in parent context
  -> window.location.hash = '#/showcase'
  -> Shell Router fires hashchange
  -> UV7Shell unmount flow:
     -> Restore status bar, sidebar, shade display
     -> Remove full-viewport class
     -> GestureRouter.init() re-enables shell gestures
  -> Showcase loads with full shell chrome
\`\`\`
                `
            },
            {
                heading: 'Why This Works',
                content: `
The key insight: **don't fight the iframe boundary**.

V2's Sidebar has swipe gestures, two-layer design, haptic feedback.
V2's NotificationShade has carousel paging, expansion states, note previews.
V2's StatusBar has glassmorphism, breadcrumbs, app switcher.

Serializing all of that over postMessage would be a maintenance nightmare.
Loading V2 without an iframe risks CSS/JS conflicts.

But V2's components already work perfectly **inside** the iframe.
They use \`position: fixed\` which is relative to the iframe viewport.
Give the iframe the full screen, and everything just works.

**The only cross-boundary communication needed: one postMessage to say "I'm done, take me back."**
                `
            },
            {
                heading: 'Bonus: Dead UI Fix',
                content: `
During implementation, discovered that NotificationShade's quick action buttons had \`data-action\` attributes but **no click handlers** — they were dead UI. Added click delegation handler that now makes all quick actions functional (save, load, fullscreen, screenshot, notes, settings, help, exit).
                `
            }
        ]
    },
    commits: [
        {
            hash: 'e3a8b80',
            message: 'feat(shell): let V2 own its chrome when running in shell iframe',
            files: [
                'shell/shell.css',
                'shell/UV7Shell.ts',
                'shell/apps/V2App.ts',
                'v2/core/EventBus.ts',
                'v2/main.ts',
                'v2/ui/components/Sidebar.ts',
                'v2/ui/components/NotificationShade.ts'
            ]
        }
    ],
    metrics: {
        'Files Modified': 7,
        'Lines Added': 148,
        'Lines Removed': 117,
        'Dead Code Removed': '60+ lines',
        'PostMessage Types': '1 (down from 6 dead ones)',
        'Bugs Fixed': '1 (shade quick actions were dead UI)'
    },
    lessonsLearned: [
        '**Invert the problem:** When you can\'t move components out, remove everything else and let them fill the space',
        '**Work with boundaries, not against them:** iframe isolation is a feature, not a bug — V2 gets its own CSS/JS scope for free',
        '**Simple bridges win:** One postMessage beats six unused ones. Complex cross-boundary communication is a smell',
        '**Dead code hiding in plain sight:** Buttons with data-action but no handlers look functional in the DOM but do nothing',
        '**Phone metaphor works:** Status bar swipe-down is universal muscle memory — no onboarding needed for V2\'s chrome'
    ],
    relatedEntries: ['custom-chrome-iframe-challenge-feb-2026', 'hybrid-chrome-architecture-feb-2026'],
    status: 'completed'
};
