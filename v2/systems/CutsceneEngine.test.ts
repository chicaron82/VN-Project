import { CutsceneEngine } from './CutsceneEngine';
import { EventBus } from '@core/EventBus';

describe('CutsceneEngine', () => {
    let engine: CutsceneEngine;
    let eventBus: EventBus;
    let gameView: HTMLDivElement;

    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';
        gameView = document.createElement('div');
        gameView.id = 'game-view';
        document.body.appendChild(gameView);

        eventBus = new EventBus();
        engine = new CutsceneEngine({ gameView }, eventBus);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    describe('Initialization', () => {
        it('should create cutscene-container in DOM', () => {
            const container = document.getElementById('cutscene-container');
            expect(container).not.toBeNull();
            expect(container!.style.display).toBe('none');
        });

        it('should create cutscene-canvas inside container', () => {
            const canvas = document.getElementById('cutscene-canvas');
            expect(canvas).not.toBeNull();
            expect(canvas!.style.display).toBe('none');
        });

        it('should not be playing initially', () => {
            expect(engine.getIsPlaying()).toBe(false);
        });

        it('should reuse existing container if present', () => {
            // Create a second engine — should not create duplicate containers
            const _engine2 = new CutsceneEngine({ gameView }, eventBus);
            const containers = document.querySelectorAll('#cutscene-container');
            expect(containers.length).toBe(1);
            // suppress unused
            void _engine2;
        });
    });

    // ========================================
    // START CUTSCENE
    // ========================================

    describe('startCutscene', () => {
        it('should set isPlaying to true', () => {
            engine.startCutscene();
            expect(engine.getIsPlaying()).toBe(true);
        });

        it('should show the container with active class', () => {
            engine.startCutscene();
            const container = document.getElementById('cutscene-container')!;
            expect(container.classList.contains('active')).toBe(true);
            expect(container.style.display).toBe('block');
            expect(container.style.pointerEvents).toBe('auto');
        });

        it('should show the canvas', () => {
            engine.startCutscene();
            const canvas = document.getElementById('cutscene-canvas')!;
            expect(canvas.style.display).toBe('block');
            expect(canvas.style.pointerEvents).toBe('auto');
        });

        it('should hide the game view', () => {
            engine.startCutscene();
            expect(gameView.style.opacity).toBe('0');
        });
    });

    // ========================================
    // END CUTSCENE
    // ========================================

    describe('endCutscene', () => {
        it('should set isPlaying to false immediately', () => {
            engine.startCutscene();
            engine.endCutscene();
            expect(engine.getIsPlaying()).toBe(false);
        });

        it('should add fade-out class to container', () => {
            engine.startCutscene();
            engine.endCutscene();
            const container = document.getElementById('cutscene-container')!;
            expect(container.classList.contains('fade-out')).toBe(true);
        });

        it('should hide container after 1000ms timeout', () => {
            engine.startCutscene();
            engine.endCutscene();

            vi.advanceTimersByTime(1000);

            const container = document.getElementById('cutscene-container')!;
            expect(container.style.display).toBe('none');
            expect(container.classList.contains('active')).toBe(false);
            expect(container.classList.contains('fade-out')).toBe(false);
        });

        it('should clear canvas content after timeout', () => {
            engine.startCutscene();
            const canvas = document.getElementById('cutscene-canvas')!;
            canvas.innerHTML = '<p>Test content</p>';

            engine.endCutscene();
            vi.advanceTimersByTime(1000);

            expect(canvas.innerHTML).toBe('');
            expect(canvas.style.display).toBe('none');
        });

        it('should restore game view opacity after timeout', () => {
            engine.startCutscene();
            engine.endCutscene();
            vi.advanceTimersByTime(1000);

            expect(gameView.style.opacity).toBe('1');
        });

        it('should call onComplete callback after timeout', () => {
            const onComplete = vi.fn();
            engine.startCutscene();
            engine.endCutscene(onComplete);

            expect(onComplete).not.toHaveBeenCalled();
            vi.advanceTimersByTime(1000);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });

    // ========================================
    // PLAY SIMPLE FADE
    // ========================================

    describe('playSimpleFade', () => {
        it('should start cutscene and set canvas content', () => {
            engine.playSimpleFade('<h1>Hello</h1>');
            expect(engine.getIsPlaying()).toBe(true);

            const canvas = document.getElementById('cutscene-canvas')!;
            expect(canvas.innerHTML).toBe('<h1>Hello</h1>');
        });

        it('should end cutscene after default 3000ms duration', () => {
            engine.playSimpleFade('<p>Content</p>');

            vi.advanceTimersByTime(3000); // triggers endCutscene
            expect(engine.getIsPlaying()).toBe(false);

            vi.advanceTimersByTime(1000); // endCutscene's internal timeout
            const container = document.getElementById('cutscene-container')!;
            expect(container.style.display).toBe('none');
        });

        it('should respect custom duration', () => {
            engine.playSimpleFade('<p>Quick</p>', 500);

            vi.advanceTimersByTime(499);
            expect(engine.getIsPlaying()).toBe(true);

            vi.advanceTimersByTime(1);
            expect(engine.getIsPlaying()).toBe(false);
        });

        it('should call onComplete after duration + fade', () => {
            const onComplete = vi.fn();
            engine.playSimpleFade('<p>Done</p>', 2000, onComplete);

            vi.advanceTimersByTime(2000); // triggers endCutscene
            expect(onComplete).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1000); // endCutscene's fade timeout
            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });
});
