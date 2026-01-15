/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - APP SWITCHER
 * iOS-style app switcher for UV7 ecosystem
 *
 * Contributors:
 * - Ronnie (Vision: "Make it bougie")
 * - Antigravity (Implementation: "Say less")
 * - DiZee (Enhancement: Live state + mini preview)
 * ═══════════════════════════════════════════════════════════════
 */

class UV7AppSwitcher {
    constructor() {
        this.apps = this.defineApps();
        this.currentApp = this.detectCurrentApp();
        this.recentApps = this.loadRecentApps();
        this.elements = {};

        this.init();
    }

    init() {
        this.injectHTML();
        this.cacheElements();
        this.attachHandlers();
        this.render();

        console.log('🚀 UV7 App Switcher initialized');
    }

    defineApps() {
        return [
            {
                id: 'landing',
                name: 'Landing',
                icon: '🏠',
                description: 'UV7 Project Hub',
                url: '../index.html',
                color: 'rgba(0, 204, 255, 0.2)',
                getState: () => {
                    // DIZEE: Pull live loop version from localStorage
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    return [`VERSION ${loopVersion}`, 'Home'];
                }
            },
            {
                id: 'showcase',
                name: 'Showcase',
                icon: '📖',
                description: 'The Journey',
                url: '../showcase/index.html',
                color: 'rgba(0, 204, 255, 0.2)',
                getState: () => {
                    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
                    const phaseNum = phase.replace('phase-', '');
                    const mode = document.body.dataset.viewMode || 'story';
                    // DIZEE: Count discovered codes for showcase
                    const codes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');
                    const codeCount = codes.length;
                    return [`Phase ${phaseNum}`, codeCount > 0 ? `${codeCount} codes` : `${mode === 'story' ? 'Story' : 'Dev'} Mode`];
                }
            },
            {
                id: 'v1',
                name: 'V1 Game',
                icon: '🎮',
                description: 'Legacy Version',
                url: '../v1/index.html',
                color: 'rgba(255, 0, 85, 0.2)',
                getState: () => {
                    // DIZEE: Pull V1 game state from localStorage
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    const route = localStorage.getItem('uv7_current_route') || 'Menu';
                    const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                    return [`Loop ${loopVersion}`, routeDisplay];
                }
            },
            {
                id: 'v2',
                name: 'V2 Engine',
                icon: '⚡',
                description: 'TypeScript Rebuild',
                url: '../index.v2.html',
                color: 'rgba(0, 255, 136, 0.2)',
                getState: () => {
                    // DIZEE: Pull V2 game state from localStorage/StateManager
                    const stateJson = localStorage.getItem('uv7_game_state');
                    if (stateJson) {
                        try {
                            const state = JSON.parse(stateJson);
                            const route = state?.game?.currentRoute || 'Menu';
                            const tether = state?.tether?.level;
                            const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                            if (route === 'tori' && typeof tether === 'number') {
                                return [routeDisplay, `⚡${Math.round(tether)}%`];
                            }
                            return [routeDisplay, 'V2 Beta'];
                        } catch (e) {
                            // Fallback if parse fails
                        }
                    }
                    // Default state
                    const testCount = localStorage.getItem('uv7_test_count') || '435';
                    return ['V2 Beta', `${testCount} tests`];
                }
            }
        ];
    }

    detectCurrentApp() {
        const path = window.location.pathname;
        if (path.includes('showcase')) return 'showcase';
        if (path.includes('v1')) return 'v1';
        if (path.includes('v2') || path.includes('index.v2')) return 'v2';
        return 'landing';
    }

    loadRecentApps() {
        const recent = localStorage.getItem('uv7-recent-apps');
        return recent ? JSON.parse(recent) : [];
    }

    saveRecentApps() {
        localStorage.setItem('uv7-recent-apps', JSON.stringify(this.recentApps));
    }

    addToRecent(appId) {
        // Remove if already in list
        this.recentApps = this.recentApps.filter(id => id !== appId);
        // Add to front
        this.recentApps.unshift(appId);
        // Keep only last 3
        this.recentApps = this.recentApps.slice(0, 3);
        this.saveRecentApps();
    }

    injectHTML() {
        const html = `
            <div id="uv7-app-switcher" class="uv7-app-switcher">
                <div class="app-switcher-header">
                    <span class="app-switcher-title">UV7 OS - App Switcher</span>
                    <button class="app-switcher-close" aria-label="Close">✕</button>
                </div>
                <div class="app-switcher-content">
                    <div class="app-switcher-section" id="recent-apps-section" style="display: none;">
                        <div class="app-switcher-section-title">Recently Visited</div>
                        <div class="app-cards-grid" id="recent-apps-grid"></div>
                    </div>
                    <div class="app-switcher-section">
                        <div class="app-switcher-section-title">All Apps</div>
                        <div class="app-cards-grid" id="all-apps-grid"></div>
                    </div>
                    <div class="app-switcher-hint">
                        Tap any app to launch • Swipe down to close
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    cacheElements() {
        this.elements = {
            switcher: document.getElementById('uv7-app-switcher'),
            close: document.querySelector('.app-switcher-close'),
            recentSection: document.getElementById('recent-apps-section'),
            recentGrid: document.getElementById('recent-apps-grid'),
            allGrid: document.getElementById('all-apps-grid')
        };
    }

    attachHandlers() {
        // Close button
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Click outside to close
        if (this.elements.switcher) {
            this.elements.switcher.addEventListener('click', (e) => {
                if (e.target === this.elements.switcher) {
                    this.close();
                }
            });
        }

        // Swipe down to close
        this.attachSwipeHandler();
    }

    attachSwipeHandler() {
        let touchStartY = 0;
        let touchEndY = 0;

        this.elements.switcher.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.elements.switcher.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchEndY - touchStartY;
            // Swipe down (> 100px) closes switcher
            if (swipeDistance > 100) {
                this.close();
            }
        }, { passive: true });
    }

    render() {
        // Render recent apps
        if (this.recentApps.length > 0) {
            this.elements.recentSection.style.display = 'block';
            this.elements.recentGrid.innerHTML = '';
            this.recentApps.forEach(appId => {
                const app = this.apps.find(a => a.id === appId);
                if (app) {
                    const card = this.createAppCard(app, true);
                    this.elements.recentGrid.appendChild(card);
                }
            });
        }

        // Render all apps
        this.elements.allGrid.innerHTML = '';
        this.apps.forEach(app => {
            const card = this.createAppCard(app, false);
            this.elements.allGrid.appendChild(card);
        });
    }

    createAppCard(app, isRecent) {
        const card = document.createElement('div');
        const isActive = app.id === this.currentApp;
        card.className = `app-card ${isActive ? 'active' : ''}`;

        const state = app.getState();

        card.innerHTML = `
            <div class="app-preview" style="background: linear-gradient(135deg, ${app.color}, transparent);">
                <div class="app-preview-icon">${app.icon}</div>
            </div>
            <div class="app-info">
                <div class="app-name">
                    ${app.name}
                    ${isActive ? '<span class="app-badge active">Active</span>' : ''}
                    ${isRecent && !isActive ? '<span class="app-badge recent">Recent</span>' : ''}
                </div>
                <div class="app-description">${app.description}</div>
                <div class="app-state">
                    ${state.map(s => `<span class="app-state-item">${s}</span>`).join('')}
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.launchApp(app));

        return card;
    }

    launchApp(app) {
        if (app.id === this.currentApp) {
            // Already on this app, just close switcher
            this.close();
            return;
        }

        // Add to recent
        this.addToRecent(app.id);

        // BELLE: Use View Transitions for seamless app switching
        // "The visual persistence of the status bar is non-negotiable"
        this.navigateWithTransition(app.url);
    }

    // ═══════════════════════════════════════════════════════════════
    // BELLE: VIEW TRANSITIONS - THE "NO FLICKER" PROTOCOL
    // Makes app switching feel like native iOS/Android
    // ═══════════════════════════════════════════════════════════════

    /**
     * Navigate to URL with View Transition animation
     * Status bar stays fixed while content slides/fades
     */
    navigateWithTransition(url) {
        // Close the switcher first for clean transition
        this.close();

        // Small delay to let close animation start
        setTimeout(() => {
            // Fallback for browsers without View Transitions
            if (!document.startViewTransition) {
                window.location.href = url;
                return;
            }

            // Start the view transition
            document.startViewTransition(() => {
                window.location.href = url;
            });
        }, 150); // Let switcher start closing before page transition
    }

    open() {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.add('open');

        // Re-render to update state
        this.render();
    }

    close() {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.remove('open');
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    isOpen() {
        return this.elements.switcher && this.elements.switcher.classList.contains('open');
    }
}

// Export for use in UV7 OS
window.UV7AppSwitcher = UV7AppSwitcher;
