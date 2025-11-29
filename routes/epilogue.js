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
        this.shared_epilogue_01_start();
    }

    shared_epilogue_01_start() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light. Domestic peace. Tori recovered, moving freely.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_02_beard(),
            delay: 3000
        }, 'shared_epilogue_01_start');
    }

    shared_epilogue_02_beard() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You know, that beard really suits you..."',
            internal: '[She strokes his face, running her fingers through the new scruff.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_03_santa(),
            delay: 3000
        }, 'shared_epilogue_02_beard');
    }

    shared_epilogue_03_santa() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_04_realization(),
            delay: 3000
        }, 'shared_epilogue_03_santa');
    }

    shared_epilogue_04_realization() {
        this.game.displayScene({
            character: 'Tori (distant look)',
            dialogue: '"You look... distinguished. Older. Like you\'ve seen things..."',
            internal: '[A pause. Something flickering at the edge of memory.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_05_connection(),
            delay: 3000
        }, 'shared_epilogue_04_realization');
    }

    shared_epilogue_05_connection() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I feel like... I\'ve seen this exact look before..."',
            internal: '[FLASHBACK: The street bump. The Old Man reaching for her. Gray hair. Beard. Those same eyes. The BGA hoodie...]',
            background: 'assets/genericBack.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_06_dejavu(),
            delay: 4000
        }, 'shared_epilogue_05_connection');
    }

    shared_epilogue_06_dejavu() {
        this.game.displayScene({
            character: 'Tori (snapping back)',
            dialogue: '"...Weird. Déjà vu, I guess."',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.shared_epilogue_07_knowing(),
            delay: 2000
        }, 'shared_epilogue_06_dejavu');
    }

    shared_epilogue_07_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: `[The loop is closed. Version ${this.game.loopVersion} succeeded. The Old Man never has to go back. Love wins.]\n\n[Fade to white.]\n\n[Credits roll. No retry prompt. This is the escape from the loop.]`,
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => {
                // Show credits with true ending flag
                this.game.showCredits(true);
            },
            delay: 5000
        }, 'shared_epilogue_07_knowing');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Epilogue;
}
