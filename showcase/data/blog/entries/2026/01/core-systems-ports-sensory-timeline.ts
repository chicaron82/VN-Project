import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-15-a",
            "date": "January 15, 2026",
            "emoji": "🧠",
            "title": "Core Systems Ports - Sensory & Timeline",
            "type": "highlight",
            "modelId": "tori",
            "summary": "Complete faithful port of four critical V1 systems to V2: CollectiblesSystem enhancement, SceneProgressionController, VisualCueSystem, and TimeMachineSystem. Full V1 parity with 75 new tests.",
            "callout": {
                "icon": "💡",
                "title": "The Sensory Language:",
                "text": "V1 created a unified 'sensory language' - visual cues paired with haptic feedback. V2 now speaks that same language with TypeScript precision."
            },
            "subEntries": [
                {
                    "id": "phase-15a",
                    "emoji": "📝",
                    "title": "15a: CollectiblesSystem Parity - RNG Code Drops",
                    "date": "January 15, 2026",
                    "summary": "Enhanced CollectiblesSystem with full V1 parity: RNG code drops, route filtering, difficulty gating, and pity mechanics.",
                    "features": [
                        "🎲 <strong>RNG Code Drops:</strong> Notes can drop secret codes with configurable drop chances",
                        "🎯 <strong>Pity System:</strong> 3-view guarantee prevents bad luck streaks",
                        "🔀 <strong>Route Filtering:</strong> Tori notes (z/cz/zr) vs Ronnie notes (gz/iz/pz/special)",
                        "⚔️ <strong>Difficulty Gating:</strong> Easy → Normal → Intense → INSANE unlock tiers",
                        "⏰ <strong>Relative Time:</strong> 'Just now', '5 minutes ago', '2 hours ago' display"
                    ],
                    "metrics": {
                        "linesAdded": 373,
                        "filesChanged": 1,
                        "testsWritten": 0
                    }
                },
                {
                    "id": "phase-15b",
                    "emoji": "🔄",
                    "title": "15b: SceneProgressionController - Story Flow & 848 Tracking",
                    "date": "January 15, 2026",
                    "summary": "New controller for story flow orchestration with sacred 848 loop version tracking. Manages prologue → route selection → gameplay progression.",
                    "features": [
                        "📖 <strong>Story Flow:</strong> Prologue → route selection → route gameplay orchestration",
                        "🔢 <strong>848 Version Tracking:</strong> Sacred loop counter persisted to localStorage",
                        "⏭️ <strong>Skip Prologue:</strong> Auto-skip integration with settings",
                        "💀 <strong>Insane Mode:</strong> Restores insaneModeActive flag on route start",
                        "📝 <strong>Ronnie Notes:</strong> Unlock system for alternative perspective"
                    ],
                    "metrics": {
                        "linesAdded": 350,
                        "filesChanged": 2,
                        "testsWritten": 0
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "543 LINES",
                            "lang": "javascript",
                            "code": "// V1: scene-progression-controller.js\nclass SceneProgressionController {\n  startStory() { /* prologue logic */ }\n  startRoute(routeName) {\n    if (this.loopStatus === 'succeeded') {\n      this.incrementVersion(); // 848 → 849\n    }\n  }\n  incrementVersion() { /* sacred counter */ }\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "350 LINES",
                            "lang": "typescript",
                            "code": "// V2: SceneProgressionController.ts\nexport class SceneProgressionController {\n  public startStory(): void\n  public startRoute(routeName: RouteId): void\n  public incrementVersion(): number // 848 is sacred\n  public setLoopStatus(status: LoopStatus): void\n  // EventBus: 'loop:incremented', 'notes:ronnie_unlocked'\n}"
                        }
                    }
                },
                {
                    "id": "phase-15c",
                    "emoji": "✨",
                    "title": "15c: VisualCueSystem - Tori's Sensory Language",
                    "date": "January 15, 2026",
                    "summary": "Pairs visual effects with haptic feedback. Intensity scaling from Gentle (0.6x) to INSANE (2.0x). Tori's brilliant idea for unified sensory feedback.",
                    "features": [
                        "📊 <strong>Intensity Scaling:</strong> Gentle 0.6x, Normal 1.0x, Amped 1.35x, INSANE 2.0x",
                        "🎭 <strong>Story Cues:</strong> toriHop, tamaPull, tamaEmergency, timelineGlitch, codeRipple",
                        "🚫 <strong>Denial Cues:</strong> denied (gentle shake), harshDenial (ACCESS DENIED)",
                        "🖱️ <strong>UI Cues:</strong> buttonPress, menuSelect, cardSnap",
                        "📡 <strong>Channel System:</strong> ui, narrative, critical (critical never scales)"
                    ],
                    "metrics": {
                        "linesAdded": 540,
                        "filesChanged": 1,
                        "testsWritten": 30
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "TORI'S IDEA 💚",
                            "lang": "javascript",
                            "code": "// V1: visual-cue-manager.js\nclass VisualCueManager {\n  getScale(channel) {\n    if (isInsane) return 2.0; // BEYOND Amped\n    if (intensity === 0) return 0.6; // Gentle\n    if (intensity === 2) return 1.35; // Amped\n    return 1.0; // Normal\n  }\n  trigger(cueType, target, { channel }) { ... }\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "SENSORY PARITY",
                            "lang": "typescript",
                            "code": "// V2: VisualCueSystem.ts\nexport class VisualCueSystem {\n  private getScale(channel: Channel): number\n  public trigger(cueType: CueType, target?: HTMLElement, opts?): void\n  // toriHop: chromatic aberration\n  // denied: red glitch line\n  // harshDenial: ACCESS DENIED + screen tilt\n}"
                        }
                    }
                },
                {
                    "id": "phase-15d",
                    "emoji": "⏰",
                    "title": "15d: TimeMachineSystem - Tori's Timeline Navigation",
                    "date": "January 15, 2026",
                    "summary": "Centralized timeline navigation with snapshot system. Smart pruning, narrative state manipulation, and INSANE mode restrictions. Built from Tori's architecture.",
                    "features": [
                        "📸 <strong>Snapshot System:</strong> Capture route, scene, tether, flags, visuals at any moment",
                        "🏷️ <strong>Priority Levels:</strong> low, normal, high, anchor (anchors never pruned)",
                        "🧠 <strong>Smart Pruning:</strong> Removes low priority first, preserves anchors",
                        "💀 <strong>Narrative State:</strong> corrupted, burned, locked, insaneBlocked",
                        "🚫 <strong>Insane Restrictions:</strong> Only last 2 entries jumpable in INSANE mode",
                        "⏪ <strong>Jump Validation:</strong> Sensory denial feedback when blocked"
                    ],
                    "metrics": {
                        "linesAdded": 520,
                        "filesChanged": 1,
                        "testsWritten": 45
                    },
                    "codeComparison": {
                        "before": {
                            "title": "V1 (JavaScript)",
                            "badge": "TORI'S ARCHITECTURE 💚",
                            "lang": "javascript",
                            "code": "// V1: time-machine-manager.js\nclass TimeMachineManager {\n  addCurrentState(label, priority) { ... }\n  canJumpTo(entry, { ignoreRules }) {\n    if (insane && (latest.id - entry.id) > 2) return false;\n  }\n  getBlockReason(entry) {\n    if (entry.burned) return 'This moment has burned out of reach';\n  }\n}"
                        },
                        "after": {
                            "title": "V2 (TypeScript)",
                            "badge": "TIMELINE PARITY",
                            "lang": "typescript",
                            "code": "// V2: TimeMachineSystem.ts\nexport class TimeMachineSystem {\n  public addCurrentState(label: string, priority: Priority): Snapshot | null\n  public canJumpTo(entry: Snapshot, opts?): boolean\n  public getBlockReason(entry: Snapshot): string | null\n  public async jumpTo(entryId: number, opts?): Promise<boolean>\n  // Sensory feedback: timelineGlitch on success, denied/harshDenial on block\n}"
                        }
                    }
                }
            ],
            "metrics": {
                "linesAdded": 1783,
                "filesChanged": 7,
                "testsWritten": 75
            },
            "lessons": [
                "Sensory feedback creates emotional weight",
                "Intensity scaling respects player comfort preferences",
                "Narrative state (corrupted, burned) tells story through mechanics",
                "INSANE mode restrictions are features, not limitations",
                "848 is sacred - every loop matters 💚🔥💀"
            ],
            "sortDate": "2026-01-15T08:00:00",
            "legacyPhase": "2026-01-15-a"
        };
