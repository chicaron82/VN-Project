// ========================================
// TETHER SYSTEM
// Manages Tori's consciousness tether mechanics
// V2 Port: Faithful transcription from V1
// ========================================
//
// "The tether is her lifeline. Your attention is her oxygen."
//
// DECOMPOSED: Types    → TetherTypes.ts
//             Hold On  → TetherHoldOn.ts
//             Core     → this file
//
// 848 is sacred. 💚🔥💀
//
// - TetherSystem, ported with love by the UV7 crew
// ========================================

import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';
import { Logger } from '@utils/Logger';
import type {
    DifficultyId,
    DifficultyProfile} from './DifficultyProfiles';
import {
    getDifficultyProfile
} from './DifficultyProfiles';

import type { TetherState, EchoState } from './TetherTypes';
import { HoldOnManager } from './TetherHoldOn';

// Re-export types for backward compatibility
export type { TetherState, EchoState } from './TetherTypes';

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

    // Hold On subsystem (extracted)
    private holdOnManager: HoldOnManager;

    // Tutorial state
    private hasShownTutorialFlash: boolean = false;

    // Echo system state (legacy - for sprite display compatibility)
    private echoes: EchoState = {
        echo1: { name: 'Echo 1', mood: 'hopeful', color: '#00ffff', active: false },
        echo2: { name: 'Echo 2', mood: 'gentle', color: '#00ff00', active: false },
        despair: { name: 'Despair Echo', mood: 'bitter', color: '#ff0000', active: false }
    };

    // Configuration (from difficulty profile)
    private tetherCap: number = 100;
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

        // Initialize Hold On subsystem
        this.holdOnManager = new HoldOnManager(eventBus);

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

        Logger.tether('⚡ TetherSystem initialized');
        Logger.tether(`   Difficulty: ${this.profile.name} | Cap: ${this.tetherCap}% | Decay: ${this.decayRateBase}`);
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

        Logger.tether(`⚙️ Tether difficulty set to ${this.profile.name}`);
        Logger.tether(`   Decay: ${this.decayRateBase} | Cap: ${this.tetherCap}%`);

        // If INSANE mode, activate insane visuals
        if (difficultyId === 'insane') {
            this.eventBus.emit('insane:activate', {});
        } else {
            this.eventBus.emit('insane:deactivate', {});
        }
    }

    /**
     * Apply difficulty profile settings (to both TetherSystem + HoldOnManager)
     */
    private applyDifficultyProfile(profile: DifficultyProfile): void {
        this.tetherCap = profile.tetherCap;
        this.decayRateBase = profile.decayRates.base;
        this.decayRateMedium = profile.decayRates.medium;
        this.decayRateCritical = profile.decayRates.critical;

        // Delegate Hold On config to subsystem
        this.holdOnManager.applyDifficultyProfile(profile);

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
        }

        // Emit change event for reactive UI
        this.eventBus.emit('tether:change', {
            level: this.level,
            delta: amount
        });

        // Update display
        this.updateDisplay();

        // Trigger Hold On tutorial when first drops below 95%
        if (this.level <= 95 && previousLevel > 95 && !this.holdOnManager.getHasUsedHoldOn()) {
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
            Logger.tether(`⚡ Tether: ${this.level.toFixed(1)}% (${reason})`);
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

            Logger.tether(`⚡ Tether set to ${targetLevel}%`);

            // Check for death
            if (this.level <= 0) {
                this.stopDecay();
                this.onTetherDeath();
            }
            return;
        }

        // ANIMATED DROP - Player watches it drain
        // Used by INSANE mode cage scene
        Logger.tether(`💀 INSANE MODE: Animating tether drop from ${this.level}% to ${targetLevel}%`);

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

                Logger.tether(`💀 Tether drop complete: ${targetLevel}%`);

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
            Logger.tether('⚡ Tether decay skipped (Comfort mode)');
            return;
        }

        this.decayTimer = setInterval(() => {
            this.applyDecay();
        }, this.DECAY_INTERVAL_MS);

        Logger.tether('⚡ Tether decay started');
    }

    /**
     * Stop passive tether decay
     */
    public stopDecay(): void {
        if (this.decayTimer) {
            clearInterval(this.decayTimer);
            this.decayTimer = null;
            Logger.tether('⚡ Tether decay stopped');
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
        Logger.tether('💚 DEV: Tether decay frozen');
    }

    /**
     * Resume decay after freeze
     */
    public resumeDecay(): void {
        this.decayFrozen = false;
        Logger.tether('💚 DEV: Tether decay resumed');
    }

    /**
     * Check if decay is currently frozen
     */
    public isDecayFrozen(): boolean {
        return this.decayFrozen;
    }

    // ========================================
    // HOLD ON BUTTON (delegated to HoldOnManager)
    // ========================================

    /**
     * Player manually boosts tether connection
     * Applies boost with cooldown
     *
     * @returns true if boost was applied, false if on cooldown
     */
    public holdOn(): boolean {
        return this.holdOnManager.holdOn(
            this.profile,
            (amount, reason) => this.updateTether(amount, reason),
        );
    }

    /**
     * Check if Hold On is on cooldown
     */
    public isHoldOnCooldown(): boolean {
        return this.holdOnManager.isOnCooldown();
    }

    /**
     * Get remaining cooldown seconds
     */
    public getHoldOnCooldownRemaining(): number {
        return this.holdOnManager.getCooldownRemaining();
    }

    /**
     * Check if Hold On is enabled for current difficulty
     */
    public isHoldOnEnabled(): boolean {
        return this.holdOnManager.isEnabled(this.profile);
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
            Logger.tether(`⚡ Echo ${echoId} mood updated: ${mood}`);
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
        Logger.tether('💀 Tether death triggered');

        // Record death for echo memory
        this.eventBus.emit('tether:death', {});
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
        this.holdOnManager.resetCooldown();

        // Restart decay
        this.stopDecay();
        this.startDecay();

        Logger.tether('⚡ Tether system reset');
    }

    /**
     * Get current state for save system
     */
    public getState(): TetherState {
        return {
            level: this.level,
            difficulty: this.currentDifficulty,
            holdOnCooldown: this.holdOnManager.isOnCooldown(),
            decayFrozen: this.decayFrozen
        };
    }

    /**
     * Restore from saved state
     */
    public restoreState(state: TetherState): void {
        this.level = state.level ?? 100;
        this.currentDifficulty = state.difficulty ?? 'normal';
        this.holdOnManager.restoreCooldownState(state.holdOnCooldown ?? false);
        this.decayFrozen = state.decayFrozen ?? false;

        // Apply difficulty profile
        this.profile = getDifficultyProfile(this.currentDifficulty);
        this.applyDifficultyProfile(this.profile);

        // Update display
        this.updateDisplay();

        Logger.tether('⚡ Tether system state restored');

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
        this.holdOnManager.destroy();

        Logger.tether('⚡ TetherSystem destroyed');
    }
}
