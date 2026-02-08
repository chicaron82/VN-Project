// ========================================
// SETTINGS MANAGER
// Handles text speed, auto-advance, and preferences
// ========================================

/**
 * ════════════════════════════════════════════════════════════════
 * SETTINGS-MANAGER.JS - Game Settings & Preferences System
 * Manages all player preferences, difficulty modes, and persistence
 * ════════════════════════════════════════════════════════════════
 */

class SettingsManager {
    constructor(game) {
        this.game = game;

        // Detect if running on Android for haptic default
        const canVibrate = 'vibrate' in navigator;
        const defaultHapticsEnabled = canVibrate;

        // Default settings
        this.settings = {
            textSpeed: 'normal',      // slow, normal, fast, instant
            autoAdvance: false,        // Auto-advance dialogue
            autoDelay: 2000,          // Delay in ms before auto-advance
            autoSkipPrologue: false,  // Auto-skip prologue when unlocked
            fullscreen: false,
            displayMode: 'auto',      // auto, portrait, landscape
            tetherDifficulty: 'normal', // relaxed, normal, intense
            hapticEnabled: defaultHapticsEnabled,
            comfortMode: false,
            comfortIntensity: 1
        };

        this.speedMultipliers = {
            slow: 2.0, normal: 1.0, fast: 0.5, instant: 0
        };

        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }

    // Simplification for V3 Rebuild - Basic methods
    setTextSpeed(speed) {
        this.settings.textSpeed = speed;
        this.saveSettings();
    }

    setTetherDifficulty(diff) {
        this.settings.tetherDifficulty = diff;
        this.saveSettings();
    }
}

class BacklogManager {
    constructor(game) {
        this.game = game;
        this.backlog = [];
    }
    addEntry(entry) {
        this.backlog.push(entry);
        if (this.backlog.length > 100) this.backlog.shift();
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.SettingsManager = SettingsManager;
    window.BacklogManager = BacklogManager;
}

// ES Module export
export { SettingsManager, BacklogManager };
