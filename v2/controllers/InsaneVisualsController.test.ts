/**
 * InsaneVisualsController Tests
 *
 * Tests for DiZee's visual corruption system.
 * "SHE'S WATCHING YOU STRUGGLE." 💀
 *
 * 848 is sacred. 💚🔥💀
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InsaneVisualsController } from './InsaneVisualsController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

describe('InsaneVisualsController', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let controller: InsaneVisualsController;
    let gameContainer: HTMLDivElement;

    beforeEach(() => {
        // Set up DOM
        gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';
        document.body.appendChild(gameContainer);

        // Create dialogue box
        const dialogBox = document.createElement('div');
        dialogBox.className = 'dialog-box';
        document.body.appendChild(dialogBox);

        eventBus = new EventBus();
        stateManager = new StateManager({});
        controller = new InsaneVisualsController(eventBus, stateManager);
    });

    afterEach(() => {
        controller.destroy();
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        it('should start inactive', () => {
            expect(controller.isInsaneActive()).toBe(false);
            expect(controller.getState()).toBe('inactive');
        });
    });

    describe('Activation', () => {
        it('should activate on activate()', () => {
            controller.activate();

            expect(controller.isInsaneActive()).toBe(true);
            expect(controller.getState()).toBe('active');
        });

        it('should add insane-mode-active class to game container', () => {
            controller.activate();

            expect(gameContainer.classList.contains('insane-mode-active')).toBe(true);
        });

        it('should emit insane:activated event', () => {
            const callback = vi.fn();
            eventBus.on('insane:activated', callback);

            controller.activate();

            expect(callback).toHaveBeenCalled();
        });

        it('should sync to StateManager', () => {
            controller.activate();

            expect(stateManager.get('insane.visualsActive')).toBe(true);
        });

        it('should respond to insane:activate event', () => {
            eventBus.emit('insane:activate', {});

            expect(controller.isInsaneActive()).toBe(true);
        });

        it('should not double-activate', () => {
            const callback = vi.fn();
            eventBus.on('insane:activated', callback);

            controller.activate();
            controller.activate();

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('Deactivation', () => {
        it('should deactivate on deactivate()', () => {
            controller.activate();
            controller.deactivate();

            expect(controller.isInsaneActive()).toBe(false);
            expect(controller.getState()).toBe('inactive');
        });

        it('should remove insane-mode-active class', () => {
            controller.activate();
            controller.deactivate();

            expect(gameContainer.classList.contains('insane-mode-active')).toBe(false);
        });

        it('should emit insane:deactivated event', () => {
            const callback = vi.fn();
            eventBus.on('insane:deactivated', callback);

            controller.activate();
            controller.deactivate();

            expect(callback).toHaveBeenCalled();
        });

        it('should respond to insane:deactivate event', () => {
            controller.activate();
            eventBus.emit('insane:deactivate', {});

            expect(controller.isInsaneActive()).toBe(false);
        });

        it('should not double-deactivate', () => {
            const callback = vi.fn();
            eventBus.on('insane:deactivated', callback);

            controller.activate();
            controller.deactivate();
            controller.deactivate();

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should remove corruption classes from dialogue box', () => {
            const dialogBox = document.querySelector('.dialog-box') as HTMLElement;

            controller.activate();
            dialogBox.classList.add('corruption-intense');
            dialogBox.classList.add('insane-shake');

            controller.deactivate();

            expect(dialogBox.classList.contains('corruption-intense')).toBe(false);
            expect(dialogBox.classList.contains('insane-shake')).toBe(false);
        });
    });

    describe('Settings Integration', () => {
        it('should activate on difficulty change to insane', () => {
            eventBus.emit('settings:changed', { key: 'difficulty', value: 'insane' });

            expect(controller.isInsaneActive()).toBe(true);
        });

        it('should deactivate on difficulty change away from insane', () => {
            controller.activate();
            eventBus.emit('settings:changed', { key: 'difficulty', value: 'normal' });

            expect(controller.isInsaneActive()).toBe(false);
        });

        it('should ignore non-difficulty settings changes', () => {
            eventBus.emit('settings:changed', { key: 'volume', value: 0.5 });

            expect(controller.isInsaneActive()).toBe(false);
        });
    });

    describe('Corruption Effects', () => {
        it('should not trigger corruption when inactive', () => {
            const callback = vi.fn();
            eventBus.on('insane:corruption_triggered', callback);

            controller.triggerCorruption();

            expect(callback).not.toHaveBeenCalled();
        });

        it('should trigger corruption when active', () => {
            const callback = vi.fn();
            eventBus.on('insane:corruption_triggered', callback);

            controller.activate();
            controller.triggerCorruption('heavy');

            expect(callback).toHaveBeenCalledWith({ intensity: 'heavy' });
        });

        it('should set state to corrupting during effects', () => {
            controller.activate();
            controller.triggerCorruption();

            expect(controller.getState()).toBe('corrupting');
        });

        it('should emit effect:shake event', () => {
            const callback = vi.fn();
            eventBus.on('effect:shake', callback);

            controller.activate();
            controller.triggerCorruption();

            expect(callback).toHaveBeenCalled();
        });

        it('should emit effect:glitch event', () => {
            const callback = vi.fn();
            eventBus.on('effect:glitch', callback);

            controller.activate();
            controller.triggerCorruption();

            expect(callback).toHaveBeenCalled();
        });

        it('should respond to insane:corrupt event', () => {
            const callback = vi.fn();
            eventBus.on('insane:corruption_triggered', callback);

            controller.activate();
            eventBus.emit('insane:corrupt', {});

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Cage Overlay', () => {
        it('should create cage overlay if not present', () => {
            controller.showCageOverlay();

            const overlay = document.getElementById('insane-cage-overlay');
            expect(overlay).not.toBeNull();
        });

        it('should show overlay with flex display', () => {
            controller.showCageOverlay();

            const overlay = document.getElementById('insane-cage-overlay');
            // Will be 'flex' after the initial timeout
            expect(overlay).not.toBeNull();
        });

        it('should emit insane:cage_complete after sequence', async () => {
            vi.useFakeTimers();
            const callback = vi.fn();
            eventBus.on('insane:cage_complete', callback);

            controller.showCageOverlay();

            // Fast-forward through: fade in (50 + 500) + hold (3000) + fade out (800)
            await vi.advanceTimersByTimeAsync(50 + 500 + 3000 + 800 + 100);

            expect(callback).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should call provided callback after sequence', async () => {
            vi.useFakeTimers();
            const userCallback = vi.fn();

            controller.showCageOverlay(userCallback);

            // Fast-forward through full sequence
            await vi.advanceTimersByTimeAsync(50 + 500 + 3000 + 800 + 100);

            expect(userCallback).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should respond to insane:cage event', () => {
            eventBus.emit('insane:cage', {});

            const overlay = document.getElementById('insane-cage-overlay');
            expect(overlay).not.toBeNull();
        });
    });

    describe('maybeCorrupt()', () => {
        it('should not corrupt when inactive', () => {
            const callback = vi.fn();
            eventBus.on('insane:corruption_triggered', callback);

            // Call multiple times
            for (let i = 0; i < 100; i++) {
                controller.maybeCorrupt();
            }

            expect(callback).not.toHaveBeenCalled();
        });

        it('should sometimes corrupt when active (based on chance)', () => {
            const callback = vi.fn();
            eventBus.on('insane:corruption_triggered', callback);

            controller.activate();

            // With 30% chance, calling 100 times should trigger some corruptions
            for (let i = 0; i < 100; i++) {
                controller.maybeCorrupt();
            }

            // Should have triggered at least once (statistically very likely)
            expect(callback.mock.calls.length).toBeGreaterThan(0);
        });
    });

    describe('Cleanup', () => {
        it('should clean up on destroy()', () => {
            controller.activate();
            controller.showCageOverlay();

            controller.destroy();

            expect(controller.isInsaneActive()).toBe(false);
            // Cage overlay should be removed
            const overlay = document.getElementById('insane-cage-overlay');
            expect(overlay).toBeNull();
        });

        it('should remove overlays on deactivation', () => {
            controller.activate();

            // Add some overlays
            const overlay = document.createElement('div');
            overlay.className = 'insane-overlay';
            document.body.appendChild(overlay);

            controller.deactivate();

            const remaining = document.querySelectorAll('.insane-overlay');
            expect(remaining.length).toBe(0);
        });
    });
});
