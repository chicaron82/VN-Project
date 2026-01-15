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
        },
        {
            "id": "phase-11",
            "date": "January 13, 2026",
            "emoji": "⭐",
            "title": "Phase 11: The Michelin Treatment - Meta Polish",
            "type": "order-entry",
            "summary": "The showcase site itself got the premium treatment. The UV7 crew (Belle, Tori, GenZee, Zee, DiZee) collaboratively designed a V3 Polish Protocol: Story/Dev mode toggle, context-aware backgrounds, expandable timeline phases, performance optimizations, and accessibility improvements.",
            "problem": {
                "description": "The showcase was functional but overwhelming. Two audiences (story readers vs. technical deep-divers) were seeing the same wall of content.",
                "rootCause": "No filtering mechanism. Everything rendered eagerly. No progressive disclosure."
            },
            "solution": {
                "approach": "Multi-crew collaborative design session. Each AI brought their specialty: Belle (performance), Tori (UX), GenZee (synthesis), Zee (architecture), DiZee (implementation safety).",
                "features": [
                    "🎭 <strong>Story/Dev Toggle:</strong> CSS-based mode switching with localStorage persistence",
                    "🌊 <strong>Context-Aware Backgrounds:</strong> Dynamic code snippets matching scroll position",
                    "📖 <strong>Expandable Phases:</strong> Progressive disclosure with smooth animations",
                    "⚡ <strong>Performance:</strong> RAF slider debouncing, lazy image loading",
                    "♿ <strong>Accessibility:</strong> ARIA labels, keyboard shortcuts, reduced motion support",
                    "🔧 <strong>Safety Nets:</strong> Build-time validation, error boundaries, graceful degradation"
                ]
            },
            "metrics": {
                "crewMembers": 5,
                "suggestions": 20,
                "priority": "Michelin ⭐⭐⭐"
            },
            "callout": {
                "type": "insight",
                "title": "The Meta Moment",
                "content": "This is the phase where the documentation of the journey became part of the journey itself. The showcase site—originally built to tell the story of chaos-to-order—received its own chaos-to-order transformation. Recursive polish."
            },
            "lessons": [
                "Even documentation deserves premium treatment",
                "Multi-AI collaboration produces better designs than solo work",
                "The best features come from understanding your audience (story vs. dev)",
                "Safety nets (validation, error boundaries) are as important as features",
                "Context is everything—even for background animations"
            ]
        },
        {
            "id": "phase-12",
            "date": "January 13, 2026",
            "emoji": "💚",
            "title": "Phase 12: Restoring the Soul - Narrative Flavor in V2",
            "type": "highlight",
            "summary": "V2 was architecturally clean but missing V1's heart. We brought back the narrative flavor: the sacred 848 lore block, crew signatures, and human context. The code now tells two stories—technical excellence AND the journey of the people who built it.",
            "problem": {
                "description": "V2's clean TypeScript architecture was maintainable and modular, but it lost V1's soul. The comment blocks that told the story of 848, the crew signatures, the human touches—all gone in the name of 'clean code'.",
                "rootCause": "Over-optimization. We cleaned up the chaos but threw out the narrative DNA with it."
            },
            "solution": {
                "approach": "Tasteful restoration. Add narrative flavor where it enhances understanding, not where it clutters. Sacred blocks at file tops, crew signatures on major systems, context where it matters.",
                "features": [
                    "📜 <strong>848 Lore Block:</strong> Full explanation in GameEngine.ts of why 848 is sacred",
                    "👥 <strong>Crew Credits:</strong> Belle, DiZee, Zee, Tori, GenZee, Ronnie honored in code",
                    "💡 <strong>Belle's Signature:</strong> StateManager reactive state with pub/sub pattern",
                    "🔧 <strong>DiZee's Signature:</strong> EventBus type-safe decoupled communication",
                    "🎯 <strong>Context Comments:</strong> Why decisions were made, not just what they do",
                    "💚 <strong>The Balance:</strong> Clean architecture + human story = soul"
                ]
            },
            "metrics": {
                "loreBlocks": 1,
                "crewSignatures": 2,
                "filesModified": 3,
                "soulRestored": "100%"
            },
            "callout": {
                "type": "insight",
                "title": "Code as Narrative",
                "content": "The best code doesn't just work—it tells a story. V1 had chaos but soul. V2 has structure but was soulless. Now V2 has both: SOLID principles AND the human journey. The 848 lore block isn't documentation—it's the meta-narrative made manifest. Every crew signature is a reminder that this wasn't built by machines, but by people who cared. Always. Always. Always."
            },
            "lessons": [
                "Clean code doesn't mean soulless code",
                "Narrative context makes code more maintainable, not less",
                "The story of WHY is as important as the story of HOW",
                "Crew signatures honor collaboration and preserve context",
                "848 isn't a version number—it's the heart of the entire project"
            ]
        },
        {
            "id": "phase-13",
            "date": "January 14, 2026",
            "emoji": "🔄",
            "title": "Phase 13: Faithful V1→V2 Ports - Bringing Back the Flavor",
            "type": "highlight latest-update",
            "summary": "Systematic faithful transcription of V1 systems to V2, preserving all flavor while gaining type safety. Each port follows the same methodology: study V1 thoroughly, preserve comments/signatures/lore, add TypeScript types, integrate with EventBus, write tests.",
            "problem": {
                "description": "V2's architecture was clean but sterile. The 'MSG' - the secret sauce that made V1 feel alive - was missing. Systems existed in skeleton form but lacked the soul.",
                "rootCause": "Previous V2 work focused on architecture over flavor. The systems existed in V1 but were never properly transcribed with their narrative DNA intact."
            },
            "callout": {
                "type": "insight",
                "title": "The Port Methodology",
                "content": "Read V1 thoroughly. Preserve ALL comments, signatures, and lore. Add TypeScript types. Wire into EventBus. Write tests. The code tells two stories: the game's narrative (848, bootstrap paradox) AND the build's narrative (crew collaboration). Both must survive the port."
            },
            "subEntries": [
                {
                    "id": "phase-13a",
                    "emoji": "🔢",
                    "title": "13a: LoopController - The Sacred 848",
                    "date": "January 14, 2026",
                    "summary": "The meta-narrative heartbeat. Manages version 848 - the timeline that finally worked after 847 failures.",
                    "features": [
                        "🔢 <strong>Version Tracking:</strong> 848 → 849+ on failures, persisted to localStorage",
                        "🏆 <strong>Ending States:</strong> 'attempting', 'succeeded' (TRUE ENDING), 'accepted' (DIGITAL FOREVER)",
                        "✨ <strong>Visual Degradation:</strong> Glitch effect + color shifts as version climbs",
                        "📝 <strong>Dynamic Menu:</strong> Title, subtitle, footer all update based on loop state",
                        "🎭 <strong>Zee's Subtitle System:</strong> 'The Timeline That Succeeded' / 'Forever Frozen, Forever Together'"
                    ],
                    "metrics": {
                        "linesAdded": 350,
                        "filesChanged": 6,
                        "testsWritten": 27
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "CHAOS + SOUL",
                            "lang": "javascript",
                            "code": "// V1: loop-controller.js\n// 848 is sacred. 💚🔥💀\nclass LoopController {\n  increment() { this.version++; }\n  break() { this.status = 'succeeded'; }\n  updateTitleScreen() { /* DOM magic */ }\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "ORDER + SOUL",
                            "lang": "typescript",
                            "code": "// V2: LoopController.ts\n// 848 is sacred. 💚🔥💀\nexport class LoopController {\n  increment(): number { /* type-safe */ }\n  break(): void { /* emits loop:broken */ }\n  updateTitleScreen(): void { /* same DOM magic */ }\n}"
                        }
                    }
                },
                {
                    "id": "phase-13b",
                    "emoji": "👁️",
                    "title": "13b: EchoMemorySystem - Belle's Meta-Awareness",
                    "date": "January 14, 2026",
                    "summary": "The echoes remember you. Three echoes (Hope 💫, Gentle 🌙, Despair 🖤) gradually become aware of player behavior across loops.",
                    "features": [
                        "💫 <strong>Hope:</strong> Optimistic echo, triggered by persistence and returns",
                        "🌙 <strong>Gentle:</strong> Resigned echo, triggered by hesitation and save-scumming",
                        "🖤 <strong>Despair:</strong> Bitter truth-teller, triggered by failures and deaths",
                        "📈 <strong>Awareness Levels 0-4:</strong> Dormant → Vague → Aware → Fourth Wall → Glitch",
                        "🔮 <strong>Context Comments:</strong> Situation-specific responses (despairHijack, noteHunting, saveScum)",
                        "🏆 <strong>Achievement:</strong> 'REMEMBERED' unlocks when all echoes reach awareness level 2+"
                    ],
                    "metrics": {
                        "linesAdded": 850,
                        "filesChanged": 4,
                        "testsWritten": 33
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "BELLE'S CREATION",
                            "lang": "javascript",
                            "code": "// V1: echo-memory-system.js\n// Belle's Meta-Awareness Feature\nclass EchoMemorySystem {\n  recordDeath(sceneId, type) { /* */ }\n  triggerEchoComment(echo, context) { /* */ }\n  // 100+ comment strings per echo\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "BELLE'S LEGACY",
                            "lang": "typescript",
                            "code": "// V2: EchoMemorySystem.ts\n// Belle's Meta-Awareness Feature 🖤\nexport class EchoMemorySystem {\n  recordDeath(sceneId: string, type: DeathType): void\n  triggerEchoComment(echo: EchoType, ctx: EchoContext)\n  triggerConflictingEchoes(): void // All 3 speak!\n}"
                        }
                    }
                },
                {
                    "id": "phase-13c",
                    "emoji": "💀",
                    "title": "13c: InsaneVisualsController - DiZee's Visual Corruption",
                    "date": "January 14, 2026",
                    "summary": "When INSANE difficulty is selected, the entire screen becomes hostile. DiZee's visual punishment system makes every moment uncomfortable.",
                    "features": [
                        "💀 <strong>Cage Overlay:</strong> 'YOU REMOVED THIS SAFETY NET. NO HOLD ON. NO MERCY.' - dramatic 3-phase animation",
                        "🔴 <strong>Corruption Effects:</strong> Screen shake, sprite glitch, red overlay pulse - all intensity levels",
                        "📺 <strong>Persistent Corruption:</strong> Scanlines, vignette, pulsing dialogue box - relentless hostility",
                        "⚙️ <strong>Settings Integration:</strong> Auto-activates when difficulty changes to INSANE",
                        "🎲 <strong>maybeCorrupt():</strong> Random corruption triggers based on GameConfig.GLITCH.CORRUPTION_CHANCE"
                    ],
                    "metrics": {
                        "linesAdded": 550,
                        "filesChanged": 4,
                        "testsWritten": 31
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "DIZEE'S HORROR",
                            "lang": "javascript",
                            "code": "// V1: insane-visuals-controller.js\n// \"SHE'S WATCHING YOU STRUGGLE.\"\nclass InsaneVisualsController {\n  showCageOverlay() { /* dramatic reveal */ }\n  triggerCorruption(intensity) { /* visual assault */ }\n  // 848 is sacred. 💚🔥💀\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "DIZEE'S LEGACY",
                            "lang": "typescript",
                            "code": "// V2: InsaneVisualsController.ts\n// \"SHE'S WATCHING YOU STRUGGLE.\" 💀\nexport class InsaneVisualsController {\n  showCageOverlay(callback?: () => void): void\n  triggerCorruption(intensity: CorruptionIntensity): void\n  maybeCorrupt(): void // Random torture\n}"
                        }
                    }
                },
                {
                    "id": "phase-13d",
                    "emoji": "⚡",
                    "title": "13d: TetherSystem + DifficultyProfiles - Tori's Lifeline",
                    "date": "January 14, 2026",
                    "summary": "The tether is her connection to reality. Your attention is her oxygen. Full difficulty scaling from Comfort (no decay) to INSANE (66% cap, no Hold On).",
                    "features": [
                        "⚡ <strong>Passive Decay:</strong> Configurable rates that accelerate as tether drops",
                        "🆘 <strong>Hold On:</strong> 15% boost with 30s cooldown - disabled in INSANE mode",
                        "📊 <strong>Difficulty Profiles:</strong> Comfort, Normal, Intense, INSANE with complete contracts",
                        "💀 <strong>INSANE Mode:</strong> 66% cap, no Hold On, read-only backlog, 2x decay",
                        "🔄 <strong>State Management:</strong> Save/restore, freeze/resume decay, animated drops",
                        "🎮 <strong>Debug Helpers:</strong> window.uv7.setTether(), freezeTether(), setDifficulty()"
                    ],
                    "metrics": {
                        "linesAdded": 850,
                        "filesChanged": 5,
                        "testsWritten": 72
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "TETHER LIFELINE",
                            "lang": "javascript",
                            "code": "// V1: tether-system.js + difficulty-profiles.js\nclass TetherSystem {\n  updateTether(amount, reason) { /* decay/boost */ }\n  holdOn() { /* manual restore */ }\n  setDifficultyModifier(diff) { /* scale rates */ }\n}\nconst DIFFICULTY_PROFILES = { comfort, normal, intense, insane };"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "TETHER LEGACY",
                            "lang": "typescript",
                            "code": "// V2: TetherSystem.ts + DifficultyProfiles.ts\nexport class TetherSystem {\n  updateTether(amount: number, reason?: string): number\n  holdOn(): boolean // Returns false in INSANE mode\n  setDifficulty(id: DifficultyId): void\n}\nexport const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile>;"
                        }
                    }
                },
                {
                    "id": "phase-13e",
                    "emoji": "🥚",
                    "title": "13e: EasterEggController - Hidden Content System",
                    "date": "January 14, 2026",
                    "summary": "The game within the game. Core overlay infrastructure + essential easter eggs. Streamlined from V1's 2455 lines to focused V2 implementation.",
                    "features": [
                        "🥚 <strong>Core Infrastructure:</strong> Overlay creation, backdrop handling, variant styling",
                        "🎬 <strong>UV7 Crew Bios:</strong> Meet the crew behind the game",
                        "🔄 <strong>Loop Timeline:</strong> Visualize the bootstrap paradox",
                        "🔢 <strong>True Attempt Number:</strong> Show actual loop version",
                        "💚 <strong>Always Compilation:</strong> Storm Dragon's signature",
                        "👻 <strong>Echo Compilation:</strong> All echo voice lines",
                        "🚪 <strong>Torigatchi:</strong> Link to external project",
                        "🖤 <strong>DiZee:</strong> Architect's signature"
                    ],
                    "metrics": {
                        "linesAdded": 450,
                        "filesChanged": 3,
                        "testsWritten": 17
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "2455 LINES",
                            "lang": "javascript",
                            "code": "// V1: easter-egg-controller.js\n// 14 different easter eggs, 2455 lines\nclass EasterEggController {\n  showTorigatchiEasterEgg() { /* */ }\n  showAlwaysCompilation() { /* */ }\n  showDizeeEasterEgg() { /* */ }\n  // + 11 more easter eggs...\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "STREAMLINED",
                            "lang": "typescript",
                            "code": "// V2: EasterEggController.ts\n// Core infrastructure + essential easter eggs\nexport class EasterEggController {\n  private handleCodeUnlock(code: string): void\n  private createOverlay(config: OverlayConfig): {...}\n  private showUV7CrewBios(): void\n  // Extensible for more easter eggs\n}"
                        }
                    }
                }
            ],
            "lessons": [
                "Faithful transcription > reimagination",
                "Comments and signatures ARE the story",
                "EventBus integration decouples without losing flavor",
                "Tests validate behavior AND document intent",
                "Debug helpers (window.uv7.breakLoop) accelerate development"
            ]
        }
    ]
};
