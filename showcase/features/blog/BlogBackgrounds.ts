/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE DYNAMIC BACKGROUNDS
 *
 * Phase 12: Fluid background transitions relative to timeline era
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Ambient background gradients that shift based on era
 * - Smooth CSS transitions
 * - Phase awareness (detects V1 vs V2 era)
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

// Define era colors
const ERAS = {
    CHAOS: 'radial-gradient(circle at 50% 50%, rgba(255, 60, 0, 0.15) 0%, rgba(255, 0, 80, 0.05) 50%, transparent 100%)', // V1 Red/Pink
    ORDER: 'radial-gradient(circle at 50% 50%, rgba(0, 160, 255, 0.15) 0%, rgba(0, 100, 255, 0.05) 50%, transparent 100%)', // Transition Blue
    MICHELIN: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.15) 0%, rgba(0, 200, 100, 0.05) 50%, transparent 100%)' // V2 Green
};

export class BlogBackgrounds {
    private container: HTMLElement | null;
    private background: HTMLElement | null;
    private observer: IntersectionObserver | null;
    private currentEra: string;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.container = null;
        this.background = null;
        this.observer = null;
        this.currentEra = ERAS.MICHELIN; // Default

        this.init();
    }

    private init(): void {
        this.createBackground();
        this.setupObserver();
        Logger.ui('🌈 [BlogBackgrounds] Initialized');
    }

    /**
     * Create background layer
     */
    private createBackground(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline || !timeline.parentElement) return;

        this.container = timeline.parentElement;

        // Create background element
        this.background = document.createElement('div');
        this.background.className = 'timeline-dynamic-background';

        // Initial style
        Object.assign(this.background.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '0', // Behind timeline
            background: this.currentEra,
            transition: 'background 1.5s ease-in-out',
            opacity: '0.6',
            pointerEvents: 'none'
        });

        // Insert behind timeline
        this.container.style.position = 'relative'; // Ensure positioning context
        this.container.insertBefore(this.background, timeline);
    }

    /**
     * Setup intersection observer to detect active phase
     */
    private setupObserver(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        const options = {
            root: null, // Viewport
            rootMargin: '-40% 0px -40% 0px', // Trigger when item is in middle 20%
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateBackground(entry.target as HTMLElement);
                }
            });
        }, options);

        // Observe all timeline items
        const items = timeline.querySelectorAll('.timeline-item');
        items.forEach(item => this.observer?.observe(item));
    }

    /**
     * Update background based on item content
     */
    private updateBackground(item: HTMLElement): void {
        if (!this.background) return;

        // Determine era based on title/content
        const title = item.querySelector('strong')?.textContent || '';
        const header = item.querySelector('h3')?.textContent || '';
        const text = title + ' ' + header;

        let targetEra = ERAS.MICHELIN; // Default

        // Logic to determine era
        if (text.includes('Phase 1') || text.includes('Phase 2') || text.includes('Genesis') || text.includes('Chaos')) {
            targetEra = ERAS.CHAOS;
        } else if (text.includes('Phase 3') || text.includes('Phase 4') || text.includes('Transition')) {
            targetEra = ERAS.ORDER;
        } else {
            targetEra = ERAS.MICHELIN;
        }

        // Apply if changed
        if (this.currentEra !== targetEra) {
            this.currentEra = targetEra;
            this.background.style.background = targetEra;
            // Also move the center point slightly for parallax feel? 
            // Nah, kept simple per requirements.
        }
    }

    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.background) {
            this.background.remove();
            this.background = null;
        }
        Logger.ui('🌈 [BlogBackgrounds] Destroyed');
    }
}
