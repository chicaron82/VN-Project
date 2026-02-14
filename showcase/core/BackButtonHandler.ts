// ========================================
// BACK BUTTON HANDLER
// Android-style back navigation for showcase
// Modeled after v2/systems/BackButtonManager.ts
// ========================================

import { Logger } from '@utils/Logger';

/**
 * BackButtonHandler
 *
 * Manages the browser history stack to provide Android-like back button behavior
 * for the showcase site:
 *
 * - Tab navigation: pushes history entries when user clicks tabs, so
 *   pressing Back navigates to the previously viewed section.
 * - Overlay interception: if a modal/sidebar is open, Back closes it
 *   instead of navigating away.
 * - Double-press exit: when at the initial section with no overlays,
 *   shows "Press Back again to exit" toast (2s window).
 *
 * 💚 848 is sacred 💀
 */
export class BackButtonHandler {
    private isInternalNavigation = false;
    private exitToastVisible = false;
    private exitToastTimer: number | null = null;
    private tabs: string[];

    /** Callback to navigate the TabController to a specific tab */
    private navigateToTab: (tabId: string) => void;
    /** Callback to get the current active tab */
    private getActiveTab: () => string;

    constructor(options: {
        navigateToTab: (tabId: string) => void;
        getActiveTab: () => string;
        tabs: string[];
    }) {
        this.navigateToTab = options.navigateToTab;
        this.getActiveTab = options.getActiveTab;
        this.tabs = options.tabs;
    }

    init(): void {
        // Mark the current state as our base
        const currentTab = this.getActiveTab();
        history.replaceState({ showcaseBase: true, tab: currentTab }, '', `#${currentTab}`);

        // Listen for back/forward navigation
        window.addEventListener('popstate', (e) => this.handlePopState(e));

        Logger.system('[BackButtonHandler] Initialized');
    }

    /**
     * Called by TabController when user clicks a tab (not scroll-spy).
     * Pushes a history entry so Back returns to the previous section.
     */
    pushTabState(tabId: string): void {
        if (this.isInternalNavigation) return;

        this.isInternalNavigation = true;
        history.pushState({ tab: tabId }, '', `#${tabId}`);
        this.isInternalNavigation = false;
    }

    // ========================================
    // POPSTATE HANDLER
    // ========================================

    private handlePopState(_event: PopStateEvent): void {
        if (this.isInternalNavigation) return;

        // Priority 1: Close any open overlay
        if (this.closeAnyOpenOverlay()) {
            // Overlay closed — re-push current position so we stay on this tab
            this.isInternalNavigation = true;
            history.pushState(
                { tab: this.getActiveTab() },
                '',
                `#${this.getActiveTab()}`
            );
            this.isInternalNavigation = false;
            Logger.system('[BackButtonHandler] Back → closed overlay');
            return;
        }

        // Priority 2: Navigate to tab from popped state
        const hash = location.hash.slice(1);
        if (hash && this.tabs.includes(hash) && hash !== this.getActiveTab()) {
            this.isInternalNavigation = true;
            this.navigateToTab(hash);
            this.isInternalNavigation = false;
            Logger.system(`[BackButtonHandler] Back → navigated to #${hash}`);
            return;
        }

        // Priority 3: At base state — double-press-to-exit
        if (!this.exitToastVisible) {
            // First press: show toast and re-push state to stay on page
            this.showExitToast();
            this.isInternalNavigation = true;
            history.pushState(
                { showcaseBase: true, tab: this.getActiveTab() },
                '',
                `#${this.getActiveTab()}`
            );
            this.isInternalNavigation = false;
            Logger.system('[BackButtonHandler] Back at base → exit toast shown');
        } else {
            // Second press within 2s: allow browser to navigate away
            Logger.system('[BackButtonHandler] Exit confirmed — goodbye! 💚');
        }
    }

    // ========================================
    // OVERLAY DETECTION & CLOSING
    // ========================================

    /**
     * Check if any overlay/modal is open and close the top-most one.
     * Returns true if something was closed.
     */
    private closeAnyOpenOverlay(): boolean {
        // 1. Sidebar
        const sidebar = document.getElementById('uv7-sidebar');
        if (sidebar?.classList.contains('open')) {
            this.closeSidebar(sidebar);
            return true;
        }

        // 2. Spotlight modal
        const spotlightModal = document.querySelector('.spotlight-modal.active') as HTMLElement;
        if (spotlightModal) {
            spotlightModal.classList.remove('active');
            document.body.style.overflow = '';
            return true;
        }

        // 3. Code comparison modal
        const codeModal = document.getElementById('code-comparison-modal');
        if (codeModal?.classList.contains('active')) {
            codeModal.classList.remove('active');
            codeModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            return true;
        }

        return false;
    }

    /**
     * Close sidebar with grab handle position reset.
     * Mirrors closeSidebarWithGrabHandleReset() from main.ts.
     */
    private closeSidebar(sidebar: HTMLElement): void {
        const backdrop = document.getElementById('uv7-backdrop');
        const toggle = document.getElementById('uv7-sidebar-toggle');

        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
        document.body.classList.remove('uv7-no-scroll');

        // Reset grab handle to edge position
        if (toggle) {
            const isRightSide = sidebar.classList.contains('right-side');
            if (isRightSide) {
                toggle.style.right = '0';
                toggle.style.left = 'auto';
            } else {
                toggle.style.left = '0';
                toggle.style.right = 'auto';
            }
        }
    }

    // ========================================
    // EXIT TOAST
    // ========================================

    private showExitToast(): void {
        this.exitToastVisible = true;

        // Create toast using same pattern as showcase's showToast
        const toast = document.createElement('div');
        toast.className = 'feature-toast';
        toast.textContent = 'Press Back again to exit';
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto-dismiss after 2s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);

        // Reset exit window
        if (this.exitToastTimer) clearTimeout(this.exitToastTimer);
        this.exitToastTimer = window.setTimeout(() => {
            this.exitToastVisible = false;
        }, 2000);
    }
}
