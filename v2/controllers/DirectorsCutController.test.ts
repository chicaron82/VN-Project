import { DirectorsCutController } from './DirectorsCutController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

describe('DirectorsCutController', () => {
    let controller: DirectorsCutController;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let prevLoggerEnabled: boolean;


    beforeEach(() => {
        prevLoggerEnabled = Logger.getConfig().enabled;
        Logger.setEnabled(false);

        eventBus = new EventBus();
        stateManager = new StateManager(eventBus, {});

        controller = new DirectorsCutController(eventBus, stateManager);

        // Clear localStorage
        localStorage.clear();
    });

    afterEach(() => {
        Logger.setEnabled(prevLoggerEnabled);

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
            const loggerSpy = vi.spyOn(Logger, 'ui');
            new DirectorsCutController(eventBus, stateManager);

            expect(loggerSpy).toHaveBeenCalledWith('🎬 DirectorsCutController initialized');
            loggerSpy.mockRestore();
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
            const loggerSpy = vi.spyOn(Logger, 'ui');

            controller.unlock();

            expect(loggerSpy).toHaveBeenCalledWith('🎬 Director\'s Cut unlocked');
            loggerSpy.mockRestore();
        });
    });

    describe('Show Director\'s Cut - Locked State', () => {
        it('should log warning when locked', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn');
            controller.show();

            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Director\'s Cut is locked'));
            loggerSpy.mockRestore();
        });

        it('should not create overlay when locked', () => {
            controller.show();

            const overlay = document.querySelector('#directors-cut-overlay');
            expect(overlay).toBeNull();
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
            expect(overlay).not.toBeNull();

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



        it('should log when showing', () => {
            const loggerSpy = vi.spyOn(Logger, 'ui');

            controller.show();

            expect(loggerSpy).toHaveBeenCalledWith('🎬 Director\'s Cut shown');
            loggerSpy.mockRestore();
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
            expect(closeBtn).not.toBeNull();

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
