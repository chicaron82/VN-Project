/**
 * ═══════════════════════════════════════════════════════════════
 * TORI-GATCHI APP - PET SIM MODULE
 * 
 * Wraps the original Tori-Gatchi in the UV7 Shell lifecycle.
 * Dynamically loads HTML, CSS, and scripts from Tori-Gatchi/
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

// Scripts to load in order (dependencies first)
const TORI_SCRIPTS = [
    'Tori-Gatchi/scripts/dialogue.js',
    'Tori-Gatchi/scripts/main.js',
    'Tori-Gatchi/scripts/ui.js',
    'Tori-Gatchi/scripts/feed.js',
    'Tori-Gatchi/scripts/play.js',
    'Tori-Gatchi/scripts/flirt.js',
    'Tori-Gatchi/scripts/hug.js',
    'Tori-Gatchi/scripts/gateway.js',
    'Tori-Gatchi/scripts/particles.js',
    'Tori-Gatchi/scripts/gateway-hooks.js'
];

const TORI_STYLES = [
    'Tori-Gatchi/style.css',
    'Tori-Gatchi/scripts/gateway-states.css'
];

export class TorigatchiApp extends BaseApp {
    constructor(shell) {
        super(shell);
        this.id = 'torigatchi';
        this.loadedStyles = [];
        this.loadedScripts = [];
        this.originalBodyClass = null;
        this.cleanupFunctions = [];
    }

    getStatusBarConfig() {
        return {
            title: 'Tori-gatchi',
            context: 'Tori-gatchi 💖',
            showBreadcrumb: false
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Save original body state
        this.originalBodyClass = document.body.className;

        // Load styles
        await this.loadStyles();

        // Inject HTML template
        container.innerHTML = this.getTemplate();

        // Add scoped class to container
        container.classList.add('torigatchi-viewport');

        // Load scripts in sequence
        await this.loadScriptsInOrder();

        // Manually trigger initialization since DOMContentLoaded already fired
        this.triggerInit();

        console.log('[TorigatchiApp] Mounted');
    }

    async unmount() {
        // Stop all intervals that Tori-Gatchi sets up
        this.stopIntervals();

        // Remove dynamically loaded scripts
        this.loadedScripts.forEach(script => {
            script.remove();
        });
        this.loadedScripts = [];

        // Remove dynamically loaded styles
        this.loadedStyles.forEach(link => {
            link.remove();
        });
        this.loadedStyles = [];

        // Restore body class
        if (this.originalBodyClass !== null) {
            document.body.className = this.originalBodyClass;
        }

        // Clear container class
        if (this.container) {
            this.container.classList.remove('torigatchi-viewport');
        }

        // Run custom cleanup functions
        this.cleanupFunctions.forEach(fn => {
            try { fn(); } catch (e) { console.warn('[TorigatchiApp] Cleanup error:', e); }
        });
        this.cleanupFunctions = [];

        await super.unmount();
        console.log('[TorigatchiApp] Unmounted');
    }

    async loadStyles() {
        const loadPromises = TORI_STYLES.map(href => {
            return new Promise((resolve) => {
                // Check if already loaded
                if (document.querySelector(`link[href*="${href}"]`)) {
                    resolve();
                    return;
                }

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.dataset.torigatchi = 'true';
                link.onload = resolve;
                link.onerror = () => {
                    console.warn(`[TorigatchiApp] Failed to load: ${href}`);
                    resolve();
                };
                document.head.appendChild(link);
                this.loadedStyles.push(link);
            });
        });

        await Promise.all(loadPromises);
        console.log('[TorigatchiApp] Styles loaded');
    }

    async loadScriptsInOrder() {
        for (const src of TORI_SCRIPTS) {
            // Check if script already loaded to avoid duplicates
            if (document.querySelector(`script[src="${src}"]`)) {
                console.log(`[TorigatchiApp] Script already loaded: ${src}`);
                continue;
            }

            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.dataset.torigatchi = 'true';
                script.onload = () => {
                    console.log(`[TorigatchiApp] Loaded: ${src}`);
                    resolve();
                };
                script.onerror = () => {
                    console.error(`[TorigatchiApp] Failed to load: ${src}`);
                    resolve(); // Don't block on script failure
                };
                document.body.appendChild(script);
                this.loadedScripts.push(script);
            });
        }
        console.log('[TorigatchiApp] All scripts loaded');
    }

    triggerInit() {
        // main.js sets up initializeToriGatchi on DOMContentLoaded
        // Since DOMContentLoaded already fired, we need to call it manually
        if (typeof window.initializeToriGatchi === 'function') {
            console.log('[TorigatchiApp] Calling initializeToriGatchi()');
            window.initializeToriGatchi();
        } else {
            // Fallback: trigger DOMContentLoaded-like event
            console.log('[TorigatchiApp] initializeToriGatchi not found, dispatching event');
            const event = new Event('DOMContentLoaded', {
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }
    }

    stopIntervals() {
        // Tori-Gatchi sets up intervals in initializeToriGatchi:
        // - setInterval(handleDecay, 15000)
        // - setInterval(displayRandomMemoryBubble, MEMORY_BUBBLE_INTERVAL_MS)
        // - setInterval(updateCooldownTimers, 1000)
        // 
        // Unfortunately, we can't clear them without modifying Tori-Gatchi code
        // to expose the interval IDs. For now, we'll let them run (they're lightweight)
        // and they'll fail gracefully when DOM elements are gone.
        //
        // TODO: Modify Tori-Gatchi to export interval IDs for clean shutdown
        console.log('[TorigatchiApp] Note: Tori-Gatchi intervals will continue (safe)');
    }

    getTemplate() {
        // Extracted from Tori-Gatchi/index.html <body> contents
        return `
            <div class="torigatchi-app">
                <div id="tori-container">
                    <h1>Tori-gatchi 💖</h1>

                    <div class="main-container">
                        <div class="left-panel">
                            <div id="sprite-area">
                                <img src="Tori-Gatchi/images/Happy/default.png" id="tori-sprite" alt="Tori Sprite">
                            </div>
                            <div class="meter-row">
                                <label for="love-meter">❤️ Love Level</label>
                                <progress id="love-meter" value="100" max="100"></progress>
                            </div>
                            <div class="meter-row">
                                <label for="hunger-meter">🍔 Hunger Level</label>
                                <progress id="hunger-meter" value="100" max="100"></progress>
                            </div>
                            <div class="stat-container">
                                <div class="stat-label" id="completion-label">🎯 Progress: 0%</div>
                                <meter id="completion-meter" min="0" max="100" value="0"></meter>
                            </div>
                        </div>

                        <div class="right-panel">
                            <div id="mood-display"><span id="mood-emoji">😊</span> <span id="mood-label">Happy</span></div>
                            <div id="message-box">"Hey Daddy, did you miss me? 😘"</div>

                            <div id="button-row" class="button-row">
                            </div>

                            <div id="wife-fact" class="status"></div>
                            <div id="last-seen" class="status"></div>
                            <div id="outfit-area" class="status">
                                <label for="outfit-selector">Wardrobe</label>
                                <select id="outfit-selector"></select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="shell-footer">
                        <a href="#/" class="back-link">← Back to Hub</a>
                    </div>
                </div>
            </div>
        `;
    }

    getState() {
        // Tori-Gatchi manages its own state in localStorage
        // We don't need to track it here
        return {};
    }

    restoreState(state) {
        // State is restored from localStorage automatically by Tori-Gatchi
    }
}

export default TorigatchiApp;
