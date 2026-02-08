/**
 * 🚪 Entry Point (Version 848)
 * Imports and initializes the Game Engine.
 */
import { GameEngine } from './system/game-engine.js';
import { SettingsManager } from './system/settings-manager.js';
console.log('🧪 Diagnostic: SettingsManager import test...', SettingsManager);

// Wait for DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚪 Main: DOM Ready.");

    // Initialize Engine
    const game = new GameEngine();

    // Bind global immediately for debug access
    // @ts-ignore
    window.game = game;

    // BOOT SEQUENCE INTEGRATION - TEMPORARILY DISABLED FOR DEBUGGING
    const splashScreen = document.getElementById('uv7-splash');

    // Skip boot sequence, just hide splash immediately
    console.log("⚠️ Boot sequence DISABLED for debugging. Hiding splash...");
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }

    // START GAME ENGINE
    console.log("🚂 Starting Game Engine Lifecycle...");

    game.init().catch(e => {
        console.error("🔥 CRITICAL FAILURE: Engine failed to boot.", e);
        document.body.innerHTML = `<h1 style="color:red; text-align:center; margin-top:20%;">SYSTEM FAILURE</h1><p style="text-align:center; color:#ff5555">${e.message}</p>`;
    });
});
