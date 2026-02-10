/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 UNIVERSAL STATUS BAR - Tori Settings Manager
 * Single source of truth for ToriGatchi notification settings
 *
 * Usage:
 *   const tori = new ToriSettingsManager();
 *   tori.setNotifyHunger(true);
 *   tori.setNotifyLonely(false);
 *
 * Events:
 *   window.addEventListener('uv7:tori:changed', (e) => {
 *     Logger.system(e.detail);  // { notifyHunger: true, notifyLonely: false, notifyCritical: true }
 *   });
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export interface ToriSettings {
    notifyHunger: boolean;    // Notify when Tori is hungry
    notifyLonely: boolean;    // Notify when Tori is lonely
    notifyCritical: boolean;  // Show critical alerts only
}

export interface ToriSettingsManagerConfig {
    /** Storage key for tori settings */
    storageKey?: string;
    /** Default settings if nothing stored */
    defaults?: Partial<ToriSettings>;
    /** Callback when settings change */
    onSettingsChange?: (settings: ToriSettings) => void;
}

export class ToriSettingsManager {
    private settings: ToriSettings;
    private config: Required<Omit<ToriSettingsManagerConfig, 'defaults'>> & { defaults: ToriSettings };

    // DOM elements (optional - for UI binding)
    private hungerCheckbox: HTMLInputElement | null = null;
    private lonelyCheckbox: HTMLInputElement | null = null;
    private criticalCheckbox: HTMLInputElement | null = null;

    constructor(config: ToriSettingsManagerConfig = {}) {
        this.config = {
            storageKey: config.storageKey ?? 'uv7-tori-settings',
            defaults: {
                notifyHunger: config.defaults?.notifyHunger ?? true,
                notifyLonely: config.defaults?.notifyLonely ?? true,
                notifyCritical: config.defaults?.notifyCritical ?? true,
            },
            onSettingsChange: config.onSettingsChange ?? (() => {}),
        };

        // Load initial settings from storage
        this.settings = this.loadSettings();

        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', this.handleStorageChange.bind(this));

        Logger.system('🐣 [ToriSettingsManager] Initialized:', this.settings);
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    /** Get current settings */
    getSettings(): ToriSettings {
        return { ...this.settings };
    }

    /** Check if hunger notifications are enabled */
    isNotifyHunger(): boolean {
        return this.settings.notifyHunger;
    }

    /** Check if loneliness notifications are enabled */
    isNotifyLonely(): boolean {
        return this.settings.notifyLonely;
    }

    /** Check if critical-only mode is enabled */
    isNotifyCritical(): boolean {
        return this.settings.notifyCritical;
    }

    /** Enable or disable hunger notifications */
    setNotifyHunger(enabled: boolean): void {
        this.settings.notifyHunger = enabled;
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle hunger notifications */
    toggleNotifyHunger(): void {
        this.setNotifyHunger(!this.settings.notifyHunger);
    }

    /** Enable or disable loneliness notifications */
    setNotifyLonely(enabled: boolean): void {
        this.settings.notifyLonely = enabled;
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle loneliness notifications */
    toggleNotifyLonely(): void {
        this.setNotifyLonely(!this.settings.notifyLonely);
    }

    /** Enable or disable critical-only mode */
    setNotifyCritical(enabled: boolean): void {
        this.settings.notifyCritical = enabled;
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle critical-only mode */
    toggleNotifyCritical(): void {
        this.setNotifyCritical(!this.settings.notifyCritical);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI BINDING (Optional - for connecting to controls)
    // ═══════════════════════════════════════════════════════════════

    /** Bind to checkbox UI elements for automatic updates */
    bindUI(elements: {
        hungerCheckbox?: HTMLInputElement | null;
        lonelyCheckbox?: HTMLInputElement | null;
        criticalCheckbox?: HTMLInputElement | null;
    }): void {
        this.hungerCheckbox = elements.hungerCheckbox ?? null;
        this.lonelyCheckbox = elements.lonelyCheckbox ?? null;
        this.criticalCheckbox = elements.criticalCheckbox ?? null;

        // Wire up change handlers
        this.hungerCheckbox?.addEventListener('change', () => {
            this.setNotifyHunger(this.hungerCheckbox!.checked);
        });
        this.lonelyCheckbox?.addEventListener('change', () => {
            this.setNotifyLonely(this.lonelyCheckbox!.checked);
        });
        this.criticalCheckbox?.addEventListener('change', () => {
            this.setNotifyCritical(this.criticalCheckbox!.checked);
        });

        // Apply current state to UI
        this.updateUI();
    }

    /** Update UI elements to reflect current state */
    private updateUI(): void {
        if (this.hungerCheckbox) {
            this.hungerCheckbox.checked = this.settings.notifyHunger;
        }
        if (this.lonelyCheckbox) {
            this.lonelyCheckbox.checked = this.settings.notifyLonely;
        }
        if (this.criticalCheckbox) {
            this.criticalCheckbox.checked = this.settings.notifyCritical;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════════

    /** Load settings from localStorage */
    private loadSettings(): ToriSettings {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    notifyHunger: parsed.notifyHunger ?? this.config.defaults.notifyHunger,
                    notifyLonely: parsed.notifyLonely ?? this.config.defaults.notifyLonely,
                    notifyCritical: parsed.notifyCritical ?? this.config.defaults.notifyCritical,
                };
            }
        } catch (e) {
            Logger.warn('[ToriSettingsManager] Could not load settings:', e);
        }
        return { ...this.config.defaults };
    }

    /** Save settings to localStorage */
    private saveSettings(): void {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.settings));
        } catch (e) {
            Logger.warn('[ToriSettingsManager] Could not save settings:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CROSS-CONTEXT SYNC
    // ═══════════════════════════════════════════════════════════════

    /** Handle storage events (cross-tab sync) */
    private handleStorageChange(e: StorageEvent): void {
        if (e.key === this.config.storageKey && e.newValue) {
            Logger.system('[ToriSettingsManager] Storage change detected, syncing...');
            try {
                const newSettings = JSON.parse(e.newValue);
                this.settings = {
                    notifyHunger: newSettings.notifyHunger ?? this.settings.notifyHunger,
                    notifyLonely: newSettings.notifyLonely ?? this.settings.notifyLonely,
                    notifyCritical: newSettings.notifyCritical ?? this.settings.notifyCritical,
                };
                this.updateUI();
                this.emitChange();
            } catch (parseError) {
                Logger.warn('[ToriSettingsManager] Could not parse storage event:', parseError);
            }
        }
    }

    /** Emit change event */
    private emitChange(): void {
        // Dispatch new-style custom event
        window.dispatchEvent(new CustomEvent('uv7:tori:changed', {
            detail: this.getSettings()
        }));

        // Also dispatch legacy event for existing components
        window.dispatchEvent(new CustomEvent('uv7:tori-settings-change', {
            detail: this.getSettings()
        }));

        // Call callback
        this.config.onSettingsChange(this.getSettings());
    }
}

// Export singleton for convenience
let _instance: ToriSettingsManager | null = null;

export function getToriSettingsManager(config?: ToriSettingsManagerConfig): ToriSettingsManager {
    if (!_instance) {
        _instance = new ToriSettingsManager(config);
    }
    return _instance;
}
