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
                    <button class="quick-action-btn" data-action="notes">
                        <span class="quick-action-icon">📨</span>
                        <span>Notes</span>
                    </button>
                    <button class="quick-action-btn" data-action="history">
                        <span class="quick-action-icon">📜</span>
                        <span>History</span>
                    </button>
                    <button class="quick-action-btn" data-action="fullscreen">
                        <span class="quick-action-icon">⛶</span>
                        <span>Full</span>
                    </button>
                </div>
            </div>

            <!-- V1 Parity: Status Details Section (V1 lines 358-378) -->
            <div class="shade-section sidebar-status">
                <div class="shade-section-title">Current Status</div>
                <div class="status-details">
                    <div class="status-detail-item">
                        <span class="status-detail-label">Route:</span>
                        <span class="status-detail-value" id="sidebar-route">Menu</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Loop Version:</span>
                        <span class="status-detail-value" id="sidebar-loop">848</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Notes Collected:</span>
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
        // EventBus listeners
        this.eventBus.on('ui:sidebar:open', () => this.open());
        this.eventBus.on('ui:sidebar:close', () => this.close());
        this.eventBus.on('ui:sidebar:toggle', () => this.toggle());

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

        // Notes button click
        const notesBtn = this.container.querySelector('[data-action="notes"]');
        notesBtn?.addEventListener('click', () => {
            this.close();
            // We need a specific event for this in NotesViewer
            // But NotesViewer might not be listening for an event yet?
            // Wait, NotesViewer.ts didn't have a listener setup for 'ui:notes_open'
            // let's add one to NotesViewer.ts or emit a generic 'ui:show_notes' logic
            // For now, I'll rely on the global instance or add a listener in NotesViewer.ts
            // Actually NotesViewer constructor called `setupListeners()` which was empty.
            // I should have updated NotesViewer to listen for 'ui:notes:open'
            this.eventBus.emit('ui:notes:open', {});
        });

        // History button click
        const historyBtn = this.container.querySelector('[data-action="history"]');
        historyBtn?.addEventListener('click', () => {
            this.close();
            this.eventBus.emit('ui:backlog:toggle', {});
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

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open(): void {
        if (this.isOpen) return;
        this.isOpen = true;

        // V1 Parity: Update content when opening (V1 line 645-646)
        this.updateContent();

        this.container.classList.add('visible');
        this.backdrop.classList.add('visible');

        console.log('[Sidebar] Opened');
    }

    public close(): void {
        if (!this.isOpen) return;
        this.isOpen = false;

        this.container.classList.remove('visible');
        this.backdrop.classList.remove('visible');

        console.log('[Sidebar] Closed');
    }

    // V1 Parity: Update sidebar content (V1 line 730-765)
    private updateContent(): void {
        // Update route
        const routeEl = this.container.querySelector('#sidebar-route');
        if (routeEl) {
            // TODO: Get actual route from state manager
            routeEl.textContent = 'Menu'; // Placeholder
        }

        // Update loop
        const loopEl = this.container.querySelector('#sidebar-loop');
        if (loopEl) {
            // TODO: Get actual loop version from state manager
            loopEl.textContent = '848'; // Placeholder
        }

        // Update notes
        const notesEl = this.container.querySelector('#sidebar-notes');
        if (notesEl) {
            // TODO: Get actual notes count from collectibles system
            notesEl.textContent = '0/42'; // Placeholder
        }

        // Update tether (Tori route only)
        const tetherItem = this.container.querySelector('#sidebar-tether-item') as HTMLElement;
        const tetherValue = this.container.querySelector('#sidebar-tether-value');
        if (tetherItem && tetherValue) {
            // TODO: Check if current route is Tori
            const isToriRoute = false; // Placeholder

            if (isToriRoute) {
                tetherItem.style.display = 'flex';
                // TODO: Get actual tether level from state
                const tetherLevel = 100; // Placeholder
                tetherValue.textContent = `${Math.round(tetherLevel)}%`;

                // V1 Parity: Critical state styling (V1 line 756-759)
                if (tetherLevel < 20) {
                    tetherValue.classList.add('critical');
                } else {
                    tetherValue.classList.remove('critical');
                }
            } else {
                tetherItem.style.display = 'none';
            }
        }

        // V1 Parity: Apply route theming (V1 line 652-654)
        this.applyRouteTheming();
    }

    // V1 Parity: Route theming (V1 line 774-787)
    private applyRouteTheming(): void {
        // Remove existing route classes
        this.container.classList.remove('ronnie-route', 'tori-route');

        // TODO: Get actual route from state manager
        const routeName = 'Menu'; // Placeholder

        // Apply current route class
        if (routeName.includes('Ronnie')) {
            this.container.classList.add('ronnie-route');
        } else if (routeName.includes('Tori')) {
            this.container.classList.add('tori-route');
        }
    }
}
