import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';
import '@ui/styles/main.css';

export class GameLayout {
    private container: HTMLElement;

    // Elements
    public viewport: HTMLElement;
    public statusBar: HTMLElement;
    public dialogBox: HTMLElement;
    public dialogName: HTMLElement;
    public dialogText: HTMLElement;
    public tetherFill: HTMLElement;

    constructor(containerId: string, _eventBus: EventBus) {
        // this.eventBus = _eventBus; // Reserved for future use

        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'app-root';
        this.container.className = 'game-layout';

        // 1. Viewport Layer (Backgrounds, Sprites)
        this.viewport = document.createElement('div');
        this.viewport.className = 'game-viewport';
        this.viewport.id = 'game-viewport';

        // 2. Status Bar (Top) - REMOVED: Now handled by unified StatusBar component in main.ts
        // Legacy status bar removed to prevent duplicate status bars
        // Tether fill is now managed by the unified StatusBar via EventBus
        this.statusBar = document.createElement('div'); // Kept for backward compatibility
        this.statusBar.style.display = 'none'; // Hidden - not used
        this.tetherFill = document.createElement('div'); // Stub for backward compatibility

        // 3. Dialog Box (Bottom)
        this.dialogBox = document.createElement('div');
        this.dialogBox.className = 'dialog-box';
        this.dialogBox.id = 'dialogue-box';
        this.dialogBox.innerHTML = `
        <div class="name-label" id="name-label">???</div>
        <div class="dialog-text" id="dialog-text"></div>
    `;
        this.dialogName = this.dialogBox.querySelector('#name-label') as HTMLElement;
        this.dialogText = this.dialogBox.querySelector('#dialog-text') as HTMLElement;

        // Mount all
        this.container.appendChild(this.viewport);
        // this.container.appendChild(this.statusBar); // REMOVED: StatusBar is now mounted by unified StatusBar component
        this.container.appendChild(this.dialogBox);

        // Mount to DOM
        const root = document.getElementById(containerId);
        if (root) {
            root.innerHTML = ''; // Clear loading/static content
            root.appendChild(this.container);
        } else {
            Logger.error(`Root element #${containerId} not found`);
        }
    }

    /**
     * Update Tether Display
     * NOTE: This method is now deprecated. Tether updates are handled by the unified
     * StatusBar component via EventBus ('tether:changed' event).
     * Kept for backward compatibility.
     */
    updateTether(_level: number): void {
        // DEPRECATED: Tether updates now handled by unified StatusBar via EventBus
        // The TetherController emits 'tether:changed' events that StatusBar listens to
        return;
    }
}
