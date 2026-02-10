import type { StateManager } from '@core/StateManager';
import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

import { RetryScreen } from '@ui/screens/RetryScreen';
// import { RouteSelect } from '@ui/screens/RouteSelect';

export type MenuScreen = 'none' | 'splash' | 'main' | 'route_select' | 'pause' | 'settings' | 'credits' | 'save_load' | 'retry';

export class MenuController {
    private stateManager: StateManager;
    private eventBus: EventBus;

    private retryScreen: RetryScreen;
    // private routeSelect: RouteSelect; // Not fully integrated yet in this file

    constructor(stateManager: StateManager, eventBus: EventBus) {
        this.stateManager = stateManager;
        this.eventBus = eventBus;

        this.retryScreen = new RetryScreen(eventBus);

        // Listen for internal UI requests
        this.bindEvents();
    }

    private bindEvents(): void {
        this.eventBus.on('ui:show_retry_screen', (data: { currentRoute: string; loopVersion: number }) => {
            this.retryScreen.show({
                currentRoute: data.currentRoute,
                loopVersion: data.loopVersion
            });
            this.showMenu('retry');
        });

        this.eventBus.on('ui:show_route_select', () => {
            // For now, let's assume RouteSelect is handled elsewhere or we add it here
            this.showMenu('route_select');
        });
    }

    showMenu(screen: MenuScreen): void {
        this.stateManager.set('ui.activeScreen', screen);

        // V1 Logic: Cleanup when entering main menu
        if (screen === 'main') {
            this.resetGameView();
        }

        // Screen Management Logic
        if (screen === 'retry') {
            if (!document.getElementById('retry-screen')) {
                this.retryScreen.mount(document.body); // Mount to body for now
            }
            // retryScreen.show() is called by the event handler event, but if called directly:
            // this.retryScreen.container.style.display = 'flex'; 
        } else {
            this.retryScreen.hide();
        }

        this.eventBus.emit('ui:screen_change', { screen });
        Logger.ui(`🖥️ UI Screen: ${screen}`);
    }

    /**
     * Submit a secret code from the UI
     */
    submitCode(code: string): void {
        this.eventBus.emit('ui:code_submit', { code });
    }

    /**
     * Helper to show specific screens
     */
    showMainMenu(): void { this.showMenu('main'); }
    showRouteSelect(): void { this.showMenu('route_select'); }
    showPauseMenu(): void { this.showMenu('pause'); }
    hidePauseMenu(): void {
        // Resume game view (assuming 'none' means overlay handles it or back to 'none' overlay)
        this.showMenu('none');
    }

    /**
     * Reset game view state (V1 logic)
     */
    private resetGameView(): void {
        // V1 MenuController.showMainMenu() cleared sprites, backgrounds etc.
        // Here we just set state flags, UI layer will react.
        this.stateManager.set('game.currentRoute', 'none');
        // Note: We might need to explicit trigger sprite clearing via GameEngine event
        this.eventBus.emit('game:reset_view', {});
    }
}
