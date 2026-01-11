/**
 * Version 848 V2 - Entry Point
 *
 * Clean TypeScript rebuild of the visual novel.
 * Boot sequence: Splash → Main Menu → Route Select → Gameplay
 */

import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { GameEngine } from '@core/GameEngine';
import { SettingsSystem } from '@systems/SettingsSystem';
import { MainMenu } from '@ui/screens/MainMenu';
import { RouteSelect } from '@ui/screens/RouteSelect';
import { PauseScreen } from '@ui/screens/PauseScreen';
import { GameLayout } from '@ui/components/GameLayout';
import { VisualEffectsLayer } from '@ui/components/VisualEffectsLayer';
import '@ui/styles/main.css';

// ============================================
// Core Systems
// ============================================
const eventBus = new EventBus();
const stateManager = new StateManager({
    currentScene: 'none',
    currentRoute: null,
    tetherLevel: 100,
    flags: {},
    history: [],
    playtime: 0
});

const settingsSystem = new SettingsSystem(stateManager);
settingsSystem.init();

const gameEngine = new GameEngine(eventBus, stateManager);

// ============================================
// App State
// ============================================
const app = document.getElementById('app');
if (!app) throw new Error('No #app element found');

type Screen = { unmount: () => void };
let currentScreen: Screen | null = null;
let pauseScreen: PauseScreen | null = null;
let gameLayout: GameLayout | null = null;
let isPaused = false;

// ============================================
// Screen Management
// ============================================

function clearScreen() {
    if (currentScreen) {
        currentScreen.unmount();
        currentScreen = null;
    }
    // Clear app container
    app!.innerHTML = '';
}

function showSplash(): Promise<void> {
    return new Promise((resolve) => {
        const splash = document.createElement('div');
        splash.id = 'splash-screen';
        splash.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
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
                    <div id="boot-line-2" style="opacity: 0;">Loading EventBus...</div>
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

            if (progress > 25 && lines[0]) lines[0].style.opacity = '1';
            if (progress > 50 && lines[1]) lines[1].style.opacity = '1';
            if (progress > 75 && lines[2]) lines[2].style.opacity = '1';

            if (progress >= 100) {
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

function showMainMenu() {
    clearScreen();
    const menu = new MainMenu(eventBus);
    menu.mount(app!);
    currentScreen = menu;
    console.log('[UV7 V2] Main Menu');
}

function showRouteSelect() {
    clearScreen();
    const routeSelect = new RouteSelect(eventBus);
    routeSelect.mount(app!);
    currentScreen = routeSelect;
    console.log('[UV7 V2] Route Select');
}

function showSettings() {
    // Create settings overlay
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #0ff;
    `;

    const currentSettings = stateManager.get<Record<string, unknown>>('settings') ?? {};

    overlay.innerHTML = `
        <div style="max-width: 500px; width: 90%; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #0ff;">SETTINGS</h2>

            <div style="text-align: left; margin-bottom: 2rem;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="haptics-toggle" ${currentSettings.hapticsEnabled ? 'checked' : ''}
                            style="width: 20px; height: 20px;">
                        <span>Haptic Feedback</span>
                    </label>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="animations-toggle" ${currentSettings.animationsEnabled !== false ? 'checked' : ''}
                            style="width: 20px; height: 20px;">
                        <span>Animations</span>
                    </label>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Text Speed</label>
                    <input type="range" id="text-speed" min="10" max="100" value="${100 - ((currentSettings.textSpeed as number) || 30)}"
                        style="width: 100%;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Font Size</label>
                    <select id="font-size" style="width: 100%; padding: 0.5rem; background: #111; color: #0ff; border: 1px solid #0ff;">
                        <option value="normal" ${currentSettings.fontSize === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="large" ${currentSettings.fontSize === 'large' ? 'selected' : ''}>Large</option>
                        <option value="xl" ${currentSettings.fontSize === 'xl' ? 'selected' : ''}>Extra Large</option>
                    </select>
                </div>
            </div>

            <button id="settings-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
            ">CLOSE</button>
        </div>
    `;

    app!.appendChild(overlay);

    // Bind settings changes
    overlay.querySelector('#haptics-toggle')?.addEventListener('change', (e) => {
        settingsSystem.set('hapticsEnabled', (e.target as HTMLInputElement).checked);
    });

    overlay.querySelector('#animations-toggle')?.addEventListener('change', (e) => {
        settingsSystem.set('animationsEnabled', (e.target as HTMLInputElement).checked);
    });

    overlay.querySelector('#text-speed')?.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        settingsSystem.set('textSpeed', 100 - value + 10); // Invert: higher slider = faster
    });

    overlay.querySelector('#font-size')?.addEventListener('change', (e) => {
        settingsSystem.set('fontSize', (e.target as HTMLSelectElement).value as 'normal' | 'large' | 'xl');
    });

    overlay.querySelector('#settings-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    console.log('[UV7 V2] Settings');
}

function showCredits() {
    const overlay = document.createElement('div');
    overlay.id = 'credits-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #fff;
        overflow-y: auto;
        padding: 2rem;
    `;

    overlay.innerHTML = `
        <div style="max-width: 600px; text-align: center; padding-bottom: 4rem;">
            <h1 style="font-size: 2.5rem; color: #0ff; margin-bottom: 2rem;">THE UV7 CREW</h1>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Created By</h3>
                <p style="font-size: 1.2rem;">The UV7 Family</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Story & Design</h3>
                <p>Chicaron82</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Technical Architecture</h3>
                <p>V2 TypeScript Rebuild</p>
                <p style="color: #888; font-size: 0.9rem;">Clean code, type safety, maintainability</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">AI Collaboration</h3>
                <p>Claude (Anthropic)</p>
                <p style="color: #888; font-size: 0.9rem;">Pair programming partner</p>
            </div>

            <div style="margin-bottom: 3rem; padding: 1rem; border: 1px solid #333;">
                <p style="color: #888; font-style: italic;">
                    "847 failures. This is attempt 848."
                </p>
            </div>

            <button id="credits-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
                margin-top: 2rem;
            ">BACK TO MENU</button>
        </div>
    `;

    app!.appendChild(overlay);

    overlay.querySelector('#credits-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    console.log('[UV7 V2] Credits');
}

function showLoadMenu() {
    const overlay = document.createElement('div');
    overlay.id = 'load-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #0ff;
    `;

    // Check for saves
    const saves: string[] = [];
    for (let i = 1; i <= 5; i++) {
        const key = `v848_save_${i}`;
        const data = localStorage.getItem(key);
        saves.push(data ? `Slot ${i}: Save found` : `Slot ${i}: Empty`);
    }

    overlay.innerHTML = `
        <div style="max-width: 500px; width: 90%; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #0ff;">LOAD GAME</h2>

            <div style="margin-bottom: 2rem;">
                ${saves.map((s, i) => `
                    <div style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        border: 1px solid ${s.includes('found') ? '#0ff' : '#333'};
                        color: ${s.includes('found') ? '#0ff' : '#666'};
                        cursor: ${s.includes('found') ? 'pointer' : 'not-allowed'};
                    " class="save-slot" data-slot="${i + 1}">
                        ${s}
                    </div>
                `).join('')}
            </div>

            <p style="color: #666; margin-bottom: 2rem; font-size: 0.9rem;">
                Save system available during gameplay
            </p>

            <button id="load-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
            ">BACK</button>
        </div>
    `;

    app!.appendChild(overlay);

    overlay.querySelector('#load-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    console.log('[UV7 V2] Load Menu');
}

// ============================================
// Gameplay
// ============================================

function startGame(route: 'ronnie' | 'tori') {
    clearScreen();

    stateManager.set('currentRoute', route);
    stateManager.set('tetherLevel', 100);

    // Create game layout
    gameLayout = new GameLayout('app', eventBus);

    // Create effects layer (attaches to DOM via constructor)
    if (gameLayout) {
        new VisualEffectsLayer(
            gameLayout.viewport,
            gameLayout.viewport,
            eventBus
        );
    }

    // Show initial dialog
    showDialog(route === 'ronnie' ? 'RONNIE' : 'TORI', getOpeningLine(route));

    // Set up gameplay
    currentScreen = {
        unmount: () => {
            const root = document.getElementById('app');
            if (root) root.innerHTML = '';
            gameLayout = null;
        }
    };

    console.log(`[UV7 V2] Starting game: ${route} route`);
}

function getOpeningLine(route: 'ronnie' | 'tori'): string {
    if (route === 'ronnie') {
        return "Day 847. She's still not waking up. The doctors say the same thing every time - 'We're monitoring her condition.' But I know there's something else going on. Something in the code...";
    } else {
        return "Where am I? The last thing I remember was... pain. Then nothing. Now this void. These numbers streaming past. And his voice, somewhere far away, calling my name...";
    }
}

function showDialog(speaker: string, text: string) {
    if (!gameLayout) return;

    gameLayout.dialogName.textContent = speaker;
    gameLayout.dialogName.style.color = speaker === 'RONNIE' ? '#0ff' : '#f0f';

    // Typewriter effect
    gameLayout.dialogText.textContent = '';
    let i = 0;
    const speed = settingsSystem.get('textSpeed') || 30;

    const typeInterval = setInterval(() => {
        if (i < text.length) {
            gameLayout!.dialogText.textContent += text[i];
            i++;
        } else {
            clearInterval(typeInterval);
            // Show continue indicator
            gameLayout!.dialogText.innerHTML += '<span style="opacity: 0.5; margin-left: 1rem;">▼</span>';
        }
    }, speed);
}

function togglePause() {
    if (!gameLayout) return; // Not in gameplay

    isPaused = !isPaused;

    if (isPaused) {
        pauseScreen = new PauseScreen(eventBus);
        pauseScreen.mount(app!);
    } else {
        pauseScreen?.unmount();
        pauseScreen = null;
    }
}

// ============================================
// Event Handlers
// ============================================

function setupEventHandlers() {
    // Navigation
    eventBus.on('ui:route_select', showRouteSelect);
    eventBus.on('ui:main_menu', showMainMenu);
    eventBus.on('ui:settings', showSettings);
    eventBus.on('ui:credits', showCredits);
    eventBus.on('ui:load_menu', showLoadMenu);

    // Gameplay
    eventBus.on('ui:start_game', (data) => {
        startGame(data.route);
    });

    eventBus.on('ui:pause_toggle', togglePause);

    // Tether changes
    eventBus.on('tether:change', (data) => {
        if (gameLayout) {
            gameLayout.updateTether(data.level);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameLayout) {
            togglePause();
        }
    });

    // Click feedback
    eventBus.on('ui:click', () => {
        if (navigator.vibrate) navigator.vibrate(10);
    });

    eventBus.on('ui:confirm', () => {
        if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
    });

    eventBus.on('ui:denied', () => {
        if (navigator.vibrate) navigator.vibrate([50, 20, 50]);
    });
}

// ============================================
// Initialize
// ============================================

async function init() {
    console.log('[UV7 V2] Starting...');

    // Initialize game engine
    await gameEngine.init();

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
            gameEngine,
            settingsSystem,
            version: 'V2-beta',
            // Debug helpers
            showRoute: showRouteSelect,
            showMenu: showMainMenu,
            startGame,
        };
        console.log('[UV7 V2] Debug: window.uv7 available');
    }
}

// Start the app
init().catch(console.error);
