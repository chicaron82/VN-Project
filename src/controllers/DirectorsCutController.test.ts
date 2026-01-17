import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DirectorsCutController } from './DirectorsCutController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';

describe('DirectorsCutController', () => {
    let controller: DirectorsCutController;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let mockEasterEggController: any;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager({});

        mockEasterEggController = {
            showUnlockOverlay: vi.fn()
        };

        controller = new DirectorsCutController(eventBus, stateManager);
        controller.setEasterEggController(mockEasterEggController);

        // Clear localStorage
        localStorage.clear();
    });

    afterEach(() => {
        // Clean up any overlays
        document.querySelectorAll('#directors-cut-overlay').forEach(el => el.remove());
        // Clean up style tags
        document.querySelectorAll('style').forEach(el => el.remove());
        localStorage.clear();
    });

    describe('Initialization', () => {
        it('should initialize without errors', () => {
            expect(() => new DirectorsCutController(eventBus, stateManager)).not.toThrow();
        });

        it('should log initialization message', () => {
            const consoleSpy = vi.spyOn(console, 'log');
            const newController = new DirectorsCutController(eventBus, stateManager);

            expect(consoleSpy).toHaveBeenCalledWith('🎬 DirectorsCutController initialized');
            consoleSpy.mockRestore();
        });

        it('should accept easter egg controller', () => {
            expect(() => controller.setEasterEggController(mockEasterEggController)).not.toThrow();
        });
    });

    describe('Unlock State', () => {
        it('should check if unlocked via localStorage', () => {
            expect(controller.isUnlocked()).toBe(false);

            localStorage.setItem('directorsCutUnlocked', 'true');
            expect(controller.isUnlocked()).toBe(true);
        });

        it('should unlock via unlock() method', () => {
            expect(controller.isUnlocked()).toBe(false);

            controller.unlock();

            expect(controller.isUnlocked()).toBe(true);
            expect(localStorage.getItem('directorsCutUnlocked')).toBe('true');
        });

        it('should log when unlocking', () => {
            const consoleSpy = vi.spyOn(console, 'log');

            controller.unlock();

            expect(consoleSpy).toHaveBeenCalledWith('🎬 Director\'s Cut unlocked');
            consoleSpy.mockRestore();
        });
    });

    describe('Show Director\'s Cut - Locked State', () => {
        it('should show unlock overlay when locked', () => {
            controller.show();

            expect(mockEasterEggController.showUnlockOverlay).toHaveBeenCalledWith(
                '🔒 LOCKED',
                'Find the secret code to unlock the Director\'s Cut...',
                'warning'
            );
        });

        it('should not create overlay when locked', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).toBeNull();
        });

        it('should not error if easter egg controller not set', () => {
            const newController = new DirectorsCutController(eventBus, stateManager);

            expect(() => newController.show()).not.toThrow();
        });
    });

    describe('Show Director\'s Cut - Unlocked State', () => {
        beforeEach(() => {
            localStorage.setItem('directorsCutUnlocked', 'true');
        });

        it('should create overlay when unlocked', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).not.toBeNull();
        });

        it('should create overlay with correct ID', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.id).toBe('directors-cut-overlay');
        });

        it('should create overlay with correct className', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.className).toBe('directors-cut-overlay');
        });

        it('should create overlay with correct styles', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay') as HTMLElement;
            expect(overlay.style.position).toBe('fixed');
            expect(overlay.style.top).toBe('0px');
            expect(overlay.style.left).toBe('0px');
            expect(overlay.style.width).toBe('100%');
            expect(overlay.style.height).toBe('100%');
        });

        it('should add fadeIn animation style', () => {
            controller.show();

            const style = document.querySelector('style');
            expect(style?.textContent).toContain('@keyframes fadeIn');
        });

        it('should contain title "DIRECTOR\'S CUT"', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('DIRECTOR\'S CUT');
        });

        it('should contain subtitle about crew statements', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Extended Crew Statements About VERSION 848');
        });

        it('should contain all 7 crew member statements', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            const crewNames = ['ZeeRah', 'Zee', 'DiZee', 'Tori', 'GenZee', 'Belle', 'PerplexiZee & CoZee'];

            crewNames.forEach(name => {
                expect(overlay?.innerHTML).toContain(name);
            });
        });

        it('should contain ZeeRah\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Working with Aaron was like debugging a fever dream');
            expect(overlay?.innerHTML).toContain('VERSION 848 isn\'t just a game');
        });

        it('should contain Zee\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Aaron approaches game design the way some people approach experimental cooking');
        });

        it('should contain DiZee\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Aaron doesn\'t just think outside the box');
        });

        it('should contain Tori\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Aaron\'s creative process is like watching someone solve a Rubik\'s cube');
        });

        it('should contain GenZee\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Let\'s be real: Aaron is unhinged in the best possible way');
        });

        it('should contain Belle\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Working on VERSION 848 was like being part of a performance art piece');
        });

        it('should contain PerplexiZee & CoZee\'s full statement', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('We\'ve analyzed thousands of codebases');
            expect(overlay?.innerHTML).toContain('VERSION 848 is an anomaly');
        });

        it('should contain UV7 trinity emoji', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('💚🔥💀');
        });

        it('should contain Storm Dragon signature', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Always. Always. Always.');
            expect(overlay?.innerHTML).toContain('Storm Dragon');
        });

        it('should log when showing', () => {
            const consoleSpy = vi.spyOn(console, 'log');

            controller.show();

            expect(consoleSpy).toHaveBeenCalledWith('🎬 Director\'s Cut shown');
            consoleSpy.mockRestore();
        });

        it('should not show multiple overlays simultaneously', () => {
            controller.show();
            controller.show();

            const overlays = document.querySelectorAll('#directors-cut-overlay');
            expect(overlays.length).toBe(1);
        });
    });

    describe('Close Button', () => {
        beforeEach(() => {
            localStorage.setItem('directorsCutUnlocked', 'true');
        });

        it('should create close button', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close');
            expect(closeBtn).not.toBeNull();
        });

        it('should create close button with correct text', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close');
            expect(closeBtn?.textContent).toBe('CLOSE');
        });

        it('should create close button with correct styles', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close') as HTMLElement;
            expect(closeBtn.style.position).toBe('fixed');
            expect(closeBtn.style.top).toBe('20px');
            expect(closeBtn.style.right).toBe('20px');
        });

        it('should remove overlay when close button clicked', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close') as HTMLButtonElement;
            closeBtn.click();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).toBeNull();
        });

        it('should change style on hover', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close') as HTMLElement;
            const mouseEnter = new Event('mouseenter');
            closeBtn.dispatchEvent(mouseEnter);

            expect(closeBtn.style.background).toBe('rgba(0, 255, 255, 0.4)');
            expect(closeBtn.style.boxShadow).toContain('0 0 10px');
        });

        it('should revert style on mouse leave', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close') as HTMLElement;
            const mouseEnter = new Event('mouseenter');
            const mouseLeave = new Event('mouseleave');

            closeBtn.dispatchEvent(mouseEnter);
            closeBtn.dispatchEvent(mouseLeave);

            expect(closeBtn.style.background).toBe('rgba(0, 255, 255, 0.2)');
            expect(closeBtn.style.boxShadow).toBe('none');
        });
    });

    describe('Escape Key Handler', () => {
        beforeEach(() => {
            localStorage.setItem('directorsCutUnlocked', 'true');
        });

        it('should close overlay on Escape key', () => {
            controller.show();

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escapeEvent);

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).toBeNull();
        });

        it('should not close on other keys', () => {
            controller.show();

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.dispatchEvent(enterEvent);

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).not.toBeNull();
        });

        it('should clean up escape handler on close', () => {
            controller.show();

            const closeBtn = document.querySelector('.directors-cut-close') as HTMLButtonElement;
            closeBtn.click();

            // Try escape after close - should not error
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            expect(() => document.dispatchEvent(escapeEvent)).not.toThrow();
        });
    });

    describe('Content Formatting', () => {
        beforeEach(() => {
            localStorage.setItem('directorsCutUnlocked', 'true');
        });

        it('should use monospace font', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('Courier New');
        });

        it('should use cyan color theme', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('#0ff');
        });

        it('should have responsive max-width', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('max-width: 800px');
        });

        it('should have proper spacing between statements', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay?.innerHTML).toContain('margin-bottom: 40px');
        });
    });
});
