/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 UNIVERSAL STATUS BAR - Type Definitions
 * Shared types for the context-aware status bar system
 * ═══════════════════════════════════════════════════════════════
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
    mode: ThemeMode;
    auto: boolean;
}

export interface ThemeManagerConfig {
    /** Storage key for theme preference */
    storageKey?: string;
    /** Storage key for auto mode preference */
    autoStorageKey?: string;
    /** Default theme if nothing stored */
    defaultTheme?: ThemeMode;
    /** Default auto mode state */
    defaultAuto?: boolean;
    /** Callback when theme changes */
    onThemeChange?: (state: ThemeState) => void;
}

export interface SettingDefinition {
    id: string;
    label: string;
    type: 'toggle' | 'slider' | 'select';
    defaultValue: string | number | boolean;
    /** For sliders */
    min?: number;
    max?: number;
    step?: number;
    /** For select */
    options?: { value: string; label: string }[];
}

export interface StatusBarConfig {
    /** Unique app identifier */
    appId: string;
    /** Display name for the app */
    appName: string;
    /** Dynamic breadcrumb - can be string or function returning string */
    breadcrumb?: string | (() => string);
    /** Settings to show in the settings panel */
    settings?: {
        theme?: boolean;
        auto?: boolean;
        custom?: SettingDefinition[];
    };
    /** Custom CSS class for app-specific styling */
    cssClass?: string;
    /** Event handlers */
    onSettingsOpen?: () => void;
    onSettingsClose?: () => void;
}

/** Events emitted by the StatusBar system */
export interface StatusBarEvents {
    'theme:changed': ThemeState;
    'settings:opened': void;
    'settings:closed': void;
    'setting:changed': { id: string; value: string | number | boolean };
}
