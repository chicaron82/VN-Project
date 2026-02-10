// ========================================
// SETTINGS MODAL
// Game settings interface
//
// Subsystems (extracted to settings/):
// - SettingsTemplate: 4-tab HTML template creation
// - SettingsEventWiring: Event listener binding via callback interface
// - SettingsPersistence: Save/load/apply settings lifecycle
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { EventBus } from '../../core/EventBus';
import type { SettingsSystem } from '../../systems/SettingsSystem';
import { createSettingsDOM } from './settings/SettingsTemplate';
import { wireSettingsEvents } from './settings/SettingsEventWiring';
import { SettingsPersistence } from './settings/SettingsPersistence';
import { Logger } from '@utils/Logger';

// Type shim for global window object
declare global {
    interface Window {
        secretCodesManager?: {
            updateCodesUI: () => void;
            hasDiscoveredCode: (code: string) => boolean;
        };
    }
}

/**
 * Settings configuration interface
 * NOTE: UV7 intentionally has no audio - uses visual cues + haptics instead
 */
export interface GameSettings {
    // Text & Display
    textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
    fontSize: 'small' | 'medium' | 'large';
    displayMode: 'auto' | 'portrait' | 'landscape';

    // Feedback (no audio - intentional design decision)
    hapticEnabled: boolean;

    // Comfort & Accessibility
    comfortIntensity: number;  // 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
    reduceMotion: boolean;
    highContrast: boolean;
    comfortMode: boolean;  // Disable glitch effects

    // Gameplay
    autoAdvance: boolean;
    autoAdvanceDelay: number;  // 1000-10000ms
    autoSkipPrologue: boolean;

    // UI
    uiTheme: string;
    tetherDifficulty: 'relaxed' | 'normal' | 'intense' | 'insane';
    tutorialHints: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
    textSpeed: 'normal',
    fontSize: 'medium',
    displayMode: 'auto',
    hapticEnabled: 'vibrate' in navigator,
    comfortIntensity: 1,
    reduceMotion: false,
    highContrast: false,
    comfortMode: false,
    autoAdvance: false,
    autoAdvanceDelay: 2000,
    autoSkipPrologue: false,
    uiTheme: 'auto',
    tetherDifficulty: 'normal',
    tutorialHints: true
};

export class SettingsModal {
    private container: HTMLElement;
    private isOpen: boolean = false;
    private currentTab: string = 'general';
    private eventBus: EventBus;
    private settings: GameSettings;
    private persistence: SettingsPersistence;

    constructor(eventBus: EventBus, settingsSystem?: SettingsSystem) {
        this.eventBus = eventBus;
        this.settings = { ...DEFAULT_SETTINGS };

        // Create DOM and wire events
        this.container = createSettingsDOM();
        this.persistence = new SettingsPersistence(eventBus, settingsSystem || null);

        wireSettingsEvents(this.container, {
            close: () => this.close(),
            switchTab: (tab) => this.switchTab(tab),
            setTextSpeed: (speed) => this.setTextSpeed(speed),
            setFontSize: (size) => this.setFontSize(size),
            setDisplayMode: (mode) => this.setDisplayMode(mode),
            setTheme: (theme) => this.setTheme(theme),
            setDifficulty: (d) => this.setDifficulty(d),
            toggleFullscreen: () => this.toggleFullscreen(),
            submitSecretCode: (code) => this.submitSecretCode(code),
            resetToDefaults: () => this.resetToDefaults(),
            onAutoAdvanceToggle: (checked) => {
                this.settings.autoAdvance = checked;
                this.updateToggleStatus('auto-advance-status', checked);
                this.persistence.saveSettingDebounced('autoAdvance', checked);
                const delayRow = this.container.querySelector('#auto-delay-row') as HTMLElement;
                if (delayRow) delayRow.style.display = checked ? 'flex' : 'none';
            },
            onAutoDelayChange: (value) => {
                this.settings.autoAdvanceDelay = value;
                const valueDisplay = this.container.querySelector('#auto-delay-value');
                if (valueDisplay) valueDisplay.textContent = `${(value / 1000).toFixed(1)}s`;
                this.persistence.saveSettingDebounced('autoAdvanceDelay', value);
            },
            onAutoSkipPrologueToggle: (checked) => {
                this.settings.autoSkipPrologue = checked;
                this.updateToggleStatus('auto-skip-prologue-status', checked);
                this.persistence.saveSettingDebounced('autoSkipPrologue', checked);
            },
            onHapticToggle: (checked) => {
                this.settings.hapticEnabled = checked;
                this.persistence.saveSettingDebounced('hapticEnabled', checked);
            },
            onReduceMotionToggle: (checked) => {
                this.settings.reduceMotion = checked;
                this.persistence.saveSettingDebounced('reduceMotion', checked);
                this.persistence.applyReduceMotion(checked);
            },
            onHighContrastToggle: (checked) => {
                this.settings.highContrast = checked;
                this.persistence.saveSettingDebounced('highContrast', checked);
                this.persistence.applyHighContrast(checked);
            },
            onComfortModeToggle: (checked) => {
                this.settings.comfortMode = checked;
                this.persistence.saveSettingDebounced('comfortMode', checked);
                this.persistence.applyComfortMode(checked);
            },
            onComfortIntensityChange: (value) => {
                this.settings.comfortIntensity = value;
                this.persistence.updateIntensityLabel(this.container, value);
                this.persistence.saveSettingDebounced('comfortIntensity', value);
            },
            onTutorialHintsToggle: (checked) => {
                this.settings.tutorialHints = checked;
                this.updateToggleStatus('tutorial-hints-status', checked);
                this.persistence.saveSettingDebounced('tutorialHints', checked);
            },
            onResetTutorials: () => {
                localStorage.removeItem('carouselTutorialDismissed');
                this.persistence.saveSettingDebounced('tutorialsReset', true);
            }
        });

        // Load saved settings
        this.settings = this.persistence.loadSettings(DEFAULT_SETTINGS);
        this.persistence.applySettingsToUI(this.container, this.settings);
        this.persistence.applyAllSettings(this.settings);

        // Listen for open/close events
        this.eventBus.on('settings:open', () => this.open());
        this.eventBus.on('settings:close', () => {
            if (this.isOpen) this.close(false);
        });
    }

    // ========================================
    // SETTERS
    // ========================================

    private switchTab(tabName: string): void {
        this.currentTab = tabName;
        this.container.querySelectorAll('.settings-tab-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.tab === tabName);
        });
        this.container.querySelectorAll('.tab-panel').forEach(panel => {
            const el = panel as HTMLElement;
            el.classList.toggle('active', el.id === `tab-${tabName}`);
        });
    }

    private setTextSpeed(speed: GameSettings['textSpeed']): void {
        this.settings.textSpeed = speed;
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.speed === speed);
        });
        this.persistence.saveSettingDebounced('textSpeed', speed);
    }

    private setFontSize(size: GameSettings['fontSize']): void {
        this.settings.fontSize = size;
        this.container.querySelectorAll('.font-size-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.size === size);
        });
        this.persistence.saveSettingDebounced('fontSize', size);
        this.persistence.applyFontSize(size);
    }

    private setDisplayMode(mode: GameSettings['displayMode']): void {
        this.settings.displayMode = mode;
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.mode === mode);
        });
        this.persistence.saveSettingDebounced('displayMode', mode);
        this.persistence.applyDisplayMode(mode);
    }

    private setTheme(theme: string): void {
        this.settings.uiTheme = theme;
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.theme === theme);
        });
        this.persistence.saveSettingDebounced('uiTheme', theme);
    }

    private setDifficulty(difficulty: GameSettings['tetherDifficulty']): void {
        const insaneLocked = localStorage.getItem('insaneModeUnlocked') !== 'true';
        if (difficulty === 'insane' && insaneLocked) return;

        this.settings.tetherDifficulty = difficulty;
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.difficulty === difficulty);
        });
        this.persistence.saveSettingDebounced('tetherDifficulty', difficulty);
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                Logger.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    private submitSecretCode(code: string): void {
        this.eventBus.emit('secret_code:submit', { code });
        const indicator = this.container.querySelector('#code-success-indicator') as HTMLElement;
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => { indicator.style.display = 'none'; }, 2000);
        }
    }

    private updateToggleStatus(elementId: string, checked: boolean): void {
        const el = this.container.querySelector(`#${elementId}`);
        if (el) el.textContent = checked ? 'ON' : 'OFF';
    }

    private resetToDefaults(): void {
        this.settings = this.persistence.resetToDefaults(DEFAULT_SETTINGS);
        this.persistence.applySettingsToUI(this.container, this.settings);
        this.persistence.applyAllSettings(this.settings);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    public open(): void {
        this.isOpen = true;
        this.container.style.display = 'flex';

        // Re-load settings in case they changed externally
        this.settings = this.persistence.loadSettings(DEFAULT_SETTINGS);
        this.persistence.applySettingsToUI(this.container, this.settings);
        this.persistence.applyAllSettings(this.settings);

        if (window.secretCodesManager) {
            window.secretCodesManager.updateCodesUI();
        }

        Logger.debug('Settings opened. Active tab:', this.currentTab);
    }

    public close(emitEvent: boolean = true): void {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.container.style.display = 'none';

        if (emitEvent) {
            this.eventBus.emit('settings:close', {});
        }
    }

    public getSettings(): GameSettings {
        return { ...this.settings };
    }

    public getSetting<K extends keyof GameSettings>(key: K): GameSettings[K] {
        return this.settings[key];
    }

    public isModalOpen(): boolean {
        return this.isOpen;
    }
}
