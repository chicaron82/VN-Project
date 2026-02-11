// ========================================
// SETTINGS PERSISTENCE
// Save, load, and apply settings
//
// Extracted from SettingsModal.ts (~200 lines -> dedicated module)
//
// Handles:
// - Debounced save to localStorage
// - Dual-write to SettingsSystem when available
// - Load settings from localStorage with defaults fallback
// - Apply settings to UI controls (sync state)
// - Apply settings effects to DOM (font size, display mode, accessibility)
// - Reset to defaults
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { EventBus } from '../../../core/EventBus';
import type { SettingsSystem } from '../../../systems/SettingsSystem';
import { Logger } from '@utils/Logger';
import type { GameSettings } from '../SettingsModal';

/**
 * SettingsPersistence
 *
 * Manages settings load/save lifecycle and applying
 * settings effects to the DOM and game systems.
 */
export class SettingsPersistence {
    private saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private eventBus: EventBus,
        private settingsSystem: SettingsSystem | null
    ) { }

    // ========================================
    // SAVE / LOAD
    // ========================================

    saveSettingDebounced(key: string, value: unknown): void {
        if (this.saveDebounceTimer) {
            clearTimeout(this.saveDebounceTimer);
        }
        this.saveDebounceTimer = setTimeout(() => {
            this.saveSetting(key, value);
        }, 300);
    }

    private saveSetting(key: string, value: unknown): void {
        // Save to localStorage
        const current = JSON.parse(localStorage.getItem('gameSettings') || '{}');
        current[key] = value;
        localStorage.setItem('gameSettings', JSON.stringify(current));

        // Save to SettingsSystem if available
        if (this.settingsSystem && typeof (this.settingsSystem as unknown as { set: Function }).set === 'function') {
            (this.settingsSystem as unknown as { set: (k: string, v: unknown) => void }).set(key, value);
        }

        // Emit settings:changed event
        this.eventBus.emit('settings:changed', { key, value });
    }

    loadSettings(defaults: GameSettings): GameSettings {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaults, ...parsed };
            } catch (e) {
                Logger.error('Failed to parse saved settings:', e);
                return { ...defaults };
            }
        }
        return { ...defaults };
    }

    // ========================================
    // APPLY TO UI
    // ========================================

    applySettingsToUI(container: HTMLElement, settings: GameSettings): void {
        // Text Speed
        container.querySelectorAll('.speed-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.speed === settings.textSpeed);
        });

        // Font Size
        container.querySelectorAll('.font-size-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.size === settings.fontSize);
        });

        // Display Mode
        container.querySelectorAll('.display-mode-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.mode === settings.displayMode);
        });

        // Theme
        container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.theme === settings.uiTheme);
        });

        // Difficulty
        container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.difficulty === settings.tetherDifficulty);
        });

        // Auto Advance
        const autoToggle = container.querySelector('#auto-advance-toggle') as HTMLInputElement;
        if (autoToggle) {
            autoToggle.checked = settings.autoAdvance;
            const statusEl = container.querySelector('#auto-advance-status');
            if (statusEl) statusEl.textContent = settings.autoAdvance ? 'ON' : 'OFF';
            const delayRow = container.querySelector('#auto-delay-row') as HTMLElement;
            if (delayRow) delayRow.style.display = settings.autoAdvance ? 'flex' : 'none';
        }

        // Auto Delay
        const delaySlider = container.querySelector('#auto-delay-slider') as HTMLInputElement;
        if (delaySlider) {
            delaySlider.value = settings.autoAdvanceDelay.toString();
            const valueDisplay = container.querySelector('#auto-delay-value');
            if (valueDisplay) valueDisplay.textContent = `${(settings.autoAdvanceDelay / 1000).toFixed(1)}s`;
        }

        // Toggles
        const hapticToggle = container.querySelector('#haptic-toggle') as HTMLInputElement;
        if (hapticToggle) hapticToggle.checked = settings.hapticEnabled;

        const reduceMotionToggle = container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
        if (reduceMotionToggle) reduceMotionToggle.checked = settings.reduceMotion;

        const highContrastToggle = container.querySelector('#high-contrast-toggle') as HTMLInputElement;
        if (highContrastToggle) highContrastToggle.checked = settings.highContrast;

        const comfortToggle = container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
        if (comfortToggle) comfortToggle.checked = settings.comfortMode;

        // Intensity slider
        const intensitySlider = container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
        if (intensitySlider) {
            intensitySlider.value = settings.comfortIntensity.toString();
            this.updateIntensityLabel(container, settings.comfortIntensity);
        }

        // Tutorial toggle
        const tutorialToggle = container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
        if (tutorialToggle) {
            tutorialToggle.checked = settings.tutorialHints;
            const statusEl = container.querySelector('#tutorial-hints-status');
            if (statusEl) statusEl.textContent = settings.tutorialHints ? 'ON' : 'OFF';
        }
    }

    updateIntensityLabel(container: HTMLElement, value: number): void {
        const labels = ['Gentle', 'Normal', 'Amped', 'INSANE'];
        const colors = ['#00ff88', '#0ff', '#ff00ff', '#ff0000'];
        const labelEl = container.querySelector('#comfort-intensity-label');

        if (labelEl) {
            labelEl.textContent = labels[value] || 'Normal';
            (labelEl as HTMLElement).style.color = colors[value] || '#0ff';
            (labelEl as HTMLElement).style.textShadow = `0 0 10px ${colors[value] || '#0ff'}`;
        }
    }

    // ========================================
    // APPLY TO GAME SYSTEMS
    // ========================================

    applyAllSettings(settings: GameSettings): void {
        this.applyFontSize(settings.fontSize);
        this.applyDisplayMode(settings.displayMode);
        this.applyReduceMotion(settings.reduceMotion);
        this.applyHighContrast(settings.highContrast);
        this.applyComfortMode(settings.comfortMode);
    }

    applyFontSize(size: GameSettings['fontSize']): void {
        const sizeMap = { small: '14px', medium: '16px', large: '20px' };
        document.documentElement.style.setProperty('--dialog-font-size', sizeMap[size] || '16px');
        document.body.setAttribute('data-font-size', size);
    }

    applyDisplayMode(mode: GameSettings['displayMode']): void {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        gameContainer.classList.remove('force-portrait', 'force-landscape');
        if (mode === 'portrait') {
            gameContainer.classList.add('force-portrait');
        } else if (mode === 'landscape') {
            gameContainer.classList.add('force-landscape');
        }
    }

    applyReduceMotion(enabled: boolean): void {
        document.body.setAttribute('data-reduce-motion', enabled ? 'true' : 'false');
        if (enabled) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    applyHighContrast(enabled: boolean): void {
        document.body.setAttribute('data-high-contrast', enabled ? 'true' : 'false');
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    applyComfortMode(enabled: boolean): void {
        document.body.setAttribute('data-comfort-mode', enabled ? 'true' : 'false');

        document.querySelectorAll('.version-glitch').forEach(el => {
            if (enabled) {
                el.classList.add('comfort-mode');
            } else {
                el.classList.remove('comfort-mode');
            }
        });
    }

    resetToDefaults(defaults: GameSettings): GameSettings {
        const settings = { ...defaults };
        localStorage.removeItem('gameSettings');
        localStorage.setItem('gameSettings', JSON.stringify(settings));

        // Emit reset event for each setting
        Object.entries(settings).forEach(([key, value]) => {
            this.eventBus.emit('settings:changed', { key, value });
        });

        return settings;
    }
}
