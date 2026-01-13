import { EventBus } from '../../core/EventBus';
import { NoteData } from '../../core/types';
import { CollectiblesSystem } from '../../systems/CollectiblesSystem';

/**
 * Note type icon mapping
 */
const NOTE_TYPE_ICONS: Record<string, string> = {
    z: '📧',      // Z (The Architect) - Email/transmission
    cz: '🔒',     // CZ (The Heart) - Locked/encrypted heart
    zr: '💜',     // ZR (Chaos) - Tori route purple
    gz: '🌊',     // GZ (Reality Breaker) - Wave/reality
    iz: '📱',     // IZ (Fresh Eyes) - Device/clarity
    pz: '💔',     // PZ (Question Engine) - Ronnie route
    special: '⭐'  // Special notes - Star
};

/**
 * Toast notification for note unlocks
 */
interface ToastQueueItem {
    icon: string;
    title: string;
    noteId: string;
}

export class NotesViewer {
    private eventBus: EventBus;
    private collectiblesSystem: CollectiblesSystem;
    private overlay!: HTMLElement;
    private notesList!: HTMLElement;
    private activeNoteId: string | null = null;

    // Note overlay system
    private noteOverlay!: HTMLElement;
    private prevBtn!: HTMLButtonElement;
    private nextBtn!: HTMLButtonElement;
    private allNoteIds: string[] = [];

    // Toast notification system
    private toastContainer!: HTMLElement;
    private toastQueue: ToastQueueItem[] = [];
    private isShowingToast: boolean = false;

    // RNG code drop tracking
    private readonly VIEW_THRESHOLD = 3;
    private readonly CODE_DROP_CHANCE = 0.30; // 30%

    constructor(eventBus: EventBus, collectiblesSystem: CollectiblesSystem) {
        this.eventBus = eventBus;
        this.collectiblesSystem = collectiblesSystem;
        this.render();
        this.renderToastContainer();
        this.setupListeners();
    }

    private render() {
        const existing = document.getElementById('notes-viewer-overlay');
        if (existing) existing.remove();

        this.overlay = document.createElement('div');
        this.overlay.id = 'notes-viewer-overlay';
        this.overlay.className = 'notes-viewer-overlay';
        this.overlay.innerHTML = `
            <div class="notes-container">
                <div class="notes-header">
                    <div class="notes-title">
                        <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        SECRET ARCHIVE
                    </div>
                    <button class="close-btn" id="notes-close-btn">✕</button>
                </div>
                <div class="notes-body">
                    <div class="notes-list" id="notes-list-container">
                        <!-- Notes injected here -->
                    </div>
                    <div class="note-content-pane" id="note-content-pane">
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            <p>Select a transmission to decrypt</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.notesList = this.overlay.querySelector('#notes-list-container')!;

        // Render note overlay
        this.renderNoteOverlay();
    }

    /**
     * Render toast notification container
     */
    private renderToastContainer() {
        const existing = document.getElementById('notes-toast-container');
        if (existing) existing.remove();

        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'notes-toast-container';
        this.toastContainer.className = 'notes-toast-container';
        document.body.appendChild(this.toastContainer);
    }

    private setupListeners() {
        // Close button
        this.overlay.querySelector('#notes-close-btn')?.addEventListener('click', () => {
            this.hide();
        });

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });

        // Listen for open events
        // Listen for open events
        this.eventBus.on('ui:notes:open', () => this.show());
        this.eventBus.on('ui:notes:close', () => this.hide());

        // Listen for note collected events - show toast
        this.eventBus.on('note:collected', (data) => {
            this.queueToast(data.id, data.title, this.getNoteType(data.id));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.noteOverlay.classList.contains('visible')) return;

            if (e.key === 'Escape') {
                this.closeNoteOverlay();
            } else if (e.key === 'ArrowLeft') {
                this.navigateNote('prev');
            } else if (e.key === 'ArrowRight') {
                this.navigateNote('next');
            }
        });
    }

    /**
     * Get note type from note ID
     */
    private getNoteType(noteId: string): string {
        const notes = this.collectiblesSystem.getNotes();
        const note = notes.find(n => n && n.id === noteId);
        return note?.type || 'special';
    }

    /**
     * Queue a toast notification (prevents stacking)
     */
    private queueToast(noteId: string, title: string, type: string) {
        const icon = NOTE_TYPE_ICONS[type] || '📧';
        this.toastQueue.push({ icon, title, noteId });

        if (!this.isShowingToast) {
            this.showNextToast();
        }
    }

    /**
     * Show the next toast in queue
     */
    private showNextToast() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }

        this.isShowingToast = true;
        const toast = this.toastQueue.shift()!;

        const toastEl = document.createElement('div');
        toastEl.className = 'note-toast';
        toastEl.innerHTML = `
            <span class="toast-icon">${toast.icon}</span>
            <span class="toast-text">Note Unlocked: ${toast.title}</span>
        `;

        this.toastContainer.appendChild(toastEl);

        // Emit event for external tracking
        this.eventBus.emit('note:toast' as any, { noteId: toast.noteId, title: toast.title });

        // Trigger animation
        requestAnimationFrame(() => {
            toastEl.classList.add('visible');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toastEl.classList.add('hiding');
            setTimeout(() => {
                toastEl.remove();
                this.showNextToast(); // Show next in queue
            }, 500);
        }, 3000);
    }

    public show() {
        this.refreshList();
        this.overlay.style.display = 'block';
        // Force reflow for fade in
        this.overlay.offsetHeight;
        this.overlay.classList.add('visible');
    }

    public hide() {
        this.overlay.classList.remove('visible');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.eventBus.emit('ui:notes_closed', {});
        }, 300);
    }

    private refreshList() {
        this.notesList.innerHTML = '';
        const notes = this.collectiblesSystem.getNotes();

        // Sort by type then ID
        notes.sort((a, b) => {
            if (!a || !b) return 0;
            if (a.type !== b.type) return (a.type || '').localeCompare(b.type || '');
            return (a.id || '').localeCompare(b.id || '');
        });

        notes.forEach(note => {
            if (!note) return;
            const item = document.createElement('div');
            item.className = 'note-item';

            const isUnread = this.collectiblesSystem.isRead(note.id) === false;
            if (isUnread) {
                item.classList.add('unread');
            }
            if (this.activeNoteId === note.id) {
                item.classList.add('active');
            }

            // Check if recently collected (within 5 minutes)
            const timestamp = this.collectiblesSystem.getCollectionTimestamp(note.id);
            const isNew = timestamp && (Date.now() - timestamp) < 5 * 60 * 1000;
            if (isNew) {
                item.classList.add('recently-collected');
            }

            // Get view count for badge
            const viewCount = this.collectiblesSystem.getViewCount(note.id);
            const icon = NOTE_TYPE_ICONS[note.type] || '📧';
            const relativeTime = timestamp ? this.formatRelativeTime(timestamp) : '';

            item.innerHTML = `
                <div class="note-item-header">
                    <span class="note-type-icon">${icon}</span>
                    <span class="note-sender">${note.sender}</span>
                    ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                    ${viewCount > 0 ? `<span class="view-count-badge">${viewCount}</span>` : ''}
                </div>
                <div class="note-item-title">${note.title}</div>
                ${relativeTime ? `<div class="note-timestamp">${relativeTime}</div>` : ''}
            `;

            item.addEventListener('click', () => {
                this.openNoteOverlay(note);
            });

            this.notesList.appendChild(item);
        });
    }

    /**
     * Format timestamp as relative time
     */
    private formatRelativeTime(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    }

    // ========================================
    // NOTE OVERLAY SYSTEM (V1 PARITY)
    // ========================================

    private renderNoteOverlay() {
        this.noteOverlay = document.createElement('div');
        this.noteOverlay.className = 'note-overlay';
        this.noteOverlay.innerHTML = `
            <div class="note-overlay-content">
                <div class="note-overlay-header">
                    <div class="note-overlay-meta">
                        <span class="note-overlay-icon"></span>
                        <span class="note-overlay-from"></span>
                    </div>
                    <div class="note-overlay-subject"></div>
                    <div class="note-overlay-timestamp"></div>
                </div>
                <div class="note-overlay-body"></div>
                <div class="note-code-drop-area"></div>
                <div class="note-overlay-nav">
                    <button class="note-nav-btn" id="prev-note-btn">← PREV</button>
                    <button class="note-nav-btn" id="next-note-btn">NEXT →</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.noteOverlay);

        this.prevBtn = this.noteOverlay.querySelector('#prev-note-btn')!;
        this.nextBtn = this.noteOverlay.querySelector('#next-note-btn')!;

        // Navigation button listeners
        this.prevBtn.addEventListener('click', () => this.navigateNote('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateNote('next'));

        // Close on overlay click
        this.noteOverlay.addEventListener('click', (e) => {
            if (e.target === this.noteOverlay) this.closeNoteOverlay();
        });
    }

    private openNoteOverlay(note: NoteData) {
        this.activeNoteId = note.id;
        this.collectiblesSystem.markAsRead(note.id);

        // Increment view count
        this.collectiblesSystem.incrementViewCount(note.id);
        const viewCount = this.collectiblesSystem.getViewCount(note.id);

        this.refreshList();

        // Get all note IDs for navigation
        this.allNoteIds = this.collectiblesSystem.getNotes().map(n => n ? n.id : '').filter(id => id !== '');

        // Apply sender color class
        const icon = NOTE_TYPE_ICONS[note.type] || '📧';
        this.noteOverlay.className = 'note-overlay visible sender-' + note.type;

        // Populate overlay
        const iconEl = this.noteOverlay.querySelector('.note-overlay-icon')!;
        const fromEl = this.noteOverlay.querySelector('.note-overlay-from')!;
        const subjectEl = this.noteOverlay.querySelector('.note-overlay-subject')!;
        const timestampEl = this.noteOverlay.querySelector('.note-overlay-timestamp')!;
        const bodyEl = this.noteOverlay.querySelector('.note-overlay-body')!;
        const codeDropArea = this.noteOverlay.querySelector('.note-code-drop-area')!;

        iconEl.textContent = icon;
        fromEl.textContent = `FROM: ${note.sender}`;
        subjectEl.textContent = note.title;

        // Show timestamp if available
        const timestamp = this.collectiblesSystem.getCollectionTimestamp(note.id);
        if (timestamp) {
            timestampEl.textContent = `Collected: ${this.formatRelativeTime(timestamp)}`;
            (timestampEl as HTMLElement).style.display = 'block';
        } else {
            (timestampEl as HTMLElement).style.display = 'none';
        }

        bodyEl.textContent = note.content;

        // Process RNG code drop
        this.processCodeDrop(note.id, viewCount, codeDropArea);

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    /**
     * Process RNG code drop system
     * After viewing a note 3 times, 30% chance to reveal hidden code
     */
    private processCodeDrop(noteId: string, viewCount: number, codeDropArea: Element) {
        // Check if code already revealed for this note
        const revealedCode = this.collectiblesSystem.getRevealedCode(noteId);

        if (revealedCode) {
            // Code already revealed - show it
            codeDropArea.innerHTML = `
                <div class="code-revealed">
                    <div class="code-revealed-header">🔓 CODE DISCOVERED</div>
                    <div class="code-revealed-value">${revealedCode}</div>
                    <div class="code-revealed-hint">Enter in Settings → Secret Codes</div>
                </div>
            `;
            codeDropArea.classList.add('has-code');
            return;
        }

        // Check if eligible for code drop (viewed 3+ times)
        if (viewCount >= this.VIEW_THRESHOLD) {
            // Roll for code drop (30% chance)
            if (Math.random() < this.CODE_DROP_CHANCE) {
                // Code dropped! Generate a code based on note type
                const code = this.generateCodeForNote(noteId);

                if (code) {
                    // Store the revealed code
                    this.collectiblesSystem.setRevealedCode(noteId, code);

                    // Show special animation
                    codeDropArea.innerHTML = `
                        <div class="code-revealed code-drop-animation">
                            <div class="code-revealed-header">🎉 CODE UNLOCKED! 🎉</div>
                            <div class="code-revealed-value">${code}</div>
                            <div class="code-revealed-hint">Enter in Settings → Secret Codes</div>
                        </div>
                    `;
                    codeDropArea.classList.add('has-code');

                    // Emit code revealed event
                    this.eventBus.emit('code:revealed' as any, { noteId, code });

                    // Show toast for code reveal
                    this.showCodeRevealToast(code);
                    return;
                }
            }
        }

        // No code yet - show progress hint if close
        if (viewCount > 0 && viewCount < this.VIEW_THRESHOLD) {
            const remaining = this.VIEW_THRESHOLD - viewCount;
            codeDropArea.innerHTML = `
                <div class="code-hint">
                    <span class="code-hint-icon">📡</span>
                    <span class="code-hint-text">Signal detected... View ${remaining} more time${remaining > 1 ? 's' : ''} for potential decode</span>
                </div>
            `;
        } else if (viewCount >= this.VIEW_THRESHOLD) {
            // Eligible but didn't drop this time
            codeDropArea.innerHTML = `
                <div class="code-hint code-hint-active">
                    <span class="code-hint-icon">🔐</span>
                    <span class="code-hint-text">Encrypted signal active... Keep viewing for chance to decode</span>
                </div>
            `;
        } else {
            codeDropArea.innerHTML = '';
        }
    }

    /**
     * Generate a code based on note ID
     * Maps notes to specific codes from the game
     */
    private generateCodeForNote(noteId: string): string | null {
        // Map certain notes to specific codes (from V1 collectibles-manager.js)
        const codeMap: Record<string, string> = {
            'z6': 'ECHO',
            'z7': '848',
            'z8': 'TORIGATCHI',
            'z9': 'UV7CREW',
            'z10': 'ECHOBREAK',
            'cz3': 'HEARTKEY',
            'zr3': 'ALWAYS3',
            'gz2': 'BOOTSTRAP',
            'gz3': 'SAVEANYWHERE',
        };

        return codeMap[noteId] || null;
    }

    /**
     * Show special toast for code reveal
     */
    private showCodeRevealToast(code: string) {
        const toastEl = document.createElement('div');
        toastEl.className = 'note-toast code-toast';
        toastEl.innerHTML = `
            <span class="toast-icon">🔓</span>
            <span class="toast-text">Secret Code Revealed: ${code}</span>
        `;

        this.toastContainer.appendChild(toastEl);

        requestAnimationFrame(() => {
            toastEl.classList.add('visible');
        });

        setTimeout(() => {
            toastEl.classList.add('hiding');
            setTimeout(() => {
                toastEl.remove();
            }, 500);
        }, 4000); // Longer duration for code reveals
    }

    private closeNoteOverlay() {
        this.noteOverlay.classList.remove('visible');
    }

    private navigateNote(direction: 'prev' | 'next') {
        if (!this.activeNoteId) return;

        const currentIndex = this.allNoteIds.indexOf(this.activeNoteId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= this.allNoteIds.length) return;

        const newNoteId = this.allNoteIds[newIndex];
        const newNote = this.collectiblesSystem.getNotes().find(n => n && n.id === newNoteId);

        if (newNote) {
            this.openNoteOverlay(newNote);
        }
    }

    private updateNavigationButtons() {
        if (!this.activeNoteId) return;

        const currentIndex = this.allNoteIds.indexOf(this.activeNoteId);

        // Disable prev if at start
        this.prevBtn.disabled = currentIndex <= 0;

        // Disable next if at end
        this.nextBtn.disabled = currentIndex >= this.allNoteIds.length - 1;
    }
}
