/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - NAVIGATION SYSTEM
 * Universal navigation for UV7 ecosystem
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Settings Integration, Meta-Narrative & View Transitions)
 * - DiZee (Implementation)
 * - DiZee (Seamless transitions enhancement)
 * ═══════════════════════════════════════════════════════════════
 */

interface TimelineEntry {
    id: string;
    title?: string;
    [key: string]: any;
}

interface UV7OSOptions {
    entries?: TimelineEntry[];
}

declare global {
    interface Window {
        uv7os?: UV7OS;
        tabController?: {
            navigateToTab: (tabId: string) => void;
        };
        TIMELINE_DATA?: {
            entries: TimelineEntry[];
        };
    }
}

export class UV7OS {
    private context: string;
    private entries: TimelineEntry[];
    private currentEntry: string | null = null;
    private currentMode: string = 'story'; // 'story' or 'dev'
    private elements: Record<string, HTMLElement | null> = {};

    constructor(context: string, options: UV7OSOptions = {}) {
        this.context = context;
        this.entries = options.entries || [];

        this.init();
    }

    private init(): void {
        this.cacheElements();
        this.detectCurrentEntry();
        this.detectCurrentMode();
        this.attachSectionNavHandlers();
        this.attachHandlers();
        this.restoreState();
        this.startScrollListener();
        this.enableSeamlessTransitions();

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // TORI: Boot toast - one-time acknowledgment
        this.showBootToast();

        // Global Event Listeners (Bridge to Components)
        window.addEventListener('uv7-navigate', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.target) {
                this.jumpToSection(customEvent.detail.target);
            }
        });

        window.addEventListener('uv7-action', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.action) {
                this.handleQuickAction(customEvent.detail.action);
            }
        });

        console.log('🚀 UV7 OS initialized:', this.context);
    }

    private cacheElements(): void {
        this.elements = {
            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),
            shadeSectionList: document.getElementById('shade-section-list'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),
            sidebarSectionList: document.getElementById('sidebar-section-list'),
            sidebarHome: document.getElementById('sidebar-home'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Existing page elements
            viewToggle: document.getElementById('view-toggle')
        };
    }

    private detectCurrentEntry(): void {
        // Find which entry is currently in viewport
        const entryElements = document.querySelectorAll('.timeline-item');
        for (const el of entryElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentEntry = el.id;
                return;
            }
        }
        // Default to first entry if none detected
        if (this.entries.length > 0) {
            this.currentEntry = this.entries[0].id;
        }
    }

    private detectCurrentMode(): void {
        // Check body data-view-mode attribute OR localStorage
        const storedMode = localStorage.getItem('uv7-dev-mode');
        const body = document.body;

        if (storedMode) {
            this.currentMode = storedMode;
            // Sync body if needed
            if (body.dataset.viewMode !== storedMode) {
                body.dataset.viewMode = storedMode;
                // If there's a view toggle input, sync it too
                const viewToggle = this.elements.viewToggle as HTMLInputElement;
                if (viewToggle && viewToggle.type === 'checkbox') {
                    viewToggle.checked = (storedMode === 'dev');
                }
            }
        } else {
            this.currentMode = body.dataset.viewMode || 'story';
        }
    }

    private attachSectionNavHandlers(): void {
        // Attach click handlers to all section navigation buttons
        const sectionNavButtons = document.querySelectorAll('.section-nav-item');
        sectionNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sectionClass = (button as HTMLElement).dataset.section;
                if (sectionClass) {
                    this.jumpToSection(sectionClass);
                }
            });
        });
    }

    jumpToSection(sectionClass: string): void {
        // Support Tabbed Layout
        if (window.tabController) {
            const tabId = sectionClass.replace('-section', '');
            window.tabController.navigateToTab(tabId);
            this.closeShade();
            this.closeSidebar();
            return;
        }

        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to section (account for status bar)
            const yOffset = -44; // Status bar height
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    private attachHandlers(): void {
        // Sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Sidebar home button - BELLE: Use view transition
        if (this.elements.sidebarHome) {
            this.elements.sidebarHome.addEventListener('click', () => {
                this.navigateWithTransition('../index.html');
            });
        }

        // Backdrop closes shade/sidebar
        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => {
                this.closeShade();
                this.closeSidebar();
            });
        }

        // Quick actions
        this.attachQuickActions();

        // Escape key closes shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShade();
                this.closeSidebar();
            }
        });
    }

    private attachQuickActions(): void {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = (action as HTMLElement).dataset.action;
            if (actionType) {
                action.addEventListener('click', () => this.handleQuickAction(actionType));
            }
        });
    }

    private handleQuickAction(actionType: string): void {
        // Map action types to URLs
        const actionUrls: Record<string, string> = {
            'launch-v1': '../v1/index.html',
            'launch-v2': '../index.v2.html',
            'go-home': '../index.html'
        };

        // Handle URL-based actions with view transitions
        if (actionUrls[actionType]) {
            this.navigateWithTransition(actionUrls[actionType]);
            return;
        }

        // Handle special actions
        switch (actionType) {
            case 'toggle-mode':
                const viewToggle = this.elements.viewToggle as HTMLInputElement;
                if (viewToggle) {
                    viewToggle.click();
                    setTimeout(() => {
                        this.detectCurrentMode();
                    }, 100);
                }
                break;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BELLE: VIEW TRANSITIONS - THE "NO FLICKER" PROTOCOL
    // ═══════════════════════════════════════════════════════════════

    private enableSeamlessTransitions(): void {
        // Check if browser supports View Transitions
        if (!('startViewTransition' in document)) {
            console.log('📺 View Transitions not supported - using standard navigation');
            return;
        }

        console.log('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link clicks
        window.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            const actionElement = target.closest('[data-action]');

            // Skip data-action elements (handled in handleQuickAction)
            if (actionElement) return;

            if (!link || !(link instanceof HTMLAnchorElement) || !link.href) return;

            // Only intercept local navigation (same origin)
            try {
                const targetUrl = new URL(link.href, window.location.origin);
                if (targetUrl.origin !== window.location.origin) {
                    return; // External link, let it navigate normally
                }

                // Skip in-page anchors
                if (targetUrl.pathname === window.location.pathname && targetUrl.hash) {
                    return;
                }

                // Intercept and use View Transition
                e.preventDefault();
                this.navigateWithTransition(link.href);
            } catch (err) {
                // Invalid URL, let default behavior handle it
            }
        });
    }

    private navigateWithTransition(url: string): void {
        // Fallback for browsers without View Transitions
        if (!('startViewTransition' in document)) {
            window.location.href = url;
            return;
        }

        // Start the view transition
        (document as any).startViewTransition(() => {
            window.location.href = url;
        });
    }

    private closeShade(): void {
        const shade = this.elements.shade || document.getElementById('uv7-shade');
        if (!shade) return;

        shade.classList.remove('open');
        document.body.classList.remove('uv7-no-scroll');
    }

    toggleSidebar(): void {
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        if (!sidebar) return;

        const isOpen = sidebar.classList.contains('open');
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    private openSidebar(): void {
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) return;

        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('visible');
        document.body.classList.add('uv7-no-scroll');
    }

    private closeSidebar(): void {
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) return;

        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
        document.body.classList.remove('uv7-no-scroll');
    }

    private startScrollListener(): void {
        let scrollTimeout: number;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const oldEntry = this.currentEntry;
                this.detectCurrentEntry();
                if (oldEntry !== this.currentEntry && this.currentEntry) {
                    this.saveState(this.currentEntry);
                }
            }, 200);
        }, { passive: true });
    }

    private saveState(entryId: string): void {
        sessionStorage.setItem('uv7-showcase-entry', entryId);
    }

    private restoreState(): void {
        const savedEntry = sessionStorage.getItem('uv7-showcase-entry');
        if (savedEntry) {
            // Scroll to saved entry after a brief delay
            setTimeout(() => {
                const element = document.getElementById(savedEntry);
                if (element) {
                    const yOffset = -44;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 500);
        }
    }

    private showBootToast(): void {
        const hasShown = localStorage.getItem('uv7.bootToastShown.showcase');
        if (hasShown) return;

        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('dismissing');
            setTimeout(() => toast.remove(), 300);
        }, 2000);

        localStorage.setItem('uv7.bootToastShown.showcase', 'true');
    }
}

// Initialize UV7 OS when DOM is ready
export function initUV7OS(): void {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for timeline data to be available
        if (window.TIMELINE_DATA?.entries) {
            window.uv7os = new UV7OS('showcase', {
                entries: window.TIMELINE_DATA.entries
            });
        } else {
            console.warn('⚠️ UV7 OS: Timeline data not available');
        }
    });
}

// Auto-initialize for backwards compatibility
if (typeof window !== 'undefined' && !window.uv7os) {
    initUV7OS();
}
