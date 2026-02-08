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
            return this.typewriter(dialogBox, sceneData.character, sceneData.dialogue).then(() => {
                // 2. Choices (after text finishes & initial click)
                if (sceneData.choices) {
                    return new Promise(resolve => {
                        this.renderChoices(dialogBox, sceneData.choices, (val) => {
                            if (sceneData.onChoice) sceneData.onChoice(val);
                            resolve();
                        });
                    });
                } else {
                    // If just text, we are done (typewriter already waited for click)
                    return Promise.resolve();
                }
            });
        } else {
            // No dialogue? Maybe internal logic or just choices
            if (sceneData.choices) {
                return new Promise(resolve => {
                    this.renderChoices(dialogBox, sceneData.choices, (val) => {
                        if (sceneData.onChoice) sceneData.onChoice(val);
                        resolve();
                    });
                });
            }
            return Promise.resolve();
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

    // ========================================
    // ROUTE SELECTION SCREEN
    // ========================================

    renderRouteSelection() {
        console.log("🔀 RouteController: Rendering Route Selection...");
        const routeSelect = this.engine.routeSelect || document.getElementById('route-select');

        if (!routeSelect) {
            console.error("❌ Link missing: #route-select not found");
            return;
        }

        // 1. Show Screen
        routeSelect.style.display = 'flex';
        // Reset opacity for fade-in
        routeSelect.style.opacity = '0';

        // Force reflow
        void routeSelect.offsetWidth;

        // Fade in
        routeSelect.style.transition = 'opacity 0.5s ease-in';
        routeSelect.style.opacity = '1';

        // 2. Initialize Logic (One-time setup)
        if (this._routeSelectInited) return;
        this._routeSelectInited = true;

        let selectedRoute = 'ronnie'; // Default

        // Elements
        const portraits = routeSelect.querySelectorAll('.route-portrait');
        const infos = routeSelect.querySelectorAll('.route-info');
        const toggles = routeSelect.querySelectorAll('.toggle-option');
        const playBtn = document.getElementById('route-play-button');
        const btnText = document.getElementById('route-name');
        const backBtn = document.getElementById('back-to-menu');
        const slider = routeSelect.querySelector('.toggle-slider');

        // Helper: Update UI
        const updateUI = (route) => {
            selectedRoute = route;

            // Toggle Slider Position
            if (slider) {
                slider.style.left = route === 'ronnie' ? '2px' : '50%';
            }

            // Portraits
            portraits.forEach(p => p.classList.toggle('active', p.dataset.route === route));

            // Info text
            infos.forEach(i => i.classList.toggle('active', i.classList.contains(`${route}-info`)));

            // Button Text
            if (btnText) btnText.innerText = route.toUpperCase();

            // Play Button Style
            if (playBtn) {
                playBtn.className = `route-button ${route}-theme`;
            }
        };

        // Event Listeners: Toggles
        toggles.forEach(toggle => {
            toggle.onclick = () => updateUI(toggle.dataset.route);
        });

        // Event Listener: Play Button
        if (playBtn) {
            playBtn.onclick = () => {
                console.log(`🚀 Starting Route: ${selectedRoute}`);
                // Hide Route Select
                routeSelect.style.opacity = '0';
                setTimeout(() => {
                    routeSelect.style.display = 'none';
                    // Start the actual route
                    this.startRoute(selectedRoute);
                }, 500);
            };
        }

        // Event Listener: Back Button
        if (backBtn) {
            backBtn.onclick = () => {
                routeSelect.style.opacity = '0';
                setTimeout(() => {
                    routeSelect.style.display = 'none';
                    if (this.engine.menuController && this.engine.menuController.showMainMenu) {
                        this.engine.menuController.showMainMenu();
                    }
                }, 500);
            };
        }
    }

    async startRoute(route) {
        // Map to filename
        // 'ronnie' -> 'ronnie-act1' (or whatever the file is)
        // 'tori' -> 'prologue' (Default start for Tori is the prologue/shared start)

        // Ensure game view is visible
        const gameView = this.engine.gameView || document.getElementById('game-view');
        if (gameView) {
            gameView.style.display = 'block';
            gameView.style.opacity = '1';
        }

        if (route === 'tori') {
            await this.loadRoute('prologue'); // Tori logic starts here
        } else {
            console.log("🚧 Ronnie route not yet fully implemented, loading prologue as placeholder");
            await this.loadRoute('prologue');
        }
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
