import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Sidebar } from './Sidebar';

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
    closest: vi.fn(),
    dataset: {},
    offsetWidth: 200
};
mockElement.querySelector.mockReturnValue(mockElement); // Default return self

(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement }); // New instance
(global as any).document.body.appendChild = vi.fn();
(global as any).document.addEventListener = vi.fn();
(global as any).navigator.vibrate = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockStateManager = {
    get: vi.fn((key) => {
        if (key === 'currentRoute') return 'ronnie';
        return null;
    }),
    set: vi.fn(),
    subscribe: vi.fn()
};

const mockCollectiblesSystem = {
    getTotalCountForRoute: vi.fn().mockReturnValue(10),
    getCollectedCountForRoute: vi.fn().mockReturnValue(5)
};

describe('Sidebar', () => {
    let instance: Sidebar;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new Sidebar(mockEventBus as any, mockStateManager as any, mockCollectiblesSystem as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should open sidebar', () => {
            instance = new Sidebar(mockEventBus as any, mockStateManager as any, mockCollectiblesSystem as any);
            instance.open();

            expect(mockElement.classList.add).toHaveBeenCalledWith('visible'); // Container
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:sidebar:opened', {});
        });

        it('should close sidebar', () => {
            instance = new Sidebar(mockEventBus as any, mockStateManager as any, mockCollectiblesSystem as any);
            instance.open(); // Open first
            instance.close();

            expect(mockElement.classList.remove).toHaveBeenCalledWith('visible');
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:sidebar:closed', {});
        });

        it('should toggle sidebar', () => {
            instance = new Sidebar(mockEventBus as any, mockStateManager as any, mockCollectiblesSystem as any);
            instance.toggle(); // Open
            expect(mockElement.classList.add).toHaveBeenCalledWith('visible');

            instance.toggle(); // Close
            expect(mockElement.classList.remove).toHaveBeenCalledWith('visible');
        });
    });
});
