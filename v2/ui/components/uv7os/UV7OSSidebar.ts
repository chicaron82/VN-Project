/**
 * UV7OS SIDEBAR - SIDEBAR MANAGEMENT
 *
 * Handles opening, closing, and toggle logic for the sidebar.
 * Used in both showcase and landing contexts.
 *
 * "The side door to knowledge." - The Sidebar
 */

import type { UV7OSElements } from './UV7OSElements';
import { Logger } from '@utils/Logger';

/**
 * Dependencies injected by orchestrator (callback pattern)
 */
export interface UV7OSSidebarDependencies {
    context: 'showcase' | 'landing';
    closeShade: () => void;  // Close shade when sidebar opens
}

export class UV7OSSidebar {
    constructor(
        private elements: UV7OSElements,
        private deps: UV7OSSidebarDependencies
    ) {}

    /**
     * Toggle sidebar open/closed
     * Public method called by orchestrator
     */
    toggle(): void {
        Logger.ui('[UV7OSSidebar] toggle() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');

        if (!sidebar) {
            Logger.error('[UV7OSSidebar] Sidebar element not found!');
            return;
        }

        const isOpen = sidebar.classList.contains('open');
        Logger.ui('[UV7OSSidebar] isOpen:', isOpen);

        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open the sidebar
     */
    open(): void {
        Logger.ui('[UV7OSSidebar] open() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) {
            Logger.error('[UV7OSSidebar] open: sidebar not found');
            return;
        }

        Logger.ui('[UV7OSSidebar] Adding open class');
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('visible');

        // Prevent body scroll in showcase mode (tight viewport)
        if (this.deps.context === 'showcase') {
            document.body.classList.add('uv7-no-scroll');
        }
    }

    /**
     * Close the sidebar
     */
    close(): void {
        Logger.ui('[UV7OSSidebar] close() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) return;

        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');

        // Remove body scroll lock in showcase mode
        if (this.deps.context === 'showcase') {
            document.body.classList.remove('uv7-no-scroll');
        }
    }

    /**
     * Check if sidebar is currently open
     */
    isOpen(): boolean {
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        return sidebar?.classList.contains('open') || false;
    }

    /**
     * Handle swipe down from top (opens sidebar in landscape mode)
     * Called by UV7OSSwipeHandler
     */
    handleSwipeOpen(): void {
        this.open();
    }

    /**
     * Handle swipe up (closes sidebar if open)
     * Called by UV7OSSwipeHandler
     */
    handleSwipeClose(): void {
        if (this.isOpen()) {
            this.close();
        }
    }
}
