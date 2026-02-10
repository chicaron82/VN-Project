/**
 * Typing Effect Tests
 * Tests for hacker-style typing animation on subtitle
 */
import { initTypingEffect } from './typing-effect';

describe('initTypingEffect', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should do nothing when subtitle element is missing', () => {
        expect(() => initTypingEffect()).not.toThrow();
    });

    it('should clear subtitle text initially', () => {
        document.body.innerHTML = '<div class="hero-banner-subtitle">Hello World</div>';
        initTypingEffect();
        const el = document.querySelector('.hero-banner-subtitle');
        expect(el?.textContent).toBe('');
    });

    it('should set opacity to 1', () => {
        document.body.innerHTML = '<div class="hero-banner-subtitle">Hello</div>';
        initTypingEffect();
        const el = document.querySelector('.hero-banner-subtitle') as HTMLElement;
        expect(el.style.opacity).toBe('1');
    });

    it('should type characters one by one after delay', () => {
        document.body.innerHTML = '<div class="hero-banner-subtitle">Hi</div>';
        initTypingEffect();
        const el = document.querySelector('.hero-banner-subtitle');

        // Initially cleared
        expect(el?.textContent).toBe('');

        // Advance past initial 800ms delay
        vi.advanceTimersByTime(800);
        expect(el?.textContent).toBe('H');

        // Advance 50ms for next char
        vi.advanceTimersByTime(50);
        expect(el?.textContent).toBe('Hi');
    });

    it('should add typing-done class and cursor when complete', () => {
        document.body.innerHTML = '<div class="hero-banner-subtitle">AB</div>';
        initTypingEffect();
        const el = document.querySelector('.hero-banner-subtitle') as HTMLElement;

        // 800ms delay + 50ms * 2 chars = 900ms total
        vi.advanceTimersByTime(800); // first char
        vi.advanceTimersByTime(50);  // second char
        vi.advanceTimersByTime(50);  // completion handler

        expect(el.classList.contains('typing-done')).toBe(true);
        expect(el.style.borderRight).toContain('3px solid');
    });

    it('should handle empty subtitle text', () => {
        document.body.innerHTML = '<div class="hero-banner-subtitle"></div>';
        initTypingEffect();
        const el = document.querySelector('.hero-banner-subtitle') as HTMLElement;

        vi.advanceTimersByTime(900);
        expect(el.classList.contains('typing-done')).toBe(true);
    });
});
