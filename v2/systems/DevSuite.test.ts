import { DevSuite, GameInstance } from './DevSuite';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { width: '0px' },
    querySelector: vi.fn().mockReturnValue({ getBoundingClientRect: vi.fn(), style: {} }),
    querySelectorAll: vi.fn().mockReturnValue([]),
    appendChild: vi.fn(),
    dataset: {},
    focus: vi.fn(),
    value: ''
};
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();
(global as any).document.getElementById = vi.fn().mockReturnValue(mockElement);
(global as any).document.querySelectorAll = vi.fn().mockReturnValue([]);

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn().mockReturnValue(JSON.stringify({ lastActiveTab: 'debug' })),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock GameInstance
const mockGame: GameInstance = {
    currentRoute: { name: 'Test Route', tetherSystem: { tetherLevel: 100 } },
    currentScene: 'test_scene',
    gameState: { flags: {} },
    autoAdvance: false,
    stopAtChoice: false,
    tutorialManager: { shownTutorials: new Set() }
};

describe('DevSuite', () => {
    let instance: DevSuite;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset singleton-like behavior if any (DevSuite seems to cache DOM elements)
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new DevSuite(mockGame);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should initialize with default values', () => {
            instance = new DevSuite(mockGame);
            expect(instance).toBeInstanceOf(DevSuite);
        });
    });

    describe('Core Functionality', () => {
        it('should toggle visibility', () => {
            instance = new DevSuite(mockGame);
            instance.toggle(); // Open
            // Expect overlay to show (removed class 'hidden')
            expect(mockElement.classList.remove).toHaveBeenCalledWith('hidden');

            instance.toggle(); // Close
            expect(mockElement.classList.add).toHaveBeenCalledWith('hidden');
        });
    });
});
