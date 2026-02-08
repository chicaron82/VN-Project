// ========================================
// STATUS BAR WIRING
// EventBus listeners, StateManager subscriptions, UI handler setup
//
// Extracted from StatusBar.ts (lines 423-427, 567-798)
//
// 848 is sacred. 💚🔥💀
// ========================================

import type { EventBus } from '../../../core/EventBus';
import type { StateManager } from '../../../core/StateManager';
import type { StatusBarElementRefs } from './StatusBarDOM';
import { StatusBarAppSwitcherPreview } from '../StatusBarAppSwitcherPreview';

/**
 * Callback contract for wiring to communicate with the orchestrator.
 */
export interface StatusBarWiringCallbacks {
    setRoute(route: 'ronnie' | 'tori' | 'menu' | 'prologue'): void;
    setNotesCollected(count: number): void;
    setTetherLevel(level: number): void;
    setAutoIndicator(enabled: boolean): void;
    setPaused(paused: boolean): void;
    pulseNotes(): void;
    show(): void;
    hide(): void;
    updateActFromScene(sceneId: string): void;
    updateBreadcrumbs(): void;
}

/**
 * StatusBarWiring
 *
 * Sets up all event listeners, state subscriptions, and UI handler
 * wiring for the status bar. Returns unsubscribers for cleanup.
 */
export class StatusBarWiring {
    private unsubscribers: (() => void)[] = [];
    private idleTimer: ReturnType<typeof setTimeout> | null = null;
    private idleDelay: number = 3000;
    private appSwitcherPreview!: StatusBarAppSwitcherPreview;

    constructor(
        private refs: StatusBarElementRefs,
        private eventBus: EventBus,
        private stateManager: StateManager | null,
        private callbacks: StatusBarWiringCallbacks
    ) {}

    // ========================================
    // UI HANDLER SETUP
    // ========================================

    /**
     * Set up theme toggle for Showcase
     */
    setupStoryDevToggle(): void {
        if (!this.refs.storyDevToggleEl) return;

        import('../../../../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
            const themeManager = getThemeManager();
            const currentTheme = themeManager.getState().mode;

            this.refs.storyDevToggleEl.innerHTML = currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light';

            this.refs.storyDevToggleEl.addEventListener('click', () => {
                themeManager.toggle();
                const newTheme = themeManager.getState().mode;
                this.refs.storyDevToggleEl.innerHTML = newTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
                if (navigator.vibrate) navigator.vibrate(10);
                console.log(`🎨 Theme: ${newTheme}`);
            });

            this.refs.storyDevToggleEl.addEventListener('mouseenter', () => {
                this.refs.storyDevToggleEl.style.transform = 'scale(1.05)';
                this.refs.storyDevToggleEl.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            this.refs.storyDevToggleEl.addEventListener('mouseleave', () => {
                this.refs.storyDevToggleEl.style.transform = '';
                this.refs.storyDevToggleEl.style.background = 'rgba(255, 255, 255, 0.1)';
            });
        }).catch(err => {
            console.warn('[StatusBar] Could not load ThemeManager for toggle:', err);
        });
    }

    /**
     * Set up Settings Cog handler
     */
    setupSettingsHandler(): void {
        this.refs.settingsEl.addEventListener('click', () => {
            console.log('⚙️ Settings Cog clicked');
            if (navigator.vibrate) navigator.vibrate(10);
            this.eventBus.emit('ui:settings:toggle', {});

            const currentRotation = this.refs.settingsEl.style.transform === 'rotate(90deg)' ? 'rotate(180deg)' : 'rotate(90deg)';
            this.refs.settingsEl.style.transform = currentRotation;
        });

        this.refs.settingsEl.style.transition = 'transform 0.3s ease';
    }

    /**
     * DIZEE: Set up mail icon click handler (V1 parity)
     */
    setupMailIconHandler(): void {
        if (this.refs.mailEl) {
            this.refs.mailEl.addEventListener('click', () => {
                if (navigator.vibrate) navigator.vibrate(20);
                this.eventBus.emit('ui:sidebar:open', {});
                this.eventBus.emit('ui:notes:open', {});
            });
        }
    }

    // ========================================
    // EVENT BUS LISTENERS
    // ========================================

    setupEventListeners(): void {
        const cb = this.callbacks;

        const unsubRoute = this.eventBus.on('ui:route_changed', (data) => {
            cb.setRoute(data.route as 'ronnie' | 'tori' | 'menu' | 'prologue');
        });
        this.unsubscribers.push(unsubRoute);

        const unsubNote = this.eventBus.on('note:collected', (data) => {
            cb.setNotesCollected(data.count);
            cb.pulseNotes();
        });
        this.unsubscribers.push(unsubNote);

        const unsubTether = this.eventBus.on('tether:change', (data) => {
            cb.setTetherLevel(data.level);
        });
        this.unsubscribers.push(unsubTether);

        const unsubScene = this.eventBus.on('scene:load', (data) => {
            cb.updateActFromScene(data.sceneId);
        });
        this.unsubscribers.push(unsubScene);

        const unsubShow = this.eventBus.on('ui:show_status_bar', () => cb.show());
        const unsubHide = this.eventBus.on('ui:hide_status_bar', () => cb.hide());
        this.unsubscribers.push(unsubShow, unsubHide);

        const unsubStatus = this.eventBus.on('ui:status_update', (data) => {
            if (this.refs.phaseEl) {
                this.refs.phaseEl.textContent = data.context;
            } else if (this.refs.routeEl) {
                this.refs.routeEl.textContent = data.context;
            }
        });
        this.unsubscribers.push(unsubStatus);

        const unsubSettings = this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'autoAdvance') {
                cb.setAutoIndicator(Boolean(data.value));
            }
        });
        this.unsubscribers.push(unsubSettings);

        const pauseHandler = () => cb.setPaused(true);
        const unpauseHandler = () => cb.setPaused(false);

        this.eventBus.on('ui:sidebar:opened', pauseHandler);
        this.eventBus.on('ui:shade:opened', pauseHandler);
        this.eventBus.on('ui:sidebar:closed', unpauseHandler);
        this.eventBus.on('ui:shade:closed', unpauseHandler);

        this.unsubscribers.push(() => {
            this.eventBus.off('ui:sidebar:opened', pauseHandler);
            this.eventBus.off('ui:shade:opened', pauseHandler);
            this.eventBus.off('ui:sidebar:closed', unpauseHandler);
            this.eventBus.off('ui:shade:closed', unpauseHandler);
        });
    }

    // ========================================
    // STATE SUBSCRIPTIONS
    // ========================================

    setupStateSubscriptions(): void {
        if (!this.stateManager) return;

        const cb = this.callbacks;

        const unsubTether = this.stateManager.subscribe('tether.level', (newLevel) => {
            if (typeof newLevel === 'number') cb.setTetherLevel(newLevel);
        });
        this.unsubscribers.push(unsubTether);

        const unsubRoute = this.stateManager.subscribe('game.currentRoute', (route) => {
            if (typeof route === 'string') cb.setRoute(route as 'ronnie' | 'tori' | 'menu' | 'prologue');
        });
        this.unsubscribers.push(unsubRoute);

        const unsubNotes = this.stateManager.subscribe('notes.collected', (count) => {
            if (typeof count === 'number') cb.setNotesCollected(count);
        });
        this.unsubscribers.push(unsubNotes);
    }

    /**
     * Load initial state from StateManager
     */
    loadInitialState(): void {
        if (!this.stateManager) return;

        const cb = this.callbacks;

        const route = this.stateManager.get<string>('game.currentRoute');
        if (route) cb.setRoute(route as 'ronnie' | 'tori' | 'menu' | 'prologue');

        const tetherLevel = this.stateManager.get<number>('tether.level');
        if (typeof tetherLevel === 'number') cb.setTetherLevel(tetherLevel);

        const notesCollected = this.stateManager.get<number>('notes.collected');
        if (typeof notesCollected === 'number') cb.setNotesCollected(notesCollected);

        const autoAdvance = this.stateManager.get<boolean>('settings.autoAdvance');
        cb.setAutoIndicator(!!autoAdvance);
    }

    // ========================================
    // IDLE TIMER
    // ========================================

    setupIdleTimer(): void {
        const resetIdle = () => this.resetIdleTimer();
        document.addEventListener('mousemove', resetIdle);
        document.addEventListener('touchstart', resetIdle);
        document.addEventListener('keydown', resetIdle);
        this.resetIdleTimer();
    }

    private resetIdleTimer(): void {
        if (this.idleTimer) clearTimeout(this.idleTimer);

        this.refs.container.classList.remove('idle');

        this.idleTimer = setTimeout(() => {
            this.refs.container.classList.add('idle');
        }, this.idleDelay);
    }

    // ========================================
    // APP SWITCHER
    // ========================================

    async setupAppSwitcher(): Promise<void> {
        this.appSwitcherPreview = new StatusBarAppSwitcherPreview();
        const logoTrigger = document.getElementById('uv7-logo-trigger');
        await this.appSwitcherPreview.setup(logoTrigger);
    }

    // ========================================
    // CLEANUP
    // ========================================

    getUnsubscribers(): (() => void)[] {
        return this.unsubscribers;
    }

    clearIdleTimer(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
    }

    cleanupAppSwitcher(): void {
        this.appSwitcherPreview?.cleanup();
    }
}
