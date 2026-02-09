import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HapticSystem } from './HapticSystem';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import { Logger } from '@utils/Logger';

describe('HapticSystem', () => {
    let hapticSystem: HapticSystem;
    let eventBus: EventBus;
    let mockSettings: any;

    beforeEach(() => {
        eventBus = new EventBus();
        mockSettings = {
            getHapticEnabled: vi.fn(() => true),
            getComfortIntensity: vi.fn(() => 1), // Normal
        };
        hapticSystem = new HapticSystem(eventBus, mockSettings);

        // Mock navigator.vibrate
        global.navigator = { vibrate: vi.fn() } as any;
    });

    it('should trigger basic haptic pattern', () => {
        hapticSystem.trigger('LIGHT');
        expect(navigator.vibrate).toHaveBeenCalledWith(GameConfig.HAPTICS.LIGHT);
    });

    it('should respect haptic disabled setting', () => {
        mockSettings.getHapticEnabled.mockReturnValue(false);
        hapticSystem.trigger('LIGHT');
        expect(navigator.vibrate).not.toHaveBeenCalled();
    });

    it('should scale pattern for Gentle comfort (0)', () => {
        mockSettings.getComfortIntensity.mockReturnValue(0);
        // LIGHT is 10. 10 * 0.6 = 6.
        hapticSystem.trigger('LIGHT');
        // V1 parity: scalePattern returns an array for single values when scaled
        expect(navigator.vibrate).toHaveBeenCalledWith([6]);
    });

    it('should scale pattern for INSANE comfort (3)', () => {
        mockSettings.getComfortIntensity.mockReturnValue(3);
        // LIGHT is 10. 10 * 2.0 = 20.
        hapticSystem.trigger('LIGHT');
        // V1 parity: scalePattern returns an array for single values when scaled
        expect(navigator.vibrate).toHaveBeenCalledWith([20]);
    });

    it('should debounce rapid triggers', () => {
        hapticSystem.trigger('LIGHT');
        hapticSystem.trigger('LIGHT'); // Should be ignored
        expect(navigator.vibrate).toHaveBeenCalledTimes(1);
    });

    it('should allow forced triggers to bypass debounce', () => {
        hapticSystem.trigger('LIGHT');
        hapticSystem.trigger('LIGHT', '', { force: true }); // V1 parity: description param before options
        expect(navigator.vibrate).toHaveBeenCalledTimes(2);
    });

    it('should trigger sensory feedback (Haptic + Event)', () => {
        let visualCueReceived: any = null;
        eventBus.on('visual:cue', (data) => {
            visualCueReceived = data;
        });

        hapticSystem.triggerSensory('denied');

        // Check Haptic - DENIED pattern is [80, 20, 80]
        expect(navigator.vibrate).toHaveBeenCalledWith(GameConfig.HAPTICS.DENIED);

        // Check Visual Event
        expect(visualCueReceived).not.toBeNull();
        expect(visualCueReceived.type).toBe('denied'); // Visual type matches the cue name
        expect(visualCueReceived.channel).toBe('critical');
    });

    describe('V1 Parity Features', () => {
        it('should accept description parameter in trigger()', () => {
            const loggerSpy = vi.spyOn(Logger, 'effect').mockImplementation(() => {});

            // Enable debug mode for logging
            (GameConfig as any).DEBUG_MODE = true;

            hapticSystem.trigger('LIGHT', 'Test haptic description');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('Test haptic description'),
                expect.anything()
            );

            (GameConfig as any).DEBUG_MODE = false;
            loggerSpy.mockRestore();
        });

        it('should provide triggerHaptic() alias for V1 compatibility', () => {
            hapticSystem.triggerHaptic('MEDIUM');
            expect(navigator.vibrate).toHaveBeenCalled();
        });

        it('should provide triggerSensoryFeedback() alias for V1 compatibility', () => {
            hapticSystem.triggerSensoryFeedback('denied');
            expect(navigator.vibrate).toHaveBeenCalled();
        });

        it('should accept target element in triggerSensory()', () => {
            const mockElement = document.createElement('div');
            const mockVisualCueManager = {
                trigger: vi.fn()
            };

            hapticSystem.setVisualCueManager(mockVisualCueManager);

            // Need to force the trigger since it might be debounced
            hapticSystem.trigger('LIGHT', '', { force: true });
            hapticSystem.triggerSensory('denied', mockElement, 'Test sensory cue');

            expect(mockVisualCueManager.trigger).toHaveBeenCalledWith(
                'denied', // Visual type matches the cue name
                mockElement,
                { channel: 'critical' }
            );
        });

        it('should log sensory events when DEBUG_MODE is enabled', () => {
            (GameConfig as any).DEBUG_MODE = true;

            hapticSystem.trigger('LIGHT', 'Test event');

            const log = hapticSystem.getSensoryLog();
            expect(log.length).toBe(1);
            expect(log[0].cueType).toBe('LIGHT');
            expect(log[0].description).toBe('Test event');
            expect(log[0].comfort).toBe(1);

            (GameConfig as any).DEBUG_MODE = false;
        });

        it('should clear sensory log', () => {
            (GameConfig as any).DEBUG_MODE = true;

            hapticSystem.trigger('LIGHT', 'Test 1');
            hapticSystem.trigger('MEDIUM', 'Test 2', { force: true });

            expect(hapticSystem.getSensoryLog().length).toBe(2);

            hapticSystem.clearSensoryLog();

            expect(hapticSystem.getSensoryLog().length).toBe(0);

            (GameConfig as any).DEBUG_MODE = false;
        });

        it('should limit sensory log to maxSensoryLog entries', () => {
            (GameConfig as any).DEBUG_MODE = true;

            // Trigger 110 events (max is 100)
            for (let i = 0; i < 110; i++) {
                hapticSystem.trigger('LIGHT', `Event ${i}`, { force: true });
            }

            const log = hapticSystem.getSensoryLog();
            expect(log.length).toBe(100);
            // Oldest entries should be removed
            expect(log[0].description).toBe('Event 10');

            (GameConfig as any).DEBUG_MODE = false;
        });

        it('should get all haptic patterns', () => {
            const patterns = hapticSystem.getHapticPatterns();
            expect(patterns).toHaveProperty('LIGHT');
            expect(patterns).toHaveProperty('MEDIUM');
            expect(patterns).toHaveProperty('DENIED');
        });

        it('should warn when unknown sensory cue is triggered', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {});
            (GameConfig as any).DEBUG_MODE = true;

            // Cast to any to bypass TypeScript type checking
            (hapticSystem as any).triggerSensory('UNKNOWN_CUE');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('Unknown sensory cue')
            );

            (GameConfig as any).DEBUG_MODE = false;
            loggerSpy.mockRestore();
        });

        it('should include timestamp in sensory log entries', () => {
            (GameConfig as any).DEBUG_MODE = true;

            hapticSystem.trigger('LIGHT', 'Test');

            const log = hapticSystem.getSensoryLog();
            expect(log[0].time).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Time format HH:MM:SS

            (GameConfig as any).DEBUG_MODE = false;
        });
    });
});
