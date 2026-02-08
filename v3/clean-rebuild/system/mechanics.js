/**
 * 🔧 Mechanics Shim
 * Adapters to support V1 Route logic in V3 Engine
 */

export class TetherSystem {
    constructor(game, route) {
        this.game = game;
        this.route = route;
        this.tetherLevel = 100;
        this.decayInterval = null;
    }

    init() { console.log("🔗 TetherSystem: Initialized"); }

    startDecay() {
        console.log("🔗 TetherSystem: Decay Started");
        this.decayInterval = setInterval(() => {
            this.updateTether(-1, "decay");
        }, 5000);
    }

    stopDecay() {
        if (this.decayInterval) clearInterval(this.decayInterval);
        console.log("🔗 TetherSystem: Decay Stopped");
    }

    updateTether(amount, reason) {
        this.tetherLevel = Math.max(0, Math.min(100, this.tetherLevel + amount));
        console.log(`🔗 Tether: ${this.tetherLevel}% (${reason})`);
        // Update UI if it exists (assumed handled by visuals/system)
    }

    holdOn() {
        this.updateTether(15, "hold_on");
    }

    reset() {
        this.tetherLevel = 100;
    }

    getState() { return { level: this.tetherLevel }; }
    restoreState(state) { this.tetherLevel = state.level; }
}

export class CollectiblesManager {
    constructor(game, route) {
        this.game = game;
        this.route = route;
        this.notes = new Set();
    }

    init() { console.log("📔 CollectiblesManager: Initialized"); }

    defineRonnieNotes() { }
    defineToriNotes() { }

    unlockNote(noteId) {
        if (!this.notes.has(noteId)) {
            console.log(`📔 Note Unlocked: ${noteId}`);
            this.notes.add(noteId);
            // Trigger visual cue for note interaction if needed
            if (this.game.visuals) this.game.visuals.trigger('save');
        }
    }

    getCollectedCount() { return this.notes.size; }

    getState() { return { notes: Array.from(this.notes) }; }
    restoreState(state) { this.notes = new Set(state.notes); }
}
