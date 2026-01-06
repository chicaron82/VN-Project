import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EchoMemorySystem } from '../system/echo-memory-system.js';

describe('EchoMemorySystem', () => {
    let echoSystem;
    let mockGame;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Mock game object
        mockGame = {
            achievementManager: {
                unlock: vi.fn()
            },
            statusNotification: {
                show: vi.fn()
            }
        };

        echoSystem = new EchoMemorySystem(mockGame);
    });

    // ========================================
    // INITIALIZATION & PERSISTENCE
    // ========================================

    describe('Initialization & Persistence', () => {
        it('should initialize with default memory state', () => {
            expect(echoSystem.memory.totalLoops).toBe(0);
            expect(echoSystem.memory.echoAwareness.hope).toBe(0);
            expect(echoSystem.memory.echoAwareness.gentle).toBe(0);
            expect(echoSystem.memory.echoAwareness.despair).toBe(0);
            expect(echoSystem.memory.tetherDeaths).toBe(0);
            expect(echoSystem.memory.despairDeaths).toBe(0);
        });

        it('should load memory from localStorage', () => {
            const savedMemory = {
                totalLoops: 5,
                echoAwareness: {
                    hope: 2,
                    gentle: 1,
                    despair: 3
                },
                tetherDeaths: 10,
                deathLocations: { 'scene1': 3 }
            };

            localStorage.setItem('echoMemory', JSON.stringify(savedMemory));

            const newSystem = new EchoMemorySystem(mockGame);

            expect(newSystem.memory.totalLoops).toBe(5);
            expect(newSystem.memory.echoAwareness.hope).toBe(2);
            expect(newSystem.memory.echoAwareness.gentle).toBe(1);
            expect(newSystem.memory.echoAwareness.despair).toBe(3);
            expect(newSystem.memory.tetherDeaths).toBe(10);
        });

        it('should save memory to localStorage', () => {
            echoSystem.memory.totalLoops = 3;
            echoSystem.memory.echoAwareness.hope = 1;
            echoSystem.saveMemory();

            const saved = JSON.parse(localStorage.getItem('echoMemory'));
            expect(saved.totalLoops).toBe(3);
            expect(saved.echoAwareness.hope).toBe(1);
        });
    });

    // ========================================
    // LOOP TRACKING
    // ========================================

    describe('Loop Tracking', () => {
        it('should increment totalLoops on recordLoop()', () => {
            const initialLoops = echoSystem.memory.totalLoops;
            echoSystem.recordLoop();
            expect(echoSystem.memory.totalLoops).toBe(initialLoops + 1);
        });

        it('should update awareness levels based on loop count', () => {
            // Simulate 5 loops (should trigger level 2 awareness)
            for (let i = 0; i < 5; i++) {
                echoSystem.recordLoop();
            }

            echoSystem.updateAwarenessLevels();

            // At least one echo should have awareness level >= 1
            const totalAwareness = echoSystem.memory.echoAwareness.hope +
                echoSystem.memory.echoAwareness.gentle +
                echoSystem.memory.echoAwareness.despair;

            expect(totalAwareness).toBeGreaterThan(0);
        });

        it('should record route completions', () => {
            echoSystem.recordRouteCompletion('tori');
            expect(echoSystem.memory.routeCompletions.tori).toBe(1);

            echoSystem.recordRouteCompletion('ronnie');
            expect(echoSystem.memory.routeCompletions.ronnie).toBe(1);
        });
    });

    // ========================================
    // DEATH TRACKING
    // ========================================

    describe('Death Tracking', () => {
        it('should record death locations', () => {
            echoSystem.recordDeath('scene_act1_choice3', 'tether');

            expect(echoSystem.memory.deathLocations['scene_act1_choice3']).toBe(1);
            expect(echoSystem.memory.tetherDeaths).toBe(1);
        });

        it('should increment tetherDeaths counter', () => {
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene2', 'tether');

            expect(echoSystem.memory.tetherDeaths).toBe(2);
        });

        it('should increment despairDeaths counter', () => {
            echoSystem.recordDeath('scene1', 'despair');
            echoSystem.recordDeath('scene2', 'despair');

            expect(echoSystem.memory.despairDeaths).toBe(2);
        });

        it('should trigger despair comment after 3+ deaths at same location', () => {
            // Die 3 times at the same location
            echoSystem.recordDeath('difficult_scene', 'tether');
            echoSystem.recordDeath('difficult_scene', 'tether');
            echoSystem.recordDeath('difficult_scene', 'tether');

            // Update awareness to enable comments
            echoSystem.memory.echoAwareness.despair = 2;

            echoSystem.triggerEchoComment('despair', 'repeatedDeath', 'difficult_scene');

            // Verify statusNotification.show was called
            expect(mockGame.statusNotification.show).toHaveBeenCalled();
            const call = mockGame.statusNotification.show.mock.calls[mockGame.statusNotification.show.mock.calls.length - 1][0];
            expect(call.type).toBe('echo');
            expect(call.message).toContain('Echo:');
        });
    });

    // ========================================
    // BEHAVIOR TRACKING
    // ========================================

    describe('Behavior Tracking', () => {
        it('should detect save scumming (save/load within 10 seconds)', () => {
            const now = Date.now();
            echoSystem.recordSave();

            // Simulate load within 10 seconds
            vi.spyOn(Date, 'now').mockReturnValue(now + 5000);
            echoSystem.recordLoad();

            expect(echoSystem.memory.saveScumCount).toBeGreaterThan(0);

            vi.restoreAllMocks();
        });

        it('should record choice patterns', () => {
            echoSystem.recordChoice('choice1', 0); // Selected option 0
            echoSystem.recordChoice('choice1', 1); // Selected option 1
            echoSystem.recordChoice('choice1', 0); // Selected option 0 again

            expect(echoSystem.memory.choiceHistory['choice1']).toEqual([0, 1, 0]);
        });

        it('should track long pauses at choices', () => {
            echoSystem.recordLongPause('difficult_choice');

            expect(echoSystem.memory.longPausesAtChoices['difficult_choice']).toBe(1);
        });

        it('should track notes viewer opens', () => {
            const initial = echoSystem.memory.notesViewerOpens;
            echoSystem.recordNotesViewerOpen();

            expect(echoSystem.memory.notesViewerOpens).toBe(initial + 1);
        });
    });

    // ========================================
    // ECHO COMMENT SYSTEM
    // ========================================

    describe('Echo Comment System', () => {
        it('should trigger hope comments based on awareness level', () => {
            echoSystem.memory.echoAwareness.hope = 2;

            echoSystem.triggerEchoComment('hope');

            expect(mockGame.statusNotification.show).toHaveBeenCalled();
            const call = mockGame.statusNotification.show.mock.calls[0][0];
            expect(call.type).toBe('echo');
            expect(call.icon).toBe('💫');
        });

        it('should trigger gentle comments based on awareness level', () => {
            echoSystem.memory.echoAwareness.gentle = 2;

            echoSystem.triggerEchoComment('gentle');

            expect(mockGame.statusNotification.show).toHaveBeenCalled();
            const call = mockGame.statusNotification.show.mock.calls[0][0];
            expect(call.icon).toBe('🌙');
        });

        it('should trigger despair comments based on awareness level', () => {
            echoSystem.memory.echoAwareness.despair = 2;

            echoSystem.triggerEchoComment('despair');

            expect(mockGame.statusNotification.show).toHaveBeenCalled();
            const call = mockGame.statusNotification.show.mock.calls[0][0];
            expect(call.icon).toBe('🖤');
        });

        it('should select context-specific comments', () => {
            echoSystem.memory.echoAwareness.despair = 2;
            echoSystem.memory.deathLocations['test_scene'] = 5;

            echoSystem.triggerEchoComment('despair', 'repeatedDeath', 'test_scene');

            expect(mockGame.statusNotification.show).toHaveBeenCalled();
        });

        it('should not trigger comments for dormant echoes (awareness level 0)', () => {
            echoSystem.memory.echoAwareness.hope = 0;

            echoSystem.triggerEchoComment('hope');

            expect(mockGame.statusNotification.show).not.toHaveBeenCalled();
        });
    });

    // ========================================
    // ACHIEVEMENT INTEGRATION
    // ========================================

    describe('Achievement Integration', () => {
        it('should unlock "Remembered" achievement when all echoes reach level 2+', () => {
            echoSystem.memory.echoAwareness.hope = 2;
            echoSystem.memory.echoAwareness.gentle = 2;
            echoSystem.memory.echoAwareness.despair = 2;

            echoSystem.checkRememberedAchievement();

            expect(mockGame.achievementManager.unlock).toHaveBeenCalledWith('remembered');
        });

        it('should not re-trigger achievement if already unlocked', () => {
            echoSystem.memory.triggeredAllEchoes = true;
            echoSystem.memory.echoAwareness.hope = 2;
            echoSystem.memory.echoAwareness.gentle = 2;
            echoSystem.memory.echoAwareness.despair = 2;

            echoSystem.checkRememberedAchievement();

            expect(mockGame.achievementManager.unlock).not.toHaveBeenCalled();
        });
    });

    // ========================================
    // AWARENESS LEVEL PROGRESSION
    // ========================================

    describe('Awareness Level Progression', () => {
        it('should increase hope awareness with persistence (20+ loops)', () => {
            echoSystem.memory.totalLoops = 25;
            echoSystem.updateAwarenessLevels();

            expect(echoSystem.memory.echoAwareness.hope).toBeGreaterThan(0);
        });

        it('should increase gentle awareness with hesitation patterns', () => {
            // Simulate hesitation: long pauses and save scumming
            echoSystem.memory.longPausesAtChoices['choice1'] = 5;
            echoSystem.memory.longPausesAtChoices['choice2'] = 3;
            echoSystem.memory.saveScumCount = 10;
            echoSystem.memory.totalLoops = 10;

            echoSystem.updateAwarenessLevels();

            expect(echoSystem.memory.echoAwareness.gentle).toBeGreaterThan(0);
        });

        it('should increase despair awareness with repeated failures', () => {
            // Simulate failures: many deaths and wrong choices
            echoSystem.memory.tetherDeaths = 15;
            echoSystem.memory.despairDeaths = 5;
            echoSystem.memory.totalLoops = 10;

            echoSystem.updateAwarenessLevels();

            expect(echoSystem.memory.echoAwareness.despair).toBeGreaterThan(0);
        });
    });

    // ========================================
    // MEMORY RESET
    // ========================================

    describe('Memory Reset', () => {
        it('should reset memory to default state', () => {
            echoSystem.memory.totalLoops = 50;
            echoSystem.memory.echoAwareness.hope = 4;
            echoSystem.memory.tetherDeaths = 100;

            echoSystem.resetMemory();

            expect(echoSystem.memory.totalLoops).toBe(0);
            expect(echoSystem.memory.echoAwareness.hope).toBe(0);
            expect(echoSystem.memory.tetherDeaths).toBe(0);
        });

        it('should clear localStorage on reset', () => {
            localStorage.setItem('echoMemory', JSON.stringify({ totalLoops: 10 }));

            echoSystem.resetMemory();

            expect(localStorage.getItem('echoMemory')).toBeNull();
        });
    });
});
