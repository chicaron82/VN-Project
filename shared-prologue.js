// SHARED PROLOGUE
// Plays BEFORE route selection
// Shows: Street Bump → Home → The Fall
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
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'I wasn\'t looking where I was going...',
            internal: '[Visual: Sunny street, midday. Cafés in the background. Tori walks with a coffee cup in hand, distracted by her Tamagotchi.]',
            next: () => this.scene1_bump(),
            delay: 3000
        });
    }
    
    scene1_bump() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Oh my gosh, I\'m so sorry—I wasn\'t paying attention!',
            internal: '[She bumps into an older man. Both their Tamagotchis tumble to the ground. Hers scuffs, his looks worn, modified.]',
            next: () => this.scene1_pickup(),
            delay: 3000
        });
    }
    
    scene1_pickup() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '...Weird. Mine never does that.',
            internal: '[She bends down, picks up his Tamagotchi by mistake. The toy buzzes in her hand.]',
            next: () => this.scene1_oldMan(),
            delay: 3000
        });
    }
    
    scene1_oldMan() {
        this.game.displayScene({
            character: 'Older Man',
            dialogue: 'No problem. Hang on to that. It may save your life someday.',
            internal: '[She glances up but never clearly sees his face. Camera catches a glimpse of his faded BGA hoodie on his chest. He walks away, clutching her original Tamagotchi.]',
            next: () => this.scene1_end(),
            delay: 3500
        });
    }
    
    scene1_end() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '...What a strange thing to say.',
            next: () => this.scene2_home(),
            delay: 3000
        });
    }
    
    // ========================================
    // SCENE 2: HOME - BEFORE THE FALL
    // UPDATED: Expanded battery drain dialogue
    // ========================================
    
    scene2_home() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'Hey, can you take a look at my Ronnie-gatchi? I just changed the battery and it\'s already half-drained. I dropped it earlier, but... I don\'t think that\'s it.',
            internal: '[Cut: Tori enters her home. Ronnie is at his laptop, deep in dev mode.]',
            next: () => this.scene2_ronnieResponse(),
            delay: 4000
        });
    }
    
    scene2_ronnieResponse() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'ya sure i can look at it. why do you call it that anyway?',
            next: () => this.scene2_toriExplains(),
            delay: 2500
        });
    }
    
    scene2_toriExplains() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'oh you know because this thing is sooo cute. and what better way to name it than after my man - who\'s even cuter!',
            next: () => this.scene2_ronnieTeases(),
            delay: 3000
        });
    }
    
    scene2_ronnieTeases() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'you\'re such a dork, honey',
            next: () => this.scene2_toriDinner(),
            delay: 2000
        });
    }
    
    scene2_toriDinner() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: 'yea but you still love me. i\'ll get dinner started',
            internal: '[She smiles, sets the buzzing Tamagotchi on his laptop (resting against the keyboard). Leans in, gives him a quick kiss.]',
            next: () => this.scene2_kitchen(),
            delay: 2500
        });
    }
    
    scene2_kitchen() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '',
            internal: '[She turns, walking backwards playfully toward the kitchen, not noticing his shoe on the floor.]',
            next: () => this.scene2_warning(),
            delay: 2000
        });
    }
    
    scene2_warning() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: 'Babe, watch ou—!',
            next: () => this.scene3_fall(),
            delay: 1500
        });
    }
    
    // ========================================
    // SCENE 3: THE FALL & TRANSFER
    // ========================================
    
    scene3_fall() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'One step too late...',
            internal: '[She trips, stumbles. Crashes to the floor. Ronnie lunges to catch her but is too late.]\n[Visual: Tamagotchi, resting on the laptop, lights faintly. Screen flickers, code scrolling.]',
            next: () => this.scene3_vision(),
            delay: 3500
        });
    }
    
    scene3_vision() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '',
            internal: '[Visual: Tori fades in and out of consciousness. In one flicker, she briefly sees the older man instead of Ronnie—lined face, weary, BGA hoodie. Then back to young Ronnie. Her hand reaches weakly for him before everything goes dark.]',
            next: () => this.prologueComplete(),
            delay: 4000
        });
    }
    
    // ========================================
    // PROLOGUE COMPLETE - ROUTE SELECTION
    // ========================================
    
    prologueComplete() {
        // Show route selection screen
        // This is where player chooses Ronnie or Tori route
        this.game.showRouteSelect();
    }
}

// Export for game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedPrologue;
}
