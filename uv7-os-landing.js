/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - LANDING PAGE VERSION
 * Simplified navigation for UV7 Project Hub
 * 
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Meta-Narrative)
 * - Antigravity (Implementation)
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

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        console.log('🚀 UV7 OS initialized: Landing');
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
        switch (actionType) {
            case 'launch-v1':
                window.location.href = './v1/index.html';
                break;
            case 'launch-v2':
                window.location.href = './index.v2.html';
                break;
            case 'view-showcase':
                window.location.href = './showcase/index.html';
                break;
        }
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
            // Swipe down from top (> 100px) opens shade
            if (touchStartY < 100 && swipeDistance > 100) {
                this.openShade();
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
}

// Initialize UV7 OS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uv7os = new UV7OSLanding();
});
