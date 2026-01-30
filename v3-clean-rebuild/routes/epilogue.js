export class Epilogue {
    constructor(game, fromRoute = 'ronnie') {
        this.game = game;
        this.fromRoute = fromRoute;
    }

    start() {
        this.trueRoute_epilogue();
    }

    trueRoute_epilogue() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light. Domestic peace. Tori recovered, moving freely.]',
            background: '../assets/apartment.png',
            sprites: {
                left: '../assets/full-sprite-tori.webp',
                right: '../assets/full-sprite-ronnie.webp'
            },
            next: () => this.trueRoute_chicharon(),
            delay: 3000
        }, 'trueRoute_epilogue');
    }

    trueRoute_chicharon() {
        this.game.displayScene({
            character: 'Tori (whispered)',
            dialogue: '"...Chicharon?"',
            internal: '[The word slips out. She doesn\'t know why. It feels right. It feels like home.]',
            background: '../assets/apartment.png',
            next: () => this.trueRoute_knowing(),
            delay: 3000
        }, 'trueRoute_chicharon');
    }

    trueRoute_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: '[The loop is closed. Love wins.]',
            background: '../assets/apartment.png',
            next: () => {
                // Game Over / Credits
                this.game.showRouteSelect();
            },
            delay: 5000
        }, 'trueRoute_knowing');
    }
}
