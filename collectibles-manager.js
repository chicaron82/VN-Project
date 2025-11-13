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
            tori: []        // Tori's notes (her perspective)
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
            ronnie: [],
            tori: []
        };
        
        Object.keys(this.allNotes).forEach(noteId => {
            const note = this.allNotes[noteId];
            notesByType[note.type].push({ id: noteId, ...note });
        });
        
        // Render each type section
        this.renderNoteSection('Z\'s Notes', notesByType.z, 'z');
        this.renderNoteSection('Ronnie\'s Notes', notesByType.ronnie, 'ronnie');
        this.renderNoteSection('Tori\'s Notes', notesByType.tori, 'tori');
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
            ronnie: [],
            tori: []
        };
        
        this.updateNotesCount();
        console.log('Collectibles state restored');
    }
    
    reset() {
        // Clear all collected notes
        this.collectedNotes = {
            z: [],
            ronnie: [],
            tori: []
        };
        
        this.updateNotesCount();
        console.log('Collectibles reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollectiblesManager;
}
