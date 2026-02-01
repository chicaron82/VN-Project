/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE PARALLAX
 *
 * Phase 11: Subtle parallax mechanics for timeline items
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Parallax effect on timeline markers (move slower than content)
 * - Dynamic depth perception during scroll
 * - Smooth interpolation using requestAnimationFrame
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

export class BlogParallax {
    private items: HTMLElement[];
    private isEnabled: boolean;
    private requestId: number | null;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.items = [];
        this.isEnabled = true;
        this.requestId = null;

        this.init();
    }

    private init(): void {
        this.refreshItems();
        this.bindEvents();
        this.startLoop();
        console.log('🌌 [BlogParallax] Initialized');
    }

    private refreshItems(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (timeline) {
            this.items = Array.from(timeline.querySelectorAll('.timeline-item'));
        }
    }

    private bindEvents(): void {
        // Refresh items when content updates (e.g. from search)
        window.addEventListener('uv7-content-updated', () => {
            this.refreshItems();
        });

        // Disable on reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isEnabled = !mediaQuery.matches;
        mediaQuery.addEventListener('change', (e) => {
            this.isEnabled = !e.matches;
            if (!this.isEnabled) {
                this.resetTransforms();
            }
        });
    }

    private startLoop(): void {
        const update = () => {
            if (this.isEnabled && this.items.length > 0) {
                this.updateParallax();
            }
            this.requestId = requestAnimationFrame(update);
        };
        this.requestId = requestAnimationFrame(update);
    }

    private updateParallax(): void {
        const viewportHeight = window.innerHeight;
        const center = viewportHeight / 2;

        this.items.forEach(item => {
            const rect = item.getBoundingClientRect();

            // Skip if not in viewport (with buffer)
            if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;

            // Calculate distance from center (-1 to 1)
            const itemCenter = rect.top + (rect.height / 2);
            const distFromCenter = (itemCenter - center) / center;

            // Apply parallax properties
            const marker = item.querySelector('.timeline-marker') as HTMLElement;
            if (marker) {
                // Markers move slightly slower/offset based on position
                // When item goes UP (scrolling down), marker shifts DOWN slightly -> moves slower
                const yOffset = distFromCenter * 15; // Max 15px shift
                marker.style.transform = `translateY(${yOffset}px)`;
            }

            // Optional: Content staggering
            // const content = item.querySelector('.timeline-content') as HTMLElement;
            // if (content) {
            //     const yOffset = distFromCenter * -5; // Content moves slightly faster
            //     content.style.transform = `translateY(${yOffset}px)`;
            // }
        });
    }

    private resetTransforms(): void {
        this.items.forEach(item => {
            const marker = item.querySelector('.timeline-marker') as HTMLElement;
            if (marker) {
                marker.style.transform = '';
            }
        });
    }

    public destroy(): void {
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
        this.resetTransforms();
        console.log('🌌 [BlogParallax] Destroyed');
    }
}
