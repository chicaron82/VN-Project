/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE ANIMATIONS CONTROLLER
 *
 * Phase 1: Smooth animations for the MAXIMUM MICHELIN timeline
 * Credit: ZeeRah's Chaos 😈
 *
 * Handles:
 * - Staggered filter animations
 * - Ripple effects on button clicks
 * - Smooth scroll to entries
 * - Highlight pulse effects
 *
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export class BlogAnimations {
    private timeline: HTMLElement | null;
    private items: NodeListOf<HTMLElement> | null;

    constructor(timelineSelector: string = '.timeline-phases') {
        this.timeline = document.querySelector(timelineSelector);
        this.items = this.timeline?.querySelectorAll('.timeline-item') || null;

        Logger.ui('🎬 [BlogAnimations] Initialized', {
            timeline: !!this.timeline,
            itemCount: this.items?.length || 0
        });
    }

    /**
     * Refresh items list (call after DOM updates)
     */
    refresh(): void {
        this.items = this.timeline?.querySelectorAll('.timeline-item') || null;
        Logger.ui('🔄 [BlogAnimations] Refreshed', {
            itemCount: this.items?.length || 0
        });
    }

    /**
     * Filter with staggered animations
     * @param matchingItems - Array of items that should be visible
     * @param duration - Stagger delay per item in ms (default: 50)
     */
    filterWithStagger(matchingItems: HTMLElement[], duration: number = 50): void {
        if (!this.items) return;

        const allItems = Array.from(this.items);

        // Phase 1: Hide non-matching items
        allItems.forEach(item => {
            const isMatching = matchingItems.includes(item);

            if (!isMatching) {
                item.classList.add('filtering-out');
                setTimeout(() => {
                    item.classList.add('filtered-hidden');
                    item.classList.remove('filtering-out');
                }, 400);
            }
        });

        // Phase 2: Show matching items with stagger
        setTimeout(() => {
            matchingItems.forEach((item, index) => {
                item.classList.remove('filtered-hidden');
                item.style.setProperty('--stagger-index', index.toString());
                item.setAttribute('data-stagger', Math.min(index, 9).toString());

                setTimeout(() => {
                    item.classList.add('filtering-in');
                }, index * duration);

                // Remove animation class and mark as animated after completion
                setTimeout(() => {
                    item.classList.remove('filtering-in');
                    item.classList.add('animated');
                }, (index * duration) + 500);
            });
        }, 450);

        Logger.ui('✨ [BlogAnimations] Filtered with stagger', {
            matching: matchingItems.length,
            total: allItems.length
        });
    }

    /**
     * Ripple effect for buttons
     * @param button - Button element
     * @param event - Mouse event
     */
    addRipple(button: HTMLElement, event: MouseEvent): void {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const rect = button.getBoundingClientRect();
        // Use minimum size of 100px if button has no dimensions
        const size = Math.max(rect.width, rect.height, 100);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        Logger.ui('💧 [BlogAnimations] Ripple triggered', {
            button: button.className,
            position: { x, y },
            size,
            rect: { width: rect.width, height: rect.height }
        });
    }

    /**
     * Smooth scroll to entry with highlight effect
     * @param entryId - Timeline entry ID
     * @param offset - Offset from top in pixels (default: 100)
     */
    scrollToEntry(entryId: string, offset: number = 100): void {
        const entry = document.getElementById(entryId);
        if (!entry) {
            Logger.warn('⚠️ [BlogAnimations] Entry not found:', entryId);
            return;
        }

        const rect = entry.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Highlight effect
        entry.classList.add('highlight-pulse');
        setTimeout(() => entry.classList.remove('highlight-pulse'), 2000);

        Logger.ui('🎯 [BlogAnimations] Scrolled to entry:', entryId);
    }

    /**
     * Scroll to entry by element reference
     * @param entry - Entry element
     * @param offset - Offset from top in pixels (default: 100)
     */
    scrollToElement(entry: HTMLElement, offset: number = 100): void {
        const rect = entry.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Highlight effect
        entry.classList.add('highlight-pulse');
        setTimeout(() => entry.classList.remove('highlight-pulse'), 2000);

        Logger.ui('🎯 [BlogAnimations] Scrolled to element');
    }

    /**
     * Apply enter animation to specific items
     * @param items - Items to animate
     * @param delay - Starting delay in ms (default: 0)
     * @param duration - Stagger duration per item in ms (default: 50)
     */
    animateItems(items: HTMLElement[], delay: number = 0, duration: number = 50): void {
        items.forEach((item, index) => {
            item.style.setProperty('--stagger-index', index.toString());
            item.setAttribute('data-stagger', Math.min(index, 9).toString());

            setTimeout(() => {
                item.classList.add('filtering-in');

                // Remove animation class and mark as animated after completion
                setTimeout(() => {
                    item.classList.remove('filtering-in');
                    item.classList.add('animated');
                }, 500);
            }, delay + (index * duration));
        });

        Logger.ui('🎬 [BlogAnimations] Animated items', {
            count: items.length,
            delay,
            duration
        });
    }

    /**
     * Highlight an entry without scrolling
     * @param entryId - Timeline entry ID
     */
    highlightEntry(entryId: string): void {
        const entry = document.getElementById(entryId);
        if (!entry) {
            Logger.warn('⚠️ [BlogAnimations] Entry not found:', entryId);
            return;
        }

        entry.classList.add('highlight-pulse');
        setTimeout(() => entry.classList.remove('highlight-pulse'), 2000);

        Logger.ui('💫 [BlogAnimations] Highlighted entry:', entryId);
    }

    /**
     * Add ripple to all buttons matching selector
     * @param selector - Button selector (default: '.timeline-btn')
     */
    enableRippleForButtons(selector: string = '.timeline-btn'): void {
        const buttons = document.querySelectorAll<HTMLElement>(selector);

        buttons.forEach(button => {
            // Remove existing listener if any
            button.removeEventListener('click', this.handleRippleClick);
            button.addEventListener('click', this.handleRippleClick.bind(this));
        });

        Logger.ui('💧 [BlogAnimations] Ripple enabled for buttons', {
            count: buttons.length
        });
    }

    /**
     * Handle ripple click event (bound to this)
     */
    private handleRippleClick(event: MouseEvent): void {
        const button = event.currentTarget as HTMLElement;
        this.addRipple(button, event);
    }
}

/**
 * Create global instance
 */
export const timelineAnimations = new BlogAnimations();

/**
 * Built with love. "Always. Always. Always." - Storm Dragon
 */
