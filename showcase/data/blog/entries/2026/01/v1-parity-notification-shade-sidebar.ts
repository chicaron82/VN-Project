import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-12-a",
            "date": "January 12, 2026 (Afternoon)",
            "emoji": "📱",
            "title": "V1 Parity - NotificationShade & Sidebar",
            "type": "highlight",
            "summary": "After completing the core features, we turned to mobile UX parity. The challenge: V2's NotificationShade looked different from V1, and landscape swipe wasn't opening the sidebar.",
            "problem": {
                "description": "We were patching reactively instead of studying V1's architecture first.",
                "rootCause": "Lack of V1 study before V2 implementation."
            },
            "solution": {
                "approach": "Stopped, studied V1's actual implementation, and created a workflow document.",
                "features": [
                    "📱 <strong>NotificationShade:</strong> Two-stage expansion & exact V1 DOM structure",
                    "🖥️ <strong>Sidebar:</strong> Status details, UV7 footer, and route theming",
                    "📋 <strong>V1 Parity Workflow:</strong> New enforced workflow for parity tasks"
                ]
            },
            "metrics": {
                "linesAdded": 1208,
                "filesChanged": 7,
                "components": 3
            },
            "lessons": [
                "Always study V1's implementation BEFORE writing V2 code",
                "Created workflow document to enforce this pattern",
                "Following V1's exact architecture prevents reactive patching"
            ],
            "sortDate": "2026-01-12T10:00:00",
            "legacyPhase": "January 12, 2026 (Afternoon)-a"
        };
