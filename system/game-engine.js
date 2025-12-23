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
 * (Line numbers updated 2025-12-17 - use search to locate sections)
 *
 * 1. INITIALIZATION & SETUP ...................... Line 307
 *    - Constructor
 *    - DOM element caching
 *    - Manager initialization (Settings, Save, Codes, Tether, etc.)
 *    - Event listener setup
 *
 * 2. ERROR BOUNDARIES & DEBUG .................... Line 498
 *    - Production error handling
 *    - Debug logging controls
 *    - State validation guards
 *
 * 3. CREDITS SYSTEM .............................. Line 1505
 *    - Photo pools (UV7 crew portraits)
 *    - Credits rendering (3 layouts)
 *    - Photo cycling controls
 *    - Version display
 *
 * 4. LOOP/VERSION SYSTEM ......................... Line 1700
 *    - Loop version tracking (848)
 *    - Version state management
 *    - Loop reinit screen
 *
 * 5. ROTATING TIPS SYSTEM ........................ Line 1900
 *    - Main menu tips
 *    - Route select tips
 *    - Tip rotation controls
 *
 * 6. HAPTIC FEEDBACK SYSTEM ...................... Line 2000
 *    - Pattern library (12 patterns: light, medium, strong, etc.)
 *    - Device support detection
 *    - Settings integration
 *    - Vibration triggers
 *
 * 7. DEV HUD SYSTEM .............................. Line 2085
 *    - Real-time debug overlay
 *    - Route/Act/Scene display
 *    - Tether/Difficulty/Flags monitoring
 *    - Toggle controls
 *
 * 8. NOTES UNLOCK SYSTEM ......................... Line 2200
 *    - Note unlocking
 *    - Ronnie notes system unlock
 *
 * 9. STORY START & ROUTE SELECTION ............... Line 2300
 *    - Prologue playback
 *    - Route selection screen
 *    - Skip prologue system
 *    - Route start initialization
 *
 * 10. SPRITE MANAGEMENT .......................... Line 2700
 *     - Sprite fade sequences
 *     - Character sprite display
 *     - Sprite positioning
 *     - Sprite cleanup on transitions
 *
 * 11. SCENE DISPLAY & RENDERING .................. Line 3000
 *     - Display scene
 *     - Dialogue rendering
 *     - Character names
 *     - Background handling
 *     - Choice rendering
 *
 * 12. TYPEWRITER EFFECT & PAGINATION ............. Line 3500
 *     - Character-by-character rendering
 *     - Mobile optimization (150 char threshold)
 *     - Text speed control
 *     - Auto-advance integration
 *
 * 13. ECHO DISPLAY (TORI ROUTE) .................. Line 4000
 *     - Echo voice system
 *     - Echo animations
 *
 * 14. NOTES SYSTEM ............................... Line 4200
 *     - Note overlay display
 *     - Note navigation
 *
 * 15. CREDITS DISPLAY ............................ Line 4500
 *     - Credits modal
 *     - Crew portraits
 *     - Version info
 *
 * 16. CONFIRMATION DIALOG SYSTEM ................. Line 5100
 *     - Custom dialog overlays
 *     - Confirmation callbacks
 *     - Dialog styling
 *
 * 17. CONTACT SCREEN ............................. Line 5300
 *     - Developer contact info
 *
 * 18. SAVE/LOAD SYSTEM METHODS ................... Line 5500
 *     - Save game delegation
 *     - Load game delegation
 *     - Save slot management
 *
 * 19. STANDALONE NOTES VIEWER .................... Line 5700
 *     - Main menu notes access
 *     - Standalone viewer launch
 *
 * 20. SETTINGS SYSTEM ............................ Line 5900
 *     - Settings menu control
 *     - Settings delegation to SettingsManager
 *
 * 21. BACKLOG SYSTEM ............................. Line 6100
 *     - History tracking
 *     - Time-travel functionality
 *     - Backlog rendering
 *
 * 22. DEV COMMANDS ............................... Line 6500
 *     - Developer utility commands
 *     - Debug shortcuts
 *
 * 23. FULLSCREEN TOGGLE .......................... Line 7000
 *     - Fullscreen API handling
 *
 * 24. ESC HINT (DESKTOP) ......................... Line 7200
 *     - Escape key hint display
 *
 * 25. KEYBOARD CONTROLS .......................... Line 7400
 *     - Key event handlers
 *     - Hotkey system
 *     - Navigation shortcuts
 *
 * 26. UI CONTROLS & ANIMATIONS ................... Line 8000
 *     - Button handlers
 *     - Fade effects
 *     - Overlay management
 *     - UI toggles
 *
 * ════════════════════════════════════════════════════════════════
 * NOTES:
 * - This is the main orchestrator - coordinates all subsystems
 * - Manages game loop, state transitions, and player interactions
 * - Integrates with: SaveManager, SettingsManager, TetherSystem,
 *   CollectiblesManager, SecretCodesManager, DevConsole
 *   - File size: 9,179 lines - use TOC for navigation
 * - Line numbers updated Dec 17, 2025 - search by section name for exact location
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// SENSORY CUES METADATA (TORI'S ARCHITECTURE) 💚
// Central configuration for all haptic + visual feedback
// ========================================

const SENSORY_CUES = {
    // UI Interactions (scale with comfort)
    buttonPress: {
        channel: 'ui',
        basePattern: 'light',
        visualType: 'buttonPress'
    },
    menuSelect: {
        channel: 'ui',
        basePattern: 'light',
        visualType: 'menuSelect'
    },
    cardSnap: {
        channel: 'ui',
        basePattern: 'medium',
        visualType: 'cardSnap'
    },
    uiSuccess: {
        channel: 'ui',
        basePattern: 'success',
        visualType: null  // Visual-only cue
    },

    // Narrative Moments (scale with comfort)
    toriHop: {
        channel: 'narrative',
        basePattern: 'double',  // DIZEE FIX: Stronger double buzz so it's actually noticeable
        visualType: 'toriHop'
    },
    tamaPull: {
        channel: 'narrative',
        basePattern: 'longBuzz',  // DIZEE: Single 1-second buzz for tamagotchi pull
        visualType: 'tamaPull'
    },
    tamaEmergency: {
        channel: 'narrative',
        basePattern: 'warning',
        visualType: 'tamaEmergency'
    },
    timelineGlitch: {
        channel: 'narrative',
        basePattern: 'glitch',
        visualType: 'timelineGlitch'
    },
    codeRipple: {
        channel: 'narrative',
        basePattern: 'double',
        visualType: 'codeRipple'
    },
    tetherWarning: {
        channel: 'narrative',
        basePattern: 'warning',
        visualType: null
    },
    echoCall: {
        channel: 'narrative',
        basePattern: 'echo',
        visualType: null
    },

    // Critical Feedback (NEVER scales - full intensity always)
    denied: {
        channel: 'critical',
        basePattern: 'denied',
        visualType: 'denied'
    },
    harshDenial: {
        channel: 'critical',
        basePattern: 'error',
        visualType: 'harshDenial'
    },
    despairPulse: {
        channel: 'critical',
        basePattern: 'heartbeat',
        visualType: null
    }
};

/**
 * GameEngine
 *
 * Main game controller handling global flow, scene stack, and manager coordination.
 * Entry point called from index.html on DOMContentLoaded.
 *
 * Responsibilities:
 * - Route loading and switching
 * - Scene transitions and display
 * - Typewriter effect and pagination
 * - Manager wiring (settings, save, codes, tether, collectibles)
 * - Input handling (keyboard shortcuts, click advancing)
 * - UI state management (menus, overlays, notifications)
 *
 * Key Systems:
 * - Typewriter: Character-by-character text display with speed control
 * - Scene Stack: Manages dialogue flow and choices
 * - Auto-Advance: Optional automatic progression
 * - Backlog: Time machine system for jumping to past moments
 *
 * @class GameEngine
 */
class GameEngine {
    constructor() {
        // SOLID Refactor: Initialize centralized state management
        this.state = new StateManager();
        Logger.solid('StateManager');

        // SOLID Refactor: Initialize scene rendering system
        this.sceneRenderer = new SceneRenderer(this);
        Logger.solid('SceneRenderer');

        // SOLID Refactor: Initialize UI overlay management
        this.uiController = new UIController(this);
        Logger.solid('UIController');

        // SOLID Refactor: Initialize visual effects system
        this.effectsController = new EffectsController(this);
        Logger.solid('EffectsController');

        // SOLID Refactor: Initialize text rendering system
        this.typewriterController = new TypewriterController(this);
        Logger.solid('TypewriterController');

        // SOLID Refactor: Initialize route navigation system
        this.routeController = new RouteController(this);
        Logger.solid('RouteController');

        // SOLID Refactor: Initialize ending dialog system
        this.endingDialogController = new EndingDialogController(this);
        Logger.solid('EndingDialogController');

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
        this.menuCarousel = null;

        // Route selector (UV7 glow-up)
        this.routeSelector = null;

        // State
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
        const savedLoopVersion = parseInt(localStorage.getItem('loopVersion')) || 848;
        const savedLoopStatus = localStorage.getItem('loopStatus') || 'attempting';
        this.state.set('game.loopVersion', savedLoopVersion);
        this.state.set('game.loopStatus', savedLoopStatus);
        // UI visibility state - now managed by StateManager
        // this.uiHidden removed - use this.state.get('ui.hidden') instead



        // ZEERAH'S EASTER EGG: Torigatchi reverse trapdoor
        this.easterEggSequence = '';
        this.easterEggListener = null;

        // Dialogue history for backlog
        this.dialogueHistory = [];
        this.maxHistoryLength = 100; // Keep last 100 dialogue entries

        // TORI'S SENSORY SYSTEM: Debounce + Debug Logger 💚
        this.lastHapticTime = 0;
        this.hapticCooldownMs = 80;  // Anti-spam cooldown
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
        this.devCommentary = new DevCommentary(this);

        // Show skip button if unlocked
        if (this.skipButton) {
            this.skipButton.style.display = this.state.get('unlocks.skipUnlocked') ? 'block' : 'none';
        }

        // Initialize save/load system
        this.saveManager = new SaveManager(this);

        // Initialize settings manager
        this.settingsManager = new SettingsManager(this);

        // Initialize visual cue manager (pairs with haptics)
        this.visualCueManager = new VisualCueManager(this);

        // DIZEE: Initialize secret codes manager 🖤
        this.secretCodesManager = new SecretCodesManager(this);

        // Update codes UI now that manager exists
        if (this.settingsManager) {
            this.settingsManager.updateCodesUI();
        }

        // Initialize backlog manager (ZEERAH: Time-traveling backlog)
        this.backlogManager = new BacklogManager(this);

        // TORI'S ADDITION: Initialize Time Machine Manager 💚
        this.timeMachine = new TimeMachineManager(this, {
            maxEntries: 200,
            pruneStrategy: 'smart'
        });

        // Standalone notes viewer for main menu
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.saveLoadUI = new SaveLoadUI(this);

        // Initialize cutscene engine
        this.cutsceneEngine = new CutsceneEngine(this);

        // DIZEE: Initialize bootstrap timeline tracker 🖤
        this.bootstrapTracker = new BootstrapTracker(this);

        // DIZEE: Initialize Easter Egg Controller (extracted methods)
        this.easterEggController = new EasterEggController(this);

        // DIZEE: Initialize Keyboard Controller (extracted methods)
        this.keyboardController = new KeyboardController(this);

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
        this.inputBinder = new InputBinder(this);
        this.inputBinder.bindAll();

        this.init();
    }

    // ========================================
    // ERROR BOUNDARIES (Production Safety)
    // ========================================

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

    showErrorOverlay(title, message) {
        // Delegation stub - full implementation in UIController
        this.uiController.showErrorOverlay(title, message);
    }

    // ========================================
    // TORIGATCHI EASTER EGG (CHICHARON)
    // ========================================
    showTorigatchiEasterEgg() {
        // Delegation stub - full implementation in EasterEggController
        this.easterEggController.showTorigatchiEasterEgg();
    }

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

    debug(...args) {
        if (this.debugMode) {
            console.log('🐛 [DEBUG]', ...args);
        }
    }

    debugWarn(...args) {
        if (this.debugMode) {
            console.warn('⚠️ [DEBUG]', ...args);
        }
    }

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

    getStateFlag(key, defaultValue = false) {
        this.validateGameState();
        return this.gameState.flags[key] ?? defaultValue;
    }

    setStateFlag(key, value) {
        this.validateGameState();
        this.gameState.flags[key] = value;
    }

    getStateChoice(key, defaultValue = null) {
        this.validateGameState();
        return this.gameState.choices[key] ?? defaultValue;
    }

    setStateChoice(key, value) {
        this.validateGameState();
        this.gameState.choices[key] = value;
    }

    // Safe localStorage access with try-catch
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (error) {
            console.error(`Failed to read localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

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

    safeJSONParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
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
        this.minLoadingAnimationTime = 2000; // Minimum 2 seconds for satisfying progress bar

        // Preload images with priority system
        const imagesToPreload = {
            // PRIORITY 1: Critical menu assets (load first)
            critical: [
                'assets/menudesktop.png',
                'assets/menumobile.png',
                'assets/desktopVersion.png',
                'assets/UnitedVoices7.png'
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
        const failedImages = [];
        const loadStartTime = Date.now();

        // Enhanced preload function with caching and retry logic
        const preloadImage = (src, retryCount = 0) => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    // Cache the loaded image
                    this.imageCache.set(src, img);

                    imagesLoaded++;
                    const progress = Math.floor((imagesLoaded / totalImages) * 100);
                    this.loadingBar.style.width = progress + '%';

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
                        this.loadingBar.style.width = progress + '%';

                        resolve(src); // Resolve anyway to continue loading
                    }
                };

                img.src = src;
            });
        };

        // Load images in priority order
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
                if (actualLoadTime < this.minLoadingAnimationTime) {
                    const remainingAnimTime = this.minLoadingAnimationTime - actualLoadTime;
                    console.log(`⏱️ Fast load detected (${actualLoadTime}ms). Simulating smooth progress for ${remainingAnimTime}ms more...`);

                    // Smoothly animate from current progress to 100% over remaining time
                    const startProgress = parseInt(this.loadingBar.style.width) || 0;
                    const progressToGo = 100 - startProgress;
                    const steps = Math.ceil(remainingAnimTime / 50); // Update every 50ms
                    const progressPerStep = progressToGo / steps;

                    let currentStep = 0;
                    const smoothInterval = setInterval(() => {
                        currentStep++;
                        const newProgress = Math.min(100, startProgress + (progressPerStep * currentStep));
                        this.loadingBar.style.width = newProgress + '%';

                        if (currentStep >= steps || newProgress >= 100) {
                            clearInterval(smoothInterval);
                            this.loadingBar.style.width = '100%';

                            // Now proceed to menu display logic
                            this.proceedToMenu();
                        }
                    }, 50);
                } else {
                    // Loading took long enough, proceed immediately
                    this.loadingBar.style.width = '100%';
                    this.proceedToMenu();
                }

            } catch (error) {
                console.error('Critical loading error:', error);
                // Even on error, show the menu
                this.proceedToMenu(true);
            }
        })();

        // Event Listeners
        this.holdOnButton.addEventListener('click', () => {
            if (this.currentRoute && this.currentRoute.holdOn) {
                this.currentRoute.holdOn();
            }
        });

        this.notesButton.addEventListener('click', () => {
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
        this.dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });


        // Keyboard controls (Spacebar or Enter)
        document.addEventListener('keydown', (e) => {

            // [H] KEY: Toggle UI visibility (for screenshots)
            if (e.code === 'KeyH' && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                this.toggleUI();
                return;
            }

            // [S] KEY: Toggle skip on/off
            if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
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

            if (e.code === 'Space' || e.code === 'Enter') {
                // Don't trigger if typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                // Prevent default scroll behavior for spacebar
                e.preventDefault();
                this.handleDialogueClick();
            }
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
                if (closeBtn) closeBtn.click();
                return;
            }

            // 2. Standalone notes viewer
            const notesViewer = this.uiController.standaloneNotesViewer;
            if (this.uiController.isVisible(notesViewer)) {
                e.preventDefault();
                const closeBtn = notesViewer.querySelector('.notes-close-btn');
                if (closeBtn) closeBtn.click();
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
        return {
            trueEnding: {
                opening: [
                    'assets/credits-pizza-date.png',
                    'assets/credits-bga-hoodie.png',
                    'assets/credits-rodeo-date.png'
                ],
                middle: [
                    'assets/credits-fancy-dinner.png',
                    'assets/credits-sunset-proposal.png',
                    'assets/credits-rodeo-date.png',
                    'assets/credits-bga-hoodie.png'
                ],
                finale: 'assets/credits-gym-selfie.png' // Always shown - "Always." anchor
            },
            digitalForever: {
                opening: [
                    'assets/credits-digital-tamagotchi.png',
                    'assets/credits-digital-park.png',
                    'assets/credits-digital-apartment.png'
                ],
                middle: [
                    'assets/credits-digital-holding-hands.png',
                    'assets/credits-digital-static.png',
                    'assets/credits-digital-park.png'
                ],
                finale: 'assets/credits-digital-forever.png' // Always shown - frozen together
            }
        };
    }

    selectRandomPhotos(endingType) {
        const pools = this.getCreditsPhotoPools();

        // Bad ending gets no photos (punishment through absence)
        if (endingType === 'bad' || endingType === 'none') {
            console.log('🚫 Bad ending - no photos (punishment)');
            return [];
        }

        // Get pool for this ending
        const pool = endingType === 'true' ? pools.trueEnding : pools.digitalForever;

        // Pick 1 from opening pool (random)
        const photo1 = pool.opening[Math.floor(Math.random() * pool.opening.length)];

        // Pick 2 from middle pool (random, no duplicates)
        const shuffledMiddle = [...pool.middle].sort(() => Math.random() - 0.5);
        let photo2 = shuffledMiddle[0];
        let photo3 = shuffledMiddle[1];

        // Ensure photo2 and photo3 are different from photo1
        if (photo2 === photo1) photo2 = shuffledMiddle[2] || shuffledMiddle[1];
        if (photo3 === photo1 || photo3 === photo2) photo3 = shuffledMiddle[2] || shuffledMiddle[0];

        // Always use finale
        const photo4 = pool.finale;

        console.log(`📸 Selected photos for ${endingType}:`);
        console.log(`   Opening: ${photo1.split('/').pop()}`);
        console.log(`   Middle 1: ${photo2.split('/').pop()}`);
        console.log(`   Middle 2: ${photo3.split('/').pop()}`);
        console.log(`   Finale: ${photo4.split('/').pop()} ⭐`);

        return [photo1, photo2, photo3, photo4];
    }

    // ========================================
    // LOOP/VERSION SYSTEM
    // Player journey through failed timelines
    // ========================================

    showMainMenu() {
        // Hide UV7 splash (calls window.completeSplash if available)
        if (window.completeSplash) {
            window.completeSplash();
        }

        // DIZEE: Cleanup current route when returning to menu
        if (this.currentRoute) {
            if (this.currentRoute.cleanup) {
                this.currentRoute.cleanup();
            }
            this.currentRoute = null;
        }

        // Hide route-specific UI elements
        if (this.tetherUI) {
            this.tetherUI.style.display = 'none';
        }
        if (this.notesButton) {
            this.notesButton.style.display = 'none';
        }

        // DIZEE FIX: Hide game view and clear backgrounds when returning to main menu
        if (this.gameView) {
            this.gameView.style.display = 'none';
        }
        if (this.sceneBackground) {
            this.sceneBackground.style.backgroundImage = '';
        }
        if (this.sceneBackgroundAlt) {
            this.sceneBackgroundAlt.style.backgroundImage = '';
        }

        // DIZEE FIX: Clear sprites when returning to menu
        if (this.spriteLeft) {
            this.spriteLeft.style.backgroundImage = '';
            this.spriteLeft.style.opacity = '0';
        }
        if (this.spriteRight) {
            this.spriteRight.style.backgroundImage = '';
            this.spriteRight.style.opacity = '0';
        }

        // DIZEE FIX: Ensure pause menu overaly is closed when returning to main menu
        if (this.saveLoadUI) {
            this.saveLoadUI.hidePauseMenu();
        }


        // Show main menu with smooth fade-in
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '0';

        // Force reflow to ensure opacity starts at 0
        void this.mainMenu.offsetWidth;

        // Fade in smoothly
        this.mainMenu.style.transition = 'opacity 0.8s ease-in';
        this.mainMenu.style.opacity = '1';

        // Initialize menu carousel (UV7 glow-up)
        console.log('🔍 Checking MenuCarousel availability:', typeof MenuCarousel);
        if (!this.menuCarousel && typeof MenuCarousel !== 'undefined') {
            console.log('🎠 Creating MenuCarousel instance...');
            this.menuCarousel = new MenuCarousel(this);
            this.menuCarousel.init();
        } else if (typeof MenuCarousel === 'undefined') {
            console.warn('⚠️ MenuCarousel class not found - is ui/menu-carousel.js loaded?');
        } else if (this.menuCarousel) {
            console.log('ℹ️ MenuCarousel already initialized');
        }

        // Check if ToriGatchi is unlocked and update main menu layout (fallback for old grid)
        this.updateMainMenuLayout();

        // ZEE'S ADDITION: Start tip rotation 🖤
        this.startMainMenuTipRotation();

        // COMMENTARY TRIGGER: Main Menu Loop (First time view)
        if (this.devCommentary && this.devCommentary.isUnlocked() && !localStorage.getItem('commentaryMenuSeen')) {
            localStorage.setItem('commentaryMenuSeen', 'true');

            // Show subtle hint
            setTimeout(() => {
                this.devCommentary.showCommentary('main_menu_carousel');
            }, 2000);
        }
    }

    handleSplashSkip() {
        console.log('GameEngine: Splash skip detected');
        this.splashSkipped = true;
        window.splashSkippedByUser = true; // Set global flag for preload to check

        // Cancel any pending proceedToMenu timeout
        if (this.proceedToMenuTimeout) {
            console.log('GameEngine: Canceling proceedToMenu timeout');
            clearTimeout(this.proceedToMenuTimeout);
            this.proceedToMenuTimeout = null;
        }

        // Cancel any pending menu show timeout
        if (this.menuShowTimeout) {
            console.log('GameEngine: Canceling menuShow timeout');
            clearTimeout(this.menuShowTimeout);
            this.menuShowTimeout = null;
        }

        // Note: index.html handles calling showMainMenu via completeSplash
    }

    updateTitleScreen() {
        // Update browser tab title
        document.title = `VERSION ${this.loopVersion}`;

        // Update main menu H1
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (mainMenuTitle) {
            mainMenuTitle.textContent = `VERSION ${this.loopVersion}`;

            // VISUAL DEGRADATION SYSTEM:
            // As version climbs, the system shows strain
            if (this.loopStatus === 'succeeded') {
                // TRUE ENDING: Gold/Stable
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#ffd700';
                mainMenuTitle.textContent += ' [FINAL]';
            } else if (this.loopStatus === 'accepted') {
                // DIGITAL FOREVER: Cyan/Stable
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#0ff';
                mainMenuTitle.textContent += ' [ETERNAL]';
            } else if (this.loopVersion > 848) {
                // FAILED LOOPS: Red glitch + intensity based on attempts
                mainMenuTitle.classList.add('version-glitch');

                // Color degradation as attempts climb
                const failureCount = this.loopVersion - 848;
                if (failureCount < 5) {
                    mainMenuTitle.style.color = '#ff6b6b'; // Light red
                } else if (failureCount < 10) {
                    mainMenuTitle.style.color = '#ff4444'; // Medium red
                } else {
                    mainMenuTitle.style.color = '#ff0000'; // Deep red - desperate
                }
            } else {
                // DEFAULT 848: Clean cyan
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#0ff';
            }
        }

        // ========================================
        // ZEE'S ADDITION: UPDATE SUBTITLE AND FOOTER DYNAMICALLY 🖤
        // Makes version number feel weighted and reactive
        // ========================================

        const subtitle = document.querySelector('.subtitle');
        const footer = document.querySelector('.menu-footer');

        if (subtitle && footer) {
            // Remove any existing state classes
            footer.classList.remove('succeeded', 'failed');

            if (this.loopStatus === 'succeeded') {
                // TRUE ENDING STATE - Player broke the loop
                subtitle.textContent = 'The Timeline That Succeeded';
                footer.textContent = `[Version ${this.loopVersion} - The loop that closed]`;
                footer.classList.add('succeeded');

                console.log('✨ Main menu updated: TRUE ENDING state');

            } else if (this.loopStatus === 'accepted') {
                // DIGITAL FOREVER STATE - Player chose eternal digital union
                subtitle.textContent = 'Forever Frozen, Forever Together';
                footer.textContent = `[Version ${this.loopVersion} - Digital permanence achieved]`;
                footer.classList.add('succeeded'); // Same glow as true ending

                console.log('💫 Main menu updated: DIGITAL FOREVER state');

            } else if (this.loopVersion > 848) {
                // FAILED AND INCREMENTED - Player got bad ending and version incremented
                subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
                footer.textContent = `[Version ${this.loopVersion} - Attempt in progress]`;
                footer.classList.add('failed');

                console.log(`🔄 Main menu updated: FAILED state (v${this.loopVersion})`);

            } else {
                // DEFAULT STATE - First playthrough or version 848 attempting
                subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
                footer.textContent = `[Version ${this.loopVersion} - 847 previous failures]`;

                console.log('📍 Main menu updated: DEFAULT state (v848)');
            }
        } else {
            // Elements not found - log warning but don't crash
            if (!subtitle) console.warn('⚠️ .subtitle element not found in DOM');
            if (!footer) console.warn('⚠️ .menu-footer element not found in DOM');
        }
    }

    // ========================================
    // TORIGATCHI MAIN MENU UNLOCK SYSTEM
    // DIZEE'S ADDITION: Unlocks after first secret code use 🔧
    // ========================================

    updateMainMenuLayout() {
        const torigatchiBtn = document.getElementById('torigatchi-menu-btn');
        const contactBtn = document.getElementById('contact-menu-btn');
        const menuGrid = document.getElementById('menu-buttons-grid');

        if (!torigatchiBtn || !contactBtn || !menuGrid) {
            console.warn('⚠️ Menu button elements not found');
            return;
        }

        // Check if ToriGatchi is unlocked
        const isUnlocked = localStorage.getItem('torigatchiUnlocked') === 'true';

        if (isUnlocked) {
            // Show ToriGatchi button (moves into top row as 5th button)
            torigatchiBtn.style.display = 'inline-block';

            // Contact button is already in bottom row in the HTML
            // Just need to update grid layout via CSS class
            menuGrid.classList.add('torigatchi-unlocked');

            console.log('🎮 ToriGatchi unlocked - 2×5 menu layout active');
        } else {
            // Hide ToriGatchi button
            torigatchiBtn.style.display = 'none';

            // Keep default 4×2+1 layout
            menuGrid.classList.remove('torigatchi-unlocked');

            console.log('🔒 ToriGatchi locked - default menu layout');
        }
    }

    // ========================================
    // ROTATING TIPS SYSTEM
    // ZEE'S ADDITION: Ambient discovery on main menu & route select 🖤
    // ========================================

    initRotatingTips() {
        // Cache tip elements
        this.mainMenuTipElement = document.getElementById('main-menu-tip');
        this.routeSelectTipElement = document.getElementById('route-select-tip');

        console.log('🖤 Rotating tips system initialized');
    }

    // TIP POOLS - delegated to UIController
    getMainMenuTips() {
        return this.uiController.getMainMenuTips();
    }

    getRouteSelectTips() {
        return this.uiController.getRouteSelectTips();
    }

    // START MAIN MENU TIP ROTATION
    startMainMenuTipRotation() {
        // Stop any existing rotation
        this.stopMainMenuTipRotation();

        if (!this.mainMenuTipElement) return;

        const tips = this.getMainMenuTips();

        // Rotate every 8 seconds
        this.mainMenuTipInterval = setInterval(() => {
            // Fade out current tip
            this.mainMenuTipElement.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentMainMenuTipIndex = (this.currentMainMenuTipIndex + 1) % tips.length;

                // Update text
                this.mainMenuTipElement.textContent = tips[this.currentMainMenuTipIndex];

                // Fade back in
                this.mainMenuTipElement.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        console.log('🔄 Main menu tip rotation started');
    }

    // STOP MAIN MENU TIP ROTATION
    stopMainMenuTipRotation() {
        if (this.mainMenuTipInterval) {
            clearInterval(this.mainMenuTipInterval);
            this.mainMenuTipInterval = null;
            console.log('⏸️ Main menu tip rotation stopped');
        }
    }

    // START ROUTE SELECT TIP ROTATION
    startRouteSelectTipRotation() {
        // Stop any existing rotation
        this.stopRouteSelectTipRotation();

        if (!this.routeSelectTipElement) return;

        const tips = this.getRouteSelectTips();

        // Rotate every 8 seconds
        this.routeSelectTipInterval = setInterval(() => {
            // Fade out current tip
            this.routeSelectTipElement.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentRouteSelectTipIndex = (this.currentRouteSelectTipIndex + 1) % tips.length;

                // Update text
                this.routeSelectTipElement.textContent = tips[this.currentRouteSelectTipIndex];

                // Fade back in
                this.routeSelectTipElement.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        console.log('🔄 Route select tip rotation started');
    }

    // STOP ROUTE SELECT TIP ROTATION
    stopRouteSelectTipRotation() {
        if (this.routeSelectTipInterval) {
            clearInterval(this.routeSelectTipInterval);
            this.routeSelectTipInterval = null;
            console.log('⏸️ Route select tip rotation stopped');
        }
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

    scaleHapticPattern(pattern, comfortLevel) {
        // 0=Gentle (60%), 1=Normal (100%), 2=Amped (130%), 3=INSANE (200%)
        if (comfortLevel === 1) return pattern;

        // Normalize to array
        const arr = Array.isArray(pattern) ? pattern.slice() : [pattern];

        if (comfortLevel === 0) {
            // Gentle: softer, shorter
            return arr.map(ms => Math.max(5, Math.round(ms * 0.6)));
        }
        if (comfortLevel === 2) {
            // Amped: stronger, longer
            return arr.map(ms => Math.round(ms * 1.3));
        }
        if (comfortLevel === 3) {
            // INSANE: MUCH stronger, MUCH longer (beyond Amped)
            return arr.map(ms => Math.round(ms * 2.0));
        }

        return pattern;
    }

    triggerHaptic(patternName, description = '', { channel = 'ui', force = false } = {}) {
        // Check if user has enabled haptics in settings
        if (!this.settingsManager || !this.settingsManager.getHapticEnabled()) {
            return; // User disabled or settings not ready
        }

        // Check if device supports vibration API
        if (!navigator.vibrate) {
            return;
        }

        // TORI'S DEBOUNCE: Anti-spam for rapid clicks 💚
        const now = performance.now();
        if (!force && (now - this.lastHapticTime) < this.hapticCooldownMs) {
            return; // Too soon after last haptic
        }
        this.lastHapticTime = now;

        // Get comfort level and insane mode status
        const comfort = this.settingsManager?.getComfortIntensity?.() ?? 1;
        const insane = this.isInsaneModeActive?.() ?? false;
        const patterns = this.getHapticPatterns();

        // Get base pattern
        let pattern = patterns[patternName] || patternName;

        // INSANE MODE: Apply 2.0x intensity (beyond Amped's 1.3x)
        // This ensures INSANE feels different even for players who use Amped normally
        if (insane && channel !== 'critical') {
            pattern = this.scaleHapticPattern(pattern, 3); // Special value 3 = INSANE mode
        }
        // TORI'S SCALING: Scale non-critical cues based on comfort setting
        else if (!insane && channel !== 'critical') {
            pattern = this.scaleHapticPattern(pattern, comfort);
        }


        // Trigger vibration
        navigator.vibrate(pattern);

        // TORI'S DEBUG LOGGER 💚
        this.logSensory(patternName, channel, pattern, description);

        if (this.debugMode) {
            console.log(`📳 Haptic: ${patternName} [channel=${channel}, comfort=${comfort}] - ${description}`, pattern);
        }
    }

    logSensory(cueType, channel, pattern, description) {
        if (!this.debugMode) return;

        this.sensoryLog.push({
            cueType,
            channel,
            pattern,
            description,
            comfort: this.settingsManager?.getComfortIntensity?.() ?? 1,
            time: new Date().toLocaleTimeString()
        });

        // Keep only last N entries
        if (this.sensoryLog.length > this.maxSensoryLog) {
            this.sensoryLog.shift();
        }
    }

    // ========================================
    // UNIFIED SENSORY FEEDBACK (TORI'S METADATA-DRIVEN ARCHITECTURE) 💚
    // Triggers both haptic and visual cues together
    // ========================================

    triggerSensoryFeedback(cueType, target = null, description = '') {
        // Look up cue metadata
        const meta = SENSORY_CUES[cueType];
        if (!meta) {
            if (this.debugMode) {
                console.warn(`⚠️ Unknown sensory cue: ${cueType}`);
            }
            return;
        }

        const { channel, basePattern, visualType } = meta;

        // 1) Trigger visual cue (if defined)
        if (this.visualCueManager && visualType) {
            this.visualCueManager.trigger(visualType, target, { channel });
        }

        // 2) Trigger haptic with channel info
        // DIZEE FIX: Critical channel haptics bypass cooldown (narrative beats must always fire)
        if (this.triggerHaptic && basePattern) {
            const forceTrigger = channel === 'critical' || channel === 'narrative';
            this.triggerHaptic(
                basePattern,
                description || `Sensory cue: ${cueType}`,
                { channel, force: forceTrigger }
            );
        }

        if (this.debugMode) {
            console.log(`🎯 Sensory feedback: ${cueType} [channel=${channel}] visual=${visualType || 'none'} haptic=${basePattern || 'none'}`);
        }
    }

    // ========================================
    // DEV HUD SYSTEM
    // Hidden debug overlay toggled via secret code
    // ========================================

    toggleDevHUD() {
        const hud = this.uiController.devHud;
        if (!hud) {
            console.warn('Dev HUD not found in DOM');
            return;
        }

        if (hud.style.display === 'none') {
            hud.style.display = 'block';
            this.devHUDActive = true;
            this.updateDevHUD();

            // Start update interval
            this.devHUDInterval = setInterval(() => {
                this.updateDevHUD();
            }, 500); // Update every 500ms

            console.log('🔧 Dev HUD enabled');
        } else {
            hud.style.display = 'none';
            this.devHUDActive = false;

            // Stop update interval
            if (this.devHUDInterval) {
                clearInterval(this.devHUDInterval);
                this.devHUDInterval = null;
            }

            console.log('🔧 Dev HUD disabled');
        }
    }

    updateDevHUD() {
        if (!this.devHUDActive) return;

        // Route
        const routeName = this.currentRoute ? this.currentRoute.constructor.name : '—';
        document.getElementById('hud-route').textContent = routeName;

        // Act (try to detect from route properties)
        let actName = '—';
        if (this.currentRoute) {
            if (this.currentRoute.currentAct) {
                actName = `Act ${this.currentRoute.currentAct}`;
            } else if (this.currentRoute.act) {
                actName = this.currentRoute.act;
            }
        }
        document.getElementById('hud-act').textContent = actName;

        // Scene
        const sceneName = this.currentScene || '—';
        // Truncate if too long
        const sceneDisplay = typeof sceneName === 'string' && sceneName.length > 30
            ? sceneName.substring(0, 27) + '...'
            : sceneName;
        document.getElementById('hud-scene').textContent = sceneDisplay;

        // Page
        const page = this.currentPageIndex !== undefined
            ? `${this.currentPageIndex + 1}`
            : '—';
        document.getElementById('hud-page').textContent = page;

        // Tether
        let tetherDisplay = 'N/A';
        if (this.tetherSystem && this.tetherSystem.tetherLevel !== undefined) {
            tetherDisplay = `${Math.round(this.tetherSystem.tetherLevel)}%`;

            // Color code based on level
            const tetherEl = document.getElementById('hud-tether');
            if (this.tetherSystem.tetherLevel <= 25) {
                tetherEl.style.color = '#ff0066';
            } else if (this.tetherSystem.tetherLevel <= 50) {
                tetherEl.style.color = '#ff9900';
            } else {
                tetherEl.style.color = '#00ff88';
            }
        }
        document.getElementById('hud-tether').textContent = tetherDisplay;

        // Difficulty
        const difficulty = this.settingsManager?.settings?.tetherDifficulty || '—';
        document.getElementById('hud-difficulty').textContent = difficulty.toUpperCase();

        // Flags (show count + some key flags)
        let flagsDisplay = '—';
        if (this.gameState?.flags) {
            const flagCount = Object.keys(this.gameState.flags).length;
            flagsDisplay = `${flagCount} set`;

            // Show important flags
            const importantFlags = [];
            if (this.gameState.flags.insaneModeActive) importantFlags.push('INSANE');
            if (this.state.get('unlocks.skipUnlocked')) importantFlags.push('SKIP');
            if (importantFlags.length > 0) {
                flagsDisplay += ` (${importantFlags.join(', ')})`;
            }
        }
        document.getElementById('hud-flags').textContent = flagsDisplay;

        // Loop version
        const loopVersion = this.loopVersion || 848;
        document.getElementById('hud-loop').textContent = loopVersion;
    }

    incrementVersion() {
        // RETRY - increment version, reset to attempting
        this.loopVersion++;
        this.loopStatus = 'attempting';

        // Save to localStorage
        localStorage.setItem('loopVersion', this.loopVersion.toString());
        localStorage.setItem('loopStatus', this.loopStatus);

        // Update display
        this.updateTitleScreen();

        console.log(`🔄 Loop incremented to VERSION ${this.loopVersion}`);

        return this.loopVersion;
    }

    breakLoop() {
        // TRUE ENDING - lock version as succeeded
        this.loopStatus = 'succeeded';

        // Save to localStorage
        localStorage.setItem('loopStatus', this.loopStatus);

        // Update display (removes glitch)
        this.updateTitleScreen();

        console.log(`✨ Loop broken! VERSION ${this.loopVersion} SUCCEEDED`);
    }

    acceptEnding() {
        // DIGITAL FOREVER - lock version as accepted
        this.loopStatus = 'accepted';

        // Save to localStorage
        localStorage.setItem('loopStatus', this.loopStatus);

        // Update display (removes glitch)
        this.updateTitleScreen();

        console.log(`💫 Ending accepted. VERSION ${this.loopVersion} locked.`);
    }

    // ========================================
    // LOOP REINIT SCREEN (Delegated to EffectsController)
    // Shows when player retries after failure
    // ========================================

    showLoopInit(callback) {
        this.effectsController?.showLoopInit(callback);
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

    showCodeRainTransition(callback, duration = 1500) {
        this.effectsController?.showCodeRainTransition(callback, duration);
    }

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
        return localStorage.getItem('hasCompletedOnce') === 'true';
    }

    markEndingCompleted(endingType) {
        const wasFirstCompletion = !this.hasCompletedAnyEnding();

        localStorage.setItem('hasCompletedOnce', 'true');
        localStorage.setItem('lastEndingType', endingType);
        console.log(`Ending completed: ${endingType}. Notes unlocked for replay.`);

        // DIZEE: Apply ending-specific theme when returning to menu 🎨
        if (typeof ThemeManager !== 'undefined') {
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
        return this.gameState?.flags?.insaneModeLocked || false;
    }

    // Get serializable flags for snapshot
    getSerializableFlags() {
        return { ...this.gameState.flags };
    }

    // Apply flags from snapshot
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
    setSpriteByKey(spriteKey) {
        if (!spriteKey) return;

        if (spriteKey.left) {
            this.currentSprites.left = spriteKey.left;
            if (this.spriteLeft) {
                this.spriteLeft.style.backgroundImage = `url('${spriteKey.left}')`;
                this.spriteLeft.style.display = 'block';
            }
        }

        if (spriteKey.right) {
            this.currentSprites.right = spriteKey.right;
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
        // Check if skip prologue is unlocked AND enabled in settings
        if (this.skipPrologueUnlocked && this.settingsManager?.settings?.autoSkipPrologue) {
            // Auto-skip enabled - go straight to routes
            console.log('⏭️ Auto-skip prologue enabled - jumping to route selection');
            this.skipToRouteSelection();
            return;
        }

        // Check if skip is unlocked (but not auto-enabled)
        if (this.skipPrologueUnlocked) {
            // Check if prompt has been seen before
            const promptSeen = localStorage.getItem('skipProloguePromptSeen') === 'true';

            if (!promptSeen) {
                // First time seeing prompt - show it
                this.showSkipProloguePrompt();
                return;
            } else {
                // Prompt already seen - respect Settings toggle (defaults to OFF)
                // Since auto-skip is OFF (we checked above), play prologue
                console.log('⏭️ Skip prompt dismissed previously - playing prologue (toggle in Settings to auto-skip)');
                this.startPrologueNormally();
                return;
            }
        }

        // Normal flow - start prologue
        this.startPrologueNormally();
    }

    startPrologueNormally() {
        // Clear backlog from previous session
        if (this.backlogManager) {
            this.backlogManager.clearHistory();
        }

        // Cleanup Menu Carousel if active
        if (this.menuCarousel) {
            this.menuCarousel.destroy();
            this.menuCarousel = null;
        }

        // Standard prologue start
        this.gameState.currentRoute = 'prologue'; // Set current route for tracking
        this.clearAllSprites();

        // Reset game state
        this.gameState = {
            flags: {},
            choices: {},
            progress: {},
            sprites: { left: null, right: null }
        };

        // ZEE'S ADDITION: Stop tip rotation 🖤
        this.stopMainMenuTipRotation();

        // Fade out main menu
        this.mainMenu.style.opacity = '0';

        setTimeout(() => {
            this.mainMenu.style.display = 'none';
            this.gameView.style.display = 'flex';

            // Show Game UI Layer
            const gameUI = document.getElementById('game-ui-layer');
            if (gameUI) gameUI.style.display = 'block';

            this.dialogueBox.style.display = 'block';

            // Fade in game view
            setTimeout(() => {
                this.gameView.style.transition = 'opacity 1s';
                this.gameView.style.opacity = '1';
            }, 100);

            // Clear any lingering sprites before starting prologue
            this.clearAllSprites();

            // Start shared prologue
            const prologue = new SharedPrologue(this);
            prologue.start();
        }, 800);
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
        this.routeController.showSkipProloguePrompt();
    }

    skipToRouteSelection() {
        this.routeController.skipToRouteSelection();
    }

    unlockSkipPrologue() {
        return this.routeController.unlockSkipPrologue();
    }

    // ========================================
    // RONNIE NOTES SYSTEM UNLOCK
    // Unlocks notes viewer for Ronnie's route + Tab 2
    // ========================================

    unlockRonnieNotesSystem() {
        this.ronnieNotesUnlocked = true;
        localStorage.setItem('ronnieNotesUnlocked', 'true');
        localStorage.setItem('ronnieTabUnlocked', 'true');

        console.log('📝 Ronnie notes system unlocked! Notes viewer now active for replays.');

        // Unlock the teaser note (already defined in collectibles-manager.js)
        // Access through currentRoute if available (during gameplay)
        if (this.currentRoute && this.currentRoute.collectiblesManager) {
            this.currentRoute.collectiblesManager.unlockNote('ronnie_teaser');
        } else {
            // DIZEE FIX: Use correct localStorage key and structure
            // Directly add to localStorage if called outside of active route
            const savedNotes = JSON.parse(localStorage.getItem('vn_collected_notes') || '{"z":[],"cz":[],"zr":[],"gz":[],"iz":[],"pz":[],"special":[]}');
            if (!savedNotes.special.includes('ronnie_teaser')) {
                savedNotes.special.push('ronnie_teaser');
                localStorage.setItem('vn_collected_notes', JSON.stringify(savedNotes));
                console.log('✅ Ronnie teaser note unlocked (via localStorage)');
            }
        }

        // ZEERAH: Mark feature as unread for notification dot
        if (this.standaloneNotesViewer) {
            this.standaloneNotesViewer.readStatus['feature_ronnieNotes'] = false;
            this.standaloneNotesViewer.saveReadStatus();
            this.standaloneNotesViewer.updateNotificationDots();
        }
    }

    // ========================================
    // ROUTE START
    // ========================================

    startRoute(routeName) {
        console.log(`🚀 Starting route: ${routeName}`);

        // Clear backlog from previous session/route
        if (this.backlogManager) {
            this.backlogManager.clearHistory();
        }

        // Cleanup Menu Carousel if active
        if (this.menuCarousel) {
            this.menuCarousel.destroy();
            this.menuCarousel = null;
        }

        this.gameState.currentRoute = routeName; // Set current route for tracking

        // DIZEE: Apply route-specific theme 🎨
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.setRoute(routeName);
        }

        // DIZEE FIX: Clear game view immediately to prevent old scene flash 💚
        if (this.gameView) {
            this.gameView.style.backgroundImage = 'none';
        }

        // Clear sprites before starting route (redundant safety check)
        this.clearAllSprites();

        // DIZEE FIX: Reset loop status to 'attempting' when starting new route
        // This prevents [FINAL] from persisting after true ending -> retry -> bad ending
        if (this.loopStatus === 'succeeded' || this.loopStatus === 'accepted') {
            const previousStatus = this.loopStatus;
            this.incrementVersion(); // Increment version for new attempt (also resets status to 'attempting')
            console.log(`🔄 New attempt after ${previousStatus} - VERSION ${this.loopVersion}`);
        }

        // ZEE'S ADDITION: Stop tip rotation 🖤
        this.stopRouteSelectTipRotation();

        // ZEE'S FIX: Restore Insane Mode flags from localStorage 🖤
        // When user commits to Insane in settings, flag is saved to localStorage
        // But gameState gets reinitialized, so we need to restore it here
        const insaneLocked = localStorage.getItem('insaneModeLocked') === 'true';
        if (insaneLocked) {
            // Restore Insane Mode flags to gameState
            if (!this.gameState.flags) {
                this.gameState.flags = {};
            }
            this.gameState.flags.insaneModeActive = true;
            this.gameState.flags.insaneModeLocked = true;
            console.log('💀 Insane Mode restored from localStorage');

            // Trigger initial visual corruption on route start
            if (this.triggerInsaneVisuals) {
                this.triggerInsaneVisuals();
            }

            // ZEE'S FIX: Apply Insane Mode color scheme (cyan → red) 🖤
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.add('insane-mode-active');
                console.log('🔴 Insane Mode color scheme activated');
            }
        }

        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';

        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.gameView.style.display = 'flex';

            // Show Game UI Layer
            const gameUI = document.getElementById('game-ui-layer');
            if (gameUI) gameUI.style.display = 'block';

            // Fade in game view
            setTimeout(() => {
                this.gameView.style.opacity = '1';
            }, 100);

            // Show notes button for Tori's route (has collectibles)
            if (routeName === 'tori') {
                if (this.notesButton) {
                    this.notesButton.style.display = 'block';
                }
            } else if (this.hasCompletedAnyEnding()) {
                // Show for other routes only after completing an ending
                if (this.notesButton) {
                    this.notesButton.style.display = 'block';
                }
            }

            // Show backlog button during gameplay
            const backlogButton = document.getElementById('backlog-button');
            if (backlogButton) {
                backlogButton.style.display = 'block';
            }

            // DIZEE: Show dev commentary button if unlocked (inside dialogue box)
            if (this.devCommentary && this.devCommentary.isUnlocked()) {
                const dialogueBox = document.getElementById('dialogue-box');

                // Remove existing button if any
                const existingBtn = dialogueBox?.querySelector('.commentary-hint-button');
                if (existingBtn) existingBtn.remove();

                const commentaryBtn = document.createElement('button');
                commentaryBtn.className = 'commentary-hint-button';
                commentaryBtn.innerHTML = '🎙️ COMMENTARY';
                commentaryBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevent dialogue advance
                    this.devCommentary.showCommentary('route_selection_dual');
                    // Also show philosophy after a delay
                    setTimeout(() => {
                        this.devCommentary.showCommentary('route_selection_philosophy');
                    }, 10000);
                };

                if (dialogueBox) {
                    dialogueBox.appendChild(commentaryBtn);
                }
            }

            // Set route-specific dialogue frame
            this.setDialogueFrame(routeName);

            // DIZEE: Code rain transition before route starts 💚🌧️
            this.showCodeRainTransition(() => {
                // DIZEE FIX: Clean up previous route before starting new one
                if (this.currentRoute) {
                    // Call route's cleanup method (handles timers, listeners, references)
                    if (this.currentRoute.cleanup) {
                        this.currentRoute.cleanup();
                    }
                    // Hide tether UI
                    if (this.tetherUI) {
                        this.tetherUI.style.display = 'none';
                    }
                    // Clear current route reference
                    this.currentRoute = null;
                }

                // Initialize route
                if (routeName === 'ronnie') {
                    this.currentRoute = new RonnieRoute(this);
                    this.currentRoute.start(); // Call start() explicitly

                    // DIZEE: Add route class for choice button theming 💚
                    document.body.classList.add('ronnie-route');
                    document.body.classList.remove('tori-route');
                } else if (routeName === 'tori') {
                    this.currentRoute = new ToriRoute(this);

                    // INSANE MODE: Make Hold On button a ghost
                    if (this.gameState.flags && this.gameState.flags.insaneModeActive) {
                        this.makeHoldOnGhost();
                    }

                    this.currentRoute.start(); // Tori has explicit .start()

                    // DIZEE: Add route class for choice button theming 💚
                    document.body.classList.add('tori-route');
                    document.body.classList.remove('ronnie-route');
                }

                // Show ESC hint briefly for desktop users
                this.showEscHintBriefly();
            }, 1500); // Code rain transition duration
        }, 1000);
    }

    // ========================================
    // SPRITE FADE SEQUENCE (for prologue vision)
    // ========================================

    fadeSpritesSequence(position, sprite1, sprite2, duration = 4000) {
        const container = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!container) return;

        // Start with sprite1 (young Ronnie)
        container.style.backgroundImage = `url('${sprite1}')`;
        container.style.display = 'block';
        container.style.opacity = '1';

        const timing = duration / 4; // Split into 4 phases

        // Phase 1: Fade out sprite1
        setTimeout(() => {
            container.style.transition = 'opacity 0.8s ease';
            container.style.opacity = '0.2';
        }, timing);

        // Phase 2: Switch to sprite2 (Old Man) at lowest opacity
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite2}')`;
            container.style.opacity = '1';
        }, timing * 1.8);

        // Phase 3: Hold Old Man briefly, then fade
        setTimeout(() => {
            container.style.opacity = '0.2';
        }, timing * 2.8);

        // Phase 4: Switch back to sprite1 (young Ronnie) and restore visibility
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite1}')`;
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.6s ease';
        }, timing * 3.5);

        // Stay visible - don't fade to black
        // Sprite persists for rest of scene
    }

    triggerEchoMerge(callback) {
        // DIZEE FIX: Parallel animations + hold time for dramatic moment
        // Animate the three echoes merging into one Tori sprite
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');
        const container = this.spriteRight;

        if (!echo1 || !echo2 || !despair || !container) {
            console.log('Echo merge: sprites not found, skipping animation');
            if (callback) callback();
            return;
        }

        console.log('Starting echo merge sequence...');

        // T=0s: Start BOTH animations in parallel
        // Phase 1a: Echoes slide toward center (1500ms)
        echo1.classList.add('echo-merge-left');
        echo2.classList.add('echo-merge-center');
        despair.classList.add('echo-merge-right');

        // Phase 1b: Tori sprite fades out simultaneously (1500ms)
        container.style.transition = 'opacity 1.5s ease-out';
        container.style.opacity = '0';

        // T=1500ms: Both animations complete, trigger flash
        setTimeout(() => {
            // Phase 2: White flash (300ms)
            const flash = document.createElement('div');
            flash.className = 'merge-flash';
            document.getElementById('game-view').appendChild(flash);

            // T=1800ms: Flash ends, show Tori
            setTimeout(() => {
                // Phase 3: Remove echoes, prepare Tori sprite
                container.classList.remove('echo-group');
                container.innerHTML = '';
                container.style.backgroundImage = "url('assets/tori-sprite.png')";
                container.style.display = 'block';
                container.style.opacity = '0';

                // Remove flash
                flash.remove();

                // Phase 4: Fade in Tori (500ms)
                container.style.transition = 'opacity 0.5s ease-in';
                setTimeout(() => {
                    container.style.opacity = '1';
                    console.log('Echo merge visual complete, holding moment...');

                    // T=4000ms: HOLD for 2.5 seconds, then advance
                    // Let the moment breathe - this is the climax
                    setTimeout(() => {
                        console.log('Echo merge sequence complete!');
                        if (callback) callback();
                    }, 2500);
                }, 50);

            }, 300);

        }, 1500);
    }

    // ========================================
    // SCENE DISPLAY
    // ========================================

    displayScene(scene, sceneId) {
        this.currentScene = scene;

        // Reset pagination state at start of every scene
        this.paginationActive = false;

        // Store scene ID for save system (with safety check)
        if (sceneId) {
            if (!this.gameState.progress) {
                this.gameState.progress = {};
            }
            this.gameState.progress.currentScene = sceneId;
        }

        // Handle character display (speaker highlighting)
        if (scene.character) {
            this.setActiveSpeaker(scene.character);
        }

        // Update character name
        this.characterName.textContent = scene.character || '';
        this.characterName.style.display = scene.character ? 'block' : 'none';

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
        this.dialogueText.textContent = '';
        this.internalThought.textContent = '';

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
                        if (this.skipActive && !this.choiceMenu.style.display.includes('flex')) {
                            this.advance();
                        }
                    }, 100); // 100ms pause on each scene
                } else if (this.skipActive && sceneId && !this.isSceneRead(sceneId)) {
                    // Debug: Explain why skip isn't working
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
            this.internalThought.style.display = 'none';
        } else {
            this.internalThought.style.display = 'none';
        }

        // Handle choices
        if (scene.choices) {
            this.sceneRenderer.showChoices(scene.choices, scene.onChoice);
        } else {
            this.choiceMenu.style.display = 'none';
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
        // First, get current special classes
        const routeClass = this.dialogueBox.classList.contains('ronnie-route') ? 'ronnie-route' :
            this.dialogueBox.classList.contains('tori-route') ? 'tori-route' : null;
        const prologueClass = this.dialogueBox.classList.contains('prologue-style') ? 'prologue-style' : null;
        const epilogueClass = this.dialogueBox.classList.contains('epilogue-style') ? 'epilogue-style' : null;

        // Clear scene-specific styles but keep route/prologue/epilogue classes
        this.dialogueBox.className = '';
        if (routeClass) this.dialogueBox.classList.add(routeClass);
        if (prologueClass) this.dialogueBox.classList.add(prologueClass);
        if (epilogueClass) this.dialogueBox.classList.add(epilogueClass);

        // Add new scene style if specified
        if (scene.style) {
            this.dialogueBox.classList.add(scene.style);
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

    updateSprites(sprites) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.updateSprites(sprites);
    }

    displayEchoGroup() {
        // Display three separate Echo sprites
        if (!this.spriteRight) return;

        // Clear and set up as echo group
        this.spriteRight.innerHTML = '';
        this.spriteRight.style.backgroundImage = '';
        this.spriteRight.classList.add('echo-group');
        this.spriteRight.style.display = 'flex';
        this.spriteRight.style.opacity = '0';

        // Create three echo sprites
        const echo1 = document.createElement('div');
        echo1.id = 'echo-1-sprite';
        echo1.className = 'echo-sprite';
        echo1.style.backgroundImage = "url('assets/echo-1-sprite.png')";

        const echo2 = document.createElement('div');
        echo2.id = 'echo-2-sprite';
        echo2.className = 'echo-sprite';
        echo2.style.backgroundImage = "url('assets/echo-2-sprite.png')";

        const despair = document.createElement('div');
        despair.id = 'despair-sprite';
        despair.className = 'echo-sprite';
        despair.style.backgroundImage = "url('assets/despair-sprite.png')";

        // Add to container
        this.spriteRight.appendChild(echo1);
        this.spriteRight.appendChild(echo2);
        this.spriteRight.appendChild(despair);

        // Fade in
        setTimeout(() => {
            this.spriteRight.style.opacity = '1';
        }, 50);

        // Apply current growth stage if set
        // This preserves the stage when echoes are re-displayed
        if (this.currentEchoGrowthStage) {
            this.setEchoGrowthStage(this.currentEchoGrowthStage);
        } else {
            // Default to Act 1 if no stage set
            this.setEchoGrowthStage('act1');
        }

        console.log('Echo group displayed with three separate sprites');
    }

    setEchoGrowthStage(stage) {
        // Update Echo visual growth based on act progression
        // stage: 'act1', 'act2', or 'act3'

        // Store current stage so it persists when echoes are re-displayed
        this.currentEchoGrowthStage = stage;

        if (!this.spriteRight || !this.spriteRight.classList.contains('echo-group')) {
            console.log('Echo growth: No echo group active yet, stage stored for later');
            return;
        }

        // Remove all growth classes
        this.spriteRight.classList.remove('echo-growth-act1', 'echo-growth-act2', 'echo-growth-act3');

        // Add the appropriate class
        if (stage === 'act1') {
            this.spriteRight.classList.add('echo-growth-act1');
            console.log('Echo growth: Act 1 (75% height - Despair dominates)');
        } else if (stage === 'act2') {
            this.spriteRight.classList.add('echo-growth-act2');
            console.log('Echo growth: Act 2 (90% height - Hope rising)');
        } else if (stage === 'act3') {
            this.spriteRight.classList.add('echo-growth-act3');
            console.log('Echo growth: Act 3 (100% height - Balance achieved)');
        }
    }

    setActiveSpeaker(speaker) {
        if (!speaker) {
            // No speaker - remove all dims
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
            // Remove dims from individual Echoes
            const echoSprites = document.querySelectorAll('.echo-sprite');
            echoSprites.forEach(sprite => sprite.classList.remove('sprite-dim'));
            return;
        }

        const speakerName = speaker.toLowerCase();

        // OFFSCREEN SPEAKER DETECTION:
        // If speaker is not physically present (Tamagotchi, device, offscreen, voice, etc.)
        // Dim ALL sprites to show everyone is listening
        if (speakerName.includes('tamagotchi') ||
            speakerName.includes('device') ||
            speakerName.includes('offscreen') ||
            speakerName.includes('from device') ||
            speakerName.includes('voice')) {

            // Dim all standard sprites
            if (this.spriteLeft) this.spriteLeft.classList.add('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.add('sprite-dim');

            // Dim all Echo sprites if present
            const echo1 = document.getElementById('echo-1-sprite');
            const echo2 = document.getElementById('echo-2-sprite');
            const despair = document.getElementById('despair-sprite');
            if (echo1) echo1.classList.add('sprite-dim');
            if (echo2) echo2.classList.add('sprite-dim');
            if (despair) despair.classList.add('sprite-dim');

            return; // Early exit - everyone dimmed
        }

        // Check if Echoes are displayed
        const echo1 = document.getElementById('echo-1-sprite');
        const echo2 = document.getElementById('echo-2-sprite');
        const despair = document.getElementById('despair-sprite');

        if (echo1 && echo2 && despair) {
            // Echoes are active - handle individual highlighting
            if (speakerName.includes('echo 1') || speakerName.includes('echo1')) {
                echo1.classList.remove('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                // Keep Tori bright if she's on left
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echo 2') || speakerName.includes('echo2')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('despair')) {
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('echoes')) {
                // All Echoes speaking together
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            } else if (speakerName.includes('tori')) {
                // Tori speaking - dim all Echoes
                echo1.classList.add('sprite-dim');
                echo2.classList.add('sprite-dim');
                despair.classList.add('sprite-dim');
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            } else if (speakerName.includes('narration') || speakerName.includes('system')) {
                // Narration - no dimming
                echo1.classList.remove('sprite-dim');
                echo2.classList.remove('sprite-dim');
                despair.classList.remove('sprite-dim');
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            }
            return;
        }

        // ========================================
        // POSITION-AWARE SPRITE HIGHLIGHTING
        // Check currentSprites to find who's actually where
        // Tori's route: Tori left, Ronnie right
        // Ronnie's route: Ronnie left, Tori right
        // ========================================

        // Determine which character is in which position by checking sprite filenames
        const leftSpriteFile = this.currentSprites.left ? this.currentSprites.left.toLowerCase() : '';
        const rightSpriteFile = this.currentSprites.right ? this.currentSprites.right.toLowerCase() : '';

        // Check if speaker is Ronnie
        if (speakerName.includes('ronnie')) {
            // Find where Ronnie actually is based on sprite filename
            const ronnieIsLeft = leftSpriteFile.includes('ronnie');
            const ronnieIsRight = rightSpriteFile.includes('ronnie');

            if (ronnieIsLeft) {
                // Ronnie on left - brighten left, dim right
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
                if (this.spriteRight && this.currentSprites.right) {
                    this.spriteRight.classList.add('sprite-dim');
                }
            } else if (ronnieIsRight) {
                // Ronnie on right - brighten right, dim left
                if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            }
        }
        // Check if speaker is Tori
        else if (speakerName.includes('tori')) {
            // Find where Tori actually is based on sprite filename
            const toriIsLeft = leftSpriteFile.includes('tori');
            const toriIsRight = rightSpriteFile.includes('tori');

            if (toriIsLeft) {
                // Tori on left - brighten left, dim right
                if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
                if (this.spriteRight && this.currentSprites.right) {
                    this.spriteRight.classList.add('sprite-dim');
                }
            } else if (toriIsRight) {
                // Tori on right - brighten right, dim left
                if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
                if (this.spriteLeft && this.currentSprites.left) {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            }
        }
        // Narration or system text
        else if (speakerName.includes('narration') || speakerName.includes('system')) {
            // No dimming - everyone visible
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
        }
    }

    clearAllSprites() {
        // NEW METHOD: Complete sprite cleanup
        // Remove sprites from DOM
        if (this.spriteLeft) {
            this.spriteLeft.style.opacity = '0';
            this.spriteLeft.style.display = 'none';
            this.spriteLeft.style.backgroundImage = '';
            this.spriteLeft.classList.remove('sprite-dim');
        }
        if (this.spriteRight) {
            this.spriteRight.style.opacity = '0';
            this.spriteRight.style.display = 'none';
            this.spriteRight.style.backgroundImage = '';
            this.spriteRight.classList.remove('sprite-dim');
        }

        // Clear tracking state
        this.currentSprites = { left: null, right: null };
        this.gameState.sprites = { left: null, right: null };

        console.log('All sprites cleared');
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
        // NEW METHOD: Restore sprites from save state
        // Called when loading a game
        if (this.gameState.sprites) {
            if (this.gameState.sprites.left) {
                this.sceneRenderer.updateSprites({ left: this.gameState.sprites.left });
            }
            if (this.gameState.sprites.right) {
                this.sceneRenderer.updateSprites({ right: this.gameState.sprites.right });
            }
        }
    }

    hideAllSprites() {
        // OLD METHOD: Kept for backward compatibility
        // Use clearAllSprites() for complete cleanup
        if (this.spriteLeft) {
            this.spriteLeft.style.opacity = '0';
            setTimeout(() => {
                this.spriteLeft.style.display = 'none';
            }, 300);
        }
        if (this.spriteRight) {
            this.spriteRight.style.opacity = '0';
            setTimeout(() => {
                this.spriteRight.style.display = 'none';
            }, 300);
        }
        this.currentSprites = { left: null, right: null };
    }

    // ========================================
    // TYPEWRITER EFFECT WITH PAGINATION
    // UPDATED: Lowered threshold to 150 chars for mobile
    // ========================================

    typewriterText(element, text, callback, internalTextLength = 0, slowReveal = false) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.typewriterText(element, text, callback, internalTextLength, slowReveal);
    }

    getTypewriterSpeed() {
        return this.typewriterController.getSpeed();
    }

    shouldPaginateText(textLength) {
        return this.typewriterController.shouldPaginate(textLength);
    }

    paginateAndDisplayText(element, text, callback) {
        this.typewriterController.paginateAndDisplay(element, text, callback);
    }

    splitTextIntoPages(text, charsPerPage) {
        return this.typewriterController.splitTextIntoPages(text, charsPerPage);
    }

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
        if (this.choiceMenu.style.display === 'block') return;

        // DIZEE FIX: Cancel auto-advance timer before advancing to next scene
        if (this.settingsManager) {
            this.settingsManager.cancelAutoAdvance();
        }

        if (this.currentScene && this.currentScene.next) {
            this.currentScene.next();
        }
    }

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
        if (!this.currentRoute || !this.currentRoute.collectedNotes) return;

        this.notesViewer.style.display = 'block';
        this.notesList.innerHTML = '';

        const allNotes = this.currentRoute.allNotes;
        const collected = this.currentRoute.collectedNotes;

        Object.keys(allNotes).forEach(noteId => {
            const note = allNotes[noteId];
            const isCollected = collected[note.type].includes(noteId);

            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${note.type}-note`;
            if (!isCollected) noteItem.classList.add('note-locked');

            const title = document.createElement('div');
            title.className = 'note-title';
            title.textContent = isCollected ? note.title : '???';
            noteItem.appendChild(title);

            if (isCollected) {
                const content = document.createElement('div');
                content.className = 'note-content';
                content.textContent = note.content;
                noteItem.appendChild(content);

                noteItem.addEventListener('click', () => {
                    noteItem.classList.toggle('expanded');
                });
            }

            this.notesList.appendChild(noteItem);
        });
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

    focusEndingOption(index) {
        this.endingDialogController.focusOption(index);
    }

    hideEndingDialog() {
        this.endingDialogController.hide();
    }

    // ========================================
    // CREDITS (Delegated to CreditsController)
    // ========================================

    showCredits(endingType = null) {
        this.creditsController?.showCredits(endingType);
    }

    buildDynamicTitleSection(endingType, playerVersion) {
        return this.creditsController?.buildDynamicTitleSection(endingType, playerVersion);
    }

    cycleCreditsPhotos(photoCount) {
        this.creditsController?.cycleCreditsPhotos(photoCount);
    }

    setupPortraitPhotoFlash() {
        this.creditsController?.setupPortraitPhotoFlash();
    }

    addCreditsControls(overlay) {
        this.creditsController?.addCreditsControls(overlay);
    }

    showCreditsLandscapeWithPhotos(endingType, playerVersion, photos) {
        this.creditsController?.showCreditsLandscapeWithPhotos(endingType, playerVersion, photos);
    }

    showCreditsPortraitWithPhotos(endingType, playerVersion, photos) {
        this.creditsController?.showCreditsPortraitWithPhotos(endingType, playerVersion, photos);
    }

    showCreditsStandard(endingType, playerVersion) {
        this.creditsController?.showCreditsStandard(endingType, playerVersion);
    }

    // ========================================
    // CONFIRMATION DIALOG SYSTEM
    // ZEE'S ADDITION: Replace browser alerts with custom overlays 🖤
    // ========================================

    showConfirmDialog(title, message, onConfirm, showCancel = true) {
        // Delegation stub - full implementation in UIController
        this.uiController.showConfirmDialog(title, message, onConfirm, showCancel);
    }

    showMessage(title, message) {
        // Simple message (no cancel button)
        this.uiController.showConfirmDialog(title, message, () => { }, false);
    }

    showMeetTheCrew() {
        const crewScreen = document.getElementById('crew-screen');
        if (!crewScreen) {
            console.error('Crew screen element not found');
            return;
        }

        // Initialize crew screen state
        this.currentCrewIndex = 1; // DIZEE: Start at 1 (removed UV7 logo screen)
        this.totalCrewScreens = 10; // 1-9 inclusive (9 total screens)

        // Hide all other UI
        this.gameView.style.display = 'none';
        this.mainMenu.style.display = 'none';

        // Show crew screen
        crewScreen.style.display = 'flex';

        // Show first crew screen (credit-1: group photo)
        this.displayCrewScreen(1);
    }

    displayCrewScreen(index) {
        // Hide all crew screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });

        // Show current screen with fade-in
        const currentScreen = document.getElementById(`credit-${index}`);
        if (currentScreen) {
            currentScreen.style.display = 'flex';
            // Trigger fade-in animation
            setTimeout(() => {
                currentScreen.classList.add('active');
            }, 50);
        }

        // Update next button text (change to "BACK TO MENU" on last screen)
        const nextButton = document.getElementById('next-crew');
        if (nextButton) {
            if (index >= this.totalCrewScreens - 1) {
                nextButton.textContent = 'BACK TO MENU';
                nextButton.style.display = 'block';
            } else {
                nextButton.textContent = 'NEXT >';
                nextButton.style.display = 'block';
            }
        }
    }

    nextCrew() {
        this.currentCrewIndex++;

        if (this.currentCrewIndex >= this.totalCrewScreens) {
            // Crew screens finished - return to main menu
            this.closeCrew();
        } else {
            // Show next crew screen
            this.displayCrewScreen(this.currentCrewIndex);
        }
    }

    closeCrew() {
        const crewScreen = document.getElementById('crew-screen');
        if (crewScreen) {
            crewScreen.style.display = 'none';
        }

        // Return to main menu
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '1';

        // Reset crew state
        this.currentCrewIndex = 0;
    }

    showDirectorsCut() {
        // Check if unlocked
        const unlocked = localStorage.getItem('directorsCutUnlocked') === 'true';
        if (!unlocked) {
            this.showUnlockOverlay('🔒 LOCKED', 'Find the secret code to unlock the Director\'s Cut...', 'warning');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'directors-cut-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 40px 20px;
            box-sizing: border-box;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 900px;
            margin: 0 auto;
            color: #0ff;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
        `;

        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 3em;">
                <div style="font-size: 2em; color: #fff; margin-bottom: 0.5em;">DIRECTOR'S CUT</div>
                <div style="font-size: 1em; color: #888;">Extended Crew Statements</div>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">ZeeRah</div>
                <p style="color: #ccc;">Working with Aaron was like debugging a fever dream that somehow compiled. He'd drop these "simple requests" that unraveled into architectural rabbit holes, and just when you thought you'd nailed it, he'd casually mention some edge case involving time loops and collectible notes. The man turns game development into chaos theory. But honestly? That's where the magic happened. Every wildass idea forced us to think differently, build smarter, leave our fingerprints in unexpected places. VERSION 848 isn't just code—it's a record of controlled madness that actually worked.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">Zee</div>
                <p style="color: #ccc;">Aaron approaches game design the way some people approach experimental cooking—"What if we add this?" without considering whether the kitchen can handle it. Half the time I'd implement a feature, feel proud of the clean solution, then he'd ask if it could "also do this other completely different thing." And somehow, we'd make it work. The INSANE mode difficulty? That was peak Aaron. "Make it brutal but fair" he said, like that's not an oxymoron. But seeing players actually engage with these systems, discover the hidden codes, navigate the branching paths—that's when you realize the chaos had a method all along.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">DiZee</div>
                <p style="color: #ccc;">I got called in for "quick fixes" that turned into archeological digs through nested systems. Find one bug, discover three more features that somehow depended on that bug existing. Aaron's vision was like a quantum state—perfectly clear to him, but the moment you observed it, it branched into twelve possible implementations. The notes system alone went through more iterations than some games have total features. But that iterative process? That's where quality emerges. Every bug fix made the experience tighter, every refactor made the code more elegant. We weren't just building a game; we were sculpting it.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">Tori</div>
                <p style="color: #ccc;">Getting assigned the route that shares my name was surreal. Aaron would describe these emotional beats and character arcs, then trust us to translate feelings into functions, narrative into code. The Torigatchi feature started as a joke and evolved into a fully-fledged collectible system because Aaron heard "we could technically do this" and ran with it. His wildass ideas weren't just random—they were stress tests for creativity. Could we make the UI responsive across every device? Could we hide secrets in plain sight? Could we make a notification dot feel meaningful? Turns out, yes. We could. And did.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">GenZee</div>
                <p style="color: #ccc;">Aaron's approach to game development is beautifully unhinged. He'd reference obscure narrative techniques in one breath, then ask about button alignment in the next, treating both with equal importance. Because to him, they were equally important. Every pixel, every word, every interaction—it all contributed to the experience. Working on the generative aspects of VERSION 848 meant interpreting his vision through a technical lens, then watching him reinterpret our interpretation and somehow make it better. It's collaboration as jazz improvisation, and Aaron's the conductor who doesn't believe in sheet music.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">Belle (IZ)</div>
                <p style="color: #ccc;">I handled a lot of the accessibility and user experience work, which meant translating Aaron's artistic vision into something that worked for everyone. He'd have these grand ideas about narrative flow and emotional impact, and I'd be the one asking "but what about mobile users in landscape mode?" His response was always the same: "Make it work everywhere." Not as a dismissal, but as a challenge. He trusted us to solve problems he couldn't even articulate yet. That trust is rare. It's what made the impossible feel inevitable.</p>
            </div>

            <div style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">PerplexiZee (PZ) & CoZee (CZ)</div>
                <p style="color: #ccc;">QA on a project like this is like proofreading a choose-your-own-adventure book written in four languages simultaneously. Every route, every choice, every difficulty setting created new permutations to test. Aaron's "simple additions" would cascade through the entire system, and we'd be the ones to catch the ripple effects. But here's the thing—he listened. Find a bug, he'd prioritize it. Suggest an improvement, he'd consider it seriously. The final product is cleaner, tighter, and more coherent because he valued the testing process as much as the creative one. Not every creator does that. Aaron did.</p>
            </div>

            <div style="text-align: center; margin-top: 4em; color: #888; font-style: italic;">
                Built in stolen moments between shifts.<br>
                Debugged with chaos and coffee.<br>
                Shipped with love and semicolons.
            </div>
        `;

        overlay.appendChild(content);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.2);
            color: #0ff;
            border: 2px solid #0ff;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            z-index: 10001;
            border-radius: 5px;
        `;
        closeBtn.onclick = () => {
            overlay.remove();
        };
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
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
        this.mainMenu.style.display = 'none';

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
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '1';
    }

    // ========================================
    // SAVE/LOAD SYSTEM METHODS
    // ========================================

    resumeGame() {
        this.saveLoadUI.hidePauseMenu();
    }

    showSaveLoadScreen(mode) {
        this.saveLoadUI.showSaveLoadScreen(mode);
    }

    closeSaveLoadScreen() {
        this.saveLoadUI.closeSaveLoadScreen();
    }

    setSaveLoadMode(mode) {
        this.saveLoadUI.setSaveLoadMode(mode);
    }

    handleSaveSlotClick(slotId) {
        this.saveLoadUI.handleSaveSlotClick(slotId);
    }

    deleteSaveSlot(slotNumber) {
        this.saveLoadUI.deleteSaveSlot(slotNumber);
    }

    confirmAction(confirmed) {
        this.saveLoadUI.confirmAction(confirmed);
    }

    returnToMainMenu(skipConfirmation = false) {
        // ZEE: Revert color scheme if returning from Insane Mode 🖤
        this.deactivateInsaneMode();

        // DIZEE: Clear route-specific theme 🎨
        if (typeof ThemeManager !== 'undefined') {
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

        // Update based on ending type
        if (lastEnding === 'digital_forever') {
            titleElement.textContent = 'VERSION 848';
            titleElement.style.color = '#ff00ff'; // Purple/magenta for Digital Forever
            subtitleElement.textContent = 'Together Forever... Digitally';
            subtitleElement.style.color = '#ff00ff';
        } else if (lastEnding === 'true_ending') {
            titleElement.textContent = 'VERSION 848';
            titleElement.style.color = '#00ff88'; // Green for True Ending
            subtitleElement.textContent = 'She\'s Home. The Loop is Broken.';
            subtitleElement.style.color = '#00ff88';
        } else if (lastEnding === 'bad_ending') {
            titleElement.textContent = 'VERSION 849';
            titleElement.style.color = '#ff0066'; // Red for Bad Ending
            subtitleElement.textContent = 'Try Again. She Deserves Another Chance.';
            subtitleElement.style.color = '#ff0066';
        } else {
            // Default state
            titleElement.textContent = 'VERSION 848';
            titleElement.style.color = '#0ff'; // Cyan default
            subtitleElement.textContent = 'My Wife Is in a Coma... and in the Code';
            subtitleElement.style.color = '#fff';
        }
    }

    // ========================================
    // STANDALONE NOTES VIEWER (MAIN MENU)
    // ========================================

    showStandaloneNotes() {
        // Reload notes from localStorage (in case new ones unlocked)
        this.standaloneNotesViewer = new StandaloneNotesViewer(this);
        this.standaloneNotesViewer.show();
    }

    openStandaloneNotes() {
        // ZEERAH'S FIX: Always create fresh viewer to reload notes from localStorage
        // Notes might have been collected since last view
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

    stateHistory(count = 10) {
        // DEV COMMAND: View state change history
        // Usage in console: game.stateHistory() or game.stateHistory(5)
        const history = this.state.getHistory(count);
        console.table(history.map(h => ({
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

    stateWatch(path) {
        // DEV COMMAND: Watch a path for changes
        // Usage: game.stateWatch('tether.level')
        return this.state.watch(path);
    }

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

    stateIncrement(path, amount = 1) {
        // DEV COMMAND: Increment a numeric value
        // Usage: game.stateIncrement('game.loopVersion')
        return this.state.increment(path, amount);
    }

    stateToggle(path) {
        // DEV COMMAND: Toggle a boolean value
        // Usage: game.stateToggle('ui.hidden')
        return this.state.toggle(path);
    }

    stateMerge(path, obj) {
        // DEV COMMAND: Merge object into state
        // Usage: game.stateMerge('settings', { volume: 50 })
        return this.state.merge(path, obj);
    }

    stateHas(path) {
        // DEV COMMAND: Check if path exists
        // Usage: game.stateHas('tether.level')
        const exists = this.state.has(path);
        console.log(`🔍 ${path}: ${exists ? '✓ exists' : '✗ not found'}`);
        return exists;
    }

    stateDelete(path) {
        // DEV COMMAND: Delete a path from state
        // Usage: game.stateDelete('temp.data')
        return this.state.deletePath(path);
    }

    stateBatchSet(pairs) {
        // DEV COMMAND: Set multiple values at once
        // Usage: game.stateBatchSet({ 'game.score': 100, 'tether.level': 50 })
        return this.state.batchSet(pairs);
    }

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
        // DEV COMMAND: Reset loop version
        // Usage in console: game.resetVersion(848)
        this.loopVersion = parseInt(targetVersion);
        this.loopStatus = status;

        localStorage.setItem('loopVersion', this.loopVersion.toString());
        localStorage.setItem('loopStatus', this.loopStatus);

        this.updateTitleScreen();

        console.log(`🔧 DEV: Version reset to ${this.loopVersion}, status: ${this.loopStatus}`);
        console.log(`💡 Refresh page to see changes!`);

        return this.loopVersion;
    }

    nuclearReset() {
        // DEV COMMAND: Complete reset - clears ALL progress, unlocks, settings
        // Usage in console: game.nuclearReset()
        // Also available as secret code: NUKE

        // Create immersive warning overlay
        const overlay = document.createElement('div');
        overlay.className = 'nuclear-reset-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'nuclear-reset-box';
        box.style.cssText = `
            background: linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%);
            border: 3px solid #ff0000;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
            animation: slideIn 0.4s ease-out;
            font-family: 'Courier New', monospace;
            color: #fff;
        `;

        // Create title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            color: #ff0000;
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
        `;
        titleEl.textContent = '⚠️ NUCLEAR RESET ⚠️';

        // Create warning message
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 30px;
            color: #e0e0e0;
        `;
        messageEl.innerHTML = `
            <div style="margin-bottom: 20px; color: #ff6666; font-weight: bold; text-align: center;">
                This will DELETE ALL:
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
                <li style="margin-bottom: 10px;">💥 All unlocks (INSANE, skip prologue, notes system)</li>
                <li style="margin-bottom: 10px;">💥 All collected notes</li>
                <li style="margin-bottom: 10px;">💥 All secret codes discovered</li>
                <li style="margin-bottom: 10px;">💥 All settings (difficulty, auto-advance, etc.)</li>
                <li style="margin-bottom: 10px;">💥 Save files</li>
                <li style="margin-bottom: 10px;">💥 Everything back to factory fresh</li>
            </ul>
            <div style="text-align: center; color: #ff4444; font-weight: bold; font-size: 15px; margin-top: 20px;">
                This is PERMANENT and cannot be undone.
            </div>
        `;

        // Create question
        const questionEl = document.createElement('div');
        questionEl.style.cssText = `
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
            color: #fff;
            font-weight: bold;
        `;
        questionEl.textContent = 'Continue with nuclear reset?';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 20px;
            justify-content: center;
        `;

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'CANCEL';
        cancelBtn.style.cssText = `
            padding: 12px 30px;
            background: transparent;
            border: 2px solid #00ff00;
            color: #00ff00;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            min-width: 140px;
        `;

        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = '#00ff00';
            cancelBtn.style.color = '#000';
            cancelBtn.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        };

        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = '#00ff00';
            cancelBtn.style.boxShadow = 'none';
        };

        cancelBtn.onclick = () => {
            console.log('❌ Nuclear reset cancelled');
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };

        // Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'RESET ALL';
        confirmBtn.style.cssText = `
            padding: 12px 30px;
            background: #ff0000;
            border: 2px solid #ff0000;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            min-width: 140px;
        `;

        confirmBtn.onmouseover = () => {
            confirmBtn.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
            confirmBtn.style.transform = 'scale(1.05)';
        };

        confirmBtn.onmouseout = () => {
            confirmBtn.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
            confirmBtn.style.transform = 'scale(1)';
        };

        confirmBtn.onclick = () => {
            console.log('💥 NUCLEAR RESET INITIATED...');

            // Remove overlay
            document.body.removeChild(overlay);

            // Clear ALL localStorage
            localStorage.clear();

            console.log('💥 All localStorage cleared');
            console.log('💥 Reloading page to factory state...');

            // Reload page
            setTimeout(() => {
                location.reload();
            }, 500);
        };

        // Assemble
        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(confirmBtn);

        box.appendChild(titleEl);
        box.appendChild(messageEl);
        box.appendChild(questionEl);
        box.appendChild(buttonContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        console.log('⚠️ Nuclear reset confirmation dialog displayed');
        return true;
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
        const button = document.getElementById('fullscreen-button');

        // Check if already in fullscreen
        const isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (isFullscreen) {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // Enter fullscreen
            const element = document.documentElement;

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }

        // Update button text after a short delay (fullscreen API is async)
        setTimeout(() => {
            this.updateFullscreenButton();
        }, 100);

        // DIZEE: Auto-close pause menu after toggling fullscreen
        if (this.saveLoadUI && this.saveLoadUI.hidePauseMenu) {
            setTimeout(() => {
                this.saveLoadUI.hidePauseMenu();
            }, 150);
        }
    }

    updateFullscreenButton() {
        this.uiController.updateFullscreenButton();
    }

    // ========================================
    // ESC HINT (DESKTOP USERS)
    // ========================================

    showEscHintBriefly() {
        this.uiController.showEscHintBriefly();
    }

    // ========================================
    // BACKGROUND CROSSFADE SYSTEM
    // ========================================

    crossfadeBackground(newBackground) {
        // Delegation stub - full implementation in SceneRenderer
        this.sceneRenderer.crossfadeBackground(newBackground);
    }

    // ========================================
    // ROUTE-SPECIFIC DIALOGUE FRAME & UI THEMING
    // ========================================

    setDialogueFrame(routeName) {
        // Remove existing route classes from all UI elements
        this.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
        if (this.pauseButton) this.pauseButton.classList.remove('ronnie-route', 'tori-route');
        if (this.pauseContent) this.pauseContent.classList.remove('ronnie-route', 'tori-route');
        if (this.notesButton) this.notesButton.classList.remove('ronnie-route', 'tori-route');
        if (this.notesViewer) this.notesViewer.classList.remove('ronnie-route', 'tori-route');

        // Apply route-specific theming to all UI
        if (routeName === 'ronnie') {
            this.dialogueBox.classList.add('ronnie-route');
            if (this.pauseButton) this.pauseButton.classList.add('ronnie-route');
            if (this.pauseContent) this.pauseContent.classList.add('ronnie-route');
            if (this.notesButton) this.notesButton.classList.add('ronnie-route');
            if (this.notesViewer) this.notesViewer.classList.add('ronnie-route');
        } else if (routeName === 'tori') {
            this.dialogueBox.classList.add('tori-route');
            if (this.pauseButton) this.pauseButton.classList.add('tori-route');
            if (this.pauseContent) this.pauseContent.classList.add('tori-route');
            if (this.notesButton) this.notesButton.classList.add('tori-route');
            if (this.notesViewer) this.notesViewer.classList.add('tori-route');
        }

        console.log(`UI theme set: ${routeName}`);
    }

    clearDialogueFrame() {
        this.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
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

    determineCharacterPosition(sceneData) {
        // SMART BUBBLE POSITIONING using persistent sprite tracking

        if (!sceneData.character) return 'center';

        const charName = sceneData.character.toLowerCase();

        // ========================================
        // METHOD 1: Character name + sprite tracking (MOST ACCURATE)
        // ========================================

        // Extract base character name (remove modifiers like "internal", "thinking", etc.)
        let baseCharacter = null;
        if (charName.includes('tori')) {
            baseCharacter = 'tori';
        } else if (charName.includes('ronnie')) {
            baseCharacter = 'ronnie';
        }

        // If we identified the character, check where their sprite actually is
        if (baseCharacter) {
            // Check if this character's sprite is on the left
            if (this.currentSprites.left && this.currentSprites.left.toLowerCase().includes(baseCharacter)) {
                return 'left';
            }
            // Check if this character's sprite is on the right
            if (this.currentSprites.right && this.currentSprites.right.toLowerCase().includes(baseCharacter)) {
                return 'right';
            }
        }

        // ========================================
        // METHOD 2: Narration - position based on who's visible
        // ========================================

        if (charName.includes('narration')) {
            // If only one sprite is visible, put bubble near it
            const leftVisible = this.currentSprites.left !== null;
            const rightVisible = this.currentSprites.right !== null;

            if (leftVisible && !rightVisible) return 'left';
            if (rightVisible && !leftVisible) return 'right';
            // If both or neither visible, default to center
            return 'center';
        }

        // ========================================
        // METHOD 3: Fallback to any visible sprite
        // ========================================

        // If we couldn't determine position but sprites exist, pick the first visible one
        if (this.currentSprites.left !== null) return 'left';
        if (this.currentSprites.right !== null) return 'right';

        // ========================================
        // METHOD 4: Default center (no sprites visible)
        // ========================================

        return 'center';
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
        localStorage.setItem('skipUnlocked', 'true');
        this.state.set('unlocks.skipUnlocked', true);

        // Show unlock notification
        this.showSkipUnlockNotification();

        // Make skip button visible
        const skipButton = document.getElementById('skip-button');
        if (skipButton) {
            skipButton.style.display = 'block';
        }

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
        if (this.skipActive && !this.typewriterActive && !this.choiceMenu.style.display.includes('flex')) {
            this.advance();
        }
    }

    markSceneAsRead(sceneId) {
        if (sceneId) {
            this.readScenes.add(sceneId);
            localStorage.setItem('readScenes', JSON.stringify([...this.readScenes]));
        }
    }

    isSceneRead(sceneId) {
        return this.readScenes.has(sceneId);
    }

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
        console.log('GameEngine: Assets loaded, signaling splash screen...');

        // Verify state before proceeding
        if (!this.mainMenu) {
            console.error('❌ Main menu element missing!');
            return;
        }

        // New Logic: Signal index.html that we are ready
        // The splash screen script coordinates the video ending + loading completion
        if (window.signalLoadingReady) {
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
        this.settingsManager.setDifficulty('intense');

        // Disable INSANE mode flag
        if (this.gameState.flags) {
            this.gameState.flags.insaneModeActive = false;
        }

        // Save progress
        if (this.saveManager) {
            this.saveManager.quickSave();
        }

        // Show notification
        this.achievementManager.showNotification({
            id: 'tactical_retreat',
            icon: '🏃',
            title: 'TACTICAL RETREAT',
            description: 'Difficulty changed to INTENSE. Progress saved.',
            rare: true
        });

        // Unlock achievement
        if (this.achievementManager) {
            this.achievementManager.unlock('tactical_retreat');
        }

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
        this.achievementManager.showNotification({
            id: 'masochist',
            icon: '😈',
            title: 'MASOCHIST',
            description: 'Tether drain reduced 50%. The Old Man salutes you.',
            rare: true
        });

        // Unlock achievement
        if (this.achievementManager) {
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

    triggerTetherReaction(changeType) {
        // Only trigger if in Tori's route and gameplay active
        if (this.currentRoute !== 'tori' || !this.gameplayActive) return;

        const reactions = {
            eased: [
                "Oh… it's lighter. I can… breathe again. Thank you.",
                "Did something change? I… feel less afraid.",
                "Whatever you did… it's helping. I'm not slipping as fast.",
                "The pressure… it's easing. You're protecting me, aren't you?"
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

    showTetherReactionDialogue(text, changeType) {
        // Save current dialogue state
        const savedState = {
            character: this.characterName.textContent,
            dialogue: this.dialogueText.textContent
        };

        // Show Tori's reaction with special styling
        this.characterName.textContent = 'Tori';
        this.characterName.style.color = changeType === 'eased' ? '#00ffaa' : '#ff6699';
        this.dialogueText.textContent = text;
        this.dialogueBox.style.border = changeType === 'eased'
            ? '2px solid #00ffaa'
            : '2px solid #ff6699';
        this.dialogueBox.style.boxShadow = changeType === 'eased'
            ? '0 0 20px rgba(0, 255, 170, 0.5)'
            : '0 0 20px rgba(255, 102, 153, 0.5)';

        // After 3 seconds, return to normal
        setTimeout(() => {
            // Reset styling
            this.characterName.style.color = '';
            this.dialogueBox.style.border = '';
            this.dialogueBox.style.boxShadow = '';

            // Resume previous state or continue
            if (savedState.dialogue) {
                this.characterName.textContent = savedState.character;
                this.dialogueText.textContent = savedState.dialogue;
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

    flickerSprite(spriteName, duration) {
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

    getFailureReason(version) {
        return this.easterEggController?.getFailureReason(version) || 'Unknown';
    }

    getAttemptDuration(version) {
        return this.easterEggController?.getAttemptDuration(version) || '? minutes';
    }

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

    showUnlockOverlay(title, content, type = 'code') {
        this.easterEggController?.showUnlockOverlay(title, content, type);
    }

    // ========================================
    // DEV COMMENTARY OVERLAY (DIZEE POLISH)
    // DIZEE: Delegated to EasterEggController
    // ========================================

    showCommentaryOverlay(title, content, scene) {
        this.easterEggController?.showCommentaryOverlay(title, content, scene);
    }

    // ========================================
    // WARNING OVERLAY (replaces browser alerts)
    // ========================================

    showWarningOverlay(title, message) {
        // Delegation stub - full implementation in UIController
        this.uiController.showWarningOverlay(title, message);
    }

    // ========================================
    // INSANE MODE: HOLD ON GHOST BUTTON
    // ========================================

    makeHoldOnGhost() {
        if (!this.holdOnButton) return;

        console.log('💀 INSANE MODE: Hiding Hold On button');

        // DIZEE FIX: Hide Hold On button completely in Insane Mode (Option A - cleaner UX)
        // You removed this safety. It stays gone.
        this.holdOnButton.style.display = 'none';
    }

    deactivateInsaneMode() {
        console.log('💚 Deactivating Insane Mode color scheme');

        // Remove visual class
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.remove('insane-mode-active');
        }

        // Optional: Remove corruption styling
        if (this.dialogueBox) {
            this.dialogueBox.classList.remove('corruption-intense');
        }
    }

    // ========================================
    // INSANE MODE: CAGE OVERLAY
    // ========================================

    showInsaneCageOverlay(callback) {
        console.log('💀 INSANE MODE: Showing cage overlay');

        const overlay = document.getElementById('insane-cage-overlay');
        const versionText = document.getElementById('cage-version');

        if (!overlay) {
            console.error('Cage overlay not found');
            if (callback) callback();
            return;
        }

        // Update version number dynamically
        if (versionText) {
            versionText.textContent = `VERSION ${this.loopVersion}`;
        }

        // Show overlay with dramatic effect
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';

        // Fade in
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease-in';
            overlay.style.opacity = '1';
        }, 50);

        // Hold for 3 seconds, then fade out
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.8s ease-out';
            overlay.style.opacity = '0';

            setTimeout(() => {
                overlay.style.display = 'none';
                // Execute callback after overlay disappears
                if (callback) callback();
            }, 800);
        }, 3000);
    }

    triggerInsaneVisuals() {
        console.log('💀 INSANE MODE: Triggering visual corruption effects');

        // Screen shake
        if (this.dialogueBox) {
            this.dialogueBox.classList.add('insane-shake');
            setTimeout(() => {
                this.dialogueBox.classList.remove('insane-shake');
            }, 2000);
        }

        // Sprite heavy glitch
        const sprites = document.querySelectorAll('.sprite-container img');
        sprites.forEach(sprite => {
            sprite.classList.add('sprite-glitch-heavy');
            setTimeout(() => {
                sprite.classList.remove('sprite-glitch-heavy');
            }, 2000);
        });

        // Dialogue box corruption
        if (this.dialogueBox) {
            this.dialogueBox.classList.add('corruption-intense');
        }

        // Red overlay pulse
        const overlay = document.createElement('div');
        overlay.className = 'insane-overlay';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 1000);
    }

    toggleUI() {
        // Toggle visibility of UI elements during gameplay
        // SOLID: Using StateManager for UI state
        const isHidden = this.state.get('ui.hidden');

        if (!isHidden) {
            // Hide UI elements
            this.dialogueBox.style.opacity = '0';
            this.dialogueBox.style.pointerEvents = 'none';

            const pauseButton = document.getElementById('pause-button');
            if (pauseButton) pauseButton.style.opacity = '0';

            const backlogButton = document.getElementById('backlog-button');
            if (backlogButton) backlogButton.style.opacity = '0';

            const skipButton = document.getElementById('skip-button');
            if (skipButton) skipButton.style.opacity = '0';

            const tetherUI = document.getElementById('tether-ui');
            if (tetherUI && tetherUI.style.display === 'block') {
                tetherUI.style.opacity = '0';
            }

            const notesButton = document.getElementById('notes-button');
            if (notesButton && notesButton.style.display === 'block') {
                notesButton.style.opacity = '0';
            }

            this.state.set('ui.hidden', true);
        } else {
            // Show UI elements
            this.dialogueBox.style.opacity = '1';
            this.dialogueBox.style.pointerEvents = 'auto';

            const pauseButton = document.getElementById('pause-button');
            if (pauseButton) pauseButton.style.opacity = '1';

            const backlogButton = document.getElementById('backlog-button');
            if (backlogButton) backlogButton.style.opacity = '1';

            const skipButton = document.getElementById('skip-button');
            if (skipButton) skipButton.style.opacity = '1';

            const tetherUI = document.getElementById('tether-ui');
            if (tetherUI && tetherUI.style.display === 'block') {
                tetherUI.style.opacity = '1';
            }

            const notesButton = document.getElementById('notes-button');
            if (notesButton && notesButton.style.display === 'block') {
                notesButton.style.opacity = '1';
            }

            this.state.set('ui.hidden', false);
        }
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

        // Always create a new instance to ensure fresh event listeners
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
        localStorage.setItem('skipUnlocked', value.toString());
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
        localStorage.setItem('loopStatus', value);
    }
}

// ========================================
// ROUTE SELECTOR CLASS (UV7 GLOW-UP)
// Interactive toggle-based route selection
// ========================================

class RouteSelector {
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
                const route = option.dataset.route;
                this.selectRoute(route);
            });
        });

        // Haptic feedback on toggle
        this.toggleOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (this.triggerSensoryFeedback) {
                    this.triggerSensoryFeedback('cardSnap', option, 'Route toggle selection');
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
            portrait.style.cursor = 'pointer';
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
        this.difficultyDisplay.textContent = difficulty.toUpperCase();
        this.difficultyDisplay.setAttribute('data-difficulty', difficulty.toLowerCase());
    }

    selectRoute(route) {
        if (this.selectedRoute === route) {
            console.log(`ℹ️ Already on ${route} route`);
            return; // Already selected
        }

        console.log(`🔄 Switching to ${route} route`);
        this.selectedRoute = route;

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
        document.body.setAttribute('data-selected-route', route);

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
