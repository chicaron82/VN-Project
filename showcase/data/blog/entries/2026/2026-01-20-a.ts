import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-a",
            "date": "January 20, 2026",
            "emoji": "🔧",
            "title": "Mobile Slider Orientation & UV7 OS Gap Fix",
            "type": "polish",
            "summary": "Fixed mobile slider inconsistently sliding vertically/horizontally on portrait by matching JavaScript media queries to CSS exactly. Removed 60px gap between UV7 OS bar and content caused by excessive padding.",
            "features": [
                "📱 <strong>Orientation Mismatch:</strong> JavaScript checked `(orientation: portrait)` but CSS required `(max-width: 768px) and (orientation: portrait)`",
                "🔄 <strong>The Consequence:</strong> Tablets >768px in portrait would get vertical JS logic but horizontal CSS styles",
                "🎯 <strong>The Fix:</strong> Made JavaScript media query match CSS exactly",
                "📏 <strong>Gap Issue:</strong> UV7 OS bar (44px) + banner (16px) = 60px, but mobile CSS added 60px MORE padding (120px total!)",
                "✂️ <strong>Gap Fix:</strong> Changed padding from `calc(44px + 16px + 60px)` to `var(--uv7-top-stack, 60px)`"
            ],
            "metrics": {
                "orientationBugFixed": "CSS/JS now aligned",
                "excessPaddingRemoved": "60px (portrait) + 50px (landscape)",
                "mediaQueriesMatched": "100%"
            },
            "callout": {
                "icon": "🎯",
                "title": "Media Query Alignment",
                "text": "JavaScript orientation detection MUST match CSS media queries exactly. Checking just `(orientation: portrait)` while CSS requires `(max-width: 768px) and (orientation: portrait)` creates edge cases on tablets."
            },
            "sortDate": "2026-01-20T0a",
            "legacyPhase": "2026-01-20-a"
        };
