/**
 * 🚂 GameEngine (The Brain)
 * Orchestrates the Visual Novel lifecycle.
 */

// 1. V1 Dependency Imports (to populate globals FIRST)
import './difficulty-profiles.js?v=v3';
import './logger.js?v=v3';
import './telemetry-shim.js?v=v3';

// 2. System imports
import { StateManager } from './state-manager.js?v=v3';
import { RouteController } from './route-controller.js?v=v3';
import { VisualCueManager } from './visual-cue-manager.js?v=v3';
import { Gateway } from './gateway.js?v=v3';
import { TetherSystem } from './tether-system.js?v=v3';
import { EchoMemorySystem } from './echo-memory-system.js?v=v3';
import { SettingsManager } from './settings-manager.js?v=v3';
import { CollectiblesManager } from './collectibles-manager.js?v=v3';
import { MenuController } from './menu-controller.js?v=v3';
import { ThemeManager } from './theme-manager.js?v=v3';
import { TipsController } from './tips-controller.js?v=v3';
import { SecretCodesManager } from './secret-codes-manager.js?v=v3';
import { DevCommentary } from './dev-commentary.js?v=v3';
import { NotificationShadeController } from './notification-shade-controller.js?v=v3';

export class GameEngine {
    constructor() {
        console.log("🚂 GameEngine: Initializing...");

        // 1. Initialize Sub-Systems (Core)
        this.state = new StateManager();
        this.visuals = new VisualCueManager();
        this.gateway = new Gateway(this); // New Layer (Meta-State)

        // 2. Initialize V1 Systems (Restored)
        // Static Managers first
        ThemeManager.init();

        // Core Managers
        this.settingsManager = new SettingsManager(this);
        this.collectiblesManager = new CollectiblesManager(this);
        this.secretCodesManager = new SecretCodesManager(this);

        // UI Controllers
        this.tipsController = new TipsController(this);
        this.menuController = new MenuController(this);
        this.devCommentary = new DevCommentary(this);
        this.notificationShade = new NotificationShadeController(this);

        // Simulation/Narrative Systems
        this.tetherSystem = new TetherSystem(this); // V1 Core Mechanic
        this.echoMemory = new EchoMemorySystem(this); // V1 Persistence
        this.routes = new RouteController(this); // Pass engine ref

        // Mock SaveManager (Enhanced for V1 compatibility)
        this.saveManager = {
            blockSaves: () => console.log("💾 [Engine] Saves blocked by logic."),
            allowSaves: () => console.log("💾 [Engine] Saves allowed."),
            saveGame: () => console.log("💾 [Engine] Game saved (mock)."),
            loadGame: () => console.log("📂 [Engine] Game loaded (mock).")
        };

        // 3. Grab DOM Element References
        this.mainMenu = document.getElementById('main-menu');
        this.routeSelect = document.getElementById('route-select');
        this.gameView = document.getElementById('game-view');
        this.sceneBackground = document.getElementById('scene-background');
        this.tetherUI = document.getElementById('status-tether');
        this.notesButton = document.getElementById('notes-button');

        // 4. Bind to Global (for debugging and V1 system access)
        window.vn = {
            engine: this,
            state: this.state,
            gateway: this.gateway,
            tether: this.tetherSystem,
            echo: this.echoMemory,
            settings: this.settingsManager,
            collectibles: this.collectiblesManager,
            menu: this.menuController
        };

        // Legacy global access (V1 systems often look for 'game' or 'window.game')
        window.game = this;
    }

    async init() {
        console.log("🚂 GameEngine: Starting Sequence...");

        // 1. Apply Meta-State (Gateway Effect)
        this.gateway.applyWorldState();

        // 2. Load State (or New Game)
        this.state.loadState();

        // 3. Start Game Loop (Heartbeat) - Starts Tether
        this.tetherSystem.startDecay();

        // 4. Show Main Menu (instead of auto-starting routes)
        if (this.menuController && this.menuController.showMainMenu) {
            this.menuController.showMainMenu();
        } else {
            console.warn("⚠️ MenuController not found, falling back to route start");
            await this.routes.start();
        }
    }

    // ===============================================
    // V1 COMPATIBILITY LAYER (The Adapter)
    // Allows original route files to run unmodified.
    // ===============================================

    displayScene(sceneData) {
        // V1 routes pass a config object with:
        // character, dialogue, internal, sprites, choices, next, delay

        console.log(`🎬 Displaying Scene: ${sceneData.character || 'Narrator'}`);
        // Delegate to RouteController which handles the DOM rendering
        this.routes.renderScene(sceneData);
    }

    showRouteSelect() {
        console.log("🔀 Showing Route Selection Screen");
        this.routes.renderRouteSelection();
    }

    triggerSensoryFeedback(type, element, reason) {
        // Map V1 names to V3 VisualCueManager
        // V1: 'codeRipple', 'glitch', 'toriHop'
        console.log(`⚡ Feedback Triggered: ${type} (${reason})`);
        this.visuals.trigger(type);
    }

    setDigitalSpriteEffect(side) {
        // V1 command to glitch specific sprite slot
        if (this.routes.view) {
            // Assuming routes.view exposes sprite slots (to be implemented in view)
            // For now, log it
            console.log(`👾 Digital Effect applied to ${side}`);
        }
    }

    clearDigitalSpriteEffect(side) {
        console.log(`🧹 Digital Effect cleared from ${side}`);
    }

    // Dummy method for sprite fading (V1 legacy)
    fadeSpritesSequence(side, img1, img2, duration) {
        console.log("👻 [Legacy] Fading sprites sequence...", side, img1, img2);
        // Implement real fading if VisualCueManager supports it
    }

    // Attempt counter (V1 legacy - moved to EchoMemory but kept for compatibility if routes call it directly)
    incrementAttempt() {
        this.echoMemory.incrementLoop();
    }

    // Called by TetherSystem on death
    handleTetherDeath() {
        console.log("💀 Engine received Tether Death signal.");
        this.echoMemory.recordDeath('tether_collapse');
        // Trigger Bad End / Reset
        // For now, reload
        location.reload();
    }

    returnToMainMenu() {
        location.reload();
    }
}

// Expose Class for Shim Patching (Module Scope)
window.GameEngine = GameEngine;
