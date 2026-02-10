import { BootSequenceController } from './BootSequenceController';
import { GameEngine } from '@core/GameEngine';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { opacity: '1', width: '0%', transition: '' },
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn().mockReturnValue({
        style: {},
        classList: { add: vi.fn(), remove: vi.fn() },
        pause: vi.fn(),
        load: vi.fn(),
        play: vi.fn().mockResolvedValue(undefined),
        currentTime: 0,
        addEventListener: vi.fn()
    }),
    remove: vi.fn()
};
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.getElementById = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock GameEngine
const mockGameEngine = {
    // Add GameEngine methods if needed
} as unknown as GameEngine;

describe('BootSequenceController', () => {
    let instance: BootSequenceController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new BootSequenceController(mockEventBus as any, mockGameEngine);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should start sequence', async () => {
            instance = new BootSequenceController(mockEventBus as any, mockGameEngine);
            // Mock dynamic import
            vi.mock('@ui/components/BootSequence', () => ({
                BootSequence: class {
                    constructor(_el: any, _engine: any, _cb: any) { }
                    start() { return Promise.resolve(); }
                    skip() { }
                }
            }));

            // start() is async and complex, just verify it runs without error for now
            await expect(instance.start()).resolves.toBeUndefined();
        });
    });
});
