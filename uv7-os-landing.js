/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - LANDING PAGE VERSION
 * Simplified navigation for UV7 Project Hub
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Meta-Narrative + View Transitions)
 * - Antigravity (Implementation)
 * - DiZee (Seamless transitions enhancement)
 * ═══════════════════════════════════════════════════════════════
 */

class UV7OSLanding {
    constructor() {
        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachHandlers();
        this.enableSeamlessTransitions(); // BELLE: No flicker protocol

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // PERSISTENCE: Check shared dev mode state
        const storedMode = localStorage.getItem('uv7-dev-mode');
        if (storedMode) {
            document.body.dataset.viewMode = storedMode;
        }

        // Initialize app switcher
        setTimeout(() => this.initAppSwitcher(), 100);

        // V1 parity: grab handle reposition + persistence
        if (typeof UV7GrabHandleRepositioner !== 'undefined') {
            new UV7GrabHandleRepositioner(this.elements.sidebarToggle, {
                storageKey: 'uv7-grab-handle',
                headerSafeTop: 52,
                bottomSafePad: 140
            });
        }

        console.log('🚀 UV7 OS Landing Wrapper initialized');
    }

    cacheElements() {
        this.elements = {
            // Status bar
            statusBar: document.getElementById('uv7-status-bar'),
            statusContext: document.getElementById('uv7-context'),
            statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop')
        };
    }

    attachHandlers() {
        // Settings icon (no Story/Dev toggle on landing, so just opens shade)
        if (this.elements.statusSettings) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.openShade();
            });
        }

        // Shade close button
        if (this.elements.shadeClose) {
            this.elements.shadeClose.addEventListener('click', () => this.closeShade());
        }

        // Sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Backdrop closes shade/sidebar
        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => {
                this.closeShade();
                this.closeSidebar();
            });
        }

        // Quick actions
        this.attachQuickActions();

        // Swipe down to open shade (portrait)
        this.attachSwipeHandler();

        // Escape key closes shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShade();
                this.closeSidebar();
            }
        });
    }

    attachQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = action.dataset.action;
            action.addEventListener('click', () => this.handleQuickAction(actionType));
        });
    }

    handleQuickAction(actionType) {
        // Map action types to URLs
        const actionUrls = {
            'launch-v1': './v1/index.html',
            'launch-v2': './index.v2.html',
            'view-showcase': './showcase/index.html'
        };

        const url = actionUrls[actionType];
        if (url) {
            // BELLE: Use seamless transition if available
            this.navigateWithTransition(url);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BELLE: VIEW TRANSITIONS - THE "NO FLICKER" PROTOCOL
    // Makes page navigation feel like native OS app switching
    // ═══════════════════════════════════════════════════════════════

    /**
     * Enable seamless transitions for all navigation
     * Intercepts link clicks and app card clicks to use View Transitions API
     */
    enableSeamlessTransitions() {
        // Check if browser supports View Transitions
        if (!document.startViewTransition) {
            console.log('📺 View Transitions not supported - using standard navigation');
            return;
        }

        console.log('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link and action clicks
        window.addEventListener('click', (e) => {
            // Find if we clicked a link or an element with data-action
            const link = e.target.closest('a');
            const actionElement = e.target.closest('[data-action]');

            let url = null;

            // Handle regular links
            if (link && link.href) {
                url = link.href;
            }
            // Handle data-action elements (handled separately in handleQuickAction)
            // Skip here to avoid double-handling
            else if (actionElement) {
                return; // Let handleQuickAction deal with it
            }

            if (!url) return;

            // Only intercept local navigation (same origin)
            try {
                const targetUrl = new URL(url, window.location.origin);
                if (targetUrl.origin !== window.location.origin) {
                    return; // External link, let it navigate normally
                }

                // Intercept and use View Transition
                e.preventDefault();
                this.navigateWithTransition(url);
            } catch (err) {
                // Invalid URL, let default behavior handle it
            }
        });
    }

    /**
     * Navigate to a URL with View Transition animation
     * BELLE: "The visual persistence of the status bar is non-negotiable"
     */
    navigateWithTransition(url) {
        // Fallback for browsers without View Transitions
        if (!document.startViewTransition) {
            window.location.href = url;
            return;
        }

        // Start the view transition
        document.startViewTransition(() => {
            // This callback runs after the old state is captured
            // but before the new state is rendered
            window.location.href = url;
        });
    }

    attachSwipeHandler() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeDistance = touchEndY - touchStartY;

            // Swipe down from top opens Shade in portrait, Sidebar in landscape
            if (touchStartY < 100 && swipeDistance > 100) {
                const isLandscape = window.innerWidth > window.innerHeight;

                if (isLandscape) {
                    this.openSidebar();
                } else {
                    this.openShade();
                }
                return;
            }

            // Swipe up (< -100px) closes shade/sidebar if open
            if (swipeDistance < -100) {
                if (this.elements.shade && this.elements.shade.classList.contains('open')) {
                    this.closeShade();
                }
                if (this.elements.sidebar && this.elements.sidebar.classList.contains('open')) {
                    this.closeSidebar();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    openShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    toggleSidebar() {
        if (!this.elements.sidebar) return;
        const isOpen = this.elements.sidebar.classList.contains('open');
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    // ═══════════════════════════════════════════════════════════════
    // TORI: BOOT TOAST - ONE MOMENT OF ACKNOWLEDGMENT
    // Shows once per browser, confirms state, humanizes the system
    // ═══════════════════════════════════════════════════════════════

    /**
     * Show boot toast on first visit
     * TORI: "Makes the experience feel alive"
     */
    showBootToast() {
        // Check if already shown
        const hasShown = localStorage.getItem('uv7.bootToastShown');
        if (hasShown) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        // Auto-dismiss after 2 seconds
        setTimeout(() => {
            toast.classList.add('dismissing');

            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for fade-out animation
        }, 2000);

        // Mark as shown
        localStorage.setItem('uv7.bootToastShown', 'true');
    }
}

// Initialize UV7 OS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uv7os = new UV7OSLanding();
});
