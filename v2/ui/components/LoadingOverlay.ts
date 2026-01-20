import { EventBus } from '@core/EventBus';
import '@ui/styles/loading-overlay.css';

export class LoadingOverlay {
    private container: HTMLElement;
    private eventBus: EventBus;
    private isVisible: boolean = false;
    private minTime: number = 800; // Minimum time to show loader to prevent flickering
    private showTime: number = 0;

    constructor(containerId: string, eventBus: EventBus) {
        this.eventBus = eventBus;

        // Create container
        this.container = document.createElement('div');
        this.container.className = 'loading-overlay hidden';
        this.container.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">LOADING</div>
            </div>
        `;

        // Mount
        const root = document.getElementById(containerId);
        if (root) {
            root.appendChild(this.container);
        }

        this.initListeners();
    }

    private initListeners() {
        this.eventBus.on('loading:start', () => this.show());
        this.eventBus.on('loading:end', () => this.hide());
    }

    public show() {
        if (this.isVisible) return;

        this.isVisible = true;
        this.showTime = Date.now();
        this.container.classList.remove('hidden');
        this.container.classList.add('visible');
    }

    public hide() {
        if (!this.isVisible) return;

        const elapsed = Date.now() - this.showTime;
        const remaining = Math.max(0, this.minTime - elapsed);

        setTimeout(() => {
            this.isVisible = false;
            this.container.classList.remove('visible');
            this.container.classList.add('hidden');
        }, remaining);
    }
}
