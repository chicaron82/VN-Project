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

        // State history for debugging/undo (Session 11)
        this._history = [];
        this._maxHistorySize = 50;
        this._historyEnabled = true;

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

        // Record history before change (for undo)
        if (this._historyEnabled && oldValue !== clonedValue) {
            this._recordHistory(path, oldValue, clonedValue);
        }

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
    // STATE SNAPSHOTS (Session 13)
    // ========================================

    /**
     * Create a snapshot of the current state
     * Useful for debugging or manual save points
     * @param {string} [name] - Optional name for the snapshot
     * @returns {Object} Snapshot object with metadata
     */
    createSnapshot(name = '') {
        const snapshot = {
            name: name || `Snapshot ${Date.now()}`,
            timestamp: Date.now(),
            state: structuredClone(this._state)
        };

        console.log(`📸 Snapshot created: ${snapshot.name}`);
        return snapshot;
    }

    /**
     * Restore state from a snapshot
     * @param {Object} snapshot - Snapshot object from createSnapshot
     * @returns {boolean} True if restore successful
     */
    restoreSnapshot(snapshot) {
        if (!snapshot || !snapshot.state) {
            console.error('❌ Invalid snapshot');
            return false;
        }

        // Store old state in history before restore
        const oldState = structuredClone(this._state);
        this._recordHistory('_fullState', oldState, snapshot.state);

        // Restore the state
        this._state = structuredClone(snapshot.state);
        this._isDirty = true;

        console.log(`📸 Snapshot restored: ${snapshot.name}`);
        return true;
    }

    /**
     * Quick save - create and store a named snapshot
     * @param {string} name - Name for the quick save
     */
    quickSave(name = 'quicksave') {
        const snapshot = this.createSnapshot(name);
        this._quickSaves = this._quickSaves || {};
        this._quickSaves[name] = snapshot;
        console.log(`💾 Quick save: ${name}`);
        return snapshot;
    }

    /**
     * Quick load - restore from a named snapshot
     * @param {string} name - Name of the quick save to restore
     * @returns {boolean} True if restore successful
     */
    quickLoad(name = 'quicksave') {
        if (!this._quickSaves || !this._quickSaves[name]) {
            console.error(`❌ No quick save found: ${name}`);
            return false;
        }
        return this.restoreSnapshot(this._quickSaves[name]);
    }

    /**
     * Compare two snapshots and return differences
     * @param {Object} snapshot1 - First snapshot (older)
     * @param {Object} snapshot2 - Second snapshot (newer) or current state if omitted
     * @returns {Array} List of differences
     */
    diff(snapshot1, snapshot2 = null) {
        const state1 = snapshot1?.state || snapshot1;
        const state2 = snapshot2?.state || snapshot2 || this._state;

        const differences = [];

        const compare = (obj1, obj2, path = '') => {
            const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

            for (const key of keys) {
                const fullPath = path ? `${path}.${key}` : key;
                const val1 = obj1?.[key];
                const val2 = obj2?.[key];

                if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
                    compare(val1, val2, fullPath);
                } else if (val1 !== val2) {
                    differences.push({
                        path: fullPath,
                        before: val1,
                        after: val2
                    });
                }
            }
        };

        compare(state1, state2);
        return differences;
    }

    /**
     * Print diff as a formatted table
     * @param {Object} snapshot1 - First snapshot
     * @param {Object} snapshot2 - Second snapshot (or current if omitted)
     */
    printDiff(snapshot1, snapshot2 = null) {
        const diffs = this.diff(snapshot1, snapshot2);
        if (diffs.length === 0) {
            console.log('✅ No differences found');
            return diffs;
        }
        console.log('📊 State Differences:');
        console.table(diffs);
        return diffs;
    }

    // ========================================
    // IMPORT/EXPORT (Session 20)
    // ========================================

    /**
     * Export current state as JSON string
     * Useful for bug reports or sharing state
     * @returns {string} JSON string of current state
     */
    exportState() {
        const exportData = {
            version: 1,
            timestamp: Date.now(),
            state: structuredClone(this._state)
        };
        const json = JSON.stringify(exportData, null, 2);
        console.log('📤 State exported to JSON');
        return json;
    }

    /**
     * Export state to clipboard (if in browser)
     */
    async copyStateToClipboard() {
        try {
            const json = this.exportState();
            await navigator.clipboard.writeText(json);
            console.log('📋 State copied to clipboard!');
            return true;
        } catch (error) {
            console.error('❌ Failed to copy to clipboard:', error);
            return false;
        }
    }

    /**
     * Import state from JSON string
     * @param {string} json - JSON string from exportState
     * @returns {boolean} True if import successful
     */
    importState(json) {
        try {
            const importData = JSON.parse(json);

            if (!importData.state) {
                console.error('❌ Invalid import data: missing state');
                return false;
            }

            // Store current state for potential undo
            const oldState = structuredClone(this._state);
            this._recordHistory('_fullState', oldState, importData.state);

            this._state = structuredClone(importData.state);
            this._isDirty = true;

            console.log(`📥 State imported (from ${new Date(importData.timestamp).toLocaleString()})`);
            return true;
        } catch (error) {
            console.error('❌ Failed to import state:', error);
            return false;
        }
    }

    // ========================================
    // WATCH UTILITY (Session 24)
    // ========================================

    /**
     * Watch a path and log all changes (for debugging)
     * @param {string} path - Path to watch
     * @returns {Function} Unsubscribe function
     */
    watch(path) {
        console.log(`👀 Watching: ${path}`);

        const unsubscribe = this.subscribe(path, (newValue, oldValue) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`📊 [${timestamp}] ${path}: ${JSON.stringify(oldValue)} → ${JSON.stringify(newValue)}`);
        });

        // Store for later cleanup
        this._watchers = this._watchers || new Map();
        this._watchers.set(path, unsubscribe);

        return unsubscribe;
    }

    /**
     * Stop watching a path
     * @param {string} path - Path to unwatch
     */
    unwatch(path) {
        const unsub = this._watchers?.get(path);
        if (unsub) {
            unsub();
            this._watchers.delete(path);
            console.log(`🔇 Stopped watching: ${path}`);
        }
    }

    /**
     * Stop all watches
     */
    unwatchAll() {
        if (this._watchers) {
            this._watchers.forEach((unsub, path) => {
                unsub();
                console.log(`🔇 Stopped watching: ${path}`);
            });
            this._watchers.clear();
        }
    }

    /**
     * List all active watchers
     */
    listWatchers() {
        if (!this._watchers?.size) {
            console.log('👀 No active watchers');
            return [];
        }
        const paths = [...this._watchers.keys()];
        console.log('👀 Active watchers:', paths);
        return paths;
    }

    /**
     * Get StateManager statistics
     * @returns {Object} Stats about current state
     */
    getStats() {
        const countProperties = (obj, depth = 0) => {
            let count = 0;
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    count += countProperties(obj[key], depth + 1);
                } else {
                    count++;
                }
            }
            return count;
        };

        const stats = {
            propertyCount: countProperties(this._state),
            subscriberCount: [...this._subscribers.values()].reduce((sum, set) => sum + set.size, 0),
            watcherCount: this._watchers?.size || 0,
            historyCount: this._history?.length || 0,
            maxHistorySize: this._maxHistorySize || 50,
            quickSaveCount: Object.keys(this._quickSaves || {}).length,
            isDirty: this._isDirty
        };

        console.log('📊 StateManager Stats:', stats);
        return stats;
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
    // STATE HISTORY (Session 11)
    // ========================================

    /**
     * Record a state change in history
     * @private
     */
    _recordHistory(path, oldValue, newValue) {
        const entry = {
            timestamp: Date.now(),
            path,
            oldValue: structuredClone(oldValue),
            newValue: structuredClone(newValue)
        };

        this._history.push(entry);

        // Trim history if over max size
        while (this._history.length > this._maxHistorySize) {
            this._history.shift();
        }
    }

    /**
     * Undo the last state change
     * @returns {Object|null} The undone entry, or null if no history
     */
    undo() {
        if (this._history.length === 0) {
            console.log('⏪ No history to undo');
            return null;
        }

        const entry = this._history.pop();

        // Temporarily disable history to avoid recording the undo itself
        this._historyEnabled = false;
        this.set(entry.path, entry.oldValue);
        this._historyEnabled = true;

        console.log(`⏪ Undone: ${entry.path} restored to ${JSON.stringify(entry.oldValue)}`);
        return entry;
    }

    /**
     * Get state change history
     * @param {number} [count] - Number of recent entries (default: all)
     * @returns {Array} History entries
     */
    getHistory(count) {
        const history = [...this._history];
        if (count) {
            return history.slice(-count);
        }
        return history;
    }

    /**
     * Clear state history
     */
    clearHistory() {
        this._history = [];
        console.log('🗑️ State history cleared');
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

    /**
     * Create a visual debug panel showing state in real-time
     * Useful for development and debugging
     * @param {Object} options - Configuration options
     * @param {boolean} options.draggable - Allow dragging the panel
     * @param {boolean} options.autoUpdate - Subscribe to all state changes
     * @returns {HTMLElement} The debug panel element
     */
    createDebugPanel(options = { draggable: true, autoUpdate: true }) {
        // Remove existing panel if present
        const existing = document.getElementById('state-debug-panel');
        if (existing) existing.remove();

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'state-debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 320px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff88;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            padding: 0;
            border: 1px solid #00ff88;
            border-radius: 8px;
            z-index: 99999;
            overflow: hidden;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #00ff88;
            color: black;
            padding: 8px;
            font-weight: bold;
            cursor: ${options.draggable ? 'move' : 'default'};
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>🔧 StateManager Debug</span>
            <button id="state-debug-close" style="background: none; border: none; color: black; cursor: pointer; font-size: 16px;">×</button>
        `;
        panel.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.id = 'state-debug-content';
        content.style.cssText = `
            padding: 10px;
            max-height: 340px;
            overflow-y: auto;
        `;
        panel.appendChild(content);

        document.body.appendChild(panel);

        // Close button
        document.getElementById('state-debug-close').onclick = () => panel.remove();

        // Make draggable
        if (options.draggable) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            header.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = panel.offsetLeft;
                startTop = panel.offsetTop;
            };

            document.onmousemove = (e) => {
                if (!isDragging) return;
                panel.style.left = (startLeft + e.clientX - startX) + 'px';
                panel.style.top = (startTop + e.clientY - startY) + 'px';
                panel.style.right = 'auto';
            };

            document.onmouseup = () => { isDragging = false; };
        }

        // Initial render
        this._updateDebugPanel(content);

        // Auto-update via subscriptions
        if (options.autoUpdate) {
            // Subscribe to major state paths
            const paths = ['game', 'unlocks', 'tether', 'settings', 'ui'];
            this._debugSubscriptions = paths.map(path =>
                this.subscribe(path, () => this._updateDebugPanel(content))
            );
        }

        console.log('🔧 Debug panel created');
        return panel;
    }

    /**
     * Update debug panel content
     * @private
     */
    _updateDebugPanel(container) {
        if (!container) return;

        const state = this._state;

        const formatValue = (val) => {
            if (typeof val === 'boolean') return val ? '✓' : '✗';
            if (typeof val === 'number') return val.toFixed?.(1) ?? val;
            if (Array.isArray(val)) return `[${val.length}]`;
            return val;
        };

        let html = '';

        // Game state
        html += `<div style="margin-bottom: 8px;">
            <div style="color: #ff88ff; font-weight: bold;">🎮 Game</div>
            <div>  loopVersion: ${formatValue(state.game.loopVersion)}</div>
            <div>  loopStatus: ${formatValue(state.game.loopStatus || state.game.paused ? 'paused' : 'active')}</div>
        </div>`;

        // Tether
        html += `<div style="margin-bottom: 8px;">
            <div style="color: #ff8888; font-weight: bold;">💗 Tether</div>
            <div>  level: <span style="color: ${state.tether.level < 30 ? '#ff4444' : '#00ff88'};">${formatValue(state.tether.level)}%</span></div>
            <div>  difficulty: ${formatValue(state.tether.difficulty)}</div>
            <div>  cap: ${formatValue(state.tether.cap)}%</div>
        </div>`;

        // Unlocks
        html += `<div style="margin-bottom: 8px;">
            <div style="color: #88ff88; font-weight: bold;">🔓 Unlocks</div>
            <div>  skipUnlocked: ${formatValue(state.unlocks.skipUnlocked)}</div>
            <div>  skipPrologue: ${formatValue(state.unlocks.skipPrologueUnlocked)}</div>
            <div>  ronnieNotes: ${formatValue(state.unlocks.ronnieNotesUnlocked)}</div>
        </div>`;

        // UI
        html += `<div style="margin-bottom: 8px;">
            <div style="color: #8888ff; font-weight: bold;">🖥️ UI</div>
            <div>  hidden: ${formatValue(state.ui.hidden)}</div>
        </div>`;

        // Subscriptions count
        let subCount = 0;
        this._subscribers.forEach(subs => subCount += subs.size);
        html += `<div style="color: #888; margin-top: 10px; border-top: 1px dashed #444; padding-top: 8px;">
            👂 ${subCount} active subscriptions
        </div>`;

        container.innerHTML = html;
    }

    /**
     * Remove debug panel and cleanup subscriptions
     */
    closeDebugPanel() {
        const panel = document.getElementById('state-debug-panel');
        if (panel) panel.remove();

        if (this._debugSubscriptions) {
            this._debugSubscriptions.forEach(unsub => unsub());
            this._debugSubscriptions = null;
        }

        console.log('🔧 Debug panel closed');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
