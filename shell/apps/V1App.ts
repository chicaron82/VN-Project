/**
 * ═══════════════════════════════════════════════════════════════
 * V1 APP - IFRAME WRAPPER
 *
 * Loads the original V1 game in an iframe for isolation.
 * This preserves V1's global listeners without conflicts.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp, StatusBarConfig } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { ChromePresets } from '../../types/ChromePresets.js';
import { Logger } from '@utils/Logger';

export class V1App extends BaseApp {
    constructor(shell: UV7Shell) {
        super(shell);
        this.id = 'v1';
    }

    getStatusBarConfig(): StatusBarConfig {
        return {
            title: 'Version 848 (V1)',
            context: 'V1 Game'
        };
    }

    getStatusBarSpec() {
        // Use cinematic preset for immersive visual novel experience
        return ChromePresets.cinematic('Version 848 (V1)');
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        await super.mount(container, params);

        // Load V1 game in an iframe for isolation
        container.innerHTML = `
            <div class="v1-app">
                <iframe
                    src="./v1/index.html"
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
                    title="Version 848 V1 Game"
                ></iframe>
            </div>
        `;

        Logger.system('[V1App] Mounted V1 game in iframe');
    }
}

export default V1App;
