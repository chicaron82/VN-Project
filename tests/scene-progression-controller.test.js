// ========================================
// SCENE PROGRESSION CONTROLLER TESTS
// Session 119: REAL imports, not mocks!
// ========================================
//
// CRITICAL DIFFERENCE FROM OTHER TESTS:
// ✅ Loads the ACTUAL SceneProgressionController file
// ✅ Mocks only the GameEngine interface (minimal)
// ✅ Tests delegation behavior and state changes
//
// This is how tests SHOULD be written - testing
// the real code that ships to production!
// ========================================

import { SceneProgressionController } from '../system/scene-progression-controller.js';


// Mock localStorage and document for browser-based code
global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value; },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
};

global.document = {
    getElementById: vi.fn((id) => ({
        style: {},
        classList: { add: vi.fn(), remove: vi.fn() }
    })),
    body: {
        classList: { add: vi.fn(), remove: vi.fn() },
        setAttribute: vi.fn()
    },
    createElement: vi.fn(() => ({
        className: '',
        innerHTML: '',
        onclick: null
    }))
};

global.ThemeManager = {
    setRoute: vi.fn()
};

global.SharedPrologue = vi.fn().mockImplementation(() => ({
    start: vi.fn()
}));

global.RonnieRoute = vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    cleanup: vi.fn()
}));

global.ToriRoute = vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    cleanup: vi.fn()
}));

// ========================================
// MINIMAL MOCK GAME ENGINE
// Only mocking GameEngine's interface
// ========================================
class MockGame {
    constructor() {
        // Controllers (mocked)
        this.loopController = {
            increment: vi.fn(() => ({ version: 849, status: 'attempting' })),
            updateTitleScreen: vi.fn()
        };
        this.effectsController = {
            showCodeRainTransition: vi.fn((callback) => {
                if (callback) callback();
            })
        };
        this.routeController = {
            skipToRouteSelection: vi.fn(),
            showSkipProloguePrompt: vi.fn(),
            unlockSkipPrologue: vi.fn()
        };
        this.uiController = {
            showEscHintBriefly: vi.fn()
        };
        this.tipsController = {
            stopMainMenuRotation: vi.fn(),
            stopRouteSelectRotation: vi.fn(),
            startRouteSelectRotation: vi.fn()
        };
        this.backlogManager = {
            clearHistory: vi.fn()
        };

        // State
        this.loopVersion = 848;
        this.loopStatus = 'attempting';
        this.currentRoute = null;
        this.selectedRoute = 'ronnie';
        this.skipPrologueUnlocked = false;
        this.ronnieNotesUnlocked = false;

        // Mock GameState
        this.gameState = {
            flags: {},
            choices: {},
            progress: {},
            sprites: { left: null, right: null },
            currentRoute: null
        };

        // Mock DOM elements
        this.mainMenu = { style: { opacity: '1', display: 'block' } };
        this.gameView = { style: { opacity: '0', display: 'none', backgroundImage: '', transition: '' } };
        this.dialogueBox = {
            style: { display: 'none' },
            classList: {
                add: vi.fn(),
                remove: vi.fn()
            },
            appendChild: vi.fn(),
            querySelector: vi.fn()
        };
        this.spriteLeft = {
            style: { opacity: '1', display: 'block', backgroundImage: '' },
            classList: { remove: vi.fn() }
        };
        this.spriteRight = {
            style: { opacity: '1', display: 'block', backgroundImage: '' },
            classList: { remove: vi.fn() }
        };
        this.currentSprites = { left: null, right: null };
        this.pauseButton = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.pauseContent = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.notesButton = {
            style: { display: 'none' },
            classList: { add: vi.fn(), remove: vi.fn() }
        };
        this.notesViewer = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.holdOnButton = { style: { display: 'block' } };
        this.ronniePortrait = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.toriPortrait = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.toggleTrack = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.ronnieInfo = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.toriInfo = { classList: { add: vi.fn(), remove: vi.fn() } };
        this.routeName = { textContent: '' };
        this.tetherUI = { style: { display: 'block' } };

        // Managers
        this.menuCarousel = null;
        this.standaloneNotesViewer = null;
        this.settingsManager = { settings: { autoSkipPrologue: false } };
        this.devCommentary = null;
        this.triggerSensoryFeedback = vi.fn();
        this.triggerInsaneVisuals = vi.fn();
    }
}

// ========================================
// TEST SUITE
// ========================================

describe('SceneProgressionController (REAL IMPORTS)', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        // Reset localStorage
        global.localStorage.clear();

        // Create fresh mocks
        mockGame = new MockGame();

        // Instantiate the REAL controller
        controller = new SceneProgressionController(mockGame);
    });

    // ========================================
    // INITIALIZATION TESTS
    // ========================================

    describe('Initialization', () => {
        it('should initialize with game reference', () => {
            expect(controller.game).toBe(mockGame);
        });

        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
    });

    // ========================================
    // VERSION TRACKING TESTS (848 LOGIC)
    // ========================================

    describe('Version Tracking (848 Loop Counter)', () => {
        it('should increment version when called', () => {
            const result = controller.incrementVersion();

            expect(mockGame.loopController.increment).toHaveBeenCalled();
            expect(result).toEqual({ version: 849, status: 'attempting' });
        });

        it('should update title screen', () => {
            controller.updateTitleScreen();

            expect(mockGame.loopController.updateTitleScreen).toHaveBeenCalled();
        });

        it('should reset version to target', () => {
            mockGame.loopVersion = 850;
            mockGame.loopStatus = 'succeeded';

            const result = controller.resetVersion(848, 'attempting');

            expect(mockGame.loopVersion).toBe(848);
            expect(mockGame.loopStatus).toBe('attempting');
            expect(result).toBe(848);
        });

        it('should save version to localStorage on reset', () => {
            controller.resetVersion(849, 'attempting');

            expect(global.localStorage.getItem('loopVersion')).toBe('849');
            expect(global.localStorage.getItem('loopStatus')).toBe('attempting');
        });
    });

    // ========================================
    // SPRITE MANAGEMENT TESTS
    // ========================================

    describe('Sprite Management', () => {
        it('should clear all sprites', () => {
            mockGame.spriteLeft.style.opacity = '1';
            mockGame.spriteRight.style.opacity = '1';

            controller.clearAllSprites();

            expect(mockGame.spriteLeft.style.opacity).toBe('0');
            expect(mockGame.spriteRight.style.opacity).toBe('0');
            expect(mockGame.spriteLeft.style.display).toBe('none');
            expect(mockGame.spriteRight.style.display).toBe('none');
        });

        it('should clear sprite state tracking', () => {
            mockGame.currentSprites.left = 'ronnie_happy';
            mockGame.gameState.sprites.left = 'ronnie_happy';

            controller.clearAllSprites();

            expect(mockGame.currentSprites.left).toBe(null);
            expect(mockGame.currentSprites.right).toBe(null);
            expect(mockGame.gameState.sprites.left).toBe(null);
            expect(mockGame.gameState.sprites.right).toBe(null);
        });
    });

    // ========================================
    // DELEGATION TESTS
    // ========================================

    describe('Controller Delegation', () => {
        it('should delegate code rain transition to EffectsController', () => {
            const callback = vi.fn();

            controller.showCodeRainTransition(callback, 2000);

            expect(mockGame.effectsController.showCodeRainTransition).toHaveBeenCalledWith(callback, 2000);
        });

        it('should delegate tip rotation stop to TipsController', () => {
            controller.stopMainMenuTipRotation();

            expect(mockGame.tipsController.stopMainMenuRotation).toHaveBeenCalled();
        });

        it('should delegate route select tip stop to TipsController', () => {
            controller.stopRouteSelectTipRotation();

            expect(mockGame.tipsController.stopRouteSelectRotation).toHaveBeenCalled();
        });

        it('should delegate ESC hint to UIController', () => {
            controller.showEscHintBriefly();

            expect(mockGame.uiController.showEscHintBriefly).toHaveBeenCalled();
        });

        it('should delegate skip to route selection to RouteController', () => {
            controller.skipToRouteSelection();

            expect(mockGame.routeController.skipToRouteSelection).toHaveBeenCalled();
        });

        it('should delegate skip prologue prompt to RouteController', () => {
            controller.showSkipProloguePrompt();

            expect(mockGame.routeController.showSkipProloguePrompt).toHaveBeenCalled();
        });
    });

    // ========================================
    // UI THEMING TESTS
    // ========================================

    describe('UI Theming', () => {
        it('should apply Ronnie route theme to UI elements', () => {
            controller.setDialogueFrame('ronnie');

            expect(mockGame.dialogueBox.classList.add).toHaveBeenCalledWith('ronnie-route');
            expect(mockGame.pauseButton.classList.add).toHaveBeenCalledWith('ronnie-route');
            expect(mockGame.notesButton.classList.add).toHaveBeenCalledWith('ronnie-route');
        });

        it('should apply Tori route theme to UI elements', () => {
            controller.setDialogueFrame('tori');

            expect(mockGame.dialogueBox.classList.add).toHaveBeenCalledWith('tori-route');
            expect(mockGame.pauseButton.classList.add).toHaveBeenCalledWith('tori-route');
            expect(mockGame.notesButton.classList.add).toHaveBeenCalledWith('tori-route');
        });

        it('should remove old route classes before applying new ones', () => {
            controller.setDialogueFrame('ronnie');

            expect(mockGame.dialogueBox.classList.remove).toHaveBeenCalledWith(
                'ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style'
            );
        });
    });

    // ========================================
    // HELPER METHOD TESTS
    // ========================================

    describe('Helper Methods', () => {
        it('should check if any ending completed from localStorage', () => {
            global.localStorage.setItem('hasCompletedOnce', 'true');

            const result = controller.hasCompletedAnyEnding();

            expect(result).toBe(true);
        });

        it('should return false if no ending completed', () => {
            const result = controller.hasCompletedAnyEnding();

            expect(result).toBe(false);
        });

        it('should hide Hold On button in Insane Mode', () => {
            controller.makeHoldOnGhost();

            expect(mockGame.holdOnButton.style.display).toBe('none');
        });
    });

    // ========================================
    // RONNIE NOTES SYSTEM TESTS
    // ========================================

    describe('Ronnie Notes System', () => {
        it('should unlock Ronnie notes system', () => {
            controller.unlockRonnieNotesSystem();

            expect(mockGame.ronnieNotesUnlocked).toBe(true);
            expect(global.localStorage.getItem('ronnieNotesUnlocked')).toBe('true');
            expect(global.localStorage.getItem('ronnieTabUnlocked')).toBe('true');
        });

        it('should unlock ronnie_teaser note in localStorage', () => {
            controller.unlockRonnieNotesSystem();

            const savedNotes = JSON.parse(global.localStorage.getItem('vn_collected_notes'));
            expect(savedNotes.special).toContain('ronnie_teaser');
        });
    });

    // ========================================
    // ROUTE SELECTOR TESTS
    // ========================================

    describe('Route Selection', () => {
        it('should select Ronnie route', () => {
            mockGame.selectedRoute = 'tori'; // Start with Tori selected

            controller.selectRoute('ronnie');

            expect(mockGame.selectedRoute).toBe('ronnie');
            expect(mockGame.ronniePortrait.classList.add).toHaveBeenCalledWith('active');
            expect(mockGame.toriPortrait.classList.remove).toHaveBeenCalledWith('active');
        });

        it('should select Tori route', () => {
            controller.selectRoute('tori');

            expect(mockGame.selectedRoute).toBe('tori');
            expect(mockGame.toriPortrait.classList.add).toHaveBeenCalledWith('active');
            expect(mockGame.ronniePortrait.classList.remove).toHaveBeenCalledWith('active');
        });

        it('should not switch if already selected', () => {
            mockGame.selectedRoute = 'ronnie';
            const addSpy = vi.spyOn(mockGame.ronniePortrait.classList, 'add');

            controller.selectRoute('ronnie');

            // Should return early without calling add
            expect(addSpy).not.toHaveBeenCalled();
        });
    });
});
