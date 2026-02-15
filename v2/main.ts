/**
 * Version 848 V2 - Entry Point
 *
 * Clean TypeScript rebuild of the visual novel.
 * Boot sequence: Splash → Main Menu → Route Select → Gameplay
 */

import { SystemInitializer } from '@core/SystemInitializer';
import { DebugInterface } from '@core/DebugInterface';
import { VisualEffectsLayer } from '@ui/components/VisualEffectsLayer';
import { InputController } from '@controllers/InputController';
import { SystemEventHandlers } from '@controllers/SystemEventHandlers';
import { NavigationController } from '@controllers/NavigationController';
import { GameplayController } from '@controllers/GameplayController';
import '@core/ErrorBoundary'; // Auto-initializes global error handler
import { DevSuite } from '@systems/DevSuite';
import { Logger } from '@utils/Logger';

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
import '../v1/css/dev-suite.css'; // Dev Suite overlay (V1 source of truth)

// Import route JSON files (Vite handles these as static imports)
import prologueData from '@content/routes/prologue.json';
import ronnieAct1Data from '@content/routes/ronnie_act1.json';
import ronnieAct2Data from '@content/routes/ronnie_act2.json';
import ronnieAct3Data from '@content/routes/ronnie_act3.json';
import toriAct1Data from '@content/routes/tori_act1.json';
import toriAct2Data from '@content/routes/tori_act2.json';
import toriAct3Data from '@content/routes/tori_act3.json';
import toriEndingsData from '@content/routes/tori_endings.json';
import ronnieEndingsData from '@content/routes/ronnie_endings.json';
import epilogueData from '@content/routes/epilogue.json';



// ============================================
// System Initialization
// ============================================
// Initialize all systems via SystemInitializer (extracted to SystemInitializer.ts)
const systems = SystemInitializer.initialize();

// Destructure systems for local use
const {
    eventBus,
    stateManager,
    gameEngine,
    contentLoader,
    settingsSystem,
    saveSystem,
    loopController,
    echoMemorySystem,
    tetherSystem,
    insaneVisualsController,
    easterEggController,
    directorsCutController,
    devCommentarySystem,
    statusNotificationController,
    dialogController,
    dialogBubble,
    spriteController,
    _notificationRail,
} = systems;

declare global {
    interface Window {
        collectiblesSystem: unknown;
        saveSystem: unknown;
    }
}

// ============================================
// App State
// ============================================
const app = document.getElementById('app');
if (!app) throw new Error('No #app element found');

// Menu screens managed by NavigationController
// Gameplay managed by GameplayController
const _isPaused = false;

// ============================================
// Controllers
// ============================================

// Navigation Controller - Screen transitions (extracted to NavigationController.ts)
const navigationController = new NavigationController(eventBus, loopController, app!);

// Gameplay Controller - Game session management (extracted to GameplayController.ts)
const gameplayController = new GameplayController(
    eventBus,
    stateManager,
    gameEngine,
    dialogController,
    spriteController,
    dialogBubble,
    () => navigationController.clearScreen()
);

// ============================================
// Boot Sequence
// ============================================

import { BootSequenceController } from '@controllers/BootSequenceController';

async function executeBootSequence(): Promise<void> {
    const bootController = new BootSequenceController(eventBus, gameEngine);
    await bootController.start();
}


// Helper functions - delegate to controllers
const showMainMenu = (): void => navigationController.showMainMenu();
const showRouteSelect = (): void => navigationController.showRouteSelect();
const startGameplay = (mode: 'ronnie' | 'tori' | 'prologue'): Promise<void> => gameplayController.startGameplay(mode);
const updateBackground = (path: string | undefined): void => gameplayController.updateBackground(path);
const updateSprites = (sprites: Array<{ position?: string; variant?: string; id?: string }> | undefined): void => gameplayController.updateSprites(sprites);
const showChoices = (choices: Array<{ text: string; next: string | null }>): void => gameplayController.showChoices(choices);



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
    () => _isPaused
);

// System Event Handlers - Game event listeners (scene:load, dialog:show, etc.)
const systemEventHandlers = new SystemEventHandlers(
    eventBus,
    gameEngine,
    dialogController,
    spriteController,
    dialogBubble,
    () => gameplayController.getGameLayout(),
    updateBackground,
    updateSprites,
    showChoices,
    showMainMenu
);

// Setup gameplay start event handlers (navigation handlers are in NavigationController)
function setupGameplayHandlers(): void {
    eventBus.on('ui:start_game', (data: { route: 'ronnie' | 'tori' }) => {
        startGameplay(data.route);
    });

    eventBus.on('ui:start_prologue', () => {
        startGameplay('prologue');
    });
}

// Dev Suite - Lazy initialization (only created when openconsole code is entered)
let devSuite: DevSuite | null = null;
eventBus.on('ui:console:open', () => {
    // Close settings modal first so DevSuite isn't hidden behind it
    eventBus.emit('settings:close', {});
    if (!devSuite) {
        devSuite = new DevSuite({
            currentScene: stateManager.get('game.currentScene') as string | undefined,
            gameState: { currentScene: stateManager.get('game.currentScene') as string | undefined },
        });
    }
    devSuite.open();
});
eventBus.on('ui:console:close', () => {
    if (devSuite) devSuite.close();
});

// ============================================
// Initialize
// ============================================

async function init(): Promise<void> {
    Logger.system('[UV7 V2] Starting...');

    // Initialize game engine
    await gameEngine.init();

    // Load all route content
    Logger.system('[UV7 V2] Loading route content...');
    contentLoader.parseAndRegister(prologueData as unknown);
    contentLoader.parseAndRegister(ronnieAct1Data as unknown);
    contentLoader.parseAndRegister(ronnieAct2Data as unknown);
    contentLoader.parseAndRegister(ronnieAct3Data as unknown);
    contentLoader.parseAndRegister(toriAct1Data as unknown);
    contentLoader.parseAndRegister(toriAct2Data as unknown);
    contentLoader.parseAndRegister(toriAct3Data as unknown);
    contentLoader.parseAndRegister(toriEndingsData as unknown);
    contentLoader.parseAndRegister(ronnieEndingsData as unknown);
    contentLoader.parseAndRegister(epilogueData as unknown);
    Logger.system('[UV7 V2] Route content loaded');

    // Set up event handlers (extracted to controllers)
    navigationController.setupNavigationHandlers();
    setupGameplayHandlers();
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
        Logger.system('[UV7 V2] 🚀 Instant Resume detected from App Switcher');
        localStorage.removeItem('uv7-auto-resume');
        localStorage.removeItem('uv7-resume-timestamp');

        // Try to load the last save
        const hasSave = saveSystem.hasAutoSave();
        if (hasSave) {
            // Load auto-save directly
            const success = await saveSystem.loadAutoSave();

            if (success) {
                Logger.system('[UV7 V2] ✅ Instant Resume successful - skipping menu');
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
                Logger.warn('[UV7 V2] ⚠️ Instant Resume failed - showing menu');
            }
        } else {
            Logger.system('[UV7 V2] No save found for Instant Resume - showing menu');
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
init().catch((error) => Logger.error('[UV7 V2] Init failed', error));
