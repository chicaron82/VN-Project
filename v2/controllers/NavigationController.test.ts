/**
 * NavigationController Tests
 * Tests for screen transitions and navigation
 */
import { NavigationController } from './NavigationController';

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { ui: vi.fn(), system: vi.fn() }
}));

// Mock screens
vi.mock('../ui/screens/MainMenu', () => ({
    MainMenu: vi.fn().mockImplementation(() => ({
        mount: vi.fn(),
        unmount: vi.fn(),
        setLoopController: vi.fn(),
    }))
}));

vi.mock('../ui/screens/RouteSelect', () => ({
    RouteSelect: vi.fn().mockImplementation(() => ({
        mount: vi.fn(),
        unmount: vi.fn(),
    }))
}));

describe('NavigationController', () => {
    let eventBus: any;
    let loopController: any;
    let app: HTMLElement;
    let nav: NavigationController;

    beforeEach(() => {
        eventBus = {
            on: vi.fn(),
            emit: vi.fn(),
        };
        loopController = {
            getLoopVersion: vi.fn().mockReturnValue(848),
        };
        app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);

        nav = new NavigationController(eventBus, loopController, app);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should start with no current screen', () => {
        expect(nav.getCurrentScreen()).toBeNull();
    });

    it('should clear app container on clearScreen', () => {
        app.innerHTML = '<div>Some content</div>';
        nav.clearScreen();
        expect(app.innerHTML).toBe('');
    });

    it('should unmount current screen on clearScreen', () => {
        const mockUnmount = vi.fn();
        // Manually set a screen with unmount
        (nav as any).currentScreen = { unmount: mockUnmount };

        nav.clearScreen();
        expect(mockUnmount).toHaveBeenCalled();
        expect(nav.getCurrentScreen()).toBeNull();
    });

    it('should show main menu and emit status bar event', () => {
        nav.showMainMenu();

        expect(eventBus.emit).toHaveBeenCalledWith('ui:show_status_bar', {});
        expect(nav.getCurrentScreen()).not.toBeNull();
    });

    it('should show route select screen', () => {
        nav.showRouteSelect();
        expect(nav.getCurrentScreen()).not.toBeNull();
    });

    it('should show credits via EventBus', () => {
        nav.showCredits();
        expect(eventBus.emit).toHaveBeenCalledWith('ui:show_credits', {});
    });

    it('should clear previous screen when showing new screen', () => {
        const mockUnmount = vi.fn();
        (nav as any).currentScreen = { unmount: mockUnmount };

        nav.showMainMenu();
        expect(mockUnmount).toHaveBeenCalled();
    });

    it('should register event handlers for navigation', () => {
        nav.setupNavigationHandlers();

        expect(eventBus.on).toHaveBeenCalledWith('ui:route_select', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('ui:main_menu', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('ui:credits', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('ui:settings', expect.any(Function));
    });

    it('should handle settings via EventBus forwarding', () => {
        nav.setupNavigationHandlers();

        // Find the settings handler
        const settingsCall = eventBus.on.mock.calls.find(
            (call: any[]) => call[0] === 'ui:settings'
        );
        expect(settingsCall).toBeDefined();

        // Call the handler
        settingsCall[1]();
        expect(eventBus.emit).toHaveBeenCalledWith('settings:open', {});
    });
});
