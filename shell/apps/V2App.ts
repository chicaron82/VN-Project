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
            context: 'V2 Engine'
        });
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        await super.mount(container, params);

        // Load V2 game in an iframe
        container.innerHTML = `
            <div class="v2-app">
                <iframe
                    src="./index.v2.html"
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
                    title="Version 848 V2 Game"
                ></iframe>
            </div>
        `;

        console.log('[V2App] Mounted V2 game in iframe');
    }
}

export default V2App;
