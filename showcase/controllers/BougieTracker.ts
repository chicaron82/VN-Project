/**
 * BougieTracker - Time since last bougie enhancement
 *
 * Because even our footer needs to flex a little. 💚🔥💀
 *
 * Tracks elapsed time since the last "bougie" enhancement was added
 * to the showcase. Updates live every second with restaurant-themed flair.
 */

export class BougieTracker {
    private timerElement: HTMLElement | null = null;
    private updateInterval: number | null = null;

    // Last bougie enhancement: Platform logos celebrating AI collaboration (Feb 13, 2026)
    private readonly LAST_ENHANCEMENT = new Date('2026-02-13T22:00:00');

    constructor() {
        this.init();
    }

    private init(): void {
        // Retry until footer element exists (footers are cloned from template)
        const findAndStart = (attempts = 0): void => {
            this.timerElement = document.getElementById('bougie-timer');
            if (this.timerElement) {
                this.startTimer();
            } else if (attempts < 20) {
                // Retry up to 20 times (2 seconds total)
                setTimeout(() => findAndStart(attempts + 1), 100);
            }
        };
        findAndStart();
    }

    private startTimer(): void {
        // Update immediately
        this.updateTime();

        // Then update every second
        this.updateInterval = window.setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    private updateTime(): void {
        if (!this.timerElement) return;

        const now = new Date();
        const elapsed = now.getTime() - this.LAST_ENHANCEMENT.getTime();

        // Calculate time units
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Format with restaurant flair
        let timeString = '';

        if (days > 0) {
            const remainingHours = hours % 24;
            timeString = `${days}d ${remainingHours}h (needs more butter)`;
        } else if (hours > 0) {
            const remainingMinutes = minutes % 60;
            timeString = `${hours}h ${remainingMinutes}m (simmering nicely)`;
        } else if (minutes > 0) {
            const remainingSeconds = seconds % 60;
            timeString = `${minutes}m ${remainingSeconds}s (just getting started)`;
        } else {
            timeString = `${seconds}s (fresh out the kitchen! 🔥)`;
        }

        this.timerElement.textContent = timeString;
    }

    /**
     * Clean up interval on destroy
     */
    public destroy(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
