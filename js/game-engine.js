// GAME ENGINE - Core VN functionality

class GameEngine {
    constructor() {
        this.currentScene = null;
        this.currentRoute = null;
        this.gameState = {
            routeChoice: null,  // 'ronnie' or 'tori'
            actNumber: 1,
            beatNumber: 1,
            choices: [],
            flags: {}
        };
        
        this.elements = {
            characterName: document.getElementById('character-name'),
            dialogueText: document.getElementById('dialogue-text'),
            internalThoughts: document.getElementById('internal-thoughts'),
            choiceContainer: document.getElementById('choice-container'),
            echoContainer: document.getElementById('echo-container'),
            systemMessages: document.getElementById('system-messages')
        };
    }

    // Initialize game
    init() {
        console.log('Game Engine Initialized');
        this.showRouteChoice();
    }

    // Show initial route choice (Ronnie or Tori)
    showRouteChoice() {
        this.clearDisplay();
        this.elements.dialogueText.textContent = 'Choose your perspective:';
        
        this.createChoice([
            { text: 'Ronnie (External POV)', value: 'ronnie' },
            { text: 'Tori (Internal POV)', value: 'tori' }
        ], (choice) => {
            this.gameState.routeChoice = choice;
            this.startRoute(choice);
        });
    }

    // Start selected route
    startRoute(route) {
        this.clearDisplay();
        console.log(`Starting ${route} route`);
        
        if (route === 'ronnie') {
            this.loadRonnieRoute();
        } else {
            this.loadToriRoute();
        }
    }

    // Display scene
    displayScene(scene) {
        this.currentScene = scene;
        this.clearDisplay();

        // Character name
        if (scene.character) {
            this.elements.characterName.textContent = scene.character;
        }

        // Dialogue
        if (scene.dialogue) {
            this.typeText(this.elements.dialogueText, scene.dialogue);
        }

        // Internal thoughts (Tori's route)
        if (scene.internal) {
            this.typeText(this.elements.internalThoughts, scene.internal);
        }

        // Echo Toris commentary (Tori's route only)
        if (scene.echoes) {
            this.displayEchoes(scene.echoes);
        }

        // System messages (glitches)
        if (scene.systemMessage) {
            this.showSystemMessage(scene.systemMessage);
        }

        // Choices
        if (scene.choices) {
            this.createChoice(scene.choices, (choice) => {
                this.gameState.choices.push(choice);
                scene.onChoice(choice);
            });
        }

        // Auto-advance
        if (scene.next && !scene.choices) {
            setTimeout(() => {
                scene.next();
            }, scene.delay || 3000);
        }
    }

    // Type text effect
    typeText(element, text, speed = 30) {
        element.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
            }
        }, speed);
    }

    // Display Echo Toris
    displayEchoes(echoes) {
        const echo1 = document.getElementById('echo-1');
        const echo2 = document.getElementById('echo-2');
        const echo3 = document.getElementById('echo-3');
        const despairEcho = document.getElementById('despair-echo');

        if (echoes.echo1) {
            echo1.textContent = echoes.echo1;
            echo1.classList.add('echo-appear');
        }
        if (echoes.echo2) {
            echo2.textContent = echoes.echo2;
            echo2.classList.add('echo-appear');
        }
        if (echoes.echo3) {
            echo3.textContent = echoes.echo3;
            echo3.classList.add('echo-appear');
        }
        if (echoes.despair) {
            despairEcho.textContent = echoes.despair;
            despairEcho.classList.add('echo-appear');
        }
    }

    // Create choice buttons
    createChoice(choices, callback) {
        this.elements.choiceContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button choice-reveal';
            button.textContent = choice.text;
            button.style.animationDelay = `${index * 0.2}s`;
            
            button.addEventListener('click', () => {
                callback(choice.value);
            });
            
            this.elements.choiceContainer.appendChild(button);
        });
    }

    // Show system message (glitch effect)
    showSystemMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'system-message';
        msgDiv.textContent = message;
        
        this.elements.systemMessages.appendChild(msgDiv);
        
        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    }

    // Clear display
    clearDisplay() {
        this.elements.characterName.textContent = '';
        this.elements.dialogueText.textContent = '';
        this.elements.internalThoughts.textContent = '';
        this.elements.choiceContainer.innerHTML = '';
        
        // Clear echoes
        document.querySelectorAll('.echo').forEach(echo => {
            echo.textContent = '';
            echo.classList.remove('echo-appear');
        });
    }

    // Load routes (will be defined in route files)
    loadRonnieRoute() {
        if (typeof RonnieRoute !== 'undefined') {
            new RonnieRoute(this);
        } else {
            console.error('Ronnie route not loaded');
        }
    }

    loadToriRoute() {
        if (typeof ToriRoute !== 'undefined') {
            new ToriRoute(this);
        } else {
            console.error('Tori route not loaded');
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.init();
});
