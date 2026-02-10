import { TutorialManager } from './TutorialManager';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

describe('TutorialManager', () => {
    let manager: TutorialManager;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let mockPauseManager: any;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager({});

        mockPauseManager = {
            request: vi.fn(),
            release: vi.fn()
        };

        manager = new TutorialManager(eventBus, stateManager);
        manager.init();
    });

    afterEach(() => {
        // Clean up any tutorial overlays
        document.querySelectorAll('.tutorial-overlay').forEach(el => el.remove());
    });

    describe('Initialization', () => {
        it('should initialize without errors', () => {
            expect(() => new TutorialManager(eventBus, stateManager)).not.toThrow();
        });

        it('should log initialization message', () => {
            const loggerSpy = vi.spyOn(Logger, 'ui');
            const newManager = new TutorialManager(eventBus, stateManager);
            newManager.init();

            expect(loggerSpy).toHaveBeenCalledWith('📚 TutorialManager initialized (event-driven mode)');
            loggerSpy.mockRestore();
        });

        it('should load previously completed tutorials', () => {
            stateManager.set('tutorial.completed', {
                'test_tutorial': true,
                'another_tutorial': true
            });

            const newManager = new TutorialManager(eventBus, stateManager);
            newManager.init();

            expect(newManager.hasShown('test_tutorial')).toBe(true);
            expect(newManager.hasShown('another_tutorial')).toBe(true);
            expect(newManager.hasShown('never_shown')).toBe(false);
        });
    });

    describe('Tutorial State', () => {
        it('should check if tutorial has been shown', () => {
            expect(manager.hasShown('test')).toBe(false);

            stateManager.set('tutorial.completed', { 'test': true });
            const newManager = new TutorialManager(eventBus, stateManager);
            newManager.init();

            expect(newManager.hasShown('test')).toBe(true);
        });

        it('should check if tutorials are enabled (default: true)', () => {
            expect(manager.isEnabled()).toBe(true);
        });

        it('should allow disabling tutorials', () => {
            manager.setEnabled(false);
            expect(manager.isEnabled()).toBe(false);
        });

        it('should allow re-enabling tutorials', () => {
            manager.setEnabled(false);
            expect(manager.isEnabled()).toBe(false);

            manager.setEnabled(true);
            expect(manager.isEnabled()).toBe(true);
        });
    });

    describe('Show Hand Gesture', () => {
        let targetElement: HTMLElement;

        beforeEach(() => {
            targetElement = document.createElement('button');
            targetElement.textContent = 'Test Button';
            targetElement.style.width = '100px';
            targetElement.style.height = '40px';
            targetElement.style.position = 'fixed';
            targetElement.style.top = '100px';
            targetElement.style.left = '50px';
            document.body.appendChild(targetElement);

            // Mock getBoundingClientRect for jsdom (elements have no layout)
            vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
                width: 100,
                height: 40,
                top: 100,
                left: 50,
                right: 150,
                bottom: 140,
                x: 50,
                y: 100,
                toJSON: () => ({})
            } as DOMRect);
        });

        afterEach(() => {
            targetElement.remove();
        });

        it('should show tutorial for first time', () => {
            manager.showHandGesture('test_tutorial', targetElement, {
                text: 'Click here!',
                autoHide: 5000
            });

            const overlay = document.querySelector('.tutorial-overlay');
            expect(overlay).not.toBeNull();
        });

        it('should not show tutorial if already shown', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            // Try to show again
            manager.showHandGesture('test_tutorial', targetElement);

            // Should only have one overlay
            const overlays = document.querySelectorAll('.tutorial-overlay');
            expect(overlays.length).toBe(1);
        });

        it('should not show tutorial if disabled', () => {
            manager.setEnabled(false);
            manager.showHandGesture('test_tutorial', targetElement);

            const overlay = document.querySelector('.tutorial-overlay');
            expect(overlay).toBeNull();
        });

        it('should not show tutorial if no target element', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn');

            manager.showHandGesture('test_tutorial', null);

            expect(loggerSpy).toHaveBeenCalledWith('Tutorial: No target element for', 'test_tutorial');
            loggerSpy.mockRestore();
        });

        it('should not show tutorial if target has no size', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn');
            const zeroSizeElement = document.createElement('div');
            document.body.appendChild(zeroSizeElement);

            manager.showHandGesture('test_tutorial', zeroSizeElement);

            expect(loggerSpy).toHaveBeenCalledWith('Tutorial: Target element has no size for', 'test_tutorial');
            loggerSpy.mockRestore();
            zeroSizeElement.remove();
        });

        it('should create backdrop that dismisses on click', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            const backdrop = document.querySelector('.tutorial-backdrop') as HTMLElement;
            expect(backdrop).not.toBeNull();

            backdrop.click();

            // Overlay should be removed after animation (300ms)
            setTimeout(() => {
                const overlay = document.querySelector('.tutorial-overlay');
                expect(overlay).toBeNull();
            }, 400);
        });

        it('should add spotlight class to target element', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            expect(targetElement.classList.contains('tutorial-spotlight')).toBe(true);
        });

        it('should create hand gesture emoji', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            const hand = document.querySelector('.tutorial-hand');
            expect(hand).not.toBeNull();
            expect(hand?.textContent).toBe('👆');
        });

        it('should create tooltip with text if provided', () => {
            manager.showHandGesture('test_tutorial', targetElement, {
                text: 'Click here to continue!'
            });

            const tooltip = document.querySelector('.tutorial-tooltip');
            expect(tooltip).not.toBeNull();
            expect(tooltip?.textContent).toBe('Click here to continue!');
        });

        it('should not create tooltip if no text provided', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            const tooltip = document.querySelector('.tutorial-tooltip');
            expect(tooltip).toBeNull();
        });

        it('should create dismiss hint', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            const hint = document.querySelector('.tutorial-dismiss-hint');
            expect(hint).not.toBeNull();
            expect(hint?.textContent).toBe('Tap to continue');
        });

        it('should mark tutorial as shown', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            expect(manager.hasShown('test_tutorial')).toBe(true);
        });

        it('should save completed tutorial to state', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            const completed = stateManager.get<Record<string, boolean>>('tutorial.completed');
            expect(completed).toHaveProperty('test_tutorial', true);
        });

        it('should log when tutorial is shown', () => {
            const loggerSpy = vi.spyOn(Logger, 'ui');

            manager.showHandGesture('test_tutorial', targetElement);

            expect(loggerSpy).toHaveBeenCalledWith('📚 Tutorial shown: test_tutorial');
            loggerSpy.mockRestore();
        });

        it('should auto-hide after default delay (4000ms)', () => {
            vi.useFakeTimers();

            manager.showHandGesture('test_tutorial', targetElement);

            expect(document.querySelector('.tutorial-overlay')).not.toBeNull();

            // Fast-forward past 4000ms + 300ms animation
            vi.advanceTimersByTime(4400);

            expect(document.querySelector('.tutorial-overlay')).toBeNull();

            vi.useRealTimers();
        });

        it('should auto-hide after custom delay', () => {
            vi.useFakeTimers();

            manager.showHandGesture('test_tutorial', targetElement, {
                autoHide: 2000
            });

            expect(document.querySelector('.tutorial-overlay')).not.toBeNull();

            // Fast-forward past 2000ms + 300ms animation
            vi.advanceTimersByTime(2400);

            expect(document.querySelector('.tutorial-overlay')).toBeNull();

            vi.useRealTimers();
        });

        it('should not show multiple tutorials simultaneously', () => {
            const secondElement = document.createElement('button');
            secondElement.style.width = '100px';
            secondElement.style.height = '40px';
            document.body.appendChild(secondElement);

            manager.showHandGesture('tutorial_1', targetElement);
            manager.showHandGesture('tutorial_2', secondElement);

            const overlays = document.querySelectorAll('.tutorial-overlay');
            expect(overlays.length).toBe(1);

            secondElement.remove();
        });
    });

    describe('Pause Manager Integration', () => {
        let targetElement: HTMLElement;

        beforeEach(() => {
            targetElement = document.createElement('button');
            targetElement.style.width = '100px';
            targetElement.style.height = '40px';
            targetElement.style.position = 'fixed';
            targetElement.style.top = '100px';
            targetElement.style.left = '50px';
            document.body.appendChild(targetElement);

            // Mock getBoundingClientRect for jsdom
            vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
                width: 100,
                height: 40,
                top: 100,
                left: 50,
                right: 150,
                bottom: 140,
                x: 50,
                y: 100,
                toJSON: () => ({})
            } as DOMRect);

            manager.setPauseManager(mockPauseManager);
        });

        afterEach(() => {
            targetElement.remove();
        });

        it('should request pause when showing tutorial', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            expect(mockPauseManager.request).toHaveBeenCalledWith('tutorial');
        });

        it('should release pause when dismissing tutorial', () => {
            manager.showHandGesture('test_tutorial', targetElement);
            manager.dismiss();

            expect(mockPauseManager.release).toHaveBeenCalledWith('tutorial');
        });

        it('should not error if pause manager not set', () => {
            const newManager = new TutorialManager(eventBus, stateManager);
            newManager.init();

            expect(() => {
                newManager.showHandGesture('test', targetElement);
                newManager.dismiss();
            }).not.toThrow();
        });
    });

    describe('Dismiss Tutorial', () => {
        let targetElement: HTMLElement;

        beforeEach(() => {
            targetElement = document.createElement('button');
            targetElement.style.width = '100px';
            targetElement.style.height = '40px';
            targetElement.style.position = 'fixed';
            targetElement.style.top = '100px';
            targetElement.style.left = '50px';
            document.body.appendChild(targetElement);

            // Mock getBoundingClientRect for jsdom
            vi.spyOn(targetElement, 'getBoundingClientRect').mockReturnValue({
                width: 100,
                height: 40,
                top: 100,
                left: 50,
                right: 150,
                bottom: 140,
                x: 50,
                y: 100,
                toJSON: () => ({})
            } as DOMRect);
        });

        afterEach(() => {
            targetElement.remove();
        });

        it('should remove spotlight from target element', () => {
            manager.showHandGesture('test_tutorial', targetElement);

            expect(targetElement.classList.contains('tutorial-spotlight')).toBe(true);

            manager.dismiss();

            expect(targetElement.classList.contains('tutorial-spotlight')).toBe(false);
        });

        it('should remove overlay from DOM after animation', () => {
            vi.useFakeTimers();

            manager.showHandGesture('test_tutorial', targetElement);

            expect(document.querySelector('.tutorial-overlay')).not.toBeNull();

            manager.dismiss();

            // Immediately after dismiss, overlay should still exist (fading out)
            expect(document.querySelector('.tutorial-overlay')).not.toBeNull();

            // After animation (300ms), overlay should be removed
            vi.advanceTimersByTime(400);

            expect(document.querySelector('.tutorial-overlay')).toBeNull();

            vi.useRealTimers();
        });

        it('should not error if no active tutorial', () => {
            expect(() => manager.dismiss()).not.toThrow();
        });
    });

    describe('Reset Tutorials', () => {
        it('should clear all shown tutorials', () => {
            stateManager.set('tutorial.completed', {
                'test_1': true,
                'test_2': true
            });

            const newManager = new TutorialManager(eventBus, stateManager);
            newManager.init();

            expect(newManager.hasShown('test_1')).toBe(true);

            newManager.resetTutorials();

            expect(newManager.hasShown('test_1')).toBe(false);
            expect(newManager.hasShown('test_2')).toBe(false);
        });

        it('should clear state', () => {
            stateManager.set('tutorial.completed', { 'test': true });

            manager.resetTutorials();

            const completed = stateManager.get<Record<string, boolean>>('tutorial.completed');
            expect(completed).toEqual({});
        });

        it('should log reset message', () => {
            const loggerSpy = vi.spyOn(Logger, 'ui');

            manager.resetTutorials();

            expect(loggerSpy).toHaveBeenCalledWith('📚 All tutorials reset');
            loggerSpy.mockRestore();
        });
    });
});
