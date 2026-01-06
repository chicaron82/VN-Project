import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '../system/save-manager.js';

describe('SaveManager', () => {
    let saveManager;
    let mockGame;
    let mockRoute;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Mock route
        mockRoute = {
            constructor: { name: 'ToriRoute' },
            getState: vi.fn(() => ({
                tetherLevel: 75,
                trueRoutePoints: 5,
                badRoutePoints: 2,
                digitalForeverPoints: 0
            })),
            restoreState: vi.fn(),
            start: vi.fn(),
            act1: { scene1: vi.fn() },
            act2: { scene2: vi.fn() },
            act3: { scene3: vi.fn() }
        };

        // Mock game object
        mockGame = {
            loopVersion: 848,
            loopStatus: 'attempting',
            currentRoute: mockRoute,
            gameState: {
                flags: { testFlag: true },
                choices: {},
                progress: { currentScene: 'act2_scene1' },
                sprites: { left: null, right: null }
            },
            echoMemory: {
                recordSave: vi.fn(),
                recordLoad: vi.fn()
            },
            collectiblesManager: {
                seenNotes: {},
                noteCodeDrops: {},
                collectedNotes: new Set(['z1', 'z2'])
            },
            updateTitleScreen: vi.fn(),
            saveLoadUI: {
                returningToMainMenu: false,
                closeSaveLoadScreen: vi.fn(),
                hidePauseMenu: vi.fn(),
                closeConfirmDialog: vi.fn()
            },
            mainMenu: { style: { display: 'block' } },
            gameView: { style: { display: 'none', opacity: '0' } },
            dialogueBox: { style: { display: 'none' } },
            tetherUI: { style: { display: 'none' } },
            holdOnButton: { style: { display: 'none' } },
            setDialogueFrame: vi.fn(),
            deactivateInsaneMode: vi.fn(),
            triggerSensoryFeedback: vi.fn()
        };

        saveManager = new SaveManager(mockGame);

        // Stub showSaveIndicator to avoid DOM errors
        vi.spyOn(saveManager, 'showSaveIndicator').mockImplementation(() => { });
    });

    // ========================================
    // SAVE SLOT MANAGEMENT
    // ========================================

    describe('Save Slot Management', () => {
        it('should save to manual slot (1-3)', () => {
            const result = saveManager.saveGame(1);

            expect(result).toBe(true);
            const saved = localStorage.getItem('v848_save_1');
            expect(saved).toBeTruthy();

            const saveData = JSON.parse(saved);
            expect(saveData.version).toBe('848');
            expect(saveData.routeName).toBe('tori');
        });

        it('should save to auto-save slot', () => {
            const result = saveManager.saveGame(null, true);

            expect(result).toBe(true);
            const saved = localStorage.getItem('v848_autosave');
            expect(saved).toBeTruthy();
        });

        it('should return save slot info with metadata', () => {
            saveManager.saveGame(2);

            const info = saveManager.getSaveSlotInfo(2);

            expect(info.isEmpty).toBe(false);
            expect(info.slotNumber).toBe(2);
            expect(info.routeName).toBe('tori');
            expect(info.version).toBe('848');
            expect(info.timestamp).toBeInstanceOf(Date);
        });

        it('should detect empty slots', () => {
            const info = saveManager.getSaveSlotInfo(3);

            expect(info.isEmpty).toBe(true);
            expect(info.slotNumber).toBe(3);
        });

        it('should delete save slots', () => {
            saveManager.saveGame(1);
            expect(localStorage.getItem('v848_save_1')).toBeTruthy();

            saveManager.deleteSave(1);
            expect(localStorage.getItem('v848_save_1')).toBeNull();
        });
    });

    // ========================================
    // SAVE DATA CREATION
    // ========================================

    describe('Save Data Creation', () => {
        it('should create save data with all required fields', () => {
            const saveData = saveManager.createSaveData();

            expect(saveData).toBeTruthy();
            expect(saveData.version).toBe('848');
            expect(saveData.loopStatus).toBe('attempting');
            expect(saveData.timestamp).toBeTruthy();
            expect(saveData.routeName).toBe('tori');
            expect(saveData.currentSceneId).toBe('act2_scene1');
            expect(saveData.gameState).toBeTruthy();
            expect(saveData.routeData).toBeTruthy();
        });

        it('should include route-specific data', () => {
            const saveData = saveManager.createSaveData();

            expect(saveData.routeData.tetherLevel).toBe(75);
            expect(saveData.routeData.trueRoutePoints).toBe(5);
            expect(mockRoute.getState).toHaveBeenCalled();
        });

        it('should return null when no active route', () => {
            mockGame.currentRoute = null;

            const saveData = saveManager.createSaveData();

            expect(saveData).toBeNull();
        });
    });

    // ========================================
    // LOAD AND VALIDATION
    // ========================================

    describe('Load and Validation', () => {
        it('should load save data from slot', () => {
            saveManager.saveGame(1);

            const loadedData = saveManager.loadGame(1);

            expect(loadedData).toBeTruthy();
            expect(loadedData.version).toBe('848');
            expect(loadedData.routeName).toBe('tori');
            expect(mockGame.echoMemory.recordLoad).toHaveBeenCalled();
        });

        it('should validate save data (version >= 848)', () => {
            const validSave = {
                version: '850',
                routeName: 'tori',
                timestamp: new Date().toISOString()
            };

            // validateSaveData returns a boolean (true if valid)
            expect(saveManager.validateSaveData(validSave)).toBeTruthy();
        });

        it('should reject invalid save data', () => {
            const invalidSave = {
                version: '500', // Too old
                routeName: 'tori',
                timestamp: new Date().toISOString()
            };

            expect(saveManager.validateSaveData(invalidSave)).toBe(false);
        });

        it('should handle corrupted JSON gracefully', () => {
            localStorage.setItem('v848_save_1', 'invalid json{{{');

            const loadedData = saveManager.loadGame(1);

            expect(loadedData).toBeNull();
        });
    });

    // ========================================
    // STATE RESTORATION
    // ========================================

    describe('State Restoration', () => {
        it('should restore game state (flags, choices, progress)', () => {
            const saveData = {
                version: '848',
                loopStatus: 'attempting',
                routeName: 'tori',
                currentSceneId: 'act2_scene2',
                timestamp: new Date().toISOString(),
                gameState: {
                    flags: { restoredFlag: true },
                    choices: { choice1: 0 },
                    progress: { act: 2 }
                },
                routeData: { tetherLevel: 50 }
            };

            // Mock DOM elements
            global.document.getElementById = vi.fn((id) => {
                if (id === 'game-ui-layer') return { style: { display: 'none' } };
                if (id === 'route-select') return { style: { display: 'none' } };
                return null;
            });

            // Mock ToriRoute constructor
            global.ToriRoute = vi.fn(() => mockRoute);

            saveManager.restoreGameState(saveData);

            expect(mockGame.loopVersion).toBe(848);
            expect(mockGame.gameState.flags.restoredFlag).toBe(true);
            expect(mockRoute.restoreState).toHaveBeenCalledWith({ tetherLevel: 50 });
        });

        it('should restore route-specific state (tether level, points)', () => {
            const saveData = {
                version: '850',
                loopStatus: 'attempting',
                routeName: 'tori',
                currentSceneId: 'act2_scene1',
                timestamp: new Date().toISOString(),
                gameState: { flags: {} },
                routeData: {
                    tetherLevel: 60,
                    trueRoutePoints: 10,
                    badRoutePoints: 0
                }
            };

            global.document.getElementById = vi.fn(() => ({ style: { display: 'none' } }));
            global.ToriRoute = vi.fn(() => mockRoute);

            saveManager.restoreGameState(saveData);

            expect(mockRoute.restoreState).toHaveBeenCalledWith(saveData.routeData);
        });

        it('should jump to saved scene correctly', () => {
            mockRoute.act2.scene2 = vi.fn();

            saveManager.jumpToScene(mockRoute, 'scene2');

            expect(mockRoute.act2.scene2).toHaveBeenCalled();
        });
    });

    // ========================================
    // NOTE DISCOVERY PERSISTENCE
    // ========================================

    describe('Note Discovery Persistence', () => {
        it('should save note discovery data with save', () => {
            saveManager.saveNoteDiscovery(1, false);

            const saved = localStorage.getItem('noteDiscovery_slot1');
            expect(saved).toBeTruthy();

            const data = JSON.parse(saved);
            expect(data.collectedNotes).toEqual(['z1', 'z2']);
        });

        it('should restore note discovery on load', () => {
            const discoveryData = {
                seenNotes: { z1: true },
                noteCodeDrops: {},
                collectedNotes: ['z1', 'z2', 'z3']
            };

            localStorage.setItem('noteDiscovery_slot1', JSON.stringify(discoveryData));

            const loaded = saveManager.loadNoteDiscovery(1, false);

            expect(loaded.collectedNotes).toEqual(['z1', 'z2', 'z3']);
            expect(loaded.seenNotes.z1).toBe(true);
        });
    });

    // ========================================
    // SAVE BLOCKING (DESPAIR)
    // ========================================

    describe('Save Blocking (Despair)', () => {
        it('should block saves when Despair sabotages', () => {
            saveManager.blockSaves();

            const result = saveManager.saveGame(1);

            expect(result).toBe(false);
            expect(localStorage.getItem('v848_save_1')).toBeNull();
        });

        it('should unblock saves', () => {
            saveManager.blockSaves();
            saveManager.unblockSaves();

            const result = saveManager.saveGame(1);

            expect(result).toBe(true);
        });
    });

    // ========================================
    // UTILITY METHODS
    // ========================================

    describe('Utility Methods', () => {
        it('should detect if any saves exist', () => {
            expect(saveManager.hasSaves()).toBe(false);

            saveManager.saveGame(1);

            expect(saveManager.hasSaves()).toBe(true);
        });

        it('should get most recent save', () => {
            // Create first save with older timestamp
            const oldData = {
                version: '848',
                routeName: 'tori',
                timestamp: new Date(Date.now() - 10000).toISOString(), // 10 seconds ago
                gameState: { flags: {} },
                routeData: {}
            };
            localStorage.setItem('v848_save_1', JSON.stringify(oldData));

            // Create second save with newer timestamp
            const newData = {
                version: '848',
                routeName: 'tori',
                timestamp: new Date().toISOString(), // Now
                gameState: { flags: {} },
                routeData: {}
            };
            localStorage.setItem('v848_save_2', JSON.stringify(newData));

            const mostRecent = saveManager.getMostRecentSave();

            expect(mostRecent).toBeTruthy();
            expect(mostRecent.slotNumber).toBe(2);
        });

        it('should format save slot display text', () => {
            const saveData = {
                routeName: 'tori',
                timestamp: new Date('2026-01-05T10:00:00').toISOString()
            };

            const displayText = saveManager.formatSaveSlotDisplay(saveData);

            expect(displayText).toContain('Tori Route');
        });
    });

    // ========================================
    // ECHO MEMORY INTEGRATION
    // ========================================

    describe('Echo Memory Integration', () => {
        it('should record save in echo memory', () => {
            saveManager.saveGame(1);

            expect(mockGame.echoMemory.recordSave).toHaveBeenCalled();
        });

        it('should record load in echo memory', () => {
            saveManager.saveGame(1);
            saveManager.loadGame(1);

            expect(mockGame.echoMemory.recordLoad).toHaveBeenCalled();
        });
    });
});
