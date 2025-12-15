// ========================================
// CONSTANTS MODULE
// Common magic numbers and hardcoded values
// Used alongside GameConfig for non-configuration values
// ========================================

const Constants = {
    // Version number (appears in narrative/UI)
    VERSION_INITIAL: 848,

    // Animation and transition timing
    FADE_DURATION_MS: 300,
    SHORT_DELAY_MS: 100,
    STANDARD_DELAY_MS: 1000,

    // Splash screen timing
    SPLASH_MIN_DURATION_MS: 6000,
    SPLASH_FADE_OUT_START_MS: 5000,

    // Tether system
    TETHER_MAX: 100,
    TETHER_CRITICAL_THRESHOLD: 30
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constants;
}
