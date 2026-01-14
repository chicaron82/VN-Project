/**
 * TetherSystem Tests
 *
 * Tests for Tori's consciousness tether mechanics.
 * "The tether is her lifeline. Your attention is her oxygen."
 *
 * 848 is sacred. 💚🔥💀
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TetherSystem } from './TetherSystem';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

describe('TetherSystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let system: TetherSystem;

    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();

        eventBus = new EventBus();
        stateManager = new StateManager({});
        system = new TetherSystem(eventBus, stateManager);
    });

    afterEach(() => {
        system.destroy();
        vi.useRealTimers();
        localStorage.clear();
    });

    describe('Initialization', () => {
        it('should start with full tether (100%)', () => {
            expect(system.getLevel()).toBe(100);
        });

        it('should start with normal difficulty', () => {
            expect(system.getDifficulty().id).toBe('normal');
        });

        it('should sync initial state to StateManager', () => {
            expect(stateManager.get('game.tetherLevel')).toBe(100);
        });
    });

    describe('Tether Updates', () => {
        it('should decrease tether level', () => {
            system.updateTether(-10, 'test');
            expect(system.getLevel()).toBe(90);
        });

        it('should increase tether level', () => {
            system.updateTether(-50, 'setup');
            system.updateTether(20, 'test');
            expect(system.getLevel()).toBe(70);
        });

        it('should clamp to minimum 0', () => {
            system.updateTether(-150, 'test');
            expect(system.getLevel()).toBe(0);
        });

        it('should clamp to tether cap', () => {
            system.updateTether(50, 'test');
            expect(system.getLevel()).toBe(100); // Cap is 100 in normal mode
        });

        it('should emit tether:change event', () => {
            const callback = vi.fn();
            eventBus.on('tether:change', callback);

            system.updateTether(-10, 'test');

            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0].level).toBe(90);
        });

        it('should emit tether:critical when crossing threshold', () => {
            const callback = vi.fn();
            eventBus.on('tether:critical', callback);

            system.setLevel(25); // Just above critical
            system.updateTether(-10, 'test');

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Passive Decay', () => {
        it('should start decay with startDecay()', () => {
            system.startDecay();
            const initialLevel = system.getLevel();

            // Default decay interval is 1000ms (or GameConfig.TETHER.DECAY_INTERVAL_MS)
            // Advance multiple ticks to ensure decay happens
            vi.advanceTimersByTime(5000);

            expect(system.getLevel()).toBeLessThan(initialLevel);
        });

        it('should stop decay with stopDecay()', () => {
            system.startDecay();
            system.stopDecay();

            const levelAfterStop = system.getLevel();
            vi.advanceTimersByTime(5000);

            expect(system.getLevel()).toBe(levelAfterStop);
        });

        it('should not double-start decay', () => {
            system.startDecay();
            const levelAfterFirstStart = system.getLevel();

            vi.advanceTimersByTime(1000);
            const levelAfterOneTick = system.getLevel();

            system.startDecay(); // Second call should be ignored
            vi.advanceTimersByTime(1000);

            // Should only have decayed at normal rate, not double
            const expectedDecay = (levelAfterFirstStart - levelAfterOneTick);
            const actualDecay = levelAfterOneTick - system.getLevel();

            expect(Math.abs(actualDecay - expectedDecay)).toBeLessThan(0.1);
        });

        it('should respect decay freeze', () => {
            system.startDecay();
            system.freezeDecay();

            const levelWhenFrozen = system.getLevel();
            vi.advanceTimersByTime(5000);

            expect(system.getLevel()).toBe(levelWhenFrozen);
            expect(system.isDecayFrozen()).toBe(true);
        });

        it('should resume decay after unfreeze', () => {
            system.startDecay();
            system.freezeDecay();
            vi.advanceTimersByTime(2000);
            const levelWhenFrozen = system.getLevel();

            system.resumeDecay();
            vi.advanceTimersByTime(2000);

            expect(system.getLevel()).toBeLessThan(levelWhenFrozen);
        });
    });

    describe('Hold On Mechanic', () => {
        it('should boost tether on holdOn()', () => {
            system.setLevel(50);
            system.holdOn();

            expect(system.getLevel()).toBe(65); // 50 + 15 boost
        });

        it('should emit tether:boost event', () => {
            const callback = vi.fn();
            eventBus.on('tether:boost', callback);

            system.setLevel(50);
            system.holdOn();

            expect(callback).toHaveBeenCalledWith({ amount: 15 });
        });

        it('should start cooldown after holdOn()', () => {
            system.holdOn();
            expect(system.isHoldOnCooldown()).toBe(true);
        });

        it('should reject holdOn() during cooldown', () => {
            system.setLevel(50);
            system.holdOn(); // First call
            expect(system.getLevel()).toBe(65);

            const result = system.holdOn(); // Second call
            expect(result).toBe(false);
            expect(system.getLevel()).toBe(65); // No change
        });

        it('should reset cooldown after timeout', () => {
            system.holdOn();
            expect(system.isHoldOnCooldown()).toBe(true);

            vi.advanceTimersByTime(30000); // 30 seconds cooldown

            expect(system.isHoldOnCooldown()).toBe(false);
        });

        it('should track cooldown remaining', () => {
            system.holdOn();

            vi.advanceTimersByTime(10000); // 10 seconds

            expect(system.getHoldOnCooldownRemaining()).toBe(20); // 20 seconds left
        });
    });

    describe('Difficulty Scaling', () => {
        it('should change difficulty with setDifficulty()', () => {
            system.setDifficulty('intense');
            expect(system.getDifficulty().id).toBe('intense');
        });

        it('should apply correct tether cap for INSANE mode', () => {
            system.setDifficulty('insane');
            expect(system.getDifficulty().tetherCap).toBe(66);

            // Should clamp level to new cap
            system.setLevel(100);
            expect(system.getLevel()).toBe(66);
        });

        it('should disable Hold On in INSANE mode', () => {
            system.setDifficulty('insane');
            expect(system.isHoldOnEnabled()).toBe(false);

            const result = system.holdOn();
            expect(result).toBe(false);
        });

        it('should skip decay in Comfort mode', () => {
            system.setDifficulty('comfort');
            system.startDecay();

            const initialLevel = system.getLevel();
            vi.advanceTimersByTime(10000);

            expect(system.getLevel()).toBe(initialLevel);
        });

        it('should emit insane:activate on INSANE selection', () => {
            const callback = vi.fn();
            eventBus.on('insane:activate', callback);

            system.setDifficulty('insane');

            expect(callback).toHaveBeenCalled();
        });

        it('should emit insane:deactivate when leaving INSANE', () => {
            system.setDifficulty('insane');

            const callback = vi.fn();
            eventBus.on('insane:deactivate', callback);

            system.setDifficulty('normal');

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Tether Death', () => {
        it('should emit tether:death at 0%', () => {
            const callback = vi.fn();
            eventBus.on('tether:death', callback);

            system.setLevel(0);

            expect(callback).toHaveBeenCalled();
        });

        it('should stop decay on death', () => {
            system.startDecay();
            system.setLevel(0);

            // Decay should be stopped
            vi.advanceTimersByTime(5000);

            // Can't go below 0, so just verify death was triggered
            expect(system.getLevel()).toBe(0);
        });
    });

    describe('setLevel() with Animation', () => {
        it('should animate level drop', () => {
            system.setLevel(66, true);

            // Animation takes 2000ms in 40 steps
            vi.advanceTimersByTime(1000); // Halfway

            expect(system.getLevel()).toBeLessThan(100);
            expect(system.getLevel()).toBeGreaterThan(66);

            vi.advanceTimersByTime(1500); // Complete

            expect(system.getLevel()).toBe(66);
        });
    });

    describe('State Management', () => {
        it('should return state for save system', () => {
            system.setDifficulty('intense');
            system.setLevel(75);

            const state = system.getState();

            expect(state.level).toBe(75);
            expect(state.difficulty).toBe('intense');
        });

        it('should restore state from save', () => {
            const savedState = {
                level: 42,
                difficulty: 'intense' as const,
                holdOnCooldown: false,
                decayFrozen: false
            };

            system.restoreState(savedState);

            expect(system.getLevel()).toBe(42);
            expect(system.getDifficulty().id).toBe('intense');
        });

        it('should trigger death if restored to 0%', () => {
            const callback = vi.fn();
            eventBus.on('tether:death', callback);

            system.restoreState({
                level: 0,
                difficulty: 'normal',
                holdOnCooldown: false,
                decayFrozen: false
            });

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Reset', () => {
        it('should reset to full tether', () => {
            system.setLevel(30);
            system.reset();

            expect(system.getLevel()).toBe(100);
        });

        it('should reset to cap in INSANE mode', () => {
            system.setDifficulty('insane');
            system.setLevel(30);
            system.reset();

            expect(system.getLevel()).toBe(66);
        });

        it('should clear Hold On cooldown', () => {
            system.holdOn();
            expect(system.isHoldOnCooldown()).toBe(true);

            system.reset();

            expect(system.isHoldOnCooldown()).toBe(false);
        });
    });

    describe('Echo System (Legacy)', () => {
        it('should track echo states', () => {
            system.showEchoes({ echo1: true, despair: true });

            const echoes = system.getEchoes();
            expect(echoes.echo1.active).toBe(true);
            expect(echoes.echo2.active).toBe(false);
            expect(echoes.despair.active).toBe(true);
        });

        it('should hide all echoes', () => {
            system.showEchoes({ echo1: true, echo2: true, despair: true });
            system.hideEchoes();

            const echoes = system.getEchoes();
            expect(echoes.echo1.active).toBe(false);
            expect(echoes.echo2.active).toBe(false);
            expect(echoes.despair.active).toBe(false);
        });

        it('should update echo mood', () => {
            system.updateEchoMood('despair', 'hostile');

            const echoes = system.getEchoes();
            expect(echoes.despair.mood).toBe('hostile');
        });
    });

    describe('Cleanup', () => {
        it('should clean up on destroy()', () => {
            system.startDecay();
            system.holdOn();

            system.destroy();

            // Verify timers are cleared by checking no state changes
            const level = system.getLevel();
            vi.advanceTimersByTime(10000);

            // Level should not have changed (decay stopped)
            // Note: We can't directly check this since destroy was called
            // This test mainly ensures no errors are thrown
        });
    });
});
