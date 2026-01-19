// ========================================
// DEBUG LOGGER (ZEERAH POLISH)
// Wrapper for console.log with DEBUG flag
// Provides granular control over logging categories
// ========================================

/**
 * DebugLogger
 * 
 * Centralized logging system with category-based filtering.
 * All logs respect GameConfig.DEBUG.enabled flag.
 * Individual categories can be toggled via GameConfig.DEBUG.log* flags.
 * 
 * Usage:
 *   DebugLogger.scene('Transitioning to:', sceneId);
 *   DebugLogger.tether('Tether level:', level);
 *   DebugLogger.error('Critical error:', error);  // Always logs
 * 
 * @class DebugLogger
 */
class DebugLogger {
    static log(category, ...args) {
        if (!GameConfig.DEBUG.enabled) return;

        const categoryFlag = `log${category.charAt(0).toUpperCase() + category.slice(1)}`;
        if (GameConfig.DEBUG[categoryFlag] === false) return;

        console.log(`[${category.toUpperCase()}]`, ...args);
    }

    static scene(...args) { this.log('sceneChanges', ...args); }
    static state(...args) { this.log('stateChanges', ...args); }
    static tether(...args) { this.log('tetherUpdates', ...args); }
    static save(...args) { this.log('saveLoad', ...args); }
    static sensory(...args) { this.log('sensoryFeedback', ...args); }
    static easter(...args) { this.log('easterEggs', ...args); }

    // Always logs regardless of debug flag (errors, critical)
    static error(...args) { console.error('[ERROR]', ...args); }
    static warn(...args) { console.warn('[WARN]', ...args); }
    static info(...args) { console.info('[INFO]', ...args); }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.DebugLogger = DebugLogger;
}

// ES Module export
export { DebugLogger };
