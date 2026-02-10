import { TutorialController } from './TutorialController';
import type { StateManager } from '../core/StateManager';

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

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock StateManager
const mockStateManager = {
    get: vi.fn().mockReturnValue([]), // Return empty array for seen tutorials
    set: vi.fn()
} as unknown as StateManager;

describe('TutorialController', () => {
    let instance: TutorialController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new TutorialController(mockEventBus as any, mockStateManager);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should initialize with default values', () => {
            instance = new TutorialController(mockEventBus as any, mockStateManager);
            expect(instance).toBeInstanceOf(TutorialController);
        });

        it('should setup listeners', () => {
            instance = new TutorialController(mockEventBus as any, mockStateManager);
            expect(mockEventBus.on).toHaveBeenCalledWith('dialog:show', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:pause_toggle', expect.any(Function));
        });
    });

    describe('Core Functionality', () => {
        it('should trigger swipe tutorial', () => {
            instance = new TutorialController(mockEventBus as any, mockStateManager);
            // Simulate dialog showing
            const callback = mockEventBus.on.mock.calls.find(call => call[0] === 'dialog:show')?.[1];
            expect(callback).toBeDefined();
            callback && callback();

            // Should modify DOM
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(document.body.appendChild).toHaveBeenCalled();
        });
    });
});
