import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-19-a",
            "date": "January 19, 2026",
            "emoji": "🌧️",
            "title": "The Invisible Rain Saga - A Debugging Odyssey",
            "type": "critical-entry",
            "summary": "Porting the 'Code Rain' transition took far longer than expected, turning a simple visual feature into a masterclass in debugging false assumptions.",
            "problem": {
                "description": "The effect refused to play correctly. We burned hours chasing ghosts: we thought it was a timing issue (starting too late), then a CSS issue (z-index/opacity), then a duration issue (too short).",
                "rootCause": "We were fixing symptoms, not the disease. The real issue was that `showMainMenu()` called `clearScreen()`, which wiped the `#app` container. We were initializing the rain effect *inside* the very container we were about to nuke."
            },
            "solution": {
                "approach": "Iterative failure led to the truth. We stopped guessing and looked at the lifecycle.",
                "steps": [
                    "❌ <strong>Attempt 1 (Timing):</strong> Added `setTimeout` to delay the menu. Result: Rain still invisible.",
                    "❌ <strong>Attempt 2 (Visibility):</strong> Forced `z-index: 9999` and `opacity: 1`. Result: Rain appeared for a split second, then vanished.",
                    "❌ <strong>Attempt 3 (Duration):</strong> Increased duration to 15s. Result: Just a longer awkard pause.",
                    "✅ <strong>The Fix (Architecture):</strong> Realized `app.innerHTML = ''` was killing the effect. Moved the layer to `document.body`."
                ]
            },
            "callout": {
                "icon": "🧠",
                "title": "The Hard Lesson",
                "text": "Don't put your life raft inside the ship you're about to scuttle. Visual transitions that bridge two states must exist <em>outside</em> the containers of those states."
            },
            "metrics": {
                "falseLeads": 3,
                "architecturalFlaw": "Critical",
                "lessonPermanence": "Eternal"
            },
            "sortDate": "2026-01-19T0a",
            "legacyPhase": "2026-01-19-a"
        };
