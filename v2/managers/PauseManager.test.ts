import { PauseManager } from './PauseManager';
import { EventBus } from '@core/EventBus';

describe('PauseManager', () => {
    let pauseManager: PauseManager;
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
        pauseManager = new PauseManager(eventBus);
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    describe('Initialization', () => {
        it('should start unpaused', () => {
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should start with no active reasons', () => {
            expect(pauseManager.activeReasons).toEqual([]);
        });
    });

    // ========================================
    // REQUEST / RELEASE
    // ========================================

    describe('Request & Release', () => {
        it('should pause when a reason is requested', () => {
            pauseManager.request('tutorial');
            expect(pauseManager.isPaused).toBe(true);
            expect(pauseManager.hasReason('tutorial')).toBe(true);
        });

        it('should unpause when all reasons are released', () => {
            pauseManager.request('tutorial');
            pauseManager.release('tutorial');
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should stay paused when releasing one of multiple reasons', () => {
            pauseManager.request('tutorial');
            pauseManager.request('pauseMenu');

            pauseManager.release('tutorial');
            expect(pauseManager.isPaused).toBe(true);
            expect(pauseManager.hasReason('pauseMenu')).toBe(true);
            expect(pauseManager.hasReason('tutorial')).toBe(false);

            pauseManager.release('pauseMenu');
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should handle duplicate requests idempotently', () => {
            pauseManager.request('tutorial');
            pauseManager.request('tutorial');

            // Set-based, so one release should clear it
            pauseManager.release('tutorial');
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should list all active reasons', () => {
            pauseManager.request('tutorial');
            pauseManager.request('overlay');
            pauseManager.request('cutscene');

            const reasons = pauseManager.activeReasons;
            expect(reasons).toContain('tutorial');
            expect(reasons).toContain('overlay');
            expect(reasons).toContain('cutscene');
            expect(reasons).toHaveLength(3);
        });
    });

    // ========================================
    // RELEASE ALL
    // ========================================

    describe('releaseAll', () => {
        it('should clear all reasons and unpause', () => {
            pauseManager.request('tutorial');
            pauseManager.request('pauseMenu');
            pauseManager.request('cutscene');

            pauseManager.releaseAll();
            expect(pauseManager.isPaused).toBe(false);
            expect(pauseManager.activeReasons).toEqual([]);
        });

        it('should not crash when already unpaused', () => {
            expect(() => pauseManager.releaseAll()).not.toThrow();
        });
    });

    // ========================================
    // SUBSCRIBER NOTIFICATIONS
    // ========================================

    describe('Subscriber Notifications', () => {
        it('should notify listener on pause', () => {
            const listener = vi.fn();
            pauseManager.subscribe(listener);

            pauseManager.request('tutorial');

            expect(listener).toHaveBeenCalledWith({
                isPaused: true,
                reasons: ['tutorial']
            });
        });

        it('should notify listener on unpause', () => {
            const listener = vi.fn();
            pauseManager.request('tutorial');

            pauseManager.subscribe(listener);
            pauseManager.release('tutorial');

            expect(listener).toHaveBeenCalledWith({
                isPaused: false,
                reasons: []
            });
        });

        it('should NOT notify when adding a second reason (already paused)', () => {
            const listener = vi.fn();
            pauseManager.request('tutorial');

            pauseManager.subscribe(listener);
            pauseManager.request('overlay');

            // State didn't change (still paused), so no notification
            expect(listener).not.toHaveBeenCalled();
        });

        it('should notify on releaseAll', () => {
            const listener = vi.fn();
            pauseManager.request('a');
            pauseManager.request('b');

            pauseManager.subscribe(listener);
            pauseManager.releaseAll();

            expect(listener).toHaveBeenCalledWith({
                isPaused: false,
                reasons: []
            });
        });

        it('should support unsubscribe', () => {
            const listener = vi.fn();
            const unsub = pauseManager.subscribe(listener);

            unsub();
            pauseManager.request('tutorial');

            expect(listener).not.toHaveBeenCalled();
        });
    });

    // ========================================
    // EDGE CASES
    // ========================================

    describe('Edge Cases', () => {
        it('should warn on empty reason string for request', () => {
            pauseManager.request('');
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should warn on releasing non-existent reason', () => {
            expect(() => pauseManager.release('never_added')).not.toThrow();
            expect(pauseManager.isPaused).toBe(false);
        });

        it('should survive listener that throws', () => {
            pauseManager.subscribe(() => { throw new Error('boom'); });
            const goodListener = vi.fn();
            pauseManager.subscribe(goodListener);

            pauseManager.request('tutorial');

            // Good listener should still get called despite first throwing
            expect(goodListener).toHaveBeenCalled();
        });
    });

    // ========================================
    // DEBUG INFO
    // ========================================

    describe('Debug Info', () => {
        it('should return correct debug info', () => {
            const listener = vi.fn();
            pauseManager.subscribe(listener);
            pauseManager.request('test');

            const info = pauseManager.getDebugInfo();
            expect(info.isPaused).toBe(true);
            expect(info.reasonCount).toBe(1);
            expect(info.reasons).toEqual(['test']);
            expect(info.listenerCount).toBe(1);
        });
    });
});
