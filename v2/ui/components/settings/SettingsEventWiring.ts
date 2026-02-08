// ========================================
// SETTINGS EVENT WIRING
// Event listener binding for settings controls
//
// Extracted from SettingsModal.ts (~180 lines -> dedicated module)
//
// Handles:
// - All 15+ event listener bindings for settings controls
// - Delegates to SettingsActions callback interface
// - Close buttons, tab buttons, speed/font/display/theme/difficulty
// - Toggle switches, sliders, secret code input
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { GameSettings } from '../SettingsModal';

/**
 * Callback contract for settings actions.
 * The orchestrator implements this interface.
 */
export interface SettingsActions {
    close(): void;
    switchTab(tab: string): void;
    setTextSpeed(speed: GameSettings['textSpeed']): void;
    setFontSize(size: GameSettings['fontSize']): void;
    setDisplayMode(mode: GameSettings['displayMode']): void;
    setTheme(theme: string): void;
    setDifficulty(difficulty: GameSettings['tetherDifficulty']): void;
    toggleFullscreen(): void;
    submitSecretCode(code: string): void;
    resetToDefaults(): void;
    onAutoAdvanceToggle(checked: boolean): void;
    onAutoDelayChange(value: number): void;
    onAutoSkipPrologueToggle(checked: boolean): void;
    onHapticToggle(checked: boolean): void;
    onReduceMotionToggle(checked: boolean): void;
    onHighContrastToggle(checked: boolean): void;
    onComfortModeToggle(checked: boolean): void;
    onComfortIntensityChange(value: number): void;
    onTutorialHintsToggle(checked: boolean): void;
    onResetTutorials(): void;
}

/**
 * Wire all settings event listeners to the container.
 * Delegates user interactions to the SettingsActions callbacks.
 */
export function wireSettingsEvents(container: HTMLElement, actions: SettingsActions): void {
    // Close buttons
    container.querySelector('#btn-close-settings')?.addEventListener('click', () => actions.close());
    container.querySelector('#btn-settings-back')?.addEventListener('click', () => actions.close());

    // Tabs
    container.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.switchTab(target.dataset.tab || 'general');
        });
    });

    // Text Speed Buttons
    container.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.setTextSpeed(target.dataset.speed as GameSettings['textSpeed'] || 'normal');
        });
    });

    // Font Size Buttons
    container.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.setFontSize(target.dataset.size as GameSettings['fontSize'] || 'medium');
        });
    });

    // Display Mode Buttons
    container.querySelectorAll('.display-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.setDisplayMode(target.dataset.mode as GameSettings['displayMode'] || 'auto');
        });
    });

    // Auto Advance Toggle
    const autoToggle = container.querySelector('#auto-advance-toggle') as HTMLInputElement;
    autoToggle?.addEventListener('change', () => actions.onAutoAdvanceToggle(autoToggle.checked));

    // Auto Delay Slider
    const delaySlider = container.querySelector('#auto-delay-slider') as HTMLInputElement;
    delaySlider?.addEventListener('input', () => actions.onAutoDelayChange(parseInt(delaySlider.value)));

    // Auto Skip Prologue Toggle
    const skipPrologueToggle = container.querySelector('#auto-skip-prologue-toggle') as HTMLInputElement;
    skipPrologueToggle?.addEventListener('change', () => actions.onAutoSkipPrologueToggle(skipPrologueToggle.checked));

    // UI Theme Buttons
    container.querySelectorAll('.theme-pref-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.setTheme(target.dataset.theme || 'auto');
        });
    });

    // Tether Difficulty Buttons
    container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            actions.setDifficulty(target.dataset.difficulty as GameSettings['tetherDifficulty'] || 'normal');
        });
    });

    // Fullscreen Button
    container.querySelector('#settings-fullscreen-btn')?.addEventListener('click', () => actions.toggleFullscreen());

    // Haptic Toggle
    const hapticToggle = container.querySelector('#haptic-toggle') as HTMLInputElement;
    hapticToggle?.addEventListener('change', () => actions.onHapticToggle(hapticToggle.checked));

    // Reduce Motion Toggle
    const reduceMotionToggle = container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
    reduceMotionToggle?.addEventListener('change', () => actions.onReduceMotionToggle(reduceMotionToggle.checked));

    // High Contrast Toggle
    const highContrastToggle = container.querySelector('#high-contrast-toggle') as HTMLInputElement;
    highContrastToggle?.addEventListener('change', () => actions.onHighContrastToggle(highContrastToggle.checked));

    // Comfort Mode Toggle
    const comfortToggle = container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
    comfortToggle?.addEventListener('change', () => actions.onComfortModeToggle(comfortToggle.checked));

    // Comfort Intensity Slider
    const intensitySlider = container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
    intensitySlider?.addEventListener('input', () => actions.onComfortIntensityChange(parseInt(intensitySlider.value)));

    // Tutorial Toggle
    const tutorialToggle = container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
    tutorialToggle?.addEventListener('change', () => actions.onTutorialHintsToggle(tutorialToggle.checked));

    // Reset Tutorials Button
    const resetTutorialsBtn = container.querySelector('#reset-tutorials-btn');
    resetTutorialsBtn?.addEventListener('click', () => {
        actions.onResetTutorials();

        // Visual feedback
        const btn = resetTutorialsBtn as HTMLButtonElement;
        const originalText = btn.textContent;
        btn.textContent = 'RESET!';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });

    // Reset to Default Button
    container.querySelector('#btn-settings-reset')?.addEventListener('click', () => {
        if (confirm('Reset all settings to default?')) {
            actions.resetToDefaults();
        }
    });

    // Secret Code Submit
    const submitCodeBtn = container.querySelector('#submit-code-btn');
    const codeInput = container.querySelector('#secret-code-input') as HTMLInputElement;

    submitCodeBtn?.addEventListener('click', () => {
        if (codeInput && codeInput.value.trim()) {
            actions.submitSecretCode(codeInput.value.trim());
            codeInput.value = '';
        }
    });

    codeInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && codeInput.value.trim()) {
            actions.submitSecretCode(codeInput.value.trim());
            codeInput.value = '';
        }
    });
}
