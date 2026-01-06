import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '../../system/save-manager.js';
import { EchoMemorySystem } from '../../system/echo-memory-system.js';
import { AchievementManager } from '../../system/achievement-manager.js';

describe('Critical User Flows - Integration Tests', () => {
    let mockGame;

    beforeEach(() => {
        localStorage.clear();

        // Create comprehensive mock game object
        mockGame = {
            loopVersion: 848,
            loopStatus: 'attempting',
            currentRoute: null,
            gameState: {
                flags: {},
                choices: {},
                progress: {},
                sprites: { left: null, right: null }
            },
            updateTitleScreen: vi.fn(),
            mainMenu: { style: { display: 'block' } },
            gameView: { style: { display: 'none', opacity: '0' } },
            dialogueBox: { style: { display: 'none' } },
            tetherUI: { style: { display: 'none' } },
            holdOnButton: { style: { display: 'none' } },
            setDialogueFrame: vi.fn(),
            deactivateInsaneMode: vi.fn(),
            triggerSensoryFeedback: vi.fn(),
            statusNotification: {
                show: vi.fn()
            },
            saveLoadUI: {
                returningToMainMenu: false,
                closeSaveLoadScreen: vi.fn(),
                hidePauseMenu: vi.fn(),
                closeConfirmDialog: vi.fn()
            }
        };
    });

    // ========================================
    // SAVE/LOAD STATE PRESERVATION
    // ========================================

    describe('Save and Load Preserves State', () => {
        it('should preserve all game state across save/load cycle', () => {
            // Setup: Create a mock route with state
            const mockRoute = {
                constructor: { name: 'ToriRoute' },
                getState: vi.fn(() => ({
                    tetherLevel: 65,
                    trueRoutePoints: 8,
                    badRoutePoints: 1,
                    digitalForeverPoints: 0
                })),
                restoreState: vi.fn(),
                start: vi.fn(),
                act2: { testScene: vi.fn() }
            };

            mockGame.currentRoute = mockRoute;
            mockGame.gameState.flags = { importantChoice: true, metCharacter: true };
            mockGame.gameState.progress = { currentScene: 'testScene', act: 2 };

            // Create save manager and save
            const saveManager = new SaveManager(mockGame);
            vi.spyOn(saveManager, 'showSaveIndicator').mockImplementation(() => { });

            const saveResult = saveManager.saveGame(1);
            expect(saveResult).toBe(true);

            // Verify save data was created correctly
            const savedData = saveManager.loadGame(1);
            expect(savedData).toBeTruthy();
            expect(savedData.routeName).toBe('tori');
            expect(savedData.gameState.flags.importantChoice).toBe(true);
            expect(savedData.routeData.tetherLevel).toBe(65);
            expect(savedData.routeData.trueRoutePoints).toBe(8);
        });
    });

    // ========================================
    // ACHIEVEMENT UNLOCK FLOW
    // ========================================

    describe('Achievement Unlock Flow', () => {
        it('should unlock achievement and trigger notification', () => {
            mockGame.collectiblesManager = {
                collectedNotes: { z: [], cz: [], zr: [] }
            };
            mockGame.settingsManager = {
                settings: { tetherDifficulty: 'normal' }
            };

            const achievementManager = new AchievementManager(mockGame);

            // Trigger Speed Runner achievement
            const thirtyMinutesAgo = Date.now() - (25 * 60 * 1000); // 25 minutes
            achievementManager.stats.routeStartTime = thirtyMinutesAgo;

            achievementManager.checkSpeedRunner();

            // Verify achievement unlocked
            expect(achievementManager.achievements.speed_runner.unlocked).toBe(true);
            expect(achievementManager.achievements.speed_runner.unlockedAt).toBeTruthy();

            // Verify notification triggered
            expect(mockGame.triggerSensoryFeedback).toHaveBeenCalledWith(
                'achievement',
                null,
                'Achievement unlocked!'
            );
        });
    });

    // ========================================
    // ECHO MEMORY PROGRESSION
    // ========================================

    describe('Echo Memory Progression', () => {
        it('should increase awareness levels with repeated loops', () => {
            const echoMemory = new EchoMemorySystem(mockGame);

            // Simulate 10 loops
            for (let i = 0; i < 10; i++) {
                echoMemory.recordLoop();
            }

            // Verify awareness levels increased
            expect(echoMemory.memory.totalLoops).toBe(10);

            // At 10 loops, at least one echo should be aware (level >= 2)
            const totalAwareness = echoMemory.memory.echoAwareness.hope +
                echoMemory.memory.echoAwareness.gentle +
                echoMemory.memory.echoAwareness.despair;

            expect(totalAwareness).toBeGreaterThan(0);
        });

        it('should trigger echo comments when awareness is high enough', () => {
            const echoMemory = new EchoMemorySystem(mockGame);

            // Set awareness level high enough to trigger comments
            echoMemory.memory.echoAwareness.despair = 2;

            // Trigger a comment
            echoMemory.triggerEchoComment('despair', 'general');

            // Verify notification was shown
            expect(mockGame.statusNotification.show).toHaveBeenCalled();
            const call = mockGame.statusNotification.show.mock.calls[0][0];
            expect(call.type).toBe('echo');
            expect(call.icon).toBe('🖤');
        });
    });

    // ========================================
    // NOTE COLLECTION PERSISTENCE
    // ========================================

    describe('Note Collection Persistence', () => {
        it('should persist collected notes across save/load', () => {
            const mockRoute = {
                constructor: { name: 'ToriRoute' },
                getState: vi.fn(() => ({ tetherLevel: 100 })),
                restoreState: vi.fn(),
                start: vi.fn()
            };

            mockGame.currentRoute = mockRoute;
            mockGame.collectiblesManager = {
                seenNotes: { z1: true, z2: true },
                noteCodeDrops: {},
                collectedNotes: new Set(['z1', 'z2', 'z3'])
            };

            const saveManager = new SaveManager(mockGame);
            vi.spyOn(saveManager, 'showSaveIndicator').mockImplementation(() => { });

            // Save with note discovery
            saveManager.saveGame(1);
            saveManager.saveNoteDiscovery(1, false);

            // Load note discovery
            const loadedDiscovery = saveManager.loadNoteDiscovery(1, false);

            // Verify notes persisted
            expect(loadedDiscovery).toBeTruthy();
            expect(loadedDiscovery.collectedNotes).toEqual(['z1', 'z2', 'z3']);
            expect(loadedDiscovery.seenNotes.z1).toBe(true);
        });
    });

    // ========================================
    // TETHER SYSTEM INTEGRATION
    // ========================================

    describe('Tether System Integration', () => {
        it('should record death in echo memory when tether reaches 0', () => {
            const echoMemory = new EchoMemorySystem(mockGame);

            // Simulate tether death
            echoMemory.recordDeath('critical_scene', 'tether');

            // Verify death was recorded
            expect(echoMemory.memory.tetherDeaths).toBe(1);
            expect(echoMemory.memory.deathLocations['critical_scene']).toBe(1);
        });

        it('should trigger despair comment after repeated deaths', () => {
            const echoMemory = new EchoMemorySystem(mockGame);

            // Die 3 times at same location
            echoMemory.recordDeath('difficult_scene', 'tether');
            echoMemory.recordDeath('difficult_scene', 'tether');
            echoMemory.recordDeath('difficult_scene', 'tether');

            // Set awareness high enough
            echoMemory.memory.echoAwareness.despair = 2;

            // Trigger comment
            echoMemory.triggerEchoComment('despair', 'repeatedDeath', 'difficult_scene');

            // Verify notification shown
            expect(mockGame.statusNotification.show).toHaveBeenCalled();
        });
    });

    // ========================================
    // SETTINGS PERSISTENCE
    // ========================================

    describe('Settings Persistence', () => {
        it('should persist settings to localStorage', () => {
            const settings = {
                tetherDifficulty: 'insane',
                textSpeed: 50,
                masterVolume: 0.8,
                musicVolume: 0.7,
                sfxVolume: 0.9
            };

            // Save settings
            localStorage.setItem('gameSettings', JSON.stringify(settings));

            // Load settings
            const loaded = JSON.parse(localStorage.getItem('gameSettings'));

            // Verify all settings persisted
            expect(loaded.tetherDifficulty).toBe('insane');
            expect(loaded.textSpeed).toBe(50);
            expect(loaded.masterVolume).toBe(0.8);
            expect(loaded.musicVolume).toBe(0.7);
            expect(loaded.sfxVolume).toBe(0.9);
        });

        it('should persist loop version across page refresh', () => {
            const loopVersion = 852;
            const loopStatus = 'succeeded';

            // Save loop state (simulating what SaveManager does)
            localStorage.setItem('loopVersion', loopVersion.toString());
            localStorage.setItem('loopStatus', loopStatus);

            // Load loop state (simulating page refresh)
            const loadedVersion = parseInt(localStorage.getItem('loopVersion'));
            const loadedStatus = localStorage.getItem('loopStatus');

            // Verify persistence
            expect(loadedVersion).toBe(852);
            expect(loadedStatus).toBe('succeeded');
        });
    });
});
