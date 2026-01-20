/**
 * DIZEE: Dialog Bubble Component
 * Floating thought bubbles for internal dialogue
 * Restored feature from V1 SOLID refactor
 */

import type { EventBus } from '../../core/EventBus';

export interface DialogBubbleConfig {
    text: string;
    position?: 'left' | 'center' | 'right';
    duration?: number; // Auto-dismiss after N ms (0 = manual dismiss)
}

export class DialogBubble {
    private element: HTMLDivElement | null = null;
    private eventBus: EventBus;
    private dismissTimer: number | null = null;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Show an internal thought bubble
     */
    show(config: DialogBubbleConfig): void {
        // Remove any existing bubble first
        this.hide();

        const { text, position = 'center', duration = 0 } = config;

        // Create bubble element
        this.element = document.createElement('div');
        this.element.className = 'internal-bubble';
        this.element.classList.add(position === 'left' ? 'left-character' :
                                    position === 'right' ? 'right-character' :
                                    'center');

        // Set text content
        this.element.textContent = text;

        // Check if text is long enough to need scrolling
        if (text.length > 200) {
            this.element.classList.add('has-scroll');
            this.addScrollIndicator();
        }

        // Add to DOM
        document.body.appendChild(this.element);

        // Emit event for tracking/accessibility
        this.eventBus.emit('dialog:bubble:shown', { text, position });

        // Auto-dismiss if duration specified
        if (duration > 0) {
            this.dismissTimer = window.setTimeout(() => {
                this.hide();
            }, duration);
        }

        console.log(`[DialogBubble] Shown: "${text.substring(0, 30)}..." at ${position}`);
    }

    /**
     * Hide the bubble
     */
    hide(): void {
        // Clear auto-dismiss timer
        if (this.dismissTimer !== null) {
            window.clearTimeout(this.dismissTimer);
            this.dismissTimer = null;
        }

        // Remove element if it exists
        if (this.element && this.element.parentNode) {
            this.element.remove();
            this.eventBus.emit('dialog:bubble:hidden', {});
            console.log('[DialogBubble] Hidden');
        }

        this.element = null;

        // Defensive cleanup: remove any orphaned bubbles
        document.querySelectorAll('.internal-bubble').forEach(bubble => {
            bubble.remove();
        });
    }

    /**
     * Check if bubble is currently visible
     */
    isVisible(): boolean {
        return this.element !== null && this.element.parentNode !== null;
    }

    /**
     * Add scroll indicator for long text
     */
    private addScrollIndicator(): void {
        if (!this.element) return;

        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.textContent = '↓';
        this.element.appendChild(indicator);

        // Hide indicator when scrolled to bottom
        this.element.addEventListener('scroll', () => {
            if (!this.element) return;
            const isAtBottom = this.element.scrollHeight - this.element.scrollTop <= this.element.clientHeight + 10;
            indicator.style.opacity = isAtBottom ? '0' : '1';
        });
    }

    /**
     * Cleanup - call when destroying component
     */
    destroy(): void {
        this.hide();
        console.log('[DialogBubble] Destroyed');
    }
}
