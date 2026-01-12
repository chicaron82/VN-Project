import { EventBus } from '../../core/EventBus';

export class StatusBar {
    private container!: HTMLElement;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
    }

    private createDOM() {
        this.container = document.createElement('div');
        this.container.id = 'status-bar';

        // Default content
        this.container.innerHTML = `
            <div class="status-section">
                <span id="status-loop" class="status-item">Loop 848</span>
                <span id="status-route" class="status-item">Menu</span>
            </div>
            
            <div id="status-notification" style="opacity: 0;">
                <span class="status-notif-text"></span>
            </div>

            <div class="status-section">
                <span id="status-progress" class="status-item" title="Collected Notes">🖤 0/42</span>
            </div>
        `;

        // Prepend to body to ensure it's at the top of the DOM stacking context (z-index handles visibility)
        document.body.prepend(this.container);
    }

    private setupEventListeners() {
        this.eventBus.on('ui:route_changed', (data: any) => {
            const routeEl = this.container.querySelector('#status-route');
            if (routeEl) routeEl.textContent = data.route.toUpperCase();

            // Update route-specific styling
            this.container.classList.remove('ronnie-route', 'tori-route');
            if (data.route === 'ronnie' || data.route === 'tori') {
                this.container.classList.add(`${data.route}-route`);
            }
        });

        this.eventBus.on('note:collected', (data: any) => {
            const progressEl = this.container.querySelector('#status-progress');
            if (progressEl) progressEl.textContent = `🖤 ${data.count}/42`;
        });

        this.eventBus.on('ui:show_status_bar', () => this.show());
        this.eventBus.on('ui:hide_status_bar', () => this.hide());
    }

    public show() {
        this.container.classList.add('visible');
    }

    public hide() {
        this.container.classList.remove('visible');
    }
}
