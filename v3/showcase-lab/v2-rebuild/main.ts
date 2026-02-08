import { EventBus } from './core/EventBus';
import { StateManager } from './core/StateManager';
import { GameEngine } from './core/GameEngine';
import { GameConfig } from './core/GameConfig';

// Systems
import { SettingsSystem } from './systems/SettingsSystem';
import { TetherSystem } from './systems/TetherSystem';
import { CollectiblesSystem } from './systems/CollectiblesSystem';
import { EchoSystem } from './systems/EchoSystem';

// UI
import { GameLayout } from './ui/GameLayout';
import { MainMenuView } from './ui/MainMenuView';

// Content
import prologueData from './content/prologue.json';

/**
 * Clean Protocol V2 - Bootstrapper
 */
async function boot() {
    console.log(`%c[V2 CLEAN PROTOCOL] Initializing System...`, 'color: #0ff; font-weight: bold;');

    // 1. Core Infrastructure
    const eventBus = new EventBus();
    const stateManager = new StateManager(eventBus);

    // 2. System Layer
    const settings = new SettingsSystem(stateManager);
    const tether = new TetherSystem(eventBus, stateManager);
    const collectibles = new CollectiblesSystem(eventBus, stateManager);
    const echo = new EchoSystem(eventBus, stateManager);

    settings.init();
    tether.init();
    collectibles.init();
    echo.init();

    // 3. Engine Layer
    const engine = new GameEngine(eventBus, stateManager);
    await engine.init();
    engine.loadRoute(prologueData);

    // 4. UI Layer
    const appRoot = document.getElementById('app');
    if (!appRoot) throw new Error('❌ #app container not found!');

    const layout = new GameLayout('app', eventBus, stateManager);
    const menu = new MainMenuView(appRoot, eventBus);

    // Hide game by default
    layout.container.style.display = 'none';
    menu.hide();

    // 5. Flow Logic
    eventBus.on('ui:start_prologue', () => {
        menu.hide();
        layout.container.style.display = 'block';
        console.log('[V2] Starting Prologue...');
        engine.loadScene('scene1_coffee');
    });

    eventBus.on('scene:complete', (data) => {
        if (data.sceneId.includes('ending')) {
            setTimeout(() => {
                layout.container.style.display = 'none';
                menu.show();
            }, 3000);
        }
    });

    // 6. Boot Sequence (Visual)
    await runBootAnimation(appRoot);
    menu.show();

    // Global Access (Debug)
    (window as any).v2 = { eventBus, stateManager, engine, settings, tether, collectibles, echo };
}

async function runBootAnimation(parent: HTMLElement) {
    const splash = document.createElement('div');
    splash.style.cssText = `
        position: absolute; inset: 0; background: #000; z-index: 1000;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: #0ff; font-family: 'Courier New', monospace; font-size: 0.9rem;
    `;
    parent.appendChild(splash);

    const lines = [
        "> INITIALIZING CLEAN_PROTOCOL_V2...",
        "> LOADING CORE_ENGINE... [OK]",
        "> CONNECTING TETHER_ARRAY... [OK]",
        "> SCANNING LOOP_MEMORY_FRAGMENTS... [OK]",
        "> SYSTEM_VERSION: 1.0.848-CLEAN",
        "> READY."
    ];

    for (const line of lines) {
        const p = document.createElement('p');
        p.textContent = line;
        p.style.margin = "5px 0";
        splash.appendChild(p);
        await new Promise(r => setTimeout(r, 400));
    }

    await new Promise(r => setTimeout(r, 500));
    splash.style.transition = 'opacity 1s';
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 1000);
}

// Start
boot().catch(err => {
    console.error('🔥 CRITICAL BOOT FAILURE:', err);
    document.body.innerHTML = `<div style="color:red; background:#000; height:100vh; padding:50px;">
        <h1>SYSTEM CRACKED</h1>
        <pre>${err.stack}</pre>
    </div>`;
});
