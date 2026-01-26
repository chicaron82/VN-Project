/**
 * ═══════════════════════════════════════════════════════════════
 * TORI-GATCHI APP - IFRAME WRAPPER
 *
 * Loads the Tori-gatchi pet simulator in an iframe.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

export class TorigatchiApp extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'torigatchi';
    }

    getStatusBarConfig() {
        return {
            title: 'Tori-gatchi',
            context: 'Tori-gatchi 💖'
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Load Tori-gatchi in an iframe
        container.innerHTML = `
            <div class="torigatchi-app">
                <iframe
                    src="./Tori-Gatchi/index.html"
                    style="width: 100%; height: 100vh; border: none; position: absolute; top: 0; left: 0;"
                    title="Tori-gatchi"
                ></iframe>
            </div>
        `;

        console.log('[TorigatchiApp] Mounted Tori-gatchi in iframe');
    }
}

export default TorigatchiApp;
