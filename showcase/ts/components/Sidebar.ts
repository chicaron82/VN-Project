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
        // Toggle button - handled by UV7OS/GrabHandle in main.ts
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
                    // Just close sidebar if it's not the toggle-mode action
                    if (action !== 'toggle-mode') {
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
            this.el.sidebar.classList.add('open');
            this.el.backdrop.classList.add('visible');
            document.body.classList.add('uv7-no-scroll');
        }
    }

    close(): void {
        if (!this.el.sidebar || !this.el.backdrop) return;

        this.el.sidebar.classList.remove('open');
        this.el.backdrop.classList.remove('visible');
        document.body.classList.remove('uv7-no-scroll');
    }
}
