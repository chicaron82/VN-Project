import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { TelemetryRecorder } from './Telemetry';
import { MacroRunner } from './MacroRunner';
import { GameEngine } from './GameEngine';
import { AutoReadController } from './AutoReadController';
import { KeyboardController } from './KeyboardController';
import { Logger } from '@utils/Logger';
import { SwipeHandler } from './SwipeHandler';

import { SettingsSystem } from '../systems/SettingsSystem';
import { SecretCodesSystem } from '../systems/SecretCodesSystem';
import { ContentLoader } from '../systems/ContentLoader';
import { CollectiblesSystem } from '../systems/CollectiblesSystem';
import { HapticSystem } from '../systems/HapticSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { AchievementSystem } from '../systems/AchievementSystem';
import { EchoMemorySystem } from '../systems/EchoMemorySystem';
import { TetherSystem } from '../systems/TetherSystem';
import { DevCommentarySystem } from '../systems/DevCommentarySystem';
import { StatusNotificationController } from '../systems/StatusNotificationController';
import { BootstrapTracker } from '../systems/BootstrapTracker';
import { BackButtonManager } from '../systems/BackButtonManager';

import { DialogController } from '../controllers/DialogController';
import { SpriteController } from '../controllers/SpriteController';
import { MobileUXController } from '../controllers/MobileUXController';
import { TutorialController } from '../controllers/TutorialController';
import { LoopController } from '../controllers/LoopController';
import { InsaneVisualsController } from '../controllers/InsaneVisualsController';
import { EasterEggController } from '../controllers/EasterEggController';
import { DirectorsCutController } from '../controllers/DirectorsCutController';
import { GrabHandleRepositioner } from '../controllers/GrabHandleRepositioner';

import { TipsOverlay } from '../ui/components/TipsOverlay';
import { SettingsModal } from '../ui/components/SettingsModal';
import { StatusBar } from '../ui/components/StatusBar';
import { Sidebar } from '../ui/components/Sidebar';
import { NotesViewer } from '../ui/components/NotesViewer';
import { NotificationShade } from '../ui/components/NotificationShade';
import { CreditsScreen } from '../ui/screens/CreditsScreen';
import { CrewScreen } from '../ui/screens/CrewScreen';
import { DialogBubble } from '../ui/components/DialogBubble';
import { SaveLoadModal } from '../ui/components/SaveLoadModal';
import { BacklogUI } from '../ui/components/BacklogUI';
import type { NotificationRail } from '../ui/components/NotificationRail';
import { initializeNotificationRail } from '../ui/components/NotificationRail';

/**
 * SystemInitializer - Bootstrap all V2 systems and UI components
 *
 * Extracted from main.ts (~180 lines → dedicated module)
 *
 * Centralizes system instantiation to keep main.ts lean.
 * Returns all systems for main.ts to wire up.
 */

export interface InitializedSystems {
    // Core
    eventBus: EventBus;
    stateManager: StateManager;
    telemetryRecorder: TelemetryRecorder;
    macroRunner: MacroRunner;
    gameEngine: GameEngine;
    contentLoader: ContentLoader;

    // Systems
    settingsSystem: SettingsSystem;
    saveSystem: SaveSystem;
    hapticSystem: HapticSystem;
    secretCodesSystem: SecretCodesSystem;
    collectiblesSystem: CollectiblesSystem;
    achievementSystem: AchievementSystem;
    bootstrapTracker: BootstrapTracker;
    backButtonManager: BackButtonManager;

    // Game-specific systems
    loopController: LoopController;
    echoMemorySystem: EchoMemorySystem;
    tetherSystem: TetherSystem;
    devCommentarySystem: DevCommentarySystem;
    statusNotificationController: StatusNotificationController;

    // Controllers
    dialogController: DialogController;
    dialogBubble: DialogBubble;
    spriteController: SpriteController;
    autoReadController: AutoReadController;
    keyboardController: KeyboardController;
    swipeHandler: SwipeHandler;
    mobileUXController: MobileUXController;
    tutorialController: TutorialController;
    insaneVisualsController: InsaneVisualsController;
    easterEggController: EasterEggController;
    directorsCutController: DirectorsCutController;

    // UI Components (prefixed with _ to indicate "initialized but not directly used")
    _settingsModal: SettingsModal;
    _statusBar: StatusBar;
    _sidebar: Sidebar;
    _notificationShade: NotificationShade;
    _creditsScreen: CreditsScreen;
    _crewScreen: CrewScreen;
    _notesViewer: NotesViewer;
    _saveLoadModal: SaveLoadModal;
    _backlogUI: BacklogUI;
    _notificationRail: NotificationRail;
    _tipsOverlay: TipsOverlay;

    // Shell detection
    isInShell: boolean;
}

export class SystemInitializer {
    /**
     * Initialize all V2 systems and UI components
     */
    static initialize(): InitializedSystems {
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

        // BootstrapTracker must be created BEFORE GameEngine (injected dependency)
        const bootstrapTracker = new BootstrapTracker(stateManager);

        const gameEngine = new GameEngine(eventBus, stateManager, bootstrapTracker);
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
        // "User feedback is essential for good UX."
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
        const backButtonManager = new BackButtonManager(eventBus);
        backButtonManager.init();

        const spriteController = new SpriteController(eventBus, stateManager);

        // Secret Codes & Collectibles (Initialize BEFORE UI components that depend on them)
        const secretCodesSystem = new SecretCodesSystem(eventBus, stateManager, bootstrapTracker, devCommentarySystem);
        const collectiblesSystem = new CollectiblesSystem(eventBus);

        // ============================================
        // Shell Detection
        // ============================================
        // Detect if running in shell mode (iframe) — V2 always creates its own chrome
        const isInShell = window.parent !== window;
        Logger.system(`Running in ${isInShell ? 'SHELL (own chrome)' : 'STANDALONE'} mode`);

        // ============================================
        // Global UI Components
        // ============================================
        const _settingsModal = new SettingsModal(eventBus, settingsSystem);

        // Chrome components — always created (shell hides its chrome via customChrome flag)
        const _statusBar = new StatusBar(eventBus);
        const _sidebar = new Sidebar(eventBus, stateManager, collectiblesSystem, isInShell);
        const _notificationShade = new NotificationShade(eventBus, isInShell);
        Logger.system('Chrome created (StatusBar, Sidebar, NotificationShade)');

        // Shell exit: send postMessage to parent when user wants to return to shell
        eventBus.on('shell:exit', () => {
            if (isInShell) {
                window.parent.postMessage({ type: 'v2:navigate:shell' }, '*');
                Logger.system('Sent exit-to-shell message');
            }
        });

        // Game-specific screens (always created)
        const _creditsScreen = new CreditsScreen(eventBus);
        const _crewScreen = new CrewScreen(eventBus);

        // TORI'S FIX: Initialize GrabHandleRepositioner AFTER Sidebar
        // Use setTimeout to ensure DOM is fully ready, just in case
        setTimeout(() => {
            new GrabHandleRepositioner(eventBus);
        }, 0);

        const _notesViewer = new NotesViewer(eventBus, collectiblesSystem);
        // ToastNotification removed - using NotificationRail via eventBus.emit('notification:show', ...)
        const _saveLoadModal = new SaveLoadModal(eventBus, saveSystem, stateManager); // V2: Save/Load UI
        const _backlogUI = new BacklogUI(gameEngine.backlogManager, eventBus); // V2: Backlog UI
        const _notificationRail = initializeNotificationRail(eventBus); // Phase 26d: Notification Rail

        // Keep references alive (prevent tree-shaking of side-effectful modules)
        void [_settingsModal, _statusBar, _sidebar, _creditsScreen, _crewScreen,
              _notesViewer, _saveLoadModal, _backlogUI, _notificationRail, _notificationShade,
              autoReadController, keyboardController, swipeHandler, mobileUXController,
              achievementSystem, tutorialController, _tipsOverlay];

        // Set up window globals for external access (dev tools)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        win.secretCodesManager = secretCodesSystem;
        win.collectiblesSystem = collectiblesSystem;
        win.saveSystem = saveSystem;
        win.telemetry = telemetryRecorder;
        win.macroRunner = macroRunner;

        Logger.system('UI initialized');

        return {
            // Core
            eventBus,
            stateManager,
            telemetryRecorder,
            macroRunner,
            gameEngine,
            contentLoader,

            // Systems
            settingsSystem,
            saveSystem,
            hapticSystem,
            secretCodesSystem,
            collectiblesSystem,
            achievementSystem,
            bootstrapTracker,
            backButtonManager,

            // Game-specific systems
            loopController,
            echoMemorySystem,
            tetherSystem,
            devCommentarySystem,
            statusNotificationController,

            // Controllers
            dialogController,
            dialogBubble,
            spriteController,
            autoReadController,
            keyboardController,
            swipeHandler,
            mobileUXController,
            tutorialController,
            insaneVisualsController,
            easterEggController,
            directorsCutController,

            // UI Components
            _settingsModal,
            _statusBar,
            _sidebar,
            _notificationShade,
            _creditsScreen,
            _crewScreen,
            _notesViewer,
            _saveLoadModal,
            _backlogUI,
            _notificationRail,
            _tipsOverlay,

            // Shell detection
            isInShell,
        };
    }
}
