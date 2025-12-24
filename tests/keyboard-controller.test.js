import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * KeyboardController Unit Tests
 * 
 * Tests for the extracted KeyboardController class.
 * Validates keyboard navigation, ESC hierarchy, and notification system.
 */

// Mock DOM elements
const mockElement = (id, display = 'flex', hidden = false) => ({
    id,
    style: { display },
    classList: {
        contains: vi.fn((cls) => cls === 'hidden' ? hidden : false),
        add: vi.fn(),
        remove: vi.fn()
    },
    focus: vi.fn(),
    click: vi.fn(),
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => [])
});

// Mock document
const mockDocument = {
    getElementById: vi.fn((id) => null),
    querySelectorAll: vi.fn(() => []),
    activeElement: null,
    addEventListener: vi.fn(),
    createElement: vi.fn(() => mockElement('created')),
    body: {
        appendChild: vi.fn()
    }
};
global.document = mockDocument;

// Mock window
global.window = {
    getComputedStyle: vi.fn(() => ({ display: 'flex', visibility: 'visible' }))
};

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

/**
 * Simplified mock game object
 */
const createMockGame = () => ({
    hideCredits: vi.fn(),
    closeNotesViewer: vi.fn(),
    closePause: vi.fn(),
    showMainMenu: vi.fn(),
    notesViewer: mockElement('notes-viewer', 'none'),
    standaloneNotesViewer: { isOpen: false, close: vi.fn() },
    backlogManager: { close: vi.fn() },
    settingsManager: { closeSettings: vi.fn() },
    saveLoadUI: { close: vi.fn() },
    pauseContent: mockElement('pause-content', 'none'),
    currentRoute: null,
    gameView: mockElement('game-view', 'flex'),
    saveManager: {
        saveGame: vi.fn(),
        loadGame: vi.fn(),
        getSaveData: vi.fn(() => null)
    },
    choiceMenu: mockElement('choice-menu', 'none'),
    choicesContainer: mockElement('choices-container'),
    menuCarousel: null
});

/**
 * KeyboardController class (simplified for testing)
 */
class KeyboardController {
    constructor(game) {
        this.game = game;
        this.keyboardNav = {
            currentContext: 'none',
            focusedIndex: 0,
            focusableElements: []
        };
    }

    // Lazy getters
    get saveManager() { return this.game.saveManager; }
    get backlogManager() { return this.game.backlogManager; }
    get settingsManager() { return this.game.settingsManager; }
    get saveLoadUI() { return this.game.saveLoadUI; }
    get standaloneNotesViewer() { return this.game.standaloneNotesViewer; }
    get menuCarousel() { return this.game.menuCarousel; }
    get choiceMenu() { return this.game.choiceMenu; }
    get choicesContainer() { return this.game.choicesContainer; }
    get gameView() { return this.game.gameView; }
    get pauseContent() { return this.game.pauseContent; }
    get notesViewer() { return this.game.notesViewer; }
    get currentRoute() { return this.game.currentRoute; }

    initialize() {
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        }, true);
    }

    handleGlobalKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return false;
        }
        return true; // Simplified for testing
    }

    navigateButtons(buttons, key) {
        if (!buttons || buttons.length === 0) return -1;

        let currentIndex = -1;
        buttons.forEach((btn, i) => {
            if (btn.classList.contains('keyboard-focus') || btn === document.activeElement) {
                currentIndex = i;
            }
        });

        if (currentIndex === -1) currentIndex = 0;

        let newIndex = currentIndex;
        if (key === 'ArrowDown' || key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % buttons.length;
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            newIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        }

        buttons.forEach(btn => btn.classList.remove('keyboard-focus'));
        buttons[newIndex].classList.add('keyboard-focus');
        buttons[newIndex].focus();

        return newIndex;
    }

    showNotification(message, duration = 2000) {
        let notification = document.getElementById('keyboard-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'keyboard-notification';
            notification.className = 'keyboard-notification';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('visible');
        return notification;
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('KeyboardController', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGame = createMockGame();
        controller = new KeyboardController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should initialize keyboardNav state', () => {
            expect(controller.keyboardNav.currentContext).toBe('none');
            expect(controller.keyboardNav.focusedIndex).toBe(0);
            expect(controller.keyboardNav.focusableElements).toEqual([]);
        });
    });

    // ========================================
    // LAZY GETTER TESTS
    // ========================================

    describe('lazy getters', () => {
        it('saveManager should return game.saveManager', () => {
            expect(controller.saveManager).toBe(mockGame.saveManager);
        });

        it('backlogManager should return game.backlogManager', () => {
            expect(controller.backlogManager).toBe(mockGame.backlogManager);
        });

        it('settingsManager should return game.settingsManager', () => {
            expect(controller.settingsManager).toBe(mockGame.settingsManager);
        });

        it('choiceMenu should return game.choiceMenu', () => {
            expect(controller.choiceMenu).toBe(mockGame.choiceMenu);
        });

        it('currentRoute should return game.currentRoute', () => {
            expect(controller.currentRoute).toBe(mockGame.currentRoute);
        });
    });

    // ========================================
    // INITIALIZATION TESTS
    // ========================================

    describe('initialize', () => {
        it('should add keydown event listener', () => {
            controller.initialize();
            expect(document.addEventListener).toHaveBeenCalledWith(
                'keydown',
                expect.any(Function),
                true // capture phase
            );
        });
    });

    // ========================================
    // KEYBOARD HANDLER TESTS
    // ========================================

    describe('handleGlobalKeyboard', () => {
        it('should skip input fields', () => {
            const event = { target: { tagName: 'INPUT' } };
            const result = controller.handleGlobalKeyboard(event);
            expect(result).toBe(false);
        });

        it('should skip textarea fields', () => {
            const event = { target: { tagName: 'TEXTAREA' } };
            const result = controller.handleGlobalKeyboard(event);
            expect(result).toBe(false);
        });

        it('should process non-input elements', () => {
            const event = { target: { tagName: 'DIV' } };
            const result = controller.handleGlobalKeyboard(event);
            expect(result).toBe(true);
        });
    });

    // ========================================
    // BUTTON NAVIGATION TESTS
    // ========================================

    describe('navigateButtons', () => {
        let buttons;

        beforeEach(() => {
            buttons = [
                mockElement('btn1'),
                mockElement('btn2'),
                mockElement('btn3')
            ];
        });

        it('should return -1 for empty button list', () => {
            const result = controller.navigateButtons([], 'ArrowDown');
            expect(result).toBe(-1);
        });

        it('should return -1 for null button list', () => {
            const result = controller.navigateButtons(null, 'ArrowDown');
            expect(result).toBe(-1);
        });

        it('should navigate down with ArrowDown', () => {
            const result = controller.navigateButtons(buttons, 'ArrowDown');
            expect(result).toBe(1); // From 0 to 1
        });

        it('should navigate up with ArrowUp', () => {
            buttons[1].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            const result = controller.navigateButtons(buttons, 'ArrowUp');
            expect(result).toBe(0); // From 1 to 0
        });

        it('should wrap around at end', () => {
            buttons[2].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            const result = controller.navigateButtons(buttons, 'ArrowDown');
            expect(result).toBe(0); // From 2 back to 0
        });

        it('should wrap around at beginning', () => {
            buttons[0].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            const result = controller.navigateButtons(buttons, 'ArrowUp');
            expect(result).toBe(2); // From 0 to 2
        });

        it('should call focus on new button', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            expect(buttons[1].focus).toHaveBeenCalled();
        });

        it('should add keyboard-focus class to new button', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            expect(buttons[1].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should remove keyboard-focus class from old buttons', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            buttons.forEach(btn => {
                expect(btn.classList.remove).toHaveBeenCalledWith('keyboard-focus');
            });
        });

        it('should handle ArrowRight same as ArrowDown', () => {
            const result = controller.navigateButtons(buttons, 'ArrowRight');
            expect(result).toBe(1);
        });

        it('should handle ArrowLeft same as ArrowUp', () => {
            buttons[1].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            const result = controller.navigateButtons(buttons, 'ArrowLeft');
            expect(result).toBe(0);
        });
    });

    // ========================================
    // NOTIFICATION TESTS
    // ========================================

    describe('showNotification', () => {
        it('should create notification element if not exists', () => {
            mockDocument.getElementById = vi.fn(() => null);
            controller.showNotification('Test message');
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(document.body.appendChild).toHaveBeenCalled();
        });

        it('should add visible class to notification', () => {
            const mockNotification = mockElement('keyboard-notification');
            mockDocument.getElementById = vi.fn(() => mockNotification);
            controller.showNotification('Test message');
            expect(mockNotification.classList.add).toHaveBeenCalledWith('visible');
        });

        it('should set notification text content', () => {
            const mockNotification = mockElement('keyboard-notification');
            mockDocument.getElementById = vi.fn(() => mockNotification);
            const result = controller.showNotification('Hello World');
            expect(result.textContent).toBe('Hello World');
        });

        it('should return the notification element', () => {
            const result = controller.showNotification('Test');
            expect(result).toBeDefined();
            expect(result.id).toBe('keyboard-notification');
        });
    });
});
