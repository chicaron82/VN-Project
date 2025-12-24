import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreditsController } from '../system/credits-controller.js';

/**
 * CreditsController Unit Tests
 * 
 * Tests for the extracted CreditsController class.
 * SESSION 122: Now imports REAL CreditsController!
 */

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock window
global.window = {
    innerWidth: 1920,
    innerHeight: 1080
};

// Mock localStorage
global.localStorage = {
    store: {},
    getItem: vi.fn((key) => global.localStorage.store[key] || null),
    setItem: vi.fn((key, value) => { global.localStorage.store[key] = value; }),
    clear: vi.fn(() => { global.localStorage.store = {}; })
};

// Mock document
global.document = {
    getElementById: vi.fn(() => null),
    createElement: vi.fn((tag) => ({
        id: '',
        className: '',
        style: {},
        innerHTML: '',
        textContent: '',
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        appendChild: vi.fn(),
        addEventListener: vi.fn(),
        querySelector: vi.fn(() => null),
        querySelectorAll: vi.fn(() => [])
    })),
    body: { appendChild: vi.fn() },
    head: { appendChild: vi.fn() }
};

// Mock timers
global.setTimeout = vi.fn((fn, ms) => 1);
global.setInterval = vi.fn((fn, ms) => 1);
global.clearInterval = vi.fn();

/**
 * Create mock game object with required methods
 */
const createMockGame = () => ({
    loopVersion: 855,
    lastEndingType: null,
    removeInternalBubble: vi.fn(),
    selectRandomPhotos: vi.fn(() => []),
    state: {
        get: vi.fn((path) => {
            if (path === 'game.loopVersion') return 855;
            return null;
        })
    },
    // DOM elements needed by showCredits
    gameView: { style: { display: 'flex' } },
    mainMenu: { style: { display: 'none' } }
});

// ========================================
// TEST SUITES
// ========================================

describe('CreditsController (REAL IMPORT)', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        vi.clearAllMocks();
        global.localStorage.store = {};
        window.innerWidth = 1920;
        window.innerHeight = 1080;
        mockGame = createMockGame();
        controller = new CreditsController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should be an instance of CreditsController', () => {
            expect(controller).toBeInstanceOf(CreditsController);
        });
    });

    // ========================================
    // SHOW CREDITS TESTS
    // ========================================

    describe('showCredits', () => {
        it('should call removeInternalBubble when showing credits', () => {
            controller.showCredits('true');
            expect(mockGame.removeInternalBubble).toHaveBeenCalled();
        });

        it('should call selectRandomPhotos for the ending type', () => {
            controller.showCredits('digitalForever');
            expect(mockGame.selectRandomPhotos).toHaveBeenCalled();
        });

        it('should save ending type to localStorage', () => {
            controller.showCredits('true');
            expect(localStorage.setItem).toHaveBeenCalledWith('lastEndingType', 'true');
        });

        it('should log credits start message', () => {
            controller.showCredits('true');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Rolling credits'));
        });

        it('should log layout mode', () => {
            controller.showCredits('true');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Layout'));
        });
    });

    // ========================================
    // DYNAMIC TITLE TESTS
    // ========================================

    describe('buildDynamicTitleSection', () => {
        it('should return HTML string', () => {
            const result = controller.buildDynamicTitleSection('true', 855);
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should include version number in output', () => {
            const result = controller.buildDynamicTitleSection('true', 999);
            expect(result).toContain('999');
        });

        it('should have success message for true ending', () => {
            const result = controller.buildDynamicTitleSection('true', 855);
            expect(result).toContain('succeeded');
        });

        it('should have acceptance message for digitalForever ending', () => {
            const result = controller.buildDynamicTitleSection('digitalForever', 855);
            expect(result).toContain('different path');
        });

        it('should have retry message for bad ending', () => {
            const result = controller.buildDynamicTitleSection('bad', 855);
            expect(result).toContain('try again');
        });

        it('should show next version for bad ending', () => {
            const result = controller.buildDynamicTitleSection('bad', 855);
            expect(result).toContain('856'); // 855 + 1
        });

        it('should have default version display for unknown ending', () => {
            const result = controller.buildDynamicTitleSection('unknown', 855);
            expect(result).toContain('855');
        });
    });

    // ========================================
    // LAYOUT MODE TESTS
    // ========================================

    describe('layout detection', () => {
        it('should use landscape layout when width > height', () => {
            window.innerWidth = 1920;
            window.innerHeight = 1080;
            mockGame.selectRandomPhotos = vi.fn(() => ['photo1.jpg']);

            // Spy on the landscape method
            const landscapeSpy = vi.spyOn(controller, 'showCreditsLandscapeWithPhotos').mockImplementation(() => { });

            controller.showCredits('digitalForever');
            expect(landscapeSpy).toHaveBeenCalled();
        });

        it('should use portrait layout when height > width', () => {
            window.innerWidth = 768;
            window.innerHeight = 1024;
            mockGame.selectRandomPhotos = vi.fn(() => ['photo1.jpg']);

            // Spy on the portrait method
            const portraitSpy = vi.spyOn(controller, 'showCreditsPortraitWithPhotos').mockImplementation(() => { });

            controller.showCredits('digitalForever');
            expect(portraitSpy).toHaveBeenCalled();
        });

        it('should use standard layout when no photos', () => {
            mockGame.selectRandomPhotos = vi.fn(() => []);

            // Spy on the standard method
            const standardSpy = vi.spyOn(controller, 'showCreditsStandard').mockImplementation(() => { });

            controller.showCredits('bad');
            expect(standardSpy).toHaveBeenCalled();
        });
    });

    // ========================================
    // CYCLE PHOTOS TESTS
    // ========================================

    describe('cycleCreditsPhotos', () => {
        it('should be a function on the controller', () => {
            expect(typeof controller.cycleCreditsPhotos).toBe('function');
        });
    });

    // ========================================
    // METHOD EXISTENCE TESTS
    // ========================================

    describe('API completeness', () => {
        it('should have showCredits method', () => {
            expect(typeof controller.showCredits).toBe('function');
        });

        it('should have buildDynamicTitleSection method', () => {
            expect(typeof controller.buildDynamicTitleSection).toBe('function');
        });

        it('should have cycleCreditsPhotos method', () => {
            expect(typeof controller.cycleCreditsPhotos).toBe('function');
        });

        it('should have showCreditsLandscapeWithPhotos method', () => {
            expect(typeof controller.showCreditsLandscapeWithPhotos).toBe('function');
        });

        it('should have showCreditsPortraitWithPhotos method', () => {
            expect(typeof controller.showCreditsPortraitWithPhotos).toBe('function');
        });

        it('should have showCreditsStandard method', () => {
            expect(typeof controller.showCreditsStandard).toBe('function');
        });
    });
});
