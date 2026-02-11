import { GameLayout } from './GameLayout';
import { EventBus } from '@core/EventBus';



describe('GameLayout', () => {
    let eventBus: EventBus;

    beforeEach(() => {
        // Setup generic DOM
        document.body.innerHTML = '<div id="app"></div>';
        eventBus = new EventBus();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should mount layout to the requested container', () => {
        new GameLayout('app', eventBus);

        expect(document.querySelector('.game-layout')).toBeTruthy();
        expect(document.querySelector('.game-viewport')).toBeTruthy();
        expect(document.querySelector('.dialog-box')).toBeTruthy();
    });
});
