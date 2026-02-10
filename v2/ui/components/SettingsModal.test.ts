import { SettingsModal } from './SettingsModal';

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
    dataset: {},
    value: ''
};
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
(global as any).document.body.appendChild = vi.fn();

// Safe Mocking for documentElement
if (global.document && global.document.documentElement) {
    (global.document.documentElement as any).requestFullscreen = vi.fn();
}
(global as any).document.exitFullscreen = vi.fn();

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn().mockReturnValue('{}'),
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

const mockSettingsSystem = {
    set: vi.fn()
};

describe('SettingsModal', () => {
    let instance: SettingsModal;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        const mockBtn = { ...mockElement };
        mockElement.querySelectorAll.mockReturnValue([mockBtn]);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new SettingsModal(mockEventBus as any, mockSettingsSystem as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should load settings from localStorage', () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify({ textSpeed: 'fast' }));
            instance = new SettingsModal(mockEventBus as any, mockSettingsSystem as any);
            expect(localStorageMock.getItem).toHaveBeenCalledWith('gameSettings');
        });

        it('should save setting debounced', () => {
            instance = new SettingsModal(mockEventBus as any, mockSettingsSystem as any);
            (instance as any).setTextSpeed('instant');

            vi.advanceTimersByTime(300 + 50);
            expect(mockSettingsSystem.set).toHaveBeenCalledWith('textSpeed', 'instant');
            expect(localStorageMock.setItem).toHaveBeenCalled();
            expect(mockEventBus.emit).toHaveBeenCalledWith('settings:changed', { key: 'textSpeed', value: 'instant' });
        });
    });
});
