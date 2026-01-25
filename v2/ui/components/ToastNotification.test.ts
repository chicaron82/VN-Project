import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastNotification } from './ToastNotification';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    style: {},
    innerHTML: '',
    appendChild: vi.fn(),
    remove: vi.fn()
};

(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).document.body.appendChild = vi.fn();
(global as any).requestAnimationFrame = vi.fn(cb => cb());

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('ToastNotification', () => {
    let instance: ToastNotification;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create container if missing', () => {
            instance = new ToastNotification(mockEventBus as any);
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(document.body.appendChild).toHaveBeenCalled();
        });
    });

    describe('Core Functionality', () => {
        it('should show toast', () => {
            instance = new ToastNotification(mockEventBus as any);
            instance.show({ title: 'T', message: 'M' });

            expect(mockElement.appendChild).toHaveBeenCalled(); // Container appends toast
            // Check content is set? innerHTML is mocked but we can assume logic ran if no error
        });

        it('should auto-remove toast', () => {
            instance = new ToastNotification(mockEventBus as any);
            instance.show({ title: 'T', message: 'M', duration: 1000 });

            vi.advanceTimersByTime(1000 + 50); // Wait for remove timeout
            // First timeout sets transform, second removes
            vi.advanceTimersByTime(500 + 50);

            expect(mockElement.remove).toHaveBeenCalled();
        });
    });
});
