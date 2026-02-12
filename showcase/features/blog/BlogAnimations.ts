/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE ANIMATIONS - MICHELIN EDITION 🍽️
 * 
 * Handles entrance animations, staggering, and smooth scrolling
 * for the project history timeline.
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export const timelineAnimations = {
    /**
     * Apply entrance animations to a list of elements
     * @param items - Elements to animate
     * @param delay - Initial delay in ms
     * @param stagger - Stagger delay between items in ms
     */
    animateItems(items: HTMLElement[], delay: number = 100, stagger: number = 50): void {
        items.forEach((item, index) => {
            // Initial state
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';

            // Trigger animation
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay + (index * stagger));
        });

        Logger.ui(`✨ [Timeline] Animated ${items.length} items`);
    },

    /**
     * Smoothly scroll to a specific element
     * @param element - Target element
     * @param offset - Vertical offset from top
     */
    scrollToElement(element: HTMLElement, offset: number = 100): void {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middleOffset = window.innerHeight / 2 - elementRect.height / 2;

        // Prefer centering the element in the viewport if possible, otherwise use specific offset
        const targetPosition = absoluteElementTop - (middleOffset > 0 ? middleOffset : offset);

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Add a temporary highlight effect
        element.style.filter = 'brightness(1.2) saturate(1.2)';
        setTimeout(() => {
            element.style.filter = '';
        }, 1000);
    },

    /**
     * Prepare or reset animation states
     */
    refresh(): void {
        // Currently a placeholder for future state-dependent animation logic
        Logger.ui('🔄 [Timeline] Animations refreshed');
    }
};
