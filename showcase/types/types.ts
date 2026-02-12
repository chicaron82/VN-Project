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
        UV7AppStateManager?: any;

        // Chaos Typer
        updateBackgroundContext?: (phaseId: string) => void;

        // Social Share
        shareTwitter?: () => void;
        copyLink?: () => void;

        // View Mode
        toggleViewMode?: () => void;
    }

    interface WindowEventMap {
        'uv7:state:changed': CustomEvent<any>;
        'uv7:preview:updated': CustomEvent<any>;
    }
}

export { };
