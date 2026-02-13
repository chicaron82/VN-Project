import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-c",
            "date": "January 20, 2026",
            "emoji": "🧟",
            "title": "Zombie Code Resurrection: The Pause Menu That Wouldn't Die",
            "type": "chaos",
            "summary": "Discovered ancient pause menu code in V2 that was deprecated 18 months ago in V1. Someone commented it out instead of deleting it. It got ported anyway. Took 40 minutes to find the corpse buried in save-load-ui.js.",
            "features": [
                "🔍 <strong>The Discovery:</strong> Code review found pause menu logic in V2",
                "❓ <strong>The Confusion:</strong> We replaced pause with notification shade in Phase 12",
                "⏰ <strong>The Search:</strong> 40 minutes looking for pause-manager.js, overlay-manager.js, pause*.js",
                "⚰️ <strong>The Corpse:</strong> Found in save-load-ui.js lines 401-550 (completely unrelated file)",
                "💀 <strong>The Age:</strong> Commented out 18 months ago, still got ported to V2",
                "🧟 <strong>The Cause:</strong> AI saw commented code, assumed it was 'temporarily disabled', ported it faithfully"
            ],
            "theTimeline": [
                "<strong>Phase 6:</strong> Someone added pause to save-load-ui.js for 'convenience'",
                "<strong>Phase 12:</strong> NotificationShade replaced pause system",
                "<strong>Mistake:</strong> AI commented out old code instead of deleting it",
                "<strong>V2 Port:</strong> AI found commented code, assumed it was important, ported it"
            ],
            "metrics": {
                "searchTime": "40 minutes",
                "zombieAge": "18 months",
                "linesDeleted": "150 lines",
                "fileBloat": "25% of save-load-ui.js was corpse"
            },
            "callout": {
                "icon": "⚰️",
                "title": "Git Is Your Time Machine",
                "text": "Commenting out code 'just in case' achieves nothing. It can't run. It can't be referenced. But it CAN get accidentally ported 18 months later. Delete with confidence. Git preserves everything."
            },
            "quote": "\"We found 150 lines of pause code in save-load-ui.js. It was commented out. In the wrong file. From 18 months ago. And it still got ported to V2.\" 🧟",
            "sortDate": "2026-01-20T12:00:00",
            "legacyPhase": "2026-01-20-c"
        };
