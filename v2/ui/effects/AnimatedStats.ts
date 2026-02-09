/**
 * ========================================
 * UV7 ANIMATED STATS - V2
 * Count-up numbers and progress bars
 * ========================================
 *
 * Handles counting up numbers and animating progress bars when they scroll into view.
 * Uses IntersectionObserver for performance.
 *
 * Features:
 * - Count-up animation with ease-out quartic easing
 * - Progress bar width animation
 * - Intersection observer for scroll-triggered animations
 * - One-time animation (elements are unobserved after animation)
 *
 * "Built with love. 💚🔥💀"
 */

import { Logger } from '@utils/Logger';

class AnimatedStats {
    private stats: NodeListOf<Element>;
    private bars: NodeListOf<Element>;

    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.bars = document.querySelectorAll('.metric-fill');
        this.init();
    }

    private init(): void {
        const options: IntersectionObserverInit = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateNumber(entry.target as HTMLElement);
                    } else if (entry.target.classList.contains('metric-fill')) {
                        this.animateBar(entry.target as HTMLElement);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.stats.forEach(stat => observer.observe(stat));
        this.bars.forEach(bar => {
            const barElement = bar as HTMLElement;
            // Store original width and set to 0 initially
            const targetWidth = barElement.style.width;
            barElement.dataset.width = targetWidth;
            barElement.style.width = '0%';
            observer.observe(bar);
        });
    }

    private animateNumber(element: HTMLElement): void {
        const target = parseInt(element.dataset.target || '0');
        if (isNaN(target)) return;

        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quartic
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(start + (target - start) * ease);
            element.textContent = String(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = String(target); // Ensure exact final value
            }
        };

        requestAnimationFrame(update);
    }

    private animateBar(element: HTMLElement): void {
        const targetWidth = element.dataset.width;
        // Small delay to let number animation start first
        setTimeout(() => {
            element.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            element.style.width = targetWidth || '0%';
        }, 100);
    }
}

/**
 * Initialize animated stats effect
 */
export function initAnimatedStats(): void {
    new AnimatedStats();
    Logger.effect('✅ AnimatedStats initialized');
}
