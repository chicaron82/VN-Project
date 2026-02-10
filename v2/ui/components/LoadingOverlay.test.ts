import { LoadingOverlay } from './LoadingOverlay';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    style: {},
    innerHTML: '',
    appendChild: vi.fn()
};
const mockRoot = { ...mockElement, appendChild: vi.fn() };

(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.getElementById = vi.fn((id) => id === 'root' ? mockRoot : null);

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('LoadingOverlay', () => {
    let instance: LoadingOverlay;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance and mount', () => {
            instance = new LoadingOverlay('root', mockEventBus as any);
            expect(instance).toBeDefined();
            expect(document.getElementById).toHaveBeenCalledWith('root');
            expect(mockRoot.appendChild).toHaveBeenCalled();
        });
    });

    describe('Core Functionality', () => {
        it('should show on event', () => {
            instance = new LoadingOverlay('root', mockEventBus as any);

            // Invoke handler
            const handler = mockEventBus.on.mock.calls.find((c: any) => c[0] === 'loading:start')[1];
            handler();

            expect(mockElement.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockElement.classList.add).toHaveBeenCalledWith('visible');
        });

        it('should hide after delay', () => {
            instance = new LoadingOverlay('root', mockEventBus as any);
            instance.show();

            instance.hide(); // Should not hide immediately if too fast
            vi.advanceTimersByTime(100);
            expect(mockElement.classList.add).not.toHaveBeenCalledWith('hidden');

            vi.advanceTimersByTime(800); // Advance past min time
            expect(mockElement.classList.add).toHaveBeenCalledWith('hidden');
        });
    });
});
