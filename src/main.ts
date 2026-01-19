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
import { SettingsSystem } from '@systems/SettingsSystem';
import { SecretCodesManager } from '@systems/SecretCodesManager';
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
import { AchievementManager } from '@systems/AchievementManager';
// AchievementToast removed - NotificationRail now handles achievement:unlocked
import { TutorialController } from '@controllers/TutorialController';
import { LoopController } from '@controllers/LoopController';
import { EchoMemorySystem } from '@systems/EchoMemorySystem';
import { InsaneVisualsController } from '@controllers/InsaneVisualsController';
import { TetherSystem } from '@systems/TetherSystem';
import { EasterEggController } from '@controllers/EasterEggController';
import { DirectorsCutController } from '@controllers/DirectorsCutController';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';
import { StatusNotificationController } from '@systems/StatusNotificationController';
// AchievementToast import removed - see line 24
import { TipsOverlay } from '@ui/components/TipsOverlay';
import { MainMenu } from '@ui/screens/MainMenu';
import { RouteSelect } from '@ui/screens/RouteSelect';
import { PauseScreen } from '@ui/screens/PauseScreen';
import { GameLayout } from '@ui/components/GameLayout';
import { VisualEffectsLayer } from '@ui/components/VisualEffectsLayer';
import { SettingsModal } from '@ui/components/SettingsModal';
import { StatusBar } from '@ui/components/StatusBar';
import { Sidebar } from '@ui/components/Sidebar';
import { NotesViewer } from '@ui/components/NotesViewer';
import '@core/ErrorBoundary'; // Auto-initializes global error handler
import { LoadingOverlay } from '@ui/components/LoadingOverlay';
import '@ui/styles/main.css';
import '@ui/styles/notes-viewer.css';
import '@ui/styles/error-boundary.css';
import '@ui/styles/loading-overlay.css';
import '@ui/styles/accessibility.css';
import '@ui/styles/dialog-bubble.css'; // DIZEE: Internal thought bubbles
import '@ui/styles/save-load-modal.css'; // V2: Save/Load UI styles
import '@ui/styles/backlog-ui.css'; // V2: Backlog UI styles
// UV7 OS App Switcher is initialized in StatusBar.ts

import { CreditsScreen } from '@ui/screens/CreditsScreen';
import { CrewScreen } from '@ui/screens/CrewScreen';
import { SaveSystem } from '@systems/SaveSystem';
// ToastNotification removed - using NotificationRail via EventBus instead
import { GameConfig } from '@core/GameConfig';
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

// Asset Imports
import logoImg from '../assets/UnitedVoices7.png';
// import introVideoParams from '../UnitedVoices7.mp4?url'; // Unused
import introVideo from '../UnitedVoices7.mp4';

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
const notificationShade = new NotificationShade(eventBus);

// Achievement & Tutorial Systems
const achievementManager = new AchievementManager(eventBus, stateManager);
// AchievementToast removed - NotificationRail handles achievement:unlocked
const tutorialController = new TutorialController(eventBus, stateManager);
const _tipsOverlay = new TipsOverlay(eventBus);

const spriteController = new SpriteController(eventBus, stateManager);

// Global UI Components
const _settingsModal = new SettingsModal(eventBus, settingsSystem);
const _statusBar = new StatusBar(eventBus);
const _sidebar = new Sidebar(eventBus);
const _creditsScreen = new CreditsScreen(eventBus);
const _crewScreen = new CrewScreen(eventBus);

// TORI'S FIX: Initialize GrabHandleRepositioner AFTER Sidebar
import { GrabHandleRepositioner } from '@controllers/GrabHandleRepositioner';
// Use setTimeout to ensure DOM is fully ready, just in case
setTimeout(() => {
    new GrabHandleRepositioner(eventBus);
}, 0);

// Secret Codes & Collectibles
const secretCodesManager = new SecretCodesManager(eventBus);
const collectiblesSystem = new CollectiblesSystem(eventBus);
const _notesViewer = new NotesViewer(eventBus, collectiblesSystem);
// ToastNotification removed - using NotificationRail via eventBus.emit('notification:show', ...)
const _saveLoadModal = new SaveLoadModal(eventBus, saveSystem, stateManager); // V2: Save/Load UI
const _backlogUI = new BacklogUI(gameEngine.backlogManager, eventBus); // V2: Backlog UI
const _notificationRail = initializeNotificationRail(eventBus); // Phase 26d: Notification Rail

// Silence unused warnings by logging
console.log('UI Modules Active:', {
    _settingsModal, _statusBar, _sidebar, _creditsScreen, _crewScreen,
    _notesViewer, _saveLoadModal, _backlogUI, _notificationRail,
    autoReadController, keyboardController, swipeHandler, mobileUXController, notificationShade,
    achievementManager, tutorialController, _tipsOverlay
});

declare global {
    interface Window {
        game: any;
        collectiblesSystem: any;
        saveSystem: any;
    }
}

(window as any).secretCodesManager = secretCodesManager;
(window as any).collectiblesSystem = collectiblesSystem;
(window as any).saveSystem = saveSystem;
(window as any).telemetry = telemetryRecorder;
(window as any).macroRunner = macroRunner;

console.log('UI initialized', {
    _settingsModal,
    _statusBar,
    _sidebar,
    secretCodesManager,
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
let pauseScreen: PauseScreen | null = null;
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

// Boot Sequence Wrapper
// Boot Sequence Wrapper
// Boot Sequence Wrapper
function showSplash(): Promise<void> {
    return new Promise(async (resolve) => {
        // Creates the FULL V1 structure required by bougie-boot-sequence.css
        const splashContainer = document.createElement('div');
        splashContainer.id = 'uv7-splash';

        // Initialize Loading Overlay (Global)
        new LoadingOverlay('app', eventBus);

        // V1 Structure: Container -> Logo Section (img+video) + Terminal
        splashContainer.innerHTML = `
            <div class="uv7-container">
                <!-- Logo Section -->
                <div class="uv7-logo-section">
                    <div class="powered-by-text">Powered by</div>
                    
                    <!-- Static Logo Fallback (Hidden by default via CSS) -->
                    <img src="${logoImg}" class="uv7-logo-static" alt="United Voices 7 Logo">
                    
                    <!-- Animated Reveal Video (Width controlled by JS) -->
                    <div class="uv7-logo-wrap loading" id="uv7-logo-wrap">
                        <div class="uv7-logo-reveal" id="uv7-logo-reveal">
                            <video id="uv7-logo-video" class="uv7-logo-video" preload="auto" muted playsinline>
                                <source src="${introVideo}" type="video/mp4">
                            </video>
                        </div>
                    </div>
                </div>

                <!-- Boot Terminal -->
                <div id="boot-terminal" class="boot-terminal"></div>
            </div>

            <!-- Skip Button -->
            <button id="uv7-skip-button" class="uv7-skip-btn">
                SKIP <span class="skip-arrow">→</span>
            </button>
            <div class="boot-skip-hint" style="opacity: 0; transition: opacity 2s ease;">PRESS SPACE OR ENTER</div>
        `;

        app!.appendChild(splashContainer);

        const terminalElement = splashContainer.querySelector('#boot-terminal') as HTMLElement;
        const skipButton = splashContainer.querySelector('#uv7-skip-button') as HTMLElement;
        const skipHint = splashContainer.querySelector('.boot-skip-hint') as HTMLElement;
        const video = splashContainer.querySelector('#uv7-logo-video') as HTMLVideoElement;

        // V2 Polish: Fade in skip hint after 3 seconds
        setTimeout(() => {
            if (skipHint) skipHint.style.opacity = '0.7';
        }, 3000);
        const videoWrap = splashContainer.querySelector('#uv7-logo-wrap') as HTMLElement;
        const videoReveal = splashContainer.querySelector('#uv7-logo-reveal') as HTMLElement;
        const logoSection = splashContainer.querySelector('.uv7-logo-section') as HTMLElement;

        // V1 Video Logic: Freeze frame
        video.onloadeddata = () => {
            // Seek to first frame and pause
            video.currentTime = 0.01;
            video.pause();
        };

        // Fallback if video fails
        video.onerror = () => {
            console.warn('Video failed to load, switching to static logo fallback');
            if (logoSection) logoSection.classList.add('fallback-mode');
        };

        video.load();

        // Use the new BougieBootSequence
        const { BootSequence } = await import('@ui/components/BootSequence');

        const boot = new BootSequence(
            terminalElement,
            gameEngine,
            (percent) => {
                // Video Reveal Logic (Ported from V1)
                // Update width for Left-to-Right wipe
                if (videoReveal) {
                    videoReveal.style.width = `${Math.min(100, Math.max(0, percent))}%`;

                    // Update shimmer speed based on progress (V1 polish)
                    if (percent < 70) videoReveal.style.setProperty('--shimmer-speed', '1.5s');
                    else if (percent < 90) videoReveal.style.setProperty('--shimmer-speed', '1.0s');
                    else videoReveal.style.setProperty('--shimmer-speed', '0.6s');
                }
            }
        );

        // Bind Skip Button
        const handleSkip = () => {
            boot.skip();
            // On skip, show full video immediately
            if (videoReveal) videoReveal.style.width = '100%';
            if (video) video.currentTime = video.duration;
        };

        skipButton.addEventListener('click', handleSkip);

        // Bind Keyboard Skip
        const keyHandler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                handleSkip();
                document.removeEventListener('keydown', keyHandler);
            }
        };
        document.addEventListener('keydown', keyHandler);

        await boot.start();

        // Completion (Boot finished)
        if (videoWrap) {
            videoWrap.classList.remove('loading');
            videoWrap.classList.add('ready');
        }

        // Play the video animation now that it's fully revealed
        if (video) {
            video.currentTime = 0; // Reset to start
            video.play().catch(() => { });
        }

        // Wait for video animation to be visible before fading out
        await new Promise(r => setTimeout(r, 2000));

        // Fade out splash
        splashContainer.style.opacity = '0';
        splashContainer.style.transition = 'opacity 0.5s ease-out';

        // Code rain transition will be triggered by init() after MainMenu mounts


        setTimeout(() => {
            splashContainer.remove();
            resolve();
        }, 500);
    });
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

async function startGame(route: 'ronnie' | 'tori') {
    // Show loader
    eventBus.emit('loading:start', {});

    // Small delay to ensure loader is visible before blocking operations
    await new Promise(r => setTimeout(r, 100));

    clearScreen();

    stateManager.set('currentRoute', route);
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

        // TORI'S FIX: Trigger code rain AFTER effects layer exists
        eventBus.emit('effect:code_rain', { duration: 1200 });

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

    // Load first scene based on route
    const firstSceneId = route === 'ronnie' ? 'ronnie_act1_prologueScene4' : 'scene1_coffee';

    // TORI'S FIX: Delay the initial scene load so the rain is actually seen
    setTimeout(async () => {
        await gameEngine.loadScene(firstSceneId);
        // Hide loader
        eventBus.emit('loading:end', {});
        console.log(`[UV7 V2] Starting game: ${route} route`);
    }, 900);
}

async function startPrologue() {
    // Show loader
    eventBus.emit('loading:start', {});

    // Small delay to ensure loader is visible before blocking operations
    await new Promise(r => setTimeout(r, 100));

    clearScreen();

    // Set temporary route as 'prologue'
    stateManager.set('currentRoute', null);
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

    // Load first scene of prologue
    const firstSceneId = 'scene1_streetBump'; // First scene in prologue.json
    await gameEngine.loadScene(firstSceneId);

    // Hide loader
    eventBus.emit('loading:end', {});

    console.log('[UV7 V2] Starting prologue');
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

function togglePause() {
    if (!gameLayout) return; // Not in gameplay

    isPaused = !isPaused;

    if (isPaused) {
        pauseScreen = new PauseScreen(eventBus);
        pauseScreen.mount(app!);
    } else {
        pauseScreen?.unmount();
        pauseScreen = null;
    }
}

// ============================================
// Event Handlers
// ============================================

function setupEventHandlers() {
    document.addEventListener('keydown', (e) => {
        // Quick Save (F5)
        if (e.key === 'F5') {
            e.preventDefault();
            const slot = GameConfig.SAVE.QUICKSAVE_SLOT || 9;
            saveSystem.saveGame(slot, 'Quick Save').then(success => {
                if (success) {
                    eventBus.emit('notification:show', {
                        id: 'quick-save',
                        title: 'QUICK SAVE',
                        message: 'Timeline preserved',
                        icon: '💾',
                        category: 'autosave',
                        priority: 'normal',
                        duration: 2000,
                    });
                } else {
                    eventBus.emit('notification:show', {
                        id: 'save-error',
                        title: 'ERROR',
                        message: 'Save failed',
                        icon: '❌',
                        category: 'system',
                        priority: 'high',
                    });
                }
            });
        }

        // Quick Load (F9)
        if (e.key === 'F9') {
            e.preventDefault();
            const slot = GameConfig.SAVE.QUICKSAVE_SLOT || 9;
            if (saveSystem.hasSlot(slot)) {
                saveSystem.loadGame(slot).then(success => {
                    if (success) {
                        eventBus.emit('notification:show', {
                            id: 'quick-load',
                            title: 'QUICK LOAD',
                            message: 'Timeline restored',
                            icon: '🔄',
                            category: 'system',
                            priority: 'normal',
                            duration: 2000,
                        });
                    }
                });
            } else {
                eventBus.emit('notification:show', {
                    id: 'no-save',
                    title: 'NO SAVE',
                    message: 'No quick save found',
                    icon: '⚠️',
                    category: 'system',
                    priority: 'normal',
                });
            }
        }
    });

    // Navigation
    eventBus.on('ui:route_select', showRouteSelect);
    eventBus.on('ui:main_menu', showMainMenu);
    eventBus.on('ui:settings', () => eventBus.emit('settings:open', {}));
    eventBus.on('ui:credits', showCredits);
    // ui:load_menu and ui:save_menu are now handled by SaveLoadModal component

    // Gameplay
    eventBus.on('ui:start_game', (data) => {
        startGame(data.route);
    });

    eventBus.on('ui:start_prologue', () => {
        startPrologue();
    });

    eventBus.on('ui:pause_toggle', togglePause);

    // Scene loading - update UI with scene data
    eventBus.on('scene:load', ({ sceneId }) => {
        const scene = gameEngine.getCurrentScene();
        if (!scene || !gameLayout) return;

        // DIZEE: Handle internal thoughts with bubble system
        const isInternal = (scene as any).isInternal === true;

        if (isInternal) {
            // Hide standard dialogue UI for internal thoughts
            gameLayout.dialogBox.style.display = 'none';

            // TODO: Determine bubble position based on active sprite (reserved for future use)
            // Currently bubble position is fixed at center

            // Don't show bubble yet - wait for dialog:show event
        } else {
            // Show standard dialogue UI
            gameLayout.dialogBox.style.display = 'block';
            dialogBubble.hide(); // Clear any existing bubble

            // Update character name
            const speaker = scene.character || 'Narration';
            gameLayout.dialogName.textContent = speaker;

            // Color based on character
            const speakerLower = speaker.toLowerCase();
            if (speakerLower.includes('ronnie')) {
                gameLayout.dialogName.style.color = '#0ff';
            } else if (speakerLower.includes('tori')) {
                gameLayout.dialogName.style.color = '#f0f';
            } else if (speakerLower.includes('echo 1')) {
                gameLayout.dialogName.style.color = '#88f';
            } else if (speakerLower.includes('echo 2')) {
                gameLayout.dialogName.style.color = '#8f8';
            } else if (speakerLower.includes('despair')) {
                gameLayout.dialogName.style.color = '#f88';
            } else {
                gameLayout.dialogName.style.color = '#fff';
            }
        }

        // Update background if specified
        if (scene.background) {
            updateBackground(scene.background);
        }

        // Update sprites if specified
        if (scene.sprites) {
            updateSprites(scene.sprites);
        }

        // DIZEE: Handle scene effects (fadeSpritesSequence, etc.)
        console.log('[DIZEE] Checking for effects:', { sceneId, hasEffects: !!(scene.effects), effects: scene.effects });
        if (scene.effects && scene.effects.length > 0) {
            scene.effects.forEach(effect => {
                console.log('[DIZEE] Processing effect:', effect);
                if (effect.type === 'fadeSpritesSequence') {
                    console.log('[DIZEE] Triggering fadeSpritesSequence with 200ms delay');
                    // Delay effect to ensure sprites are rendered
                    setTimeout(() => {
                        console.log('[DIZEE] Executing fadeSpritesSequence now');
                        spriteController.fadeSpritesSequence(
                            (effect as any).position || 'left',
                            (effect as any).sprite1,
                            (effect as any).sprite2,
                            effect.duration || 4000
                        );
                    }, 200);
                }
            });
        }

        // Highlight active speaker (unless internal)
        if (!isInternal) {
            spriteController.highlightSpeaker(scene.character || 'Narration');
        }

        console.log(`[UV7 V2] Scene loaded: ${sceneId}${isInternal ? ' (internal)' : ''}`);
    });

    // Dialog display - use DialogController for typewriter OR bubble for internal
    eventBus.on('dialog:show', ({ entry }) => {
        if (!gameLayout) return;

        const scene = gameEngine.getCurrentScene();
        const isInternal = (scene as any)?.isInternal === true;

        if (isInternal) {
            // Show as floating thought bubble
            let position: 'left' | 'center' | 'right' = 'center';
            if (scene?.sprites) {
                const spriteArray = Array.isArray(scene.sprites) ? scene.sprites : [scene.sprites];
                const hasLeft = spriteArray.some(s => s.position === 'left' || (s as any).left);
                const hasRight = spriteArray.some(s => s.position === 'right' || (s as any).right);

                if (hasLeft && !hasRight) position = 'left';
                else if (hasRight && !hasLeft) position = 'right';
            }

            dialogBubble.show({
                text: entry.text,
                position,
                duration: 0 // Manual dismiss (advance with click/key)
            });

            // Still emit complete event so player can advance
            setTimeout(() => {
                eventBus.emit('dialog:complete', {});
            }, 100);
        } else {
            // Standard dialogue box with typewriter
            dialogController.show(entry.text);
        }
    });

    // Dialog complete - check for choices
    eventBus.on('dialog:complete', () => {
        const scene = gameEngine.getCurrentScene();
        if (scene?.choices && scene.choices.length > 0) {
            eventBus.emit('choice:show', { choices: scene.choices });
            showChoices(scene.choices);
        }
    });

    // Scene complete - handle end of route
    eventBus.on('scene:complete', ({ sceneId }) => {
        console.log(`[UV7 V2] Route ended at: ${sceneId}`);
        // For now, return to main menu after a delay
        setTimeout(() => {
            showMainMenu();
        }, 2000);
    });

    // Tether changes
    eventBus.on('tether:change', (data) => {
        if (gameLayout) {
            gameLayout.updateTether(data.level);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameLayout) {
            togglePause();
        }
        // Space/Enter to advance dialog OR hide bubble
        if ((e.key === ' ' || e.key === 'Enter') && gameLayout && !isPaused) {
            console.log('[KEYPRESS] Space/Enter pressed', { bubbleVisible: dialogBubble.isVisible() });
            // DIZEE: If bubble is visible, hide it first
            if (dialogBubble.isVisible()) {
                console.log('[KEYPRESS] Hiding bubble and advancing scene');
                dialogBubble.hide();
                // For internal thoughts, manually trigger advance since DialogController isn't active
                eventBus.emit('dialog:advance', {});
            } else {
                console.log('[KEYPRESS] Calling dialogController.handleClick()');
                dialogController.handleClick();
            }
        }
    });

    // Click feedback
    eventBus.on('ui:click', () => {
        if (navigator.vibrate) navigator.vibrate(10);
    });

    eventBus.on('ui:confirm', () => {
        if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
    });

    eventBus.on('ui:denied', () => {
        if (navigator.vibrate) navigator.vibrate([50, 20, 50]);
    });

    // ========================================
    // Echo Memory System - Comment Display
    // Belle's meta-awareness notifications 🖤
    // ========================================
    eventBus.on('echo:comment', (data) => {
        // Map echo type to priority (despair = urgent, others = normal)
        const echoPriority: Record<string, 'urgent' | 'high' | 'normal'> = {
            hope: 'normal',
            gentle: 'normal',
            despair: 'high'
        };

        eventBus.emit('notification:show', {
            id: `echo-${data.echo}-${Date.now()}`,
            title: `ECHO: ${data.echo.toUpperCase()}`,
            message: data.message,
            icon: data.icon,
            category: 'system',
            priority: echoPriority[data.echo] || 'normal',
            duration: 4000,
        });
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

    // Set up event handlers
    setupEventHandlers();

    // Show splash screen
    await showSplash();

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
    const effectsLayer = new VisualEffectsLayer(document.body, document.body, eventBus);

    // Trigger transition effect (V1 Parity) - Start rain FIRST
    // duration=2000ms (V1) - The opacity/z-index fix should make this visible now
    eventBus.emit('effect:code_rain', { duration: 2000 });

    // Show main menu (normal flow or fallback) - Delay to let rain cover screen
    setTimeout(() => {
        showMainMenu();
    }, 100);

    // Debug access
    if (typeof window !== 'undefined') {
        (window as any).uv7 = {
            eventBus,
            stateManager,
            gameEngine,
            settingsSystem,
            contentLoader,
            dialogController,
            spriteController,
            loopController, // ZEE: Meta-narrative tracking
            echoMemorySystem, // BELLE: Echo awareness tracking 🖤
            version: 'V2-beta',
            // Debug helpers
            showRoute: showRouteSelect,
            showMenu: showMainMenu,
            startGame,
            // Loop debug helpers
            breakLoop: () => loopController.break(),
            acceptLoop: () => loopController.accept(),
            incrementLoop: () => loopController.increment(),
            resetLoop: () => loopController.reset(),
            // Echo debug helpers (Belle's tools 🖤)
            echoAwareness: () => echoMemorySystem.getAwarenessLevels(),
            triggerEcho: (echo: 'hope' | 'gentle' | 'despair') => echoMemorySystem.triggerEchoComment(echo, 'general'),
            triggerConflictingEchoes: () => echoMemorySystem.triggerConflictingEchoes(),
            resetEchoMemory: () => echoMemorySystem.resetMemory(),
            // Insane Visuals debug helpers (DiZee's tools 💀)
            insaneVisualsController,
            activateInsane: () => insaneVisualsController.activate(),
            deactivateInsane: () => insaneVisualsController.deactivate(),
            triggerCorruption: (intensity?: 'light' | 'medium' | 'heavy' | 'maximum') =>
                insaneVisualsController.triggerCorruption(intensity),
            showCage: (callback?: () => void) => insaneVisualsController.showCageOverlay(callback),
            // Tether System debug helpers ⚡
            tetherSystem,
            getTether: () => tetherSystem.getLevel(),
            setTether: (level: number) => tetherSystem.setLevel(level),
            holdOn: () => tetherSystem.holdOn(),
            startDecay: () => tetherSystem.startDecay(),
            stopDecay: () => tetherSystem.stopDecay(),
            freezeTether: () => tetherSystem.freezeDecay(),
            resumeTether: () => tetherSystem.resumeDecay(),
            setDifficulty: (diff: 'comfort' | 'normal' | 'intense' | 'insane') => tetherSystem.setDifficulty(diff),
            // Easter Egg debug helpers 🥚
            easterEggController,
            // Director's Cut debug helpers 🎬
            directorsCutController,
            showDirectorsCut: () => directorsCutController.show(),
            unlockDirectorsCut: () => directorsCutController.unlock(),
            // Dev Commentary debug helpers 📝
            devCommentarySystem,
            showCommentary: () => devCommentarySystem.showAllCommentary(),
            unlockCommentary: () => devCommentarySystem.unlockCommentary(),
            // Status Notification debug helpers 📢
            statusNotificationController,
            showToast: (msg: string) => statusNotificationController.show({ message: msg }),
            showError: (msg: string) => statusNotificationController.showError(msg),
            showSave: () => statusNotificationController.showSave(),
            // Notification Rail debug helpers 🔔 (Phase 26d)
            notificationRail: _notificationRail,
            showNotification: (title: string, message: string, priority?: 'urgent' | 'high' | 'normal' | 'low') => {
                eventBus.emit('notification:show', {
                    id: `debug-${Date.now()}`,
                    title,
                    message,
                    priority: priority || 'normal',
                    category: 'system',
                });
            },
            testNotifications: () => {
                // Test all notification types
                eventBus.emit('notification:show', { id: 'test-1', title: 'System Alert', message: 'Normal priority notification', priority: 'normal', category: 'system' });
                setTimeout(() => eventBus.emit('notification:show', { id: 'test-2', title: 'Warning', message: 'High priority notification', priority: 'high', category: 'system' }), 500);
                setTimeout(() => eventBus.emit('notification:show', { id: 'test-3', title: 'Achievement!', message: 'You unlocked something!', priority: 'high', category: 'achievement' }), 1000);
                setTimeout(() => eventBus.emit('notification:show', { id: 'test-4', title: '⚠️ URGENT', message: 'Critical notification!', priority: 'urgent', category: 'tether' }), 1500);
            },
            clearNotifications: () => eventBus.emit('notification:clear_all', {}),
        };
        console.log('[UV7 V2] Debug: window.uv7 available');
    }
}

// Start the app
init().catch(console.error);
