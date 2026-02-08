/**
 * 🧵 TetherSystem (Ported from V1)
 * The "Heartbeat" of the Visual Novel.
 * Manages the connection stability between the player and Tori.
 */
export class TetherSystem {
    constructor(game) {
        this.game = game;

        // State
        this.tetherLevel = 100;
        this.decayRate = 0.05; // Base decay per second
        this.isDecaying = false;
        this.lastUpdate = 0;

        // Initialize state-manager bridge
        if (this.game.state) {
            this.game.state.set('tether.difficulty', this.difficulty);
            this.game.state.set('tether.level', this.tetherLevel);
        }

        console.log(`🧵 TetherSystem initialized. Difficulty: ${this.difficulty}`);
    }

    startDecay() {
        if (this.isDecaying) return;
        this.isDecaying = true;
        this.lastUpdate = Date.now();
        this.loopId = requestAnimationFrame(() => this.updateLoop());
        console.log("🧵 Tether decay STARTED.");
    }

    stopDecay() {
        this.isDecaying = false;
        if (this.loopId) cancelAnimationFrame(this.loopId);
        console.log("🧵 Tether decay STOPPED.");
    }

    setTetherLevel(level, animate = false) {
        this.tetherLevel = Math.max(0, Math.min(100, level));

        // Push to StateManager (Reactivity Bridge)
        if (this.game.state) {
            this.game.state.set('tether.level', this.tetherLevel);
        }

        this.updateUI();
    }

    updateLoop() {
        if (!this.isDecaying) return;

        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000; // Seconds
        this.lastUpdate = now;

        // Apply Difficulty Modifiers
        let currentRate = this.decayRate;
        if (this.difficulty === 'easy') currentRate *= 0.6;
        if (this.difficulty === 'intense') currentRate *= 1.5;

        // Apply Critical State Modifiers
        if (this.tetherLevel < 50) currentRate *= 1.5;
        if (this.tetherLevel < 20) currentRate *= 2.0;

        // Apply Decay
        this.tetherLevel -= currentRate * delta;

        // Check Death
        if (this.tetherLevel <= 0) {
            this.handleTetherDeath();
            return;
        }

        // Trigger Glitch Effects when low
        if (this.tetherLevel < 20 && Math.random() < 0.01) {
            this.game.triggerSensoryFeedback('glitch');
        }

        // Push to StateManager (Reactivity Bridge)
        if (this.game.state) {
            this.game.state.set('tether.level', this.tetherLevel);
        }

        this.updateUI();
        this.loopId = requestAnimationFrame(() => this.updateLoop());
    }

    handleTetherDeath() {
        this.stopDecay();
        this.tetherLevel = 0;

        if (this.game.state) {
            this.game.state.set('tether.level', 0);
        }

        this.updateUI();

        console.warn("💀 TETHER RUPTURED. CONNECTION LOST.");

        // Notify Engine (which handles the game over scene)
        if (this.game.routes) {
            this.game.routes.handleTetherDeath();
        }
    }

    holdOn() {
        if (this.tetherLevel <= 0) return;

        // Apply restoration
        this.tetherLevel = Math.min(100, this.tetherLevel + this.HOLD_ON_RESTORE);

        if (this.game.state) {
            this.game.state.set('tether.level', this.tetherLevel);
        }

        this.updateUI();

        console.log("✊ HOLD ON triggered. Tether restored.");
    }

    updateUI() {
        // Communicate with the DOM UI
        if (window.vn && window.vn.ui) {
            window.vn.ui.updateTetherDisplay(this.tetherLevel);
        }
    }
}
