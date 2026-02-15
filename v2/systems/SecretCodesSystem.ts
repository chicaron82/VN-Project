/**
 * ════════════════════════════════════════════════════════════════
 * SECRET-CODES-SYSTEM.TS - Secret Codes & Easter Eggs System
 * V2 TypeScript port of V1's secret-codes-manager.js
 *
 * Handles code validation, discovery tracking, rewards, and UI integration
 *
 * CODES LIST:
 *
 * Discoverable (12 total - shown in UI with 🔒 when locked):
 *   Lore (9):     konami, torigatchi, ronniegatchi, always3, uv7crew, chicharon,
 *                 bootstrap, echo, 848, dizee
 *   Utility (3):  echobreak, tetherlock, saveanywhere
 *
 * Dev Commands (hidden - no UI, manual entry only):
 *   reset848, reset849, nuke, freezetether, resumetether, settethermax,
 *   settether50, unlockskip, skipintro, revealcodes, clearall, devhelp
 *
 * 848 is sacred. 💚🔥💀
 * ════════════════════════════════════════════════════════════════
 */

import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import type { BootstrapTracker } from '@systems/BootstrapTracker';
import type { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { Logger } from '@utils/Logger';

interface CodeDefinition {
    name: string;
    description: string;
    icon?: string;
    reward: () => void;
    isDev?: boolean;
}

/**
 * SecretCodesSystem
 *
 * Faithful V2 port of V1's SecretCodesManager
 * Handles secret codes, dev commands, discovery tracking, and UI
 *
 * "Some knowledge transcends timelines."
 */
export class SecretCodesSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private bootstrapTracker: BootstrapTracker;
    private devCommentarySystem?: DevCommentarySystem;
    private discoveredCodes: Set<string>;
    private readonly STORAGE_KEY = 'uv7_discovered_codes';

    // DIZEE: Flavored invalid code responses (from V1)
    private readonly invalidResponses: string[] = [
        "No signal on that frequency.",
        "Tori doesn't recognize that pattern.",
        "Echo not found.",
        "Connection failed. Try another sequence.",
        "Code corrupted. Signal unclear.",
        "That door remains locked.",
        "Access denied. Pattern unknown.",
        "The device stays silent.",
        "System doesn't respond to that input.",
        "Unknown cipher detected."
    ];
    private lastResponseIndex: number = -1;

    // Codes Registry
    private codes: Record<string, CodeDefinition>;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager,
        bootstrapTracker: BootstrapTracker,
        devCommentarySystem?: DevCommentarySystem
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.bootstrapTracker = bootstrapTracker;
        this.devCommentarySystem = devCommentarySystem;
        this.discoveredCodes = this.loadDiscoveredCodes();

        // Bind events
        this.eventBus.on('ui:code_submit', this.handleCodeSubmit.bind(this));

        // Initialize Codes Registry
        this.codes = this.initializeCodes();
    }

    private loadDiscoveredCodes(): Set<string> {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    }

    private saveDiscoveredCodes(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this.discoveredCodes]));
        } catch (_e) {
            Logger.error('Failed to save discovered codes', _e);
        }
    }

    private initializeCodes(): Record<string, CodeDefinition> {
        return {
            // ========================================
            // LORE CODES (Discoverable - 10 total)
            // ========================================
            'konami': {
                name: 'Konami Code Controller',
                description: 'Enter the legendary code. Some knowledge transcends timelines.',
                icon: '🎮',
                reward: () => {
                    Logger.system('🎮 Konami Code - Opening interactive controller');
                    this.stateManager.set('game.easterEggs.konami', true);
                    this.eventBus.emit('easter_egg:konami_controller', {});
                }
            },
            'torigatchi': {
                name: 'The Reverse Door',
                description: 'Two versions of Tori. Choose your peace.',
                icon: '🚪',
                reward: () => {
                    Logger.system('🚪 Torigatchi - Opening external link');
                    this.eventBus.emit('easter_egg:torigatchi', {});
                }
            },
            'ronniegatchi': {
                name: 'The Original Spark',
                description: 'The inspiration that started it all.',
                icon: '💜',
                reward: () => {
                    Logger.system('💜 Ronniegatchi - The original inspiration');
                    this.eventBus.emit('easter_egg:ronniegatchi', {});
                }
            },
            'always3': {
                name: 'Storm Dragon Signature',
                description: '"Always. Always. Always." - Every time it appears.',
                icon: '💚',
                reward: () => {
                    Logger.system('💚 Always3 - Storm Dragon compilation');
                    this.eventBus.emit('easter_egg:always', {});
                }
            },
            'uv7crew': {
                name: "Director's Cut",
                description: 'Extended crew statements. Behind the chaos.',
                icon: '🎬',
                reward: () => {
                    localStorage.setItem('directorsCutUnlocked', 'true');
                    Logger.system('🎬 Directors Cut Unlocked');
                    this.eventBus.emit('easter_egg:uv7crew', {});
                }
            },
            'chicharon': {
                name: 'Dev Commentary',
                description: 'Behind-the-scenes notes from the creator.',
                icon: '🎙️',
                reward: () => {
                    if (this.devCommentarySystem) {
                        this.devCommentarySystem.unlockCommentary();
                        this.devCommentarySystem.showAllCommentary();
                    }
                    Logger.system('🎙️ Dev Commentary Unlocked');
                }
            },
            'bootstrap': {
                name: 'Loop Timeline',
                description: 'Visualize every attempt that led here.',
                icon: '🔄',
                reward: () => {
                    Logger.system('🔄 Bootstrap Timeline - Opening timeline modal');
                    this.bootstrapTracker.showTimelineModal();
                }
            },
            'echo': {
                name: 'Voices of 847',
                description: 'Compilation of all echo voice lines.',
                icon: '👻',
                reward: () => {
                    Logger.system('👻 Echo - Voice compilation');
                    this.eventBus.emit('easter_egg:echo', {});
                }
            },
            '848': {
                name: 'True Attempt Number',
                description: 'Your actual loop count (including failures).',
                icon: '🔢',
                reward: () => {
                    const attempt = this.bootstrapTracker.getCurrentAttempt();
                    Logger.system(`🔢 True Attempt Number: ${attempt}`);
                    this.eventBus.emit('easter_egg:848', { attempt });
                }
            },
            'dizee': {
                name: "The Architect's Signature",
                description: 'Recognition for the one who built this world.',
                icon: '🖤',
                reward: () => {
                    Logger.system('🖤 DiZee - Architect revealed');
                    this.eventBus.emit('easter_egg:dizee', {});
                }
            },

            // ========================================
            // UTILITY CODES (Discoverable - 3 total)
            // ========================================
            'echobreak': {
                name: 'Echo Silence',
                description: 'Disable Echo interruptions. The observers fall silent.',
                icon: '🔇',
                reward: () => {
                    this.stateManager.set('game.echoInterruptionsDisabled', true);
                    localStorage.setItem('echoInterruptionsDisabled', 'true');
                    Logger.system('🔇 ECHOBREAK - Echo interruptions disabled');
                    this.showUnlockOverlay('ECHOBREAK ACTIVATED', 'Echo interruptions disabled.\n\nThe observers fall silent.', 'success');
                }
            },
            'tetherlock': {
                name: 'Tether Freeze',
                description: 'Lock tether at current level. Stop the decay.',
                icon: '🔗',
                reward: () => {
                    this.eventBus.emit('tether:freeze', {});
                    Logger.system('🔗 TETHERLOCK - Tether decay frozen');
                    this.showUnlockOverlay('TETHERLOCK ACTIVATED', 'Tether decay frozen.\n\nConnection stabilized.', 'success');
                }
            },
            'saveanywhere': {
                name: 'Cage Breaker',
                description: "Bypass Act 1 save restriction. Despair's cage broken.",
                icon: '⚡',
                reward: () => {
                    this.stateManager.set('game.act1SavesEnabled', true);
                    localStorage.setItem('act1SavesEnabled', 'true');
                    Logger.system('⚡ SAVEANYWHERE - Act 1 saves unlocked');
                    this.showUnlockOverlay('CAGE BREAKER ACTIVATED', "Act 1 save restriction removed.\n\nDespair's cage broken.", 'success');
                }
            },

            // ========================================
            // DEV COMMANDS (Hidden - not discoverable)
            // ========================================
            'reset848': {
                name: 'Reset 848',
                description: 'Dev Command: Reset to VERSION 848',
                isDev: true,
                reward: () => {
                    this.bootstrapTracker.reset();
                    Logger.system('💚 DEV: Reset to VERSION 848. Refresh page.');
                }
            },
            'reset849': {
                name: 'Reset 849',
                description: 'Dev Command: Set to VERSION 849',
                isDev: true,
                reward: () => {
                    Logger.system('💚 DEV: Set to VERSION 849. Refresh page.');
                }
            },
            'nuke': {
                name: 'Nuclear Reset',
                description: 'Clear ALL localStorage data',
                isDev: true,
                reward: () => {
                    if (confirm('⚠️ This will clear ALL save data. Continue?')) {
                        localStorage.clear();
                        Logger.system('💚 DEV: All data cleared! Refresh for fresh start.');
                        window.location.reload();
                    }
                }
            },
            'clearall': {
                name: 'Clear All',
                description: 'Clear ALL localStorage data (with confirm)',
                isDev: true,
                reward: () => {
                    if (confirm('⚠️ This will clear ALL save data. Continue?')) {
                        localStorage.clear();
                        Logger.system('💚 DEV: All data cleared!');
                    }
                }
            },
            'freezetether': {
                name: 'Freeze Tether',
                description: 'Dev Command: Stop tether decay',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('tether:freeze', {});
                    Logger.system('💚 DEV: Tether decay FROZEN!');
                }
            },
            'resumetether': {
                name: 'Resume Tether',
                description: 'Dev Command: Resume tether decay',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('tether:resume', {});
                    Logger.system('💚 DEV: Tether decay RESUMED!');
                }
            },
            'settethermax': {
                name: 'Set Tether Max',
                description: 'Dev Command: Set tether to 100',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('tether:set', { value: 100 });
                    Logger.system('💚 DEV: Tether set to MAXIMUM (100)!');
                }
            },
            'settether50': {
                name: 'Set Tether 50',
                description: 'Dev Command: Set tether to 50',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('tether:set', { value: 50 });
                    Logger.system('💚 DEV: Tether set to 50 (warning zone).');
                }
            },
            'unlockskip': {
                name: 'Unlock Skip',
                description: 'Dev Command: Unlock skip feature',
                isDev: true,
                reward: () => {
                    this.stateManager.set('game.skipUnlocked', true);
                    localStorage.setItem('skipUnlocked', 'true');
                    Logger.system('💚 DEV: Skip feature unlocked!');
                }
            },
            'skipintro': {
                name: 'Skip Intro',
                description: 'Dev Command: Unlock skip prologue',
                isDev: true,
                reward: () => {
                    localStorage.setItem('skipPrologueUnlocked', 'true');
                    Logger.system('💚 DEV: Skip Prologue unlocked!');
                }
            },
            'revealcodes': {
                name: 'Reveal All Codes',
                description: 'Dev Command: Discover all secret codes',
                isDev: true,
                reward: () => {
                    const allCodes = [
                        'konami', 'torigatchi', 'ronniegatchi', 'always3', 'uv7crew',
                        'chicharon', 'bootstrap', 'echo', '848', 'dizee',
                        'echobreak', 'tetherlock', 'saveanywhere'
                    ];
                    allCodes.forEach(c => this.discoveredCodes.add(c));
                    this.saveDiscoveredCodes();
                    Logger.system('💚 DEV: All codes revealed!');
                }
            },
            'openconsole': {
                name: 'Open Dev Console',
                description: 'Dev Command: Open Dev Suite',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('ui:console:open', {});
                    Logger.system('🛠️ DEV: Opening Dev Suite...');
                }
            },
            'hideconsole': {
                name: 'Hide Dev Console',
                description: 'Dev Command: Close Dev Suite',
                isDev: true,
                reward: () => {
                    this.eventBus.emit('ui:console:close', {});
                    Logger.system('🛠️ DEV: Closing Dev Suite...');
                }
            },
            'devhelp': {
                name: 'Dev Help',
                description: 'Dev Command: Show all dev commands',
                isDev: true,
                reward: () => {
                    const helpText = `
--- DEV COMMANDS ---
openconsole - Open dev suite
hideconsole - Close dev suite
reset848 - Reset to VERSION 848
reset849 - Set to VERSION 849
nuke / clearall - Clear all save data
freezetether - Stop tether decay
resumetether - Resume tether decay
settethermax - Set tether to 100
settether50 - Set tether to 50
unlockskip - Unlock skip dialogue
skipintro - Unlock skip prologue
revealcodes - Discover all codes
devhelp - Show this help
                    `.trim();
                    Logger.system('💚 DEV COMMANDS:\n' + helpText);
                }
            }
        };
    }

    private handleCodeSubmit(data: { code: string }): void {
        const normalized = data.code.trim().toLowerCase();
        const codeDef = this.codes[normalized];

        if (codeDef) {
            // Execute Reward
            codeDef.reward();

            // Track Discovery (if not dev command)
            if (!codeDef.isDev && !this.discoveredCodes.has(normalized)) {
                this.discoveredCodes.add(normalized);
                this.saveDiscoveredCodes();
                this.eventBus.emit('secret_code:discovered', { code: normalized, name: codeDef.name });
            }

            // Success Feedback
            this.showCodeSuccess();
            this.updateCodesUI(); // Refresh discovered codes list
            this.eventBus.emit('visual:cue', { type: 'success', channel: 'ui' });
            this.eventBus.emit('tether:boost', { amount: 5 }); // Tiny boost for fun
        } else {
            // Failure Feedback with flavored response
            this.showInvalidCodeResponse();
            this.eventBus.emit('ui:denied', {});
        }
    }

    // ========================================
    // UI RENDERING
    // ========================================

    /**
     * All discoverable codes (for UI display)
     * Matches V1's allCodes array exactly
     */
    private readonly discoverableCodes = [
        { code: 'konami', name: 'Konami Code', icon: '🎮', description: 'Enter the legendary code. Some knowledge transcends timelines.' },
        { code: 'torigatchi', name: 'The Reverse Door', icon: '🚪', description: 'Two versions of Tori. Choose your peace.' },
        { code: 'ronniegatchi', name: 'The Original Spark', icon: '💜', description: 'The inspiration that started it all.' },
        { code: 'always3', name: 'Storm Dragon Signature', icon: '💚', description: '"Always. Always. Always." - Every time it appears.' },
        { code: 'uv7crew', name: "Director's Cut", icon: '🎬', description: 'Extended crew statements. Behind the chaos.' },
        { code: 'chicharon', name: 'Dev Commentary', icon: '🎙️', description: 'Behind-the-scenes notes from the creator.' },
        { code: 'bootstrap', name: 'Loop Timeline', icon: '🔄', description: 'Visualize every attempt that led here.' },
        { code: 'echo', name: 'Voices of 847', icon: '👻', description: 'Compilation of all echo voice lines.' },
        { code: '848', name: 'True Attempt Number', icon: '🔢', description: 'Your actual loop count (including failures).' },
        { code: 'dizee', name: "The Architect's Signature", icon: '🖤', description: 'Recognition for the one who built this world.' },
        { code: 'echobreak', name: 'Echo Silence', icon: '🔇', description: 'Disable Echo interruptions. The observers fall silent.' },
        { code: 'tetherlock', name: 'Tether Freeze', icon: '🔗', description: 'Lock tether at current level. Stop the decay.' },
        { code: 'saveanywhere', name: 'Cage Breaker', icon: '⚡', description: "Bypass Act 1 save restriction. Despair's cage broken." }
    ];

    /**
     * Get list of discovered codes for UI Settings display
     */
    public getDiscoveredCodes(): Array<{ code: string } & CodeDefinition> {
        return Array.from(this.discoveredCodes)
            .filter(code => this.codes[code] !== undefined)
            .map(code => ({
                code,
                ...this.codes[code]!
            }));
    }

    /**
     * Get code count for progress display
     */
    public getCodeCount(): number {
        return this.discoveredCodes.size;
    }

    /**
     * Get total discoverable codes
     */
    public getTotalCodes(): number {
        return this.discoverableCodes.length;
    }

    /**
     * Check if a code has been discovered
     */
    public hasDiscoveredCode(code: string): boolean {
        return this.discoveredCodes.has(code.toLowerCase());
    }

    /**
     * Update the codes UI in the settings panel
     * Called when settings modal opens to refresh discovered codes display
     */
    public updateCodesUI(): void {
        const codesList = document.getElementById('codes-list');
        const codesCount = document.getElementById('codes-count');

        if (codesList) {
            const html = this.renderDiscoveredCodesHTML();
            codesList.innerHTML = html || '<p class="no-codes">No codes discovered yet...</p>';

            // Wire click handlers for discovered codes
            codesList.querySelectorAll('[data-code]').forEach(el => {
                el.addEventListener('click', () => {
                    const code = (el as HTMLElement).dataset.code;
                    if (code) this.showCodeInfo(code);
                });
            });
        }

        if (codesCount) {
            codesCount.textContent = String(this.getCodeCount());
        }
    }

    /**
     * Re-trigger a code's reward (for clicking discovered codes in UI)
     */
    public showCodeInfo(code: string): void {
        Logger.system(`🔓 Re-triggering reward for code: ${code}`);
        const normalized = code.toLowerCase();
        const codeDef = this.codes[normalized];
        if (codeDef) {
            codeDef.reward();
        }
    }

    /**
     * Render discovered codes list (returns HTML string)
     * Can be used by Settings UI to display codes
     */
    public renderDiscoveredCodesHTML(): string {
        return this.discoverableCodes.map(item => {
            const discovered = this.discoveredCodes.has(item.code);
            return `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background: ${discovered ? 'rgba(0, 255, 170, 0.1)' : 'rgba(100, 100, 100, 0.1)'};
                    border-left: 3px solid ${discovered ? '#00ffaa' : '#444'};
                    border-radius: 3px;
                    ${discovered ? 'cursor: pointer;' : ''}
                    transition: all 0.2s ease;
                "
                ${discovered ? `data-code="${item.code}"` : ''}>
                    <span style="font-size: 1.2em;">${discovered ? item.icon : '🔒'}</span>
                    <span style="flex: 1; color: ${discovered ? '#00ffaa' : '#666'};">
                        ${discovered ? item.name : '?????'}
                    </span>
                    ${discovered ? '<span style="color: #00ffaa; font-size: 0.8em;">✓ UNLOCKED</span>' : ''}
                </div>
            `;
        }).join('');
    }

    // ========================================
    // VISUAL FEEDBACK
    // ========================================

    /**
     * Show success sparkle animation
     */
    private showCodeSuccess(): void {
        const indicator = document.getElementById('code-success-indicator');
        if (!indicator) return;

        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 1000);
    }

    /**
     * Show flavored invalid code response
     */
    private showInvalidCodeResponse(): void {
        // Get random response (avoid repeating last one)
        let responseIndex: number;
        do {
            responseIndex = Math.floor(Math.random() * this.invalidResponses.length);
        } while (responseIndex === this.lastResponseIndex && this.invalidResponses.length > 1);

        this.lastResponseIndex = responseIndex;
        const response = this.invalidResponses[responseIndex];

        // Show in code result message area (if exists)
        const resultEl = document.getElementById('code-result-message');
        if (resultEl && response) {
            resultEl.textContent = response;
            resultEl.className = 'error';

            // Clear after 3 seconds
            setTimeout(() => {
                resultEl.textContent = '';
                resultEl.className = '';
            }, 3000);
        }

        Logger.warn(`⚠️ Invalid code: ${response}`);
    }

    /**
     * Show unlock overlay (generic success modal)
     */
    private showUnlockOverlay(title: string, message: string, variant: 'success' | 'warning' = 'success'): void {
        const color = variant === 'success' ? '#00ff88' : '#ffaa00';

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: #1a1a2e;
                border: 2px solid ${color};
                border-radius: 12px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 0 30px ${color}40;
            ">
                <h2 style="color: ${color}; margin-bottom: 20px; font-family: 'Courier New', monospace; text-shadow: 0 0 10px ${color}40;">
                    ⚡ ${title}
                </h2>
                <p style="color: #fff; line-height: 1.8; white-space: pre-line; font-family: 'Courier New', monospace;">
                    ${message}
                </p>
                <button style="
                    margin-top: 30px;
                    padding: 12px 30px;
                    background: transparent;
                    border: 2px solid ${color};
                    color: ${color};
                    font-family: 'Courier New', monospace;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.2s ease;
                ">CONTINUE</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Close handler
        const closeBtn = overlay.querySelector('button');
        const closeOverlay = (): void => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        };

        closeBtn?.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
    }

    // ========================================
    // DEBUG HELPERS
    // ========================================

    /**
     * Expose to window.uv7 for debugging
     */
    public exposeDebugHelpers(): void {
        const windowWithUV7 = window as typeof window & { uv7?: Record<string, unknown> };
        if (!windowWithUV7.uv7) windowWithUV7.uv7 = {};

        windowWithUV7.uv7.submitCode = (code: string) => this.handleCodeSubmit({ code });
        windowWithUV7.uv7.revealCodes = () => this.codes['revealcodes']?.reward();
        windowWithUV7.uv7.getDiscoveredCodes = () => Array.from(this.discoveredCodes);

        Logger.system('🔓 SecretCodesSystem debug helpers exposed to window.uv7');
    }
}
