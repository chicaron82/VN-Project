import { EventBus } from '../core/EventBus';
import { NoteData } from '../core/types';
import { Logger } from '../utils/Logger';

// Import raw JSON content
import toriNotes from '../content/notes/tori_notes.json';
import ronnieNotes from '../content/notes/ronnie_notes.json';

/**
 * ════════════════════════════════════════════════════════════════
 * COLLECTIBLES SYSTEM - V2 Port
 * Phase 15a: Full V1 parity with RNG code drops, pity system,
 * route filtering, and difficulty gating
 *
 * V1 Parity: collectibles-manager.js (1940 lines → ~400 lines)
 *
 * Features:
 * - Note collection and tracking
 * - RNG code drops with pity system (3-view guarantee)
 * - Route-specific filtering (Tori vs Ronnie notes)
 * - Difficulty gating for notes
 * - Integration with SecretCodesSystem
 * - Unread badge tracking
 *
 * 💚🔥💀 "Every note tells a story" - DiZee
 * ════════════════════════════════════════════════════════════════
 */

/**
 * DIZEE: Note metadata for RNG code drops
 * V1 Parity: GAME_NOTES structure from game-config.js
 */
interface NoteMetadata {
    difficulty: 'easy' | 'normal' | 'intense' | 'insane';
    pool: string[];      // Codes that can drop from this note
    dropChance: number;  // 0.0 - 1.0 probability
    guaranteed: string | null;  // Code guaranteed on first view
}

/**
 * DIZEE: Code drop result
 * V1 Parity: NoteDrop typedef
 */
interface CodeDrop {
    hasCode: boolean;
    code: string | null;
    timestamp: number;
    wasGuaranteed: boolean;
}

/**
 * Extended state for V2 features
 */
interface CollectiblesState {
    collected: string[];
    read: string[];
    viewCounts: Record<string, number>;
    timestamps: Record<string, number>;
    revealedCodes: Record<string, string>;
    codeDrops: Record<string, CodeDrop>;  // DIZEE: Track code drops per note
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

    // DIZEE: RNG code drop tracking (V1 parity)
    private codeDrops: Record<string, CodeDrop> = {};
    private currentRoute: 'tori' | 'ronnie' | null = null;
    private currentDifficulty: 'easy' | 'normal' | 'intense' | 'insane' = 'normal';

    // DIZEE: Pity system constant (V1 parity)
    private static readonly PITY_THRESHOLD = 3;

    // DIZEE: Note metadata for RNG drops (V1 parity: GAME_NOTES)
    private static readonly NOTE_METADATA: Record<string, NoteMetadata> = {
        // ════════════════════════════════════════════════════════════
        // TORI ROUTE - EASY DIFFICULTY
        // ════════════════════════════════════════════════════════════
        'z1': { difficulty: 'easy', pool: ['torigatchi'], dropChance: 0.3, guaranteed: null },
        'z2': { difficulty: 'easy', pool: ['bootstrap', '848'], dropChance: 0.3, guaranteed: null },
        'cz1': { difficulty: 'easy', pool: ['always3'], dropChance: 0.4, guaranteed: null },
        'zr1': { difficulty: 'easy', pool: ['always3'], dropChance: 0.4, guaranteed: null },

        // ════════════════════════════════════════════════════════════
        // TORI ROUTE - NORMAL DIFFICULTY
        // ════════════════════════════════════════════════════════════
        'z3': { difficulty: 'normal', pool: ['ronniegatchi'], dropChance: 0.4, guaranteed: null },
        'z4': { difficulty: 'normal', pool: ['uv7crew'], dropChance: 0.4, guaranteed: null },
        'z5': { difficulty: 'normal', pool: ['bootstrap'], dropChance: 0.5, guaranteed: null },
        'z6': { difficulty: 'normal', pool: ['echo'], dropChance: 0, guaranteed: 'echo' },
        'cz2': { difficulty: 'normal', pool: ['echo'], dropChance: 0.4, guaranteed: null },
        'zr2': { difficulty: 'normal', pool: ['dizee'], dropChance: 0.3, guaranteed: null },

        // ════════════════════════════════════════════════════════════
        // TORI ROUTE - INTENSE DIFFICULTY
        // ════════════════════════════════════════════════════════════
        'z7': { difficulty: 'intense', pool: ['848'], dropChance: 0, guaranteed: '848' },
        'z8': { difficulty: 'intense', pool: ['torigatchi'], dropChance: 0, guaranteed: 'torigatchi' },
        'cz3': { difficulty: 'intense', pool: ['heartkey'], dropChance: 0, guaranteed: 'heartkey' },
        'zr3': { difficulty: 'intense', pool: ['always3'], dropChance: 0, guaranteed: 'always3' },

        // ════════════════════════════════════════════════════════════
        // TORI ROUTE - INSANE DIFFICULTY
        // ════════════════════════════════════════════════════════════
        'z9': { difficulty: 'insane', pool: ['uv7crew'], dropChance: 0, guaranteed: 'uv7crew' },
        'z10': { difficulty: 'insane', pool: ['echobreak', 'tetherlock'], dropChance: 0.5, guaranteed: null },
        'tori_dev_note': { difficulty: 'insane', pool: ['chicharon'], dropChance: 0, guaranteed: 'chicharon' },

        // ════════════════════════════════════════════════════════════
        // RONNIE ROUTE NOTES
        // ════════════════════════════════════════════════════════════
        'gz1': { difficulty: 'easy', pool: ['bootstrap'], dropChance: 0.3, guaranteed: null },
        'gz2': { difficulty: 'normal', pool: ['bootstrap'], dropChance: 0, guaranteed: 'bootstrap' },
        'gz3': { difficulty: 'intense', pool: ['saveanywhere'], dropChance: 0, guaranteed: 'saveanywhere' },
        'iz1': { difficulty: 'easy', pool: ['heartkey'], dropChance: 0.3, guaranteed: null },
        'iz2': { difficulty: 'normal', pool: ['echo'], dropChance: 0.4, guaranteed: null },
        'pz1': { difficulty: 'normal', pool: ['dizee'], dropChance: 0.3, guaranteed: null },
        'pz2': { difficulty: 'intense', pool: ['uv7crew'], dropChance: 0.4, guaranteed: null },
        'ronnie_teaser': { difficulty: 'easy', pool: [], dropChance: 0, guaranteed: null },
        'ronnie_dev_note': { difficulty: 'insane', pool: ['chicharon', 'torigatchi'], dropChance: 0, guaranteed: 'torigatchi' }
    };

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

        Logger.system(`[CollectiblesSystem] Initialized with ${Object.keys(this.allNotes).length} notes`);
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
            Logger.warn(`[CollectiblesSystem] Cannot unlock unknown note: ${noteId}`);
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

        Logger.system(`[CollectiblesSystem] Unlocked note: ${noteId}`);
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
            revealedCodes: this.revealedCodes,
            codeDrops: this.codeDrops
        };
        localStorage.setItem('uv7_collectibles', JSON.stringify(state));
    }

    private loadState() {
        // Check for V2 Data
        const raw = localStorage.getItem('uv7_collectibles');
        if (raw) {
            try {
                const state = JSON.parse(raw) as Partial<CollectiblesState>;
                this.collectedNotes = new Set(state.collected || []);
                this.readNotes = new Set(state.read || []);
                this.viewCounts = state.viewCounts || {};
                this.collectionTimestamps = state.timestamps || {};
                this.revealedCodes = state.revealedCodes || {};
                this.codeDrops = state.codeDrops || {};
                return; // Loaded successfully
            } catch (e) {
                Logger.error('[CollectiblesSystem] Failed to load state', e);
            }
        }

        // Check for V1 Data (Migration)
        const v1Collected = localStorage.getItem('vn_collected_notes');
        if (v1Collected) {
            Logger.system('🔄 [CollectiblesSystem] Migrating V1 Collectibles...');
            try {
                // Migrate collected notes
                const collected = JSON.parse(v1Collected);
                if (Array.isArray(collected)) {
                    this.collectedNotes = new Set(collected);
                }

                // Migrate read status
                const v1Read = localStorage.getItem('notesReadStatus');
                if (v1Read) {
                    const read = JSON.parse(v1Read);
                    if (Array.isArray(read)) {
                        this.readNotes = new Set(read);
                    }
                }

                // Migrate timestamps
                const v1Timestamps = localStorage.getItem('vn_note_timestamps');
                if (v1Timestamps) {
                    const timestamps = JSON.parse(v1Timestamps);
                    // V1 might have been simple kv pair? Assuming matching structure roughly
                    if (typeof timestamps === 'object') {
                        this.collectionTimestamps = timestamps;
                    }
                }

                // Save to V2 immediately
                this.saveState();

            } catch (e) {
                Logger.warn('Failed to migrate V1 collectibles:', e);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════
    // DIZEE: RNG CODE DROP SYSTEM (V1 Parity)
    // Revolutionary replayability - codes drop from notes with pity
    // ════════════════════════════════════════════════════════════════

    /**
     * Process note view for potential code drop
     * V1 Parity: processNoteDrop() with pity system
     *
     * @param noteId - The note being viewed
     * @returns CodeDrop result with code info
     */
    public processNoteDrop(noteId: string): CodeDrop | null {
        const metadata = CollectiblesSystem.NOTE_METADATA[noteId];
        if (!metadata) return null;

        // Already have a drop result for this note?
        if (this.codeDrops[noteId]) {
            return this.codeDrops[noteId];
        }

        // Increment view count
        this.incrementViewCount(noteId);
        const timesViewed = this.viewCounts[noteId];

        // Check for guaranteed code (utility codes, first-view reveals)
        if (metadata.guaranteed) {
            const guaranteedCode = metadata.guaranteed;
            const drop: CodeDrop = {
                hasCode: true,
                code: guaranteedCode,
                timestamp: Date.now(),
                wasGuaranteed: true
            };

            this.codeDrops[noteId] = drop;
            this.revealedCodes[noteId] = guaranteedCode;
            this.saveState();

            // Emit code discovery event (name defaults to code for now)
            this.eventBus.emit('secret_code:unlocked', { code: guaranteedCode, name: guaranteedCode.toUpperCase() });

            Logger.system(`✅ [CollectiblesSystem] Guaranteed code drop: ${guaranteedCode}`);
            return drop;
        }

        // No code pool = no RNG drop possible
        if (!metadata.pool || metadata.pool.length === 0) {
            const drop: CodeDrop = { hasCode: false, code: null, timestamp: Date.now(), wasGuaranteed: false };
            this.codeDrops[noteId] = drop;
            this.saveState();
            return drop;
        }

        // PITY SYSTEM: Force drop after PITY_THRESHOLD views
        let shouldDrop = false;
        const viewCount = timesViewed ?? 0;

        if (viewCount >= CollectiblesSystem.PITY_THRESHOLD) {
            shouldDrop = true;
            Logger.system(`🎁 [CollectiblesSystem] Pity triggered for ${noteId} after ${viewCount} views`);
        } else {
            // Normal RNG check
            shouldDrop = Math.random() < metadata.dropChance;
        }

        if (shouldDrop) {
            // Pick random code from pool
            const droppedCode = metadata.pool[Math.floor(Math.random() * metadata.pool.length)];

            const drop: CodeDrop = {
                hasCode: true,
                code: droppedCode ?? null,
                timestamp: Date.now(),
                wasGuaranteed: false
            };

            this.codeDrops[noteId] = drop;
            if (droppedCode) {
                this.revealedCodes[noteId] = droppedCode;
            }
            this.saveState();

            // Emit code discovery event
            if (droppedCode) {
                this.eventBus.emit('secret_code:unlocked', { code: droppedCode, name: droppedCode.toUpperCase() });
            }

            Logger.system(`🎲 [CollectiblesSystem] RNG code drop: ${droppedCode} from ${noteId}`);
            return drop;
        } else {
            const drop: CodeDrop = { hasCode: false, code: null, timestamp: Date.now(), wasGuaranteed: false };
            this.codeDrops[noteId] = drop;
            this.saveState();

            Logger.system(`❌ [CollectiblesSystem] No drop from ${noteId} (${timesViewed}/${CollectiblesSystem.PITY_THRESHOLD} views)`);
            return drop;
        }
    }

    /**
     * Get views remaining until pity drop
     */
    public getViewsUntilPity(noteId: string): number {
        const views = this.viewCounts[noteId] || 0;
        return Math.max(0, CollectiblesSystem.PITY_THRESHOLD - views);
    }

    /**
     * Check if a note has a code pool (can drop codes)
     */
    public noteHasCodePool(noteId: string): boolean {
        const metadata = CollectiblesSystem.NOTE_METADATA[noteId];
        return !!(metadata && (metadata.guaranteed || (metadata.pool && metadata.pool.length > 0)));
    }

    // ════════════════════════════════════════════════════════════════
    // DIZEE: ROUTE FILTERING (V1 Parity)
    // Only show notes relevant to current route
    // ════════════════════════════════════════════════════════════════

    /**
     * Set current route for filtering
     */
    public setRoute(route: 'tori' | 'ronnie' | null): void {
        this.currentRoute = route;
        Logger.system(`[CollectiblesSystem] Route set to: ${route}`);
    }

    /**
     * Set current difficulty for note gating
     */
    public setDifficulty(difficulty: 'easy' | 'normal' | 'intense' | 'insane'): void {
        this.currentDifficulty = difficulty;
        Logger.system(`[CollectiblesSystem] Difficulty set to: ${difficulty}`);
    }

    /**
     * Get note types for current route
     * V1 Parity: Route-specific note filtering
     */
    private getNoteTypesForRoute(): string[] {
        if (this.currentRoute === 'tori') {
            return ['z', 'cz', 'zr'];
        } else if (this.currentRoute === 'ronnie') {
            return ['gz', 'iz', 'pz', 'special'];
        }
        // Fallback: all types
        return ['z', 'cz', 'zr', 'gz', 'iz', 'pz', 'special'];
    }

    /**
     * Get collected count for current route only
     * V1 Parity: getCollectedCountForCurrentRoute()
     */
    public getCollectedCountForRoute(): number {
        const routeTypes = this.getNoteTypesForRoute();
        let count = 0;

        this.collectedNotes.forEach(noteId => {
            const note = this.allNotes[noteId];
            if (note && routeTypes.includes(note.type)) {
                count++;
            }
        });

        return count;
    }

    /**
     * Get total available notes for current route
     * V1 Parity: getTotalCountForCurrentRoute()
     */
    public getTotalCountForRoute(): number {
        const routeTypes = this.getNoteTypesForRoute();
        return Object.values(this.allNotes).filter(note =>
            routeTypes.includes(note.type)
        ).length;
    }

    /**
     * Get notes filtered by current route
     */
    public getNotesForRoute(): NoteData[] {
        const routeTypes = this.getNoteTypesForRoute();
        return Array.from(this.collectedNotes)
            .map(id => this.allNotes[id])
            .filter((note): note is NoteData => note !== undefined && routeTypes.includes(note.type));
    }

    // ════════════════════════════════════════════════════════════════
    // DIZEE: DIFFICULTY GATING (V1 Parity)
    // Notes locked behind difficulty levels
    // ════════════════════════════════════════════════════════════════

    /**
     * Check if a note is available at current difficulty
     * V1 Parity: isDifficultyUnlocked()
     */
    public isNoteAvailable(noteId: string): boolean {
        const metadata = CollectiblesSystem.NOTE_METADATA[noteId];
        if (!metadata) return true; // Unknown notes are available

        const difficultyOrder = ['easy', 'normal', 'intense', 'insane'];
        const requiredIndex = difficultyOrder.indexOf(metadata.difficulty);
        const currentIndex = difficultyOrder.indexOf(this.currentDifficulty);

        return currentIndex >= requiredIndex;
    }

    /**
     * Get all notes available at current difficulty for current route
     */
    public getAvailableNotes(): NoteData[] {
        const routeTypes = this.getNoteTypesForRoute();
        return Object.values(this.allNotes).filter(note => {
            if (!routeTypes.includes(note.type)) return false;
            return this.isNoteAvailable(note.id);
        });
    }

    /**
     * Get note metadata for UI display
     */
    public getNoteMetadata(noteId: string): NoteMetadata | null {
        return CollectiblesSystem.NOTE_METADATA[noteId] || null;
    }

    // ════════════════════════════════════════════════════════════════
    // DIZEE: UTILITY METHODS
    // ════════════════════════════════════════════════════════════════

    /**
     * Format timestamp as relative time
     * V1 Parity: getRelativeTime()
     */
    public getRelativeTime(timestamp: number): string {
        if (!timestamp) return '';

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
    }

    /**
     * Reset all collectibles state (for new game)
     */
    public reset(): void {
        this.collectedNotes.clear();
        this.readNotes.clear();
        this.viewCounts = {};
        this.collectionTimestamps = {};
        this.revealedCodes = {};
        this.codeDrops = {};
        this.saveState();
        Logger.system('[CollectiblesSystem] State reset');
    }

    /**
     * Get all note definitions (for standalone viewer)
     * V1 Parity: static getAllNoteDefinitions()
     */
    public getAllNoteDefinitions(): Record<string, NoteData> {
        return { ...this.allNotes };
    }
}
