/**
 * Version 848 V2 - Entry Point
 *
 * Clean TypeScript rebuild of the visual novel.
 * Boot sequence: Splash → Main Menu → Route Select → Gameplay
 */

import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { GameEngine } from '@core/GameEngine';
import { SettingsSystem } from '@systems/SettingsSystem';
import { SecretCodesManager } from '@systems/SecretCodesManager';
import { ContentLoader } from '@systems/ContentLoader';
import { CollectiblesSystem } from '@systems/CollectiblesSystem';
import { HapticSystem } from '@systems/HapticSystem';
import { DialogController } from '@controllers/DialogController';
import { SpriteController } from '@controllers/SpriteController';
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

import { CreditsScreen } from '@ui/screens/CreditsScreen';
import { SaveSystem } from '@systems/SaveSystem';
import { ToastNotification } from '@ui/components/ToastNotification';
import { GameConfig } from '@core/GameConfig';

// Import route JSON files (Vite handles these as static imports)
import prologueData from '@content/routes/prologue.json';
import ronnieAct1Data from '@content/routes/ronnie_act1.json';
import ronnieAct2Data from '@content/routes/ronnie_act2.json';
import ronnieAct3Data from '@content/routes/ronnie_act3.json';
import toriAct1Data from '@content/routes/tori_act1.json';
import toriAct2Data from '@content/routes/tori_act2.json';
import toriAct3Data from '@content/routes/tori_act3.json';

// ... imports

// ============================================
// Core Systems
// ============================================
const eventBus = new EventBus();
const stateManager = new StateManager({
    currentScene: 'none',
    currentRoute: null,
    tetherLevel: 100,
    flags: {},
    history: [],
    playtime: 0
});

const settingsSystem = new SettingsSystem(stateManager);
settingsSystem.init();

const saveSystem = new SaveSystem(stateManager, eventBus);
saveSystem.init();

const hapticSystem = new HapticSystem(eventBus, settingsSystem);

const gameEngine = new GameEngine(eventBus, stateManager);
const contentLoader = new ContentLoader(gameEngine);
const dialogController = new DialogController(settingsSystem, eventBus);

const spriteController = new SpriteController(eventBus, stateManager);

// Global UI Components
const _settingsModal = new SettingsModal(eventBus);
const _statusBar = new StatusBar(eventBus);
const _sidebar = new Sidebar(eventBus);
const _creditsScreen = new CreditsScreen(eventBus);

// Secret Codes & Collectibles
const secretCodesManager = new SecretCodesManager(eventBus);
const collectiblesSystem = new CollectiblesSystem(eventBus);
const _notesViewer = new NotesViewer(eventBus, collectiblesSystem);
const toastNotification = new ToastNotification(eventBus);

// Silence unused warnings by logging
console.log('UI Modules Active:', { _settingsModal, _statusBar, _sidebar, _creditsScreen, _notesViewer });

declare global {
    interface Window {
        game: any;
        collectiblesSystem: any;
        saveSystem: any;
    }
}

if (typeof window !== 'undefined') {
    (window as any).secretCodesManager = secretCodesManager;
    (window as any).collectiblesSystem = collectiblesSystem;
    (window as any).saveSystem = saveSystem;
}

console.log('UI initialized', {
    _settingsModal,
    _statusBar,
    _sidebar,
    secretCodesManager,
    collectiblesSystem,
    hapticSystem
});

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
                    <img src="assets/UnitedVoices7.png" class="uv7-logo-static" alt="United Voices 7 Logo">
                    
                    <!-- Animated Reveal Video (Width controlled by JS) -->
                    <div class="uv7-logo-wrap loading" id="uv7-logo-wrap">
                        <div class="uv7-logo-reveal" id="uv7-logo-reveal">
                            <video id="uv7-logo-video" class="uv7-logo-video" preload="auto" muted playsinline>
                                <source src="UnitedVoices7.mp4" type="video/mp4">
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

        setTimeout(() => {
            splashContainer.remove();
            resolve();
        }, 500);
    });
}

function showMainMenu() {
    clearScreen();
    const menu = new MainMenu(eventBus);
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
    const overlay = document.createElement('div');
    overlay.id = 'credits-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #fff;
        overflow-y: auto;
        padding: 2rem;
    `;

    overlay.innerHTML = `
        <div style="max-width: 600px; text-align: center; padding-bottom: 4rem;">
            <h1 style="font-size: 2.5rem; color: #0ff; margin-bottom: 2rem;">THE UV7 CREW</h1>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Created By</h3>
                <p style="font-size: 1.2rem;">The UV7 Family</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Story & Design</h3>
                <p>Chicaron82</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Technical Architecture</h3>
                <p>V2 TypeScript Rebuild</p>
                <p style="color: #888; font-size: 0.9rem;">Clean code, type safety, maintainability</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">AI Collaboration</h3>
                <p>Claude (Anthropic)</p>
                <p style="color: #888; font-size: 0.9rem;">Pair programming partner</p>
            </div>

            <div style="margin-bottom: 3rem; padding: 1rem; border: 1px solid #333;">
                <p style="color: #888; font-style: italic;">
                    "847 failures. This is attempt 848."
                </p>
            </div>

            <button id="credits-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
                margin-top: 2rem;
            ">BACK TO MENU</button>
        </div>
    `;

    app!.appendChild(overlay);

    overlay.querySelector('#credits-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    console.log('[UV7 V2] Credits');
}

function showLoadMenu() {
    const overlay = document.createElement('div');
    overlay.id = 'load-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #0ff;
    `;

    // Check for saves
    const saves: string[] = [];
    for (let i = 1; i <= 5; i++) {
        const key = `v848_save_${i}`;
        const data = localStorage.getItem(key);
        saves.push(data ? `Slot ${i}: Save found` : `Slot ${i}: Empty`);
    }

    overlay.innerHTML = `
        <div style="max-width: 500px; width: 90%; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #0ff;">LOAD GAME</h2>

            <div style="margin-bottom: 2rem;">
                ${saves.map((s, i) => `
                    <div style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        border: 1px solid ${s.includes('found') ? '#0ff' : '#333'};
                        color: ${s.includes('found') ? '#0ff' : '#666'};
                        cursor: ${s.includes('found') ? 'pointer' : 'not-allowed'};
                    " class="save-slot" data-slot="${i + 1}">
                        ${s}
                    </div>
                `).join('')}
            </div>

            <p style="color: #666; margin-bottom: 2rem; font-size: 0.9rem;">
                Save system available during gameplay
            </p>

            <button id="load-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
            ">BACK</button>
        </div>
    `;

    app!.appendChild(overlay);

    overlay.querySelector('#load-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    console.log('[UV7 V2] Load Menu');
}

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

        // Set up sprite controller viewport
        spriteController.setViewport(gameLayout.viewport);

        // Set up dialog controller to update UI
        dialogController.onTextUpdate((text) => {
            if (gameLayout) {
                gameLayout.dialogText.textContent = text;
            }
        });

        // Click on viewport advances dialog
        gameLayout.viewport.addEventListener('click', () => {
            dialogController.handleClick();
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
    // For now, both routes start with prologue
    const firstSceneId = 'scene1_streetBump'; // First scene in prologue.json
    await gameEngine.loadScene(firstSceneId);

    // Hide loader
    eventBus.emit('loading:end', {});

    console.log(`[UV7 V2] Starting game: ${route} route`);
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
                    toastNotification.show({
                        title: 'QUICK SAVE',
                        message: 'Timeline preserved',
                        icon: '💾',
                        color: '#0f0'
                    });
                } else {
                    toastNotification.show({
                        title: 'ERROR',
                        message: 'Save failed',
                        icon: '❌',
                        color: '#f00'
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
                        toastNotification.show({
                            title: 'QUICK LOAD',
                            message: 'Timeline restored',
                            icon: '🔄',
                            color: '#0f0'
                        });
                    }
                });
            } else {
                toastNotification.show({
                    title: 'NO SAVE',
                    message: 'No quick save found',
                    icon: '⚠️',
                    color: '#ff0'
                });
            }
        }
    });

    // Navigation
    eventBus.on('ui:route_select', showRouteSelect);
    eventBus.on('ui:main_menu', showMainMenu);
    eventBus.on('ui:settings', () => eventBus.emit('settings:open', {}));
    eventBus.on('ui:credits', showCredits);
    eventBus.on('ui:load_menu', showLoadMenu);

    // Gameplay
    eventBus.on('ui:start_game', (data) => {
        startGame(data.route);
    });

    eventBus.on('ui:pause_toggle', togglePause);

    // Scene loading - update UI with scene data
    eventBus.on('scene:load', ({ sceneId }) => {
        const scene = gameEngine.getCurrentScene();
        if (!scene || !gameLayout) return;

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

        // Update background if specified
        if (scene.background) {
            updateBackground(scene.background);
        }

        // Update sprites if specified
        if (scene.sprites) {
            updateSprites(scene.sprites);
        }

        // Highlight active speaker
        spriteController.highlightSpeaker(speaker);

        console.log(`[UV7 V2] Scene loaded: ${sceneId}`);
    });

    // Dialog display - use DialogController for typewriter
    eventBus.on('dialog:show', ({ entry }) => {
        if (!gameLayout) return;
        dialogController.show(entry.text);
    });

    // Dialog complete - check for choices
    eventBus.on('dialog:complete', () => {
        const scene = gameEngine.getCurrentScene();
        if (scene?.choices && scene.choices.length > 0) {
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
        // Space/Enter to advance dialog
        if ((e.key === ' ' || e.key === 'Enter') && gameLayout && !isPaused) {
            dialogController.handleClick();
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

    // Show main menu
    showMainMenu();

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
            version: 'V2-beta',
            // Debug helpers
            showRoute: showRouteSelect,
            showMenu: showMainMenu,
            startGame,
        };
        console.log('[UV7 V2] Debug: window.uv7 available');
    }
}

// Start the app
init().catch(console.error);
