import { EventBus } from '@core/EventBus';
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

        // 2. Status Bar (Top)
        this.statusBar = document.createElement('div');
        this.statusBar.className = 'status-bar';
        this.statusBar.innerHTML = `
        <div class="version-display">v848</div>
        <div class="tether-display">
            <div class="tether-overlay">
                <div class="tether-fill" id="tether-fill" style="width: 100%;"></div>
            </div>
        </div>
    `;
        this.tetherFill = this.statusBar.querySelector('#tether-fill') as HTMLElement;

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
        this.container.appendChild(this.statusBar);
        this.container.appendChild(this.dialogBox);

        // Mount to DOM
        const root = document.getElementById(containerId);
        if (root) {
            root.innerHTML = ''; // Clear loading/static content
            root.appendChild(this.container);
        } else {
            console.error(`Root element #${containerId} not found`);
        }
    }

    /**
     * Update Tether Display
     */
    updateTether(level: number) {
        if (!this.tetherFill) return;
        this.tetherFill.style.width = `${Math.max(0, Math.min(100, level))}%`;

        // Update color based on level (could be moved to CSS classes for cleaner logic)
        if (level < 30) {
            this.tetherFill.style.background = 'var(--grad-tether-critical)';
        } else if (level < 50) {
            this.tetherFill.style.background = 'var(--grad-tether-warning)';
        } else {
            this.tetherFill.style.background = 'var(--grad-tether-healthy)';
        }
    }
}
