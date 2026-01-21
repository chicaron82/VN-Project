import { describe, it, expect } from 'vitest';
import { ResetController } from './ResetController';

describe('Debug ResetController Styles', () => {
    it('should show actual cssText values', () => {
        const controller = new ResetController();
        controller.nuclearReset();

        const overlay = document.querySelector('.nuclear-reset-overlay') as HTMLElement;
        const box = document.querySelector('.nuclear-reset-box') as HTMLElement;
        const buttons = document.querySelectorAll('.nuclear-reset-box button');
        const cancelBtn = Array.from(buttons).find(btn => btn.textContent === 'CANCEL') as HTMLButtonElement;
        const confirmBtn = Array.from(buttons).find(btn => btn.textContent === 'RESET ALL') as HTMLButtonElement;

        console.log('=== OVERLAY cssText ===');
        console.log(overlay.style.cssText);
        console.log('');
        console.log('=== BOX cssText ===');
        console.log(box.style.cssText);
        console.log('');
        console.log('=== CANCEL BUTTON cssText ===');
        console.log(cancelBtn.style.cssText);
        console.log('');
        console.log('=== CONFIRM BUTTON cssText ===');
        console.log(confirmBtn.style.cssText);

        expect(true).toBe(true); // Always pass, just want to see the output
    });
});
