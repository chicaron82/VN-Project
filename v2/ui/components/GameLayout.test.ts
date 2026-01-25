import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameLayout } from './GameLayout';
import { EventBus } from '@core/EventBus';

const mockstring = {} as any;

const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

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
