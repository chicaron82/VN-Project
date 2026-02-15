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

    it('should NOT advance dialog when Enter is pressed in an input field', () => {
        controller.setup();

        // Create an input element and focus it
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        // Dispatch keydown event FROM the input element
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        input.dispatchEvent(event);

        expect(dialogController.handleClick).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(input);
    });

    it('should NOT advance dialog when Space is pressed in a textarea', () => {
        controller.setup();

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.focus();

        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        textarea.dispatchEvent(event);

        expect(dialogController.handleClick).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(textarea);
    });

    it('should NOT advance dialog when settings overlay is open', () => {
        controller.setup();

        // Simulate settings menu being open
        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'settings-menu';
        settingsMenu.style.display = 'block';
        document.body.appendChild(settingsMenu);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(dialogController.handleClick).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(settingsMenu);
    });

    it('should NOT advance dialog when backlog overlay is open', () => {
        controller.setup();

        const backlog = document.createElement('div');
        backlog.id = 'backlog-overlay';
        backlog.style.display = 'flex';
        document.body.appendChild(backlog);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

        expect(dialogController.handleClick).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(backlog);
    });

    it('should NOT advance dialog when dev console is open', () => {
        controller.setup();

        const devConsole = document.createElement('div');
        devConsole.id = 'dev-console';
        devConsole.style.display = 'block';
        document.body.appendChild(devConsole);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(dialogController.handleClick).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(devConsole);
    });
});
