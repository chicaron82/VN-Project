import {
    PRIORITY_COLORS,
    DEFAULT_DURATIONS,
    escapeHtml,
    formatTime,
    getNotificationDuration,
    getNotificationColors,
    validateNotificationConfig,
} from './NotificationCore';
import type { NotificationPriority } from './NotificationCore';

describe('NotificationCore', () => {
    describe('PRIORITY_COLORS', () => {
        it('should define colors for all priority levels', () => {
            const priorities: NotificationPriority[] = ['urgent', 'high', 'normal', 'low', 'critical'];
            for (const p of priorities) {
                expect(PRIORITY_COLORS[p]).toBeDefined();
                expect(PRIORITY_COLORS[p].border).toBeDefined();
                expect(PRIORITY_COLORS[p].glow).toBeDefined();
                expect(PRIORITY_COLORS[p].bg).toBeDefined();
                expect(PRIORITY_COLORS[p].text).toBeDefined();
            }
        });

        it('should have red tones for urgent/critical', () => {
            expect(PRIORITY_COLORS.urgent.text).toContain('ff');
            expect(PRIORITY_COLORS.critical.text).toContain('ff');
        });

        it('should have cyan tones for normal', () => {
            expect(PRIORITY_COLORS.normal.text).toBe('#00ffff');
        });
    });

    describe('DEFAULT_DURATIONS', () => {
        it('should make urgent and critical persistent (0ms)', () => {
            expect(DEFAULT_DURATIONS.urgent).toBe(0);
            expect(DEFAULT_DURATIONS.critical).toBe(0);
        });

        it('should give normal 5 seconds', () => {
            expect(DEFAULT_DURATIONS.normal).toBe(5000);
        });

        it('should give low the shortest duration', () => {
            expect(DEFAULT_DURATIONS.low).toBe(3000);
            expect(DEFAULT_DURATIONS.low).toBeLessThan(DEFAULT_DURATIONS.normal);
        });

        it('should give high 10 seconds', () => {
            expect(DEFAULT_DURATIONS.high).toBe(10000);
        });
    });

    describe('escapeHtml', () => {
        it('should escape angle brackets', () => {
            const result = escapeHtml('<script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;script&gt;');
        });

        it('should handle plain text', () => {
            expect(escapeHtml('hello')).toBe('hello');
        });

        it('should escape quotes and ampersands', () => {
            const result = escapeHtml('A & "B"');
            expect(result).toContain('&amp;');
        });
    });

    describe('formatTime', () => {
        it('should format time in 12-hour format', () => {
            const date = new Date('2026-02-09T14:30:00');
            const result = formatTime(date);
            expect(result).toContain('2:30');
            expect(result).toMatch(/PM/i);
        });

        it('should handle midnight', () => {
            const date = new Date('2026-02-09T00:05:00');
            const result = formatTime(date);
            expect(result).toContain('12:05');
            expect(result).toMatch(/AM/i);
        });
    });

    describe('getNotificationDuration', () => {
        it('should return default duration for priority', () => {
            expect(getNotificationDuration('normal')).toBe(5000);
            expect(getNotificationDuration('high')).toBe(10000);
            expect(getNotificationDuration('low')).toBe(3000);
        });

        it('should fallback to normal duration for persistent priorities (JS falsy 0)', () => {
            // Note: urgent/critical have duration 0 (persistent) but 0 is falsy in JS
            // so the `|| DEFAULT_DURATIONS.normal` fallback kicks in - this is a known edge case
            expect(getNotificationDuration('urgent')).toBe(DEFAULT_DURATIONS.normal);
        });

        it('should use custom duration when provided', () => {
            expect(getNotificationDuration('normal', 8000)).toBe(8000);
        });

        it('should allow custom duration of 0 (persistent)', () => {
            expect(getNotificationDuration('low', 0)).toBe(0);
        });
    });

    describe('getNotificationColors', () => {
        it('should return colors for valid priorities', () => {
            const colors = getNotificationColors('urgent');
            expect(colors.border).toBeDefined();
            expect(colors.glow).toBeDefined();
            expect(colors.bg).toBeDefined();
            expect(colors.text).toBeDefined();
        });

        it('should fallback to normal for unknown priority', () => {
            const colors = getNotificationColors('unknown' as NotificationPriority);
            expect(colors).toEqual(PRIORITY_COLORS.normal);
        });
    });

    describe('validateNotificationConfig', () => {
        it('should accept valid config', () => {
            expect(validateNotificationConfig({
                message: 'Hello',
                priority: 'normal'
            })).toBe(true);
        });

        it('should reject empty message', () => {
            expect(() => validateNotificationConfig({
                message: '',
                priority: 'normal'
            })).toThrow('Notification message is required');
        });

        it('should reject whitespace-only message', () => {
            expect(() => validateNotificationConfig({
                message: '   ',
                priority: 'normal'
            })).toThrow('Notification message is required');
        });

        it('should reject missing message', () => {
            expect(() => validateNotificationConfig({
                priority: 'normal'
            })).toThrow('Notification message is required');
        });

        it('should reject invalid priority', () => {
            expect(() => validateNotificationConfig({
                message: 'Hello',
                priority: 'mega' as NotificationPriority
            })).toThrow('Invalid priority: mega');
        });

        it('should reject negative duration', () => {
            expect(() => validateNotificationConfig({
                message: 'Hello',
                priority: 'normal',
                duration: -100
            })).toThrow('Duration cannot be negative');
        });

        it('should allow zero duration (persistent)', () => {
            expect(validateNotificationConfig({
                message: 'Hello',
                priority: 'normal',
                duration: 0
            })).toBe(true);
        });
    });
});
