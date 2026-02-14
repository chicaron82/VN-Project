/**
 * SaveManager Restoration Logic
 * Complex state restoration functions extracted from SaveManager.
 *
 * These handle the full game state restore pipeline:
 * restoreGameState → route init → jumpToScene → legacy fallbacks → note discovery
 *
 * V1 Parity: lines 202-350 from save-manager.js
 *
 * 848 is sacred. 💚🔥💀
 */

import { Logger } from '@utils/Logger';
import type { SaveData, GameInstance, RouteInstance, RouteData, NoteDiscoveryData } from './SaveManagerTypes';

// ========================================
// GAME STATE RESTORATION
// ========================================

/**
 * Restore game state from save data
 * V1 Parity: Complete restoration of all systems
 */
export function restoreGameState(
    game: GameInstance,
    saveData: SaveData,
    loadNoteDiscovery: () => NoteDiscoveryData | null,
): void {
    Logger.save('🔄 Restoring game state from save...');

    // Restore loop version (LIVING VERSION)
    if (saveData.version) {
        game.loopVersion = parseInt(saveData.version);
    }

    // Restore loop status
    if (saveData.loopStatus) {
        game.loopStatus = saveData.loopStatus;
    }

    // Restore game state (flags, etc.)
    game.gameState = saveData.gameState;

    // Hide save/load UI
    if (game.saveLoadUI) {
        game.saveLoadUI.style.display = 'none';
    }

    // Hide route selection
    const routeSelect = document.getElementById('route-select');
    if (routeSelect) routeSelect.style.display = 'none';

    // Show game UI
    const gameUI = document.getElementById('game-ui');
    if (gameUI) gameUI.style.display = 'block';

    // Initialize the route
    if (saveData.routeName === 'ronnie') {
        Logger.save('💙 Loading Ronnie route...');

        // Show hold-on button if available
        if (game.holdOnButton) {
            game.holdOnButton.style.display = 'block';
        }
    } else {
        Logger.save('🖤 Loading Tori route...');
    }

    // Get the route instance (will be set by game engine)
    const route = game.currentRoute;

    // Apply insane mode visuals if active
    if (game.gameState.flags && game.gameState.flags.insaneModeActive) {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.add('insane-mode');
        }
    }

    // Restore route-specific data
    if (route && route.restoreState && typeof route.restoreState === 'function') {
        route.restoreState(saveData.routeData);
    } else {
        // Legacy fallback
        restoreRouteDataLegacy(game, saveData.routeData);
    }

    // Jump to the saved scene
    if (saveData.currentSceneId && route) {
        jumpToScene(game, route, saveData.currentSceneId);
    } else {
        // No scene ID - start from beginning
        if (route && route.start && typeof route.start === 'function') {
            route.start();
        }
    }

    // Restore note discovery data
    const discoveryData = loadNoteDiscovery();
    if (discoveryData && game.collectiblesManager) {
        game.collectiblesManager.seenNotes = discoveryData.seenNotes;
        game.collectiblesManager.noteCodeDrops = discoveryData.noteCodeDrops;
        game.collectiblesManager.collectedNotes = new Set(discoveryData.collectedNotes);
    }

    Logger.save('✅ Game state restored');
}

// ========================================
// SCENE JUMPING
// ========================================

/**
 * Jump to a specific scene
 * V1 Parity: Scene jumping functionality
 */
export function jumpToScene(game: GameInstance, route: RouteInstance, sceneId: string): void {
    Logger.save(`🎬 Jumping to scene: ${sceneId}`);

    // Robust scene ID validation
    // Check if scene exists as a method on the route
    if (route[sceneId]) {
        const sceneFunction = route[sceneId];

        // Additional guard: Ensure it's actually a function
        if (typeof sceneFunction === 'function') {
            try {
                // Use game engine's displayScene if available
                if (game.displayScene) {
                    game.displayScene(sceneId);
                } else {
                    // Fallback: Call scene directly
                    (sceneFunction as () => void).call(route);
                }
            } catch (error) {
                Logger.error(`Failed to jump to scene ${sceneId}:`, error);
                // Fallback: Start route from beginning
                if (route.start && typeof route.start === 'function') {
                    route.start();
                }
            }
        }
    } else {
        Logger.warn(`Scene ${sceneId} not found on route, starting from beginning`);
        if (route.start && typeof route.start === 'function') {
            route.start();
        }
    }
}

// ========================================
// LEGACY RESTORATION
// ========================================

/**
 * Legacy route data restoration
 * V1 Parity: Fallback for routes without restoreState()
 */
export function restoreRouteDataLegacy(game: GameInstance, routeData: RouteData): void {
    const route = game.currentRoute;

    if (!route || !routeData) return;

    if (route.name === 'ToriRoute') {
        if (routeData.tetherLevel !== undefined) {
            if (route.updateTether) {
                route.updateTether(routeData.tetherLevel);
            }
        }
        if (routeData.trueRoutePoints !== undefined) {
            (route as unknown as Record<string, number>).trueRoutePoints = routeData.trueRoutePoints;
        }
        if (routeData.badRoutePoints !== undefined) {
            (route as unknown as Record<string, number>).badRoutePoints = routeData.badRoutePoints;
        }
        if (routeData.digitalForeverPoints !== undefined) {
            (route as unknown as Record<string, number>).digitalForeverPoints = routeData.digitalForeverPoints;
        }
        if (routeData.collectedNotes) {
            restoreCollectedNotes(game, route, routeData.collectedNotes);
        }
    }

    if (route.name === 'RonnieRoute') {
        if (routeData.progressMarkers) {
            (route as unknown as Record<string, Record<string, boolean>>).progressMarkers = routeData.progressMarkers;
        }
    }
}

/**
 * Restore collected notes
 * V1 Parity: Reconstructs note collection state
 */
export function restoreCollectedNotes(game: GameInstance, route: RouteInstance, noteIds: string[]): void {
    if (!route.collectedNotes || !Array.isArray(noteIds)) return;

    // Note structure is expected to be: { noteId: '...' }
    for (const noteId of noteIds) {
        if (route.collectedNotes) {
            // Create type categories if they don't exist
            Object.keys(route.collectedNotes).forEach(type => {
                if (!route.collectedNotes![type]) {
                    route.collectedNotes![type] = [];
                }
                if (!route.collectedNotes![type].includes(noteId)) {
                    route.collectedNotes![type].push(noteId);
                }
            });
        }
    }

    // Update notes count display
    if (game.collectiblesManager) {
        const totalCollected = noteIds.length;
        const totalNotes = game.collectiblesManager.totalNotes;
        // UI update would be handled by collectibles manager
        Logger.save(`📧 Restored ${totalCollected}/${totalNotes} notes`);
    }
}
