import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-h",
            "date": "January 20, 2026 (Night)",
            "emoji": "👻",
            "title": "The Ghost Button & The Timeline Split",
            "type": "highlight",
            "summary": "Showcase polish revealed two bizarre bugs: a 'Ghost' button stealing clicks, and the Timeline refusing to be in Story Mode online. Debugging revealed a duplicate DOM element and a race condition in state restoration.",
            "features": [
                "👻 <strong>The Ghost Button:</strong> Sidebar toggle wasn't working. Found a DUPLICATE button hidden in the HTML with the same ID, stealing all the clicks.",
                "📱 <strong>Control Center Glow-Up:</strong> Replaced the 'broken' icon with a glowing Green FAB (Floating Action Button) and shifted the sidebar down 60px to clear the status bar.",
                "🐛 <strong>The Timeline Split:</strong> 'Story Mode' locally, but 'Expanded Mode' online? Turns out the Timeline Renderer was ignoring the User's saved preference.",
                "🔄 <strong>The Fix:</strong> Force-synced TimelineRenderer with localStorage state. Now, if you saved 'Dev Mode', you GET 'Dev Mode'.",
                "✅ <strong>Result:</strong> Sidebar works, Timeline syncs, and no more 'broken' UI states."
            ],
            "theTimeline": [
                "<strong>Report:</strong> 'Sidebar toggle broken/unintuitive' + 'Timeline expands automatically online'",
                "<strong>Investigating Toggle:</strong> Found TWO elements with id='uv7-sidebar-toggle'. The first one (hidden/legacy) was intercepting clicks.",
                "<strong>Fixing Toggle:</strong> Deleted the ghost. Styled the survivor as a Glowing FAB. Moved it to top: 75px.",
                "<strong>Investigating Timeline:</strong> Online site remembered 'Dev Mode' (Expanded) from previous session.",
                "<strong>The Glitch:</strong> Body said 'Dev Mode' (CSS expanded), but JS said 'Story Mode' (Sorted Ascending). Result: Hybrid broken state.",
                "<strong>Fix:</strong> Updated TimelineRenderer to respect document.body.dataset.viewMode on init."
            ],
            "investigation": [
                "🔍 <strong>Ghost Button:</strong> <code>document.getElementById</code> only returns the FIRST match. The legacy button was first.",
                "🔍 <strong>Timeline Desync:</strong> ViewModeController restores state to <code>body</code>, but TimelineRenderer was defaulting to <code>'story'</code> in its constructor.",
                "✅ <strong>Solution:</strong> <code>this.activeSort = document.body.dataset.viewMode || 'story'</code>"
            ],
            "metrics": {
                "ghostsBusted": "1",
                "buttonsFixed": "1",
                "raceConditionsWon": "1",
                "sidebarOffset": "60px",
                "confidence": "100%"
            },
            "callout": {
                "icon": "🧠",
                "title": "The Lesson:",
                "text": "When restoring state from localStorage, ensure ALL subsystems read from that 'source of truth' (or the DOM state reflecting it) during their initialization. Don't let them default to hardcoded values."
            },
            "quote": "Locally it's Story Mode. Online it's Expanded. The code is gaslighting me. — The User",
            "sortDate": "2026-01-20T23:00:00",
            "legacyPhase": "2026-01-20-h"
        };
