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

        // Phase 26d: Check for instant resume from App Switcher
        /** @type {{activeTab?: string, scroll?: Record<string, number>, viewMode?: string, activeEntry?: string|null}|null} */
        const instantResume = this.checkInstantResume();
        const targetTab = instantResume?.activeTab || this.loadLastTab() || this.getTabFromHash() || 'journey';

        /** @type {boolean} */
        this.isTransitioning = false;

        // Phase 26d: Store resume state for scroll restoration
        /** @type {{activeTab?: string, scroll?: Record<string, number>, viewMode?: string, activeEntry?: string|null}|null} */
        this.instantResumeState = instantResume;

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
            // Phase 26d: Emit initial state
            setTimeout(() => this.emitStateForAppSwitcher(), 500);
        } else {
            this.navigateToTab(targetTab, false); // No animation on load
        }

        // Phase 26d: Restore scroll position if instant resume
        if (this.instantResumeState && this.instantResumeState.scroll) {
            setTimeout(() => {
                this.restoreInstantResumeScroll();
            }, 600);
        }

        this.showSwipeHintIfNeeded();
        this.typeBootVersion();

        console.log('✅ TabController initialized');
    }

    /**
     * Phase 26d: Check for instant resume flag from App Switcher
     * @returns {{activeTab?: string, scroll?: Record<string, number>, viewMode?: string, activeEntry?: string|null}|null} Resume state or null
     */
    checkInstantResume() {
        try {
            const resumeData = localStorage.getItem('uv7-instant-resume');
            if (!resumeData) return null;

            const parsed = JSON.parse(resumeData);

            // Only use if it's for showcase and recent (within 30 seconds)
            if (parsed.appId !== 'showcase') return null;
            if (Date.now() - parsed.timestamp > 30000) {
                localStorage.removeItem('uv7-instant-resume');
                return null;
            }

            // Clear the flag
            localStorage.removeItem('uv7-instant-resume');

            console.log('🚀 Instant resume triggered:', parsed.state);
            return parsed.state;
        } catch (e) {
            console.warn('Failed to parse instant resume data:', e);
            return null;
        }
    }

    /**
     * Phase 26d: Restore scroll position from instant resume state
     */
    restoreInstantResumeScroll() {
        if (!this.instantResumeState || !this.instantResumeState.scroll) return;

        const scrollPos = this.instantResumeState.scroll[this.activeTab];
        if (typeof scrollPos === 'number' && scrollPos > 0) {
            const panel = document.querySelector(`[data-panel="${this.activeTab}"]`);
            if (panel) {
                panel.scrollTo({ top: scrollPos, behavior: 'smooth' });
                console.log(`📜 Restored scroll position: ${scrollPos}px for ${this.activeTab}`);
            }
        }

        // Clear the state after use
        this.instantResumeState = null;
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

        // Phase 26d: Debounced scroll tracking for each tab panel
        /** @type {Record<string, number>} */
        this.scrollDebounceTimers = {};

        this.tabPanels.forEach(panel => {
            const tabId = /** @type {HTMLElement} */(panel).dataset.panel;
            if (!tabId) return;

            panel.addEventListener('scroll', () => {
                // Guard against undefined
                if (!this.scrollDebounceTimers) return;

                // Clear existing timer
                const existingTimer = this.scrollDebounceTimers[tabId];
                if (existingTimer !== undefined) {
                    clearTimeout(existingTimer);
                }

                // Debounce: save scroll position after 300ms of no scrolling
                this.scrollDebounceTimers[tabId] = window.setTimeout(() => {
                    this.saveScrollPosition(tabId, /** @type {HTMLElement} */(panel).scrollTop);
                }, 300);
            }, { passive: true });
        });
    }

    /**
     * Phase 26d: Save scroll position for a specific tab
     * @param {string} tabId
     * @param {number} scrollTop
     */
    saveScrollPosition(tabId, scrollTop) {
        // Only save if we have AppStateManager
        // @ts-ignore - UV7AppStateManager is dynamically added
        if (!window.UV7AppStateManager) return;

        // Emit updated state
        window.dispatchEvent(new CustomEvent('uv7:state:changed', {
            detail: {
                appId: 'showcase',
                state: {
                    activeTab: this.activeTab,
                    scroll: { [tabId]: scrollTop },
                    viewMode: document.body.dataset.viewMode || 'story'
                },
                preview: {
                    badge: this.getTabDisplayName(this.activeTab),
                    title: this.getTabDisplayName(this.activeTab),
                    subtitle: `Scrolled ${Math.round(scrollTop)}px`
                }
            }
        }));

        console.log(`📜 [AppState] Saved scroll: ${tabId} @ ${scrollTop}px`);
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
            this.restoreScrollPosition(tabId, animate);

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

            // Phase 26d: Emit state for AppStateManager
            this.emitStateForAppSwitcher();
        }, 300);
    }

    /**
     * Emit current state for AppStateManager (live preview cards)
     * Phase 26d: App Switcher Glow-Up v2.0
     */
    emitStateForAppSwitcher() {
        // Get active entry if viewing timeline
        let activeEntry = null;
        let activeEntryTitle = null;

        if (this.activeTab === 'results' || this.activeTab === 'journey') {
            const activeCard = document.querySelector('.timeline-item.active, .timeline-entry.expanded');
            if (activeCard) {
                activeEntry = /** @type {HTMLElement} */(activeCard).dataset.entryId || null;
                const titleEl = activeCard.querySelector('.entry-title, h3');
                activeEntryTitle = titleEl?.textContent?.substring(0, 40) || null;
            }
        }

        // Get current scroll position for this tab
        const panel = document.querySelector(`[data-panel="${this.activeTab}"]`);
        const scrollPosition = panel?.scrollTop || 0;

        // Emit state change event
        window.dispatchEvent(new CustomEvent('uv7:state:changed', {
            detail: {
                appId: 'showcase',
                state: {
                    activeTab: this.activeTab,
                    scroll: { [this.activeTab]: scrollPosition },
                    viewMode: document.body.dataset.viewMode || 'story',
                    activeEntry: activeEntry
                },
                preview: {
                    badge: this.getTabDisplayName(this.activeTab),
                    title: activeEntryTitle || this.getTabDisplayName(this.activeTab),
                    subtitle: document.body.dataset.viewMode === 'dev' ? 'Dev Mode' : 'Story Mode'
                }
            }
        }));
    }

    /**
     * Get human-readable tab name
     * @param {string} tabId
     * @returns {string}
     */
    getTabDisplayName(tabId) {
        /** @type {Record<string, string>} */
        const names = {
            journey: 'Journey',
            workflow: 'Workflow',
            results: 'Timeline',
            spotlight: 'Spotlight',
            evolution: 'Evolution',
            who: 'About'
        };
        return names[tabId] || tabId;
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


            // Update breadcrumb section
            win.uv7Runtime.instance.setSection(tabNames[tabId] || tabId);
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
     * Restore scroll position for a tab
     * Scrolls window to bring tab bar into view
     * @param {string} tabId
     * @param {boolean} smooth - Whether to use smooth scrolling
     */
    restoreScrollPosition(tabId, smooth = true) {
        // Scroll window to bring tab bar into view
        // This ensures the active panel's content is visible
        const tabBar = document.querySelector('.tab-bar-container');
        if (tabBar) {
            const tabBarTop = tabBar.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: tabBarTop,
                behavior: smooth ? 'smooth' : 'instant'
            });
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

    // ========================================
    // PHASE 26e: SWIPE INDICATOR LERP
    // ========================================

    /**
     * Update indicator position with LERP interpolation
     * Called during swipe gesture for 1:1 tracking
     * @param {number} fromIdx - Current tab index
     * @param {number} toIdx - Target tab index
     * @param {number} progress - Progress from 0 to 1
     */
    updateIndicatorPosition(fromIdx, toIdx, progress) {
        const indicator = document.querySelector('.tab-indicator');
        if (!indicator) return;

        const tabs = Array.from(this.tabButtons);
        if (!tabs[fromIdx]) return;

        // Get dimensions
        const fromTab = /** @type {HTMLElement} */(tabs[fromIdx]);
        const fromRect = fromTab.getBoundingClientRect();
        const parentRect = fromTab.parentElement.getBoundingClientRect();

        // Start position and width
        let targetLeft = fromRect.left - parentRect.left;
        let targetWidth = fromRect.width;

        // If we have a target tab, interpolate towards it
        if (tabs[toIdx]) {
            const toTab = /** @type {HTMLElement} */(tabs[toIdx]);
            const toRect = toTab.getBoundingClientRect();
            const toLeft = toRect.left - parentRect.left;
            const toWidth = toRect.width;

            // LERP: Start + (Difference * Progress)
            targetLeft = targetLeft + (toLeft - targetLeft) * progress;
            targetWidth = targetWidth + (toWidth - targetWidth) * progress;
        }

        // Apply transform (GPU-accelerated)
        indicator.style.transform = `translateX(${targetLeft}px)`;
        indicator.style.width = `${targetWidth}px`;
    }

    /**
     * Get current tab index
     * @returns {number}
     */
    getCurrentTabIndex() {
        return this.tabs.indexOf(this.activeTab);
    }

    /**
     * Navigate to tab by index
     * @param {number} index
     */
    navigateToTabIndex(index) {
        if (index < 0 || index >= this.tabs.length) return;
        this.navigateToTab(this.tabs[index]);
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
