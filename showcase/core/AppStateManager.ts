/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - APP STATE MANAGER v2.0
 * Live preview cards with state persistence & instant resume
 *
 * Architecture:
 * - Listens to 'uv7:state:changed' events from all apps
 * - Stores state in localStorage with versioning
 * - Generates preview metadata for app switcher cards
 *
 * Based on crew recommendations:
 * - Tori: State tiers (UI/Session/Gameplay)
 * - Belle: Event architecture + Page Visibility API
 * - Zee: Per-tab scroll + debounce
 * - CoZee: Versioning + LRU eviction
 * ═══════════════════════════════════════════════════════════════
 */

interface AppTheme {
    primary: string;
    secondary: string;
    effect: string;
}

interface Preview {
    type: string;
    gradient: [string, string];
    effect: string;
    badge: string;
    title: string;
    subtitle: string;
}

interface AppState {
    appId: string;
    version: number;
    lastVisited: number;
    state: Record<string, any>;
    preview: Preview;
}

interface StateChangeDetail {
    appId: string;
    state?: Record<string, any>;
    preview?: Partial<Preview>;
}

declare global {
    interface Window {
        UV7AppStateManager?: AppStateManager;
        TIMELINE_DATA?: {
            entries: Array<{
                id?: string;
                sortDate?: string;
                [key: string]: any;
            }>;
        };
    }

    interface WindowEventMap {
        'uv7:state:changed': CustomEvent<StateChangeDetail>;
        'uv7:preview:updated': CustomEvent<{ appId: string; preview: Preview }>;
    }
}

export class AppStateManager {
    private STORAGE_KEY = 'uv7-app-states';
    private VERSION = 1;
    private MAX_APPS = 10; // LRU limit

    // Debounce settings
    private scrollDebounceMs = 300;
    private scrollDebounceTimers: Record<string, number> = {};

    // App theme definitions (for gradient previews)
    private appThemes: Record<string, AppTheme> = {
        showcase: {
            primary: '#3498db',
            secondary: '#2c3e50',
            effect: 'clean'
        },
        v1: {
            primary: '#00ff41',
            secondary: '#050505',
            effect: 'glitch'
        },
        v2: {
            primary: '#667eea',
            secondary: '#764ba2',
            effect: 'parallax'
        },
        landing: {
            primary: '#f8f9fa',
            secondary: '#2c3e50',
            effect: 'neutral'
        },
        torigatchi: {
            primary: '#00ff88',
            secondary: '#1a1a2e',
            effect: 'pulse'
        }
    };

    constructor() {
        this.init();
    }

    private init(): void {
        // Listen for state changes from any app
        window.addEventListener('uv7:state:changed', (e: CustomEvent<StateChangeDetail>) => {
            this.handleStateChange(e.detail);
        });

        // Save state when user leaves page
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flushPendingState();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.flushPendingState();
        });

        console.log('📦 AppStateManager v2.0 initialized');
    }

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    /**
     * Handle state change event from any app
     */
    private handleStateChange(detail: StateChangeDetail): void {
        const { appId, state, preview } = detail;

        if (!appId) {
            console.warn('[AppStateManager] Missing appId in state change');
            return;
        }

        const appState: AppState = {
            appId,
            version: this.VERSION,
            lastVisited: Date.now(),
            state: state || {},
            preview: this.generatePreview(appId, state, preview)
        };

        this.saveAppState(appState);

        // Dispatch event for app switcher to update preview
        window.dispatchEvent(new CustomEvent('uv7:preview:updated', {
            detail: { appId, preview: appState.preview }
        }));
    }

    /**
     * Generate preview metadata for a card
     */
    private generatePreview(appId: string, state?: Record<string, any>, customPreview?: Partial<Preview>): Preview {
        const theme = this.appThemes[appId] || this.appThemes.landing;

        // Use custom preview if provided, otherwise generate
        if (customPreview?.title) {
            return {
                type: 'gradient',
                gradient: [theme.primary, theme.secondary],
                effect: theme.effect,
                badge: customPreview.badge || appId,
                title: customPreview.title,
                subtitle: customPreview.subtitle || ''
            };
        }

        // Auto-generate based on state
        return this.autoGeneratePreview(appId, state, theme);
    }

    /**
     * Auto-generate preview from state
     */
    private autoGeneratePreview(appId: string, state: Record<string, any> = {}, theme: AppTheme): Preview {
        const preview: Preview = {
            type: 'gradient',
            gradient: [theme.primary, theme.secondary],
            effect: theme.effect,
            badge: '',
            title: '',
            subtitle: ''
        };

        switch (appId) {
            case 'showcase':
                preview.badge = this.formatTabName(state.activeTab || 'Journey');
                preview.title = state.activeEntry
                    ? `Entry #${state.activeEntry}`
                    : (state.activeTab || 'Exploring');
                preview.subtitle = state.viewMode === 'dev' ? 'Dev Mode' : 'Story Mode';
                break;

            case 'v1':
                preview.badge = state.scene ? 'In Progress' : 'Menu';
                preview.title = state.scene
                    ? this.formatSceneName(state.scene)
                    : 'Legacy Version';
                preview.subtitle = state.characters?.length
                    ? `${state.characters.length} characters`
                    : '';
                break;

            case 'v2':
                preview.badge = state.route || 'Beta';
                preview.title = state.act
                    ? `Act ${state.act}`
                    : 'V2 Engine';
                preview.subtitle = state.tether
                    ? `⚡ ${Math.round(state.tether)}%`
                    : '';
                break;

            case 'landing':
                preview.badge = 'Home';
                preview.title = 'UV7 Hub';
                preview.subtitle = `Loop ${localStorage.getItem('uv7_loop_version') || '848'}`;
                break;

            case 'torigatchi':
                preview.badge = state.mood || 'Ready';
                preview.title = 'ToriGatchi';
                preview.subtitle = state.lastFed
                    ? this.formatTimeAgo(state.lastFed)
                    : 'Not Started';
                break;

            default:
                preview.badge = appId;
                preview.title = 'App';
                preview.subtitle = '';
        }

        return preview;
    }

    // ═══════════════════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════════════════

    /**
     * Load all app states from localStorage
     */
    loadAllStates(): Record<string, AppState> {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return {};

            const parsed = JSON.parse(data);

            // Version check - migrate if needed
            if (parsed._version !== this.VERSION) {
                console.log('[AppStateManager] Migrating state from version', parsed._version);
                return this.migrateState(parsed);
            }

            return parsed.apps || {};
        } catch (e) {
            console.error('[AppStateManager] Failed to load states:', e);
            return {};
        }
    }

    /**
     * Save single app state
     */
    private saveAppState(appState: AppState): void {
        try {
            const allStates = this.loadAllStates();
            allStates[appState.appId] = appState;

            // LRU eviction if needed
            const appIds = Object.keys(allStates);
            if (appIds.length > this.MAX_APPS) {
                const sorted = appIds.sort((a, b) =>
                    (allStates[a].lastVisited || 0) - (allStates[b].lastVisited || 0)
                );
                delete allStates[sorted[0]];
                console.log(`[AppStateManager] LRU evicted: ${sorted[0]}`);
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                _version: this.VERSION,
                apps: allStates
            }));

        } catch (e) {
            console.error('[AppStateManager] Failed to save state:', e);
        }
    }

    /**
     * Get state for specific app
     */
    getAppState(appId: string): AppState | null {
        const allStates = this.loadAllStates();
        return allStates[appId] || null;
    }

    /**
     * Clear state for specific app
     */
    clearAppState(appId: string): void {
        const allStates = this.loadAllStates();
        delete allStates[appId];

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            _version: this.VERSION,
            apps: allStates
        }));

        console.log(`[AppStateManager] Cleared state for: ${appId}`);
    }

    /**
     * Handle state migration between versions
     */
    private migrateState(oldState: any): Record<string, AppState> {
        // V0 -> V1: Just restructure
        console.log('[AppStateManager] Migration complete');
        return oldState.apps || {};
    }

    /**
     * Flush any pending debounced state
     */
    private flushPendingState(): void {
        Object.keys(this.scrollDebounceTimers).forEach(key => {
            clearTimeout(this.scrollDebounceTimers[key]);
        });
        this.scrollDebounceTimers = {};
    }

    // ═══════════════════════════════════════════════════════════════
    // SHOWCASE HELPERS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Create debounced scroll handler for a specific tab
     */
    createScrollHandler(appId: string, tabId: string): (scrollPosition: number) => void {
        return (scrollPosition: number) => {
            const key = `${appId}-${tabId}`;

            if (this.scrollDebounceTimers[key]) {
                clearTimeout(this.scrollDebounceTimers[key]);
            }

            this.scrollDebounceTimers[key] = window.setTimeout(() => {
                const currentState = this.getAppState(appId);
                if (!currentState) return;

                // Update scroll position for this tab
                if (!currentState.state.scroll) {
                    currentState.state.scroll = {};
                }
                currentState.state.scroll[tabId] = scrollPosition;
                currentState.lastVisited = Date.now();

                this.saveAppState(currentState);
            }, this.scrollDebounceMs);
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // INSTANT RESUME
    // ═══════════════════════════════════════════════════════════════

    /**
     * Restore app state (called on app load)
     */
    restoreState(appId: string): Record<string, any> | null {
        const appState = this.getAppState(appId);
        if (!appState) {
            console.log(`[AppStateManager] No saved state for: ${appId}`);
            return null;
        }

        console.log(`[AppStateManager] Restoring state for: ${appId}`, appState.state);
        return appState.state;
    }

    // ═══════════════════════════════════════════════════════════════
    // NOTIFICATION BADGES
    // ═══════════════════════════════════════════════════════════════

    /**
     * Check for new content since last visit
     */
    getNewContentCount(appId: string): number {
        const appState = this.getAppState(appId);
        if (!appState) return 0;

        const lastVisited = appState.lastVisited || 0;

        switch (appId) {
            case 'showcase':
                // Check timeline entries newer than last visit
                if (window.TIMELINE_DATA?.entries) {
                    const latestEntry = window.TIMELINE_DATA.entries[0];
                    if (latestEntry?.sortDate) {
                        const latestDate = new Date(latestEntry.sortDate).getTime();
                        if (latestDate > lastVisited) {
                            return window.TIMELINE_DATA.entries.filter(e =>
                                e.sortDate && new Date(e.sortDate).getTime() > lastVisited
                            ).length;
                        }
                    }
                }
                return 0;

            default:
                return 0;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════

    private formatTabName(tab?: string): string {
        const tabNames: Record<string, string> = {
            home: 'Home',
            journey: 'Journal',
            workflow: 'Workflow',
            results: 'Results',
            spotlight: 'Spotlight',
            evolution: 'Evolution',
            who: 'About'
        };
        return tabNames[tab?.toLowerCase() || ''] || tab || 'Unknown';
    }

    private formatSceneName(sceneId: string): string {
        if (!sceneId) return 'Unknown';
        // Convert snake_case to Title Case
        return sceneId
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
            .substring(0, 30);
    }

    private formatTimeAgo(timestamp: number): string {
        if (!timestamp) return '';

        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;

        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
}

// Export and initialize
export function initAppStateManager(): AppStateManager {
    const manager = new AppStateManager();
    window.UV7AppStateManager = manager;
    return manager;
}
