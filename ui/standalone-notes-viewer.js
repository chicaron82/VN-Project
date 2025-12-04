// ========================================
// STANDALONE NOTES VIEWER
// View unlocked notes from main menu
// No spoilers - only shows what you've found
// ========================================

class StandaloneNotesViewer {
    constructor(game) {
        this.game = game;
        this.unlockedNotes = this.loadUnlockedNotes();

        // ZEERAH: Read status tracking for notification dots
        this.readStatus = this.loadReadStatus();
    }
    
    loadUnlockedNotes() {
        // ZEERAH'S FIX: Load notes directly from localStorage
        // CollectiblesManager now saves here immediately on unlock
        const notes = {
            z: [],
            cz: [],
            zr: [],
            gz: [],
            iz: [],
            pz: [],
            special: []
        };
        
        try {
            const saved = localStorage.getItem('vn_collected_notes');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.keys(notes).forEach(type => {
                    if (parsed[type] && Array.isArray(parsed[type])) {
                        notes[type] = parsed[type];
                    }
                });
                console.log('Standalone viewer loaded notes from localStorage:', notes);
            }
        } catch (e) {
            console.warn('Error loading notes for standalone viewer:', e);
        }
        
        return notes;
    }

    // ZEERAH: Read status storage methods
    loadReadStatus() {
        const saved = localStorage.getItem('notesReadStatus');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse read status:', e);
                return {};
            }
        }
        return {};
    }

    saveReadStatus() {
        try {
            localStorage.setItem('notesReadStatus', JSON.stringify(this.readStatus));
        } catch (e) {
            console.error('Failed to save read status:', e);
        }
    }

    // ZEERAH: Unread check methods
    hasUnreadFeatures() {
        return Object.keys(this.readStatus).some(key =>
            key.startsWith('feature_') && this.readStatus[key] === false
        );
    }

    hasUnreadToriNotes() {
        return Object.keys(this.readStatus).some(key =>
            key.startsWith('note_tori_') && this.readStatus[key] === false
        );
    }

    hasUnreadRonnieNotes() {
        return Object.keys(this.readStatus).some(key =>
            key.startsWith('note_ronnie_') && this.readStatus[key] === false
        );
    }

    hasAnyUnread() {
        return this.hasUnreadFeatures() ||
               this.hasUnreadToriNotes() ||
               this.hasUnreadRonnieNotes();
    }

    // ZEERAH: Update notification dots on UI
    updateNotificationDots() {
        // Update main Notes button
        const notesBtn = document.getElementById('notes-button');
        if (notesBtn) {
            if (this.hasAnyUnread()) {
                notesBtn.classList.add('has-unread');
            } else {
                notesBtn.classList.remove('has-unread');
            }
        }

        // Update Features tab
        const featuresTab = document.querySelector('[data-tab="features"]');
        if (featuresTab) {
            if (this.hasUnreadFeatures()) {
                featuresTab.classList.add('has-unread');
            } else {
                featuresTab.classList.remove('has-unread');
            }
        }

        // Update Tori's Notes tab
        const toriTab = document.querySelector('[data-tab="tori"]');
        if (toriTab) {
            if (this.hasUnreadToriNotes()) {
                toriTab.classList.add('has-unread');
            } else {
                toriTab.classList.remove('has-unread');
            }
        }

        // Update Ronnie's Notes tab
        const ronnieTab = document.querySelector('[data-tab="ronnie"]');
        if (ronnieTab) {
            if (this.hasUnreadRonnieNotes()) {
                ronnieTab.classList.add('has-unread');
            } else {
                ronnieTab.classList.remove('has-unread');
            }
        }
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
        const ronnieTabUnlocked = localStorage.getItem('ronnieTabUnlocked') === 'true';

        viewer.innerHTML = `
            <div class="standalone-notes-content">
                <div class="notes-header">
                    <h2>COLLECTED NOTES</h2>
                    <div class="notes-count-display">${totalUnlocked} Notes Unlocked</div>
                    <button class="close-notes-btn" onclick="game.closeStandaloneNotes()">✕</button>
                </div>

                <!-- DIZEE: Tabbed Interface -->
                <div class="notes-tabs">
                    <button class="notes-tab active" data-tab="tori">TORI'S NOTES</button>
                    <button class="notes-tab ${ronnieTabUnlocked ? '' : 'locked'}" data-tab="ronnie">${ronnieTabUnlocked ? "RONNIE'S NOTES" : 'LOCKED'}</button>
                    <button class="notes-tab" data-tab="features">FEATURES</button>
                </div>

                <!-- Tab Content Containers -->
                <div class="notes-tab-content active" id="tab-tori">
                    ${this.renderToriNotes()}
                </div>
                <div class="notes-tab-content" id="tab-ronnie">
                    ${ronnieTabUnlocked ? this.renderRonnieNotes() : this.renderLockedTab()}
                </div>
                <div class="notes-tab-content" id="tab-features">
                    ${this.renderFeaturesTab()}
                </div>

                <div class="notes-footer">
                    <button class="back-btn" onclick="game.closeStandaloneNotes()">BACK TO MENU</button>
                </div>
            </div>
        `;

        document.body.appendChild(viewer);

        // Setup tab switching
        this.setupTabSwitching();

        // Fade in
        setTimeout(() => {
            viewer.classList.add('show');
        }, 50);

        // ZEERAH: Update notification dots after opening
        this.updateNotificationDots();

        // DIZEE FIX: Mark ALL tabs as read when viewer opens
        // User can see the note count in the header, so they know notes exist
        // No need to keep notification dot after they've opened the viewer
        this.markTabAsRead('tori');
        if (ronnieTabUnlocked) {
            this.markTabAsRead('ronnie');
        }
        this.markTabAsRead('features');
    }

    setupTabSwitching() {
        const tabs = document.querySelectorAll('.notes-tab');
        const tabContents = document.querySelectorAll('.notes-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Don't switch if locked
                if (tab.classList.contains('locked')) {
                    return;
                }

                // Remove active from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                const content = document.getElementById(`tab-${tabName}`);
                if (content) {
                    content.classList.add('active');
                }

                // ZEERAH: Mark tab as read when opened
                this.markTabAsRead(tabName);
            });
        });
    }

    // ZEERAH: Mark tab content as read
    markTabAsRead(tabName) {
        let marked = false;

        if (tabName === 'features') {
            // Mark all features as read
            Object.keys(this.readStatus).forEach(key => {
                if (key.startsWith('feature_')) {
                    this.readStatus[key] = true;
                    marked = true;
                }
            });
        } else if (tabName === 'tori') {
            // Mark all Tori notes as read
            Object.keys(this.readStatus).forEach(key => {
                if (key.startsWith('note_tori_')) {
                    this.readStatus[key] = true;
                    marked = true;
                }
            });
        } else if (tabName === 'ronnie') {
            // Mark all Ronnie notes as read
            Object.keys(this.readStatus).forEach(key => {
                if (key.startsWith('note_ronnie_')) {
                    this.readStatus[key] = true;
                    marked = true;
                }
            });
        }

        if (marked) {
            this.saveReadStatus();
            this.updateNotificationDots();
        }
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

    // ========================================
    // TAB RENDER METHODS
    // DIZEE: Separate rendering for each tab
    // ========================================

    renderToriNotes() {
        const allNoteDefs = this.getAllNoteDefinitions();
        const toriTypes = ['z', 'cz', 'zr'];
        let html = '<div class="tab-notes-container">';

        let hasNotes = false;
        toriTypes.forEach(type => {
            if (this.unlockedNotes[type] && this.unlockedNotes[type].length > 0) {
                hasNotes = true;
                this.unlockedNotes[type].forEach(noteId => {
                    const note = allNoteDefs[noteId];
                    if (note) {
                        const typeColor = this.getTypeColor(type);
                        const routeLabel = this.getRouteLabel(type);

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
            }
        });

        html += '</div>';
        return hasNotes ? html : '<div class="no-notes-message"><p>No notes from Tori\'s route yet.</p></div>';
    }

    renderRonnieNotes() {
        const allNoteDefs = this.getAllNoteDefinitions();
        const ronnieTypes = ['gz', 'iz', 'pz', 'special'];
        let html = '<div class="tab-notes-container">';

        let hasNotes = false;
        ronnieTypes.forEach(type => {
            if (this.unlockedNotes[type] && this.unlockedNotes[type].length > 0) {
                hasNotes = true;
                this.unlockedNotes[type].forEach(noteId => {
                    const note = allNoteDefs[noteId];
                    if (note) {
                        const typeColor = this.getTypeColor(type);
                        const routeLabel = this.getRouteLabel(type);

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
            }
        });

        html += '</div>';
        return hasNotes ? html : '<div class="no-notes-message"><p>No notes from Ronnie\'s route yet.</p></div>';
    }

    renderLockedTab() {
        return `
            <div class="locked-tab-message">
                <div class="lock-icon">🔒</div>
                <h3>LOCKED</h3>
                <p>Complete any ending on Ronnie's route to unlock this tab.</p>
                <p class="hint">Breadcrumbs from the other observers await...</p>
            </div>
        `;
    }

    renderFeaturesTab() {
        const features = [];

        // Check unlocked features
        if (localStorage.getItem('skipPrologueUnlocked') === 'true') {
            features.push({
                name: 'Skip Prologue',
                icon: '⏭️',
                description: 'Skip the opening sequence on replays. Toggle in Settings.'
            });
        }

        if (localStorage.getItem('skipUnlocked') === 'true') {
            features.push({
                name: 'Skip Mode',
                icon: '⏩',
                description: 'Fast-forward through previously read dialogue. Press CTRL or S to activate.'
            });
        }

        if (localStorage.getItem('timeMachineUnlocked') === 'true') {
            features.push({
                name: 'Time Machine',
                icon: '⏰',
                description: 'Jump back to previous story moments via the backlog. Rewrite your choices.'
            });
        }

        if (localStorage.getItem('insaneModeUnlocked') === 'true') {
            features.push({
                name: 'INSANE Mode',
                icon: '💀',
                description: 'Ultimate difficulty: No Hold On, No Time Travel, 66% tether cap, 2x decay. For the truly dedicated.'
            });
        }

        let html = '<div class="features-container">';

        if (features.length === 0) {
            html += `
                <div class="no-features-message">
                    <p>No special features unlocked yet.</p>
                    <p class="hint">Play through the story to discover hidden systems!</p>
                </div>
            `;
        } else {
            features.forEach(feature => {
                html += `
                    <div class="feature-entry">
                        <div class="feature-icon">${feature.icon}</div>
                        <div class="feature-details">
                            <div class="feature-name">${feature.name}</div>
                            <div class="feature-description">${feature.description}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        return html;
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
        // DIZEE: Pull definitions from CollectiblesManager instead of hardcoding
        // This ensures standalone viewer always has ALL notes, stays in sync
        return CollectiblesManager.getAllNoteDefinitions();
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
