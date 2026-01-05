// @ts-check
// ========================================
// GAME ENGINE - Version 848 (COMPLETE)
// Main game logic and scene management
// WITH SPRITE MANAGEMENT + PAGINATION SYSTEM + MOBILE BUBBLES
// UPDATED: Sprite cleanup on transitions + save/load sprite state
// ========================================

// ========================================
// VERSION NUMBER - READ BEFORE MODIFYING
// ========================================
//
// WARNING: 848 appears throughout the entire codebase.
// DO NOT change this to 849 or any other number.
// You WILL break things.
//
// "But why is 848 hardcoded everywhere?"
//
// Because 848 isn't a build number.
// It's the loop iteration counter.
//
// The story is: Ronnie has tried to save Tori 847 times.
// Each attempt failed. The timeline reset.
// Version 848 is the FIRST successful iteration.
//
// The "version number" IS the narrative.
// The bootstrap paradox device has looped 847 times.
// This is attempt #848 - the one that finally worked.
//
// There is no v849.
// Because 848 is the timeline where she came home.
//
// So when you see:
//   - loopVersion = 848
//   - VERSION_INITIAL = 848
//   - "Version 848: My Wife Is in a Coma"
//   - Splash screen: "V848"
//
// That's not a build number.
// That's how many times the universe tried before succeeding.
//
// Change it and you break the lore.
// Change it and the entire meta-narrative collapses.
//
// 848 is sacred.
// 848 is the story.
// 848 is the one that worked.
//
// - Chicharon (Aaron)
//   Built with the UV7 crew
//   💚🔥💀

// ========================================

/**
 * ════════════════════════════════════════════════════════════════
 * GAME-ENGINE.JS - Core Game Loop & State Management
 * Main game logic, scene rendering, player interactions, and system coordination
 * ════════════════════════════════════════════════════════════════
 *
 * TABLE OF CONTENTS
 * (Line numbers updated 2025-12-28 - use search to locate sections)
 *
 * 1. SENSORY CUES METADATA ....................... Line 230
 *    - Haptic + visual feedback configuration
 *    - UI, narrative, and critical feedback patterns
 *
 * 2. TUTORIAL SYSTEM ............................. Line 383
 *    - Onboarding gesture tutorials
 *    - Tutorial state management
 *
 * 3. SKIP SYSTEM ................................. Line 524
 *    - Skip mode (CTRL/S)
 *    - Skip prologue system
 *    - Ronnie notes system unlock
 *
 * 4. TORIGATCHI UNLOCK SYSTEM .................... Line 1225
 *    - Main menu ToriGatchi button unlock
 *    - Easter egg integration
 *
 * 5. ROTATING TIPS SYSTEM ........................ Line 1234
 *    - Main menu tips
 *    - Route select tips
 *    - Tip rotation controls
 *
 * 6. HAPTIC FEEDBACK SYSTEM ...................... Line 1267
 *    - Pattern library (12 patterns)
 *    - Device support detection
 *    - Sensory intensity scaling
 *
 * 7. UNIFIED SENSORY FEEDBACK .................... Line 1370
 *    - Metadata-driven haptic + visual cues
 *    - Channel-based intensity scaling
 *
 * 8. DEV HUD SYSTEM .............................. Line 1408
 *    - Real-time debug overlay
 *    - Route/Act/Scene display
 *    - Tether/Difficulty/Flags monitoring
 *
 * 9. NOTES UNLOCK SYSTEM ......................... Line 1471
 *    - Note unlocking
 *    - Ronnie notes tab unlock
 *
 * 10. SKIP PROLOGUE SYSTEM ....................... Line 1647
 *     - Skip prologue toggle
 *     - First-time vs replay handling
 *
 * 11. SCENE DISPLAY & RENDERING .................. Line 1692
 *     - Display scene
 *     - Dialogue rendering
 *     - Character names
 *     - Background handling
 *     - Choice rendering
 *
 * 12. SPRITE MANAGEMENT .......................... Line 1855
 *     - Sprite fade sequences
 *     - Character sprite display
 *     - Sprite positioning
 *     - Sprite cleanup on transitions
 *
 * 13. ECHO DISPLAY (TORI ROUTE) .................. Line 1973
 *     - Echo voice system (three-echoes-sprite.png)
 *     - Echo animations
 *
 * 14. NOTES SYSTEM ............................... Line 1979
 *     - Note overlay display
 *     - Note navigation
 *
 * 15. CONFIRMATION DIALOG SYSTEM ................. Line 2080
 *     - Custom dialog overlays
 *     - Confirmation callbacks
 *
 * 16. CONTACT SCREEN ............................. Line 2160
 *     - Developer contact info
 *
 * 17. SAVE/LOAD SYSTEM METHODS ................... Line 2220
 *     - Save game delegation
 *     - Load game delegation
 *     - Save slot management
 *
 * 18. STANDALONE NOTES VIEWER .................... Line 2310
 *     - Main menu notes access
 *     - Standalone viewer launch
 *
 * 19. SETTINGS SYSTEM ............................ Line 2340
 *     - Settings menu control
 *     - Settings delegation to SettingsManager
 *
 * 20. BACKLOG SYSTEM ............................. Line 2400
 *     - History tracking
 *     - Time-travel functionality
 *     - Backlog rendering
 *
 * 21. PAUSE MENU ................................. Line 2650
 *     - Pause menu display
 *     - Resume/settings/main menu
 *
 * 22. ROUTE SELECTION ............................ Line 2730
 *     - Route selection screen
 *     - Route start initialization
 *
 * 23. STORY START (PROLOGUE) ..................... Line 2940
 *     - Prologue playback
 *     - Skip prologue handling
 *
 * 24. MAIN MENU .................................. Line 3100
 *     - Main menu display
 *     - Button handlers
 *     - Menu navigation
 *
 * 25. CREDITS SYSTEM ............................. Line 3300
 *     - Credits rendering (3 layouts)
 *     - Photo pools (UV7 crew portraits)
 *     - Photo cycling controls
 *
 * 26. LOOP REINIT SCREEN ......................... Line 3550
 *     - Loop version tracking (848)
 *     - Retry screen with route selection
 *
 * 27. CONSTRUCTOR & INITIALIZATION ............... Line 3780
 *     - DOM element caching
 *     - Manager initialization (PauseManager, Settings, Save, etc.)
 *     - Event listener setup
 *
 * ════════════════════════════════════════════════════════════════
 * NOTES:
 * - This is the main orchestrator - coordinates all subsystems
 * - Manages game loop, state transitions, and player interactions
 * - Integrates with: PauseManager, SaveManager, SettingsManager,
 *   TetherSystem, CollectiblesManager, SecretCodesManager, DevConsole
 * - File size: 3,946 lines - use TOC for navigation
 * - Line numbers updated Dec 28, 2025 - search by section name for exact location
 * ════════════════════════════════════════════════════════════════
 */

// SENSORY_CUES moved to GameConfig.SENSORY_CUES

/**
 * GameEngine - Core game loop and scene management
 *
 * Version 848: The timeline iteration that finally succeeded
 * Main game controller handling global flow, scene stack, and manager coordination.
 * Entry point called from index.html on DOMContentLoaded.
 *
 * Responsibilities:
 * - Scene progression and dialogue rendering
 * - Character sprite management
 * - Route management (Tori/Ronnie)
 * - Save/load system integration
 * - Input handling (keyboard shortcuts, click advancing, auto-advance)
 * - UI state management (menus, overlays, notifications)
 * - Integration with all game systems (StateManager, TetherSystem, etc.)
 *
 * Key Systems:
 * - StateManager: Reactive state with subscriptions
 * - TetherSystem: Tori route tether decay (Tori route only)
 * - CollectiblesManager: Notes collection per route
 * - NotificationShadeController: Mobile/desktop UI
 * - LoopController: Meta-narrative loop tracking
 * - Typewriter: Character-by-character text display with speed control
 * - Scene Stack: Manages dialogue flow and choices
 * - Backlog: Time machine system for jumping to past moments
 *
 * @class GameEngine
 */
class GameEngine {
    constructor() {
        // SOLID Refactor: Initialize centralized state management
        // @ts-ignore - External classes loaded via script tags
        this.state = new StateManager();
        // @ts-ignore
        Logger.solid('StateManager');

        // SOLID Refactor: Initialize scene rendering system
        // @ts-ignore
        this.sceneRenderer = new SceneRenderer(this);
        // @ts-ignore
        Logger.solid('SceneRenderer');

        // SOLID Refactor: Initialize UI overlay management
        // @ts-ignore
        this.uiController = new UIController(this);
        // @ts-ignore
        Logger.solid('UIController');

        // SOLID Refactor: Initialize visual effects system
        // @ts-ignore
        this.effectsController = new EffectsController(this);
        // @ts-ignore
        Logger.solid('EffectsController');

        // SOLID Refactor: Initialize text rendering system
        // @ts-ignore
        this.typewriterController = new TypewriterController(this);
        // @ts-ignore
        Logger.solid('TypewriterController');

        // SOLID Refactor: Initialize route navigation system
        // @ts-ignore
        this.routeController = new RouteController(this);
        // @ts-ignore
        Logger.solid('RouteController');

        // SOLID Refactor: Initialize ending dialog system
        // @ts-ignore
        this.endingDialogController = new EndingDialogController(this);
        // @ts-ignore
        Logger.solid('EndingDialogController');

        // SOLID Refactor: Initialize rotating tips system
        // @ts-ignore
        this.tipsController = new TipsController(this);
        // @ts-ignore
        Logger.solid('TipsController');

        // SOLID Refactor: Initialize developer HUD system
        // @ts-ignore
        this.devHUDController = new DevHUDController(this);
        // @ts-ignore
        Logger.solid('DevHUDController');

        // SOLID Refactor: Initialize credits photo system
        // @ts-ignore
        this.creditsPhotoController = new CreditsPhotoController(this);
        // @ts-ignore
        Logger.solid('CreditsPhotoController');

        // SOLID Refactor: Initialize credits display system
        // @ts-ignore
        this.creditsController = new CreditsController(this);
        // @ts-ignore
        Logger.solid('CreditsController');

        // DIZEE POLISH: Initialize global error handler
        // @ts-ignore
        this.errorHandler = new ErrorHandler(this);
        // @ts-ignore
        Logger.solid('ErrorHandler');

        // DIZEE POLISH: Initialize notification shade system
        // @ts-ignore
        this.notificationShade = new NotificationShadeController(this);

        // DIZEE POLISH: Initialize grab handle repositioner (desktop sidebar toggle)
        // @ts-ignore
        this.grabHandleRepositioner = new GrabHandleRepositioner(this);

        // Tutorial onboarding system
        // @ts-ignore
        this.tutorialManager = new TutorialManager(this);
        this.tutorialManager.init();
        // @ts-ignore
        Logger.solid('NotificationShadeController');

        // SOLID Refactor: Initialize loop/version system
        // @ts-ignore
        this.loopController = new LoopController(this);
        // @ts-ignore
        Logger.solid('LoopController');

        // SOLID Refactor: Initialize scene progression system
        // @ts-ignore
        this.sceneProgressionController = new SceneProgressionController(this);
        // @ts-ignore
        Logger.solid('SceneProgressionController');

        // SOLID Refactor: Initialize sprite management system
        // @ts-ignore
        this.spriteController = new SpriteController(this);
        // @ts-ignore
        Logger.solid('SpriteController');

        // SOLID Refactor: Initialize menu management system
        // @ts-ignore
        this.menuController = new MenuController(this);
        // @ts-ignore
        Logger.solid('MenuController');

        // SOLID Refactor: Initialize insane visuals system
        // @ts-ignore
        this.insaneVisualsController = new InsaneVisualsController(this);
        // @ts-ignore
        Logger.solid('InsaneVisualsController');

        // SOLID Refactor: Initialize reset/cleanup system
        // @ts-ignore
        this.resetController = new ResetController(this);
        // @ts-ignore
        Logger.solid('ResetController');

        // Debug mode flag (set via localStorage or URL param ?debug=true)
        this.debugMode = localStorage.getItem('debugMode') === 'true' ||
            new URLSearchParams(window.location.search).get('debug') === 'true';

        // DOM Elements
        this.loading = document.getElementById('loading-screen');
        this.loadingBar = document.getElementById('loading-bar');
        this.mainMenu = document.getElementById('main-menu');
        this.gameView = document.getElementById('game-view');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.internalThought = document.getElementById('internal-thought');
        this.sceneBackground = document.getElementById('scene-background');
        this.sceneBackgroundAlt = document.getElementById('scene-background-alt');
        this.choiceMenu = document.getElementById('choice-menu');
        this.choicesContainer = document.getElementById('choices-container');

        // Background crossfade state
        this.useAltBackground = false;
        this.currentBackground = null;

        // Tori Route Elements
        this.tetherUI = document.getElementById('tether-ui');
        this.tetherFill = document.getElementById('tether-fill');
        this.tetherText = document.getElementById('tether-text');
        this.holdOnButton = document.getElementById('hold-on-button');
        // Echo display removed - now using three-echoes-sprite.png instead
        this.notesButton = document.getElementById('notes-button');
        this.notesCount = document.getElementById('notes-count');
        this.notesViewer = document.getElementById('notes-viewer');
        this.notesList = document.getElementById('notes-list');
        // ZEERAH'S FIX: Removed closeNotesButton - using close-x instead

        // Pause UI elements
        this.pauseButton = document.getElementById('pause-button');
        this.pauseContent = document.getElementById('pause-content');

        // Skip button (unlockable feature)
        this.skipButton = document.getElementById('skip-button');

        // Character sprite containers
        this.spriteLeft = document.getElementById('character-left');
        this.spriteRight = document.getElementById('character-right');
        this.currentSprites = {
            left: null,
            right: null
        };
        // Debug: Verify sprite elements exist
        if (!this.spriteLeft) console.error('❌ Sprite element #character-left not found!');
        if (!this.spriteRight) console.error('❌ Sprite element #character-right not found!');

        // Menu carousel (UV7 glow-up)
        /** @type {any} */
        this.menuCarousel = null;

        // Route selector (UV7 glow-up)
        this.routeSelector = null;

        // State
        /** @type {any} */
        this.currentRoute = null;
        this.currentScene = null;
        this.typewriterActive = false;
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';

        // Pagination state (for mobile dialogue handling)
        this.dialoguePages = [];
        this.currentDialoguePage = 0;
        this.paginationActive = false;

        // Bubble tracking for scene-lifecycle management
        this.currentBubble = null;

        // Detect mobile for sprite handling
        this.isMobile = window.innerWidth <= 480;
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 480;
        });

        // Loop/Version system for endings - SOLID: Using StateManager
        const savedLoopVersion = parseInt(localStorage.getItem('loopVersion') || '848') || 848;
        const savedLoopStatus = localStorage.getItem('loopStatus') || 'attempting';
        this.state.set('game.loopVersion', savedLoopVersion);
        this.state.set('game.loopStatus', savedLoopStatus);
        // UI visibility state - now managed by StateManager
        // this.uiHidden removed - use this.state.get('ui.hidden') instead



        // ZEERAH'S EASTER EGG: Torigatchi reverse trapdoor
        this.easterEggSequence = '';
        this.easterEggListener = null;

        // Dialogue history for backlog
        /** @type {any[]} */
        this.dialogueHistory = [];
        this.maxHistoryLength = 100; // Keep last 100 dialogue entries

        // TORI'S SENSORY SYSTEM: Debounce + Debug Logger 💚
        this.lastHapticTime = 0;
        this.hapticCooldownMs = 80;  // Anti-spam cooldown
        /** @type {any[]} */
        this.sensoryLog = [];
        this.maxSensoryLog = 20;     // Keep last 20 sensory events for debugging

        // Game state for tracking choices, flags, and progress
        this.gameState = {
            flags: {},
            choices: {},
            progress: {},
            sprites: { left: null, right: null } // NEW: Track sprite state for save/load
        };

        // Skip system - SOLID: Using StateManager for unlocks
        // Load from localStorage into StateManager
        const skipUnlockedValue = localStorage.getItem('skipUnlocked') === 'true';
        this.state.set('unlocks.skipUnlocked', skipUnlockedValue);
        this.skipActive = false;
        this.readScenes = new Set(JSON.parse(localStorage.getItem('readScenes') || '[]'));

        // Skip prologue system
        const skipPrologueValue = localStorage.getItem('skipPrologueUnlocked') === 'true';
        this.state.set('unlocks.skipPrologueUnlocked', skipPrologueValue);

        // Ronnie notes system
        const ronnieNotesValue = localStorage.getItem('ronnieNotesUnlocked') === 'true';
        this.state.set('unlocks.ronnieNotesUnlocked', ronnieNotesValue);

        // DIZEE POLISH: Developer Commentary System (CHICHARON code)
        // Initialized here so it's available globally via game.devCommentary
        // @ts-ignore
        this.devCommentary = new DevCommentary(this);

        // Show skip button if unlocked
        if (this.skipButton) {
            this.skipButton.style.display = this.state.get('unlocks.skipUnlocked') ? 'block' : 'none';
        }

        // Initialize save/load system
        // @ts-ignore
        this.saveManager = new SaveManager(this);

        // Initialize settings manager
        // @ts-ignore
        this.settingsManager = new SettingsManager(this);

        // Initialize visual cue manager (pairs with haptics)
        // @ts-ignore
        this.visualCueManager = new VisualCueManager(this);

        // DIZEE: Initialize secret codes manager 🖤
        // @ts-ignore
        this.secretCodesManager = new SecretCodesManager(this);

        // Update codes UI now that manager exists
        if (this.settingsManager) {
            this.settingsManager.updateCodesUI();
        }

        // Initialize backlog manager (ZEERAH: Time-traveling backlog)
        // @ts-ignore
        this.backlogManager = new BacklogManager(this);

        // TORI'S ADDITION: Initialize Time Machine Manager 💚
        // @ts-ignore
        this.timeMachine = new TimeMachineManager(this, {
            maxEntries: 200,
            pruneStrategy: 'smart'
        });

        // Standalone notes viewer for main menu
        // @ts-ignore
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        // @ts-ignore
        this.saveLoadUI = new SaveLoadUI(this);

        // Initialize cutscene engine
        // @ts-ignore
        this.cutsceneEngine = new CutsceneEngine(this);

        // DIZEE: Initialize Loading Overlay for cinematic progress sequences
        // @ts-ignore
        this.loadingOverlay = new LoadingOverlay(this);

        // PAUSE MANAGER: Central pause coordination with reason stack
        // All systems that need to pause the game should use this instead of setting flags directly
        // @ts-ignore
        this.pauseManager = new PauseManager();

        // Subscribe LoadingOverlay to automatically request/release pause
        // (The overlay itself will also call this, but this ensures it's wired)

        // DIZEE: Initialize bootstrap timeline tracker 🖤
        // @ts-ignore
        this.bootstrapTracker = new BootstrapTracker(this);

        // DIZEE: Initialize Easter Egg Controller (extracted methods)
        // @ts-ignore
        this.easterEggController = new EasterEggController(this);

        // DIZEE: Initialize Keyboard Controller (extracted methods)
        // @ts-ignore
        this.keyboardController = new KeyboardController(this);

        // SOLID: Initialize Haptic Controller (extracted from GameEngine)
        // @ts-ignore
        this.hapticController = new HapticController(this);

        // SOLID: Initialize Directors Cut Controller (extracted from GameEngine)
        // @ts-ignore
        this.directorsCutController = new DirectorsCutController(this);

        // SOLID: Initialize Crew Controller (extracted from GameEngine)
        // @ts-ignore
        this.crewController = new CrewController(this);

        // SOLID: Initialize Fullscreen Controller (extracted from GameEngine)
        // @ts-ignore
        this.fullscreenController = new FullscreenController(this);

        // SOLID: Initialize Screenshot Controller (extracted from GameEngine)
        // @ts-ignore
        this.screenshotController = new ScreenshotController(this);

        // ZEE'S ADDITION: Rotating tips system 🖤
        this.mainMenuTipElement = null;
        this.routeSelectTipElement = null;
        this.mainMenuTipInterval = null;
        this.routeSelectTipInterval = null;
        this.currentMainMenuTipIndex = 0;
        this.currentRouteSelectTipIndex = 0;

        // ZEE'S ADDITION: Haptic feedback support 🖤
        this.hapticSupported = 'vibrate' in navigator;
        if (this.hapticSupported) {
            console.log('📳 Haptic feedback supported on this device');
        } else {
            console.log('⚠️ Haptic feedback NOT supported on this device');
        }

        // ZEE'S ADDITION: Input Binder (Refactoring inline handlers)
        // @ts-ignore
        this.inputBinder = new InputBinder(this);
        this.inputBinder.bindAll();

        this.init();
    }

    // ========================================
    // ERROR BOUNDARIES (Production Safety)
    // ========================================

    /**
     * @param {Error|any} error
     * @param {string} context
     */
    handleGameError(error, context = 'Unknown') {
        console.error(`❌ Game Error [${context}]:`, error);

        // Show user-friendly error overlay
        this.uiController.showErrorOverlay(
            'Something went wrong',
            `An error occurred while ${context}.\n\nThe game will attempt to recover.\n\nIf this persists, try refreshing the page.`
        );

        // Log to localStorage for debugging (keep last 10 errors)
        try {
            const errors = JSON.parse(localStorage.getItem('gameErrors') || '[]');
            errors.unshift({
                context,
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('gameErrors', JSON.stringify(errors.slice(0, 10)));
        } catch (e) {
            console.error('Failed to log error:', e);
        }
    }

    /**
     * @param {string} title
     * @param {string} message
     */
    showErrorOverlay(title, message) {
        // Delegation stub - full implementation in UIController
        this.uiController.showErrorOverlay(title, message);
    }

    // ========================================
    // TORIGATCHI EASTER EGG (CHICHARON)
    // Note: Main implementation is below at showTorigatchiEasterEgg
    // ========================================

    // ========================================
    // ALWAYS. ALWAYS. ALWAYS. (Placeholder)
    // Storm Dragon Signature
    // ========================================
    showAlwaysCompilation() {
        this.easterEggController?.showAlwaysCompilation();
    }

    // ========================================
    // DIZEE RECOGNITION (The Architect)
    // ========================================
    showDizeeEasterEgg() {
        this.easterEggController?.showDizeeEasterEgg();
    }


    // Wrap critical functions with error boundaries
    /**
     * @param {Function} fn
     * @param {string} context
     * @param {any} fallback
     */
    safeExecute(fn, context, fallback = null) {
        try {
            return fn();
        } catch (error) {
            this.handleGameError(error, context);
            return fallback;
        }
    }

    // ========================================
    // DEBUG LOGGING (Production Console Control)
    // ========================================

    /**
     * @param {...any} args
     */
    debug(...args) {
        if (this.debugMode) {
            console.log('🐛 [DEBUG]', ...args);
        }
    }

    /**
     * @param {...any} args
     */
    debugWarn(...args) {
        if (this.debugMode) {
            console.warn('⚠️ [DEBUG]', ...args);
        }
    }

    /**
     * @param {...any} args
     */
    debugError(...args) {
        if (this.debugMode) {
            console.error('❌ [DEBUG]', ...args);
        }
    }

    // ========================================
    // STATE VALIDATION GUARDS (Task 7)
    // ========================================

    validateGameState() {
        // Ensure gameState exists and has required structure
        if (!this.gameState) {
            console.warn('⚠️ gameState missing, initializing...');
            this.gameState = {
                flags: {},
                choices: {},
                progress: {},
                sprites: { left: null, right: null }
            };
            return false;
        }

        // Ensure required properties exist
        if (!this.gameState.flags) this.gameState.flags = {};
        if (!this.gameState.choices) this.gameState.choices = {};
        if (!this.gameState.progress) this.gameState.progress = {};
        if (!this.gameState.sprites) this.gameState.sprites = { left: null, right: null };

        return true;
    }

    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    getStateFlag(key, defaultValue = false) {
        this.validateGameState();
        // @ts-ignore - Dynamic key access
        return this.gameState.flags[key] ?? defaultValue;
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    setStateFlag(key, value) {
        this.validateGameState();
        // @ts-ignore - Dynamic key access
        this.gameState.flags[key] = value;
    }

    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    getStateChoice(key, defaultValue = null) {
        this.validateGameState();
        // @ts-ignore - Dynamic key access
        return this.gameState.choices[key] ?? defaultValue;
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    setStateChoice(key, value) {
        this.validateGameState();
        // @ts-ignore - Dynamic key access
        this.gameState.choices[key] = value;
    }

    // Safe localStorage access with try-catch
    /**
     * @param {string} key
     * @param {any} defaultValue
     */
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (error) {
            console.error(`Failed to read localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`Failed to write localStorage key "${key}":`, error);
            this.handleGameError(error, `saving to localStorage (${key})`);
            return false;
        }
    }

    /**
     * @param {string} jsonString
     * @param {any} [defaultValue=null]
     */
    safeJSONParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (/** @type {any} */ error) {
            console.warn('❌ Failed to parse JSON:', error);
            return defaultValue;
        }
    }

    init() {
        // Track splash start time for minimum display duration
        this.splashStartTime = Date.now();
        this.minSplashDuration = 6000; // 6 seconds minimum (matches video length)

        // ZEE'S ADDITION: Initialize rotating tips system 🖤
        this.initRotatingTips();

        // Show random loading tip
        this.showRandomLoadingTip();

        // Image cache for preloaded assets
        this.imageCache = new Map();

        // Smooth progress animation settings
        // SYNC WITH VIDEO: Match splash video duration (6 seconds)
        // This ensures loading simulation finishes when video ends
        this.minLoadingAnimationTime = 5500; // Slightly less than 6s video to complete together

        // Preload images with priority system
        const imagesToPreload = {
            // PRIORITY 1: Critical menu assets (load first)
            critical: [
                'assets/menudesktop.png',
                'assets/menumobile.webp',
                'assets/desktopVersion.webp',
                'assets/UnitedVoices7.webp'
            ],

            // PRIORITY 2: Core gameplay assets (load second)
            gameplay: [
                'assets/ronnie-sprite.png',
                'assets/tori-sprite.png',
                'assets/apartment.png',
                'assets/hospital.png',
                'assets/genericBack.png',
                'assets/digitalSpace.png'
            ],

            // PRIORITY 3: Route-specific assets (load last)
            routes: [
                'assets/echo-1-sprite.png',
                'assets/echo-2-sprite.png',
                'assets/despair-sprite.png',
                'assets/three-echoes-sprite.png'
            ]
        };

        // Flatten all images for total count
        const allImages = [
            ...imagesToPreload.critical,
            ...imagesToPreload.gameplay,
            ...imagesToPreload.routes
        ];

        let imagesLoaded = 0;
        const totalImages = allImages.length;
        /** @type {string[]} */
        const failedImages = [];
        const loadStartTime = Date.now();

        // Enhanced preload function with caching and retry logic
        /**
         * @param {string} src
         * @param {number} [retryCount=0]
         */
        const preloadImage = (src, retryCount = 0) => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    // Cache the loaded image
                    if (this.imageCache) {
                        this.imageCache.set(src, img);
                    }

                    imagesLoaded++;
                    const progress = Math.floor((imagesLoaded / totalImages) * 100);
                    if (this.loadingBar) {
                        this.loadingBar.style.width = progress + '%';
                    }

                    console.log(`✅ Loaded: ${src} (${imagesLoaded}/${totalImages})`);
                    resolve(src);
                };

                img.onerror = () => {
                    // Retry failed images up to 2 times
                    if (retryCount < 2) {
                        console.warn(`⚠️ Retrying: ${src} (attempt ${retryCount + 1}/2)`);
                        setTimeout(() => {
                            preloadImage(src, retryCount + 1).then(resolve).catch(reject);
                        }, 500 * (retryCount + 1)); // Exponential backoff
                    } else {
                        // After 2 retries, mark as failed and continue
                        console.error(`❌ Failed to load: ${src}`);
                        failedImages.push(src);

                        imagesLoaded++;
                        const progress = Math.floor((imagesLoaded / totalImages) * 100);
                        if (this.loadingBar) {
                            this.loadingBar.style.width = progress + '%';
                        }

                        resolve(src); // Resolve anyway to continue loading
                    }
                };

                img.src = src;
            });
        };

        // Load images in priority order
        /**
         * @param {string[]} group
         */
        const loadPriorityGroup = async (group) => {
            return Promise.all(group.map(src => preloadImage(src)));
        };

        // Sequential priority loading
        (async () => {
            try {
                // Load critical assets first
                await loadPriorityGroup(imagesToPreload.critical);
                console.log('📦 Critical assets loaded');

                // Load gameplay assets second
                await loadPriorityGroup(imagesToPreload.gameplay);
                console.log('📦 Gameplay assets loaded');

                // Load route-specific assets last
                await loadPriorityGroup(imagesToPreload.routes);
                console.log('📦 Route assets loaded');

                // All loading complete
                const actualLoadTime = Date.now() - loadStartTime;

                // TASK 6: Validate critical assets loaded successfully
                const criticalFailed = failedImages.filter(src =>
                    imagesToPreload.critical.includes(src)
                );

                if (criticalFailed.length > 0) {
                    console.error('❌ CRITICAL ASSETS FAILED TO LOAD:', criticalFailed);
                    this.uiController.showErrorOverlay(
                        'Asset Loading Error',
                        'Some critical game assets failed to load.\n\nPlease check your internet connection and refresh the page.'
                    );
                    return; // Don't proceed to game
                }

                if (failedImages.length > 0) {
                    console.warn(`⚠️ ${failedImages.length} non-critical images failed to load:`, failedImages);
                }

                console.log(`✅ Loading complete: ${imagesLoaded}/${totalImages} loaded in ${actualLoadTime}ms`);

                // ========================================
                // SMOOTH PROGRESS SIMULATION FOR FAST LOADS
                // ========================================

                // If loading was TOO FAST (< 2 seconds), simulate smooth progress to make it feel satisfying
                if (this.minLoadingAnimationTime && actualLoadTime < this.minLoadingAnimationTime) {
                    const remainingAnimTime = this.minLoadingAnimationTime - actualLoadTime;
                    console.log(`⏱️ Fast load detected (${actualLoadTime}ms). Simulating smooth progress for ${remainingAnimTime}ms more...`);

                    // Smoothly animate from current progress to 100% over remaining time
                    const startProgress = this.loadingBar ? (parseInt(this.loadingBar.style.width) || 0) : 0;
                    const progressToGo = 100 - startProgress;
                    const steps = Math.ceil(remainingAnimTime / 50); // Update every 50ms
                    const progressPerStep = progressToGo / steps;

                    let currentStep = 0;
                    const smoothInterval = setInterval(() => {
                        currentStep++;
                        const newProgress = Math.min(100, startProgress + (progressPerStep * currentStep));
                        if (this.loadingBar) {
                            this.loadingBar.style.width = newProgress + '%';
                        }

                        if (currentStep >= steps || newProgress >= 100) {
                            clearInterval(smoothInterval);
                            if (this.loadingBar) {
                                this.loadingBar.style.width = '100%';
                            }

                            // Now proceed to menu display logic
                            this.proceedToMenu();
                        }
                    }, 50);
                } else {
                    // Loading took long enough, proceed immediately
                    if (this.loadingBar) {
                        this.loadingBar.style.width = '100%';
                    }
                    this.proceedToMenu();
                }

            } catch (error) {
                console.error('Critical loading error:', error);
                // Even on error, show the menu
                this.proceedToMenu(true);
            }
        })();

        // Event Listeners
        this.holdOnButton?.addEventListener('click', () => {
            if (this.currentRoute && this.currentRoute.holdOn) {
                this.currentRoute.holdOn();
            }
        });

        this.notesButton?.addEventListener('click', () => {
            this.showNotes();
        });

        // ZEERAH'S FIX: Removed closeNotesButton listener - X button handles it via onclick

        // ========================================
        // GLOBAL ERROR HANDLERS (Production Safety)
        // ========================================

        window.addEventListener('error', (event) => {
            // Get more detailed error information
            const errorDetails = event.error || {
                message: event.message || 'Unknown error',
                filename: event.filename || 'unknown file',
                lineno: event.lineno || 'unknown line',
                colno: event.colno || 'unknown column'
            };

            // Only handle errors from our own scripts, not cross-origin
            if (event.filename && event.filename.includes('v848')) {
                this.handleGameError(errorDetails, 'uncaught error');
                event.preventDefault();
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleGameError(event.reason || new Error('Promise rejection'), 'unhandled promise rejection');
            event.preventDefault();
        });

        // Mobile sprite positioning fix
        if (window.innerWidth <= 1023) {
            this.fixMobileSpritePositioning();
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1023) {
                this.fixMobileSpritePositioning();
            }
        });

        // ========================================
        // DIALOGUE ADVANCEMENT - Multi-Event Support
        // Click/Tap/Touch to skip typing or advance
        // ========================================

        // Primary: Click event (desktop compatibility)
        if (this.dialogueBox) {
            this.dialogueBox.addEventListener('click', () => {
                // @ts-ignore - click event handling is safe here
                this.handleDialogueClick();
            });
        }


        // Keyboard controls (Spacebar or Enter)
        document.addEventListener('keydown', (e) => {

            // [H] KEY: Toggle UI visibility (for screenshots)
            if (e.code === 'KeyH' && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in input fields
                const target = /** @type {HTMLElement} */(e.target);
                if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                this.toggleUI();
                return;
            }

            // [S] KEY: Toggle skip on/off
            if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in input fields
                const target = /** @type {HTMLElement} */(e.target);
                if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                this.toggleSkip();
                return;
            }

            // [CTRL] KEY: Hold to skip (activate skip mode)
            // Check specifically for Control key press, not just ctrlKey modifier
            if ((e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') && !this.skipActive) {

                // DIZEE FIX: Don't trigger skip on Main Menu or when paused (e.g. for screenshots)
                // @ts-ignore - isPaused is a dynamic property managed by state
                if ((this.mainMenu && this.mainMenu.style.display !== 'none') || this.isPaused) {
                    return;
                }

                console.log('🔑 CTRL key detected. skipUnlocked:', this.state.get('unlocks.skipUnlocked'), 'skipActive:', this.skipActive);

                if (this.state.get('unlocks.skipUnlocked')) {
                    e.preventDefault(); // Prevent browser shortcuts
                    this.skipActive = true;
                    console.log('⏩ CTRL pressed: Skip mode activated');

                    if (this.skipButton) {
                        this.skipButton.classList.add('active', 'ctrl-held');
                        console.log('✅ Skip button classes updated');
                    } else {
                        console.warn('⚠️ Skip button element not found!');
                    }
                    const skipIndicator = this.uiController.skipIndicator;
                    if (skipIndicator) {
                        skipIndicator.style.display = 'block';
                        console.log('✅ Skip indicator shown');
                    } else {
                        console.warn('⚠️ Skip indicator element not found!');
                    }
                } else {
                    // Debug: Show why CTRL skip isn't working
                    console.log('⚠️ CTRL skip locked: Complete any ending to unlock (use game.unlockSkipFeature())');
                }
            }

            // SPACEBAR/ENTER handling moved to keyboard-controller.js
            // which properly checks typewriter state before advancing
        });

        // [CTRL] KEY RELEASE: Stop hold-to-skip
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control' || e.key === 'Meta') {
                console.log('⏸️ CTRL released: Skip mode deactivating');
                if (this.skipButton && this.skipButton.classList.contains('ctrl-held')) {
                    // Only deactivate if it was activated via ctrl-hold (not toggle)
                    this.skipActive = false;
                    this.skipButton.classList.remove('active', 'ctrl-held');
                    const skipIndicator = this.uiController.skipIndicator;
                    if (skipIndicator) {
                        skipIndicator.style.display = 'none';
                    }
                }
            }
        });

        // Initialize dynamic title system
        this.updateTitleScreen();

        // Listen for fullscreen changes (user can also press F11 or ESC)
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('mozfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('MSFullscreenChange', () => this.updateFullscreenButton());

        // ========================================
        // DIZEE: GLOBAL KEYBOARD NAVIGATION SYSTEM
        // Comprehensive accessibility and keyboard control
        // ========================================
        this.initializeKeyboardNavigation();

        // Setup hierarchical ESC key handling
        this.setupHierarchicalEscapeHandler();
    }

    // ========================================
    // HIERARCHICAL ESC KEY HANDLER
    // Closes UI layers in order: note detail → note viewer → settings → save/load → pause menu
    // ========================================
    setupHierarchicalEscapeHandler() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;

            // Check for open UI layers in priority order (topmost first)

            // 1. Individual note detail overlay
            const noteDetail = document.querySelector('.note-detail-overlay');
            if (noteDetail && window.getComputedStyle(noteDetail).display !== 'none') {
                e.preventDefault();
                const closeBtn = noteDetail.querySelector('.note-close-btn');
                /** @type {HTMLElement} */(closeBtn)?.click();
                return;
            }

            // 2. Standalone notes viewer
            const notesViewer = this.uiController.standaloneNotesViewer;
            if (this.uiController.isVisible(notesViewer)) {
                e.preventDefault();
                const closeBtn = notesViewer.querySelector('.notes-close-btn');
                /** @type {HTMLElement} */(closeBtn)?.click();
                return;
            }

            // 3. Settings menu (from pause menu)
            if (this.uiController.isVisible(this.uiController.settingsMenu)) {
                e.preventDefault();
                this.closeSettings();
                return;
            }

            // 4. Save/Load screen (from pause menu)
            const saveLoadScreen = document.getElementById('save-load-screen');
            if (saveLoadScreen && window.getComputedStyle(saveLoadScreen).display !== 'none') {
                e.preventDefault();
                if (this.saveLoadUI && this.saveLoadUI.showPauseMenu) {
                    this.saveLoadUI.showPauseMenu();
                }
                return;
            }

            // 5. Pause menu
            if (this.uiController.isVisible(this.uiController.pauseMenu)) {
                e.preventDefault();
                if (this.saveLoadUI && this.saveLoadUI.hidePauseMenu) {
                    this.saveLoadUI.hidePauseMenu();
                }
                return;
            }

            // If no UI layers are open, ESC does nothing (game handles it separately)
        });

        console.log('✅ Hierarchical ESC handler initialized');
    }


    // ========================================
    // CREDITS PHOTO POOLS
    // Randomized visual storytelling for endings
    // ========================================

    getCreditsPhotoPools() {
        return this.creditsPhotoController.getPools();
    }

    /**
     * @param {string} endingType
     */
    selectRandomPhotos(endingType) {
        return this.creditsPhotoController.selectRandom(endingType);
    }

    // ========================================
    // LOOP/VERSION SYSTEM
    // Player journey through failed timelines
    // ========================================

    showMainMenu() {
        return this.menuController.showMainMenu();
    }

    handleSplashSkip() {
        return this.menuController.handleSplashSkip();
    }

    updateTitleScreen() {
        return this.sceneProgressionController.updateTitleScreen();
    }

    // ========================================
    // TORIGATCHI MAIN MENU UNLOCK SYSTEM
    // DIZEE'S ADDITION: Unlocks after first secret code use 🔧
    // ========================================

    updateMainMenuLayout() {
        return this.menuController.updateMainMenuLayout();
    }

    // ========================================
    // ROTATING TIPS SYSTEM
    // ZEE'S ADDITION: Ambient discovery on main menu & route select 🖤
    // ========================================

    initRotatingTips() {
        return this.menuController.initRotatingTips();
    }

    getMainMenuTips() {
        return this.menuController.getMainMenuTips();
    }

    getRouteSelectTips() {
        return this.menuController.getRouteSelectTips();
    }

    startMainMenuTipRotation() {
        return this.menuController.startMainMenuTipRotation();
    }

    stopMainMenuTipRotation() {
        return this.menuController.stopMainMenuTipRotation();
    }

    startRouteSelectTipRotation() {
        return this.menuController.startRouteSelectTipRotation();
    }

    stopRouteSelectTipRotation() {
        return this.menuController.stopRouteSelectTipRotation();
    }

    // ========================================
    // HAPTIC FEEDBACK SYSTEM
    // ZEE'S ADDITION: Physical immersion for mobile 🖤
    // Progressive enhancement - Android focused, opt-in
    // ========================================

    // ========================================
    // HAPTIC PATTERN LIBRARY (TORI'S ARCHITECTURE) 💚
    // ========================================

    getHapticPatterns() {
        return this.uiController.getHapticPatterns();
    }

    /**
     * @param {number|number[]} pattern
     * @param {number} comfortLevel
     */
    scaleHapticPattern(pattern, comfortLevel) {
        // Delegation stub - full implementation in HapticController
        return this.hapticController?.scaleHapticPattern(pattern, comfortLevel) ?? pattern;
    }

    /**
     * @param {string} patternName
     * @param {string} [description='']
     * @param {object} [options={}]
     * @param {string} [options.channel='ui']
     * @param {boolean} [options.force=false]
     */
    triggerHaptic(patternName, description = '', options = {}) {
        // Delegation stub - full implementation in HapticController
        this.hapticController?.triggerHaptic(patternName, description, options);
    }

    /**
     * @param {string} cueType
     * @param {string} channel
     * @param {any} pattern
     * @param {string} description
     */
    logSensory(cueType, channel, pattern, description) {
        // Delegation stub - full implementation in HapticController
        this.hapticController?.logSensory(cueType, channel, pattern, description);
    }

    // ========================================
    // UNIFIED SENSORY FEEDBACK (TORI'S METADATA-DRIVEN ARCHITECTURE) 💚
    // Triggers both haptic and visual cues together
    // ========================================

    /**
     * @param {string} cueType
     */
    triggerSensoryFeedback(cueType, target = null, description = '') {
        // Delegation stub - full implementation in HapticController
        this.hapticController?.triggerSensoryFeedback(cueType, target, description);
    }

    // ========================================
    // DEV HUD SYSTEM
    // Hidden debug overlay toggled via secret code
    // ========================================

    toggleDevHUD() {
        this.devHUDController.toggle();
    }

    updateDevHUD() {
        this.devHUDController.update();
    }

    incrementVersion() {
        return this.sceneProgressionController.incrementVersion();
    }

    breakLoop() {
        this.loopController.break();
    }

    acceptEnding() {
        this.loopController.accept();
    }

    // ========================================
    // LOOP REINIT SCREEN (Delegated to EffectsController)
    // Shows when player retries after failure
    // ========================================

    /**
     * @param {Function} callback
     * @param {any} currentRoute
     */
    showLoopInit(callback, currentRoute) {
        this.effectsController?.showLoopInit(callback, currentRoute);
    }

    startMatrixRain() {
        this.effectsController?.startMatrixRain();
    }

    skipLoopInit() {
        this.effectsController?.skipLoopInit();
    }

    closeLoopInit() {
        this.effectsController?.closeLoopInit();
    }

    // ========================================
    // CODE RAIN TRANSITIONS (Delegated to EffectsController)
    // Cyan Matrix rain for scene transitions
    // ========================================

    /**
     * @param {Function} callback
     * @param {number} [duration=1500]
     */
    showCodeRainTransition(callback, duration = 1500) {
        return this.sceneProgressionController.showCodeRainTransition(callback, duration);
    }

    /**
     * @param {HTMLCanvasElement} canvas
     */
    startTransitionRain(canvas) {
        this.effectsController?.startTransitionRain(canvas);
    }

    stopTransitionRain() {
        this.effectsController?.stopTransitionRain();
    }

    // ========================================
    // NOTES UNLOCK SYSTEM
    // First-play: hidden. Replay: visible.
    // ========================================

    hasCompletedAnyEnding() {
        return this.sceneProgressionController.hasCompletedAnyEnding();
    }

    /**
     * @param {string} endingType
     */
    markEndingCompleted(endingType) {
        const wasFirstCompletion = !this.hasCompletedAnyEnding();

        localStorage.setItem('hasCompletedOnce', 'true');
        localStorage.setItem('lastEndingType', endingType);
        console.log(`Ending completed: ${endingType}. Notes unlocked for replay.`);

        // DIZEE: Apply ending-specific theme when returning to menu 🎨
        // @ts-ignore - ThemeManager is defined in theme.js
        if (typeof ThemeManager !== 'undefined') {
            // @ts-ignore - ThemeManager is defined in theme.js
            ThemeManager.setEndingTheme(endingType);
        }

        // ZEERAH'S ADDITION: Show notes unlock notification on first completion
        if (wasFirstCompletion) {
            // Delay slightly so it shows after ending scene
            setTimeout(() => {
                this.showNotesUnlockNotification();
            }, 1000);
        }
    }

    // ========================================
    // TIME MACHINE MANAGER HELPERS (TORI'S ARCHITECTURE) 💚
    // ========================================

    // Get current position in story for snapshot creation
    getScenePosition() {
        // Extract route name from currentRoute object
        let routeId = null;
        if (this.currentRoute) {
            // Routes don't have explicit IDs, derive from constructor name
            const routeClass = this.currentRoute.constructor.name;
            if (routeClass === 'RonnieRoute') routeId = 'ronnie';
            else if (routeClass === 'ToriRoute') routeId = 'tori';
            else if (routeClass === 'SharedPrologue') routeId = 'prologue';
            else routeId = routeClass.toLowerCase();
        }

        return {
            currentRouteId: routeId,
            currentSceneId: this.currentScene?.id || null,
            currentPageIndex: this.currentDialoguePage || 0
        };
    }

    // Load scene from snapshot (time jump restoration)
    /**
     * @param {any} entry
     */
    async loadSceneFromSnapshot(entry) {
        if (!entry.routeId) {
            console.warn('⏰ Cannot load snapshot: missing routeId');
            return;
        }

        // If we're not in the right route, switch to it
        const currentRouteId = this.getScenePosition().currentRouteId;
        if (currentRouteId !== entry.routeId) {
            console.log(`⏰ Switching from ${currentRouteId} to ${entry.routeId}`);

            // Start the correct route
            if (entry.routeId === 'ronnie') {
                this.startRoute('ronnie');
            } else if (entry.routeId === 'tori') {
                this.startRoute('tori');
            } else if (entry.routeId === 'prologue') {
                // Load prologue if needed
                console.warn('⏰ Prologue jump not yet implemented');
                return;
            }

            // Wait for route to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Now jump to the specific scene/page within the route
        if (this.currentRoute && entry.sceneId) {
            // Routes have their own goToScene methods
            if (this.currentRoute.goToScene) {
                await this.currentRoute.goToScene(entry.sceneId, entry.pageIndex);
            } else {
                console.warn(`⏰ Route ${entry.routeId} does not have goToScene method`);
            }
        }
    }

    // Check if insane mode is currently active
    isInsaneModeActive() {
        // @ts-ignore - Dynamic property access
        return this.gameState?.flags?.insaneModeLocked || false;
    }

    // Get serializable flags for snapshot
    getSerializableFlags() {
        return { ...this.gameState.flags };
    }

    // Apply flags from snapshot
    /**
     * @param {any} flags
     */
    applySerializableFlags(flags) {
        this.gameState.flags = { ...flags };
    }

    // Get current background key for snapshot
    getCurrentBackgroundKey() {
        return this.currentBackground || null;
    }

    // Get current sprite key for snapshot
    getCurrentSpriteKey() {
        // Return composite key of both sprites
        const left = this.currentSprites?.left || null;
        const right = this.currentSprites?.right || null;
        return { left, right };
    }

    // Set background by key (for snapshot restoration)
    /**
     * @param {string} bgKey
     */
    setBackgroundByKey(bgKey) {
        if (!bgKey) return;
        this.currentBackground = bgKey;
        // Apply to DOM
        const target = this.useAltBackground ? this.sceneBackgroundAlt : this.sceneBackground;
        if (target) {
            target.style.backgroundImage = `url('${bgKey}')`;
        }
    }

    // Set sprites by key (for snapshot restoration)
    /**
     * @param {{left?: string, right?: string}} spriteKey
     */
    setSpriteByKey(spriteKey) {
        if (!spriteKey) return;

        if (spriteKey.left) {
            if (this.spriteLeft) {
                this.spriteLeft.style.backgroundImage = `url('${spriteKey.left}')`;
                this.spriteLeft.style.display = 'block';
            }
        }

        if (spriteKey.right) {
            if (this.spriteRight) {
                this.spriteRight.style.backgroundImage = `url('${spriteKey.right}')`;
                this.spriteRight.style.display = 'block';
            }
        }
    }

    // ========================================
    // STORY START - PLAYS PROLOGUE FIRST
    // ========================================

    startStory() {
        return this.sceneProgressionController.startStory();
    }

    startPrologueNormally() {
        return this.sceneProgressionController.startPrologueNormally();
    }

    // ========================================
    // ROUTE SELECTION SCREEN
    // ========================================

    showRouteSelect() {
        this.routeController.showRouteSelect();
    }

    backToMenu() {
        this.routeController.backToMenu();
    }

    // ========================================
    // SKIP PROLOGUE SYSTEM
    // ========================================

    showSkipProloguePrompt() {
        return this.sceneProgressionController.showSkipProloguePrompt();
    }

    skipToRouteSelection() {
        return this.sceneProgressionController.skipToRouteSelection();
    }

    unlockSkipPrologue() {
        return this.routeController.unlockSkipPrologue();
    }

    // ========================================
    // RONNIE NOTES SYSTEM UNLOCK
    // Unlocks notes viewer for Ronnie's route + Tab 2
    // ========================================

    unlockRonnieNotesSystem() {
        return this.sceneProgressionController.unlockRonnieNotesSystem();
    }

    // ========================================
    // ROUTE START
    // ========================================

    /**
     * @param {string} routeName
     */
    startRoute(routeName) {
        return this.sceneProgressionController.startRoute(routeName);
    }

    // ========================================
    // SPRITE FADE SEQUENCE (for prologue vision)
    // ========================================

    /**
     * @param {string} position
     * @param {string} sprite1
     * @param {string} sprite2
     * @param {number} [duration=4000]
     */
    fadeSpritesSequence(position, sprite1, sprite2, duration = 4000) {
        return this.spriteController.fadeSpritesSequence(position, sprite1, sprite2, duration);
    }

    /**
     * @param {Function} callback
     */
    triggerEchoMerge(callback) {
        return this.spriteController.triggerEchoMerge(callback);
    }

    // ========================================
    // SCENE DISPLAY
    // ========================================

    /**
     * @param {any} scene
     * @param {string} sceneId
     */
    displayScene(scene, sceneId) {
        this.currentScene = scene;

        // Reset pagination state at start of every scene
        this.paginationActive = false;

        // Store scene ID for save system (with safety check)
        if (sceneId) {
            if (!this.gameState.progress) {
                this.gameState.progress = {};
            }
            // @ts-ignore - Dynamic property
            this.gameState.progress.currentScene = sceneId;
        }

        // Handle character display (speaker highlighting)
        if (scene.character) {
            this.setActiveSpeaker(scene.character);
        }

        // Update character name
        // Update character name
        if (this.characterName) {
            this.characterName.textContent = scene.character || '';
            this.characterName.style.display = scene.character ? 'block' : 'none';
        }

        // Add to dialogue history for backlog
        if (scene.character || scene.dialogue) {
            this.addToDialogueHistory({
                character: scene.character || 'Narration',
                dialogue: scene.dialogue || '',
                internal: scene.internal || '',
                distorted: scene.distorted || false // Track hijacked/corrupted dialogue
            });
        }

        // Handle sprites (show/hide based on scene data)
        if (scene.sprites) {
            this.sceneRenderer.updateSprites(scene.sprites);
        }

        // Clear previous dialogue
        if (this.dialogueText) this.dialogueText.textContent = '';
        if (this.internalThought) this.internalThought.textContent = '';

        // Store full dialogue for skip functionality
        this.fullDialogueText = scene.dialogue || '';

        // Handle dialogue with typewriter effect
        if (scene.dialogue) {
            // Pass internal text length so pagination considers BOTH dialogue + internal
            const internalLength = scene.internal ? scene.internal.length : 0;

            // Create callback for skip auto-advance
            const typewriterCallback = () => {
                // If skip is active and this scene is read, auto-advance
                if (this.skipActive && sceneId && this.isSceneRead(sceneId)) {
                    // Small delay so player can see the text briefly
                    setTimeout(() => {
                        if (this.skipActive && this.choiceMenu && !this.choiceMenu.style.display.includes('flex')) {
                            this.advance();
                        }
                    }, 100); // 100ms pause on each scene
                } else if (this.skipActive && sceneId && !this.isSceneRead(sceneId)) {
                    // Debug: Explain why CTRL skip isn't working
                    console.log('⏭️ CTRL skip: Scene not read yet, use S key to skip unread scenes');
                }
            };

            // ZEE'S ADDITION: Support slow-motion reveal 🖤
            const slowReveal = scene.slowReveal || false;
            this.sceneRenderer.typewriterText(this.dialogueText, scene.dialogue, typewriterCallback, internalLength, slowReveal);
        }

        // ========================================
        // INTERNAL THOUGHTS - UNIVERSAL BUBBLE SYSTEM
        // ========================================

        // Remove previous bubble when displaying new scene
        this.removeInternalBubble();

        if (scene.internal) {
            // UNIVERSAL: Create floating bubble for ALL platforms
            const position = this.determineCharacterPosition(scene);
            this.createInternalBubble(scene.internal, position);

            // Hide the internal thought section in dialogue box (no longer needed)
            if (this.internalThought) this.internalThought.style.display = 'none';
        } else {
            if (this.internalThought) this.internalThought.style.display = 'none';
        }

        // Handle choices
        if (scene.choices) {
            this.sceneRenderer.showChoices(scene.choices, scene.onChoice);
        } else {
            if (this.choiceMenu) this.choiceMenu.style.display = 'none';
        }

        // Echo display handled by three-echoes-sprite.png now

        // Handle background changes with crossfade
        if (scene.background) {
            this.sceneRenderer.crossfadeBackground(scene.background);
            // ZEE'S ADDITION: Track current background for backlog thumbnails 🖤
            this.currentBackground = scene.background;
        }
        // If no background specified, keep previous background (currentBackground stays same)

        // Handle special styling (preserve route, prologue, epilogue classes!)
        // Handle special styling (preserve route, prologue, epilogue classes!)
        // First, get current special classes
        if (this.dialogueBox) {
            const routeClass = this.dialogueBox.classList.contains('ronnie-route') ? 'ronnie-route' :
                this.dialogueBox.classList.contains('tori-route') ? 'tori-route' : null;
            const prologueClass = this.dialogueBox.classList.contains('prologue-style') ? 'prologue-style' : null;
            const epilogueClass = this.dialogueBox.classList.contains('epilogue-style') ? 'epilogue-style' : null;

            // Clear scene-specific styles but keep route/prologue/epilogue classes
            this.dialogueBox.className = '';
            if (routeClass) this.dialogueBox.classList.add(routeClass);
            if (prologueClass) this.dialogueBox.classList.add(prologueClass);
            if (epilogueClass) this.dialogueBox.classList.add(epilogueClass);
        }

        // Add new scene style if specified
        // Add new scene style if specified
        if (scene.style) {
            this.dialogueBox?.classList.add(scene.style);
        }

        // Auto-save after each scene (if route is active)
        if (this.currentRoute) {
            this.saveManager.autoSave();
        }

        // TORI'S TIME MACHINE: Record snapshot after scene display 💚⏰
        if (this.timeMachine && sceneId) {
            // Label with scene ID for easier debugging
            const label = `${sceneId}`;
            this.timeMachine.addCurrentState(label);
        }

        // SKIP SYSTEM: Mark scene as read and check if should continue skipping
        if (sceneId) {
            this.markSceneAsRead(sceneId);
        }

        // If skip is active and this scene was already read, check if we should stop
        if (this.skipActive && sceneId) {
            if (this.shouldStopSkipping(scene)) {
                // Stop skipping - new content or choice detected
                this.skipActive = false;
                const skipButton = document.getElementById('skip-button');
                if (skipButton) {
                    skipButton.classList.remove('active');
                }
                const skipIndicator = this.uiController.skipIndicator;
                if (skipIndicator) {
                    skipIndicator.style.display = 'none';
                }
                console.log('Skip stopped - new content/choice detected');
            }
        }
    }

    // ========================================
    // SPRITE MANAGEMENT
    // SOLID: Delegated to SceneRenderer
    // ========================================

    /**
     * @param {any} sprites
     */
    updateSprites(sprites) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.updateSprites(sprites);
    }

    displayEchoGroup() {
        return this.spriteController.displayEchoGroup();
    }

    /**
     * @param {string} stage
     */
    setEchoGrowthStage(stage) {
        return this.spriteController.setEchoGrowthStage(stage);
    }

    /**
     * @param {string} speaker
     */
    setActiveSpeaker(speaker) {
        return this.spriteController.setActiveSpeaker(speaker);
    }

    clearAllSprites() {
        return this.sceneProgressionController.clearAllSprites();
    }

    // ========================================
    // TORI DIGITAL SPRITE EFFECTS
    // ========================================

    setDigitalSpriteEffect(position = 'right', intense = false) {
        const sprite = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!sprite) return;

        sprite.classList.add('digital-sprite');
        if (intense) {
            sprite.classList.add('glitch-intense');
        }
        console.log(`💚 Digital sprite effect enabled (${position}, intense: ${intense})`);
    }

    clearDigitalSpriteEffect(position = 'right') {
        const sprite = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!sprite) return;

        sprite.classList.remove('digital-sprite', 'glitch-intense');
        console.log(`💚 Digital sprite effect cleared (${position})`);
    }

    restoreSprites() {
        return this.spriteController.restoreSprites();
    }

    hideAllSprites() {
        return this.spriteController.hideAllSprites();
    }

    // ========================================
    // TYPEWRITER EFFECT WITH PAGINATION
    // UPDATED: Lowered threshold to 150 chars for mobile
    // ========================================

    /**
     * @param {HTMLElement} element
     * @param {string} text
     * @param {Function} callback
     * @param {number} [internalTextLength=0]
     * @param {boolean} [slowReveal=false]
     */
    typewriterText(element, text, callback, internalTextLength = 0, slowReveal = false) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.typewriterText(element, text, callback, internalTextLength, slowReveal);
    }

    getTypewriterSpeed() {
        return this.typewriterController.getSpeed();
    }

    /**
     * @param {number} textLength
     */
    shouldPaginateText(textLength) {
        return this.typewriterController.shouldPaginate(textLength);
    }

    /**
     * @param {HTMLElement} element
     * @param {string} text
     * @param {Function} callback
     */
    paginateAndDisplayText(element, text, callback) {
        this.typewriterController.paginateAndDisplay(element, text, callback);
    }

    /**
     * @param {string} text
     * @param {number} charsPerPage
     */
    splitTextIntoPages(text, charsPerPage) {
        return this.typewriterController.splitTextIntoPages(text, charsPerPage);
    }

    /**
     * @param {HTMLElement} element
     */
    displayDialoguePage(element) {
        this.typewriterController.displayPage(element);
    }

    showNextDialoguePage() {
        this.typewriterController.showNextPage();
    }

    skipTypewriter() {
        this.typewriterController.skip();
    }

    handleDialogueClick() {
        this.typewriterController.handleClick();
    }

    advance() {
        // Don't advance if choices are showing
        if (this.choiceMenu && this.choiceMenu.style.display === 'block') return;

        // DIZEE FIX: Cancel auto-advance timer before advancing to next scene
        if (this.settingsManager) {
            this.settingsManager.cancelAutoAdvance();
        }

        if (this.currentScene && this.currentScene.next) {
            this.currentScene.next();
        }
    }

    /**
     * @param {any[]} choices
     * @param {Function} onChoice
     */
    showChoices(choices, onChoice) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.showChoices(choices, onChoice);
    }

    // ========================================
    // ECHO DISPLAY (TORI ROUTE)
    // ========================================

    // displayEchoes and clearEchoes removed - now using three-echoes-sprite.png

    // ========================================
    // NOTES SYSTEM
    // ========================================

    showNotes() {
        // Delegation stub - full implementation in CollectiblesManager
        this.currentRoute?.collectiblesManager?.showNotesViewer();
    }

    // ========================================
    // ENDING DIALOG (THREE-OPTION SYSTEM)
    // ========================================

    showEndingDialog(endingType = null) {
        this.endingDialogController.show(endingType);
    }

    setupEndingDialogButtons() {
        this.endingDialogController.setupButtons();
    }

    setupEndingDialogKeyboard() {
        this.endingDialogController.setupKeyboard();
    }

    /**
     * @param {number} index
     */
    focusEndingOption(index) {
        this.endingDialogController.focusOption(index);
    }

    hideEndingDialog() {
        this.endingDialogController.hide();
    }

    // ========================================
    // CREDITS (Delegated to CreditsController)
    // ========================================

    /**
     * @param {string|null} [endingType=null]
     */
    showCredits(endingType = null) {
        this.creditsController?.showCredits(endingType);
    }

    /**
     * @param {string} endingType
     * @param {string} playerVersion
     */
    buildDynamicTitleSection(endingType, playerVersion) {
        return this.creditsController?.buildDynamicTitleSection(endingType, playerVersion);
    }

    /**
     * @param {number} photoCount
     */
    cycleCreditsPhotos(photoCount) {
        this.creditsController?.cycleCreditsPhotos(photoCount);
    }

    setupPortraitPhotoFlash() {
        this.creditsController?.setupPortraitPhotoFlash();
    }

    /**
     * @param {HTMLElement} overlay
     */
    addCreditsControls(overlay) {
        this.creditsController?.addCreditsControls(overlay);
    }

    /**
     * @param {string} endingType
     * @param {string} playerVersion
     * @param {string[]} photos
     */
    showCreditsLandscapeWithPhotos(endingType, playerVersion, photos) {
        this.creditsController?.showCreditsLandscapeWithPhotos(endingType, playerVersion, photos);
    }

    /**
     * @param {string} endingType
     * @param {string} playerVersion
     * @param {string[]} photos
     */
    showCreditsPortraitWithPhotos(endingType, playerVersion, photos) {
        this.creditsController?.showCreditsPortraitWithPhotos(endingType, playerVersion, photos);
    }

    /**
     * @param {string} endingType
     * @param {string} playerVersion
     */
    showCreditsStandard(endingType, playerVersion) {
        this.creditsController?.showCreditsStandard(endingType, playerVersion);
    }

    // ========================================
    // CONFIRMATION DIALOG SYSTEM
    // ZEE'S ADDITION: Replace browser alerts with custom overlays 🖤
    // ========================================

    /**
     * @param {string} title
     * @param {string} message
     * @param {Function} onConfirm
     * @param {boolean} [showCancel=true]
     */
    showConfirmDialog(title, message, onConfirm, showCancel = true) {
        // Delegation stub - full implementation in UIController
        this.uiController.showConfirmDialog(title, message, onConfirm, showCancel);
    }

    /**
     * @param {string} title
     * @param {string} message
     */
    showMessage(title, message) {
        // Simple message (no cancel button)
        this.uiController.showConfirmDialog(title, message, () => { }, false);
    }

    showMeetTheCrew() {
        // Delegation stub - full implementation in CrewController
        this.crewController?.show();
    }

    /**
     * @param {number} index
     */
    displayCrewScreen(index) {
        // Delegation stub - full implementation in CrewController
        this.crewController?.displayScreen(index);
    }

    nextCrew() {
        // Delegation stub - full implementation in CrewController
        this.crewController?.next();
    }

    closeCrew() {
        // Delegation stub - full implementation in CrewController
        this.crewController?.close();
    }

    showDirectorsCut() {
        // Delegation stub - full implementation in DirectorsCutController
        this.directorsCutController?.show();
    }

    // ========================================
    // CONTACT SCREEN
    // ========================================

    showContact() {
        const contactScreen = document.getElementById('contact-screen');
        if (!contactScreen) {
            console.error('Contact screen element not found');
            return;
        }

        // Hide main menu
        if (this.mainMenu) {
            this.mainMenu.style.display = 'none';
        }

        // Show contact screen
        contactScreen.style.display = 'flex';

        console.log('Contact screen displayed');
    }

    closeContact() {
        const contactScreen = document.getElementById('contact-screen');
        if (contactScreen) {
            contactScreen.style.display = 'none';
        }

        // Return to main menu
        if (this.mainMenu) {
            this.mainMenu.style.display = 'flex';
            this.mainMenu.style.opacity = '1';
        }
    }

    // ========================================
    // SAVE/LOAD SYSTEM METHODS
    // ========================================

    resumeGame() {
        this.saveLoadUI.hidePauseMenu();
    }

    /**
     * @param {string} mode
     */
    showSaveLoadScreen(mode, fromPauseMenu = false) {
        this.saveLoadUI.showSaveLoadScreen(mode, fromPauseMenu);
    }

    closeSaveLoadScreen() {
        this.saveLoadUI.closeSaveLoadScreen();
    }

    /**
     * @param {string} mode
     */
    setSaveLoadMode(mode) {
        this.saveLoadUI.setSaveLoadMode(mode);
    }

    /**
     * @param {string} slotId
     */
    handleSaveSlotClick(slotId) {
        this.saveLoadUI.handleSaveSlotClick(slotId);
    }

    /**
     * @param {number} slotNumber
     */
    deleteSaveSlot(slotNumber) {
        this.saveLoadUI.deleteSaveSlot(slotNumber);
    }

    // confirmAction - Moved to line ~2929 to avoid duplicate
    // (Has better fallback handling there)

    returnToMainMenu(skipConfirmation = false) {
        // ZEE: Revert color scheme if returning from Insane Mode 🖤
        this.deactivateInsaneMode();

        // DIZEE: Clear route-specific theme 🎨
        // @ts-ignore - ThemeManager is defined in theme.js
        if (typeof ThemeManager !== 'undefined') {
            // @ts-ignore - ThemeManager is defined in theme.js
            ThemeManager.clearRoute();
        }

        // Clear sprites when returning to main menu
        this.clearAllSprites();

        // Hide Game UI Layer explicitly
        const gameUI = document.getElementById('game-ui-layer');
        if (gameUI) gameUI.style.display = 'none';

        // Clear route-specific dialogue frame
        this.clearDialogueFrame();

        // DIZEE FIX: Clear game view and dialogue to prevent last scene showing during fade-out
        if (this.gameView) {
            this.gameView.style.backgroundImage = 'none';
        }
        if (this.dialogueBox) {
            this.dialogueBox.style.display = 'none';
        }

        // Reset background state
        this.currentBackground = null;

        // Hide Tori-specific UI elements
        if (this.tetherUI) this.tetherUI.style.display = 'none';

        // ZEERAH'S FIX: Only hide notes button if player hasn't completed any ending
        if (this.notesButton) {
            const hasCompletedEnding = this.hasCompletedAnyEnding();
            if (!hasCompletedEnding) {
                this.notesButton.style.display = 'none';
            }
            // If they HAVE completed an ending, keep button visible for future routes
        }
        // Echo display removed - handled by sprite now

        // Hide backlog button
        const backlogButton = document.getElementById('backlog-button');
        if (backlogButton) backlogButton.style.display = 'none';

        // ZEERAH'S FIX: Cleanup tether system completely (stops decay + clears timers)
        if (this.currentRoute) {
            if (this.currentRoute.tetherSystem && this.currentRoute.tetherSystem.cleanup) {
                this.currentRoute.tetherSystem.cleanup();
            }
        }

        // DIZEE FIX: Cancel auto-advance timer to prevent errors after exiting
        if (this.settingsManager && this.settingsManager.cancelAutoAdvance) {
            this.settingsManager.cancelAutoAdvance();
        }

        this.saveLoadUI.returnToMainMenu(skipConfirmation);

        // DIZEE FIX: Rebuild carousel after returning from credits
        if (this.menuCarousel && this.menuCarousel.rebuild) {
            setTimeout(() => {
                this.menuCarousel.rebuild();
            }, 100);
        }

        // DIZEE FIX: Update version title based on achieved ending
        this.updateVersionTitle();

        // ZEERAH'S EASTER EGG: Activate Torigatchi listener if True Ending achieved
        this.activateEasterEggListener();
    }

    updateVersionTitle() {
        const lastEnding = localStorage.getItem('lastEndingType');
        const titleElement = document.querySelector('#main-menu-content h1');
        const subtitleElement = document.querySelector('#main-menu-content .subtitle');

        if (!titleElement || !subtitleElement) return;

        /** @type {HTMLElement} */(titleElement);
        /** @type {HTMLElement} */(subtitleElement);

        // Update based on ending type
        if (lastEnding === 'digital_forever') {
            titleElement.textContent = 'VERSION 848';
            /** @type {HTMLElement} */(titleElement).style.color = '#ff00ff'; // Purple/magenta for Digital Forever
            subtitleElement.textContent = 'Together Forever... Digitally';
            /** @type {HTMLElement} */(subtitleElement).style.color = '#ff00ff';
        } else if (lastEnding === 'true_ending') {
            titleElement.textContent = 'VERSION 848';
            /** @type {HTMLElement} */(titleElement).style.color = '#00ff88'; // Green for True Ending
            subtitleElement.textContent = 'She\'s Home. The Loop is Broken.';
            /** @type {HTMLElement} */(subtitleElement).style.color = '#00ff88';
        } else if (lastEnding === 'bad_ending') {
            titleElement.textContent = 'VERSION 849';
            /** @type {HTMLElement} */(titleElement).style.color = '#ff0066'; // Red for Bad Ending
            subtitleElement.textContent = 'Try Again. She Deserves Another Chance.';
            /** @type {HTMLElement} */(subtitleElement).style.color = '#ff0066';
        } else {
            // Default state
            titleElement.textContent = 'VERSION 848';
            /** @type {HTMLElement} */(titleElement).style.color = '#0ff'; // Cyan default
            subtitleElement.textContent = 'My Wife Is in a Coma... and in the Code';
            /** @type {HTMLElement} */(subtitleElement).style.color = '#fff';
        }
    }

    // ========================================
    // STANDALONE NOTES VIEWER (MAIN MENU)
    // ========================================

    showStandaloneNotes() {
        // Reload notes from localStorage (in case new ones unlocked)
        // @ts-ignore - StandaloneNotesViewer is defined externally
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.standaloneNotesViewer.show();
    }

    openStandaloneNotes() {
        // ZEERAH'S FIX: Always create fresh viewer to reload notes from localStorage
        // Notes might have been collected since last view
        // @ts-ignore - StandaloneNotesViewer is defined externally
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.standaloneNotesViewer.show();
    }

    closeStandaloneNotes() {
        this.standaloneNotesViewer.close();
    }

    closeNotesViewer() {
        // DIZEE: Handle both standalone (main menu) and route-based notes viewers
        if (this.currentRoute && this.currentRoute.collectiblesManager) {
            // Close route's notes viewer (during gameplay)
            this.currentRoute.collectiblesManager.hideNotesViewer();
        } else if (this.standaloneNotesViewer) {
            // Close standalone viewer (from main menu)
            this.closeStandaloneNotes();
        }
    }

    closeNoteOverlay() {
        // Close email-style note overlay (works for both standalone and route-based viewers)
        if (this.standaloneNotesViewer) {
            this.standaloneNotesViewer.closeNoteOverlay();
        }
        if (this.currentRoute && this.currentRoute.collectiblesManager) {
            this.currentRoute.collectiblesManager.closeNoteOverlay();
        }
    }

    // ========================================
    // SETTINGS SYSTEM
    // ========================================

    showSettings() {
        const settingsMenu = document.getElementById('settings-menu');
        console.log('showSettings called, element:', settingsMenu);

        // DIZEE FIX: Stop tether decay while in settings
        if (this.currentRoute && this.currentRoute.tetherSystem) {
            this.currentRoute.tetherSystem.stopDecay();
        }

        if (settingsMenu) {
            settingsMenu.style.display = 'flex';
            console.log('Settings menu display set to flex');
        } else {
            console.error('Settings menu element not found!');
        }
    }

    closeSettings() {
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu) {
            settingsMenu.style.display = 'none';
        }

        // DIZEE FIX: Resume tether decay when closing settings
        if (this.currentRoute && this.currentRoute.tetherSystem) {
            this.currentRoute.tetherSystem.startDecay();
        }
    }

    resetSettings() {
        if (this.settingsManager && this.settingsManager.reset) {
            this.settingsManager.reset();
        } else {
            // Manual reset if method doesn't exist
            localStorage.removeItem('gameSettings');
            location.reload();
        }
    }

    // ========================================
    // BACKLOG SYSTEM
    // ========================================

    /**
     * @param {any} entry
     */
    addToDialogueHistory(entry) {
        // Legacy array (keep for compatibility)
        this.dialogueHistory.push(entry);

        // Keep only last maxHistoryLength entries
        if (this.dialogueHistory.length > this.maxHistoryLength) {
            this.dialogueHistory.shift();
        }

        // ZEERAH: Add to time-traveling backlog manager
        if (this.backlogManager) {
            this.backlogManager.addEntry(
                entry.character,
                entry.dialogue,
                entry.distorted || false
            );
        }
    }

    openBacklog() {
        const backlogScreen = document.getElementById('backlog-screen');

        if (!backlogScreen) return;

        // ZEERAH: Use time-traveling backlog manager
        if (this.backlogManager) {
            this.backlogManager.render();
        }

        backlogScreen.style.display = 'flex';

        // Scroll to bottom (most recent)
        const backlogList = document.getElementById('backlog-list');
        if (backlogList) {
            setTimeout(() => {
                backlogList.scrollTop = backlogList.scrollHeight;
            }, 100);
        }
    }

    closeBacklog() {
        this.uiController.closeBacklog();
    }

    // ========================================
    // TUTORIAL SYSTEM HELPERS
    // ========================================

    // NOTE: Tutorial system is now event-driven.
    // Controllers call game.tutorialManager.showHandGesture() directly
    // when their elements become visible. No polling needed.

    /**
     * @deprecated - Tutorials are now event-driven, no polling needed
     */
    checkTutorials() {
        // No-op - kept for backwards compatibility
    }

    /**
     * @deprecated - Tutorials are now event-driven, no polling needed
     */
    trackDialogue() {
        // No-op - kept for backwards compatibility
    }

    // ========================================
    // DEV COMMANDS
    // ========================================

    showStatePanel() {
        // DEV COMMAND: Open StateManager debug panel
        // Usage in console: game.showStatePanel()
        return this.state.createDebugPanel();
    }

    hideStatePanel() {
        // DEV COMMAND: Close StateManager debug panel
        // Usage in console: game.hideStatePanel()
        this.state.closeDebugPanel();
    }

    quickSave(name = 'quicksave') {
        // DEV COMMAND: Quick save current state
        // Usage in console: game.quickSave() or game.quickSave('mysave')
        return this.state.quickSave(name);
    }

    quickLoad(name = 'quicksave') {
        // DEV COMMAND: Quick load saved state
        // Usage in console: game.quickLoad() or game.quickLoad('mysave')
        return this.state.quickLoad(name);
    }

    stateUndo() {
        // DEV COMMAND: Undo last state change
        // Usage in console: game.stateUndo()
        return this.state.undo();
    }

    /**
     * @param {number} [count=10]
     */
    stateHistory(count = 10) {
        // DEV COMMAND: View state change history
        // Usage in console: game.stateHistory() or game.stateHistory(5)
        const history = this.state.getHistory(count);
        console.table(history.map((/** @type {any} */ h) => ({
            path: h.path,
            old: h.oldValue,
            new: h.newValue,
            time: new Date(h.timestamp).toLocaleTimeString()
        })));
        return history;
    }

    stateDiff(saveName = 'quicksave') {
        // DEV COMMAND: Compare current state with a quick save
        // Usage: game.stateDiff() or game.stateDiff('mysave')
        const snapshot = this.state._quickSaves?.[saveName];
        if (!snapshot) {
            console.error(`❌ No save found: ${saveName}`);
            return null;
        }
        return this.state.printDiff(snapshot);
    }

    stateExport() {
        // DEV COMMAND: Export state as JSON (copies to clipboard too)
        // Usage: game.stateExport()
        const json = this.state.exportState();
        this.state.copyStateToClipboard();
        console.log('📤 State JSON:');
        console.log(json);
        return json;
    }

    /**
     * @param {string} json
     */
    stateImport(json) {
        // DEV COMMAND: Import state from JSON
        // Usage: game.stateImport('{"version":1,...}')
        return this.state.importState(json);
    }

    stateSnapshot(name = '') {
        // DEV COMMAND: Create a labeled snapshot
        // Usage: game.stateSnapshot('before-boss')
        return this.state.createSnapshot(name);
    }

    /**
     * @param {string} path
     */
    stateWatch(path) {
        // DEV COMMAND: Watch a path for changes
        // Usage: game.stateWatch('tether.level')
        return this.state.watch(path);
    }

    /**
     * @param {string} path
     */
    stateUnwatch(path) {
        // DEV COMMAND: Stop watching a path
        // Usage: game.stateUnwatch('tether.level')
        this.state.unwatch(path);
    }

    stateWatchers() {
        // DEV COMMAND: List all active watchers
        // Usage: game.stateWatchers()
        return this.state.listWatchers();
    }

    stateStats() {
        // DEV COMMAND: Get StateManager statistics
        // Usage: game.stateStats()
        return this.state.getStats();
    }

    stateKeys(prefix = '') {
        // DEV COMMAND: List all state paths
        // Usage: game.stateKeys() or game.stateKeys('tether')
        const keys = this.state.keys(prefix);
        console.log('🔑 State keys:', keys);
        return keys;
    }

    stateSize() {
        // DEV COMMAND: Get state memory size
        // Usage: game.stateSize()
        return this.state.size();
    }

    /**
     * @param {string} path
     * @param {number} [amount=1]
     */
    stateIncrement(path, amount = 1) {
        // DEV COMMAND: Increment a numeric value
        // Usage: game.stateIncrement('game.loopVersion')
        return this.state.increment(path, amount);
    }

    /**
     * @param {string} path
     */
    stateToggle(path) {
        // DEV COMMAND: Toggle a boolean value
        // Usage: game.stateToggle('ui.hidden')
        return this.state.toggle(path);
    }

    /**
     * @param {string} path
     * @param {any} obj
     */
    stateMerge(path, obj) {
        // DEV COMMAND: Merge object into state
        // Usage: game.stateMerge('settings', { volume: 50 })
        return this.state.merge(path, obj);
    }

    /**
     * @param {string} path
     */
    stateHas(path) {
        // DEV COMMAND: Check if path exists
        // Usage: game.stateHas('tether.level')
        const exists = this.state.has(path);
        console.log(`🔍 ${path}: ${exists ? '✓ exists' : '✗ not found'}`);
        return exists;
    }

    /**
     * @param {string} path
     */
    stateDelete(path) {
        // DEV COMMAND: Delete a path from state
        // Usage: game.stateDelete('temp.data')
        return this.state.deletePath(path);
    }

    /**
     * @param {Object} pairs
     */
    stateBatchSet(pairs) {
        // DEV COMMAND: Set multiple values at once
        // Usage: game.stateBatchSet({ 'game.score': 100, 'tether.level': 50 })
        return this.state.batchSet(pairs);
    }

    /**
     * @param {string[]} paths
     */
    stateBatchGet(paths) {
        // DEV COMMAND: Get multiple values at once
        // Usage: game.stateBatchGet(['game.score', 'tether.level'])
        const results = this.state.batchGet(paths);
        console.table(results);
        return results;
    }

    stateDebug() {
        // DEV COMMAND: Show complete state debug overview
        // Usage: game.stateDebug()
        console.log('═══════════════════════════════════════');
        console.log('🔧 STATE MANAGER DEBUG OVERVIEW');
        console.log('═══════════════════════════════════════');

        const stats = this.state.getStats();
        const keys = this.state.keys();
        const size = this.state.size();

        console.log('📊 Keys:', keys);
        console.log('═══════════════════════════════════════');

        return { stats, keys, size };
    }

    stateReset() {
        // DEV COMMAND: Reset StateManager to default
        // Usage: game.stateReset()
        this.state.reset();
        console.log('🔄 State reset to default');
    }

    stateClearHistory() {
        // DEV COMMAND: Clear state history
        // Usage: game.stateClearHistory()
        this.state.clearHistory();
    }

    resetVersion(targetVersion = 848, status = 'attempting') {
        return this.sceneProgressionController.resetVersion(targetVersion, status);
    }

    nuclearReset() {
        return this.resetController.nuclearReset();
    }

    devCommands() {
        // DEV COMMAND: Show available dev commands
        console.log(`
╔═══════════════════════════════════════╗
║       VN - ZEE DEV COMMANDS          ║
╚═══════════════════════════════════════╝

📋 Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

game.resetVersion(848)
  → Reset to VERSION 848

game.resetVersion(849)  
  → Set to VERSION 849

game.resetVersion(848, 'succeeded')
  → Reset to 848 with True Ending status

game.resetVersion(848, 'accepted')
  → Reset to 848 with Digital Forever status

game.clearNotes()
  💚 ZEERAH'S ADDITION
  → Clear all collected notes (for testing)

game.nuclearReset()
  💜 DIZEE'S ADDITION
  → NUCLEAR RESET - Clears ALL progress, unlocks, settings
  → Factory fresh state (perfect for testing)
  → Also available as secret code: NUKE

game.devCommands()
  → Show this help menu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 After using commands, refresh the page!
        `);
    }

    clearNotes() {
        // ZEERAH'S DEV COMMAND: Clear all collected notes
        localStorage.removeItem('vn_collected_notes');
        console.log('💚 All notes cleared! Refresh to test note notifications.');
    }

    continueGame() {
        const mostRecent = this.saveManager.getMostRecentSave();
        if (mostRecent) {
            console.log('🔄 Continue Game triggered. Restoring version ' + mostRecent.data.version);
            this.saveManager.restoreGameState(mostRecent.data);
            // REMOVED: restoreSprites() appears undefined/redundant as restoreGameState -> jumpToScene handles visuals
            // this.restoreSprites();
        } else {
            this.saveManager.showSaveIndicator('No save data found', true);
        }
    }

    // ========================================
    // UI DELEGATION (Fix for index.html calls)
    // ========================================

    /**
     * @param {boolean} confirmed
     */
    confirmAction(confirmed) {
        // Delegate to SaveLoadUI which manages the dialog logic
        if (this.saveLoadUI) {
            this.saveLoadUI.confirmAction(confirmed);
        } else {
            console.error('❌ SaveLoadUI not initialized, cannot handle confirmAction');
            // Fallback: manually hide dialog if UI is broken
            const dialog = document.getElementById('confirm-dialog');
            if (dialog) dialog.classList.remove('active');
        }
    }

    // ========================================
    // FULLSCREEN TOGGLE
    // ========================================

    toggleFullscreen() {
        // Delegation stub - full implementation in FullscreenController
        this.fullscreenController?.toggle();
    }

    updateFullscreenButton() {
        // Delegation stub - full implementation in FullscreenController
        this.fullscreenController?.updateButton();
    }

    // ========================================
    // ESC HINT (DESKTOP USERS)
    // ========================================

    showEscHintBriefly() {
        return this.sceneProgressionController.showEscHintBriefly();
    }

    // ========================================
    // BACKGROUND CROSSFADE SYSTEM
    // ========================================

    /**
     * @param {string} newBackground
     */
    crossfadeBackground(newBackground) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.crossfadeBackground(newBackground);
    }

    // ========================================
    // ROUTE-SPECIFIC DIALOGUE FRAME & UI THEMING
    // ========================================

    /**
     * @param {string} routeName
     */
    setDialogueFrame(routeName) {
        return this.sceneProgressionController.setDialogueFrame(routeName);
    }

    clearDialogueFrame() {
        if (this.dialogueBox) this.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
        if (this.pauseButton) this.pauseButton.classList.remove('ronnie-route', 'tori-route');
        if (this.pauseContent) this.pauseContent.classList.remove('ronnie-route', 'tori-route');
        if (this.notesButton) this.notesButton.classList.remove('ronnie-route', 'tori-route');
        if (this.notesViewer) this.notesViewer.classList.remove('ronnie-route', 'tori-route');
    }

    // ========================================
    // MOBILE DETECTION & INTERNAL BUBBLES
    // ========================================

    isMobilePortrait() {
        // BELLE FIX: Check if user is forcing a display mode via settings
        if (this.settingsManager && this.settingsManager.settings.displayMode === 'landscape') {
            return false; // Forcing landscape, so NOT portrait
        }
        if (this.settingsManager && this.settingsManager.settings.displayMode === 'portrait') {
            return true; // Forcing portrait
        }

        // Default behavior (Auto mode) - check actual device orientation
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isPortrait = window.innerHeight > window.innerWidth;
        return isMobile && isPortrait;
    }

    /**
     * @param {string} text
     * @param {string} [characterPosition='center']
     */
    createInternalBubble(text, characterPosition = 'center') {
        // UNIVERSAL BUBBLE SYSTEM - Works on all platforms

        // Remove any existing bubbles first (defensive cleanup)
        const existingBubbles = document.querySelectorAll('.internal-bubble');
        existingBubbles.forEach(bubble => bubble.remove());

        // Create new bubble element
        const bubble = document.createElement('div');
        bubble.className = 'internal-bubble';

        // Add position class based on which character is speaking/thinking
        if (characterPosition === 'left') {
            bubble.classList.add('left-character');
        } else if (characterPosition === 'right') {
            bubble.classList.add('right-character');
        } else {
            bubble.classList.add('center');
        }

        // Set text content
        bubble.textContent = text;

        // Add to DOM
        document.body.appendChild(bubble);

        // STORE REFERENCE - managed by scene lifecycle, not timer
        this.currentBubble = bubble;

        console.log(`Internal bubble created: ${text.substring(0, 30)}...`);
    }

    removeInternalBubble() {
        // Remove tracked bubble
        if (this.currentBubble && this.currentBubble.parentNode) {
            this.currentBubble.remove();
            this.currentBubble = null;
        }

        // Also clean up any orphaned bubbles (defensive)
        const existingBubbles = document.querySelectorAll('.internal-bubble');
        existingBubbles.forEach(bubble => bubble.remove());
    }

    /**
     * @param {any} sceneData
     */
    determineCharacterPosition(sceneData) {
        return this.spriteController.determineCharacterPosition(sceneData);
    }

    fixMobileSpritePositioning() {
        // Force sprite positioning on mobile via inline styles
        const isPortrait = window.innerHeight > window.innerWidth;
        const dialogueHeight = isPortrait ? '30vh' : '35vh';

        if (this.spriteLeft) {
            this.spriteLeft.style.bottom = dialogueHeight;
            this.spriteLeft.style.top = 'auto';
            this.spriteLeft.style.height = 'auto';
        }
        if (this.spriteRight) {
            this.spriteRight.style.bottom = dialogueHeight;
            this.spriteRight.style.top = 'auto';
            this.spriteRight.style.height = 'auto';
        }
    }

    // ========================================
    // SKIP SYSTEM
    // Unlocked after completing any ending
    // ========================================

    unlockSkipFeature() {
        this.state.set('unlocks.skipUnlocked', true);
        localStorage.setItem('skipUnlocked', 'true');
        console.log('✅ Skip feature unlocked!');

        // Update UI immediately if skip button exists
        const skipButton = document.getElementById('skip-button');
        if (skipButton) {
            skipButton.style.display = 'flex';
        }

        // Define pendingEndingType on the instance
        /** @type {string|null} */
        this.pendingEndingType = null;

        // Show unlock notification
        this.showSkipUnlockNotification();

        // ZEERAH: Mark feature as unread for notification dot
        if (this.standaloneNotesViewer) {
            this.standaloneNotesViewer.readStatus['feature_skip'] = false;
            this.standaloneNotesViewer.saveReadStatus();
            this.standaloneNotesViewer.updateNotificationDots();
        }
    }

    showSkipUnlockNotification() {
        this.uiController.showSkipUnlockNotification();
    }

    closeSkipUnlockNotification() {
        this.uiController.closeSkipUnlockNotification();
    }

    showNotesUnlockNotification() {
        this.uiController.showNotesUnlockNotification();
    }

    closeNotesUnlockNotification() {
        this.uiController.closeNotesUnlockNotification();
    }

    showUnlockNotification() {
        this.uiController.showToriGatchiUnlockNotification();
    }

    closeToriGatchiUnlockNotification() {
        this.uiController.closeToriGatchiUnlockNotification();
    }

    toggleSkip() {
        if (!this.state.get('unlocks.skipUnlocked')) return;

        this.skipActive = !this.skipActive;

        const skipButton = document.getElementById('skip-button');
        if (skipButton) {
            skipButton.classList.toggle('active', this.skipActive);
        }

        // Update skip indicator
        const skipIndicator = this.uiController.skipIndicator;
        if (skipIndicator) {
            skipIndicator.style.display = this.skipActive ? 'block' : 'none';
        }

        console.log('Skip', this.skipActive ? 'ON' : 'OFF');

        // If activating skip, advance immediately
        // If activating skip, advance immediately
        // Fix: Added null check for choiceMenu
        if (this.skipActive && !this.typewriterActive && this.choiceMenu && !this.choiceMenu.style.display.includes('flex')) {
            this.advance();
        }
    }

    /**
     * @param {string} sceneId
     */
    markSceneAsRead(sceneId) {
        if (sceneId) {
            this.readScenes.add(sceneId);
            localStorage.setItem('readScenes', JSON.stringify([...this.readScenes]));
        }
    }

    /**
     * @param {string} sceneId
     */
    isSceneRead(sceneId) {
        return this.readScenes.has(sceneId);
    }

    /**
     * @param {any} scene
     */
    shouldStopSkipping(scene) {
        // Stop skipping if:
        // 1. Scene has choices
        if (scene.choices && scene.choices.length > 0) return true;

        // 2. Scene hasn't been read before
        if (scene.sceneId && !this.isSceneRead(scene.sceneId)) return true;

        // 3. Scene is an ending
        if (scene.sceneId && scene.sceneId.includes('ending')) return true;

        return false;
    }

    // ========================================
    // LOADING TIPS
    // ========================================

    showRandomLoadingTip() {
        this.uiController.showRandomLoadingTip();
    }

    proceedToMenu(hasError = false) {
        void hasError; // Silence unused variable warning
        console.log('GameEngine: Assets loaded, signaling splash screen...');

        // Verify state before proceeding
        if (!this.mainMenu) {
            console.error('❌ Main menu element missing!');
            return;
        }

        // New Logic: Signal index.html that we are ready
        // The splash screen script coordinates the video ending + loading completion
        // @ts-ignore - window.signalLoadingReady defined in index.html
        if (window.signalLoadingReady) {
            // @ts-ignore - window.signalLoadingReady defined in index.html
            window.signalLoadingReady();
        } else {
            // Fallback if splash script is missing/broken
            console.warn('⚠️ signalLoadingReady not found, forcing menu display');
            this.showMainMenu();
        }
    }

    // ========================================
    // TORIGATCHI EASTER EGG - THE REVERSE TRAPDOOR
    // DIZEE: Delegated to EasterEggController
    // ========================================

    activateEasterEggListener() {
        this.easterEggController?.activateEasterEggListener();
    }

    // ========================================
    // KONAMI CODE: INSANE MODE ESCAPE
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showKonamiInsaneEscape() {
        this.easterEggController?.showKonamiInsaneEscape();
    }

    konamiEscapeInsane() {
        console.log('🏃 Konami: Player chose to ESCAPE INSANE mode');

        // Downgrade to INTENSE
        this.settingsManager.setTetherDifficulty('intense');

        // Disable INSANE mode flag
        if (this.gameState.flags) {
            // @ts-ignore - Dynamic property
            this.gameState.flags.insaneModeActive = false;
        }

        // Save progress
        if (this.saveManager) {
            this.saveManager.quickSave();
        }

        // Show notification
        // @ts-ignore - achievementManager is an external module
        this.achievementManager.showNotification({
            id: 'tactical_retreat',
            icon: '🏃',
            title: 'TACTICAL RETREAT',
            description: 'Difficulty changed to INTENSE. Progress saved.',
            rare: true
        });

        // Unlock achievement
        // @ts-ignore - achievementManager is an external module
        this.achievementManager?.unlockAchievement?.('tactical_retreat');
        // Increment usage counter
        localStorage.setItem('konamiInsaneUsedCount', '1');

        // Haptic success
        if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);

        console.log('✅ Konami: Escaped INSANE mode successfully');
    }

    konamiStayInsane() {
        console.log('💀 Konami: Player chose to STAY in INSANE mode');

        // Apply 50% tether buff (reduce decay rate)
        if (this.currentRoute && this.currentRoute.tetherSystem) {
            const currentModifier = this.currentRoute.tetherSystem.difficultyModifier;
            this.currentRoute.tetherSystem.difficultyModifier = currentModifier * 0.5; // 50% reduction
            console.log(`💚 Konami: Tether decay reduced by 50% (modifier: ${currentModifier} -> ${currentModifier * 0.5})`);
        }

        // Show notification
        // @ts-ignore - achievementManager is an external module
        this.achievementManager.showNotification({
            id: 'masochist',
            icon: '😈',
            title: 'MASOCHIST',
            description: 'Tether drain reduced 50%. The Old Man salutes you.',
            rare: true
        });

        // Unlock achievement
        // @ts-ignore - achievementManager is an external module
        if (this.achievementManager) {
            // @ts-ignore
            this.achievementManager.unlock('masochist');
        }

        // Mark as used
        localStorage.setItem('konamiInsaneUsedCount', '1');

        // Haptic respect
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        console.log('✅ Konami: Stayed in INSANE mode with buff');
    }


    showTorigatchiEasterEgg() {
        this.easterEggController?.showTorigatchiEasterEgg();
    }

    // ========================================
    // TORIGATCHI IFRAME OVERLAY
    // DIZEE: Delegated to EasterEggController
    // ========================================

    /**
     * @param {string} url
     */
    openTorigatchiIframe(url) {
        this.easterEggController?.openTorigatchiIframe(url);
    }

    // ========================================
    // CAROUSEL UNLOCK (UV7 GLOW-UP)
    // Unlock Tori-Gatchi in carousel after route completion
    // ========================================

    unlockToriGatchiCarousel() {
        if (this.menuCarousel) {
            this.menuCarousel.unlockToriGatchi();
        }
    }

    // ========================================
    // TORI'S FOURTH WALL BREAK - DIFFICULTY REACTIONS
    // When player changes tether difficulty mid-game, Tori FEELS it
    // ========================================

    /**
     * @param {'eased'|'tightened'} changeType
     */
    triggerTetherReaction(changeType) {
        // Only trigger if in Tori's route and gameplay active
        // @ts-ignore - gameplayActive is a dynamic property
        if (this.currentRoute !== 'tori' || !this.gameplayActive) return;

        const reactions = {
            eased: [
                "Oh… it's lighter. I can… breathe again. Thank you.",
                "Did something change? I… feel less afraid.",
                "Whatever you did… it's helping. I'm not slipping as fast.",
                "You're protecting me, aren't you? This isn't a punishment… right?"
            ],
            tightened: [
                "…Wait. Something's wrong.",
                "It's getting harder to hold on. Why… why now?",
                "You're not testing me, are you? This isn't a punishment… right?",
                "Don't— don't leave me again. Please.",
                "I can feel it pulling tighter. What did you do?"
            ]
        };

        const reactionLines = reactions[changeType];
        if (!reactionLines) return;

        // Pick random reaction
        const reaction = reactionLines[Math.floor(Math.random() * reactionLines.length)];

        // Visual effects
        if (changeType === 'tightened') {
            this.triggerScreenShake();
            this.flickerSprite('tori', 100); // Flicker for 100ms
        }

        // Display reaction (interrupt current scene briefly)
        this.showTetherReactionDialogue(reaction, changeType);
    }

    /**
     * @param {string} text
     * @param {'eased'|'tightened'} changeType
     */
    showTetherReactionDialogue(text, changeType) {
        // Save current dialogue state
        const savedState = {
            character: this.characterName?.textContent,
            dialogue: this.dialogueText?.textContent
        };

        // Show Tori's reaction with special styling
        if (this.characterName) {
            this.characterName.textContent = 'Tori';
            this.characterName.style.color = changeType === 'eased' ? '#00ffaa' : '#ff6699';
        }

        if (this.dialogueText) {
            this.dialogueText.textContent = text;
        }

        if (this.dialogueBox) {
            this.dialogueBox.style.border = changeType === 'eased'
                ? '2px solid #00ffaa'
                : '2px solid #ff6699';
            this.dialogueBox.style.boxShadow = changeType === 'eased'
                ? '0 0 20px rgba(0, 255, 170, 0.5)'
                : '0 0 20px rgba(255, 102, 153, 0.5)';
        }

        // After 3 seconds, return to normal
        setTimeout(() => {
            // Reset styling
            if (this.characterName) this.characterName.style.color = '';
            if (this.dialogueBox) {
                this.dialogueBox.style.border = '';
                this.dialogueBox.style.boxShadow = '';
            }

            // Resume previous state or continue
            if (savedState.dialogue) {
                if (this.characterName) this.characterName.textContent = savedState.character || '';
                if (this.dialogueText) this.dialogueText.textContent = savedState.dialogue;
            }
        }, 3000);
    }

    triggerScreenShake() {
        const gameView = this.gameView || document.getElementById('game-view');
        if (!gameView) return;

        gameView.style.animation = 'screenShake 0.3s ease-in-out';
        setTimeout(() => {
            gameView.style.animation = '';
        }, 300);
    }

    /**
     * @param {string} spriteName
     * @param {number} duration
     */
    flickerSprite(spriteName, duration) {
        void spriteName; // Unused, logic relies on hardcoded ID for now
        const sprite = document.getElementById(`character-right`); // Tori is usually on the right
        if (!sprite) return;

        const originalOpacity = sprite.style.opacity || '1';
        sprite.style.opacity = '0';
        setTimeout(() => {
            sprite.style.opacity = originalOpacity;
        }, duration);
    }

    // ========================================
    // SECRET CODES REDEMPTION SYSTEM
    // ========================================

    /**
     * @param {string} code
     */
    redeemSecretCode(code) {
        // DIZEE: Delegate to SecretCodesManager 🖤
        return this.secretCodesManager.redeemCode(code);
    }


    // ========================================
    // CODE REWARD FUNCTIONS (PLACEHOLDERS)
    // DIZEE: Delegated to EasterEggController
    // ========================================

    // showAlwaysCompilation already delegated at line 564

    // ========================================
    // UV7 CREW BIOS OVERLAY
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showUV7CrewBios() {
        this.easterEggController?.showUV7CrewBios();
    }

    // ========================================
    // UNLOCK METHODS
    // DIZEE: Delegated to EasterEggController
    // ========================================

    unlockDevCommentary() {
        this.easterEggController?.unlockDevCommentary();
    }

    unlockDizee() {
        this.easterEggController?.unlockDizee();
    }

    // ========================================
    // LOOP TIMELINE (BOOTSTRAP)
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showLoopTimeline() {
        this.easterEggController?.showLoopTimeline();
    }

    generateTimelineNodes() {
        return this.easterEggController?.generateTimelineNodes() || '';
    }

    /**
     * @param {number} version
     */
    getFailureReason(version) {
        return this.easterEggController?.getFailureReason(version) || 'Unknown';
    }

    /**
     * @param {number} version
     */
    getAttemptDuration(version) {
        return this.easterEggController?.getAttemptDuration(version) || '? minutes';
    }

    /**
     * @param {number} version
     */
    getLesson(version) {
        return this.easterEggController?.getLesson(version) || 'Keep trying';
    }

    closeBootstrap() {
        this.uiController?.closeBootstrap();
    }

    // ========================================
    // ECHO COMPILATION
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showEchoCompilation() {
        this.easterEggController?.showEchoCompilation();
    }

    setupEchoTabs() {
        this.easterEggController?.setupEchoTabs();
    }

    /**
     * @param {string} act
     */
    loadEchoAct(act) {
        this.easterEggController?.loadEchoAct(act);
    }

    getEchoData() {
        return this.easterEggController?.getEchoData() || {};
    }

    closeEchoCompilation() {
        this.uiController?.closeEchoCompilation();
    }

    // ========================================
    // 848 TRUE ATTEMPT NUMBER OVERLAY
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showTrueAttemptNumber() {
        this.easterEggController?.showTrueAttemptNumber(this.loopVersion);
    }

    // ========================================
    // SECRET CODE UNLOCK OVERLAY
    // DIZEE: Delegated to EasterEggController
    // ========================================

    /**
     * @param {string} title
     * @param {string} content
     * @param {string} [type='code']
     */
    showUnlockOverlay(title, content, type = 'code') {
        this.easterEggController?.showUnlockOverlay(title, content, type);
    }

    // ========================================
    // DEV COMMENTARY OVERLAY (DIZEE POLISH)
    // DIZEE: Delegated to EasterEggController
    // ========================================

    /**
     * @param {string} title
     * @param {string} content
     * @param {any} scene
     */
    showCommentaryOverlay(title, content, scene) {
        this.easterEggController?.showCommentaryOverlay(title, content, scene);
    }

    // ========================================
    // WARNING OVERLAY (replaces browser alerts)
    // ========================================

    /**
     * @param {string} title
     * @param {string} message
     */
    showWarningOverlay(title, message) {
        // Delegation stub - full implementation in UIController
        this.uiController.showWarningOverlay(title, message);
    }

    // ========================================
    // INSANE MODE: HOLD ON GHOST BUTTON
    // ========================================

    makeHoldOnGhost() {
        return this.sceneProgressionController.makeHoldOnGhost();
    }

    deactivateInsaneMode() {
        return this.insaneVisualsController.deactivateInsaneMode();
    }

    // ========================================
    // INSANE MODE: CAGE OVERLAY
    // ========================================

    /**
     * @param {Function} callback
     */
    showInsaneCageOverlay(callback) {
        // @ts-ignore
        return this.insaneVisualsController.showInsaneCageOverlay(callback);
    }

    triggerInsaneVisuals() {
        return this.insaneVisualsController.triggerInsaneVisuals();
    }

    toggleUI() {
        // Delegation stub - full implementation in ScreenshotController
        this.screenshotController?.toggle();
    }


    // ========================================
    // CODE REWARD IMPLEMENTATIONS
    // DIZEE: Delegated to EasterEggController
    // ========================================

    unlockTorigatchi() {
        this.easterEggController?.unlockTorigatchi();
    }

    unlockRonniegatchi() {
        this.easterEggController?.unlockRonniegatchi();
    }

    // ========================================
    // RONNIEGATCHI INSPIRATION OVERLAY
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showRonniegatchiInspiration() {
        this.easterEggController?.showRonniegatchiInspiration();
    }

    // ========================================
    // UNLOCK METHODS (BULK EXTRACTION)
    // DIZEE: Delegated to EasterEggController
    // ========================================

    unlockAlwaysCompilation() {
        this.easterEggController?.unlockAlwaysCompilation();
    }

    unlockLoopTimeline() {
        this.easterEggController?.unlockLoopTimeline();
    }

    unlockEchoCompilation() {
        this.easterEggController?.unlockEchoCompilation();
    }

    unlockExtendedCredits() {
        this.easterEggController?.unlockExtendedCredits();
    }

    unlockTrueCounter() {
        this.easterEggController?.unlockTrueCounter();
    }

    // ========================================
    // DIZEE: GLOBAL KEYBOARD NAVIGATION SYSTEM
    // DIZEE: Delegated to KeyboardController
    // ========================================

    initializeKeyboardNavigation() {
        this.keyboardController?.initialize();
    }

    /**
     * @param {string} message
     * @param {number} [duration=2000]
     */
    showNotification(message, duration = 2000) {
        this.keyboardController?.showNotification(message, duration);
    }

    // ========================================
    // DIZEE: BOOTSTRAP TIMELINE INTEGRATION
    // ========================================

    recordEndingAttempt() {
        // Record this attempt to the bootstrap timeline
        const endingType = this.pendingEndingType || 'bad';
        const route = this.currentRoute?.name || 'unknown';

        // Determine result (succeeded only if true ending)
        const result = endingType === 'true' ? 'succeeded' : 'failed';

        // Infer failure reason
        const reason = this.bootstrapTracker.inferFailureReason(
            endingType,
            route,
            this.gameState
        );

        // Record to timeline
        this.bootstrapTracker.recordAttempt(result, reason, route, endingType);

        console.log(`📜 Recorded attempt to bootstrap timeline: ${result} - ${reason}`);
    }

    // ========================================
    // ROUTE SELECTOR (UV7 GLOW-UP)
    // ========================================

    initRouteSelector() {
        if (typeof RouteSelector === 'undefined') {
            console.warn('⚠️ RouteSelector class not found');
            return;
        }

        // Only create a new instance if one doesn't exist
        // This prevents duplicate event listeners being attached
        if (this.routeSelector) {
            console.log('🎮 RouteSelector already exists, reusing...');
            return;
        }

        console.log('🎮 Creating RouteSelector instance...');
        this.routeSelector = new RouteSelector(this);
    }

    startSelectedRoute() {
        if (this.routeSelector) {
            this.routeSelector.startSelectedRoute();
        }
    }


    // ========================================
    // SOLID REFACTOR: BACKWARD-COMPATIBLE GETTERS
    // These allow routes to still use game.skipUnlocked pattern
    // while state is managed by StateManager
    // ========================================

    get skipUnlocked() {
        return this.state.get('unlocks.skipUnlocked');
    }

    set skipUnlocked(value) {
        this.state.set('unlocks.skipUnlocked', value);
        localStorage.setItem('skipUnlocked', value ? 'true' : 'false');
    }

    get skipPrologueUnlocked() {
        return this.state.get('unlocks.skipPrologueUnlocked');
    }

    set skipPrologueUnlocked(value) {
        this.state.set('unlocks.skipPrologueUnlocked', value);
        localStorage.setItem('skipPrologueUnlocked', value.toString());
    }

    get ronnieNotesUnlocked() {
        return this.state.get('unlocks.ronnieNotesUnlocked');
    }

    set ronnieNotesUnlocked(value) {
        this.state.set('unlocks.ronnieNotesUnlocked', value);
        localStorage.setItem('ronnieNotesUnlocked', value.toString());
    }

    get loopVersion() {
        return this.state.get('game.loopVersion');
    }

    set loopVersion(value) {
        this.state.set('game.loopVersion', value);
        localStorage.setItem('loopVersion', value.toString());
    }

    get loopStatus() {
        return this.state.get('game.loopStatus');
    }

    set loopStatus(value) {
        this.state.set('game.loopStatus', value);
        localStorage.setItem('loopStatus', value ? 'true' : 'false');
    }
}

// ========================================
// ROUTE SELECTOR CLASS (UV7 GLOW-UP)
// Interactive toggle-based route selection
// ========================================

class RouteSelector {
    /**
     * @param {any} game
     */
    constructor(game) {
        this.game = game;
        this.selectedRoute = 'ronnie'; // Default
        this.init();
    }

    init() {
        console.log('🎮 Initializing RouteSelector...');

        // Cache elements
        this.ronniePortrait = document.querySelector('.ronnie-portrait');
        this.toriPortrait = document.querySelector('.tori-portrait');
        this.toggleTrack = document.querySelector('.toggle-track');
        this.toggleOptions = document.querySelectorAll('.toggle-option');
        this.ronnieInfo = document.querySelector('.ronnie-info');
        this.toriInfo = document.querySelector('.tori-info');
        this.playButton = document.getElementById('route-play-button');
        this.routeName = document.getElementById('route-name');
        this.difficultyDisplay = document.getElementById('difficulty-display');

        // Check if elements exist
        if (!this.toggleOptions || this.toggleOptions.length === 0) {
            console.error('❌ RouteSelector: Toggle options not found');
            return;
        }

        // Add event listeners
        this.toggleOptions.forEach(option => {
            option.addEventListener('click', () => {
                const route = /** @type {HTMLElement} */(option).dataset.route;
                this.selectRoute(route);
            });
        });

        // Haptic feedback on toggle
        this.toggleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // @ts-ignore - triggerSensoryFeedback is on game, not this
                if (this.game.triggerSensoryFeedback) {
                    this.game.triggerSensoryFeedback('cardSnap', option, 'Route toggle selection');
                }
            });
        });

        // DIZEE ADDITION: Clickable Portraits 🖤
        // Click dimmed -> Select
        // Click active -> Start
        [this.ronniePortrait, this.toriPortrait].forEach(portrait => {
            if (!portrait) return;

            portrait.addEventListener('click', () => {
                const route = portrait.classList.contains('ronnie-portrait') ? 'ronnie' : 'tori';

                if (this.selectedRoute === route) {
                    // Already active? Start the route!
                    console.log(`🚀 Clicked active ${route} portrait - starting game`);

                    // DIZEE: Haptic for confirming route start
                    if (this.game.triggerSensoryFeedback) {
                        this.game.triggerSensoryFeedback('cardSnap', portrait, 'Route confirmed via portrait');
                    }

                    this.startSelectedRoute();
                } else {
                    // Not active? Select it.
                    console.log(`👆 Clicked dimmed ${route} portrait - selecting`);

                    // DIZEE: Haptic for switching perspective
                    if (this.game.triggerSensoryFeedback) {
                        this.game.triggerSensoryFeedback('cardSnap', portrait, 'Route perspective switch');
                    }

                    this.selectRoute(route);
                }
            });

            // Add cursor pointer via JS to ensure it applies (redundant with CSS)
            // Add cursor pointer via JS to ensure it applies (redundant with CSS)
            /** @type {HTMLElement} */(portrait).style.cursor = 'pointer';
        });

        // Set initial state
        document.body.setAttribute('data-selected-route', 'ronnie');

        // Update difficulty display
        this.updateDifficultyDisplay();

        console.log('✅ RouteSelector initialized');
    }

    updateDifficultyDisplay() {
        if (!this.difficultyDisplay) return;

        // Get current difficulty from settings manager
        const difficulty = this.game?.settingsManager?.getDifficulty?.() || 'normal';
        if (this.difficultyDisplay) {
            this.difficultyDisplay.textContent = difficulty.toUpperCase();
            this.difficultyDisplay.setAttribute('data-difficulty', difficulty.toLowerCase());
            /** @type {HTMLElement} */(this.difficultyDisplay).style.display = 'block';
        }
    }

    /**
     * @param {string|undefined} route
     */
    selectRoute(route) {
        if (this.selectedRoute === route) {
            console.log(`ℹ️ Already on ${route} route`);
            return; // Already selected
        }

        console.log(`🔄 Switching to ${route || 'unknown'} route`);
        // @ts-ignore - assigning null to selectedRoute
        this.selectedRoute = route || null;

        // Check if elements exist before updating
        if (!this.ronniePortrait || !this.toriPortrait || !this.toggleTrack) {
            console.error('❌ RouteSelector: Portrait or toggle elements missing');
            return;
        }

        // Tori route: Add UI freeze-frame effect
        if (route === 'tori') {
            // Brief freeze-frame stutter (100ms)
            const routeSelectContent = document.getElementById('route-select-content');
            if (routeSelectContent) {
                routeSelectContent.style.opacity = '0.3';
                setTimeout(() => {
                    routeSelectContent.style.opacity = '1';
                }, 100);
            }
        }

        // Update portraits
        if (route === 'ronnie') {
            this.ronniePortrait.classList.add('active');
            this.toriPortrait.classList.remove('active');
            this.toggleTrack.classList.remove('tori-active');
            if (this.ronnieInfo) this.ronnieInfo.classList.add('active');
            if (this.toriInfo) this.toriInfo.classList.remove('active');
            if (this.routeName) this.routeName.textContent = 'RONNIE';
        } else {
            this.toriPortrait.classList.add('active');
            this.ronniePortrait.classList.remove('active');
            this.toggleTrack.classList.add('tori-active');
            if (this.toriInfo) this.toriInfo.classList.add('active');
            if (this.ronnieInfo) this.ronnieInfo.classList.remove('active');
            if (this.routeName) this.routeName.textContent = 'TORI';
        }

        // Update body attribute for button styling
        if (route) {
            document.body.setAttribute('data-selected-route', route);
        }

        console.log(`✅ Successfully switched to ${route} route`);
    }

    startSelectedRoute() {
        console.log(`🚀 Starting ${this.selectedRoute} route`);

        // DIZEE: Haptic feedback for route start
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('cardSnap', null, 'Route selection confirmed');
        }

        this.game.startRoute(this.selectedRoute);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore - Assigning to window object
    window.GameEngine = GameEngine;
}

// ES Module export
export { GameEngine };
