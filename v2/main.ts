/**
 * Version 848 V2 - Entry Point
 *
 * Clean TypeScript rebuild of the visual novel.
 * Boot sequence: Splash → Main Menu → Route Select → Gameplay
 */

import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { TelemetryRecorder } from '@core/Telemetry';
import { MacroRunner } from '@core/MacroRunner';
import { GameEngine } from '@core/GameEngine';
import { DebugInterface } from '@core/DebugInterface';
import { SettingsSystem } from '@systems/SettingsSystem';
import { SecretCodesSystem } from '@systems/SecretCodesSystem';
import { ContentLoader } from '@systems/ContentLoader';
import { CollectiblesSystem } from '@systems/CollectiblesSystem';
import { HapticSystem } from '@systems/HapticSystem';
import { DialogController } from '@controllers/DialogController';
import { SpriteController } from '@controllers/SpriteController';
import { AutoReadController } from '@core/AutoReadController';
import { KeyboardController } from '@core/KeyboardController';
import { SwipeHandler } from '@core/SwipeHandler';
import { MobileUXController } from '@controllers/MobileUXController';
import { NotificationShade } from '@ui/components/NotificationShade';
import { AchievementSystem } from '@systems/AchievementSystem';

import { TutorialController } from '@controllers/TutorialController';
import { LoopController } from '@controllers/LoopController';
import { EchoMemorySystem } from '@systems/EchoMemorySystem';
import { InsaneVisualsController } from '@controllers/InsaneVisualsController';
import { TetherSystem } from '@systems/TetherSystem';
import { EasterEggController } from '@controllers/EasterEggController';
import { DirectorsCutController } from '@controllers/DirectorsCutController';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { StatusNotificationController } from '@systems/StatusNotificationController';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { InputController } from '@controllers/InputController';
import { SystemEventHandlers } from '@controllers/SystemEventHandlers';

import { TipsOverlay } from '@ui/components/TipsOverlay';
import { MainMenu } from '@ui/screens/MainMenu';
import { RouteSelect } from '@ui/screens/RouteSelect';

import { GameLayout } from '@ui/components/GameLayout';
import { VisualEffectsLayer } from '@ui/components/VisualEffectsLayer';
import { SettingsModal } from '@ui/components/SettingsModal';
import { StatusBar } from '@ui/components/StatusBar';
import { Sidebar } from '@ui/components/Sidebar';
import { NotesViewer } from '@ui/components/NotesViewer';
import '@core/ErrorBoundary'; // Auto-initializes global error handler

import '@ui/styles/main.css';
import '@ui/styles/notes-viewer.css';
import '@ui/styles/error-boundary.css';
import '@ui/styles/loading-overlay.css';
import '@ui/styles/accessibility.css';
import '@ui/styles/dialog-bubble.css'; // DIZEE: Internal thought bubbles
import '@ui/styles/save-load-modal.css'; // V2: Save/Load UI styles
import '@ui/styles/backlog-ui.css'; // V2: Backlog UI styles
import '@ui/styles/sidebar-v1-core.css'; // V1 Sidebar Parity
import '@ui/styles/uv7-app-switcher.css'; // App Switcher Parity


import { CreditsScreen } from '@ui/screens/CreditsScreen';
import { CrewScreen } from '@ui/screens/CrewScreen';
import { SaveSystem } from '@systems/SaveSystem';

import { DialogBubble } from '@ui/components/DialogBubble'; // DIZEE: Internal thoughts
import { SaveLoadModal } from '@ui/components/SaveLoadModal'; // V2: Save/Load UI
import { BacklogUI } from '@ui/components/BacklogUI'; // V2: Backlog UI
import { initializeNotificationRail } from '@ui/components/NotificationRail'; // Phase 26d: Notification Rail

// Import route JSON files (Vite handles these as static imports)
import prologueData from '@content/routes/prologue.json';
import ronnieAct1Data from '@content/routes/ronnie_act1.json';
import ronnieAct2Data from '@content/routes/ronnie_act2.json';
import ronnieAct3Data from '@content/routes/ronnie_act3.json';
import toriAct1Data from '@content/routes/tori_act1.json';
import toriAct2Data from '@content/routes/tori_act2.json';
import toriAct3Data from '@content/routes/tori_act3.json';



// ============================================
// Core Systems
// ============================================
const eventBus = new EventBus();
const stateManager = new StateManager(eventBus, {
    currentScene: 'none',
    currentRoute: null,
    tetherLevel: 100,
    flags: {},
    history: [],
    playtime: 0
});

// Telemetry Recorder (V2 Parity Verification)
const telemetryRecorder = new TelemetryRecorder(eventBus, stateManager);
// telemetryRecorder.start(); // Started manually by Macro Runner

const macroRunner = new MacroRunner(eventBus, stateManager, telemetryRecorder);

const settingsSystem = new SettingsSystem(stateManager);
settingsSystem.init();

const saveSystem = new SaveSystem(stateManager, eventBus);
saveSystem.init();

const hapticSystem = new HapticSystem(eventBus, settingsSystem);

const gameEngine = new GameEngine(eventBus, stateManager);
const contentLoader = new ContentLoader(gameEngine);

// ============================================
// Loop Controller - Meta-narrative system
// Tracks version 848 and loop state
// ZEE'S ADDITION 🖤
// ============================================
const loopController = new LoopController(eventBus, stateManager);

// ============================================
// Echo Memory System - Belle's Meta-Awareness 🖤
// "The echoes remember you..."
// Three echoes: Hope 💫, Gentle 🌙, Despair 🖤
// ============================================
const echoMemorySystem = new EchoMemorySystem(eventBus, stateManager);

// ============================================
// Insane Visuals Controller - DiZee's Corruption 💀
// "SHE'S WATCHING YOU STRUGGLE."
// Visual punishment for INSANE difficulty
// ============================================
const insaneVisualsController = new InsaneVisualsController(eventBus, stateManager);

// ============================================
// Tether System - Tori's Lifeline ⚡
// "The tether is her connection to reality."
// Decay mechanics, Hold On, difficulty scaling
// ============================================
const tetherSystem = new TetherSystem(eventBus, stateManager);

// ============================================
// Easter Egg Controller - Hidden Content 🥚
// "The game within the game."
// Secret code overlays and special content
// ============================================
const easterEggController = new EasterEggController(eventBus, stateManager);

// ============================================
// Director's Cut Controller - Extended Crew Statements 🎬
// "Built with love. Every statement matters."
// Extended crew commentary about working on VERSION 848
// Unlocked via secret code
// ============================================
const directorsCutController = new DirectorsCutController(eventBus, stateManager);

// ============================================
// Dev Commentary System - Aaron's Director's Cut 📝
// "The DVD commentary track for the game."
// Behind-the-scenes design stories, unlocked via CHICHARON
// ============================================
const devCommentarySystem = new DevCommentarySystem(eventBus, stateManager);

// ============================================
// Status Notification Controller - Toast System 📢
// \"User feedback is essential for good UX.\"
// Unified notification system for status bar
// DIZEE Implementation
// ============================================
const statusNotificationController = new StatusNotificationController(eventBus, stateManager);

const dialogController = new DialogController(settingsSystem, eventBus);
const dialogBubble = new DialogBubble(eventBus); // DIZEE: Internal thought bubbles
const autoReadController = new AutoReadController(eventBus, settingsSystem);
const keyboardController = new KeyboardController(eventBus);

// Initialize Mobile UX
const swipeHandler = new SwipeHandler(document.body, eventBus, settingsSystem);
const mobileUXController = new MobileUXController(eventBus);

// Achievement & Tutorial Systems
const achievementSystem = new AchievementSystem(eventBus, stateManager);
// AchievementToast removed - NotificationRail handles achievement:unlocked
const tutorialController = new TutorialController(eventBus, stateManager);
const _tipsOverlay = new TipsOverlay(eventBus);

// Back Button Manager (Android Hierarchy Port)
import { BackButtonManager } from '@systems/BackButtonManager';
const backButtonManager = new BackButtonManager(eventBus);
backButtonManager.init();

const spriteController = new SpriteController(eventBus, stateManager);

const bootstrapTracker = new BootstrapTracker(stateManager); // Needed for SecretCodesSystem
// Secret Codes & Collectibles (Initialize BEFORE UI components that depend on them)
const secretCodesSystem = new SecretCodesSystem(eventBus, stateManager, bootstrapTracker);
const collectiblesSystem = new CollectiblesSystem(eventBus);

// ============================================
// Shell Detection
// ============================================
// Detect if running in shell mode (iframe) — V2 always creates its own chrome
const isInShell = window.parent !== window;
console.log(`[V2] Running in ${isInShell ? 'SHELL (own chrome)' : 'STANDALONE'} mode`);

// ============================================
// Global UI Components
// ============================================
const _settingsModal = new SettingsModal(eventBus, settingsSystem);

// Chrome components — always created (shell hides its chrome via customChrome flag)
const _statusBar = new StatusBar(eventBus);
const _sidebar = new Sidebar(eventBus, stateManager, collectiblesSystem, isInShell);
const _notificationShade = new NotificationShade(eventBus, isInShell);
console.log('[V2] Chrome created (StatusBar, Sidebar, NotificationShade)');

// Shell exit: send postMessage to parent when user wants to return to shell
eventBus.on('shell:exit', () => {
    if (isInShell) {
        window.parent.postMessage({ type: 'v2:navigate:shell' }, '*');
        console.log('[V2] Sent exit-to-shell message');
    }
});

// Game-specific screens (always created)
const _creditsScreen = new CreditsScreen(eventBus);
const _crewScreen = new CrewScreen(eventBus);

// TORI'S FIX: Initialize GrabHandleRepositioner AFTER Sidebar
import { GrabHandleRepositioner } from '@controllers/GrabHandleRepositioner';
// Use setTimeout to ensure DOM is fully ready, just in case
setTimeout(() => {
    new GrabHandleRepositioner(eventBus);
}, 0);

const _notesViewer = new NotesViewer(eventBus, collectiblesSystem);
// ToastNotification removed - using NotificationRail via eventBus.emit('notification:show', ...)
const _saveLoadModal = new SaveLoadModal(eventBus, saveSystem, stateManager); // V2: Save/Load UI
const _backlogUI = new BacklogUI(gameEngine.backlogManager, eventBus); // V2: Backlog UI
const _notificationRail = initializeNotificationRail(eventBus); // Phase 26d: Notification Rail

// Silence unused warnings by logging
console.log('UI Modules Active:', {
    _settingsModal, _statusBar, _sidebar, _creditsScreen, _crewScreen,
    _notesViewer, _saveLoadModal, _backlogUI, _notificationRail, _notificationShade,
    autoReadController, keyboardController, swipeHandler, mobileUXController,
    achievementSystem, tutorialController, _tipsOverlay
});

declare global {
    interface Window {
        game: any;
        collectiblesSystem: any;
        saveSystem: any;
    }
}

(window as any).secretCodesManager = secretCodesSystem;
(window as any).collectiblesSystem = collectiblesSystem;
(window as any).saveSystem = saveSystem;
(window as any).telemetry = telemetryRecorder;
(window as any).macroRunner = macroRunner;

console.log('UI initialized', {
    _settingsModal,
    _statusBar,
    _sidebar,
    secretCodesSystem,
    collectiblesSystem,
    hapticSystem
});

// ... (Mobile UX initialized above)

// ============================================
// App State
// ============================================
const app = document.getElementById('app');
if (!app) throw new Error('No #app element found');

type Screen = { unmount: () => void };
let currentScreen: Screen | null = null;
let gameLayout: GameLayout | null = null;
let isPaused = false;

// ============================================
// Screen Management
// ============================================

function clearScreen() {
    if (currentScreen) {
        currentScreen.unmount();
        currentScreen = null;
    }
    // Clear app container
    app!.innerHTML = '';
}

// ============================================
// Boot Sequence
// ============================================

import { BootSequenceController } from '@controllers/BootSequenceController';

async function executeBootSequence(): Promise<void> {
    const bootController = new BootSequenceController(eventBus, gameEngine);
    await bootController.start();
}


function showMainMenu() {
    clearScreen();
    const menu = new MainMenu(eventBus);
    // Wire LoopController for dynamic title/subtitle/footer updates
    menu.setLoopController(loopController);
    menu.mount(app!);
    currentScreen = menu;
    eventBus.emit('ui:show_status_bar', {});
    console.log('[UV7 V2] Main Menu');
}

function showRouteSelect() {
    clearScreen();
    const routeSelect = new RouteSelect(eventBus);
    routeSelect.mount(app!);
    currentScreen = routeSelect;
    console.log('[UV7 V2] Route Select');
}



function showCredits() {
    // V2: CreditsScreen component handles its own display via EventBus
    // The CreditsScreen listens for 'ui:show_credits' and manages everything internally
    eventBus.emit('ui:show_credits', {});
    console.log('[UV7 V2] Credits');
}

// showLoadMenu - Now handled by SaveLoadModal component
// The modal is triggered via EventBus 'ui:load_menu' and 'ui:save_menu' events

// ============================================
// Gameplay
// ============================================

async function startGameplay(mode: 'ronnie' | 'tori' | 'prologue') {
    // Show loader
    eventBus.emit('loading:start', {});

    // Small delay to ensure loader is visible before blocking operations
    await new Promise(r => setTimeout(r, 100));

    clearScreen();

    stateManager.set('currentRoute', mode === 'prologue' ? null : mode);
    stateManager.set('tetherLevel', 100);
    stateManager.set('history', []);

    // Create game layout
    gameLayout = new GameLayout('app', eventBus);

    // Create effects layer (attaches to DOM via constructor)
    if (gameLayout) {
        new VisualEffectsLayer(
            gameLayout.viewport,
            gameLayout.viewport,
            eventBus
        );

        // TORI'S FIX: Trigger code rain AFTER effects layer exists (route games only)
        if (mode !== 'prologue') {
            eventBus.emit('effect:code_rain', { duration: 1200 });
        }

        // Set up sprite controller viewport
        spriteController.setViewport(gameLayout.viewport);

        // Set up dialog controller to update UI
        dialogController.onTextUpdate((text) => {
            if (gameLayout) {
                gameLayout.dialogText.textContent = text;
            }
        });

        // Click on viewport advances dialog OR hides bubble
        gameLayout.viewport.addEventListener('click', () => {
            console.log('[CLICK] Viewport clicked', { bubbleVisible: dialogBubble.isVisible() });
            // DIZEE: If bubble is visible, hide it and advance
            if (dialogBubble.isVisible()) {
                console.log('[CLICK] Hiding bubble and advancing scene');
                dialogBubble.hide();
                // For internal thoughts, manually trigger advance since DialogController isn't active
                eventBus.emit('dialog:advance', {});
            } else {
                console.log('[CLICK] Calling dialogController.handleClick()');
                dialogController.handleClick();
            }
        });

        // Click on dialog box also advances (V1 parity)
        gameLayout.dialogBox.addEventListener('click', () => {
            console.log('[CLICK] Dialog box clicked', { bubbleVisible: dialogBubble.isVisible() });
            if (dialogBubble.isVisible()) {
                console.log('[CLICK] Hiding bubble and advancing scene');
                dialogBubble.hide();
                eventBus.emit('dialog:advance', {});
            } else {
                console.log('[CLICK] Calling dialogController.handleClick()');
                dialogController.handleClick();
            }
        });
    }

    // Set up gameplay screen
    currentScreen = {
        unmount: () => {
            const root = document.getElementById('app');
            if (root) root.innerHTML = '';
            gameLayout = null;
            dialogController.destroy();
            spriteController.hideAllSprites();
        }
    };

    // Determine first scene based on mode
    const firstSceneId = mode === 'ronnie'
        ? 'ronnie_act1_prologueScene4'
        : mode === 'tori'
            ? 'scene1_coffee'
            : 'scene1_streetBump';

    if (mode === 'prologue') {
        // Prologue loads immediately
        await gameEngine.loadScene(firstSceneId);
        eventBus.emit('loading:end', {});
        console.log('[UV7 V2] Starting prologue');
    } else {
        // Route games delay for code rain effect
        setTimeout(async () => {
            await gameEngine.loadScene(firstSceneId);
            eventBus.emit('loading:end', {});
            console.log(`[UV7 V2] Starting game: ${mode} route`);
        }, 900);
    }
}

function updateBackground(path: string | undefined) {
    if (!gameLayout || !path) return;
    gameLayout.viewport.style.backgroundImage = `url(${path})`;
    gameLayout.viewport.style.backgroundSize = 'cover';
    gameLayout.viewport.style.backgroundPosition = 'center';
}

function updateSprites(sprites: Array<{ position?: string; variant?: string; id?: string }> | undefined) {
    if (!gameLayout || !sprites) return;

    // Check if this is an echo group scene
    const hasEchoSprites = sprites.some(s =>
        s.id?.includes('echo') || s.id?.includes('despair') ||
        s.variant?.includes('echo') || s.variant?.includes('despair')
    );

    if (hasEchoSprites) {
        // Use SpriteController for echo group
        spriteController.displayEchoGroup();

        // Check current act for growth stage
        const currentScene = stateManager.get<string>('currentScene') ?? '';
        if (currentScene.includes('act1') || currentScene.includes('Act1')) {
            spriteController.setEchoGrowthStage('act1');
        } else if (currentScene.includes('act2') || currentScene.includes('Act2')) {
            spriteController.setEchoGrowthStage('act2');
        } else if (currentScene.includes('act3') || currentScene.includes('Act3')) {
            spriteController.setEchoGrowthStage('act3');
        }
    } else {
        // Use SpriteController for standard sprites
        for (const sprite of sprites) {
            if (sprite.position === 'left' && sprite.variant) {
                spriteController.showSprite('left', sprite.variant);
            } else if (sprite.position === 'right' && sprite.variant) {
                spriteController.showSprite('right', sprite.variant);
            }
        }
    }
}

let choiceKeyHandler: ((e: KeyboardEvent) => void) | null = null;

function showChoices(choices: Array<{ text: string; next: string | null }>) {
    if (!gameLayout) return;

    // Remove existing handler if any (safety)
    if (choiceKeyHandler) {
        document.removeEventListener('keydown', choiceKeyHandler);
        choiceKeyHandler = null;
    }

    // Create choice container
    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'choice-container';
    choiceContainer.style.cssText = `
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 100;
    `;

    // Define cleanup function
    const cleanup = () => {
        if (choiceKeyHandler) {
            document.removeEventListener('keydown', choiceKeyHandler);
            choiceKeyHandler = null;
        }
        choiceContainer.remove();
    };

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.textContent = `${index + 1}. ${choice.text}`; // Add number prefix
        btn.style.cssText = `
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #0ff;
            color: #0ff;
            padding: 1rem 2rem;
            font-family: 'Courier New', monospace;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0, 255, 255, 0.2)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(0, 0, 0, 0.8)';
        });
        btn.addEventListener('click', () => {
            cleanup();
            gameEngine.selectChoice(index);
        });
        choiceContainer.appendChild(btn);
    });

    // Keyboard Handler
    choiceKeyHandler = (e: KeyboardEvent) => {
        const key = parseInt(e.key);
        if (!isNaN(key) && key > 0 && key <= choices.length) {
            cleanup();
            gameEngine.selectChoice(key - 1);
        }
    };
    document.addEventListener('keydown', choiceKeyHandler);

    gameLayout.viewport.appendChild(choiceContainer);
}



// ============================================
// Event Handlers
// ============================================

// ========================================
// Event Handlers (Extracted to Controllers)
// ========================================

// Input Controller - F5/F9 quick save/load, keyboard shortcuts, haptic feedback
const inputController = new InputController(
    eventBus,
    saveSystem,
    dialogController,
    dialogBubble,
    () => isPaused
);

// System Event Handlers - Game event listeners (scene:load, dialog:show, etc.)
const systemEventHandlers = new SystemEventHandlers(
    eventBus,
    gameEngine,
    dialogController,
    spriteController,
    dialogBubble,
    () => gameLayout,
    updateBackground,
    updateSprites,
    showChoices,
    showMainMenu
);

// Navigation event handlers (remain in main.ts for now - simple wiring)
function setupNavigationHandlers() {
    eventBus.on('ui:route_select', showRouteSelect);
    eventBus.on('ui:main_menu', showMainMenu);
    eventBus.on('ui:settings', () => eventBus.emit('settings:open', {}));
    eventBus.on('ui:credits', showCredits);

    // Gameplay start events
    eventBus.on('ui:start_game', (data) => {
        startGameplay(data.route);
    });

    eventBus.on('ui:start_prologue', () => {
        startGameplay('prologue');
    });
}

// ============================================
// Initialize
// ============================================

async function init() {
    console.log('[UV7 V2] Starting...');

    // Initialize game engine
    await gameEngine.init();

    // Load all route content
    console.log('[UV7 V2] Loading route content...');
    contentLoader.parseAndRegister(prologueData as { scenes: any[] });
    contentLoader.parseAndRegister(ronnieAct1Data as { scenes: any[] });
    contentLoader.parseAndRegister(ronnieAct2Data as { scenes: any[] });
    contentLoader.parseAndRegister(ronnieAct3Data as { scenes: any[] });
    contentLoader.parseAndRegister(toriAct1Data as { scenes: any[] });
    contentLoader.parseAndRegister(toriAct2Data as { scenes: any[] });
    contentLoader.parseAndRegister(toriAct3Data as { scenes: any[] });
    console.log('[UV7 V2] Route content loaded');

    // Set up event handlers (extracted to controllers)
    setupNavigationHandlers();
    inputController.setup();
    systemEventHandlers.setup();

    // Show splash screen
    await executeBootSequence();

    // ═══════════════════════════════════════════════════════════════
    // UV7 OS INSTANT RESUME - ZEERAH'S ARCHITECTURE
    // Check if we're resuming from app switcher
    // ═══════════════════════════════════════════════════════════════
    const resumeFlag = localStorage.getItem('uv7-auto-resume');
    if (resumeFlag === 'v2') {
        console.log('[UV7 V2] 🚀 Instant Resume detected from App Switcher');
        localStorage.removeItem('uv7-auto-resume');
        localStorage.removeItem('uv7-resume-timestamp');

        // Try to load the last save
        const hasSave = saveSystem.hasAutoSave();
        if (hasSave) {
            // Load auto-save directly
            const success = await saveSystem.loadAutoSave();

            if (success) {
                console.log('[UV7 V2] ✅ Instant Resume successful - skipping menu');
                eventBus.emit('notification:show', {
                    id: 'quick-resume',
                    title: '⚡ QUICK RESUME',
                    message: 'Welcome back to the loop...',
                    icon: '🔄',
                    category: 'system',
                    priority: 'normal',
                    duration: 3000,
                });
                // Don't show main menu - game is already loaded via SaveSystem
                return;
            } else {
                console.warn('[UV7 V2] ⚠️ Instant Resume failed - showing menu');
            }
        } else {
            console.log('[UV7 V2] No save found for Instant Resume - showing menu');
        }
    }

    // Initialize global visual effects layer (for cross-screen transitions)
    // DIZEE FIX: Attach to document.body so clearScreen() (which clears #app) doesn't destroy the effects!
    new VisualEffectsLayer(document.body, document.body, eventBus);

    // Trigger transition effect (V1 Parity) - Start rain FIRST
    // duration=2000ms (V1) - The opacity/z-index fix should make this visible now
    eventBus.emit('effect:code_rain', { duration: 2000 });

    // Show main menu (normal flow or fallback) - Delay to let rain cover screen
    setTimeout(() => {
        showMainMenu();
    }, 100);

    // Setup debug interface (extracted to DebugInterface.ts)
    DebugInterface.initialize(
        {
            eventBus,
            stateManager,
            gameEngine,
            settingsSystem,
            contentLoader,
            dialogController,
            spriteController,
            loopController,
            echoMemorySystem,
            insaneVisualsController,
            tetherSystem,
            easterEggController,
            directorsCutController,
            devCommentarySystem,
            statusNotificationController,
            notificationRail: _notificationRail,
        },
        {
            showRoute: showRouteSelect,
            showMenu: showMainMenu,
            startGame: startGameplay,
        }
    );
}

// Start the app
init().catch(console.error);
