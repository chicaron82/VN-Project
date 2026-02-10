import { AutoSaveManager } from './AutoSaveManager';
import { StateManager } from '../core/StateManager';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    remove: vi.fn()
};
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock StateManager
const mockStateManager = {
    get: vi.fn(),
    set: vi.fn(),
    exportState: vi.fn().mockReturnValue({}),
    importState: vi.fn()
} as unknown as StateManager;

// Mock SaveManager
const mockSaveManager = {
    autoSave: vi.fn().mockResolvedValue(undefined)
};

describe('AutoSaveManager', () => {
    let instance: AutoSaveManager;

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
                instance = new AutoSaveManager(mockEventBus as any, mockStateManager, mockSaveManager);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should setup listeners', () => {
            instance = new AutoSaveManager(mockEventBus as any, mockStateManager, mockSaveManager);
            expect(mockEventBus.on).toHaveBeenCalledWith('scene:loaded', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('choice:selected', expect.any(Function));
        });

        it('should trigger auto save', async () => {
            instance = new AutoSaveManager(mockEventBus as any, mockStateManager, mockSaveManager);
            await instance.forceSave();
            expect(mockSaveManager.autoSave).toHaveBeenCalled();
        });
    });
});
