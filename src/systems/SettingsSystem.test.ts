import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsSystem } from '@systems/SettingsSystem';
import { StateManager } from '@core/StateManager';

describe('SettingsSystem', () => {
    let stateManager: StateManager;
    let settingsSystem: SettingsSystem;

    beforeEach(() => {
        stateManager = new StateManager();
        settingsSystem = new SettingsSystem(stateManager);

        // Mock localStorage if needed, but the class handles undefined nicely or we can stub it.
        // For now, let's assume the previous mocks from setup are sufficient or re-apply if needed.
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
    });

    it('should persist changes to localStorage', () => {
        settingsSystem.init();
        settingsSystem.set('textSpeed', 50);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'v848_settings',
            expect.stringContaining('"textSpeed":50')
        );
        expect(settingsSystem.get('textSpeed')).toBe(50);
    });

    it('should provide helper methods for HapticSystem', () => {
        settingsSystem.init();
        settingsSystem.set('hapticsEnabled', false);
        expect(settingsSystem.getHapticEnabled()).toBe(false);

        settingsSystem.set('comfortLevel', 2);
        expect(settingsSystem.getComfortIntensity()).toBe(2);
    });
});
