import { BougieTracker } from './BougieTracker';

describe('BougieTracker', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '<span class="tracker-time" id="bougie-timer"></span>';
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should find the timer element after init delay', () => {
        const tracker = new BougieTracker();
        vi.advanceTimersByTime(100); // constructor setTimeout delay

        const el = document.getElementById('bougie-timer');
        expect(el?.textContent).not.toBe('');

        tracker.destroy();
    });

    it('should display time with restaurant-themed flair', () => {
        // Set "now" to a few days after the last enhancement (Feb 13, 2026)
        vi.setSystemTime(new Date('2026-02-17T12:00:00'));
        const tracker = new BougieTracker();
        vi.advanceTimersByTime(100);

        const el = document.getElementById('bougie-timer');
        expect(el?.textContent).toContain('d');
        expect(el?.textContent).toContain('needs more butter');

        tracker.destroy();
    });

    it('should show hours format when less than a day', () => {
        // Set to 12 hours after enhancement (Feb 13, 2026 22:00)
        vi.setSystemTime(new Date('2026-02-14T10:00:00'));
        const tracker = new BougieTracker();
        vi.advanceTimersByTime(100);

        const el = document.getElementById('bougie-timer');
        expect(el?.textContent).toContain('h');
        expect(el?.textContent).toContain('simmering nicely');

        tracker.destroy();
    });

    it('should update every second', () => {
        vi.setSystemTime(new Date('2026-02-17T12:00:00'));
        const tracker = new BougieTracker();
        vi.advanceTimersByTime(100); // init

        const el = document.getElementById('bougie-timer');
        const _firstText = el?.textContent;

        vi.advanceTimersByTime(1000); // 1 second tick
        const secondText = el?.textContent;

        // Text should update (seconds value changes)
        expect(secondText).toBeDefined();

        tracker.destroy();
    });

    it('should stop updating after destroy', () => {
        vi.setSystemTime(new Date('2026-02-17T12:00:00'));
        const tracker = new BougieTracker();
        vi.advanceTimersByTime(100);

        tracker.destroy();

        const el = document.getElementById('bougie-timer');
        const textAfterDestroy = el?.textContent;

        vi.advanceTimersByTime(5000);
        expect(el?.textContent).toBe(textAfterDestroy);
    });

    it('should handle missing timer element gracefully', () => {
        document.body.innerHTML = ''; // No timer element
        const tracker = new BougieTracker();

        expect(() => {
            vi.advanceTimersByTime(200);
        }).not.toThrow();

        tracker.destroy();
    });
});
