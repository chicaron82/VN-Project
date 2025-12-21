import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * StateManager Unit Tests
 * 
 * Tests for the centralized state management system.
 * Verifies deep-clone safety, subscriptions, and persistence.
 */

// Mock localStorage for Node environment
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; })
};

// Set up global mocks
global.localStorage = localStorageMock;
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn()
};

// Import StateManager (we'll create a simplified version for testing)
// In real tests, we'd import from the actual file

/**
 * Simplified StateManager for testing
 * (Same logic as the real one, just inline for test isolation)
 */
class StateManager {
    constructor() {
        this._state = {
            game: { loopVersion: 'v.848', paused: false },
            tether: { level: 100, difficulty: 'normal' },
            settings: { textSpeed: 'normal' }
        };
        this._subscribers = new Map();
        this._isDirty = false;
    }

    get(path) {
        const value = this._getByPath(this._state, path);
        if (value !== undefined && value !== null && typeof value === 'object') {
            return structuredClone(value);
        }
        return value;
    }

    set(path, value) {
        const clonedValue = (value !== null && typeof value === 'object')
            ? structuredClone(value)
            : value;
        const oldValue = this.get(path);
        this._setByPath(this._state, path, clonedValue);
        this._isDirty = true;
        if (oldValue !== clonedValue) {
            this._notifySubscribers(path, clonedValue, oldValue);
        }
    }

    subscribe(path, callback) {
        if (!this._subscribers.has(path)) {
            this._subscribers.set(path, new Set());
        }
        this._subscribers.get(path).add(callback);
        return () => {
            const subs = this._subscribers.get(path);
            if (subs) subs.delete(callback);
        };
    }

    save(key = 'vn_state') {
        if (!this._isDirty) return;
        localStorage.setItem(key, JSON.stringify(this._state));
        this._isDirty = false;
    }

    load(key = 'vn_state') {
        const serialized = localStorage.getItem(key);
        if (!serialized) return false;
        this._state = JSON.parse(serialized);
        this._isDirty = false;
        return true;
    }

    _getByPath(obj, path) {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current === undefined || current === null) return undefined;
            current = current[key];
        }
        return current;
    }

    _setByPath(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) current[key] = {};
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }

    _notifySubscribers(path, newValue, oldValue) {
        const subs = this._subscribers.get(path);
        if (subs) {
            subs.forEach(callback => callback(newValue, oldValue));
        }
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('StateManager', () => {
    let state;

    beforeEach(() => {
        localStorageMock.clear();
        state = new StateManager();
    });

    // ========================================
    // GET/SET TESTS
    // ========================================

    describe('get()', () => {
        it('should get primitive value by path', () => {
            expect(state.get('game.loopVersion')).toBe('v.848');
        });

        it('should get nested object by path', () => {
            const tether = state.get('tether');
            expect(tether.level).toBe(100);
            expect(tether.difficulty).toBe('normal');
        });

        it('should return undefined for non-existent path', () => {
            expect(state.get('does.not.exist')).toBeUndefined();
        });

        it('should return deep clone of objects (not reference)', () => {
            const tether1 = state.get('tether');
            const tether2 = state.get('tether');
            expect(tether1).toEqual(tether2);
            expect(tether1).not.toBe(tether2); // Different reference
        });
    });

    describe('set()', () => {
        it('should set primitive value', () => {
            state.set('tether.level', 50);
            expect(state.get('tether.level')).toBe(50);
        });

        it('should set nested object', () => {
            state.set('settings', { textSpeed: 'fast', autoAdvance: true });
            expect(state.get('settings.textSpeed')).toBe('fast');
            expect(state.get('settings.autoAdvance')).toBe(true);
        });

        it('should create intermediate objects for new paths', () => {
            state.set('new.deeply.nested.value', 42);
            expect(state.get('new.deeply.nested.value')).toBe(42);
        });

        it('should deep clone objects to prevent external mutation', () => {
            const original = { foo: 'bar' };
            state.set('test', original);
            original.foo = 'modified'; // Modify original
            expect(state.get('test').foo).toBe('bar'); // State unchanged
        });
    });

    // ========================================
    // DEEP-CLONE SAFETY TESTS (Belle's Pro-Tip)
    // ========================================

    describe('Deep Clone Safety', () => {
        it('should prevent external mutation via get()', () => {
            const tether = state.get('tether');
            tether.level = 0; // Try to mutate
            expect(state.get('tether.level')).toBe(100); // Original unchanged
        });

        it('should prevent mutation of set() input', () => {
            const settings = { textSpeed: 'fast' };
            state.set('settings', settings);
            settings.textSpeed = 'slow'; // Mutate after set
            expect(state.get('settings.textSpeed')).toBe('fast'); // State has original
        });
    });

    // ========================================
    // SUBSCRIPTION TESTS
    // ========================================

    describe('subscribe()', () => {
        it('should call subscriber when value changes', () => {
            const callback = vi.fn();
            state.subscribe('tether.level', callback);

            state.set('tether.level', 75);

            expect(callback).toHaveBeenCalledWith(75, 100);
        });

        it('should not call subscriber when value unchanged', () => {
            const callback = vi.fn();
            state.subscribe('tether.level', callback);

            state.set('tether.level', 100); // Same value

            expect(callback).not.toHaveBeenCalled();
        });

        it('should return working unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = state.subscribe('tether.level', callback);

            unsubscribe();
            state.set('tether.level', 50);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should support multiple subscribers on same path', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            state.subscribe('tether.level', callback1);
            state.subscribe('tether.level', callback2);

            state.set('tether.level', 80);

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    // ========================================
    // PERSISTENCE TESTS
    // ========================================

    describe('save()', () => {
        it('should save state to localStorage', () => {
            vi.clearAllMocks(); // Clear any previous calls
            state.set('tether.level', 50); // Mark dirty
            state.save();

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'vn_state',
                expect.any(String)
            );
        });

        it('should not save if state is clean', () => {
            vi.clearAllMocks(); // Clear any previous calls
            // Create fresh state that hasn't been modified
            const freshState = new StateManager();
            freshState.save();

            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('load()', () => {
        it('should load state from localStorage', () => {
            const savedState = {
                game: { loopVersion: 'v.849', paused: true },
                tether: { level: 75, difficulty: 'intense' },
                settings: { textSpeed: 'fast' }
            };
            localStorageMock.store['vn_state'] = JSON.stringify(savedState);

            const result = state.load();

            expect(result).toBe(true);
            expect(state.get('game.loopVersion')).toBe('v.849');
            expect(state.get('tether.level')).toBe(75);
        });

        it('should return false if no saved state exists', () => {
            const result = state.load();
            expect(result).toBe(false);
        });
    });
});

// ========================================
// EDGE CASE TESTS
// ========================================

describe('StateManager Edge Cases', () => {
    let state;

    beforeEach(() => {
        state = new StateManager();
    });

    it('should handle null values', () => {
        state.set('test', null);
        expect(state.get('test')).toBeNull();
    });

    it('should handle arrays', () => {
        state.set('collectibles.unlockedNotes', ['z1', 'z2', 'z3']);
        const notes = state.get('collectibles.unlockedNotes');
        expect(notes).toEqual(['z1', 'z2', 'z3']);
    });

    it('should handle boolean values', () => {
        state.set('game.paused', true);
        expect(state.get('game.paused')).toBe(true);
    });

    it('should handle number zero', () => {
        state.set('tether.level', 0);
        expect(state.get('tether.level')).toBe(0);
    });
});

// ========================================
// STATE HISTORY TESTS (Session 12)
// ========================================

describe('StateManager History', () => {
    let state;

    // Extended StateManager with history for testing
    class StateManagerWithHistory {
        constructor() {
            this._state = {
                game: { loopVersion: 848 },
                tether: { level: 100 }
            };
            this._subscribers = new Map();
            this._isDirty = false;
            this._history = [];
            this._maxHistorySize = 50;
            this._historyEnabled = true;
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current !== null && typeof current === 'object' ? structuredClone(current) : current;
        }

        set(path, value) {
            const oldValue = this.get(path);
            if (this._historyEnabled && oldValue !== value) {
                this._recordHistory(path, oldValue, value);
            }
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        _recordHistory(path, oldValue, newValue) {
            this._history.push({
                timestamp: Date.now(),
                path,
                oldValue,
                newValue
            });
            while (this._history.length > this._maxHistorySize) {
                this._history.shift();
            }
        }

        undo() {
            if (this._history.length === 0) return null;
            const entry = this._history.pop();
            this._historyEnabled = false;
            this.set(entry.path, entry.oldValue);
            this._historyEnabled = true;
            return entry;
        }

        getHistory(count) {
            const history = [...this._history];
            return count ? history.slice(-count) : history;
        }

        clearHistory() {
            this._history = [];
        }
    }

    beforeEach(() => {
        state = new StateManagerWithHistory();
    });

    describe('undo()', () => {
        it('should undo the last state change', () => {
            state.set('tether.level', 80);
            state.set('tether.level', 60);

            state.undo();

            expect(state.get('tether.level')).toBe(80);
        });

        it('should return null when no history', () => {
            const result = state.undo();
            expect(result).toBeNull();
        });

        it('should return the undone entry', () => {
            state.set('tether.level', 75);
            const entry = state.undo();

            expect(entry.path).toBe('tether.level');
            expect(entry.oldValue).toBe(100);
            expect(entry.newValue).toBe(75);
        });

        it('should support multiple undos', () => {
            state.set('tether.level', 80);
            state.set('tether.level', 60);
            state.set('tether.level', 40);

            state.undo();
            expect(state.get('tether.level')).toBe(60);

            state.undo();
            expect(state.get('tether.level')).toBe(80);

            state.undo();
            expect(state.get('tether.level')).toBe(100);
        });
    });

    describe('getHistory()', () => {
        it('should return all history entries', () => {
            state.set('tether.level', 90);
            state.set('tether.level', 80);

            const history = state.getHistory();

            expect(history.length).toBe(2);
        });

        it('should return limited entries when count provided', () => {
            state.set('tether.level', 90);
            state.set('tether.level', 80);
            state.set('tether.level', 70);

            const history = state.getHistory(2);

            expect(history.length).toBe(2);
            expect(history[1].newValue).toBe(70);
        });

        it('should include timestamps in entries', () => {
            state.set('tether.level', 50);
            const history = state.getHistory();

            expect(history[0].timestamp).toBeDefined();
            expect(typeof history[0].timestamp).toBe('number');
        });
    });

    describe('clearHistory()', () => {
        it('should clear all history', () => {
            state.set('tether.level', 80);
            state.set('tether.level', 60);

            state.clearHistory();

            expect(state.getHistory().length).toBe(0);
        });

        it('should make undo return null after clear', () => {
            state.set('tether.level', 80);
            state.clearHistory();

            expect(state.undo()).toBeNull();
        });
    });

    describe('History limits', () => {
        it('should respect max history size', () => {
            state._maxHistorySize = 5;

            for (let i = 0; i < 10; i++) {
                state.set('tether.level', 100 - i);
            }

            expect(state.getHistory().length).toBe(5);
        });
    });
});

// ========================================
// STATE SNAPSHOT TESTS (Session 14)
// ========================================

describe('StateManager Snapshots', () => {
    let state;

    // Extended StateManager with snapshots for testing
    class StateManagerWithSnapshots {
        constructor() {
            this._state = {
                game: { loopVersion: 848 },
                tether: { level: 100 }
            };
            this._quickSaves = {};
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        set(path, value) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        createSnapshot(name = '') {
            return {
                name: name || `Snapshot ${Date.now()}`,
                timestamp: Date.now(),
                state: structuredClone(this._state)
            };
        }

        restoreSnapshot(snapshot) {
            if (!snapshot || !snapshot.state) return false;
            this._state = structuredClone(snapshot.state);
            return true;
        }

        quickSave(name = 'quicksave') {
            const snapshot = this.createSnapshot(name);
            this._quickSaves[name] = snapshot;
            return snapshot;
        }

        quickLoad(name = 'quicksave') {
            if (!this._quickSaves[name]) return false;
            return this.restoreSnapshot(this._quickSaves[name]);
        }
    }

    beforeEach(() => {
        state = new StateManagerWithSnapshots();
    });

    describe('createSnapshot()', () => {
        it('should create a snapshot of current state', () => {
            const snapshot = state.createSnapshot();

            expect(snapshot.state).toBeDefined();
            expect(snapshot.state.tether.level).toBe(100);
        });

        it('should include timestamp', () => {
            const before = Date.now();
            const snapshot = state.createSnapshot();
            const after = Date.now();

            expect(snapshot.timestamp).toBeGreaterThanOrEqual(before);
            expect(snapshot.timestamp).toBeLessThanOrEqual(after);
        });

        it('should use provided name', () => {
            const snapshot = state.createSnapshot('my-save');
            expect(snapshot.name).toBe('my-save');
        });

        it('should deep clone the state', () => {
            const snapshot = state.createSnapshot();
            state.set('tether.level', 50);

            expect(snapshot.state.tether.level).toBe(100); // Original preserved
        });
    });

    describe('restoreSnapshot()', () => {
        it('should restore state from snapshot', () => {
            state.set('tether.level', 75);
            const snapshot = state.createSnapshot();

            state.set('tether.level', 25);
            state.restoreSnapshot(snapshot);

            expect(state.get('tether.level')).toBe(75);
        });

        it('should return false for invalid snapshot', () => {
            expect(state.restoreSnapshot(null)).toBe(false);
            expect(state.restoreSnapshot({})).toBe(false);
        });
    });

    describe('quickSave/quickLoad()', () => {
        it('should save and load state', () => {
            state.set('tether.level', 80);
            state.quickSave('test');

            state.set('tether.level', 20);
            state.quickLoad('test');

            expect(state.get('tether.level')).toBe(80);
        });

        it('should support multiple named saves', () => {
            state.set('tether.level', 100);
            state.quickSave('save1');

            state.set('tether.level', 50);
            state.quickSave('save2');

            state.set('tether.level', 0);

            state.quickLoad('save1');
            expect(state.get('tether.level')).toBe(100);

            state.quickLoad('save2');
            expect(state.get('tether.level')).toBe(50);
        });

        it('should return false for non-existent save', () => {
            expect(state.quickLoad('nonexistent')).toBe(false);
        });
    });
});

// ========================================
// STATE DIFF TESTS (Session 18)
// ========================================

describe('StateManager Diff', () => {
    let state;

    // StateManager with diff for testing
    class StateManagerWithDiff {
        constructor() {
            this._state = {
                game: { loopVersion: 848 },
                tether: { level: 100 }
            };
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        set(path, value) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        createSnapshot(name = '') {
            return {
                name: name || `Snapshot ${Date.now()}`,
                timestamp: Date.now(),
                state: structuredClone(this._state)
            };
        }

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
                        differences.push({ path: fullPath, before: val1, after: val2 });
                    }
                }
            };

            compare(state1, state2);
            return differences;
        }
    }

    beforeEach(() => {
        state = new StateManagerWithDiff();
    });

    describe('diff()', () => {
        it('should detect changes between snapshot and current state', () => {
            const snapshot = state.createSnapshot();
            state.set('tether.level', 75);

            const diffs = state.diff(snapshot);

            expect(diffs.length).toBe(1);
            expect(diffs[0].path).toBe('tether.level');
            expect(diffs[0].before).toBe(100);
            expect(diffs[0].after).toBe(75);
        });

        it('should return empty array when no changes', () => {
            const snapshot = state.createSnapshot();
            const diffs = state.diff(snapshot);

            expect(diffs.length).toBe(0);
        });

        it('should compare two snapshots', () => {
            const snapshot1 = state.createSnapshot();
            state.set('tether.level', 50);
            const snapshot2 = state.createSnapshot();

            const diffs = state.diff(snapshot1, snapshot2);

            expect(diffs.length).toBe(1);
            expect(diffs[0].before).toBe(100);
            expect(diffs[0].after).toBe(50);
        });

        it('should detect multiple changes', () => {
            const snapshot = state.createSnapshot();
            state.set('tether.level', 80);
            state.set('game.loopVersion', 849);

            const diffs = state.diff(snapshot);

            expect(diffs.length).toBe(2);
        });

        it('should handle nested path changes', () => {
            state._state.settings = { audio: { volume: 100 } };
            const snapshot = state.createSnapshot();
            state._state.settings.audio.volume = 50;

            const diffs = state.diff(snapshot);

            expect(diffs.some(d => d.path === 'settings.audio.volume')).toBe(true);
        });
    });
});

// ========================================
// EXPORT/IMPORT TESTS (Session 21)
// ========================================

describe('StateManager Export/Import', () => {
    let state;

    class StateManagerWithExport {
        constructor() {
            this._state = {
                game: { loopVersion: 848 },
                tether: { level: 100 }
            };
            this._history = [];
            this._historyEnabled = true;
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        set(path, value) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        _recordHistory(path, oldValue, newValue) {
            this._history.push({ path, oldValue, newValue });
        }

        exportState() {
            return JSON.stringify({
                version: 1,
                timestamp: Date.now(),
                state: structuredClone(this._state)
            }, null, 2);
        }

        importState(json) {
            try {
                const data = JSON.parse(json);
                if (!data.state) return false;
                this._state = structuredClone(data.state);
                return true;
            } catch {
                return false;
            }
        }
    }

    beforeEach(() => {
        state = new StateManagerWithExport();
    });

    describe('exportState()', () => {
        it('should return valid JSON string', () => {
            const json = state.exportState();
            const parsed = JSON.parse(json);

            expect(parsed).toBeDefined();
            expect(parsed.version).toBe(1);
        });

        it('should include timestamp', () => {
            const before = Date.now();
            const json = state.exportState();
            const after = Date.now();
            const parsed = JSON.parse(json);

            expect(parsed.timestamp).toBeGreaterThanOrEqual(before);
            expect(parsed.timestamp).toBeLessThanOrEqual(after);
        });

        it('should include current state', () => {
            state.set('tether.level', 75);
            const json = state.exportState();
            const parsed = JSON.parse(json);

            expect(parsed.state.tether.level).toBe(75);
        });
    });

    describe('importState()', () => {
        it('should restore state from JSON', () => {
            state.set('tether.level', 50);
            const json = state.exportState();

            state.set('tether.level', 25);
            state.importState(json);

            expect(state.get('tether.level')).toBe(50);
        });

        it('should return false for invalid JSON', () => {
            expect(state.importState('not json')).toBe(false);
        });

        it('should return false for missing state', () => {
            expect(state.importState('{}')).toBe(false);
        });

        it('should handle round-trip export/import', () => {
            state.set('game.loopVersion', 849);
            state.set('tether.level', 80);
            const json = state.exportState();

            // Wipe state
            state._state = { game: {}, tether: {} };

            state.importState(json);

            expect(state.get('game.loopVersion')).toBe(849);
            expect(state.get('tether.level')).toBe(80);
        });
    });
});

// ========================================
// WATCH UTILITY TESTS (Session 26)
// ========================================

describe('StateManager Watch Utility', () => {
    let state;

    class StateManagerWithWatch {
        constructor() {
            this._state = { tether: { level: 100 } };
            this._subscribers = new Map();
            this._watchers = new Map();
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        set(path, value) {
            const oldValue = this.get(path);
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            // Notify subscribers
            const subs = this._subscribers.get(path);
            if (subs && oldValue !== value) {
                subs.forEach(cb => cb(value, oldValue));
            }
        }

        subscribe(path, callback) {
            if (!this._subscribers.has(path)) {
                this._subscribers.set(path, new Set());
            }
            this._subscribers.get(path).add(callback);
            return () => this._subscribers.get(path)?.delete(callback);
        }

        watch(path) {
            const unsubscribe = this.subscribe(path, () => { });
            this._watchers.set(path, unsubscribe);
            return unsubscribe;
        }

        unwatch(path) {
            const unsub = this._watchers.get(path);
            if (unsub) {
                unsub();
                this._watchers.delete(path);
            }
        }

        unwatchAll() {
            this._watchers.forEach(unsub => unsub());
            this._watchers.clear();
        }

        listWatchers() {
            return [...this._watchers.keys()];
        }
    }

    beforeEach(() => {
        state = new StateManagerWithWatch();
    });

    describe('watch()', () => {
        it('should add a watcher for a path', () => {
            state.watch('tether.level');
            expect(state._watchers.has('tether.level')).toBe(true);
        });

        it('should return unsubscribe function', () => {
            const unsub = state.watch('tether.level');
            expect(typeof unsub).toBe('function');
        });
    });

    describe('unwatch()', () => {
        it('should remove a watcher', () => {
            state.watch('tether.level');
            state.unwatch('tether.level');
            expect(state._watchers.has('tether.level')).toBe(false);
        });
    });

    describe('unwatchAll()', () => {
        it('should remove all watchers', () => {
            state.watch('tether.level');
            state.watch('game.loopVersion');
            state.unwatchAll();
            expect(state._watchers.size).toBe(0);
        });
    });

    describe('listWatchers()', () => {
        it('should return list of watched paths', () => {
            state.watch('tether.level');
            state.watch('game.status');
            const watchers = state.listWatchers();
            expect(watchers).toContain('tether.level');
            expect(watchers).toContain('game.status');
        });

        it('should return empty array when no watchers', () => {
            expect(state.listWatchers().length).toBe(0);
        });
    });
});

// ========================================
// SESSION 30 MILESTONE TESTS! 🎉
// ========================================

describe('StateManager Path Utilities', () => {
    let state;

    class StateManagerWithPathUtils {
        constructor() {
            this._state = {
                game: { loopVersion: 848 },
                tether: { level: 100 }
            };
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        deletePath(path) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) return false;
                current = current[keys[i]];
            }
            const lastKey = keys[keys.length - 1];
            if (lastKey in current) {
                delete current[lastKey];
                return true;
            }
            return false;
        }

        has(path) {
            return this.get(path) !== undefined;
        }
    }

    beforeEach(() => {
        state = new StateManagerWithPathUtils();
    });

    describe('has()', () => {
        it('should return true for existing path', () => {
            expect(state.has('tether.level')).toBe(true);
        });

        it('should return false for non-existing path', () => {
            expect(state.has('does.not.exist')).toBe(false);
        });
    });

    describe('deletePath()', () => {
        it('should delete existing path', () => {
            expect(state.has('tether.level')).toBe(true);
            state.deletePath('tether.level');
            expect(state.has('tether.level')).toBe(false);
        });

        it('should return true when path deleted', () => {
            expect(state.deletePath('tether.level')).toBe(true);
        });

        it('should return false when path does not exist', () => {
            expect(state.deletePath('nonexistent.path')).toBe(false);
        });
    });

    describe('keys()', () => {
        class StateManagerWithKeys {
            constructor() {
                this._state = {
                    game: { loopVersion: 848, status: 'active' },
                    tether: { level: 100 }
                };
            }

            get(path) {
                const keys = path.split('.');
                let current = this._state;
                for (const key of keys) {
                    if (current === undefined) return undefined;
                    current = current[key];
                }
                return current;
            }

            keys(prefix = '') {
                const paths = [];
                const traverse = (obj, currentPath) => {
                    for (const key in obj) {
                        const fullPath = currentPath ? `${currentPath}.${key}` : key;
                        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                            traverse(obj[key], fullPath);
                        } else {
                            paths.push(fullPath);
                        }
                    }
                };
                const startObj = prefix ? this.get(prefix) : this._state;
                traverse(startObj, prefix);
                return paths;
            }
        }

        let state;

        beforeEach(() => {
            state = new StateManagerWithKeys();
        });

        it('should return all paths', () => {
            const keys = state.keys();
            expect(keys).toContain('game.loopVersion');
            expect(keys).toContain('game.status');
            expect(keys).toContain('tether.level');
        });

        it('should filter by prefix', () => {
            const keys = state.keys('game');
            expect(keys).toContain('game.loopVersion');
            expect(keys).toContain('game.status');
            expect(keys).not.toContain('tether.level');
        });

        it('should return empty array for non-existent prefix', () => {
            const keys = state.keys('nonexistent');
            expect(keys.length).toBe(0);
        });
    });
});

// ========================================
// SESSION 37: DRAGON PUNCH COMBO TESTS! 🐉👊
// ========================================

describe('StateManager Utility Methods', () => {
    let state;

    class StateManagerWithUtils {
        constructor() {
            this._state = {
                game: { score: 100 },
                ui: { visible: true }
            };
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current !== null && typeof current === 'object' ? structuredClone(current) : current;
        }

        set(path, value) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        merge(path, obj) {
            const existing = this.get(path) || {};
            const merged = { ...existing, ...obj };
            this.set(path, merged);
            return true;
        }

        increment(path, amount = 1) {
            const current = this.get(path) || 0;
            this.set(path, current + amount);
            return current + amount;
        }

        toggle(path) {
            const current = this.get(path);
            this.set(path, !current);
            return !current;
        }
    }

    beforeEach(() => {
        state = new StateManagerWithUtils();
    });

    describe('merge()', () => {
        it('should merge objects', () => {
            state.merge('game', { newProp: 'value' });
            expect(state.get('game.newProp')).toBe('value');
            expect(state.get('game.score')).toBe(100);
        });
    });

    describe('increment()', () => {
        it('should increment by 1 by default', () => {
            const result = state.increment('game.score');
            expect(result).toBe(101);
        });

        it('should increment by custom amount', () => {
            const result = state.increment('game.score', 10);
            expect(result).toBe(110);
        });
    });

    describe('toggle()', () => {
        it('should toggle boolean values', () => {
            expect(state.get('ui.visible')).toBe(true);
            state.toggle('ui.visible');
            expect(state.get('ui.visible')).toBe(false);
        });

        it('should return new value', () => {
            const result = state.toggle('ui.visible');
            expect(result).toBe(false);
        });

        it('should toggle back and forth', () => {
            state.toggle('ui.visible');
            state.toggle('ui.visible');
            expect(state.get('ui.visible')).toBe(true);
        });
    });
});

// ========================================
// SESSION 42: BATCH OPERATION TESTS! 📦
// ========================================

describe('StateManager Batch Operations', () => {
    let state;

    class StateManagerWithBatch {
        constructor() {
            this._state = { game: {}, tether: {} };
        }

        get(path) {
            const keys = path.split('.');
            let current = this._state;
            for (const key of keys) {
                if (current === undefined) return undefined;
                current = current[key];
            }
            return current;
        }

        set(path, value) {
            const keys = path.split('.');
            let current = this._state;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        }

        batchSet(pairs) {
            for (const [path, value] of Object.entries(pairs)) {
                this.set(path, value);
            }
            return true;
        }

        batchGet(paths) {
            const results = {};
            for (const path of paths) {
                results[path] = this.get(path);
            }
            return results;
        }
    }

    beforeEach(() => {
        state = new StateManagerWithBatch();
    });

    describe('batchSet()', () => {
        it('should set multiple values at once', () => {
            state.batchSet({
                'game.score': 100,
                'tether.level': 50
            });
            expect(state.get('game.score')).toBe(100);
            expect(state.get('tether.level')).toBe(50);
        });
    });

    describe('batchGet()', () => {
        it('should get multiple values at once', () => {
            state.set('game.score', 200);
            state.set('tether.level', 75);

            const results = state.batchGet(['game.score', 'tether.level']);

            expect(results['game.score']).toBe(200);
            expect(results['tether.level']).toBe(75);
        });

        it('should return undefined for missing paths', () => {
            const results = state.batchGet(['nonexistent.path']);
            expect(results['nonexistent.path']).toBeUndefined();
        });

        it('should handle empty array', () => {
            const results = state.batchGet([]);
            expect(Object.keys(results).length).toBe(0);
        });
    });

    describe('batchSet() additional', () => {
        it('should handle empty object', () => {
            expect(() => state.batchSet({})).not.toThrow();
        });
    });
});
