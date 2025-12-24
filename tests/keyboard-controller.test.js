import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KeyboardController } from '../system/keyboard-controller.js';

/**
 * KeyboardController Unit Tests
 * 
 * Tests for the extracted KeyboardController class.
 * SESSION 122: Now imports REAL KeyboardController!
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
    getElementById: vi.fn((id) => {
        if (id === 'keyboard-notification') return null; // For showNotification test
        return mockElement(id);
    }),
    querySelectorAll: vi.fn(() => []),
    activeElement: null,
    addEventListener: vi.fn(),
    createElement: vi.fn(() => mockElement('created')),
    body: {
        appendChild: vi.fn(),
        querySelectorAll: vi.fn(() => [])
    }
};
global.document = mockDocument;

// Mock window
global.window = {
    getComputedStyle: vi.fn(() => ({ display: 'flex', visibility: 'visible' }))
};

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock timers
global.setTimeout = vi.fn((fn, ms) => 1);

/**
 * Create mock game object matching real game interface
 */
const createMockGame = () => ({
    hideCredits: vi.fn(),
    closeNotesViewer: vi.fn(),
    closePause: vi.fn(),
    showMainMenu: vi.fn(),
    notesViewer: mockElement('notes-viewer', 'none'),
    standaloneNotesViewer: { isOpen: false, close: vi.fn() },
    backlogManager: { close: vi.fn(), isVisible: false },
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

// ========================================
// TEST SUITES
// ========================================

describe('KeyboardController (REAL IMPORT)', () => {
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

        it('should be an instance of KeyboardController', () => {
            expect(controller).toBeInstanceOf(KeyboardController);
        });

        it('should initialize keyboardNav state', () => {
            expect(controller.keyboardNav).toBeDefined();
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

        it('saveLoadUI should return game.saveLoadUI', () => {
            expect(controller.saveLoadUI).toBe(mockGame.saveLoadUI);
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
        it('should add keydown event listener in capture phase', () => {
            controller.initialize();
            expect(document.addEventListener).toHaveBeenCalledWith(
                'keydown',
                expect.any(Function),
                true // capture phase
            );
        });

        it('should log initialization messages', () => {
            controller.initialize();
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Initializing'));
        });
    });

    // ========================================
    // KEYBOARD HANDLER TESTS
    // ========================================

    describe('handleGlobalKeyboard', () => {
        it('should be a function on the controller', () => {
            expect(typeof controller.handleGlobalKeyboard).toBe('function');
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

        it('should return early for empty button list', () => {
            // Real method returns undefined for empty list
            expect(() => controller.navigateButtons([], 'ArrowDown')).not.toThrow();
        });

        it('should focus next button on ArrowDown', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            // First unfocused element will get focus (index 0 -> 1)
            expect(buttons[1].classList.add).toHaveBeenCalledWith('keyboard-focus');
            expect(buttons[1].focus).toHaveBeenCalled();
        });

        it('should focus previous button on ArrowUp', () => {
            // Set button 1 as currently focused
            buttons[1].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            controller.navigateButtons(buttons, 'ArrowUp');
            expect(buttons[0].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should wrap around at end with ArrowDown', () => {
            // Set last button as currently focused
            buttons[2].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            controller.navigateButtons(buttons, 'ArrowDown');
            expect(buttons[0].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should wrap around at beginning with ArrowUp', () => {
            // Set first button as currently focused
            buttons[0].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            controller.navigateButtons(buttons, 'ArrowUp');
            expect(buttons[2].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should remove keyboard-focus from all buttons', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            buttons.forEach(btn => {
                expect(btn.classList.remove).toHaveBeenCalledWith('keyboard-focus');
            });
        });

        it('should handle ArrowRight same as ArrowDown', () => {
            controller.navigateButtons(buttons, 'ArrowRight');
            expect(buttons[1].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should handle ArrowLeft same as ArrowUp', () => {
            buttons[1].classList.contains = vi.fn((cls) => cls === 'keyboard-focus');
            controller.navigateButtons(buttons, 'ArrowLeft');
            expect(buttons[0].classList.add).toHaveBeenCalledWith('keyboard-focus');
        });

        it('should log navigation message', () => {
            controller.navigateButtons(buttons, 'ArrowDown');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Button navigation'));
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
            controller.showNotification('Hello World');
            expect(mockNotification.textContent).toBe('Hello World');
        });

        it('should schedule auto-hide with setTimeout', () => {
            controller.showNotification('Test', 3000);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
        });
    });

    // ========================================
    // API COMPLETENESS TESTS
    // ========================================

    describe('API completeness', () => {
        it('should have initialize method', () => {
            expect(typeof controller.initialize).toBe('function');
        });

        it('should have handleGlobalKeyboard method', () => {
            expect(typeof controller.handleGlobalKeyboard).toBe('function');
        });

        it('should have handleArrowKeyNavigation method', () => {
            expect(typeof controller.handleArrowKeyNavigation).toBe('function');
        });

        it('should have navigateButtons method', () => {
            expect(typeof controller.navigateButtons).toBe('function');
        });

        it('should have handleTabNavigation method', () => {
            expect(typeof controller.handleTabNavigation).toBe('function');
        });

        it('should have showNotification method', () => {
            expect(typeof controller.showNotification).toBe('function');
        });
    });
});
