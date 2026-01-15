/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - NAVIGATION SYSTEM
 * Universal navigation for UV7 ecosystem
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Settings Integration, Meta-Narrative & View Transitions)
 * - Antigravity (Implementation)
 * - DiZee (Seamless transitions enhancement)
 * ═══════════════════════════════════════════════════════════════
 */

class UV7OS {
    constructor(context, options = {}) {
        this.context = context; // 'showcase', 'landing', etc.
        this.phases = options.phases || [];
        this.currentPhase = null;
        this.currentMode = 'story'; // 'story' or 'dev'

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.detectCurrentPhase();
        this.detectCurrentMode();
        this.renderStatusBar();
        this.renderPhaseList();
        this.attachHandlers();
        this.restoreState();
        this.startScrollListener();
        this.enableSeamlessTransitions(); // BELLE: No flicker protocol

        // Initialize app switcher
        setTimeout(() => this.initAppSwitcher(), 100);

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // TORI: Boot toast - one-time acknowledgment
        this.showBootToast();

        console.log('🚀 UV7 OS initialized:', this.context);
    }

    initAppSwitcher() {
        // Wait for UV7AppSwitcher to be available
        if (typeof UV7AppSwitcher !== 'undefined') {
            this.appSwitcher = new UV7AppSwitcher();

            // Wire up logo click
            const statusLogo = document.querySelector('.status-logo');
            if (statusLogo) {
                statusLogo.addEventListener('click', () => {
                    this.appSwitcher.toggle();
                });
            }

            console.log('✅ App Switcher ready');
        } else {
            console.warn('⚠️ UV7AppSwitcher not loaded');
        }
    }

    cacheElements() {
        this.elements = {
            // Status bar
            statusBar: document.getElementById('uv7-status-bar'),
            statusContext: document.getElementById('uv7-context'),
            statusDetail: document.getElementById('uv7-detail'),
            statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),
            shadeCurrentPhase: document.getElementById('shade-current-phase'),
            shadeCurrentMode: document.getElementById('shade-current-mode'),
            shadePhaseList: document.getElementById('shade-phase-list'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),
            sidebarPhaseList: document.getElementById('sidebar-phase-list'),
            sidebarHome: document.getElementById('sidebar-home'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Existing page elements
            viewToggle: document.getElementById('view-toggle')
        };
    }

    detectCurrentPhase() {
        // Find which phase is currently in viewport
        const phaseElements = document.querySelectorAll('[id^="phase-"]');
        for (const el of phaseElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentPhase = el.id.replace('phase-', '');
                return;
            }
        }
        // Default to phase 1 if none detected
        this.currentPhase = '1';
    }

    detectCurrentMode() {
        // Check body data-view-mode attribute
        const body = document.body;
        this.currentMode = body.dataset.viewMode || 'story';
    }

    renderStatusBar() {
        if (!this.elements.statusContext || !this.elements.statusDetail) return;

        // DIZEE #3: Dynamic context based on current phase
        const phaseData = this.phases.find(p => p.id === `phase-${this.currentPhase}`);

        if (phaseData && phaseData.title) {
            // Show phase-specific context
            this.elements.statusContext.textContent = `Phase ${this.currentPhase}`;
            this.elements.statusDetail.textContent = phaseData.title;
        } else {
            // Fallback to generic
            this.elements.statusContext.textContent = 'Showcase';
            this.elements.statusDetail.textContent = `Phase ${this.currentPhase}`;
        }
    }

    renderPhaseList() {
        if (!this.phases || this.phases.length === 0) return;

        // Clear existing lists
        if (this.elements.shadePhaseList) {
            this.elements.shadePhaseList.innerHTML = '';
        }
        if (this.elements.sidebarPhaseList) {
            this.elements.sidebarPhaseList.innerHTML = '';
        }

        // Render each phase
        this.phases.forEach(phase => {
            const phaseNum = phase.id.replace('phase-', '');
            const isCurrent = phaseNum === this.currentPhase;

            // Create shade item
            if (this.elements.shadePhaseList) {
                const shadeItem = this.createPhaseItem(phase, isCurrent);
                this.elements.shadePhaseList.appendChild(shadeItem);
            }

            // Create sidebar item
            if (this.elements.sidebarPhaseList) {
                const sidebarItem = this.createPhaseItem(phase, isCurrent);
                this.elements.sidebarPhaseList.appendChild(sidebarItem);
            }
        });
    }

    createPhaseItem(phase, isCurrent) {
        const item = document.createElement('div');
        item.className = `phase-item ${isCurrent ? 'current' : ''}`;

        const phaseNum = phase.id.replace('phase-', '');
        const checkbox = isCurrent ? '▣' : '▢';

        item.innerHTML = `
            <span class="phase-checkbox">${checkbox}</span>
            <span class="phase-label">Phase ${phaseNum}</span>
            ${isCurrent ? '<span class="phase-indicator">← YOU</span>' : ''}
        `;

        item.addEventListener('click', () => this.jumpToPhase(phase.id));

        return item;
    }

    attachHandlers() {
        // Belle: Settings icon toggles Story/Dev mode
        if (this.elements.statusSettings && this.elements.viewToggle) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.elements.viewToggle.click();
                // Update mode after toggle
                setTimeout(() => {
                    this.detectCurrentMode();
                    this.updateCurrentModeDisplay();
                }, 100);
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

        // Sidebar home button - BELLE: Use view transition
        if (this.elements.sidebarHome) {
            this.elements.sidebarHome.addEventListener('click', () => {
                this.navigateWithTransition('../index.html');
            });
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
            'launch-v1': '../v1/index.html',
            'launch-v2': '../index.v2.html',
            'go-home': '../index.html'
        };

        // Handle URL-based actions with view transitions
        if (actionUrls[actionType]) {
            this.navigateWithTransition(actionUrls[actionType]);
            return;
        }

        // Handle special actions
        switch (actionType) {
            case 'toggle-mode':
                if (this.elements.viewToggle) {
                    this.elements.viewToggle.click();
                    setTimeout(() => {
                        this.detectCurrentMode();
                        this.updateCurrentModeDisplay();
                    }, 100);
                }
                break;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BELLE: VIEW TRANSITIONS - THE "NO FLICKER" PROTOCOL
    // Makes page navigation feel like native OS app switching
    // ═══════════════════════════════════════════════════════════════

    /**
     * Enable seamless transitions for all navigation
     * Intercepts link clicks to use View Transitions API
     */
    enableSeamlessTransitions() {
        // Check if browser supports View Transitions
        if (!document.startViewTransition) {
            console.log('📺 View Transitions not supported - using standard navigation');
            return;
        }

        console.log('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link clicks
        window.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const actionElement = e.target.closest('[data-action]');

            // Skip data-action elements (handled in handleQuickAction)
            if (actionElement) return;

            if (!link || !link.href) return;

            // Only intercept local navigation (same origin)
            try {
                const targetUrl = new URL(link.href, window.location.origin);
                if (targetUrl.origin !== window.location.origin) {
                    return; // External link, let it navigate normally
                }

                // Skip in-page anchors
                if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
                    return;
                }

                // Intercept and use View Transition
                e.preventDefault();
                this.navigateWithTransition(link.href);
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

            // Swipe down from top (> 100px) opens shade
            if (touchStartY < 100 && swipeDistance > 100) {
                this.openShade();
            }

            // Swipe up (< -100px) closes shade if it's open
            if (swipeDistance < -100 && this.elements.shade && this.elements.shade.classList.contains('open')) {
                this.closeShade();
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

    jumpToPhase(phaseId) {
        const element = document.getElementById(phaseId);
        if (element) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to phase (account for status bar)
            const yOffset = -44; // Status bar height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Save state
            this.saveState(phaseId);

            // Update current phase
            this.currentPhase = phaseId.replace('phase-', '');
            this.renderStatusBar();
            this.updateCurrentPhaseDisplay();
        }
    }

    updateCurrentPhaseDisplay() {
        if (this.elements.shadeCurrentPhase) {
            this.elements.shadeCurrentPhase.textContent = `Phase ${this.currentPhase}`;
        }

        // Re-render phase lists to update checkboxes
        this.renderPhaseList();
    }

    updateCurrentModeDisplay() {
        if (this.elements.shadeCurrentMode) {
            const modeText = this.currentMode === 'story' ? 'Story Mode' : 'Dev Mode';
            this.elements.shadeCurrentMode.textContent = `(${modeText})`;
        }
    }

    startScrollListener() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const oldPhase = this.currentPhase;
                this.detectCurrentPhase();
                if (oldPhase !== this.currentPhase) {
                    this.renderStatusBar();
                    this.updateCurrentPhaseDisplay();
                    this.saveState(`phase-${this.currentPhase}`);
                }
            }, 200);
        }, { passive: true });
    }

    saveState(phaseId) {
        sessionStorage.setItem('uv7-showcase-phase', phaseId);
    }

    restoreState() {
        const savedPhase = sessionStorage.getItem('uv7-showcase-phase');
        if (savedPhase) {
            // Scroll to saved phase after a brief delay
            setTimeout(() => this.jumpToPhase(savedPhase), 500);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // TORI: BOOT TOAST - ONE MOMENT OF ACKNOWLEDGMENT
    // ═══════════════════════════════════════════════════════════════

    showBootToast() {
        const hasShown = localStorage.getItem('uv7.bootToastShown.showcase');
        if (hasShown) return;

        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('dismissing');
            setTimeout(() => toast.remove(), 300);
        }, 2000);

        localStorage.setItem('uv7.bootToastShown.showcase', 'true');
    }

    // ═══════════════════════════════════════════════════════════════
    // DIZEE #4: PHASE CELEBRATION - REWARD SYSTEM
    // Celebrates when phases are marked complete
    // ═══════════════════════════════════════════════════════════════

    /**
     * Trigger celebration toast with confetti
     * @param {string} phaseName - e.g. "Phase 15"
     * @param {string} achievement - e.g. "Visual parity achieved"
     */
    celebratePhaseComplete(phaseName, achievement) {
        // Create celebration toast
        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = `${phaseName} complete • ${achievement}`;

        document.body.appendChild(toast);

        // Spawn confetti particles
        this.spawnConfetti();

        // Auto-dismiss
        setTimeout(() => {
            toast.classList.add('dismissing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Spawn gold confetti particles
     * DIZEE: "Every detail should feel intentional"
     */
    spawnConfetti() {
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'confetti-particle';

                // Random horizontal position
                particle.style.left = `${Math.random() * 100}%`;

                // Slight random delay for stagger effect
                particle.style.animationDelay = `${Math.random() * 0.3}s`;

                document.body.appendChild(particle);

                // Remove after animation
                setTimeout(() => particle.remove(), 2300);
            }, i * 30); // Stagger spawn
        }
    }
}

// Initialize UV7 OS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for timeline data to be available
    if (typeof TIMELINE_DATA !== 'undefined' && TIMELINE_DATA.phases) {
        window.uv7os = new UV7OS('showcase', {
            phases: TIMELINE_DATA.phases
        });
    } else {
        console.warn('⚠️ UV7 OS: Timeline data not available');
    }
});
