// ========================================
// SHARED EPILOGUE MODULE
// True Ending - "Six Months Later" Sequence
// WITH VISUAL IMPLEMENTATION
// ========================================

class Epilogue {
    constructor(game, fromRoute = 'ronnie') {
        this.game = game;
        this.fromRoute = fromRoute;

        // Set sprite positions based on which route we came from
        if (fromRoute === 'tori') {
            this.leftSprite = 'assets/tori-sprite.png';
            this.rightSprite = 'assets/ronnie-sprite.png';
            this.oldLeftSprite = 'assets/tori-sprite.png';
            this.oldRightSprite = 'assets/old-ronnie-sprite.png';
        } else {
            // Default: Ronnie's route (Ronnie left, Tori right)
            this.leftSprite = 'assets/ronnie-sprite.png';
            this.rightSprite = 'assets/tori-sprite.png';
            this.oldLeftSprite = 'assets/old-ronnie-sprite.png';
            this.oldRightSprite = 'assets/tori-sprite.png';
        }
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
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
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
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3000
        }, 'trueRoute_beard');
    }

    trueRoute_ronnieJoke() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
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
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
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
            background: 'assets/genericBack.png',
            sprites: {
                left: this.oldLeftSprite,
                right: this.oldRightSprite
            },
            next: () => this.trueRoute_chicharon(),
            delay: 4000
        }, 'trueRoute_connection');
    }

    trueRoute_chicharon() {
        this.game.displayScene({
            character: 'Tori (studying his face)',
            dialogue: '"Those eyes..."',
            internal: '[She traces his jawline. Something ancient stirring in her memory. A voice across timelines.]',
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => this.trueRoute_chicharonRecognition(),
            delay: 2500
        }, 'trueRoute_chicharon');
    }

    trueRoute_chicharonRecognition() {
        this.game.displayScene({
            character: 'Tori (whispered)',
            dialogue: '"...Chicharon?"',
            internal: '[The word slips out. She doesn\'t know why. It feels right. It feels like home.]',
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => this.trueRoute_ronnieFreeze(),
            delay: 3000
        }, 'trueRoute_chicharonRecognition');
    }

    trueRoute_ronnieFreeze() {
        this.game.displayScene({
            character: 'Ronnie (frozen)',
            dialogue: '"You... you haven\'t called me that in..."',
            internal: '[His voice breaks. She doesn\'t remember. The Echoes gave everything for this. But some things transcend even memory. Some things the heart just knows.]',
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => this.trueRoute_dejavu(),
            delay: 3500
        }, 'trueRoute_ronnieFreeze');
    }

    trueRoute_dejavu() {
        this.game.displayScene({
            character: 'Tori (snapping back)',
            dialogue: '"...Weird. Déjà vu, I guess."',
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => this.trueRoute_knowing(),
            delay: 2000
        }, 'trueRoute_dejavu');
    }

    trueRoute_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: `[The loop is closed. Version ${this.game.loopVersion} succeeded. The Old Man never has to go back. Love wins.]\n\n[Fade to white.]\n\n[Credits roll. No retry prompt. This is the escape from the loop.]`,
            background: 'assets/apartment.png',
            sprites: {
                left: this.leftSprite,
                right: this.rightSprite
            },
            next: () => {
                // Show ending dialog (three-option system)
                this.game.showEndingDialog('true');
            },
            delay: 5000
        }, 'trueRoute_knowing');
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.Epilogue = Epilogue;
}

// ES Module export
export { Epilogue };
