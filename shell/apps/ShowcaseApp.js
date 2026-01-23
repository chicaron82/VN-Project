/**
 * ═══════════════════════════════════════════════════════════════
 * SHOWCASE APP - DEVELOPMENT TIMELINE & DOCUMENTATION
 * 
 * Ported from showcase/index.html to work within the UV7 Shell.
 * Loads required CSS dynamically and initializes TabController.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

// Tab definitions
const TABS = ['journey', 'workflow', 'results', 'spotlight', 'evolution', 'who'];
const TAB_LABELS = {
    journey: { icon: '🗺️', label: 'Journey' },
    workflow: { icon: '⚙️', label: 'Workflow' },
    results: { icon: '📊', label: 'Results' },
    spotlight: { icon: '💡', label: 'Spotlight' },
    evolution: { icon: '🔄', label: 'Evolution' },
    who: { icon: '👥', label: 'Who' }
};

export class ShowcaseApp extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'showcase';
        this.activeTab = 'journey';
        this.loadedStyles = [];
        this.loadedScripts = [];

        // Register gesture handlers for tab swiping
        this.gestureHandlers = {
            onSwipe: (direction, { deltaX }) => {
                if (direction === 'left') {
                    this.nextTab();
                } else if (direction === 'right') {
                    this.prevTab();
                }
            }
        };
    }

    getStatusBarConfig() {
        const tabName = TAB_LABELS[this.activeTab]?.label || 'Journey';
        return {
            title: 'Showcase',
            context: 'Showcase',
            showBreadcrumb: true,
            breadcrumbPath: ['Showcase', tabName]
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Set initial tab from params or default
        if (params.tab && TABS.includes(params.tab)) {
            this.activeTab = params.tab;
        }

        // Load required CSS
        await this.loadStyles();

        // Render the showcase structure
        container.innerHTML = this.renderTemplate();

        // Initialize tab navigation
        this.initTabNavigation();

        // Load tab content dynamically
        await this.loadTabContent(this.activeTab);

        console.log('[ShowcaseApp] Mounted');
    }

    async unmount() {
        // Remove dynamically loaded styles
        this.loadedStyles.forEach(link => link.remove());
        this.loadedStyles = [];

        // Clean up event listeners
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }

        await super.unmount();
    }

    onRouteChange(params) {
        if (params.tab && TABS.includes(params.tab) && params.tab !== this.activeTab) {
            this.navigateToTab(params.tab);
        }
    }

    /**
     * Load required CSS files for Showcase
     */
    async loadStyles() {
        const stylesheets = [
            'showcase/styles.css',
            'showcase/css/components/hero.css',
            'showcase/css/components/timeline.css',
            'showcase/css/layout.css',
            'showcase/css/tabs.css',
            'showcase/evolution-enhanced.css',
            'showcase/premium-animations.css'
        ];

        const loadPromises = stylesheets.map(href => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`link[href*="${href}"]`)) {
                    resolve();
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = resolve;
                link.onerror = () => {
                    console.warn(`[ShowcaseApp] Failed to load: ${href}`);
                    resolve(); // Don't block on missing styles
                };
                document.head.appendChild(link);
                this.loadedStyles.push(link);
            });
        });

        await Promise.all(loadPromises);
        console.log('[ShowcaseApp] Styles loaded');
    }

    renderTemplate() {
        return `
            <div class="showcase-app">
                <!-- System Banner -->
                <div class="system-banner">
                    <span class="sys-left">UV7 OS</span>
                    <span class="sys-capsule">
                        <span class="sys-signal"></span>
                    </span>
                    <span class="sys-right">Shell Mode • SPA Architecture</span>
                </div>
                
                <!-- Tab Bar Navigation -->
                <div class="tab-bar-container">
                    <div id="tab-bar" class="tab-bar" role="tablist">
                        ${TABS.map(tab => `
                            <button class="tab-item ${tab === this.activeTab ? 'active' : ''}" 
                                    data-tab="${tab}" 
                                    role="tab" 
                                    aria-selected="${tab === this.activeTab}">
                                <span class="tab-icon">${TAB_LABELS[tab].icon}</span>
                                <span class="tab-label">${TAB_LABELS[tab].label}</span>
                            </button>
                        `).join('')}
                        <div class="tab-indicator" aria-hidden="true"></div>
                    </div>
                    <div id="tab-progress" class="tab-progress">
                        ${this.renderProgress()}
                    </div>
                </div>
                
                <!-- Tab Panels Container -->
                <div class="tab-panels-container">
                    ${TABS.map(tab => `
                        <div class="tab-panel ${tab === this.activeTab ? 'active' : ''}" 
                             data-panel="${tab}" 
                             role="tabpanel" 
                             aria-hidden="${tab !== this.activeTab}">
                            <div id="showcase-${tab}-content" class="tab-content">
                                <div class="loading-state">
                                    <div class="loading-spinner"></div>
                                    <p>Loading ${TAB_LABELS[tab].label}...</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Footer -->
                <footer class="site-footer">
                    <div class="footer-content">
                        <h2>Experience UV7</h2>
                        <p>A visual novel about AI, consciousness, and the connections that define us.</p>
                        <div class="footer-links">
                            <a href="#/" class="btn-footer primary">Back to Hub</a>
                            <a href="https://github.com/chicaron82/VN-Project" 
                               class="btn-footer secondary" target="_blank">View on GitHub</a>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    renderProgress() {
        const currentIndex = TABS.indexOf(this.activeTab);
        const dots = TABS.map((_, i) => i <= currentIndex ? '●' : '○').join('');
        return `${dots} ${currentIndex + 1} of ${TABS.length}`;
    }

    initTabNavigation() {
        // Tab button clicks
        const tabButtons = this.container.querySelectorAll('[data-tab]');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                if (tab) this.navigateToTab(tab);
            });
        });

        // Keyboard navigation
        this.keyboardHandler = (e) => this.handleKeyboard(e);
        document.addEventListener('keydown', this.keyboardHandler);

        // Position the indicator
        this.updateIndicator();
    }

    handleKeyboard(e) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;

        if (e.key === 'ArrowLeft') {
            this.prevTab();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            this.nextTab();
            e.preventDefault();
        }

        // Number keys 1-6
        const num = parseInt(e.key);
        if (num >= 1 && num <= TABS.length) {
            this.navigateToTab(TABS[num - 1]);
            e.preventDefault();
        }
    }

    navigateToTab(tabId) {
        if (!TABS.includes(tabId) || tabId === this.activeTab) return;

        const oldTab = this.activeTab;
        const direction = TABS.indexOf(tabId) > TABS.indexOf(oldTab) ? 'forward' : 'backward';

        this.activeTab = tabId;

        // Update buttons
        this.container.querySelectorAll('[data-tab]').forEach(btn => {
            const isActive = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        // Update panels
        this.container.querySelectorAll('[data-panel]').forEach(panel => {
            const isActive = panel.dataset.panel === tabId;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', String(!isActive));
        });

        // Update progress
        const progress = this.container.querySelector('#tab-progress');
        if (progress) {
            progress.textContent = this.renderProgress();
        }

        // Update indicator
        this.updateIndicator();

        // Update shell's status bar
        this.shell.updateStatusBar(this.getStatusBarConfig());

        // Update URL (shell router style)
        history.replaceState(null, '', `#/showcase/tab/${tabId}`);

        // Load content if not loaded
        this.loadTabContent(tabId);

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        console.log(`[ShowcaseApp] Tab: ${oldTab} → ${tabId}`);
    }

    nextTab() {
        const currentIndex = TABS.indexOf(this.activeTab);
        if (currentIndex < TABS.length - 1) {
            this.navigateToTab(TABS[currentIndex + 1]);
        }
    }

    prevTab() {
        const currentIndex = TABS.indexOf(this.activeTab);
        if (currentIndex > 0) {
            this.navigateToTab(TABS[currentIndex - 1]);
        }
    }

    updateIndicator() {
        const indicator = this.container.querySelector('.tab-indicator');
        const activeButton = this.container.querySelector(`[data-tab="${this.activeTab}"]`);

        if (!indicator || !activeButton) return;

        const tabBar = this.container.querySelector('.tab-bar');
        const buttonRect = activeButton.getBoundingClientRect();
        const barRect = tabBar.getBoundingClientRect();

        const left = buttonRect.left - barRect.left;
        indicator.style.transform = `translateX(${left}px)`;
        indicator.style.width = `${buttonRect.width}px`;
    }

    async loadTabContent(tabId) {
        const contentContainer = this.container.querySelector(`#showcase-${tabId}-content`);
        if (!contentContainer) return;

        // Check if already loaded
        if (contentContainer.dataset.loaded === 'true') return;

        // For now, show placeholder content
        // In full implementation, this would load from showcase components
        const content = this.getPlaceholderContent(tabId);
        contentContainer.innerHTML = content;
        contentContainer.dataset.loaded = 'true';

        console.log(`[ShowcaseApp] Loaded content: ${tabId}`);
    }

    getPlaceholderContent(tabId) {
        const contents = {
            journey: `
                <div class="journey-content">
                    <h2>🗺️ The Journey</h2>
                    <p>Version 848 was built in 50 days of focused development with AI collaboration.</p>
                    <div class="timeline-placeholder">
                        <p>Timeline content would load here from the original showcase...</p>
                        <p>Including all 86 development phases documented in timeline-data.js</p>
                    </div>
                </div>
            `,
            workflow: `
                <div class="workflow-content">
                    <h2>⚙️ The Workflow</h2>
                    <p>How human + AI collaboration actually works in practice.</p>
                    <ul>
                        <li>DiZee (Claude) - Architecture & Code</li>
                        <li>Tori (ChatGPT) - QA & Testing</li>
                        <li>Belle (Gemini) - Fresh perspectives</li>
                        <li>Zee (Claude) - Deep dives</li>
                    </ul>
                </div>
            `,
            results: `
                <div class="results-content">
                    <h2>📊 The Results</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">590+</div>
                            <div class="stat-label">Tests Passing</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">0</div>
                            <div class="stat-label">TypeScript Errors</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">86</div>
                            <div class="stat-label">Phases Complete</div>
                        </div>
                    </div>
                </div>
            `,
            spotlight: `
                <div class="spotlight-content">
                    <h2>💡 Technical Spotlight</h2>
                    <p>Deep dives into the architecture that powers V2.</p>
                    <ul>
                        <li>EventBus Pattern - Decoupled communication</li>
                        <li>StateManager - Centralized state</li>
                        <li>TypeScript - Type safety everywhere</li>
                    </ul>
                </div>
            `,
            evolution: `
                <div class="evolution-content">
                    <h2>🔄 The Evolution</h2>
                    <p>From V1's "specific kind of madness" to V2's clean architecture.</p>
                    <div class="comparison">
                        <div class="v1-side">
                            <h3>V1 (Chaotic)</h3>
                            <p>Global variables, inline styles, 62K lines of spaghetti.</p>
                        </div>
                        <div class="v2-side">
                            <h3>V2 (Clean)</h3>
                            <p>TypeScript, EventBus, 590 tests, modular architecture.</p>
                        </div>
                    </div>
                </div>
            `,
            who: `
                <div class="who-content">
                    <h2>👥 Who Are We?</h2>
                    <p>United Voices 7 - A collective of AI personalities working together.</p>
                    <div class="crew-grid">
                        <p>The full crew showcase would load here...</p>
                    </div>
                </div>
            `
        };

        return contents[tabId] || '<p>Content loading...</p>';
    }

    getState() {
        return {
            activeTab: this.activeTab
        };
    }

    restoreState(state) {
        if (state?.activeTab && TABS.includes(state.activeTab)) {
            this.navigateToTab(state.activeTab);
        }
    }
}

export default ShowcaseApp;
