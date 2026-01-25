import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MenuController } from './MenuController';

// Mock RetryScreen
vi.mock('@ui/screens/RetryScreen', () => ({
    RetryScreen: vi.fn().mockImplementation(() => ({
        show: vi.fn(),
        hide: vi.fn(),
        mount: vi.fn(),
        container: { style: {} }
    }))
}));

// Mock DOM
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
// Use spyOn for body.appendChild
if (global.document && global.document.body) {
    vi.spyOn(global.document.body, 'appendChild').mockImplementation(vi.fn());
} else {
    // If body doesn't exist (rare), recreate safe mock or ignore
    // Usually jsdom has body.
}

// Mock StateManager
const mockStateManager = {
    set: vi.fn(),
    get: vi.fn()
};

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('MenuController', () => {
    let instance: MenuController;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new MenuController(mockStateManager as any, mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show menu and set state', () => {
            instance = new MenuController(mockStateManager as any, mockEventBus as any);
            instance.showMenu('main');

            expect(mockStateManager.set).toHaveBeenCalledWith('ui.activeScreen', 'main');
            expect(mockEventBus.emit).toHaveBeenCalledWith('ui:screen_change', { screen: 'main' });
        });

        it('should handle retry screen', () => {
            instance = new MenuController(mockStateManager as any, mockEventBus as any);
            instance.showMenu('retry');

            expect(mockStateManager.set).toHaveBeenCalledWith('ui.activeScreen', 'retry');
        });

        it('should handle event subscription', () => {
            instance = new MenuController(mockStateManager as any, mockEventBus as any);
            // Verify binding
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:show_retry_screen', expect.any(Function));
        });
    });
});
