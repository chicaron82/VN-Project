import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EndingDialogController } from './EndingDialogController';
import { EventBus } from '../core/EventBus';
import { Logger } from '@utils/Logger';

describe('EndingDialogController', () => {
    let controller: EndingDialogController;
    let eventBus: EventBus;
    let mockDialog: HTMLElement;
    let mockRetryBtn: HTMLElement;
    let mockAcceptBtn: HTMLElement;
    let mockExitBtn: HTMLElement;

    beforeEach(() => {
        eventBus = new EventBus();

        // Create mock dialog
        mockDialog = document.createElement('div');
        mockDialog.id = 'ending-dialog';
        mockDialog.classList.add('hidden');
        document.body.appendChild(mockDialog);

        // Create mock buttons
        mockRetryBtn = document.createElement('button');
        mockRetryBtn.id = 'ending-retry';
        mockRetryBtn.textContent = 'Try Again';
        mockDialog.appendChild(mockRetryBtn);

        mockAcceptBtn = document.createElement('button');
        mockAcceptBtn.id = 'ending-accept';
        mockAcceptBtn.textContent = 'Accept Ending';
        mockDialog.appendChild(mockAcceptBtn);

        mockExitBtn = document.createElement('button');
        mockExitBtn.id = 'ending-exit';
        mockExitBtn.textContent = 'Return to Menu';
        mockDialog.appendChild(mockExitBtn);

        controller = new EndingDialogController(eventBus);
    });

    afterEach(() => {
        controller.destroy();
        mockDialog.remove();
    });

    describe('Initialization', () => {
        it('should initialize without errors', () => {
            expect(() => new EndingDialogController(eventBus)).not.toThrow();
        });
    });

    describe('Show/Hide Dialog', () => {
        it('should show dialog when show() is called', () => {
            controller.show('true_ending');

            expect(mockDialog.classList.contains('hidden')).toBe(false);
        });

        it('should hide dialog when hide() is called', () => {
            controller.show('true_ending');
            controller.hide();

            expect(mockDialog.classList.contains('hidden')).toBe(true);
        });

        it('should store ending type when showing', () => {
            controller.show('bad_ending');

            // Ending type is stored internally
            expect((controller as any).pendingEndingType).toBe('bad_ending');
        });

        it('should handle null ending type', () => {
            expect(() => controller.show(null)).not.toThrow();
        });

        it('should handle missing dialog element', () => {
            mockDialog.remove();

            expect(() => controller.show('test')).not.toThrow();
        });

        it('should log when dialog is shown', () => {
            const uiSpy = vi.spyOn(Logger, 'ui');

            controller.show('test_ending');

            expect(uiSpy).toHaveBeenCalledWith('📋 Ending dialog shown (ending type: test_ending)');
            uiSpy.mockRestore();
        });

        it('should log when dialog is hidden', () => {
            const uiSpy = vi.spyOn(Logger, 'ui');

            controller.show();
            controller.hide();

            expect(uiSpy).toHaveBeenCalledWith('📋 Ending dialog hidden');
            uiSpy.mockRestore();
        });
    });

    describe('Button Actions', () => {
        it('should emit ending:retry when Try Again is clicked', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            controller.show('test_ending');

            const retryBtn = document.getElementById('ending-retry');
            retryBtn?.click();

            expect(emitSpy).toHaveBeenCalledWith('ending:retry', {
                endingType: 'test_ending'
            });
        });

        it('should emit ending:accept when Accept Ending is clicked', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            controller.show('true_ending');

            const acceptBtn = document.getElementById('ending-accept');
            acceptBtn?.click();

            expect(emitSpy).toHaveBeenCalledWith('ending:accept', {
                endingType: 'true_ending'
            });
        });

        it('should emit ending:exit when Return to Menu is clicked', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            controller.show('bad_ending');

            const exitBtn = document.getElementById('ending-exit');
            exitBtn?.click();

            expect(emitSpy).toHaveBeenCalledWith('ending:exit', {
                endingType: 'bad_ending'
            });
        });

        it('should hide dialog when Try Again is clicked', () => {
            controller.show();

            const retryBtn = document.getElementById('ending-retry');
            retryBtn?.click();

            expect(mockDialog.classList.contains('hidden')).toBe(true);
        });

        it('should hide dialog when Accept is clicked', () => {
            controller.show();

            const acceptBtn = document.getElementById('ending-accept');
            acceptBtn?.click();

            expect(mockDialog.classList.contains('hidden')).toBe(true);
        });

        it('should hide dialog when Exit is clicked', () => {
            controller.show();

            const exitBtn = document.getElementById('ending-exit');
            exitBtn?.click();

            expect(mockDialog.classList.contains('hidden')).toBe(true);
        });
    });

    describe('Keyboard Navigation', () => {
        it('should focus first option on show', () => {
            controller.show();

            const retryBtn = document.getElementById('ending-retry');
            expect(retryBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should navigate down with ArrowDown', () => {
            controller.show();

            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event);

            const acceptBtn = document.getElementById('ending-accept');
            expect(acceptBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should navigate up with ArrowUp', () => {
            controller.show();

            // Move to second option first
            let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event);

            // Move back up
            event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            const retryBtn = document.getElementById('ending-retry');
            expect(retryBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should wrap with Tab', () => {
            controller.show();

            // Tab through all 3 options
            const event1 = new KeyboardEvent('keydown', { key: 'Tab' });
            document.dispatchEvent(event1);

            const event2 = new KeyboardEvent('keydown', { key: 'Tab' });
            document.dispatchEvent(event2);

            const event3 = new KeyboardEvent('keydown', { key: 'Tab' });
            document.dispatchEvent(event3);

            // Should wrap back to first
            const retryBtn = document.getElementById('ending-retry');
            expect(retryBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should activate focused option with Enter', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            controller.show('test');

            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            document.dispatchEvent(event);

            // Should activate first option (Try Again)
            expect(emitSpy).toHaveBeenCalledWith('ending:retry', { endingType: 'test' });
        });

        it('should activate Exit option with Escape', () => {
            const emitSpy = vi.spyOn(eventBus, 'emit');

            controller.show('test');

            const event = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(event);

            // Should activate Exit option
            expect(emitSpy).toHaveBeenCalledWith('ending:exit', { endingType: 'test' });
        });

        it('should not navigate when dialog is hidden', () => {
            controller.show();
            controller.hide();

            const retryBtn = document.getElementById('ending-retry');
            retryBtn?.setAttribute('data-focused', 'true');

            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event);

            // Focus should not change
            expect(retryBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should not navigate beyond first option when ArrowUp at start', () => {
            controller.show();

            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            const retryBtn = document.getElementById('ending-retry');
            expect(retryBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should not navigate beyond last option when ArrowDown at end', () => {
            controller.show();

            // Move to last option
            const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event1);

            const event2 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event2);

            // Try to go past last
            const event3 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event3);

            const exitBtn = document.getElementById('ending-exit');
            expect(exitBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should remove keyboard listener when hidden', () => {
            controller.show();

            expect((controller as any).endingDialogKeyHandler).not.toBeNull();

            controller.hide();

            expect((controller as any).endingDialogKeyHandler).toBeNull();
        });
    });

    describe('Focus Management', () => {
        it('should remove focus from all when focusing one', () => {
            controller.show();

            // Focus second option
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event);

            const retryBtn = document.getElementById('ending-retry');
            const acceptBtn = document.getElementById('ending-accept');

            expect(retryBtn?.getAttribute('data-focused')).toBe('false');
            expect(acceptBtn?.getAttribute('data-focused')).toBe('true');
        });

        it('should handle missing button gracefully', () => {
            controller.show();

            // Manually set to invalid index
            (controller as any).currentEndingFocus = 99;

            expect(() => (controller as any).focusOption(99)).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        it('should log error if buttons are missing', () => {
            const errorSpy = vi.spyOn(Logger, 'error');

            mockRetryBtn.remove();

            controller.show();

            expect(errorSpy).toHaveBeenCalledWith('Ending dialog buttons not found');
            errorSpy.mockRestore();
        });
    });

    describe('Cleanup', () => {
        it('should hide dialog on destroy', () => {
            controller.show();
            controller.destroy();

            expect(mockDialog.classList.contains('hidden')).toBe(true);
        });

        it('should clear button references on destroy', () => {
            controller.show();
            controller.destroy();

            expect((controller as any).endingDialogButtons).toBeNull();
        });

        it('should log destroy message', () => {
            const uiSpy = vi.spyOn(Logger, 'ui');

            controller.destroy();

            expect(uiSpy).toHaveBeenCalledWith('💥 EndingDialogController destroyed');
            uiSpy.mockRestore();
        });
    });
});
