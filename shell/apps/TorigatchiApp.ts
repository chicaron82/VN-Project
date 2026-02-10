/**
 * ═══════════════════════════════════════════════════════════════
 * TORI-GATCHI APP - IFRAME WRAPPER
 *
 * Loads the Tori-gatchi pet simulator in an iframe.
 * ═══════════════════════════════════════════════════════════════
 */

import type { StatusBarConfig } from './BaseApp.js';
import { BaseApp } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { ChromePresets } from '../../types/ChromePresets.js';
import type { StatusBarSpec } from '../../types/chrome.js';
import { Logger } from '@utils/Logger';

export class TorigatchiApp extends BaseApp {
    constructor(shell: UV7Shell) {
        super(shell);
        this.id = 'torigatchi';
    }

    getStatusBarConfig(): StatusBarConfig {
        return {
            title: 'Tori-gatchi',
            context: 'Tori-gatchi 💖'
        };
    }

    getStatusBarSpec(): StatusBarSpec {
        return ChromePresets.game({
            title: 'Tori-gatchi',
            primaryColor: '#10b981',
            accentColor: '#34d399',
            context: 'Tori-gatchi 💖'
        });
    }

    async mount(container: HTMLElement, params: Record<string, string> = {}): Promise<void> {
        await super.mount(container, params);

        // Load Tori-gatchi in an iframe
        container.innerHTML = `
            <div class="torigatchi-app">
                <iframe
                    src="./Tori-Gatchi/index.html"
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"
                    title="Tori-gatchi"
                ></iframe>
            </div>
        `;

        Logger.system('[TorigatchiApp] Mounted Tori-gatchi in iframe');
    }
}

export default TorigatchiApp;
