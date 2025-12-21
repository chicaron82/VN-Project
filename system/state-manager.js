/**
 * StateManager - Centralized State Management System
 * 
 * SOLID Refactor Session 1
 * Created: December 20, 2025
 * 
 * Purpose:
 * - Single source of truth for all game state
 * - Deep-clone safety to prevent accidental mutations
 * - Reactive subscriptions for automatic UI updates
 * - Persistence via localStorage
 * 
 * Key Design Decisions:
 * - Path-based access: state.get('game.loopVersion')
 * - Deep cloning on set() to prevent ghost bugs
 * - Subscriber pattern for React-style reactivity
 * 
 * @class StateManager
 */
class StateManager {
    constructor() {
        // Central state store
        this._state = {
            game: {
                loopVersion: 'v.848',
                currentRoute: null,
                currentScene: null,
                paused: false
            },
            unlocks: {
                skipUnlocked: false,
                skipPrologueUnlocked: false,
                ronnieNotesUnlocked: false,
                insaneModeUnlocked: false
            },
            tether: {
                level: 100,
                difficulty: 'normal',
                decayRate: 0.05,
                cap: 100,
                frozen: false
            },
            settings: {
                textSpeed: 'normal',
                autoAdvance: false,
                hapticIntensity: 'normal',
                reduceMotion: false,
                difficulty: 'normal'
            },
            collectibles: {
                unlockedNotes: [],
                readScenes: []
            },
            ui: {
                hidden: false,
                menuOpen: null
            }
        };

        // Subscribers map: path -> Set of callbacks
        this._subscribers = new Map();

        // Dirty flag for persistence optimization
        this._isDirty = false;

        console.log('💚 StateManager initialized');
    }

    // ========================================
    // CORE METHODS
    // ========================================

    /**
     * Get a value from state by path
     * Returns a deep clone to prevent external mutations
     * 
     * @param {string} path - Dot-notation path (e.g., 'game.loopVersion')
     * @returns {*} Deep cloned value at path
     * 
     * @example
     * const version = stateManager.get('game.loopVersion');
     * const tether = stateManager.get('tether.level');
     */
    get(path) {
        const value = this._getByPath(this._state, path);
        
        // Return deep clone to prevent external mutations
        // (Belle's pro-tip: prevents "ghost bugs")
        if (value !== undefined && value !== null && typeof value === 'object') {
            return structuredClone(value);
        }
        return value;
    }

    /**
     * Set a value in state by path
     * Deep clones the value to prevent external mutations
     * Notifies all subscribers watching this path
     * 
     * @param {string} path - Dot-notation path (e.g., 'tether.level')
     * @param {*} value - Value to set (will be deep cloned)
     * 
     * @example
     * stateManager.set('tether.level', 85);
     * stateManager.set('settings.textSpeed', 'fast');
     */
    set(path, value) {
        // Deep clone to prevent external mutations
        const clonedValue = (value !== null && typeof value === 'object') 
            ? structuredClone(value) 
            : value;

        // Get old value for comparison
        const oldValue = this.get(path);

        // Set the value
        this._setByPath(this._state, path, clonedValue);

        // Mark state as dirty for persistence
        this._isDirty = true;

        // Notify subscribers if value changed
        if (oldValue !== clonedValue) {
            this._notifySubscribers(path, clonedValue, oldValue);
        }

        console.log(`📝 State: ${path} = ${JSON.stringify(clonedValue)}`);
    }

    /**
     * Subscribe to state changes at a specific path
     * Callback is invoked whenever the value at path changes
     * 
     * @param {string} path - Dot-notation path to watch
     * @param {Function} callback - Function(newValue, oldValue) to call on change
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * const unsubscribe = stateManager.subscribe('tether.level', (newLevel, oldLevel) => {
     *     console.log(`Tether changed from ${oldLevel} to ${newLevel}`);
     *     updateTetherUI(newLevel);
     * });
     * 
     * // Later, to stop listening:
     * unsubscribe();
     */
    subscribe(path, callback) {
        if (!this._subscribers.has(path)) {
            this._subscribers.set(path, new Set());
        }
        
        this._subscribers.get(path).add(callback);

        console.log(`👂 Subscribed to: ${path}`);

        // Return unsubscribe function
        return () => {
            const subs = this._subscribers.get(path);
            if (subs) {
                subs.delete(callback);
                console.log(`🔇 Unsubscribed from: ${path}`);
            }
        };
    }

    // ========================================
    // PERSISTENCE
    // ========================================

    /**
     * Save current state to localStorage
     * Only saves if state has been modified (dirty flag)
     * 
     * @param {string} [key='vn_state'] - Storage key
     */
    save(key = 'vn_state') {
        if (!this._isDirty) {
            console.log('💾 State unchanged, skipping save');
            return;
        }

        try {
            const serialized = JSON.stringify(this._state);
            localStorage.setItem(key, serialized);
            this._isDirty = false;
            console.log('💾 State saved to localStorage');
        } catch (error) {
            console.error('❌ Failed to save state:', error);
        }
    }

    /**
     * Load state from localStorage
     * Merges with default state to handle new properties
     * 
     * @param {string} [key='vn_state'] - Storage key
     * @returns {boolean} True if state was loaded successfully
     */
    load(key = 'vn_state') {
        try {
            const serialized = localStorage.getItem(key);
            if (!serialized) {
                console.log('💾 No saved state found');
                return false;
            }

            const loaded = JSON.parse(serialized);
            
            // Deep merge with current state (preserves new properties)
            this._state = this._deepMerge(this._state, loaded);
            this._isDirty = false;

            console.log('💾 State loaded from localStorage');
            return true;
        } catch (error) {
            console.error('❌ Failed to load state:', error);
            return false;
        }
    }

    /**
     * Clear all state and reset to defaults
     * Also clears localStorage
     * 
     * @param {string} [key='vn_state'] - Storage key
     */
    reset(key = 'vn_state') {
        // Reinitialize with fresh state
        this.constructor.call(this);
        
        // Clear localStorage
        localStorage.removeItem(key);
        
        console.log('🔄 State reset to defaults');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Get value by dot-notation path
     * @private
     */
    _getByPath(obj, path) {
        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current === undefined || current === null) {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }

    /**
     * Set value by dot-notation path
     * Creates intermediate objects if needed
     * @private
     */
    _setByPath(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || current[key] === null) {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Notify all subscribers watching a path
     * Also notifies parent path subscribers
     * @private
     */
    _notifySubscribers(path, newValue, oldValue) {
        // Notify exact path subscribers
        const subs = this._subscribers.get(path);
        if (subs) {
            subs.forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error(`❌ Subscriber error for ${path}:`, error);
                }
            });
        }

        // Notify parent path subscribers (e.g., 'tether' when 'tether.level' changes)
        const parts = path.split('.');
        for (let i = parts.length - 1; i > 0; i--) {
            const parentPath = parts.slice(0, i).join('.');
            const parentSubs = this._subscribers.get(parentPath);
            if (parentSubs) {
                const parentValue = this.get(parentPath);
                parentSubs.forEach(callback => {
                    try {
                        callback(parentValue, null);
                    } catch (error) {
                        console.error(`❌ Parent subscriber error for ${parentPath}:`, error);
                    }
                });
            }
        }
    }

    /**
     * Deep merge two objects
     * @private
     */
    _deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this._deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    // ========================================
    // DEBUG / DEV TOOLS
    // ========================================

    /**
     * Get entire state (for debugging)
     * Returns a deep clone
     */
    getAll() {
        return structuredClone(this._state);
    }

    /**
     * Print state tree to console
     */
    debug() {
        console.log('🔍 Current State:');
        console.log(JSON.stringify(this._state, null, 2));
    }

    /**
     * List all active subscriptions
     */
    listSubscriptions() {
        console.log('👂 Active Subscriptions:');
        this._subscribers.forEach((subs, path) => {
            console.log(`  ${path}: ${subs.size} subscriber(s)`);
        });
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
