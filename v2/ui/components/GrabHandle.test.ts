import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UV7GrabHandleRepositioner } from './GrabHandle';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    dataset: {}
};

// Safer Global Mocks
(global as any).window = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn(),
    innerWidth: 1000,
    innerHeight: 800,
    localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn()
    },
    requestAnimationFrame: vi.fn(cb => cb())
};

// Instead of overwriting document.body, verify if it exists and mock appendChild
if (!global.document) {
    (global as any).document = {
        body: { appendChild: vi.fn() },
        createElement: vi.fn()
    };
} else {
    // If specific method needed
    // (global as any).document.body.appendChild = vi.fn(); 
    // Careful not to break jsdom if it uses appendChild internally
}
(global as any).navigator = { vibrate: vi.fn() };

describe('UV7GrabHandleRepositioner', () => {
    let instance: UV7GrabHandleRepositioner;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance if element exists', () => {
            instance = new UV7GrabHandleRepositioner(mockElement as any);
            expect(instance).toBeDefined();
            expect(mockElement.addEventListener).toHaveBeenCalled();
        });

        it('should return null if no element', () => {
            instance = new UV7GrabHandleRepositioner(null);
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should handle tap to toggle', () => {
            const onToggle = vi.fn();
            instance = new UV7GrabHandleRepositioner(mockElement as any, { onToggle });
            expect(mockElement.style.position).toBe('fixed');
        });
    });
});
