/**
 * ════════════════════════════════════════════════════════════════
 * DEBUG LOGGER - V2 Port
 * Phase 22h: Debug Logging Utility
 *
 * V1 Parity: system/debug-logger.js (50 lines → ~90 lines)
 *
 * Purpose:
 * - Centralized logging system with category filtering
 * - Respects GameConfig.DEBUG.enabled flag
 * - Individual category toggles
 * - Always logs errors/warnings regardless of DEBUG flag
 *
 * Features:
 * - Category-based logging (scene, state, tether, save, etc.)
 * - Dynamic category flag lookup
 * - Error/warn/info always logged
 * - Clean console output with category prefixes
 *
 * V1 Parity Notes:
 * - All category methods preserved
 * - GameConfig.DEBUG flag checking unchanged
 * - Console output format unchanged
 * - Category capitalization preserved
 *
 * ZEERAH POLISH: Granular control over logging categories 🔍
 * ════════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface DebugConfig {
    enabled: boolean;
    logSceneChanges?: boolean;
    logStateChanges?: boolean;
    logTetherUpdates?: boolean;
    logSaveLoad?: boolean;
    logSensoryFeedback?: boolean;
    logEasterEggs?: boolean;
    [key: string]: boolean | undefined;
}

interface GameConfig {
    DEBUG: DebugConfig;
}

// Global GameConfig reference (will be set by game initialization)
declare const GameConfig: GameConfig;

export class DebugLogger {
    // ========================================
    // CORE LOGGING
    // ========================================

    /**
     * Log with category filtering
     */
    private static log(category: string, ...args: any[]): void {
        // Check if DEBUG is enabled
        if (typeof GameConfig === 'undefined' || !GameConfig.DEBUG.enabled) return;

        // Build category flag name (e.g., "sceneChanges" → "logSceneChanges")
        const categoryFlag = `log${category.charAt(0).toUpperCase() + category.slice(1)}`;

        // Check if this specific category is enabled
        if (GameConfig.DEBUG[categoryFlag] === false) return;

        // Log with category prefix
        Logger.debug(`[${category.toUpperCase()}]`, ...args);
    }

    // ========================================
    // CATEGORY METHODS
    // ========================================

    /**
     * Scene changes logging
     */
    public static scene(...args: any[]): void {
        this.log('sceneChanges', ...args);
    }

    /**
     * State changes logging
     */
    public static state(...args: any[]): void {
        this.log('stateChanges', ...args);
    }

    /**
     * Tether updates logging
     */
    public static tether(...args: any[]): void {
        this.log('tetherUpdates', ...args);
    }

    /**
     * Save/load logging
     */
    public static save(...args: any[]): void {
        this.log('saveLoad', ...args);
    }

    /**
     * Sensory feedback logging
     */
    public static sensory(...args: any[]): void {
        this.log('sensoryFeedback', ...args);
    }

    /**
     * Easter egg logging
     */
    public static easter(...args: any[]): void {
        this.log('easterEggs', ...args);
    }

    // ========================================
    // ALWAYS-ON LOGGING (errors, critical info)
    // ========================================

    /**
     * Error logging (always enabled)
     */
    public static error(...args: any[]): void {
        Logger.error(...args);
    }

    /**
     * Warning logging (always enabled)
     */
    public static warn(...args: any[]): void {
        Logger.warn(...args);
    }

    /**
     * Info logging (always enabled)
     */
    public static info(...args: any[]): void {
        Logger.info(...args);
    }
}
