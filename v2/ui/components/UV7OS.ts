/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - UNIFIED NAVIGATION SYSTEM (ORCHESTRATOR)
 * Single source of truth for UV7 ecosystem navigation
 *
 * REFACTORED: Orchestrator pattern - delegates to focused modules
 * Pattern: Thin orchestrator (~250 lines) + subdirectory modules
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Meta-Narrative + View Transitions)
 * - DiZee (Implementation + Orchestrator Refactor)
 * ═══════════════════════════════════════════════════════════════
 */

import type {
    UV7Context,
    UV7OSOptions,
    TimelineEntry
} from './UV7OSConfig';
import { Logger } from '@utils/Logger';

// Import modules
import './uv7os/UV7OSGlobals'; // Global type augmentations
import { cacheUV7OSElements, type UV7OSElements } from './uv7os/UV7OSElements';
import { UV7OSShade } from './uv7os/UV7OSShade';
import { UV7OSSidebar } from './uv7os/UV7OSSidebar';
import { UV7OSSwipeHandler } from './uv7os/UV7OSSwipeHandler';
import { UV7OSNavigation } from './uv7os/UV7OSNavigation';
import { UV7OSTimeline } from './uv7os/UV7OSTimeline';
import { UV7OSEasterEgg } from './uv7os/UV7OSEasterEgg';
import { UV7OSBootToast } from './uv7os/UV7OSBootToast';

// Global types already declared in other files - no duplicate declarations needed

// ═══════════════════════════════════════════════════════════════
// MAIN CLASS - ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

export class UV7OS {
    private context: UV7Context;
    private elements: UV7OSElements;

    // Module instances
    private shade!: UV7OSShade;
    private sidebar!: UV7OSSidebar;
    private swipeHandler!: UV7OSSwipeHandler;
    private navigation!: UV7OSNavigation;
    private timeline?: UV7OSTimeline;      // Showcase only
    private easterEgg?: UV7OSEasterEgg;    // Landing only
    private bootToast!: UV7OSBootToast;

    constructor(context: UV7Context, options: UV7OSOptions = {}) {
        this.context = context;
        this.elements = {} as UV7OSElements;
        this.init(options.entries || []);
    }

    private init(entries: TimelineEntry[]): void {
        // Step 1: Cache all DOM elements
        this.elements = cacheUV7OSElements();

        // Step 2: Initialize modules with callback dependencies
        this.initializeModules(entries);

        // Step 3: Attach event handlers
        this.attachHandlers();

        // Step 4: Context-specific initialization
        this.contextSpecificInit();

        // Step 5: Enable seamless transitions (BELLE: No flicker protocol)
        this.navigation.enableSeamlessTransitions();

        // Step 6: Boot toast
        this.bootToast.show();

        // Step 7: Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // Step 8: Persistence - Check shared dev mode state
        const storedMode = localStorage.getItem('uv7-dev-mode');
        if (storedMode) {
            document.body.dataset.viewMode = storedMode;
        }

        Logger.ui(`🚀 UV7 OS (${this.context}) initialized`);
    }

    /**
     * Initialize all module instances with callback dependencies
     */
    private initializeModules(entries: TimelineEntry[]): void {
        // Shade module
        this.shade = new UV7OSShade(this.elements, {
            context: this.context,
            closeSidebar: () => this.sidebar.close()
        });

        // Sidebar module
        this.sidebar = new UV7OSSidebar(this.elements, {
            context: this.context,
            closeShade: () => this.shade.close()
        });

        // Swipe handler (coordinates shade + sidebar)
        this.swipeHandler = new UV7OSSwipeHandler(this.shade, this.sidebar);
        this.swipeHandler.attach();

        // Navigation module
        this.navigation = new UV7OSNavigation(this.elements, {
            context: this.context,
            closeShade: () => this.shade.close(),
            closeSidebar: () => this.sidebar.close(),
            detectCurrentMode: this.context === 'showcase' ? () => this.timeline?.detectCurrentMode() : undefined
        });

        // Timeline module (showcase only)
        if (this.context === 'showcase') {
            this.timeline = new UV7OSTimeline(this.elements, entries);
            this.timeline.detectCurrentEntry();
            this.timeline.detectCurrentMode();
            this.timeline.restoreState();
            this.timeline.startScrollListener();
        }

        // Easter egg (landing only)
        if (this.context === 'landing') {
            this.easterEgg = new UV7OSEasterEgg(this.elements);
            this.easterEgg.attach();
        }

        // Boot toast
        this.bootToast = new UV7OSBootToast({ context: this.context });
    }

    /**
     * Context-specific initialization
     */
    private contextSpecificInit(): void {
        if (this.context === 'showcase') {
            // Attach section navigation handlers
            this.navigation.attachSectionNavHandlers();

            // Global event listeners (bridge to components)
            window.addEventListener('uv7-navigate', (e: Event) => {
                const customEvent = e as CustomEvent;
                if (customEvent.detail?.target) {
                    this.jumpToSection(customEvent.detail.target);
                }
            });

            window.addEventListener('uv7-action', (e: Event) => {
                const customEvent = e as CustomEvent;
                if (customEvent.detail?.action) {
                    this.navigation.handleQuickAction(customEvent.detail.action);
                }
            });
        }

        if (this.context === 'landing') {
            // Initialize app switcher
            this.navigation.initAppSwitcher();

            // V1 parity: grab handle reposition + persistence
            if (typeof UV7GrabHandleRepositioner !== 'undefined') {
                new UV7GrabHandleRepositioner(this.elements.sidebarToggle, {
                    storageKey: 'uv7-grab-handle',
                    headerSafeTop: 52,
                    bottomSafePad: 140
                });
            }
        }
    }

    /**
     * Attach all event handlers
     */
    private attachHandlers(): void {
        // Status logo click (landing only - opens app switcher)
        if (this.context === 'landing' && this.elements.statusLogo) {
            this.elements.statusLogo.addEventListener('click', () => {
                if (window.uv7AppSwitcher) {
                    window.uv7AppSwitcher.toggle();
                }
            });
        }

        // Settings button - opens shade
        if (this.elements.statusSettings) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.shade.open();
            });
        }

        // Shade close button
        if (this.elements.shadeClose) {
            this.elements.shadeClose.addEventListener('click', () => {
                this.shade.close();
            });
        }

        // Sidebar toggle button
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => {
                this.sidebar.toggle();
            });
        }

        // Sidebar home button (showcase only - navigate to landing)
        if (this.context === 'showcase' && this.elements.sidebarHome) {
            this.elements.sidebarHome.addEventListener('click', () => {
                const basePath = window.location.hostname.includes('github.io') ? '/VN-Project' : '';
                window.location.href = `${basePath}/index.html`;
            });
        }

        // Backdrop click - close shade/sidebar
        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => {
                this.shade.close();
                this.sidebar.close();
            });
        }

        // Escape key - close shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.shade.close();
                this.sidebar.close();
            }
        });

        // Quick actions
        this.navigation.attachQuickActions();
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API (PRESERVED FOR BACKWARD COMPATIBILITY)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Toggle sidebar open/closed
     * Public API - called by external code
     */
    toggleSidebar(): void {
        this.sidebar.toggle();
    }

    /**
     * Jump to a section in the page
     * Public API - called by navigation components
     */
    jumpToSection(sectionClass: string): void {
        this.navigation.jumpToSection(sectionClass);
    }

    /**
     * Show boot toast (public API for manual triggering)
     */
    showBootToastPublic(): void {
        this.bootToast.showPublic();
    }

    /**
     * Cleanup (remove event listeners, stop modules)
     */
    cleanup(): void {
        this.swipeHandler.cleanup();
        this.timeline?.cleanup();
    }
}

// ═══════════════════════════════════════════════════════════════
// FACTORY FUNCTIONS (BACKWARD COMPATIBILITY)
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize UV7OS for landing page
 */
export function initUV7OSLanding(): UV7OS {
    const uv7os = new UV7OS('landing');
    window.uv7os = uv7os;
    return uv7os;
}

/**
 * Auto-initialize UV7OS based on context
 * Called automatically on page load
 */
export function initUV7OS(): void {
    // Detect context from URL or body class
    const isShowcase = window.location.pathname.includes('showcase');
    const context: UV7Context = isShowcase ? 'showcase' : 'landing';

    const uv7os = new UV7OS(context, {
        entries: window.TIMELINE_DATA?.entries || []
    });

    window.uv7os = uv7os;
}

// Auto-init on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUV7OS);
} else {
    initUV7OS();
}
