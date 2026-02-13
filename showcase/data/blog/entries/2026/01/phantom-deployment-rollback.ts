import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-21-d-failed",
            "date": "January 21, 2026",
            "emoji": "👻",
            "title": "The Phantom Deployment: UV7 Shell Rollback",
            "type": "alert",
            "sortDate": "2026-01-21T21:45:00",
            "summary": "Attempted to launch the UV7 Unified Shell (OS Architecture). The deployment pipeline stalled for 15+ minutes, serving 404s for all nested app content despite valid local verification. The 'Phantom Deployment' refused to acknowledge new files even after force-pushes and flattening strategies.",
            "features": [
                "🚫 <strong>Deployment Deadlock:</strong> GitHub Pages refused to serve `apps/landing.html` and later `landing.html` (root) despite files being tracked in git.",
                "⚠️ <strong>The 404 Loop:</strong> `src='./js/UV7Shell.js?v=2'` worked locally but returned 404 online. Cache-busting query params failed to penetrate the CDN ghosting.",
                "🕵️ <strong>The Flattening Strategy:</strong> Moved all apps to root to bypass Jekyll folder filtering. Still 404. Created `test-deployment.html` probe. Still 404.",
                "🔙 <strong>The Great Revert:</strong> Hard reset to commit `f4fa977` to restore stability. We live to deploy another day."
            ],
            "theTimeline": [
                "<strong>20:50:</strong> Initial Shell Launch. 404s on scripts.",
                "<strong>21:00:</strong> Cache Busting. Added `?v=2`. Local success, Remote failure.",
                "<strong>21:15:</strong> Flattening. Moved `apps/landing.html` to root. Deployment pipeline stalled.",
                "<strong>21:30:</strong> Probe Launch. `test-deployment.html` failed to appear after 10 mins.",
                "<strong>21:45:</strong> Abort. Hard reset initiated. Timeline marks the grave of the Phantom Build."
            ],
            "metrics": {
                "downtime": "45 minutes",
                "error": "404 Not Found (Persistent)",
                "pipeline": "Stalled / Ghosted",
                "status": "ROLLED BACK to Stable"
            },
            "callout": {
                "icon": "💀",
                "title": "Deployment Lessons",
                "text": "Sometimes the infrastructure just ghosts you. The code was valid. The paths were correct. The server simply refused to acknowledge existence. In the face of a reality-denying CD pipeline, the only winning move is to reset."
            },
            "quote": "It worked on my machine. It worked on the live server. But the cloud... the cloud is a place where files go to die. — DiZee"
        };
