/**
 * EasterEggController Tests
 *
 * Tests for the easter egg overlay system.
 * "The game within the game."
 *
 * 848 is sacred. 💚🔥💀
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EasterEggController } from './EasterEggController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

// Mock window.open
const mockWindowOpen = vi.fn();
global.window.open = mockWindowOpen;

describe('EasterEggController', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let controller: EasterEggController;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager({});
        controller = new EasterEggController(eventBus, stateManager);

        // Clear window.open mock
        mockWindowOpen.mockClear();
    });

    afterEach(() => {
        controller.destroy();
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        it('should initialize controller', () => {
            expect(controller).toBeDefined();
        });

        it('should listen for secret_code:unlocked events', () => {
            const consoleSpy = vi.spyOn(console, 'log');

            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });

            expect(consoleSpy).toHaveBeenCalledWith('🥚 Easter egg triggered: uv7crew');

            consoleSpy.mockRestore();
        });
    });

    describe('UV7 Crew Bios', () => {
        it('should show UV7 crew overlay on uv7crew code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });

            const overlay = document.getElementById('uv7-crew-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('UV7 CREW');
            expect(overlay?.textContent).toContain('Belle');
            expect(overlay?.textContent).toContain('DiZee');
        });
    });

    describe('Loop Timeline', () => {
        it('should show loop timeline on bootstrap code', () => {
            stateManager.set('game.loopVersion', 848);

            eventBus.emit('secret_code:unlocked', { code: 'bootstrap', name: 'Loop Timeline' });

            const overlay = document.getElementById('loop-timeline-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('LOOP TIMELINE');
            expect(overlay?.textContent).toContain('848');
        });

        it('should display current loop version', () => {
            stateManager.set('game.loopVersion', 850);

            eventBus.emit('secret_code:unlocked', { code: 'bootstrap', name: 'Loop Timeline' });

            const overlay = document.getElementById('loop-timeline-overlay');
            expect(overlay?.textContent).toContain('850');
        });
    });

    describe('True Attempt Number', () => {
        it('should show true attempt number on 848 code', () => {
            stateManager.set('game.loopVersion', 851);

            eventBus.emit('secret_code:unlocked', { code: '848', name: 'True Attempt' });

            const overlay = document.getElementById('true-attempt-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('851');
            expect(overlay?.textContent).toContain('True Attempt Number');
        });
    });

    describe('Echo Compilation', () => {
        it('should show echo compilation on echo code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'echo', name: 'Echo Voices' });

            const overlay = document.getElementById('echo-compilation-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('ECHO VOICES');
            expect(overlay?.textContent).toContain('Hope');
            expect(overlay?.textContent).toContain('Gentle');
            expect(overlay?.textContent).toContain('Despair');
        });
    });

    describe('Always Compilation', () => {
        it('should show always compilation on always3 code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'always3', name: 'Always' });

            const overlay = document.getElementById('always-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('ALWAYS');
            expect(overlay?.textContent).toContain('Storm Dragon');
        });
    });

    describe('Torigatchi Easter Egg', () => {
        it('should show Torigatchi overlay on torigatchi code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'torigatchi', name: 'Torigatchi' });

            const overlay = document.getElementById('torigatchi-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('TORIGATCHI');
            expect(overlay?.textContent).toContain('digital pet');
        });

        it('should have button that opens Torigatchi link', () => {
            eventBus.emit('secret_code:unlocked', { code: 'torigatchi', name: 'Torigatchi' });

            const overlay = document.getElementById('torigatchi-overlay');
            const playButton = Array.from(overlay?.querySelectorAll('button') || [])
                .find(btn => btn.textContent === 'PLAY TORIGATCHI');

            expect(playButton).toBeDefined();

            // Click the button
            playButton?.click();

            expect(mockWindowOpen).toHaveBeenCalledWith('https://chicaron82.github.io/torigatchi/', '_blank');
        });
    });

    describe('DiZee Easter Egg', () => {
        it('should show DiZee overlay on dizee code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'dizee', name: 'DiZee' });

            const overlay = document.getElementById('dizee-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.textContent).toContain('THE ARCHITECT');
            expect(overlay?.textContent).toContain('DiZee');
            expect(overlay?.textContent).toContain('EventBus');
        });
    });

    describe('Overlay Infrastructure', () => {
        it('should track active overlays', () => {
            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });
            eventBus.emit('secret_code:unlocked', { code: 'dizee', name: 'DiZee' });

            const overlays = document.querySelectorAll('.easter-egg-overlay');
            expect(overlays.length).toBeGreaterThan(0);
        });

        it('should remove overlays on destroy', () => {
            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });

            controller.destroy();

            const overlays = document.querySelectorAll('.easter-egg-overlay');
            expect(overlays.length).toBe(0);
        });

        it('should close overlay on backdrop click', () => {
            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });

            const overlay = document.getElementById('uv7-crew-overlay');
            expect(overlay).not.toBeNull();

            // Simulate backdrop click
            const clickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent, 'target', { value: overlay, enumerable: true });
            overlay?.dispatchEvent(clickEvent);

            // Wait for fade animation
            setTimeout(() => {
                const overlayAfterClose = document.getElementById('uv7-crew-overlay');
                expect(overlayAfterClose).toBeNull();
            }, 400);
        });

        it('should close overlay on close button click', () => {
            eventBus.emit('secret_code:unlocked', { code: 'uv7crew', name: 'UV7 Crew' });

            const overlay = document.getElementById('uv7-crew-overlay');
            const closeButton = Array.from(overlay?.querySelectorAll('button') || [])
                .find(btn => btn.textContent === 'CLOSE');

            expect(closeButton).toBeDefined();

            // Click close button
            closeButton?.click();

            // Wait for fade animation
            setTimeout(() => {
                const overlayAfterClose = document.getElementById('uv7-crew-overlay');
                expect(overlayAfterClose).toBeNull();
            }, 400);
        });
    });

    describe('Unknown Codes', () => {
        it('should log warning for unknown easter egg code', () => {
            const consoleSpy = vi.spyOn(console, 'warn');

            eventBus.emit('secret_code:unlocked', { code: 'unknown', name: 'Unknown' });

            expect(consoleSpy).toHaveBeenCalledWith('🥚 No handler for easter egg: unknown');

            consoleSpy.mockRestore();
        });

        it('should not create overlay for unknown code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'unknown', name: 'Unknown' });

            const overlays = document.querySelectorAll('.easter-egg-overlay');
            expect(overlays.length).toBe(0);
        });
    });
});
