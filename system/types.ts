// Type definitions for game state
export interface GameState {
    game: {
        loopVersion: string;
        currentRoute: string | null;
        currentScene: string | null;
        paused: boolean;
    };
    unlocks: {
        skipUnlocked: boolean;
        skipPrologueUnlocked: boolean;
        ronnieNotesUnlocked: boolean;
        insaneModeUnlocked: boolean;
    };
    tether: {
        level: number;
        difficulty: 'relaxed' | 'normal' | 'intense' | 'insane';
        decayRate: number;
        cap: number;
        frozen: boolean;
    };
    settings: {
        textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
        autoAdvance: boolean;
        autoDelay: number;
        autoSkipPrologue: boolean;
        fullscreen: boolean;
        displayMode: 'auto' | 'portrait' | 'landscape';
        tetherDifficulty: 'relaxed' | 'normal' | 'intense' | 'insane';
        hapticEnabled: boolean;
        comfortMode: boolean;
        comfortIntensity: 0 | 1 | 2;
    };
    collectibles: {
        unlockedNotes: string[];
        readScenes: string[];
    };
    ui: {
        hidden: boolean;
        menuOpen: string | null;
    };
}

// Subscriber callback type
export type SubscriberCallback<T = any> = (newValue: T, oldValue: T) => void;

// Snapshot type
export interface StateSnapshot {
    name: string;
    timestamp: number;
    state: GameState;
}

// History entry type
export interface HistoryEntry {
    timestamp: number;
    path: string;
    oldValue: any;
    newValue: any;
}
