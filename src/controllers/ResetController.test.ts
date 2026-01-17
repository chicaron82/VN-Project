import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResetController } from './ResetController';

describe('ResetController', () => {
    let controller: ResetController;
    let overlay: HTMLElement | null;

    beforeEach(() => {
        controller = new ResetController();
        overlay = null;

        // Mock localStorage
        localStorage.clear();
        localStorage.setItem('test_data', 'should_be_cleared');

        // Mock location.reload
        delete (window as any).location;
        (window as any).location = { reload: vi.fn() };
    });

    afterEach(() => {
        // Clean up any overlays
        const overlays = document.querySelectorAll('.nuclear-reset-overlay');
        overlays.forEach(el => el.remove());
    });

    describe('Initialization', () => {
        it('should initialize without errors', () => {
            expect(() => new ResetController()).not.toThrow();
        });

        it('should log initialization message', () => {
            const consoleSpy = vi.spyOn(console, 'log');

            new ResetController();

            expect(consoleSpy).toHaveBeenCalledWith('💥 ResetController initialized');
            consoleSpy.mockRestore();
        });
    });

    describe('Nuclear Reset Modal', () => {
        it('should create and display modal overlay', () => {
            controller.nuclearReset();

            overlay = document.querySelector('.nuclear-reset-overlay');
            expect(overlay).not.toBeNull();
            expect(overlay?.style.position).toBe('fixed');
            expect(overlay?.style.zIndex).toBe('10001');
        });

        it('should display warning title', () => {
            controller.nuclearReset();

            const title = document.querySelector('.nuclear-reset-box div');
            expect(title?.textContent).toContain('NUCLEAR RESET');
        });

        it('should list all items that will be deleted', () => {
            controller.nuclearReset();

            const box = document.querySelector('.nuclear-reset-box');
            expect(box?.innerHTML).toContain('All unlocks');
            expect(box?.innerHTML).toContain('All collected notes');
            expect(box?.innerHTML).toContain('All secret codes');
            expect(box?.innerHTML).toContain('All settings');
            expect(box?.innerHTML).toContain('Save files');
        });

        it('should display PERMANENT warning', () => {
            controller.nuclearReset();

            const box = document.querySelector('.nuclear-reset-box');
            expect(box?.innerHTML).toContain('PERMANENT');
            expect(box?.innerHTML).toContain('cannot be undone');
        });

        it('should have Cancel and Reset All buttons', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            expect(buttons).toHaveLength(2);

            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL');

            expect(cancelBtn).toBeDefined();
            expect(confirmBtn).toBeDefined();
        });

        it('should return true when modal is displayed', () => {
            const result = controller.nuclearReset();

            expect(result).toBe(true);
        });
    });

    describe('Cancel Button', () => {
        it('should close modal when Cancel is clicked', () => {
            vi.useFakeTimers();

            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;

            cancelBtn.click();

            // Fast-forward past animation
            vi.advanceTimersByTime(400);

            overlay = document.querySelector('.nuclear-reset-overlay');
            expect(overlay).toBeNull();

            vi.useRealTimers();
        });

        it('should NOT clear localStorage when Cancel is clicked', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;

            cancelBtn.click();

            expect(localStorage.getItem('test_data')).toBe('should_be_cleared');
        });

        it('should NOT reload page when Cancel is clicked', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;

            cancelBtn.click();

            expect(window.location.reload).not.toHaveBeenCalled();
        });
    });

    describe('Confirm Button', () => {
        it('should clear ALL localStorage when confirmed', () => {
            vi.useFakeTimers();

            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            confirmBtn.click();

            expect(localStorage.length).toBe(0);
            expect(localStorage.getItem('test_data')).toBeNull();

            vi.useRealTimers();
        });

        it('should reload page after confirmation', () => {
            vi.useFakeTimers();

            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            confirmBtn.click();

            // Fast-forward past 500ms delay
            vi.advanceTimersByTime(600);

            expect(window.location.reload).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should remove overlay before reloading', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            confirmBtn.click();

            // Overlay should be removed immediately
            overlay = document.querySelector('.nuclear-reset-overlay');
            expect(overlay).toBeNull();
        });

        it('should log nuclear reset messages', () => {
            const consoleSpy = vi.spyOn(console, 'log');

            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            confirmBtn.click();

            expect(consoleSpy).toHaveBeenCalledWith('💥 NUCLEAR RESET INITIATED...');
            expect(consoleSpy).toHaveBeenCalledWith('💥 All localStorage cleared');
            expect(consoleSpy).toHaveBeenCalledWith('💥 Reloading page to factory state...');

            consoleSpy.mockRestore();
        });
    });

    describe('Button Styling', () => {
        it('should style Cancel button correctly', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;

            expect(cancelBtn.style.borderColor).toContain('00ff00'); // Green
            expect(cancelBtn.style.color).toContain('00ff00');
        });

        it('should style Confirm button correctly', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            expect(confirmBtn.style.background).toContain('ff0000'); // Red
            expect(confirmBtn.style.color).toContain('fff'); // White text
        });

        it('should have hover effects on Cancel button', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;

            expect(cancelBtn.onmouseover).toBeDefined();
            expect(cancelBtn.onmouseout).toBeDefined();
        });

        it('should have hover effects on Confirm button', () => {
            controller.nuclearReset();

            const buttons = document.querySelectorAll('.nuclear-reset-box button');
            const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

            expect(confirmBtn.onmouseover).toBeDefined();
            expect(confirmBtn.onmouseout).toBeDefined();
        });
    });

    describe('Modal Structure', () => {
        it('should create overlay with correct styling', () => {
            controller.nuclearReset();

            overlay = document.querySelector('.nuclear-reset-overlay');
            expect(overlay?.style.background).toContain('rgba(0, 0, 0, 0.98)');
            expect(overlay?.style.display).toBe('flex');
        });

        it('should create box with gradient background', () => {
            controller.nuclearReset();

            const box = document.querySelector('.nuclear-reset-box') as HTMLElement;
            expect(box?.style.background).toContain('linear-gradient');
            expect(box?.style.border).toContain('ff0000'); // Red border
        });

        it('should use Courier New font', () => {
            controller.nuclearReset();

            const box = document.querySelector('.nuclear-reset-box') as HTMLElement;
            expect(box?.style.fontFamily).toContain('Courier New');
        });
    });
});
