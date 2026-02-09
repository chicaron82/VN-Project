import { EventBus } from '../core/EventBus';
import { MainMenu } from '../ui/screens/MainMenu';
import { RouteSelect } from '../ui/screens/RouteSelect';
import { LoopController } from './LoopController';
import { Logger } from '@utils/Logger';

type Screen = { unmount: () => void };

/**
 * NavigationController - Screen transitions and navigation
 *
 * Extracted from main.ts (~80 lines)
 *
 * Handles:
 * - clearScreen() - Unmount current screen
 * - showMainMenu() - Display main menu with loop controller wiring
 * - showRouteSelect() - Display route selection
 * - showCredits() - Trigger credits screen via EventBus
 */

export class NavigationController {
    private eventBus: EventBus;
    private loopController: LoopController;
    private app: HTMLElement;
    private currentScreen: Screen | null = null;

    constructor(eventBus: EventBus, loopController: LoopController, app: HTMLElement) {
        this.eventBus = eventBus;
        this.loopController = loopController;
        this.app = app;
    }

    /**
     * Get current screen (for gameLayout access)
     */
    public getCurrentScreen(): Screen | null {
        return this.currentScreen;
    }

    /**
     * Clear current screen and unmount
     */
    public clearScreen(): void {
        if (this.currentScreen) {
            this.currentScreen.unmount();
            this.currentScreen = null;
        }
        // Clear app container
        this.app.innerHTML = '';
    }

    /**
     * Show main menu
     */
    public showMainMenu(): void {
        this.clearScreen();
        const menu = new MainMenu(this.eventBus);
        // Wire LoopController for dynamic title/subtitle/footer updates
        menu.setLoopController(this.loopController);
        menu.mount(this.app);
        this.currentScreen = menu;
        this.eventBus.emit('ui:show_status_bar', {});
        Logger.ui('[UV7 V2] Main Menu');
    }

    /**
     * Show route selection screen
     */
    public showRouteSelect(): void {
        this.clearScreen();
        const routeSelect = new RouteSelect(this.eventBus);
        routeSelect.mount(this.app);
        this.currentScreen = routeSelect;
        Logger.ui('[UV7 V2] Route Select');
    }

    /**
     * Show credits screen (via EventBus)
     * V2: CreditsScreen component handles its own display via EventBus
     */
    public showCredits(): void {
        this.eventBus.emit('ui:show_credits', {});
        Logger.ui('[UV7 V2] Credits');
    }

    /**
     * Setup navigation event handlers
     */
    public setupNavigationHandlers(): void {
        this.eventBus.on('ui:route_select', () => this.showRouteSelect());
        this.eventBus.on('ui:main_menu', () => this.showMainMenu());
        this.eventBus.on('ui:credits', () => this.showCredits());
        this.eventBus.on('ui:settings', () => this.eventBus.emit('settings:open', {}));
    }
}
