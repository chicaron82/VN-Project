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
 */
export class TabController {
    private tabs: string[];
    private activeTab: string;

    // Elements
    private tabBar: HTMLElement | null;
    private tabButtons: NodeListOf<Element>;
    private tabPanels: NodeListOf<Element>;
    private progressIndicator: HTMLElement | null;
    private container: HTMLElement | null;
    private observer?: IntersectionObserver;

    constructor() {
        this.tabs = [
            'home',
            'journey',
            'workflow',
            'results',
            'spotlight',
            'evolution'
            // Note: 'who' was merged into 'home' tab
        ];

        this.activeTab = 'home';

        // Elements
        this.tabBar = document.getElementById('tab-bar');
        this.tabButtons = document.querySelectorAll('[data-tab]');
        this.tabPanels = document.querySelectorAll('[data-panel]');
        this.progressIndicator = document.getElementById('tab-progress');
        this.container = document.querySelector('.tab-panels-container');

        // Panels use CSS scroll-snap for native swipe behavior

        // Initialize
        this.setupEventListeners();
        this.initializePanelAccessibility();
        this.updatePanelVisibility();

        // Start at saved tab or home
        const lastTab = this.loadLastTab();
        this.setActiveTab(lastTab && this.tabs.includes(lastTab) ? lastTab : 'home');

        console.log('✅ TabController initialized (swipe mode)');
    }

    // ========================================
    // ACCESSIBILITY MANAGEMENT
    // ========================================

    /**
     * Initialize panel accessibility based on mode
     * In scroll-spy mode: All panels visible, no aria-hidden
     * In swipe mode: Managed by SwipeController
     */
    private initializePanelAccessibility(): void {
        // If swipe mode is enabled, let SwipeController handle it
        if (this.container?.classList.contains('swipe-enabled')) {
            return;
        }

        // Scroll-spy mode: all panels are visible, remove aria-hidden
        this.tabPanels.forEach(panel => {
            panel.removeAttribute('aria-hidden');
            panel.removeAttribute('inert');
        });
    }

    // ========================================
    // SCROLL-SPY SETUP
    // ========================================

    setupScrollSpy(): void {
        // Skip scroll-spy if we're using swipe mode
        // (Swipe controller will handle state updates)
        if (this.container?.classList.contains('swipe-enabled')) {
            console.log('⏭️ Skipping scroll-spy (swipe mode active)');
            return;
        }

        // Use IntersectionObserver to detect which section is in view
        const options: IntersectionObserverInit = {
            root: null, // viewport
            rootMargin: '-10% 0px -70% 0px', // Trigger only when section occupies top 20% of viewport
            threshold: 0.01 // Require at least 1% of section to be visible (supports long panels)
        };

        this.observer = new IntersectionObserver((entries) => {
            // Find the entry with the highest intersection ratio (most visible)
            let mostVisible = entries[0];
            let maxRatio = 0;

            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    mostVisible = entry;
                }
            });

            // Only update if we found a visible section
            if (mostVisible && mostVisible.isIntersecting) {
                const tabId = (mostVisible.target as HTMLElement).dataset.panel;
                if (tabId && tabId !== this.activeTab) {
                    console.log(`[ScrollSpy] Detected section: ${tabId} (ratio: ${mostVisible.intersectionRatio})`);
                    this.setActiveTab(tabId);
                }
            }
        }, options);

        // Observe all panels
        this.tabPanels.forEach(panel => {
            this.observer?.observe(panel as Element);
        });
    }

    /**
     * Set active tab (called by scroll-spy, no scrolling)
     */
    setActiveTab(tabId: string): void {
        if (!this.tabs.includes(tabId)) return;

        console.log(`[TabController] setActiveTab: ${this.activeTab} → ${tabId}`);

        this.activeTab = tabId;

        // Update URL hash without scrolling
        history.replaceState(null, '', `#${tabId}`);

        // Update UI
        this.updateTabButtons();
        this.updateProgress();
        this.updatePanelVisibility(); // Show/hide panels
        this.updateStatusBar(tabId);
        this.saveLastTab(tabId);

        // Emit state for app switcher
        this.emitStateForAppSwitcher();
    }

    /**
     * Scroll to active panel (for button clicks)
     */
    private updatePanelVisibility(): void {
        const currentIndex = this.getCurrentTabIndex();

        // Update active class for styling only (don't hide panels)
        this.tabPanels.forEach((panel, index) => {
            if (index === currentIndex) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Scroll to the active panel
        if (this.container) {
            const scrollPosition = currentIndex * window.innerWidth;
            this.container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Tab button clicks → scroll to section
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = (btn as HTMLElement).dataset.tab;
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
     */
    private handleKeyboard(e: KeyboardEvent): void {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
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
     * Scroll to a specific section (now just switches panels)
     */
    scrollToTab(tabId: string): void {
        if (!this.tabs.includes(tabId)) return;

        // In swipe mode, just switch to that tab (no scrolling)
        this.setActiveTab(tabId);

        // Scroll container back to top when switching tabs
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }

    /**
     * Navigate to tab (compatibility method)
     */
    navigateToTab(tabId: string, _animate: boolean = true): void {
        this.scrollToTab(tabId);
    }

    nextTab(): void {
        const idx = this.tabs.indexOf(this.activeTab);
        if (idx < this.tabs.length - 1) {
            this.scrollToTab(this.tabs[idx + 1]);
        }
    }

    previousTab(): void {
        const idx = this.tabs.indexOf(this.activeTab);
        if (idx > 0) {
            this.scrollToTab(this.tabs[idx - 1]);
        }
    }

    // ========================================
    // UI UPDATES
    // ========================================

    private updateTabButtons(): void {
        this.tabButtons.forEach(btn => {
            const isActive = (btn as HTMLElement).dataset.tab === this.activeTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));

            if (isActive && this.tabBar) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    private updateProgress(): void {
        if (!this.progressIndicator) return;
        const idx = this.tabs.indexOf(this.activeTab);
        const total = this.tabs.length;
        const dots = '●'.repeat(idx + 1) + '○'.repeat(total - idx - 1);
        this.progressIndicator.textContent = `${dots} ${idx + 1} of ${total}`;
    }

    private updateStatusBar(tabId: string): void {
        const win = window as any;
        if (win.uv7Runtime?.instance) {
            const names: Record<string, string> = {
                home: 'UV7 OS',
                journey: 'The Journey',
                workflow: 'Workflow',
                results: 'Results',
                spotlight: 'Tech Spotlight',
                evolution: 'Evolution'
            };
            win.uv7Runtime.instance.setPhase(names[tabId] || tabId);
        }
        document.title = `UV7 • ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`;
    }

    // ========================================
    // STATE PERSISTENCE
    // ========================================

    private getTabFromHash(): string | null {
        const hash = window.location.hash.slice(1);
        return this.tabs.includes(hash) ? hash : null;
    }

    private loadLastTab(): string | null {
        try {
            return localStorage.getItem('showcase-last-tab');
        } catch {
            return null;
        }
    }

    private saveLastTab(tabId: string): void {
        try {
            localStorage.setItem('showcase-last-tab', tabId);
        } catch {
            /* ignore */
        }
    }

    private emitStateForAppSwitcher(): void {
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

    private getTabDisplayName(tabId: string): string {
        const names: Record<string, string> = {
            home: 'Home',
            journey: 'Journey',
            workflow: 'Workflow',
            results: 'Timeline',
            spotlight: 'Spotlight',
            evolution: 'Evolution'
        };
        return names[tabId] || tabId;
    }

    // ========================================
    // PUBLIC API
    // ========================================

    getActiveTab(): string {
        return this.activeTab;
    }

    getTabCount(): number {
        return this.tabs.length;
    }

    getCurrentTabIndex(): number {
        return this.tabs.indexOf(this.activeTab);
    }

    getTotalTabs(): number {
        return this.tabs.length;
    }

    navigateToTabIndex(index: number, _animate: boolean = true): void {
        if (index >= 0 && index < this.tabs.length) {
            this.scrollToTab(this.tabs[index]);
        }
    }
}
