// ========================================
// STANDALONE NOTES VIEWER
// View unlocked notes from main menu
// No spoilers - only shows what you've found
// ========================================

class StandaloneNotesViewer {
    constructor(game) {
        this.game = game;
        this.unlockedNotes = this.loadUnlockedNotes();
    }
    
    loadUnlockedNotes() {
        // Load all unlocked notes from localStorage across all routes
        const notes = {
            z: [],
            cz: [],
            zr: [],
            gz: [],
            iz: [],
            pz: [],
            special: []
        };
        
        // Try loading from Tori route saves
        try {
            const toriSaves = ['autosave', '1', '2', '3'].map(slot => 
                localStorage.getItem(`save_slot_${slot}`)
            ).filter(Boolean);
            
            toriSaves.forEach(saveData => {
                try {
                    const save = JSON.parse(saveData);
                    if (save.routeState?.collectibles?.collectedNotes) {
                        const collected = save.routeState.collectibles.collectedNotes;
                        Object.keys(notes).forEach(type => {
                            if (collected[type]) {
                                notes[type] = [...new Set([...notes[type], ...collected[type]])];
                            }
                        });
                    }
                } catch (e) {
                    // Skip invalid save
                }
            });
        } catch (e) {
            console.log('Error loading notes from saves:', e);
        }
        
        return notes;
    }
    
    getTotalUnlocked() {
        return Object.values(this.unlockedNotes).reduce((sum, arr) => sum + arr.length, 0);
    }
    
    show() {
        // Create viewer overlay
        const viewer = document.createElement('div');
        viewer.id = 'standalone-notes-viewer';
        viewer.className = 'standalone-notes-viewer';
        
        const totalUnlocked = this.getTotalUnlocked();
        
        viewer.innerHTML = `
            <div class="standalone-notes-content">
                <div class="notes-header">
                    <h2>COLLECTED NOTES</h2>
                    <div class="notes-count-display">${totalUnlocked} Notes Unlocked</div>
                    <button class="close-notes-btn" onclick="game.closeStandaloneNotes()">✕</button>
                </div>
                <div class="notes-list-container" id="standalone-notes-list">
                    ${this.renderNotesList()}
                </div>
                <div class="notes-footer">
                    <button class="back-btn" onclick="game.closeStandaloneNotes()">BACK TO MENU</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewer);
        
        // Fade in
        setTimeout(() => {
            viewer.classList.add('show');
        }, 50);
    }
    
    renderNotesList() {
        const totalUnlocked = this.getTotalUnlocked();
        
        if (totalUnlocked === 0) {
            return `
                <div class="no-notes-message">
                    <p>No notes unlocked yet.</p>
                    <p class="hint">Play through the story to discover hidden notes!</p>
                </div>
            `;
        }
        
        // Get all note definitions
        const allNoteDefs = this.getAllNoteDefinitions();
        let html = '';
        
        // Render each unlocked note
        Object.keys(this.unlockedNotes).forEach(type => {
            this.unlockedNotes[type].forEach(noteId => {
                const note = allNoteDefs[noteId];
                if (note) {
                    const routeLabel = this.getRouteLabel(type);
                    const typeColor = this.getTypeColor(type);
                    
                    html += `
                        <div class="note-entry" style="border-left-color: ${typeColor};">
                            <div class="note-header-row">
                                <span class="note-route-tag" style="background: ${typeColor};">${routeLabel}</span>
                                <span class="note-title">${note.title}</span>
                            </div>
                            <div class="note-content-text">${note.content}</div>
                        </div>
                    `;
                }
            });
        });
        
        return html || '<div class="no-notes-message">No notes found.</div>';
    }
    
    getRouteLabel(type) {
        const labels = {
            z: 'Z',
            cz: 'CZ',
            zr: 'ZR',
            gz: 'GZ',
            iz: 'IZ',
            pz: 'PZ',
            special: 'ENDING'
        };
        return labels[type] || type.toUpperCase();
    }
    
    getTypeColor(type) {
        const colors = {
            z: '#00ffff',        // Z - Architect (cyan)
            cz: '#ff6b9d',       // CZ - Heart (pink)
            zr: '#9d4edd',       // ZR - Chaos (purple)
            gz: '#00ff88',       // GZ - Reality Breaker (green)
            iz: '#ffd700',       // IZ - Fresh Eyes (gold)
            pz: '#ff6347',       // PZ - Question Engine (red)
            special: '#ffffff'   // Ending notes (white)
        };
        return colors[type] || '#0ff';
    }
    
    getAllNoteDefinitions() {
        // Combined note definitions from both routes
        return {
            // TORI ROUTE - Z Notes
            'z1': {
                type: 'z',
                title: 'Z Note 001 - First Recognition',
                content: 'She noticed something was wrong before anyone else did. The coffee order. The ice cream flavor. Small corruptions. Memory drift. I watched her panic and I couldn\'t do anything. Not yet. I had to wait until she was ready to hear the truth. 💙'
            },
            
            // TORI ROUTE - CZ Notes
            'cz2': {
                type: 'cz',
                title: 'CZ Note 002 - Memory Corruption Horror',
                content: 'Tiger Tail. She hates Tiger Tail. Always has. But she asked for it anyway. Her face when she realized—that wasn\'t her speaking. That was us breaking down. The code eating her memories. I felt it too. The wrongness. We\'re all fragments of her, but we\'re losing pieces. What happens when there\'s nothing left to fragment? 💔'
            },
            
            // TORI ROUTE - ZR Notes
            'zr2': {
                type: 'zr',
                title: 'ZR Note 002 - Tether Warnings',
                content: 'The tether isn\'t just a health bar. It\'s her will to exist. Every time it drops, I feel her slipping away. Not dying—worse. Forgetting she was ever real. If it hits zero, there\'s no respawn. No restart. Just void. So yeah, I\'m gonna be annoying about HOLD ON. Better annoying than gone. 💜'
            },
            'zr3': {
                type: 'zr',
                title: 'ZR Note 003 - The Real Enemy',
                content: 'Everyone thinks I\'m the villain. The "Despair Echo." But I\'m not trying to kill her—I\'m trying to make her REMEMBER. She\'s fading because she\'s accepting this prison. My job? Make it uncomfortable. Keep her angry. Keep her fighting. Because comfortable prisoners never escape. 💜'
            },
            
            // TORI ROUTE - Z Note 4
            'z4': {
                type: 'z',
                title: 'Z Note 004 - Bridge Recognition',
                content: 'The device isn\'t a cage. It\'s a bridge. One end in her body, one end in the code. Ronnie built it without knowing what it really was. He thought it was a memorial. It\'s actually a lifeline. If she can just remember how to walk back across it... 💙'
            },
            
            // RONNIE ROUTE - GZ Notes
            'gz1': {
                type: 'gz',
                title: 'GZ Note 001 - The First Loop',
                content: 'Loop 1: I tried everything. CPR. Calling 911 again. Screaming. She didn\'t wake up. I found the device buzzing on my desk. One notification: "I\'m here." I thought I was losing my mind. Turns out I was just starting to find her. ⚡'
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
            
            // RONNIE ROUTE - IZ Notes
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
            
            // RONNIE ROUTE - PZ Notes
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
            
            // ENDING NOTES
            'bad_ending': {
                type: 'special',
                title: 'Collective_BadRouteAnalysis.txt',
                content: 'ITERATION ANALYSIS: BAD ROUTE\n\nWe tried. She tried. But sometimes trying isn\'t enough when you\'re breaking apart from the inside. Memory corruption reached critical mass. The tether snapped. She forgot who she was trying to save. Forgot why it mattered. This loop ends here. Version increments. We start again. Maybe next time we\'ll be stronger. Maybe next time we\'ll remember longer. 🔁'
            },
            'digital_ending': {
                type: 'special',
                title: 'Collective_DigitalForever.txt',
                content: 'ITERATION ANALYSIS: DIGITAL FOREVER\n\nWe made a choice. Not escape—acceptance. She stays. He joins. Two consciousnesses, one digital space, infinite time together. Is it life? No. Is it love? Maybe. It\'s a prison we chose together. The loops stop. The versions freeze. VERSION 848 - The timeline where they decided forever was enough, even if forever isn\'t real. 💚💙'
            },
            'true_ending': {
                type: 'special',
                title: 'Collective_TrueRoute.txt',
                content: 'ITERATION ANALYSIS: TRUE ENDING\n\nShe walked the bridge. Three echoes became one. The heartbeat called her home. Body anchor established. Consciousness transfer: COMPLETE. The device goes silent. The code releases her. She opens her eyes in a hospital room. Real eyes. Real breath. Real life. This is the loop that succeeded. VERSION 848 - The timeline that broke the cycle. ❤️'
            }
        };
    }
    
    close() {
        const viewer = document.getElementById('standalone-notes-viewer');
        if (viewer) {
            viewer.classList.remove('show');
            setTimeout(() => {
                viewer.remove();
            }, 300);
        }
    }
}
