import { MacroRunner } from './MacroRunner';
import { EventBus } from './EventBus';
import { StateManager } from './StateManager';

describe('MacroRunner', () => {
    let macroRunner: MacroRunner;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let telemetry: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; download: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager();
        telemetry = {
            start: vi.fn(),
            stop: vi.fn(),
            download: vi.fn()
        };
        macroRunner = new MacroRunner(eventBus, stateManager, telemetry as any);
        document.body.innerHTML = '';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ========================================
    // BASIC EXECUTION
    // ========================================

    describe('Basic Execution', () => {
        it('should fetch and execute a macro file', async () => {
            const steps = [
                { id: 'step1', action: 'wait', ms: 10, desc: 'wait a bit' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            await macroRunner.run('/test-macro.json');

            expect(fetch).toHaveBeenCalledWith('/test-macro.json');
            expect(telemetry.start).toHaveBeenCalled();
            expect(telemetry.stop).toHaveBeenCalled();
            expect(telemetry.download).toHaveBeenCalled();
        });

        it('should execute wait steps', async () => {
            const steps = [
                { id: 'wait-step', action: 'wait', ms: 50 }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            const start = Date.now();
            await macroRunner.run('/test.json');
            const elapsed = Date.now() - start;

            // Should have waited at least ~50ms
            expect(elapsed).toBeGreaterThanOrEqual(40);
        });

        it('should execute click steps on DOM elements', async () => {
            const btn = document.createElement('button');
            btn.id = 'test-btn';
            const clickHandler = vi.fn();
            btn.addEventListener('click', clickHandler);
            document.body.appendChild(btn);

            const steps = [
                { id: 'click-step', action: 'click', selector: '#test-btn' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            await macroRunner.run('/test.json');
            expect(clickHandler).toHaveBeenCalled();
        });

        it('should click viewport via dialog-box', async () => {
            const dialogBox = document.createElement('div');
            dialogBox.id = 'dialog-box';
            const clickHandler = vi.fn();
            dialogBox.addEventListener('click', clickHandler);
            document.body.appendChild(dialogBox);

            const steps = [
                { id: 'viewport', action: 'click_viewport' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            await macroRunner.run('/test.json');
            expect(clickHandler).toHaveBeenCalled();
        });
    });

    // ========================================
    // CONCURRENT RUN PREVENTION
    // ========================================

    describe('Concurrency', () => {
        it('should prevent concurrent runs', async () => {
            const steps = [{ id: 's1', action: 'wait', ms: 100 }];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            // Start first run
            const run1 = macroRunner.run('/test.json');
            // Try second run immediately
            const run2 = macroRunner.run('/test2.json');

            await Promise.all([run1, run2]);

            // fetch should only have been called once (second run was rejected)
            expect(fetch).toHaveBeenCalledTimes(1);
        });
    });

    // ========================================
    // ERROR HANDLING
    // ========================================

    describe('Error Handling', () => {
        it('should stop telemetry on fetch error', async () => {
            vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

            await macroRunner.run('/bad-url.json');

            expect(telemetry.stop).toHaveBeenCalled();
            // Should not have called download on error
            expect(telemetry.download).not.toHaveBeenCalled();
        });

        it('should allow running again after error', async () => {
            vi.stubGlobal('fetch', vi.fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValueOnce({
                    json: () => Promise.resolve([{ id: 's1', action: 'wait', ms: 10 }])
                })
            );

            await macroRunner.run('/first.json');
            await macroRunner.run('/second.json');

            expect(fetch).toHaveBeenCalledTimes(2);
        });

        it('should handle missing click selector gracefully', async () => {
            const steps = [
                { id: 'click-missing', action: 'click', selector: '#nonexistent' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            // Should not throw
            await expect(macroRunner.run('/test.json')).resolves.not.toThrow();
        });
    });

    // ========================================
    // ROUTE START
    // ========================================

    describe('Route Start', () => {
        it('should click route button if DOM element exists', async () => {
            const btn = document.createElement('button');
            btn.setAttribute('data-route', 'ronnie');
            const clickHandler = vi.fn();
            btn.addEventListener('click', clickHandler);
            document.body.appendChild(btn);

            const steps = [
                { id: 'route', action: 'click_route_start', route: 'ronnie' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            await macroRunner.run('/test.json');
            expect(clickHandler).toHaveBeenCalled();
        });

        it('should emit ui:start_game as fallback when button not in DOM', async () => {
            const spy = vi.fn();
            eventBus.on('ui:start_game', spy);

            const steps = [
                { id: 'route', action: 'click_route_start', route: 'tori' }
            ];

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
                json: () => Promise.resolve(steps)
            }));

            await macroRunner.run('/test.json');
            expect(spy).toHaveBeenCalledWith({ route: 'tori' });
        });
    });
});
