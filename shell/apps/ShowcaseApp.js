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

        // Hide shell's sidebar toggle - showcase has its own
        document.body.classList.add('app-has-own-sidebar');

        // Load current showcase in an iframe
        container.innerHTML = `
            <div class="showcase-app" style="width: 100%; height: 100vh; overflow: hidden; position: relative;">
                <iframe
                    src="./showcase/index.html"
                    style="width: 100%; height: 100%; border: none; display: block;"
                    title="UV7 Showcase"
                ></iframe>
            </div>
        `;

        console.log('[ShowcaseApp] Mounted showcase in iframe');
    }

    async unmount() {
        // Restore shell's sidebar toggle
        document.body.classList.remove('app-has-own-sidebar');
        await super.unmount();
    }
}

export default ShowcaseApp;
