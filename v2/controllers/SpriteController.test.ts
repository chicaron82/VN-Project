import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SpriteController } from './SpriteController';
import { StateManager } from '../core/StateManager';

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
    });
});
