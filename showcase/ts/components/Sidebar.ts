/**
 * Sidebar Component (UV7 Control Center)
 * Handles rendering, toggling, and system stats logic for the desktop sidebar.
 */

interface SidebarElements {
    sidebar: HTMLElement | null;
    toggle: HTMLElement | null;
    backdrop: HTMLElement | null;
    cpuVal: HTMLElement | null;
    ramVal: HTMLElement | null;
    cpuBar: HTMLElement | null;
    ramBar: HTMLElement | null;
}

export class Sidebar {
    private el!: SidebarElements;

    constructor() {
        console.log('📋 Sidebar: Starting initialization...');
        // Don't render - use existing HTML from index.html
        this.cacheElements();
        this.initEvents();

        // Don't initialize system stats here - main.ts handles it
        console.log('✅ Sidebar: Fully initialized');
    }

    cacheElements(): void {
        this.el = {
            sidebar: document.getElementById('uv7-sidebar'),
            toggle: document.getElementById('uv7-sidebar-toggle'),
            backdrop: document.getElementById('uv7-backdrop'),
            cpuVal: document.getElementById('sys-cpu'),
            ramVal: document.getElementById('sys-ram'),
            cpuBar: document.getElementById('sys-cpu-bar'),
            ramBar: document.getElementById('sys-ram-bar')
        };
    }

    initEvents(): void {
        // Toggle button - Draggable Logic
        const toggle = this.el.toggle;
        if (toggle) {
            let isDragging = false;
            let startY = 0;
            let startTop = 0;
            let hasMoved = false;

            const onMouseDown = (e: MouseEvent | TouchEvent) => {
                isDragging = true;
                hasMoved = false;
                toggle.classList.add('dragging');

                const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                startY = clientY;
                startTop = parseInt(window.getComputedStyle(toggle).top, 10) || 0;

                // Prevent text selection
                e.preventDefault();
            };

            const onMouseMove = (e: MouseEvent | TouchEvent) => {
                if (!isDragging) return;

                const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                const deltaY = clientY - startY;

                // Mark as moved if drag exceeds threshold (avoid accidental clicks)
                if (Math.abs(deltaY) > 5) hasMoved = true;

                // Update position
                let newTop = startTop + deltaY;

                // Clamp to screen bounds (with some padding)
                const maxTop = window.innerHeight - 80; // 80 = height + padding
                newTop = Math.max(60, Math.min(newTop, maxTop));

                toggle.style.top = `${newTop}px`;
            };

            const onMouseUp = () => {
                if (!isDragging) return;

                isDragging = false;
                toggle.classList.remove('dragging');

                // If it was just a click (didn't move much), toggle the sidebar
                if (!hasMoved) {
                    this.toggle();
                }
            };

            // Mouse Events
            toggle.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            // Touch Events
            toggle.addEventListener('touchstart', onMouseDown, { passive: false });
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            document.addEventListener('touchend', onMouseUp);
        }

        // Backdrop close
        this.el.backdrop?.addEventListener('click', () => {
            this.close();
        });

        // Quick Actions and Section Navigation (from HTML)
        // Note: main.ts also handles these, so we keep this as fallback
        this.el.sidebar?.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;

            // 1. Quick Actions
            const actionBtn = target.closest('.quick-action') as HTMLElement | null;
            if (actionBtn) {
                const action = actionBtn.getAttribute('data-action');
                if (action) {
                    // Let main.ts handle the action logic
                    // JUST close sidebar if it's not the toggle-mode action
                    if (action === 'go-home') {
                        // "Home" in sidebar now means "Showcase Home Tab"
                        if (window.tabController) {
                            window.tabController.navigateToTab('home');
                            this.close();
                        }
                    } else if (action === 'go-landing') {
                        // "Landing" means exit to main index
                        window.location.href = '../index.html#/landing';
                    } else if (action !== 'toggle-mode') {
                        this.close();
                    }
                }
                return;
            }

            // 2. Section Navigation (uses data-tab in HTML)
            const navBtn = target.closest('.section-nav-item[data-tab]') as HTMLElement | null;
            if (navBtn) {
                const tab = navBtn.getAttribute('data-tab');
                if (tab && window.tabController) {
                    window.tabController.navigateToTab(tab);
                    this.close();
                }
                return;
            }

            // 3. Echo Settings button
            const echoBtn = target.closest('#echo-settings-trigger') as HTMLElement | null;
            if (echoBtn) {
                // Let UV7EchoSystem handle this
                this.close();
            }
        });
    }

    // Public method for UV7OS to call
    toggle(): void {
        if (!this.el.sidebar || !this.el.backdrop) return;
        const isOpen = this.el.sidebar.classList.contains('open');
        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open(): void {
        this.el.sidebar?.classList.add('open');
        this.el.backdrop?.classList.add('visible');
        document.body.classList.add('uv7-no-scroll');
    }

    close(): void {
        if (!this.el.sidebar || !this.el.backdrop) return;



        this.el.sidebar.classList.remove('open');
        this.el.backdrop.classList.remove('visible');
        document.body.classList.remove('uv7-no-scroll');
    }
}


