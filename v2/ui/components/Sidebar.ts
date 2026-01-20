import { EventBus } from '../../core/EventBus';

import { StateManager } from '../../core/StateManager';
import { CollectiblesSystem } from '../../systems/CollectiblesSystem';

export class Sidebar {
    private container!: HTMLElement;
    private toggleBtn!: HTMLElement;
    private isOpen: boolean = false;
    private backdrop!: HTMLElement;
    private eventBus: EventBus;
    private stateManager: StateManager;
    private collectiblesSystem: CollectiblesSystem;

    // iOS-style layer swipe elements (V1 Parity: lines 1431-1447)
    private sidebarLayers: HTMLElement | null = null;
    private primaryLayer: HTMLElement | null = null;
    private secondaryLayer: HTMLElement | null = null;

    // Layer swipe state
    private layerSwipeStartX: number = 0;
    private layerSwipeStartTime: number = 0;
    private isLayerDragging: boolean = false;
    private isToolsRevealed: boolean = false;

    constructor(eventBus: EventBus, stateManager: StateManager, collectiblesSystem: CollectiblesSystem) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.collectiblesSystem = collectiblesSystem;
        this.createDOM();
        this.setupEventListeners();
        this.initSidebarLayerSwipe();
    }

    private createDOM() {
        // Toggle Button (Grab Handle)
        this.toggleBtn = document.createElement('div');
        this.toggleBtn.className = 'sidebar-toggle';
        this.toggleBtn.id = 'sidebar-toggle'; // TORI'S FIX: Stable ID for repositioner
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
            <!-- Swipable Top Section -->
            <div class="sidebar-layers">
                <!-- Secondary Layer (Tools) - Behind primary -->
                <div class="secondary-layer">
                    <div class="shade-header-row">
                        <span class="lightning-icon" style="color: #ff3c3c;">🔧</span>
                        <span class="shade-section-title" style="color: #ff3c3c;">Tools</span>
                        <span class="header-hint">← swipe back</span>
                    </div>
                    
                    <div class="core-actions-grid">
                        <button class="core-action-btn" data-action="screenshot">
                            <span class="core-icon">📸</span>
                            <span class="core-label">SCREENSHOT</span>
                        </button>
                        <button class="core-action-btn" data-action="settings">
                            <span class="core-icon">⚙️</span>
                            <span class="core-label">SETTINGS</span>
                        </button>
                        <button class="core-action-btn" data-action="help">
                            <span class="core-icon">❓</span>
                            <span class="core-label">HELP</span>
                        </button>
                        <button class="core-action-btn" data-action="exit">
                            <span class="core-icon">🚪</span>
                            <span class="core-label">EXIT</span>
                        </button>
                    </div>
                </div>

                <!-- Primary Layer (Core) - Slides over secondary -->
                <div class="primary-layer">
                    <!-- Core Header with Lightning Icon -->
                    <div class="shade-header-row">
                        <span class="lightning-icon">⚡</span>
                        <span class="shade-section-title">Core</span>
                        <span class="header-hint">swipe for tools →</span>
                    </div>

                    <!-- Main Action Grid (2x2 Boxed) -->
                    <div class="core-actions-grid">
                        <button class="core-action-btn" data-action="save">
                            <span class="core-icon">💾</span>
                            <span class="core-label">SAVE</span>
                        </button>
                        <button class="core-action-btn" data-action="load">
                            <span class="core-icon">📂</span>
                            <span class="core-label">LOAD</span>
                        </button>
                        <button class="core-action-btn" data-action="fullscreen">
                            <span class="core-icon">⛶</span>
                            <span class="core-label">FULLSCREEN</span>
                        </button>
                        <button class="core-action-btn" data-action="exit">
                            <span class="core-icon">🚪</span>
                            <span class="core-label">EXIT</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Static Bottom Section (Status & Footer) -->
            <div class="sidebar-static-content">
                <!-- Status Section (Boxed) -->
                <div class="shade-section-title status-title">CURRENT STATUS</div>
                <div class="status-box">
                    <div class="status-row">
                        <span class="status-label">Route:</span>
                        <span class="status-value highlight-cyan" id="sidebar-route">Menu</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Loop Version:</span>
                        <span class="status-value highlight-cyan" id="sidebar-loop">848</span>
                    </div>
                    <div class="status-row">
                        <span class="status-label">Notes Collected:</span>
                        <span class="status-value highlight-cyan" id="sidebar-notes">0/16</span>
                    </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: auto; padding-top: 20px; text-align: center; opacity: 0.5;">
                    <span class="carrier-logo" style="color: #0ff; font-weight: bold; font-family: 'Courier New'; letter-spacing: 1px;">UV7</span>
                    <span class="carrier-name" style="color: rgba(255,255,255,0.7); font-size: 10px; margin-left: 10px; font-family: 'Courier New';">United Voices 7</span>
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
        (this.eventBus as any).on('ui:sidebar_toggle', () => this.toggle()); // V1 Parity: GrabHandle tap-to-toggle

        // Toggle click
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Backdrop click
        this.backdrop.addEventListener('click', () => this.close());

        // V1 Parity: Delegate all button clicks (both layers)
        this.container.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-action]');
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

        this.updateContent();

        this.container.classList.add('visible');
        this.backdrop.classList.add('visible');
        this.toggleBtn.classList.add('open');
    }

    public close(): void {
        if (!this.isOpen) return;
        this.isOpen = false;

        this.container.classList.remove('visible');
        this.backdrop.classList.remove('visible');
        this.toggleBtn.classList.remove('open');
    }

    private updateContent(): void {
        const routeEl = this.container.querySelector('#sidebar-route');
        if (routeEl) {
            const currentRoute = this.stateManager.get<string>('currentRoute');
            // capitalize first letter
            routeEl.textContent = currentRoute
                ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)
                : 'Menu';
        }

        const loopEl = this.container.querySelector('#sidebar-loop');
        if (loopEl) {
            // V1 Parity: Loop version is standard 848 for now
            loopEl.textContent = '848';
        }

        const notesEl = this.container.querySelector('#sidebar-notes');
        if (notesEl) {
            const total = this.collectiblesSystem.getTotalCountForRoute();
            const collected = this.collectiblesSystem.getCollectedCountForRoute();
            notesEl.textContent = `${collected}/${total}`;
        }

        this.applyRouteTheming();
    }

    private applyRouteTheming(): void {
        this.container.classList.remove('ronnie-route', 'tori-route');

        const currentRoute = this.stateManager.get<string>('currentRoute');
        if (!currentRoute) return;

        if (currentRoute.toLowerCase().includes('ronnie')) {
            this.container.classList.add('ronnie-route');
        } else if (currentRoute.toLowerCase().includes('tori')) {
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

        // Click toggle (desktop - click hint text) - FIXED SELECTOR
        const layerHints = this.container.querySelectorAll('.header-hint, .shade-header-row'); // Allow clicking entire header
        layerHints.forEach(hint => {
            (hint as HTMLElement).style.cursor = 'pointer';
            hint.addEventListener('click', (e) => {
                e.stopPropagation();
                // prevent triggering if clicking a specific icon inside header if needed
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
