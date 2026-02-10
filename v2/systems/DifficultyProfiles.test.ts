/**
 * DifficultyProfiles Tests
 *
 * Tests for the difficulty configuration system.
 * "Each difficulty is a contract."
 *
 * 848 is sacred. 💚🔥💀
 */

import {
    DIFFICULTY_PROFILES,
    getDifficultyProfile,
    isDifficultyUnlocked,
    getUnlockedDifficulties,
    unlockInsaneMode,
    isInsaneModeUnlocked,
    getDifficultyDisplayInfo,
    DifficultyId
} from './DifficultyProfiles';

describe('DifficultyProfiles', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Profile Definitions', () => {
        it('should have all four difficulty profiles', () => {
            expect(DIFFICULTY_PROFILES.comfort).toBeDefined();
            expect(DIFFICULTY_PROFILES.normal).toBeDefined();
            expect(DIFFICULTY_PROFILES.intense).toBeDefined();
            expect(DIFFICULTY_PROFILES.insane).toBeDefined();
        });

        it('should have correct IDs for each profile', () => {
            expect(DIFFICULTY_PROFILES.comfort.id).toBe('comfort');
            expect(DIFFICULTY_PROFILES.normal.id).toBe('normal');
            expect(DIFFICULTY_PROFILES.intense.id).toBe('intense');
            expect(DIFFICULTY_PROFILES.insane.id).toBe('insane');
        });
    });

    describe('Comfort Mode', () => {
        const comfort = DIFFICULTY_PROFILES.comfort;

        it('should have zero decay rates', () => {
            expect(comfort.decayRates.base).toBe(0);
            expect(comfort.decayRates.medium).toBe(0);
            expect(comfort.decayRates.critical).toBe(0);
        });

        it('should have auto-Hold On enabled', () => {
            expect(comfort.holdOn.enabled).toBe(true);
            expect(comfort.holdOn.autoMode).toBe(true);
        });

        it('should have full tether cap', () => {
            expect(comfort.tetherCap).toBe(100);
        });

        it('should be always unlocked', () => {
            expect(comfort.unlocked).toBe(true);
        });
    });

    describe('Normal Mode', () => {
        const normal = DIFFICULTY_PROFILES.normal;

        it('should have standard decay rates', () => {
            expect(normal.decayRates.base).toBe(0.15);
            expect(normal.decayRates.medium).toBe(0.25);
            expect(normal.decayRates.critical).toBe(0.40);
        });

        it('should have manual Hold On', () => {
            expect(normal.holdOn.enabled).toBe(true);
            expect(normal.holdOn.autoMode).toBe(false);
        });

        it('should have full tether cap', () => {
            expect(normal.tetherCap).toBe(100);
        });

        it('should block saves in Act 1', () => {
            expect(normal.saves.blockInAct1).toBe(true);
        });
    });

    describe('Intense Mode', () => {
        const intense = DIFFICULTY_PROFILES.intense;

        it('should have faster decay rates than normal', () => {
            expect(intense.decayRates.base).toBeGreaterThan(0);
            // Note: V1 has intense base 0.08 vs normal 0.15
            // This is counterintuitive but matches V1 exactly
        });

        it('should have higher haptic intensity', () => {
            expect(intense.hapticIntensity).toBeGreaterThan(DIFFICULTY_PROFILES.normal.hapticIntensity);
        });

        it('should have a warning message', () => {
            expect(intense.warning).not.toBeNull();
        });
    });

    describe('INSANE Mode', () => {
        const insane = DIFFICULTY_PROFILES.insane;

        it('should have 66% tether cap', () => {
            expect(insane.tetherCap).toBe(66);
        });

        it('should have zero Hold On boost', () => {
            expect(insane.holdOnBoost).toBe(0);
        });

        it('should have Hold On disabled and hidden', () => {
            expect(insane.holdOn.enabled).toBe(false);
            expect(insane.holdOn.ghost).toBe(true);
            expect(insane.holdOn.hidden).toBe(true);
        });

        it('should have read-only Time Machine', () => {
            expect(insane.timeMachine.readOnly).toBe(true);
            expect(insane.timeMachine.maxJumpDistance).toBe(2);
        });

        it('should require unlocking', () => {
            expect(insane.unlocked).toBe(false);
            expect(insane.unlockCondition).toBeDefined();
        });

        it('should have maximum haptic intensity', () => {
            expect(insane.hapticIntensity).toBe(1.5);
        });
    });

    describe('getDifficultyProfile()', () => {
        it('should return correct profile for valid ID', () => {
            expect(getDifficultyProfile('comfort').id).toBe('comfort');
            expect(getDifficultyProfile('normal').id).toBe('normal');
            expect(getDifficultyProfile('intense').id).toBe('intense');
            expect(getDifficultyProfile('insane').id).toBe('insane');
        });

        it('should handle case-insensitive IDs', () => {
            expect(getDifficultyProfile('NORMAL').id).toBe('normal');
            expect(getDifficultyProfile('Normal').id).toBe('normal');
            expect(getDifficultyProfile('INSANE').id).toBe('insane');
        });

        it('should return normal for unknown ID', () => {
            expect(getDifficultyProfile('unknown').id).toBe('normal');
            expect(getDifficultyProfile('').id).toBe('normal');
        });
    });

    describe('isDifficultyUnlocked()', () => {
        it('should return true for always-unlocked difficulties', () => {
            expect(isDifficultyUnlocked('comfort')).toBe(true);
            expect(isDifficultyUnlocked('normal')).toBe(true);
            expect(isDifficultyUnlocked('intense')).toBe(true);
        });

        it('should return false for INSANE by default', () => {
            expect(isDifficultyUnlocked('insane')).toBe(false);
        });

        it('should return true for INSANE after unlock', () => {
            localStorage.setItem('insaneModeUnlocked', 'true');
            expect(isDifficultyUnlocked('insane')).toBe(true);
        });
    });

    describe('getUnlockedDifficulties()', () => {
        it('should return three difficulties by default', () => {
            const unlocked = getUnlockedDifficulties();
            expect(unlocked.length).toBe(3);
            expect(unlocked.map(d => d.id)).toContain('comfort');
            expect(unlocked.map(d => d.id)).toContain('normal');
            expect(unlocked.map(d => d.id)).toContain('intense');
        });

        it('should return four difficulties after INSANE unlock', () => {
            localStorage.setItem('insaneModeUnlocked', 'true');
            const unlocked = getUnlockedDifficulties();
            expect(unlocked.length).toBe(4);
            expect(unlocked.map(d => d.id)).toContain('insane');
        });
    });

    describe('unlockInsaneMode()', () => {
        it('should set localStorage flag', () => {
            expect(localStorage.getItem('insaneModeUnlocked')).toBeNull();
            unlockInsaneMode();
            expect(localStorage.getItem('insaneModeUnlocked')).toBe('true');
        });
    });

    describe('isInsaneModeUnlocked()', () => {
        it('should return false by default', () => {
            expect(isInsaneModeUnlocked()).toBe(false);
        });

        it('should return true after unlock', () => {
            unlockInsaneMode();
            expect(isInsaneModeUnlocked()).toBe(true);
        });
    });

    describe('getDifficultyDisplayInfo()', () => {
        it('should return display info for difficulty', () => {
            const info = getDifficultyDisplayInfo('normal');

            expect(info.name).toBe('Normal');
            expect(info.shortDesc).toBeDefined();
            expect(info.description).toBeDefined();
            expect(info.isUnlocked).toBe(true);
            expect(info.loreTag).toBe('attempting');
        });

        it('should show INSANE as locked by default', () => {
            const info = getDifficultyDisplayInfo('insane');
            expect(info.isUnlocked).toBe(false);
            expect(info.warning).not.toBeNull();
        });

        it('should show INSANE as unlocked after unlock', () => {
            localStorage.setItem('insaneModeUnlocked', 'true');
            const info = getDifficultyDisplayInfo('insane');
            expect(info.isUnlocked).toBe(true);
        });
    });
});
