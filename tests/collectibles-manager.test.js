import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CollectiblesManager } from '../system/collectibles-manager.js';

// Mock global functions that CollectiblesManager depends on
global.getNoteMetadata = vi.fn(() => null); // Return null by default (no difficulty gate)

describe('CollectiblesManager', () => {
    let manager;
    let mockGame;
    let mockRoute;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Clear localStorage to prevent state pollution
        localStorage.clear();

        // Mock game object
        mockGame = {
            state: {
                get: vi.fn(),
                set: vi.fn()
            },
            notificationShade: {
                onNoteCollected: vi.fn(),
                updateStatusBar: vi.fn()
            },
            settingsManager: {
                settings: {
                    tetherDifficulty: 'normal'
                }
            }
        };

        // Mock route object
        mockRoute = {
            name: 'tori'
        };

        manager = new CollectiblesManager(mockGame, mockRoute);
        manager.init();
    });

    describe('Route-specific note counting', () => {
        it('should count only Tori route notes (z, cz, zr)', () => {
            // Simulate collecting Tori notes
            manager.collectedNotes.z = ['z1', 'z2'];
            manager.collectedNotes.cz = ['cz1'];
            manager.collectedNotes.zr = ['zr1'];

            // Should not count Ronnie notes
            manager.collectedNotes.gz = ['gz1'];
            manager.collectedNotes.iz = ['iz1'];

            const count = manager.getCollectedCountForCurrentRoute();
            expect(count).toBe(4); // 2 z + 1 cz + 1 zr
        });

        it('should count only Ronnie route notes (gz, iz, pz, special)', () => {
            mockRoute.name = 'ronnie';
            manager = new CollectiblesManager(mockGame, mockRoute);
            manager.init();

            manager.collectedNotes.gz = ['gz1', 'gz2'];
            manager.collectedNotes.iz = ['iz1'];
            manager.collectedNotes.pz = ['pz1'];
            manager.collectedNotes.special = ['ronnie_teaser'];

            // Should not count Tori notes
            manager.collectedNotes.z = ['z1'];

            const count = manager.getCollectedCountForCurrentRoute();
            expect(count).toBe(5); // 2 gz + 1 iz + 1 pz + 1 special
        });

        it('should return correct total count for Tori route', () => {
            const total = manager.getTotalCountForCurrentRoute();
            // Tori route has z, cz, zr notes
            expect(total).toBeGreaterThan(0);
            expect(typeof total).toBe('number');
        });

        it('should return correct total count for Ronnie route', () => {
            mockRoute.name = 'ronnie';
            manager = new CollectiblesManager(mockGame, mockRoute);
            manager.init();

            const total = manager.getTotalCountForCurrentRoute();
            // Ronnie route has gz, iz, pz, special notes
            expect(total).toBeGreaterThan(0);
            expect(typeof total).toBe('number');
        });
    });

    describe('Note unlocking', () => {
        it('should unlock a note and add to collected list', () => {
            const noteId = 'z1';
            manager.unlockNote(noteId);

            expect(manager.isNoteUnlocked(noteId)).toBe(true);
        });

        it('should not unlock the same note twice', () => {
            const noteId = 'z1';
            manager.unlockNote(noteId);

            const initialCount = manager.collectedNotes.z.length;
            manager.unlockNote(noteId); // Try to unlock again

            expect(manager.collectedNotes.z.length).toBe(initialCount);
        });

        it('should check if note is unlocked', () => {
            const noteId = 'z1';

            expect(manager.isNoteUnlocked(noteId)).toBe(false);

            manager.unlockNote(noteId);

            expect(manager.isNoteUnlocked(noteId)).toBe(true);
        });
    });

    describe('General counting', () => {
        it('should count all collected notes across all types', () => {
            manager.collectedNotes.z = ['z1', 'z2'];
            manager.collectedNotes.cz = ['cz1'];
            manager.collectedNotes.gz = ['gz1'];

            const total = manager.getCollectedCount();
            expect(total).toBe(4);
        });

        it('should count total notes of specific type', () => {
            manager.collectedNotes.z = ['z1', 'z2', 'z3'];

            const zCount = manager.getCollectedCount('z');
            expect(zCount).toBe(3);
        });
    });

    describe('Fallback behavior', () => {
        it('should fallback to all notes when route is null', () => {
            manager.route = null;

            manager.collectedNotes.z = ['z1'];
            manager.collectedNotes.gz = ['gz1'];

            const count = manager.getCollectedCountForCurrentRoute();
            expect(count).toBe(2); // Should count all notes
        });

        it('should fallback to all notes when route name is missing', () => {
            manager.route = {};

            manager.collectedNotes.z = ['z1'];
            manager.collectedNotes.gz = ['gz1'];

            const count = manager.getCollectedCountForCurrentRoute();
            expect(count).toBe(2);
        });
    });
});
