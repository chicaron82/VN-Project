// ========================================
// TETHER SYSTEM
// Manages Tori's consciousness tether mechanics
// V2 Port: Faithful transcription from V1
// ========================================
//
// "The tether is her lifeline. Your attention is her oxygen."
//
// RESPONSIBILITIES:
// - Tether decay (passive over time)
// - Hold On button (restore tether)
// - Tether death trigger at 0%
// - Difficulty scaling (Comfort/Normal/Intense/INSANE)
// - Visual feedback (UI updates, warnings, glitches)
//
// DIFFICULTY SCALING:
// - Comfort: No decay, auto-Hold On enabled
// - Normal: 0.15%/sec base decay, manual Hold On
// - Intense: 0.08%/sec (1.6x faster), manual Hold On
// - INSANE: 0.10%/sec, 66% cap, NO Hold On, read-only backlog
//
// DEATH TRIGGER:
// - At 0%, emits tether:death event
// - Route handler decides what happens (bad ending, retry, etc.)
//
// HOLD ON MECHANIC:
// - Restores 15% tether (configurable per difficulty)
// - Cooldown: 30 seconds (configurable)
// - INSANE mode: Button hidden entirely (no mercy)
//
// ZEE'S HAPTIC POLISH 🖤:
// - Vibration warning when entering critical zone
// - Heartbeat feedback on Hold On press
//
// 848 is sacred. 💚🔥💀
//
// - TetherSystem, ported with love by the UV7 crew
// ========================================

import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';
import {
    DifficultyId,
    DifficultyProfile,
    getDifficultyProfile
} from './DifficultyProfiles';

// ========================================
// TYPES
// ========================================

/**
 * Tether system state for save/load
 */
export interface TetherState {
    level: number;
    difficulty: DifficultyId;
    holdOnCooldown: boolean;
    decayFrozen: boolean;
}

/**
 * Echo state (legacy from V1 - now mostly handled by EchoMemorySystem)
 */
export interface EchoState {
    echo1: { name: string; mood: string; color: string; active: boolean };
    echo2: { name: string; mood: string; color: string; active: boolean };
    despair: { name: string; mood: string; color: string; active: boolean };
}

// ========================================
// TETHER SYSTEM
// ========================================

/**
 * TetherSystem
 *
 * Manages connection stability in Tori's route.
 * Core mechanic: tether decays over time, player must maintain connection.
 *
 * The tether represents Tori's connection to reality.
 * When it hits 0, she's lost. The loop continues.
 *
 * @class TetherSystem
 */
export class TetherSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Current state
    private level: number;
    private currentDifficulty: DifficultyId = 'normal';
    private profile: DifficultyProfile;

    // Decay system
    private decayTimer: ReturnType<typeof setInterval> | null = null;
    private decayFrozen: boolean = false;

    // Hold On cooldown
    private holdOnCooldown: boolean = false;
    private holdOnCooldownTimer: ReturnType<typeof setInterval> | null = null;
    private holdOnCooldownRemaining: number = 0;

    // Tutorial state
    private hasUsedHoldOn: boolean = false;
    private hasShownTutorialFlash: boolean = false;

    // Echo system state (legacy - for sprite display compatibility)
    private echoes: EchoState = {
        echo1: { name: 'Echo 1', mood: 'hopeful', color: '#00ffff', active: false },
        echo2: { name: 'Echo 2', mood: 'gentle', color: '#00ff00', active: false },
        despair: { name: 'Despair Echo', mood: 'bitter', color: '#ff0000', active: false }
    };

    // Configuration (from difficulty profile)
    private tetherCap: number = 100;
    private holdOnBoost: number = 15;
    private holdOnCooldownMs: number = 30000;
    private decayRateBase: number = 0.15;
    private decayRateMedium: number = 0.25;
    private decayRateCritical: number = 0.40;

    // Thresholds (from GameConfig)
    private readonly CRITICAL_THRESHOLD = GameConfig.TETHER?.THRESHOLD_CRITICAL ?? 20;
    private readonly MEDIUM_DECAY_THRESHOLD = GameConfig.TETHER?.THRESHOLD_MEDIUM_DECAY ?? 50;
    private readonly CRITICAL_DECAY_THRESHOLD = GameConfig.TETHER?.THRESHOLD_CRITICAL_DECAY ?? 30;
    private readonly DECAY_INTERVAL_MS = GameConfig.TETHER?.DECAY_INTERVAL_MS ?? 1000;

    // ========================================
    // CONSTRUCTOR
    // ========================================

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Get initial difficulty from settings or default to normal
        const savedDifficulty = stateManager.get<string>('settings.tetherDifficulty') ?? 'normal';
        this.currentDifficulty = savedDifficulty as DifficultyId;
        this.profile = getDifficultyProfile(this.currentDifficulty);

        // Initialize level
        this.level = GameConfig.TETHER?.INITIAL_LEVEL ?? 100;

        // Apply difficulty profile
        this.applyDifficultyProfile(this.profile);

        // Load tutorial state from localStorage
        this.hasShownTutorialFlash = localStorage.getItem('tetherTutorialShown') === 'true';

        // Set up event listeners
        this.setupEventListeners();

        // Sync initial state
        this.syncToStateManager();

        console.log('⚡ TetherSystem initialized');
        console.log(`   Difficulty: ${this.profile.name} | Cap: ${this.tetherCap}% | Decay: ${this.decayRateBase}`);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Settings changes (difficulty switch)
        this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'tetherDifficulty' || data.key === 'difficulty') {
                this.setDifficulty(data.value as DifficultyId);
            }
        });

        // Hold On button press from UI
        this.eventBus.on('tether:boost', () => {
            // External boost request (from UI button)
            // We handle the actual boost logic here
        });
    }

    // ========================================
    // DIFFICULTY MANAGEMENT
    // ========================================

    /**
     * Set difficulty and apply profile
     * Updates all decay rates, caps, and Hold On behavior
     *
     * @param difficultyId - 'comfort', 'normal', 'intense', or 'insane'
     */
    public setDifficulty(difficultyId: DifficultyId): void {
        this.currentDifficulty = difficultyId;
        this.profile = getDifficultyProfile(difficultyId);
        this.applyDifficultyProfile(this.profile);

        // Sync to state manager
        this.stateManager.set('settings.tetherDifficulty', difficultyId);

        console.log(`⚙️ Tether difficulty set to ${this.profile.name}`);
        console.log(`   Decay: ${this.decayRateBase} | Cap: ${this.tetherCap}% | Hold On: ${this.holdOnBoost}`);

        // If INSANE mode, activate insane visuals
        if (difficultyId === 'insane') {
            this.eventBus.emit('insane:activate', {});
        } else {
            this.eventBus.emit('insane:deactivate', {});
        }
    }

    /**
     * Apply difficulty profile settings
     */
    private applyDifficultyProfile(profile: DifficultyProfile): void {
        this.tetherCap = profile.tetherCap;
        this.holdOnBoost = profile.holdOnBoost;
        this.holdOnCooldownMs = profile.holdOnCooldown;
        this.decayRateBase = profile.decayRates.base;
        this.decayRateMedium = profile.decayRates.medium;
        this.decayRateCritical = profile.decayRates.critical;

        // Clamp current level to new cap if needed
        if (this.level > this.tetherCap) {
            this.level = this.tetherCap;
            this.updateDisplay();
        }
    }

    /**
     * Get current difficulty profile
     */
    public getDifficulty(): DifficultyProfile {
        return this.profile;
    }

    // ========================================
    // TETHER MANAGEMENT
    // ========================================

    /**
     * Update tether level by specified amount
     * Clamps to 0-cap, triggers warnings and death
     *
     * @param amount - Amount to add/subtract
     * @param reason - Reason for logging
     * @returns New tether level
     */
    public updateTether(amount: number, reason: string = ''): number {
        const previousLevel = this.level;

        // Clamp to 0 and cap
        this.level = Math.max(0, Math.min(this.tetherCap, this.level + amount));

        // ZEE'S ADDITION: Haptic warning when entering critical zone 🖤
        // Only trigger ONCE when crossing threshold
        if (previousLevel > 30 && this.level <= 30 && amount < 0) {
            this.eventBus.emit('effect:shake', { intensity: 'medium' });
            // Note: HapticSystem integration would go here
        }

        // Emit change event for reactive UI
        this.eventBus.emit('tether:change', {
            level: this.level,
            delta: amount
        });

        // Update display
        this.updateDisplay();

        // Trigger Hold On tutorial when first drops below 95%
        if (this.level <= 95 && previousLevel > 95 && !this.hasUsedHoldOn) {
            this.triggerTutorialHint();
        }

        // Check for critical threshold
        if (this.level <= this.CRITICAL_THRESHOLD && previousLevel > this.CRITICAL_THRESHOLD) {
            this.eventBus.emit('tether:critical', { level: this.level });
        }

        // Check for death
        if (this.level <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }

        // Log for debugging
        if (reason) {
            console.log(`⚡ Tether: ${this.level.toFixed(1)}% (${reason})`);
        }

        return this.level;
    }

    /**
     * Get current tether level
     */
    public getLevel(): number {
        return this.level;
    }

    /**
     * Set tether to specific level (dev command / save restore)
     *
     * @param value - Target level
     * @param animated - Whether to animate the change
     */
    public setLevel(value: number, animated: boolean = false): void {
        const targetLevel = Math.max(0, Math.min(this.tetherCap, value));

        if (!animated) {
            // Instant set
            this.level = targetLevel;
            this.updateDisplay();
            this.syncToStateManager();

            console.log(`⚡ Tether set to ${targetLevel}%`);

            // Check for death
            if (this.level <= 0) {
                this.stopDecay();
                this.onTetherDeath();
            }
            return;
        }

        // ANIMATED DROP - Player watches it drain
        // Used by INSANE mode cage scene
        console.log(`💀 INSANE MODE: Animating tether drop from ${this.level}% to ${targetLevel}%`);

        const startLevel = this.level;
        const difference = targetLevel - startLevel;
        const duration = 2000; // 2 seconds
        const steps = 40;
        const stepAmount = difference / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;

        const animationInterval = setInterval(() => {
            currentStep++;
            this.level = startLevel + (stepAmount * currentStep);

            // Clamp to target on final step
            if (currentStep >= steps) {
                this.level = targetLevel;
                this.updateDisplay();
                this.syncToStateManager();
                clearInterval(animationInterval);

                console.log(`💀 Tether drop complete: ${targetLevel}%`);

                // Check for death
                if (this.level <= 0) {
                    this.stopDecay();
                    this.onTetherDeath();
                }
            } else {
                this.updateDisplay();
            }
        }, stepDuration);
    }

    // ========================================
    // PASSIVE DECAY SYSTEM
    // ========================================

    /**
     * Start passive tether decay
     * Safe to call multiple times (won't create duplicates)
     */
    public startDecay(): void {
        if (this.decayTimer) {
            return; // Already running
        }

        // Comfort mode has no decay
        if (this.profile.decayRates.base === 0) {
            console.log('⚡ Tether decay skipped (Comfort mode)');
            return;
        }

        this.decayTimer = setInterval(() => {
            this.applyDecay();
        }, this.DECAY_INTERVAL_MS);

        console.log('⚡ Tether decay started');
    }

    /**
     * Stop passive tether decay
     */
    public stopDecay(): void {
        if (this.decayTimer) {
            clearInterval(this.decayTimer);
            this.decayTimer = null;
            console.log('⚡ Tether decay stopped');
        }

        // Clear cooldown timer if active
        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }
    }

    /**
     * Apply single decay tick
     * Called by interval timer
     */
    private applyDecay(): void {
        // Check if frozen (dev command)
        if (this.decayFrozen) {
            return;
        }

        // Calculate decay rate based on current level
        let decayAmount = this.decayRateBase;

        // Gentle acceleration when low
        if (this.level < this.MEDIUM_DECAY_THRESHOLD) {
            decayAmount = this.decayRateMedium;
        }
        if (this.level < this.CRITICAL_DECAY_THRESHOLD) {
            decayAmount = this.decayRateCritical;
        }

        // Apply decay
        this.updateTether(-decayAmount, 'passive decay');

        // Trigger glitch effect if critical
        if (this.level < this.CRITICAL_THRESHOLD) {
            this.triggerGlitchEffect();
        }
    }

    /**
     * Freeze decay (dev/accessibility command)
     */
    public freezeDecay(): void {
        this.decayFrozen = true;
        console.log('💚 DEV: Tether decay frozen');
    }

    /**
     * Resume decay after freeze
     */
    public resumeDecay(): void {
        this.decayFrozen = false;
        console.log('💚 DEV: Tether decay resumed');
    }

    /**
     * Check if decay is currently frozen
     */
    public isDecayFrozen(): boolean {
        return this.decayFrozen;
    }

    // ========================================
    // HOLD ON BUTTON
    // ========================================

    /**
     * Player manually boosts tether connection
     * Applies boost with cooldown
     *
     * @returns true if boost was applied, false if on cooldown
     */
    public holdOn(): boolean {
        // Check if Hold On is disabled (INSANE mode)
        if (!this.profile.holdOn.enabled) {
            console.log('💀 INSANE MODE: Hold On disabled');
            return false;
        }

        // Check cooldown
        if (this.holdOnCooldown) {
            console.log('⚡ Hold On on cooldown');
            return false;
        }

        // Mark that player has used Hold On
        this.hasUsedHoldOn = true;

        // Apply boost
        this.updateTether(this.holdOnBoost, 'HOLD ON button pressed');

        // Emit event for UI feedback
        this.eventBus.emit('tether:boost', { amount: this.holdOnBoost });

        // Start cooldown
        this.startHoldOnCooldown();

        return true;
    }

    /**
     * Start Hold On cooldown with countdown
     */
    private startHoldOnCooldown(): void {
        this.holdOnCooldown = true;
        this.holdOnCooldownRemaining = Math.ceil(this.holdOnCooldownMs / 1000);

        // Countdown timer for UI
        this.holdOnCooldownTimer = setInterval(() => {
            this.holdOnCooldownRemaining--;

            // Emit update for UI
            this.eventBus.emit('settings:changed', {
                key: 'holdOnCooldown',
                value: this.holdOnCooldownRemaining
            });

            if (this.holdOnCooldownRemaining <= 0) {
                this.resetHoldOnCooldown();
            }
        }, 1000);

        // Also set absolute timeout as safety
        setTimeout(() => {
            this.resetHoldOnCooldown();
        }, this.holdOnCooldownMs);
    }

    /**
     * Reset Hold On cooldown
     */
    private resetHoldOnCooldown(): void {
        this.holdOnCooldown = false;
        this.holdOnCooldownRemaining = 0;

        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }

        console.log('⚡ Hold On ready');
    }

    /**
     * Check if Hold On is on cooldown
     */
    public isHoldOnCooldown(): boolean {
        return this.holdOnCooldown;
    }

    /**
     * Get remaining cooldown seconds
     */
    public getHoldOnCooldownRemaining(): number {
        return this.holdOnCooldownRemaining;
    }

    /**
     * Check if Hold On is enabled for current difficulty
     */
    public isHoldOnEnabled(): boolean {
        return this.profile.holdOn.enabled;
    }

    // ========================================
    // VISUAL EFFECTS
    // ========================================

    /**
     * Update display (emit event for UI to handle)
     */
    private updateDisplay(): void {
        // Emit for TetherUI component to update
        this.eventBus.emit('tether:change', {
            level: this.level,
            delta: 0 // Just update, no delta
        });

        // Sync to state manager
        this.syncToStateManager();
    }

    /**
     * Trigger glitch effect when critical
     */
    private triggerGlitchEffect(): void {
        const isInsaneMode = this.currentDifficulty === 'insane';

        if (isInsaneMode && Math.random() < 0.3) {
            // 30% chance to trigger full corruption in INSANE mode
            this.eventBus.emit('insane:corrupt', {});
        } else {
            // Quick glitch effect
            const intensity = isInsaneMode ? 0.8 : 0.4;
            this.eventBus.emit('effect:glitch', { intensity });
        }
    }

    /**
     * Trigger tutorial hint for Hold On button
     */
    private triggerTutorialHint(): void {
        if (this.hasShownTutorialFlash) return;

        // Emit event for tutorial system
        this.eventBus.emit('ui:notification', {
            type: 'info',
            message: 'Hold On to restore connection!'
        });

        this.hasShownTutorialFlash = true;
        localStorage.setItem('tetherTutorialShown', 'true');
    }

    // ========================================
    // ECHO SYSTEM (Legacy)
    // ========================================

    /**
     * Show echoes (legacy API compatibility)
     * Now primarily handled by SpriteController
     */
    public showEchoes(echoDialogue: { echo1?: boolean; echo2?: boolean; despair?: boolean }): void {
        if (echoDialogue.echo1) this.echoes.echo1.active = true;
        if (echoDialogue.echo2) this.echoes.echo2.active = true;
        if (echoDialogue.despair) this.echoes.despair.active = true;
    }

    /**
     * Hide all echoes
     */
    public hideEchoes(): void {
        this.echoes.echo1.active = false;
        this.echoes.echo2.active = false;
        this.echoes.despair.active = false;
    }

    /**
     * Update echo mood
     */
    public updateEchoMood(echoId: 'echo1' | 'echo2' | 'despair', mood: string): void {
        if (this.echoes[echoId]) {
            this.echoes[echoId].mood = mood;
            console.log(`⚡ Echo ${echoId} mood updated: ${mood}`);
        }
    }

    /**
     * Get echo states
     */
    public getEchoes(): EchoState {
        return { ...this.echoes };
    }

    // ========================================
    // TETHER DEATH HANDLER
    // ========================================

    /**
     * Called when tether reaches 0%
     * Emits death event for route handler to process
     */
    private onTetherDeath(): void {
        console.log('💀 Tether death triggered');

        // Record death for echo memory
        this.eventBus.emit('tether:death', {});

        // The route handler (or GameEngine) should listen for this
        // and trigger the appropriate ending sequence
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    /**
     * Sync current state to StateManager
     */
    private syncToStateManager(): void {
        this.stateManager.set('game.tetherLevel', this.level);
        this.stateManager.set('tether.level', this.level);
        this.stateManager.set('tether.difficulty', this.currentDifficulty);
        this.stateManager.set('tether.cap', this.tetherCap);
        this.stateManager.set('tether.decayFrozen', this.decayFrozen);
    }

    /**
     * Reset tether to full (or cap)
     */
    public reset(): void {
        this.level = this.tetherCap;
        this.updateDisplay();

        // Clear cooldowns
        this.resetHoldOnCooldown();

        // Restart decay
        this.stopDecay();
        this.startDecay();

        console.log('⚡ Tether system reset');
    }

    /**
     * Get current state for save system
     */
    public getState(): TetherState {
        return {
            level: this.level,
            difficulty: this.currentDifficulty,
            holdOnCooldown: this.holdOnCooldown,
            decayFrozen: this.decayFrozen
        };
    }

    /**
     * Restore from saved state
     */
    public restoreState(state: TetherState): void {
        this.level = state.level ?? 100;
        this.currentDifficulty = state.difficulty ?? 'normal';
        this.holdOnCooldown = state.holdOnCooldown ?? false;
        this.decayFrozen = state.decayFrozen ?? false;

        // Apply difficulty profile
        this.profile = getDifficultyProfile(this.currentDifficulty);
        this.applyDifficultyProfile(this.profile);

        // Update display
        this.updateDisplay();

        console.log('⚡ Tether system state restored');

        // Check for death after restore
        if (this.level <= 0) {
            this.stopDecay();
            this.onTetherDeath();
        }
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Destroy system and clean up
     */
    public destroy(): void {
        this.stopDecay();

        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }

        console.log('⚡ TetherSystem destroyed');
    }
}
