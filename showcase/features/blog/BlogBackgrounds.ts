/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE DYNAMIC BACKGROUNDS
 *
 * Phase 12: Fluid background transitions relative to timeline era
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Ambient background gradients that shift based on entry type
 * - Smooth CSS transitions
 * - Type awareness (chaos/debug → red, investigation/feature → blue, refactor/milestone → green)
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

// Define era colors
const ERAS = {
    CHAOS: 'radial-gradient(circle at 50% 50%, rgba(255, 60, 0, 0.15) 0%, rgba(255, 0, 80, 0.05) 50%, transparent 100%)',
    ORDER: 'radial-gradient(circle at 50% 50%, rgba(0, 160, 255, 0.15) 0%, rgba(0, 100, 255, 0.05) 50%, transparent 100%)',
    MICHELIN: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.15) 0%, rgba(0, 200, 100, 0.05) 50%, transparent 100%)'
};

// Map entry types to eras
const CHAOS_TYPES = new Set(['chaos-entry', 'debug', 'philosophy']);
const ORDER_TYPES = new Set(['investigation', 'feature', 'hygiene']);

export class BlogBackgrounds {
    private container: HTMLElement | null;
    private background: HTMLElement | null;
    private observer: IntersectionObserver | null;
    private currentEra: string;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.container = null;
        this.background = null;
        this.observer = null;
        this.currentEra = ERAS.MICHELIN;

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

        this.background = document.createElement('div');
        this.background.className = 'timeline-dynamic-background';

        Object.assign(this.background.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '0',
            background: this.currentEra,
            transition: 'background 1.5s ease-in-out',
            opacity: '0.6',
            pointerEvents: 'none'
        });

        this.container.style.position = 'relative';
        this.container.insertBefore(this.background, timeline);
    }

    /**
     * Setup intersection observer to detect active entry
     */
    private setupObserver(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateBackground(entry.target as HTMLElement);
                }
            });
        }, options);

        // Observe blog entries (not .timeline-item — that class was renamed)
        const items = timeline.querySelectorAll('.blog-entry');
        items.forEach(item => this.observer?.observe(item));

        // Re-observe when new entries are added (pagination / "Show More")
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.classList.contains('blog-entry')) {
                        this.observer?.observe(node);
                    }
                });
            });
        });
        this.mutationObserver.observe(timeline, { childList: true });
    }

    private mutationObserver: MutationObserver | null = null;

    /**
     * Update background based on entry type
     */
    private updateBackground(item: HTMLElement): void {
        if (!this.background) return;

        const type = item.getAttribute('data-type') || '';

        let targetEra: string;
        if (CHAOS_TYPES.has(type)) {
            targetEra = ERAS.CHAOS;
        } else if (ORDER_TYPES.has(type)) {
            targetEra = ERAS.ORDER;
        } else {
            targetEra = ERAS.MICHELIN;
        }

        if (this.currentEra !== targetEra) {
            this.currentEra = targetEra;
            this.background.style.background = targetEra;
        }
    }

    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        if (this.background) {
            this.background.remove();
            this.background = null;
        }
        Logger.ui('🌈 [BlogBackgrounds] Destroyed');
    }
}
