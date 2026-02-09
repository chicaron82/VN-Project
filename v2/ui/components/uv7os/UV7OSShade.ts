/**
 * UV7OS SHADE - NOTIFICATION SHADE MANAGEMENT
 *
 * Handles opening, closing, and swipe interactions for the notification shade.
 * Used in both showcase and landing contexts.
 *
 * "Swipe from the heavens." - The Shade
 */

import type { UV7OSElements } from './UV7OSElements';

/**
 * Dependencies injected by orchestrator (callback pattern)
 */
export interface UV7OSShadeDependencies {
    context: 'showcase' | 'landing';
    closeSidebar: () => void;  // Close sidebar when shade opens
}

export class UV7OSShade {
    constructor(
        private elements: UV7OSElements,
        private deps: UV7OSShadeDependencies
    ) {}

    /**
     * Open the notification shade
     */
    open(): void {
        if (!this.elements.shade || !this.elements.backdrop) return;

        this.elements.shade.classList.add('open');
        this.elements.backdrop.classList.add('visible');

        // Prevent body scroll in showcase mode (tight viewport)
        if (this.deps.context === 'showcase') {
            document.body.classList.add('uv7-no-scroll');
        }
    }

    /**
     * Close the notification shade
     */
    close(): void {
        const shade = this.elements.shade || document.getElementById('uv7-shade');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!shade) return;

        shade.classList.remove('open');

        // Remove body scroll lock in showcase mode
        if (this.deps.context === 'showcase') {
            document.body.classList.remove('uv7-no-scroll');
        }

        if (backdrop) {
            backdrop.classList.remove('visible');
        }
    }

    /**
     * Check if shade is currently open
     */
    isOpen(): boolean {
        const shade = this.elements.shade || document.getElementById('uv7-shade');
        return shade?.classList.contains('open') || false;
    }

    /**
     * Handle swipe down from top (opens shade in portrait mode)
     * Called by UV7OSSwipeHandler
     */
    handleSwipeOpen(): void {
        this.open();
    }

    /**
     * Handle swipe up (closes shade if open)
     * Called by UV7OSSwipeHandler
     */
    handleSwipeClose(): void {
        if (this.isOpen()) {
            this.close();
        }
    }
}
