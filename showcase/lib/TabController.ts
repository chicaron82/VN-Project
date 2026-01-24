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

        // Enable scroll-spy mode
        if (this.container) {
            this.container.classList.add('scroll-spy-enabled');
        }

        // Initialize
        this.setupEventListeners();
        // Don't setup scroll-spy immediately - let swipe controller initialize first
        // this.setupScrollSpy();

        // Fix: Remove aria-hidden from all panels in scroll-spy mode
        // (In scroll-spy mode, all sections are visible and should be accessible)
        this.initializePanelAccessibility();

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
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is in upper-middle of viewport
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const tabId = (entry.target as HTMLElement).dataset.panel;
                    if (tabId && tabId !== this.activeTab) {
                        this.setActiveTab(tabId);
                    }
                }
            });
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
     * Scroll to a specific section
     */
    scrollToTab(tabId: string): void {
        if (!this.tabs.includes(tabId)) return;

        // If we have swipe controller, use it for horizontal scrolling
        const win = window as any;
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
            win.uv7Runtime.instance.setSection(names[tabId] || tabId);
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
