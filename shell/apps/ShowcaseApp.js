/**
 * ═══════════════════════════════════════════════════════════════
 * SHOWCASE APP - IFRAME WRAPPER
 *
 * Loads the current showcase documentation in an iframe.
 * The showcase has evolved way past this shell version, so we
 * iframe it like V1/V2 to ensure we're always showing the latest.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

export class ShowcaseApp extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'showcase';
    }

    getStatusBarConfig() {
        return {
            title: 'Showcase',
            context: 'Showcase',
            showBreadcrumb: true,
            breadcrumbPath: ['Showcase']
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Load current showcase in an iframe
        container.innerHTML = `
            <div class="showcase-app">
                <iframe
                    src="./showcase/index.html"
                    style="width: 100%; height: 100vh; border: none; position: absolute; top: 0; left: 0;"
                    title="UV7 Showcase"
                ></iframe>
            </div>
        `;

        console.log('[ShowcaseApp] Mounted showcase in iframe');
    }
}

export default ShowcaseApp;
