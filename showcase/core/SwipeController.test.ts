/**
 * SwipeController Tests
 * Tests for horizontal swipe gesture handling
 */

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { ui: vi.fn(), system: vi.fn() }
}));

import { SwipeController } from './SwipeController';

describe('SwipeController', () => {
    let mockTabController: any;
    let container: HTMLElement;

    beforeEach(() => {
        mockTabController = {
            getCurrentTabIndex: vi.fn().mockReturnValue(0),
            getTotalTabs: vi.fn().mockReturnValue(5),
            previousTab: vi.fn(),
            nextTab: vi.fn(),
        };
        container = document.createElement('div');
        document.body.appendChild(container);

        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should initialize without errors', () => {
        expect(() => new SwipeController(mockTabController, container)).not.toThrow();
    });

    it('should add dragging class on touch start', () => {
        new SwipeController(mockTabController, container);

        const touchEvent = new TouchEvent('touchstart', {
            touches: [{ clientX: 100, clientY: 200 } as Touch],
        });
        container.dispatchEvent(touchEvent);

        expect(container.classList.contains('dragging')).toBe(true);
    });

    it('should not start swipe on carousel elements', () => {
        new SwipeController(mockTabController, container);

        const carouselCard = document.createElement('div');
        carouselCard.className = 'hero-carousel-card';
        container.appendChild(carouselCard);

        const touchEvent = new TouchEvent('touchstart', {
            touches: [{ clientX: 100, clientY: 200 } as Touch],
        });
        Object.defineProperty(touchEvent, 'target', { value: carouselCard });
        container.dispatchEvent(touchEvent);

        // Should NOT add dragging class for carousel elements
        expect(container.classList.contains('dragging')).toBe(false);
    });

    it('should keep dragging class on touchend without move (reset only clears state)', () => {
        // When user taps without dragging, isDragging stays false
        // so handleTouchEnd does early return via reset() without removing 'dragging' class
        new SwipeController(mockTabController, container);

        container.dispatchEvent(new TouchEvent('touchstart', {
            touches: [{ clientX: 100, clientY: 200 } as Touch],
        }));
        expect(container.classList.contains('dragging')).toBe(true);

        container.dispatchEvent(new TouchEvent('touchend', {
            changedTouches: [{ clientX: 100, clientY: 200 } as Touch],
        }));

        // dragging stays because isDragging was never set (no touchmove)
        expect(container.classList.contains('dragging')).toBe(true);
    });
});
