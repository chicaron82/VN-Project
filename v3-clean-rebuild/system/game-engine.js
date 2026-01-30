/**
 * 🚂 GameEngine (The Brain)
 * Orchestrates the Visual Novel lifecycle.
 */
import { StateManager } from './state-manager.js';
import { RouteController } from './route-controller.js';
import { VisualCueManager } from './visual-cue-manager.js';
import { Gateway } from './gateway.js';
import { TetherSystem } from './tether-system.js';
import { EchoMemorySystem } from './echo-memory-system.js';
import { SettingsManager } from './settings-manager.js';
import { CollectiblesManager } from './collectibles-manager.js';
import { MenuController } from './menu-controller.js';
import { ThemeManager } from './theme-manager.js';
import { TipsController } from './tips-controller.js';
import { SecretCodesManager } from './secret-codes-manager.js';
import { DevCommentary } from './dev-commentary.js';
import { NotificationShadeController } from './notification-shade-controller.js';

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

        // 3. Bind to Global (for debugging and V1 system access)
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

        // 4. Handover to Route Controller
        await this.routes.start();
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
