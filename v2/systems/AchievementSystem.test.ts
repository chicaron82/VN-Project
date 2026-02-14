
import { AchievementSystem } from '@systems/AchievementSystem';
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

describe('AchievementSystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let achievementSystem: AchievementSystem;
    let storage: Record<string, string>;

    beforeEach(() => {
        storage = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => storage[key] ?? null),
            setItem: vi.fn((key: string, val: string) => { storage[key] = val; }),
            removeItem: vi.fn((key: string) => { delete storage[key]; }),
            clear: vi.fn(),
            length: 0,
            key: vi.fn()
        });

        eventBus = new EventBus();
        stateManager = new StateManager();
        achievementSystem = new AchievementSystem(eventBus, stateManager);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    it('should initialize with all achievements locked', () => {
        const achievements = achievementSystem.getAchievements();
        expect(achievements.length).toBe(12);
        expect(achievements.every(a => !a.unlocked)).toBe(true);
    });

    it('should load persisted achievements from localStorage', () => {
        // Pre-seed storage before construction
        storage['uv7_achievements'] = JSON.stringify({
            speed_runner: { unlocked: true, unlockedAt: 1000 }
        });

        const fresh = new AchievementSystem(eventBus, stateManager);
        expect(fresh.isUnlocked('speed_runner')).toBe(true);
    });

    // ========================================
    // UNLOCK MECHANICS
    // ========================================

    it('should unlock achievement and emit visual:cue', () => {
        const emitSpy = vi.spyOn(eventBus, 'emit');
        achievementSystem.unlock('speed_runner');

        expect(achievementSystem.isUnlocked('speed_runner')).toBe(true);
        expect(emitSpy).toHaveBeenCalledWith('visual:cue', expect.objectContaining({ type: 'achievement' }));
    });

    it('should not re-unlock already unlocked achievement', () => {
        achievementSystem.unlock('speed_runner');
        const emitSpy = vi.spyOn(eventBus, 'emit');

        achievementSystem.unlock('speed_runner');
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should ignore unknown achievement IDs', () => {
        expect(() => achievementSystem.unlock('nonexistent_achievement')).not.toThrow();
        expect(achievementSystem.isUnlocked('nonexistent_achievement')).toBe(false);
    });

    it('should persist unlocked achievements to localStorage', () => {
        achievementSystem.unlock('heartbreaker');
        const saved = JSON.parse(storage['uv7_achievements']);
        expect(saved.heartbreaker.unlocked).toBe(true);
        expect(saved.heartbreaker.unlockedAt).toBeGreaterThan(0);
    });

    // ========================================
    // EVENT LISTENERS
    // ========================================

    it('should unlock via achievement:unlock event', () => {
        eventBus.emit('achievement:unlock', { id: 'masochist' });
        expect(achievementSystem.isUnlocked('masochist')).toBe(true);
    });

    it('should check ending achievements via game:ending event', () => {
        const spy = vi.spyOn(achievementSystem, 'checkEndingAchievements');
        eventBus.emit('game:ending', { endingId: 'bad_ending' });
        expect(spy).toHaveBeenCalledWith('bad_ending');
    });

    it('should start route timer via ui:start_game event', () => {
        const spy = vi.spyOn(achievementSystem, 'startRouteTimer');
        eventBus.emit('ui:start_game', { route: 'tori' });
        expect(spy).toHaveBeenCalled();
    });

    it('should check explorer via ui:backlog:toggle event', () => {
        const spy = vi.spyOn(achievementSystem, 'checkExplorer');
        eventBus.emit('ui:backlog:toggle', {});
        expect(spy).toHaveBeenCalled();
    });

    // ========================================
    // SPEED RUNNER
    // ========================================

    it('should unlock speed_runner when route completed in under 30 minutes', () => {
        const now = Date.now();
        vi.spyOn(Date, 'now')
            .mockReturnValueOnce(now)           // startRouteTimer
            .mockReturnValueOnce(now + 1000)    // checkSpeedRunner (1s later)
            .mockReturnValueOnce(now + 1000);   // unlock timestamp

        achievementSystem.startRouteTimer();
        achievementSystem.checkSpeedRunner();

        expect(achievementSystem.isUnlocked('speed_runner')).toBe(true);
    });

    it('should NOT unlock speed_runner when route takes over 30 minutes', () => {
        const now = Date.now();
        const thirtyOneMinutes = 31 * 60 * 1000;
        vi.spyOn(Date, 'now')
            .mockReturnValueOnce(now)                       // startRouteTimer
            .mockReturnValueOnce(now + thirtyOneMinutes);   // checkSpeedRunner

        achievementSystem.startRouteTimer();
        achievementSystem.checkSpeedRunner();

        expect(achievementSystem.isUnlocked('speed_runner')).toBe(false);
    });

    it('should not crash if checkSpeedRunner called without starting timer', () => {
        expect(() => achievementSystem.checkSpeedRunner()).not.toThrow();
        expect(achievementSystem.isUnlocked('speed_runner')).toBe(false);
    });

    // ========================================
    // ARCHIVIST (13 Tori notes)
    // ========================================

    it('should unlock archivist when 13+ Tori notes collected', () => {
        stateManager.set('collectibles', {
            collectedNotes: {
                z: ['z1', 'z2', 'z3', 'z4', 'z5'],
                cz: ['cz1', 'cz2', 'cz3', 'cz4', 'cz5'],
                zr: ['zr1', 'zr2', 'zr3']
            }
        });

        achievementSystem.checkArchivist();
        expect(achievementSystem.isUnlocked('archivist')).toBe(true);
    });

    it('should NOT unlock archivist with fewer than 13 notes', () => {
        stateManager.set('collectibles', {
            collectedNotes: {
                z: ['z1', 'z2'],
                cz: ['cz1'],
                zr: []
            }
        });

        achievementSystem.checkArchivist();
        expect(achievementSystem.isUnlocked('archivist')).toBe(false);
    });

    it('should handle missing collectibles state gracefully', () => {
        expect(() => achievementSystem.checkArchivist()).not.toThrow();
        expect(achievementSystem.isUnlocked('archivist')).toBe(false);
    });

    // ========================================
    // TIME TRAVEL / ENDING MAPPING
    // ========================================

    it('should unlock time_traveler on first ending reached', () => {
        achievementSystem.checkTimeTravel('bad_ending');
        expect(achievementSystem.isUnlocked('time_traveler')).toBe(true);
    });

    it('should unlock heartbreaker for bad_ending', () => {
        achievementSystem.checkTimeTravel('bad_ending');
        expect(achievementSystem.isUnlocked('heartbreaker')).toBe(true);
    });

    it('should unlock true_ending for true_ending', () => {
        achievementSystem.checkTimeTravel('true_ending');
        expect(achievementSystem.isUnlocked('true_ending')).toBe(true);
    });

    it('should unlock completionist when all 3 endings reached', () => {
        achievementSystem.checkTimeTravel('bad_ending');
        expect(achievementSystem.isUnlocked('completionist')).toBe(false);

        achievementSystem.checkTimeTravel('digital_ending');
        expect(achievementSystem.isUnlocked('completionist')).toBe(false);

        achievementSystem.checkTimeTravel('true_ending');
        expect(achievementSystem.isUnlocked('completionist')).toBe(true);
    });

    it('should not double-count same ending', () => {
        achievementSystem.checkTimeTravel('bad_ending');
        achievementSystem.checkTimeTravel('bad_ending');
        // Stats should only have one entry
        const stats = JSON.parse(storage['uv7_achievement_stats']);
        expect(stats.endingsReached).toEqual(['bad_ending']);
    });

    // ========================================
    // EXPLORER (backlog views)
    // ========================================

    it('should unlock explorer after 100 backlog views', () => {
        for (let i = 0; i < 99; i++) {
            achievementSystem.checkExplorer();
        }
        expect(achievementSystem.isUnlocked('explorer')).toBe(false);

        achievementSystem.checkExplorer(); // 100th
        expect(achievementSystem.isUnlocked('explorer')).toBe(true);
    });

    it('should persist backlog view count across instances', () => {
        for (let i = 0; i < 50; i++) {
            achievementSystem.checkExplorer();
        }

        // Create a new instance — should load stats from storage
        const fresh = new AchievementSystem(eventBus, stateManager);
        for (let i = 0; i < 50; i++) {
            fresh.checkExplorer();
        }
        expect(fresh.isUnlocked('explorer')).toBe(true);
    });

    // ========================================
    // PET PARENT
    // ========================================

    it('should unlock pet_parent when torigatchiUnlocked is in localStorage', () => {
        storage['torigatchiUnlocked'] = 'true';
        achievementSystem.checkPetParent();
        expect(achievementSystem.isUnlocked('pet_parent')).toBe(true);
    });

    it('should NOT unlock pet_parent without torigatchi flag', () => {
        achievementSystem.checkPetParent();
        expect(achievementSystem.isUnlocked('pet_parent')).toBe(false);
    });

    // ========================================
    // INSANE MODE
    // ========================================

    it('should unlock insane when difficulty is insane', () => {
        stateManager.set('settings', { tetherDifficulty: 'insane' });
        achievementSystem.checkInsane();
        expect(achievementSystem.isUnlocked('insane')).toBe(true);
    });

    it('should NOT unlock insane on normal difficulty', () => {
        stateManager.set('settings', { tetherDifficulty: 'normal' });
        achievementSystem.checkInsane();
        expect(achievementSystem.isUnlocked('insane')).toBe(false);
    });

    // ========================================
    // COMBINED ENDING CHECK
    // ========================================

    it('should check timeTravel + speedRunner + insane on ending', () => {
        const timeSpy = vi.spyOn(achievementSystem, 'checkTimeTravel');
        const speedSpy = vi.spyOn(achievementSystem, 'checkSpeedRunner');
        const insaneSpy = vi.spyOn(achievementSystem, 'checkInsane');

        achievementSystem.checkEndingAchievements('true_ending');

        expect(timeSpy).toHaveBeenCalledWith('true_ending');
        expect(speedSpy).toHaveBeenCalled();
        expect(insaneSpy).toHaveBeenCalled();
    });

    // ========================================
    // STATS
    // ========================================

    it('should report correct totals', () => {
        expect(achievementSystem.getTotalAchievements()).toBe(12);
        expect(achievementSystem.getTotalUnlocked()).toBe(0);

        achievementSystem.unlock('masochist');
        achievementSystem.unlock('tactical_retreat');
        expect(achievementSystem.getTotalUnlocked()).toBe(2);
    });
});
