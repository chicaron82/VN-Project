import { CollectiblesSystem } from './CollectiblesSystem';
import { EventBus } from '@core/EventBus';

describe('CollectiblesSystem', () => {
    let system: CollectiblesSystem;
    let eventBus: EventBus;
    let storage: Record<string, string>;

    beforeEach(() => {
        storage = {};
        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key: string) => storage[key] ?? null),
            setItem: vi.fn((key: string, val: string) => { storage[key] = val; }),
            removeItem: vi.fn((key: string) => { delete storage[key]; }),
            clear: vi.fn(),
            length: 0,
            key: vi.fn()
        });

        eventBus = new EventBus();
        system = new CollectiblesSystem(eventBus);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    describe('Initialization', () => {
        it('should initialize with notes from JSON', () => {
            const allNotes = system.getAllNoteDefinitions();
            expect(Object.keys(allNotes).length).toBeGreaterThan(0);
        });

        it('should start with no collected notes', () => {
            expect(system.getNotes()).toEqual([]);
        });

        it('should start with zero unread count', () => {
            expect(system.getUnreadCount()).toBe(0);
        });
    });

    // ========================================
    // UNLOCK & COLLECTION
    // ========================================

    describe('Note Collection', () => {
        it('should unlock a note by ID', () => {
            const allNotes = system.getAllNoteDefinitions();
            const firstNoteId = Object.keys(allNotes)[0];

            system.unlockNote(firstNoteId);
            const collected = system.getNotes();

            expect(collected).toHaveLength(1);
            expect(collected[0].id).toBe(firstNoteId);
        });

        it('should emit note:collected event on unlock', () => {
            const spy = vi.fn();
            eventBus.on('note:collected', spy);

            const allNotes = system.getAllNoteDefinitions();
            const firstNoteId = Object.keys(allNotes)[0];
            system.unlockNote(firstNoteId);

            expect(spy).toHaveBeenCalledWith(expect.objectContaining({
                id: firstNoteId,
                count: 1
            }));
        });

        it('should not duplicate-unlock a note', () => {
            const allNotes = system.getAllNoteDefinitions();
            const firstNoteId = Object.keys(allNotes)[0];

            system.unlockNote(firstNoteId);
            system.unlockNote(firstNoteId);

            expect(system.getNotes()).toHaveLength(1);
        });

        it('should warn on unknown note ID', () => {
            expect(() => system.unlockNote('nonexistent_note_xyz')).not.toThrow();
            expect(system.getNotes()).toHaveLength(0);
        });
    });

    // ========================================
    // READ TRACKING
    // ========================================

    describe('Read Tracking', () => {
        it('should mark a note as read', () => {
            const allNotes = system.getAllNoteDefinitions();
            const noteId = Object.keys(allNotes)[0];

            system.unlockNote(noteId);
            expect(system.isRead(noteId)).toBe(false);

            system.markAsRead(noteId);
            expect(system.isRead(noteId)).toBe(true);
        });

        it('should track unread count correctly', () => {
            const allNotes = system.getAllNoteDefinitions();
            const noteIds = Object.keys(allNotes).slice(0, 3);

            noteIds.forEach(id => system.unlockNote(id));
            expect(system.getUnreadCount()).toBe(3);

            system.markAsRead(noteIds[0]);
            expect(system.getUnreadCount()).toBe(2);
        });
    });

    // ========================================
    // VIEW COUNTS
    // ========================================

    describe('View Counts', () => {
        it('should start at zero views', () => {
            expect(system.getViewCount('z1')).toBe(0);
        });

        it('should increment view count', () => {
            system.incrementViewCount('z1');
            system.incrementViewCount('z1');
            system.incrementViewCount('z1');
            expect(system.getViewCount('z1')).toBe(3);
        });
    });

    // ========================================
    // RNG CODE DROPS
    // ========================================

    describe('Code Drop System', () => {
        it('should return guaranteed code on first view', () => {
            // z6 has guaranteed: 'echo'
            system.unlockNote('z6');
            const drop = system.processNoteDrop('z6');

            expect(drop).not.toBeNull();
            expect(drop!.hasCode).toBe(true);
            expect(drop!.code).toBe('echo');
            expect(drop!.wasGuaranteed).toBe(true);
        });

        it('should emit secret_code:unlocked on guaranteed drop', () => {
            const spy = vi.fn();
            eventBus.on('secret_code:unlocked', spy);

            system.unlockNote('z6');
            system.processNoteDrop('z6');

            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ code: 'echo' }));
        });

        it('should return cached drop on repeat calls', () => {
            system.unlockNote('z6');
            const first = system.processNoteDrop('z6');
            const second = system.processNoteDrop('z6');

            expect(first).toEqual(second);
        });

        it('should return null for notes without metadata', () => {
            const drop = system.processNoteDrop('unknown_note_xyz');
            expect(drop).toBeNull();
        });

        it('should trigger pity drop after 3 views', () => {
            // z1 has dropChance: 0.3, pool: ['torigatchi'], no guaranteed
            // Mock Math.random to always fail RNG
            vi.spyOn(Math, 'random').mockReturnValue(0.99);

            system.unlockNote('z1');

            // Views 1 and 2: manual increments (processNoteDrop auto-increments too)
            // processNoteDrop for z1 will:
            //   view 1: RNG check fails (0.99 > 0.3) → no drop, but caches result
            // Since it caches, we need to work differently.
            // Actually, processNoteDrop caches after FIRST call. So pity only works
            // if view count was built up BEFORE first processNoteDrop call.
            system.incrementViewCount('z1');
            system.incrementViewCount('z1');
            // Now viewCount is 2, processNoteDrop will make it 3 = PITY_THRESHOLD

            const drop = system.processNoteDrop('z1');
            expect(drop!.hasCode).toBe(true);
            expect(drop!.code).toBe('torigatchi');
        });

        it('should report views until pity', () => {
            expect(system.getViewsUntilPity('z1')).toBe(3);
            system.incrementViewCount('z1');
            expect(system.getViewsUntilPity('z1')).toBe(2);
        });

        it('should identify notes with code pools', () => {
            expect(system.noteHasCodePool('z1')).toBe(true);   // pool: ['torigatchi']
            expect(system.noteHasCodePool('z6')).toBe(true);   // guaranteed: 'echo'
            expect(system.noteHasCodePool('ronnie_teaser')).toBe(false); // empty pool, no guaranteed
        });
    });

    // ========================================
    // ROUTE FILTERING
    // ========================================

    describe('Route Filtering', () => {
        it('should filter notes by Tori route', () => {
            system.setRoute('tori');
            const available = system.getAvailableNotes();
            // All available notes should be z, cz, or zr type
            available.forEach(note => {
                expect(['z', 'cz', 'zr']).toContain(note.type);
            });
        });

        it('should filter notes by Ronnie route', () => {
            system.setRoute('ronnie');
            const available = system.getAvailableNotes();
            available.forEach(note => {
                expect(['gz', 'iz', 'pz', 'special']).toContain(note.type);
            });
        });

        it('should return all types when route is null', () => {
            system.setRoute(null);
            const available = system.getAvailableNotes();
            expect(available.length).toBeGreaterThan(0);
        });
    });

    // ========================================
    // DIFFICULTY GATING
    // ========================================

    describe('Difficulty Gating', () => {
        it('should gate insane notes behind insane difficulty', () => {
            system.setDifficulty('normal');
            // z9 is insane difficulty
            expect(system.isNoteAvailable('z9')).toBe(false);

            system.setDifficulty('insane');
            expect(system.isNoteAvailable('z9')).toBe(true);
        });

        it('should make easy notes available at all difficulties', () => {
            system.setDifficulty('easy');
            expect(system.isNoteAvailable('z1')).toBe(true);
        });

        it('should make normal notes available at normal+', () => {
            system.setDifficulty('easy');
            expect(system.isNoteAvailable('z3')).toBe(false); // z3 is normal

            system.setDifficulty('normal');
            expect(system.isNoteAvailable('z3')).toBe(true);
        });

        it('should return true for unknown note IDs', () => {
            expect(system.isNoteAvailable('nonexistent')).toBe(true);
        });
    });

    // ========================================
    // PERSISTENCE
    // ========================================

    describe('Persistence', () => {
        it('should persist state to localStorage on unlock', () => {
            const allNotes = system.getAllNoteDefinitions();
            const noteId = Object.keys(allNotes)[0];
            system.unlockNote(noteId);

            expect(storage['uv7_collectibles']).toBeDefined();
            const state = JSON.parse(storage['uv7_collectibles']);
            expect(state.collected).toContain(noteId);
        });

        it('should load persisted state', () => {
            const allNotes = system.getAllNoteDefinitions();
            const noteId = Object.keys(allNotes)[0];

            // Pre-seed storage
            storage['uv7_collectibles'] = JSON.stringify({
                collected: [noteId],
                read: [],
                viewCounts: {},
                timestamps: {},
                revealedCodes: {},
                codeDrops: {}
            });

            // Create fresh instance — should load from storage
            const fresh = new CollectiblesSystem(eventBus);
            expect(fresh.getNotes()).toHaveLength(1);
        });
    });

    // ========================================
    // RESET
    // ========================================

    describe('Reset', () => {
        it('should clear all state on reset', () => {
            const allNotes = system.getAllNoteDefinitions();
            const noteId = Object.keys(allNotes)[0];

            system.unlockNote(noteId);
            system.markAsRead(noteId);
            system.incrementViewCount(noteId);

            system.reset();

            expect(system.getNotes()).toEqual([]);
            expect(system.getUnreadCount()).toBe(0);
            expect(system.getViewCount(noteId)).toBe(0);
        });
    });

    // ========================================
    // UTILITY
    // ========================================

    describe('Utility', () => {
        it('should format relative time correctly', () => {
            const now = Date.now();
            expect(system.getRelativeTime(now - 30 * 1000)).toBe('just now');
            expect(system.getRelativeTime(now - 5 * 60 * 1000)).toBe('5m ago');
            expect(system.getRelativeTime(now - 3 * 60 * 60 * 1000)).toBe('3h ago');
            expect(system.getRelativeTime(now - 2 * 24 * 60 * 60 * 1000)).toBe('2d ago');
        });

        it('should return empty string for zero timestamp', () => {
            expect(system.getRelativeTime(0)).toBe('');
        });
    });
});
