import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutoSaveIndicator } from './AutoSaveIndicator';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), replace: vi.fn() },
    querySelector: vi.fn().mockReturnValue({ textContent: '' }),
    remove: vi.fn()
};
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('AutoSaveIndicator', () => {
    let instance: AutoSaveIndicator;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new AutoSaveIndicator(mockEventBus as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show saving state', () => {
            instance = new AutoSaveIndicator(mockEventBus as any);
            instance.show('Saving...');
            expect(mockElement.classList.remove).toHaveBeenCalled();
            expect(mockElement.classList.add).toHaveBeenCalledWith('visible', 'saving');
        });

        it('should show success state', () => {
            instance = new AutoSaveIndicator(mockEventBus as any);
            instance.showSuccess('Saved!');
            expect(mockElement.classList.add).toHaveBeenCalledWith('visible', 'success');

            // Advance for hide
            vi.advanceTimersByTime(2000);
            expect(mockElement.classList.add).toHaveBeenCalledWith('hidden');
        });
    });
});
