import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-12-a",
            "date": "January 12, 2026 (Late Evening)",
            "emoji": "💚",
            "title": "The Lost Bubble - Narrative Restoration",
            "type": "highlight",
            "summary": "During route migration, we discovered the internal thought bubble system had vanished. The narrative felt flat without Tori's visual internal monologue.",
            "solution": {
                "approach": "Restored 237 lines of missing CSS and built a smart TypeScript component.",
                "features": [
                    "🎨 <strong>Glass-morphism:</strong> Blur effects with cyan borders",
                    "📍 <strong>Smart Positioning:</strong> Bubbles track character position",
                    "🎭 <strong>Theme Variants:</strong> Glitch effects for Tori, Red pulsing for INSANE mode"
                ]
            },
            "codeComparison": {
                "before": {
                    "title": "Before (Broken)",
                    "badge": "MISSING CSS",
                    "lang": "javascript",
                    "code": "// JavaScript existed\ngame.createInternalBubble(text, position);\n\n// But CSS was gone\n// Result: Invisible elements\n// Narrative mechanic broken"
                },
                "after": {
                    "title": "After (Restored)",
                    "badge": "FULLY FUNCTIONAL",
                    "lang": "typescript",
                    "code": "// V1: CSS restored (237 lines)\n.internal-bubble {\n  backdrop-filter: blur(10px);\n  animation: bubbleEnter 0.4s;\n}\n\n// V2: TypeScript component\ndialogBubble.show({\n  text, position, duration: 0\n});"
                }
            },
            "callout": {
                "icon": "🧩",
                "title": "Narrative Impact:",
                "text": "Restored a piece of Tori's voice. The bubble isn't decoration. It's storytelling."
            },
            "sortDate": "2026-01-12T14:00:00",
            "legacyPhase": "2026-01-12-b"
        };
