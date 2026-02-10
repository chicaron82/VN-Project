/**
 * BootstrapTracker Tests
 *
 * Tests for the bootstrap paradox timeline system.
 * "Tracking your attempts through the loop."
 *
 * 848 is sacred. 💚🔥💀
 */

import { BootstrapTracker } from './BootstrapTracker';
import { StateManager } from '../core/StateManager';

describe('BootstrapTracker', () => {
    let stateManager: StateManager;
    let tracker: BootstrapTracker;

    beforeEach(() => {
        localStorage.clear();
        stateManager = new StateManager({});
        tracker = new BootstrapTracker(stateManager);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Initialization', () => {
        it('should start at attempt 848', () => {
            expect(tracker.getCurrentAttempt()).toBe(848);
        });

        it('should sync current attempt to StateManager', () => {
            expect(stateManager.get('game.loopVersion')).toBe(848);
        });

        it('should pre-populate with 5 corrupted attempts (843-847)', () => {
            const history = tracker.getHistory();
            expect(history.attempts).toHaveLength(5);

            // Check corrupted attempts in reverse order
            expect(history.attempts[0].number).toBe(847);
            expect(history.attempts[0].endingType).toBe('corrupted');
            expect(history.attempts[0].reason).toBe('[DATA CORRUPTED]');

            expect(history.attempts[4].number).toBe(843);
            expect(history.attempts[4].endingType).toBe('corrupted');
        });
    });

    describe('Recording Attempts', () => {
        it('should record a failed attempt', () => {
            tracker.recordAttempt('failed', 'Tether depleted', 'tori', 'bad');

            const history = tracker.getHistory();
            const lastAttempt = history.attempts[0];

            expect(lastAttempt.number).toBe(848);
            expect(lastAttempt.result).toBe('failed');
            expect(lastAttempt.reason).toBe('Tether depleted');
            expect(lastAttempt.route).toBe('tori');
            expect(lastAttempt.endingType).toBe('bad');
            expect(lastAttempt.timestamp).toBeTypeOf('number');
        });

        it('should record a succeeded attempt', () => {
            tracker.recordAttempt('succeeded', 'True ending reached', 'tori', 'true');

            const history = tracker.getHistory();
            const lastAttempt = history.attempts[0];

            expect(lastAttempt.result).toBe('succeeded');
            expect(lastAttempt.reason).toBe('True ending reached');
            expect(lastAttempt.endingType).toBe('true');
        });

        it('should increment attempt counter after recording', () => {
            expect(tracker.getCurrentAttempt()).toBe(848);

            tracker.recordAttempt('failed', 'Vessel collapse', 'tori', 'bad');

            expect(tracker.getCurrentAttempt()).toBe(849);
        });

        it('should add new attempts to the beginning', () => {
            tracker.recordAttempt('failed', 'First attempt', 'tori', 'bad');
            tracker.recordAttempt('failed', 'Second attempt', 'ronnie', 'bad');

            const history = tracker.getHistory();

            expect(history.attempts[0].reason).toBe('Second attempt');
            expect(history.attempts[1].reason).toBe('First attempt');
        });

        it('should keep only last 5 attempts', () => {
            // Record 6 attempts (beyond the max)
            for (let i = 0; i < 6; i++) {
                tracker.recordAttempt('failed', `Attempt ${i}`, 'tori', 'bad');
            }

            const history = tracker.getHistory();
            expect(history.attempts).toHaveLength(5);

            // Most recent should be at index 0
            expect(history.attempts[0].reason).toBe('Attempt 5');
            expect(history.attempts[4].reason).toBe('Attempt 1');
        });

        it('should update StateManager on record', () => {
            tracker.recordAttempt('failed', 'Test', 'tori', 'bad');

            expect(stateManager.get('game.loopVersion')).toBe(849);
        });
    });

    describe('Persistence', () => {
        it('should save timeline to localStorage', () => {
            tracker.recordAttempt('failed', 'Test attempt', 'ronnie', 'bad');

            const saved = localStorage.getItem('uv7_bootstrap_timeline');
            expect(saved).toBeTruthy();

            const parsed = JSON.parse(saved!);
            expect(parsed.currentAttempt).toBe(849);
            expect(parsed.attempts[0].reason).toBe('Test attempt');
        });

        it('should load timeline from localStorage', () => {
            tracker.recordAttempt('failed', 'Persisted attempt', 'tori', 'bad');

            // Create new tracker instance
            const newTracker = new BootstrapTracker(stateManager);

            expect(newTracker.getCurrentAttempt()).toBe(849);
            const history = newTracker.getHistory();
            expect(history.attempts[0].reason).toBe('Persisted attempt');
        });

        it('should handle corrupted localStorage gracefully', () => {
            localStorage.setItem('uv7_bootstrap_timeline', 'invalid json {{{');

            const newTracker = new BootstrapTracker(stateManager);

            // Should fallback to default timeline
            expect(newTracker.getCurrentAttempt()).toBe(848);
        });
    });

    describe('Manual Attempt Increment', () => {
        it('should increment attempt counter without recording', () => {
            expect(tracker.getCurrentAttempt()).toBe(848);

            tracker.incrementAttempt();

            expect(tracker.getCurrentAttempt()).toBe(849);
        });

        it('should sync increment to StateManager', () => {
            tracker.incrementAttempt();

            expect(stateManager.get('game.loopVersion')).toBe(849);
        });
    });

    describe('History Access', () => {
        it('should return readonly history', () => {
            const history = tracker.getHistory();

            expect(history.currentAttempt).toBe(848);
            expect(history.attempts).toHaveLength(5);
        });

        it('should include timestamp and dateString', () => {
            tracker.recordAttempt('failed', 'Test', 'tori', 'bad');

            const history = tracker.getHistory();
            const attempt = history.attempts[0];

            expect(attempt.timestamp).toBeTypeOf('number');
            expect(attempt.dateString).toBeTypeOf('string');
            expect(attempt.dateString.length).toBeGreaterThan(0);
        });
    });

    describe('Reset', () => {
        it('should reset to default timeline', () => {
            tracker.recordAttempt('failed', 'Test 1', 'tori', 'bad');
            tracker.recordAttempt('failed', 'Test 2', 'ronnie', 'bad');

            expect(tracker.getCurrentAttempt()).toBe(850);

            tracker.reset();

            expect(tracker.getCurrentAttempt()).toBe(848);
            const history = tracker.getHistory();
            expect(history.attempts[0].endingType).toBe('corrupted');
        });

        it('should sync reset to StateManager', () => {
            tracker.recordAttempt('failed', 'Test', 'tori', 'bad');
            expect(stateManager.get('game.loopVersion')).toBe(849);

            tracker.reset();

            expect(stateManager.get('game.loopVersion')).toBe(848);
        });
    });

    describe('Attempt Types', () => {
        it('should track bad endings', () => {
            tracker.recordAttempt('failed', 'Tether depleted', 'tori', 'bad');

            const history = tracker.getHistory();
            expect(history.attempts[0].endingType).toBe('bad');
        });

        it('should track digital forever endings', () => {
            tracker.recordAttempt('succeeded', 'Digital forever', 'tori', 'digitalForever');

            const history = tracker.getHistory();
            expect(history.attempts[0].endingType).toBe('digitalForever');
        });

        it('should track true endings', () => {
            tracker.recordAttempt('succeeded', 'True ending reached', 'tori', 'true');

            const history = tracker.getHistory();
            expect(history.attempts[0].endingType).toBe('true');
        });

        it('should track both routes', () => {
            tracker.recordAttempt('failed', 'Ronnie test', 'ronnie', 'bad');
            tracker.recordAttempt('failed', 'Tori test', 'tori', 'bad');

            const history = tracker.getHistory();
            expect(history.attempts[0].route).toBe('tori');
            expect(history.attempts[1].route).toBe('ronnie');
        });
    });

    describe('Corrupted Entries', () => {
        it('should have null timestamp for corrupted entries', () => {
            const history = tracker.getHistory();
            const corruptedEntry = history.attempts.find(a => a.endingType === 'corrupted');

            expect(corruptedEntry?.timestamp).toBeNull();
            expect(corruptedEntry?.dateString).toBe('[UNREADABLE]');
        });

        it('should mark corrupted entries with unknown route', () => {
            const history = tracker.getHistory();
            const corruptedEntry = history.attempts.find(a => a.endingType === 'corrupted');

            expect(corruptedEntry?.route).toBe('unknown');
        });
    });
});
