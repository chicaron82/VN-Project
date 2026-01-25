import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UV7OS } from './UV7OS';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn().mockImplementation(() => mockElement),
    querySelectorAll: vi.fn().mockReturnValue([]),
    dataset: {}
};
(global as any).document.getElementById = vi.fn().mockReturnValue(mockElement);
(global as any).document.querySelector = vi.fn().mockReturnValue(mockElement);
(global as any).document.querySelectorAll = vi.fn().mockReturnValue([]);

// Use spyOn for body methods/props
if (global.document && global.document.body) {
    // Cannot spy on property value easily on existing object unless configurable
    // Just avoid assigning to dataset. The mock element already has dataset: {} on children.
    // If UV7OS accesses document.body.dataset, it accesses the real one (empty DOMStringMap).
    // We can define property if helpful
    // Object.defineProperty(document.body, 'dataset', { value: {}, configurable: true });
}
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement, style: {} });
(global as any).document.body.appendChild = vi.fn();

(global as any).window = {
    addEventListener: vi.fn(),
    setInterval: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn(),
    location: { hostname: 'localhost', pathname: '/', origin: 'http://localhost' },
    innerWidth: 1000,
    innerHeight: 500
};

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('UV7OS', () => {
    let instance: UV7OS;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance for landing context', () => {
            expect(() => typeTest('landing')).not.toThrow();
        });

        it('should create an instance for showcase context', () => {
            expect(() => typeTest('showcase')).not.toThrow();
        });
    });

    function typeTest(context: 'landing' | 'showcase') {
        const os = new UV7OS(context, {});
        expect(os).toBeDefined();
    }

    describe('Sidebar Controls', () => {
        it('should toggle sidebar', () => {
            const os = new UV7OS('landing', {});

            // Mock sidebar closed initially
            mockElement.classList.contains.mockReturnValue(false);

            os.toggleSidebar();
            expect(mockElement.classList.add).toHaveBeenCalledWith('open');

            // Mock sidebar open
            mockElement.classList.contains.mockReturnValue(true);
            os.toggleSidebar();
            expect(mockElement.classList.remove).toHaveBeenCalledWith('open');
        });
    });
});
