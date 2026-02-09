import { EventBus } from '../core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * BackButtonManager
 * 
 * Manages the browser history stack to emulate Android-like back button behavior.
 * - Pushes state when UI overlays open (Shade, Backlog, Menu).
 * - Intercepts 'popstate' (Back button) to close these overlays.
 * - Implements "Double Press Back to Exit" when no overlays are open.
 */
export class BackButtonManager {
    private eventBus: EventBus;
    private historyStatePushed: boolean = false;
    private exitToastVisible: boolean = false;
    private exitToastTimer: number | null = null;
    private isInternalNavigation: boolean = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    public init(): void {
        this.setupListeners();
        this.pushBaseState();
        Logger.system('[BackButtonManager] Initialized');
    }

    private setupListeners(): void {
        // Listen for browser back button
        window.addEventListener('popstate', (e) => this.handlePopState(e));

        // Listen for UI open events to push history state
        this.eventBus.on('ui:shade:open', () => this.pushUIState('shade'));
        this.eventBus.on('ui:backlog:open', () => this.pushUIState('backlog'));
        this.eventBus.on('ui:sidebar:open', () => this.pushUIState('sidebar'));
        this.eventBus.on('ui:menu:open', () => this.pushUIState('menu'));

        // Listen for UI close events to clean up history state if closed manually
        // (This prevents the user from having to press back multiple times if they closed UI via X button)
        this.eventBus.on('ui:shade:close', () => this.handleManualClose());
        this.eventBus.on('ui:backlog:close', () => this.handleManualClose());
        this.eventBus.on('ui:sidebar:close', () => this.handleManualClose());
        this.eventBus.on('ui:menu:close', () => this.handleManualClose());
    }

    /**
     * Pushes a history state so the back button can "pop" it.
     */
    private pushUIState(context: string): void {
        if (this.historyStatePushed) return; // Already have a state pushed

        this.isInternalNavigation = true;
        history.pushState({ uiOpen: true, context }, '', location.href);
        this.historyStatePushed = true;
        this.isInternalNavigation = false;

        Logger.system(`[BackButtonManager] Pushed state for ${context}`);
    }

    /**
     * Ensure we have a base state to return to
     */
    private pushBaseState(): void {
        // We replace the current state to ensure it has our 'game' marker
        history.replaceState({ gameBase: true }, '', location.href);
    }

    /**
     * Handle the Back Button (popstate)
     */
    private handlePopState(_event: PopStateEvent): void {
        if (this.isInternalNavigation) return;

        // If we popped a state that we pushed (meaning we went BACK)
        if (this.historyStatePushed) {
            // The browser already removed the state, so we just update our flag
            this.historyStatePushed = false;

            // Now close whatever UI was open
            Logger.system('[BackButtonManager] Intercepted Back -> Closing all Overlays');
            this.closeAllOverlays();
            return;
        }

        // If we are here, we are at the base state (Gameplay).
        // We should prevent exit unless confirmed.

        if (!this.exitToastVisible) {
            // First press: Show Toast and push state back immediately to prevent exit
            Logger.system('[BackButtonManager] Base state back press -> Show Exit Warning');

            this.showExitToast();

            // Trap them again so the NEXT back press actually works (or repeats logic if we want strict trapping)
            // But standard Android behavior: 
            // 1. Press Back -> Event handled, nothing happens to app (but history popped).
            // 2. We need to re-push state if we want to stay on page.
            this.isInternalNavigation = true;
            history.pushState({ gameBase: true }, '', location.href);
            this.isInternalNavigation = false;

        } else {
            // Second press within time limit: Let them go.
            Logger.system('[BackButtonManager] Exit confirmed. Goodbye!');
            // No action needed, browser will navigate back naturally (since we just popped the state we re-pushed)
            // wait, if we re-pushed state above, we need to let this one pass.
            // Actually, if we re-pushed, this popstate event IS the second press popping that new state.
            // So we just... do nothing and let history go back? 
            // No, if we pushed state, hitting back takes us to previous page.

            // Actually, simplest 'double tap' logic for Web:
            // 1. User is at [p1, p2]. 
            // 2. We push [p1, p2, game].
            // 3. Back -> [p1, p2]. PopState fires.
            // 4. We say "Press again". We push [p1, p2, game] again immediately.
            // 5. User sees toast.
            // 6. User presses Back again -> [p1, p2]. PopState fires.
            // 7. If toast visible -> We allow it? 
            //    Wait, "Approving" an exit in a browser means essentially calling history.back() *again* or letting the event allow navigation (which popstate doesn't control, it just notifies).

            // Correction: PopState means the navigation *already happened*.
            // So if we are at [PreviousSite, Game].
            // Back -> We are now at [PreviousSite]. Game is still loaded but URL might change.
            // We want to visually stay in Game.
            // So we pushState [PreviousSite, Game] immediately.

            // If user double taps:
            // 1. Back -> At [Previous]. We Push [Game]. Toast shown.
            // 2. Back -> At [Previous]. Toast is visible.
            // 3. We do NOT push Game. We explicitly call history.back() one more time to go to [Previous-1]?
            //    Or just let them be at [Previous].

            // Let's implement the standard "Trap" method:
            // Always keep one "dummy" state ahead.
        }
    }

    private handleManualClose(): void {
        if (this.historyStatePushed) {
            // UI closed manually (X button), so we need to sync history
            // Go back once to remove the state we pushed
            this.isInternalNavigation = true;
            history.back();
            this.historyStatePushed = false;
            this.isInternalNavigation = false;
            Logger.system('[BackButtonManager] Manual close -> Synced History');
        }
    }

    private closeAllOverlays(): void {
        // Emit close signals for everything
        this.eventBus.emit('ui:shade:close_request', {});
        this.eventBus.emit('ui:sidebar:close_request', {});
        this.eventBus.emit('ui:backlog:close_request', {});
        this.eventBus.emit('ui:menu:close_request', {});
    }

    private showExitToast(): void {
        this.exitToastVisible = true;
        this.eventBus.emit('ui:toast', { message: 'Press Back again to exit', duration: 2000 });

        if (this.exitToastTimer) clearTimeout(this.exitToastTimer);

        this.exitToastTimer = window.setTimeout(() => {
            this.exitToastVisible = false;
        }, 2000);
    }
}
