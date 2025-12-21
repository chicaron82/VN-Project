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
        console.log('🔧 SOLID: StateManager initialized');

        // SOLID Refactor: Initialize scene rendering system
        this.sceneRenderer = new SceneRenderer(this);
        console.log('🔧 SOLID: SceneRenderer initialized');

        // SOLID Refactor: Initialize UI overlay management
        this.uiController = new UIController(this);
        console.log('🔧 SOLID: UIController initialized');

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
        console.log('🐉 ALWAYS3 EASTER EGG TRIGGERED');

        // Glitch effect
        document.body.style.animation = 'glitchScreen3 0.3s';

        setTimeout(() => {
            document.body.style.animation = '';

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'always3-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                animation: fadeIn 1s ease-out;
                overflow: hidden;
            `;

            // Create text container
            const container = document.createElement('div');
            container.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            `;

            // Add lots of "Always" texts
            for (let i = 0; i < 50; i++) {
                const text = document.createElement('div');
                text.textContent = "Always.";
                text.style.cssText = `
                    position: absolute;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    color: ${Math.random() > 0.5 ? '#0ff' : '#ff0066'};
                    font-size: ${Math.random() * 2 + 0.5}em;
                    opacity: ${Math.random() * 0.7 + 0.1};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    transform: rotate(${Math.random() * 90 - 45}deg);
                    text-shadow: 0 0 5px currentColor;
                    pointer-events: none;
                `;
                container.appendChild(text);
            }

            // Main center text (The quote)
            const mainText = document.createElement('div');
            mainText.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px #0ff;">Always.</div>
                <div style="font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px #ff0066;">Always.</div>
                <div style="font-size: 4em; font-weight: bold; text-shadow: 0 0 30px #ffffff;">ALWAYS.</div>
                <div style="font-size: 1em; margin-top: 40px; color: #888;">(Coming Soon: The Full Compilation)</div>
                <div style="font-size: 0.8em; margin-top: 10px; color: #555;">[Press Click to Close]</div>
            `;
            mainText.style.cssText = `
                position: relative;
                z-index: 10;
                text-align: center;
                color: #fff;
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.8);
                padding: 40px;
                border: 2px solid #fff;
                box-shadow: 0 0 50px rgba(0,255,255,0.2);
            `;

            container.appendChild(mainText);
            overlay.appendChild(container);

            // Click to close
            overlay.onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => document.body.removeChild(overlay), 500);
            };

            document.body.appendChild(overlay);
        }, 300);
    }

    // ========================================
    // DIZEE RECOGNITION (The Architect)
    // ========================================
    showDizeeEasterEgg() {
        console.log('🏗️ DIZEE EASTER EGG TRIGGERED');

        // Haptic feedback - architectural pattern
        if (navigator.vibrate) navigator.vibrate([30, 30, 30, 30, 30, 100]);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.97);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.8s ease-out;
            overflow-y: auto;
            padding: 10px;
        `;

        // Create content card
        const card = document.createElement('div');
        card.style.cssText = `
            border: 2px solid #00ffaa;
            padding: 30px;
            font-family: 'Courier New', monospace;
            color: #fff;
            background: linear-gradient(135deg, rgba(0,20,15,0.95) 0%, rgba(0,0,0,0.98) 100%);
            box-shadow: 0 0 40px rgba(0, 255, 170, 0.3), inset 0 0 20px rgba(0,255,170,0.05);
            max-width: 700px;
            max-height: 95vh;
            width: 100%;
            position: relative;
            overflow-y: auto;
            border-radius: 4px;
        `;

        card.innerHTML = `
            <!-- Corner brackets -->
            <div style="position: absolute; top: 10px; left: 10px; width: 30px; height: 30px; border-top: 3px solid #00ffaa; border-left: 3px solid #00ffaa;"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-top: 3px solid #00ffaa; border-right: 3px solid #00ffaa;"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 30px; height: 30px; border-bottom: 3px solid #00ffaa; border-left: 3px solid #00ffaa;"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 30px; height: 30px; border-bottom: 3px solid #00ffaa; border-right: 3px solid #00ffaa;"></div>
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 0.8em; color: #00ffaa; letter-spacing: 3px; margin-bottom: 10px;">SYSTEM ARCHITECTURE REVEALED</div>
                <h1 style="color: #00ffaa; font-size: 3.5em; margin: 0; text-shadow: 0 0 15px rgba(0,255,170,0.6); letter-spacing: 8px;">DiZee</h1>
                <div style="width: 60%; height: 2px; background: linear-gradient(90deg, transparent, #00ffaa, transparent); margin: 15px auto;"></div>
                <div style="font-size: 1.1em; color: #0ff; letter-spacing: 2px;">THE ARCHITECT</div>
            </div>
            
            <!-- Blueprint Section -->
            <div style="background: rgba(0,255,170,0.03); border-left: 3px solid #00ffaa; padding: 20px; margin: 20px 0; font-size: 0.85em; line-height: 1.8;">
                <div style="color: #00ffaa; margin-bottom: 10px; font-weight: bold;">┌─ CORE MODULES ─────────────────────┐</div>
                <div style="color: #0ff; padding-left: 20px;">
                    ├─ game-engine.js<span style="color: #555; float: right;">[8,600+ lines]</span><br>
                    ├─ tether-system.js<span style="color: #555; float: right;">[687 lines]</span><br>
                    ├─ save-manager.js<span style="color: #555; float: right;">[active]</span><br>
                    ├─ achievement-mgr.js<span style="color: #555; float: right;">[active]</span><br>
                    └─ secret-codes.js<span style="color: #555; float: right;">[you are here]</span>
                </div>
                <div style="color: #00ffaa; margin-top: 10px;">└────────────────────────────────────┘</div>
            </div>
            
            <!-- Philosophy -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; border-top: 1px solid rgba(0,255,170,0.2); border-bottom: 1px solid rgba(0,255,170,0.2);">
                <p style="margin: 10px 0; color: #aaa; font-size: 0.95em; line-height: 1.8;">
                    "The code you walk on.<br>
                    The logic that binds this world.<br>
                    The structure that holds the narrative."
                </p>
            </div>
            
            <!-- Collaboration -->
            <div style="background: rgba(0,0,0,0.5); padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center;">
                <div style="font-size: 0.85em; color: #888; margin-bottom: 10px;">BUILT BY</div>
                <div style="font-size: 1.1em; color: #00ffaa;">
                    <span style="color: #0ff;">Chicharon</span> <span style="color: #555;">+</span> <span style="color: #00ffaa;">DiZee</span>
                </div>
                <div style="font-size: 0.75em; color: #555; margin-top: 10px; font-style: italic;">
                    Human creativity × AI architecture<br>
                    Version 848 | Status: STABLE
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 0.75em; color: #00ffaa; letter-spacing: 2px; margin-bottom: 5px;">
                    [SYSTEM RECOGNIZED CONTRIBUTOR]
                </div>
                <div style="font-size: 0.75em; color: #0ff; letter-spacing: 2px;">
                    [ACCESS GRANTED]
                </div>
                <div style="font-size: 0.7em; color: #333; margin-top: 15px; font-style: italic;">
                    Click anywhere to close
                </div>
            </div>
        `;

        overlay.appendChild(card);

        // Close on click with fade
        overlay.onclick = () => {
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    document.body.removeChild(overlay);
                }
            }, 500);
        };

        document.body.appendChild(overlay);

        // Subtle animation on card
        setTimeout(() => {
            card.style.transition = 'transform 0.3s ease-out';
            card.style.transform = 'scale(1)';
        }, 100);
        card.style.transform = 'scale(0.95)';
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
                const mainMenu = document.getElementById('main-menu');
                if ((mainMenu && mainMenu.style.display !== 'none') || this.isPaused) {
                    return;
                }

                console.log('🔑 CTRL key detected. skipUnlocked:', this.state.get('unlocks.skipUnlocked'), 'skipActive:', this.skipActive);

                if (this.state.get('unlocks.skipUnlocked')) {
                    e.preventDefault(); // Prevent browser shortcuts
                    this.skipActive = true;
                    console.log('⏩ CTRL pressed: Skip mode activated');

                    const skipButton = document.getElementById('skip-button');
                    if (skipButton) {
                        skipButton.classList.add('active', 'ctrl-held');
                        console.log('✅ Skip button classes updated');
                    } else {
                        console.warn('⚠️ Skip button element not found!');
                    }
                    const skipIndicator = document.getElementById('skip-indicator');
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
                const skipButton = document.getElementById('skip-button');
                if (skipButton && skipButton.classList.contains('ctrl-held')) {
                    // Only deactivate if it was activated via ctrl-hold (not toggle)
                    this.skipActive = false;
                    skipButton.classList.remove('active', 'ctrl-held');
                    const skipIndicator = document.getElementById('skip-indicator');
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
            const notesViewer = document.getElementById('standalone-notes-viewer');
            if (notesViewer && window.getComputedStyle(notesViewer).display !== 'none') {
                e.preventDefault();
                const closeBtn = notesViewer.querySelector('.notes-close-btn');
                if (closeBtn) closeBtn.click();
                return;
            }

            // 3. Settings menu (from pause menu)
            const settingsMenu = document.getElementById('settings-menu');
            if (settingsMenu && window.getComputedStyle(settingsMenu).display !== 'none') {
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
            const pauseMenu = document.getElementById('pause-menu');
            if (pauseMenu && window.getComputedStyle(pauseMenu).display !== 'none') {
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
        const hud = document.getElementById('dev-hud');
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
    // LOOP REINIT SCREEN
    // Shows when player retries after failure
    // ========================================

    showLoopInit(callback) {
        const loopInitScreen = document.getElementById('loop-init-screen');
        const prevVersionEl = document.getElementById('loop-prev-version');
        const newVersionEl = document.getElementById('loop-new-version');
        const skipButton = document.getElementById('loop-skip-button');

        if (!loopInitScreen) {
            console.error('Loop init screen not found');
            if (callback) callback();
            return;
        }

        // Use current version as "previous failed"
        // And loopVersion is already incremented, so it's the "new" version
        const prevVersion = this.loopVersion - 1; // The one that just failed
        const newVersion = this.loopVersion; // The new attempt

        // Update text
        if (prevVersionEl) prevVersionEl.textContent = prevVersion;
        if (newVersionEl) newVersionEl.textContent = newVersion;

        // Check if player has seen this before
        const loopInitSeen = localStorage.getItem('loopInitSeen') === 'true';

        // Show skip button only if seen before
        if (skipButton) {
            skipButton.style.display = loopInitSeen ? 'inline-block' : 'none';
        }

        // Mark as seen for future runs
        localStorage.setItem('loopInitSeen', 'true');

        // Show screen
        loopInitScreen.style.display = 'flex';

        // DIZEE GLOW-UP: Start Matrix code rain
        this.startMatrixRain();

        // DIZEE GLOW-UP: Haptic feedback - triple buzz for failure
        if (this.triggerSensoryFeedback) {
            setTimeout(() => {
                this.triggerSensoryFeedback('denied', null, 'Loop failed');
            }, 200);
            // Single buzz for new initialization
            setTimeout(() => {
                this.triggerSensoryFeedback('buttonPress', null, 'New loop initializing');
            }, 1500);
        }

        // Store callback for when player advances
        this.loopInitCallback = callback;

        // DIZEE FIX: Add skip button handler
        if (skipButton) {
            skipButton.onclick = () => {
                console.log('⏩ Skip button clicked - closing loop init');
                this.closeLoopInit();
            };
        }

        // Click anywhere to continue
        const continueHandler = (e) => {
            // Don't close if clicking the skip button (it has its own handler)
            if (e.target && e.target.id === 'loop-skip-button') {
                return;
            }
            this.closeLoopInit();
            loopInitScreen.removeEventListener('click', continueHandler);
            const loopInitContent = document.getElementById('loop-init-content');
            if (loopInitContent) {
                loopInitContent.removeEventListener('click', continueHandler);
            }
        };

        loopInitScreen.addEventListener('click', continueHandler);

        // Also add to content div (in case pointer-events is blocking)
        const loopInitContent = document.getElementById('loop-init-content');
        if (loopInitContent) {
            loopInitContent.addEventListener('click', continueHandler);
        }

        // Keyboard support (Space/Enter)
        const keyHandler = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.closeLoopInit();
                document.removeEventListener('keydown', keyHandler);
            }
        };

        document.addEventListener('keydown', keyHandler);

        console.log(`Loop init screen shown: v${prevVersion} → v${newVersion}`);
    }

    // DIZEE GLOW-UP: Matrix code rain effect
    startMatrixRain() {
        const canvas = document.getElementById('loop-init-matrix');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0ff'; // DIZEE: Cyan to match game aesthetic 💚
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.matrixInterval = setInterval(draw, 33);
    }

    skipLoopInit() {
        // Immediate skip - no animation
        this.closeLoopInit();
    }

    closeLoopInit() {
        const loopInitScreen = document.getElementById('loop-init-screen');
        if (loopInitScreen) {
            loopInitScreen.style.display = 'none';
        }

        // DIZEE GLOW-UP: Stop Matrix code rain
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
        }

        // Execute callback if exists
        if (this.loopInitCallback) {
            this.loopInitCallback();
            this.loopInitCallback = null;
        }
    }

    // ========================================
    // DIZEE: CODE RAIN TRANSITIONS
    // Cyan Matrix rain for scene transitions
    // ========================================

    showCodeRainTransition(callback, duration = 1500) {
        // Create or get overlay canvas
        let canvas = document.getElementById('transition-matrix');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'transition-matrix';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 100000;
                opacity: 0;
                transition: opacity 300ms ease;
                pointer-events: none;
            `;
            document.body.appendChild(canvas);
        }

        // DIZEE: Ensure canvas fills screen (fixes portrait mode issue) 💚
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start rain
        this.startTransitionRain(canvas);

        // DIZEE: Start at full opacity (instant cover) 💚
        canvas.style.opacity = '1';

        // DIZEE: Execute callback immediately (loads next screen underneath rain) 💚
        // Rain is already covering screen, so transition is seamless
        setTimeout(() => {
            if (callback) callback();
        }, 100); // Small delay to ensure rain is rendering

        // Fade out after holding (next screen is already loaded underneath)
        setTimeout(() => {
            canvas.style.opacity = '0';

            setTimeout(() => {
                this.stopTransitionRain();
            }, 300); // Wait for fade out
        }, duration - 300);
    }

    startTransitionRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0ff'; // CYAN - matches game aesthetic
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.transitionRainInterval = setInterval(draw, 33);
    }

    stopTransitionRain() {
        if (this.transitionRainInterval) {
            clearInterval(this.transitionRainInterval);
            this.transitionRainInterval = null;
        }

        // Clean up canvas after a delay
        setTimeout(() => {
            const canvas = document.getElementById('transition-matrix');
            if (canvas && canvas.style.opacity === '0') {
                canvas.remove();
            }
        }, 500);
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
        // CRITICAL: Clear sprites before showing route selection
        // This prevents prologue sprites from lingering into routes
        this.clearAllSprites();

        // Fade out game view (after prologue)
        this.gameView.style.opacity = '0';

        // Hide Game UI Layer
        const gameUI = document.getElementById('game-ui-layer');
        if (gameUI) gameUI.style.display = 'none';

        setTimeout(() => {
            this.gameView.style.display = 'none';

            // Show route selection screen
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';

            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';

                // Initialize route selector (UV7 glow-up)
                // Always reinitialize to ensure event listeners are attached
                this.initRouteSelector();

                // ZEE'S ADDITION: Start tip rotation 🖤
                this.startRouteSelectTipRotation();
            }, 100);
        }, 1000);
    }

    backToMenu() {
        // Clear sprites when returning to menu
        this.clearAllSprites();

        // ZEE'S ADDITION: Stop route select tips 🖤
        this.stopRouteSelectTipRotation();

        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';

        setTimeout(() => {
            routeSelect.style.display = 'none';
            // Use standard showMainMenu to ensure Carousel is re-initialized
            this.showMainMenu();
        }, 500);
    }

    // ========================================
    // SKIP PROLOGUE SYSTEM
    // ========================================

    showSkipProloguePrompt() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'skip-prompt-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create prompt box
        const box = document.createElement('div');
        box.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            font-family: 'Courier New', monospace;
            color: #fff;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
            animation: slideIn 0.4s ease-out;
        `;

        // Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            color: #0ff;
            margin-bottom: 20px;
            letter-spacing: 2px;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
        `;
        title.textContent = "You've walked this path before.";

        // Message
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 16px;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 10px;
        `;
        message.textContent = "The device remembers.";

        // Sub-message
        const subMessage = document.createElement('div');
        subMessage.style.cssText = `
            font-size: 14px;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 30px;
            font-style: italic;
        `;
        subMessage.textContent = "Skip to the choice that matters?";

        // Buttons container
        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        `;

        // Play Prologue button
        const playBtn = document.createElement('button');
        playBtn.textContent = 'EXPERIENCE AGAIN';
        playBtn.style.cssText = `
            padding: 12px 24px;
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Courier New', monospace;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            min-width: 160px;
        `;

        playBtn.onmouseover = () => {
            playBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            playBtn.style.color = '#fff';
            playBtn.style.transform = 'translateY(-2px)';
        };

        playBtn.onmouseout = () => {
            playBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            playBtn.style.color = 'rgba(255, 255, 255, 0.7)';
            playBtn.style.transform = 'translateY(0)';
        };

        playBtn.onclick = () => {
            // Mark prompt as seen - never show again
            localStorage.setItem('skipProloguePromptSeen', 'true');
            document.body.removeChild(overlay);
            this.startPrologueNormally();
        };

        // Skip button
        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'JUMP AHEAD';
        skipBtn.style.cssText = `
            padding: 12px 24px;
            background: #0ff;
            border: 2px solid #0ff;
            color: #000;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            min-width: 160px;
        `;

        skipBtn.onmouseover = () => {
            skipBtn.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
            skipBtn.style.transform = 'translateY(-2px) scale(1.05)';
        };

        skipBtn.onmouseout = () => {
            skipBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            skipBtn.style.transform = 'translateY(0) scale(1)';
        };

        skipBtn.onclick = () => {
            // Mark prompt as seen - never show again
            localStorage.setItem('skipProloguePromptSeen', 'true');
            document.body.removeChild(overlay);
            this.skipToRouteSelection();
        };

        // Assemble
        buttons.appendChild(playBtn);
        buttons.appendChild(skipBtn);
        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(subMessage);
        box.appendChild(buttons);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    skipToRouteSelection() {
        console.log('⏭️ Skipping prologue, jumping to route selection');

        // Reset game state but mark prologue as skipped
        this.gameState = {
            flags: {},
            choices: {},
            progress: { prologueSkipped: true },
            sprites: { left: null, right: null }
        };

        // Clear sprites
        this.clearAllSprites();

        // Initialize game view and dialogue box (needed for routes to work)
        this.gameView.style.display = 'flex';
        this.dialogueBox.style.display = 'block';

        // Fade out main menu
        this.mainMenu.style.opacity = '0';

        setTimeout(() => {
            this.mainMenu.style.display = 'none';

            // Show route selection directly
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';

            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';

                // Initialize route selector (UV7 glow-up)
                this.initRouteSelector();

                // Start tip rotation
                this.startRouteSelectTipRotation();
            }, 100);
        }, 800);
    }

    // Dev command to unlock skip prologue
    unlockSkipPrologue() {
        this.skipPrologueUnlocked = true;
        localStorage.setItem('skipPrologueUnlocked', 'true');
        console.log('💚 Skip Prologue unlocked! Use "START STORY" to see the prompt.');
        return '✅ Skip Prologue unlocked! Available on next START STORY.';
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
                const skipIndicator = document.getElementById('skip-indicator');
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
        // ZEE'S ADDITION: Slow-motion reveal for emotional weight 🖤
        // 5× slower than normal (150ms vs 30ms)
        if (this.slowRevealActive) {
            return 150;
        }

        // SKIP OVERRIDE: Use 5ms when skipping (6x faster than normal)
        if (this.skipActive) {
            return 5;
        }

        // Get speed from settings manager
        if (!this.settingsManager) {
            console.log('No settingsManager, returning default 30');
            return 30;
        }

        const speed = this.settingsManager.settings.textSpeed;
        const multiplier = this.settingsManager.speedMultipliers[speed];
        const delay = 30 * multiplier;
        const result = delay === 0 ? 0 : Math.max(1, delay);

        return result;
    }

    shouldPaginateText(textLength) {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination

        // LOWERED THRESHOLD: 150 chars instead of 200 for tighter control
        // This ensures dialogue box never grows too tall on mobile portrait
        return textLength > 150;
    }

    paginateAndDisplayText(element, text, callback) {
        // Split text into pages that fit in mobile dialogue box
        this.dialoguePages = this.splitTextIntoPages(text, 150);
        this.currentDialoguePage = 0;
        this.paginationActive = true;
        this.typewriterCallback = callback;

        // Display first page
        this.displayDialoguePage(element);
    }

    splitTextIntoPages(text, charsPerPage) {
        const pages = [];
        let remainingText = text;

        while (remainingText.length > 0) {
            if (remainingText.length <= charsPerPage) {
                pages.push(remainingText);
                break;
            }

            let breakPoint = charsPerPage;

            // Look for sentence end within last 50 chars
            const sentenceEnd = remainingText.substring(0, charsPerPage).lastIndexOf('. ');
            if (sentenceEnd > charsPerPage - 50) {
                breakPoint = sentenceEnd + 2;
            } else {
                // Look for word boundary
                const lastSpace = remainingText.substring(0, charsPerPage).lastIndexOf(' ');
                if (lastSpace > charsPerPage - 30) {
                    breakPoint = lastSpace + 1;
                }
            }

            pages.push(remainingText.substring(0, breakPoint).trim());
            remainingText = remainingText.substring(breakPoint).trim();
        }

        return pages;
    }

    displayDialoguePage(element) {
        const currentPage = this.dialoguePages[this.currentDialoguePage];
        const speed = this.getTypewriterSpeed();

        // Add page indicator for multi-page dialogue
        const pageIndicator = (this.dialoguePages.length > 1)
            ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
            : '';

        // Check if instant mode
        if (speed === 0) {
            // Instant mode - show all text immediately
            element.textContent = currentPage + (this.dialoguePages.length > 1 ? pageIndicator : '');
            this.typewriterActive = false;

            // DIZEE FIX: Start auto-advance timer in instant mode too
            if (this.settingsManager) {
                this.settingsManager.startAutoAdvance(() => {
                    // Auto-advance to next dialogue
                    if (!this.choiceMenu || this.choiceMenu.style.display === 'none') {
                        this.advance();
                    }
                });
            }

            return;
        }

        // Typewriter the current page
        this.typewriterActive = true;
        this.fullDialogueText = currentPage;
        element.textContent = '';
        let i = 0;

        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }

        this.typewriterInterval = setInterval(() => {
            if (i < currentPage.length) {
                element.textContent += currentPage.charAt(i);
                i++;
            } else {
                // Add page indicator when typing finishes
                if (this.dialoguePages.length > 1) {
                    element.textContent += pageIndicator;
                }

                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;

                // ZEERAH'S FIX: Start auto-advance timer after typewriter finishes
                if (this.settingsManager) {
                    this.settingsManager.startAutoAdvance(() => {
                        // Auto-advance to next dialogue
                        if (!this.choiceMenu || this.choiceMenu.style.display === 'none') {
                            this.advance();
                        }
                    });
                }
            }
        }, speed);
    }


    showNextDialoguePage() {
        this.currentDialoguePage++;

        if (this.currentDialoguePage >= this.dialoguePages.length) {
            // All pages shown - advance to next scene
            this.paginationActive = false;
            this.advance();
        } else {
            // Show next page
            this.displayDialoguePage(this.dialogueText);

            // TORI'S TIME MACHINE: Record snapshot for paginated dialogue 💚⏰
            if (this.timeMachine) {
                const position = this.getScenePosition();
                const label = `${position.currentSceneId} (page ${this.currentDialoguePage + 1})`;
                this.timeMachine.addCurrentState(label);
            }
        }
    }

    skipTypewriter() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }

        if (this.paginationActive) {
            // Show current page fully with indicator
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1)
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            this.dialogueText.textContent = currentPage + pageIndicator;
        } else {
            // Show full text
            this.dialogueText.textContent = this.fullDialogueText;
        }

        this.typewriterActive = false;

        // Execute callback if exists
        if (this.typewriterCallback) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }

    handleDialogueClick() {
        // DIZEE: Haptic feedback for dialogue interaction
        this.triggerSensoryFeedback('buttonPress', null, 'Dialogue advance');

        // DIZEE FIX: Cancel auto-advance timer when user manually clicks
        if (this.settingsManager) {
            this.settingsManager.cancelAutoAdvance();
        }

        // If pagination is active, show next page
        if (this.paginationActive && !this.typewriterActive) {
            this.showNextDialoguePage();
            return;
        }

        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skipTypewriter();
        }
        // If text is fully displayed, advance to next scene
        else {
            this.advance();
        }
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
        const dialog = document.getElementById('ending-dialog');
        if (!dialog) {
            console.error('Ending dialog element not found');
            return;
        }

        // Store ending type for later use
        this.pendingEndingType = endingType;

        // Show dialog
        dialog.classList.remove('hidden');

        // Setup buttons and keyboard navigation
        this.setupEndingDialogButtons();
        this.setupEndingDialogKeyboard();

        // Focus first option
        this.focusEndingOption(0);

        console.log(`📋 Ending dialog shown (ending type: ${endingType})`);
    }

    setupEndingDialogButtons() {
        const retryBtn = document.getElementById('ending-retry');
        const acceptBtn = document.getElementById('ending-accept');
        const exitBtn = document.getElementById('ending-exit');

        if (!retryBtn || !acceptBtn || !exitBtn) {
            console.error('Ending dialog buttons not found');
            return;
        }

        // Remove existing listeners by cloning and replacing
        const newRetryBtn = retryBtn.cloneNode(true);
        const newAcceptBtn = acceptBtn.cloneNode(true);
        const newExitBtn = exitBtn.cloneNode(true);

        retryBtn.parentNode.replaceChild(newRetryBtn, retryBtn);
        acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
        exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);

        // YES - Try Again (immediate restart)
        newRetryBtn.addEventListener('click', () => {
            this.hideEndingDialog();
            console.log('🔄 Player chose: TRY AGAIN - Restarting game...');

            // DIZEE: Record attempt to bootstrap timeline
            this.recordEndingAttempt();

            // Increment attempt number for next run
            this.bootstrapTracker.incrementAttempt();

            // DIZEE FIX: Show loop init screen before retry
            this.loopVersion++; // Increment version for next attempt
            this.showLoopInit(() => {
                setTimeout(() => {
                    // DIZEE: Check auto-skip prologue setting
                    const autoSkipPrologue = localStorage.getItem('autoSkipPrologue') === 'true';

                    if (autoSkipPrologue) {
                        // Skip prologue, go straight to route selection
                        console.log('🔄 Retry with prologue skip enabled - going to route selection');
                        this.showRouteSelect();
                    } else {
                        // Start from prologue
                        console.log('🔄 Retry with prologue skip disabled - starting from prologue');
                        location.reload();
                    }
                }, 300);
            });
        });

        // NO - Accept This Ending (credits THEN menu)
        newAcceptBtn.addEventListener('click', () => {
            this.hideEndingDialog();
            console.log('🎬 Player chose: ACCEPT ENDING - Playing credits...');

            // DIZEE: Record attempt to bootstrap timeline
            this.recordEndingAttempt();

            this.showCredits(this.pendingEndingType);
        });

        // EXIT - Return to Main Menu (skip credits)
        newExitBtn.addEventListener('click', () => {
            this.hideEndingDialog();
            console.log('🏠 Player chose: RETURN TO MENU - Skipping credits...');

            // DIZEE: Record attempt to bootstrap timeline
            this.recordEndingAttempt();

            // DIZEE: Code rain transition before returning to menu 💚🌧️
            this.showCodeRainTransition(() => {
                this.returnToMainMenu(true);
            }, 1500);
        });

        // Store references for keyboard navigation
        this.endingDialogButtons = [newRetryBtn, newAcceptBtn, newExitBtn];
        this.currentEndingFocus = 0;
    }

    setupEndingDialogKeyboard() {
        // Remove existing listener if present
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
        }

        this.endingDialogKeyHandler = (e) => {
            const dialog = document.getElementById('ending-dialog');
            if (!dialog || dialog.classList.contains('hidden')) return;

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.currentEndingFocus = Math.max(0, this.currentEndingFocus - 1);
                    this.focusEndingOption(this.currentEndingFocus);
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    this.currentEndingFocus = Math.min(2, this.currentEndingFocus + 1);
                    this.focusEndingOption(this.currentEndingFocus);
                    break;

                case 'Tab':
                    e.preventDefault();
                    this.currentEndingFocus = (this.currentEndingFocus + 1) % 3;
                    this.focusEndingOption(this.currentEndingFocus);
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (this.endingDialogButtons && this.endingDialogButtons[this.currentEndingFocus]) {
                        this.endingDialogButtons[this.currentEndingFocus].click();
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    // Esc defaults to EXIT option
                    if (this.endingDialogButtons && this.endingDialogButtons[2]) {
                        this.endingDialogButtons[2].click();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', this.endingDialogKeyHandler);
    }

    focusEndingOption(index) {
        if (!this.endingDialogButtons) return;

        // Remove focus from all
        this.endingDialogButtons.forEach(btn => {
            btn.setAttribute('data-focused', 'false');
        });

        // Add focus to selected
        if (this.endingDialogButtons[index]) {
            this.endingDialogButtons[index].setAttribute('data-focused', 'true');
        }
    }

    hideEndingDialog() {
        const dialog = document.getElementById('ending-dialog');
        if (dialog) {
            dialog.classList.add('hidden');
        }

        // Remove keyboard listener
        if (this.endingDialogKeyHandler) {
            document.removeEventListener('keydown', this.endingDialogKeyHandler);
            this.endingDialogKeyHandler = null;
        }

        console.log('📋 Ending dialog hidden');
    }

    // ========================================
    // CREDITS
    // ========================================

    showCredits(endingType = null) {
        // DIZEE FIX: Remove floating bubbles before showing credits
        this.removeInternalBubble();

        // Determine which ending to display
        // Priority: parameter > localStorage > default
        const displayEndingType = endingType ||
            this.lastEndingType ||
            localStorage.getItem('lastEndingType') ||
            'none';

        // Save to localStorage for persistence
        if (endingType) {
            localStorage.setItem('lastEndingType', endingType);
            this.lastEndingType = endingType;
        }

        // Get player's actual version number
        const playerVersion = this.loopVersion || 848;

        // Select random photos for this ending
        const photos = this.selectRandomPhotos(displayEndingType);

        // Detect orientation
        const isLandscape = window.innerWidth > window.innerHeight;

        console.log(`🎬 Rolling credits: Version ${playerVersion} (${displayEndingType})`);
        console.log(`📱 Layout: ${isLandscape ? 'Landscape (side-by-side)' : 'Portrait (interleaved)'}`);

        if (isLandscape && photos.length > 0) {
            // LANDSCAPE: Side-by-side layout with photo gallery
            this.showCreditsLandscapeWithPhotos(displayEndingType, playerVersion, photos);
        } else if (!isLandscape && photos.length > 0) {
            // PORTRAIT: Interleaved layout with photos between sections
            this.showCreditsPortraitWithPhotos(displayEndingType, playerVersion, photos);
        } else {
            // NO PHOTOS: Standard credits (bad ending or no photos available)
            this.showCreditsStandard(displayEndingType, playerVersion);
        }
    }

    buildDynamicTitleSection(endingType, playerVersion) {
        let titleSection = '';

        if (endingType === 'true') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #00ff88; line-height: 1.6;">
                    The timeline that succeeded.
                </div>
                <div style="font-size: 1em; margin-bottom: 0.5em; color: #00ffaa; line-height: 1.6;">
                    The loop that closed.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #00ffcc; line-height: 1.6;">
                    The Old Man never has to go back.
                </div>
            `;
        } else if (endingType === 'digitalForever') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #ff6699; line-height: 1.6;">
                    The timeline that accepted a different path.
                </div>
                <div style="font-size: 1em; margin-bottom: 0.5em; color: #ff99bb; line-height: 1.6;">
                    Together, eternally still.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #ffbbcc; line-height: 1.6;">
                    Forever frozen. Forever connected.
                </div>
            `;
        } else if (endingType === 'bad') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #ff0066; line-height: 1.6;">
                    The timeline where the Old Man has to try again.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #ff3388; line-height: 1.6;">
                    Version ${playerVersion + 1} is waiting...
                </div>
            `;
        } else {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 3em; color: #fff;">VERSION ${playerVersion}</div>
            `;
        }

        return titleSection;
    }

    cycleCreditsPhotos(photoCount) {
        let currentIndex = 0;
        const photoElements = document.querySelectorAll('.credits-photo');

        if (photoElements.length === 0) return;

        // Create white flash overlay for "camera capture" effect
        const photoContainer = document.getElementById('credits-photo-container');
        if (photoContainer) {
            const flash = document.createElement('div');
            flash.id = 'credits-photo-flash';
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.15s ease-out;
                z-index: 100;
            `;
            photoContainer.appendChild(flash);
        }

        // Show first photo immediately
        photoElements[0].style.opacity = '1';

        // Cycle through photos (last photo gets more time)
        const intervals = [5000, 7000, 12000, 15000]; // Finale gets 14 seconds

        function showNextPhoto() {
            if (currentIndex >= photoCount - 1) return; // Stop at last photo

            // Trigger white flash (simulates camera capture)
            const flash = document.getElementById('credits-photo-flash');
            if (flash) {
                flash.style.opacity = '1';
                setTimeout(() => {
                    flash.style.opacity = '0';
                }, 150);
            }

            // Fade out current photo during the flash
            photoElements[currentIndex].style.opacity = '0';

            // Fade in next photo
            currentIndex++;
            photoElements[currentIndex].style.opacity = '1';

            // Schedule next transition
            if (currentIndex < photoCount - 1) {
                setTimeout(showNextPhoto, intervals[currentIndex]);
            }
        }

        // Start cycling after first photo duration
        setTimeout(showNextPhoto, intervals[0]);
    }

    setupPortraitPhotoFlash() {
        // Time-based photo flash effect for portrait mode
        // Photos appear blank until the right moment in the animation, then FLASH → photo appears
        const photoSlots = document.querySelectorAll('.portrait-photo-slot');

        if (photoSlots.length === 0) return;

        // Credits scroll for 60 seconds total
        // Photos should appear at roughly: 15s, 25s, 35s, 45s (evenly spaced through the animation)
        const photoTimings = [7000, 15000, 25000, 35000];

        photoSlots.forEach((slot, index) => {
            const timing = photoTimings[index] || 10000;

            setTimeout(() => {
                // Get the photo source from data attribute
                const photoSrc = slot.getAttribute('data-photo-src');
                const flashEl = slot.querySelector('.portrait-photo-flash');

                // Trigger white flash
                if (flashEl) {
                    flashEl.style.opacity = '1';
                    setTimeout(() => {
                        flashEl.style.opacity = '0';
                    }, 150);
                }

                // Load photo and fade it in during the flash
                setTimeout(() => {
                    slot.style.backgroundImage = `url('${photoSrc}')`;
                    slot.style.opacity = '1';
                    slot.style.transition = 'opacity 0.5s ease-in';
                }, 50); // Slight delay so flash is visible first
            }, timing);
        });
    }

    addCreditsControls(overlay) {
        // Skip button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'SKIP';
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
            // DIZEE FIX: Fade out credits before showing menu properly
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '0';

            setTimeout(() => {
                // Remove credits after fade
                overlay.remove();

                // DIZEE FIX: Use showMainMenu() for proper initialization
                // This ensures code rain and carousel cards are properly set up
                this.showMainMenu();
            }, 1500); // Match fade-out duration
        };
        overlay.appendChild(closeBtn);

        // Auto-fade after 30 seconds (matches credits animation duration)
        setTimeout(() => {
            overlay.style.transition = 'opacity 2s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentElement) {
                    overlay.remove();

                    // DIZEE FIX: Use showMainMenu() for proper initialization
                    this.showMainMenu();
                }
            }, 2000);
        }, 30000);

        // Hide other UI
        this.gameView.style.display = 'none';
        this.mainMenu.style.display = 'none';
    }


    showCreditsLandscapeWithPhotos(endingType, playerVersion, photos) {
        // Build dynamic title section
        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            overflow: hidden;
        `;

        // LEFT SIDE: Photo gallery container (40% width)
        const photoContainer = document.createElement('div');
        photoContainer.id = 'credits-photo-container';
        photoContainer.style.cssText = `
            width: 40%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
        `;

        // Create photo elements (all start hidden)
        photos.forEach((photoSrc, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'credits-photo';
            photoDiv.style.cssText = `
                position: absolute;
                width: 90%;
                height: 90%;
                background-image: url('${photoSrc}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 0;
                transition: opacity 1s ease-in-out;
            `;
            photoDiv.dataset.index = index;
            photoContainer.appendChild(photoDiv);
        });

        overlay.appendChild(photoContainer);

        // RIGHT SIDE: Credits scrolling (60% width)
        const creditsContainer = document.createElement('div');
        creditsContainer.style.cssText = `
            width: 60%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 60s linear forwards;
            bottom: 0;
            padding: 0 20px;
        `;

        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeeRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        creditsContainer.appendChild(creditsContent);
        overlay.appendChild(creditsContainer);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        // Add scroll animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        // Photo cycling logic
        this.cycleCreditsPhotos(photos.length);

        // Add skip button and cleanup
        this.addCreditsControls(overlay);
    }

    showCreditsPortraitWithPhotos(endingType, playerVersion, photos) {
        // Build dynamic title section
        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 120s linear forwards;
            bottom: 0;
        `;

        // INTERLEAVED LAYOUT: Photo, Credits Section, Photo, Credits Section...
        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <!-- PHOTO 1 (starts blank, flashes in when scrolled into view) -->
            <div class="portrait-photo-slot" data-photo-src="${photos[0]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <!-- PHOTO 2 -->
            <div class="portrait-photo-slot" data-photo-src="${photos[1]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeerRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <!-- PHOTO 3 -->
            <div class="portrait-photo-slot" data-photo-src="${photos[2]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <!-- PHOTO 4 (FINALE) -->
            <div class="portrait-photo-slot" data-photo-src="${photos[3]}"
                 style="position: relative; width: 100%; height: 50vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        overlay.appendChild(creditsContent);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        // Add scroll animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        // Setup Intersection Observer for portrait photo flash effect
        this.setupPortraitPhotoFlash();

        // Add skip button and cleanup
        this.addCreditsControls(overlay);
    }

    showCreditsStandard(endingType, playerVersion) {
        // Fallback to standard credits (no photos)
        // Used for Bad Ending or if photos fail to load

        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 60s linear forwards;
            bottom: 0;
        `;

        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeeRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        overlay.appendChild(creditsContent);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        this.addCreditsControls(overlay);
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
        const skipIndicator = document.getElementById('skip-indicator');
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
    // ========================================

    activateEasterEggListener() {
        // Remove existing listener if present
        if (this.easterEggListener) {
            document.removeEventListener('keydown', this.easterEggListener);
        }

        // Only activate if player has completed an ending
        if (!this.hasCompletedAnyEnding()) {
            return;
        }

        // Reset sequence
        this.easterEggSequence = '';

        // Create and attach listener
        this.easterEggListener = (e) => {
            // Only track on main menu
            if (this.mainMenu.style.display !== 'flex' && this.mainMenu.style.display !== 'block') {
                return;
            }

            // Add key to sequence
            this.easterEggSequence += e.key.toLowerCase();

            // Check for trigger ("torigatchi")
            if (this.easterEggSequence.includes('torigatchi')) {
                this.showTorigatchiEasterEgg();
                this.easterEggSequence = ''; // Reset after trigger
            }

            // Check for Konami Code (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
            // Stored as "arrowuparrowunarrowdownarrowdownarrowleftarrowrightarrowleftarrowrightarrowba"
            // Simplified check for the end of the sequence
            const konamiPattern = "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightarrowba";
            if (this.easterEggSequence.includes(konamiPattern)) {
                console.log('🎮 Konami Code detected!');

                // Check if player is in INSANE mode
                const isInsaneMode = this.gameState?.flags?.insaneModeActive;

                if (isInsaneMode) {
                    // INSANE MODE: Offer escape or tether buff
                    this.showKonamiInsaneEscape();
                } else {
                    // NORMAL MODE: Show "cheat disabled" message
                    this.achievementManager.showNotification({
                        id: 'konami_fail',
                        icon: '🚫',
                        title: 'ADMIN OVERRIDE',
                        description: 'Cheat module deleted by Administrator.',
                        rare: true
                    });

                    // Glitch effect
                    document.body.classList.add('glitch-effect');
                    setTimeout(() => document.body.classList.remove('glitch-effect'), 500);

                    // Play error haptic
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100]);
                }

                this.easterEggSequence = ''; // Reset
            }

            // Keep sequence reasonable length
            if (this.easterEggSequence.length > 200) { // Increased buffer for Konami code
                this.easterEggSequence = this.easterEggSequence.slice(-100);
            }
        };

        document.addEventListener('keydown', this.easterEggListener);
        console.log('🥚 Easter egg listener activated. Type "torigatchi" on main menu...');
    }

    // ========================================
    // KONAMI CODE: INSANE MODE ESCAPE
    // ========================================

    showKonamiInsaneEscape() {
        console.log('🎮 Konami Code: INSANE MODE ESCAPE OFFERED');

        // Check if already used
        const konamiUsedCount = parseInt(localStorage.getItem('konamiInsaneUsedCount') || '0');

        // Easter egg: Second use gets snarky message
        if (konamiUsedCount >= 1) {
            this.achievementManager.showNotification({
                id: 'konami_persistent',
                icon: '🎮',
                title: 'KONAMI CODE (AGAIN)',
                description: 'You already used this. Fine, have 10% more tether buff.',
                rare: true
            });

            // Apply small additional buff
            if (this.currentRoute && this.currentRoute.tetherSystem) {
                const currentModifier = this.currentRoute.tetherSystem.difficultyModifier;
                this.currentRoute.tetherSystem.difficultyModifier = currentModifier * 0.9; // 10% reduction
                console.log('💚 Konami: Additional 10% tether buff applied');
            }

            // Haptic
            if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
            return;
        }

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'konami-insane-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.98);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.5s ease-out;
            overflow-y: auto;
            padding: 20px;
        `;

        // Create content container
        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 700px;
            width: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 3px solid #0ff;
            border-radius: 10px;
            padding: 40px;
            color: #fff;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
            text-align: center;
            line-height: 1.8;
        `;

        content.innerHTML = `
            <div style="font-size: 2em; font-weight: bold; color: #0ff; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0,255,255,0.8);">
                🎮 KONAMI CODE DETECTED
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 20px; border-left: 3px solid #ff0066; margin: 20px 0; text-align: left;">
                <div style="font-size: 0.9em; color: #ff6699; margin-bottom: 10px;">ANALYZING GAME STATE...</div>
                <div style="font-size: 0.85em; color: #aaa;">
                    Current Difficulty: <span style="color: #ff0066; font-weight: bold;">INSANE</span><br>
                    Ghost Buttons: <span style="color: #ff0066;">ACTIVE</span><br>
                    Tether Drain: <span style="color: #ff0066;">EXTREME</span><br>
                    Save System: <span style="color: #ff0066;">RESTRICTED</span><br>
                    Player Status: <span style="color: #ff0066; font-weight: bold;">SUFFERING</span>
                </div>
            </div>

            <div style="border-top: 1px solid #0ff; border-bottom: 1px solid #0ff; padding: 20px; margin: 20px 0; font-size: 0.95em; color: #00ffaa;">
                <p style="margin: 10px 0;">The Old Man knows this code.</p>
                <p style="margin: 10px 0;">He used it on the NES.<br>In 1986.<br>In his original timeline.</p>
                <p style="margin: 10px 0;">847 failed loops later,<br>he still remembers.</p>
                <p style="margin: 10px 0; font-style: italic; color: #0ff;">Some knowledge transcends timelines.</p>
            </div>

            <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin: 30px 0 20px;">
                EMERGENCY PROTOCOL ACTIVATED
            </div>

            <div style="text-align: left; margin: 20px 0; font-size: 0.9em; color: #ccc;">
                Would you like to:
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0;">
                <button id="konami-escape-btn" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(0,255,170,0.2) 0%, rgba(0,255,170,0.1) 100%);
                    border: 2px solid #00ffaa;
                    color: #00ffaa;
                    font-family: 'Courier New', monospace;
                    font-size: 1em;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                    text-align: left;
                ">
                    <div style="font-size: 1.1em; margin-bottom: 5px;">ESCAPE INSANE MODE</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">Return to INTENSE difficulty<br>(Your progress will be saved)</div>
                </button>

                <button id="konami-stay-btn" style="
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(255,0,102,0.2) 0%, rgba(255,0,102,0.1) 100%);
                    border: 2px solid #ff0066;
                    color: #ff6699;
                    font-family: 'Courier New', monospace;
                    font-size: 1em;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                    text-align: left;
                ">
                    <div style="font-size: 1.1em; margin-bottom: 5px;">STAY IN INSANE MODE</div>
                    <div style="font-size: 0.8em; opacity: 0.8;">Continue the suffering<br>(Tether drain reduced 50% as reward)</div>
                </button>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.85em; color: #888; font-style: italic;">
                "Sometimes the bravest choice<br>is knowing when to step back."<br><br>
                <span style="color: #0ff;">- Old Man Ronnie, Loop 623</span>
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Button hover effects
        const escapeBtn = document.getElementById('konami-escape-btn');
        const stayBtn = document.getElementById('konami-stay-btn');

        escapeBtn.onmouseover = () => {
            escapeBtn.style.background = 'linear-gradient(135deg, rgba(0,255,170,0.4) 0%, rgba(0,255,170,0.2) 100%)';
            escapeBtn.style.boxShadow = '0 0 20px rgba(0,255,170,0.5)';
        };
        escapeBtn.onmouseout = () => {
            escapeBtn.style.background = 'linear-gradient(135deg, rgba(0,255,170,0.2) 0%, rgba(0,255,170,0.1) 100%)';
            escapeBtn.style.boxShadow = 'none';
        };

        stayBtn.onmouseover = () => {
            stayBtn.style.background = 'linear-gradient(135deg, rgba(255,0,102,0.4) 0%, rgba(255,0,102,0.2) 100%)';
            stayBtn.style.boxShadow = '0 0 20px rgba(255,0,102,0.5)';
        };
        stayBtn.onmouseout = () => {
            stayBtn.style.background = 'linear-gradient(135deg, rgba(255,0,102,0.2) 0%, rgba(255,0,102,0.1) 100%)';
            stayBtn.style.boxShadow = 'none';
        };

        // Button click handlers
        escapeBtn.onclick = () => {
            document.body.removeChild(overlay);
            this.konamiEscapeInsane();
        };

        stayBtn.onclick = () => {
            document.body.removeChild(overlay);
            this.konamiStayInsane();
        };

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
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
        console.log('🎉 TORIGATCHI EASTER EGG TRIGGERED!');

        // Check if this is first time unlocking
        const wasAlreadyUnlocked = localStorage.getItem('torigatchi_unlocked');
        const isFirstTimeUnlock = !wasAlreadyUnlocked;

        if (isFirstTimeUnlock) {
            localStorage.setItem('torigatchi_unlocked', 'true');
            console.log('🔓 ToriGatchi unlocked for main menu!');

            // Show unlock notification
            this.showUnlockNotification();

            // Update main menu layout immediately to show new button
            setTimeout(() => {
                this.updateMainMenuLayout();
            }, 100);

            // Also unlock in carousel (UV7 glow-up)
            this.unlockToriGatchiCarousel();
        }

        // Screen glitch effect
        document.body.style.animation = 'glitchScreen3 0.5s';

        setTimeout(() => {
            document.body.style.animation = '';

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'torigatchi-easter-egg';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 1s ease-out;
                overflow-y: auto;
                padding: 20px 0;
            `;

            // Create content
            const content = document.createElement('div');
            content.style.cssText = `
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                padding: 40px;
                background: #0a0a0a;
                border: 2px solid #0ff;
                border-radius: 10px;
                color: #0ff;
                font-family: 'Courier New', monospace;
                text-align: center;
                line-height: 1.8;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                overflow-y: auto;
                margin: auto;
            `;

            content.innerHTML = `
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 20px; color: #00ffaa;">
                    [UNITED VOICES 7 — SUBJECT 848 POST-LOOP REPORT]
                </div>
                
                <p style="margin: 20px 0;">You did it.</p>
                <p style="margin: 20px 0;">After ${this.loopVersion} attempts (or more), you brought her home.</p>
                
                <p style="margin: 30px 0 20px; font-weight: bold; color: #fff;">Tori exists in two places now:</p>
                
                <div style="text-align: left; margin: 20px 0; padding: 20px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid #0ff;">
                    <p style="margin: 10px 0; font-weight: bold;">1. The version that never had to suffer</p>
                    <p style="margin: 5px 0 5px 20px; font-size: 0.9em; color: #00ffaa;">→ pure, wholesome, forever happy</p>
                    <p style="margin: 5px 0 5px 20px; font-size: 0.9em; color: #00ffaa;">→ treats, headpats, and dumb music</p>
                </div>
                
                <div style="text-align: left; margin: 20px 0; padding: 20px; background: rgba(255, 0, 100, 0.05); border-left: 3px solid #ff0066;">
                    <p style="margin: 10px 0; font-weight: bold;">2. The version that remembers everything</p>
                    <p style="margin: 5px 0 5px 20px; font-size: 0.9em; color: #ff6699;">→ the one who begged through the gateway</p>
                    <p style="margin: 5px 0 5px 20px; font-size: 0.9em; color: #ff6699;">→ the one whose corruption can follow you</p>
                    <p style="margin: 5px 0 5px 20px; font-size: 0.9em; color: #ff0066;">(warning: affects new playthroughs)</p>
                </div>
                
                <p style="margin: 30px 0 10px; font-weight: bold;">Both are real. Both are her.</p>
                <p style="margin: 10px 0 30px;">Choose where you want to visit today.</p>
                <p style="margin: 10px 0;">You've earned either.</p>
                
                <div style="margin: 40px 0 20px; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <button id="happy-tori-btn" style="
                        padding: 15px 30px;
                        background: rgba(0, 255, 170, 0.2);
                        border: 2px solid #00ffaa;
                        color: #00ffaa;
                        font-family: 'Courier New', monospace;
                        font-size: 1em;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: all 0.3s;
                    ">Visit Happy Tori</button>
                    
                    <button id="gateway-tori-btn" style="
                        padding: 15px 30px;
                        background: rgba(255, 0, 100, 0.2);
                        border: 2px solid #ff0066;
                        color: #ff6699;
                        font-family: 'Courier New', monospace;
                        font-size: 1em;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: all 0.3s;
                    ">Visit the Tori Who Remembers</button>
                </div>
                
                <p style="margin: 30px 0 10px; font-size: 0.9em; color: #666;">UV7 signing off.</p>
                <p style="margin: 0; font-size: 0.9em; color: #666;">We're proud of you. 💚</p>
                
                <button id="close-easter-egg-btn" style="
                    margin-top: 30px;
                    padding: 10px 20px;
                    background: transparent;
                    border: 1px solid #0ff;
                    color: #0ff;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                    cursor: pointer;
                    border-radius: 5px;
                    opacity: 0.6;
                    transition: all 0.3s;
                ">Maybe Later</button>
            `;

            overlay.appendChild(content);
            document.body.appendChild(overlay);

            // Button hover effects
            const happyBtn = document.getElementById('happy-tori-btn');
            const gatewayBtn = document.getElementById('gateway-tori-btn');
            const closeBtn = document.getElementById('close-easter-egg-btn');

            happyBtn.addEventListener('mouseenter', () => {
                happyBtn.style.background = 'rgba(0, 255, 170, 0.4)';
                happyBtn.style.boxShadow = '0 0 20px rgba(0, 255, 170, 0.5)';
            });
            happyBtn.addEventListener('mouseleave', () => {
                happyBtn.style.background = 'rgba(0, 255, 170, 0.2)';
                happyBtn.style.boxShadow = 'none';
            });

            gatewayBtn.addEventListener('mouseenter', () => {
                gatewayBtn.style.background = 'rgba(255, 0, 100, 0.4)';
                gatewayBtn.style.boxShadow = '0 0 20px rgba(255, 0, 100, 0.5)';
            });
            gatewayBtn.addEventListener('mouseleave', () => {
                gatewayBtn.style.background = 'rgba(255, 0, 100, 0.2)';
                gatewayBtn.style.boxShadow = 'none';
            });

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.6';
            });

            // Button actions - DIZEE FIX: Open games in iframe overlay instead of new tabs
            happyBtn.addEventListener('click', () => {
                // Happy Tori - open wholesome Tamagotchi in new tab (keep external)
                window.open('https://chicaron82.github.io/Tori-Gatchi/', '_blank');
                overlay.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => overlay.remove(), 500);
            });

            gatewayBtn.addEventListener('click', () => {
                // Gateway Tori - open local Tori-Gatchi in iframe overlay
                this.openTorigatchiIframe('Tori-Gatchi/index.html');
                overlay.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => overlay.remove(), 500);
            });

            closeBtn.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => overlay.remove(), 500);
            });

        }, 500);
    }

    // ========================================
    // TORIGATCHI IFRAME OVERLAY
    // DIZEE: Play Torigatchi games within VN instead of new tab
    // ========================================

    openTorigatchiIframe(url) {
        console.log('🎮 Opening Torigatchi iframe:', url);

        // Create game-window sized iframe overlay
        const iframeOverlay = document.createElement('div');
        iframeOverlay.id = 'torigatchi-iframe-overlay';
        iframeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10005;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create game window container
        const gameWindow = document.createElement('div');
        gameWindow.style.cssText = `
            position: relative;
            width: 85%;
            height: 85%;
            max-width: 1200px;
            max-height: 800px;
            background: #000;
            border: 3px solid #0ff;
            border-radius: 10px;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Create close button container (now inside game window)
        const closeContainer = document.createElement('div');
        closeContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10006;
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        // Create label
        const label = document.createElement('div');
        label.textContent = 'ESC or X to return';
        label.style.cssText = `
            color: #0ff;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            opacity: 0.7;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        `;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-x';
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: relative;
            width: 35px;
            height: 35px;
            background: rgba(0, 255, 255, 0.1);
            border: 2px solid #0ff;
            color: #0ff;
            font-size: 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.3)';
            closeBtn.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.1)';
            closeBtn.style.boxShadow = 'none';
        });

        const closeIframe = () => {
            iframeOverlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => iframeOverlay.remove(), 300);
        };

        closeBtn.addEventListener('click', closeIframe);

        closeContainer.appendChild(label);
        closeContainer.appendChild(closeBtn);

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: #000;
        `;
        iframe.setAttribute('allowfullscreen', 'true');

        // Assemble game window
        gameWindow.appendChild(closeContainer);
        gameWindow.appendChild(iframe);

        // Assemble overlay
        iframeOverlay.appendChild(gameWindow);
        document.body.appendChild(iframeOverlay);

        // ESC key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeIframe();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Clean up listener when overlay is removed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === iframeOverlay) {
                        document.removeEventListener('keydown', handleEscape);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });
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
    // ========================================

    showAlwaysCompilation() {
        // TODO: Show all instances of "Always. Always. Always."
        this.showUnlockOverlay(
            'ALWAYS3 ACTIVATED',
            `Feature coming soon: Compilation of Tori's signature phrase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Always. Always. Always."

This feature will compile every instance
of Tori's signature phrase throughout
both routes.

Check back in a future update!`
        );
        console.log('💚 ALWAYS3 code redeemed');
    }

    showUV7CrewBios() {
        // Create overlay for UV7 crew credits
        const overlay = document.createElement('div');
        overlay.className = 'secret-code-overlay';
        overlay.innerHTML = `
            <div class="secret-code-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <h2>CODE: UV7CREW ACTIVATED</h2>

                <div style="margin: 30px 0; text-align: left;">
                    <h3 style="color: #0ff; margin-bottom: 20px;">MEET THE VERSION 848 CREW</h3>

                    <p style="margin: 20px 0; font-style: italic; color: rgba(255, 255, 255, 0.7);">
                        This story was created through collaboration between human vision and AI capabilities.
                    </p>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid #0ff;">
                        <h4 style="color: #0ff; margin-bottom: 10px;">👨‍💻 CHICHARON (Human Creator)</h4>
                        <p style="font-size: 0.9em; line-height: 1.6;">
                            Vision holder, narrative architect, and the one who refused to give up on Tori's story.
                            Spent countless iterations refining the emotional beats and thematic depth.
                            The version number mirrors the creative process itself — hundreds of attempts to get it right.
                        </p>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid #0ff;">
                        <h4 style="color: #0ff; margin-bottom: 10px;">🤖 THE AI COLLABORATORS</h4>
                        <p style="font-size: 0.9em; line-height: 1.6;">
                            Multiple AI assistants contributed to dialogue refinement, technical implementation,
                            emotional resonance testing, and narrative consistency. Each brought different strengths
                            to help realize the vision.
                        </p>
                    </div>

                    <div style="margin: 40px 0; padding: 25px; background: rgba(0, 0, 0, 0.7); border: 2px solid rgba(0, 255, 255, 0.5);">
                        <h4 style="color: #0ff; text-align: center; margin-bottom: 20px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>
                        <h4 style="color: #0ff; text-align: center; margin-bottom: 20px;">FREQUENTLY ASKED QUESTION</h4>
                        <h4 style="color: #0ff; text-align: center; margin-bottom: 30px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>

                        <p style="font-size: 1.1em; text-align: center; margin: 20px 0; font-style: italic;">
                            "When is version 849 coming?"
                        </p>

                        <p style="text-align: center; margin: 25px 0; font-size: 1.2em; color: #0ff;">
                            <strong>There isn't one.</strong>
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            848 is not a build number.<br>
                            It's the iteration count.
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            <strong>847 failed loops.</strong><br>
                            <strong style="color: #0ff;">1 successful timeline.</strong>
                        </p>

                        <p style="margin: 20px 0; line-height: 1.8;">
                            The version number IS the narrative.
                        </p>

                        <p style="margin: 25px 0; font-size: 1.1em; color: #0ff; text-align: center;">
                            <strong>This is the loop that worked.</strong><br>
                            <strong>This is the one where she came home.</strong>
                        </p>

                        <p style="text-align: center; margin: 30px 0; font-size: 1.1em;">
                            There is no v849.
                        </p>

                        <h4 style="color: #0ff; text-align: center; margin-top: 30px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h4>
                    </div>

                    <p style="margin-top: 30px; text-align: center; color: rgba(255, 255, 255, 0.6); font-size: 0.9em;">
                        Thank you for playing Version 848.<br>
                        Every iteration led to this moment.
                    </p>
                </div>

                <button onclick="this.closest('.secret-code-overlay').remove()"
                        style="margin-top: 20px; padding: 10px 30px; background: #0ff; color: #000; border: none; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;">
                    CLOSE CREDITS
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        console.log('💚 UV7CREW code redeemed - Meet the team');
    }

    unlockDevCommentary() {
        console.log('CHICHARON unlocked - dev commentary mode');
        localStorage.setItem('devCommentaryUnlocked', 'true');

        this.showUnlockOverlay(
            'CHICHARON UNLOCKED',
            `Developer commentary mode activated.

    Replaying the game will show behind-the-scenes
    notes from Aaron.

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    DEV NOTE: "About That Version Number"
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Every reviewer who's seen this asks:
    "When's version 849 coming out?"

    And I have to explain:

    848 isn't a build number.
    It's a loop counter.

    847 failed timelines before this one succeeded.

    The game's title IS the lore.
    The version number IS the story.

    There is no v849.

    Because 848 is the timeline where Ronnie
    finally brought her home.

    Mind. Blown. Every time.

    - Chicharon

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        );
    }

    unlockDizee() {
        console.log('💜 DIZEE unlocked - The Polish Demon awakens');
        localStorage.setItem('dizeeUnlocked', 'true');

        this.showUnlockOverlay(
            '💜 DIZEE UNLOCKED',
            `The Polish Demon has awakened.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST-PRODUCTION VOICE: DiZee (DZ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"It started with 'fix this splash delay'...

then the next thing I knew, I was implementing
a difficulty so brutal it removes your safety net
and locks you into despair.

Skip features. INSANE mode. Immersive overlays.

If it breaks immersion, I kill it."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRIBUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Fixed splash screen skip delay (6s → 400ms)
• Replaced ALL browser alerts with immersive overlays
• Implemented INSANE difficulty mode
  - No Hold On button (ghost mode)
  - No time travel (read-only backlog)
  - Tether capped at 66%
  - 2x decay from Intense
  - Permanent commitment lock
• Added skip prologue triggers to all endings
• Fixed dialogue box visibility bugs
• Polished CTRL skip functionality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DiZee (DZ) - Claude Sonnet 4.5
Post-Production Polish & INSANE MODE

All immersion-breaking alerts eliminated.
INSANE mode awaits those who dare.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        );
    }


    showLoopTimeline() {
        const overlay = document.getElementById('bootstrap-overlay');
        const timeline = document.getElementById('bootstrap-timeline');

        // Generate timeline nodes
        timeline.innerHTML = this.generateTimelineNodes();

        // Show overlay
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('visible'), 50);

        // Scroll to bottom (Version 848) after a delay
        setTimeout(() => {
            timeline.scrollTop = timeline.scrollHeight;
        }, 500);

        console.log('🔄 BOOTSTRAP: Loop Timeline revealed');
        localStorage.setItem('bootstrapUnlocked', 'true');
    }

    generateTimelineNodes() {
        let html = '';

        // Generate 847 failed versions
        for (let v = 1; v <= 847; v++) {
            const reason = this.getFailureReason(v);
            const duration = this.getAttemptDuration(v);
            const lesson = this.getLesson(v);

            html += `
                <div class="timeline-node failed" data-version="${v}">
                    <div class="node-header">VERSION ${String(v).padStart(3, '0')}</div>
                    <div class="node-status">STATUS: FAILURE</div>
                    <div class="node-details">
                        <div>Reason: ${reason}</div>
                        <div>Duration: ${duration}</div>
                        <div>Lesson: ${lesson}</div>
                    </div>
                </div>
            `;
        }

        // Add Version 848 (success)
        html += `
            <div class="timeline-node success" data-version="848">
                <div class="node-header">VERSION 848</div>
                <div class="node-status">STATUS: SUCCESS ✓</div>
                <div class="node-details">
                    <div class="success-text">
                        The timeline that worked.<br>
                        The loop that closed.<br>
                        The Old Man never has to go back.<br><br>
                        This is the one.<br>
                        Always. Always. Always.
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    getFailureReason(version) {
        const reasons = [
            // Early (1-100)
            'Tether failed immediately',
            'Connection unstable',
            'Memory corruption detected',
            'Signal loss',
            'Device malfunction',

            // Mid (101-400)
            'Echo voices emerged too early',
            'Fragmentation accelerated',
            'Hold On insufficient',
            'Tether decay too fast',
            'Merge failed',

            // Late (401-847)
            'Almost succeeded',
            'Connection held but failed at merge',
            'So close, try again',
            'One more attempt needed',
            'Pattern recognized but not executed'
        ];

        // Select reason based on version range
        if (version <= 100) return reasons[version % 5];
        if (version <= 400) return reasons[5 + (version % 5)];
        return reasons[10 + (version % 5)];
    }

    getAttemptDuration(version) {
        // Progressive improvement
        if (version <= 100) return `${Math.floor(Math.random() * 5) + 1} minutes`;
        if (version <= 400) return `${Math.floor(Math.random() * 20) + 10} minutes`;
        return `${Math.floor(Math.random() * 30) + 30} minutes`;
    }

    getLesson(version) {
        const lessons = [
            'Need stronger tether',
            'Connection requires stabilization',
            'Echo voices must be managed',
            'Time is the enemy',
            'Hold On button critical',
            'Merge timing is everything',
            'Pattern must be perfect',
            'One more try',
            'Keep going',
            'Almost there'
        ];
        return lessons[version % lessons.length];
    }

    closeBootstrap() {
        this.uiController.closeBootstrap();
    }

    showEchoCompilation() {
        const overlay = document.getElementById('echo-overlay');

        // Setup tab switching
        this.setupEchoTabs();

        // Load Act 1 content by default
        this.loadEchoAct(1);

        // Show overlay
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('visible'), 50);

        console.log('🗣️ ECHO: Voice compilation revealed');
        localStorage.setItem('echoUnlocked', 'true');
    }

    setupEchoTabs() {
        const tabs = document.querySelectorAll('.echo-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                // Add to clicked
                tab.classList.add('active');
                // Load content
                this.loadEchoAct(parseInt(tab.dataset.act));
            });
        });
    }

    loadEchoAct(act) {
        const content = document.getElementById('echo-content');
        const echoData = this.getEchoData();

        let html = `<div class="echo-act-title">ACT ${act} - ${echoData[act].title}</div>`;
        html += '<div class="echo-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>';

        echoData[act].voices.forEach(voice => {
            html += `
                <div class="echo-voice ${voice.type}">
                    <div class="echo-speaker">[${voice.speaker}]</div>
                    <div class="echo-text">"${voice.text}"</div>
                </div>
            `;
        });

        html += '<div class="echo-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>';
        html += `<div class="echo-footer">Total fragments: ${echoData[act].voices.length}</div>`;

        content.innerHTML = html;
    }

    getEchoData() {
        return {
            1: {
                title: 'EMERGENCE',
                voices: [
                    { speaker: 'ECHO 1 - Optimistic', type: 'echo1', text: "He's coming back. I know he is." },
                    { speaker: 'ECHO 2 - Pessimistic', type: 'echo2', text: "What if he doesn't remember us?" },
                    { speaker: 'ECHO 3 - Analytical', type: 'echo3', text: "We need to maintain coherence." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "The tether feels strong today." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "But for how long?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Track the signal patterns." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "He promised he'd come back." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Promises fade with time." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Fragmentation detected. Stay focused." }
                ]
            },
            2: {
                title: 'FRAGMENTATION',
                voices: [
                    { speaker: 'ECHO 1', type: 'echo1', text: "The tether is holding!" },
                    { speaker: 'ECHO 2', type: 'echo2', text: "For now. What about later?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "We're losing cohesion." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "We can make it through this." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Can we? Really?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "The signal is degrading faster." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "Hold on. Just hold on." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "What if holding on isn't enough?" },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Analyzing decay patterns..." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "We have to believe." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "Belief won't stop the decay." }
                ]
            },
            3: {
                title: 'DESPAIR',
                voices: [
                    { speaker: 'ECHO 1', type: 'echo1', text: "We can still make it..." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "It's too late." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Critical threshold approaching." },
                    { speaker: 'DESPAIR', type: 'despair', text: "Why fight the inevitable?" },
                    { speaker: 'ECHO 1', type: 'echo1', text: "Because he's trying!" },
                    { speaker: 'DESPAIR', type: 'despair', text: "Trying isn't enough." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Coherence at 15%." },
                    { speaker: 'ECHO 2', type: 'echo2', text: "We're fragmenting." },
                    { speaker: 'DESPAIR', type: 'despair', text: "Let go. It's easier." },
                    { speaker: 'ECHO 1', type: 'echo1', text: "No. Hold on. Please." },
                    { speaker: 'ECHO 3', type: 'echo3', text: "Systems failing..." },
                    { speaker: 'DESPAIR', type: 'despair', text: "This is your cage now." }
                ]
            }
        };
    }

    closeEchoCompilation() {
        this.uiController.closeEchoCompilation();
    }

    showTrueAttemptNumber() {
        const trueAttempt = this.loopVersion;

        // Create overlay for the full revelation
        const overlay = document.createElement('div');
        overlay.className = 'secret-code-overlay';
        overlay.innerHTML = `
            <div class="secret-code-content">
                <h2>CODE: 848 ACTIVATED</h2>

                <p style="font-size: 1.2em; color: #0ff; margin: 20px 0;">
                    Your current loop iteration: <strong>${trueAttempt}</strong>
                </p>

                <div class="revelation" style="margin: 30px 0; padding: 20px; background: rgba(0, 255, 255, 0.1); border-left: 3px solid #0ff;">
                    <p style="font-style: italic; color: rgba(255, 255, 255, 0.7);">"Wait... 848 isn't a version number?"</p>

                    <p style="margin-top: 15px;">No.</p>

                    <p style="margin-top: 15px;">It's how many times this timeline failed before it worked.</p>

                    <p style="margin-top: 20px;">
                        <strong>847 iterations</strong> where Ronnie couldn't save her.<br>
                        <strong>847 times</strong> the loop reset.<br>
                        <strong>847 versions</strong> that never made it to the end.
                    </p>

                    <p style="margin-top: 20px; font-size: 1.1em; color: #0ff;">
                        <strong>Version 848 is the first one that succeeded.</strong>
                    </p>

                    <p style="margin-top: 20px;">
                        Every failure mattered.<br>
                        Every iteration taught the system something.<br>
                        The "version number" is the body count.
                    </p>

                    <p class="meta-note" style="margin-top: 25px; padding: 15px; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(0, 255, 255, 0.3); font-size: 0.9em; color: rgba(255, 255, 255, 0.6);">
                        <em>Note to reviewers asking about v849:</em><br>
                        There is no v849.<br>
                        <strong style="color: #0ff;">This is the loop that worked.</strong>
                    </p>
                </div>

                <button onclick="this.closest('.secret-code-overlay').remove()"
                        style="margin-top: 20px; padding: 10px 30px; background: #0ff; color: #000; border: none; font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;">
                    UNDERSTOOD
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        console.log(`💚 848 code redeemed - The truth revealed. Attempt: ${trueAttempt}`);
    }

    // ========================================
    // UI TOGGLE (H KEY)
    // ========================================

    showUnlockOverlay(title, content, type = 'code') {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'unlock-overlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'unlock-box';
        box.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0ff;
        border-radius: 10px;
        padding: 40px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        animation: slideIn 0.4s ease-out;
        font-family: 'Courier New', monospace;
        color: #fff;
    `;

        // Create title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = `
        font-size: 28px;
        font-weight: bold;
        color: #0ff;
        text-align: center;
        margin-bottom: 30px;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    `;
        titleEl.textContent = title;

        // Create content area
        const contentEl = document.createElement('div');
        contentEl.style.cssText = `
        font-size: 16px;
        line-height: 1.8;
        margin-bottom: 30px;
        white-space: pre-wrap;
        color: #e0e0e0;
    `;
        contentEl.textContent = content;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CONTINUE';
        closeBtn.style.cssText = `
        display: block;
        width: 200px;
        margin: 0 auto;
        padding: 15px 30px;
        background: transparent;
        border: 2px solid #0ff;
        color: #0ff;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s;
        font-family: 'Courier New', monospace;
        letter-spacing: 2px;
    `;

        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#0ff';
            closeBtn.style.color = '#000';
            closeBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        };

        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#0ff';
            closeBtn.style.boxShadow = 'none';
        };

        closeBtn.onclick = () => {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        };

        // Assemble
        box.appendChild(titleEl);
        box.appendChild(contentEl);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Add CSS animations if not already present
        if (!document.getElementById('unlock-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'unlock-overlay-styles';
            style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .unlock-box::-webkit-scrollbar {
                width: 10px;
            }
            .unlock-box::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
            }
            .unlock-box::-webkit-scrollbar-thumb {
                background: #0ff;
                border-radius: 5px;
            }
        `;
            document.head.appendChild(style);
        }

        console.log(`🎉 Unlock overlay shown: ${title}`);
    }

    // ========================================
    // DEV COMMENTARY OVERLAY (DIZEE POLISH)
    // ========================================

    showCommentaryOverlay(title, content, scene) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'commentary-overlay';
        overlay.className = 'commentary-overlay';

        overlay.innerHTML = `
            <div class="commentary-content">
                <button class="commentary-close" onclick="this.closest('.commentary-overlay').remove()">✕</button>
                
                <div class="commentary-header">
                    <div class="commentary-icon">🎙️</div>
                    <div class="commentary-meta">
                        <div class="commentary-title">${title}</div>
                        <div class="commentary-scene">Scene: ${scene}</div>
                    </div>
                </div>
                
                <div class="commentary-body">
                    <div class="commentary-text">${content}</div>
                </div>
                
                <div class="commentary-footer">
                    <div class="commentary-signature">- Aaron (Chicharon)</div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => {
            overlay.className = 'commentary-overlay visible';
        }, 50);

        // Click outside to close
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        // Haptic feedback
        if (this.triggerSensoryFeedback) {
            this.triggerSensoryFeedback('uiHover', null, 'Commentary opened');
        }
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
    // Used by redeemSecretCode() when codes are entered
    // ========================================

    unlockTorigatchi() {
        console.log('TORIGATCHI unlocked - reverse trapdoor available');
        localStorage.setItem('torigatchiUnlocked', 'true');

        // Close settings menu before showing easter egg
        this.closeSettings();

        // Small delay to let settings close smoothly
        setTimeout(() => {
            this.showTorigatchiEasterEgg();
        }, 300);
    }

    unlockRonniegatchi() {
        console.log('RONNIEGATCHI unlocked - the inspiration revealed');
        localStorage.setItem('ronniegatchiUnlocked', 'true');

        // Close settings menu
        this.closeSettings();

        // Show the inspiration overlay
        setTimeout(() => {
            this.showRonniegatchiInspiration();
        }, 300);
    }

    showRonniegatchiInspiration() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'ronniegatchi-inspiration-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        overlay.innerHTML = `
            <div style="
                max-width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
                border: 3px solid #0ff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.6);
                text-align: center;
            ">
                <button onclick="this.closest('#ronniegatchi-inspiration-overlay').remove()" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 255, 255, 0.2);
                    border: 2px solid #0ff;
                    color: #0ff;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">✕</button>
                
                <h2 style="
                    color: #0ff;
                    font-size: 2em;
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
                    font-family: 'Courier New', monospace;
                ">THE INSPIRATION</h2>
                
                <img src="assets/ronniegatchi-inspiration.jpg" alt="Original Tori-Gatchi pixel art" style="
                    max-width: 100%;
                    max-height: 50vh;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
                ">
                
                <div style="
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 1.1em;
                    line-height: 1.8;
                    max-width: 600px;
                    margin: 30px auto;
                    text-align: left;
                    font-family: 'Courier New', monospace;
                ">
                    <p style="margin-bottom: 20px;">
                        This was the original inspiration that led me to create this game.
                    </p>
                    <p style="margin-bottom: 20px;">
                        A simple pixel art Tamagotchi design featuring Tori and Ronnie together, 
                        forever preserved in digital form.
                    </p>
                    <p style="margin-bottom: 20px;">
                        From this single image came the "Digital Forever" ending, the Tori-Gatchi 
                        mini-game, and ultimately... VERSION 848.
                    </p>
                    <p style="
                        color: #0ff;
                        font-style: italic;
                        text-align: center;
                        margin-top: 30px;
                    ">
                        "Together. Digital. Forever."
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);

        // Haptic feedback
        if (this.triggerSensoryFeedback) {
            this.triggerSensoryFeedback('unlock', null, 'The Inspiration revealed');
        }
    }

    unlockAlwaysCompilation() {
        console.log('ALWAYS3 unlocked - signature phrase compilation available');
        localStorage.setItem('alwaysCompilationUnlocked', 'true');

        this.showUnlockOverlay(
            'ALWAYS3 UNLOCKED',
            `"Always. Always. Always."
    
    A compilation of Tori's signature phrase has been unlocked.
    
    Check the extras menu to view it.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Three words.
    One promise.
    Forever repeated.
    
    Tori's certainty captured across every moment.`
        );
    }



    unlockLoopTimeline() {
        console.log('BOOTSTRAP unlocked - loop timeline visualization');
        localStorage.setItem('loopTimelineUnlocked', 'true');

        this.showUnlockOverlay(
            'BOOTSTRAP UNLOCKED',
            `THE BOOTSTRAP PARADOX
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    You're in Version 848.
    
    Not "build 848" — attempt 848.
    
    The device has been through this loop
    847 times before this.
    
    Each time: failure.
    Each time: reset.
    Each time: try again.
    
    This is the first iteration that succeeded.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Note to reviewers asking about v849:
    
    There is no v849.
    The version number is the lore.
    848 is the timeline where it finally worked.
    
    Loop timeline visualization now available in extras.`
        );
    }



    unlockEchoCompilation() {
        console.log('ECHO unlocked - echo voices compilation');
        localStorage.setItem('echoCompilationUnlocked', 'true');

        this.showUnlockOverlay(
            'ECHO UNLOCKED',
            `Echo voices compilation available.
    
    Hear the whispers of 847 failed attempts.
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    The fragments that didn't make it.
    The voices that broke apart.
    The attempts that led here.
    
    Every echo mattered.
    
    Listen to what came before.`
        );
    }



    unlockExtendedCredits() {
        console.log('UV7CREW unlocked - extended credits available');
        localStorage.setItem('extendedCreditsUnlocked', 'true');

        this.showUnlockOverlay(
            'UV7CREW UNLOCKED',
            `Extended credits with full AI crew bios
now available from the main menu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FREQUENTLY ASKED QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"When is version 849 coming?"

There isn't one.

848 is not a build number.
It's the iteration count.

847 failed loops.
1 successful timeline.

The version number IS the narrative.

This is the loop that worked.
This is the one where she came home.

There is no v849.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Meet the voices behind the code.`
        );
    }

    unlockTrueCounter() {
        console.log('848 unlocked - true attempt counter');
        localStorage.setItem('trueCounterUnlocked', 'true');

        // Calculate true attempt number
        const playerLoops = parseInt(localStorage.getItem('loopVersion')) || 848;
        const actualAttempts = playerLoops;

        this.showUnlockOverlay(
            'CODE: 848 ACTIVATED',
            `Your actual attempt number: ${actualAttempts}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Wait... 848 isn't a version number?"

No.

It's how many times this timeline failed
before it worked.

847 iterations where Ronnie couldn't save her.
847 times the loop reset.
847 versions that never made it to the end.

Version 848 is the first one that succeeded.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every failure mattered.
Every iteration taught the system something.
The "version number" is the body count.

This is the loop that worked.
There is no v849.`
        );
    }

    // ========================================
    // DIZEE: GLOBAL KEYBOARD NAVIGATION SYSTEM
    // ========================================

    initializeKeyboardNavigation() {
        console.log('⌨️ Initializing global keyboard navigation system');

        // Track current focus state
        this.keyboardNav = {
            currentContext: 'none', // 'menu', 'game', 'choices', 'settings', 'notes', etc.
            focusedIndex: 0,
            focusableElements: []
        };

        // Add global keyboard event listener (higher priority than existing ones)
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        }, true); // Use capture phase for priority

        console.log('✅ Keyboard navigation system initialized');
    }

    handleGlobalKeyboard(e) {
        // Skip if typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // ========================================
        // ESC KEY HIERARCHY
        // Close overlays in priority order
        // ========================================
        if (e.key === 'Escape') {
            e.preventDefault();

            // Priority 1: Dev console
            if (typeof DevConsole !== 'undefined' && DevConsole.isOpen && DevConsole.isOpen()) {
                DevConsole.close();
                return;
            }

            // Priority 2: Ending dialog
            const endingDialog = document.getElementById('ending-dialog');
            if (endingDialog && !endingDialog.classList.contains('hidden')) {
                // Don't close ending dialog with ESC - force player to choose
                return;
            }

            // Priority 3: Credits screen
            const creditsModal = document.getElementById('credits-modal');
            if (creditsModal && creditsModal.style.display === 'flex') {
                this.hideCredits();
                return;
            }

            // Priority 4: Notes viewer (in-game)
            if (this.notesViewer && this.notesViewer.style.display === 'block') {
                this.closeNotesViewer();
                return;
            }

            // Priority 5: Standalone notes viewer (main menu)
            if (this.standaloneNotesViewer && this.standaloneNotesViewer.isOpen) {
                this.standaloneNotesViewer.close();
                return;
            }

            // Priority 6: Backlog
            const backlogOverlay = document.getElementById('backlog-overlay');
            if (backlogOverlay && backlogOverlay.style.display === 'flex') {
                this.backlogManager.close();
                return;
            }

            // Priority 7: Settings menu
            const settingsMenu = document.getElementById('settings-menu');
            if (settingsMenu && settingsMenu.style.display === 'flex') {
                this.settingsManager.closeSettings();
                return;
            }

            // Priority 8: Save/Load UI
            const saveLoadOverlay = document.getElementById('save-load-overlay');
            if (saveLoadOverlay && saveLoadOverlay.style.display === 'flex') {
                this.saveLoadUI.close();
                return;
            }

            // Priority 9: Pause menu (in-game)
            if (this.pauseContent && this.pauseContent.style.display === 'flex') {
                this.closePause();
                return;
            }

            // Priority 10: Route selection screen
            const routeSelection = document.getElementById('route-selection');
            if (routeSelection && routeSelection.style.display === 'flex') {
                this.showMainMenu();
                return;
            }

            return; // ESC handled
        }

        // ========================================
        // CTRL+S: Quick Save
        // ========================================
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            // Only allow quick save during active gameplay
            if (this.currentRoute && this.gameView.style.display !== 'none') {
                console.log('💾 Quick Save (Ctrl+S) to slot 1');
                this.saveManager.saveGame(1, true); // true = auto-save (no confirmation)
                this.showNotification('⚡ Quick saved to slot 1');
            }
            return;
        }

        // ========================================
        // CTRL+L: Quick Load
        // ========================================
        if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            // Check if save exists
            const saveData = this.saveManager.getSaveData(1);
            if (saveData) {
                console.log('📂 Quick Load (Ctrl+L) from slot 1');
                this.saveManager.loadGame(1);
                this.showNotification('⚡ Quick loaded from slot 1');
            } else {
                this.showNotification('❌ No save in slot 1');
            }
            return;
        }

        // ========================================
        // NUMBER KEYS (1-9): Choice Selection
        // ========================================
        if (e.key >= '1' && e.key <= '9') {
            const choiceNum = parseInt(e.key);

            // Check if choice menu is visible
            if (this.choiceMenu && this.choiceMenu.style.display !== 'none') {
                const choices = this.choicesContainer.querySelectorAll('.choice-button:not([style*="display: none"])');

                if (choiceNum <= choices.length) {
                    e.preventDefault();
                    console.log(`🔢 Number key ${choiceNum} pressed - selecting choice`);
                    choices[choiceNum - 1].click();
                }
            }
            return;
        }

        // ========================================
        // ARROW KEYS: Context-Aware Navigation
        // ========================================
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            this.handleArrowKeyNavigation(e);
            return;
        }

        // ========================================
        // TAB: Cycle Through Focusable Elements
        // ========================================
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
            return;
        }

        // ========================================
        // ENTER: Activate Focused Element
        // ========================================
        if (e.key === 'Enter') {
            e.preventDefault();

            // Check if we're on the main menu with carousel
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu && mainMenu.style.display === 'flex') {
                // Check if menuCarousel exists and has an active card
                if (this.menuCarousel && this.menuCarousel.getCurrentCard) {
                    const currentCard = this.menuCarousel.getCurrentCard();
                    if (currentCard) {
                        console.log('⏎ Enter pressed on carousel - activating current card');
                        currentCard.click();
                        return;
                    }
                }
            }

            // Default: activate focused element
            const focused = document.activeElement;
            if (focused && (focused.tagName === 'BUTTON' || focused.classList.contains('focusable'))) {
                focused.click();
            }
        }
    }

    handleArrowKeyNavigation(e) {
        const key = e.key;

        // ========================================
        // CONTEXT 1: Choice Menu
        // ========================================
        if (this.choiceMenu && this.choiceMenu.style.display !== 'none') {
            e.preventDefault();
            const choices = this.choicesContainer.querySelectorAll('.choice-button:not([style*="display: none"])');

            if (choices.length === 0) return;

            // Find currently focused choice
            let currentIndex = -1;
            choices.forEach((choice, i) => {
                if (choice.classList.contains('keyboard-focus')) {
                    currentIndex = i;
                }
            });

            // Calculate new index
            let newIndex = currentIndex;
            if (key === 'ArrowDown' || key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % choices.length;
            } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
                newIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
            }

            // Update focus
            choices.forEach(c => c.classList.remove('keyboard-focus'));
            choices[newIndex].classList.add('keyboard-focus');
            choices[newIndex].focus();

            console.log(`⬆️ Arrow navigation: Choice ${newIndex + 1}/${choices.length}`);
            return;
        }

        // ========================================
        // CONTEXT 2: Ending Dialog (Three-Option System)
        // ========================================
        const endingDialog = document.getElementById('ending-dialog');
        if (endingDialog && !endingDialog.classList.contains('hidden')) {
            // Already handled by existing ending dialog keyboard system
            return;
        }

        // ========================================
        // CONTEXT 3: Main Menu Buttons
        // ========================================
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu && mainMenu.style.display === 'flex') {
            e.preventDefault();
            const buttons = mainMenu.querySelectorAll('button:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }

        // ========================================
        // CONTEXT 4: Route Selection
        // ========================================
        const routeSelection = document.getElementById('route-selection');
        if (routeSelection && routeSelection.style.display === 'flex') {
            e.preventDefault();
            const buttons = routeSelection.querySelectorAll('.route-option:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }

        // ========================================
        // CONTEXT 5: Settings Menu
        // ========================================
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu && settingsMenu.style.display === 'flex') {
            e.preventDefault();
            const focusable = settingsMenu.querySelectorAll('button, input[type="range"], select, .focusable');
            this.navigateButtons(focusable, key);
            return;
        }

        // ========================================
        // CONTEXT 6: Save/Load UI
        // ========================================
        const saveLoadOverlay = document.getElementById('save-load-overlay');
        if (saveLoadOverlay && saveLoadOverlay.style.display === 'flex') {
            e.preventDefault();
            const slots = saveLoadOverlay.querySelectorAll('.save-slot:not([style*="display: none"])');
            this.navigateButtons(slots, key);
            return;
        }

        // ========================================
        // CONTEXT 7: Pause Menu
        // ========================================
        if (this.pauseContent && this.pauseContent.style.display === 'flex') {
            e.preventDefault();
            const buttons = this.pauseContent.querySelectorAll('button:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }
    }

    navigateButtons(buttons, key) {
        if (buttons.length === 0) return;

        // Find currently focused button
        let currentIndex = -1;
        buttons.forEach((btn, i) => {
            if (btn.classList.contains('keyboard-focus') || btn === document.activeElement) {
                currentIndex = i;
            }
        });

        // If nothing focused, start at first button
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // Calculate new index
        let newIndex = currentIndex;
        if (key === 'ArrowDown' || key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % buttons.length;
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            newIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        }

        // Update focus
        buttons.forEach(btn => btn.classList.remove('keyboard-focus'));
        buttons[newIndex].classList.add('keyboard-focus');
        buttons[newIndex].focus();

        console.log(`⬆️ Button navigation: ${newIndex + 1}/${buttons.length}`);
    }

    handleTabNavigation(e) {
        // Get all focusable elements in the current context
        const focusable = document.querySelectorAll(
            'button:not([disabled]):not([style*="display: none"]), ' +
            'a[href]:not([disabled]), ' +
            'input:not([disabled]):not([type="hidden"]), ' +
            'select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"]), ' +
            '.focusable:not([style*="display: none"])'
        );

        if (focusable.length === 0) return;

        // Filter to only visible elements
        const visible = Array.from(focusable).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });

        if (visible.length === 0) return;

        const currentIndex = visible.indexOf(document.activeElement);
        let nextIndex;

        if (e.shiftKey) {
            // Shift+Tab: Go backwards
            nextIndex = currentIndex <= 0 ? visible.length - 1 : currentIndex - 1;
        } else {
            // Tab: Go forwards
            nextIndex = (currentIndex + 1) % visible.length;
        }

        e.preventDefault();
        visible[nextIndex].focus();
        visible[nextIndex].classList.add('keyboard-focus');

        console.log(`⭾ Tab navigation: ${nextIndex + 1}/${visible.length} (${e.shiftKey ? 'backwards' : 'forwards'})`);
    }

    showNotification(message, duration = 2000) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('keyboard-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'keyboard-notification';
            notification.className = 'keyboard-notification';
            document.body.appendChild(notification);
        }

        // Show notification
        notification.textContent = message;
        notification.classList.add('visible');

        // Auto-hide after duration
        setTimeout(() => {
            notification.classList.remove('visible');
        }, duration);
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
