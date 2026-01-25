import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MobileUXController } from './MobileUXController';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn(),
    scrollHeight: 100, // Needed for scroll logic?
    clientHeight: 50,
    scrollTop: 0
};
// Circular refs
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).document.querySelector = vi.fn().mockReturnValue(mockElement);

// Safe Mock for documentElement
if (global.document) {
    if (global.document.documentElement) {
        // Option 1: Mock methods on existing element if possible
        // But mockElement has specific properties like scrollHeight that might be read only on real DOM
        // So we might want to replace it.
        Object.defineProperty(global.document, 'documentElement', {
            value: mockElement,
            configurable: true,
            writable: true
        });
    } else {
        (global as any).document.documentElement = mockElement;
    }
}
(global as any).document.addEventListener = vi.fn();
(global as any).window = { innerWidth: 1000, innerHeight: 500 };

// Mock MutationObserver
(global as any).MutationObserver = class {
    observe() { }
    disconnect() { }
};

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('MobileUXController', () => {
    let instance: MobileUXController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new MobileUXController(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should setup listeners', () => {
            instance = new MobileUXController(mockEventBus as any);
            expect(mockEventBus.on).toHaveBeenCalledWith('input:swipe_left', expect.any(Function));
        });

        it('should handle swipe right (advance)', () => {
            instance = new MobileUXController(mockEventBus as any);
            // Mock gameplay active
            (document.getElementById as any).mockReturnValue(mockElement);

            // Trigger callback
            const callback = mockEventBus.on.mock.calls.find(call => call[0] === 'input:swipe_right')?.[1];
            expect(callback).toBeDefined();
            callback && callback();

            expect(mockEventBus.emit).toHaveBeenCalledWith('dialog:advance', expect.anything());
        });
    });
});
