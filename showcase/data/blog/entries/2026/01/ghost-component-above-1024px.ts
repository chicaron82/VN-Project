import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-b",
            "date": "January 20, 2026",
            "emoji": "👻",
            "title": "The Ghost Component That Lived at >1024px",
            "type": "chaos",
            "summary": "A floating navigation component appeared on desktop that no one remembered creating, showed 'NaN' instead of section names, and took 45 minutes to debug. Plot twist: it was redundant anyway. The best code is no code.",
            "features": [
                "👻 <strong>The Ghost:</strong> Floating nav only appeared at >1024px, invisible during mobile-first testing (393px)",
                "🔍 <strong>The Hunt:</strong> No one could find where it was created or why it existed",
                "🚨 <strong>The Bug:</strong> Showed 'NaN' instead of 'Journey', 'Workflow', 'Evolution'",
                "🔬 <strong>The Tool:</strong> MutationObserver caught premium-animations.js doing parseInt('journey') = NaN",
                "🎯 <strong>The Fix:</strong> Renamed data-target to data-tabTarget",
                "🗑️ <strong>The Twist:</strong> Component was redundant - sidebar already had navigation - deleted 256 lines"
            ],
            "investigation": [
                "✅ JavaScript was perfect (console logs confirmed)",
                "❌ Not the sidebar (tested separately)",
                "🔬 Deployed MutationObserver to catch DOM changes",
                "🎯 Found collision: premium-animations.js used [data-target] globally",
                "💡 parseInt('journey') → NaN → set as textContent"
            ],
            "metrics": {
                "debuggingTime": "45 minutes",
                "hypothesesTested": "7",
                "cacheBusters": "8",
                "linesDeleted": "256",
                "redundancyRealized": "100%"
            },
            "callout": {
                "icon": "🗑️",
                "title": "The Best Code Is No Code",
                "text": "After solving the NaN bug, we realized the floating nav was completely redundant. The sidebar already had navigation. We deleted 256 lines. Problem solved twice."
            },
            "footer": {
                "icon": "💀",
                "text": "<strong>The Lesson:</strong> The component lived at >1024px like a ghost in the machine. Invisible to mobile testing. Broken on desktop. Redundant everywhere. Sometimes the right move isn't fixing the bug - it's deleting the feature."
            },
            "quote": "\"I spent 45 minutes debugging NaN because an AI added a floating nav I never asked for that only appeared at >1024px width\" 👻",
            "sortDate": "2026-01-20T10:00:00",
            "legacyPhase": "2026-01-20-b"
        };
