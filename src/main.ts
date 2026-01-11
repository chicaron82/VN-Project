/**
 * Version 848 V2 - Entry Point
 *
 * Clean TypeScript rebuild of the visual novel.
 * Boot sequence: Splash → Main Menu → Game
 */

import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { MainMenu } from '@ui/screens/MainMenu';
import '@ui/styles/main.css';

// Core instances
const eventBus = new EventBus();
const stateManager = new StateManager({
    currentScene: 'none',
    currentRoute: null,
    tetherLevel: 100,
    flags: {},
    history: [],
    playtime: 0
});

// App container
const app = document.getElementById('app');
if (!app) throw new Error('No #app element found');

// Current screen reference
let currentScreen: { unmount: () => void } | null = null;

/**
 * Show Splash Screen
 */
function showSplash(): Promise<void> {
    return new Promise((resolve) => {
        // Create splash element
        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Courier New', monospace;
            color: #0f0;
        `;

        splash.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 20px #0f0;">
                    VERSION 848
                </h1>
                <div style="font-size: 1rem; color: #0a0; margin-bottom: 2rem;">
                    V2 - Clean TypeScript Rebuild
                </div>
                <div class="boot-sequence" style="font-size: 0.9rem; color: #0f0; opacity: 0.8;">
                    <div id="boot-line-1">Initializing systems...</div>
                    <div id="boot-line-2" style="opacity: 0;">Loading assets...</div>
                    <div id="boot-line-3" style="opacity: 0;">Establishing tether...</div>
                    <div id="boot-line-4" style="opacity: 0;">Ready.</div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #0f0; transition: width 0.3s;"></div>
                    </div>
                </div>
            </div>
        `;

        app!.appendChild(splash);

        // Animate boot sequence
        const progressBar = splash.querySelector('#progress-bar') as HTMLElement;
        const lines = [
            splash.querySelector('#boot-line-2') as HTMLElement,
            splash.querySelector('#boot-line-3') as HTMLElement,
            splash.querySelector('#boot-line-4') as HTMLElement,
        ];

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;

            // Show boot lines progressively
            if (progress > 25 && lines[0]) lines[0].style.opacity = '1';
            if (progress > 50 && lines[1]) lines[1].style.opacity = '1';
            if (progress > 75 && lines[2]) lines[2].style.opacity = '1';

            if (progress >= 100) {
                // Fade out and resolve
                setTimeout(() => {
                    splash.style.transition = 'opacity 0.5s';
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.remove();
                        resolve();
                    }, 500);
                }, 500);
            }
        }, 150);
    });
}

/**
 * Show Main Menu
 */
function showMainMenu() {
    if (currentScreen) {
        currentScreen.unmount();
    }

    const menu = new MainMenu(eventBus);
    menu.mount(app!);
    currentScreen = menu;

    console.log('[UV7 V2] Main Menu loaded');
}

/**
 * Handle menu navigation events
 */
function setupEventHandlers() {
    eventBus.on('ui:route_select', () => {
        console.log('[UV7 V2] Route select requested');
        // TODO: Show route selection screen
    });

    eventBus.on('ui:load_menu', () => {
        console.log('[UV7 V2] Load menu requested');
        // TODO: Show save/load screen
    });

    eventBus.on('ui:settings', () => {
        console.log('[UV7 V2] Settings requested');
        // TODO: Show settings screen
    });

    eventBus.on('ui:credits', () => {
        console.log('[UV7 V2] Credits requested');
        // TODO: Show credits screen
    });

    eventBus.on('ui:main_menu', () => {
        showMainMenu();
    });
}

/**
 * Initialize and start the app
 */
async function init() {
    console.log('[UV7 V2] Starting...');

    // Set up event handlers
    setupEventHandlers();

    // Show splash screen
    await showSplash();

    // Show main menu
    showMainMenu();

    // Debug access
    if (typeof window !== 'undefined') {
        (window as any).uv7 = {
            eventBus,
            stateManager,
            version: 'V2-alpha'
        };
        console.log('[UV7 V2] Debug: window.uv7 available');
    }
}

// Start the app
init().catch(console.error);
