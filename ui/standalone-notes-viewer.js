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
                    <button class="notes-tab" data-tab="codes">CODES</button>
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
                <div class="notes-tab-content" id="tab-codes">
                    ${this.renderCodesTab()}
                </div>

                <div class="notes-footer">
                    <button class="back-btn" onclick="game.closeStandaloneNotes()">BACK TO MENU</button>
                </div>
            </div>

            <!-- DIZEE FIX: Note overlay for standalone viewer -->
            <div id="notes-overlay" style="display: none;">
                <div id="notes-overlay-content">
                    <!-- Close button -->
                    <button class="close-x" onclick="game.standaloneNotesViewer.closeNoteOverlay()">✕</button>

                    <!-- Note header (FROM + SUBJECT) -->
                    <div id="note-overlay-header">
                        <div id="note-from">FROM: Z (The Architect)</div>
                        <div id="note-subject">SUBJECT: Observer Note 003</div>
                    </div>

                    <!-- Note body -->
                    <div id="note-overlay-body">
                        [Note content will be inserted here]
                    </div>

                    <!-- Navigation buttons -->
                    <div class="note-navigation">
                        <button id="note-prev-btn" class="nav-btn">← PREVIOUS</button>
                        <button id="note-next-btn" class="nav-btn">NEXT →</button>
                    </div>
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
                        const sender = this.getSenderName(type);
                        const isUnread = this.readStatus[`note_${noteId}`] === false;
                        const unreadClass = isUnread ? 'unread' : '';
                        const unreadDot = isUnread ? '<span class="note-unread-dot"></span>' : '';

                        // DIZEE POLISH: Get timestamp
                        const timestamp = this.getNoteTimestamp(noteId);
                        const timestampHTML = timestamp ? `<div class="note-timestamp">${timestamp}</div>` : '';

                        html += `
                            <div class="note-item-header ${unreadClass}" data-note-id="${noteId}">
                                ${unreadDot}
                                <div class="note-header-from">FROM: ${sender}</div>
                                <div class="note-header-subject">SUBJECT: ${note.title}</div>
                                ${timestampHTML}
                            </div>
                        `;
                    }
                });
            }
        });

        html += '</div>';

        if (!hasNotes) {
            return '<div class="no-notes-message"><p>No notes from Tori\'s route yet.</p></div>';
        }

        // Attach click handlers after content is rendered
        setTimeout(() => this.attachNoteClickHandlers('tori'), 0);

        return html;
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
                        const sender = this.getSenderName(type);
                        const isUnread = this.readStatus[`note_${noteId}`] === false;
                        const unreadClass = isUnread ? 'unread' : '';
                        const unreadDot = isUnread ? '<span class="note-unread-dot"></span>' : '';

                        // DIZEE POLISH: Get timestamp
                        const timestamp = this.getNoteTimestamp(noteId);
                        const timestampHTML = timestamp ? `<div class="note-timestamp">${timestamp}</div>` : '';

                        html += `
                            <div class="note-item-header ${unreadClass}" data-note-id="${noteId}">
                                ${unreadDot}
                                <div class="note-header-from">FROM: ${sender}</div>
                                <div class="note-header-subject">SUBJECT: ${note.title}</div>
                                ${timestampHTML}
                            </div>
                        `;
                    }
                });
            }
        });

        html += '</div>';

        if (!hasNotes) {
            return '<div class="no-notes-message"><p>No notes from Ronnie\'s route yet.</p></div>';
        }

        // Attach click handlers after content is rendered
        setTimeout(() => this.attachNoteClickHandlers('ronnie'), 0);

        return html;
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

    renderCodesTab() {
        // DIZEE: Render all secret codes (discovered + locked)
        const discoveredCodes = this.game.secretCodesManager?.discoveredCodes || new Set();

        // All discoverable codes (NOT dev commands) - 12 total
        const allCodes = [
            { code: 'torigatchi', name: 'The Reverse Door', icon: '🚪', description: 'Two versions of Tori. Choose your peace.' },
            { code: 'ronniegatchi', name: 'The Inspiration', icon: '🎮', description: 'The game that started it all.' },
            { code: 'always3', name: 'Storm Dragon Signature', icon: '💚', description: '"Always. Always. Always." - Every time it appears.' },
            { code: 'uv7crew', name: 'Director\'s Cut', icon: '🎬', description: 'Extended crew statements. Behind the chaos.' },
            { code: 'chicharon', name: 'Dev Commentary', icon: '🎙️', description: 'Behind-the-scenes notes from the creator.' },
            { code: 'bootstrap', name: 'Loop Timeline', icon: '🔄', description: 'Visualize every attempt that led here.' },
            { code: 'echo', name: 'Voices of 847', icon: '👻', description: 'Compilation of all echo voice lines.' },
            { code: '848', name: 'True Attempt Number', icon: '🔢', description: 'Your actual loop count (including failures).' },
            { code: 'echobreak', name: 'Echo Silence', icon: '🔇', description: 'Disable Echo interruptions. The observers fall silent.' },
            { code: 'tetherlock', name: 'Tether Freeze', icon: '🔗', description: 'Lock tether at current level. Stop the decay.' },
            { code: 'saveanywhere', name: 'Cage Breaker', icon: '⚡', description: 'Bypass Act 1 save restriction. Despair\'s cage broken.' },
            { code: 'dizee', name: 'The Architect\'s Signature', icon: '🖤', description: 'Recognition for the one who built this world.' }
        ];

        const discoveredCount = discoveredCodes.size;
        const totalCount = allCodes.length;

        let html = `
            <div class="codes-container">
                <div class="codes-header">
                    <h3>SECRET CODES</h3>
                    <div class="codes-progress">${discoveredCount} / ${totalCount} Discovered</div>
                </div>
                <div class="codes-list">
        `;

        allCodes.forEach(item => {
            const discovered = discoveredCodes.has(item.code);
            html += `
                <div class="code-entry ${discovered ? 'discovered' : 'locked'}">
                    <div class="code-icon">${discovered ? item.icon : '🔒'}</div>
                    <div class="code-details">
                        <div class="code-name">${discovered ? item.name : '?????'}</div>
                        <div class="code-description">${discovered ? item.description : 'Undiscovered'}</div>
                    </div>
                    ${discovered ? '<div class="code-status">✓ UNLOCKED</div>' : ''}
                </div>
            `;
        });

        html += `
                </div>
                <div class="codes-hint">
                    <p>Find codes hidden throughout the story, or discover them online.</p>
                    <p>Enter codes in Settings → Secret Codes to unlock special content!</p>
                </div>
            </div>
        `;

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

    // ========================================
    // EMAIL-STYLE OVERLAY METHODS
    // Transform notes from expandable list to inbox metaphor
    // ========================================

    openNoteOverlay(noteId, allNoteIds) {
        // Store current note context for navigation
        this.currentNoteId = noteId;
        this.currentNoteList = allNoteIds;

        // Display the note
        this.displayNoteInOverlay(noteId);

        // Mark as read
        this.markNoteAsRead(noteId);

        // Show overlay
        const overlay = document.getElementById('notes-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }

        // Update navigation buttons
        this.updateNavigationButtons();

        // DIZEE GLOW-UP: Add swipe navigation
        this.setupSwipeNavigation();

        // ESC key to close
        this.escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeNoteOverlay();
            }
        };
        document.addEventListener('keydown', this.escKeyHandler);
    }

    setupSwipeNavigation() {
        const overlayContent = document.getElementById('notes-overlay-content');
        if (!overlayContent) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        };

        const handleSwipe = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;

            // Only swipe if horizontal movement is greater than vertical (avoid interfering with scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - previous note
                    this.navigateNote(-1);
                } else {
                    // Swipe left - next note
                    this.navigateNote(1);
                }
            }
        };

        // Store handlers for cleanup
        this.swipeTouchStart = handleTouchStart;
        this.swipeTouchEnd = handleTouchEnd;

        overlayContent.addEventListener('touchstart', this.swipeTouchStart, { passive: true });
        overlayContent.addEventListener('touchend', this.swipeTouchEnd, { passive: true });
    }

    displayNoteInOverlay(noteId) {
        const allNoteDefs = this.getAllNoteDefinitions();
        const note = allNoteDefs[noteId];

        if (!note) {
            console.error('Note not found:', noteId);
            return;
        }

        // Determine sender and note type
        const noteType = this.getNoteType(noteId);
        const sender = this.getSenderName(noteType);

        // Update overlay content
        const fromEl = document.getElementById('note-from');
        const subjectEl = document.getElementById('note-subject');
        const bodyEl = document.getElementById('note-overlay-body');
        const overlayContent = document.getElementById('notes-overlay-content');
        const overlay = document.getElementById('notes-overlay');

        if (fromEl) fromEl.textContent = `FROM: ${sender}`;
        if (subjectEl) subjectEl.textContent = `SUBJECT: ${note.title}`;

        // DIZEE: Process code drop for this note (delegate to collectibles manager)
        let dropData = null;
        if (this.game && this.game.collectiblesManager) {
            dropData = this.game.collectiblesManager.processNoteDrop(noteId);
        }

        // Build note content with code drop footer if applicable
        let fullContent = note.content;

        if (dropData && dropData.hasCode) {
            // CODE DETECTED - Show the discovered code
            fullContent += `
                <div class="note-code-footer code-detected">
                    <div class="code-divider">— — — — —</div>
                    <div class="signal-header">🔓 ENCRYPTED SIGNAL DETECTED 🔓</div>
                    <div class="signal-code">${dropData.code.toUpperCase()}</div>
                    <div class="signal-hint">Code automatically added to discovered codes list</div>
                </div>
            `;
        } else if (dropData && dropData.hasCode === false && getNoteMetadata(noteId) && getNoteMetadata(noteId).pool && getNoteMetadata(noteId).pool.length > 0) {
            // NO CODE THIS TIME - Show hint about RNG
            const seenNotes = this.game.collectiblesManager ? this.game.collectiblesManager.seenNotes : {};
            const timesViewed = seenNotes[noteId] || 1;
            const remaining = 3 - timesViewed;

            if (remaining > 0) {
                fullContent += `
                    <div class="note-code-footer code-hint">
                        <div class="code-divider">— — — — —</div>
                        <div class="signal-header">📡 Signal Unstable</div>
                        <div class="signal-status">Encrypted data detected but unreadable... (View ${remaining} more time${remaining > 1 ? 's' : ''} for guaranteed signal)</div>
                    </div>
                `;
            }
        }

        if (bodyEl) bodyEl.innerHTML = fullContent;

        // Apply color class based on note type
        if (overlay) {
            // Remove all sender classes first
            overlay.className = '';

            // DIZEE GLOW-UP: Add sender-specific color class
            const senderClass = `sender-${noteType}`;
            overlay.classList.add(senderClass);

            // Keep meta/despair classes for backward compatibility
            if (noteType === 'cz' || noteType === 'zr') {
                overlay.classList.add('meta-note');
            } else if (noteType === 'special') {
                overlay.classList.add('despair-note');
            }
        }
    }

    getNoteType(noteId) {
        // Determine note type from ID by checking which array contains it
        for (const type of Object.keys(this.unlockedNotes)) {
            if (this.unlockedNotes[type].includes(noteId)) {
                return type;
            }
        }

        // Check ID prefix patterns as fallback
        if (noteId.includes('_cz_')) return 'cz';
        if (noteId.includes('_zr_')) return 'zr';
        if (noteId.includes('_gz_')) return 'gz';
        if (noteId.includes('_iz_')) return 'iz';
        if (noteId.includes('_pz_')) return 'pz';
        if (noteId.includes('ending')) return 'special';

        return 'z'; // Default to Z
    }

    getSenderName(noteType) {
        const senders = {
            z: 'Z (The Architect)',
            cz: 'CZ (The Heart)',
            zr: 'ZR (Chaos Embodied)',
            gz: 'GZ (Reality Breaker)',
            iz: 'IZ (Fresh Eyes)',
            pz: 'PZ (Question Engine)',
            special: 'System Notice'
        };
        return senders[noteType] || 'Unknown Observer';
    }

    // DIZEE POLISH: Get formatted timestamp for a note
    getNoteTimestamp(noteId) {
        // Load timestamps from localStorage
        try {
            const savedTimestamps = localStorage.getItem('vn_note_timestamps');
            if (!savedTimestamps) return '';

            const timestamps = JSON.parse(savedTimestamps);
            const timestamp = timestamps[noteId];

            if (!timestamp) return '';

            // Use same relative time formatting as collectibles manager
            const now = Date.now();
            const diff = now - timestamp;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds < 60) return 'just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            if (days < 30) return `${Math.floor(days / 7)}w ago`;
            if (days < 365) return `${Math.floor(days / 30)}mo ago`;
            return `${Math.floor(days / 365)}y ago`;
        } catch (e) {
            console.warn('Error loading note timestamps:', e);
            return '';
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('note-prev-btn');
        const nextBtn = document.getElementById('note-next-btn');

        if (!this.currentNoteList || this.currentNoteList.length === 0) {
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        const currentIndex = this.currentNoteList.indexOf(this.currentNoteId);

        // Enable/disable based on position
        if (prevBtn) {
            prevBtn.disabled = currentIndex <= 0;
            prevBtn.onclick = () => this.navigateNote(-1);
        }

        if (nextBtn) {
            nextBtn.disabled = currentIndex >= this.currentNoteList.length - 1;
            nextBtn.onclick = () => this.navigateNote(1);
        }
    }

    navigateNote(direction) {
        if (!this.currentNoteList) return;

        const currentIndex = this.currentNoteList.indexOf(this.currentNoteId);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.currentNoteList.length) {
            const newNoteId = this.currentNoteList[newIndex];
            this.currentNoteId = newNoteId;
            this.displayNoteInOverlay(newNoteId);
            this.markNoteAsRead(newNoteId);
            this.updateNavigationButtons();
        }
    }

    markNoteAsRead(noteId) {
        const key = `note_${noteId}`;
        if (this.readStatus[key] !== true) {
            this.readStatus[key] = true;
            this.saveReadStatus();
            this.updateNotificationDots();

            // Refresh the notes list to update unread indicators
            this.refreshNotesList();
        }
    }

    closeNoteOverlay() {
        const overlay = document.getElementById('notes-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        // Remove ESC key listener
        if (this.escKeyHandler) {
            document.removeEventListener('keydown', this.escKeyHandler);
            this.escKeyHandler = null;
        }

        // DIZEE GLOW-UP: Remove swipe handlers
        const overlayContent = document.getElementById('notes-overlay-content');
        if (overlayContent && this.swipeTouchStart && this.swipeTouchEnd) {
            overlayContent.removeEventListener('touchstart', this.swipeTouchStart);
            overlayContent.removeEventListener('touchend', this.swipeTouchEnd);
            this.swipeTouchStart = null;
            this.swipeTouchEnd = null;
        }

        // Clear current note context
        this.currentNoteId = null;
        this.currentNoteList = null;
    }

    refreshNotesList() {
        // Refresh the active tab content to update unread indicators
        const activeTab = document.querySelector('.notes-tab.active');
        if (!activeTab) return;

        const tabName = activeTab.getAttribute('data-tab');
        const tabContent = document.getElementById(`tab-${tabName}`);

        if (!tabContent) return;

        // Re-render the tab content
        if (tabName === 'tori') {
            tabContent.innerHTML = this.renderToriNotes();
        } else if (tabName === 'ronnie') {
            tabContent.innerHTML = this.renderRonnieNotes();
        } else if (tabName === 'features') {
            tabContent.innerHTML = this.renderFeaturesTab();
        } else if (tabName === 'codes') {
            tabContent.innerHTML = this.renderCodesTab();
        }

        // Re-attach click handlers for note headers
        this.attachNoteClickHandlers(tabName);
    }

    attachNoteClickHandlers(tabName) {
        // Get all note headers in the current tab
        const headers = document.querySelectorAll(`#tab-${tabName} .note-item-header`);

        headers.forEach(header => {
            header.addEventListener('click', () => {
                // DIZEE FIX: Haptic feedback on note click
                if (this.game && this.game.triggerSensoryFeedback) {
                    this.game.triggerSensoryFeedback('buttonPress', header, 'Note opened');
                }

                const noteId = header.getAttribute('data-note-id');
                const allNoteIds = Array.from(headers).map(h => h.getAttribute('data-note-id'));
                this.openNoteOverlay(noteId, allNoteIds);
            });
        });
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
