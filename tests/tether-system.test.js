import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * TetherSystem Integration Tests
 * 
 * Tests for the TetherSystem's integration with StateManager.
 * Verifies reactive state management and tether mechanics.
 */

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; })
};
global.localStorage = localStorageMock;

// Mock console
global.console = { ...console, log: vi.fn(), error: vi.fn() };

// Mock GameConfig
global.GameConfig = {
    TETHER: {
        INITIAL_LEVEL: 100,
        DECAY_INTERVAL_MS: 100,
        THRESHOLD_CRITICAL: 30,
        THRESHOLD_MEDIUM_DECAY: 50,
        THRESHOLD_CRITICAL_DECAY: 25
    }
};

// Mock getDifficultyProfile
global.getDifficultyProfile = vi.fn(() => ({
    decayRates: { base: 0.05, medium: 0.08, critical: 0.1 },
    tetherCap: 100,
    holdOnBoost: 15,
    holdOnCooldown: 30000
}));

/**
 * Simplified StateManager for testing
 */
class StateManager {
    constructor() {
        this._state = {
            tether: { level: 100, difficulty: 'normal', cap: 100, decayRate: 0.05 },
            ui: { hidden: false }
        };
        this._subscribers = new Map();
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
        const oldValue = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = value;
        this._notifySubscribers(path, value, oldValue);
    }

    subscribe(path, callback) {
        if (!this._subscribers.has(path)) this._subscribers.set(path, new Set());
        this._subscribers.get(path).add(callback);
        return () => this._subscribers.get(path)?.delete(callback);
    }

    _notifySubscribers(path, newValue, oldValue) {
        const subs = this._subscribers.get(path);
        if (subs) subs.forEach(cb => cb(newValue, oldValue));
    }
}

/**
 * Simplified TetherSystem for testing
 */
class TetherSystem {
    constructor(game, route) {
        this.game = game;
        this.route = route;

        // Initialize tether state in StateManager
        this.game.state.set('tether.level', GameConfig.TETHER.INITIAL_LEVEL);
        this.game.state.set('tether.difficulty', 'normal');
        this.game.state.set('tether.cap', 100);

        this.holdOnCooldown = false;
        this.HOLD_ON_BOOST = 15;
        this.tetherCap = 100;
    }

    get tetherLevel() {
        return this.game.state.get('tether.level');
    }

    set tetherLevel(value) {
        this.game.state.set('tether.level', value);
    }

    updateTether(amount, reason = '') {
        const previousLevel = this.tetherLevel;
        this.tetherLevel = Math.max(0, Math.min(this.tetherCap, this.tetherLevel + amount));
        return this.tetherLevel;
    }

    holdOn() {
        if (this.holdOnCooldown) return false;
        this.updateTether(this.HOLD_ON_BOOST, 'HOLD ON');
        this.holdOnCooldown = true;
        return true;
    }

    reset() {
        this.tetherLevel = 100;
        this.holdOnCooldown = false;
    }
}

// ========================================
// TEST SUITES
// ========================================

describe('TetherSystem', () => {
    let game;
    let tether;

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();

        game = {
            state: new StateManager(),
            settingsManager: { settings: { tetherDifficulty: 'normal' } }
        };
        tether = new TetherSystem(game, {});
    });

    // ========================================
    // STATE MANAGER INTEGRATION
    // ========================================

    describe('StateManager Integration', () => {
        it('should initialize tether level in StateManager', () => {
            expect(game.state.get('tether.level')).toBe(100);
        });

        it('should read tether level from StateManager via getter', () => {
            game.state.set('tether.level', 75);
            expect(tether.tetherLevel).toBe(75);
        });

        it('should write tether level to StateManager via setter', () => {
            tether.tetherLevel = 50;
            expect(game.state.get('tether.level')).toBe(50);
        });

        it('should store difficulty in StateManager', () => {
            expect(game.state.get('tether.difficulty')).toBe('normal');
        });

        it('should store cap in StateManager', () => {
            expect(game.state.get('tether.cap')).toBe(100);
        });
    });

    // ========================================
    // REACTIVE SUBSCRIPTIONS
    // ========================================

    describe('Reactive Subscriptions', () => {
        it('should notify subscribers when tether level changes', () => {
            const callback = vi.fn();
            game.state.subscribe('tether.level', callback);

            tether.tetherLevel = 80;

            expect(callback).toHaveBeenCalledWith(80, 100);
        });

        it('should allow UI to react to tether changes', () => {
            let displayedLevel = 100;
            game.state.subscribe('tether.level', (newLevel) => {
                displayedLevel = newLevel;
            });

            tether.updateTether(-20);

            expect(displayedLevel).toBe(80);
        });
    });

    // ========================================
    // TETHER MECHANICS
    // ========================================

    describe('updateTether()', () => {
        it('should decrease tether level', () => {
            tether.updateTether(-10);
            expect(tether.tetherLevel).toBe(90);
        });

        it('should increase tether level', () => {
            tether.tetherLevel = 50;
            tether.updateTether(20);
            expect(tether.tetherLevel).toBe(70);
        });

        it('should not exceed cap (100%)', () => {
            tether.updateTether(50);
            expect(tether.tetherLevel).toBe(100);
        });

        it('should not go below 0%', () => {
            tether.updateTether(-200);
            expect(tether.tetherLevel).toBe(0);
        });
    });

    describe('holdOn()', () => {
        it('should restore tether by HOLD_ON_BOOST', () => {
            tether.tetherLevel = 50;
            tether.holdOn();
            expect(tether.tetherLevel).toBe(65); // 50 + 15
        });

        it('should not exceed cap when restoring', () => {
            tether.tetherLevel = 95;
            tether.holdOn();
            expect(tether.tetherLevel).toBe(100);
        });

        it('should set cooldown after use', () => {
            tether.holdOn();
            expect(tether.holdOnCooldown).toBe(true);
        });

        it('should not work during cooldown', () => {
            tether.tetherLevel = 50;
            tether.holdOn(); // First use
            tether.tetherLevel = 40; // Simulate decay
            const result = tether.holdOn(); // Should fail
            expect(result).toBe(false);
            expect(tether.tetherLevel).toBe(40);
        });
    });

    describe('reset()', () => {
        it('should reset tether to 100%', () => {
            tether.tetherLevel = 25;
            tether.reset();
            expect(tether.tetherLevel).toBe(100);
        });

        it('should clear cooldown', () => {
            tether.holdOn();
            tether.reset();
            expect(tether.holdOnCooldown).toBe(false);
        });
    });
});

// ========================================
// EDGE CASES
// ========================================

describe('TetherSystem Edge Cases', () => {
    let game;
    let tether;

    beforeEach(() => {
        game = {
            state: new StateManager(),
            settingsManager: { settings: { tetherDifficulty: 'normal' } }
        };
        tether = new TetherSystem(game, {});
    });

    it('should handle rapid tether updates', () => {
        for (let i = 0; i < 100; i++) {
            tether.updateTether(-1);
        }
        expect(tether.tetherLevel).toBe(0);
    });

    it('should handle alternating increases and decreases', () => {
        tether.updateTether(-30);
        tether.updateTether(10);
        tether.updateTether(-20);
        tether.updateTether(15);
        expect(tether.tetherLevel).toBe(75); // 100 - 30 + 10 - 20 + 15
    });

    it('should handle fractional values', () => {
        tether.updateTether(-0.5);
        expect(tether.tetherLevel).toBe(99.5);
    });
});
