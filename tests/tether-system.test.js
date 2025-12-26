import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TetherSystem } from '../system/tether-system.js';

// Mock difficulty profiles
const DIFFICULTY_PROFILES = {
    relaxed: {
        id: 'relaxed',
        name: 'Relaxed',
        decayRates: { base: 0.03, medium: 0.05, critical: 0.07 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000
    },
    normal: {
        id: 'normal',
        name: 'Normal',
        decayRates: { base: 0.04, medium: 0.065, critical: 0.10 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000
    },
    intense: {
        id: 'intense',
        name: 'Intense',
        decayRates: { base: 0.08, medium: 0.12, critical: 0.18 },
        tetherCap: 100,
        holdOnBoost: 15,
        holdOnCooldown: 30000
    },
    insane: {
        id: 'insane',
        name: 'INSANE',
        decayRates: { base: 0.10, medium: 0.15, critical: 0.22 },
        tetherCap: 66,
        holdOnBoost: 0,
        holdOnCooldown: 30000
    }
};

// Mock getDifficultyProfile function
global.getDifficultyProfile = (difficultyId) => {
    const normalized = difficultyId.toLowerCase();
    return DIFFICULTY_PROFILES[normalized] || DIFFICULTY_PROFILES.normal;
};

// Mock GameConfig
global.GameConfig = {
    TETHER: {
        INITIAL_LEVEL: 100,
        DECAY_INTERVAL_MS: 1000,
        THRESHOLD_CRITICAL: 30,
        THRESHOLD_MEDIUM_DECAY: 50,
        THRESHOLD_CRITICAL_DECAY: 30
    }
};

describe('TetherSystem', () => {
    let tetherSystem;
    let mockGame;
    let mockRoute;
    let mockState; // Track state internally

    beforeEach(() => {
        // Internal state tracker
        mockState = {
            'tether.level': 100,
            'tether.difficulty': 'normal',
            'tether.cap': 100,
            'tether.decayRate': 0.04
        };

        // Mock game object
        mockGame = {
            state: {
                get: vi.fn((path) => {
                    return mockState[path] ?? null;
                }),
                set: vi.fn((path, value) => {
                    mockState[path] = value;
                }),
                subscribe: vi.fn(() => () => { }) // Return unsubscribe function
            },
            settingsManager: {
                settings: {
                    tetherDifficulty: 'normal'
                }
            },
            notificationShade: {
                updateStatusBar: vi.fn()
            },
            displayScene: vi.fn() // Mock for onTetherDeath
        };

        mockRoute = {};

        tetherSystem = new TetherSystem(mockGame, mockRoute);
    });

    describe('Tether updates', () => {
        it('should update tether level', () => {
            const newLevel = tetherSystem.updateTether(-10, 'test decay');
            expect(newLevel).toBe(90);
            expect(tetherSystem.tetherLevel).toBe(90);
        });

        it('should clamp tether to 0 minimum', () => {
            tetherSystem.tetherLevel = 5;
            const newLevel = tetherSystem.updateTether(-10);
            expect(newLevel).toBe(0);
        });

        it('should clamp tether to cap maximum', () => {
            tetherSystem.tetherLevel = 95;
            const newLevel = tetherSystem.updateTether(10);
            expect(newLevel).toBe(100);
        });

        it('should return new tether level', () => {
            const result = tetherSystem.updateTether(5);
            expect(result).toBe(tetherSystem.tetherLevel);
        });
    });

    describe('Decay control', () => {
        it('should start decay timer', () => {
            tetherSystem.startDecay();
            expect(tetherSystem.tetherDecayTimer).toBeDefined();
            expect(tetherSystem.tetherDecayTimer).not.toBeNull();
        });

        it('should stop decay timer', () => {
            tetherSystem.startDecay();
            tetherSystem.stopDecay();
            expect(tetherSystem.tetherDecayTimer).toBeNull();
        });

        it('should not create duplicate decay timers', () => {
            tetherSystem.startDecay();
            const firstTimer = tetherSystem.tetherDecayTimer;

            tetherSystem.startDecay(); // Try to start again

            expect(tetherSystem.tetherDecayTimer).toBe(firstTimer);
        });

        it('should clear cooldown timer when stopping decay', () => {
            tetherSystem.holdOnCooldownTimer = setInterval(() => { }, 1000);
            tetherSystem.stopDecay();
            expect(tetherSystem.holdOnCooldownTimer).toBeNull();
        });
    });

    describe('Hold On functionality', () => {
        it('should boost tether by HOLD_ON_BOOST amount', () => {
            tetherSystem.tetherLevel = 50;
            const boost = tetherSystem.HOLD_ON_BOOST;

            tetherSystem.holdOn();

            expect(tetherSystem.tetherLevel).toBe(50 + boost);
        });

        it('should set cooldown flag', () => {
            tetherSystem.holdOn();
            expect(tetherSystem.holdOnCooldown).toBe(true);
        });

        it('should not allow Hold On during cooldown', () => {
            tetherSystem.holdOnCooldown = true;
            const initialLevel = tetherSystem.tetherLevel;

            tetherSystem.holdOn();

            expect(tetherSystem.tetherLevel).toBe(initialLevel); // No change
        });

        it('should mark hasUsedHoldOn flag', () => {
            expect(tetherSystem.hasUsedHoldOn).toBe(false);
            tetherSystem.holdOn();
            expect(tetherSystem.hasUsedHoldOn).toBe(true);
        });
    });

    describe('Difficulty profiles', () => {
        it('should have different decay rates per difficulty', () => {
            const relaxed = DIFFICULTY_PROFILES.relaxed.decayRates.base;
            const normal = DIFFICULTY_PROFILES.normal.decayRates.base;
            const intense = DIFFICULTY_PROFILES.intense.decayRates.base;

            expect(relaxed).toBeLessThan(normal);
            expect(normal).toBeLessThan(intense);
        });

        it('should have different tether caps per difficulty', () => {
            const normal = DIFFICULTY_PROFILES.normal.tetherCap;
            const insane = DIFFICULTY_PROFILES.insane.tetherCap;

            expect(insane).toBeLessThan(normal);
        });
    });
});
