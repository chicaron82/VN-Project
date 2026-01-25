import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BacklogManager } from './BacklogManager';
import { StateManager } from './StateManager';

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock StateManager
const mockStateManager = {
    get: vi.fn(),
    set: vi.fn()
} as unknown as StateManager;

describe('BacklogManager', () => {
    let instance: BacklogManager;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new BacklogManager(mockEventBus as any, mockStateManager);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should initialize with default values', () => {
            instance = new BacklogManager(mockEventBus as any, mockStateManager);
            expect(instance).toBeInstanceOf(BacklogManager);
        });
    });

    describe('Core Functionality', () => {
        it('should add entry on dialog show', () => {
            instance = new BacklogManager(mockEventBus as any, mockStateManager);

            // Trigger dialog:show
            const callback = mockEventBus.on.mock.calls.find(call => call[0] === 'dialog:show')?.[1];
            expect(callback).toBeDefined();

            const entryData = { character: 'Tori', text: 'Hello' };
            callback && callback({ entry: entryData });

            const entries = instance.getEntries();
            expect(entries.length).toBe(1);
            expect(entries[0].text).toBe('Hello');
            expect(entries[0].character).toBe('Tori');
        });
    });
});
