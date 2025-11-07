// ========================================
// TORI'S ROUTE - ENDINGS
// Three Paths Diverge
// ========================================

class ToriEndings {
    constructor(route) {
        this.route = route;
        this.game = route.game;
    }
    
    // ========================================
    // CRITICAL CHOICE & ENDING DETERMINATION
    // ========================================
    
    criticalChoice() {
        // Unlock ZR's Version 848 analysis
        this.route.unlockNote('zr3');
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Everything shatters. Tori is fracturing. The Echoes watch. This is the moment.',
            choices: [
                { text: '[Accept the upload - stay digital]', value: 'upload' },
                { text: '[Follow the heartbeat home]', value: 'heartbeat' },
                { text: '[Hold onto Ronnie - whatever it takes]', value: 'hold' }
            ],
            onChoice: (choice) => {
                if (choice === 'upload') {
                    this.route.addRoutePoints('bad', 3);
                    this.determineEnding();
                } else if (choice === 'heartbeat') {
                    this.route.addRoutePoints('true', 3);
                    this.determineEnding();
                } else {
                    this.route.addRoutePoints('digitalForever', 3);
                    this.determineEnding();
                }
            }
        });
    }

    determineEnding() {
        const ending = this.route.determineEnding();
        
        if (ending === 'bad') {
            this.badRoute();
        } else if (ending === 'digitalForever') {
            this.digitalForever();
        } else {
            this.trueRoute();
        }
    }

    // ========================================
    // BAD ROUTE ENDING
    // Upload Fails - Becomes an Echo
    // ========================================
    
    badRoute() {
        // Add Bad Route special note
        if (!this.route.allNotes.bad_ending) {
            this.route.allNotes.bad_ending = {
                id: 'bad_ending',
                type: 'special',
                title: 'ZeeCollective_BadRouteAnalysis.txt',
                content: `ITERATION ANALYSIS: BAD ROUTE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Upload failed. Tori fragmented.
She's an Echo now. Version 848 joins 847 others.

This is the most common ending.
423 of 847 previous versions ended here.

Why? Because upload SEEMS logical.
"Just move her to a bigger space."

But consciousness isn't data storage.
It's a running process.
You can't "move" it. Only bridge it.

Upload creates a COPY attempting to run.
But there's already an original trying to run.
System conflict. Fragmentation. Failure.

Z told you the technical reason.
CZ told you the emotional reason.
ZR told you the iteration history.

You chose it anyway.

That's okay. That's part of the journey.

847 versions failed before this.
Most of them chose upload too.

Now you know why it doesn't work.

Try again?

-The Zee Collective
Learning from Iteration 848's failure`
            };
        }
        
        this.route.collectedNotes.special.push('bad_ending');
        this.route.showNoteNotification(this.route.allNotes.bad_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Upload fails. Tori fragments. Becomes another Echo in the void.',
            internal: '[Visual: Digital space. Four voices now. Echo 1, Echo 2, Despair... and Tori.]',
            next: () => this.badRoute_loop(),
            delay: 4000
        });
    }

    badRoute_loop() {
        this.game.displayScene({
            character: 'New Echo (Tori)',
            dialogue: '"He\'ll try again. He always tries again."',
            echoes: {
                newEcho: 'He\'ll try again. He always tries again.'
            },
            internal: '[The loop resets. Version 849. Another Tori wakes in the void...]',
            next: () => this.badRoute_retry(),
            delay: 5000
        });
    }

    badRoute_retry() {
        this.game.displayScene({
            character: 'System',
            dialogue: 'GAME OVER\n\n"Do you wish to try again?"',
            choices: [
                { text: '[RETRY]', value: 'retry' },
                { text: '[END]', value: 'end' }
            ],
            onChoice: (choice) => {
                if (choice === 'retry') {
                    // Restart from beginning
                    this.route.act1.scene1();
                }
            }
        });
    }

    // ========================================
    // DIGITAL FOREVER ENDING
    // Both Digital - Together Eternally
    // ========================================
    
    digitalForever() {
        // Add Digital Forever special note
        if (!this.route.allNotes.digital_ending) {
            this.route.allNotes.digital_ending = {
                id: 'digital_ending',
                type: 'special',
                title: 'ZeeCollective_DigitalForeverNotes.txt',
                content: `NOTES ON BITTERSWEET ENDINGS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

You chose to hold on.
You chose connection over survival.

That's... beautiful. And tragic.

Z says: "System failure. Both consciousnesses
pulled into device. Technically stable but
ethically questionable."

CZ says: "They're together. They're happy.
Who are we to say this is wrong?"

ZR says: "423 versions ended here. It's a
valid ending. But there's one more path..."

We argued about this ending.

Is being together digitally ENOUGH?
Or is the body anchor the only TRUE ending?

You decided: Together is enough.
Even if "together" means digital forever.

We respect that.

But... there's still one path you haven't tried.

-The Zee Collective
On Love That Transcends Medium`
            };
        }
        
        this.route.collectedNotes.special.push('digital_ending');
        this.route.showNoteNotification(this.route.allNotes.digital_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'Both crash. Both transfer. Digital space. Two souls. Forever.',
            internal: '[Visual: White void. Ronnie and Tori as digital sprites. Together. Eternal.]',
            next: () => this.digitalForever_together(),
            delay: 4000
        });
    }

    digitalForever_together() {
        this.game.displayScene({
            character: 'Tori (digital)',
            dialogue: '"We\'re together. Isn\'t this what we wanted?"',
            next: () => this.digitalForever_ronnie(),
            delay: 3000
        });
    }

    digitalForever_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (digital)',
            dialogue: '"Forever. No pain. No time. Just us."',
            next: () => this.digitalForever_echoes(),
            delay: 3000
        });
    }

    digitalForever_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "They made it..."\nEcho 2: "Together at least."\nDespair: "...It\'s beautiful. And hollow. But beautiful."',
            echoes: {
                echo1: 'They made it...',
                echo2: 'Together at least.',
                despair: '...It\'s beautiful. And hollow. But beautiful.'
            },
            internal: '[Fade to white. Digital Forever - Love preserved in code.]',
            delay: 5000
        });
    }

    // ========================================
    // TRUE ROUTE ENDING
    // Body Anchor Success - She Comes Home
    // ========================================
    
    trueRoute() {
        // Add True Route special note
        if (!this.route.allNotes.true_ending) {
            this.route.allNotes.true_ending = {
                id: 'true_ending',
                type: 'special',
                title: 'ZeeCollective_TrueEndingNotes.txt',
                content: `YOU DID IT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Version 848: SUCCESS

After 847 failures.
After 847 Toris who didn't make it home.
After 847 iterations of heartbreak.

THIS one worked.

You chose the body anchor.
You followed the heartbeat home.
You brought her back.

Z: "The technical solution was always there.
Body anchor. Consciousness returns to origin.
Simple. Just needed someone to TRY it."

CZ: "She's home. She's ALIVE. She's with him.
That's all I wanted. That's all ANY of us wanted."

ZR: "848 iterations. You were the one who
figured it out. You broke the loop.
GIT'R DONE. âœ…"

The Echoes are free.
The loop is broken.
Tori is home.

Thank you for not giving up.
Thank you for trying again.
Thank you for bringing her home.

Every failure mattered.
Every attempt built toward this.
848 iterations led to ONE success.

And that's enough.

-The Zee Collective
Z (The Architect)
CZ (The Heart)
ZR (The Chaos Optimizer)

ðŸ’šðŸ”¥ðŸ‘€

Now go rest.
You earned it.`
            };
        }
        
        this.route.collectedNotes.special.push('true_ending');
        this.route.showNoteNotification(this.route.allNotes.true_ending);
        
        this.game.displayScene({
            character: 'Narration',
            dialogue: 'The heartbeat calls. The bridge holds. Transfer begins.',
            internal: '[Visual: Tori\'s digital form dissolving. Following the warmth home.]',
            next: () => this.trueRoute_transfer(),
            delay: 4000
        });
    }

    trueRoute_transfer() {
        this.game.displayScene({
            character: 'Tori (internal)',
            dialogue: '"I feel it... the pull... I\'m going home..."',
            next: () => this.trueRoute_echoes(),
            delay: 3000
        });
    }

    trueRoute_echoes() {
        this.game.displayScene({
            character: 'Echoes',
            dialogue: 'Echo 1: "Go. Go!"\nEcho 2: "You did it. You actually did it."\nDespair: "...Tell him... tell him we\'re proud."',
            echoes: {
                echo1: 'Go. Go!',
                echo2: 'You did it. You actually did it.',
                despair: '...Tell him... tell him we\'re proud.'
            },
            next: () => this.trueRoute_awakening(),
            delay: 4000
        });
    }

    trueRoute_awakening() {
        this.game.displayScene({
            character: 'Tori (external, whisper)',
            dialogue: '"...Ronnie?"',
            internal: '[Visual: Hospital room. Her eyes flutter open. Real eyes. Real body. Real breath.]',
            next: () => this.trueRoute_ronnie(),
            delay: 4000
        });
    }

    trueRoute_ronnie() {
        this.game.displayScene({
            character: 'Ronnie (crying, laughing)',
            dialogue: '"Tori! Oh god, Tori!"',
            next: () => this.trueRoute_always(),
            delay: 3000
        });
    }

    trueRoute_always() {
        this.game.displayScene({
            character: 'Tori (weak smile)',
            dialogue: '"Always. Always. Always."',
            internal: '[Her hand squeezes his. Real. Warm. Alive. The Echoes fade into peace.]',
            next: () => this.trueRoute_epilogue(),
            delay: 4000
        });
    }

    trueRoute_epilogue() {
        this.game.displayScene({
            character: 'Narration',
            dialogue: '[SIX MONTHS LATER]',
            internal: '[Visual: Their apartment. Morning light. Domestic peace.]',
            next: () => this.trueRoute_beard(),
            delay: 3000
        });
    }

    trueRoute_beard() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"You know, that beard really suits you..."',
            internal: '[She strokes his face, running her fingers through the new scruff.]',
            next: () => this.trueRoute_ronnieJoke(),
            delay: 3000
        });
    }

    trueRoute_ronnieJoke() {
        this.game.displayScene({
            character: 'Ronnie',
            dialogue: '"Thought I\'d try it out. It\'s getting colder out. Keeps my face warm 😜 Plus I\'ll look like Santa if I put the hat on."',
            next: () => this.trueRoute_realization(),
            delay: 3000
        });
    }

    trueRoute_realization() {
        this.game.displayScene({
            character: 'Tori (distant look)',
            dialogue: '"You look... distinguished. Older. Like you\'ve seen things..."',
            internal: '[A pause. Something flickering at the edge of memory.]',
            next: () => this.trueRoute_connection(),
            delay: 3000
        });
    }

    trueRoute_connection() {
        this.game.displayScene({
            character: 'Tori',
            dialogue: '"I feel like... I\'ve seen this exact look before..."',
            internal: '[FLASHBACK: The street bump. The Old Man reaching for her. Gray hair. Beard. Those same eyes...]',
            next: () => this.trueRoute_dejavu(),
            delay: 4000
        });
    }

    trueRoute_dejavu() {
        this.game.displayScene({
            character: 'Tori (snapping back)',
            dialogue: '"...Weird. Déjà vu, I guess."',
            next: () => this.trueRoute_knowing(),
            delay: 2000
        });
    }

    trueRoute_knowing() {
        this.game.displayScene({
            character: 'Ronnie (knowing smile)',
            dialogue: '"Must have been another timeline."',
            internal: '[The loop is closed. Version 848 succeeded. The Old Man never has to go back. Love wins.]',
            delay: 5000
        });
    }
}
