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
