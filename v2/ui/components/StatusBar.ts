import { EventBus } from '../../core/EventBus';
import { StateManager } from '../../core/StateManager';

// ========================================
// EXTRACTED MODULES (Phase 26 Refactoring)
// ========================================
// Context detection and feature flags moved to StatusBarContext.ts
// Breadcrumb logic moved to StatusBarBreadcrumbs.ts
// Re-exported here for backwards compatibility

import {
    UV7Context,
    StatusBarFeatures,
    ColorTint,
    COLOR_TINTS,
    detectContext,
    getFeatures,
} from './StatusBarContext';

import {
    BreadcrumbSegment,
    buildBreadcrumbs,
} from './StatusBarBreadcrumbs';

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
 * Displays game state information in a fixed top bar:
 * - Left: UV7 Logo (App Switcher), Loop version, Route/Context indicator
 * - Center: Breadcrumb navigation (v.848 → Ronnie → Act 2 → Scene 5)
 * - Right: Notes collected, Tether level (Tori only), Mail icon
 *
 * Features:
 * - Context detection (game vs showcase) - via StatusBarContext.ts
 * - Feature flags for per-context behavior - via StatusBarContext.ts
 * - Adaptive color tints per route/context
 * - Breadcrumb navigation - via StatusBarBreadcrumbs.ts
 * - Glassmorphism + micro-interactions
 *
 * 💚🔥💀 "Every pixel, every gesture, every animation—premium."
 */

// ========================================
// LEGACY CONFIG (preserved for V2 game compatibility)
// ========================================

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

    // ========================================
    // PHASE 26: Context & Features (BOUGIE EDITION)
    // ========================================
    private context: UV7Context;
    private features: StatusBarFeatures;
    private currentTint: ColorTint;

    // Breadcrumb elements
    private breadcrumbsEl!: HTMLElement;
    private currentBreadcrumbs: BreadcrumbSegment[] = [];

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
    // Phase 26: Showcase-specific elements
    private phaseEl!: HTMLElement;
    private storyDevToggleEl!: HTMLElement;

    // State tracking
    private currentRoute: 'ronnie' | 'tori' | 'menu' | 'prologue' = 'menu';
    private notesCollected: number = 0;
    private tetherLevel: number = 100;
    private _currentAct: string = ''; // Prefixed to indicate reserved for future use
    private _currentScene: string = ''; // For breadcrumbs
    private _currentPhase: string = ''; // Showcase phase tracking
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

        // Phase 26: Detect context and get features
        this.context = detectContext();
        this.features = getFeatures(this.context);

        // Set initial tint based on context
        // Game mode: neutral (CSS handles route colors via .ronnie-route/.tori-route)
        // Showcase: orange dev tint
        // Landing: purple UV7 tint
        this.currentTint = this.context === 'showcase'
            ? COLOR_TINTS.showcase
            : this.context === 'landing'
                ? COLOR_TINTS.landing
                : COLOR_TINTS.neutral;

        console.log(`🎨 StatusBar initialized in ${this.context} context`);

        this.createDOM();
        this.setupEventListeners();
        this.setupStateSubscriptions();
        this.setupIdleTimer();
        this.loadInitialState();
        this.setupAppSwitcher();

        // Phase 26: Apply initial tint and glass effect
        // In game mode, CSS classes handle theming - don't apply inline tints
        if (this.features.enableAdaptiveTint && this.context !== 'game') {
            this.applyColorTint(this.currentTint);
        }
        this.applyGlassEffect(this.features.glassIntensity);

        // Phase 26b: Set up gestures (swipe, long-press, double-tap, context menu)
        this.setupGestures();
    }

    // ========================================
    // PHASE 26: CONTEXT & TINT METHODS
    // ========================================

    /**
     * Get current UV7 context
     */
    public getContext(): UV7Context {
        return this.context;
    }

    /**
     * Get current feature flags
     */
    public getFeatures(): StatusBarFeatures {
        return this.features;
    }

    /**
     * Apply color tint to status bar (adaptive theming)
     */
    private applyColorTint(tint: ColorTint): void {
        if (!this.container) return;

        this.container.style.setProperty('--status-accent', tint.primary);
        this.container.style.setProperty('--status-glow', tint.glow);
        this.container.style.background = tint.gradient;

        // Subtle transition for smoothness
        this.container.style.transition = 'background 0.5s ease, box-shadow 0.5s ease';
        this.container.style.boxShadow = `0 2px 20px ${tint.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;

        this.currentTint = tint;
    }

    /**
     * Apply glassmorphism effect based on intensity
     */
    private applyGlassEffect(intensity: 'subtle' | 'medium' | 'heavy'): void {
        if (!this.container) return;

        const blurValues = {
            subtle: '8px',
            medium: '12px',
            heavy: '20px',
        };

        const saturateValues = {
            subtle: '150%',
            medium: '180%',
            heavy: '200%',
        };

        this.container.style.backdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
        // Webkit prefix for Safari
        (this.container.style as any).webkitBackdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
    }

    /**
     * Update tint based on current route/context
     * Called when route changes
     *
     * GAME MODE: CSS class-based theming handles route colors (.ronnie-route, .tori-route)
     * - Ronnie: cyan (#00ffff)
     * - Tori: green (#00ff88)
     *
     * SHOWCASE/LANDING: Inline tints via applyColorTint()
     */
    private updateAdaptiveTint(): void {
        if (!this.features.enableAdaptiveTint) return;

        // In game context, let CSS handle route theming
        // The .ronnie-route and .tori-route classes in status-bar.css have correct colors
        if (this.context === 'game') {
            // Clear any inline tint styles so CSS classes take precedence
            this.clearInlineTint();
            return;
        }

        // Non-game contexts: apply inline tints
        let newTint: ColorTint = COLOR_TINTS.neutral;

        if (this.context === 'showcase') {
            newTint = COLOR_TINTS.showcase;
        } else if (this.context === 'landing') {
            newTint = COLOR_TINTS.landing;
        }

        this.applyColorTint(newTint);
    }

    /**
     * Set paused state (visual indicator)
     */
    public setPaused(paused: boolean): void {
        if (paused) {
            this.routeEl.textContent = 'PAUSED';
            this.routeEl.classList.add('paused-indicator');
            this.routeEl.style.color = '#ff3c3c'; // Red for pause
            this.routeEl.style.textShadow = '0 0 10px rgba(255, 60, 60, 0.5)';
        } else {
            // Restore route display
            this.setRoute(this.currentRoute);
            this.routeEl.classList.remove('paused-indicator');
            this.routeEl.style.color = '';
            this.routeEl.style.textShadow = '';
        }
    }

    /**
     * Clear inline tint styles (let CSS classes handle theming)
     */
    private clearInlineTint(): void {
        if (!this.container) return;

        // Remove inline styles so CSS classes take precedence
        this.container.style.removeProperty('--status-accent');
        this.container.style.removeProperty('--status-glow');
        this.container.style.background = '';
        this.container.style.boxShadow = '';
    }

    // ========================================
    // PHASE 26: BREADCRUMB METHODS
    // ========================================

    /**
     * Update breadcrumb navigation display
     */
    private updateBreadcrumbs(): void {
        if (!this.features.showBreadcrumbs || !this.breadcrumbsEl) return;

        const segments = buildBreadcrumbs(this.context, {
            loopVersion: 848,
            route: this.currentRoute,
            act: this._currentAct,
            scene: this._currentScene,
            phase: this._currentPhase,
        });

        this.currentBreadcrumbs = segments;
        this.renderBreadcrumbs();
    }

    /**
     * Render breadcrumb segments to DOM
     */
    private renderBreadcrumbs(): void {
        if (!this.breadcrumbsEl) return;

        this.breadcrumbsEl.innerHTML = '';

        this.currentBreadcrumbs.forEach((segment, index) => {
            // Create segment element
            const segmentEl = document.createElement('span');
            segmentEl.className = `breadcrumb-segment ${segment.clickable ? 'clickable' : ''}`;
            segmentEl.textContent = segment.label;
            segmentEl.dataset.id = segment.id;

            // Add click handler for clickable segments
            if (segment.clickable) {
                segmentEl.addEventListener('click', () => {
                    this.handleBreadcrumbClick(segment);
                });
            }

            // Add micro-interaction on hover
            segmentEl.addEventListener('mouseenter', () => {
                if (segment.clickable) {
                    segmentEl.style.transform = 'scale(1.05)';
                    segmentEl.style.color = this.currentTint.primary;
                }
            });
            segmentEl.addEventListener('mouseleave', () => {
                segmentEl.style.transform = '';
                segmentEl.style.color = '';
            });

            this.breadcrumbsEl.appendChild(segmentEl);

            // Add separator (except for last segment)
            if (index < this.currentBreadcrumbs.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = ' → ';
                separator.style.opacity = '0.5';
                separator.style.margin = '0 4px';
                this.breadcrumbsEl.appendChild(separator);
            }
        });
    }

    /**
     * Handle breadcrumb segment click
     * Tori's recommendation: Emit events, don't do actions directly
     */
    private handleBreadcrumbClick(segment: BreadcrumbSegment): void {
        console.log(`🍞 Breadcrumb clicked: ${segment.id} (${segment.label})`);

        // Emit event for controllers to handle navigation
        this.eventBus.emit('ui:screen_change', { screen: `breadcrumb:${segment.id}` });

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }

    /**
     * Set current scene (for breadcrumb display)
     */
    public setScene(sceneId: string): void {
        this._currentScene = sceneId;
        this.updateBreadcrumbs();
    }

    /**
     * Set current phase (showcase breadcrumbs)
     */
    public setPhase(phase: string): void {
        this._currentPhase = phase;
        this.updateBreadcrumbs();

        // Update phase indicator if present
        if (this.phaseEl) {
            this.phaseEl.textContent = `Phase ${phase}`;
        }
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
     * Phase 26: Feature-flag-based rendering for context-aware display
     */
    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'status-bar';
        this.container.dataset.context = this.context;

        // Phase 26: Context-aware DOM structure
        this.container.innerHTML = `
            <!-- Left Section: Logo + Loop/Context -->
            <div class="status-section status-left">
                <!-- UV7 OS Logo (App Switcher Trigger) -->
                ${this.features.enableAppSwitcher ? `
                <span id="uv7-logo-trigger" class="status-item uv7-logo-trigger" style="cursor: pointer; margin-right: 12px;" title="UV7 OS - Tap to switch apps">
                    <img src="./assets/UnitedVoices7.png" alt="UV7" style="height: 16px; width: auto; vertical-align: middle;">
                </span>
                ` : ''}
                ${this.features.showLoopVersion ? `
                <span id="status-loop" class="status-item">${this.config.loopVersion}</span>
                ` : ''}
                ${this.features.showRoute ? `
                <span id="status-route" class="status-item route-indicator">MENU</span>
                ` : ''}
                ${this.features.showPhaseIndicator ? `
                <span id="status-phase" class="status-item phase-indicator">Showcase</span>
                ` : ''}
            </div>

            <!-- Center Section: Breadcrumbs / Act / Auto -->
            <div class="status-section status-center">
                ${this.features.showBreadcrumbs ? `
                <div id="status-breadcrumbs" class="status-item breadcrumbs" style="display: flex; align-items: center; gap: 4px; font-size: 11px;"></div>
                ` : ''}
                <span id="status-act" class="status-item act-indicator" style="${this.features.showBreadcrumbs ? 'display: none;' : ''}"></span>
                <span id="status-auto" class="status-item auto-indicator" style="display: none;">AUTO ▶</span>
                ${this.features.showStoryDevToggle ? `
                <button id="status-story-dev-toggle" class="status-item story-dev-toggle" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    padding: 2px 8px;
                    font-size: 10px;
                    color: inherit;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " title="Toggle Story/Dev Mode">
                    📖 Story
                </button>
                ` : ''}
            </div>

            <!-- Right Section: Mail + Notes + Tether -->
            <div class="status-section status-right">
                ${this.features.showMail ? `
                <!-- DIZEE: Mail icon with unread badge (V1 parity) -->
                <span id="status-mail" class="status-item mail-indicator" title="Unread Notes" style="display: none;">
                    <span class="mail-icon">✉️</span>
                    <span class="unread-badge" style="display: none;">0</span>
                </span>
                ` : ''}
                ${this.features.showNotes ? `
                <span id="status-notes" class="status-item notes-indicator" title="Collected Notes">
                    <span class="notes-icon">&#x1F4E7;</span>
                    <span class="notes-count">0/0</span>
                </span>
                ` : ''}
                ${this.features.showTether ? `
                <div id="status-tether" class="status-item tether-indicator">
                    <div class="tether-lightning">
                        <span class="tether-icon">&#x26A1;</span>
                        <div class="tether-fill"></div>
                    </div>
                    <span id="status-tether-value" class="tether-value">100%</span>
                </div>
                ` : ''}
            </div>
        `;

        // Cache element references (with null checks for feature-flagged elements)
        this.loopEl = this.container.querySelector('#status-loop') || this.createPlaceholder();
        this.routeEl = this.container.querySelector('#status-route') || this.createPlaceholder();
        this.actEl = this.container.querySelector('#status-act') || this.createPlaceholder();
        this.autoEl = this.container.querySelector('#status-auto') || this.createPlaceholder();
        this.notesEl = this.container.querySelector('#status-notes') || this.createPlaceholder();
        this.tetherEl = this.container.querySelector('#status-tether') || this.createPlaceholder();
        this.tetherValueEl = this.container.querySelector('#status-tether-value') || this.createPlaceholder();
        this.tetherFillEl = this.container.querySelector('.tether-fill') || this.createPlaceholder();
        // DIZEE: Mail icon elements
        this.mailEl = this.container.querySelector('#status-mail') || this.createPlaceholder();
        this.unreadBadgeEl = this.container.querySelector('.unread-badge') || this.createPlaceholder();
        // Phase 26: Breadcrumbs and showcase elements
        this.breadcrumbsEl = this.container.querySelector('#status-breadcrumbs') || this.createPlaceholder();
        this.phaseEl = this.container.querySelector('#status-phase') || this.createPlaceholder();
        this.storyDevToggleEl = this.container.querySelector('#status-story-dev-toggle') || this.createPlaceholder();

        // Prepend to body
        document.body.prepend(this.container);

        // DIZEE: Set up mail icon click handler
        if (this.features.showMail) {
            this.setupMailIconHandler();
        }

        // Phase 26: Set up story/dev toggle
        if (this.features.showStoryDevToggle) {
            this.setupStoryDevToggle();
        }

        // Phase 26: Initialize breadcrumbs if enabled
        if (this.features.showBreadcrumbs) {
            this.updateBreadcrumbs();
        }
    }

    /**
     * Create a placeholder element for feature-flagged missing elements
     * Prevents null reference errors when elements are disabled
     */
    private createPlaceholder(): HTMLElement {
        const placeholder = document.createElement('span');
        placeholder.style.display = 'none';
        return placeholder;
    }

    /**
     * Set up story/dev mode toggle for Showcase
     */
    private setupStoryDevToggle(): void {
        if (!this.storyDevToggleEl) return;

        let isStoryMode = true;

        this.storyDevToggleEl.addEventListener('click', () => {
            isStoryMode = !isStoryMode;
            this.storyDevToggleEl.innerHTML = isStoryMode ? '📖 Story' : '🔧 Dev';

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(10);

            // Emit event for Showcase to handle
            this.eventBus.emit('settings:changed', {
                key: 'viewMode',
                value: isStoryMode ? 'story' : 'dev'
            });

            console.log(`📖 View mode: ${isStoryMode ? 'Story' : 'Dev'}`);
        });

        // Micro-interaction on hover
        this.storyDevToggleEl.addEventListener('mouseenter', () => {
            this.storyDevToggleEl.style.transform = 'scale(1.05)';
            this.storyDevToggleEl.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        this.storyDevToggleEl.addEventListener('mouseleave', () => {
            this.storyDevToggleEl.style.transform = '';
            this.storyDevToggleEl.style.background = 'rgba(255, 255, 255, 0.1)';
        });
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

        // Status update (from Showcase/Bridge)
        const unsubStatus = this.eventBus.on('ui:status_update', (data) => {
            if (this.phaseEl) {
                this.phaseEl.textContent = data.context;
            } else if (this.routeEl) {
                this.routeEl.textContent = data.context;
            }
        });
        this.unsubscribers.push(unsubStatus);

        // Auto-Advance toggle
        const unsubSettings = this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'autoAdvance') {
                this.setAutoIndicator(data.value);
            }
        });
        this.unsubscribers.push(unsubSettings);
        // Pause State Listeners (Sidebar/Shade)
        const pauseHandler = () => this.setPaused(true);
        const unpauseHandler = () => this.setPaused(false);

        this.eventBus.on('ui:sidebar:opened', pauseHandler);
        this.eventBus.on('ui:shade:opened', pauseHandler);
        this.eventBus.on('ui:sidebar:closed', unpauseHandler);
        this.eventBus.on('ui:shade:closed', unpauseHandler);

        // Add to unsubscribers
        this.unsubscribers.push(() => {
            this.eventBus.off('ui:sidebar:opened', pauseHandler);
            this.eventBus.off('ui:shade:opened', pauseHandler);
            this.eventBus.off('ui:sidebar:closed', unpauseHandler);
            this.eventBus.off('ui:shade:closed', unpauseHandler);
        });
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

        // Phase 26: Update breadcrumbs and adaptive tint
        this.updateBreadcrumbs();
        this.updateAdaptiveTint();
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

        // Phase 26: Update breadcrumbs when act changes
        this.updateBreadcrumbs();
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

        // Phase 26b: Clean up gesture state
        this.cleanupGestures();

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

    // ========================================
    // PHASE 26b: GESTURE SYSTEM (BOUGIE EDITION)
    // Swipe, long-press, double-tap, context menu
    // "Touch it like you mean it" 💎
    // ========================================

    private gestureState = {
        touchStartY: 0,
        touchStartX: 0,
        touchStartTime: 0,
        longPressTimer: null as ReturnType<typeof setTimeout> | null,
        lastTapTime: 0,
        isLongPress: false,
    };

    // Gesture thresholds
    private readonly SWIPE_THRESHOLD = 50;      // px to register as swipe
    private readonly LONG_PRESS_DELAY = 500;    // ms for long-press
    private readonly DOUBLE_TAP_DELAY = 300;    // ms between taps

    /**
     * Set up gesture handlers on the status bar
     * Tori's rule: gestures only on explicit hit zones, not whole bar
     */
    public setupGestures(): void {
        if (!this.features.enableGestures) return;

        // Touch events on status bar container
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });

        // Context menu (right-click on desktop, handled via long-press on mobile)
        this.container.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Long-press on UV7 logo for App Switcher
        const logoTrigger = this.container.querySelector('#uv7-logo-trigger');
        if (logoTrigger) {
            this.setupLogoLongPress(logoTrigger as HTMLElement);
        }

        console.log('👆 StatusBar gestures initialized');
    }

    /**
     * Handle touch start - record position and start long-press timer
     */
    private handleTouchStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        this.gestureState.touchStartX = touch.clientX;
        this.gestureState.touchStartY = touch.clientY;
        this.gestureState.touchStartTime = Date.now();
        this.gestureState.isLongPress = false;

        // Capture touch position for long-press callback
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Start long-press timer for context menu
        this.gestureState.longPressTimer = setTimeout(() => {
            this.gestureState.isLongPress = true;
            this.showQuickActionsMenu(touchX, touchY);
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
        }, this.LONG_PRESS_DELAY);
    }

    /**
     * Handle touch move - cancel long-press if moved too much
     */
    private handleTouchMove(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        const deltaX = Math.abs(touch.clientX - this.gestureState.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.gestureState.touchStartY);

        // Cancel long-press if moved more than 10px
        if (deltaX > 10 || deltaY > 10) {
            if (this.gestureState.longPressTimer) {
                clearTimeout(this.gestureState.longPressTimer);
                this.gestureState.longPressTimer = null;
            }
        }
    }

    /**
     * Handle touch end - detect swipes and double-taps
     */
    private handleTouchEnd(e: TouchEvent): void {
        // Clear long-press timer
        if (this.gestureState.longPressTimer) {
            clearTimeout(this.gestureState.longPressTimer);
            this.gestureState.longPressTimer = null;
        }

        // If it was a long-press, don't process as tap/swipe
        if (this.gestureState.isLongPress) {
            this.gestureState.isLongPress = false;
            return;
        }

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.gestureState.touchStartX;
        const deltaY = touch.clientY - this.gestureState.touchStartY;
        const elapsed = Date.now() - this.gestureState.touchStartTime;

        // Check for swipe down (on status bar = quick actions)
        if (deltaY > this.SWIPE_THRESHOLD && Math.abs(deltaX) < this.SWIPE_THRESHOLD && elapsed < 500) {
            e.preventDefault();
            this.handleSwipeDown();
            return;
        }

        // Check for double-tap (on empty space = screenshot mode)
        const now = Date.now();
        if (now - this.gestureState.lastTapTime < this.DOUBLE_TAP_DELAY) {
            // Double-tap detected
            const target = e.target as HTMLElement;
            // Only trigger on empty status bar space (not on buttons/indicators)
            if (target === this.container || target.classList.contains('status-section')) {
                e.preventDefault();
                this.toggleScreenshotMode();
                if (navigator.vibrate) navigator.vibrate(20);
            }
        }
        this.gestureState.lastTapTime = now;
    }

    /**
     * Handle swipe down on status bar - show quick actions
     */
    private handleSwipeDown(): void {
        console.log('👇 Swipe down detected - showing quick actions');

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);

        // Show quick actions menu (or emit event for NotificationShade to handle)
        this.eventBus.emit('ui:shade:toggle', {});
    }

    /**
     * Set up long-press handler specifically for UV7 logo
     * Long-press logo → App Switcher (with haptic)
     */
    private setupLogoLongPress(logo: HTMLElement): void {
        let longPressTimer: ReturnType<typeof setTimeout> | null = null;
        let isLongPress = false;

        logo.addEventListener('touchstart', () => {
            isLongPress = false;
            longPressTimer = setTimeout(async () => {
                isLongPress = true;
                // Haptic feedback pattern: short-pause-long
                if (navigator.vibrate) navigator.vibrate([20, 50, 40]);

                // Open App Switcher
                try {
                    const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
                    const appSwitcher = await initializeAppSwitcher();
                    appSwitcher.toggle();
                    console.log('🚀 Long-press → App Switcher opened');
                } catch (error) {
                    console.warn('⚠️ App Switcher failed:', error);
                }
            }, this.LONG_PRESS_DELAY);
        }, { passive: true });

        logo.addEventListener('touchend', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            // If it was a long-press, prevent the regular click
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        logo.addEventListener('touchmove', () => {
            // Cancel on move
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        }, { passive: true });
    }

    /**
     * Handle right-click context menu on status bar
     */
    private handleContextMenu(e: MouseEvent): void {
        e.preventDefault();

        const target = e.target as HTMLElement;
        const targetId = target.id || target.closest('[id]')?.id || '';

        // Build context-appropriate menu
        this.showContextMenu(e.clientX, e.clientY, targetId);
    }

    /**
     * Show context menu at position with options based on target
     */
    private showContextMenu(x: number, y: number, targetId: string): void {
        // Remove any existing context menu
        this.hideContextMenu();

        const menu = document.createElement('div');
        menu.className = 'status-bar-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 160px;
            z-index: 10001;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
            transition: all 0.15s ease;
        `;

        // Build menu items based on target
        const items = this.getContextMenuItems(targetId);
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                transition: all 0.15s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            menuItem.innerHTML = `<span style="width: 16px;">${item.icon}</span> ${item.label}`;

            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'rgba(0, 255, 255, 0.1)';
                menuItem.style.color = '#00ffff';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = '';
                menuItem.style.color = 'rgba(255, 255, 255, 0.9)';
            });
            menuItem.addEventListener('click', () => {
                item.action();
                this.hideContextMenu();
            });

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Animate in
        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'scale(1) translateY(0)';
        });

        // Close on click outside
        const closeHandler = (e: MouseEvent) => {
            if (!menu.contains(e.target as Node)) {
                this.hideContextMenu();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    }

    /**
     * Get context menu items based on what was clicked
     */
    private getContextMenuItems(targetId: string): Array<{ icon: string; label: string; action: () => void }> {
        const baseItems = [
            {
                icon: '📸',
                label: 'Screenshot Mode',
                action: () => this.toggleScreenshotMode()
            },
            {
                icon: '🔄',
                label: 'Refresh View',
                action: () => this.eventBus.emit('game:reset_view', {})
            }
        ];

        // Add context-specific items
        if (targetId === 'status-loop' || targetId.includes('loop')) {
            return [
                {
                    icon: '🔢',
                    label: `Loop v.${this.stateManager?.get('game.loopVersion') || 848}`,
                    action: () => this.pulseLoop()
                },
                {
                    icon: '📜',
                    label: 'View Loop History',
                    action: () => this.eventBus.emit('ui:backlog:toggle', {})
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-route' || targetId.includes('route')) {
            return [
                {
                    icon: '🔀',
                    label: 'Switch Route',
                    action: () => this.eventBus.emit('ui:show_route_select', {})
                },
                {
                    icon: '🏠',
                    label: 'Return to Menu',
                    action: () => this.eventBus.emit('ui:main_menu', {})
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-tether' || targetId.includes('tether')) {
            return [
                {
                    icon: '⚡',
                    label: `Tether: ${Math.round(this.tetherLevel)}%`,
                    action: () => { } // Info only
                },
                {
                    icon: '💉',
                    label: 'Boost Tether (+10)',
                    action: () => this.eventBus.emit('tether:boost', { amount: 10 })
                },
                ...baseItems
            ];
        }

        if (targetId === 'status-notes' || targetId.includes('notes')) {
            return [
                {
                    icon: '📬',
                    label: 'Open Notes',
                    action: () => this.eventBus.emit('ui:notes:open', {})
                },
                {
                    icon: '✅',
                    label: 'Mark All Read',
                    action: () => this.markAllNotesAsRead()
                },
                ...baseItems
            ];
        }

        // Default menu
        return [
            {
                icon: '🚀',
                label: 'App Switcher',
                action: async () => {
                    try {
                        const { initializeAppSwitcher } = await import('./UV7AppSwitcher');
                        const appSwitcher = await initializeAppSwitcher();
                        appSwitcher.toggle();
                    } catch (e) {
                        console.warn('App Switcher failed:', e);
                    }
                }
            },
            ...baseItems,
            {
                icon: '⚙️',
                label: 'Settings',
                action: () => this.eventBus.emit('settings:open', {})
            }
        ];
    }

    /**
     * Hide and remove context menu
     */
    private hideContextMenu(): void {
        const existing = document.querySelector('.status-bar-context-menu');
        if (existing) {
            existing.remove();
        }
    }

    /**
     * Show quick actions menu (swipe down or long-press)
     */
    private showQuickActionsMenu(x: number, y: number): void {
        console.log('⚡ Quick Actions triggered at', x, y);

        // For now, toggle the notification shade
        // In future, could show a mini quick-actions panel
        this.eventBus.emit('ui:shade:toggle', {});
    }

    /**
     * Clean up gesture state
     */
    private cleanupGestures(): void {
        if (this.gestureState.longPressTimer) {
            clearTimeout(this.gestureState.longPressTimer);
            this.gestureState.longPressTimer = null;
        }
        this.hideContextMenu();
    }
}
