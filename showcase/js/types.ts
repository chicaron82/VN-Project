/**
 * Shared TypeScript type definitions for UV7 Showcase
 */

// Code Comparison Modal Types
export interface CodeComparison {
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
export interface TimelineEntry {
    id: string;
    phase: string;
    title: string;
    description: string;
    // ...other fields
}

export interface TimelineData {
    entries: TimelineEntry[];
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
        
        // Chaos Typer
        updateBackgroundContext?: (phaseId: string) => void;
        
        // Social Share
        shareTwitter?: () => void;
        copyLink?: () => void;
        
        // View Mode
        toggleViewMode?: () => void;
    }
}

export {};
