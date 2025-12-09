// SHARED PROLOGUE
// Plays BEFORE route selection
// Shows: Street Bump -> Home -> The Fall
// Then player chooses Ronnie or Tori route

class SharedPrologue {
    constructor(game) {
        this.game = game;
    }
    
    start() {
        this.scene1_streetBump();
    }
    
    // ========================================
    // SCENE 1: THE STREET BUMP
    // ========================================
    
    scene1_streetBump() {
        // Apply prologue style BEFORE first scene displays
        this.game.dialogueBox.classList.add('prologue-style');
        
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'I wasn\'t looking where I was going...',
            internal: '[Sunny street, midday. Cafes line the background. Tori walks with coffee in hand, distracted by her Tamagotchi.]',
            background: 'assets/genericBack.png',
            sprites: {
                right: 'assets/tori-sprite.png'
            }, 
            next: () => this.scene1_bump()
        }, 'scene1_streetBump');
    }
    
    scene1_bump() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Oh my gosh, I\'m so sorry..I wasn\'t paying attention!',
            internal: '[She bumps into an older man. Both their Tamagotchis tumble to the ground. Hers scuffs, his looks worn, modified.]',
            next: () => this.scene1_pickup()
        }, 'scene1_bump');
    }
    
    scene1_pickup() {
        // HAPTIC: Initial double buzz when picking up modified Tamagotchi
        if (this.game.settingsManager && this.game.settingsManager.settings.hapticFeedback && navigator.vibrate) {
            // Pattern: buzz, pause, buzz (the first time she feels it)
            navigator.vibrate([100, 100, 100]);
        }

        this.game.displayScene({
            character: 'Tori',
            dialogue: '...Weird. Mine has never done that before.',
            internal: '[She bends down, picks up his Tamagotchi by mistake. The toy buzzes in her hand.]',
            next: () => this.scene1_oldMan()
        }, 'scene1_pickup');
    }
    
    scene1_oldMan() {
        this.game.displayScene({
            character: 'Old Man',
            dialogue: 'No problem. Hang on to that. It may save your life someday.',
            internal: '[She glances up but never clearly sees his face. Just a glimpse of a faded BGA hoodie. He walks away, clutching her original Tamagotchi.]',
            background: 'assets/genericBack.png',
            sprites: {
                left: 'assets/old-ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene1_end()
        }, 'scene1_oldMan');
    }
    
    scene1_end() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '...What a strange thing to say.',
            internal: '[She stands there a moment, then pockets the Tamagotchi and heads home.]',
            next: () => this.scene2_arrival()
        }, 'scene1_end');
    }
    
    // ========================================
    // SCENE 2: HOME - BEFORE THE FALL
    // UPDATED: Expanded battery drain dialogue
    // ========================================
    
    scene2_arrival() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Hey babe, I\'m home!',
            internal: '[Tori enters her home. Ronnie is at his laptop, deep in dev mode.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_ronnieGreeting()
        }, 'scene2_arrival');
    }
    
    scene2_ronnieGreeting() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'Hey honey! How was your day?',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_home()
        }, 'scene2_ronnieGreeting');
    }
    
    scene2_home() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Pretty good! Hey, can you take a look at my Ronnie-gatchi? I just changed the battery and it\'s already half-drained. I dropped it earlier, but... I don\'t think that\'s the problem',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_ronnieResponse()
        }, 'scene2_home');
    }
    
    scene2_ronnieResponse() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'Ya sure I can look at it. Why do you call it that anyway?',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_toriExplains()
        }, 'scene2_ronnieResponse');
    }
    
    scene2_toriExplains() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Oh you know because this thing is sooo cute. And what better way to name it than after my man - who\'s even cuter!',
            internal: '[She hands him the French Vanilla.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_ronnieTeases()
        }, 'scene2_toriExplains');
    }
    
    scene2_ronnieTeases() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'You\'re such a dork, honey',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_hoodieBanter()
        }, 'scene2_ronnieTeases');
    }
    
    scene2_hoodieBanter() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Says the guy wearing the TLC hoodie. Again.',
            internal: '[She tugs playfully at his sleeve.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_ronnieDefends()
        }, 'scene2_hoodieBanter');
    }
    
    scene2_ronnieDefends() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'Well, SOMEONE keeps stealing my BGA hoodie, so this is my replacement.',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_toriRebuttal()
        }, 'scene2_ronnieDefends');
    }
    
    scene2_toriRebuttal() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'You wear the TLC one anyway! So the BGA one is fair game. Besides, it looks better on me.',
            internal: '[She grins mischievously.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_toriDinner()
        }, 'scene2_toriRebuttal');
    }
    
    scene2_toriDinner() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Love you! I\'ll get dinner started',
            internal: '[She smiles, sets the buzzing Tamagotchi on his laptop (resting against the keyboard). Leans in, gives him a quick kiss.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_kitchen()
        }, 'scene2_toriDinner');
    }
    
    scene2_kitchen() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'She turns, walking backwards playfully toward the kitchen, not noticing his shoe on the floor.',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
                right: 'assets/tori-sprite.png'
            },
            next: () => this.scene2_warning()
        }, 'scene2_kitchen');
    }
    
    scene2_warning() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'Babe, watch ou..!',
            internal: '[He notices her about to trip over his shoe.]',
            background: 'assets/apartment.png',
            sprites: {
                left: 'assets/ronnie-sprite.png',
            },
            next: () => this.scene3_fall()
        }, 'scene2_warning');
    }
    
    // ========================================
    // SCENE 3: THE FALL & TRANSFER
    // ========================================
    
    scene3_fall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'One step too late... She trips. Stumbles. Crashes to the floor. Ronnie lunges to catch her but is too late. The Tamagotchi, resting on the laptop, lights faintly. The screen flickers, code scrolling.',
            next: () => this.scene3_vision()
        }, 'scene3_fall');
    }
    
    scene3_vision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Tori fades in and out of consciousness. In one flicker, she briefly sees the older man instead of Ronnie--lined face, weary, BGA hoodie. Then back to young Ronnie. Her hand reaches weakly for him before everything goes dark.',
            next: () => this.prologueComplete()
        }, 'scene3_vision');
        
        // Trigger fade sequence: Ronnie -> Old Ronnie -> Ronnie -> Fade out
        this.game.fadeSpritesSequence('left', 'assets/ronnie-sprite.png', 'assets/old-ronnie-sprite.png', 4000);
    }
    
    // ========================================
    // PROLOGUE COMPLETE - ROUTE SELECTION
    // ========================================
    
    prologueComplete() {
        // Remove prologue style before route selection
        this.game.dialogueBox.classList.remove('prologue-style');
        
        // Show route selection screen
        // This is where player chooses Ronnie or Tori route
        this.game.showRouteSelect();
    }
}

// Export for game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedPrologue;
}
