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

    // State tracking
    private currentRoute: 'ronnie' | 'tori' | 'menu' | 'prologue' = 'menu';
    private notesCollected: number = 0;
    private tetherLevel: number = 100;
    private _currentAct: string = ''; // Prefixed to indicate reserved for future use
    private idleTimer: ReturnType<typeof setTimeout> | null = null;
    private idleDelay: number = 3000;

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
                <span id="status-loop" class="status-item">${this.config.loopVersion}</span>
                <span id="status-route" class="status-item route-indicator">MENU</span>
            </div>

            <!-- Center Section: Act/Scene (optional) -->
            <div class="status-section status-center">
                <span id="status-act" class="status-item act-indicator"></span>
                <span id="status-auto" class="status-item auto-indicator" style="display: none;">AUTO ▶</span>
            </div>

            <!-- Right Section: Notes + Tether -->
            <div class="status-section status-right">
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

        // Prepend to body
        document.body.prepend(this.container);
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
}
