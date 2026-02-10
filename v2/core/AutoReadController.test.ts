import { AutoReadController } from './AutoReadController';
import { SettingsSystem } from '../systems/SettingsSystem';

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock SettingsSystem
const mockSettingsSystem = {
    get: vi.fn().mockReturnValue(true) // Default to enabled
} as unknown as SettingsSystem;

describe('AutoReadController', () => {
    let instance: AutoReadController;

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
                instance = new AutoReadController(mockEventBus as any, mockSettingsSystem);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });

        it('should setup listeners', () => {
            new AutoReadController(mockEventBus as any, mockSettingsSystem);
            expect(mockEventBus.on).toHaveBeenCalledWith('dialog:complete', expect.any(Function));
            expect(mockEventBus.on).toHaveBeenCalledWith('dialog:show', expect.any(Function));
        });
    });

    describe('Core Functionality', () => {
        it('should start timer on dialog complete', () => {
            instance = new AutoReadController(mockEventBus as any, mockSettingsSystem);
            // Mock settings
            (mockSettingsSystem.get as any).mockReturnValueOnce(true).mockReturnValueOnce(1000); // Enabled, 1000ms delay

            // Trigger dialog:complete
            const callback = mockEventBus.on.mock.calls.find(call => call[0] === 'dialog:complete')?.[1];
            expect(callback).toBeDefined();
            callback && callback();

            // Fast forward
            vi.advanceTimersByTime(1000);

            expect(mockEventBus.emit).toHaveBeenCalledWith('dialog:advance', { source: 'auto-read' });
        });
    });
});
