/**
 * Tether Hold On Subsystem
 * Manages the "Hold On" button mechanic — player manually boosts tether connection.
 *
 * Extracted from TetherSystem for clean separation of concerns.
 * The Hold On system has its own state (cooldown tracking) and lifecycle.
 *
 * V1 Parity: The Hold On button is disabled in INSANE mode (no mercy).
 *
 * 848 is sacred. 💚🔥💀
 */

import type { EventBus } from '../core/EventBus';
import type { DifficultyProfile } from './DifficultyProfiles';
import { Logger } from '@utils/Logger';

/**
 * HoldOnManager
 *
 * Manages the Hold On button state, cooldown, and boost application.
 * Delegates actual tether updates back to TetherSystem via callback.
 */
export class HoldOnManager {
    private holdOnCooldown: boolean = false;
    private holdOnCooldownTimer: ReturnType<typeof setInterval> | null = null;
    private holdOnCooldownRemaining: number = 0;
    private hasUsedHoldOn: boolean = false;

    // Configuration (set by TetherSystem when difficulty changes)
    private holdOnBoost: number = 15;
    private holdOnCooldownMs: number = 30000;

    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    // ========================================
    // CONFIGURATION
    // ========================================

    /**
     * Update Hold On configuration from difficulty profile
     */
    public applyDifficultyProfile(profile: DifficultyProfile): void {
        this.holdOnBoost = profile.holdOnBoost;
        this.holdOnCooldownMs = profile.holdOnCooldown;
    }

    // ========================================
    // HOLD ON ACTION
    // ========================================

    /**
     * Player manually boosts tether connection
     * Applies boost with cooldown
     *
     * @param profile - Current difficulty profile (for enabled check)
     * @param updateTether - Callback to apply tether change
     * @returns true if boost was applied, false if on cooldown or disabled
     */
    public holdOn(
        profile: DifficultyProfile,
        updateTether: (amount: number, reason: string) => void,
    ): boolean {
        // Check if Hold On is disabled (INSANE mode)
        if (!profile.holdOn.enabled) {
            Logger.tether('💀 INSANE MODE: Hold On disabled');
            return false;
        }

        // Check cooldown
        if (this.holdOnCooldown) {
            Logger.tether('⚡ Hold On on cooldown');
            return false;
        }

        // Mark that player has used Hold On
        this.hasUsedHoldOn = true;

        // Apply boost via callback
        updateTether(this.holdOnBoost, 'HOLD ON button pressed');

        // Emit event for UI feedback
        this.eventBus.emit('tether:boost', { amount: this.holdOnBoost });

        // Start cooldown
        this.startCooldown();

        return true;
    }

    /**
     * Check if player has ever used Hold On (for tutorial)
     */
    public getHasUsedHoldOn(): boolean {
        return this.hasUsedHoldOn;
    }

    // ========================================
    // COOLDOWN SYSTEM
    // ========================================

    /**
     * Start Hold On cooldown with countdown
     */
    private startCooldown(): void {
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
                this.resetCooldown();
            }
        }, 1000);

        // Also set absolute timeout as safety
        setTimeout(() => {
            this.resetCooldown();
        }, this.holdOnCooldownMs);
    }

    /**
     * Reset Hold On cooldown
     */
    public resetCooldown(): void {
        this.holdOnCooldown = false;
        this.holdOnCooldownRemaining = 0;

        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }

        Logger.tether('⚡ Hold On ready');
    }

    /**
     * Check if Hold On is on cooldown
     */
    public isOnCooldown(): boolean {
        return this.holdOnCooldown;
    }

    /**
     * Get remaining cooldown seconds
     */
    public getCooldownRemaining(): number {
        return this.holdOnCooldownRemaining;
    }

    /**
     * Check if Hold On is enabled for given difficulty profile
     */
    public isEnabled(profile: DifficultyProfile): boolean {
        return profile.holdOn.enabled;
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    /**
     * Restore cooldown state from save
     */
    public restoreCooldownState(isOnCooldown: boolean): void {
        this.holdOnCooldown = isOnCooldown;
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Destroy and clean up timers
     */
    public destroy(): void {
        if (this.holdOnCooldownTimer) {
            clearInterval(this.holdOnCooldownTimer);
            this.holdOnCooldownTimer = null;
        }
    }
}
