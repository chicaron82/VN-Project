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

    // BOOT SEQUENCE INTEGRATION
    const bootTerminal = document.getElementById('boot-terminal');
    const splashScreen = document.getElementById('uv7-splash');

    // Check if Boot Sequence script is loaded and container exists
    // @ts-ignore
    if (bootTerminal && window.BougieBootSequence) {
        console.log("🖥️ Initiating Bougie Boot Sequence...");

        // Callback to update logo reveal if needed
        const logoRevealCallback = (percent) => {
            // Optional: update a progress bar or syncing logo animation
            // const logo = document.getElementById('uv7-logo-video');
            // if (logo) ...
        };

        // @ts-ignore
        const boot = new window.BougieBootSequence(bootTerminal, logoRevealCallback);

        // Connect game instance to boot sequence (for dynamic stats)
        boot.game = game;

        try {
            // Run boot sequence - this awaits until completion (including "online" delay)
            await boot.start();

            console.log("✅ Boot Complete. Transitioning to Menu...");

            // Fade out splash
            if (splashScreen) {
                splashScreen.style.transition = 'opacity 1s ease-out';
                splashScreen.style.opacity = '0';

                // Remove from flow after fade
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 1000);
            }

        } catch (e) {
            console.error("⚠️ Boot sequence error:", e);
            if (splashScreen) splashScreen.style.display = 'none';
        }
    } else {
        console.warn("⚠️ Boot component missing or script not loaded. Skipping sequence.");
        if (splashScreen) splashScreen.style.display = 'none';
    }

    // START GAME ENGINE
    console.log("🚂 Starting Game Engine Lifecycle...");

    game.init().catch(e => {
        console.error("🔥 CRITICAL FAILURE: Engine failed to boot.", e);
        document.body.innerHTML = `<h1 style="color:red; text-align:center; margin-top:20%;">SYSTEM FAILURE</h1><p style="text-align:center; color:#ff5555">${e.message}</p>`;
    });
});
