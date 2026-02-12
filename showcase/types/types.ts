import type { BlogEntry } from '../data/blog/types';

// Code Comparison Modal Types
export interface CodeComparison {
    title?: string;
    before: {
        title: string;
        badge: string;
        code: string;
    };
    after: {
        title: string;
        badge: string;
        code: string;
    };
}

export interface CodeComparisonModal {
    open(data: CodeComparison): void;
    close(): void;
}

// Timeline Data Types
export type TimelineEntry = BlogEntry;

export interface TimelineData {
    entries: BlogEntry[];
}

// App State Management Types
export interface AppPreview {
    type: string;
    gradient: [string, string];
    effect: string;
    badge: string;
    title: string;
    subtitle: string;
}

export interface AppSystemState {
    activeTab?: string;
    activeEntry?: string | number;
    viewMode?: string;
    scene?: string;
    characters?: string[];
    route?: string;
    act?: string | number;
    tether?: number;
    mood?: string;
    lastFed?: number;
    scroll?: Record<string, number>;
    [key: string]: unknown;
}

export interface StateChangeDetail {
    appId: string;
    state?: AppSystemState;
    preview?: Partial<AppPreview>;
}

// App State Manager Central Type
export interface AppStateManagerInterface {
    loadAllStates(): Record<string, unknown>;
    getAppState(appId: string): unknown | null;
    clearAppState(appId: string): void;
    restoreState(appId: string): Record<string, unknown> | null;
    getNewContentCount(appId: string): number;
    createScrollHandler(appId: string, tabId: string): (scrollPosition: number) => void;
}

// Window augmentations
declare global {
    interface Window {
        // Confetti System
        uv7Confetti?: {
            fire(x: number, y: number): void;
        };

        // Code Comparison Modal
        codeComparisonModal?: CodeComparisonModal;

        // Timeline Data
        TIMELINE_DATA?: TimelineData;

        // App State Manager
        UV7AppStateManager?: AppStateManagerInterface;

        // Chaos Typer
        updateBackgroundContext?: (phaseId: string) => void;

        // Social Share
        shareTwitter?: () => void;
        copyLink?: () => void;

        // View Mode
        toggleViewMode?: () => void;
    }

    interface WindowEventMap {
        'uv7:state:changed': CustomEvent<StateChangeDetail>;
        'uv7:preview:updated': CustomEvent<{ appId: string; preview: AppPreview }>;
    }
}

export { };
