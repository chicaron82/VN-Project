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
    private touchStartY: number;
    private touchEndY: number;
    private minSwipeDistance: number;
    private el!: ShadeElements;

    constructor() {
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        console.log('🔔 NotificationShade: Starting initialization...');

        // Clear any old rendered shade HTML from the mount point
        const shadeMount = document.getElementById('uv7-shade-mount');
        if (shadeMount) {
            shadeMount.innerHTML = '';
            console.log('🧹 Cleared old shade mount content');
        }

        // Also remove any lingering uv7-shade elements from previous renders
        const oldShade = document.getElementById('uv7-shade');
        if (oldShade && oldShade.parentElement?.id === 'uv7-shade-mount') {
            oldShade.remove();
            console.log('🧹 Removed old shade element from DOM');
        }

        // Remove any duplicate sidebar toggles from old shade renders
        // Do this check multiple times to catch dynamically created duplicates
        const removeDuplicates = () => {
            const allToggles = document.querySelectorAll('.uv7-sidebar-toggle');
            console.log(`🧹 Checking for duplicate toggles... Found ${allToggles.length} button(s)`);

            if (allToggles.length > 1) {
                allToggles.forEach((toggle, index) => {
                    const rect = toggle.getBoundingClientRect();
                    console.log(`  Toggle ${index}:`, {
                        id: toggle.id || '(no id)',
                        parent: toggle.parentElement?.tagName,
                        position: `${Math.round(rect.left)},${Math.round(rect.top)}`,
                        hasId: !!toggle.id
                    });
                });

                // Keep only the FIRST one found, remove all others
                allToggles.forEach((toggle, index) => {
                    if (index > 0) {
                        console.log(`🧹 Removing toggle ${index}`);
                        toggle.remove();
                    }
                });
            }
        };

        removeDuplicates();
        // Check again after a short delay to catch any dynamically created toggles
        setTimeout(removeDuplicates, 100);
        setTimeout(removeDuplicates, 500);
        setTimeout(removeDuplicates, 1000); // Extra check

        // Don't render - in showcase, we just use the sidebar for both portrait/landscape
        this.cacheElements();
        this.initEvents();
        this.initSwipeHandler();
        console.log('✅ NotificationShade: Fully initialized (using sidebar for all viewports)');
    }

    cacheElements(): void {
        // Use sidebar as the "shade" for portrait mode
        this.el = {
            shade: document.getElementById('uv7-sidebar'),
            closeBtn: null, // No close button needed - backdrop handles it
            backdrop: document.getElementById('uv7-backdrop'),
            sectionList: null // Navigation handled by Sidebar component
        };
    }

    initEvents(): void {
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
                    console.log('📱 ui:shade:toggle event received - toggling sidebar');
                    // In portrait mode, swipe-down on status bar should open sidebar
                    if (window.uv7os) {
                        window.uv7os.toggleSidebar();
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

    // These methods now delegate to UV7OS
    open(): void {
        if (window.uv7os) {
            window.uv7os.toggleSidebar();
        }
    }

    close(): void {
        if (window.uv7os) {
            window.uv7os.toggleSidebar();
        }
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
        // Only active on mobile (portrait mode)
        if (window.innerWidth > 768) return;

        const distance = this.touchEndY - this.touchStartY;
        const isSidebarOpen = this.el.shade?.classList.contains('open');

        // Swipe Up (negative distance) to close
        if (isSidebarOpen && distance < -this.minSwipeDistance) {
            if (window.uv7os) {
                window.uv7os.toggleSidebar();
            }
            return;
        }

        // Swipe Down (positive distance) to open
        // Allow opening from anywhere in the top half of the screen (more forgiving)
        const isTopHalf = this.touchStartY < window.innerHeight / 2;
        const isAtScrollTop = window.scrollY < 100;

        // Open sidebar if: swipe down started in top half OR user is at top of page
        if (!isSidebarOpen && distance > this.minSwipeDistance && (isTopHalf || isAtScrollTop)) {
            if (window.uv7os) {
                window.uv7os.toggleSidebar();
            }
        }
    }
}
