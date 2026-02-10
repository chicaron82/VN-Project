import { DialogController } from './DialogController';
import type { SettingsSystem } from '@systems/SettingsSystem';
import { EventBus } from '@core/EventBus';

describe('DialogController', () => {
    let controller: DialogController;
    let settings: SettingsSystem;
    let eventBus: EventBus;

    beforeEach(() => {
        vi.useFakeTimers();

        // Mocks
        const _stateManagerMock = { get: () => 30 } as any;
        settings = { get: () => 30 } as any;
        eventBus = new EventBus();

        controller = new DialogController(settings, eventBus);
    });

    afterEach(() => {
        vi.useRealTimers();
        controller.destroy();
    });

    it('should type text character by character', () => {
        const updateSpy = vi.fn();
        controller.onTextUpdate(updateSpy);

        controller.show('Hello');

        expect(updateSpy).toHaveBeenCalledWith('H');

        vi.advanceTimersByTime(30);
        expect(updateSpy).toHaveBeenCalledWith('He');

        vi.advanceTimersByTime(30);
        expect(updateSpy).toHaveBeenCalledWith('Hel');
    });

    it('should emit completion event when done', () => {
        const completeSpy = vi.fn();
        eventBus.on('dialog:complete', completeSpy);

        controller.show('Hi');
        vi.runAllTimers();

        expect(completeSpy).toHaveBeenCalled();
    });

    it('should skip typing when skip() is called', () => {
        const updateSpy = vi.fn();
        controller.onTextUpdate(updateSpy);

        controller.show('Long text here');
        controller.skip();

        expect(updateSpy).toHaveBeenLastCalledWith('Long text here');
    });

    it('scrolls or advances on click', () => {
        // 1. Click while typing -> Skip
        controller.show('Text');
        controller.handleClick();
        // Should be complete now

        // 2. Click while complete -> Advance
        const advanceSpy = vi.fn();
        eventBus.on('dialog:advance', advanceSpy);

        controller.handleClick();
        expect(advanceSpy).toHaveBeenCalled();
    });
});
