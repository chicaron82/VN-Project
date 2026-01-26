/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - APP SWITCHER (BOUGIE EDITION) 💎
 * iOS/Android-style app switcher with instant resume
 *
 * Contributors:
 * - Ronnie (Vision: "Make it bougie" + Cross-app resume concept)
 * - ZeeRah (Architecture: State restoration pattern + Android gestures)
 * - DiZee (Enhancement: Live state + mini preview)
 * - DiZee (Polish: Premium UX + swipe-to-clear)
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

interface AppStateData {
    state: string[];
    hasSave: boolean;
    lastPlayed?: Date | null;
    progress?: number;
    mood?: string;
    isHangry?: boolean;
}

interface AppDefinition {
    id: string;
    name: string;
    icon: string;
    description: string;
    url: string;
    color: string;
    saveKeys: string[];
    getState: () => AppStateData;
}

interface PreviewMetadata {
    badge?: string;
    title?: string;
    subtitle?: string;
}

interface UndoBackup {
    app: AppDefinition;
    backup: Record<string, string>;
}

interface AppSwitcherElements {
    switcher: HTMLElement | null;
    close: HTMLElement | null;
    clearAll: HTMLElement | null;
    recentSection: HTMLElement | null;
    recentGrid: HTMLElement | null;
    allGrid: HTMLElement | null;
    undoToast: HTMLElement | null;
    undoMessage: HTMLElement | null;
    undoBtn: HTMLElement | null;
}

// ═══════════════════════════════════════════════════════════════
// UV7 APP SWITCHER CLASS
// ═══════════════════════════════════════════════════════════════

export class UV7AppSwitcher {
    private apps: AppDefinition[];
    private currentApp: string;
    private recentApps: string[];
    private elements: AppSwitcherElements;
    private undoBackup: UndoBackup | null;
    private undoTimeout: number | null;
    private backgroundMonitorInterval: number | null;
    // Reserved for future Phase 26c+ enhancement - tracking background indicators
    // @ts-expect-error - Reserved for future use
    private backgroundIndicators: Map<string, HTMLElement>;

    constructor() {
        this.apps = this.defineApps();
        this.currentApp = this.detectCurrentApp();
        this.recentApps = this.loadRecentApps();
        this.elements = {} as AppSwitcherElements;
        this.undoBackup = null;
        this.undoTimeout = null;

        // Phase 26c: Background monitoring
        this.backgroundMonitorInterval = null;
        this.backgroundIndicators = new Map();

        this.init();
    }

    private init(): void {
        this.injectHTML();
        this.injectStyles(); // Phase 26c: Inject enhanced styles
        this.cacheElements();
        this.attachHandlers();
        this.render();

        // Phase 26c: Start background monitoring for alerts
        this.startBackgroundMonitor();

        console.log('🚀 UV7 App Switcher (BOUGIE EDITION) initialized');
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26c: ENHANCED STYLES INJECTION
    // ═══════════════════════════════════════════════════════════════

    private injectStyles(): void {
        // Only inject once
        if (document.getElementById('uv7-app-switcher-enhanced-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'uv7-app-switcher-enhanced-styles';
        styles.textContent = `
            /* Phase 26c: Heartbeat animation for alive apps */
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.15); opacity: 0.8; }
            }

            @keyframes heartbeat-glow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
                50% { box-shadow: 0 0 15px 3px rgba(0, 255, 136, 0.4); }
            }

            .app-card.alive .app-preview-icon {
                animation: heartbeat 2s ease-in-out infinite;
            }

            .app-card.alive {
                animation: heartbeat-glow 2s ease-in-out infinite;
            }

            .app-card.alive::before {
                content: '';
                position: absolute;
                top: 8px;
                right: 8px;
                width: 8px;
                height: 8px;
                background: #00ff88;
                border-radius: 50%;
                animation: heartbeat 1s ease-in-out infinite;
                z-index: 10;
            }

            /* Phase 26c: Background indicator pill */
            .bg-indicator-pill {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.95));
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 20px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                z-index: 9998;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.9);
                transition: all 0.3s ease;
                transform: translateY(100px);
                opacity: 0;
            }

            .bg-indicator-pill.visible {
                transform: translateY(0);
                opacity: 1;
            }

            .bg-indicator-pill:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
                border-color: rgba(0, 255, 255, 0.5);
            }

            .bg-indicator-pill.urgent {
                border-color: rgba(255, 100, 100, 0.5);
                animation: pulse-urgent 1.5s ease-in-out infinite;
            }

            @keyframes pulse-urgent {
                0%, 100% { box-shadow: 0 4px 20px rgba(255, 100, 100, 0.2); }
                50% { box-shadow: 0 4px 25px rgba(255, 100, 100, 0.5); }
            }

            .bg-indicator-icon {
                font-size: 16px;
            }

            .bg-indicator-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .bg-indicator-app {
                font-weight: bold;
                font-size: 11px;
            }

            .bg-indicator-state {
                font-size: 10px;
                opacity: 0.7;
            }

            .bg-indicator-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                padding: 2px 4px;
                font-size: 10px;
                transition: color 0.2s;
            }

            .bg-indicator-close:hover {
                color: rgba(255, 255, 255, 0.9);
            }

            /* Phase 26c: Activity badge on app cards */
            .app-activity-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: #ff4444;
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                animation: bounce-in 0.3s ease;
            }

            @keyframes bounce-in {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styles);
    }

    // ═══════════════════════════════════════════════════════════════
    // APP DEFINITIONS
    // ═══════════════════════════════════════════════════════════════

    private defineApps(): AppDefinition[] {
        // Detect if we're in the unified shell (hash-based routing)
        const isShellMode = !!(window as any).uv7Shell;

        return [
            {
                id: 'landing',
                name: 'Landing',
                icon: '🏠',
                description: 'UV7 Project Hub',
                url: isShellMode ? '#/landing' : '/VN-Project/',
                color: 'rgba(0, 204, 255, 0.2)',
                saveKeys: [], // No save data for landing
                getState: (): AppStateData => {
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    return {
                        state: [`VERSION ${loopVersion}`, 'Home'],
                        hasSave: false
                    };
                }
            },
            {
                id: 'showcase',
                name: 'Showcase',
                icon: '📖',
                description: 'The Journey',
                url: isShellMode ? '#/showcase' : '/VN-Project/showcase/',
                color: 'rgba(0, 204, 255, 0.2)',
                saveKeys: ['uv7-showcase-phase', 'uv7_discovered_codes'],
                getState: (): AppStateData => {
                    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
                    const phaseNum = phase.replace('phase-', '');
                    const mode = document.body?.dataset?.viewMode || 'story';
                    const codes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');
                    const codeCount = codes.length;
                    const lastVisit = localStorage.getItem('uv7-showcase-last-visit');

                    return {
                        state: [`Phase ${phaseNum}`, codeCount > 0 ? `${codeCount} codes` : `${mode === 'story' ? 'Story' : 'Dev'} Mode`],
                        hasSave: codeCount > 0,
                        lastPlayed: lastVisit ? new Date(parseInt(lastVisit)) : null,
                        progress: Math.min(100, Math.round((parseInt(phaseNum) / 15) * 100))
                    };
                }
            },
            {
                id: 'v1',
                name: 'V1 Game',
                icon: '🎮',
                description: 'Legacy Version',
                url: isShellMode ? '#/v1' : '/VN-Project/v1/',
                color: 'rgba(255, 0, 85, 0.2)',
                saveKeys: ['uv7_current_route', 'uv7_current_act', 'uv7_game_state_v1'],
                getState: (): AppStateData => {
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    const route = localStorage.getItem('uv7_current_route') || '';
                    const act = localStorage.getItem('uv7_current_act');
                    const lastPlayed = localStorage.getItem('uv7_last_played_v1');

                    if (!route || route === 'menu' || route === '') {
                        return {
                            state: [`Loop ${loopVersion}`, 'Menu'],
                            hasSave: false
                        };
                    }

                    const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                    const actDisplay = act ? `Act ${act}` : '';

                    return {
                        state: [routeDisplay, actDisplay || `Loop ${loopVersion}`],
                        hasSave: true,
                        lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
                        progress: this.calculateV1Progress(route, act)
                    };
                }
            },
            {
                id: 'v2',
                name: 'V2 Engine',
                icon: '⚡',
                description: 'TypeScript Rebuild',
                url: isShellMode ? '#/v2' : '/VN-Project/index.v2.html',
                color: 'rgba(0, 255, 136, 0.2)',
                saveKeys: ['uv7_game_state'],
                getState: (): AppStateData => {
                    const stateJson = localStorage.getItem('uv7_game_state');
                    const lastPlayed = localStorage.getItem('uv7_last_played_v2');

                    if (stateJson) {
                        try {
                            const state = JSON.parse(stateJson);
                            const route = state?.game?.currentRoute || 'Menu';
                            const act = state?.game?.currentAct;
                            const tether = state?.tether?.level;

                            if (route && route !== 'menu') {
                                const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                                return {
                                    state: [
                                        routeDisplay,
                                        act ? `Act ${act}` : (typeof tether === 'number' ? `⚡${Math.round(tether)}%` : 'V2 Beta')
                                    ],
                                    hasSave: true,
                                    lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
                                    progress: this.calculateV2Progress(state)
                                };
                            }
                        } catch (e) {
                            console.warn('Failed to parse V2 state:', e);
                        }
                    }

                    const testCount = localStorage.getItem('uv7_test_count') || '435';
                    return {
                        state: ['V2 Beta', `${testCount} tests`],
                        hasSave: false
                    };
                }
            },
            {
                id: 'torigatchi',
                name: 'ToriGatchi',
                icon: '💚',
                description: 'AI Tamagotchi Care Simulator',
                url: isShellMode ? '#/torigatchi' : '../torigatchi/index.html',
                color: 'rgba(0, 255, 136, 0.3)',
                saveKeys: ['torigatchi-state'],
                getState: (): AppStateData => {
                    const state = localStorage.getItem('torigatchi-state');
                    if (!state) {
                        return {
                            state: ['Not Started', 'Ready to Play'],
                            hasSave: false
                        };
                    }

                    try {
                        const data = JSON.parse(state);
                        const lastFed = new Date(data.lastFed);
                        const now = new Date();
                        const hoursSince = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

                        // Calculate mood - ZEERAH'S MOOD SYSTEM
                        let mood: string, moodEmoji: string, isHangry = false;
                        if (hoursSince > 24) {
                            mood = 'BEYOND HANGRY';
                            moodEmoji = '💀';
                            isHangry = true;
                        } else if (hoursSince > 8) {
                            mood = 'HANGRY';
                            moodEmoji = '😡';
                            isHangry = true;
                        } else if (hoursSince > 5) {
                            mood = 'Hungry';
                            moodEmoji = '😤';
                        } else if (hoursSince > 3) {
                            mood = 'Content';
                            moodEmoji = '😊';
                        } else {
                            mood = 'Happy';
                            moodEmoji = '💚';
                        }

                        // Fourth wall break for extreme neglect
                        const userName = localStorage.getItem('uv7_user_name') || 'you';
                        const neglectMessage = hoursSince > 24
                            ? `"${userName.charAt(0).toUpperCase() + userName.slice(1)}, I KNOW you see this"`
                            : `Fed ${Math.floor(hoursSince)}h ago`;

                        return {
                            state: [`${moodEmoji} ${mood}`, neglectMessage, `Level ${data.level || 1}`],
                            hasSave: true,
                            lastPlayed: lastFed,
                            mood: mood,
                            isHangry: isHangry
                        };
                    } catch {
                        return {
                            state: ['Error Loading'],
                            hasSave: false
                        };
                    }
                }
            }
        ];
    }

    // ═══════════════════════════════════════════════════════════════
    // PROGRESS CALCULATION
    // ═══════════════════════════════════════════════════════════════

    private calculateV1Progress(route: string | null, act: string | null): number {
        // V1 has 3 routes with ~3 acts each
        const routeProgress: Record<string, number> = { tori: 0, ronnie: 33, true: 66 };
        const base = routeProgress[route?.toLowerCase() || ''] || 0;
        const actProgress = act ? (parseInt(act) / 3) * 33 : 0;
        return Math.min(100, Math.round(base + actProgress));
    }

    private calculateV2Progress(state: any): number {
        if (!state?.game) return 0;
        const route = state.game.currentRoute;
        const act = state.game.currentAct || 1;
        const sceneIndex = state.game.currentSceneIndex || 0;

        // Rough estimate based on route + act + scene
        const routeProgress: Record<string, number> = { tori: 0, ronnie: 33, true: 66 };
        const base = routeProgress[route?.toLowerCase() || ''] || 0;
        const actProgress = (act / 3) * 30;
        const sceneProgress = Math.min(3, sceneIndex / 10); // Small bonus for scene progress

        return Math.min(100, Math.round(base + actProgress + sceneProgress));
    }

    // ═══════════════════════════════════════════════════════════════
    // TIME FORMATTING - RONNIE'S UX POLISH
    // ═══════════════════════════════════════════════════════════════

    private formatLastPlayed(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26c: BACKGROUND MONITORING & ALERTS
    // Check background apps for urgent states (ToriGatchi hungry, etc.)
    // ═══════════════════════════════════════════════════════════════

    private startBackgroundMonitor(): void {
        // Check background apps every 30 seconds
        this.backgroundMonitorInterval = window.setInterval(() => {
            this.checkBackgroundApps();
        }, 30000);

        // Initial check
        setTimeout(() => this.checkBackgroundApps(), 2000);
    }

    private checkBackgroundApps(): void {
        this.apps.forEach(app => {
            // Skip current app
            if (app.id === this.currentApp) return;

            const stateData = app.getState();

            // Check for urgent conditions
            if (app.id === 'torigatchi' && stateData.isHangry) {
                this.showBackgroundIndicator(app, stateData, true);
            } else if (stateData.hasSave && this.shouldShowReminder(app)) {
                // Show gentle reminder for apps not visited in 24+ hours
                this.showBackgroundIndicator(app, stateData, false);
            }
        });
    }

    private shouldShowReminder(app: AppDefinition): boolean {
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (!lastPlayed) return false;

        const hoursSince = (Date.now() - parseInt(lastPlayed)) / (1000 * 60 * 60);
        return hoursSince > 24;
    }

    private showBackgroundIndicator(app: AppDefinition, stateData: AppStateData, isUrgent: boolean): void {
        // Only show one indicator at a time per app
        const existingPill = document.querySelector(`[data-bg-app="${app.id}"]`);
        if (existingPill) return;

        // Don't spam - check dismissal memory
        const dismissedKey = `uv7-bg-dismissed-${app.id}`;
        const dismissedAt = localStorage.getItem(dismissedKey);
        if (dismissedAt) {
            const hoursSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
            // Don't show again for 4 hours (or 1 hour if urgent)
            if (hoursSinceDismiss < (isUrgent ? 1 : 4)) return;
        }

        const pill = document.createElement('div');
        pill.className = `bg-indicator-pill ${isUrgent ? 'urgent' : ''}`;
        pill.dataset.bgApp = app.id;

        const stateText = Array.isArray(stateData.state) ? stateData.state.join(' • ') : stateData.state;

        pill.innerHTML = `
            <span class="bg-indicator-icon">${app.icon}</span>
            <div class="bg-indicator-text">
                <span class="bg-indicator-app">${app.name}</span>
                <span class="bg-indicator-state">${stateText}</span>
            </div>
            <button class="bg-indicator-close" aria-label="Dismiss">✕</button>
        `;

        // Click to open app
        pill.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('bg-indicator-close')) return;
            this.launchApp(app);
            pill.remove();
        });

        // Dismiss button
        const closeBtn = pill.querySelector('.bg-indicator-close') as HTMLElement;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.setItem(dismissedKey, Date.now().toString());
            pill.classList.remove('visible');
            setTimeout(() => pill.remove(), 300);
        });

        document.body.appendChild(pill);

        // Animate in
        requestAnimationFrame(() => {
            pill.classList.add('visible');
        });

        // Haptic for urgent
        if (isUrgent && navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }

        console.log(`🔔 Background alert: ${app.name} - ${stateText}`);
    }

    // Reserved for cleanup on page unload - not currently called but available for future use
    // @ts-expect-error - Reserved for future use
    private stopBackgroundMonitor(): void {
        if (this.backgroundMonitorInterval) {
            clearInterval(this.backgroundMonitorInterval);
            this.backgroundMonitorInterval = null;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // APP DETECTION & RECENT APPS
    // ═══════════════════════════════════════════════════════════════

    private detectCurrentApp(): string {
        // Check if we're in shell mode
        const isShellMode = !!(window as any).uv7Shell;

        if (isShellMode) {
            // Use hash-based detection
            const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0];
            if (hash === 'showcase') return 'showcase';
            if (hash === 'v1') return 'v1';
            if (hash === 'v2') return 'v2';
            if (hash === 'torigatchi') return 'torigatchi';
            if (hash === 'landing' || hash === '') return 'landing';
        }

        // Fallback to pathname-based detection for standalone mode
        const path = window.location.pathname;
        if (path.includes('showcase')) return 'showcase';
        if (path.includes('v1')) return 'v1';
        if (path.includes('torigatchi')) return 'torigatchi';
        if (path.includes('v2') || path.includes('index.v2')) return 'v2';
        return 'landing';
    }

    private loadRecentApps(): string[] {
        const recent = localStorage.getItem('uv7-recent-apps');
        return recent ? JSON.parse(recent) : [];
    }

    private saveRecentApps(): void {
        localStorage.setItem('uv7-recent-apps', JSON.stringify(this.recentApps));
    }

    private addToRecent(appId: string): void {
        this.recentApps = this.recentApps.filter(id => id !== appId);
        this.recentApps.unshift(appId);
        this.recentApps = this.recentApps.slice(0, 4);
        this.saveRecentApps();
    }

    // ═══════════════════════════════════════════════════════════════
    // INSTANT RESUME - ZEERAH'S ARCHITECTURE
    // ═══════════════════════════════════════════════════════════════

    private setResumeFlag(appId: string): void {
        localStorage.setItem('uv7-auto-resume', appId);
        localStorage.setItem('uv7-resume-timestamp', Date.now().toString());
    }

    // Reserved for clearing resume flags after successful navigation - available for future use
    // @ts-expect-error - Reserved for future use
    private clearResumeFlag(): void {
        localStorage.removeItem('uv7-auto-resume');
        localStorage.removeItem('uv7-resume-timestamp');
    }

    // ═══════════════════════════════════════════════════════════════
    // HTML INJECTION
    // ═══════════════════════════════════════════════════════════════

    private injectHTML(): void {
        const html = `
            <div id="uv7-app-switcher" class="uv7-app-switcher">
                <div class="app-switcher-header">
                    <span class="app-switcher-title">UV7 OS - App Switcher</span>
                    <div class="app-switcher-header-actions">
                        <button class="clear-all-btn" id="clear-all-saves" title="Clear all saves">🗑️</button>
                        <button class="app-switcher-close" aria-label="Close">✕</button>
                    </div>
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
                        <span class="hint-desktop">Tap any app to launch • Hover for options</span>
                        <span class="hint-mobile">Tap to launch • Swipe up on card to clear save</span>
                    </div>
                </div>
            </div>
            <div id="uv7-undo-toast" class="uv7-toast">
                <span class="uv7-toast-message"></span>
                <button class="uv7-toast-undo">UNDO</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    private cacheElements(): void {
        this.elements = {
            switcher: document.getElementById('uv7-app-switcher'),
            close: document.querySelector('.app-switcher-close'),
            clearAll: document.getElementById('clear-all-saves'),
            recentSection: document.getElementById('recent-apps-section'),
            recentGrid: document.getElementById('recent-apps-grid'),
            allGrid: document.getElementById('all-apps-grid'),
            undoToast: document.getElementById('uv7-undo-toast'),
            undoMessage: document.querySelector('.uv7-toast-message'),
            undoBtn: document.querySelector('.uv7-toast-undo')
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    private attachHandlers(): void {
        // Close button
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.close());
        }

        // Clear all button
        if (this.elements.clearAll) {
            this.elements.clearAll.addEventListener('click', () => this.confirmClearAll());
        }

        // Undo button
        if (this.elements.undoBtn) {
            this.elements.undoBtn.addEventListener('click', () => this.undoClear());
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

    private attachSwipeHandler(): void {
        if (!this.elements.switcher) return;

        let touchStartY = 0;
        let touchEndY = 0;

        this.elements.switcher.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0]!.clientY;
        }, { passive: true });

        this.elements.switcher.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0]!.clientY;
            const swipeDistance = touchEndY - touchStartY;
            if (swipeDistance > 100) {
                this.close();
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // SWIPE-TO-CLEAR - ANDROID MULTITASKING GESTURES
    // ═══════════════════════════════════════════════════════════════

    private attachSwipeToCloseHandler(card: HTMLElement, app: AppDefinition): void {
        let touchStartY = 0;
        let isDragging = false;

        card.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            touchStartY = e.touches[0]!.clientY;
            isDragging = false;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0]!.clientY;
            const deltaY = touchStartY - currentY; // Positive = swipe up

            if (deltaY > 10) {
                isDragging = true;
                card.classList.add('swiping');
                card.style.transform = `translateY(-${Math.min(200, deltaY)}px)`;
                card.style.opacity = Math.max(0.3, 1 - (deltaY / 200)).toString();
            }
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;

            const endY = e.changedTouches[0]!.clientY;
            const swipeDistance = touchStartY - endY;

            card.classList.remove('swiping');

            if (swipeDistance > 100 && app.saveKeys.length > 0) {
                // Swipe was far enough - clear save
                this.clearAppSave(app, card);
            } else {
                // Reset position
                card.style.transform = '';
                card.style.opacity = '';
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // SAVE CLEARING WITH UNDO - DIZEE'S UX POLISH
    // ═══════════════════════════════════════════════════════════════

    private clearAppSave(app: AppDefinition, card: HTMLElement): void {
        // Backup save data before clearing (for undo)
        const backup: Record<string, string> = {};
        app.saveKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) backup[key] = data;
        });

        // Also backup last played timestamp
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (lastPlayed) backup[lastPlayedKey] = lastPlayed;

        this.undoBackup = { app, backup };

        // Animate card flying off
        card.classList.add('clearing');

        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            // Clear localStorage
            app.saveKeys.forEach(key => {
                localStorage.removeItem(key);
            });
            localStorage.removeItem(lastPlayedKey);

            // Remove from recent if there
            this.recentApps = this.recentApps.filter(id => id !== app.id);
            this.saveRecentApps();

            // Show undo toast
            this.showUndoToast(`${app.name} save cleared`);

            // Re-render
            this.render();
        }, 300);
    }

    private showUndoToast(message: string): void {
        if (!this.elements.undoMessage || !this.elements.undoToast) return;

        if (this.undoTimeout) {
            clearTimeout(this.undoTimeout);
        }

        this.elements.undoMessage.textContent = message;
        this.elements.undoToast.classList.add('show');

        // Auto-hide after 5 seconds
        this.undoTimeout = window.setTimeout(() => {
            this.elements.undoToast?.classList.remove('show');
            this.undoBackup = null;
        }, 5000);
    }

    private undoClear(): void {
        if (!this.undoBackup) return;

        const { app, backup } = this.undoBackup;

        // Restore all backed up data
        Object.entries(backup).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        // Re-add to recent apps
        this.addToRecent(app.id);

        // Hide toast
        this.elements.undoToast?.classList.remove('show');
        if (this.undoTimeout) {
            clearTimeout(this.undoTimeout);
            this.undoTimeout = null;
        }

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([25, 25, 25]);
        }

        this.undoBackup = null;

        // Re-render
        this.render();

        console.log(`✅ Restored ${app.name} save data`);
    }

    private confirmClearSave(app: AppDefinition, card: HTMLElement): void {
        const stateData = app.getState();
        const stateStr = stateData.state.join(' • ');

        const confirmed = confirm(
            `Clear ${app.name} save data?\n\n` +
            `Current progress: ${stateStr}\n\n` +
            `This can be undone within 5 seconds.`
        );

        if (confirmed) {
            this.clearAppSave(app, card);
        }
    }

    private confirmClearAll(): void {
        const appsWithSaves = this.apps.filter(app => {
            const stateData = app.getState();
            return stateData.hasSave;
        });

        if (appsWithSaves.length === 0) {
            alert('No saves to clear!');
            return;
        }

        const appNames = appsWithSaves.map(a => a.name).join(', ');
        const confirmed = confirm(
            `Clear ALL save data?\n\n` +
            `This will reset: ${appNames}\n\n` +
            `This action cannot be undone!`
        );

        if (confirmed) {
            appsWithSaves.forEach(app => {
                app.saveKeys.forEach(key => {
                    localStorage.removeItem(key);
                });
                localStorage.removeItem(`uv7_last_played_${app.id}`);
            });

            this.recentApps = [];
            this.saveRecentApps();

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            this.render();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERING - THE BOUGIE CARD LAYOUT
    // ═══════════════════════════════════════════════════════════════

    private render(): void {
        if (!this.elements.recentSection || !this.elements.recentGrid || !this.elements.allGrid) return;

        // Render recent apps
        if (this.recentApps.length > 0) {
            this.elements.recentSection.style.display = 'block';
            this.elements.recentGrid.innerHTML = '';
            this.recentApps.forEach(appId => {
                const app = this.apps.find(a => a.id === appId);
                if (app) {
                    const card = this.createAppCard(app, true);
                    this.elements.recentGrid!.appendChild(card);
                }
            });
        } else {
            this.elements.recentSection.style.display = 'none';
        }

        // Render all apps
        this.elements.allGrid.innerHTML = '';
        this.apps.forEach(app => {
            const card = this.createAppCard(app, false);
            this.elements.allGrid!.appendChild(card);
        });
    }

    private createAppCard(app: AppDefinition, isRecent: boolean): HTMLElement {
        // Phase 26d: Check if we should use v2.0 preview cards
        const usePreviewCards = typeof (window as any).UV7AppStateManager !== 'undefined';

        const card = document.createElement('div');
        const stateData = app.getState();
        const hasSave = stateData.hasSave;
        const isActive = app.id === this.currentApp;
        const isHangry = stateData.isHangry;

        // Phase 26c: Check if app is "alive" (has recent activity)
        const isAlive = this.isAppAlive(app, stateData);

        // Phase 26d: Get enhanced preview from AppStateManager if available
        let preview: PreviewMetadata | null = null;
        if (usePreviewCards && (window as any).UV7AppStateManager) {
            const savedState = (window as any).UV7AppStateManager.getAppState(app.id);
            if (savedState && savedState.preview) {
                preview = savedState.preview;
            }
        }

        // Phase 26d: Check for new content (notification badge)
        const newContentCount = this.getNewContentCount(app);

        card.className = `app-card ${isActive ? 'active' : ''} ${isHangry ? 'hangry' : ''} ${isAlive ? 'alive' : ''} ${preview ? 'has-preview' : ''}`;
        card.dataset.app = app.id;

        const lastPlayedStr = stateData.lastPlayed ? this.formatLastPlayed(stateData.lastPlayed) : '';
        const progressBar = typeof stateData.progress === 'number' && hasSave ? `
            <div class="app-progress">
                <div class="app-progress-bar" style="width: ${stateData.progress}%"></div>
                <span class="app-progress-text">${stateData.progress}%</span>
            </div>
        ` : '';

        // Phase 26d: Enhanced card with preview metadata
        const previewBadge = preview?.badge || '';
        const previewTitle = preview?.title || '';
        const previewSubtitle = preview?.subtitle || '';

        // Phase 26d: Notification badge HTML
        const notificationBadge = newContentCount > 0 ? `
            <div class="app-notification-badge" title="${newContentCount} new item${newContentCount > 1 ? 's' : ''}">
                ${newContentCount > 9 ? '9+' : newContentCount}
            </div>
        ` : '';

        card.innerHTML = `
            ${notificationBadge}
            ${hasSave ? `<div class="quick-resume-badge">⚡ QUICK RESUME</div>` : ''}
            ${hasSave && app.saveKeys.length > 0 ? `
                <button class="app-card-close" aria-label="Clear save" title="Clear save data">✕</button>
            ` : ''}
            <div class="app-preview" style="background: linear-gradient(135deg, ${app.color}, transparent);">
                <div class="app-preview-icon">${app.icon}</div>
                ${preview ? `
                    <div class="app-preview-meta-overlay">
                        <span class="preview-badge">${previewBadge}</span>
                        <span class="preview-title">${previewTitle}</span>
                    </div>
                ` : ''}
            </div>
            <div class="app-info">
                <div class="app-name">
                    ${app.name}
                    ${isActive ? '<span class="app-badge active">Active</span>' : ''}
                    ${isRecent && !isActive ? '<span class="app-badge recent">Recent</span>' : ''}
                </div>
                <div class="app-description">${app.description}</div>
                <div class="app-state">
                    ${stateData.state.map(s => `<span class="app-state-item">${s}</span>`).join('')}
                    ${lastPlayedStr ? `<span class="app-state-item time ${lastPlayedStr === 'Just now' ? 'recent' : ''}">${lastPlayedStr}</span>` : ''}
                    ${previewSubtitle ? `<span class="app-state-item preview">${previewSubtitle}</span>` : ''}
                </div>
                ${progressBar}
            </div>
        `;

        // Card click to launch with instant resume
        card.addEventListener('click', (e) => {
            // Ignore if clicking close button
            if ((e.target as HTMLElement).classList.contains('app-card-close')) return;

            // Phase 26d: Set instant resume flag if we have saved state
            if (usePreviewCards && (window as any).UV7AppStateManager) {
                const savedState = (window as any).UV7AppStateManager.getAppState(app.id);
                if (savedState) {
                    localStorage.setItem('uv7-instant-resume', JSON.stringify({
                        appId: app.id,
                        state: savedState.state,
                        timestamp: Date.now()
                    }));
                }
            }

            this.launchApp(app);
        });

        // Close button (desktop)
        const closeBtn = card.querySelector('.app-card-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.confirmClearSave(app, card);
            });
        }

        // Swipe-to-clear (mobile)
        if (hasSave && app.saveKeys.length > 0) {
            this.attachSwipeToCloseHandler(card, app);
        }

        return card;
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26d: NEW CONTENT DETECTION FOR NOTIFICATION BADGES
    // ═══════════════════════════════════════════════════════════════

    private getNewContentCount(app: AppDefinition): number {
        // Get last visit timestamp for this app
        const lastVisitKey = `uv7_last_visited_${app.id}`;
        const lastVisit = localStorage.getItem(lastVisitKey);
        const lastVisitTime = lastVisit ? parseInt(lastVisit) : 0;

        // If never visited, don't show badge (first time users)
        if (!lastVisitTime) return 0;

        switch (app.id) {
            case 'showcase':
                // Check timeline entries newer than last visit
                if (typeof (window as any).TIMELINE_DATA !== 'undefined' && (window as any).TIMELINE_DATA?.entries) {
                    return (window as any).TIMELINE_DATA.entries.filter((entry: any) => {
                        const entryDate = new Date(entry.sortDate || entry.date).getTime();
                        return entryDate > lastVisitTime;
                    }).length;
                }
                return 0;

            case 'v1':
            case 'v2':
                // Games don't have "new content" in the same way
                return 0;

            case 'torigatchi':
                // ToriGatchi could show achievements or milestones
                return 0;

            default:
                return 0;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 26c: "ALIVE" APP DETECTION
    // Apps are "alive" if they have recent activity (within 30 minutes)
    // or have ToriGatchi-style ongoing state
    // ═══════════════════════════════════════════════════════════════

    private isAppAlive(app: AppDefinition, stateData: AppStateData): boolean {
        // ToriGatchi is always "alive" if it has state
        if (app.id === 'torigatchi' && stateData.hasSave) {
            return true;
        }

        // Check for recent activity (within 30 minutes)
        if (stateData.lastPlayed) {
            const minutesSince = (Date.now() - stateData.lastPlayed.getTime()) / (1000 * 60);
            if (minutesSince < 30) {
                return true;
            }
        }

        // Check explicit "last played" timestamp
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (lastPlayed) {
            const minutesSince = (Date.now() - parseInt(lastPlayed)) / (1000 * 60);
            if (minutesSince < 30) {
                return true;
            }
        }

        return false;
    }

    // ═══════════════════════════════════════════════════════════════
    // LAUNCHING APPS - INSTANT RESUME
    // ═══════════════════════════════════════════════════════════════

    private launchApp(app: AppDefinition): void {
        if (app.id === this.currentApp) {
            this.close();
            return;
        }

        // Check if we have save data for instant resume
        const stateData = app.getState();
        if (stateData.hasSave) {
            this.setResumeFlag(app.id);
        }

        // Update last played timestamp for the app we're leaving
        localStorage.setItem(`uv7_last_played_${this.currentApp}`, Date.now().toString());

        // Add to recent
        this.addToRecent(app.id);

        // Navigate with View Transition
        this.navigateWithTransition(app.url);
    }

    private navigateWithTransition(url: string): void {
        this.close();

        setTimeout(() => {
            // Check if we're in shell mode (hash-based routing)
            const isShellMode = !!(window as any).uv7Shell;

            if (isShellMode && url.startsWith('#')) {
                // Use hash navigation for shell mode
                window.location.hash = url;
            } else {
                // Use full page navigation for standalone mode
                if (!(document as any).startViewTransition) {
                    window.location.href = url;
                    return;
                }

                (document as any).startViewTransition(() => {
                    window.location.href = url;
                });
            }
        }, 150);
    }

    // ═══════════════════════════════════════════════════════════════
    // OPEN / CLOSE
    // ═══════════════════════════════════════════════════════════════

    public open(): void {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.add('open');
        this.render();
    }

    public close(): void {
        if (!this.elements.switcher) return;
        this.elements.switcher.classList.remove('open');
    }

    public toggle(): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    public isOpen(): boolean {
        return this.elements.switcher ? this.elements.switcher.classList.contains('open') : false;
    }
}

// Export for use in UV7 OS (maintaining global compatibility for now)
if (typeof window !== 'undefined') {
    (window as any).UV7AppSwitcher = UV7AppSwitcher;
}

// ═══════════════════════════════════════════════════════════════
// ASYNC INITIALIZATION FUNCTION (For backwards compatibility)
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize the app switcher asynchronously
 * Returns the singleton instance for the current page
 */
export async function initializeAppSwitcher(): Promise<UV7AppSwitcher> {
    // Check if already initialized
    if ((window as any).uv7AppSwitcher) {
        return (window as any).uv7AppSwitcher;
    }

    // Create new instance
    const appSwitcher = new UV7AppSwitcher();
    (window as any).uv7AppSwitcher = appSwitcher;

    return appSwitcher;
}
