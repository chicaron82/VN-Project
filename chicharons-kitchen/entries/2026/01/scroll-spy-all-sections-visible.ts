import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-23-a",
            "date": "January 23, 2026",
            "emoji": "📜",
            "title": "Scroll-Spy: All Sections Visible",
            "type": "milestone",
            "sortDate": "2026-01-23T06:00:00",
            "summary": "The dual navigation state problem (TabController vs TabSwipeController) was resolved by removing horizontal swiping entirely. Now all sections are visible vertically, and the tab bar becomes anchor navigation with IntersectionObserver-based scroll-spy. Scroll position IS the state.",
            "features": [
                "🎯 <strong>Single Source of Truth:</strong> Scroll position determines active tab. No dual state sync required.",
                "👁️ <strong>All Sections Visible:</strong> CSS changed from display:none to display:block. Sections stacked vertically.",
                "📌 <strong>IntersectionObserver:</strong> Detects which section is in viewport (rootMargin: '-20% 0px -60% 0px').",
                "🔗 <strong>Anchor Navigation:</strong> Tab clicks call scrollIntoView() instead of complex panel switching.",
                "🗑️ <strong>TabSwipeController Deleted:</strong> No longer needed - 200+ lines removed from codebase."
            ],
            "theTimeline": [
                "<strong>Problem:</strong> Dual navigation system - swiping sets scroll, TabController sets activeTab. State sync was fragile.",
                "<strong>User Insight:</strong> 'What if we remove the scroll for tabs and just display ALL the content?'",
                "<strong>Validation:</strong> Timeline paginated to 3 entries by default, so sections are manageable length.",
                "<strong>Implementation:</strong> TabController rewritten from 872 lines to ~300. All scroll-spy based.",
                "<strong>Cleanup:</strong> Removed TabSwipeController.js, comparison slider, mobile-slider.js."
            ],
            "metrics": {
                "lines_removed": "~900",
                "lines_added": "~300",
                "approach": "Scroll-spy anchors",
                "status": "Simplified"
            },
            "callout": {
                "icon": "🧘",
                "title": "Simplicity Through Subtraction",
                "text": "The best fix for state sync bugs is eliminating the dual state. One scroll position. One active tab. IntersectionObserver bridges them."
            },
            "quote": "The problem with two sources of truth is that eventually they'll disagree. — DiZee"
        };
