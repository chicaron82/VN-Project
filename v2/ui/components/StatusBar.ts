import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../core/StateManager';
import { Logger } from '../../utils/Logger';

// ========================================
// EXTRACTED MODULES (Phase 26 + Phase 27 Refactoring)
// ========================================
// Context detection and feature flags → StatusBarContext.ts
// Breadcrumb logic → StatusBarBreadcrumbs.ts
// Gesture system → StatusBarGestures.ts
// App Switcher preview → StatusBarAppSwitcherPreview.ts
// Mail system → StatusBarMailSystem.ts
// DOM creation → status-bar/StatusBarDOM.ts
// Indicators → status-bar/StatusBarIndicators.ts
// Modes (theming/screenshot/orientation) → status-bar/StatusBarModes.ts
// Wiring (events/state/handlers) → status-bar/StatusBarWiring.ts

import type {
    UV7Context,
    StatusBarFeatures,
    ColorTint,
} from './StatusBarContext';
import {
    COLOR_TINTS,
    detectContext,
    getFeatures,
} from './StatusBarContext';

import type {
    BreadcrumbSegment,
} from './StatusBarBreadcrumbs';
import {
    buildBreadcrumbs,
} from './StatusBarBreadcrumbs';

import { StatusBarGestures } from './StatusBarGestures';
import { StatusBarMailSystem } from './StatusBarMailSystem';
import type { UnreadNote } from './StatusBarMailSystem';
import { createStatusBarDOM } from './status-bar/StatusBarDOM';
import { StatusBarIndicators } from './status-bar/StatusBarIndicators';
import { StatusBarModes } from './status-bar/StatusBarModes';
import { StatusBarWiring } from './status-bar/StatusBarWiring';
import type { StatusBarElementRefs } from './status-bar/StatusBarDOM';

// Re-export for backwards compatibility
export type { UV7Context, StatusBarFeatures, ColorTint };
export { detectContext, getFeatures };
export type { BreadcrumbSegment };
export { buildBreadcrumbs };
export type { BreadcrumbState } from './StatusBarBreadcrumbs';

/**
 * StatusBar - Unified Status Bar (BOUGIE EDITION)
 *
 * Phase 26: One StatusBar to rule them all.
 * Context-aware, glassmorphic, breadcrumb-navigable.
 *
 * Subsystems (extracted to status-bar/):
 * - StatusBarDOM: HTML template + element caching
 * - StatusBarIndicators: Route/notes/tether/act setters + pulse effects
 * - StatusBarModes: Theming, screenshot mode, orientation
 * - StatusBarWiring: EventBus/StateManager subscriptions, UI handlers
 *
 * 💚🔥💀 "Every pixel, every gesture, every animation—premium."
 */

// ========================================
// LEGACY CONFIG (preserved for V2 game compatibility)
// ========================================

interface StatusBarConfig {
    loopVersion: string;
    totalNotes: { ronnie: number; tori: number };
}

const DEFAULT_CONFIG: StatusBarConfig = {
    loopVersion: 'v848',
    totalNotes: { ronnie: 13, tori: 16 }
};

export class StatusBar {
    private eventBus: EventBus;
    private context: UV7Context;
    private features: StatusBarFeatures;

    // Element refs (shared across subsystems)
    private refs!: StatusBarElementRefs;

    // Breadcrumb state
    private currentBreadcrumbs: BreadcrumbSegment[] = [];
    private _currentScene: string = '';
    private _currentPhase: string = '';

    // Subsystems
    private indicators!: StatusBarIndicators;
    private modes!: StatusBarModes;
    private wiring!: StatusBarWiring;
    private gestures!: StatusBarGestures;
    private mailSystem!: StatusBarMailSystem;

    constructor(eventBus: EventBus, stateManager?: StateManager, config?: Partial<StatusBarConfig>) {
        this.eventBus = eventBus;
        const resolvedConfig = { ...DEFAULT_CONFIG, ...config };

        // Phase 26: Detect context and get features
        this.context = detectContext();
        this.features = getFeatures(this.context);

        // Set initial tint based on context
        const initialTint = this.context === 'showcase'
            ? COLOR_TINTS.showcase
            : this.context === 'landing'
                ? COLOR_TINTS.landing
                : COLOR_TINTS.neutral;

        Logger.ui(`🎨 StatusBar initialized in ${this.context} context`);

        // Create DOM and cache refs
        this.refs = createStatusBarDOM(this.context, this.features, resolvedConfig);

        // Initialize subsystems
        this.indicators = new StatusBarIndicators(this.refs, resolvedConfig);
        this.modes = new StatusBarModes(this.refs.container, eventBus, this.context, this.features, initialTint);

        this.wiring = new StatusBarWiring(this.refs, eventBus, stateManager || null, {
            setRoute: (route) => this.setRoute(route),
            setNotesCollected: (count) => this.indicators.setNotesCollected(count),
            setTetherLevel: (level) => this.indicators.setTetherLevel(level),
            setAutoIndicator: (enabled) => this.indicators.setAutoIndicator(enabled),
            setPaused: (paused) => this.setPaused(paused),
            pulseNotes: () => this.indicators.pulseNotes(),
            show: () => this.indicators.show(),
            hide: () => this.indicators.hide(),
            updateActFromScene: (sceneId) => this.indicators.updateActFromScene(sceneId),
            updateBreadcrumbs: () => this.updateBreadcrumbs(),
        });

        // Wire up UI handlers
        if (this.features.showMail) this.wiring.setupMailIconHandler();
        if (this.features.showStoryDevToggle) this.wiring.setupStoryDevToggle();
        if (this.features.showSettings) this.wiring.setupSettingsHandler();
        if (this.features.showBreadcrumbs) this.updateBreadcrumbs();

        // Wire up events, state, and initial load
        this.wiring.setupEventListeners();
        this.wiring.setupStateSubscriptions();
        this.wiring.setupIdleTimer();
        this.wiring.loadInitialState();
        this.wiring.setupAppSwitcher();

        // Phase 26: Apply initial tint and glass effect
        if (this.features.enableAdaptiveTint && this.context === 'landing') {
            this.modes.applyColorTint(initialTint);
        }
        this.modes.applyGlassEffect(this.features.glassIntensity);

        // Phase 26b: Initialize gesture system
        this.gestures = new StatusBarGestures(
            this.refs.container,
            this.eventBus,
            stateManager || null,
            {
                toggleScreenshotMode: () => this.modes.toggleScreenshotMode(),
                pulseLoop: () => this.indicators.pulseLoop(),
                markAllNotesAsRead: () => this.markAllNotesAsRead(),
            },
            () => ({
                tetherLevel: this.indicators.getTetherLevelValue(),
                isScreenshotMode: this.modes.isInScreenshotMode(),
            })
        );
        this.gestures.setup(this.features.enableGestures);

        // Initialize mail system
        this.mailSystem = new StatusBarMailSystem(
            this.refs.mailEl,
            this.refs.unreadBadgeEl,
            this.eventBus,
            () => this.indicators.getCurrentRoute()
        );
    }

    // ========================================
    // CONTEXT GETTERS
    // ========================================

    public getContext(): UV7Context { return this.context; }
    public getFeatures(): StatusBarFeatures { return this.features; }

    // ========================================
    // BREADCRUMB METHODS (stays in orchestrator)
    // ========================================

    private updateBreadcrumbs(): void {
        if (!this.features.showBreadcrumbs || !this.refs.breadcrumbsEl) return;

        const segments = buildBreadcrumbs(this.context, {
            loopVersion: 848,
            route: this.indicators.getCurrentRoute(),
            act: this.indicators.getAct(),
            scene: this._currentScene,
            phase: this._currentPhase,
        });

        this.currentBreadcrumbs = segments;
        this.renderBreadcrumbs();
    }

    private renderBreadcrumbs(): void {
        if (!this.refs.breadcrumbsEl) return;

        this.refs.breadcrumbsEl.innerHTML = '';

        this.currentBreadcrumbs.forEach((segment, index) => {
            const segmentEl = document.createElement('span');
            segmentEl.className = `breadcrumb-segment ${segment.clickable ? 'clickable' : ''}`;
            segmentEl.textContent = segment.label;
            segmentEl.dataset.id = segment.id;

            if (segment.clickable) {
                segmentEl.addEventListener('click', () => {
                    this.handleBreadcrumbClick(segment);
                });
            }

            segmentEl.addEventListener('mouseenter', () => {
                if (segment.clickable) {
                    segmentEl.style.transform = 'scale(1.05)';
                    segmentEl.style.color = this.modes.getCurrentTint().primary;
                }
            });
            segmentEl.addEventListener('mouseleave', () => {
                segmentEl.style.transform = '';
                segmentEl.style.color = '';
            });

            this.refs.breadcrumbsEl.appendChild(segmentEl);

            if (index < this.currentBreadcrumbs.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = ' › ';
                separator.style.opacity = '0.5';
                separator.style.margin = '0 4px';
                this.refs.breadcrumbsEl.appendChild(separator);
            }
        });
    }

    private handleBreadcrumbClick(segment: BreadcrumbSegment): void {
        Logger.ui(`🍞 Breadcrumb clicked: ${segment.id} (${segment.label})`);
        this.eventBus.emit('ui:screen_change', { screen: `breadcrumb:${segment.id}` });
        if (navigator.vibrate) navigator.vibrate(10);
    }

    // ========================================
    // PUBLIC API (delegates to subsystems)
    // ========================================

    public setRoute(route: 'ronnie' | 'tori' | 'menu' | 'prologue'): void {
        this.indicators.setRoute(route);
        this.updateBreadcrumbs();
        this.modes.updateAdaptiveTint();
    }

    public setScene(sceneId: string): void {
        this._currentScene = sceneId;
        this.updateBreadcrumbs();
    }

    public setPhase(phase: string): void {
        this._currentPhase = phase;
        this.updateBreadcrumbs();
        if (this.refs.phaseEl) this.refs.phaseEl.textContent = `Phase ${phase}`;
    }

    public setPaused(paused: boolean): void {
        this.modes.setPaused(paused, this.refs.routeEl, () => {
            this.indicators.setRoute(this.indicators.getCurrentRoute());
        });
    }

    public setNotesCollected(count: number): void { this.indicators.setNotesCollected(count); }
    public setTetherLevel(level: number): void { this.indicators.setTetherLevel(level); }
    public setAct(act: string): void { this.indicators.setAct(act); this.updateBreadcrumbs(); }
    public setAutoIndicator(enabled: boolean): void { this.indicators.setAutoIndicator(enabled); }
    public getAct(): string { return this.indicators.getAct(); }
    public setLoopVersion(version: string): void { this.indicators.setLoopVersion(version); }
    public show(): void { this.indicators.show(); }
    public hide(): void { this.indicators.hide(); }
    public pulseLoop(): void { this.indicators.pulseLoop(); }
    public glitchLoop(): void { this.indicators.glitchLoop(); }
    public pulseNotes(): void { this.indicators.pulseNotes(); }
    public toggleScreenshotMode(): void { this.modes.toggleScreenshotMode(); }
    public isInScreenshotMode(): boolean { return this.modes.isInScreenshotMode(); }
    public setupOrientationHandler(): void { this.modes.setupOrientationHandler(); }
    public removeOrientationHandler(): void { this.modes.removeOrientationHandler(); }

    // Mail delegation
    public addUnreadNote(id: string, title: string, sender: string, content: string = ''): void {
        this.mailSystem.addUnreadNote(id, title, sender, content);
    }
    public markNoteAsRead(id: string): void { this.mailSystem.markNoteAsRead(id); }
    public markAllNotesAsRead(): void { this.mailSystem.markAllNotesAsRead(); }
    public getUnreadCount(): number { return this.mailSystem.getUnreadCount(); }
    public getMostRecentUnread(): UnreadNote | null { return this.mailSystem.getMostRecentUnread(); }
    public pulseMail(): void { this.mailSystem.pulseMail(); }

    // Gesture wrappers (backwards compatibility)
    public setupGestures(): void { /* Initialized in constructor */ }
    private cleanupGestures(): void { this.gestures?.cleanup(); }

    // ========================================
    // CLEANUP
    // ========================================

    public destroy(): void {
        this.wiring.getUnsubscribers().forEach(unsub => unsub());
        this.wiring.clearIdleTimer();
        this.wiring.cleanupAppSwitcher();
        this.modes.removeOrientationHandler();
        this.cleanupGestures();
        this.refs.container.remove();
    }
}
