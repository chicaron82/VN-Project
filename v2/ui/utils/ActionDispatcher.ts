/**
 * ═══════════════════════════════════════════════════════════════
 * ACTION DISPATCHER - Shared Quick Action Handler
 *
 * Extracted from Sidebar.handleLayerAction and
 * NotificationShade.handleQuickAction where identical switch
 * statements existed for save, load, fullscreen, exit, etc.
 * ═══════════════════════════════════════════════════════════════
 */

import type { EventBus } from '../../core/EventBus';

/**
 * Dispatch a UI quick action through the EventBus.
 *
 * @param action - The data-action string from the button
 * @param eventBus - The EventBus instance
 * @param onClose - Callback to close the parent component after dispatching
 */
export function dispatchAction(
    action: string,
    eventBus: EventBus,
    onClose: () => void
): void {
    if (navigator.vibrate) navigator.vibrate(20);

    switch (action) {
        case 'save':
            eventBus.emit('ui:save_menu', {});
            onClose();
            break;
        case 'load':
            eventBus.emit('ui:load_menu', {});
            onClose();
            break;
        case 'fullscreen':
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.warn(`Fullscreen error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
            break;
        case 'exit':
            eventBus.emit('ui:main_menu', {});
            onClose();
            break;
        case 'exit-to-shell':
            eventBus.emit('shell:exit', {});
            onClose();
            break;
        case 'screenshot':
            eventBus.emit('ui:hide_status_bar', {});
            onClose();
            break;
        case 'notes':
            eventBus.emit('ui:notes:open', {});
            onClose();
            break;
        case 'settings':
            eventBus.emit('settings:open', {});
            onClose();
            break;
        case 'history':
            eventBus.emit('ui:backlog:toggle', {});
            onClose();
            break;
        case 'help':
            console.log('Help requested');
            break;
        default:
            console.warn(`Unknown action: ${action}`);
    }
}
