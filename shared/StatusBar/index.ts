/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 UNIVERSAL STATUS BAR
 * One status bar to rule them all - VN, Showcase, Landing, and beyond
 *
 * Usage:
 *   import { StatusBar } from '../shared/StatusBar';
 *
 *   const statusBar = new StatusBar({
 *     appId: 'showcase',
 *     appName: 'UV7 Showcase',
 *     settings: { theme: true, auto: true }
 *   });
 *
 * The StatusBar adapts to whichever app it's in, providing:
 * - Unified theme controls (dark/light/auto)
 * - App-specific settings
 * - Breadcrumb navigation
 * - Cross-app state persistence
 *
 * "One edit, everywhere updated." - The UV7 Way
 * ═══════════════════════════════════════════════════════════════
 */

// Re-export everything
export * from './types';
export * from './ThemeManager';

import { ThemeManager, getThemeManager } from './ThemeManager';
import type { StatusBarConfig, ThemeState } from './types';

export class StatusBar {
    private config: StatusBarConfig;
    private themeManager: ThemeManager;

    constructor(config: StatusBarConfig) {
        this.config = config;

        // Initialize theme manager (singleton - shared across all instances)
        this.themeManager = getThemeManager({
            onThemeChange: (state) => this.handleThemeChange(state)
        });

        console.log(`📊 [StatusBar] Initialized for app: ${config.appId}`);
    }

    // ═══════════════════════════════════════════════════════════════
    // THEME CONTROLS (Delegated to ThemeManager)
    // ═══════════════════════════════════════════════════════════════

    /** Get the theme manager instance */
    getThemeManager(): ThemeManager {
        return this.themeManager;
    }

    /** Bind theme UI elements */
    bindThemeUI(elements: {
        toggle?: HTMLElement | null;
        autoToggle?: HTMLElement | null;
        manualRow?: HTMLElement | null;
    }): void {
        this.themeManager.bindUI(elements);
    }

    /** Handle theme changes */
    private handleThemeChange(state: ThemeState): void {
        console.log(`[StatusBar:${this.config.appId}] Theme changed:`, state);

        // Show toast
        if (!state.auto) {
            const icon = state.mode === 'dark' ? '🌙' : '☀️';
            this.themeManager.showToast(`${icon} ${state.mode === 'dark' ? 'Dark' : 'Light'} Mode`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BREADCRUMB
    // ═══════════════════════════════════════════════════════════════

    /** Get current breadcrumb text */
    getBreadcrumb(): string {
        if (!this.config.breadcrumb) return this.config.appName;

        if (typeof this.config.breadcrumb === 'function') {
            return this.config.breadcrumb();
        }

        return this.config.breadcrumb;
    }

    /** Update breadcrumb (for dynamic apps) */
    setBreadcrumb(breadcrumb: string | (() => string)): void {
        this.config.breadcrumb = breadcrumb;
    }

    // ═══════════════════════════════════════════════════════════════
    // APP INFO
    // ═══════════════════════════════════════════════════════════════

    /** Get app ID */
    getAppId(): string {
        return this.config.appId;
    }

    /** Get app name */
    getAppName(): string {
        return this.config.appName;
    }

    /** Get full config */
    getConfig(): StatusBarConfig {
        return { ...this.config };
    }
}

// ═══════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════

/** Get or create the singleton ThemeManager */
export { getThemeManager };

/** Quick theme toggle for any context */
export function toggleTheme(): void {
    getThemeManager().toggle();
}

/** Quick auto mode toggle */
export function toggleAutoTheme(): void {
    getThemeManager().toggleAuto();
}
