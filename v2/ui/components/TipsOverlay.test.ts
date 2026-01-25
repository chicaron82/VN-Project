import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TipsOverlay } from './TipsOverlay';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), replace: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    remove: vi.fn()
};
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
(global as any).document.getElementById = vi.fn().mockReturnValue(mockElement); // Target exists

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('TipsOverlay', () => {
    let instance: TipsOverlay;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should verify event subscription', () => {
            new TipsOverlay(mockEventBus as any);
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:main_menu', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:start_game', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:route_select', expect.any(Function));
        });
    });

    describe('Core Functionality', () => {
        it('should mount when triggered', () => {
            instance = new TipsOverlay(mockEventBus as any);

            // Trigger main_menu
            const handler = mockEventBus.on.mock.calls.find((c: any) => c[0] === 'ui:main_menu')[1];
            handler();

            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(mockElement.appendChild).toHaveBeenCalled(); // container to target
        });

        it('should rotate tips', () => {
            instance = new TipsOverlay(mockEventBus as any);
            instance.mount();

            // Advance timer
            vi.advanceTimersByTime(8000 + 100);
            expect(mockElement.classList.replace).toHaveBeenCalled(); // fade-in/out
        });

        it('should unmount', () => {
            instance = new TipsOverlay(mockEventBus as any);
            instance.mount();
            instance.unmount();
            expect(mockElement.remove).toHaveBeenCalled();
        });
    });
});
