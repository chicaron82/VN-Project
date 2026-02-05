/**
 * ═══════════════════════════════════════════════════════════════
 * V2 APP - IFRAME WRAPPER
 *
 * Loads the V2 TypeScript rebuild in an iframe.
 * Integrates with Vite dev server and production builds.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp, StatusBarConfig } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { ChromePresets } from '../../types/ChromePresets.js';

export class V2App extends BaseApp {
    constructor(shell: UV7Shell) {
        super(shell);
        this.id = 'v2';
    }

    getStatusBarConfig(): StatusBarConfig {
        return {
            title: 'Version 848 (V2)',
            context: 'V2 Engine'
        };
    }

    getStatusBarSpec() {
        return ChromePresets.game({
            title: 'Version 848 (V2)',
            primaryColor: '#ff0055',
            accentColor: '#ff3377',
            context: 'V2 Engine',
            customChrome: true // V2 manages its own sidebar/shade
        });
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        await super.mount(container, params);

        // Load V2 game in an iframe
        container.innerHTML = `
            <div class="v2-app">
                <iframe
                    id="v2-iframe"
                    src="./index.v2.html"
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
                    title="Version 848 V2 Game"
                ></iframe>
            </div>
        `;

        // Create V2's custom sidebar and shade in parent DOM
        // These will be controlled by the V2 iframe via postMessage
        this.createV2Sidebar();
        this.createV2Shade();
        this.setupIframeMessaging();

        console.log('[V2App] Mounted V2 game in iframe with custom chrome in parent DOM');
    }

    private createV2Sidebar(): void {
        // Create a placeholder for V2's sidebar
        // The actual content will be injected by V2 via postMessage
        const sidebar = document.createElement('div');
        sidebar.id = 'v2-custom-sidebar';
        sidebar.className = 'v2-sidebar';
        sidebar.style.cssText = 'display: none;'; // Hidden by default
        document.body.appendChild(sidebar);
        console.log('[V2App] Created V2 custom sidebar placeholder');
    }

    private createV2Shade(): void {
        // Create a placeholder for V2's shade
        const shade = document.createElement('div');
        shade.id = 'v2-custom-shade';
        shade.className = 'v2-shade';
        shade.style.cssText = 'display: none;'; // Hidden by default
        document.body.appendChild(shade);
        console.log('[V2App] Created V2 custom shade placeholder');
    }

    private setupIframeMessaging(): void {
        // Listen for messages from V2 iframe
        window.addEventListener('message', (event) => {
            // Verify origin for security
            if (event.origin !== window.location.origin) return;

            const { type, payload } = event.data;

            switch (type) {
                case 'v2:sidebar:show':
                    document.getElementById('v2-custom-sidebar')!.style.display = 'block';
                    break;
                case 'v2:sidebar:hide':
                    document.getElementById('v2-custom-sidebar')!.style.display = 'none';
                    break;
                case 'v2:shade:show':
                    document.getElementById('v2-custom-shade')!.style.display = 'block';
                    break;
                case 'v2:shade:hide':
                    document.getElementById('v2-custom-shade')!.style.display = 'none';
                    break;
                case 'v2:sidebar:update':
                    // Update sidebar content
                    const sidebar = document.getElementById('v2-custom-sidebar');
                    if (sidebar && payload.html) {
                        sidebar.innerHTML = payload.html;
                    }
                    break;
                case 'v2:shade:update':
                    // Update shade content
                    const shade = document.getElementById('v2-custom-shade');
                    if (shade && payload.html) {
                        shade.innerHTML = payload.html;
                    }
                    break;
            }
        });
    }

    async unmount(): Promise<void> {
        // Clean up V2's custom chrome
        document.getElementById('v2-custom-sidebar')?.remove();
        document.getElementById('v2-custom-shade')?.remove();

        await super.unmount();
    }
}

export default V2App;
