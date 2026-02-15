import type { EventBus, EventName } from './EventBus';
import type { GameEvents } from './EventBus';
import { isLandscape } from '@utils/layout';
// import { GameConfig } from './GameConfig';

export class KeyboardController {
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.setupListeners();
    }

    private setupListeners(): void {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    private handleKeyDown(e: KeyboardEvent): void {
        const key = e.key;

        // Escape Key - Priority Stack
        if (key === 'Escape') {
            this.handleEscape(e);
            return;
        }

        // Ignore shortcuts if an overlay is open (except ESC)
        if (this.isAnyOverlayOpen()) return;

        // Ctrl Shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    this.eventBus.emit('save:quick', {});
                    break;
                case 'l':
                    e.preventDefault();
                    this.eventBus.emit('load:quick', {});
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    this.eventBus.emit('ui:main_menu', {});
                    break;
            }
            return;
        }

        // Single Key Shortcuts
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            switch (key.toLowerCase()) {
                case 'n':
                    this.eventBus.emit('ui:notes:open', {});
                    break;
                case 'h':
                    this.eventBus.emit('ui:hide_hud', {}); // For screenshots
                    break;
                // Add more as needed
            }
        }
    }

    private handleEscape(e: KeyboardEvent): void {
        e.preventDefault();

        // 1. Dev Console (Top Priority)
        if (this.closeIfOpen('dev-console', 'ui:console:close')) return;

        // 2. Ending/Dialogs (Special Modals)
        // if (this.closeIfOpen('ending-modal', 'ui:ending:close')) return;

        // 3. Credits
        // Credits usually replace the screen, so 'closing' might mean returning to main menu
        const credits = document.querySelector('.credits-screen');
        if (credits) {
            this.eventBus.emit('ui:main_menu', {});
            return;
        }

        // 4. Notes
        if (this.closeIfOpen('notes-viewer-overlay', 'ui:notes:close')) return;
        // Also check detailed note overlay which sits on top
        // But NotesViewer handles ESC internally for that currently. 
        // If we want centralized, we should emit ui:notes:close which NotesViewer should handle by closing everything.

        // 5. Backlog
        if (this.closeIfOpen('backlog-overlay', 'ui:backlog:close')) return;

        // 6. Settings
        if (this.closeIfOpen('settings-menu', 'settings:close')) return;

        // 7. Save/Load Modal
        if (this.closeIfOpen('save-load-modal', 'ui:save_load:close')) return; // Check SaveLoadModal ID

        // 8. Sidebar
        if (this.isVisible('sidebar', 'visible')) {
            this.eventBus.emit('ui:sidebar:close', {});
            document.querySelector('#sidebar')?.classList.remove('visible');
            document.querySelector('#shade-backdrop')?.classList.remove('visible');
            return;
        }

        // 9. Notification Shade (expanded → collapse, open → close)
        const shade = document.getElementById('notification-shade');
        if (shade?.classList.contains('visible')) {
            if (shade.classList.contains('expanded')) {
                this.eventBus.emit('ui:shade:collapse', {});
            } else {
                this.eventBus.emit('ui:shade:close_request', {});
            }
            return;
        }

        // 10. Nothing open + in-game → Open Sidebar (Landscape) or Shade (Portrait)
        if (document.getElementById('game-layout')) {
            if (isLandscape()) {
                this.eventBus.emit('ui:sidebar:toggle', {});
            } else {
                this.eventBus.emit('ui:shade:toggle', {});
            }
        }
    }

    private isAnyOverlayOpen(): boolean {
        return !!(
            this.isVisible('notes-overlay') ||
            this.isVisible('backlog-overlay') ||
            this.isVisible('settings-menu') ||
            this.isVisible('save-load-overlay') ||
            this.isVisible('sidebar', 'visible')
        );
    }

    private closeIfOpen(elementId: string, eventName: string): boolean {
        const el = document.getElementById(elementId);
        // Check display style AND visibility class if applicable
        if (el && (el.style.display !== 'none' && el.style.display !== '')) {
            this.eventBus.emit(eventName as EventName, {} as GameEvents[EventName]);
            return true;
        }
        // Also check if class 'active' or 'visible' is used instead of display
        if (el && (el.classList.contains('visible') || el.classList.contains('active'))) {
            this.eventBus.emit(eventName as EventName, {} as GameEvents[EventName]);
            return true;
        }
        return false;
    }

    private isVisible(elementId: string, className?: string): boolean {
        const el = document.getElementById(elementId);
        if (!el) return false;
        if (className) return el.classList.contains(className);
        return el.style.display !== 'none' && el.style.display !== '';
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { /* ignore */ });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
