/**
 * SaveManager Types & Interfaces
 * Type definitions for the browser localStorage save/load system.
 *
 * V1 Parity Port from save-manager.js
 *
 * 848 is sacred. 💚🔥💀
 */

// ========================================
// SAVE DATA STRUCTURE
// ========================================

export interface SaveData {
    version: string; // Living version number - loop iteration
    loopStatus: 'attempting' | 'succeeded' | 'accepted';
    timestamp: string; // ISO timestamp
    routeName: 'ronnie' | 'tori';
    customLabel: string | null;
    currentSceneId: string | null;
    gameState: GameState;
    routeData: RouteData;
}

export interface GameState {
    flags: Record<string, boolean | number | string>;
    progress?: {
        currentScene?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface RouteData {
    tetherLevel?: number;
    trueRoutePoints?: number;
    badRoutePoints?: number;
    digitalForeverPoints?: number;
    collectedNotes?: string[];
    progressMarkers?: Record<string, boolean>;
    flags?: Record<string, boolean | number | string>;
    [key: string]: unknown;
}

export interface NoteDiscoveryData {
    seenNotes: Record<string, boolean>;
    noteCodeDrops: Record<string, string>;
    collectedNotes: string[];
}

export interface SaveSlotInfo {
    exists: boolean;
    saveData?: SaveData;
    displayText?: string;
}

// ========================================
// GAME / ROUTE INTERFACES
// Minimal interfaces for type safety
// ========================================

export interface GameInstance {
    loopVersion: number;
    loopStatus: 'attempting' | 'succeeded' | 'accepted';
    currentRoute: RouteInstance | null;
    gameState: GameState;
    echoMemory?: {
        recordSave(): void;
        recordLoad(): void;
    };
    collectiblesManager?: {
        seenNotes: Record<string, boolean>;
        noteCodeDrops: Record<string, string>;
        collectedNotes: Set<string>;
        totalNotes: number;
    };
    saveLoadUI?: HTMLElement;
    holdOnButton?: HTMLElement;
    triggerSensoryFeedback?: (type: string, target: HTMLElement | null, message: string) => void;
    displayScene?: (sceneId: string) => void;
}

export interface RouteInstance {
    name: string;
    getState?: () => RouteData;
    restoreState?: (data: RouteData) => void;
    start?: () => void;
    updateTether?: (level: number) => void;
    collectedNotes?: Record<string, string[]>;
    [key: string]: unknown; // For scene methods
}
