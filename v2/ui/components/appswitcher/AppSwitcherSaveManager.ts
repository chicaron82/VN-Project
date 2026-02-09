// ═══════════════════════════════════════════════════════════════
// APP SWITCHER SAVE MANAGER
// Clear/undo save data with toast notifications
//
// Extracted from UV7AppSwitcher.ts (lines 684-825)
// DiZee's UX Polish: undo flow
// ═══════════════════════════════════════════════════════════════

import type { AppDefinition, UndoBackup } from './AppCatalog';
import type { AppSwitcherState } from './AppSwitcherState';
import { Logger } from '@utils/Logger';

export interface SaveManagerElements {
    undoToast: HTMLElement | null;
    undoMessage: HTMLElement | null;
    undoBtn: HTMLElement | null;
}

export interface SaveManagerCallbacks {
    addToRecent(appId: string): void;
    onAfterClear(): void; // triggers re-render
}

/**
 * AppSwitcherSaveManager
 *
 * Handles save clearing with undo support, including:
 * - Per-app save clearing (swipe or button)
 * - Undo toast with 5-second window
 * - Clear all saves confirmation
 */
export class AppSwitcherSaveManager {
    private undoBackup: UndoBackup | null = null;
    private undoTimeout: number | null = null;

    constructor(
        private elements: SaveManagerElements,
        private apps: AppDefinition[],
        private state: AppSwitcherState,
        private callbacks: SaveManagerCallbacks
    ) {}

    // ═══════════════════════════════════════════════════════════════
    // CLEAR APP SAVE WITH UNDO - DIZEE'S UX POLISH
    // ═══════════════════════════════════════════════════════════════

    clearAppSave(app: AppDefinition, card: HTMLElement): void {
        // Backup save data before clearing (for undo)
        const backup: Record<string, string> = {};
        app.saveKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) backup[key] = data;
        });

        // Also backup last played timestamp
        const lastPlayedKey = `uv7_last_played_${app.id}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        if (lastPlayed) backup[lastPlayedKey] = lastPlayed;

        this.undoBackup = { app, backup };

        // Animate card flying off
        card.classList.add('clearing');

        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            // Clear localStorage
            app.saveKeys.forEach(key => {
                localStorage.removeItem(key);
            });
            localStorage.removeItem(lastPlayedKey);

            // Note: Don't remove from recent apps - just cleared save, not visited history

            // Show undo toast
            this.showUndoToast(`${app.name} save cleared`);

            // Re-render
            this.callbacks.onAfterClear();
        }, 300);
    }

    private showUndoToast(message: string): void {
        if (!this.elements.undoMessage || !this.elements.undoToast) return;

        if (this.undoTimeout) {
            clearTimeout(this.undoTimeout);
        }

        this.elements.undoMessage.textContent = message;
        this.elements.undoToast.classList.add('show');

        // Auto-hide after 5 seconds
        this.undoTimeout = window.setTimeout(() => {
            this.elements.undoToast?.classList.remove('show');
            this.undoBackup = null;
        }, 5000);
    }

    undoClear(): void {
        if (!this.undoBackup) return;

        const { app, backup } = this.undoBackup;

        // Restore all backed up data
        Object.entries(backup).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        // Re-add to recent apps
        this.callbacks.addToRecent(app.id);

        // Hide toast
        this.elements.undoToast?.classList.remove('show');
        if (this.undoTimeout) {
            clearTimeout(this.undoTimeout);
            this.undoTimeout = null;
        }

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([25, 25, 25]);
        }

        this.undoBackup = null;

        // Re-render
        this.callbacks.onAfterClear();

        Logger.ui(`✅ Restored ${app.name} save data`);
    }

    confirmClearSave(app: AppDefinition, card: HTMLElement): void {
        const stateData = app.getState();
        const stateStr = stateData.state.join(' • ');

        const confirmed = confirm(
            `Clear ${app.name} save data?\n\n` +
            `Current progress: ${stateStr}\n\n` +
            `This can be undone within 5 seconds.`
        );

        if (confirmed) {
            this.clearAppSave(app, card);
        }
    }

    confirmClearAll(): void {
        const appsWithSaves = this.apps.filter(app => {
            const stateData = app.getState();
            return stateData.hasSave;
        });

        if (appsWithSaves.length === 0) {
            alert('No saves to clear!');
            return;
        }

        const appNames = appsWithSaves.map(a => a.name).join(', ');
        const confirmed = confirm(
            `Clear ALL save data?\n\n` +
            `This will reset: ${appNames}\n\n` +
            `This action cannot be undone!`
        );

        if (confirmed) {
            appsWithSaves.forEach(app => {
                app.saveKeys.forEach(key => {
                    localStorage.removeItem(key);
                });
                localStorage.removeItem(`uv7_last_played_${app.id}`);
            });

            // Clear all state (recent apps + resume flags)
            this.state.clear();

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            this.callbacks.onAfterClear();
        }
    }
}
