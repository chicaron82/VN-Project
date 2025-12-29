// @ts-check
// ========================================
// TETHER SYSTEM MODULE
// Manages Tori's consciousness tether mechanics and Echo Toris
// Extracted from tori-route-main.js for modularity
// ========================================

// ========================================
// TYPESCRIPT DECLARATIONS
// ========================================
/// <reference lib="es2015" />

/** GameConfig external */
declare const GameConfig: {
    TETHER: {
        INITIAL_LEVEL: number;
        DECAY_INTERVAL_MS: number;
        THRESHOLD_CRITICAL: number;
        THRESHOLD_MEDIUM_DECAY: number;
        THRESHOLD_CRITICAL_DECAY: number;
    };
    [key: string]: any;
};

/** getDifficultyProfile external */
declare function getDifficultyProfile(difficulty: string): {
    name: string;
    decayRates: { base: number; medium: number; critical: number };
    tetherCap: number;
    holdOnBoost: number;
    holdOnCooldown: number;
    holdOn: { hidden: boolean };
    [key: string]: any;
};

/** GameEngine reference */
declare class GameEngine {
    state: {
        get(key: string): any;
        set(key: string, value: any): void;
        subscribe(key: string, callback: (newVal: any, oldVal: any) => void): () => void;
    };
    settingsManager: any;
    tetherUI: HTMLElement | null;
    tetherFill: HTMLElement | null;
    tetherText: HTMLElement | null;
    holdOnButton: HTMLButtonElement | null;
    echoDisplay: HTMLElement | null;
    echo1Text: HTMLElement | null;
    echo2Text: HTMLElement | null;
    echoDespairText: HTMLElement | null;
    notificationShade: any;
    gameState: any;
    gameView: HTMLElement;
    dialogueBox: HTMLElement;
    loopVersion: number;
    triggerSensoryFeedback: (type: string, element: any, message?: string) => void;
    triggerInsaneVisuals: () => void;
    displayScene: (scene: any, id?: string) => void;
    incrementVersion: () => void;
    showLoopInit: (callback: () => void) => void;
    returnToMainMenu: () => void;
    tutorialManager: any;
    [key: string]: any;
}

/** Route reference */
interface Route {
    addRoutePoints: (type: string, points: number) => void;
    tetherDeath: () => void;
    act1: { start: () => void };
    [key: string]: any;
}

/** Echo state interface */
interface EchoState {
    name: string;
    mood: string;
    color: string;
    active: boolean;
}

/** Echoes collection interface */
interface EchoesCollection {
    echo1: EchoState;
    echo2: EchoState;
    despair: EchoState;
    [key: string]: EchoState;
}

/**
 * TetherSystem
 *
 * Manages connection stability in Tori's route.
 * Core mechanic: tether decays over time, player must maintain connection.
 *
 * Responsibilities:
 * - Tether decay (passive over time)
 * - Hold On button (restore tether)
 * - Tether death trigger at 0%
 * - Difficulty scaling (Easy/Normal/Intense/INSANE)
 * - Visual feedback (UI updates, warnings)
 *
 * Difficulty Scaling:
 * - Easy: 0.03%/sec, auto-Hold On enabled
 * - Normal: 0.05%/sec, manual Hold On
 * - Intense: 0.08%/sec, manual Hold On
 * - INSANE: 0.1%/sec, 66% cap, ghost Hold On, read-only backlog
 *
 * Death Trigger:
 * - At 0%, delegates to route.tetherDeath()
 * - Typically: Bad ending, loop increment, return to menu
 *
 * Hold On Mechanic:
 * - Restores 15% tether (configurable)
 * - Cooldown: 30 seconds (configurable)
 * - INSANE mode: "ghost" button (visual only, no effect)
 *
 * @class TetherSystem
 */
class TetherSystem {
    game: GameEngine;
    route: Route;
    tetherDecayRate: number;
    currentDifficulty: string;
    tetherDecayTimer: ReturnType<typeof setInterval> | null;
    holdOnCooldown: boolean;
    holdOnCooldownTimer: ReturnType<typeof setInterval> | null;
    hasUsedHoldOn: boolean;
    hasShownTutorialFlash: boolean;
    decayFrozen: boolean;
    HOLD_ON_BOOST: number;
    HOLD_ON_COOLDOWN_MS: number;
    DECAY_INTERVAL_MS: number;
    CRITICAL_THRESHOLD: number;
    tetherCap: number;
    DECAY_MEDIUM_THRESHOLD: number;
    DECAY_CRITICAL_THRESHOLD: number;
    DECAY_MEDIUM_RATE: number;
    DECAY_CRITICAL_RATE: number;
    echoes: EchoesCollection;
    tetherUI: HTMLElement | null;
    tetherFill: HTMLElement | null;
    tetherText: HTMLElement | null;
    holdOnButton: HTMLButtonElement | null;
    echoDisplay: HTMLElement | null;
    echo1Text: HTMLElement | null;
    echo2Text: HTMLElement | null;
    echoDespairText: HTMLElement | null;
    _tetherSubscription: (() => void) | null;

    /**
     * @param {any} game - Game engine instance
     * @param {any} route - Current route instance
     */
    constructor(game: GameEngine, route: Route) {
        this.game = game;
        this.route = route;

        // ========================================
        // SOLID REFACTOR: Wire to StateManager
        // ========================================

        // Initialize tether state in StateManager
        // @ts-ignore - GameConfig is defined in game-config.js
        const initialLevel = GameConfig.TETHER.INITIAL_LEVEL;
        this.game.state.set('tether.level', initialLevel);
        this.tetherLevel = initialLevel;

        // Get current difficulty profile
        const currentDifficulty = game.settingsManager?.settings?.tetherDifficulty || 'normal';
        // @ts-ignore - getDifficultyProfile is defined in difficulty-config.js
        const profile = getDifficultyProfile(currentDifficulty);

        // Store difficulty settings in StateManager
        this.game.state.set('tether.difficulty', currentDifficulty);
        this.game.state.set('tether.decayRate', profile.decayRates.base);
        this.game.state.set('tether.cap', profile.tetherCap);

        // Local instance variables (non-state)
        this.tetherDecayRate = profile.decayRates.base;  // Cache for performance
        this.currentDifficulty = currentDifficulty;      // Track current difficulty
        this.tetherDecayTimer = null;                    // Passive decay interval
        this.holdOnCooldown = false;                     // Hold On button cooldown state
        this.holdOnCooldownTimer = null;                 // Countdown interval for button text
        this.hasUsedHoldOn = false;                      // Track if player has used Hold On at least once
        this.hasShownTutorialFlash = localStorage.getItem('tetherTutorialShown') === 'true'; // One-time tutorial
        this.decayFrozen = false;                        // Dev command: freeze decay for testing/accessibility

        // Configuration constants (from difficulty profile)
        this.HOLD_ON_BOOST = profile.holdOnBoost;
        this.HOLD_ON_COOLDOWN_MS = profile.holdOnCooldown;
        // @ts-ignore - GameConfig external
        this.DECAY_INTERVAL_MS = GameConfig.TETHER.DECAY_INTERVAL_MS;
        // @ts-ignore - GameConfig external
        this.CRITICAL_THRESHOLD = GameConfig.TETHER.THRESHOLD_CRITICAL;
        this.tetherCap = profile.tetherCap;              // Tether cap (100% normal, 66% INSANE)

        // Decay acceleration thresholds (from GameConfig)
        // @ts-ignore - GameConfig external
        this.DECAY_MEDIUM_THRESHOLD = GameConfig.TETHER.THRESHOLD_MEDIUM_DECAY;
        // @ts-ignore - GameConfig external
        this.DECAY_CRITICAL_THRESHOLD = GameConfig.TETHER.THRESHOLD_CRITICAL_DECAY;
        this.DECAY_MEDIUM_RATE = profile.decayRates.medium;
        this.DECAY_CRITICAL_RATE = profile.decayRates.critical;

        // ========================================
        // ECHO SYSTEM STATE
        // ========================================

        this.echoes = {
            echo1: {
                name: 'Echo 1',
                mood: 'hopeful',
                color: '#00ffff',        // cyan
                active: false
            },
            echo2: {
                name: 'Echo 2',
                mood: 'gentle',
                color: '#00ff00',        // green
                active: false
            },
            despair: {
                name: 'Despair Echo',
                mood: 'bitter',
                color: '#ff0000',        // red
                active: false
            }
        };

        // DOM element references (set by game engine)
        this.tetherUI = null;
        this.tetherFill = null;
        this.tetherText = null;
        this.holdOnButton = null;
        this.echoDisplay = null;
        this.echo1Text = null;
        this.echo2Text = null;
        this.echoDespairText = null;
        this._tetherSubscription = null;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        // Cache DOM references from game engine
        this.tetherUI = this.game.tetherUI;
        this.tetherFill = this.game.tetherFill;
        this.tetherText = this.game.tetherText;
        this.holdOnButton = this.game.holdOnButton;
        this.echoDisplay = this.game.echoDisplay;
        this.echo1Text = this.game.echo1Text;
        this.echo2Text = this.game.echo2Text;
        this.echoDespairText = this.game.echoDespairText;

        // Set up Hold On button listener
        if (this.holdOnButton) {
            this.holdOnButton.addEventListener('click', () => this.holdOn());
        }

        // ========================================
        // SOLID REFACTOR: REACTIVE UI SUBSCRIPTION
        // UI auto-updates when tether.level changes in StateManager
        // ========================================
        // @ts-ignore - Callback parameters are typed by StateManager
        this._tetherSubscription = this.game.state.subscribe('tether.level', (newLevel, oldLevel) => {
            console.log(`🔄 Reactive: Tether ${oldLevel} → ${newLevel}`);
            this.updateDisplay();
        });

        // Initial display update
        this.updateDisplay();
    }

    // ========================================
    // TETHER MANAGEMENT
    // ========================================

    /**
     * Update tether level by specified amount
     * Clamps to 0-100 (or 0-66 in insane mode)
     * Triggers haptic feedback when entering critical zone
     * 
     * @param {number} amount - Amount to add/subtract from tether
     * @param {string} [reason=''] - Reason for update (for logging)
     * @returns {number} New tether level
     * 
     * @example
     * // Boost tether by 10%
     * tetherSystem.updateTether(10, 'Hold On button');
     * 
     * // Apply decay
     * tetherSystem.updateTether(-0.05, 'passive decay');
     */
    updateTether(amount, reason = '') {
        // Store previous level for haptic trigger detection
        const previousLevel = this.tetherLevel;

        // Update tether level (clamped 0 to tetherCap from difficulty profile)
        // INSANE mode caps at 66%, others at 100%
        this.tetherLevel = Math.max(0, Math.min(this.tetherCap, this.tetherLevel + amount));

        // ZEE'S ADDITION: Haptic warning when entering critical zone 🖤
        // Only trigger ONCE when crossing threshold (not every tick)
        if (previousLevel > 30 && this.tetherLevel <= 30 && amount < 0) {
            if (this.game && this.game.triggerSensoryFeedback) {
                this.game.triggerSensoryFeedback('tetherWarning', null, 'Tether critical warning');
            }
        }

        // Update display
        this.updateDisplay();

        // Trigger Hold On tutorial when tether first drops below 95%
        if (this.tetherLevel <= 95 && previousLevel > 95) {
            const holdOnBtn = document.querySelector('#hold-on-button');

            if (holdOnBtn && this.game?.tutorialManager) {
                this.game.tutorialManager.showHandGesture('tori_hold_on', holdOnBtn, {
                    text: 'Hold On to restore connection!',
                    autoHide: 4000
                });
            }
        }

        // Check for tether death
        if (this.tetherLevel <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }

        // Log for debugging
        if (reason) {
            console.log(`Tether: ${this.tetherLevel.toFixed(1)}% (${reason})`);
        }

        return this.tetherLevel;
    }

    updateDisplay() {
        // Update visual tether bar
        if (this.tetherFill) {
            this.tetherFill.style.width = this.tetherLevel + '%';

            // Add/remove critical class based on level
            if (this.tetherLevel <= 30) {
                this.tetherFill.classList.add('critical');
            } else {
                this.tetherFill.classList.remove('critical');
            }
        }

        // Tutorial flash: if tether hits 66% and player hasn't used Hold On yet
        if (!this.hasShownTutorialFlash && !this.hasUsedHoldOn && this.tetherLevel <= 66) {
            this.flashHoldOnButton();
            this.hasShownTutorialFlash = true;
            localStorage.setItem('tetherTutorialShown', 'true');
        }

        // Update hold-on button critical state
        if (this.holdOnButton) {
            if (this.tetherLevel <= 30) {
                this.holdOnButton.classList.add('critical');
            } else {
                this.holdOnButton.classList.remove('critical');
            }
        }

        // Update text display
        if (this.tetherText) {
            this.tetherText.textContent = Math.floor(this.tetherLevel) + '%';
        }

        // DIZEE: Also update notification shade status bar
        console.log(`⚡ Tether: game.notificationShade exists = ${!!this.game.notificationShade}`);
        if (this.game.notificationShade) {
            this.game.notificationShade.updateStatusBar();
        }
    }

    // ========================================
    // PASSIVE DECAY SYSTEM
    // ========================================

    /**
     * Start passive tether decay
     * Begins interval timer that applies decay every second
     * Safe to call multiple times (won't create duplicates)
     * 
     * @example
     * // Resume decay after pause
     * tetherSystem.startDecay();
     */
    startDecay() {
        // Start passive tether decay timer
        if (this.tetherDecayTimer) {
            // Already running, don't start duplicate
            return;
        }

        this.tetherDecayTimer = setInterval(() => {
            this.applyDecay();
        }, this.DECAY_INTERVAL_MS);

        console.log('Tether decay started');
    }

    /**
     * Stop passive tether decay
     * Clears decay interval and cooldown timers
     * Called when game pauses or player opens menus
     * 
     * @example
     * // Pause decay when opening notification shade
     * tetherSystem.stopDecay();
     */
    stopDecay() {
        if (this.tetherDecayTimer) {
            clearInterval(this.tetherDecayTimer);
            this.tetherDecayTimer = null;
            console.log('Tether decay stopped');
        }

        // Also clear cooldown timer if active
        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }
    }



    // ========================================
    // DEV/ACCESSIBILITY COMMANDS
    // ========================================

    freezeDecay() {
        // Stop decay without clearing the timer (can be resumed)
        this.decayFrozen = true;
        console.log('💚 DEV: Tether decay frozen');
    }

    resumeDecay() {
        // Resume decay
        this.decayFrozen = false;
        console.log('💚 DEV: Tether decay resumed');
    }

    /**
     * @param {number} value
     */
    setTether(value) {
        // Manually set tether level (dev command)
        this.tetherLevel = Math.max(0, Math.min(100, value));
        this.updateDisplay();
        console.log(`💚 DEV: Tether set to ${this.tetherLevel}`);

        // Check for death (even in dev commands, for consistency)
        if (this.tetherLevel <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }
    }

    /**
     * @param {number} targetLevel
     * @param {boolean} [animated=false]
     */
    setTetherLevel(targetLevel, animated = false) {
        // Set tether to specific level (used by Insane Mode cage scene)
        targetLevel = Math.max(0, Math.min(100, targetLevel));

        if (!animated) {
            // Instant set
            this.tetherLevel = targetLevel;
            this.updateDisplay();
            console.log(`Tether set to ${targetLevel}%`);

            // Check for death after instant set
            if (this.tetherLevel <= 0) {
                this.stopDecay();
                this.onTetherDeath();
            }
            return;
        }

        // ANIMATED DROP - Player watches it drain
        console.log(`💀 INSANE MODE: Animating tether drop from ${this.tetherLevel}% to ${targetLevel}%`);

        const startLevel = this.tetherLevel;
        const difference = targetLevel - startLevel;
        const duration = 2000; // 2 seconds
        const steps = 40; // 50ms per step
        const stepAmount = difference / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;

        const animationInterval = setInterval(() => {
            currentStep++;
            this.tetherLevel = startLevel + (stepAmount * currentStep);

            // Clamp to target on final step
            if (currentStep >= steps) {
                this.tetherLevel = targetLevel;
                this.updateDisplay();
                clearInterval(animationInterval);
                console.log(`💀 Tether drop complete: ${targetLevel}%`);

                // Check for death after animation completes
                if (this.tetherLevel <= 0) {
                    this.stopDecay();
                    this.onTetherDeath();
                }
            } else {
                this.updateDisplay();
            }
        }, stepDuration);
    }

    applyDecay() {
        // Check if decay is frozen (dev command)
        if (this.decayFrozen) {
            return;
        }

        // DIZEE FIX: Robust check for ANY menu/pause state by checking computed style
        const isPaused = [
            'pause-menu',
            'settings-menu',
            'save-load-screen',
            'main-menu',
            'ending-dialog'
        ].some(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            // distinct check using getComputedStyle to catch CSS-class based hiding
            return window.getComputedStyle(el).display !== 'none';
        });

        if (isPaused) {
            return; // Skip decay this interval
        }

        // Calculate decay rate based on current tether level
        let decayAmount = this.tetherDecayRate;

        // Gentle acceleration when low
        if (this.tetherLevel < this.DECAY_MEDIUM_THRESHOLD) {
            decayAmount = this.DECAY_MEDIUM_RATE;
        }
        if (this.tetherLevel < this.DECAY_CRITICAL_THRESHOLD) {
            decayAmount = this.DECAY_CRITICAL_RATE;
        }

        // Decay rates already come from difficulty profile - no modifier needed

        // Apply decay
        this.updateTether(-decayAmount, 'passive decay');

        // Trigger glitch effect if critical
        if (this.tetherLevel < this.CRITICAL_THRESHOLD) {
            this.triggerGlitchEffect();
        }
    }

    /**
     * @param {string} difficulty
     */
    setDifficultyModifier(difficulty) {
        // Update difficulty settings from profile
        // @ts-ignore - getDifficultyProfile external
        const profile = getDifficultyProfile(difficulty);

        this.currentDifficulty = difficulty;
        this.tetherDecayRate = profile.decayRates.base;
        this.DECAY_MEDIUM_RATE = profile.decayRates.medium;
        this.DECAY_CRITICAL_RATE = profile.decayRates.critical;
        this.tetherCap = profile.tetherCap;
        this.HOLD_ON_BOOST = profile.holdOnBoost;

        console.log(`⚙️ Tether difficulty set to ${profile.name}`);
        console.log(`   Decay: ${profile.decayRates.base} | Cap: ${profile.tetherCap}% | Hold On: ${profile.holdOnBoost}`);
    }

    triggerGlitchEffect() {
        // Visual glitch when tether is critically low
        // Enhanced in Insane Mode for more intense corruption

        const isInsaneMode = this.game.gameState?.flags?.insaneModeActive;

        if (isInsaneMode) {
            // INSANE MODE: Heavy corruption effects
            if (Math.random() < 0.3) {
                // 30% chance to trigger full corruption burst
                if (this.game.triggerInsaneVisuals) {
                    this.game.triggerInsaneVisuals();
                }
            } else {
                // Quick intense glitch
                if (this.game.gameView) {
                    this.game.gameView.style.filter = 'hue-rotate(180deg) saturate(3) brightness(1.5)';
                    setTimeout(() => {
                        this.game.gameView.style.filter = 'none';
                    }, 300);
                }

                // Dialogue box flash
                if (this.game.dialogueBox) {
                    this.game.dialogueBox.style.boxShadow = '0 0 30px #ff0066, inset 0 0 30px rgba(255, 0, 102, 0.5)';
                    setTimeout(() => {
                        this.game.dialogueBox.style.boxShadow = '';
                    }, 300);
                }
            }
        } else {
            // NORMAL MODE: Subtle glitch
            if (this.game.gameView) {
                this.game.gameView.style.filter = 'hue-rotate(180deg) brightness(1.2)';
                setTimeout(() => {
                    this.game.gameView.style.filter = 'none';
                }, 200);
            }
        }
    }

    // ========================================
    // HOLD ON BUTTON (MANUAL BOOST)
    // ========================================

    /**
     * Player manually boosts tether connection
     * Applies +10% boost with 30 second cooldown
     * Triggers haptic feedback and visual updates
     * 
     * @example
     * // Called when Hold On button clicked
     * tetherSystem.holdOn();
     */
    holdOn() {
        // Player manually tries to maintain tether connection

        // Check if button is on cooldown
        if (this.holdOnCooldown) {
            console.log('Hold On button on cooldown');
            return;
        }

        // DIZEE: Haptic feedback for Hold On action
        if (this.game && this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('buttonPress', this.holdOnButton, 'Hold On pressed');
        }

        // Mark that player has used Hold On at least once
        this.hasUsedHoldOn = true;

        // Apply tether boost
        this.updateTether(this.HOLD_ON_BOOST, 'HOLD ON button pressed');

        // Visual feedback
        if (this.holdOnButton) {
            this.holdOnButton.textContent = 'HOLDING...';
            this.holdOnButton.disabled = true;
            this.holdOnButton.classList.remove('tutorial-flash'); // Remove flash if active
        }

        // Set cooldown
        this.holdOnCooldown = true;

        // Start countdown display
        let remainingSeconds = Math.ceil(this.HOLD_ON_COOLDOWN_MS / 1000);
        this.holdOnCooldownTimer = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0 && this.holdOnButton) {
                this.holdOnButton.textContent = `HOLD ON (${remainingSeconds}s)`;
            }
        }, 1000);

        // Reset button after cooldown
        setTimeout(() => {
            this.holdOnCooldown = false;
            if (this.holdOnCooldownTimer) {
                clearInterval(this.holdOnCooldownTimer);
                this.holdOnCooldownTimer = null;
            }
            if (this.holdOnButton) {
                this.holdOnButton.textContent = 'HOLD ON';
                this.holdOnButton.disabled = false;
            }
            console.log('Hold On button ready');
        }, this.HOLD_ON_COOLDOWN_MS);

        // Add route points for engagement
        if (this.route && this.route.addRoutePoints) {
            this.route.addRoutePoints('true', 1);
        }
    }

    flashHoldOnButton() {
        // One-time tutorial flash to draw attention to Hold On button
        if (this.holdOnButton && !this.holdOnCooldown) {
            this.holdOnButton.classList.add('tutorial-flash');
            console.log('Tutorial: Flashing Hold On button');
        }
    }

    // ========================================
    // ECHO SYSTEM
    // ========================================

    /**
     * @param {any} echoDialogue
     */
    showEchoes(echoDialogue) {
        // Display echo commentary alongside main dialogue
        // Creates the "voices in her head" effect

        if (!this.echoDisplay) return;

        // Clear previous echoes
        if (this.echo1Text) this.echo1Text.textContent = '';
        if (this.echo2Text) this.echo2Text.textContent = '';
        if (this.echoDespairText) this.echoDespairText.textContent = '';

        // Show echo display container
        this.echoDisplay.style.display = 'block';

        // Set echo content if provided
        if (echoDialogue.echo1 && this.echo1Text) {
            this.echo1Text.textContent = 'Echo 1: ' + echoDialogue.echo1;
            this.echoes.echo1.active = true;
        }

        if (echoDialogue.echo2 && this.echo2Text) {
            this.echo2Text.textContent = 'Echo 2: ' + echoDialogue.echo2;
            this.echoes.echo2.active = true;
        }

        if (echoDialogue.despair && this.echoDespairText) {
            this.echoDespairText.textContent = 'Despair: ' + echoDialogue.despair;
            this.echoes.despair.active = true;
        }
    }

    hideEchoes() {
        if (this.echoDisplay) {
            this.echoDisplay.style.display = 'none';
        }

        // Mark all echoes as inactive
        this.echoes.echo1.active = false;
        this.echoes.echo2.active = false;
        this.echoes.despair.active = false;
    }

    /**
     * @param {'echo1'|'echo2'|'despair'} echoId
     * @param {string} mood
     */
    updateEchoMood(echoId, mood) {
        // Update the mood state of a specific echo
        if (this.echoes[echoId]) {
            this.echoes[echoId].mood = mood;
            console.log(`Echo ${echoId} mood updated: ${mood}`);
        }
    }

    // ========================================
    // TETHER DEATH HANDLER
    // ========================================

    onTetherDeath() {
        // Callback when tether reaches 0%
        // Delegate to route's custom handler if it exists

        console.log('💀 Tether death triggered');

        // Check if route has custom death handler
        if (this.route && typeof this.route.tetherDeath === 'function') {
            console.log('→ Delegating to route tetherDeath handler');
            this.route.tetherDeath();
            return;
        }

        // Fallback: Default death screen if no route handler
        console.log('→ Using default tether death handler');

        // Store current version before increment
        const failedVersion = this.game.loopVersion;

        // Show game over screen
        this.game.displayScene({
            character: 'System',
            dialogue: 'CRITICAL FAILURE. TETHER SEVERED.',
            internal: `[Tori's consciousness fragments into static]\n[Version ${failedVersion} timeline COLLAPSED]\n\n**"The loop continues. She deserves another chance."**`,
            background: 'assets/digitalSpace.png',
            style: 'critical',
            choices: [
                { text: '[BEGIN NEXT ATTEMPT]', value: 'retry' },
                { text: '[ABANDON TIMELINE]', value: 'menu' }
            ],
            /** @param {string} choice */
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Increment version for next attempt
                    this.game.incrementVersion();

                    // ZEERAH'S FIX: Use proper loop init screen like Ronnie's route
                    this.game.showLoopInit(() => {
                        // Reset tether and restart
                        this.reset();
                        if (this.route && this.route.act1) {
                            this.route.act1.start();
                        }
                    });
                } else {
                    if (this.game.returnToMainMenu) {
                        this.game.returnToMainMenu();
                    }
                }
            }
        }, 'tether_death');
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    reset() {
        // Reset tether to full
        this.tetherLevel = 100;
        this.updateDisplay();

        // Clear cooldowns
        this.holdOnCooldown = false;
        if (this.holdOnButton) {
            this.holdOnButton.textContent = 'HOLD ON';
            this.holdOnButton.disabled = false;
        }

        // Restart decay
        this.stopDecay();
        this.startDecay();

        console.log('Tether system reset');
    }

    getState() {
        // Return current state for save system
        return {
            tetherLevel: this.tetherLevel,
            echoes: JSON.parse(JSON.stringify(this.echoes)),
            holdOnCooldown: this.holdOnCooldown
        };
    }

    /**
     * @param {any} state
     */
    restoreState(state) {
        // Restore from saved state
        this.tetherLevel = state.tetherLevel || 100;
        this.echoes = state.echoes || this.echoes;
        this.holdOnCooldown = state.holdOnCooldown || false;

        // Update display
        this.updateDisplay();

        console.log('Tether system state restored');

        // Check for death after restoring state (in case save was at 0%)
        if (this.tetherLevel <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }
    }

    // ========================================
    // CLEANUP (Memory Management)
    // ========================================

    cleanup() {
        console.log('🧹 TetherSystem cleanup initiated');

        // Clear all timers
        if (this.tetherDecayTimer) {
            clearInterval(this.tetherDecayTimer);
            this.tetherDecayTimer = null;
        }

        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }

        // Remove event listeners
        // Remove event listeners
        if (this.holdOnButton) {
            // Check if element is still in DOM before replacing
            if (this.holdOnButton.parentNode) {
                // Clone and replace to remove all listeners
                const newButton = this.holdOnButton.cloneNode(true);
                this.holdOnButton.parentNode.replaceChild(newButton, this.holdOnButton);
            }
            this.holdOnButton = null;
        }

        // SOLID REFACTOR: Unsubscribe from StateManager
        if (this._tetherSubscription) {
            this._tetherSubscription();
            this._tetherSubscription = null;
        }

        // Clear DOM references
        this.tetherUI = null;
        this.tetherFill = null;
        this.tetherText = null;
        this.echoDisplay = null;
        this.echo1Text = null;
        this.echo2Text = null;
        this.echoDespairText = null;

        console.log('✅ TetherSystem cleanup complete');
    }

    // ========================================
    // SOLID REFACTOR: TETHER LEVEL ACCESSOR
    // Reads/writes through StateManager for reactive updates
    // ========================================

    get tetherLevel() {
        return this.game.state.get('tether.level');
    }

    set tetherLevel(value) {
        this.game.state.set('tether.level', value);
    }

    // Additional tether settings accessors
    get tetherDifficulty() {
        return this.game.state.get('tether.difficulty');
    }

    get tetherCapFromState() {
        return this.game.state.get('tether.cap');
    }

    get tetherDecayRateFromState() {
        return this.game.state.get('tether.decayRate');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore - Assigning to window object
    window.TetherSystem = TetherSystem;
}

// ES Module export
export { TetherSystem };
