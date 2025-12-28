// ========================================
// PAUSE MANAGER
// Centralized pause control with reason stack
// Prevents "pause conflicts" between systems
// ========================================

/**
 * PauseManager
 * 
 * Instead of a simple boolean, uses a Set of "pause reasons".
 * Game is paused when ANY reason exists.
 * Game resumes only when ALL reasons are released.
 * 
 * Usage:
 *   pauseManager.request('tutorial');   // Game pauses
 *   pauseManager.request('pauseMenu');  // Still paused
 *   pauseManager.release('tutorial');   // Still paused (menu still open)
 *   pauseManager.release('pauseMenu');  // NOW game resumes
 * 
 * @class PauseManager
 */
class PauseManager {
    constructor() {
        this.reasons = new Set();
        this.listeners = [];

        console.log('⏸️ PauseManager initialized');
    }

    /**
     * Request a pause for a specific reason
     * @param {string} reason - Identifier for what's requesting the pause
     */
    request(reason) {
        if (!reason) {
            console.warn('PauseManager: request() called without a reason');
            return;
        }

        const wasPaused = this.isPaused;
        this.reasons.add(reason);

        if (!wasPaused && this.isPaused) {
            console.log(`⏸️ Game PAUSED (reason: ${reason})`);
            this._notifyListeners();
        } else if (wasPaused) {
            console.log(`⏸️ Additional pause reason: ${reason} (total: ${this.reasons.size})`);
        }
    }

    /**
     * Release a pause reason
     * @param {string} reason - Identifier to release
     */
    release(reason) {
        if (!reason) {
            console.warn('PauseManager: release() called without a reason');
            return;
        }

        if (!this.reasons.has(reason)) {
            console.warn(`PauseManager: Tried to release unknown reason: ${reason}`);
            return;
        }

        const wasPaused = this.isPaused;
        this.reasons.delete(reason);

        if (wasPaused && !this.isPaused) {
            console.log(`▶️ Game RESUMED (released: ${reason})`);
            this._notifyListeners();
        } else if (this.isPaused) {
            console.log(`⏸️ Released: ${reason} (still paused, remaining: ${[...this.reasons].join(', ')})`);
        }
    }

    /**
     * Check if game is currently paused
     * @returns {boolean}
     */
    get isPaused() {
        return this.reasons.size > 0;
    }

    /**
     * Get all active pause reasons
     * @returns {string[]}
     */
    get activeReasons() {
        return [...this.reasons];
    }

    /**
     * Check if a specific reason is currently active
     * @param {string} reason 
     * @returns {boolean}
     */
    hasReason(reason) {
        return this.reasons.has(reason);
    }

    /**
     * Force release all pause reasons (emergency reset)
     */
    releaseAll() {
        const hadReasons = this.reasons.size > 0;
        const reasons = [...this.reasons];
        this.reasons.clear();

        if (hadReasons) {
            console.log(`▶️ Game FORCE RESUMED (cleared: ${reasons.join(', ')})`);
            this._notifyListeners();
        }
    }

    /**
     * Subscribe to pause state changes
     * @param {Function} callback - Called with { isPaused, reasons } when state changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) this.listeners.splice(index, 1);
        };
    }

    /**
     * Notify all listeners of state change
     * @private
     */
    _notifyListeners() {
        const state = {
            isPaused: this.isPaused,
            reasons: this.activeReasons
        };
        this.listeners.forEach(cb => {
            try {
                cb(state);
            } catch (e) {
                console.error('PauseManager listener error:', e);
            }
        });
    }

    /**
     * Get debug info
     * @returns {Object}
     */
    getDebugInfo() {
        return {
            isPaused: this.isPaused,
            reasonCount: this.reasons.size,
            reasons: this.activeReasons,
            listenerCount: this.listeners.length
        };
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.PauseManager = PauseManager;
}

// ES Module export
export { PauseManager };
