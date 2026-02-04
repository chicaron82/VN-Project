/**
 * ═══════════════════════════════════════════════════════════════
 * BASE APP - ABSTRACT APP INTERFACE
 *
 * All apps must extend this class to work with UV7Shell.
 * Defines the lifecycle contract: mount(), unmount(), etc.
 * ═══════════════════════════════════════════════════════════════
 */

import type { UV7Shell } from '../UV7Shell.js';
import type { SystemAPI } from '../../types/chrome.js';

export interface StatusBarConfig {
    title: string;
    context: string;
}

export interface SidebarConfig {
    title: string;
    content: string | HTMLElement;
    init?: () => void;
}

export interface GestureHandlers {
    [key: string]: (event: any) => void;
}

export class BaseApp {
    shell: UV7Shell;
    api: SystemAPI | null;  // Controlled API for chrome manipulation
    id: string;
    container: HTMLElement | null;
    mounted: boolean;
    gestureHandlers: GestureHandlers | null;

    constructor(shell: UV7Shell) {
        this.shell = shell;
        this.api = null;  // Set by shell after mount
        this.id = 'base';
        this.container = null;
        this.mounted = false;
        this.gestureHandlers = null;
    }

    /**
     * Mount the app into a container
     *
     * Called when the app is loaded and should render its UI.
     * Subclasses should override to implement custom mounting logic.
     *
     * @param container - The viewport element to render into
     * @param params - Route parameters from the URL (e.g., { phase: '42' })
     *
     * @example
     * async mount(container, params) {
     *   await super.mount(container, params);
     *   container.innerHTML = '<div>My App</div>';
     * }
     */
    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        this.container = container;
        this.mounted = true;

        // Subclasses should override this
        console.log(`[${this.id}] Mounted`);
    }

    /**
     * Unmount the app and clean up resources
     *
     * Called when the app is being unloaded (switching to another app).
     * Override to clean up event listeners, timers, intervals, etc.
     *
     * @example
     * async unmount() {
     *   clearInterval(this.myInterval);
     *   window.removeEventListener('resize', this.handleResize);
     *   await super.unmount();
     * }
     */
    async unmount(): Promise<void> {
        // Clean up event listeners, timers, etc.
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.mounted = false;

        console.log(`[${this.id}] Unmounted`);
    }

    /**
     * Called when route parameters change without full remount
     *
     * Use this for handling deep linking within your app without
     * a full unmount/remount cycle.
     *
     * @param params - Updated route parameters
     *
     * @example
     * onRouteChange(params) {
     *   if (params.phase) {
     *     this.navigateToPhase(params.phase);
     *   }
     * }
     */
    onRouteChange(params: Record<string, any>): void {
        // Subclasses can override for deep linking
    }

    /**
     * Get the status bar configuration for this app
     *
     * Override to customize the status bar title and context display.
     *
     * @returns Status bar configuration with title and optional breadcrumbs
     *
     * @example
     * getStatusBarConfig() {
     *   return {
     *     title: 'My App',
     *     context: 'Section Name',
     *     showBreadcrumb: true,
     *     breadcrumbPath: ['Home', 'Settings', 'Account']
     *   };
     * }
     */
    getStatusBarConfig(): StatusBarConfig {
        return {
            title: this.id,
            context: this.id
        };
    }

    /**
     * Get the sidebar configuration for this app
     *
     * Override to provide custom sidebar content.
     * Return null to use the default shell sidebar.
     *
     * @returns Sidebar configuration or null for default
     *
     * @example
     * getSidebarConfig() {
     *   return {
     *     title: '📖 Navigation',
     *     content: '<button>Section 1</button>',
     *     init: () => {
     *       document.querySelector('button').onclick = () => alert('Clicked!');
     *     }
     *   };
     * }
     */
    getSidebarConfig(): SidebarConfig | null {
        // Return null to keep shell's default sidebar
        return null;
    }

    /**
     * Get status bar spec (Phase 2)
     * 
     * Optional method for apps to provide declarative status bar configuration
     * with actions, theme, and mode. Replaces getStatusBarConfig().
     * 
     * @returns StatusBarSpec with title, context, actions, theme, and mode
     * 
     * @example
     * getStatusBarSpec() {
     *   return {
     *     title: 'My App',
     *     context: 'Ready',
     *     actions: [
     *       { id: 'myapp:settings', icon: '⚙️', label: 'Settings' }
     *     ],
     *     theme: {
     *       primaryColor: '#6366f1',
     *       accentColor: '#818cf8'
     *     }
     *   };
     * }
     */
    getStatusBarSpec?(): any; // Using 'any' to avoid circular import

    /**
     * Get sidebar spec (Phase 2)
     * 
     * Optional method for apps to provide declarative sidebar configuration
     * with sections, items, and action routing.
     * 
     * @returns SidebarSpec with sections array
     * 
     * @example
     * getSidebarSpec() {
     *   return {
     *     sections: [
     *       {
     *         title: 'Navigation',
     *         items: [
     *           { type: 'button', icon: '🏠', label: 'Home', actionId: 'app:home' }
     *         ]
     *       }
     *     ]
     *   };
     * }
     */
    getSidebarSpec?(): any; // Using 'any' to avoid circular import

    /**

     * Get current app state for persistence
     */
    getState(): Record<string, any> {
        return {};
    }

    /**
     * Restore app from saved state
     * @param state
     */
    restoreState(state: Record<string, any>): void {
        // Subclasses implement
    }
}

export default BaseApp;
