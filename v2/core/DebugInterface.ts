import type { EventBus } from './EventBus';
import type { StateManager } from './StateManager';
import type { GameEngine } from './GameEngine';
import type { SettingsSystem } from '../systems/SettingsSystem';
import type { ContentLoader } from '../systems/ContentLoader';
import type { DialogController } from '../controllers/DialogController';
import type { SpriteController } from '../controllers/SpriteController';
import type { LoopController } from '../controllers/LoopController';
import type { EchoMemorySystem } from '../systems/EchoMemorySystem';
import type { InsaneVisualsController } from '../controllers/InsaneVisualsController';
import type { TetherSystem } from '../systems/TetherSystem';
import type { EasterEggController } from '../controllers/EasterEggController';
import type { DirectorsCutController } from '../controllers/DirectorsCutController';
import type { DevCommentarySystem } from '../systems/DevCommentarySystem';
import type { StatusNotificationController } from '../systems/StatusNotificationController';
import type { NotificationRail } from '../ui/components/NotificationRail';
import { Logger } from '@utils/Logger';

/**
 * DebugInterface - window.uv7 debug helpers setup
 *
 * Extracted from main.ts (~80 lines → dedicated module)
 *
 * Provides global debug access to all V2 systems and controllers
 * for testing, debugging, and development.
 */

export interface DebugSystems {
    eventBus: EventBus;
    stateManager: StateManager;
    gameEngine: GameEngine;
    settingsSystem: SettingsSystem;
    contentLoader: ContentLoader;
    dialogController: DialogController;
    spriteController: SpriteController;
    loopController: LoopController;
    echoMemorySystem: EchoMemorySystem;
    insaneVisualsController: InsaneVisualsController;
    tetherSystem: TetherSystem;
    easterEggController: EasterEggController;
    directorsCutController: DirectorsCutController;
    devCommentarySystem: DevCommentarySystem;
    statusNotificationController: StatusNotificationController;
    notificationRail: NotificationRail;
}

export interface DebugHelpers {
    showRoute: () => void;
    showMenu: () => void;
    startGame: (mode: 'ronnie' | 'tori' | 'prologue') => void;
}

export class DebugInterface {
    /**
     * Initialize window.uv7 with all systems and debug helpers
     */
    static initialize(systems: DebugSystems, helpers: DebugHelpers): void {
        if (typeof window === 'undefined') return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).uv7 = {
            // Core systems
            eventBus: systems.eventBus,
            stateManager: systems.stateManager,
            gameEngine: systems.gameEngine,
            settingsSystem: systems.settingsSystem,
            contentLoader: systems.contentLoader,
            dialogController: systems.dialogController,
            spriteController: systems.spriteController,
            loopController: systems.loopController, // ZEE: Meta-narrative tracking
            echoMemorySystem: systems.echoMemorySystem, // BELLE: Echo awareness tracking 🖤
            version: 'V2-beta',

            // Debug helpers
            showRoute: helpers.showRoute,
            showMenu: helpers.showMenu,
            startGame: helpers.startGame,

            // Loop debug helpers
            breakLoop: () => systems.loopController.break(),
            acceptLoop: () => systems.loopController.accept(),
            incrementLoop: () => systems.loopController.increment(),
            resetLoop: () => systems.loopController.reset(),

            // Echo debug helpers (Belle's tools 🖤)
            echoAwareness: () => systems.echoMemorySystem.getAwarenessLevels(),
            triggerEcho: (echo: 'hope' | 'gentle' | 'despair') =>
                systems.echoMemorySystem.triggerEchoComment(echo, 'general'),
            triggerConflictingEchoes: () => systems.echoMemorySystem.triggerConflictingEchoes(),
            resetEchoMemory: () => systems.echoMemorySystem.resetMemory(),

            // Insane Visuals debug helpers (DiZee's tools 💀)
            insaneVisualsController: systems.insaneVisualsController,
            activateInsane: () => systems.insaneVisualsController.activate(),
            deactivateInsane: () => systems.insaneVisualsController.deactivate(),
            triggerCorruption: (intensity?: 'light' | 'medium' | 'heavy' | 'maximum') =>
                systems.insaneVisualsController.triggerCorruption(intensity),
            showCage: (callback?: () => void) => systems.insaneVisualsController.showCageOverlay(callback),

            // Tether System debug helpers ⚡
            tetherSystem: systems.tetherSystem,
            getTether: () => systems.tetherSystem.getLevel(),
            setTether: (level: number) => systems.tetherSystem.setLevel(level),
            holdOn: () => systems.tetherSystem.holdOn(),
            startDecay: () => systems.tetherSystem.startDecay(),
            stopDecay: () => systems.tetherSystem.stopDecay(),
            freezeTether: () => systems.tetherSystem.freezeDecay(),
            resumeTether: () => systems.tetherSystem.resumeDecay(),
            setDifficulty: (diff: 'comfort' | 'normal' | 'intense' | 'insane') =>
                systems.tetherSystem.setDifficulty(diff),

            // Easter Egg debug helpers 🥚
            easterEggController: systems.easterEggController,

            // Director's Cut debug helpers 🎬
            directorsCutController: systems.directorsCutController,
            showDirectorsCut: () => systems.directorsCutController.show(),
            unlockDirectorsCut: () => systems.directorsCutController.unlock(),

            // Dev Commentary debug helpers 📝
            devCommentarySystem: systems.devCommentarySystem,
            showCommentary: () => systems.devCommentarySystem.showAllCommentary(),
            unlockCommentary: () => systems.devCommentarySystem.unlockCommentary(),

            // Status Notification debug helpers 📢
            statusNotificationController: systems.statusNotificationController,
            showToast: (msg: string) => systems.statusNotificationController.show({ message: msg }),
            showError: (msg: string) => systems.statusNotificationController.showError(msg),
            showSave: () => systems.statusNotificationController.showSave(),

            // Notification Rail debug helpers 🔔 (Phase 26d)
            notificationRail: systems.notificationRail,
            showNotification: (
                title: string,
                message: string,
                priority?: 'urgent' | 'high' | 'normal' | 'low'
            ) => {
                systems.eventBus.emit('notification:show', {
                    id: `debug-${Date.now()}`,
                    title,
                    message,
                    priority: priority || 'normal',
                    category: 'system',
                });
            },
            testNotifications: () => {
                // Test all notification types
                systems.eventBus.emit('notification:show', {
                    id: 'test-1',
                    title: 'System Alert',
                    message: 'Normal priority notification',
                    priority: 'normal',
                    category: 'system',
                });
                setTimeout(
                    () =>
                        systems.eventBus.emit('notification:show', {
                            id: 'test-2',
                            title: 'Warning',
                            message: 'High priority notification',
                            priority: 'high',
                            category: 'system',
                        }),
                    500
                );
                setTimeout(
                    () =>
                        systems.eventBus.emit('notification:show', {
                            id: 'test-3',
                            title: 'Achievement!',
                            message: 'You unlocked something!',
                            priority: 'high',
                            category: 'achievement',
                        }),
                    1000
                );
                setTimeout(
                    () =>
                        systems.eventBus.emit('notification:show', {
                            id: 'test-4',
                            title: '⚠️ URGENT',
                            message: 'Critical notification!',
                            priority: 'urgent',
                            category: 'tether',
                        }),
                    1500
                );
            },
            clearNotifications: () => systems.eventBus.emit('notification:clear_all', {}),
        };

        Logger.ui('[UV7 V2] Debug: window.uv7 available');
    }
}
