import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VisualEffectsLayer } from './VisualEffectsLayer';
import { EventBus } from '@core/EventBus';

describe('VisualEffectsLayer', () => {
    let eventBus: EventBus;
    let container: HTMLElement;
    let overlay: HTMLElement;

    beforeEach(() => {
        eventBus = new EventBus();
        container = document.createElement('div');
        overlay = document.createElement('div');
        new VisualEffectsLayer(container, overlay, eventBus);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should apply glitch class on effect:glitch', () => {
        eventBus.emit('effect:glitch', { intensity: 0.5 });
        expect(container.classList.contains('effect-glitch')).toBe(true);

        vi.advanceTimersByTime(600);
        expect(container.classList.contains('effect-glitch')).toBe(false);
    });

    it('should apply shake class on effect:shake', () => {
        eventBus.emit('effect:shake', { intensity: 'heavy' });
        expect(container.classList.contains('effect-shake-heavy')).toBe(true);

        vi.advanceTimersByTime(900);
        expect(container.classList.contains('effect-shake-heavy')).toBe(false);
    });

    it('should create flash overlay on effect:flash', () => {
        eventBus.emit('effect:flash', { color: 'white', duration: 100 });

        const flash = overlay.querySelector('.effect-flash-overlay');
        expect(flash).toBeTruthy();
        if (flash) {
            expect((flash as HTMLElement).style.background).toBe('white');
        }

        vi.advanceTimersByTime(200);
        expect(overlay.querySelector('.effect-flash-overlay')).toBeFalsy();
    });
});
