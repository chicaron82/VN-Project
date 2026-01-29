/**
 * 🚪 Entry Point (Version 848)
 * Imports and initializes the Game Engine.
 */
import { GameEngine } from './system/game-engine.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚪 Main: DOM Ready. Booting Engine...");

    // Initialize Engine
    const game = new GameEngine();

    // Start Sequence
    game.init().catch(e => {
        console.error("🔥 CRITICAL FAILURE: Engine failed to boot.", e);
        document.body.innerHTML = `<h1 style="color:red">SYSTEM FAILURE</h1><p>${e.message}</p>`;
    });
});
