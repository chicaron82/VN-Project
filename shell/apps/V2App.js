/**
 * ═══════════════════════════════════════════════════════════════
 * V2 APP - VITE INTEGRATION STUB
 * 
 * Adapter for V2 game. Will integrate with Vite builds in Phase 5.
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

        container.innerHTML = `
            <div class="v2-app">
                <div class="coming-soon">
                    <h1>⚡ V2 Engine</h1>
                    <p>TypeScript rebuild coming to the Shell!</p>
                    <p>Will integrate with Vite dev server and production builds.</p>
                    <a href="#/" class="back-link">← Back to Landing</a>
                </div>
            </div>
        `;
    }
}

export default V2App;
