/**
 * 📖 RouteController
 * Manages the flow of the story.
 */
export class RouteController {
    constructor(engine) {
        this.engine = engine;
        this.currentRoute = null;
    }

    async start() {
        console.log("📖 RouteController: Starting Narrative...");
        await this.loadRoute('prologue');
    }

    async loadRoute(routeName) {
        console.log(`📖 RouteController: Loading route [${routeName}]...`);

        try {
            // Dynamic import of route modules
            // Note: In V3 Lab environment, we need to ensure the path is correct relative to this file
            const module = await import(`../routes/${routeName}.js`);
            const routeData = module.Prologue; // Assuming named export matches convention

            if (routeData) {
                await this.playScene(routeData);
            }
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
