/**
 * Performance Utils Tests
 * Tests for lazy loading and performance optimizations
 */
import { initPerformanceOptimizations, showcasePerformance } from './performance';

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { system: vi.fn(), ui: vi.fn() }
}));

// Mock IntersectionObserver (not available in jsdom)
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();
(global as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve,
}));

describe('Performance Optimizations', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        mockObserve.mockClear();
    });

    describe('initPerformanceOptimizations', () => {
        it('should initialize without errors', () => {
            expect(() => initPerformanceOptimizations()).not.toThrow();
        });
    });

    describe('showcasePerformance.initLazyLoading', () => {
        it('should process images with data-src', () => {
            document.body.innerHTML = '<img data-src="test.jpg" />';

            showcasePerformance.initLazyLoading();

            const img = document.querySelector('img');
            // Either native lazy loading sets src directly, or observer is set up
            const hasSrc = img?.getAttribute('src') === 'test.jpg';
            const hasObserver = mockObserve.mock.calls.length > 0;
            expect(hasSrc || hasObserver).toBe(true);
        });

        it('should handle multiple images', () => {
            document.body.innerHTML = `
                <img data-src="a.jpg" />
                <img data-src="b.jpg" />
                <img data-src="c.jpg" />
            `;

            showcasePerformance.initLazyLoading();

            // All images should be either loaded or observed
            const images = document.querySelectorAll('img');
            const loadedCount = Array.from(images).filter(img => img.getAttribute('src')).length;
            const observedCount = mockObserve.mock.calls.length;
            expect(loadedCount + observedCount).toBeGreaterThanOrEqual(3);
        });

        it('should not affect images without data-src', () => {
            document.body.innerHTML = '<img src="existing.jpg" />';

            showcasePerformance.initLazyLoading();

            const img = document.querySelector('img');
            expect(img?.getAttribute('src')).toBe('existing.jpg');
        });
    });

    describe('showcasePerformance.deferNonCriticalScripts', () => {
        it('should run without errors', () => {
            expect(() => showcasePerformance.deferNonCriticalScripts()).not.toThrow();
        });
    });
});
