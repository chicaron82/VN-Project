/**
 * V1 Macro Driver
 * 
 * Executes deterministic replay scripts on the Legacy/V1 engine.
 * Matches V2 MacroRunner interface.
 */

(function () {
    console.log('🤖 [V1 Driver] Initializing Macro Driver...');

    window.macroRunner = {
        isRunning: false,

        async run(macroUrl) {
            if (this.isRunning) return;
            this.isRunning = true;

            console.log(`🤖 [V1 Driver] Loading ${macroUrl}...`);

            try {
                // Load Macro JSON
                const response = await fetch(macroUrl);
                const steps = await response.json();

                console.log(`🤖 [V1 Driver] Starting execution (${steps.length} steps)`);

                // Start Telemetry
                if (window.telemetry) window.telemetry.start();

                for (const step of steps) {
                    console.log(`➡️ Step: ${step.id} (${step.desc || step.action})`);
                    await this.executeStep(step);
                }

                console.log('✅ [V1 Driver] Execution Complete');
                if (window.telemetry) {
                    window.telemetry.stop();
                    window.telemetry.download(); // Auto-download for diffing
                }

            } catch (error) {
                console.error('❌ [V1 Driver] Failed:', error);
                if (window.telemetry) window.telemetry.stop();
            } finally {
                this.isRunning = false;
            }
        },

        async executeStep(step) {
            switch (step.action) {
                case 'wait':
                    await this.wait(step.ms || 1000);
                    break;

                case 'click':
                    this.click(step.selector);
                    break;

                case 'click_viewport':
                    // V1 often catches clicks on document body or #game-container
                    document.body.click();
                    // Or specifically the dialogue box if visible
                    const db = document.getElementById('dialogue-box');
                    if (db && db.style.display !== 'none') db.click();
                    break;

                case 'click_route_start':
                    // V1 Route Selection
                    // If visual cues (V1) use specific elements
                    // Based on index.html analysis:
                    // <div class="loop-route-option" data-route="ronnie">
                    // <div class="route-portrait ronnie-portrait" data-route="ronnie">
                    const routeBtn = document.querySelector(`[data-route="${step.route}"]`);
                    if (routeBtn) {
                        routeBtn.click();
                    } else if (window.game) {
                        // Fallback to programmatic start
                        // This depends on V1 API, likely game.startRoute(route)
                        console.warn('⚠️ [V1 Driver] Route button not found, trying programmatic fallback currently unsupported');
                    }
                    break;

                case 'wait_for_text':
                    await this.waitForText(step.text);
                    break;

                case 'wait_for_scene':
                    await this.waitForScene(step.sceneId);
                    break;
            }
        },

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        click(selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
            } else {
                console.warn(`⚠️ [V1 Driver] Element ${selector} not found`);
            }
        },

        waitForText(text) {
            return new Promise(resolve => {
                const check = () => {
                    if (document.body.innerText.includes(text)) {
                        resolve();
                    } else {
                        setTimeout(check, 200);
                    }
                };
                check();
            });
        },

        waitForScene(sceneId) {
            return new Promise(resolve => {
                const check = () => {
                    if (window.game && window.game.currentScene === sceneId) {
                        resolve();
                    } else {
                        setTimeout(check, 200);
                    }
                };
                check();
            });
        }
    };
})();
