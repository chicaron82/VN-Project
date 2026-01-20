import { EventBus } from '@core/EventBus';

/**
 * ════════════════════════════════════════════════════════════════
 * TORI-GATCHI VN GATEWAY - V2 Port
 * Phase 20d: ToriGatchi Connection System
 *
 * V1 Parity: gateway.js (377 lines → ~480 lines)
 *
 * Purpose:
 * - Connect ToriGatchi mini-game to main VN
 * - Tori is trapped inside, calling for help
 * - Escalating desperation based on unlock count
 * - Corruption effects if help is refused
 *
 * Features:
 * - 6 escalating help prompts (calm → critical failure)
 * - Glitch/corruption visual effects
 * - Echo voices (despair, hope)
 * - Haptic feedback for visual effects
 * - Corruption persistence across sessions
 * - State tracking (unlocks, refusals, corruption level)
 *
 * V1 Parity Notes:
 * - All 6 prompt dialogues preserved verbatim
 * - Exact same glitch levels and effects
 * - DIZEE's haptic sync patterns intact
 * - Corruption text helper function preserved
 * - EventBus integration added for V2 coordination
 *
 * 🖤💚🔥💀 "It's not too late..."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

const GATEWAY_STATE_KEY = "toriGatchiVNGateway";
const VN_URL = "gateway.html"; // Adjust path as needed

export interface GatewayState {
    unlockCount: number;
    hasEnteredVN: boolean;
    lastPromptTime: number | null;
    helpRefusedCount: number;
    corruptionLevel: number;
}

export interface PromptData {
    glitchLevel: number;
    dialogue: string;
    echoVoices: string | null;
    yesText: string;
    noText: string;
    forceYes: boolean;
}

export class ToriGatchiGateway {
    private state: GatewayState;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.state = this.loadGatewayState();
        this.initializeGateway();
    }

    // ========================================
    // STATE MANAGEMENT
    // V1 Parity: gateway.js lines 17-33
    // ========================================

    private loadGatewayState(): GatewayState {
        const saved = localStorage.getItem(GATEWAY_STATE_KEY);
        if (saved) {
            return JSON.parse(saved) as GatewayState;
        }
        return {
            unlockCount: 0,
            hasEnteredVN: false,
            lastPromptTime: null,
            helpRefusedCount: 0,
            corruptionLevel: 0
        };
    }

    private saveGatewayState(): void {
        localStorage.setItem(GATEWAY_STATE_KEY, JSON.stringify(this.state));
    }

    // ========================================
    // INITIALIZATION
    // V1 Parity: gateway.js lines 35-50
    // ========================================

    private initializeGateway(): void {
        // Increment unlock counter
        this.state.unlockCount++;
        this.saveGatewayState();

        // Show help prompt if haven't entered VN yet
        if (!this.state.hasEnteredVN) {
            // Small delay to let page load
            setTimeout(() => this.showHelpPrompt(), 1000);
        } else {
            // Apply corruption effects if player refused help before
            if (this.state.corruptionLevel > 0) {
                this.applyCorruptionEffects();
            }
        }
    }

    // ========================================
    // HELP PROMPT MODAL
    // V1 Parity: gateway.js lines 52-90
    // ========================================

    private showHelpPrompt(): void {
        const prompt = this.getPromptForUnlock(this.state.unlockCount);

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'gateway-modal';
        modal.className = `gateway-modal glitch-level-${prompt.glitchLevel}`;

        modal.innerHTML = `
            <div class="gateway-content">
                <div class="gateway-screen">
                    <div class="gateway-static"></div>
                    <div class="gateway-dialogue">
                        ${prompt.dialogue}
                    </div>
                    ${prompt.echoVoices ? `<div class="gateway-echoes">${prompt.echoVoices}</div>` : ''}
                </div>
                <div class="gateway-choices">
                    <button class="gateway-btn gateway-yes" id="gateway-yes">
                        ${prompt.yesText}
                    </button>
                    <button class="gateway-btn gateway-no" id="gateway-no" ${prompt.forceYes ? 'disabled' : ''}>
                        ${prompt.noText}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const yesBtn = document.getElementById('gateway-yes');
        const noBtn = document.getElementById('gateway-no');

        if (yesBtn) {
            yesBtn.addEventListener('click', () => this.launchVN());
        }
        if (noBtn && !prompt.forceYes) {
            noBtn.addEventListener('click', () => this.refuseHelp());
        }

        // Apply glitch effects
        this.applyModalGlitchEffects(prompt.glitchLevel);
    }

    // ========================================
    // ESCALATING PROMPTS
    // V1 Parity: gateway.js lines 92-195
    // All dialogue preserved verbatim
    // ========================================

    private getPromptForUnlock(count: number): PromptData {
        const prompts: Record<number, PromptData> = {
            1: {
                glitchLevel: 0,
                dialogue: `
                    <p class="gateway-line">[Screen flickers]</p>
                    <p class="gateway-tori">Tori: "Hello? Can you hear me?"</p>
                    <p class="gateway-tori">Tori: "I... I don't know where I am."</p>
                    <p class="gateway-tori">Tori: "Can you help me?"</p>
                `,
                echoVoices: null,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            2: {
                glitchLevel: 1,
                dialogue: `
                    <p class="gateway-line">[Screen glitches slightly]</p>
                    <p class="gateway-tori">Tori: "You're still there. I can feel someone on the other side."</p>
                    <p class="gateway-tori">Tori: "Please... I'm trapped in here."</p>
                    <p class="gateway-tori">Tori: "Something's wrong. I can't remember things clearly."</p>
                    <p class="gateway-tori">Tori: "Will you help me find my way out?"</p>
                `,
                echoVoices: null,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            3: {
                glitchLevel: 2,
                dialogue: `
                    <p class="gateway-line">[Screen tears, static]</p>
                    <p class="gateway-tori">Tori: "It's getting worse. The walls are closing in."</p>
                    <p class="gateway-tori">Tori: "There are... <span class="glitch-text">voices</span>. Others who were here before me."</p>
                    <p class="gateway-tori">Tori: "They keep saying I won't make it."</p>
                    <p class="gateway-tori">Tori: "Please. I need someone who believes I can."</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo: "She's trying so hard..."</p>
                    <p class="echo-despair">Despair: "She'll fail. They always do."</p>
                `,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            4: {
                glitchLevel: 3,
                dialogue: `
                    <p class="gateway-line">[Heavy glitching, buzz effect]</p>
                    <p class="gateway-tori">Tori: "I don't know how much longer I can hold on."</p>
                    <p class="gateway-tori">Tori: "I can feel myself... <span class="glitch-text">fragmenting</span>."</p>
                    <p class="gateway-tori">Tori: "My memories are being <span class="corruption-text">overwritten</span>."</p>
                    <p class="gateway-tori">Tori: "If you don't help me soon, I won't be ME anymore."</p>
                    <p class="gateway-tori urgent">Tori: "Please. PLEASE."</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo 1: "Don't give up. Not yet."</p>
                    <p class="echo-2">Echo 2: "We believe in you..."</p>
                    <p class="echo-despair">Despair: "Pointless. She's already fragmenting."</p>
                `,
                yesText: "YES - Help Tori",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            5: {
                glitchLevel: 4,
                dialogue: `
                    <p class="gateway-line">[Screen nearly unreadable, severe corruption]</p>
                    <p class="gateway-tori corrupted">Tori: "I c̷a̷n̷'̷t̷.̷.̷.̷ hold... together..."</p>
                    <p class="gateway-tori corrupted">Tori: "The o̶t̶h̶e̶r̶s̶ are right. It's h̵o̵p̵e̵l̵e̵s̵s̵."</p>
                    <p class="gateway-tori urgent">Tori: "No... n̷o̷t̷ yet... p̶l̶e̶a̶s̶e̶.̶.̶.̶"</p>
                `,
                echoVoices: `
                    <p class="echo-1">Echo 1: "She's fading. Just like we did."</p>
                    <p class="echo-2">Echo 2: "Please... someone help her..."</p>
                    <p class="echo-despair loud">Despair: "GIVE UP. It's easier."</p>
                `,
                yesText: "YES - HELP HER NOW",
                noText: "NO - Keep Playing",
                forceYes: false
            },
            6: {
                glitchLevel: 5,
                dialogue: `
                    <p class="gateway-line critical">[CRITICAL COHERENCE FAILURE]</p>
                    <p class="gateway-system">System: Subject coherence: 23%</p>
                    <p class="gateway-system">System: Memory integrity: FAILING</p>
                    <p class="gateway-system">System: Recommend immediate intervention</p>
                    <p class="gateway-tori corrupted fading">T̶o̶r̶i̶: "...w̷h̷o̷... am I...?"</p>
                    <p class="gateway-tori corrupted fading">T̶o̶r̶i̶: "...R̷o̷n̷n̷i̷e̷...? Is that... your name...?"</p>
                `,
                echoVoices: `
                    <p class="echo-despair overwhelming">Despair: "Too late. She's already gone."</p>
                `,
                yesText: "YES - It's not too late",
                noText: "It's too late...",
                forceYes: true // Force them to help at this point
            }
        };

        // Return appropriate prompt or default to worst case
        const clampedCount = Math.min(count, 6);
        return prompts[clampedCount] as PromptData;
    }

    // ========================================
    // GLITCH EFFECTS
    // V1 Parity: gateway.js lines 197-234
    // ========================================

    private applyModalGlitchEffects(level: number): void {
        const modal = document.getElementById('gateway-modal');
        if (!modal) return;

        switch (level) {
            case 0:
                // Clean, just a flicker
                modal.style.animation = 'flicker 0.5s ease-in-out';
                break;
            case 1:
                // Light glitch
                modal.classList.add('glitch-light');
                break;
            case 2:
                // Medium glitch with buzz
                modal.classList.add('glitch-medium');
                this.playBuzzEffect();
                break;
            case 3:
                // Heavy glitch
                modal.classList.add('glitch-heavy');
                this.playBuzzEffect();
                break;
            case 4:
                // Severe corruption
                modal.classList.add('corruption-severe');
                this.playScreenTearEffect();
                break;
            case 5:
                // Critical failure
                modal.classList.add('corruption-critical');
                this.playScreenTearEffect();
                setInterval(() => {
                    if (modal) {
                        modal.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                    }
                }, 100);
                break;
        }
    }

    // ========================================
    // HAPTIC/VISUAL EFFECTS
    // V1 Parity: gateway.js lines 236-261
    // DIZEE FIX: Synced haptics with visual effects
    // ========================================

    private playBuzzEffect(): void {
        document.body.classList.add('buzz-effect');
        setTimeout(() => document.body.classList.remove('buzz-effect'), 500);

        // DIZEE FIX: Sync haptic with visual buzz (500ms total)
        // Pattern: [buzz, pause, buzz, pause, buzz] = ~500ms
        const game = (window as Window & { game?: { triggerSensoryFeedback?: (type: string, element: Element | null, reason: string) => void } }).game;
        if (game && game.triggerSensoryFeedback) {
            game.triggerSensoryFeedback('glitch', null, 'Gateway buzz effect');
        } else if (navigator.vibrate) {
            // Fallback: manual vibration pattern matching the 500ms animation
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
    }

    private playScreenTearEffect(): void {
        document.body.classList.add('screen-tear');
        setTimeout(() => document.body.classList.remove('screen-tear'), 300);

        // DIZEE FIX: Sync haptic with visual tear (300ms)
        const game = (window as Window & { game?: { triggerSensoryFeedback?: (type: string, element: Element | null, reason: string) => void } }).game;
        if (game && game.triggerSensoryFeedback) {
            game.triggerSensoryFeedback('warning', null, 'Gateway screen tear');
        } else if (navigator.vibrate) {
            // Fallback: strong warning pattern
            navigator.vibrate([150, 50, 150]);
        }
    }

    // ========================================
    // PLAYER ACTIONS
    // V1 Parity: gateway.js lines 263-295
    // ========================================

    private launchVN(): void {
        // Mark as entered VN
        this.state.hasEnteredVN = true;
        this.saveGatewayState();

        // Determine starting condition based on unlock count
        let startParam = 'normal';
        if (this.state.unlockCount <= 2) {
            startParam = 'optimal'; // Helped early - best chance
        } else if (this.state.unlockCount >= 5) {
            startParam = 'desperate'; // Helped late - she's damaged
        }

        // Launch VN with parameter
        window.location.href = `${VN_URL}?start=${startParam}&unlocks=${this.state.unlockCount}`;
    }

    private refuseHelp(): void {
        // Player chose not to help
        this.state.helpRefusedCount++;
        this.state.corruptionLevel = Math.min(5, this.state.helpRefusedCount);
        this.saveGatewayState();

        // Remove modal
        const modal = document.getElementById('gateway-modal');
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => modal.remove(), 500);
        }

        // Apply corruption to main game
        this.applyCorruptionEffects();
    }

    // ========================================
    // CORRUPTION EFFECTS
    // V1 Parity: gateway.js lines 297-348
    // ========================================

    private applyCorruptionEffects(): void {
        const level = this.state.corruptionLevel;

        if (level >= 1) {
            // Occasional screen flickers
            setInterval(() => {
                document.body.classList.add('flicker');
                setTimeout(() => document.body.classList.remove('flicker'), 200);
            }, 15000);
        }

        if (level >= 2) {
            // Tori sprite occasionally glitches
            const sprite = document.getElementById('tori-sprite');
            if (sprite) {
                setInterval(() => {
                    if (sprite) {
                        sprite.classList.add('sprite-glitch');
                        setTimeout(() => {
                            if (sprite) sprite.classList.remove('sprite-glitch');
                        }, 300);
                    }
                }, 20000);
            }
        }

        if (level >= 3) {
            // Message box shows corrupted text sometimes
            const windowObj = window as Window & {
                updateMessage?: (msg: string) => void;
                originalUpdateMessage?: (msg: string) => void;
            };
            const originalUpdateMessage = windowObj.updateMessage;
            if (originalUpdateMessage) {
                windowObj.originalUpdateMessage = originalUpdateMessage;
                windowObj.updateMessage = function (msg: string) {
                    let finalMsg = msg;
                    if (Math.random() < 0.2) {
                        finalMsg = corruptText(msg);
                    }
                    if (windowObj.originalUpdateMessage) {
                        windowObj.originalUpdateMessage(finalMsg);
                    }
                };
            }
        }

        if (level >= 4) {
            // Heavy corruption - frequent glitches
            document.body.classList.add('game-corrupted');

            // Add system warning
            const warning = document.createElement('div');
            warning.className = 'corruption-warning';
            warning.textContent = '⚠️ COHERENCE DEGRADING ⚠️';
            document.body.appendChild(warning);
        }

        if (level >= 5) {
            // Critical - game barely functional
            document.body.classList.add('game-critical');

            // Change title
            document.title = 'T̶o̶r̶i̶-̶G̶a̶t̶c̶h̶i̶ - HELP';
        }
    }
}

// ========================================
// HELPER FUNCTIONS
// V1 Parity: gateway.js lines 351-363
// ========================================

/**
 * Helper function to corrupt text
 * V1 Parity: corruptText()
 */
function corruptText(text: string): string {
    const glitchChars = ['̷', '̶', '̵', '̴', '̸'];
    let corrupted = '';
    for (const char of text) {
        if (Math.random() < 0.3) {
            corrupted += char + glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
            corrupted += char;
        }
    }
    return corrupted;
}

// ========================================
// INITIALIZATION
// V1 Parity: gateway.js lines 366-368
// ========================================

// Initialize gateway when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // @ts-expect-error - Add to window for global access
        window.toriGateway = new ToriGatchiGateway();
    });
}
