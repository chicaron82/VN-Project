import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-22-a",
            "date": "January 22, 2026",
            "emoji": "🔄",
            "title": "Scroll-Snap Pivot: When Native Beats Custom",
            "type": "milestone",
            "sortDate": "2026-01-22T05:00:00",
            "summary": "The original TabSwipeController was fighting CSS at every turn. After hours of reactive patching (missing divs, animation conflicts, state sync issues), we scrapped the 464-line custom pointer-tracking system and rebuilt with CSS scroll-snap in ~90 lines. Native wins.",
            "features": [
                "🗑️ <strong>Killed Complexity:</strong> Removed custom pointer events, velocity tracking, MomentumTracker class, transform-based panning. Let the browser handle physics.",
                "📜 <strong>CSS Scroll-Snap:</strong> Horizontal scroll container with `scroll-snap-type: x mandatory`. Panels are 100% width, browser handles finger tracking.",
                "🔗 <strong>State Sync Fix:</strong> Early sync call in navigateToTab() ensures scroll position always matches tab state, even on redundant clicks.",
                "📐 <strong>Height Constraints:</strong> Fixed whitespace issue by constraining container height and enabling per-panel scrolling.",
                "🧹 <strong>Cleanup:</strong> Removed V1/V2 comparison slider, fixed timeline pagination, added missing sortDates."
            ],
            "theTimeline": [
                "<strong>Session Start:</strong> Tabs stuck on Journey. Content not switching despite JS logs showing navigation.",
                "<strong>Debug Phase:</strong> Found missing closing div, duplicate view-transition-names, display:none fighting display:block!important.",
                "<strong>The Pivot:</strong> User asks 'can we redo it from scratch?' — Yes. Yes we can.",
                "<strong>Rebuild:</strong> New TabSwipeController using scroll events instead of pointer events. ~90 lines.",
                "<strong>Polish:</strong> Fixed click-to-navigate sync, removed fadeIn animation delay, constrained panel heights."
            ],
            "metrics": {
                "lines_removed": "~370",
                "lines_added": "~90",
                "approach": "Native scroll-snap",
                "status": "Working"
            },
            "callout": {
                "icon": "🎯",
                "title": "Simplicity Wins",
                "text": "Sometimes the best code is the code you delete. The browser already knows how to do smooth, momentum-based scrolling with snap points. We just had to get out of its way."
            },
            "quote": "Less code = fewer bugs. — Ancient Developer Proverb"
        };
