import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AchievementToast } from './AchievementToast';

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
(global as any).document.body.appendChild = vi.fn();
(global as any).navigator.vibrate = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('AchievementToast', () => {
    let instance: AchievementToast;

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
                instance = new AchievementToast(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show toast', () => {
            instance = new AchievementToast(mockEventBus as any);

            instance.show({ title: 'Test', description: 'Desc', icon: '🏆' });

            expect(document.createElement).toHaveBeenCalledWith('div');
            // Check calling appendChild on the container (which was created in constructor)
            // We need to verify the container was created first, which happens in constructor.
            // Since we reuse mockElement for all createCalls, checking if appendChild was called twice 
            // (once for container to body, once for toast to container) is a proxy.

            expect(document.body.appendChild).toHaveBeenCalled(); // Container to body
            // Since all createElements return the SAME mock object in this simple mock schema,
            // calling appendChild on 'this.container' is calling it on the same mock object 
            // as document.createElement returned.
            // We can verify calls on the mock object.

            // Fast forward to verify removal
            vi.advanceTimersByTime(5000 + 1000);
            expect(mockElement.remove).toHaveBeenCalled();
        });
    });
});
