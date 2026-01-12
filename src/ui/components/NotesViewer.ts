import { EventBus } from '../../core/EventBus';
import { NoteData } from '../../core/types';
import { CollectiblesSystem } from '../../systems/CollectiblesSystem';

export class NotesViewer {
    private eventBus: EventBus;
    private collectiblesSystem: CollectiblesSystem;
    private overlay!: HTMLElement;
    private notesList!: HTMLElement;
    private contentPane!: HTMLElement;
    private activeNoteId: string | null = null;

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
        this.contentPane = this.overlay.querySelector('#note-content-pane')!;
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
        notes.sort((a, b) => {
            if (a.type !== b.type) return a.type.localeCompare(b.type);
            return a.id.localeCompare(b.id);
        });

        notes.forEach(note => {
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
                this.selectNote(note);
            });

            this.notesList.appendChild(item);
        });
    }

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
}
