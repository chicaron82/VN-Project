/**
 * InputController Tests
 * Tests for keyboard shortcuts and user input handling
 */
import { InputController } from './InputController';

// Mock Logger
vi.mock('../utils/Logger', () => ({
    Logger: { input: vi.fn(), system: vi.fn(), ui: vi.fn() }
}));

// Mock GameConfig
vi.mock('../core/GameConfig', () => ({
    GameConfig: {
        SAVE: { QUICKSAVE_SLOT: 9 }
    }
}));

describe('InputController', () => {
    let eventBus: any;
    let saveSystem: any;
    let dialogController: any;
    let dialogBubble: any;
    let isPaused: boolean;
    let controller: InputController;

    beforeEach(() => {
        isPaused = false;

        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
        };

        saveSystem = {
            saveGame: vi.fn().mockResolvedValue(true),
            loadGame: vi.fn().mockResolvedValue(true),
            hasSlot: vi.fn().mockReturnValue(true),
        };

        dialogController = {
            handleClick: vi.fn(),
        };

        dialogBubble = {
            isVisible: vi.fn().mockReturnValue(false),
            hide: vi.fn(),
        };

        controller = new InputController(
            eventBus,
            saveSystem,
            dialogController,
            dialogBubble,
            () => isPaused
        );
    });

    it('should initialize without errors', () => {
        expect(() => controller.setup()).not.toThrow();
    });

    it('should register haptic feedback handlers on setup', () => {
        controller.setup();

        expect(eventBus.on).toHaveBeenCalledWith('ui:click', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('ui:confirm', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('ui:denied', expect.any(Function));
    });

    it('should advance dialog on space when not paused and bubble hidden', () => {
        controller.setup();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

        expect(dialogController.handleClick).toHaveBeenCalled();
    });

    it('should not advance dialog when paused', () => {
        isPaused = true;
        controller.setup();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

        expect(dialogController.handleClick).not.toHaveBeenCalled();
    });

    it('should hide bubble and emit advance when bubble is visible', () => {
        dialogBubble.isVisible.mockReturnValue(true);
        controller.setup();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(dialogBubble.hide).toHaveBeenCalled();
        expect(eventBus.emit).toHaveBeenCalledWith('dialog:advance', {});
    });

    it('should handle Enter key same as Space', () => {
        controller.setup();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(dialogController.handleClick).toHaveBeenCalled();
    });
});
