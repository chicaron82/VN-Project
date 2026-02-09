/**
 * UV7OS GLOBAL TYPE DECLARATIONS
 *
 * Global augmentations for Window and external UV7 classes.
 * Prevents duplicate declarations across modules.
 */

import type { UV7OS } from '../UV7OS';
import type { TimelineEntry } from '../UV7OSConfig';

declare global {
    interface Window {
        uv7os?: UV7OS;
        uv7AppSwitcher?: UV7AppSwitcher;
        tabController?: {
            navigateToTab: (tabId: string) => void;
            getActiveTab(): string;
            setActiveTab(tabId: string): void;
        };
        TIMELINE_DATA?: {
            entries: TimelineEntry[];
        };
    }

    // UV7 external classes (loaded via script tags)
    class UV7AppSwitcher {
        toggle(): void;
    }

    class UV7GrabHandleRepositioner {
        constructor(element: HTMLElement | null, options: {
            storageKey: string;
            headerSafeTop: number;
            bottomSafePad: number;
        });
    }
}

// Ensure this file is treated as a module
export {};
