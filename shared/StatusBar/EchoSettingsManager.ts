/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 UNIVERSAL STATUS BAR - Echo Settings Manager
 * Single source of truth for Echo System settings across all apps
 *
 * Usage:
 *   const echo = new EchoSettingsManager();
 *   echo.setEnabled(true);
 *   echo.setFrequency(15);
 *
 * Events:
 *   window.addEventListener('uv7:echo:changed', (e) => {
 *     console.log(e.detail);  // { enabled: true, frequency: 15, pauseOnHover: true }
 *   });
 * ═══════════════════════════════════════════════════════════════
 */

export interface EchoSettings {
    enabled: boolean;
    frequency: number;      // seconds between echoes
    pauseOnHover: boolean;  // pause when user hovers over content
}

export interface EchoSettingsManagerConfig {
    /** Storage key for echo settings */
    storageKey?: string;
    /** Default settings if nothing stored */
    defaults?: Partial<EchoSettings>;
    /** Callback when settings change */
    onSettingsChange?: (settings: EchoSettings) => void;
}

export class EchoSettingsManager {
    private settings: EchoSettings;
    private config: Required<Omit<EchoSettingsManagerConfig, 'defaults'>> & { defaults: EchoSettings };

    // DOM elements (optional - for UI binding)
    private enabledToggle: HTMLElement | null = null;
    private frequencySlider: HTMLInputElement | null = null;
    private frequencyDisplay: HTMLElement | null = null;
    private hoverToggle: HTMLElement | null = null;

    constructor(config: EchoSettingsManagerConfig = {}) {
        this.config = {
            storageKey: config.storageKey ?? 'uv7-echo-settings',
            defaults: {
                enabled: config.defaults?.enabled ?? true,
                frequency: config.defaults?.frequency ?? 10,
                pauseOnHover: config.defaults?.pauseOnHover ?? true,
            },
            onSettingsChange: config.onSettingsChange ?? (() => {}),
        };

        // Load initial settings from storage
        this.settings = this.loadSettings();

        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', this.handleStorageChange.bind(this));

        console.log('🔊 [EchoSettingsManager] Initialized:', this.settings);
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    /** Get current settings */
    getSettings(): EchoSettings {
        return { ...this.settings };
    }

    /** Check if echo is enabled */
    isEnabled(): boolean {
        return this.settings.enabled;
    }

    /** Get frequency in seconds */
    getFrequency(): number {
        return this.settings.frequency;
    }

    /** Check if pause on hover is enabled */
    isPauseOnHover(): boolean {
        return this.settings.pauseOnHover;
    }

    /** Enable or disable echo */
    setEnabled(enabled: boolean): void {
        this.settings.enabled = enabled;
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle enabled state */
    toggleEnabled(): void {
        this.setEnabled(!this.settings.enabled);
    }

    /** Set frequency (5-20 seconds) */
    setFrequency(frequency: number): void {
        this.settings.frequency = Math.max(5, Math.min(20, frequency));
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Enable or disable pause on hover */
    setPauseOnHover(pause: boolean): void {
        this.settings.pauseOnHover = pause;
        this.saveSettings();
        this.updateUI();
        this.emitChange();
    }

    /** Toggle pause on hover */
    togglePauseOnHover(): void {
        this.setPauseOnHover(!this.settings.pauseOnHover);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI BINDING (Optional - for connecting to controls)
    // ═══════════════════════════════════════════════════════════════

    /** Bind to UI elements for automatic updates */
    bindUI(elements: {
        enabledToggle?: HTMLElement | null;
        frequencySlider?: HTMLInputElement | null;
        frequencyDisplay?: HTMLElement | null;
        hoverToggle?: HTMLElement | null;
    }): void {
        this.enabledToggle = elements.enabledToggle ?? null;
        this.frequencySlider = elements.frequencySlider ?? null;
        this.frequencyDisplay = elements.frequencyDisplay ?? null;
        this.hoverToggle = elements.hoverToggle ?? null;

        // Wire up click/input handlers
        this.enabledToggle?.addEventListener('click', () => this.toggleEnabled());
        this.hoverToggle?.addEventListener('click', () => this.togglePauseOnHover());
        this.frequencySlider?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.setFrequency(value);
        });

        // Apply current state to UI
        this.updateUI();
    }

    /** Bind to checkbox-style elements (for shell which uses checkboxes) */
    bindCheckboxUI(elements: {
        enabledCheckbox?: HTMLInputElement | null;
        frequencySlider?: HTMLInputElement | null;
        frequencyDisplay?: HTMLElement | null;
        hoverCheckbox?: HTMLInputElement | null;
    }): void {
        const enabledCb = elements.enabledCheckbox;
        const hoverCb = elements.hoverCheckbox;
        this.frequencySlider = elements.frequencySlider ?? null;
        this.frequencyDisplay = elements.frequencyDisplay ?? null;

        // Wire up change handlers for checkboxes
        enabledCb?.addEventListener('change', () => {
            this.setEnabled(enabledCb.checked);
        });
        hoverCb?.addEventListener('change', () => {
            this.setPauseOnHover(hoverCb.checked);
        });
        this.frequencySlider?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.setFrequency(value);
        });

        // Apply current state to checkboxes
        if (enabledCb) enabledCb.checked = this.settings.enabled;
        if (hoverCb) hoverCb.checked = this.settings.pauseOnHover;
        if (this.frequencySlider) this.frequencySlider.value = this.settings.frequency.toString();
        if (this.frequencyDisplay) this.frequencyDisplay.textContent = `${this.settings.frequency}s`;
    }

    /** Update UI elements to reflect current state */
    private updateUI(): void {
        // Toggle-style elements (active class)
        if (this.enabledToggle) {
            if (this.settings.enabled) {
                this.enabledToggle.classList.add('active');
            } else {
                this.enabledToggle.classList.remove('active');
            }
        }

        if (this.hoverToggle) {
            if (this.settings.pauseOnHover) {
                this.hoverToggle.classList.add('active');
            } else {
                this.hoverToggle.classList.remove('active');
            }
        }

        // Slider/display
        if (this.frequencySlider) {
            this.frequencySlider.value = this.settings.frequency.toString();
        }
        if (this.frequencyDisplay) {
            this.frequencyDisplay.textContent = `${this.settings.frequency}s`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════════

    /** Load settings from localStorage */
    private loadSettings(): EchoSettings {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    enabled: parsed.enabled ?? this.config.defaults.enabled,
                    frequency: parsed.frequency ?? this.config.defaults.frequency,
                    pauseOnHover: parsed.pauseOnHover ?? this.config.defaults.pauseOnHover,
                };
            }
        } catch (e) {
            console.warn('[EchoSettingsManager] Could not load settings:', e);
        }
        return { ...this.config.defaults };
    }

    /** Save settings to localStorage */
    private saveSettings(): void {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.settings));
        } catch (e) {
            console.warn('[EchoSettingsManager] Could not save settings:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CROSS-CONTEXT SYNC
    // ═══════════════════════════════════════════════════════════════

    /** Handle storage events (cross-tab sync) */
    private handleStorageChange(e: StorageEvent): void {
        if (e.key === this.config.storageKey && e.newValue) {
            console.log('[EchoSettingsManager] Storage change detected, syncing...');
            try {
                const newSettings = JSON.parse(e.newValue);
                this.settings = {
                    enabled: newSettings.enabled ?? this.settings.enabled,
                    frequency: newSettings.frequency ?? this.settings.frequency,
                    pauseOnHover: newSettings.pauseOnHover ?? this.settings.pauseOnHover,
                };
                this.updateUI();
                this.emitChange();
            } catch (e) {
                console.warn('[EchoSettingsManager] Could not parse storage event:', e);
            }
        }
    }

    /** Emit change event */
    private emitChange(): void {
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('uv7:echo:changed', {
            detail: this.getSettings()
        }));

        // Also dispatch storage event for legacy components
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.config.storageKey,
            newValue: JSON.stringify(this.settings)
        }));

        // Call callback
        this.config.onSettingsChange(this.getSettings());
    }
}

// Export singleton for convenience
let _instance: EchoSettingsManager | null = null;

export function getEchoSettingsManager(config?: EchoSettingsManagerConfig): EchoSettingsManager {
    if (!_instance) {
        _instance = new EchoSettingsManager(config);
    }
    return _instance;
}
