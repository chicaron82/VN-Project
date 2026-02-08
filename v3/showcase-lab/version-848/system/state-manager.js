/**
 * 💾 StateManager
 * The Single Source of Truth.
 * Supports path-based access and subscriptions (Reactivity Layer).
 */
export class StateManager {
    constructor() {
        this.gameState = {
            // Core Sim Stats (The "Pet" Brain)
            love: 100,
            hunger: 100,
            mood: "Happy",

            // V1 Restored Stats
            tether: {
                level: 100,
                difficulty: 'normal'
            },

            // Narrative Flags
            currentScene: "Prologue",
            flags: {},

            // Meta-Data
            loopCount: 0,
            playTime: 0
        };

        this.listeners = new Map(); // path -> Array<callback>
    }

    /**
     * Get value by string path (e.g., 'tether.level')
     * @param {string} path 
     * @returns {any}
     */
    get(path) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, this.gameState);
    }

    /**
     * Set value by string path and notify subscribers
     * @param {string} path 
     * @param {any} value 
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.gameState);

        if (target && lastKey) {
            const oldValue = target[lastKey];
            if (oldValue !== value) {
                target[lastKey] = value;
                this.notify(path, value, oldValue);
                this.saveState();
            }
        }
    }

    /**
     * Subscribe to changes at a specific path
     * @param {string} path 
     * @param {Function} callback 
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);

        // Return unsubscribe function
        return () => {
            const list = this.listeners.get(path);
            const index = list.indexOf(callback);
            if (index > -1) list.splice(index, 1);
        };
    }

    /**
     * Notify subscribers of a change
     */
    notify(path, newValue, oldValue) {
        const pathListeners = this.listeners.get(path);
        if (pathListeners) {
            pathListeners.forEach(callback => callback(newValue, oldValue));
        }
    }

    loadState() {
        const saved = localStorage.getItem('v3_vn_state');
        if (saved) {
            console.log("💾 StateManager: Loaded existing state.");
            const loaded = JSON.parse(saved);
            // Deep merge or simple replacement? For now, simple replacement but ensure structure
            this.gameState = { ...this.gameState, ...loaded };
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
        const newHunger = Math.max(0, this.gameState.hunger - 5);
        const newLove = Math.max(0, this.gameState.love - 2);

        this.set('hunger', newHunger);
        this.set('love', newLove);

        this.recalculateMood();
    }

    recalculateMood() {
        let newMood = "Happy";
        if (this.gameState.hunger < 30) {
            newMood = "Hangry";
        } else if (this.gameState.love < 50) {
            newMood = "Lonely";
        }

        if (newMood !== this.gameState.mood) {
            this.set('mood', newMood);
        }
    }
}
