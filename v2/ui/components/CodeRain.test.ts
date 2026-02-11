import { CodeRain } from './CodeRain';


describe('CodeRain', () => {
    let container: HTMLElement;
    let mockContext: any;

    beforeEach(() => {
        container = document.createElement('div');

        // Mock Canvas Context
        mockContext = {
            fillRect: vi.fn(),
            fillText: vi.fn(),
            clearRect: vi.fn(),
            font: '',
            fillStyle: '',
        };

        // Mock getContext on the prototype to capture the context creation
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as any);

        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create canvas and append to container', () => {
        new CodeRain(container);
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeTruthy();
        expect(canvas?.style.display).toBe('block');
    });

    it('should start animation loop', () => {
        vi.useFakeTimers();
        const rain = new CodeRain(container);

        rain.start();

        // Verify setInterval called
        // Note: we can't easily spy on window.setInterval without more setup, 
        // but we can check if draw logic runs by advancing timers
        vi.advanceTimersByTime(100);

        // Check if context methods were called (indicating draw loop is running)
        expect(mockContext.fillStyle).toBeTruthy();
        expect(mockContext.fillRect).toHaveBeenCalled();
        expect(mockContext.fillText).toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('should handle resize', () => {
        new CodeRain(container);

        // Trigger resize
        window.dispatchEvent(new Event('resize'));

        // Should re-fill canvas with black
        expect(mockContext.fillRect).toHaveBeenCalled();
        expect(mockContext.fillStyle).toBe('#000');
    });

    it('should cleanup on destroy', () => {
        const rain = new CodeRain(container);
        rain.start();

        const removeSpy = vi.spyOn(window, 'removeEventListener');
        rain.destroy();

        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        expect(container.querySelector('canvas')).toBeNull();
    });
});
