import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AchievementManager } from '../system/achievement-manager.js';

describe('AchievementManager', () => {
    let achievementManager;
    let mockGame;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Mock game object
        mockGame = {
            collectiblesManager: {
                collectedNotes: {
                    z: [],
                    cz: [],
                    zr: []
                }
            },
            settingsManager: {
                settings: {
                    tetherDifficulty: 'normal'
                }
            },
            triggerSensoryFeedback: vi.fn()
        };

        achievementManager = new AchievementManager(mockGame);
    });

    // ========================================
    // ACHIEVEMENT UNLOCKING
    // ========================================

    describe('Achievement Unlocking', () => {
        it('should unlock achievement and set timestamp', () => {
            const before = Date.now();
            achievementManager.unlock('speed_runner');
            const after = Date.now();

            const achievement = achievementManager.achievements.speed_runner;
            expect(achievement.unlocked).toBe(true);
            expect(achievement.unlockedAt).toBeGreaterThanOrEqual(before);
            expect(achievement.unlockedAt).toBeLessThanOrEqual(after);
        });

        it('should not unlock same achievement twice', () => {
            achievementManager.unlock('speed_runner');
            const firstTimestamp = achievementManager.achievements.speed_runner.unlockedAt;

            // Try to unlock again
            achievementManager.unlock('speed_runner');
            const secondTimestamp = achievementManager.achievements.speed_runner.unlockedAt;

            expect(firstTimestamp).toBe(secondTimestamp);
        });

        it('should save to localStorage on unlock', () => {
            achievementManager.unlock('archivist');

            const saved = JSON.parse(localStorage.getItem('vn_achievements'));
            expect(saved.archivist.unlocked).toBe(true);
            expect(saved.archivist.unlockedAt).toBeDefined();
        });

        it('should trigger sensory feedback on unlock', () => {
            achievementManager.unlock('pet_parent');

            expect(mockGame.triggerSensoryFeedback).toHaveBeenCalledWith(
                'achievement',
                null,
                'Achievement unlocked!'
            );
        });
    });

    // ========================================
    // SPEED RUNNER ACHIEVEMENT
    // ========================================

    describe('Speed Runner Achievement', () => {
        it('should unlock if route completed in < 30 minutes', () => {
            const thirtyMinutesAgo = Date.now() - (29 * 60 * 1000); // 29 minutes
            achievementManager.stats.routeStartTime = thirtyMinutesAgo;

            achievementManager.checkSpeedRunner();

            expect(achievementManager.achievements.speed_runner.unlocked).toBe(true);
        });

        it('should not unlock if route took > 30 minutes', () => {
            const thirtyOneMinutesAgo = Date.now() - (31 * 60 * 1000); // 31 minutes
            achievementManager.stats.routeStartTime = thirtyOneMinutesAgo;

            achievementManager.checkSpeedRunner();

            expect(achievementManager.achievements.speed_runner.unlocked).toBe(false);
        });
    });

    // ========================================
    // ARCHIVIST ACHIEVEMENT
    // ========================================

    describe('Archivist Achievement', () => {
        it('should unlock when 13+ Tori notes collected', () => {
            // Simulate collecting 13 notes
            mockGame.collectiblesManager.collectedNotes.z = ['z1', 'z2', 'z3', 'z4', 'z5'];
            mockGame.collectiblesManager.collectedNotes.cz = ['cz1', 'cz2', 'cz3', 'cz4'];
            mockGame.collectiblesManager.collectedNotes.zr = ['zr1', 'zr2', 'zr3', 'zr4'];

            achievementManager.checkArchivist();

            expect(achievementManager.achievements.archivist.unlocked).toBe(true);
        });

        it('should not unlock with fewer than 13 notes', () => {
            mockGame.collectiblesManager.collectedNotes.z = ['z1', 'z2'];
            mockGame.collectiblesManager.collectedNotes.cz = ['cz1'];
            mockGame.collectiblesManager.collectedNotes.zr = [];

            achievementManager.checkArchivist();

            expect(achievementManager.achievements.archivist.unlocked).toBe(false);
        });
    });

    // ========================================
    // ENDING ACHIEVEMENTS
    // ========================================

    describe('Ending Achievements', () => {
        it('should unlock Time Traveler on first ending', () => {
            achievementManager.checkTimeTravel('bad_ending');

            expect(achievementManager.achievements.time_traveler.unlocked).toBe(true);
            expect(achievementManager.stats.endingsReached).toContain('bad_ending');
        });

        it('should unlock Heartbreaker on bad ending', () => {
            achievementManager.checkTimeTravel('bad_ending');

            expect(achievementManager.achievements.heartbreaker.unlocked).toBe(true);
        });

        it('should unlock True Ending on true ending', () => {
            achievementManager.checkTimeTravel('true_ending');

            expect(achievementManager.achievements.true_ending.unlocked).toBe(true);
        });

        it('should unlock Completionist when all endings reached', () => {
            achievementManager.checkTimeTravel('bad_ending');
            achievementManager.checkTimeTravel('digital_ending');
            achievementManager.checkTimeTravel('true_ending');

            expect(achievementManager.achievements.completionist.unlocked).toBe(true);
        });

        it('should not unlock Completionist with only 2 endings', () => {
            achievementManager.checkTimeTravel('bad_ending');
            achievementManager.checkTimeTravel('digital_ending');

            expect(achievementManager.achievements.completionist.unlocked).toBe(false);
        });
    });

    // ========================================
    // EXPLORER ACHIEVEMENT
    // ========================================

    describe('Explorer Achievement', () => {
        it('should unlock after 100+ backlog views', () => {
            // Simulate 100 backlog views
            for (let i = 0; i < 100; i++) {
                achievementManager.checkExplorer();
            }

            expect(achievementManager.achievements.explorer.unlocked).toBe(true);
            expect(achievementManager.stats.backlogViews).toBe(100);
        });

        it('should not unlock with fewer than 100 views', () => {
            for (let i = 0; i < 50; i++) {
                achievementManager.checkExplorer();
            }

            expect(achievementManager.achievements.explorer.unlocked).toBe(false);
        });
    });

    // ========================================
    // PET PARENT ACHIEVEMENT
    // ========================================

    describe('Pet Parent Achievement', () => {
        it('should unlock when torigatchiUnlocked flag is true', () => {
            localStorage.setItem('torigatchiUnlocked', 'true');

            achievementManager.checkPetParent();

            expect(achievementManager.achievements.pet_parent.unlocked).toBe(true);
        });

        it('should not unlock when flag is false', () => {
            localStorage.setItem('torigatchiUnlocked', 'false');

            achievementManager.checkPetParent();

            expect(achievementManager.achievements.pet_parent.unlocked).toBe(false);
        });
    });

    // ========================================
    // INSANE MODE ACHIEVEMENT
    // ========================================

    describe('Insane Mode Achievement', () => {
        it('should unlock when completing on insane difficulty', () => {
            mockGame.settingsManager.settings.tetherDifficulty = 'insane';

            achievementManager.checkInsane();

            expect(achievementManager.achievements.insane.unlocked).toBe(true);
        });

        it('should not unlock on normal difficulty', () => {
            mockGame.settingsManager.settings.tetherDifficulty = 'normal';

            achievementManager.checkInsane();

            expect(achievementManager.achievements.insane.unlocked).toBe(false);
        });
    });

    // ========================================
    // STATS TRACKING
    // ========================================

    describe('Stats Tracking', () => {
        it('should track route start time', () => {
            const before = Date.now();
            achievementManager.startRouteTimer();
            const after = Date.now();

            expect(achievementManager.stats.routeStartTime).toBeGreaterThanOrEqual(before);
            expect(achievementManager.stats.routeStartTime).toBeLessThanOrEqual(after);
        });

        it('should track endings reached', () => {
            achievementManager.checkTimeTravel('bad_ending');
            achievementManager.checkTimeTravel('true_ending');

            expect(achievementManager.stats.endingsReached).toEqual(['bad_ending', 'true_ending']);
        });

        it('should not duplicate endings in stats', () => {
            achievementManager.checkTimeTravel('bad_ending');
            achievementManager.checkTimeTravel('bad_ending'); // Same ending again

            expect(achievementManager.stats.endingsReached).toEqual(['bad_ending']);
        });

        it('should persist stats to localStorage', () => {
            achievementManager.stats.backlogViews = 50;
            achievementManager.saveStats();

            const saved = JSON.parse(localStorage.getItem('vn_achievement_stats'));
            expect(saved.backlogViews).toBe(50);
        });
    });

    // ========================================
    // UTILITY METHODS
    // ========================================

    describe('Utility Methods', () => {
        it('should return total unlocked count', () => {
            achievementManager.unlock('speed_runner');
            achievementManager.unlock('archivist');

            expect(achievementManager.getTotalUnlocked()).toBe(2);
        });

        it('should return total achievements count', () => {
            const total = achievementManager.getTotalAchievements();

            expect(total).toBe(12); // Total number of achievements defined
        });
    });

    // ========================================
    // PERSISTENCE
    // ========================================

    describe('Persistence', () => {
        it('should load achievements from localStorage', () => {
            const savedAchievements = {
                speed_runner: {
                    id: 'speed_runner',
                    unlocked: true,
                    unlockedAt: Date.now()
                }
            };

            localStorage.setItem('vn_achievements', JSON.stringify(savedAchievements));

            const newManager = new AchievementManager(mockGame);

            expect(newManager.achievements.speed_runner.unlocked).toBe(true);
        });

        it('should load stats from localStorage', () => {
            const savedStats = {
                routeStartTime: 12345,
                backlogViews: 75,
                endingsReached: ['bad_ending']
            };

            localStorage.setItem('vn_achievement_stats', JSON.stringify(savedStats));

            const newManager = new AchievementManager(mockGame);

            expect(newManager.stats.backlogViews).toBe(75);
            expect(newManager.stats.endingsReached).toEqual(['bad_ending']);
        });

        it('should handle corrupted localStorage gracefully', () => {
            localStorage.setItem('vn_achievements', 'invalid json');

            expect(() => new AchievementManager(mockGame)).not.toThrow();
        });
    });
});
