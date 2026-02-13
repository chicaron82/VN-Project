import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-21-e-mystery",
            "date": "January 21, 2026",
            "emoji": "🕵️‍♀️",
            "title": "The specific Case of the 'Ghost Refactor'",
            "type": "alert",
            "sortDate": "2026-01-21T22:50:00",
            "summary": "We discovered a set of empty folders (`showcasejscomponents`, `showcasecsslayout`) created 24 hours ago. Evidence suggests a timeline deviation where we *thought* we modularized the Showcase, but the code vanished. We finally closed the loop, reducing `index.html` by 75%.",
            "features": [
                "👻 <strong>The Ghost Folders:</strong> Found empty directories for components that didn't exist yet. A artifact from a timeline that never happened?",
                "📉 <strong> The Diet:</strong> `index.html` reduced from 1,629 lines to ~400 lines. The bloat is gone.",
                "🧩 <strong>Componentization:</strong> Extracted `JourneySection`, `WorkflowSection`, `ResultsSection` etc. into clean ES6 classes.",
                "🤔 <strong>The Déjà Vu:</strong> 'I swear there was a session done to accomplish this.' — User. The system agrees. The files disagree."
            ],
            "theTimeline": [
                "<strong>T-minus 24h:</strong> Ghost folders created. No code written.",
                "<strong>22:38:</strong> User notices Showcase size is still huge.",
                "<strong>22:45:</strong> We execute the modularization (for real this time).",
                "<strong>22:55:</strong> Terminal stalls while trying to delete the evidence."
            ],
            "metrics": {
                "reduction": "75%",
                "lines_removed": "~1,200",
                "mystery_level": "High",
                "status": "Resolved (files exist now)"
            },
            "callout": {
                "icon": "🏚️",
                "title": "Digital Archaeology",
                "text": "Sometimes you find ruins of a city that was never built. We dusted off the empty folders, built the actual components, and finally aligned the timeline with our memories."
            },
            "quote": "I swear we did this already... — The common cry of the time-traveling developer."
        };
