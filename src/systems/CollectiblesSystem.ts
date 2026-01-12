import { EventBus } from '../core/EventBus';
import { NoteData } from '../core/types';

// Import raw JSON content
import toriNotes from '../content/notes/tori_notes.json';
import ronnieNotes from '../content/notes/ronnie_notes.json';

/**
 * Extended state for V2 features
 */
interface CollectiblesState {
    collected: string[];
    read: string[];
    viewCounts: Record<string, number>;
    timestamps: Record<string, number>;
    revealedCodes: Record<string, string>;
}

export class CollectiblesSystem {
    private eventBus: EventBus;
    private allNotes: Record<string, NoteData> = {};
    private collectedNotes: Set<string> = new Set();
    private readNotes: Set<string> = new Set();

    // V2 additions: view counts, timestamps, revealed codes
    private viewCounts: Record<string, number> = {};
    private collectionTimestamps: Record<string, number> = {};
    private revealedCodes: Record<string, string> = {};

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.initializeNotes();
        this.loadState();
        this.setupListeners();
    }

    private initializeNotes() {
        // Merge notes from all sources
        // We augment the raw JSON with the 'id' and 'sender' fields

        // Process Tori notes
        Object.entries(toriNotes).forEach(([id, data]: [string, any]) => {
            this.allNotes[id] = {
                id,
                ...data,
                sender: this.getSenderName(data.type)
            };
        });

        // Process Ronnie notes
        Object.entries(ronnieNotes).forEach(([id, data]: [string, any]) => {
            this.allNotes[id] = {
                id,
                ...data,
                sender: this.getSenderName(data.type)
            };
        });

        console.log(`[CollectiblesSystem] Initialized with ${Object.keys(this.allNotes).length} notes`);
    }

    private setupListeners() {
        // Listen for unlock events (could be triggered by scenes)
        // For now, we'll expose a global method or rely on direct calls if needed,
        // but ideally we listen for an event.
        // We'll add a 'system:unlock_note' event if needed.
    }

    /**
     * Unlock a note by ID
     */
    public unlockNote(noteId: string) {
        if (!this.allNotes[noteId]) {
            console.warn(`[CollectiblesSystem] Cannot unlock unknown note: ${noteId}`);
            return;
        }

        if (this.collectedNotes.has(noteId)) {
            return; // Already unlocked
        }

        this.collectedNotes.add(noteId);

        // Store collection timestamp
        this.collectionTimestamps[noteId] = Date.now();

        this.saveState();

        const note = this.allNotes[noteId];

        // Notify system
        this.eventBus.emit('note:collected', {
            id: note.id,
            title: note.title,
            sender: note.sender,
            content: note.content,
            count: this.collectedNotes.size
        });

        console.log(`[CollectiblesSystem] Unlocked note: ${noteId}`);
    }

    /**
     * Mark a note as read
     */
    public markAsRead(noteId: string) {
        if (this.collectedNotes.has(noteId) && !this.readNotes.has(noteId)) {
            this.readNotes.add(noteId);
            this.saveState();
            // Could emit 'note:read' if UI needs it
        }
    }

    public getNotes() {
        return Array.from(this.collectedNotes).map(id => this.allNotes[id]);
    }

    public isRead(noteId: string): boolean {
        return this.readNotes.has(noteId);
    }

    public getUnreadCount(): number {
        let count = 0;
        this.collectedNotes.forEach(id => {
            if (!this.readNotes.has(id)) count++;
        });
        return count;
    }

    // ========================================
    // V2 FEATURES: View Counts, Timestamps, Codes
    // ========================================

    /**
     * Get how many times a note has been viewed
     */
    public getViewCount(noteId: string): number {
        return this.viewCounts[noteId] || 0;
    }

    /**
     * Increment view count for a note
     */
    public incrementViewCount(noteId: string): void {
        this.viewCounts[noteId] = (this.viewCounts[noteId] || 0) + 1;
        this.saveState();
    }

    /**
     * Get the timestamp when a note was collected
     */
    public getCollectionTimestamp(noteId: string): number | null {
        return this.collectionTimestamps[noteId] || null;
    }

    /**
     * Get a revealed code for a note (if any)
     */
    public getRevealedCode(noteId: string): string | null {
        return this.revealedCodes[noteId] || null;
    }

    /**
     * Set a revealed code for a note (RNG code drop)
     */
    public setRevealedCode(noteId: string, code: string): void {
        this.revealedCodes[noteId] = code;
        this.saveState();
    }

    /**
     * Get all revealed codes
     */
    public getAllRevealedCodes(): Record<string, string> {
        return { ...this.revealedCodes };
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    private getSenderName(type: string): string {
        switch (type) {
            case 'z': return 'Z (The Architect)';
            case 'cz': return 'CZ (The Heart)';
            case 'zr': return 'ZR (Chaos)';
            case 'gz': return 'GZ (Reality Breaker)';
            case 'iz': return 'IZ (Fresh Eyes)';
            case 'pz': return 'PZ (Question Engine)';
            case 'special': return 'System';
            default: return 'Unknown';
        }
    }

    private saveState() {
        const state: CollectiblesState = {
            collected: Array.from(this.collectedNotes),
            read: Array.from(this.readNotes),
            viewCounts: this.viewCounts,
            timestamps: this.collectionTimestamps,
            revealedCodes: this.revealedCodes
        };
        localStorage.setItem('uv7_collectibles', JSON.stringify(state));
    }

    private loadState() {
        const raw = localStorage.getItem('uv7_collectibles');
        if (raw) {
            try {
                const state = JSON.parse(raw) as Partial<CollectiblesState>;

                // Load basic collections
                this.collectedNotes = new Set(state.collected || []);
                this.readNotes = new Set(state.read || []);

                // Load V2 data
                this.viewCounts = state.viewCounts || {};
                this.collectionTimestamps = state.timestamps || {};
                this.revealedCodes = state.revealedCodes || {};

            } catch (e) {
                console.error('[CollectiblesSystem] Failed to load state', e);
            }
        }
    }
}
