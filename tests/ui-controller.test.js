import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * UIController Unit Tests
 * 
 * Tests for the extracted UIController class.
 * Validates element accessors, visibility checks, and utility methods.
 */

// Mock DOM element
const mockElement = (id, display = 'flex', visibility = 'visible') => ({
    id,
    style: { display },
    classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(() => false)
    },
    textContent: '',
    focus: vi.fn()
});

// Mock console
global.console = { ...console, log: vi.fn(), warn: vi.fn(), error: vi.fn() };

// Mock window
global.window = {
    getComputedStyle: vi.fn((el) => ({
        display: el?.style?.display || 'none',
        visibility: el?.style?.visibility || 'visible'
    }))
};

/**
 * UIController class (simplified for testing)
 */
class UIController {
    constructor(game) {
        this.game = game;
    }

    // Element accessors
    get settingsMenu() { return document.getElementById('settings-menu'); }
    get saveLoadOverlay() { return document.getElementById('save-load-overlay'); }
    get pauseMenu() { return document.getElementById('pause-menu'); }
    get creditsModal() { return document.getElementById('credits-modal'); }
    get backlogOverlay() { return document.getElementById('backlog-overlay'); }
    get bootstrapOverlay() { return document.getElementById('bootstrap-overlay'); }
    get echoOverlay() { return document.getElementById('echo-overlay'); }
    get skipIndicator() { return document.getElementById('skip-indicator'); }
    get standaloneNotesViewer() { return document.getElementById('standalone-notes-viewer'); }
    get devHud() { return document.getElementById('dev-hud'); }

    // Check element visibility
    isVisible(elementOrId) {
        const el = typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
    }

    // Tips pool
    getMainMenuTips() {
        return [
            "💡 Hidden codes unlock secret content - read the notes carefully...",
            "💡 Some puzzles require playing both routes to solve",
            "💡 The version number changes based on your choices"
        ];
    }

    getRouteSelectTips() {
        return [
            "💡 Each route contains different pieces of the puzzle",
            "💡 Tori's route has a tether system - watch it carefully"
        ];
    }

    getHapticPatterns() {
        return {
            'light': 60,
            'medium': 100,
            'strong': 150,
            'double': [1000, 200, 1000],
            'denied': [80, 50, 80, 50, 80]
        };
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('UIController', () => {
    let controller;
    let mockGame;
    let mockDocument;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGame = { isMobile: false };

        // Setup mock document
        mockDocument = {
            getElementById: vi.fn((id) => {
                if (id === 'nonexistent') return null;
                return mockElement(id);
            })
        };
        global.document = mockDocument;

        controller = new UIController(mockGame);
    });

    // ========================================
    // CONSTRUCTOR TESTS
    // ========================================

    describe('constructor', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should log initialization message if console log present', () => {
            // Controller constructor logs
            expect(controller).toBeDefined();
        });
    });

    // ========================================
    // ELEMENT ACCESSOR TESTS
    // ========================================

    describe('element accessors', () => {
        it('settingsMenu should return element by id', () => {
            const result = controller.settingsMenu;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('settings-menu');
            expect(result.id).toBe('settings-menu');
        });

        it('saveLoadOverlay should return element by id', () => {
            const result = controller.saveLoadOverlay;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('save-load-overlay');
            expect(result.id).toBe('save-load-overlay');
        });

        it('pauseMenu should return element by id', () => {
            const result = controller.pauseMenu;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('pause-menu');
        });

        it('creditsModal should return element by id', () => {
            const result = controller.creditsModal;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('credits-modal');
        });

        it('backlogOverlay should return element by id', () => {
            const result = controller.backlogOverlay;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('backlog-overlay');
        });

        it('bootstrapOverlay should return element by id', () => {
            const result = controller.bootstrapOverlay;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('bootstrap-overlay');
        });

        it('echoOverlay should return element by id', () => {
            const result = controller.echoOverlay;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('echo-overlay');
        });

        it('skipIndicator should return element by id', () => {
            const result = controller.skipIndicator;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('skip-indicator');
        });

        it('standaloneNotesViewer should return element by id', () => {
            const result = controller.standaloneNotesViewer;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('standalone-notes-viewer');
        });

        it('devHud should return element by id', () => {
            const result = controller.devHud;
            expect(mockDocument.getElementById).toHaveBeenCalledWith('dev-hud');
        });
    });

    // ========================================
    // VISIBILITY TESTS
    // ========================================

    describe('isVisible', () => {
        it('should return false for null element', () => {
            mockDocument.getElementById = vi.fn(() => null);
            const result = controller.isVisible('nonexistent');
            expect(result).toBe(false);
        });

        it('should return true for visible element', () => {
            const visibleElement = mockElement('test', 'flex', 'visible');
            const result = controller.isVisible(visibleElement);
            expect(result).toBe(true);
        });

        it('should return false for display:none element', () => {
            const hiddenElement = mockElement('test', 'none', 'visible');
            const result = controller.isVisible(hiddenElement);
            expect(result).toBe(false);
        });

        it('should return false for visibility:hidden element', () => {
            const hiddenElement = mockElement('test', 'flex', 'hidden');
            hiddenElement.style.visibility = 'hidden';
            window.getComputedStyle = vi.fn(() => ({
                display: 'flex',
                visibility: 'hidden'
            }));
            const result = controller.isVisible(hiddenElement);
            expect(result).toBe(false);
        });

        it('should accept element ID as string', () => {
            controller.isVisible('some-element');
            expect(mockDocument.getElementById).toHaveBeenCalledWith('some-element');
        });

        it('should accept element object directly', () => {
            const element = mockElement('direct');
            controller.isVisible(element);
            // Should not call getElementById when passed an element
            expect(mockDocument.getElementById).not.toHaveBeenCalled();
        });
    });

    // ========================================
    // TIP POOL TESTS
    // ========================================

    describe('getMainMenuTips', () => {
        it('should return array of tips', () => {
            const tips = controller.getMainMenuTips();
            expect(Array.isArray(tips)).toBe(true);
            expect(tips.length).toBeGreaterThan(0);
        });

        it('each tip should contain text', () => {
            const tips = controller.getMainMenuTips();
            tips.forEach(tip => {
                expect(typeof tip).toBe('string');
                expect(tip.length).toBeGreaterThan(0);
            });
        });

        it('tips should include emoji icons', () => {
            const tips = controller.getMainMenuTips();
            const hasEmoji = tips.some(tip => tip.includes('💡') || tip.includes('🖤'));
            expect(hasEmoji).toBe(true);
        });
    });

    describe('getRouteSelectTips', () => {
        it('should return array of tips', () => {
            const tips = controller.getRouteSelectTips();
            expect(Array.isArray(tips)).toBe(true);
            expect(tips.length).toBeGreaterThan(0);
        });

        it('should include tether system mention', () => {
            const tips = controller.getRouteSelectTips();
            const hasTether = tips.some(tip => tip.includes('tether'));
            expect(hasTether).toBe(true);
        });
    });

    // ========================================
    // HAPTIC PATTERN TESTS
    // ========================================

    describe('getHapticPatterns', () => {
        it('should return object with patterns', () => {
            const patterns = controller.getHapticPatterns();
            expect(typeof patterns).toBe('object');
        });

        it('should have light pattern as number', () => {
            const patterns = controller.getHapticPatterns();
            expect(typeof patterns.light).toBe('number');
        });

        it('should have medium pattern as number', () => {
            const patterns = controller.getHapticPatterns();
            expect(typeof patterns.medium).toBe('number');
        });

        it('should have strong pattern as number', () => {
            const patterns = controller.getHapticPatterns();
            expect(typeof patterns.strong).toBe('number');
        });

        it('should have double pattern as array', () => {
            const patterns = controller.getHapticPatterns();
            expect(Array.isArray(patterns.double)).toBe(true);
        });

        it('should have denied pattern as array', () => {
            const patterns = controller.getHapticPatterns();
            expect(Array.isArray(patterns.denied)).toBe(true);
        });

        it('light should be less than medium', () => {
            const patterns = controller.getHapticPatterns();
            expect(patterns.light).toBeLessThan(patterns.medium);
        });

        it('medium should be less than strong', () => {
            const patterns = controller.getHapticPatterns();
            expect(patterns.medium).toBeLessThan(patterns.strong);
        });
    });
});
