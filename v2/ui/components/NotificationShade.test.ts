import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationShade } from './NotificationShade';

// Mock mockElement to support querySelector returning another mock
const createMockElement = () => ({
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { display: 'none', transform: '', opacity: '' },
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn(), // Will link circular if needed or return null
    querySelectorAll: vi.fn().mockReturnValue([]),
    dataset: {}
});

const mockContainer = createMockElement();
// Make querySelector return a mock element for children searches
mockContainer.querySelector.mockImplementation(() => createMockElement());

(global as any).document.createElement = vi.fn().mockReturnValue(mockContainer);
(global as any).document.body.appendChild = vi.fn();
(global as any).document.addEventListener = vi.fn(); // For keydown

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('NotificationShade', () => {
    let instance: NotificationShade;

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
                instance = new NotificationShade(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should open shade', () => {
            instance = new NotificationShade(mockEventBus as any);
            instance.open();
            expect(mockContainer.classList.add).toHaveBeenCalledWith('visible');
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:shade:opened', {});
        });

        it('should toggle screenshot mode', () => {
            instance = new NotificationShade(mockEventBus as any);
            instance.toggleScreenshotMode();
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:hide_status_bar', {});

            instance.toggleScreenshotMode();
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:show_status_bar', {});
        });
    });
});
