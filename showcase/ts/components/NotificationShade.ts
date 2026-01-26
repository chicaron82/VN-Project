/**
 * NotificationShade Component (Mobile Navigation)
 * Handles rendering, swipe gestures, and interactions for the mobile shade.
 */

interface ShadeElements {
    shade: HTMLElement | null;
    closeBtn: HTMLElement | null;
    backdrop: HTMLElement | null;
    sectionList: HTMLElement | null;
}

export class NotificationShade {
    private containerId: string;
    private touchStartY: number;
    private touchEndY: number;
    private minSwipeDistance: number;
    private el!: ShadeElements;

    constructor(containerId: string = 'uv7-shade-mount') {
        this.containerId = containerId;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        console.log('🔔 NotificationShade: Starting initialization...');
        this.render();
        this.cacheElements();
        this.initEvents();
        this.initSwipeHandler();
        console.log('✅ NotificationShade: Fully initialized');
    }

    render(): void {
        const mount = document.getElementById(this.containerId);
        if (!mount) return;

        mount.innerHTML = `
            <!-- Notification Shade (Portrait) -->
            <div id="uv7-shade" class="uv7-shade">
                <div class="shade-header">
                    <span class="shade-title">📖 Showcase Navigator</span>
                    <button class="shade-close" aria-label="Close">✕</button>
                </div>
                <div class="shade-content">
                    <!-- Quick Actions -->
                    <div class="shade-section">
                        <div class="shade-section-title">Quick Actions</div>
                        <div class="quick-actions-grid">
                            <button class="quick-action" data-action="launch-v1">
                                <span class="quick-action-icon">🎮</span>
                                <span class="quick-action-label">V1 Game</span>
                            </button>
                            <button class="quick-action" data-action="launch-v2">
                                <span class="quick-action-icon">⚡</span>
                                <span class="quick-action-label">V2 Engine</span>
                            </button>
                            <button class="quick-action" data-action="go-home">
                                <span class="quick-action-icon">🏠</span>
                                <span class="quick-action-label">Landing</span>
                            </button>
                            <button class="quick-action" data-action="toggle-mode">
                                <span class="quick-action-icon">📖</span>
                                <span class="quick-action-label">Story/Dev</span>
                            </button>
                        </div>
                    </div>

                    <!-- Section Navigation -->
                    <div class="shade-section">
                        <div class="shade-section-title">Navigate</div>
                        <div class="section-nav-list" id="shade-section-list">
                            <button class="section-nav-item" data-section="journey-section">
                                <span class="section-icon">🗺️</span>
                                <span class="section-label">The Journey</span>
                            </button>
                            <button class="section-nav-item" data-section="workflow-section">
                                <span class="section-icon">⚙️</span>
                                <span class="section-label">Workflow</span>
                            </button>
                            <button class="section-nav-item" data-section="results-section">
                                <span class="section-icon">📊</span>
                                <span class="section-label">The Results</span>
                            </button>
                            <button class="section-nav-item" data-section="spotlight-section">
                                <span class="section-icon">💡</span>
                                <span class="section-label">Technical Spotlight</span>
                            </button>
                            <button class="section-nav-item" data-section="evolution-section">
                                <span class="section-icon">🔄</span>
                                <span class="section-label">The Evolution</span>
                            </button>
                            <button class="section-nav-item" data-section="who-section">
                                <span class="section-icon">👥</span>
                                <span class="section-label">Who Are We</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    cacheElements(): void {
        this.el = {
            shade: document.getElementById('uv7-shade'),
            closeBtn: document.querySelector('.shade-close'),
            backdrop: document.getElementById('uv7-backdrop'),
            sectionList: document.getElementById('shade-section-list')
        };
    }

    initEvents(): void {
        // Close Button
        this.el.closeBtn?.addEventListener('click', () => this.close());

        // Navigation Clicks
        this.el.sectionList?.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.section-nav-item') as HTMLElement | null;
            if (btn) {
                const section = btn.dataset.section;
                if (section) this.handleNavigation(section);
            }
        });

        // Quick Actions
        this.el.shade?.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.quick-action');
            if (btn) {
                // Global handler delegation
            }
        });

        // Listen for global open requests (helpers)
        document.addEventListener('open-shade', () => this.open());

        // Listen for StatusBar swipe-down gesture (ui:shade:toggle event)
        // Wait for UV7 Runtime to be available, then subscribe to EventBus
        let retryCount = 0;
        const setupEventBusListener = () => {
            const runtime = (window as any).uv7Runtime;
            console.log(`🔍 NotificationShade checking for EventBus (attempt ${retryCount + 1})`, {
                hasRuntime: !!runtime,
                hasEventBus: !!(runtime?.eventBus)
            });

            if (runtime && runtime.eventBus) {
                runtime.eventBus.on('ui:shade:toggle', () => {
                    console.log('📱 ui:shade:toggle event received');
                    if (this.el.shade?.classList.contains('open')) {
                        this.close();
                    } else {
                        this.open();
                    }
                });
                console.log('✅ NotificationShade listening to EventBus ui:shade:toggle');
            } else {
                retryCount++;
                if (retryCount < 50) { // Max 5 seconds
                    setTimeout(setupEventBusListener, 100);
                } else {
                    console.warn('⚠️ NotificationShade: EventBus not found after 50 attempts');
                }
            }
        };
        setupEventBusListener();
    }

    open(): void {
        if (!this.el.shade) return;
        this.el.shade.classList.add('open');
        this.el.backdrop?.classList.add('active');
        document.body.classList.add('uv7-no-scroll');
    }

    close(): void {
        if (!this.el.shade) return;
        this.el.shade.classList.remove('open');
        this.el.backdrop?.classList.remove('active');
        document.body.classList.remove('uv7-no-scroll');
    }

    handleNavigation(sectionClass: string): void {
        this.close();

        // Dispatch event for Main Controller to handle scrolling/tab switching
        window.dispatchEvent(new CustomEvent('uv7-navigate', {
            detail: { target: sectionClass }
        }));
    }

    initSwipeHandler(): void {
        document.addEventListener('touchstart', (e: TouchEvent) => {
            // Ignore if touch started on slider elements
            const target = e.target as HTMLElement;
            if (target.closest('.slider-handle') || target.closest('.slider-knob') || target.closest('.split-container')) {
                return;
            }
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e: TouchEvent) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe(): void {
        // Only active on mobile
        if (window.innerWidth > 768) return;

        const distance = this.touchEndY - this.touchStartY;
        const isShadeOpen = this.el.shade?.classList.contains('open');

        // Swipe Up (negative distance) to close
        if (isShadeOpen && distance < -this.minSwipeDistance) {
            this.close();
            return;
        }

        // Swipe Down (positive distance) > threshold
        // Allow opening from anywhere in the top half of the screen (more forgiving)
        const isTopHalf = this.touchStartY < window.innerHeight / 2;
        const isAtScrollTop = window.scrollY < 100;

        // Open shade if: swipe down started in top half OR user is at top of page
        if (!isShadeOpen && distance > this.minSwipeDistance && (isTopHalf || isAtScrollTop)) {
            this.open();
        }
    }
}
