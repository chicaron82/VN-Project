import { EventBus } from '../../core/EventBus';
import { StateManager } from '../../core/StateManager';

/**
 * StatusBar - V2 Status Bar with Full Indicators
 *
 * Displays game state information in a fixed top bar:
 * - Left: Loop version, Route indicator
 * - Center: Act/Scene indicator (optional)
 * - Right: Notes collected, Tether level (Tori only)
 *
 * Port of V1 notification-shade-controller.js status bar functionality
 */

interface StatusBarConfig {
    loopVersion: string;
    totalNotes: {
        ronnie: number;
        tori: number;
    };
}

/**
 * DIZEE: Unread note tracking (V1 parity)
 * Email-style notes with badge counter
 */
interface UnreadNote {
    id: string;
    title: string;
    sender: string;
    content: string;
    timestamp: number;
}

const DEFAULT_CONFIG: StatusBarConfig = {
    loopVersion: 'v848',
    totalNotes: {
        ronnie: 13,
        tori: 16
    }
};

export class StatusBar {
    private container!: HTMLElement;
    private eventBus: EventBus;
    private stateManager: StateManager | null;
    private config: StatusBarConfig;

    // Element references
    private loopEl!: HTMLElement;
    private routeEl!: HTMLElement;
    private actEl!: HTMLElement;
    private autoEl!: HTMLElement;
    private notesEl!: HTMLElement;
    private tetherEl!: HTMLElement;
    private tetherValueEl!: HTMLElement;
    private tetherFillEl!: HTMLElement;
    // DIZEE: Mail icon elements (V1 parity)
    private mailEl!: HTMLElement;
    private unreadBadgeEl!: HTMLElement;

    // State tracking
    private currentRoute: 'ronnie' | 'tori' | 'menu' | 'prologue' = 'menu';
    private notesCollected: number = 0;
    private tetherLevel: number = 100;
    private _currentAct: string = ''; // Prefixed to indicate reserved for future use
    private idleTimer: ReturnType<typeof setTimeout> | null = null;
    private idleDelay: number = 3000;
    // DIZEE: Unread notes tracking (V1 parity)
    private unreadNotes: Map<string, UnreadNote> = new Map();
    private hasShownFirstNoteTutorial: boolean = false;

    // Unsubscribe functions for cleanup
    private unsubscribers: (() => void)[] = [];

    constructor(eventBus: EventBus, stateManager?: StateManager, config?: Partial<StatusBarConfig>) {
        this.eventBus = eventBus;
        this.stateManager = stateManager || null;
        this.config = { ...DEFAULT_CONFIG, ...config };

        this.createDOM();
        this.setupEventListeners();
        this.setupStateSubscriptions();
        this.setupIdleTimer();
        this.loadInitialState();
        this.setupAppSwitcher();
    }

    /**
     * Set up UV7 App Switcher
     * DIZEE: Enhanced with mini-preview on hover
     */
    private async setupAppSwitcher(): Promise<void> {
        try {
            const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
            const appSwitcher = await initializeAppSwitcher();

            // Wire up UV7 logo click
            const logoTrigger = document.getElementById('uv7-logo-trigger');
            if (logoTrigger) {
                logoTrigger.addEventListener('click', () => {
                    appSwitcher.toggle();
                });

                // DIZEE: Mini-preview on hover (UV7 OS enhancement)
                this.setupAppSwitcherPreview(logoTrigger);
            }

            console.log('🚀 UV7 App Switcher ready (V2)');
        } catch (error) {
            console.warn('⚠️ UV7 App Switcher failed to load:', error);
        }
    }

    // ========================================
    // DIZEE: UV7 OS MINI-PREVIEW (Enhancement)
    // Shows quick app states on hover before opening full switcher
    // ========================================

    private previewTooltip: HTMLElement | null = null;
    private previewTimeout: ReturnType<typeof setTimeout> | null = null;

    /**
     * Set up mini-preview tooltip for UV7 logo hover
     * Shows current states of all apps before opening full switcher
     */
    private setupAppSwitcherPreview(logoTrigger: HTMLElement): void {
        // Create preview tooltip element
        this.previewTooltip = document.createElement('div');
        this.previewTooltip.className = 'uv7-app-preview-tooltip';
        this.previewTooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            min-width: 200px;
            max-width: 280px;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            font-family: 'Courier New', monospace;
            pointer-events: none;
        `;

        // Insert after logo trigger
        logoTrigger.style.position = 'relative';
        logoTrigger.appendChild(this.previewTooltip);

        // Hover events (desktop only)
        logoTrigger.addEventListener('mouseenter', () => this.showAppPreview());
        logoTrigger.addEventListener('mouseleave', () => this.hideAppPreview());
    }

    /**
     * Show the mini-preview tooltip with current app states
     */
    private showAppPreview(): void {
        if (!this.previewTooltip) return;

        // Delay before showing (avoid flicker on quick hovers)
        this.previewTimeout = setTimeout(() => {
            // Build preview content with live state
            const apps = this.getAppStates();
            let content = `
                <div style="font-size: 10px; color: rgba(0, 255, 255, 0.7); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    UV7 OS • Tap to switch
                </div>
            `;

            apps.forEach(app => {
                const isActive = app.isActive;
                content += `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 6px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ${isActive ? 'color: #00ffff;' : 'color: rgba(255, 255, 255, 0.7);'}
                    ">
                        <span style="font-size: 14px;">${app.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 11px; font-weight: bold;">
                                ${app.name}
                                ${isActive ? '<span style="font-size: 9px; background: rgba(0, 255, 255, 0.2); padding: 1px 4px; border-radius: 3px; margin-left: 4px;">ACTIVE</span>' : ''}
                            </div>
                            <div style="font-size: 10px; opacity: 0.7;">${app.state}</div>
                        </div>
                    </div>
                `;
            });

            if (this.previewTooltip) {
                this.previewTooltip.innerHTML = content;
                this.previewTooltip.style.opacity = '1';
                this.previewTooltip.style.visibility = 'visible';
                this.previewTooltip.style.transform = 'translateY(0)';
            }
        }, 300); // 300ms delay before showing
    }

    /**
     * Hide the mini-preview tooltip
     */
    private hideAppPreview(): void {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }

        if (this.previewTooltip) {
            this.previewTooltip.style.opacity = '0';
            this.previewTooltip.style.visibility = 'hidden';
            this.previewTooltip.style.transform = 'translateY(-8px)';
        }
    }

    /**
     * Get current states of all UV7 apps for preview
     * DIZEE: Pull live data from localStorage/sessionStorage
     */
    private getAppStates(): Array<{ name: string; icon: string; state: string; isActive: boolean }> {
        const currentPath = window.location.pathname;
        const detectCurrentApp = () => {
            if (currentPath.includes('showcase')) return 'showcase';
            if (currentPath.includes('v1')) return 'v1';
            if (currentPath.includes('v2') || currentPath.includes('index.v2')) return 'v2';
            return 'landing';
        };
        const activeApp = detectCurrentApp();

        return [
            {
                name: 'Landing',
                icon: '🏠',
                state: (() => {
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    return `VERSION ${loopVersion}`;
                })(),
                isActive: activeApp === 'landing'
            },
            {
                name: 'Showcase',
                icon: '📖',
                state: (() => {
                    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
                    const phaseNum = phase.replace('phase-', '');
                    return `Phase ${phaseNum}`;
                })(),
                isActive: activeApp === 'showcase'
            },
            {
                name: 'V1 Game',
                icon: '🎮',
                state: (() => {
                    const route = localStorage.getItem('uv7_current_route') || 'Menu';
                    return route.charAt(0).toUpperCase() + route.slice(1);
                })(),
                isActive: activeApp === 'v1'
            },
            {
                name: 'V2 Engine',
                icon: '⚡',
                state: (() => {
                    const stateJson = localStorage.getItem('uv7_game_state');
                    if (stateJson) {
                        try {
                            const state = JSON.parse(stateJson);
                            const route = state?.game?.currentRoute || 'Menu';
                            const tether = state?.tether?.level;
                            if (route === 'tori' && typeof tether === 'number') {
                                return `${route.charAt(0).toUpperCase() + route.slice(1)} ⚡${Math.round(tether)}%`;
                            }
                            return route.charAt(0).toUpperCase() + route.slice(1);
                        } catch (_e) {
                            // Fallback if parse fails
                        }
                    }
                    return 'V2 Beta';
                })(),
                isActive: activeApp === 'v2'
            }
        ];
    }

    /**
     * Create the status bar DOM structure
     */
    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'status-bar';

        this.container.innerHTML = `
            <!-- Left Section: Loop + Route -->
            <div class="status-section status-left">
                <!-- UV7 OS Logo (App Switcher Trigger) -->
                <span id="uv7-logo-trigger" class="status-item uv7-logo-trigger" style="cursor: pointer; margin-right: 12px;" title="UV7 OS - Tap to switch apps">
                    <img src="/UnitedVoices7.png" alt="UV7" style="height: 16px; width: auto; vertical-align: middle;">
                </span>
                <span id="status-loop" class="status-item">${this.config.loopVersion}</span>
                <span id="status-route" class="status-item route-indicator">MENU</span>
            </div>

            <!-- Center Section: Act/Scene (optional) -->
            <div class="status-section status-center">
                <span id="status-act" class="status-item act-indicator"></span>
                <span id="status-auto" class="status-item auto-indicator" style="display: none;">AUTO ▶</span>
            </div>

            <!-- Right Section: Mail + Notes + Tether -->
            <div class="status-section status-right">
                <!-- DIZEE: Mail icon with unread badge (V1 parity) -->
                <span id="status-mail" class="status-item mail-indicator" title="Unread Notes" style="display: none;">
                    <span class="mail-icon">✉️</span>
                    <span class="unread-badge" style="display: none;">0</span>
                </span>
                <span id="status-notes" class="status-item notes-indicator" title="Collected Notes">
                    <span class="notes-icon">&#x1F4E7;</span>
                    <span class="notes-count">0/0</span>
                </span>
                <div id="status-tether" class="status-item tether-indicator">
                    <div class="tether-lightning">
                        <span class="tether-icon">&#x26A1;</span>
                        <div class="tether-fill"></div>
                    </div>
                    <span id="status-tether-value" class="tether-value">100%</span>
                </div>
            </div>
        `;

        // Cache element references
        this.loopEl = this.container.querySelector('#status-loop')!;
        this.routeEl = this.container.querySelector('#status-route')!;
        this.actEl = this.container.querySelector('#status-act')!;
        this.autoEl = this.container.querySelector('#status-auto')!;
        this.notesEl = this.container.querySelector('#status-notes')!;
        this.tetherEl = this.container.querySelector('#status-tether')!;
        this.tetherValueEl = this.container.querySelector('#status-tether-value')!;
        this.tetherFillEl = this.container.querySelector('.tether-fill')!;
        // DIZEE: Mail icon elements
        this.mailEl = this.container.querySelector('#status-mail')!;
        this.unreadBadgeEl = this.container.querySelector('.unread-badge')!;

        // Prepend to body
        document.body.prepend(this.container);

        // DIZEE: Set up mail icon click handler
        this.setupMailIconHandler();
    }

    /**
     * DIZEE: Set up mail icon click handler (V1 parity)
     * Clicking the mail icon opens the sidebar to notes tab
     */
    private setupMailIconHandler(): void {
        if (this.mailEl) {
            this.mailEl.addEventListener('click', () => {
                // V1 Parity: Haptic feedback
                if (navigator.vibrate) navigator.vibrate(20);
                // Open sidebar to notes
                this.eventBus.emit('ui:sidebar:open', {});
                this.eventBus.emit('ui:notes:open', {});
            });
        }
    }

    /**
     * Set up EventBus listeners
     */
    private setupEventListeners(): void {
        // Route change
        const unsubRoute = this.eventBus.on('ui:route_changed', (data) => {
            this.setRoute(data.route as 'ronnie' | 'tori' | 'menu' | 'prologue');
        });
        this.unsubscribers.push(unsubRoute);

        // Note collected
        const unsubNote = this.eventBus.on('note:collected', (data) => {
            this.setNotesCollected(data.count);
            this.pulseNotes();
        });
        this.unsubscribers.push(unsubNote);

        // Tether change
        const unsubTether = this.eventBus.on('tether:change', (data) => {
            this.setTetherLevel(data.level);
        });
        this.unsubscribers.push(unsubTether);

        // Scene load (for act indicator)
        const unsubScene = this.eventBus.on('scene:load', (data) => {
            this.updateActFromScene(data.sceneId);
        });
        this.unsubscribers.push(unsubScene);

        // Show/hide status bar
        const unsubShow = this.eventBus.on('ui:show_status_bar', () => this.show());
        const unsubHide = this.eventBus.on('ui:hide_status_bar', () => this.hide());
        this.unsubscribers.push(unsubShow, unsubHide);

        // Auto-Advance toggle
        const unsubSettings = this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'autoAdvance') {
                this.setAutoIndicator(data.value);
            }
        });
        this.unsubscribers.push(unsubSettings);
    }

    /**
     * Set up StateManager subscriptions for reactive updates
     */
    private setupStateSubscriptions(): void {
        if (!this.stateManager) return;

        // Subscribe to tether level changes
        const unsubTether = this.stateManager.subscribe('tether.level', (newLevel) => {
            if (typeof newLevel === 'number') {
                this.setTetherLevel(newLevel);
            }
        });
        this.unsubscribers.push(unsubTether);

        // Subscribe to route changes
        const unsubRoute = this.stateManager.subscribe('game.currentRoute', (route) => {
            if (typeof route === 'string') {
                this.setRoute(route as 'ronnie' | 'tori' | 'menu' | 'prologue');
            }
        });
        this.unsubscribers.push(unsubRoute);

        // Subscribe to notes collected
        const unsubNotes = this.stateManager.subscribe('notes.collected', (count) => {
            if (typeof count === 'number') {
                this.setNotesCollected(count);
            }
        });
        this.unsubscribers.push(unsubNotes);
    }

    /**
     * Load initial state from StateManager
     */
    private loadInitialState(): void {
        if (!this.stateManager) return;

        const route = this.stateManager.get<string>('game.currentRoute');
        if (route) {
            this.setRoute(route as 'ronnie' | 'tori' | 'menu' | 'prologue');
        }

        const tetherLevel = this.stateManager.get<number>('tether.level');
        if (typeof tetherLevel === 'number') {
            this.setTetherLevel(tetherLevel);
        }

        const notesCollected = this.stateManager.get<number>('notes.collected');
        if (typeof notesCollected === 'number') {
            this.setNotesCollected(notesCollected);
        }

        // Auto-Advance State
        const autoAdvance = this.stateManager.get<boolean>('settings.autoAdvance');
        this.setAutoIndicator(!!autoAdvance);
    }

    /**
     * Set up idle timer for auto-dimming
     */
    private setupIdleTimer(): void {
        const resetIdle = () => this.resetIdleTimer();
        document.addEventListener('mousemove', resetIdle);
        document.addEventListener('touchstart', resetIdle);
        document.addEventListener('keydown', resetIdle);
        this.resetIdleTimer();
    }

    /**
     * Reset idle timer - shows status bar and starts countdown
     */
    private resetIdleTimer(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        this.container.classList.remove('idle');

        this.idleTimer = setTimeout(() => {
            this.container.classList.add('idle');
        }, this.idleDelay);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Set the current route
     */
    public setRoute(route: 'ronnie' | 'tori' | 'menu' | 'prologue'): void {
        this.currentRoute = route;

        // Update route text
        const routeDisplayNames: Record<string, string> = {
            'ronnie': 'RONNIE',
            'tori': 'TORI',
            'menu': 'MENU',
            'prologue': 'PROLOGUE'
        };
        this.routeEl.textContent = routeDisplayNames[route] || route.toUpperCase();

        // Update route-specific styling
        this.container.classList.remove('ronnie-route', 'tori-route');
        if (route === 'ronnie') {
            this.container.classList.add('ronnie-route');
        } else if (route === 'tori') {
            this.container.classList.add('tori-route');
        }

        // Show/hide tether indicator based on route
        this.updateTetherVisibility();

        // Update notes total for route
        this.updateNotesDisplay();
    }

    /**
     * Set notes collected count
     */
    public setNotesCollected(count: number): void {
        this.notesCollected = count;
        this.updateNotesDisplay();
    }

    /**
     * Set tether level (0-100)
     */
    public setTetherLevel(level: number): void {
        this.tetherLevel = Math.max(0, Math.min(100, level));

        // Update percentage text
        this.tetherValueEl.textContent = `${Math.round(this.tetherLevel)}%`;

        // Update fill height
        this.tetherFillEl.style.height = `${this.tetherLevel}%`;

        // Apply state classes
        this.tetherEl.classList.remove('healthy', 'warning', 'critical');
        if (this.tetherLevel < 20) {
            this.tetherEl.classList.add('critical');
        } else if (this.tetherLevel < 50) {
            this.tetherEl.classList.add('warning');
        } else {
            this.tetherEl.classList.add('healthy');
        }
    }

    /**
     * Set the current act/scene indicator
     */
    public setAct(act: string): void {
        this._currentAct = act;
        this.actEl.textContent = act;
        this.actEl.style.display = act ? 'inline' : 'none';
    }

    public setAutoIndicator(enabled: boolean): void {
        this.autoEl.style.display = enabled ? 'inline' : 'none';
        if (enabled) {
            this.autoEl.classList.add('pulse'); // Reuse pulse animation or add new
        }
    }

    /**
     * Get the current act
     */
    public getAct(): string {
        return this._currentAct;
    }

    /**
     * Update loop version display
     */
    public setLoopVersion(version: string): void {
        this.loopEl.textContent = version;
    }

    /**
     * Show the status bar
     */
    public show(): void {
        this.container.classList.add('visible');
    }

    /**
     * Hide the status bar
     */
    public hide(): void {
        this.container.classList.remove('visible');
    }

    /**
     * Pulse the loop number (for loop increment events)
     */
    public pulseLoop(): void {
        this.loopEl.classList.add('pulse');
        setTimeout(() => {
            this.loopEl.classList.remove('pulse');
        }, 600);
    }

    /**
     * Glitch effect on loop number (Ronnie route)
     */
    public glitchLoop(): void {
        if (this.currentRoute === 'ronnie') {
            this.loopEl.classList.add('glitch');
            setTimeout(() => {
                this.loopEl.classList.remove('glitch');
            }, 300);
        }
    }

    /**
     * Pulse the notes indicator (when note collected)
     */
    public pulseNotes(): void {
        this.notesEl.classList.add('pulse');
        setTimeout(() => {
            this.notesEl.classList.remove('pulse');
        }, 600);
    }

    // ========================================
    // DIZEE: UNREAD NOTES SYSTEM (V1 Parity)
    // Email-style mail icon with badge counter
    // ========================================

    /**
     * Add an unread note - shows mail icon with badge
     * V1 Parity: notification-shade-controller.js addUnreadNote()
     */
    public addUnreadNote(id: string, title: string, sender: string, content: string = ''): void {
        // Add to unread notes map
        this.unreadNotes.set(id, {
            id,
            title,
            sender,
            content,
            timestamp: Date.now()
        });

        // Update mail icon
        this.updateMailIcon();

        // Pulse the mail icon
        this.pulseMail();

        // V1 Parity: First note tutorial trigger
        if (!this.hasShownFirstNoteTutorial && this.currentRoute === 'tori') {
            this.hasShownFirstNoteTutorial = true;
            // Emit tutorial event (if tutorial system is listening)
            this.eventBus.emit('ui:notification', {
                type: 'info',
                message: 'Tap the mail icon to read notes'
            });
        }

        console.log(`📬 New unread note: ${sender} - ${title}`);
    }

    /**
     * Mark a note as read - removes from unread count
     * V1 Parity: notification-shade-controller.js markNoteAsRead()
     */
    public markNoteAsRead(id: string): void {
        if (this.unreadNotes.has(id)) {
            this.unreadNotes.delete(id);
            this.updateMailIcon();
            console.log(`📭 Note marked as read: ${id}`);
        }
    }

    /**
     * Mark all notes as read
     */
    public markAllNotesAsRead(): void {
        this.unreadNotes.clear();
        this.updateMailIcon();
        console.log('📭 All notes marked as read');
    }

    /**
     * Get unread count
     */
    public getUnreadCount(): number {
        return this.unreadNotes.size;
    }

    /**
     * Get most recent unread note (for preview)
     */
    public getMostRecentUnread(): UnreadNote | null {
        if (this.unreadNotes.size === 0) return null;

        // Get most recent by timestamp
        let mostRecent: UnreadNote | null = null;
        this.unreadNotes.forEach((note) => {
            if (!mostRecent || note.timestamp > mostRecent.timestamp) {
                mostRecent = note;
            }
        });
        return mostRecent;
    }

    /**
     * Update mail icon visibility and badge count
     * V1 Parity: notification-shade-controller.js updateMailIcon()
     */
    private updateMailIcon(): void {
        const count = this.unreadNotes.size;

        if (count > 0) {
            // Show mail icon
            this.mailEl.style.display = 'flex';
            // Update badge
            this.unreadBadgeEl.textContent = count > 9 ? '9+' : String(count);
            this.unreadBadgeEl.style.display = 'flex';
            // Add unread class for styling
            this.mailEl.classList.add('has-unread');
        } else {
            // Hide mail icon when no unread
            this.mailEl.style.display = 'none';
            this.unreadBadgeEl.style.display = 'none';
            this.mailEl.classList.remove('has-unread');
        }
    }

    /**
     * Pulse mail icon animation
     */
    public pulseMail(): void {
        if (!this.mailEl) return;
        this.mailEl.classList.add('pulse');
        setTimeout(() => {
            this.mailEl.classList.remove('pulse');
        }, 600);
    }

    /**
     * Clean up and destroy the status bar
     */
    public destroy(): void {
        // Unsubscribe from all events
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];

        // Clear idle timer
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }

        // DIZEE: Clear preview timeout
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }

        // DIZEE: Clean up orientation handler
        this.removeOrientationHandler();

        // Remove from DOM
        this.container.remove();
    }

    // ========================================
    // PRIVATE HELPERS
    // ========================================

    /**
     * Update notes display with current count and route-specific total
     */
    private updateNotesDisplay(): void {
        const total = this.getTotalNotes();
        const notesCountEl = this.notesEl.querySelector('.notes-count');
        if (notesCountEl) {
            notesCountEl.textContent = `${this.notesCollected}/${total}`;
        }

        // Hide notes in menu/prologue
        const hideInRoutes = ['menu', 'prologue'];
        this.notesEl.style.display = hideInRoutes.includes(this.currentRoute) ? 'none' : 'flex';
    }

    /**
     * Get total notes for current route
     */
    private getTotalNotes(): number {
        if (this.currentRoute === 'ronnie') {
            return this.config.totalNotes.ronnie;
        } else if (this.currentRoute === 'tori') {
            return this.config.totalNotes.tori;
        }
        return 0;
    }

    /**
     * Show/hide tether indicator based on route (only Tori has tether)
     */
    private updateTetherVisibility(): void {
        this.tetherEl.style.display = this.currentRoute === 'tori' ? 'flex' : 'none';
    }

    /**
     * Extract act from scene ID and update display
     * Scene IDs follow pattern: act1_scene_name, act2_scene_name, etc.
     */
    private updateActFromScene(sceneId: string): void {
        const actMatch = sceneId.match(/^(act\d+)/i);
        if (actMatch && actMatch[1]) {
            const actNumber = actMatch[1].replace('act', '');
            this.setAct(`Act ${actNumber}`);
        }
    }

    // ========================================
    // DIZEE: SCREENSHOT MODE (V1 Parity)
    // Hide all UI for clean screenshots
    // ========================================

    private isScreenshotMode: boolean = false;

    /**
     * Toggle screenshot mode - hides all UI
     * V1 Parity: notification-shade-controller.js toggleScreenshotMode()
     */
    public toggleScreenshotMode(): void {
        this.isScreenshotMode = !this.isScreenshotMode;

        if (this.isScreenshotMode) {
            // Hide all UI elements
            document.body.classList.add('screenshot-mode');
            this.container.style.display = 'none';

            // Emit event for other components to hide
            this.eventBus.emit('ui:hide_hud', {});

            console.log('📸 Screenshot mode ON - All UI hidden');
        } else {
            // Restore UI
            document.body.classList.remove('screenshot-mode');
            if (this.container.classList.contains('visible')) {
                this.container.style.display = 'flex';
            }

            // Emit event for other components to show
            this.eventBus.emit('ui:show_status_bar', {});

            console.log('📸 Screenshot mode OFF - UI restored');
        }
    }

    /**
     * Check if screenshot mode is active
     */
    public isInScreenshotMode(): boolean {
        return this.isScreenshotMode;
    }

    // ========================================
    // DIZEE: ORIENTATION HANDLER (V1 Parity)
    // Handle portrait/landscape transitions
    // ========================================

    private orientationHandler: (() => void) | null = null;

    /**
     * Set up orientation change handler
     * V1 Parity: Closes sidebar when rotating to portrait
     */
    public setupOrientationHandler(): void {
        this.orientationHandler = () => {
            const isPortrait = window.matchMedia('(orientation: portrait)').matches;
            const isNarrow = window.innerWidth < 769;

            if (isPortrait || isNarrow) {
                // Portrait mode: Close sidebar
                this.eventBus.emit('ui:sidebar:close', {});
                console.log('📱 Portrait mode detected - Sidebar closed');
            }

            // Update any responsive state
            this.container.classList.toggle('portrait', isPortrait);
            this.container.classList.toggle('landscape', !isPortrait);
        };

        // Listen to orientation change
        window.addEventListener('orientationchange', this.orientationHandler);
        // Also listen to resize for desktop simulation
        window.addEventListener('resize', this.orientationHandler);

        // Initial check
        this.orientationHandler();
    }

    /**
     * Remove orientation handler (cleanup)
     */
    public removeOrientationHandler(): void {
        if (this.orientationHandler) {
            window.removeEventListener('orientationchange', this.orientationHandler);
            window.removeEventListener('resize', this.orientationHandler);
            this.orientationHandler = null;
        }
    }
}
