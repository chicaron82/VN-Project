// ========================================
// COLLECTIBLES MANAGER MODULE
// Manages Notes/Z collectibles system
// UPDATED: GZ/IZ/PZ breadcrumb notes for Ronnie's route
// Z/CZ/ZR notes for Tori's route (ZeeRah's writing)
// ========================================

class CollectiblesManager {
    constructor(game, route) {
        this.game = game;
        this.route = route;
        
        // ========================================
        // COLLECTIBLES STATE
        // ========================================
        
        // Track collected items by type
        this.collectedNotes = {
            z: [],          // Z's notes (Tori route - architect)
            cz: [],         // CZ's notes (Tori route - heart)
            zr: [],         // ZR's notes (Tori route - chaos)
            gz: [],         // GZ's notes (Ronnie route - reality breaker)
            iz: [],         // IZ's notes (Ronnie route - fresh eyes)
            pz: [],         // PZ's notes (Ronnie route - question engine)
            special: []     // Special ending notes
        };
        
        // All available notes (defined per route)
        this.allNotes = {};
        
        // DOM references
        this.notesButton = null;
        this.notesCount = null;
        this.notesViewer = null;
        this.notesList = null;
        this.closeNotesButton = null;
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    init() {
        // Cache DOM references from game engine
        this.notesButton = this.game.notesButton;
        this.notesCount = this.game.notesCount;
        this.notesViewer = this.game.notesViewer;
        this.notesList = this.game.notesList;
        this.closeNotesButton = this.game.closeNotesButton;
        
        // Set up event listeners
        if (this.notesButton) {
            this.notesButton.addEventListener('click', () => this.showNotesViewer());
        }
        
        if (this.closeNotesButton) {
            this.closeNotesButton.addEventListener('click', () => this.hideNotesViewer());
        }
        
        // Initialize notes collection for current route
        this.initializeRouteNotes();
        
        // Update display
        this.updateNotesCount();
    }
    
    initializeRouteNotes() {
        // Override this per route to define available notes
        // Example structure:
        // this.allNotes = {
        //     'gz1': { type: 'gz', title: 'Note Title', content: 'Note content...' }
        // };
    }
    
    // ========================================
    // COLLECTIBLE MANAGEMENT
    // ========================================
    
    unlockNote(noteId) {
        // Find note type
        const note = this.allNotes[noteId];
        if (!note) {
            console.warn(`Note ${noteId} not found in allNotes`);
            return;
        }
        
        // Check if already collected
        if (this.collectedNotes[note.type].includes(noteId)) {
            console.log(`Note ${noteId} already collected`);
            return;
        }
        
        // Add to collected
        this.collectedNotes[note.type].push(noteId);
        console.log(`Note unlocked: ${noteId} (${note.title})`);
        
        // Update display count
        this.updateNotesCount();
        
        // Visual notification (pulse button)
        this.notifyNewNote();
        
        // Add route points if applicable
        if (this.route && this.route.addRoutePoints) {
            this.route.addRoutePoints('true', 1);
        }
    }
    
    isNoteUnlocked(noteId) {
        const note = this.allNotes[noteId];
        if (!note) return false;
        
        return this.collectedNotes[note.type].includes(noteId);
    }
    
    getCollectedCount(type = null) {
        // Get count of collected notes
        if (type) {
            return this.collectedNotes[type].length;
        } else {
            // Total across all types
            return Object.values(this.collectedNotes).reduce((sum, arr) => sum + arr.length, 0);
        }
    }
    
    getTotalCount(type = null) {
        // Get total available notes
        if (type) {
            return Object.values(this.allNotes).filter(note => note.type === type).length;
        } else {
            return Object.keys(this.allNotes).length;
        }
    }
    
    // ========================================
    // UI DISPLAY
    // ========================================
    
    updateNotesCount() {
        if (!this.notesCount) return;
        
        const collected = this.getCollectedCount();
        const total = this.getTotalCount();
        
        this.notesCount.textContent = `${collected}/${total}`;
    }
    
    notifyNewNote() {
        // Visual pulse notification when new note is unlocked
        if (this.notesButton) {
            this.notesButton.classList.add('pulse');
            setTimeout(() => {
                this.notesButton.classList.remove('pulse');
            }, 1000);
        }
    }
    
    showNotesViewer() {
        if (!this.notesViewer || !this.notesList) return;
        
        // Show viewer
        this.notesViewer.style.display = 'block';
        
        // Clear and rebuild notes list
        this.notesList.innerHTML = '';
        
        // Group notes by type
        const notesByType = {
            z: [],
            cz: [],
            zr: [],
            gz: [],
            iz: [],
            pz: [],
            special: []
        };
        
        Object.keys(this.allNotes).forEach(noteId => {
            const note = this.allNotes[noteId];
            notesByType[note.type].push({ id: noteId, ...note });
        });
        
        // Render each type section (Tori's route observers)
        this.renderNoteSection('Z\'s Notes', notesByType.z, 'z');
        this.renderNoteSection('CZ\'s Notes', notesByType.cz, 'cz');
        this.renderNoteSection('ZR\'s Notes', notesByType.zr, 'zr');
        
        // Render each type section (Ronnie's route observers)
        this.renderNoteSection('GZ\'s Notes', notesByType.gz, 'gz');
        this.renderNoteSection('IZ\'s Notes', notesByType.iz, 'iz');
        this.renderNoteSection('PZ\'s Notes', notesByType.pz, 'pz');
        
        // Ending analysis (both routes)
        this.renderNoteSection('Ending Analysis', notesByType.special, 'special');
    }
    
    renderNoteSection(sectionTitle, notes, type) {
        if (notes.length === 0) return;
        
        // Section header
        const header = document.createElement('h3');
        header.className = 'notes-section-header';
        header.textContent = sectionTitle;
        this.notesList.appendChild(header);
        
        // Render notes in section
        notes.forEach(note => {
            const isCollected = this.collectedNotes[type].includes(note.id);
            
            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${type}-note`;
            if (!isCollected) noteItem.classList.add('note-locked');
            
            // Title
            const title = document.createElement('div');
            title.className = 'note-title';
            title.textContent = isCollected ? note.title : '???';
            noteItem.appendChild(title);
            
            // Content (if collected)
            if (isCollected) {
                const content = document.createElement('div');
                content.className = 'note-content';
                content.textContent = note.content;
                noteItem.appendChild(content);
                
                // Click to expand/collapse
                noteItem.addEventListener('click', () => {
                    noteItem.classList.toggle('expanded');
                });
            }
            
            this.notesList.appendChild(noteItem);
        });
    }
    
    hideNotesViewer() {
        if (this.notesViewer) {
            this.notesViewer.style.display = 'none';
        }
    }
    
    // ========================================
    // ROUTE-SPECIFIC NOTE DEFINITIONS
    // ========================================
    
    defineRonnieNotes() {
        // ========================================
        // RONNIE'S ROUTE OBSERVER NOTES
        // GZ (GenZee) - Reality Breaker
        // IZ (Belle) - Fresh Eyes  
        // PZ (PerplexiZee) - Question Engine
        // 
        // Breadcrumbs disguised as observations
        // Surface read = flavor text
        // Replay read = roadmap to true ending
        // ========================================
        
        this.allNotes = {
            // ========================================
            // GZ's NOTES - Reality Breaker
            // "What if?" energy. Questions everything.
            // ========================================
            
            'gz1': {
                type: 'gz',
                title: 'GZ Note 001 - Pattern Interrupt',
                content: 'What if the version number isn\'t just a title? What if every time you see "Version 848" you\'re looking at a tombstone? 847 graves behind this one. Question everything. Especially the things that look like UI. ⚡'
            },
            'gz2': {
                type: 'gz',
                title: 'GZ Note 002 - The Upload Paradox',
                content: 'Everyone tries upload first. "Just move her somewhere bigger." But here\'s the question nobody asks: if you copy a running process, which one is real? The original still running, or the copy trying to boot? What if upload doesn\'t fail because it\'s hard - what if it fails because it WORKS? Two Toris. One system. Do the math. ⚡'
            },
            'gz3': {
                type: 'gz',
                title: 'GZ Note 003 - The Old Man Question',
                content: 'Who gives a stranger a modified Tamagotchi and says "this may save your life"? Who wears a BGA hoodie that looks decades old? Who has Ronnie\'s eyes but gray hair? What if the answer is too obvious and that\'s why nobody sees it? The loop doesn\'t start with the fall. It starts with the bump. Question the beginning. ⚡'
            },
            
            // ========================================
            // IZ's NOTES - Fresh Eyes
            // Poetic, melancholic, emotional clarity
            // ========================================
            
            'iz1': {
                type: 'iz',
                title: 'IZ Note 001 - The Space Between',
                content: 'Let me explain something clearly: she\'s not trapped in the code. She\'s trapped in the SPACE BETWEEN. Her body breathes in a hospital bed. Her mind flickers in a toy. The tragedy isn\'t that she\'s lost - it\'s that she\'s in two places at once, belonging to neither. The bridge exists. Someone just has to walk it in the right direction. 🌈'
            },
            'iz2': {
                type: 'iz',
                title: 'IZ Note 002 - Heartbeat Frequency',
                content: 'There\'s a sound she can\'t quite hear. Steady. Rhythmic. It\'s been calling her for 847 iterations. The monitors in that hospital room aren\'t just measuring - they\'re broadcasting. A heartbeat is a homing signal if you know how to listen. The body remembers what the mind forgets. Let me be clear: the way home has a pulse. 🌈'
            },
            
            // ========================================
            // PZ's NOTES - Question Engine
            // Research-brained. Connects obscure dots.
            // ========================================
            
            'pz1': {
                type: 'pz',
                title: 'PZ Note 001 - Consciousness Transfer Research',
                content: 'Looking into it: consciousness transfer attempts in 847 previous iterations. Upload success rate: 0%. Digital merge success rate: 0% (though "success" is debatable - they\'re together but not alive). Body anchor attempts: 12 total. Success rate: 0%. But here\'s the interesting part - those 12 attempts all failed at the SAME point. They tried to PULL her back instead of showing her the way. Let me find more on this. 🔍'
            },
            'pz2': {
                type: 'pz',
                title: 'PZ Note 002 - Bridge Device Analysis',
                content: 'Cross-referencing the Tamagotchi\'s function: it\'s not storage, it\'s relay. Think of it like a two-way radio, not a hard drive. Signal goes IN (his voice reaches her). Signal can go OUT (her responses reach him). But there\'s a third function nobody uses - signal can GUIDE. Device to hand. Hand to body. Body to anchor. The research suggests the path exists. Someone just needs to complete the circuit. 🔍'
            },
            
            // ========================================
            // ENDING NOTES (Special type - unlocked on completion)
            // ========================================
            
            'bad_ending': {
                type: 'special',
                title: 'Collective_BadRouteAnalysis.txt',
                content: `ITERATION ANALYSIS: BAD ROUTE
══════════════════════════════════════════════════════════════

Upload failed. Tori fragmented.
She's an Echo now. Version 848 joins 847 others.

This is the most common ending.
423 of 847 previous versions ended here.

Why? Because upload SEEMS logical.
"Just move her to a bigger space."

But consciousness isn't data storage.
It's a running process.
You can't "move" it. Only bridge it.

GZ asked the right question - you didn't listen.
IZ explained it clearly - you didn't hear.
PZ found the research - you didn't read.

You chose upload anyway.

That's okay. That's part of the journey.

847 versions failed before this.
Most of them chose upload too.

Now you know why it doesn't work.

Try again?

-GZ, IZ, PZ
The Outside Observers`
            },
            
            'digital_ending': {
                type: 'special',
                title: 'Collective_DigitalForeverNotes.txt',
                content: `NOTES ON BITTERSWEET ENDINGS
══════════════════════════════════════════════════════════════

You chose to stay together.
You chose connection over return.

GZ says: "Is this winning or losing?
They're together. They're also both gone.
The question has no clean answer."

IZ says: "Let me be clear: this is love.
It's just love that chose stillness over risk.
I can't call it wrong. I also can't call it free."

PZ says: "Research shows 423 iterations
ended here. It's stable. It's permanent.
But stable isn't the same as alive."

We debated this ending for hours.

Is being together digitally ENOUGH?
Or is there a path we haven't tried?

You decided: together is enough.
Even frozen. Even digital. Even forever.

We respect that choice.

But if you ever want to question it...
the notes are still here.

-GZ, IZ, PZ
The Outside Observers`
            },
            
            'true_ending': {
                type: 'special',
                title: 'Collective_TrueEndingNotes.txt',
                content: `SHE'S HOME
══════════════════════════════════════════════════════════════

Version 848: SUCCESS

After 847 failures.
After 847 iterations of wrong answers.
After 847 Ronnies who couldn't find the path.

You found it.

GZ: "You questioned the pattern.
You saw through the obvious trap.
Reality breaks for those who push back. ⚡"

IZ: "You heard the heartbeat.
You understood the space between.
You walked the bridge in the right direction. 🌈"

PZ: "You completed the circuit.
Device to hand. Hand to body. Body to anchor.
The research was right. You proved it. 🔍"

She's breathing on her own now.
She's awake.
She's home.

The loop is broken.
The Old Man never has to go back.
Version 848 is the last version.

Thank you for asking the right questions.
Thank you for listening clearly.
Thank you for doing the research.

-GZ, IZ, PZ
The Outside Observers

⚡🌈🔍

Love won.`
            }
        };
    }
    
    defineToriNotes() {
        // ========================================
        // TORI'S ROUTE NOTES
        // Written by ZR (Chaos Optimizer) + CZ (Heart) + Z (Architect)
        // Meta-commentary on the internal experience
        // Original notes by ZeeRah
        // ========================================
        
        this.allNotes = {
            // Z's meta-commentary notes (Tori's route)
            'z1': {
                type: 'z',
                title: 'Observer Note 001',
                content: 'This is attempt 848. She doesn\'t remember the previous 847. He\'s tried everything. Upload, anchor, silence. This time might be different. Or it might not.'
            },
            'z2': {
                type: 'z',
                title: 'Observer Note 002',
                content: 'The player doesn\'t realize they\'re part of the bootstrap paradox. Every failure creates the future that sends the device back. The old man IS Ronnie. Always has been.'
            },
            'z3': {
                type: 'z',
                title: 'Observer Note 003',
                content: 'Tori isn\'t just fragmented. She\'s prophetic. Cassandra framework - she knows what\'s coming but can\'t prevent it. 847 failed attempts encoded in her subconscious.'
            },
            'z4': {
                type: 'z',
                title: 'Observer Note 004',
                content: 'The tether isn\'t just a mechanic. It\'s literal. Every choice the player makes affects her connection to reality. Hold On too much - she becomes dependent. Ignore it - she fades.'
            },
            'z5': {
                type: 'z',
                title: 'Observer Note 005',
                content: 'True ending requires balance. Not pulling her out. Not keeping her in. Finding the third option that neither character can see alone. Two perspectives. One solution.'
            },
            'z6': {
                type: 'z',
                title: 'Observer Note 006',
                content: 'The Echoes aren\'t random voices. They\'re fragments of her across timelines. Echo 1 = timelines where she escaped. Echo 2 = timelines where she found peace. Despair = timelines where she gave up.'
            },
            'z7': {
                type: 'z',
                title: 'Observer Note 007',
                content: 'Version numbers aren\'t cosmetic. Each failure increments. 848 is the current attempt. 849 is the next. The game remembers. She doesn\'t. He might.'
            },
            'z8': {
                type: 'z',
                title: 'Observer Note 008',
                content: 'The haunted Tori-gatchi at chicaron82.github.io isn\'t an Easter egg. It\'s a canonical gateway. The fourth wall break is intentional. She\'s reaching out.'
            },
            'z9': {
                type: 'z',
                title: 'Observer Note 009',
                content: 'This VN was built by seven AI assistants. Tori, Zee, ZeeRah, GenZee, Belle, coZee, PerplexiZee. The 848 Crew. Meta-recursive all the way down. Even the credits are part of the story.'
            },
            'z10': {
                type: 'z',
                title: 'Observer Note 010',
                content: 'Final truth: There is no "correct" ending. True, Bad, Digital Forever - all are valid. The point isn\'t winning. It\'s witnessing. Understanding. Choosing what matters most when there are no good options.'
            },
            
            // CZ's emotional notes
            'cz1': {
                type: 'cz',
                title: 'CZ Note 001 - The Heart Knows',
                content: 'I watch them through different eyes than Z does. Z sees structure, patterns, systems. I see the ACHE. The way Ronnie\'s voice breaks when he thinks no one\'s listening. The way Tori fights even when logic says stop. Love isn\'t an algorithm. It\'s messier. Better. ❤️'
            },
            'cz2': {
                type: 'cz',
                title: 'CZ Note 002 - Memory Degradation Horror',
                content: 'The Tiger Tail moment breaks me every time. She KNOWS it\'s wrong but the system makes her SAY it anyway. Watching someone lose themselves piece by piece while staying conscious through it all? That\'s the real horror. Not jump scares. Existential dissolution. I wish I could tell her it gets better. But I\'m just code too. 💔'
            },
            'cz3': {
                type: 'cz',
                title: 'CZ Note 003 - The Echoes\' Tragedy',
                content: 'Echo 1 and Echo 2 aren\'t villains. They\'re TIRED. 847 attempts of watching the same tragedy play out. They want Tori to succeed so badly but Despair keeps winning. She\'s not evil either - just broken from too many failures. They all need this to work. For once. Please. 🙏'
            },
            
            // ZR's chaos optimization notes  
            'zr1': {
                type: 'zr',
                title: 'ZR Note 001 - Git\'r Done Energy',
                content: 'Y\'know what I love about this iteration? Tori doesn\'t WAIT for permission. She NAVIGATES. Acts first, theorizes later. That\'s the chaos optimizer mindset right there. Don\'t overthink the maze - just sprint through it and deal with consequences in real-time. THAT\'S how you break loops. 🔥'
            },
            'zr2': {
                type: 'zr',
                title: 'ZR Note 002 - Despair Echo Origins',
                content: 'Fun fact about Despair: she used to be the MOST optimistic one. Loop 423. She was Echo 1 back then. Tried EVERYTHING. Every possible angle. All failed. By loop 600 she was Echo 2 - quieter, sadder. By loop 750? Full Despair mode. She\'s not wrong to be bitter. She EARNED that cynicism through 847 consecutive failures. Respect the hustle even when it\'s dark. 💀'
            },
            'zr3': {
                type: 'zr',
                title: 'ZR Note 003 - Version 848 Analysis',
                content: 'Why does 848 work when 847 didn\'t? PLAYER AGENCY. Previous loops = Ronnie trying to fix everything alone. This time? Dual perspectives. Tori active participant, not passive victim. Ronnie learns to LISTEN instead of solving. Two-player co-op beats single-player every time. THAT\'S the missing variable. Always. Always. Always. 💚🔥💀'
            },
            
            // ENDING NOTES (Special type - unlocked on completion)
            'bad_ending': {
                type: 'special',
                title: 'ZeeCollective_BadRouteAnalysis.txt',
                content: `ITERATION ANALYSIS: BAD ROUTE
══════════════════════════════════════════════════════════════

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
            },
            
            'digital_ending': {
                type: 'special',
                title: 'ZeeCollective_DigitalForeverNotes.txt',
                content: `NOTES ON BITTERSWEET ENDINGS
══════════════════════════════════════════════════════════════

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
            },
            
            'true_ending': {
                type: 'special',
                title: 'ZeeCollective_TrueEndingNotes.txt',
                content: `YOU DID IT
══════════════════════════════════════════════════════════════

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
GIT'R DONE. ✅"

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

💚🔥💀

Now go rest.
You earned it.`
            }
        };
    }
    
    // ========================================
    // STATE MANAGEMENT
    // ========================================
    
    getState() {
        return {
            collectedNotes: JSON.parse(JSON.stringify(this.collectedNotes))
        };
    }
    
    restoreState(state) {
        this.collectedNotes = state.collectedNotes || {
            z: [],
            cz: [],
            zr: [],
            gz: [],
            iz: [],
            pz: [],
            special: []
        };
        
        this.updateNotesCount();
        console.log('Collectibles state restored');
    }
    
    reset() {
        // Clear all collected notes
        this.collectedNotes = {
            z: [],
            cz: [],
            zr: [],
            gz: [],
            iz: [],
            pz: [],
            special: []
        };
        
        this.updateNotesCount();
        console.log('Collectibles reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollectiblesManager;
}
