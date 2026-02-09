/**
 * ThemeManager - Dynamic Color Theme System
 * V1 Parity Port from theme-manager.js (367 lines)
 *
 * Manages visual themes for different routes:
 * - Ronnie: Cyan/Blue aesthetic 💙
 * - Tori: Pink/Magenta aesthetic 🖤
 * - Menu: Neutral cyan (default) 🎮
 * - Ending themes: True Ending 💚, Digital Forever 💜, Bad Ending ❤️
 *
 * Uses CSS variables for seamless integration
 *
 * Responsibilities:
 * - Route-specific color theming
 * - Theme preference modes (AUTO, RONNIE, TORI, TRUE, DIGITAL, BAD)
 * - Ending-specific themes (applied after achieving endings)
 * - CSS variable injection
 * - Theme persistence in localStorage
 *
 * 848 is sacred. 💚🔥💀
 */

import { Logger } from '@utils/Logger';

// ========================================
// THEME DEFINITIONS
// V1 Parity: theme-manager.js lines 20-124
// ========================================

export interface Theme {
    name: string;
    primary: string;
    primaryRgb: string;
    accent: string;
    glow: string;
    glowStrong: string;
    background: string;
    backgroundSolid: string;
    border: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    emoji: string;
}

export type ThemeName = 'ronnie' | 'tori' | 'menu' | 'trueEnding' | 'digitalForever' | 'badEnding';
export type ThemeMode = 'auto' | 'ronnie' | 'tori' | 'true' | 'digital' | 'bad';

const THEMES: Record<ThemeName, Theme> = {
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
    },
    // ENDING THEMES - Applied after achieving endings (AUTO mode only)
    trueEnding: {
        name: 'True Ending',
        primary: '#00ff88',
        primaryRgb: '0, 255, 136',
        accent: '#00ffaa',
        glow: 'rgba(0, 255, 136, 0.5)',
        glowStrong: 'rgba(0, 255, 136, 0.8)',
        background: 'rgba(0, 20, 10, 0.95)',
        backgroundSolid: '#00140a',
        border: '#00ff88',
        text: '#00ff88',
        textMuted: '#66cc99',
        success: '#00ff88',
        warning: '#ffcc00',
        error: '#ff4444',
        emoji: '💚'
    },
    digitalForever: {
        name: 'Digital Forever',
        primary: '#ff00ff',
        primaryRgb: '255, 0, 255',
        accent: '#ff66ff',
        glow: 'rgba(255, 0, 255, 0.5)',
        glowStrong: 'rgba(255, 0, 255, 0.8)',
        background: 'rgba(20, 0, 20, 0.95)',
        backgroundSolid: '#140014',
        border: '#ff00ff',
        text: '#ff00ff',
        textMuted: '#cc66cc',
        success: '#00ff88',
        warning: '#ffcc00',
        error: '#ff4444',
        emoji: '💜'
    },
    badEnding: {
        name: 'Bad Ending',
        primary: '#ff4444',
        primaryRgb: '255, 68, 68',
        accent: '#ff6666',
        glow: 'rgba(255, 68, 68, 0.5)',
        glowStrong: 'rgba(255, 68, 68, 0.8)',
        background: 'rgba(20, 0, 0, 0.95)',
        backgroundSolid: '#140000',
        border: '#ff4444',
        text: '#ff4444',
        textMuted: '#cc6666',
        success: '#00ff88',
        warning: '#ffcc00',
        error: '#ff4444',
        emoji: '❤️'
    }
};

// Theme preference modes
const MODES: Record<string, ThemeMode> = {
    AUTO: 'auto',           // Follow current route
    RONNIE: 'ronnie',       // Always Ronnie theme
    TORI: 'tori',           // Always Tori theme
    TRUE: 'true',           // Always True Ending theme
    DIGITAL: 'digital',     // Always Digital Forever theme
    BAD: 'bad'              // Always Bad Ending theme
};

// ========================================
// THEME MANAGER CLASS
// V1 Parity: theme-manager.js lines 126-349
// ========================================

export class ThemeManager {
    private currentTheme: ThemeName = 'menu';
    private currentRoute: string | null = null;
    private preferenceMode: ThemeMode = 'auto';
    private initialized: boolean = false;

    /**
     * Initialize ThemeManager
     * V1 Parity: Loads saved preference and applies initial theme
     */
    public init(): void {
        if (this.initialized) return;

        // Load saved preference
        const savedMode = localStorage.getItem('themePreference');
        if (savedMode && Object.values(MODES).includes(savedMode as ThemeMode)) {
            this.preferenceMode = savedMode as ThemeMode;
        }

        // Apply initial theme
        this.applyTheme('menu');
        this.initialized = true;

        Logger.ui('🎨 ThemeManager initialized');
    }

    // ========================================
    // THEME PREFERENCE MANAGEMENT
    // V1 Parity: lines 162-203
    // ========================================

    /**
     * Set theme preference mode
     * V1 Parity: 'auto', 'ronnie', 'tori', 'true', 'digital', or 'bad'
     */
    public setPreferenceMode(mode: ThemeMode): void {
        if (!Object.values(MODES).includes(mode)) {
            Logger.warn(`ThemeManager: Invalid mode "${mode}"`);
            return;
        }

        this.preferenceMode = mode;
        localStorage.setItem('themePreference', mode);

        // Apply theme based on new preference
        if (mode === MODES.AUTO) {
            // If in a route, apply that route's theme
            if (this.currentRoute) {
                this.applyTheme(this.currentRoute as ThemeName);
            }
        } else {
            // Map mode to theme name (ending themes have different names)
            const themeMap: Record<string, ThemeName> = {
                'ronnie': 'ronnie',
                'tori': 'tori',
                'true': 'trueEnding',
                'digital': 'digitalForever',
                'bad': 'badEnding'
            };
            const themeName = themeMap[mode] || (mode as ThemeName);
            this.applyTheme(themeName);
        }

        Logger.ui(`🎨 Theme preference set to: ${mode.toUpperCase()}`);
    }

    /**
     * Get current preference mode
     */
    public getPreferenceMode(): ThemeMode {
        return this.preferenceMode;
    }

    // ========================================
    // ROUTE MANAGEMENT
    // V1 Parity: lines 205-228
    // ========================================

    /**
     * Called when entering a route
     * V1 Parity: 'ronnie' or 'tori'
     */
    public setRoute(routeName: string): void {
        this.currentRoute = routeName;

        // Only auto-apply if in AUTO mode
        if (this.preferenceMode === MODES.AUTO) {
            this.applyTheme(routeName as ThemeName);
        }
    }

    /**
     * Called when leaving a route (returning to menu)
     */
    public clearRoute(): void {
        this.currentRoute = null;

        // In AUTO mode, revert to menu theme
        if (this.preferenceMode === MODES.AUTO) {
            this.applyTheme('menu');
        }
    }

    // ========================================
    // ENDING THEMES
    // V1 Parity: lines 230-256
    // ========================================

    /**
     * Set ending-specific theme (called after achieving an ending)
     * Only applies in AUTO mode - locked themes stay locked
     */
    public setEndingTheme(endingType: string): void {
        // Only apply if in AUTO mode
        if (this.preferenceMode !== MODES.AUTO) {
            return;
        }

        // Map ending types to theme names
        const themeMap: Record<string, ThemeName> = {
            'true': 'trueEnding',
            'digitalForever': 'digitalForever',
            'digital_forever': 'digitalForever', // Support snake_case from route files
            'bad': 'badEnding'
        };

        const themeName = themeMap[endingType];
        if (themeName) {
            this.applyTheme(themeName);
            Logger.ui(`🏆 Ending theme applied: ${endingType}`);
        } else {
            Logger.warn(`ThemeManager: Unknown ending type "${endingType}"`);
        }
    }

    // ========================================
    // THEME APPLICATION
    // V1 Parity: lines 258-292
    // ========================================

    /**
     * Apply a theme by setting CSS variables
     * V1 Parity: Uses CSS variables for seamless integration
     */
    public applyTheme(themeName: ThemeName): void {
        const theme = THEMES[themeName];
        if (!theme) {
            Logger.warn(`ThemeManager: Unknown theme "${themeName}"`);
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
        document.body.classList.remove('theme-ronnie', 'theme-tori', 'theme-menu',
                                       'theme-trueEnding', 'theme-digitalForever', 'theme-badEnding');
        document.body.classList.add(`theme-${themeName}`);

        this.currentTheme = themeName;
        Logger.ui(`🎨 Theme applied: ${theme.name} ${theme.emoji}`);
    }

    // ========================================
    // THEME ACCESSORS
    // V1 Parity: lines 294-336
    // ========================================

    /**
     * Get current theme name
     */
    public getCurrentTheme(): ThemeName {
        return this.currentTheme;
    }

    /**
     * Get theme colors object
     * V1 Parity: Optional themeName parameter, defaults to current
     */
    public getTheme(themeName?: ThemeName): Theme {
        const name = themeName || this.currentTheme;
        return THEMES[name] || THEMES.menu;
    }

    /**
     * Get a specific color from current theme
     * V1 Parity: e.g. 'primary', 'glow', 'text'
     */
    public getColor(colorName: keyof Theme): string {
        const theme = this.getTheme();
        return theme[colorName] as string || theme.primary;
    }

    /**
     * Check if currently in Tori's theme
     */
    public isToriTheme(): boolean {
        return this.currentTheme === 'tori';
    }

    /**
     * Check if currently in Ronnie's theme
     */
    public isRonnieTheme(): boolean {
        return this.currentTheme === 'ronnie';
    }

    // ========================================
    // SETTINGS UI OPTIONS
    // V1 Parity: lines 338-348
    // ========================================

    /**
     * Get settings UI options for theme preference
     */
    public getSettingsOptions(): Array<{ value: string; label: string; description: string }> {
        return [
            { value: 'auto', label: 'AUTO (Follow Route)', description: 'Theme changes with current route' },
            { value: 'ronnie', label: 'RONNIE 💙', description: 'Always use cyan/blue theme' },
            { value: 'tori', label: 'TORI 🖤', description: 'Always use pink/magenta theme' }
        ];
    }

    // ========================================
    // STATIC CONSTANTS ACCESS
    // ========================================

    /**
     * Get available themes
     */
    public getThemes(): Record<ThemeName, Theme> {
        return THEMES;
    }

    /**
     * Get available modes
     */
    public getModes(): Record<string, ThemeMode> {
        return MODES;
    }
}
