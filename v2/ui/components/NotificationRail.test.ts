import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationRail } from './NotificationRail';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    insertBefore: vi.fn(),
    firstChild: null,
    querySelector: vi.fn(),
    remove: vi.fn(),
    dataset: {}
};
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
// Use spyOn instead of assignment for read-only properties
const appendSpy = vi.fn();
if (global.document && global.document.head) {
    vi.spyOn(global.document.head, 'appendChild').mockImplementation(appendSpy);
}

(global as any).document.body.appendChild = vi.fn();
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).requestAnimationFrame = vi.fn().mockImplementation(cb => cb());

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('NotificationRail', () => {
    let instance: NotificationRail;

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
                instance = new NotificationRail(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show notification', () => {
            instance = new NotificationRail(mockEventBus as any);
            const config = {
                id: 'test',
                title: 'Test',
                message: 'Msg',
                icon: 'ICON',
                category: 'system' as any,
                priority: 'normal' as any,
                timestamp: Date.now()
            };
            instance.show(config);
        });

        it('should dismiss notification', () => {
            instance = new NotificationRail(mockEventBus as any);
            instance.show({ id: 'test', title: 'T', message: 'M', icon: 'I', category: 'system', priority: 'normal', timestamp: Date.now() });

            instance.dismiss('test');
            vi.advanceTimersByTime(300 + 50);
        });
    });
});
