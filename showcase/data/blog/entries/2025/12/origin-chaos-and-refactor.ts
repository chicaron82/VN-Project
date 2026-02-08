import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2025-12-01-a",
            "date": "December 2025",
            "emoji": "🕸️",
            "title": "The Origin - Chaos & Refactor",
            "type": "chaos-entry",
            "summary": "Shipped a complete game: 2 routes, 6 acts, multiple endings. It worked, but the architecture was 'creative' (read: spaghetti). An initial attempt to refactor proved the codebase was too tangled to save.",
            "problem": {
                "description": "V1 was built on passion and caffeine. Structure was optional. Innovation was mandatory.",
                "rootCause": "Direct circular dependencies between all systems. Tethers broke Menus. Menus broke GameState."
            },
            "metrics": {
                "linesAdded": "N/A",
                "filesChanged": "All",
                "components": 0
            },
            "sortDate": "2025-12-01T08:00:00",
            "legacyPhase": "2025-12-01-a"
        };
