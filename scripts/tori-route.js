// TORI'S ROUTE - Internal POV
// Trapped in code, fighting to stay herself

class ToriRoute {
    constructor(game) {
        this.game = game;
        this.startPrologue();
    }

    startPrologue() {
        // TODO: Implement Tori's prologue
        // - Waking in void
        // - Echo Toris appear
        // - Realizing she's trapped
        // - STABILIZE button sequence
        
        this.game.displayScene({
            character: 'Tori (Internal)',
            dialogue: 'Where...?',
            internal: 'Everything is dark. No... not dark. Nothing. Complete absence.',
            echoes: {
                echo1: 'Oh good. Another one.',
                echo2: 'I\'m sorry... this is going to be hard...',
                echo3: 'Welcome to the void.'
            },
            choices: [
                { text: 'Continue', value: 'continue' }
            ],
            onChoice: (choice) => {
                this.startAct1();
            }
        });
    }

    startAct1() {
        // TODO: Implement Act 1
        // - First communication attempt
        // - Echo Toris commentary
        // - Growing awareness of being trapped
        console.log('Act 1 - TO BE IMPLEMENTED');
    }

    startAct2() {
        // TODO: Implement Act 2
        // - Digital dates with glitches
        // - Memory corruption
        // - Body anchor discovery
        // - Echo Toris becoming hopeful
        console.log('Act 2 - TO BE IMPLEMENTED');
    }

    startAct3() {
        // TODO: Implement Act 3
        // - Fakeout honeymoon loop
        // - Memory overwrite horror
        // - System messages intrude
        // - Mad dash from inside device
        // - Three possible endings
        console.log('Act 3 - TO BE IMPLEMENTED');
    }
}
