// @ts-check
// ========================================
// HAPTIC CONTROLLER - Version 848
// Centralized haptic feedback system
// Extracted from GameEngine for SOLID principles
// ========================================

/**
 * HapticController - Centralized haptic feedback management
 * 
 * Handles all vibration/haptic feedback with:
 * - Pattern library from GameConfig
 * - Comfort level scaling
 * - Debounce/anti-spam
 * - Unified sensory feedback (haptic + visual)
 * 
 * @class HapticController
 */
class HapticController {
    /**
     * @param {any} game - Game engine reference
     */
    constructor(game) {
        this.game = game;

        // Debounce state
        this.lastHapticTime = 0;
        this.hapticCooldownMs = 50;

        // Debug logging
        /** @type {Array<{cueType: string, channel: string, pattern: any, description: string, comfort: number, time: string}>} */
        this.sensoryLog = [];
        this.maxSensoryLog = 100;

        console.log('📳 HapticController initialized');
    }

    // ========================================
    // PATTERN ACCESS
    // ========================================

    /**
     * Get haptic patterns from GameConfig or fallback
     * @returns {{[key: string]: number|number[]}} Pattern library
     */
    getHapticPatterns() {
        // Try GameConfig first
        // @ts-ignore - GameConfig is a global
        if (typeof GameConfig !== 'undefined' && GameConfig.HAPTICS) {
            // @ts-ignore
            return GameConfig.HAPTICS;
        }

        // Fallback patterns
        return {
            light: 10,
            medium: 25,
            strong: 50,
            double: [25, 50, 25],
            triple: [20, 40, 20, 40, 20],
            pulse: [30, 30, 30, 30, 30],
            success: [10, 50, 30],
            warning: [50, 100, 50],
            error: [100, 50, 100, 50, 100],
            heartbeat: [40, 100, 60, 100],
            glitch: [10, 20, 5, 30, 15],
            echo: [15, 80, 15, 80, 15],
            denied: [80, 20, 80]
        };
    }

    // ========================================
    // PATTERN SCALING
    // ========================================

    /**
     * Scale haptic pattern by comfort level
     * @param {number|number[]} pattern - Base pattern
     * @param {number} comfortLevel - 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
     * @returns {number|number[]} Scaled pattern
     */
    scaleHapticPattern(pattern, comfortLevel) {
        // 0=Gentle (60%), 1=Normal (100%), 2=Amped (130%), 3=INSANE (200%)
        if (comfortLevel === 1) return pattern;

        // Normalize to array
        const arr = Array.isArray(pattern) ? pattern.slice() : [pattern];

        if (comfortLevel === 0) {
            // Gentle: softer, shorter
            return arr.map(ms => Math.max(5, Math.round(ms * 0.6)));
        }
        if (comfortLevel === 2) {
            // Amped: stronger, longer
            return arr.map(ms => Math.round(ms * 1.3));
        }
        if (comfortLevel === 3) {
            // INSANE: MUCH stronger, MUCH longer
            return arr.map(ms => Math.round(ms * 2.0));
        }

        return pattern;
    }

    // ========================================
    // MAIN HAPTIC TRIGGER
    // ========================================

    /**
     * Trigger haptic feedback
     * @param {string} patternName - Pattern name from library
     * @param {string} [description=''] - Debug description
     * @param {Object} [options={}] - Options
     * @param {string} [options.channel='ui'] - Channel type
     * @param {boolean} [options.force=false] - Bypass debounce
     */
    triggerHaptic(patternName, description = '', { channel = 'ui', force = false } = {}) {
        // Check if user has enabled haptics
        const settingsManager = this.game?.settingsManager;
        if (!settingsManager || !settingsManager.getHapticEnabled()) {
            return;
        }

        // Check device support
        if (!navigator.vibrate) {
            return;
        }

        // Debounce anti-spam
        const now = performance.now();
        if (!force && (now - this.lastHapticTime) < this.hapticCooldownMs) {
            if (this.game?.debugMode) console.log(`🚫 Haptic debounced: ${patternName}`);
            return;
        }
        this.lastHapticTime = now;

        // Get pattern
        const patterns = this.getHapticPatterns();
        let pattern = patterns[patternName];
        if (!pattern) {
            if (this.game?.debugMode) console.warn(`⚠️ Unknown haptic pattern: ${patternName}`);
            return;
        }

        // Scale by comfort
        const comfort = settingsManager?.getComfortIntensity?.() ?? 1;
        pattern = this.scaleHapticPattern(pattern, comfort);

        // Trigger vibration
        navigator.vibrate(pattern);

        // Log
        this.logSensory(patternName, channel, pattern, description);

        if (this.game?.debugMode) {
            console.log(`📳 Haptic: ${patternName} [channel=${channel}, comfort=${comfort}] - ${description}`, pattern);
        }
    }

    // ========================================
    // UNIFIED SENSORY FEEDBACK
    // ========================================

    /**
     * Trigger combined haptic + visual feedback
     * @param {string} cueType - Cue type from SENSORY_CUES
     * @param {HTMLElement|null} [target=null] - Visual target element
     * @param {string} [description=''] - Debug description
     */
    triggerSensoryFeedback(cueType, target = null, description = '') {
        // Get cue metadata from GameConfig
        // @ts-ignore - GameConfig is a global
        const sensoryCues = typeof GameConfig !== 'undefined' ? GameConfig.SENSORY_CUES : null;
        /** @type {{channel: string, basePattern: string, visualType: string|null}|undefined} */
        const meta = sensoryCues?.[cueType];
        if (!meta) {
            if (this.game?.debugMode) {
                console.warn(`⚠️ Unknown sensory cue: ${cueType}`);
            }
            return;
        }

        const { channel, basePattern, visualType } = meta;

        // 1) Visual cue
        if (this.game?.visualCueManager && visualType) {
            this.game.visualCueManager.trigger(visualType, target, { channel });
        }

        // 2) Haptic (critical/narrative bypass debounce)
        if (basePattern) {
            const forceTrigger = channel === 'critical' || channel === 'narrative';
            this.triggerHaptic(
                basePattern,
                description || `Sensory cue: ${cueType}`,
                { channel, force: forceTrigger }
            );
        }

        if (this.game?.debugMode) {
            console.log(`🎯 Sensory: ${cueType} [channel=${channel}] visual=${visualType || 'none'} haptic=${basePattern || 'none'}`);
        }
    }

    // ========================================
    // DEBUG LOGGING
    // ========================================

    /**
     * Log sensory event for debugging
     * @param {string} cueType
     * @param {string} channel
     * @param {any} pattern
     * @param {string} description
     */
    logSensory(cueType, channel, pattern, description) {
        if (!this.game?.debugMode) return;

        this.sensoryLog.push({
            cueType,
            channel,
            pattern,
            description,
            comfort: this.game?.settingsManager?.getComfortIntensity?.() ?? 1,
            time: new Date().toLocaleTimeString()
        });

        // Keep only last N entries
        if (this.sensoryLog.length > this.maxSensoryLog) {
            this.sensoryLog.shift();
        }
    }

    /**
     * Get sensory log for dev HUD
     * @returns {Array<{cueType: string, channel: string, pattern: any, description: string, comfort: number, time: string}>}
     */
    getSensoryLog() {
        return this.sensoryLog;
    }

    /**
     * Clear sensory log
     */
    clearSensoryLog() {
        this.sensoryLog = [];
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.HapticController = HapticController;
}

// ES Module export
export { HapticController };
