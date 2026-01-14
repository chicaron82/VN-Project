/**
 * LoopController Tests
 *
 * Tests for the loop/version system - the meta-narrative heartbeat.
 * 848 is sacred. 💚🔥💀
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoopController, LoopStatus } from './LoopController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

describe('LoopController', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let loopController: LoopController;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        eventBus = new EventBus();
        stateManager = new StateManager({});
        loopController = new LoopController(eventBus, stateManager);
    });

    describe('Initialization', () => {
        it('should start at version 848 by default', () => {
            expect(loopController.getVersion()).toBe(848);
        });

        it('should start with attempting status by default', () => {
            expect(loopController.getStatus()).toBe('attempting');
        });

        it('should sync to StateManager on init', () => {
            expect(stateManager.get('game.loopVersion')).toBe(848);
            expect(stateManager.get('game.loopStatus')).toBe('attempting');
        });

        it('should load persisted version from localStorage', () => {
            localStorage.setItem('loopVersion', '850');
            localStorage.setItem('loopStatus', 'attempting');

            const newController = new LoopController(eventBus, stateManager);
            expect(newController.getVersion()).toBe(850);
        });
    });

    describe('increment()', () => {
        it('should increment version by 1', () => {
            const newVersion = loopController.increment();
            expect(newVersion).toBe(849);
            expect(loopController.getVersion()).toBe(849);
        });

        it('should reset status to attempting', () => {
            // First set to succeeded
            loopController.break();
            expect(loopController.getStatus()).toBe('succeeded');

            // Then increment (simulating retry)
            loopController.increment();
            expect(loopController.getStatus()).toBe('attempting');
        });

        it('should persist to localStorage', () => {
            loopController.increment();
            expect(localStorage.getItem('loopVersion')).toBe('849');
            expect(localStorage.getItem('loopStatus')).toBe('attempting');
        });

        it('should emit loop:updated event', () => {
            const callback = vi.fn();
            eventBus.on('loop:updated', callback);

            loopController.increment();

            expect(callback).toHaveBeenCalledWith({
                version: 849,
                status: 'attempting'
            });
        });

        it('should respond to ending:bad event', () => {
            eventBus.emit('ending:bad', {});
            expect(loopController.getVersion()).toBe(849);
        });

        it('should respond to loop:retry event', () => {
            eventBus.emit('loop:retry', {});
            expect(loopController.getVersion()).toBe(849);
        });
    });

    describe('break()', () => {
        it('should set status to succeeded', () => {
            loopController.break();
            expect(loopController.getStatus()).toBe('succeeded');
        });

        it('should not change version', () => {
            loopController.break();
            expect(loopController.getVersion()).toBe(848);
        });

        it('should emit loop:broken event', () => {
            const callback = vi.fn();
            eventBus.on('loop:broken', callback);

            loopController.break();

            expect(callback).toHaveBeenCalledWith({
                version: 848,
                status: 'succeeded'
            });
        });

        it('should respond to ending:true event', () => {
            eventBus.emit('ending:true', {});
            expect(loopController.getStatus()).toBe('succeeded');
        });
    });

    describe('accept()', () => {
        it('should set status to accepted', () => {
            loopController.accept();
            expect(loopController.getStatus()).toBe('accepted');
        });

        it('should not change version', () => {
            loopController.accept();
            expect(loopController.getVersion()).toBe(848);
        });

        it('should emit loop:accepted event', () => {
            const callback = vi.fn();
            eventBus.on('loop:accepted', callback);

            loopController.accept();

            expect(callback).toHaveBeenCalledWith({
                version: 848,
                status: 'accepted'
            });
        });

        it('should respond to ending:digitalForever event', () => {
            eventBus.emit('ending:digitalForever', {});
            expect(loopController.getStatus()).toBe('accepted');
        });
    });

    describe('Helper methods', () => {
        it('isBroken() should return true when succeeded', () => {
            expect(loopController.isBroken()).toBe(false);
            loopController.break();
            expect(loopController.isBroken()).toBe(true);
        });

        it('isAccepted() should return true when accepted', () => {
            expect(loopController.isAccepted()).toBe(false);
            loopController.accept();
            expect(loopController.isAccepted()).toBe(true);
        });

        it('isAttempting() should return true when attempting', () => {
            expect(loopController.isAttempting()).toBe(true);
            loopController.break();
            expect(loopController.isAttempting()).toBe(false);
        });

        it('getFailureCount() should return failures past 848', () => {
            expect(loopController.getFailureCount()).toBe(0);
            loopController.increment();
            expect(loopController.getFailureCount()).toBe(1);
            loopController.increment();
            loopController.increment();
            expect(loopController.getFailureCount()).toBe(3);
        });
    });

    describe('reset()', () => {
        it('should reset to 848 and attempting', () => {
            loopController.increment();
            loopController.increment();
            loopController.break();

            loopController.reset();

            expect(loopController.getVersion()).toBe(848);
            expect(loopController.getStatus()).toBe('attempting');
        });

        it('should emit loop:reset event', () => {
            const callback = vi.fn();
            eventBus.on('loop:reset', callback);

            loopController.reset();

            expect(callback).toHaveBeenCalledWith({
                version: 848,
                status: 'attempting'
            });
        });
    });

    describe('setVersion()', () => {
        it('should allow setting version directly (dev tool)', () => {
            loopController.setVersion(900);
            expect(loopController.getVersion()).toBe(900);
        });

        it('should not go below 848', () => {
            loopController.setVersion(800);
            expect(loopController.getVersion()).toBe(848);
        });

        it('should reset status to attempting', () => {
            loopController.break();
            loopController.setVersion(850);
            expect(loopController.getStatus()).toBe('attempting');
        });
    });
});
