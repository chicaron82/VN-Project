/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 UNIVERSAL STATUS BAR - Theme Manager
 * Single source of truth for theme handling across all apps
 *
 * Usage:
 *   const theme = new ThemeManager();
 *   theme.toggle();  // Switch between light/dark
 *   theme.setAuto(true);  // Sync with OS preference
 *
 * Events:
 *   window.addEventListener('uv7:theme:changed', (e) => {
 *     console.log(e.detail);  // { mode: 'dark', auto: false }
 *   });
 * ═══════════════════════════════════════════════════════════════
 */

import type { ThemeMode, ThemeState, ThemeManagerConfig } from './types';

export class ThemeManager {
    private state: ThemeState;
    private config: Required<ThemeManagerConfig>;

    // DOM elements (optional - for UI binding)
    private toggleElement: HTMLElement | null = null;
    private autoToggleElement: HTMLElement | null = null;
    private manualRowElement: HTMLElement | null = null;

    constructor(config: ThemeManagerConfig = {}) {
        this.config = {
            storageKey: config.storageKey ?? 'uv7-theme',
            autoStorageKey: config.autoStorageKey ?? 'uv7-theme-auto',
            defaultTheme: config.defaultTheme ?? 'dark',
            defaultAuto: config.defaultAuto ?? true,
            onThemeChange: config.onThemeChange ?? (() => {}),
        };

        // Load initial state from storage
        this.state = this.loadState();

        // Apply initial theme
        this.applyTheme();

        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', this.handleStorageChange.bind(this));

        // Listen for postMessage (iframe sync)
        window.addEventListener('message', this.handleMessage.bind(this));

        console.log('🎨 [ThemeManager] Initialized:', this.state);
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    /** Get current theme state */
    getState(): ThemeState {
        return { ...this.state };
    }

    /** Get current theme mode */
    getMode(): ThemeMode {
        return this.state.mode;
    }

    /** Check if auto mode is enabled */
    isAuto(): boolean {
        return this.state.auto;
    }

    /** Toggle between light and dark mode */
    toggle(): void {
        if (this.state.auto) return; // Can't toggle in auto mode

        const newMode: ThemeMode = this.state.mode === 'dark' ? 'light' : 'dark';
        this.setMode(newMode);
    }

    /** Set specific theme mode */
    setMode(mode: ThemeMode): void {
        if (this.state.auto) return; // Can't set mode in auto mode

        this.state.mode = mode;
        this.saveState();
        this.applyTheme();
        this.emitChange();
    }

    /** Enable or disable auto mode (sync with OS) */
    setAuto(auto: boolean): void {
        this.state.auto = auto;

        if (auto) {
            // In auto mode, clear manual classes and let OS preference take over
            document.body.classList.remove('light-mode', 'dark-mode');
        } else {
            // Exiting auto mode - apply the stored preference
            this.applyTheme();
        }

        this.saveState();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle auto mode */
    toggleAuto(): void {
        this.setAuto(!this.state.auto);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI BINDING (Optional - for connecting to toggle switches)
    // ═══════════════════════════════════════════════════════════════

    /** Bind to UI elements for automatic updates */
    bindUI(elements: {
        toggle?: HTMLElement | null;
        autoToggle?: HTMLElement | null;
        manualRow?: HTMLElement | null;
    }): void {
        this.toggleElement = elements.toggle ?? null;
        this.autoToggleElement = elements.autoToggle ?? null;
        this.manualRowElement = elements.manualRow ?? null;

        // Wire up click handlers
        this.toggleElement?.addEventListener('click', () => this.toggle());
        this.autoToggleElement?.addEventListener('click', () => this.toggleAuto());

        // Apply current state to UI
        this.updateUI();
    }

    /** Update UI elements to reflect current state */
    private updateUI(): void {
        if (this.state.auto) {
            // Auto mode ON
            this.autoToggleElement?.classList.add('active');
            if (this.manualRowElement) {
                this.manualRowElement.style.opacity = '0.5';
                this.manualRowElement.style.pointerEvents = 'none';
            }
        } else {
            // Auto mode OFF - manual control enabled
            this.autoToggleElement?.classList.remove('active');
            if (this.manualRowElement) {
                this.manualRowElement.style.opacity = '1';
                this.manualRowElement.style.pointerEvents = 'auto';
            }

            // Update toggle to reflect current mode
            if (this.state.mode === 'dark') {
                this.toggleElement?.classList.add('active');
            } else {
                this.toggleElement?.classList.remove('active');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CORE THEME APPLICATION
    // ═══════════════════════════════════════════════════════════════

    /** Apply current theme to document body */
    private applyTheme(): void {
        if (this.state.auto) {
            // Let OS preference handle it
            document.body.classList.remove('light-mode', 'dark-mode');
        } else {
            // Manual override - apply the stored preference
            // FIXED: Check for 'dark' first, not 'light' (was inverted before)
            if (this.state.mode === 'dark') {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            }
        }

        this.updateUI();
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════════

    /** Load state from localStorage */
    private loadState(): ThemeState {
        try {
            const storedMode = localStorage.getItem(this.config.storageKey);
            const storedAuto = localStorage.getItem(this.config.autoStorageKey);

            return {
                mode: (storedMode as ThemeMode) ?? this.config.defaultTheme,
                auto: storedAuto !== 'false', // Default to true if not set
            };
        } catch {
            return {
                mode: this.config.defaultTheme,
                auto: this.config.defaultAuto,
            };
        }
    }

    /** Save state to localStorage */
    private saveState(): void {
        try {
            localStorage.setItem(this.config.storageKey, this.state.mode);
            localStorage.setItem(this.config.autoStorageKey, this.state.auto ? 'true' : 'false');
        } catch (e) {
            console.warn('[ThemeManager] Could not save to localStorage:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CROSS-CONTEXT SYNC
    // ═══════════════════════════════════════════════════════════════

    /** Handle storage events (cross-tab sync) */
    private handleStorageChange(e: StorageEvent): void {
        if (e.key === this.config.storageKey || e.key === this.config.autoStorageKey) {
            console.log('[ThemeManager] Storage change detected, syncing...');
            this.state = this.loadState();
            this.applyTheme();
            this.emitChange();
        }
    }

    /** Handle postMessage (iframe sync) */
    private handleMessage(e: MessageEvent): void {
        if (e.data?.type === 'theme-change') {
            const { auto, theme } = e.data;
            console.log('[ThemeManager] PostMessage received:', { auto, theme });
            this.state = { mode: theme, auto };
            this.applyTheme();
            this.emitChange();
        }
    }

    /** Emit change event */
    private emitChange(): void {
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('uv7:theme:changed', {
            detail: this.getState()
        }));

        // Call callback
        this.config.onThemeChange(this.getState());
    }

    // ═══════════════════════════════════════════════════════════════
    // TOAST HELPER (Optional)
    // ═══════════════════════════════════════════════════════════════

    /** Show a toast notification (if available) */
    showToast(message: string): void {
        const contentFeatures = (window as any).contentFeatures;
        if (contentFeatures?.showToast) {
            contentFeatures.showToast(message, 2000);
        }
    }
}

// Export singleton for convenience
let _instance: ThemeManager | null = null;

export function getThemeManager(config?: ThemeManagerConfig): ThemeManager {
    if (!_instance) {
        _instance = new ThemeManager(config);
    }
    return _instance;
}
