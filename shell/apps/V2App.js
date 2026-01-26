/**
 * ═══════════════════════════════════════════════════════════════
 * V2 APP - IFRAME WRAPPER
 *
 * Loads the V2 TypeScript rebuild in an iframe.
 * Integrates with Vite dev server and production builds.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

export class V2App extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'v2';
    }

    getStatusBarConfig() {
        return {
            title: 'Version 848 (V2)',
            context: 'V2 Engine'
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Load V2 game in an iframe
        container.innerHTML = `
            <div class="v2-app">
                <iframe
                    src="./index.v2.html"
                    style="width: 100%; height: 100vh; border: none; position: absolute; top: 0; left: 0;"
                    title="Version 848 V2 Game"
                ></iframe>
            </div>
        `;

        console.log('[V2App] Mounted V2 game in iframe');
    }
}

export default V2App;
