/**
 * EchoMemorySystem Tests
 *
 * Tests for Belle's Meta-Awareness Feature.
 * "The echoes remember you..."
 *
 * 💫 Hope - triggered by persistence
 * 🌙 Gentle - triggered by hesitation
 * 🖤 Despair - triggered by failure
 *
 * 848 is sacred. 💚🔥💀
 */

import { EchoMemorySystem } from './EchoMemorySystem';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

describe('EchoMemorySystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let echoSystem: EchoMemorySystem;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        eventBus = new EventBus();
        stateManager = new StateManager({});
        echoSystem = new EchoMemorySystem(eventBus, stateManager);
    });

    describe('Initialization', () => {
        it('should start with all echoes dormant (awareness 0)', () => {
            const awareness = echoSystem.getAwarenessLevels();
            expect(awareness.hope).toBe(0);
            expect(awareness.gentle).toBe(0);
            expect(awareness.despair).toBe(0);
        });

        it('should start with 0 total loops', () => {
            const awareness = echoSystem.getAwarenessLevels();
            expect(awareness.totalLoops).toBe(0);
        });

        it('should load persisted memory from localStorage', () => {
            const savedMemory = {
                totalLoops: 5,
                echoAwareness: { hope: 2, gentle: 1, despair: 3 }
            };
            localStorage.setItem('echoMemory', JSON.stringify(savedMemory));

            const newSystem = new EchoMemorySystem(eventBus, stateManager);
            const awareness = newSystem.getAwarenessLevels();

            expect(awareness.totalLoops).toBe(5);
            expect(awareness.hope).toBe(2);
            expect(awareness.gentle).toBe(1);
            expect(awareness.despair).toBe(3);
        });
    });

    describe('Loop Tracking', () => {
        it('should increment total loops on recordLoop()', () => {
            echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().totalLoops).toBe(1);

            echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().totalLoops).toBe(2);
        });

        it('should emit echo:loop_recorded event', () => {
            const callback = vi.fn();
            eventBus.on('echo:loop_recorded', callback);

            echoSystem.recordLoop();

            expect(callback).toHaveBeenCalledWith({
                totalLoops: 1,
                awareness: { hope: 0, gentle: 0, despair: 0 }
            });
        });

        it('should persist to localStorage', () => {
            echoSystem.recordLoop();
            echoSystem.recordLoop();

            const saved = JSON.parse(localStorage.getItem('echoMemory') || '{}');
            expect(saved.totalLoops).toBe(2);
        });
    });

    describe('Awareness Level Progression', () => {
        it('should increase Hope awareness based on loops', () => {
            // 2+ loops → level 1
            echoSystem.recordLoop();
            echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().hope).toBe(1);

            // 5+ loops → level 2
            echoSystem.recordLoop();
            echoSystem.recordLoop();
            echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().hope).toBe(2);

            // 10+ loops → level 3
            for (let i = 0; i < 5; i++) echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().hope).toBe(3);

            // 20+ loops → level 4
            for (let i = 0; i < 10; i++) echoSystem.recordLoop();
            expect(echoSystem.getAwarenessLevels().hope).toBe(4);
        });

        it('should increase Despair awareness based on deaths', () => {
            // 2+ deaths → level 1
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene2', 'tether');
            expect(echoSystem.getAwarenessLevels().despair).toBe(1);

            // 4+ deaths → level 2
            echoSystem.recordDeath('scene3', 'despair');
            echoSystem.recordDeath('scene4', 'despair');
            expect(echoSystem.getAwarenessLevels().despair).toBe(2);
        });

        it('should increase Gentle awareness based on long pauses', () => {
            // 3+ hesitations → level 1
            echoSystem.recordLongPause('choice1');
            echoSystem.recordLongPause('choice2');
            echoSystem.recordLongPause('choice3');
            echoSystem.recordLongPause('choice4');
            expect(echoSystem.getAwarenessLevels().gentle).toBe(1);
        });
    });

    describe('Death Tracking', () => {
        it('should track deaths by location', () => {
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene2', 'despair');

            expect(echoSystem.getDeathsAtLocation('scene1')).toBe(2);
            expect(echoSystem.getDeathsAtLocation('scene2')).toBe(1);
            expect(echoSystem.getDeathsAtLocation('scene3')).toBe(0);
        });

        it('should track total deaths', () => {
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene2', 'despair');
            echoSystem.recordDeath('scene3', 'tether');

            expect(echoSystem.getTotalDeaths()).toBe(3);
        });

        it('should trigger despair comment on 3+ deaths at same location', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            // First need to make despair aware (level 1+)
            echoSystem.recordDeath('other1', 'tether');
            echoSystem.recordDeath('other2', 'tether');

            // Now 3 deaths at same location
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene1', 'tether');
            echoSystem.recordDeath('scene1', 'tether');

            // Should have triggered a comment
            const despairCalls = callback.mock.calls.filter(
                (call: any) => call[0].echo === 'despair'
            );
            expect(despairCalls.length).toBeGreaterThan(0);
        });
    });

    describe('Save Scum Detection', () => {
        it('should detect save scumming (save/load within 10s)', () => {
            echoSystem.recordSave();
            echoSystem.recordLoad(); // Immediate load = save scum

            const memory = echoSystem.getMemory();
            expect(memory.saveScumCount).toBe(1);
        });

        it('should trigger Gentle comment every 3rd save scum', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            // First need gentle to be aware
            for (let i = 0; i < 5; i++) echoSystem.recordLoop();

            // 3 save scums
            for (let i = 0; i < 3; i++) {
                echoSystem.recordSave();
                echoSystem.recordLoad();
            }

            const gentleCalls = callback.mock.calls.filter(
                (call: any) => call[0].echo === 'gentle'
            );
            expect(gentleCalls.length).toBeGreaterThan(0);
        });
    });

    describe('Echo Comments', () => {
        it('should not trigger comments when dormant (awareness 0)', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            echoSystem.triggerEchoComment('hope', 'general');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should trigger comments when aware (awareness 1+)', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            // Get Hope to level 1
            echoSystem.recordLoop();
            echoSystem.recordLoop();

            echoSystem.triggerEchoComment('hope', 'general');

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    echo: 'hope',
                    icon: '💫',
                    awareness: 1
                })
            );
        });

        it('should emit comments with correct icons', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            // Set all echoes to aware
            echoSystem.setAwareness('hope', 2);
            echoSystem.setAwareness('gentle', 2);
            echoSystem.setAwareness('despair', 2);

            echoSystem.triggerEchoComment('hope', 'general');
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ icon: '💫' })
            );

            echoSystem.triggerEchoComment('gentle', 'general');
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ icon: '🌙' })
            );

            echoSystem.triggerEchoComment('despair', 'general');
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ icon: '🖤' })
            );
        });
    });

    describe('Conflicting Echoes', () => {
        it('should not trigger if echoes not all aware (level 2+)', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            echoSystem.setAwareness('hope', 2);
            echoSystem.setAwareness('gentle', 1); // Not level 2
            echoSystem.setAwareness('despair', 2);

            echoSystem.triggerConflictingEchoes();

            expect(callback).not.toHaveBeenCalled();
        });

        it('should trigger all three echoes when all aware', async () => {
            vi.useFakeTimers();
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            echoSystem.setAwareness('hope', 2);
            echoSystem.setAwareness('gentle', 2);
            echoSystem.setAwareness('despair', 2);

            echoSystem.triggerConflictingEchoes();

            // Advance through all timeouts
            await vi.advanceTimersByTimeAsync(500);  // Hope
            await vi.advanceTimersByTimeAsync(2500); // Despair
            await vi.advanceTimersByTimeAsync(3000); // Gentle

            expect(callback).toHaveBeenCalledTimes(3);

            vi.useRealTimers();
        });
    });

    describe('Achievement: Remembered', () => {
        it('should unlock when all echoes reach level 2', () => {
            const callback = vi.fn();
            eventBus.on('achievement:unlock', callback);

            echoSystem.setAwareness('hope', 2);
            echoSystem.setAwareness('gentle', 2);
            echoSystem.setAwareness('despair', 1); // Not yet

            echoSystem.triggerEchoComment('despair', 'general');
            expect(callback).not.toHaveBeenCalled();

            echoSystem.setAwareness('despair', 2);
            echoSystem.triggerEchoComment('despair', 'general');

            expect(callback).toHaveBeenCalledWith({ id: 'remembered' });
        });

        it('should only unlock once', () => {
            const callback = vi.fn();
            eventBus.on('achievement:unlock', callback);

            echoSystem.setAwareness('hope', 2);
            echoSystem.setAwareness('gentle', 2);
            echoSystem.setAwareness('despair', 2);

            echoSystem.triggerEchoComment('hope', 'general');
            echoSystem.triggerEchoComment('gentle', 'general');
            echoSystem.triggerEchoComment('despair', 'general');

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('Helper Methods', () => {
        it('isEchoAwake() should check individual echo awareness', () => {
            expect(echoSystem.isEchoAwake('hope')).toBe(false);

            echoSystem.setAwareness('hope', 1);
            expect(echoSystem.isEchoAwake('hope')).toBe(true);
        });

        it('areAllEchoesAwake() should check all echoes', () => {
            expect(echoSystem.areAllEchoesAwake()).toBe(false);

            echoSystem.setAwareness('hope', 1);
            expect(echoSystem.areAllEchoesAwake()).toBe(false);

            echoSystem.setAwareness('gentle', 1);
            echoSystem.setAwareness('despair', 1);
            expect(echoSystem.areAllEchoesAwake()).toBe(true);
        });
    });

    describe('Dev Tools', () => {
        it('reset() should clear all memory', () => {
            echoSystem.recordLoop();
            echoSystem.recordLoop();
            echoSystem.setAwareness('hope', 3);

            echoSystem.resetMemory();

            const awareness = echoSystem.getAwarenessLevels();
            expect(awareness.totalLoops).toBe(0);
            expect(awareness.hope).toBe(0);
            expect(awareness.gentle).toBe(0);
            expect(awareness.despair).toBe(0);
        });

        it('reset() should emit echo:reset event', () => {
            const callback = vi.fn();
            eventBus.on('echo:reset', callback);

            echoSystem.resetMemory();

            expect(callback).toHaveBeenCalledWith({});
        });

        it('setAwareness() should set individual echo levels', () => {
            echoSystem.setAwareness('despair', 4);
            expect(echoSystem.getAwarenessLevels().despair).toBe(4);

            echoSystem.setAwareness('hope', 2);
            expect(echoSystem.getAwarenessLevels().hope).toBe(2);
        });

        it('setLoops() should set total loops and update awareness', () => {
            echoSystem.setLoops(15);

            const awareness = echoSystem.getAwarenessLevels();
            expect(awareness.totalLoops).toBe(15);
            expect(awareness.hope).toBe(3); // 10+ loops = level 3
        });
    });

    describe('Route Completion', () => {
        it('should track route completions', () => {
            echoSystem.recordRouteCompletion('ronnie', 'bad');
            echoSystem.recordRouteCompletion('tori', 'true');
            echoSystem.recordRouteCompletion('ronnie', 'bad');

            const memory = echoSystem.getMemory();
            expect(memory.routeCompletions.ronnie).toBe(2);
            expect(memory.routeCompletions.tori).toBe(1);
        });

        it('should increase Hope awareness on completion', () => {
            echoSystem.recordRouteCompletion('ronnie', 'bad');
            expect(echoSystem.getAwarenessLevels().hope).toBe(1);

            echoSystem.recordRouteCompletion('tori', 'true');
            expect(echoSystem.getAwarenessLevels().hope).toBe(2);
        });
    });

    describe('Notes Viewer Tracking', () => {
        it('should track notes viewer opens', () => {
            echoSystem.recordNotesViewerOpen();
            echoSystem.recordNotesViewerOpen();

            const memory = echoSystem.getMemory();
            expect(memory.notesViewerOpens).toBe(2);
        });

        it('should trigger Hope comment on persistent note hunting', () => {
            const callback = vi.fn();
            eventBus.on('echo:comment', callback);

            // Get hope to aware level
            echoSystem.setAwareness('hope', 2);

            // 10+ opens with every 5th triggering
            for (let i = 0; i < 15; i++) {
                echoSystem.recordNotesViewerOpen();
            }

            const hopeCalls = callback.mock.calls.filter(
                (call: any) => call[0].echo === 'hope'
            );
            expect(hopeCalls.length).toBeGreaterThan(0);
        });
    });

    describe('Choice Tracking', () => {
        it('should track choice history', () => {
            echoSystem.recordChoice('choice1', 0);
            echoSystem.recordChoice('choice1', 1);
            echoSystem.recordChoice('choice2', 2);

            const memory = echoSystem.getMemory();
            expect(memory.choiceHistory['choice1']).toEqual([0, 1]);
            expect(memory.choiceHistory['choice2']).toEqual([2]);
        });

        it('should track wrong choice repeats', () => {
            // Same choice twice in a row = wrong repeat
            echoSystem.recordChoice('choice1', 0);
            echoSystem.recordChoice('choice1', 0);

            const memory = echoSystem.getMemory();
            expect(memory.wrongChoiceRepeats['choice1']).toBe(1);
        });
    });
});
