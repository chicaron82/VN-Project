import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "uv7-system-architecture",
            "date": "2026-01-27 (PM)",
            "title": "One Shell Rules All: UV7System",
            "emoji": "🏗️",
            "summary": "Massive architecture shift from \"iframe chaos\" to a unified OS model. The shell now provides all chrome services (status bar, shade, sidebar), and apps simply consume them.",
            "type": "architecture",
            "theTimeline": [
                "Identified \"Inversion of Control\" issue (apps creating their own shell)",
                "Extracted chrome logic into `UV7System.js`",
                "Refactored Showcase and Shell to use the new system",
                "Eliminated double status bars and sync issues forever"
            ],
            "features": [
                "✅ <strong>Unified OS Model:</strong> Shell creates chrome once, apps detect and adapt",
                "🔌 <strong>Plug & Play:</strong> New apps just import `UV7System` and work instantly",
                "🐛 <strong>Bug Extermination:</strong> Fixed theme toggle sync and dual status bars",
                "🧹 <strong>Clean Code:</strong> Removed hundreds of lines of duplicated logic"
            ],
            "metrics": {
                "Architecture": "Unified",
                "Duplication": "0%",
                "Scalability": "Infinite",
                "Shells": "1"
            },
            "callout": {
                "icon": "👑",
                "title": "One Shell to Rule Them All",
                "text": "Before this, every app was trying to be its own operating system. Now, `UV7Shell` is the true OS, and everything else is just software running on it."
            },
            "crewAttribution": {
                "systems": [
                    { "name": "Antigravity", "contribution": "Architect", "icon": "🧠" }
                ],
                "quote": "\"It feels like a real operating system now.\""
            },
            "sortDate": "2026-01-27T18:00:00",
            "legacyPhase": "Phase 15"
        };
