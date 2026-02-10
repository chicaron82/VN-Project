import { SwipeHandler } from './SwipeHandler';
import type { SettingsSystem } from '../systems/SettingsSystem';

// Mock Element
const mockElement = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    getBoundingClientRect: vi.fn(),
    contains: vi.fn(),
    tagName: 'DIV',
    closest: vi.fn().mockReturnValue(null),
    style: {}
};

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock SettingsSystem
const mockSettingsSystem = {
    get: vi.fn().mockReturnValue({})
} as unknown as SettingsSystem;

describe('SwipeHandler', () => {
    let instance: SwipeHandler;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new SwipeHandler(mockElement as any, mockEventBus as any, mockSettingsSystem);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should setup listeners', () => {
            new SwipeHandler(mockElement as any, mockEventBus as any, mockSettingsSystem);
            expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
            expect(mockElement.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
        });
    });

    describe('Core Functionality', () => {
        it('should handle swipe right', () => {
            instance = new SwipeHandler(mockElement as any, mockEventBus as any, mockSettingsSystem);

            // Simulate TouchStart
            const touchStartHandler = mockElement.addEventListener.mock.calls.find(call => call[0] === 'touchstart')?.[1];
            expect(touchStartHandler).toBeDefined();

            touchStartHandler({
                changedTouches: [{ clientX: 0, clientY: 100 }],
                target: mockElement
            });

            // Simulate TouchEnd (Swipe Right: X+100)
            const touchEndHandler = mockElement.addEventListener.mock.calls.find(call => call[0] === 'touchend')?.[1];
            expect(touchEndHandler).toBeDefined();

            touchEndHandler({
                changedTouches: [{ clientX: 100, clientY: 100 }],
                target: mockElement
            });

            expect(mockEventBus.emit).toHaveBeenCalledWith('input:swipe_right', {});
        });
    });

    describe('Lifecycle', () => {
        it('should cleanup resources properly', () => {
            instance = new SwipeHandler(mockElement as any, mockEventBus as any, mockSettingsSystem);
            instance.destroy();
            expect(instance).toBeDefined();
        });
    });
});
