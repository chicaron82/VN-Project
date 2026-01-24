// @ts-check
// ========================================
// TAB CONTROLLER (Scroll-Spy Mode)
// All sections visible, tab bar highlights current section
// UV7 OS-style navigation with anchor links
// ========================================

/**
 * TabController
 * 
 * Manages scroll-spy navigation for showcase sections.
 * Tab clicks scroll to sections, scrolling updates active tab.
 * Single source of truth: scroll position.
 * 
 * @class TabController
 */
class TabController {
    constructor() {
        /** @type {string[]} */
        this.tabs = [
            'home',
            'journey',
            'workflow',
            'results',
            'spotlight',
            'evolution',
            'who'
        ];

        /** @type {string} */
        this.activeTab = 'home';

        // Elements
        this.tabBar = document.getElementById('tab-bar');
        this.tabButtons = document.querySelectorAll('[data-tab]');
        this.tabPanels = document.querySelectorAll('[data-panel]');
        this.progressIndicator = document.getElementById('tab-progress');
        this.container = document.querySelector('.tab-panels-container');

        // Enable scroll-spy mode
        if (this.container) {
            this.container.classList.add('scroll-spy-enabled');
        }

        // Initialize
        this.setupEventListeners();
        // Don't setup scroll-spy immediately - let swipe controller initialize first
        // this.setupScrollSpy();

        // Handle initial hash/saved tab
        const targetTab = this.loadLastTab() || this.getTabFromHash() || 'home';
        
        // Set active tab explicitly (even if it's home)
        this.setActiveTab(targetTab);
        
        if (targetTab !== 'home') {
            // Scroll to saved section after a brief delay for content to render
            setTimeout(() => this.scrollToTab(targetTab), 100);
        }

        console.log('✅ TabController initialized (scroll-spy mode)');
    }

    // ========================================
    // SCROLL-SPY SETUP
    // ========================================

    setupScrollSpy() {
        // Skip scroll-spy if we're using swipe mode
        // (Swipe controller will handle state updates)
        if (this.container?.classList.contains('swipe-enabled')) {
            console.log('⏭️ Skipping scroll-spy (swipe mode active)');
            return;
        }

        // Use IntersectionObserver to detect which section is in view
        const options = {
            root: null, // viewport
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is in upper-middle of viewport
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tabId = /** @type {HTMLElement} */(entry.target).dataset.panel;
                    if (tabId && tabId !== this.activeTab) {
                        this.setActiveTab(tabId);
                    }
                }
            });
        }, options);

        // Observe all panels
        this.tabPanels.forEach(panel => {
            this.observer.observe(panel);
        });
    }

    /**
     * Set active tab (called by scroll-spy, no scrolling)
     * @param {string} tabId
     */
    setActiveTab(tabId) {
        if (!this.tabs.includes(tabId)) return;

        this.activeTab = tabId;
        
        // Update URL hash without scrolling
        history.replaceState(null, '', `#${tabId}`);
        
        // Update UI
        this.updateTabButtons();
        this.updateProgress();
        this.updateStatusBar(tabId);
        this.saveLastTab(tabId);
        
        // Emit state for app switcher
        this.emitStateForAppSwitcher();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners() {
        // Tab button clicks → scroll to section
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = /** @type {HTMLElement} */(btn).dataset.tab;
                if (tab) this.scrollToTab(tab);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Hash change (back/forward buttons)
        window.addEventListener('hashchange', () => {
            const tab = this.getTabFromHash();
            if (tab && tab !== this.activeTab) {
                this.scrollToTab(tab);
            }
        });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e
     */
    handleKeyboard(e) {
        const activeTag = document.activeElement?.tagName.toLowerCase() || '';
        if (activeTag === 'input' || activeTag === 'textarea') return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextTab();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            this.previousTab();
        }

        // Number keys
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= this.tabs.length) {
            e.preventDefault();
            this.scrollToTab(this.tabs[num - 1]);
        }
    }

    /**
     * Scroll to a specific section
     * @param {string} tabId
     */
    scrollToTab(tabId) {
        if (!this.tabs.includes(tabId)) return;

        // If we have swipe controller, use it for horizontal scrolling
        const win = /** @type {any} */ (window);
        if (win.tabSwipeController) {
            const index = this.tabs.indexOf(tabId);
            win.tabSwipeController.syncToTab(index);
            this.setActiveTab(tabId);
        } else {
            // Fallback to scroll-spy mode
            const panel = document.querySelector(`[data-panel="${tabId}"]`);
            if (!panel) return;
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }

    /**
     * Navigate to tab (compatibility method)
     * @param {string} tabId
     * @param {boolean} [_animate]
     */
    navigateToTab(tabId, _animate = true) {
        this.scrollToTab(tabId);
    }

    nextTab() {
        const idx = this.tabs.indexOf(this.activeTab);
        if (idx < this.tabs.length - 1) {
            this.scrollToTab(this.tabs[idx + 1]);
        }
    }

    previousTab() {
        const idx = this.tabs.indexOf(this.activeTab);
        if (idx > 0) {
            this.scrollToTab(this.tabs[idx - 1]);
        }
    }

    // ========================================
    // UI UPDATES
    // ========================================

    updateTabButtons() {
        this.tabButtons.forEach(btn => {
            const isActive = /** @type {HTMLElement} */(btn).dataset.tab === this.activeTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));

            if (isActive && this.tabBar) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    updateProgress() {
        if (!this.progressIndicator) return;
        const idx = this.tabs.indexOf(this.activeTab);
        const total = this.tabs.length;
        const dots = '●'.repeat(idx + 1) + '○'.repeat(total - idx - 1);
        this.progressIndicator.textContent = `${dots} ${idx + 1} of ${total}`;
    }

    /**
     * @param {string} tabId 
     */
    updateStatusBar(tabId) {
        const win = /** @type {any} */ (window);
        if (win.uv7Runtime?.instance) {
            const names = /** @type {Record<string, string>} */ ({
                home: 'UV7 OS',
                journey: 'The Journey',
                workflow: 'Workflow',
                results: 'Results',
                spotlight: 'Tech Spotlight',
                evolution: 'Evolution',
                who: 'The Crew'
            });
            win.uv7Runtime.instance.setSection(names[tabId] || tabId);
        }
        document.title = `UV7 • ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`;
    }

    // ========================================
    // STATE PERSISTENCE
    // ========================================

    /** @returns {string|null} */
    getTabFromHash() {
        const hash = window.location.hash.slice(1);
        return this.tabs.includes(hash) ? hash : null;
    }

    /** @returns {string|null} */
    loadLastTab() {
        try {
            return localStorage.getItem('showcase-last-tab');
        } catch { return null; }
    }

    /** @param {string} tabId */
    saveLastTab(tabId) {
        try {
            localStorage.setItem('showcase-last-tab', tabId);
        } catch { /* ignore */ }
    }

    emitStateForAppSwitcher() {
        window.dispatchEvent(new CustomEvent('uv7:state:changed', {
            detail: {
                appId: 'showcase',
                state: {
                    activeTab: this.activeTab,
                    viewMode: document.body.dataset.viewMode || 'story'
                },
                preview: {
                    badge: this.getTabDisplayName(this.activeTab),
                    title: this.getTabDisplayName(this.activeTab),
                    subtitle: document.body.dataset.viewMode === 'dev' ? 'Dev Mode' : 'Story Mode'
                }
            }
        }));
    }

    /**
     * @param {string} tabId
     * @returns {string}
     */
    getTabDisplayName(tabId) {
        const names = /** @type {Record<string, string>} */ ({
            home: 'Home',
            journey: 'Journey',
            workflow: 'Workflow',
            results: 'Timeline',
            spotlight: 'Spotlight',
            evolution: 'Evolution',
            who: 'About'
        });
        return names[tabId] || tabId;
    }

    // ========================================
    // PUBLIC API
    // ========================================

    getActiveTab() { return this.activeTab; }
    getTabCount() { return this.tabs.length; }
    getCurrentTabIndex() { return this.tabs.indexOf(this.activeTab); }

    /**
     * @param {number} index
     * @param {boolean} [_animate]
     */
    navigateToTabIndex(index, _animate = true) {
        if (index >= 0 && index < this.tabs.length) {
            this.scrollToTab(this.tabs[index]);
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.TabController = TabController;
}
