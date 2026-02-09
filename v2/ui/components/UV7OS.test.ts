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
    dataset: {},
    getBoundingClientRect: vi.fn().mockReturnValue({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
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
    removeEventListener: vi.fn(),
    setInterval: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn(),
    location: { hostname: 'localhost', pathname: '/', origin: 'http://localhost' },
    innerWidth: 1000,
    innerHeight: 500,
    pageYOffset: 0,
    scrollTo: vi.fn()
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

    describe('Public API (Orchestrator Pattern)', () => {
        it('should expose toggleSidebar method', () => {
            const os = new UV7OS('landing', {});
            expect(typeof os.toggleSidebar).toBe('function');
        });

        it('should expose jumpToSection method', () => {
            const os = new UV7OS('showcase', {});
            expect(typeof os.jumpToSection).toBe('function');
        });

        it('should expose showBootToastPublic method', () => {
            const os = new UV7OS('landing', {});
            expect(typeof os.showBootToastPublic).toBe('function');
        });

        it('should expose cleanup method', () => {
            const os = new UV7OS('showcase', {});
            expect(typeof os.cleanup).toBe('function');
        });
    });

    describe('Module Integration', () => {
        it('should initialize all modules for showcase context', () => {
            const entries = [{ id: 'test-1', title: 'Test Entry' }];
            const os = new UV7OS('showcase', { entries });

            // Should not throw during module initialization
            expect(os).toBeDefined();
        });

        it('should initialize all modules for landing context', () => {
            const os = new UV7OS('landing', {});

            // Should not throw during module initialization
            expect(os).toBeDefined();
        });

        it('should handle cleanup without errors', () => {
            const os = new UV7OS('showcase', {});
            expect(() => os.cleanup()).not.toThrow();
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain same interface as pre-refactor version', () => {
            const os = new UV7OS('showcase', {});

            // Critical public methods must exist
            expect(os.toggleSidebar).toBeDefined();
            expect(os.jumpToSection).toBeDefined();
            expect(os.showBootToastPublic).toBeDefined();

            // Should be callable
            expect(() => os.toggleSidebar()).not.toThrow();
            expect(() => os.jumpToSection('test-section')).not.toThrow();
            expect(() => os.showBootToastPublic()).not.toThrow();
        });
    });
});
