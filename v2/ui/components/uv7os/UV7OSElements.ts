/**
 * UV7OS ELEMENTS - CACHED DOM REFERENCES
 *
 * Central element cache shared across all UV7OS modules.
 * Cache once, use everywhere pattern.
 *
 * "One DOM query, infinite access." - The Cache
 */

/**
 * Cached DOM element references for UV7OS
 * All modules receive this as a dependency to avoid repeated queries
 */
export interface UV7OSElements {
    // Status bar elements
    statusBar: HTMLElement | null;
    statusLogo: Element | null;
    statusContext: HTMLElement | null;
    statusSettings: HTMLElement | null;

    // Notification shade elements
    shade: HTMLElement | null;
    shadeClose: Element | null;
    shadeSectionList: HTMLElement | null;

    // Sidebar elements
    sidebar: HTMLElement | null;
    sidebarToggle: HTMLElement | null;
    sidebarSectionList: HTMLElement | null;
    sidebarHome: HTMLElement | null;

    // Backdrop
    backdrop: HTMLElement | null;

    // Easter egg branding
    shadeCarrierBrand: HTMLElement | null;
    sidebarCarrierBrand: HTMLElement | null;

    // View toggle (dev/story mode)
    viewToggle: HTMLElement | null;
}

/**
 * Cache all UV7OS DOM elements
 * Called once during initialization
 */
export function cacheUV7OSElements(): UV7OSElements {
    return {
        // Status bar
        statusBar: document.getElementById('uv7-status-bar'),
        statusLogo: document.querySelector('.status-logo'),
        statusContext: document.getElementById('uv7-context'),
        statusSettings: document.getElementById('uv7-settings'),

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

        // Easter egg branding
        shadeCarrierBrand: document.getElementById('shade-carrier-brand'),
        sidebarCarrierBrand: document.getElementById('sidebar-carrier-brand'),

        // Existing page elements
        viewToggle: document.getElementById('view-toggle')
    };
}
