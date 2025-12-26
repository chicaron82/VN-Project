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

// Tether System types
export interface DifficultyProfile {
    name: string;
    decayRates: {
        base: number;
        medium: number;
        critical: number;
    };
    tetherCap: number;
    holdOnBoost: number;
    holdOnCooldown: number;
}

export interface EchoState {
    name: string;
    mood: string;
    color: string;
    active: boolean;
}

export interface TetherSaveState {
    tetherLevel: number;
    echoes: Record<string, EchoState>;
    holdOnCooldown: boolean;
}

export interface EchoDialogue {
    echo1?: string;
    echo2?: string;
    despair?: string;
}

// Collectibles Manager types
export type NoteCategory = 'z' | 'cz' | 'zr' | 'gz' | 'iz' | 'pz' | 'special';

export interface Note {
    id?: string;
    type: NoteCategory;
    title: string;
    content: string;
    category?: NoteCategory;
    from?: string;
    timestamp?: string;
    isSecret?: boolean;
    requiresCode?: string;
    unlockMessage?: string;
}

export interface ViewerState {
    currentFilter: 'all' | 'story' | 'codes';
    unreadNotes: Set<string>;
    isOpen: boolean;
}
