// Timeline data for showcase website
// This is loaded as a script to avoid CORS issues with local file:// protocol
window.TIMELINE_DATA = {
    "phases": [
        {
            "id": "phase-1",
            "date": "December 2025",
            "emoji": "🕸️",
            "title": "Phase 1: The Origin - Chaos & Refactor",
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
            }
        },
        {
            "id": "phase-2",
            "date": "January 8, 2026",
            "emoji": "🏗️",
            "title": "Phase 2: The Rebuild - Foundation",
            "type": "order-entry",
            "summary": "Decision: Start fresh. TypeScript, EventBus, StateManager. Taking everything learned from the V1 chaos and building it right from scratch with strict architectural principles.",
            "features": [
                "📡 <strong>EventBus:</strong> Centralized event system for decoupled communication",
                "💾 <strong>StateManager:</strong> Reactive state management with subscriptions",
                "📝 <strong>TypeScript:</strong> Strict mode enabled for 100% type safety"
            ]
        },
        {
            "id": "phase-3",
            "date": "January 10, 2026",
            "emoji": "🧩",
            "title": "Phase 3: Integration - Structure",
            "type": "order-entry",
            "summary": "Core systems migrated. EventBus and StateManager stabilizing the timeline. Code reviews glowing. The skeleton was complete, but it lacked a soul.",
            "metrics": {
                "linesAdded": 2400,
                "filesChanged": 15,
                "components": 12
            }
        },
        {
            "id": "phase-4",
            "date": "January 11, 2026",
            "emoji": "🍽️",
            "title": "Phase 4: The Identity Crisis - 'Where's the Flavour?!'",
            "type": "critical-entry",
            "summary": "First V2 playthrough: Technically perfect. Completely soulless. The 'clean' version stripped away the weight of the interaction. The menu felt lightweight and cheap.",
            "problem": {
                "description": "This wasn't the bougie Michelin experience. Sent back to the kitchen.",
                "rootCause": "Clean architecture stripped away the 'weight' and 'friction' that made V1 feel physical."
            },
            "callout": {
                "icon": "💡",
                "title": "Key Insight:",
                "text": "It's not enough to be clean. It has to feel <strong>heavy</strong>. Every swipe needs momentum. Every animation needs purpose."
            }
        },
        {
            "id": "phase-5",
            "date": "January 12, 2026 (Evening)",
            "emoji": "✨",
            "title": "Phase 5: The Michelin Polish - Quality of Life",
            "type": "highlight",
            "summary": "True luxury is in the details. Achieved final V1 functional parity with quality-of-life enhancements that respect the user's time and intelligence.",
            "features": [
                "✅ <strong>Settings Persistence:</strong> Remembers your tab state",
                "✅ <strong>Intelligence-Respecting UX:</strong> Skip hints fade in only when needed",
                "✅ <strong>100% Feature Parity:</strong> Every V1 feature now running on V2 engine"
            ]
        },
        {
            "id": "phase-6",
            "date": "January 12, 2026 (Late Evening)",
            "emoji": "💚",
            "title": "Phase 6: The Lost Bubble - Narrative Restoration",
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
            }
        },
        {
            "id": "phase-7",
            "date": "January 12, 2026 (Midnight)",
            "emoji": "🚀",
            "title": "Phase 7: The Great Consolidation - System Integration",
            "type": "highlight",
            "summary": "Comprehensive system integration session to fix broken flows and duplicate scenes. Fixed 5 major bugs and 201 automated changes in one session.",
            "metrics": {
                "linesAdded": 201,
                "filesChanged": 18,
                "timeSpent": "3 hours"
            },
            "features": [
                "🎬 <strong>Prologue Flow:</strong> Fixed 'START STORY' sequencing",
                "✨ <strong>Vision Sequence:</strong> Fixed effect timing and rendering",
                "🔧 <strong>Duplicate Cleanup:</strong> Eliminated 46 duplicate Scene IDs"
            ]
        },
        {
            "id": "phase-8",
            "date": "January 12, 2026 (Late Night)",
            "emoji": "⚡",
            "title": "Phase 8: The Parallel Blitz - Velocity",
            "type": "highlight",
            "summary": "Unleashed parallel AI agents to knock out 8 launch-blocking features simultaneously. What would have taken 26 hours sequentially was done in ~1 hour.",
            "metrics": {
                "linesAdded": 7000,
                "filesChanged": 29,
                "timeSpent": "~1hr"
            },
            "codeComparison": {
                "before": {
                    "title": "Before (Audit)",
                    "badge": "8 BLOCKERS",
                    "lang": "markdown",
                    "code": "🔴 Save/Load UI - MISSING\n🔴 Auto-Save Indicator - MISSING\n🔴 Skip System - MISSING\n🔴 Settings Modal - MISSING\n🔴 Error Boundary - PARTIAL"
                },
                "after": {
                    "title": "After (Blitz)",
                    "badge": "LAUNCH READY",
                    "lang": "markdown",
                    "code": "✅ Save/Load UI - DONE\n✅ Auto-Save Indicator - DONE\n✅ Skip System - DONE\n✅ Settings Modal - DONE\n✅ Error Boundary - DONE"
                }
            },
            "media": {
                "carousel": [
                    { "type": "image", "url": "v1-settings-original.png", "caption": "V1: Pure Utility" },
                    { "type": "image", "url": "v2-settings-restored.png", "caption": "V2: Visual Hierarchy" },
                    { "type": "image", "url": "v2-settings-shortcuts.png", "caption": "V2: Keyboard Shortcuts" },
                    { "type": "image", "url": "v2-settings-sensory.png", "caption": "V2: Sensory Controls" },
                    { "type": "image", "url": "v2-settings-secrets.png", "caption": "V2: Secrets Management" }
                ]
            },
            "callout": {
                "icon": "⚡",
                "title": "The Parallel Paradigm:",
                "text": "26 hours of work compressed into 1 hour. This is the future of development."
            }
        },
        {
            "id": "phase-9",
            "date": "January 12, 2026 (Morning)",
            "emoji": "🎯",
            "title": "Phase 9: The Final Polish - Launch Ready",
            "type": "highlight",
            "summary": "Final preparation for launch. Polishing the boot sequence, verifying zero runtime errors, and implementing the skip hint UI.",
            "features": [
                "⏩ <strong>Skip Hint UI:</strong> Pulsing indicator for interacting",
                "🛡️ <strong>Zero Errors:</strong> TypeScript strict mode verification",
                "📦 <strong>Bundle Optimization:</strong> Tree-shaking and compression"
            ],
            "media": {
                "carousel": [
                    { "type": "image", "url": "phase9a-0.png", "caption": "Final Polish: Overview" },
                    { "type": "image", "url": "phase9a-1.png", "caption": "Final Polish: Details" },
                    { "type": "image", "url": "phase9a-2.png", "caption": "Final Polish: Dark Mode" },
                    { "type": "image", "url": "phase9a-3.png", "caption": "Final Polish: Mobile" },
                    { "type": "image", "url": "phase9a-4.png", "caption": "Final Polish: Interactions" }
                ]
            }
        },
        {
            "id": "phase-10",
            "date": "January 12, 2026 (Afternoon)",
            "emoji": "📱",
            "title": "Phase 10: V1 Parity - NotificationShade & Sidebar",
            "type": "highlight latest-update",
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
            ]
        }
    ]
};
