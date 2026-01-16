import { EventBus } from '../../core/EventBus';

export class Sidebar {
    private container!: HTMLElement;
    private toggleBtn!: HTMLElement;
    private isOpen: boolean = false;
    private backdrop!: HTMLElement;
    private eventBus: EventBus;

    // iOS-style layer swipe elements (V1 Parity: lines 1431-1447)
    private sidebarLayers: HTMLElement | null = null;
    private primaryLayer: HTMLElement | null = null;
    private secondaryLayer: HTMLElement | null = null;

    // Layer swipe state
    private layerSwipeStartX: number = 0;
    private layerSwipeStartTime: number = 0;
    private isLayerDragging: boolean = false;
    private isToolsRevealed: boolean = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
        this.initSidebarLayerSwipe();
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

        // Sidebar Container with iOS-style two-layer structure
        // V1 Parity: Layered sidebar design (V1 HTML structure)
        this.container = document.createElement('div');
        this.container.id = 'sidebar';

        this.container.innerHTML = `
            <!-- iOS-Style Layered Sidebar (V1 Parity) -->
            <div class="sidebar-layers">
                <!-- Secondary Layer (Tools) - Behind primary -->
                <div class="secondary-layer">
                    <div class="shade-section">
                        <div class="shade-section-title">Tools</div>
                        <div class="layer-hint">← Swipe to reveal</div>
                        <div class="layer-actions">
                            <button class="quick-action-btn" data-action="screenshot">
                                <span class="quick-action-icon">📸</span>
                                <span>Screenshot</span>
                            </button>
                            <button class="quick-action-btn" data-action="settings">
                                <span class="quick-action-icon">⚙️</span>
                                <span>Settings</span>
                            </button>
                            <button class="quick-action-btn" data-action="help">
                                <span class="quick-action-icon">❓</span>
                                <span>Help</span>
                            </button>
                            <button class="quick-action-btn" data-action="exit">
                                <span class="quick-action-icon">🚪</span>
                                <span>Exit</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Primary Layer (Core) - Slides over secondary -->
                <div class="primary-layer">
                    <div class="shade-section">
                        <div class="shade-section-title">Quick Actions</div>
                        <div class="layer-hint">Swipe for tools →</div>
                        <div class="layer-actions">
                            <button class="quick-action-btn" data-action="save">
                                <span class="quick-action-icon">💾</span>
                                <span>Save</span>
                            </button>
                            <button class="quick-action-btn" data-action="load">
                                <span class="quick-action-icon">📂</span>
                                <span>Load</span>
                            </button>
                            <button class="quick-action-btn" data-action="notes">
                                <span class="quick-action-icon">📨</span>
                                <span>Notes</span>
                            </button>
                            <button class="quick-action-btn" data-action="history">
                                <span class="quick-action-icon">📜</span>
                                <span>History</span>
                            </button>
                        </div>
                    </div>

                    <!-- V1 Parity: Status Details Section -->
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
                </div>
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

        // V1 Parity: Delegate all button clicks (both layers)
        this.container.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('.quick-action-btn');
            if (!btn) return;

            const action = (btn as HTMLElement).dataset.action;
            if (action) {
                this.handleLayerAction(action);
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

    // ========================================
    // IOS-STYLE LAYER SWIPE SYSTEM
    // V1 Parity: notification-shade-controller.js lines 1420-1733
    // ========================================

    /**
     * Initialize sidebar layer swipe handling
     * V1 Parity: Includes touch + mouse drag + click toggle
     */
    private initSidebarLayerSwipe(): void {
        this.sidebarLayers = this.container.querySelector('.sidebar-layers');
        this.primaryLayer = this.container.querySelector('.primary-layer');
        this.secondaryLayer = this.container.querySelector('.secondary-layer');

        if (!this.sidebarLayers || !this.primaryLayer) {
            console.warn('⚠️ Sidebar layers not found');
            return;
        }

        // Touch support (mobile)
        this.primaryLayer.addEventListener('touchstart', (e) => this.handleLayerSwipeStart(e as TouchEvent), { passive: false });
        this.primaryLayer.addEventListener('touchmove', (e) => this.handleLayerSwipeMove(e as TouchEvent), { passive: false });
        this.primaryLayer.addEventListener('touchend', (e) => this.handleLayerSwipeEnd(e as TouchEvent), { passive: false });

        this.secondaryLayer?.addEventListener('touchstart', (e) => this.handleLayerSwipeStart(e as TouchEvent), { passive: false });
        this.secondaryLayer?.addEventListener('touchmove', (e) => this.handleLayerSwipeMove(e as TouchEvent), { passive: false });
        this.secondaryLayer?.addEventListener('touchend', (e) => this.handleLayerSwipeEnd(e as TouchEvent), { passive: false });

        // Mouse drag support (desktop)
        this.primaryLayer.addEventListener('mousedown', (e) => this.handleLayerMouseDown(e));
        this.secondaryLayer?.addEventListener('mousedown', (e) => this.handleLayerMouseDown(e));

        // Mouse move/up on document for smooth tracking
        document.addEventListener('mousemove', (e) => this.handleLayerMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleLayerMouseUp(e));

        // Click toggle (desktop - click hint text)
        const layerHints = this.sidebarLayers.querySelectorAll('.layer-hint');
        layerHints.forEach(hint => {
            (hint as HTMLElement).style.cursor = 'pointer';
            hint.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleToolsLayer();
            });
        });

        console.log('✅ Sidebar layer swipe initialized (touch + mouse + click toggle)');
    }

    /**
     * Handle mouse down for drag
     * V1 Parity: lines 1510-1525
     */
    private handleLayerMouseDown(e: MouseEvent): void {
        // Only left click
        if (e.button !== 0) return;

        // Don't drag if clicking a button
        if ((e.target as HTMLElement).closest('button')) return;

        this.layerSwipeStartX = e.clientX;
        this.layerSwipeStartTime = Date.now();
        this.isLayerDragging = true;
        this.sidebarLayers?.classList.add('dragging');

        // Prevent text selection during drag
        e.preventDefault();
    }

    /**
     * Handle mouse move for drag
     * V1 Parity: lines 1530-1545
     */
    private handleLayerMouseMove(e: MouseEvent): void {
        if (!this.isLayerDragging || !this.primaryLayer) return;

        const deltaX = e.clientX - this.layerSwipeStartX;
        const layerWidth = this.primaryLayer.offsetWidth || 200;

        if (this.isToolsRevealed) {
            // Currently showing tools - drag to hide
            const percent = Math.max(0, Math.min(85, 85 + (deltaX / layerWidth) * 85));
            this.primaryLayer.style.transform = `translateX(${percent}%)`;
        } else {
            // Currently showing core - drag to reveal tools
            const percent = Math.max(0, Math.min(85, (deltaX / layerWidth) * 85));
            this.primaryLayer.style.transform = `translateX(${percent}%)`;
        }
    }

    /**
     * Handle mouse up to complete drag
     * V1 Parity: lines 1550-1577
     */
    private handleLayerMouseUp(e: MouseEvent): void {
        if (!this.isLayerDragging) return;

        this.isLayerDragging = false;
        this.sidebarLayers?.classList.remove('dragging');

        // Reset inline transform - let CSS classes take over
        if (this.primaryLayer) {
            this.primaryLayer.style.transform = '';
        }

        const deltaX = e.clientX - this.layerSwipeStartX;
        const deltaTime = Date.now() - this.layerSwipeStartTime;
        const velocity = deltaX / Math.max(deltaTime, 1);

        const threshold = 50;
        const velocityThreshold = 0.3;

        if (this.isToolsRevealed) {
            if (deltaX < -threshold || velocity < -velocityThreshold) {
                this.hideToolsLayer();
            }
        } else {
            if (deltaX > threshold || velocity > velocityThreshold) {
                this.revealToolsLayer();
            }
        }
    }

    /**
     * Toggle between Core and Tools layers (for click)
     * V1 Parity: lines 1582-1588
     */
    private toggleToolsLayer(): void {
        if (this.isToolsRevealed) {
            this.hideToolsLayer();
        } else {
            this.revealToolsLayer();
        }
    }

    /**
     * Handle touch start
     * V1 Parity: lines 1593-1601
     */
    private handleLayerSwipeStart(e: TouchEvent): void {
        const touch = e.touches[0];
        if (!touch) return;

        this.layerSwipeStartX = touch.clientX;
        this.layerSwipeStartTime = Date.now();
        this.isLayerDragging = true;

        // Add dragging class (disables CSS transitions)
        this.sidebarLayers?.classList.add('dragging');
    }

    /**
     * Handle touch move
     * V1 Parity: lines 1606-1632
     */
    private handleLayerSwipeMove(e: TouchEvent): void {
        if (!this.isLayerDragging) return;

        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - this.layerSwipeStartX;

        // Prevent vertical scroll
        e.preventDefault();

        // Live drag tracking
        if (this.primaryLayer) {
            const layerWidth = this.primaryLayer.offsetWidth || 200;

            if (this.isToolsRevealed) {
                // Currently showing tools - drag to hide
                // Clamp between 0 (tools fully visible) and 85% (tools hidden)
                const percent = Math.max(0, Math.min(85, 85 + (deltaX / layerWidth) * 85));
                this.primaryLayer.style.transform = `translateX(${percent}%)`;
            } else {
                // Currently showing core - drag to reveal tools
                // Clamp between 0 (core in place) and 85% (tools revealed)
                const percent = Math.max(0, Math.min(85, (deltaX / layerWidth) * 85));
                this.primaryLayer.style.transform = `translateX(${percent}%)`;
            }
        }
    }

    /**
     * Handle touch end
     * V1 Parity: lines 1637-1668
     */
    private handleLayerSwipeEnd(e: TouchEvent): void {
        if (!this.isLayerDragging) return;

        this.isLayerDragging = false;
        this.sidebarLayers?.classList.remove('dragging');

        // Reset inline transform - let CSS classes take over
        if (this.primaryLayer) {
            this.primaryLayer.style.transform = '';
        }

        const touch = e.changedTouches[0];
        if (!touch) return;
        const deltaX = touch.clientX - this.layerSwipeStartX;
        const deltaTime = Date.now() - this.layerSwipeStartTime;
        const velocity = deltaX / Math.max(deltaTime, 1);

        const threshold = 50; // pixels
        const velocityThreshold = 0.3; // px/ms

        if (this.isToolsRevealed) {
            // Currently showing tools - check if swiping back
            if (deltaX < -threshold || velocity < -velocityThreshold) {
                this.hideToolsLayer();
            }
        } else {
            // Currently showing core - check if revealing tools
            if (deltaX > threshold || velocity > velocityThreshold) {
                this.revealToolsLayer();
            }
        }
    }

    /**
     * Reveal the tools layer (slide primary to right)
     * V1 Parity: lines 1673-1681
     */
    private revealToolsLayer(): void {
        if (!this.sidebarLayers) return;

        this.sidebarLayers.classList.add('tools-revealed');
        this.isToolsRevealed = true;

        // V1 Parity: Haptic feedback
        if (navigator.vibrate) navigator.vibrate(20);

        console.log('🔧 Tools layer revealed');
    }

    /**
     * Hide the tools layer (slide primary back)
     * V1 Parity: lines 1686-1694
     */
    private hideToolsLayer(): void {
        if (!this.sidebarLayers) return;

        this.sidebarLayers.classList.remove('tools-revealed');
        this.isToolsRevealed = false;

        // V1 Parity: Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        console.log('⚡ Core layer restored');
    }

    /**
     * Handle action button clicks from layers
     * V1 Parity: lines 1700-1732
     */
    private handleLayerAction(action: string): void {
        console.log(`🎯 Layer action: ${action}`);

        // V1 Parity: Haptic feedback on action
        if (navigator.vibrate) navigator.vibrate(20);

        switch (action) {
            case 'save':
                this.eventBus.emit('ui:save_menu', {});
                this.close();
                break;
            case 'load':
                this.eventBus.emit('ui:load_menu', {});
                this.close();
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Fullscreen error: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'exit':
                this.eventBus.emit('ui:main_menu', {});
                this.close();
                break;
            case 'screenshot':
                // Toggle screenshot mode via status bar
                this.eventBus.emit('ui:hide_status_bar', {});
                this.close();
                break;
            case 'notes':
                this.eventBus.emit('ui:notes:open', {});
                this.close();
                break;
            case 'settings':
                this.eventBus.emit('settings:open', {});
                this.close();
                break;
            case 'help':
                // Show help - could emit a generic event or just log for now
                console.log('📖 Help requested');
                break;
            case 'history':
                this.eventBus.emit('ui:backlog:toggle', {});
                this.close();
                break;
            default:
                console.warn(`Unknown layer action: ${action}`);
        }
    }
}
