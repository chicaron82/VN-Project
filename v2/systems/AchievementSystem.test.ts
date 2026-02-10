
import { AchievementSystem } from '@systems/AchievementSystem';
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

describe('AchievementSystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let achievementSystem: AchievementSystem;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager();
        achievementSystem = new AchievementSystem(eventBus, stateManager);

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
    });

    it('should initialize with locked achievements', () => {
        const achievements = achievementSystem.getAchievements();
        expect(achievements.length).toBeGreaterThan(0);
        expect(achievements.every(a => !a.unlocked)).toBe(true);
    });

    it('should unlock achievement and emit event', () => {
        const emitSpy = vi.spyOn(eventBus, 'emit');

        achievementSystem.unlock('speed_runner');

        expect(achievementSystem.isUnlocked('speed_runner')).toBe(true);
        expect(emitSpy).toHaveBeenCalledWith('visual:cue', expect.objectContaining({ type: 'achievement' }));
    });

    it('should not unlock duplicate achievements', () => {
        achievementSystem.unlock('speed_runner');
        const emitSpy = vi.spyOn(eventBus, 'emit');

        achievementSystem.unlock('speed_runner');

        // Should not emit again
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should listen for achievement:unlock event', () => {
        const unlockSpy = vi.spyOn(achievementSystem, 'unlock');

        eventBus.emit('achievement:unlock', { id: 'konami' });

        expect(unlockSpy).toHaveBeenCalledWith('konami');
    });
});
