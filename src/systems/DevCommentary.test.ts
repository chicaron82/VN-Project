
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

describe('DevCommentarySystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let devCommentarySystem: DevCommentarySystem;
    let bootstrapTracker: BootstrapTracker;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager();
        devCommentarySystem = new DevCommentarySystem(eventBus, stateManager);
        bootstrapTracker = new BootstrapTracker(stateManager);
        // We initialize SecretCodesSystem to ensure integrations, but don't need the instance for these tests
        new SecretCodesSystem(eventBus, stateManager, bootstrapTracker, devCommentarySystem);

        // Mock localStorage
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
    });

    it('should be locked by default', () => {
        expect(devCommentarySystem.isCommentaryUnlocked()).toBe(false);
    });

    it('should unlock via unlockCommentary()', () => {
        const spy = vi.spyOn(Storage.prototype, 'setItem');
        devCommentarySystem.unlockCommentary();
        expect(spy).toHaveBeenCalledWith('devCommentaryUnlocked', 'true');
        expect(stateManager.get('settings.devCommentaryUnlocked')).toBe(true);
    });

    it('should check for commentary on scene load', () => {
        // Unlock first
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => key === 'devCommentaryUnlocked' ? 'true' : null);

        const emitSpy = vi.spyOn(eventBus, 'emit');

        // Simulate scene load for a scene that matches a key
        // 'prologue_street_bump' mapped from 'prologue' in partial match logic
        eventBus.emit('scene:load', { sceneId: 'prologueScene4' });

        expect(emitSpy).toHaveBeenCalledWith('visual:cue', expect.objectContaining({ type: 'commentary_available' }));
    });

    it('should unlock via secret code', () => {
        const unlockSpy = vi.spyOn(devCommentarySystem, 'unlockCommentary');

        eventBus.emit('ui:code_submit', { code: 'chicharon' });

        expect(unlockSpy).toHaveBeenCalled();
    });
});
