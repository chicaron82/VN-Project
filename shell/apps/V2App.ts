/**
 * ═══════════════════════════════════════════════════════════════
 * V2 APP - IFRAME WRAPPER
 *
 * Loads the V2 TypeScript rebuild in an iframe.
 * V2 manages its own chrome (StatusBar, Sidebar, NotificationShade)
 * inside the iframe. Shell hides its chrome via customChrome flag.
 * ═══════════════════════════════════════════════════════════════
 */

import type { StatusBarConfig } from './BaseApp.js';
import { BaseApp } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { ChromePresets } from '../../types/ChromePresets.js';
import type { StatusBarSpec } from '../../types/chrome.js';
import { Logger } from '@utils/Logger';

export class V2App extends BaseApp {
    private messageHandler: ((event: MessageEvent) => void) | null = null;

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

    getStatusBarSpec(): StatusBarSpec {
        return ChromePresets.game({
            title: 'Version 848 (V2)',
            primaryColor: '#ff0055',
            accentColor: '#ff3377',
            context: 'V2 Engine',
            customChrome: true // V2 manages its own sidebar/shade/statusbar
        });
    }

    async mount(container: HTMLElement, params: Record<string, string> = {}): Promise<void> {
        await super.mount(container, params);

        // Load V2 game in an iframe — V2 creates its own chrome inside
        container.innerHTML = `
            <div class="v2-app">
                <iframe
                    id="v2-iframe"
                    src="./v2/index.html"
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
                    title="Version 848 V2 Game"
                ></iframe>
            </div>
        `;

        // Listen for navigation messages from V2 iframe
        this.messageHandler = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'v2:navigate:shell') {
                Logger.system('[V2App] Received exit-to-shell request from V2');
                window.location.hash = '#/showcase';
            }
        };
        window.addEventListener('message', this.messageHandler);

        Logger.system('[V2App] Mounted V2 game in iframe (V2 manages its own chrome)');
    }

    async unmount(): Promise<void> {
        if (this.messageHandler) {
            window.removeEventListener('message', this.messageHandler);
            this.messageHandler = null;
        }
        await super.unmount();
    }
}

export default V2App;
