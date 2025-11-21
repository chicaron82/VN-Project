// ========================================
// COLLECTIBLES MANAGER MODULE
// Manages Notes/Z collectibles system
// Extracted from route files and game-engine.js
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
            z: [],          // Z's notes (meta-commentary)
            ronnie: [],     // Ronnie's notes (his perspective)
            tori: [],       // Tori's notes (her perspective)
            cz: [],         // CZ's notes (emotional perspective)
            zr: [],         // ZR's notes (chaos optimization)
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
        //     'z1': { type: 'z', title: 'Note Title', content: 'Note content...' }
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
            ronnie: [],
            tori: [],
            special: []
        };
        
        Object.keys(this.allNotes).forEach(noteId => {
            const note = this.allNotes[noteId];
            notesByType[note.type].push({ id: noteId, ...note });
        });
        
        // Render each type section
        this.renderNoteSection('Z\'s Notes', notesByType.z, 'z');
        this.renderNoteSection('CZ\'s Notes', notesByType.cz, 'cz');
        this.renderNoteSection('ZR\'s Notes', notesByType.zr, 'zr');
        this.renderNoteSection('Ronnie\'s Notes', notesByType.ronnie, 'ronnie');
        this.renderNoteSection('Tori\'s Notes', notesByType.tori, 'tori');
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
        // Define Ronnie route notes
        this.allNotes = {
            'ronnie1': {
                type: 'ronnie',
                title: 'Hospital Vigil - Day 1',
                content: 'She\'s still breathing. The doctors say there\'s brain activity. They don\'t know when she\'ll wake up. IF she\'ll wake up. I can\'t accept that.'
            },
            'ronnie2': {
                type: 'ronnie',
                title: 'The Tamagotchi',
                content: 'Her Tamagotchi is still on my desk. It keeps buzzing. The battery shouldn\'t last this long. Something about it feels... alive. Connected to her somehow.'
            },
            'ronnie3': {
                type: 'ronnie',
                title: 'Code Fragment',
                content: 'I found something in the device\'s code. A consciousness transfer protocol. Whoever modified this knew what they were doing. This isn\'t some toy. It\'s a lifeline.'
            },
            'ronnie4': {
                type: 'ronnie',
                title: 'The Loop',
                content: 'She keeps saying the same things. Asking the same questions. It\'s like she\'s stuck. Fragmented. I need to help her remember. Help her find the way back.'
            },
            'ronnie5': {
                type: 'ronnie',
                title: 'Final Choice',
                content: 'I can bring her into the code completely. We could live here, together, forever. But would that be saving her... or trapping her? Would I be helping... or running away from reality?'
            }
        };
    }
    
    defineToriNotes() {
        // Define Tori route notes
        this.allNotes = {
            'tori1': {
                type: 'tori',
                title: 'The Coffee Shop',
                content: 'I remember the coffee. French Vanilla for Ronnie. I was walking home. Then... nothing. Just fragments. Where am I?'
            },
            'tori2': {
                type: 'tori',
                title: 'The Voices',
                content: 'There are other versions of me here. Echo 1 is hopeful. Echo 2 is gentle. The third... the third is bitter. Angry. They all want different things.'
            },
            'tori3': {
                type: 'tori',
                title: 'Memory Fragment',
                content: 'I see flashes. An older man. A BGA hoodie. His face... it looks like Ronnie. But older. Worn. Sad. Was that real? Or am I creating false memories?'
            },
            'tori4': {
                type: 'tori',
                title: 'The Tether',
                content: 'Something connects me to... somewhere. It\'s fading. I can feel myself slipping. If I let go completely, I don\'t think I\'ll come back. But holding on hurts.'
            },
            'tori5': {
                type: 'tori',
                title: 'The Choice',
                content: 'I could stay here. The code is stable. Predictable. Safe. No pain. No loss. But no... life? Is this existence? Or just persistence?'
            },
            
            // Z's meta-commentary notes (available in Tori's route)
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
            ronnie: [],
            tori: [],
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
            ronnie: [],
            tori: [],
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
