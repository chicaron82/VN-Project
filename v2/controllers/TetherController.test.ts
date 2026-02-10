import { TetherController } from './TetherController';
import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';
import type { HapticSystem } from '@systems/HapticSystem';
import { GameConfig } from '@core/GameConfig';

describe('TetherController', () => {
    let controller: TetherController;
    let stateManager: StateManager;
    let eventBus: EventBus;
    let haptic: HapticSystem;

    beforeEach(() => {
        vi.useFakeTimers();

        stateManager = new StateManager();
        eventBus = new EventBus();
        haptic = { triggerSensory: vi.fn() } as any; // Mock

        // Setup initial state
        stateManager.set('game.tetherLevel', 100);

        controller = new TetherController(stateManager, eventBus, haptic);
    });

    afterEach(() => {
        vi.useRealTimers();
        controller.destroy();
    });

    it('should reduce tether level over time', () => {
        controller.startDecay();

        vi.advanceTimersByTime(GameConfig.TETHER.DECAY_INTERVAL_MS * 2);

        const level = stateManager.get('game.tetherLevel');
        expect(level).toBeLessThan(100);
    });

    it('should trigger haptic warning at critical threshold', () => {
        // Set near threshold
        stateManager.set('game.tetherLevel', 30.1);

        controller.startDecay();

        // Advance enough to cross 30
        vi.advanceTimersByTime(GameConfig.TETHER.DECAY_INTERVAL_MS * 10);

        expect(haptic.triggerSensory).toHaveBeenCalledWith('tetherWarning');
    });

    it('should boost level on Hold On', () => {
        stateManager.set('game.tetherLevel', 50);
        controller.holdOn();

        expect(stateManager.get('game.tetherLevel')).toBe(65); // 50 + 15
        expect(haptic.triggerSensory).toHaveBeenCalled();
    });

    it('should emit death event at 0', () => {
        const deathSpy = vi.fn();
        eventBus.on('tether:death', deathSpy);

        stateManager.set('game.tetherLevel', 0.1);
        controller.startDecay();

        // Force enough decay
        vi.advanceTimersByTime(GameConfig.TETHER.DECAY_INTERVAL_MS * 10);

        expect(deathSpy).toHaveBeenCalled();
    });
});
