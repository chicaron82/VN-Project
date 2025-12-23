// ========================================
// THEME MANAGER - Version 848
// Route-specific visual theming system
// ========================================

/**
 * ThemeManager - Dynamic Color Theme System
 * 
 * Manages visual themes for different routes:
 * - Ronnie: Cyan/Blue aesthetic
 * - Tori: Pink/Magenta aesthetic
 * - Menu: Neutral cyan (default)
 * 
 * Uses CSS variables for seamless integration
 * 
 * @class ThemeManager
 */
class ThemeManager {
    // Theme definitions
    static THEMES = {
        ronnie: {
            name: 'Ronnie',
            primary: '#00ffff',
            primaryRgb: '0, 255, 255',
            accent: '#00ccff',
            glow: 'rgba(0, 255, 255, 0.5)',
            glowStrong: 'rgba(0, 255, 255, 0.8)',
            background: 'rgba(0, 10, 20, 0.95)',
            backgroundSolid: '#000a14',
            border: '#00ffff',
            text: '#00ffff',
            textMuted: '#66cccc',
            success: '#00ff88',
            warning: '#ffcc00',
            error: '#ff4444',
            emoji: '💙'
        },
        tori: {
            name: 'Tori',
            primary: '#ff6699',
            primaryRgb: '255, 102, 153',
            accent: '#ff99bb',
            glow: 'rgba(255, 102, 153, 0.5)',
            glowStrong: 'rgba(255, 102, 153, 0.8)',
            background: 'rgba(20, 0, 10, 0.95)',
            backgroundSolid: '#14000a',
            border: '#ff6699',
            text: '#ff6699',
            textMuted: '#cc6699',
            success: '#00ff88',
            warning: '#ffcc00',
            error: '#ff4444',
            emoji: '🖤'
        },
        menu: {
            name: 'Menu',
            primary: '#00ffff',
            primaryRgb: '0, 255, 255',
            accent: '#00ccff',
            glow: 'rgba(0, 255, 255, 0.5)',
            glowStrong: 'rgba(0, 255, 255, 0.8)',
            background: 'rgba(0, 0, 0, 0.95)',
            backgroundSolid: '#000000',
            border: '#00ffff',
            text: '#00ffff',
            textMuted: '#66cccc',
            success: '#00ff88',
            warning: '#ffcc00',
            error: '#ff4444',
            emoji: '🎮'
        }
    };

    // Theme preference modes
    static MODES = {
        AUTO: 'auto',      // Follow current route
        RONNIE: 'ronnie',  // Always Ronnie theme
        TORI: 'tori'       // Always Tori theme
    };

    // Current state
    static currentTheme = 'menu';
    static currentRoute = null;
    static preferenceMode = ThemeManager.MODES.AUTO;
    static initialized = false;

    /**
     * Initialize ThemeManager
     * Loads saved preference and applies initial theme
     */
    static init() {
        if (ThemeManager.initialized) return;

        // Load saved preference
        const savedMode = localStorage.getItem('themePreference');
        if (savedMode && Object.values(ThemeManager.MODES).includes(savedMode)) {
            ThemeManager.preferenceMode = savedMode;
        }

        // Apply initial theme
        ThemeManager.applyTheme('menu');
        ThemeManager.initialized = true;

        Logger?.info?.('ThemeManager initialized') || console.log('🎨 ThemeManager initialized');
    }

    /**
     * Set theme preference mode
     * @param {string} mode - 'auto', 'ronnie', or 'tori'
     */
    static setPreferenceMode(mode) {
        if (!Object.values(ThemeManager.MODES).includes(mode)) {
            console.warn(`ThemeManager: Invalid mode "${mode}"`);
            return;
        }

        ThemeManager.preferenceMode = mode;
        localStorage.setItem('themePreference', mode);

        // Apply theme based on new preference
        if (mode === ThemeManager.MODES.AUTO) {
            // If in a route, apply that route's theme
            if (ThemeManager.currentRoute) {
                ThemeManager.applyTheme(ThemeManager.currentRoute);
            }
        } else {
            // Apply locked theme
            ThemeManager.applyTheme(mode);
        }

        console.log(`🎨 Theme preference set to: ${mode.toUpperCase()}`);
    }

    /**
     * Get current preference mode
     * @returns {string}
     */
    static getPreferenceMode() {
        return ThemeManager.preferenceMode;
    }

    /**
     * Called when entering a route
     * @param {string} routeName - 'ronnie' or 'tori'
     */
    static setRoute(routeName) {
        ThemeManager.currentRoute = routeName;

        // Only auto-apply if in AUTO mode
        if (ThemeManager.preferenceMode === ThemeManager.MODES.AUTO) {
            ThemeManager.applyTheme(routeName);
        }
    }

    /**
     * Called when leaving a route (returning to menu)
     */
    static clearRoute() {
        ThemeManager.currentRoute = null;

        // In AUTO mode, revert to menu theme
        if (ThemeManager.preferenceMode === ThemeManager.MODES.AUTO) {
            ThemeManager.applyTheme('menu');
        }
    }

    /**
     * Apply a theme by setting CSS variables
     * @param {string} themeName - 'ronnie', 'tori', or 'menu'
     */
    static applyTheme(themeName) {
        const theme = ThemeManager.THEMES[themeName];
        if (!theme) {
            console.warn(`ThemeManager: Unknown theme "${themeName}"`);
            return;
        }

        const root = document.documentElement;

        // Set CSS variables
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-primary-rgb', theme.primaryRgb);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-glow', theme.glow);
        root.style.setProperty('--theme-glow-strong', theme.glowStrong);
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--theme-background-solid', theme.backgroundSolid);
        root.style.setProperty('--theme-border', theme.border);
        root.style.setProperty('--theme-text', theme.text);
        root.style.setProperty('--theme-text-muted', theme.textMuted);
        root.style.setProperty('--theme-success', theme.success);
        root.style.setProperty('--theme-warning', theme.warning);
        root.style.setProperty('--theme-error', theme.error);

        // Add theme class to body for additional CSS hooks
        document.body.classList.remove('theme-ronnie', 'theme-tori', 'theme-menu');
        document.body.classList.add(`theme-${themeName}`);

        ThemeManager.currentTheme = themeName;
        console.log(`🎨 Theme applied: ${theme.name} ${theme.emoji}`);
    }

    /**
     * Get current theme name
     * @returns {string}
     */
    static getCurrentTheme() {
        return ThemeManager.currentTheme;
    }

    /**
     * Get theme colors object
     * @param {string} themeName - Optional, defaults to current
     * @returns {object}
     */
    static getTheme(themeName = null) {
        const name = themeName || ThemeManager.currentTheme;
        return ThemeManager.THEMES[name] || ThemeManager.THEMES.menu;
    }

    /**
     * Get a specific color from current theme
     * @param {string} colorName - e.g. 'primary', 'glow', 'text'
     * @returns {string}
     */
    static getColor(colorName) {
        const theme = ThemeManager.getTheme();
        return theme[colorName] || theme.primary;
    }

    /**
     * Check if currently in Tori's theme
     * @returns {boolean}
     */
    static isToriTheme() {
        return ThemeManager.currentTheme === 'tori';
    }

    /**
     * Check if currently in Ronnie's theme
     * @returns {boolean}
     */
    static isRonnieTheme() {
        return ThemeManager.currentTheme === 'ronnie';
    }

    /**
     * Get settings UI options for theme preference
     * @returns {array}
     */
    static getSettingsOptions() {
        return [
            { value: 'auto', label: 'AUTO (Follow Route)', description: 'Theme changes with current route' },
            { value: 'ronnie', label: 'RONNIE 💙', description: 'Always use cyan/blue theme' },
            { value: 'tori', label: 'TORI 🖤', description: 'Always use pink/magenta theme' }
        ];
    }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
    } else {
        ThemeManager.init();
    }
}
