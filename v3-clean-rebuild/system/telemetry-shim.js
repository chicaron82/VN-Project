/**
 * V1 Telemetry Shim
 * 
 * Injects into the Legacy/V1 engine to record events in the same format
 * as the V2 TelemetryRecorder.
 * 
 * USAGE:
 * - Injects global `window.telemetry`
 * - Patches `GameEngine.prototype` and `localStorage`
 */

(function () {
    console.log('📼 [V1 Shim] Initializing Telemetry Shim...');

    const startTime = Date.now();
    let sequenceId = 0;
    const log = [];
    let isRecording = false;

    // Telemetry API (Matches V2)
    window.telemetry = {
        start() {
            isRecording = true;
            log.length = 0; // Clear log
            sequenceId = 0;
            this.record('telemetry:start', { timestamp: Date.now() });
            console.log('📼 [V1 Shim] Recording Started');
        },

        stop() {
            isRecording = false;
            console.log(`📼 [V1 Shim] Recording Stopped (${log.length} events)`);
        },

        record(type, payload) {
            if (!isRecording) return;

            const now = Date.now();
            const entry = {
                id: sequenceId++,
                timestamp: now,
                delta: now - startTime,
                type: type,
                payload: JSON.parse(JSON.stringify(payload)), // Detach refs
                // Simple V1 state hash (localStorage length + current scene)
                stateHash: getV1StateHash()
            };

            // Snapshot crucial state for key events
            if (['scene:load', 'choice:selected', 'save:complete'].includes(type)) {
                entry.snapshot = getV1StateSnapshot();
            }

            log.push(entry);
        },

        getLog() {
            return log;
        },

        export() {
            return JSON.stringify({
                version: 'v1-legacy',
                sessionStart: startTime,
                duration: Date.now() - startTime,
                events: log
            }, null, 2);
        },

        download(filename = 'telemetry-v1.json') {
            const data = this.export();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log(`💾 Telemetry saved to ${filename}`);
        }
    };

    // --- State Helpers ---

    function getV1StateHash() {
        // V1 stores almost everything in localStorage or game.state (StateManager)
        const scene = window.game?.currentScene || 'unknown';
        const lsLength = JSON.stringify(localStorage).length;
        return `${scene}_${lsLength}`;
    }

    function getV1StateSnapshot() {
        if (!window.game) return {};

        // Try to grab StateManager data if available
        let stateData = {};
        if (window.game.state && typeof window.game.state.getAll === 'function') {
            stateData = window.game.state.getAll();
        } else if (window.game.gameState) {
            stateData = window.game.gameState;
        }

        return {
            currentScene: window.game.currentScene,
            currentRoute: window.game.currentRoute,
            flags: stateData.flags || {},
            localStorage: { ...localStorage } // Heavy, but V1 relies on it
        };
    }

    // --- Monkey Patching ---

    function patchGameEngine() {
        // Try to find the Class Constructor
        let EngineClass = window.GameEngine;

        // Fallback: Try to infer from instance if available
        if (!EngineClass && window.game && window.game.constructor) {
            EngineClass = window.game.constructor;
            console.log('🔧 [V1 Shim] Found GameEngine via window.game instance.');
        }

        if (!EngineClass) {
            // Only warn periodically to avoid spam
            if (sequenceId % 5 === 0) {
                console.warn('⚠️ [V1 Shim] GameEngine not found. Waiting...');
            }
            setTimeout(patchGameEngine, 1000);
            return;
        }

        if (EngineClass.prototype.__shimmed) return; // Prevent double patching
        EngineClass.prototype.__shimmed = true;

        console.log('🔧 [V1 Shim] Patching GameEngine.prototype...');

        const proto = EngineClass.prototype;

        // Hook 1: Load Scene
        // V1 signature: loadScene(sceneId)
        const originalLoadScene = proto.loadScene;
        proto.loadScene = function (sceneId) {
            window.telemetry.record('scene:load', { sceneId });
            return originalLoadScene.apply(this, arguments);
        };

        // Hook 2: Select Choice
        // V1 signature: selectChoice(index)
        const originalSelectChoice = proto.selectChoice;
        proto.selectChoice = function (index) {
            window.telemetry.record('choice:selected', { index });
            return originalSelectChoice.apply(this, arguments);
        };

        // Hook 3: Show Dialogue (via Typewriter perhaps, or SceneRenderer)
        // Harder to hook deep classes. Let's try to hook 'renderScene' if it exists on GE
        // proto.renderScene might delegate to sceneRenderer.

        // Let's hook 'displayDialogue' if it exists
        // Based on game-engine.js reading, main rendering is likely in SceneRenderer

    }

    // Hook localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        window.telemetry.record('storage:set', { key, value });
        return originalSetItem.apply(this, arguments);
    };

    // Wait for main.js to populate window.GameEngine
    // system/main.js runs as a module, so we need to wait a bit or use an event
    window.addEventListener('load', () => {
        patchGameEngine();
    });

    // Also try immediately just in case
    setTimeout(patchGameEngine, 1000);

})();
