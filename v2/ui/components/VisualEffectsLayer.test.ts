import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VisualEffectsLayer } from './VisualEffectsLayer';
import { EventBus } from '@core/EventBus';

const mockHTMLElement = {} as any;

const mockHTMLElement = {} as any;

const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock CodeRain since it's imported by VisualEffectsLayer
vi.mock('./CodeRain', () => ({
    CodeRain: vi.fn().mockImplementation(() => ({
        start: vi.fn(),
        stop: vi.fn(),
        destroy: vi.fn(),
    })),
}));

describe('VisualEffectsLayer', () => {
    let eventBus: EventBus;
    let targetContainer: HTMLElement;
    let overlayContainer: HTMLElement;

    beforeEach(() => {
        eventBus = new EventBus();
        targetContainer = document.createElement('div');
        overlayContainer = document.createElement('div');

        // Mock requestAnimationFrame for CodeRain fade-in logic
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0; });

        new VisualEffectsLayer(targetContainer, overlayContainer, eventBus);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should trigger shake effect (heavy) on event', () => {
        eventBus.emit('effect:shake', { intensity: 'heavy' });

        expect(targetContainer.classList.contains('effect-shake-heavy')).toBe(true);

        // Should remove after timeout (800ms)
        vi.advanceTimersByTime(800);
        expect(targetContainer.classList.contains('effect-shake-heavy')).toBe(false);
    });

    it('should trigger glitch effect on event', () => {
        eventBus.emit('effect:glitch', { intensity: 0.5 });

        expect(targetContainer.classList.contains('effect-glitch')).toBe(true);

        // Duration logic: Math.max(200, intensity * 1000) -> 500ms
        vi.advanceTimersByTime(500);
        expect(targetContainer.classList.contains('effect-glitch')).toBe(false);
    });

    it('should trigger flash effect on event', () => {
        eventBus.emit('effect:flash', { color: 'white', duration: 100 });

        const flash = overlayContainer.querySelector('.effect-flash-overlay');
        expect(flash).toBeTruthy();
        expect((flash as HTMLElement).style.background).toBe('white');

        // Should remove after duration + 50 -> 150ms
        vi.advanceTimersByTime(150);
        expect(overlayContainer.querySelector('.effect-flash-overlay')).toBeNull();
    });
});
