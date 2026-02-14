
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

describe('SecretCodesSystem & BootstrapTracker', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let bootstrapTracker: BootstrapTracker;
    let secretCodesSystem: SecretCodesSystem;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager();
        bootstrapTracker = new BootstrapTracker(stateManager);
        secretCodesSystem = new SecretCodesSystem(eventBus, stateManager, bootstrapTracker);

        // Mock localStorage
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
    });

    describe('BootstrapTracker', () => {
        it('should initialize with default timeline', () => {
            const history = bootstrapTracker.getHistory();
            expect(history.currentAttempt).toBe(848);
            expect(history.attempts.length).toBeGreaterThan(0);
            expect(history.attempts[0].endingType).toBe('corrupted');
        });

        it('should record attempts and enforce limit', () => {
            for (let i = 0; i < 10; i++) {
                bootstrapTracker.recordAttempt('failed', 'test', 'ronnie', 'bad');
            }

            const history = bootstrapTracker.getHistory();
            expect(history.attempts.length).toBe(5);
            expect(history.attempts[0].reason).toBe('test');
            expect(history.currentAttempt).toBe(858); // 848 + 10
        });
    });

    describe('SecretCodesSystem', () => {
        it('should handle konami code', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            eventBus.emit('ui:code_submit', { code: 'konami' });

            expect(stateManager.get('game.easterEggs.konami')).toBe(true);
            expect(emitSpy).toHaveBeenCalledWith('easter_egg:konami_controller', {});
            expect(emitSpy).toHaveBeenCalledWith('visual:cue', expect.objectContaining({ type: 'success' }));
        });

        it('should handle invalid codes', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            eventBus.emit('ui:code_submit', { code: 'invalid_code' });

            expect(emitSpy).toHaveBeenCalledWith('ui:denied', {});
        });

        it('should track discovered codes', () => {
            eventBus.emit('ui:code_submit', { code: 'konami' });
            const discovered = secretCodesSystem.getDiscoveredCodes();
            expect(discovered.find(c => c.code === 'konami')).toBeDefined();
        });

        it('should handle dev commands without tracking discovery', () => {
            const originalLocation = window.location;

            const resetSpy = vi.spyOn(bootstrapTracker, 'reset');

            eventBus.emit('ui:code_submit', { code: 'reset848' });

            const discovered = secretCodesSystem.getDiscoveredCodes();
            expect(discovered.find(c => c.code === 'reset848')).toBeUndefined();
            expect(resetSpy).toHaveBeenCalled();

            // Cleanup
            Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
        });
    });
});
