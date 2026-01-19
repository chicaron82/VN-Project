// @ts-check
// ========================================
// TAB CONTROLLER
// Manages horizontal tab navigation for showcase
// UV7 OS-style app navigation
// ========================================

/**
 * TabController
 * 
 * Manages tab state, navigation, and URL routing for showcase.
 * Provides keyboard shortcuts and state persistence.
 * 
 * @class TabController
 */
class TabController {
    constructor() {
        /** @type {string[]} */
        this.tabs = [
            'journey',
            'workflow',
            'results',
            'spotlight',
            'evolution',
            'who'
        ];

        /** @type {string} */
        // We start at 'journey' to match HTML structure, then navigate to saved/hash
        this.activeTab = 'journey';
        const targetTab = this.loadLastTab() || this.getTabFromHash() || 'journey';

        /** @type {boolean} */
        this.isTransitioning = false;

        // Elements
        this.tabBar = document.getElementById('tab-bar');
        this.tabButtons = document.querySelectorAll('[data-tab]');
        this.tabPanels = document.querySelectorAll('[data-panel]');
        this.progressIndicator = document.getElementById('tab-progress');

        // First-time user hint
        this.hasSeenSwipeHint = localStorage.getItem('showcase-seen-swipe-hint') === 'true';

        // Initialize
        this.setupEventListeners();

        // Force update for initial state (even if it's journey) to set Status Bar
        if (targetTab === 'journey') {
            this.updateStatusBar('journey');
        } else {
            this.navigateToTab(targetTab, false); // No animation on load
        }

        this.showSwipeHintIfNeeded();
        this.typeBootVersion();

        console.log('✅ TabController initialized');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    setupEventListeners() {
        // Tab button clicks
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = /** @type {HTMLElement} */(btn).dataset.tab;
                if (tab) this.navigateToTab(tab);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Hash change (back/forward buttons)
        window.addEventListener('hashchange', () => {
            const tab = this.getTabFromHash();
            if (tab && tab !== this.activeTab) {
                this.navigateToTab(tab, false); // No animation for back/forward
            }
        });

        // Prevent default scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e
     */
    handleKeyboard(e) {
        // 1. Typing Guard: Don't shortcut if user is typing
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && /** @type {HTMLElement} */(document.activeElement).isContentEditable)) {
            return;
        }

        let handled = false;

        // Arrow keys
        if (e.key === 'ArrowLeft') {
            this.previousTab();
            handled = true;
        } else if (e.key === 'ArrowRight') {
            this.nextTab();
            handled = true;
        }

        // Number keys (Dynamic)
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= this.tabs.length) {
            this.navigateToTab(this.tabs[num - 1]);
            handled = true;
        }

        // Only prevent default if we actually used the key
        if (handled) {
            e.preventDefault();
        }

        // Escape - collapse hero (always allowed)
        if (e.key === 'Escape') {
            this.collapseHero();
        }
    }

    // ========================================
    // NAVIGATION
    // ========================================

    /**
     * Navigate to a specific tab
     * @param {string} tabId
     * @param {boolean} animate - Whether to animate transition
     */
    navigateToTab(tabId, animate = true) {
        if (!this.tabs.includes(tabId)) {
            console.warn(`Unknown tab: ${tabId}`);
            return;
        }

        if (tabId === this.activeTab) return;
        if (this.isTransitioning) return;

        const oldTab = this.activeTab;
        const direction = this.tabs.indexOf(tabId) > this.tabs.indexOf(oldTab) ? 'forward' : 'backward';

        this.isTransitioning = true;
        this.activeTab = tabId;

        // Dismiss swipe hint after first navigation
        this.dismissSwipeHint();

        // Use View Transitions API if available
        const transition = () => {
            // Update URL hash
            window.location.hash = tabId;

            // Update tab buttons
            this.updateTabButtons();

            // Update panels
            this.updatePanels(oldTab, tabId, direction, animate);

            // Update progress indicator
            this.updateProgress();

            // Save state
            this.saveLastTab(tabId);

            // Restore scroll position for this tab
            this.restoreScrollPosition(tabId);

            // Collapse hero after first navigation
            if (oldTab === 'journey' && tabId !== 'journey') {
                this.collapseHero();
            }

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(10);

            // Update UV7 Status Bar (Alive Context)
            this.updateStatusBar(tabId);

            console.log(`📑 Navigated: ${oldTab} → ${tabId} (${direction})`);
        };

        // Use View Transitions API if supported
        if (document.startViewTransition && animate) {
            document.startViewTransition(() => transition());
        } else {
            transition();
        }

        // Reset transition lock after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    nextTab() {
        const currentIndex = this.tabs.indexOf(this.activeTab);
        const nextIndex = Math.min(currentIndex + 1, this.tabs.length - 1);
        this.navigateToTab(this.tabs[nextIndex]);
    }

    previousTab() {
        const currentIndex = this.tabs.indexOf(this.activeTab);
        const prevIndex = Math.max(currentIndex - 1, 0);
        this.navigateToTab(this.tabs[prevIndex]);
    }

    // ========================================
    // UI UPDATES
    // ========================================

    updateTabButtons() {
        this.tabButtons.forEach(btn => {
            const isActive = /** @type {HTMLElement} */(btn).dataset.tab === this.activeTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));

            // Scroll active tab into view (for scrollable tab bar)
            if (isActive && this.tabBar) {
                btn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    }

    /**
     * Update panel visibility with animation
     * @param {string} oldTab
     * @param {string} newTab
     * @param {'forward'|'backward'} direction
     * @param {boolean} animate
     */
    updatePanels(oldTab, newTab, direction, animate) {
        const oldPanel = document.querySelector(`[data-panel="${oldTab}"]`);
        const newPanel = document.querySelector(`[data-panel="${newTab}"]`);

        if (!oldPanel || !newPanel) return;

        if (animate) {
            // Slide animation
            oldPanel.classList.add('exiting', direction === 'forward' ? 'slide-left' : 'slide-right');
            newPanel.classList.add('entering', direction === 'forward' ? 'slide-from-right' : 'slide-from-left');

            setTimeout(() => {
                oldPanel.classList.remove('active', 'exiting', 'slide-left', 'slide-right');
                oldPanel.setAttribute('aria-hidden', 'true');

                newPanel.classList.remove('entering', 'slide-from-right', 'slide-from-left');
                newPanel.classList.add('active');
                newPanel.setAttribute('aria-hidden', 'false');

                // Lazy load content if needed
                this.lazyLoadPanel(newTab);
            }, 300);
        } else {
            // Instant switch
            oldPanel.classList.remove('active');
            oldPanel.setAttribute('aria-hidden', 'true');

            newPanel.classList.add('active');
            newPanel.setAttribute('aria-hidden', 'false');

            this.lazyLoadPanel(newTab);
        }
    }

    updateProgress() {
        if (!this.progressIndicator) return;

        const currentIndex = this.tabs.indexOf(this.activeTab);
        const total = this.tabs.length;

        // Update dots
        const dots = '●'.repeat(currentIndex + 1) + '○'.repeat(total - currentIndex - 1);
        this.progressIndicator.textContent = `${dots} ${currentIndex + 1} of ${total}`;
    }

    /**
     * Update the UV7 Status Bar with current context
     * @param {string} tabId 
     */
    updateStatusBar(tabId) {
        // --- V2 Status Bar Integration ---
        // Sync tab state with the new unified status bar
        const win = /** @type {any} */ (window);
        if (win.uv7Runtime && win.uv7Runtime.instance) {
            // Map tabs to friendly names for "Phase" or Breadcrumbs
            /** @type {{[key: string]: string}} */
            const tabNames = {
                'journey': 'The Journey',
                'workflow': 'Workflow',
                'results': 'Results',
                'spotlight': 'Tech Spotlight',
                'evolution': 'Evolution',
                'who': 'The Crew'
            };

            // Update Phase/Breadcrumb in Status Bar
            win.uv7Runtime.instance.setPhase(tabNames[tabId] || tabId);
        }

        // --- Legacy Title Updates ---
        // Update Document Title (Browser Tab)
        const tabName = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        document.title = `UV7 • ${tabName}`;
    }

    // ========================================
    // HERO COLLAPSE
    // ========================================

    collapseHero() {
        const hero = document.getElementById('hero-section');
        if (!hero) return;

        if (!hero.classList.contains('collapsed')) {
            hero.classList.add('collapsed');
            console.log('📐 Hero collapsed');

            // Add click listener to expand
            hero.addEventListener('click', () => this.expandHero(), { once: true });
        }
    }

    expandHero() {
        const hero = document.getElementById('hero-section');
        if (!hero) return;

        hero.classList.remove('collapsed');
        console.log('📐 Hero expanded');
    }

    // ========================================
    // LAZY LOADING
    // ========================================

    /**
     * Lazy load content for a panel
     * @param {string} tabId
     */
    lazyLoadPanel(tabId) {
        const panel = document.querySelector(`[data-panel="${tabId}"]`);
        if (!panel) return;

        // Check if already loaded
        if (/** @type {HTMLElement} */(panel).dataset.loaded === 'true') return;

        // Load images with Intersection Observer
        const images = panel.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const imgEl = /** @type {HTMLImageElement} */(img);
            imgEl.src = imgEl.dataset.src || '';
            imgEl.removeAttribute('data-src');
        });

        /** @type {HTMLElement} */(panel).dataset.loaded = 'true';
        console.log(`🖼️ Lazy loaded: ${tabId}`);
    }

    // ========================================
    // SCROLL POSITION MANAGEMENT
    // ========================================

    /**
     * Save scroll position for current tab
     */
    saveScrollPosition() {
        const panel = document.querySelector(`[data-panel="${this.activeTab}"]`);
        if (!panel) return;

        const scrollY = panel.scrollTop || 0;
        sessionStorage.setItem(`tab-${this.activeTab}-scroll`, String(scrollY));
    }

    /**
     * Restore scroll position for a tab
     * @param {string} tabId
     */
    restoreScrollPosition(tabId) {
        const panel = document.querySelector(`[data-panel="${tabId}"]`);
        if (!panel) return;

        const savedScroll = sessionStorage.getItem(`tab-${tabId}-scroll`);
        if (savedScroll) {
            panel.scrollTop = parseInt(savedScroll, 10);
        } else {
            panel.scrollTop = 0; // Reset to top
        }
    }

    // ========================================
    // STATE PERSISTENCE
    // ========================================

    /**
     * Get tab from URL hash
     * @returns {string|null}
     */
    getTabFromHash() {
        const hash = window.location.hash.slice(1); // Remove #
        return this.tabs.includes(hash) ? hash : null;
    }

    /**
     * Load last visited tab from localStorage
     * @returns {string|null}
     */
    loadLastTab() {
        const saved = localStorage.getItem('showcase-last-tab');
        return saved && this.tabs.includes(saved) ? saved : null;
    }

    /**
     * Save last visited tab to localStorage
     * @param {string} tabId
     */
    saveLastTab(tabId) {
        localStorage.setItem('showcase-last-tab', tabId);
    }

    // ========================================
    // SWIPE HINTS
    // ========================================

    /**
     * Show swipe hint for first-time users
     */
    showSwipeHintIfNeeded() {
        if (this.hasSeenSwipeHint) return;
        if (window.innerWidth < 768) { // Mobile only
            setTimeout(() => this.createSwipeHint(), 1000);
        }
    }

    /**
     * Create swipe hint UI
     */
    createSwipeHint() {
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.innerHTML = `
            <div class="swipe-hint-content">
                <span class="swipe-hint-icon">👈</span>
                <span class="swipe-hint-text">Swipe to explore</span>
                <span class="swipe-hint-icon">👉</span>
            </div>
        `;

        document.body.appendChild(hint);

        // Fade in
        requestAnimationFrame(() => {
            hint.classList.add('visible');
        });

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            this.dismissSwipeHint();
        }, 3000);

        console.log('💡 Swipe hint shown');
    }

    /**
     * Dismiss swipe hint
     */
    dismissSwipeHint() {
        const hint = document.querySelector('.swipe-hint');
        if (!hint) return;

        hint.classList.remove('visible');
        setTimeout(() => hint.remove(), 300);

        // Remember that user has seen it
        if (!this.hasSeenSwipeHint) {
            localStorage.setItem('showcase-seen-swipe-hint', 'true');
            this.hasSeenSwipeHint = true;
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Get current active tab
     * @returns {string}
     */
    getActiveTab() {
        return this.activeTab;
    }

    /**
     * Get total number of tabs
     * @returns {number}
     */
    getTabCount() {
        return this.tabs.length;
    }

    /**
     * Type out the system boot version
     */
    typeBootVersion() {
        const sysRight = document.querySelector('.sys-right');
        if (!sysRight) return;

        const date = new Date();
        const buildStr = `BUILD: ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} • V2 • TESTS: 510 • PASS: ✅`;

        let i = 0;
        sysRight.textContent = '';

        const type = () => {
            if (i < buildStr.length) {
                sysRight.textContent += buildStr.charAt(i);
                i++;
                setTimeout(type, 20 + Math.random() * 30);
            }
        };

        setTimeout(type, 1000); // Start after load
    }
}

// Export for use
if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window global
    window.TabController = TabController;
}
