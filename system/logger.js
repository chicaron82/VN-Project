// ========================================
// LOGGER UTILITY - Version 848
// Centralized logging with debug levels
// ========================================

/**
 * Logger - Configurable Logging System
 * 
 * Features:
 * - Debug levels (DEBUG, INFO, WARN, ERROR)
 * - Production mode (disable verbose logs)
 * - Emoji prefixes for visual scanning
 * - Category filtering
 * 
 * Usage:
 *   Logger.debug('Loading...', data);
 *   Logger.info('Game started');
 *   Logger.warn('Low tether');
 *   Logger.error('Failed to load', error);
 * 
 * @class Logger
 */
class Logger {
    static LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        NONE: 4
    };

    static currentLevel = Logger.LEVELS.DEBUG;
    static enabled = true;
    static categories = new Set(); // Empty = all categories

    /**
     * Set the minimum log level
     * @param {string} level - 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
     */
    static setLevel(level) {
        Logger.currentLevel = Logger.LEVELS[level] || Logger.LEVELS.DEBUG;
        console.log(`🔧 Logger level set to: ${level}`);
    }

    /**
     * Enable/disable logging globally
     * @param {boolean} enabled
     */
    static setEnabled(enabled) {
        Logger.enabled = enabled;
    }

    /**
     * Set production mode (only WARN and ERROR)
     */
    static setProductionMode() {
        Logger.currentLevel = Logger.LEVELS.WARN;
        console.log('🏭 Logger: Production mode enabled');
    }

    /**
     * Enable only specific categories
     * @param {string[]} categories - e.g. ['CTRL', 'MENU', 'SAVE']
     */
    static setCategories(categories) {
        Logger.categories = new Set(categories);
    }

    /**
     * Check if category should be logged
     * @private
     */
    static shouldLog(level, category = null) {
        if (!Logger.enabled) return false;
        if (level < Logger.currentLevel) return false;
        if (category && Logger.categories.size > 0 && !Logger.categories.has(category)) {
            return false;
        }
        return true;
    }

    /**
     * Debug level - verbose development logs
     * @param {string} message
     * @param {...any} args
     */
    static debug(message, ...args) {
        if (Logger.shouldLog(Logger.LEVELS.DEBUG)) {
            console.log(`🐛 ${message}`, ...args);
        }
    }

    /**
     * Info level - general information
     * @param {string} message
     * @param {...any} args
     */
    static info(message, ...args) {
        if (Logger.shouldLog(Logger.LEVELS.INFO)) {
            console.log(`ℹ️ ${message}`, ...args);
        }
    }

    /**
     * Warn level - warnings
     * @param {string} message
     * @param {...any} args
     */
    static warn(message, ...args) {
        if (Logger.shouldLog(Logger.LEVELS.WARN)) {
            console.warn(`⚠️ ${message}`, ...args);
        }
    }

    /**
     * Error level - errors
     * @param {string} message
     * @param {...any} args
     */
    static error(message, ...args) {
        if (Logger.shouldLog(Logger.LEVELS.ERROR)) {
            console.error(`❌ ${message}`, ...args);
        }
    }

    /**
     * Success message (always INFO level)
     * @param {string} message
     * @param {...any} args
     */
    static success(message, ...args) {
        if (Logger.shouldLog(Logger.LEVELS.INFO)) {
            console.log(`✅ ${message}`, ...args);
        }
    }

    /**
     * Game-specific: SOLID controller initialization
     * @param {string} controllerName
     */
    static solid(controllerName) {
        if (Logger.shouldLog(Logger.LEVELS.DEBUG)) {
            console.log(`🔧 SOLID: ${controllerName} initialized`);
        }
    }

    /**
     * Game-specific: Feature unlock
     * @param {string} feature
     */
    static unlock(feature) {
        if (Logger.shouldLog(Logger.LEVELS.INFO)) {
            console.log(`🔓 UNLOCKED: ${feature}`);
        }
    }

    /**
     * Game-specific: Easter egg triggered
     * @param {string} code
     */
    static easterEgg(code) {
        if (Logger.shouldLog(Logger.LEVELS.INFO)) {
            console.log(`🥚 Easter egg triggered: ${code}`);
        }
    }

    /**
     * Game-specific: State change
     * @param {string} change
     */
    static state(change) {
        if (Logger.shouldLog(Logger.LEVELS.DEBUG)) {
            console.log(`📊 ${change}`);
        }
    }

    /**
     * Game-specific: Navigation
     * @param {string} action
     */
    static nav(action) {
        if (Logger.shouldLog(Logger.LEVELS.DEBUG)) {
            console.log(`🧭 ${action}`);
        }
    }

    /**
     * Group related logs together
     * @param {string} label
     * @param {Function} fn
     */
    static group(label, fn) {
        if (Logger.shouldLog(Logger.LEVELS.DEBUG)) {
            console.group(label);
            fn();
            console.groupEnd();
        }
    }
}

// Auto-detect production mode
if (typeof window !== 'undefined' && window.location) {
    const isProduction = window.location.hostname !== 'localhost' &&
        !window.location.hostname.includes('127.0.0.1');
    if (isProduction) {
        Logger.setProductionMode();
    }
}
