// ========================================
// STATUS BAR INDICATORS
// Public setters, display helpers, pulse/glitch effects
//
// Extracted from StatusBar.ts (lines 804-946, 1026-1070)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { StatusBarElementRefs } from './StatusBarDOM';

interface StatusBarConfig {
    loopVersion: string;
    totalNotes: { ronnie: number; tori: number };
}

type RouteType = 'ronnie' | 'tori' | 'menu' | 'prologue';

/**
 * StatusBarIndicators
 *
 * Manages all indicator DOM elements: route, notes, tether, act,
 * auto-advance, loop version, show/hide, and pulse/glitch effects.
 */
export class StatusBarIndicators {
    private currentRoute: RouteType = 'menu';
    private notesCollected: number = 0;
    private tetherLevel: number = 100;
    private _currentAct: string = '';

    constructor(
        private refs: StatusBarElementRefs,
        private config: StatusBarConfig
    ) {}

    // ========================================
    // ROUTE & STATE SETTERS
    // ========================================

    /**
     * Set the current route - updates DOM, classes, tether visibility, notes.
     * Note: Orchestrator calls updateBreadcrumbs() and updateAdaptiveTint() separately.
     */
    setRoute(route: RouteType): void {
        this.currentRoute = route;

        // Update route text
        const routeDisplayNames: Record<string, string> = {
            'ronnie': 'RONNIE',
            'tori': 'TORI',
            'menu': 'MENU',
            'prologue': 'PROLOGUE'
        };
        this.refs.routeEl.textContent = routeDisplayNames[route] || route.toUpperCase();

        // Update route-specific styling
        this.refs.container.classList.remove('ronnie-route', 'tori-route');
        if (route === 'ronnie') {
            this.refs.container.classList.add('ronnie-route');
        } else if (route === 'tori') {
            this.refs.container.classList.add('tori-route');
        }

        // Show/hide tether indicator based on route
        this.updateTetherVisibility();

        // Update notes total for route
        this.updateNotesDisplay();
    }

    setNotesCollected(count: number): void {
        this.notesCollected = count;
        this.updateNotesDisplay();
    }

    setTetherLevel(level: number): void {
        this.tetherLevel = Math.max(0, Math.min(100, level));

        // Update percentage text
        this.refs.tetherValueEl.textContent = `${Math.round(this.tetherLevel)}%`;

        // Update fill height
        this.refs.tetherFillEl.style.height = `${this.tetherLevel}%`;

        // Apply state classes
        this.refs.tetherEl.classList.remove('healthy', 'warning', 'critical');
        if (this.tetherLevel < 20) {
            this.refs.tetherEl.classList.add('critical');
        } else if (this.tetherLevel < 50) {
            this.refs.tetherEl.classList.add('warning');
        } else {
            this.refs.tetherEl.classList.add('healthy');
        }
    }

    setAct(act: string): void {
        this._currentAct = act;
        this.refs.actEl.textContent = act;
        this.refs.actEl.style.display = act ? 'inline' : 'none';
    }

    setAutoIndicator(enabled: boolean): void {
        this.refs.autoEl.style.display = enabled ? 'inline' : 'none';
        if (enabled) {
            this.refs.autoEl.classList.add('pulse');
        }
    }

    getAct(): string {
        return this._currentAct;
    }

    setLoopVersion(version: string): void {
        this.refs.loopEl.textContent = version;
    }

    // ========================================
    // VISIBILITY
    // ========================================

    show(): void {
        this.refs.container.classList.add('visible');
    }

    hide(): void {
        this.refs.container.classList.remove('visible');
    }

    // ========================================
    // PULSE / GLITCH EFFECTS
    // ========================================

    pulseLoop(): void {
        this.refs.loopEl.classList.add('pulse');
        setTimeout(() => {
            this.refs.loopEl.classList.remove('pulse');
        }, 600);
    }

    glitchLoop(): void {
        if (this.currentRoute === 'ronnie') {
            this.refs.loopEl.classList.add('glitch');
            setTimeout(() => {
                this.refs.loopEl.classList.remove('glitch');
            }, 300);
        }
    }

    pulseNotes(): void {
        this.refs.notesEl.classList.add('pulse');
        setTimeout(() => {
            this.refs.notesEl.classList.remove('pulse');
        }, 600);
    }

    // ========================================
    // PRIVATE HELPERS
    // ========================================

    private updateNotesDisplay(): void {
        const total = this.getTotalNotes();
        const notesCountEl = this.refs.notesEl.querySelector('.notes-count');
        if (notesCountEl) {
            notesCountEl.textContent = `${this.notesCollected}/${total}`;
        }

        // Hide notes in menu/prologue
        const hideInRoutes = ['menu', 'prologue'];
        this.refs.notesEl.style.display = hideInRoutes.includes(this.currentRoute) ? 'none' : 'flex';
    }

    private getTotalNotes(): number {
        if (this.currentRoute === 'ronnie') {
            return this.config.totalNotes.ronnie;
        } else if (this.currentRoute === 'tori') {
            return this.config.totalNotes.tori;
        }
        return 0;
    }

    private updateTetherVisibility(): void {
        this.refs.tetherEl.style.display = this.currentRoute === 'tori' ? 'flex' : 'none';
    }

    /**
     * Extract act from scene ID and update display.
     * Scene IDs follow pattern: act1_scene_name, act2_scene_name, etc.
     */
    updateActFromScene(sceneId: string): void {
        const actMatch = sceneId.match(/^(act\d+)/i);
        if (actMatch && actMatch[1]) {
            const actNumber = actMatch[1].replace('act', '');
            this.setAct(`Act ${actNumber}`);
        }
    }

    // ========================================
    // STATE ACCESSORS (for orchestrator)
    // ========================================

    getCurrentRoute(): RouteType {
        return this.currentRoute;
    }

    getTetherLevelValue(): number {
        return this.tetherLevel;
    }
}
