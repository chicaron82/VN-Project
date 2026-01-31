import type { CodeComparison } from '../types';

interface CodeComparisonData {
    [key: string]: CodeComparison;
}

export const CODE_COMPARISONS: CodeComparisonData = {
    'state-management': {
        before: {
            title: 'V1: Global State Chaos',
            badge: 'SPAGHETTI',
            code: `// ❌ State scattered everywhere
window.gameState = {
    score: 0,
    inventory: []
};

// ... in another file ...
if (window.gameState.inventory.includes('key')) {
    // Direct mutation - hard to track!
    window.gameState.score += 10;
}

// ... in main.js ...
let currentScene = 'intro'; // Closure variable
localStorage.setItem('save', JSON.stringify(window.gameState));`
        },
        after: {
            title: 'V2: StateManager (Centralized)',
            badge: 'CLEAN',
            code: `// ✅ Single Source of Truth
class StateManager {
    private state: GameState;

    setState(partial: Partial<GameState>) {
        this.state = { ...this.state, ...partial };
        EventBus.emit('state:changed', this.state);
    }
}

// Usage
StateManager.setState({
    score: StateManager.getState().score + 10
});
// Predictable, type-safe, and debuggable`
        }
    },
    'event-handling': {
        before: {
            title: 'V1: Callback Hell',
            badge: 'TANGLED',
            code: `// ❌ Tightly coupled logic
function showMenu() {
    gameEngine.pause();
    
    // Direct dependency on UI controller
    menuController.show({
        onClose: function() {
            // Nested logic
            gameEngine.resume();
            if (gameEngine.currentScene) {
                gameEngine.refresh();
            }
        }
    });
}`
        },
        after: {
            title: 'V2: EventBus (Decoupled)',
            badge: 'MODULAR',
            code: `// ✅ Loosely coupled via events
// Component A (Request)
EventBus.emit('menu:show');

// Component B (Listener)
EventBus.on('menu:show', () => {
    GameEngine.pause();
});

// Component C (Listener)
EventBus.on('menu:closed', () => {
    GameEngine.resume();
});
// Components don't verify each other exist!`
        }
    },
    'architecture': {
        before: {
            title: 'V1: The God Object',
            badge: 'MONOLITH',
            code: `// ❌ game-engine.js (2000+ lines)
class GameEngine {
    constructor() {
        this.audio = new Audio();
        this.dialogue = [];
        this.saveSystem = {};
        // Everything initializes here
    }

    handleInput() { /* ... */ }
    render() { /* ... */ }
    save() { /* ... */ }
    load() { /* ... */ }
    // ... 50 more methods ...
}`
        },
        after: {
            title: 'V2: Modular Controllers',
            badge: 'SOLID',
            code: `// ✅ Single Responsibility
class GameEngine {
    constructor() {
        // Delegates to specialized controllers
        this.dialogue = new DialogueController();
        this.audio = new AudioController();
        this.save = new SaveController();
    }
}

// Each controller is focused and testable
class DialogueController {
    next() { /* ... */ }
}
class AudioController {
    play() { /* ... */ }
}`
        }
    }
};
