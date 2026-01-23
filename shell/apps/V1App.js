/**
 * ═══════════════════════════════════════════════════════════════
 * V1 APP - ADAPTER/STUB
 * 
 * Adapter for the V1 game. Will wrap the existing V1 code
 * in app lifecycle hooks in Phase 4.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

export class V1App extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'v1';
    }

    getStatusBarConfig() {
        return {
            title: 'Version 848 (V1)',
            context: 'V1 Game'
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        container.innerHTML = `
            <div class="v1-app">
                <div class="coming-soon">
                    <h1>🔥 V1 Game</h1>
                    <p>The original chaos is being adapted for the Shell!</p>
                    <p>This requires careful wrapping of V1's global listeners.</p>
                    <a href="#/" class="back-link">← Back to Landing</a>
                </div>
            </div>
        `;
    }
}

export default V1App;
