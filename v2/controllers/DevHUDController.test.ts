import { DevHUDController, GameInstance } from './DevHUDController';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { display: 'none' },
    innerHTML: '',
    textContent: ''
};
(global as any).document.getElementById = vi.fn().mockReturnValue(mockElement);
(global as any).window = { setInterval: vi.fn(), clearInterval: vi.fn() };

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock GameInstance
const mockGame: GameInstance = {
    uiController: {
        devHud: mockElement as any
    },
    currentRoute: {
        constructor: { name: 'TestRoute' },
        currentAct: 1
    },
    currentScene: 'TestScene',
    currentPageIndex: 0,
    tetherSystem: {
        tetherLevel: 50
    },
    settingsManager: {
        settings: {
            tetherDifficulty: 'normal'
        }
    },
    gameState: {
        flags: { test: true }
    },
    loopVersion: 848,
    loadTime: 100,
    assetsLoaded: 10
};

describe('DevHUDController', () => {
    let instance: DevHUDController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new DevHUDController(mockGame, mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should toggle visibility', () => {
            instance = new DevHUDController(mockGame, mockEventBus as any);

            instance.toggle();
            expect(mockElement.style.display).toBe('block');
            expect(instance.isActive()).toBe(true);

            instance.toggle();
            expect(mockElement.style.display).toBe('none');
            expect(instance.isActive()).toBe(false);
        });

        it('should update HUD fields', () => {
            instance = new DevHUDController(mockGame, mockEventBus as any);
            instance.toggle(); // Activate to allow updates

            instance.update();

            // Check if getElementById was called for fields
            expect(document.getElementById).toHaveBeenCalledWith('hud-route');
            expect(document.getElementById).toHaveBeenCalledWith('hud-tether');
        });
    });
});
