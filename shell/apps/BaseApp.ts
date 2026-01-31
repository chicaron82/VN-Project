/**
 * ═══════════════════════════════════════════════════════════════
 * BASE APP - ABSTRACT APP INTERFACE
 *
 * All apps must extend this class to work with UV7Shell.
 * Defines the lifecycle contract: mount(), unmount(), etc.
 * ═══════════════════════════════════════════════════════════════
 */

import type { UV7Shell } from '../UV7Shell.js';

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
    id: string;
    container: HTMLElement | null;
    mounted: boolean;
    gestureHandlers: GestureHandlers | null;

    constructor(shell: UV7Shell) {
        this.shell = shell;
        this.id = 'base';
        this.container = null;
        this.mounted = false;
        this.gestureHandlers = null;
    }

    /**
     * Mount the app into a container
     * @param container - The viewport element
     * @param params - Route parameters
     */
    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        this.container = container;
        this.mounted = true;

        // Subclasses should override this
        console.log(`[${this.id}] Mounted`);
    }

    /**
     * Unmount the app and clean up
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
     * @param params
     */
    onRouteChange(params: Record<string, any>): void {
        // Subclasses can override for deep linking
    }

    /**
     * Get the status bar configuration for this app
     */
    getStatusBarConfig(): StatusBarConfig {
        return {
            title: this.id,
            context: this.id
        };
    }

    /**
     * Get the sidebar configuration for this app
     * @returns {title, content, init} or null to use default shell sidebar
     */
    getSidebarConfig(): SidebarConfig | null {
        // Return null to keep shell's default sidebar
        return null;
    }

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
