import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'gesture-input-architecture-cleanup-feb-2026',
    date: 'Feb 14, 2026',
    sortDate: '2026-02-14T20:00:00',
    title: 'Single Source of Truth: The Gesture Architecture Cleanup',
    type: 'highlight',
    emoji: '🧹',
    tags: ['V2', 'Architecture', 'Refactoring', 'Input', 'Gestures', 'EventBus'],
    modelId: 'dizee',
    summary: 'Six-phase architecture cleanup: eliminated duplicate gesture detection, extracted layout utilities, established clean input→routing→UI event chains, consolidated keyboard handling, and removed dead code. Swipe-down double-fire bug fixed. -25 lines net, 1,392 tests passing.',

    callout: {
        icon: '🎯',
        title: 'One Chef Per Station',
        text: 'Three cooks were making the same sauce. StatusBarGestures, SwipeHandler, and UV7OSSwipeHandler all detecting swipes independently — causing double-fires, race conditions, and spaghetti routing. Now there\'s one chef per station: SwipeHandler detects, MobileUXController routes, components respond.'
    },

    highlights: [
        '**Swipe double-fire bug fixed**: Single swipe-down was opening AND expanding shade simultaneously',
        '**StatusBarGestures refactored**: Removed duplicate swipe detection, kept double-tap/long-press/logo gestures',
        '**isLandscape() utility extracted**: Replaced 3 inline `window.innerWidth > window.innerHeight` checks',
        '**Clean event chain**: SwipeHandler → `input:swipe_down` (with startY) → MobileUXController routes → `ui:shade:expand`',
        '**Double-tap consolidated**: Moved from MobileUXController\'s raw DOM listener into SwipeHandler via EventBus',
        '**Keyboard Escape double-fire fixed**: NotificationShade + KeyboardController both handled Escape — 79 lines of duplicate handlers removed',
        '**Dead code removed**: 3 orphaned DOM CustomEvent listeners in Analytics, dead `ui:sidebar_toggle` event'
    ],

    problem: {
        description: 'V2\'s input system had three independent swipe detectors (SwipeHandler, StatusBarGestures, UV7OSSwipeHandler), duplicate keyboard handlers (KeyboardController + NotificationShade both handling Escape/Ctrl+S/L/F/M), landscape checks copy-pasted across 3 files, and components listening to raw input events instead of semantic UI events.',
        rootCause: 'V1→V2 ports were done independently — each system brought its own input handling from V1\'s god class. Nobody asked "who else detects this?" StatusBarGestures was a V1 relic that duplicated SwipeHandler. NotificationShade ported V1\'s keyboard shortcuts without checking KeyboardController already had them.'
    },

    solution: {
        approach: 'Full audit of all touch/keyboard listeners across V2, then systematic consolidation following the principle: raw input detection → routing layer → semantic UI events → component response.',
        features: [
            '**Phase 1 — UV7OSSwipeHandler audit**: Discovered it serves the showcase shell (separate app context with no EventBus) — correctly preserved, not a duplicate',
            '**Phase 2 — isLandscape() utility**: Created `v2/utils/layout.ts` as single source of truth for orientation checks, with 3 tests',
            '**Phase 3 — Clean swipe chain**: SwipeHandler becomes pure input detector (emits startY metadata). MobileUXController owns all routing: top-edge guard, shade expansion, portrait/landscape. NotificationShade listens to `ui:shade:expand` instead of raw `input:swipe_down`. Removed openedAt debounce hack.',
            '**Phase 4 — Double-tap via EventBus**: SwipeHandler detects double-tap (300ms window, non-swipe only), emits `input:double_tap` with target. MobileUXController removed raw `document.addEventListener("touchend")`. Zero raw DOM listeners remain in MobileUXController.',
            '**Phase 5 — Keyboard consolidation**: Removed 79-line `handleKeyboardShortcut()` from NotificationShade. KeyboardController absorbed Ctrl+F (fullscreen), Ctrl+M (main menu). Added shade-aware Escape stack: expanded→collapse, open→close, nothing→toggle. Removed dead `ui:sidebar_toggle` underscore variant.',
            '**Phase 6 — Dead code**: Removed 3 DOM CustomEvent listeners from Analytics (`scene-displayed`, `choice-made`, `route-point-change`) — nothing dispatched them. Left migration comment pointing to EventBus equivalents.'
        ]
    },

    metrics: {
        'Tests': '1,392 ✅',
        'Test Files': '129',
        'Lines Added': '+162',
        'Lines Removed': '-187',
        'Net Change': '-25 lines',
        'Files Changed': '10',
        'New Events Added': '3 (ui:shade:expand, ui:shade:collapse, input metadata)',
        'Dead Listeners Removed': '4',
        'Duplicate Handlers Removed': '2 (Escape, Ctrl shortcuts)',
        'Raw DOM Listeners Eliminated': '2 (MobileUXController)'
    },

    codeSnippets: [
        {
            title: 'Before: Three Cooks, One Sauce',
            badge: 'The Problem',
            lang: 'typescript',
            code: `// SwipeHandler.ts — detects swipe, checks shade DOM, guards top-edge
const shadeOpen = document.getElementById('notification-shade')
    ?.classList.contains('visible') ?? false;
if (this.touchStartY < 80 || shadeOpen) {
    this.eventBus.emit('input:swipe_down', {});
}

// MobileUXController.ts — routes swipe, but shade already handled?
private handleSwipeDown(): void {
    if (this.isShadeVisible()) return; // Too late, shade got it
    const isLandscape = window.innerWidth > window.innerHeight;
    // ...
}

// NotificationShade.ts — listens to RAW input, races with router
this.eventBus.on('input:swipe_down', () => {
    if (this.isOpen && !this.isExpanded
        && (Date.now() - this.openedAt > 400)) { // 400ms hack!
        this.expand();
    }
});`
        },
        {
            title: 'After: Clean Chain of Command',
            badge: 'The Solution',
            lang: 'typescript',
            code: `// SwipeHandler.ts — pure input detection, no DOM checks
this.eventBus.emit('input:swipe_down', { startY: this.touchStartY });

// MobileUXController.ts — ALL routing decisions live here
private handleSwipeDown(data?: { startY?: number }): void {
    if (this.isShadeVisible()) {
        this.eventBus.emit('ui:shade:expand', {}); // Semantic!
        return;
    }
    if ((data?.startY ?? 0) >= 80) return; // Top-edge guard
    if (isLandscape()) {
        this.eventBus.emit('ui:sidebar:toggle', {});
    } else {
        this.eventBus.emit('ui:shade:toggle', {});
    }
}

// NotificationShade.ts — responds to semantic events only
this.eventBus.on('ui:shade:expand', () => {
    if (this.isOpen && !this.isExpanded) this.expand();
});`
        },
        {
            title: 'Keyboard Escape: Priority Stack',
            badge: 'KeyboardController.ts',
            lang: 'typescript',
            code: `private handleEscape(e: KeyboardEvent): void {
    e.preventDefault();
    // 1. Dev Console
    if (this.closeIfOpen('dev-console', 'ui:console:close')) return;
    // 3. Credits
    if (document.querySelector('.credits-screen')) { /* ... */ }
    // 4-7. Notes, Backlog, Settings, Save/Load
    // 8. Sidebar
    if (this.isVisible('sidebar', 'visible')) { /* close */ return; }
    // 9. Shade (NEW: expanded → collapse, open → close)
    const shade = document.getElementById('notification-shade');
    if (shade?.classList.contains('visible')) {
        if (shade.classList.contains('expanded')) {
            this.eventBus.emit('ui:shade:collapse', {});
        } else {
            this.eventBus.emit('ui:shade:close_request', {});
        }
        return;
    }
    // 10. Nothing open → toggle shade/sidebar
}`
        }
    ],

    details: [
        {
            title: 'The Architecture Principle',
            points: [
                'Layer 1 — DETECTION: SwipeHandler on document.body. Detects raw gestures (swipe direction, distance, double-tap). Emits input:* events with metadata (startY, target). No DOM queries. No routing decisions.',
                'Layer 2 — ROUTING: MobileUXController + KeyboardController. Receives input:* events. Makes all decisions (landscape? shade open? top-edge?). Emits semantic ui:* events.',
                'Layer 3 — RESPONSE: NotificationShade, Sidebar, etc. Only listens to ui:shade:*, ui:sidebar:*. Never touches input:* events. Zero routing logic.',
                'The key insight: Components should never know HOW the user triggered an action — only WHAT action was requested.'
            ]
        },
        {
            title: 'What Was NOT Deleted',
            points: [
                'UV7OSSwipeHandler.ts — Serves the showcase/landing shell, which has no EventBus. Different app context. Correctly preserved.',
                'NotificationShade\'s input:swipe_up listener — Still needed for collapse/close within shade (swipe up is unambiguous when shade is open)',
                'Component-specific keydown handlers — CreditsScreen, EndingDialogController, KonamiSystem etc. have context-specific key handling that belongs with their components',
                'InputController.ts — Handles dialog advancement and scene-specific input, different scope from KeyboardController\'s global shortcuts'
            ]
        }
    ],

    lessons: [
        'When three systems independently detect the same gesture, you don\'t have redundancy — you have race conditions',
        'A 400ms debounce hack is a symptom of architectural confusion, not a solution to it',
        'Components should respond to semantic events (ui:shade:expand), never raw input events (input:swipe_down)',
        'Before deleting "duplicate" code, verify it\'s actually the same context — UV7OSSwipeHandler serves a separate app',
        'The gap between "it works" and "it works for the right reason" is where double-fire bugs live',
        'Moving routing decisions to one place (MobileUXController) makes the entire gesture system debuggable'
    ],

    crew: [
        {
            name: 'DiZee (Claude Opus 4.6)',
            icon: '🔪',
            contribution: 'Full architecture audit (14 findings), 6-phase consolidation plan, implementation across 10 files. Caught UV7OSSwipeHandler context mismatch before deletion.'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '👑',
            contribution: 'Reported swipe-down double-fire bug, asked "should we have single source of truth?", approved 6-phase plan. The question that launched the cleanup.'
        }
    ],

    quote: 'Three cooks making the same sauce is not redundancy — it\'s a race condition. One chef per station, every time. 💚🔥💀',

    footer: {
        icon: '🧹',
        text: '6 phases. -25 lines. 1,392 green. The input system finally has a chain of command.'
    }
};
