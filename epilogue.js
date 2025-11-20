// ========================================
// SHARED EPILOGUE MODULE
// True Ending - "Six Months Later" Sequence
// WITH VISUAL IMPLEMENTATION
// ========================================

class Epilogue {
    constructor(game) {
        this.game = game;
    }
    
    // ========================================
    // SHARED TRUE ENDING EPILOGUE
    // Both routes converge here after successful awakening
    // ========================================
    
    start() {
        this.trueRoute_epilogue();
    }
    
    trueRoute_epilogue() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light. Domestic peace. Tori recovered, moving freely.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_beard(),
            delay: 3000
        }, 'trueRoute_epilogue');
    }

    trueRoute_beard() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You know, that beard really suits you..."',
            internal: '[She strokes his face, running her fingers through the new scruff.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3000
        }, 'trueRoute_beard');
    }

    trueRoute_ronnieJoke() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_realization(),
            delay: 3000
        }, 'trueRoute_ronnieJoke');
    }

    trueRoute_realization() {
        this.game.displayScene({
            character: 'Tori (distant look)',
            dialogue: '"You look... distinguished. Older. Like you\'ve seen things..."',
            internal: '[A pause. Something flickering at the edge of memory.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_connection(),
            delay: 3000
        }, 'trueRoute_realization');
    }

    trueRoute_connection() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I feel like... I\'ve seen this exact look before..."',
            internal: '[FLASHBACK: The street bump. The Old Man reaching for her. Gray hair. Beard. Those same eyes. The BGA hoodie...]',
            background: 'genericBack.png',
            sprites: {
                left: 'old-ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_dejavu(),
            delay: 4000
        }, 'trueRoute_connection');
    }

    trueRoute_dejavu() {
        this.game.displayScene({
            character: 'Tori (snapping back)',
            dialogue: '"...Weird. Déjà vu, I guess."',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            next: () => this.trueRoute_knowing(),
            delay: 2000
        }, 'trueRoute_dejavu');
    }

    trueRoute_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: '[The loop is closed. Version 848 succeeded. The Old Man never has to go back. Love wins.]\n\n[Fade to white.]\n\n[Credits roll. No retry prompt. This is the escape from the loop.]',
            background: 'apartment.png',
            sprites: {
                left: 'ronnie-sprite.png',
                right: 'tori-sprite.png'
            },
            delay: 5000
        }, 'trueRoute_knowing');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Epilogue;
}
