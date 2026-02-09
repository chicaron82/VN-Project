/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE HAPTICS
 *
 * Phase 14: Tactile feedback for mobile interactions
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Vibration patterns for clicks and interactions
 * - Checks for hardware support
 * - Different patterns for different actions (success, error, tick)
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export class BlogHaptics {
    private isSupported: boolean;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.isSupported = 'vibrate' in navigator;
        this.init();
    }

    private init(): void {
        this.attachListeners();
        Logger.ui('📳 [BlogHaptics] Initialized', { supported: this.isSupported });
    }

    /**
     * Attach event listeners
     */
    private attachListeners(): void {
        if (!this.isSupported) return;

        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        // Click feedback (Short tick)
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.timeline-btn') ||
                target.closest('.timeline-item') ||
                target.tagName === 'BUTTON') {
                this.vibrate('light');
            }
        });

        // Hover feedback (Very subtle, maybe too much? Skipping for now to save battery)

        // Scrubber feedback (if we can hook into it)
        // BlogScrubber creates its own events, or we listen to 'input' on range sliders
        const scrubber = document.querySelector('.timeline-scrubber input');
        if (scrubber) {
            scrubber.addEventListener('input', () => {
                this.vibrate(5); // Ultra short tick
            });
        }
    }

    /**
     * Trigger vibration
     * @param pattern - Duration in ms or pattern array, or preset name
     */
    public vibrate(pattern: number | number[] | 'light' | 'medium' | 'heavy' | 'success' | 'error'): void {
        if (!this.isSupported) return;

        let vibPattern: number | number[];

        switch (pattern) {
            case 'light':
                vibPattern = 10;
                break;
            case 'medium':
                vibPattern = 20;
                break;
            case 'heavy':
                vibPattern = 40;
                break;
            case 'success':
                vibPattern = [10, 30, 10]; // da-da
                break;
            case 'error':
                vibPattern = [50, 50, 50, 50, 50]; // bzz-bzz-bzz
                break;
            default:
                vibPattern = pattern;
        }

        try {
            navigator.vibrate(vibPattern);
        } catch (e) {
            // Ignore errors (e.g. if user interaction requirement not met)
        }
    }

    public destroy(): void {
        // No persistent listeners to remove really, mostly global delegation
        Logger.ui('📳 [BlogHaptics] Destroyed');
    }
}
