import { SpriteController } from './SpriteController';
import type { StateManager } from '../core/StateManager';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn().mockReturnValue([]),
    remove: vi.fn()
};
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement, style: {} }); // Return new object
(global as any).requestAnimationFrame = vi.fn().mockImplementation(cb => cb());

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock StateManager
const mockStateManager = {
    get: vi.fn(),
    set: vi.fn()
} as unknown as StateManager;

describe('SpriteController', () => {
    let instance: SpriteController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new SpriteController(mockEventBus as any, mockStateManager);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show sprite', () => {
            instance = new SpriteController(mockEventBus as any, mockStateManager);

            // Setup viewport mock
            const viewport = { ...mockElement } as any;
            instance.setViewport(viewport);

            // Mock querySelector to return null initially (creating new sprite)
            viewport.querySelector = vi.fn().mockReturnValue(null);

            instance.showSprite('left', 'image.png');

            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(viewport.appendChild).toHaveBeenCalled();
            expect(instance.getState().left).toBe('image.png');
        });

        it('should hide sprite', () => {
            instance = new SpriteController(mockEventBus as any, mockStateManager);
            const viewport = { ...mockElement } as any;
            instance.setViewport(viewport);

            // Mock existing sprite
            const sprite = { style: {}, remove: vi.fn() } as any;
            viewport.querySelector = vi.fn().mockReturnValue(sprite);

            instance.hideSprite('left');
            expect(sprite.style.opacity).toBe('0');
            // Timeout not tested here directly unless using fake timers, but state should update
            expect(instance.getState().left).toBeNull();
        });

        it('should not set inline positioning on new sprites (CSS owns layout)', () => {
            instance = new SpriteController(mockEventBus as any, mockStateManager);
            const viewport = { ...mockElement } as any;
            instance.setViewport(viewport);
            viewport.querySelector = vi.fn().mockReturnValue(null);

            // Capture the created element
            const createdSprite = { ...mockElement, style: {} as any, className: '' };
            (document.createElement as ReturnType<typeof vi.fn>).mockReturnValue(createdSprite);

            instance.showSprite('left', 'image.png');

            // Should set className for CSS to handle positioning
            expect(createdSprite.className).toBe('character-sprite sprite-left');
            // Should only set backgroundImage and opacity — no cssText block
            expect(createdSprite.style.backgroundImage).toBe("url('image.png')");
            expect(createdSprite.style.cssText).toBeUndefined();
        });
    });

    describe('Echo Group', () => {
        it('should display echo group with CSS classes only', () => {
            instance = new SpriteController(mockEventBus as any, mockStateManager);
            const viewport = { ...mockElement } as any;
            instance.setViewport(viewport);
            viewport.querySelector = vi.fn().mockReturnValue(null);

            const createdElements: any[] = [];
            (document.createElement as ReturnType<typeof vi.fn>).mockImplementation(() => {
                const el = {
                    ...mockElement,
                    style: {} as any,
                    id: '',
                    className: '',
                    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
                    appendChild: vi.fn(),
                    querySelector: vi.fn().mockReturnValue(null),
                };
                createdElements.push(el);
                return el;
            });

            instance.displayEchoGroup();

            // Container should use className, not cssText
            const container = createdElements[0];
            expect(container.className).toBe('echo-group');
            expect(container.id).toBe('echo-group');
            expect(container.style.cssText).toBeUndefined();

            // Echo sprites should only have backgroundImage, no cssText
            const echoSprites = createdElements.slice(1);
            expect(echoSprites).toHaveLength(3);
            echoSprites.forEach(sprite => {
                expect(sprite.className).toBe('echo-sprite');
                expect(sprite.style.cssText).toBeUndefined();
                expect(sprite.style.backgroundImage).toBeDefined();
            });

            expect(instance.isEchoGroupActive()).toBe(true);
        });

        it('should set echo growth stage via CSS class only', () => {
            instance = new SpriteController(mockEventBus as any, mockStateManager);
            const viewport = { ...mockElement } as any;
            instance.setViewport(viewport);

            // Mock echo group exists
            const echoGroupEl = {
                classList: { add: vi.fn(), remove: vi.fn() },
                querySelector: vi.fn().mockReturnValue(null),
            };
            viewport.querySelector = vi.fn().mockReturnValue(echoGroupEl);

            instance.setEchoGrowthStage('act2');

            // Should remove old classes and add new one
            expect(echoGroupEl.classList.remove).toHaveBeenCalledWith(
                'echo-growth-act1', 'echo-growth-act2', 'echo-growth-act3'
            );
            expect(echoGroupEl.classList.add).toHaveBeenCalledWith('echo-growth-act2');
        });
    });
});
