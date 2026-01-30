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
        console.log('🎬 renderScene called with:', sceneData);

        // Use the existing dialogue box structure
        const dialogueBox = document.getElementById('dialogue-box');
        const characterName = document.getElementById('character-name');
        const dialogueText = document.getElementById('dialogue-text');
        const internalThought = document.getElementById('internal-thought');
        const choiceMenu = document.getElementById('choice-menu');

        if (!dialogueBox || !characterName || !dialogueText) {
            console.error('❌ Dialogue box elements not found!');
            return;
        }

        // Make dialogue box visible
        dialogueBox.style.display = 'block';

        // V1 Scene Data: { dialogue, character, choices, internal }

        // 1. Set character name
        if (sceneData.character) {
            characterName.textContent = sceneData.character;
            characterName.style.display = 'block';
        } else {
            characterName.style.display = 'none';
        }

        // 2. Clear previous dialogue
        dialogueText.innerHTML = '';

        // 3. Show internal thought if present
        if (sceneData.internal) {
            internalThought.textContent = sceneData.internal;
            internalThought.style.display = 'block';
        } else {
            internalThought.style.display = 'none';
        }

        // 4. Typewriter effect for dialogue
        if (sceneData.dialogue) {
            this.typewriterV1(dialogueText, sceneData.dialogue).then(() => {
                // 5. Choices (after text finishes)
                if (sceneData.choices) {
                    this.renderChoicesV1(choiceMenu, sceneData.choices, sceneData.onChoice);
                } else if (sceneData.next) {
                    // Click to proceed
                    this.waitForClickV1(dialogueBox, sceneData.next);
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

    // ===============================================
    // V1-SPECIFIC RENDERING METHODS
    // Uses existing HTML structure (#dialogue-box, #character-name, etc.)
    // ===============================================

    typewriterV1(container, text) {
        return new Promise(resolve => {
            container.innerHTML = '';
            let i = 0;
            const speed = 50; // ms per char (V1 uses 150ms, but 50ms is more readable)

            function type() {
                if (i < text.length) {
                    container.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    waitForClickV1(element, callback) {
        const nextHandler = () => {
            document.removeEventListener('click', nextHandler);
            if (callback) callback();
        };
        setTimeout(() => document.addEventListener('click', nextHandler), 100);
    }

    renderChoicesV1(choiceMenu, choices, onChoice) {
        if (!choiceMenu) return;

        const choiceContainer = choiceMenu.querySelector('.choice-container') || choiceMenu;
        choiceContainer.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('div');
            btn.className = 'menu-option';
            btn.innerText = choice.text;
            btn.onclick = () => {
                choiceMenu.style.display = 'none';
                choiceContainer.innerHTML = '';
                onChoice(choice.value);
            };
            choiceContainer.appendChild(btn);
        });

        choiceMenu.style.display = 'block';
    }
}
