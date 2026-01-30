/**
 * 📖 RouteController
 * Manages the flow of the story.
 */
export class RouteController {
    constructor(engine) {
        this.engine = engine;
        this.game = engine; // Alias for V1 routes
        this.currentRoute = null;

        // Expose systems that routes expect on the controller
        this.tetherSystem = engine.tetherSystem;
        this.echoMemory = engine.echoMemory;
        this.collectiblesManager = engine.collectiblesManager;
    }

    async start() {
        console.log("📖 RouteController: Starting Narrative...");
        await this.loadRoute('prologue');
    }

    async loadRoute(routeName) {
        console.log(`📖 RouteController: Loading route [${routeName}]...`);

        try {
            // Dynamic import
            const module = await import(`../routes/${routeName}.js`);

            // Determine if it's a V1 Class or V3 JSON
            // V1 Routes export classes like { RonnieRoute }

            let routeInstance;
            const exportKey = Object.keys(module)[0];
            const RouteClass = module[exportKey];

            if (typeof RouteClass === 'function') {
                console.log(`✨ Detected V1 Route Class: ${exportKey}`);
                routeInstance = new RouteClass(this.engine); // Pass Engine (V1 routes expect game instance with displayScene)
                if (routeInstance.start) {
                    routeInstance.start();
                } else {
                    console.warn("⚠️ Route class has no start() method.");
                }
            } else if (module.Prologue || module.RonnieRoute || module.ToriRoute) {
                // Fallback for the JSON objects I created earlier
                const data = module.Prologue || module.RonnieRoute || module.ToriRoute;
                await this.playScene(data);
            }

            this.currentRoute = routeInstance;

        } catch (e) {
            console.error("❌ RouteController: Failed to load route", e);
            const stage = document.getElementById('stage');
            if (stage) stage.innerHTML = `<div class="memory-fail">ERROR: ROUTE [${routeName}] CORRUPTED<br>${e.message}</div>`;
        }
    }

    async playScene(sceneData) {
        const stage = document.getElementById('stage');
        if (!stage) return;

        stage.innerHTML = ''; // Clear stage

        // Create Dialogue Box
        const dialogBox = document.createElement('div');
        dialogBox.className = 'dialogue-box';
        stage.appendChild(dialogBox);

        for (const line of sceneData) {
            // Trigger Sensory Cue if present
            if (line.cue) {
                this.engine.visuals.trigger(line.cue);
            }

            if (line.text) {
                await this.typewriter(dialogBox, line.speaker, line.text);
            } else if (line.choice) {
                await this.presentChoice(stage, line);
            }
        }
    }

    // Render Scene passed from GameEngine adapter
    renderScene(sceneData) {
        // Clear stage
        const stage = document.getElementById('stage');
        stage.innerHTML = '';

        // Dialog Box
        const dialogBox = document.createElement('div');
        dialogBox.className = 'dialogue-box';
        stage.appendChild(dialogBox);

        // V1 Scene Data: { dialogue, character, choices, internal }

        // 1. Text
        if (sceneData.dialogue) {
            this.typewriter(dialogBox, sceneData.character, sceneData.dialogue).then(() => {
                // 2. Choices (after text finishes)
                if (sceneData.choices) {
                    this.renderChoices(stage, sceneData.choices, sceneData.onChoice);
                } else if (sceneData.next) {
                    // Click to proceed
                    this.waitForClick(stage, sceneData.next);
                }
            });
        }
    }

    waitForClick(container, callback) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        container.appendChild(cursor);

        const nextHandler = () => {
            document.removeEventListener('click', nextHandler);
            cursor.remove();
            if (callback) callback();
        };
        setTimeout(() => document.addEventListener('click', nextHandler), 100);
    }

    renderChoices(container, choices, onChoice) {
        const choiceContainer = document.createElement('div');
        choiceContainer.className = 'choice-container';

        choices.forEach(choice => {
            const btn = document.createElement('div');
            btn.className = 'menu-option';
            btn.innerText = choice.text;
            btn.onclick = () => {
                choiceContainer.remove();
                onChoice(choice.value);
            };
            choiceContainer.appendChild(btn);
        });

        container.appendChild(choiceContainer);
    }

    typewriter(container, speaker, text) {
        return new Promise(resolve => {
            container.innerHTML = `<strong>${speaker}:</strong> `;
            let i = 0;
            const speed = 30; // ms per char

            // Check for previous cursor and remove
            const oldCursor = container.querySelector('.cursor');
            if (oldCursor) oldCursor.remove();

            function type() {
                if (i < text.length) {
                    container.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Wait for click to proceed
                    const cursor = document.createElement('span');
                    cursor.className = 'cursor';
                    container.appendChild(cursor);

                    const nextHandler = () => {
                        document.removeEventListener('click', nextHandler);
                        cursor.remove();
                        resolve();
                    };
                    // Slight delay to prevent double-clicks skipping
                    setTimeout(() => document.addEventListener('click', nextHandler), 100);
                }
            }
            type();
        });
    }

    presentChoice(container, choiceData) {
        return new Promise(resolve => {
            const btn = document.createElement('div');
            btn.className = 'menu-option';
            btn.innerText = choiceData.choice;

            btn.onclick = () => {
                console.log(`Picked: ${choiceData.next}`);
                // In a real engine, we'd jump to the label 'next'.
                // For this demo, we just resolve to continue provided data
                btn.remove();
                resolve();
            };

            container.appendChild(btn);
        });
    }
}
