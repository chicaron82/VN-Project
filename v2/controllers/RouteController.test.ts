import { RouteController } from './RouteController';
import type { GameEngine } from '@core/GameEngine';
import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';

describe('RouteController', () => {
    let routeController: RouteController;
    let engine: GameEngine;
    let stateManager: StateManager;
    let eventBus: EventBus;

    beforeEach(() => {
        // Mocks
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn()
        });

        eventBus = new EventBus();
        stateManager = new StateManager();
        // Partially mock engine
        engine = {
            loadScene: vi.fn()
        } as any;

        routeController = new RouteController(engine, stateManager, eventBus);
    });

    it('should start prologue normally by default', () => {
        routeController.startStory();
        expect(engine.loadScene).toHaveBeenCalledWith('prologue_start');
        expect(stateManager.get('currentRoute')).toBe('prologue');
    });

    it('should autoskip prologue if unlocked and enabled', () => {
        (localStorage.getItem as any).mockReturnValue('true'); // unlocked
        stateManager.set('settings', { autoSkipPrologue: true });

        const emitSpy = vi.spyOn(eventBus, 'emit');
        routeController.startStory();

        expect(emitSpy).toHaveBeenCalledWith('ui:show_route_select', expect.anything());
        expect(stateManager.get('flags.prologueSkipped')).toBe(true);
    });

    it('should select route and load start scene', () => {
        routeController.selectRoute('ronnie');
        expect(stateManager.get('currentRoute')).toBe('ronnie');
        expect(stateManager.get('points.ronnie')).toBe(0);
        expect(engine.loadScene).toHaveBeenCalledWith('ronnie_start');
    });

    it('should track points for current route', () => {
        routeController.selectRoute('tori');
        routeController.addPoints(5);
        expect(stateManager.get('points.tori')).toBe(5);

        routeController.addPoints(3);
        expect(stateManager.get('points.tori')).toBe(8);
    });
    describe('Endings and Retries', () => {
        it('should trigger Epilogue when True Route ends', () => {
            routeController.handleSceneEnd('trueRoute_final');
            expect(engine.loadScene).toHaveBeenCalledWith('epilogue_start');
        });

        it('should emit retry screen event on Bad Route end', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');
            stateManager.set('game.loopVersion', 848);
            stateManager.set('currentRoute', 'ronnie');

            routeController.handleSceneEnd('badRoute_retry');

            expect(stateManager.get('game.loopVersion')).toBe(849);
            expect(emitSpy).toHaveBeenCalledWith('ui:show_retry_screen', {
                currentRoute: 'ronnie',
                loopVersion: 849
            });
        });

        it('should trigger credits on Epilogue end', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');
            routeController.handleSceneEnd('epilogue_knowing');
            expect(emitSpy).toHaveBeenCalledWith('ui:show_credits', {});
        });

        it('should restart route from handleRetryChoice', () => {
            stateManager.set('currentRoute', 'ronnie');
            routeController.handleRetryChoice('restart_route');
            expect(engine.loadScene).toHaveBeenCalledWith('ronnie_start');
        });

        it('should switch perspective from handleRetryChoice', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');
            routeController.handleRetryChoice('change_perspective');
            expect(emitSpy).toHaveBeenCalledWith('ui:show_route_select', {});
        });
    });
});
