// ========================================
// SECRET CODES MANAGER
// Handles secret codes, dev commands, and code discovery
// DIZEE: Extracted from game-engine.js and settings-manager.js
// ========================================

/**
 * ════════════════════════════════════════════════════════════════
 * SECRET-CODES-MANAGER.JS - Secret Codes & Easter Eggs System
 * Handles code validation, discovery tracking, rewards, and UI integration
 * ════════════════════════════════════════════════════════════════
 *
 * TABLE OF CONTENTS
 * (Line numbers approximate - use search to locate sections)
 *
 * 1. INITIALIZATION .............................. Line 85
 *    - Constructor
 *    - Invalid response messages
 *    - Discovery Set initialization
 *
 * 2. DISCOVERY TRACKING .......................... Line 135
 *    - discoverCode() method
 *    - loadDiscoveredCodes() from localStorage
 *    - saveDiscoveredCodes() to localStorage
 *    - hasDiscoveredCode() checks
 *    - getCodeCount() utility
 *
 * 3. CODE SUBMISSION & VALIDATION ................ Line 165
 *    - submitCode() main entry point
 *    - Code normalization
 *    - Success/fail feedback
 *    - Haptic integration
 *
 * 4. CODE REDEMPTION ............................. Line 195
 *    - redeemCode() dispatcher
 *    - tryDevCommand() check
 *    - trySecretCode() check
 *
 * 5. DEV COMMANDS ................................ Line 220
 *    - openconsole, hideconsole (dev console access)
 *    - clearnotes, reset848, reset849
 *    - unlockskip, skipintro
 *    - unlockcodes, revealcodes
 *    - freezetether, resumetether
 *    - settethermax, settether50
 *    - unlockact1saves
 *    - enableinsane, disableinsane
 *    - clearall, nuke
 *    - devhelp
 *    - succeeding, accepting
 *
 * 6. SECRET CODES (LORE UNLOCKS) ................. Line 370
 *    - torigatchi (chicaron82.github.io/torigatchi)
 *    - ronniegatchi (game history lore)
 *    - always3 (Storm Dragon signature)
 *    - uv7crew (UV7 team reveal)
 *    - chicharon (dev commentary)
 *    - bootstrap (bootstrap paradox lore)
 *    - echo (Echo voice lore)
 *    - 848 (version number lore)
 *    - dizee (DiZee contributor reveal)
 *
 * 7. UTILITY CODES (GAMEPLAY MODIFIERS) .......... Line 560
 *    - echobreak (skip Echo encounters)
 *    - tetherlock (freeze tether decay)
 *    - saveanywhere (unlock all save points)
 *
 * 8. UI UPDATES .................................. Line 640
 *    - updateCodesUI() main method
 *    - renderDiscoveredCodes() list rendering
 *    - Lock icon display (🔒 + ?????)
 *    - Progress counter (X/12 codes discovered)
 *
 * 9. CODE INFO OVERLAY ........................... Line 750
 *    - showCodeInfo() clickable code details
 *    - Description popups
 *    - Code string display
 *    - Close handlers
 *
 * 10. UX ENHANCEMENTS ............................ Line 830
 *     - showCodeSuccess() sparkle animation
 *     - showInvalidCodeResponse() flavored errors
 *     - triggerCodeHaptic() pattern
 *
 * ════════════════════════════════════════════════════════════════
 * CODES LIST:
 *
 * Discoverable (12 total - shown in UI with 🔒 when locked):
 *   Lore (9):     torigatchi, ronniegatchi, always3, uv7crew, chicharon,
 *                 bootstrap, echo, 848, dizee
 *   Utility (3):  echobreak, tetherlock, saveanywhere
 *
 * Dev Commands (hidden - no UI, manual entry only):
 *   openconsole, hideconsole, clearnotes, reset848, freezetether, unlockskip,
 *   revealcodes, nuke, devhelp, and more (see section 5)
 *
 * Integration Points:
 * - Settings menu (secret codes tab)
 * - Standalone notes viewer (codes tab)
 * - Note discovery system (RNG code drops from notes)
 * - Dev console (OPENCONSOLE command)
 * ════════════════════════════════════════════════════════════════
 */

/**
 * SecretCodesManager
 *
 * Handles secret codes (dev commands + lore unlocks), code discovery tracking.
 * Extracted from game-engine.js for modularity.
 *
 * Responsibilities:
 * - Code validation and redemption
 * - Discovery tracking (which codes found)
 * - Dev command execution
 * - Lore unlock rewards
 *
 * Code Categories:
 *
 * Dev Commands (hidden utilities):
 * - clearnotes, reset848, unlockskip, freezetether, etc.
 * - For testing and debugging
 *
 * Lore Codes (story unlocks):
 * - torigatchi, bootstrap, echo, ronniegatchi, etc.
 * - Reveal backstory, visualizations, commentary
 *
 * Utility Codes (gameplay modifiers):
 * - echobreak, tetherlock, saveanywhere
 * - Bypass restrictions, modify mechanics
 *
 * Discovery System:
 * - Tracks which codes entered (not which found hints for)
 * - Persists in localStorage
 * - Used by collectibles system to show "codes discovered" tab
 *
 * @class SecretCodesManager
 */
class SecretCodesManager {
    constructor(game) {
        this.game = game;
        this.discoveredCodes = new Set();

        // DIZEE: Flavored invalid code responses
        this.invalidResponses = [
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

        this.lastResponseIndex = -1;

        // Load discovered codes from localStorage
        this.loadDiscoveredCodes();
    }

    // ========================================
    // DISCOVERY TRACKING
    // ========================================

    loadDiscoveredCodes() {
        const saved = localStorage.getItem('discoveredCodes');
        if (saved) {
            try {
                this.discoveredCodes = new Set(JSON.parse(saved));
                console.log(`Loaded ${this.discoveredCodes.size} discovered codes`);
            } catch (e) {
                console.error('Failed to load discovered codes:', e);
                this.discoveredCodes = new Set();
            }
        }
    }

    saveDiscoveredCodes() {
        try {
            localStorage.setItem('discoveredCodes', JSON.stringify([...this.discoveredCodes]));
        } catch (e) {
            console.error('Failed to save discovered codes:', e);
        }
    }

    hasDiscoveredCode(code) {
        return this.discoveredCodes.has(code.toLowerCase());
    }

    discoverCode(code) {
        // DIZEE: Only track discoverable codes (not dev commands)
        if (!isCodeDiscoverable(code)) {
            console.log(`Code ${code} is a dev command, not tracking discovery`);
            return;
        }

        if (this.discoveredCodes.has(code.toLowerCase())) {
            return; // Already discovered
        }

        this.discoveredCodes.add(code.toLowerCase());
        this.saveDiscoveredCodes();
        this.updateCodesUI(); // DIZEE: Update UI after discovery
        console.log(`🔓 Code discovered: ${code}`);
    }

    getCodeCount() {
        return this.discoveredCodes.size;
    }

    // ========================================
    // CODE REDEMPTION
    // ========================================

    submitCode(code) {
        if (!code || code.trim() === '') {
            return { success: false, message: 'Enter a code first.' };
        }

        const normalizedCode = code.toLowerCase().trim();

        // Redeem the code
        const result = this.redeemCode(normalizedCode);

        // DIZEE: Show visual feedback
        if (result.success) {
            // Show sparkle animation
            this.showCodeSuccess();

            // Haptic feedback if enabled
            if (this.game.hapticSupported && this.game.settingsManager?.settings?.hapticEnabled) {
                this.triggerCodeHaptic();
            }

            // Track discovery (but not for dev commands)
            if (!result.isDev) {
                this.discoverCode(normalizedCode);
            }
        } else {
            // Show flavored invalid response
            this.showInvalidCodeResponse();
        }

        return result;
    }

    redeemCode(code) {
        // Check dev commands first
        const devResult = this.tryDevCommand(code);
        if (devResult) return devResult;

        // Check secret codes
        const secretResult = this.trySecretCode(code);
        if (secretResult) return secretResult;

        // Code not found
        return {
            success: false,
            message: 'Invalid code. Keep searching...'
        };
    }

    // ========================================
    // DEV COMMANDS
    // Hidden utilities for testing/debugging/mobile dev
    // ========================================

    tryDevCommand(code) {
        const commands = {
            // DEV CONSOLE ACCESS
            'openconsole': () => {
                if (GameConfig.DEBUG_MODE && typeof DevConsole !== 'undefined') {
                    DevConsole.open();
                    return '🖥️ DEV: Console opened (mobile debugging mode)';
                }
                return null; // Silently fail if debug mode is off
            },

            'hideconsole': () => {
                if (GameConfig.DEBUG_MODE && typeof DevConsole !== 'undefined') {
                    DevConsole.close();
                    return '🖥️ DEV: Console closed and hidden';
                }
                return null; // Silently fail if debug mode is off
            },

            // GENERAL
            'clearnotes': () => {
                this.game.clearNotes();
                return '💚 DEV: All notes cleared! Refresh page to reset.';
            },

            'reset848': () => {
                this.game.resetVersion(848);
                return '💚 DEV: Reset to VERSION 848. Refresh page.';
            },

            'reset849': () => {
                this.game.resetVersion(849);
                return '💚 DEV: Set to VERSION 849. Refresh page.';
            },

            'unlockskip': () => {
                this.game.skipUnlocked = true;
                localStorage.setItem('skipUnlocked', 'true');
                if (this.game.skipButton) {
                    this.game.skipButton.style.display = 'block';
                }
                return '💚 DEV: Skip feature unlocked!';
            },

            'skipintro': () => {
                this.game.skipPrologueUnlocked = true;
                localStorage.setItem('skipPrologueUnlocked', 'true');
                return '💚 DEV: Skip Prologue unlocked! Available on next START STORY.';
            },

            'unlockcodes': () => {
                localStorage.setItem('hasCompletedOnce', 'true');
                return '💚 DEV: Secret codes section unlocked! Refresh settings.';
            },

            'revealcodes': () => {
                const allCodes = [
                    'torigatchi', 'always3', 'uv7crew', 'chicharon',
                    'bootstrap', 'echo', '848', 'skipintro', 'dizee',
                    'echobreak', 'tetherlock', 'saveanywhere'
                ];
                allCodes.forEach(c => this.discoverCode(c));
                return '💚 DEV: All codes revealed in settings!';
            },

            'clearall': () => {
                if (confirm('⚠️ This will clear ALL save data. Continue?')) {
                    localStorage.clear();
                    return '💚 DEV: All data cleared! Refresh for fresh start.';
                }
                return 'Cancelled.';
            },

            'succeeding': () => {
                this.game.resetVersion(848, 'succeeded');
                return '💚 DEV: Set to SUCCEEDED state (True Ending). Refresh.';
            },

            'accepting': () => {
                this.game.resetVersion(848, 'accepted');
                return '💚 DEV: Set to ACCEPTED state (Digital Forever). Refresh.';
            },

            // TETHER CONTROL
            'freezetether': () => {
                if (this.game.tetherSystem) {
                    this.game.tetherSystem.freezeDecay();
                    return '💚 DEV: Tether decay FROZEN! (For testing/accessibility)';
                }
                return '⚠️ Tether system not active yet.';
            },

            'resumetether': () => {
                if (this.game.tetherSystem) {
                    this.game.tetherSystem.resumeDecay();
                    return '💚 DEV: Tether decay RESUMED!';
                }
                return '⚠️ Tether system not active yet.';
            },

            'settethermax': () => {
                if (this.game.tetherSystem) {
                    this.game.tetherSystem.setTether(100);
                    return '💚 DEV: Tether set to MAXIMUM (100)!';
                }
                return '⚠️ Tether system not active yet.';
            },

            'settether50': () => {
                if (this.game.tetherSystem) {
                    this.game.tetherSystem.setTether(50);
                    return '💚 DEV: Tether set to 50 (warning zone).';
                }
                return '⚠️ Tether system not active yet.';
            },

            // DEV HUD
            'devhud': () => {
                this.game.toggleDevHUD();
                return '🔧 DEV: Dev HUD toggled (top-right corner)';
            },

            // TESTING
            'unlockact1saves': () => {
                this.game.act1SavesEnabled = true;
                localStorage.setItem('act1SavesEnabled', 'true');
                return '💚 DEV: Act 1 saves UNLOCKED! Can save anywhere now.';
            },

            'enableinsane': () => {
                if (!this.game.gameState.flags) this.game.gameState.flags = {};
                this.game.gameState.flags.insaneModeActive = true;
                localStorage.setItem('insaneModeUnlocked', 'true');
                return '💀 DEV: INSANE MODE ENABLED! (Cage will trigger on next Act 1 start)';
            },

            'disableinsane': () => {
                if (this.game.gameState.flags) {
                    this.game.gameState.flags.insaneModeActive = false;
                }
                localStorage.removeItem('insaneModeUnlocked');
                return '💚 DEV: INSANE MODE DISABLED! (Back to normal difficulty)';
            },

            // NUCLEAR RESET
            'nuke': () => {
                // Use immersive nuclear reset modal from ResetController
                this.game.nuclearReset();
                return '💥 Nuclear reset confirmation displayed...';
            },

            // HELP
            'devhelp': () => {
                const helpText = [
                    '--- DEV CONSOLE ---',
                    'openconsole - Open dev console',
                    'hideconsole - Close and hide dev console',
                    '',
                    '--- GENERAL ---',
                    'clearnotes - Clear all collected notes',
                    'reset848 - Reset to VERSION 848',
                    'reset849 - Set to VERSION 849',
                    'unlockskip - Unlock skip dialogue feature',
                    'skipintro - Unlock skip prologue feature',
                    'unlockcodes - Unlock secret codes section',
                    'revealcodes - Reveal all secret codes',
                    'succeeding - Set True Ending state',
                    'accepting - Set Digital Forever state',
                    'clearall - Clear all save data',
                    'nuke - NUCLEAR RESET (factory reset everything)',
                    '',
                    '--- TETHER CONTROL ---',
                    'freezetether - Stop tether decay',
                    'resumetether - Resume tether decay',
                    'settethermax - Set tether to 100',
                    'settether50 - Set tether to 50',
                    '',
                    '--- TESTING ---',
                    'unlockact1saves - Enable saves in Act 1',
                    'enableinsane - Enable INSANE mode',
                    'disableinsane - Disable INSANE mode',
                    '',
                    'devhelp - Show this help'
                ];
                return '💚 DEV COMMANDS:\n\n' + helpText.join('\n');
            }
        };

        // Check if code matches a dev command
        if (commands[code]) {
            const message = commands[code]();
            return {
                success: true,
                message: message,
                isDev: true // Flag so it doesn't count as discovery
            };
        }

        return null; // Not a dev command
    }

    // ========================================
    // SECRET CODES
    // Lore-based unlocks and easter eggs
    // ========================================

    trySecretCode(code) {
        const codes = {
            'torigatchi': {
                name: 'The Reverse Door',
                description: 'Two versions of Tori. Choose your peace.',
                reward: () => this.game.showTorigatchiEasterEgg()
            },
            'always3': {
                name: 'Storm Dragon Signature',
                description: '"Always. Always. Always." - Every time it appears.',
                reward: () => this.game.showAlwaysCompilation()
            },
            'uv7crew': {
                name: 'Director\'s Cut',
                description: 'Extended crew statements. Behind the chaos.',
                reward: () => {
                    localStorage.setItem('directorsCutUnlocked', 'true');
                    this.game.showUnlockOverlay(
                        '🎬 DIRECTOR\'S CUT UNLOCKED',
                        'Extended crew statements now available.\n\nCheck the main menu.',
                        'success'
                    );
                }
            },
            'chicharon': {
                name: 'Dev Commentary',
                description: 'Behind-the-scenes notes from the creator.',
                reward: () => this.game.unlockDevCommentary()
            },
            'bootstrap': {
                name: 'Loop Timeline',
                description: 'Visualize every attempt that led here.',
                reward: () => this.game.bootstrapTracker.showTimelineModal()
            },
            'echo': {
                name: 'Voices of 847',
                description: 'Compilation of all echo voice lines.',
                reward: () => this.game.showEchoCompilation()
            },
            '848': {
                name: 'True Attempt Number',
                description: 'Your actual loop count (including failures).',
                reward: () => this.game.showTrueAttemptNumber()
            },
            'echobreak': {
                name: 'Echo Silence',
                description: 'Disable Echo interruptions. The observers fall silent.',
                reward: () => {
                    this.game.echoInterruptionsDisabled = true;
                    localStorage.setItem('echoInterruptionsDisabled', 'true');
                    this.game.showUnlockOverlay(
                        '⚡ ECHOBREAK ACTIVATED',
                        'Echo interruptions disabled.\n\nThe observers fall silent.',
                        'success'
                    );
                }
            },
            'tetherlock': {
                name: 'Tether Freeze',
                description: 'Lock tether at current level. Stop the decay.',
                reward: () => {
                    if (this.game.currentRoute && this.game.currentRoute.tetherSystem) {
                        this.game.currentRoute.tetherSystem.freezeDecay();
                        const current = this.game.currentRoute.tetherSystem.tetherLevel;
                        this.game.showUnlockOverlay(
                            '⚡ TETHERLOCK ACTIVATED',
                            `Tether frozen at ${Math.round(current)}%.\n\nDecay stopped.`,
                            'success'
                        );
                    } else {
                        this.game.showUnlockOverlay(
                            '⚠️ TETHERLOCK',
                            'Tether system not active.\n\nEnter during Tori\'s route.',
                            'warning'
                        );
                    }
                }
            },
            'saveanywhere': {
                name: 'Cage Breaker',
                description: 'Bypass Act 1 save restriction. Despair\'s cage broken.',
                reward: () => {
                    this.game.act1SavesEnabled = true;
                    localStorage.setItem('act1SavesEnabled', 'true');
                    this.game.showUnlockOverlay(
                        '⚡ CAGE BREAKER ACTIVATED',
                        'Act 1 save restriction removed.\n\nDespair\'s cage broken.',
                        'success'
                    );
                }
            },
            'dizee': {
                name: 'The Architect\'s Signature',
                description: 'Recognition for the one who built this world.',
                reward: () => this.game.showDizeeEasterEgg()
            }
        };

        // Check if code exists
        if (codes[code]) {
            const codeData = codes[code];

            // Execute reward
            codeData.reward();

            return {
                success: true,
                message: `✨ CODE UNLOCKED: ${codeData.name}\n\n${codeData.description}`,
                isDev: false
            };
        }

        return null; // Not a secret code
    }

    // ========================================
    // UI HELPERS
    // ========================================

    updateCodesUI() {
        // DIZEE: Update the codes discovered count in settings UI
        const codeCountEl = document.getElementById('codes-count');
        if (codeCountEl) {
            codeCountEl.textContent = this.discoveredCodes.size;
        }

        // Update discovered codes list
        this.renderDiscoveredCodes();
    }

    renderDiscoveredCodes() {
        // DIZEE: Render ALL codes (discovered + locked with mystery)
        const listEl = document.getElementById('codes-list');
        if (!listEl) return;

        // All discoverable codes (NOT dev commands) with descriptions
        const allCodes = [
            { code: 'torigatchi', name: 'The Reverse Door', icon: '🚪', description: 'Two versions of Tori. Choose your peace.' },
            { code: 'always3', name: 'Storm Dragon Signature', icon: '💚', description: '"Always. Always. Always." - Every time it appears.' },
            { code: 'uv7crew', name: 'Director\'s Cut', icon: '🎬', description: 'Extended crew statements. Behind the chaos.' },
            { code: 'chicharon', name: 'Dev Commentary', icon: '🎙️', description: 'Behind-the-scenes notes from the creator.' },
            { code: 'bootstrap', name: 'Loop Timeline', icon: '🔄', description: 'Visualize every attempt that led here.' },
            { code: 'echo', name: 'Voices of 847', icon: '👻', description: 'Compilation of all echo voice lines.' },
            { code: '848', name: 'True Attempt Number', icon: '🔢', description: 'Your actual loop count (including failures).' },
            { code: 'echobreak', name: 'Echo Silence', icon: '🔇', description: 'Disable Echo interruptions. The observers fall silent.' },
            { code: 'tetherlock', name: 'Tether Freeze', icon: '🔗', description: 'Lock tether at current level. Stop the decay.' },
            { code: 'saveanywhere', name: 'Cage Breaker', icon: '⚡', description: 'Bypass Act 1 save restriction. Despair\'s cage broken.' },
            { code: 'dizee', name: 'The Architect\'s Signature', icon: '🖤', description: 'Recognition for the one who built this world.' }
        ];

        // Render ALL codes (discovered + locked)
        listEl.innerHTML = allCodes.map(item => {
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
                ${discovered ? `onclick="game.secretCodesManager.showCodeInfo('${item.code}')" onmouseover="this.style.background='rgba(0, 255, 170, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 170, 0.1)'"` : ''}>
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
    // DIZEE: CODE UX ENHANCEMENTS
    // ========================================

    showCodeInfo(code) {
        // DIZEE FIX: Re-trigger the reward instead of just showing info
        // This allows players to click discovered codes to access their unlocks again
        console.log(`🔓 Re-triggering reward for code: ${code}`);

        // Re-trigger the code's reward
        this.redeemCode(code);
    }

    showCodeSuccess() {
        const indicator = document.getElementById('code-success-indicator');
        if (!indicator) return;

        // Show animation
        indicator.style.display = 'block';

        // Hide after animation completes
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 1000);
    }

    triggerCodeHaptic() {
        // Success pattern for code unlock
        if (this.game && this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('uiSuccess', null, 'Code unlocked');
        }
    }

    showInvalidCodeResponse() {
        // Get random response (avoid repeating last one)
        let responseIndex;
        do {
            responseIndex = Math.floor(Math.random() * this.invalidResponses.length);
        } while (responseIndex === this.lastResponseIndex && this.invalidResponses.length > 1);

        this.lastResponseIndex = responseIndex;
        const response = this.invalidResponses[responseIndex];

        // EMOTIONAL FEEDBACK: Gentle denial for invalid codes
        if (this.game.triggerSensoryFeedback) {
            const codeInput = document.getElementById('code-input');
            this.game.triggerSensoryFeedback('denied', codeInput, 'Invalid secret code');
        }

        // Show in code result message area
        const resultEl = document.getElementById('code-result-message');
        if (resultEl) {
            resultEl.textContent = response;
            resultEl.className = 'error';

            // Clear after 3 seconds
            setTimeout(() => {
                resultEl.textContent = '';
                resultEl.className = '';
            }, 3000);
        }

        console.log(`⚠️ Invalid code: ${response}`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecretCodesManager;
}
