/**
 * 🚂 GameEngine (The Brain)
 * Orchestrates the Visual Novel lifecycle.
 */
import { StateManager } from './state-manager.js';
import { RouteController } from './route-controller.js';
import { VisualCueManager } from './visual-cue-manager.js';
import { Gateway } from './gateway.js';

export class GameEngine {
    constructor() {
        console.log("🚂 GameEngine: Initializing...");

        // 1. Initialize Sub-Systems
        this.state = new StateManager();
        this.visuals = new VisualCueManager();
        this.gateway = new Gateway(this); // New Layer (Meta-State)
        this.routes = new RouteController(this); // Pass engine ref

        // 2. Bind to Global (for debugging)
        window.vn = {
            engine: this,
            state: this.state,
            gateway: this.gateway
        };
    }

    async init() {
        console.log("🚂 GameEngine: Starting Sequence...");

        // 1. Apply Meta-State (Gateway Effect)
        this.gateway.applyWorldState();

        // 2. Load State (or New Game)
        this.state.loadState();

        // 3. Start Game Loop (Heartbeat)
        this.startGameLoop();

        // 4. Handover to Route Controller
        await this.routes.start();
    }

    startGameLoop() {
        // The 15s Heartbeat (Decay System)
        setInterval(() => {
            this.state.handleDecay();
        }, 15000);
    }
}
