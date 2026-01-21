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
        this.entries = options.entries || [];
        this.currentEntry = null;
        this.currentMode = 'story'; // 'story' or 'dev'

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.detectCurrentEntry();
        this.detectCurrentMode();
        this.renderStatusBar();
        this.attachSectionNavHandlers();
        this.attachHandlers();
        this.restoreState();
        this.startScrollListener();
        this.enableSeamlessTransitions(); // BELLE: No flicker protocol

        // Initialize app switcher
        // REFACTORED: Managed by Unified StatusBar (Phase 26b)
        // setTimeout(() => this.initAppSwitcher(), 100);

        // Initialize Unified Status Bar
        this.initUnifiedStatusBar();

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // V1 parity: grab handle reposition + persistence
        if (typeof UV7GrabHandleRepositioner !== 'undefined') {
            new UV7GrabHandleRepositioner(this.elements.sidebarToggle, {
                storageKey: 'uv7-grab-handle',
                headerSafeTop: 52,
                bottomSafePad: 140
            });
        }

        // TORI: Boot toast - one-time acknowledgment
        this.showBootToast();

        // Control Center Stats
        this.initSystemStats();

        console.log('🚀 UV7 OS initialized:', this.context);
    }

    initSystemStats() {
        const cpuVal = document.getElementById('sys-cpu');
        const ramVal = document.getElementById('sys-ram');
        const cpuBar = document.getElementById('sys-cpu-bar');
        const ramBar = document.getElementById('sys-ram-bar');

        if (!cpuVal || !ramVal) return;

        // Animate stats
        setInterval(() => {
            // CPU: jittery, spikes
            const cpu = Math.floor(Math.random() * 30) + 5; // 5-35% base

            // RAM: slow creep
            const ram = 60 + Math.floor(Math.random() * 8); // 60-68%

            cpuVal.textContent = `${cpu}%`;
            if (cpuBar) cpuBar.style.width = `${cpu}%`;

            ramVal.textContent = `${ram}%`;
            if (ramBar) ramBar.style.width = `${ram}%`;
        }, 2000);
    }

    /*
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
    */

    cacheElements() {
        this.elements = {
            // Status bar (Unified - managed by bridge)
            // statusBar: document.getElementById('uv7-status-bar'),
            // statusContext: document.getElementById('uv7-context'),
            // statusDetail: document.getElementById('uv7-detail'),
            // statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),
            shadeSectionList: document.getElementById('shade-section-list'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),
            sidebarSectionList: document.getElementById('sidebar-section-list'),
            sidebarHome: document.getElementById('sidebar-home'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Existing page elements
            viewToggle: document.getElementById('view-toggle')
        };
    }

    detectCurrentEntry() {
        // Find which entry is currently in viewport
        // Robust selector to find any timeline item
        const entryElements = document.querySelectorAll('.timeline-item');
        for (const el of entryElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentEntry = el.id;
                return;
            }
        }
        // Default to first entry if none detected
        if (this.entries.length > 0) {
            this.currentEntry = this.entries[0].id;
        }
    }

    detectCurrentMode() {
        // Check body data-view-mode attribute OR localStorage
        const storedMode = localStorage.getItem('uv7-dev-mode');
        const body = document.body;

        if (storedMode) {
            this.currentMode = storedMode;
            // Sync body if needed
            if (body.dataset.viewMode !== storedMode) {
                body.dataset.viewMode = storedMode;
                // If there's a view toggle input, sync it too
                if (this.elements.viewToggle && this.elements.viewToggle.type === 'checkbox') {
                    this.elements.viewToggle.checked = (storedMode === 'dev');
                }
            }
        } else {
            this.currentMode = body.dataset.viewMode || 'story';
        }
    }

    initUnifiedStatusBar() {
        // REFACTORED: Status bar now created in index.html before TabController
        // This ensures proper initialization order for breadcrumb updates
        /*
        if (window.UV7System) {
            console.log('💎 Initializing Unified StatusBar...');
            const { instance, eventBus } = window.UV7System.createStatusBar('body', 'showcase');
            this.statusBar = instance;
            this.eventBus = eventBus;

            // Initial render
            this.renderStatusBar();
        } else {
            console.warn('⚠️ UV7System bridge not found. Status bar will be missing.');
        }
        */
    }

    renderStatusBar() {
        // Unified System: Emit event to update status bar
        if (this.eventBus) {
            const entryData = this.entries.find(p => p.id === this.currentEntry);
            const title = entryData ? entryData.title : `Entry ${this.currentEntry}`;
            const context = entryData ? `Entry ${this.currentEntry}` : 'Showcase';

            // Emit update event (StatusBar.ts needs to handle this or we add it)
            this.eventBus.emit('ui:status_update', {
                context: context,
                detail: title
            });
            return;
        }

        // Legacy Fallback (Removed DOM elements won't be found, so this is safe)
        if (!this.elements.statusContext || !this.elements.statusDetail) return;

        // DIZEE #3: Dynamic context based on current entry
        const entryData = this.entries.find(p => p.id === this.currentEntry);

        if (entryData && entryData.title) {
            // Show entry-specific context
            this.elements.statusContext.textContent = `Entry`;
            this.elements.statusDetail.textContent = entryData.title;
        } else {
            // Fallback to generic
            this.elements.statusContext.textContent = 'Showcase';
            this.elements.statusDetail.textContent = `Entry ${this.currentEntry}`;
        }
    }

    attachSectionNavHandlers() {
        // Attach click handlers to all section navigation buttons
        const sectionNavButtons = document.querySelectorAll('.section-nav-item');
        sectionNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sectionClass = button.dataset.section;
                this.jumpToSection(sectionClass);
            });
        });
    }

    jumpToSection(sectionClass) {
        // DIZEE FIX: Support Tabbed Layout
        if (window.tabController) {
            const tabId = sectionClass.replace('-section', '');
            window.tabController.navigateToTab(tabId);
            this.closeShade();
            this.closeSidebar();
            return;
        }

        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to section (account for status bar)
            const yOffset = -44; // Status bar height
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    attachHandlers() {
        // Belle: Settings icon toggles Story/Dev mode
        if (this.elements.statusSettings && this.elements.viewToggle) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.elements.viewToggle.click();
                // Update mode after toggle
                setTimeout(() => {
                    this.detectCurrentMode();

                    // PERSISTENCE
                    const newMode = document.body.dataset.viewMode;
                    localStorage.setItem('uv7-dev-mode', newMode);

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

    jumpToEntry(entryId) {
        const element = document.getElementById(entryId);
        if (element) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to entry (account for status bar)
            const yOffset = -44; // Status bar height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Save state
            this.saveState(entryId);

            // Update current entry
            this.currentEntry = entryId;
            this.renderStatusBar();
            this.updateCurrentEntryDisplay();
        }
    }

    updateCurrentEntryDisplay() {
        // Entry display removed - using section navigation instead
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
                const oldEntry = this.currentEntry;
                this.detectCurrentEntry();
                if (oldEntry !== this.currentEntry) {
                    this.renderStatusBar();
                    this.updateCurrentEntryDisplay();
                    this.saveState(this.currentEntry);
                }
            }, 200);
        }, { passive: true });
    }

    saveState(entryId) {
        sessionStorage.setItem('uv7-showcase-entry', entryId);
    }

    restoreState() {
        const savedEntry = sessionStorage.getItem('uv7-showcase-entry');
        if (savedEntry) {
            // Scroll to saved entry after a brief delay
            setTimeout(() => this.jumpToEntry(savedEntry), 500);
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
    // DIZEE #4: ENTRY CELEBRATION - REWARD SYSTEM
    // Celebrates when entries are marked complete
    // ═══════════════════════════════════════════════════════════════

    /**
     * Trigger celebration toast with confetti
     * @param {string} entryName - e.g. "Phase 15"
     * @param {string} achievement - e.g. "Visual parity achieved"
     */
    celebrateEntryComplete(entryName, achievement) {
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
    if (typeof TIMELINE_DATA !== 'undefined' && TIMELINE_DATA.entries) {
        window.uv7os = new UV7OS('showcase', {
            entries: TIMELINE_DATA.entries
        });
    } else {
        console.warn('⚠️ UV7 OS: Timeline data not available');
    }
});
