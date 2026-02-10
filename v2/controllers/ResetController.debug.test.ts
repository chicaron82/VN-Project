import { Logger } from '@utils/Logger';
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

        Logger.debug('=== OVERLAY cssText ===');
        Logger.debug(overlay.style.cssText);
        Logger.debug('');
        Logger.debug('=== BOX cssText ===');
        Logger.debug(box.style.cssText);
        Logger.debug('');
        Logger.debug('=== CANCEL BUTTON cssText ===');
        Logger.debug(cancelBtn.style.cssText);
        Logger.debug('');
        Logger.debug('=== CONFIRM BUTTON cssText ===');
        Logger.debug(confirmBtn.style.cssText);

        expect(true).toBe(true); // Always pass, just want to see the output
    });
});
