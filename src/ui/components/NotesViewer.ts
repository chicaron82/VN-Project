import { EventBus } from '../../core/EventBus';
import { NoteData } from '../../core/types';
import { CollectiblesSystem } from '../../systems/CollectiblesSystem';

export class NotesViewer {
    private eventBus: EventBus;
    private collectiblesSystem: CollectiblesSystem;
    private overlay!: HTMLElement;
    private notesList!: HTMLElement;
    // private contentPane!: HTMLElement; // Unused
    private activeNoteId: string | null = null;

    // Note overlay system
    private noteOverlay!: HTMLElement;
    // private noteOverlayContent!: HTMLElement; // Unused
    private prevBtn!: HTMLButtonElement;
    private nextBtn!: HTMLButtonElement;
    private allNoteIds: string[] = [];

    constructor(eventBus: EventBus, collectiblesSystem: CollectiblesSystem) {
        this.eventBus = eventBus;
        this.collectiblesSystem = collectiblesSystem;
        this.render();
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
        // this.contentPane = this.overlay.querySelector('#note-content-pane')!;

        // Render note overlay
        this.renderNoteOverlay();
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
        this.eventBus.on('ui:notes:open', () => this.show());

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

    public show() {
        this.refreshList();
        this.overlay.style.display = 'block';
        // Force reflow for fade in
        this.overlay.offsetHeight;
        this.overlay.classList.add('visible');

        // Play sound if possible
        // this.eventBus.emit('audio:sfx', { name: 'menu_open' });
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

        // Sort by type then ID (or title)
        // Sort by type then ID (or title)
        notes.sort((a, b) => {
            if (!a || !b) return 0;
            if (a.type !== b.type) return (a.type || '').localeCompare(b.type || '');
            return (a.id || '').localeCompare(b.id || '');
        });

        notes.forEach(note => {
            if (!note) return;
            const item = document.createElement('div');
            item.className = 'note-item';
            if (this.collectiblesSystem.isRead(note.id) === false) {
                item.classList.add('unread');
            }
            if (this.activeNoteId === note.id) {
                item.classList.add('active');
            }

            item.innerHTML = `
                <div class="note-sender">${note.sender}</div>
                <div class="note-item-title">${note.title}</div>
            `;

            item.addEventListener('click', () => {
                this.openNoteOverlay(note);
            });

            this.notesList.appendChild(item);
        });
    }

    /*
    private selectNote(note: NoteData) {
        this.activeNoteId = note.id;
        this.collectiblesSystem.markAsRead(note.id);
        this.refreshList(); // Re-render to clear unread dot

        this.contentPane.innerHTML = `
            <div class="note-view">
                <div class="view-header">
                    <div class="view-sender">FROM: ${note.sender}</div>
                    <div class="view-title">${note.title}</div>
                </div>
                <div class="view-body">${note.content}</div>
            </div>
        `;
    }
    */

    // ========================================
    // NOTE OVERLAY SYSTEM (V1 PARITY)
    // ========================================

    private renderNoteOverlay() {
        this.noteOverlay = document.createElement('div');
        this.noteOverlay.className = 'note-overlay';
        this.noteOverlay.innerHTML = `
            <div class="note-overlay-content">
                <div class="note-overlay-header">
                    <div class="note-overlay-from"></div>
                    <div class="note-overlay-subject"></div>
                </div>
                <div class="note-overlay-body"></div>
                <div class="note-overlay-nav">
                    <button class="note-nav-btn" id="prev-note-btn">← PREV</button>
                    <button class="note-nav-btn" id="next-note-btn">NEXT →</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.noteOverlay);

        // this.noteOverlayContent = this.noteOverlay.querySelector('.note-overlay-content')!;
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
        this.refreshList();

        // Get all note IDs for navigation
        // Get all note IDs for navigation
        this.allNoteIds = this.collectiblesSystem.getNotes().map(n => n ? n.id : '').filter(id => id !== '');

        // Apply sender color class
        this.noteOverlay.className = 'note-overlay visible sender-' + note.type;

        // Populate overlay
        const fromEl = this.noteOverlay.querySelector('.note-overlay-from')!;
        const subjectEl = this.noteOverlay.querySelector('.note-overlay-subject')!;
        const bodyEl = this.noteOverlay.querySelector('.note-overlay-body')!;

        fromEl.textContent = `FROM: ${note.sender}`;
        subjectEl.textContent = note.title;
        bodyEl.textContent = note.content;

        // Update navigation buttons
        this.updateNavigationButtons();
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
