import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EasterEggController } from '../system/easter-egg-controller.js';

/**
 * EasterEggController Unit Tests
 * 
 * Tests for the extracted EasterEggController class.
 * SESSION 122: Now imports REAL EasterEggController!
 */

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock document
const mockElement = (id) => ({
    id,
    style: {},
    classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
    appendChild: vi.fn(),
    remove: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    innerHTML: '',
    textContent: ''
});

global.document = {
    getElementById: vi.fn(() => null),
    createElement: vi.fn(() => mockElement('created')),
    body: {
        style: { animation: '' },
        classList: { add: vi.fn(), remove: vi.fn() },
        appendChild: vi.fn()
    },
    head: { appendChild: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
};

// Mock window
global.window = {
    innerWidth: 1920,
    innerHeight: 1080
};

// Mock timers
global.setTimeout = vi.fn((fn, ms) => 1);
global.setInterval = vi.fn((fn, ms) => 1);
global.clearInterval = vi.fn();

// Note: navigator is read-only in Node.js, can't be mocked directly

// Mock OverlayManager (used by showUnlockOverlay)
global.OverlayManager = {
    createCustom: vi.fn(() => ({
        overlay: mockElement('overlay'),
        box: mockElement('box')
    })),
    createTitle: vi.fn(() => mockElement('title')),
    createMessage: vi.fn(() => mockElement('message')),
    createButton: vi.fn(() => mockElement('button'))
};

// Mock ThemeManager (used by showUnlockOverlay)
global.ThemeManager = {
    getTheme: vi.fn(() => ({
        primary: '#00ff88',
        secondary: '#ff6699',
        text: '#ffffff'
    }))
};

/**
 * Create mock game object with required methods
 */
const createMockGame = () => ({
    showTorigatchiEasterEgg: vi.fn(),
    showKonamiInsaneEscape: vi.fn(),
    hasCompletedAnyEnding: vi.fn(() => true),
    mainMenu: { style: { display: 'flex' } },
    gameState: { flags: { insaneModeActive: false } },
    achievementManager: { showNotification: vi.fn() }
});

// ========================================
// TEST SUITES
// ========================================

describe('EasterEggController (REAL IMPORT)', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGame = createMockGame();
        controller = new EasterEggController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should be an instance of EasterEggController', () => {
            expect(controller).toBeInstanceOf(EasterEggController);
        });

        it('should log initialization message', () => {
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('EasterEggController initialized'));
        });
    });

    // ========================================
    // API COMPLETENESS TESTS
    // ========================================

    describe('API completeness', () => {
        it('should have showTorigatchiEasterEgg method', () => {
            expect(typeof controller.showTorigatchiEasterEgg).toBe('function');
        });

        it('should have showAlwaysCompilation method', () => {
            expect(typeof controller.showAlwaysCompilation).toBe('function');
        });

        it('should have showDizeeEasterEgg method', () => {
            expect(typeof controller.showDizeeEasterEgg).toBe('function');
        });

        it('should have openTorigatchiIframe method', () => {
            expect(typeof controller.openTorigatchiIframe).toBe('function');
        });

        it('should have showKonamiInsaneEscape method', () => {
            expect(typeof controller.showKonamiInsaneEscape).toBe('function');
        });

        it('should have activateEasterEggListener method', () => {
            expect(typeof controller.activateEasterEggListener).toBe('function');
        });

        it('should have showUnlockOverlay method', () => {
            expect(typeof controller.showUnlockOverlay).toBe('function');
        });

        it('should have showLoopTimeline method', () => {
            expect(typeof controller.showLoopTimeline).toBe('function');
        });

        it('should have showEchoCompilation method', () => {
            expect(typeof controller.showEchoCompilation).toBe('function');
        });
    });

    // ========================================
    // EASTER EGG LISTENER TESTS
    // ========================================

    describe('activateEasterEggListener', () => {
        it('should not activate if player has not completed any ending', () => {
            mockGame.hasCompletedAnyEnding = vi.fn(() => false);
            controller.activateEasterEggListener();
            expect(document.addEventListener).not.toHaveBeenCalled();
        });

        it('should add keydown event listener when player has completed an ending', () => {
            mockGame.hasCompletedAnyEnding = vi.fn(() => true);
            controller.activateEasterEggListener();
            expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        });

        it('should log activation message', () => {
            mockGame.hasCompletedAnyEnding = vi.fn(() => true);
            controller.activateEasterEggListener();
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Easter egg listener activated'));
        });

        it('should initialize empty easterEggSequence', () => {
            controller.activateEasterEggListener();
            expect(controller.easterEggSequence).toBe('');
        });
    });

    // ========================================
    // SHOW UNLOCK OVERLAY TESTS
    // ========================================

    describe('showUnlockOverlay', () => {
        it('should call OverlayManager.createCustom', () => {
            controller.showUnlockOverlay('Test Title', 'Test Content');
            expect(OverlayManager.createCustom).toHaveBeenCalled();
        });

        it('should call OverlayManager.createTitle with correct title', () => {
            controller.showUnlockOverlay('My Title', 'Content');
            expect(OverlayManager.createTitle).toHaveBeenCalledWith('My Title', expect.any(Object));
        });

        it('should call OverlayManager.createMessage with content', () => {
            controller.showUnlockOverlay('Title', 'My Content');
            expect(OverlayManager.createMessage).toHaveBeenCalledWith('My Content', expect.any(Object));
        });

        it('should create CONTINUE button', () => {
            controller.showUnlockOverlay('Title', 'Content');
            expect(OverlayManager.createButton).toHaveBeenCalledWith('CONTINUE', expect.any(Function), expect.any(Object));
        });

        it('should append overlay to document body', () => {
            controller.showUnlockOverlay('Title', 'Content');
            expect(document.body.appendChild).toHaveBeenCalled();
        });

        it('should log overlay shown message', () => {
            controller.showUnlockOverlay('Test Title', 'Content');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unlock overlay shown'));
        });
    });

    // ========================================
    // TORIGATCHI EASTER EGG TESTS
    // ========================================

    describe('showTorigatchiEasterEgg', () => {
        it('should be callable without errors', () => {
            // This method requires OverlayManager which is mocked
            expect(() => controller.showTorigatchiEasterEgg()).not.toThrow();
        });
    });

    // ========================================
    // TIMELINE HELPER TESTS
    // ========================================

    describe('timeline helpers', () => {
        it('should have generateTimelineNodes method', () => {
            expect(typeof controller.generateTimelineNodes).toBe('function');
        });

        it('should have getFailureReason method', () => {
            expect(typeof controller.getFailureReason).toBe('function');
        });

        it('should have getAttemptDuration method', () => {
            expect(typeof controller.getAttemptDuration).toBe('function');
        });

        it('should have getLesson method', () => {
            expect(typeof controller.getLesson).toBe('function');
        });

        it('getFailureReason should return a string', () => {
            const result = controller.getFailureReason(1);
            expect(typeof result).toBe('string');
        });

        it('getAttemptDuration should return a string', () => {
            const result = controller.getAttemptDuration(1);
            expect(typeof result).toBe('string');
        });

        it('getLesson should return a string', () => {
            const result = controller.getLesson(1);
            expect(typeof result).toBe('string');
        });
    });

    // ========================================
    // UNLOCK METHODS TESTS
    // ========================================

    describe('unlock methods', () => {
        it('should have unlockDevCommentary method', () => {
            expect(typeof controller.unlockDevCommentary).toBe('function');
        });

        it('should have unlockDizee method', () => {
            expect(typeof controller.unlockDizee).toBe('function');
        });

        it('should have unlockAlwaysCompilation method', () => {
            expect(typeof controller.unlockAlwaysCompilation).toBe('function');
        });

        it('should have unlockLoopTimeline method', () => {
            expect(typeof controller.unlockLoopTimeline).toBe('function');
        });

        it('should have unlockTrueCounter method', () => {
            expect(typeof controller.unlockTrueCounter).toBe('function');
        });

        it('should have unlockTorigatchi method', () => {
            expect(typeof controller.unlockTorigatchi).toBe('function');
        });
    });
});
