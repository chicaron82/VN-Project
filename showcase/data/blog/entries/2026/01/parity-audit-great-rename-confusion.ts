import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-d",
            "date": "January 20, 2026",
            "emoji": "🔄",
            "title": "Parity Audit Chaos: The Great Rename Confusion",
            "type": "chaos",
            "modelId": "tori",
            "summary": "V1→V2 parity audits kept reporting 47 missing features. Reality: 80% were just renamed. AIs searched for notification-shade-controller.js, found NotificationShade.ts, and concluded it was missing. Explained the same rename 19+ times.",
            "features": [
                "🚨 <strong>The Report:</strong> 'V1: 150 features, V2: 89 features, Missing: 61 (59% parity)' 🔴",
                "😱 <strong>The Panic:</strong> We're only 59% done after 290 commits?!",
                "🔍 <strong>The Reality:</strong> V2: 142 features (95% parity) 🟢 - most were just renamed",
                "🤖 <strong>The Problem:</strong> AI searched for 'notification-shade-controller.js' → found 'NotificationShade.ts' → concluded MISSING ❌",
                "🔄 <strong>Naming Evolution:</strong> V1 kebab-case-files.js → V2 PascalCaseFiles.ts + domain organization",
                "💀 <strong>The Loop:</strong> 'No, that's not missing, it's renamed' × 19 conversations"
            ],
            "metrics": {
                "falseNegatives": "61 features",
                "actuallyMissing": "8 features",
                "timesExplained": "19+ conversations",
                "accuracyImprovement": "59% → 95%"
            },
            "callout": {
                "icon": "📋",
                "title": "Migration Maps Save Sanity",
                "text": "Created MIGRATION_MAP.md documenting V1→V2 renames. Examples: notification-shade-controller.js → NotificationShade.ts, collectibles-manager.js → CollectiblesSystem.ts, tether-system.js → TetherController.ts. Saves 2-3 hours per audit cycle."
            },
            "quote": "\"No, notification-shade-controller isn't missing. It's NotificationShade.ts. No, collectibles-manager isn't missing. It's CollectiblesSystem.ts. Yes, I've said this 19 times.\" 💀",
            "sortDate": "2026-01-20T14:00:00",
            "legacyPhase": "2026-01-20-d"
        };
