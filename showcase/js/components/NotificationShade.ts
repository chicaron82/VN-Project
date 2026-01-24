/**
 * NotificationShade Component (Mobile Navigation)
 * Handles rendering, swipe gestures, and interactions for the mobile shade.
 */
export class NotificationShade {
    constructor(containerId = 'uv7-shade-mount') {
        this.containerId = containerId;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        this.render();
        this.cacheElements();
        this.initEvents();
        this.initSwipeHandler();
    }

    render() {
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

    cacheElements() {
        this.el = {
            shade: document.getElementById('uv7-shade'),
            closeBtn: document.querySelector('.shade-close'),
            backdrop: document.getElementById('uv7-backdrop'),
            sectionList: document.getElementById('shade-section-list')
        };
    }

    initEvents() {
        // Close Button
        this.el.closeBtn?.addEventListener('click', () => this.close());

        // Navigation Clicks
        this.el.sectionList?.addEventListener('click', (e) => {
            const btn = e.target.closest('.section-nav-item');
            if (btn) {
                const section = btn.dataset.section;
                this.handleNavigation(section);
            }
        });

        // Quick Actions
        this.el.shade?.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-action');
            if (btn) {
                // Global handler delegation
            }
        });

        // Listen for global open requests (helpers)
        document.addEventListener('open-shade', () => this.open());
    }

    open() {
        this.el.shade.classList.add('open');
        this.el.backdrop?.classList.add('active');
        document.body.classList.add('uv7-no-scroll');
    }

    close() {
        this.el.shade.classList.remove('open');
        this.el.backdrop?.classList.remove('active');
        document.body.classList.remove('uv7-no-scroll');
    }

    handleNavigation(sectionClass) {
        this.close();

        // Dispatch event for Main Controller to handle scrolling/tab switching
        window.dispatchEvent(new CustomEvent('uv7-navigate', {
            detail: { target: sectionClass }
        }));
    }

    initSwipeHandler() {
        document.addEventListener('touchstart', (e) => {
            // Ignore if touch started on slider elements
            const target = e.target;
            if (target.closest('.slider-handle') || target.closest('.slider-knob') || target.closest('.split-container')) {
                return;
            }
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
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
        // Check if swipe started near top (first 300px) OR we are near top of scroll
        const isTopStart = this.touchStartY < 300;
        const isAtTop = window.scrollY < 100;

        if (distance > this.minSwipeDistance && (isTopStart || isAtTop)) {
            this.open();
        }
    }
}
