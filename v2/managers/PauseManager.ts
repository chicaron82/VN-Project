import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * ════════════════════════════════════════════════════════════════
 * PAUSE MANAGER - V2 Port
 * Phase 20a: Centralized pause control with reason stack
 *
 * V1 Parity: pause-manager.js (168 lines → ~215 lines)
 *
 * Purpose:
 * - Prevent "pause conflicts" between systems
 * - Use Set of pause reasons instead of simple boolean
 * - Game pauses when ANY reason exists
 * - Game resumes only when ALL reasons are released
 *
 * Usage:
 *   pauseManager.request('tutorial');   // Game pauses
 *   pauseManager.request('pauseMenu');  // Still paused
 *   pauseManager.release('tutorial');   // Still paused (menu still open)
 *   pauseManager.release('pauseMenu');  // NOW game resumes
 *
 * V1 Parity Notes:
 * - Exact same Set-based reason tracking
 * - Listener subscription pattern preserved
 * - All logging messages match V1 verbatim
 * - EventBus integration added for V2 coordination
 *
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface PauseState {
    isPaused: boolean;
    reasons: string[];
}

export type PauseListener = (state: PauseState) => void;

export interface PauseDebugInfo {
    isPaused: boolean;
    reasonCount: number;
    reasons: string[];
    listenerCount: number;
}

export class PauseManager {
    private eventBus: EventBus;
    private reasons: Set<string>;
    private listeners: PauseListener[];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.reasons = new Set<string>();
        this.listeners = [];

        Logger.system('⏸️ PauseManager initialized');
    }

    // ========================================
    // PAUSE CONTROL - V1 Parity
    // ========================================

    /**
     * Request a pause for a specific reason
     * V1 Parity: pause-manager.js lines 34-49
     */
    public request(reason: string): void {
        if (!reason) {
            Logger.warn('PauseManager: request() called without a reason');
            return;
        }

        const wasPaused = this.isPaused;
        this.reasons.add(reason);

        if (!wasPaused && this.isPaused) {
            Logger.system(`⏸️ Game PAUSED (reason: ${reason})`);
            this._notifyListeners();

            // Emit EventBus event for V2 coordination
            // @ts-expect-error - pause:requested event will be added to GameEvents in future phase
            this.eventBus.emit('pause:requested', { reason });
        } else if (wasPaused) {
            Logger.system(`⏸️ Additional pause reason: ${reason} (total: ${this.reasons.size})`);
        }
    }

    /**
     * Release a pause reason
     * V1 Parity: pause-manager.js lines 55-75
     */
    public release(reason: string): void {
        if (!reason) {
            Logger.warn('PauseManager: release() called without a reason');
            return;
        }

        if (!this.reasons.has(reason)) {
            Logger.warn(`PauseManager: Tried to release unknown reason: ${reason}`);
            return;
        }

        const wasPaused = this.isPaused;
        this.reasons.delete(reason);

        if (wasPaused && !this.isPaused) {
            Logger.system(`▶️ Game RESUMED (released: ${reason})`);
            this._notifyListeners();

            // Emit EventBus event for V2 coordination
            // @ts-expect-error - pause:released event will be added to GameEvents in future phase
            this.eventBus.emit('pause:released', { reason });
        } else if (this.isPaused) {
            Logger.system(`⏸️ Released: ${reason} (still paused, remaining: ${[...this.reasons].join(', ')})`);
        }
    }

    /**
     * Force release all pause reasons (emergency reset)
     * V1 Parity: pause-manager.js lines 105-114
     */
    public releaseAll(): void {
        const hadReasons = this.reasons.size > 0;
        const reasons = [...this.reasons];
        this.reasons.clear();

        if (hadReasons) {
            Logger.system(`▶️ Game FORCE RESUMED (cleared: ${reasons.join(', ')})`);
            this._notifyListeners();

            // Emit EventBus event for V2 coordination
            // @ts-expect-error - pause:force_released event will be added to GameEvents in future phase
            this.eventBus.emit('pause:force_released', { reasons });
        }
    }

    // ========================================
    // STATE QUERIES - V1 Parity
    // ========================================

    /**
     * Check if game is currently paused
     * V1 Parity: pause-manager.js lines 81-83
     */
    public get isPaused(): boolean {
        return this.reasons.size > 0;
    }

    /**
     * Get all active pause reasons
     * V1 Parity: pause-manager.js lines 89-91
     */
    public get activeReasons(): string[] {
        return [...this.reasons];
    }

    /**
     * Check if a specific reason is currently active
     * V1 Parity: pause-manager.js lines 98-100
     */
    public hasReason(reason: string): boolean {
        return this.reasons.has(reason);
    }

    // ========================================
    // LISTENER SUBSCRIPTION - V1 Parity
    // ========================================

    /**
     * Subscribe to pause state changes
     * V1 Parity: pause-manager.js lines 121-127
     *
     * @param callback - Called with { isPaused, reasons } when state changes
     * @returns Unsubscribe function
     */
    public subscribe(callback: PauseListener): () => void {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) this.listeners.splice(index, 1);
        };
    }

    /**
     * Notify all listeners of state change
     * V1 Parity: pause-manager.js lines 133-145
     * @private
     */
    private _notifyListeners(): void {
        const state: PauseState = {
            isPaused: this.isPaused,
            reasons: this.activeReasons
        };
        this.listeners.forEach(cb => {
            try {
                cb(state);
            } catch (e) {
                Logger.error('PauseManager listener error:', e);
            }
        });
    }

    // ========================================
    // DEBUG - V1 Parity
    // ========================================

    /**
     * Get debug info
     * V1 Parity: pause-manager.js lines 151-158
     */
    public getDebugInfo(): PauseDebugInfo {
        return {
            isPaused: this.isPaused,
            reasonCount: this.reasons.size,
            reasons: this.activeReasons,
            listenerCount: this.listeners.length
        };
    }
}
