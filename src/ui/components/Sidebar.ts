import { EventBus } from '../../core/EventBus';

export class Sidebar {
    private container!: HTMLElement;
    private toggleBtn!: HTMLElement;
    private isOpen: boolean = false;
    private backdrop!: HTMLElement;
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
    }

    private createDOM() {
        // Toggle Button (Grab Handle)
        this.toggleBtn = document.createElement('div');
        this.toggleBtn.className = 'sidebar-toggle';
        this.toggleBtn.innerHTML = '☰';
        this.toggleBtn.title = 'Open Menu';
        document.body.appendChild(this.toggleBtn);

        // Backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.id = 'shade-backdrop';
        document.body.appendChild(this.backdrop);

        // Sidebar Container
        this.container = document.createElement('div');
        this.container.id = 'sidebar';

        this.container.innerHTML = `
             <div class="shade-section">
                <div class="shade-section-title">Quick Actions</div>
                <div class="layer-actions">
                    <button class="quick-action-btn" data-action="save">
                        <span class="quick-action-icon">💾</span>
                        <span>Save</span>
                    </button>
                    <button class="quick-action-btn" data-action="load">
                        <span class="quick-action-icon">📂</span>
                        <span>Load</span>
                    </button>
                    <button class="quick-action-btn" data-action="settings">
                        <span class="quick-action-icon">⚙️</span>
                        <span>Settings</span>
                    </button>
                    <button class="quick-action-btn" data-action="fullscreen">
                        <span class="quick-action-icon">⛶</span>
                        <span>Full</span>
                    </button>
                </div>
            </div>

            <div class="shade-section sidebar-status">
                <div class="shade-section-title">Current Status</div>
                <div class="status-details">
                    <div class="status-detail-item">
                        <span class="status-detail-label">Route:</span>
                        <span class="status-detail-value" id="sidebar-route">Menu</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Loop:</span>
                        <span class="status-detail-value" id="sidebar-loop">848</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Notes:</span>
                        <span class="status-detail-value" id="sidebar-notes">0/42</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(0, 255, 255, 0.2); text-align: center;">
                <span class="carrier-logo" style="color: #0ff; font-weight: bold; font-family: 'Courier New';">UV7</span>
                <span class="carrier-name" style="color: rgba(255,255,255,0.7); font-size: 10px; display: block;">United Voices 7</span>
            </div>
        `;
        document.body.appendChild(this.container);
    }

    private setupEventListeners() {
        // Toggle click
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Backdrop click
        this.backdrop.addEventListener('click', () => this.close());

        // Settings button click
        const settingsBtn = this.container.querySelector('[data-action="settings"]');
        settingsBtn?.addEventListener('click', () => {
            this.close(); // Close sidebar
            this.eventBus.emit('settings:open', {});
        });

        // Fullscreen button
        const fsBtn = this.container.querySelector('[data-action="fullscreen"]');
        fsBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    public toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    public open() {
        this.isOpen = true;
        this.container.classList.add('visible');
        this.backdrop.classList.add('visible');
    }

    public close() {
        this.isOpen = false;
        this.container.classList.remove('visible');
        this.backdrop.classList.remove('visible');
    }
}
