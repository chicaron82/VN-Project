/**
 * 💾 StateManager
 * The Single Source of Truth.
 */
export class StateManager {
    constructor() {
        this.gameState = {
            // Core Sim Stats (The "Pet" Brain)
            love: 100,
            hunger: 100,
            mood: "Happy",

            // Narrative Flags
            currentScene: "Prologue",
            flags: {},

            // Meta-Data
            loopCount: 0,
            playTime: 0
        };
    }

    loadState() {
        const saved = localStorage.getItem('v3_vn_state');
        if (saved) {
            console.log("💾 StateManager: Loaded existing state.");
            this.gameState = JSON.parse(saved);
        } else {
            console.log("💾 StateManager: New Game Started.");
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('v3_vn_state', JSON.stringify(this.gameState));
    }

    handleDecay() {
        console.log("⏳ StateManager: Decay Tick...");
        // Simple decay logic for now - fully decoupled from UI
        if (this.gameState.hunger > 0) this.gameState.hunger -= 5;
        if (this.gameState.love > 0) this.gameState.love -= 2;

        this.recalculateMood();
        this.saveState();
    }

    recalculateMood() {
        if (this.gameState.hunger < 30) {
            this.gameState.mood = "Hangry";
        } else if (this.gameState.love < 50) {
            this.gameState.mood = "Lonely";
        } else {
            this.gameState.mood = "Happy";
        }
    }
}
