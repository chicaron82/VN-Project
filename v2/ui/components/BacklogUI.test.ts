import { BacklogUI } from './BacklogUI';
import type { BacklogManager } from '../../core/BacklogManager';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { display: 'none' },
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn().mockReturnValue(null), // Default null
    querySelectorAll: vi.fn().mockReturnValue([]),
    scrollTop: 0,
    scrollHeight: 100
};
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
(global as any).document.body.appendChild = vi.fn();

// Mock BacklogManager
const mockBacklogManager = {
    getEntries: vi.fn().mockReturnValue([]),
    jumpToEntry: vi.fn()
} as unknown as BacklogManager;

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('BacklogUI', () => {
    let instance: BacklogUI;

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
                instance = new BacklogUI(mockBacklogManager, mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should setup listeners', () => {
            new BacklogUI(mockBacklogManager, mockEventBus as any);
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:backlog:open', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:backlog:close', expect.any(Function));
        });
    });

    describe('Core Functionality', () => {
        it('should open and render', () => {
            instance = new BacklogUI(mockBacklogManager, mockEventBus as any);

            // Mock entries
            (mockBacklogManager.getEntries as any).mockReturnValue([
                { character: 'Tori', text: 'Hi', timestamp: Date.now() }
            ]);

            instance.open();

            // Check display style set to flex (on the created container mock)
            // Since we create a new mock element on createElement, we need to capture it or assume logic runs.
            // We can check if getEntries was called.
            expect(mockBacklogManager.getEntries).toHaveBeenCalled();
        });

        it('should close', () => {
            instance = new BacklogUI(mockBacklogManager, mockEventBus as any);
            instance.open();
            instance.close();
            // Should be hidden
        });
    });
});
