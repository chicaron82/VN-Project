import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MenuController } from './MenuController';
import { EffectsController } from './EffectsController';
import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';

describe('MenuController', () => {
    let controller: MenuController;
    let stateManager: StateManager;
    let eventBus: EventBus;

    beforeEach(() => {
        stateManager = new StateManager();
        eventBus = new EventBus();
        controller = new MenuController(stateManager, eventBus);
    });

    it('should switch screens and update state', () => {
        const spy = vi.spyOn(eventBus, 'emit');

        controller.showMenu('settings');
        expect(stateManager.get('ui.activeScreen')).toBe('settings');
        expect(spy).toHaveBeenCalledWith('ui:screen_change', { screen: 'settings' });
    });

    it('should cleanup view when showing main menu', () => {
        const spy = vi.spyOn(eventBus, 'emit');

        controller.showMainMenu();
        expect(stateManager.get('game.currentRoute')).toBe('none');
        expect(spy).toHaveBeenCalledWith('game:reset_view', {});
    });

    it('should show retry screen on event', () => {
        const spy = vi.spyOn(eventBus, 'emit');
        // Mock DOM for mount check
        const bodyAppendSpy = vi.spyOn(document.body, 'appendChild');

        eventBus.emit('ui:show_retry_screen', { currentRoute: 'ronnie', loopVersion: 849 });

        expect(stateManager.get('ui.activeScreen')).toBe('retry');
        expect(spy).toHaveBeenCalledWith('ui:screen_change', { screen: 'retry' });
        expect(bodyAppendSpy).toHaveBeenCalled(); // Verifies mount was called
    });
});

describe('EffectsController', () => {
    let controller: EffectsController;
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
        controller = new EffectsController(eventBus);
    });

    it('should emit effect events', () => {
        const spy = vi.spyOn(eventBus, 'emit');

        controller.triggerGlitch(0.8);
        expect(spy).toHaveBeenCalledWith('effect:glitch', { intensity: 0.8 });

        controller.triggerCodeRain();
        expect(spy).toHaveBeenCalledWith('effect:code_rain', { duration: 1500 });
    });
});
