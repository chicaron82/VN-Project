import { MenuCarousel } from './MenuCarousel';

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
    querySelectorAll: vi.fn().mockReturnValue([]),
    remove: vi.fn(),
    offsetWidth: 400,
    dataset: {} // Fixed: Added dataset
};
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
(global as any).window = {
    innerWidth: 400, // Default portrait
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn()
};
(global as any).navigator = { vibrate: vi.fn() };

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('MenuCarousel', () => {
    let instance: MenuCarousel;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new MenuCarousel(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Mounting', () => {
        it('should mount in simple mode (portrait)', () => {
            instance = new MenuCarousel(mockEventBus as any);
            const parent = { ...mockElement, appendChild: vi.fn() } as any;

            (window as any).innerWidth = 400; // Portrait
            instance.mount(parent);

            expect(parent.appendChild).toHaveBeenCalled();
        });

        it('should switch mode on resize', () => {
            instance = new MenuCarousel(mockEventBus as any);
            const parent = { ...mockElement, appendChild: vi.fn() } as any;
            instance.mount(parent);

            // Resize to landscape
            (window as any).innerWidth = 1000;
            const resizeHandler = (window.addEventListener as any).mock.calls.find((c: any) => c[0] === 'resize')[1];
            expect(resizeHandler).toBeDefined();

            resizeHandler();
            vi.runAllTimers(); // Throttle
        });
    });
});
