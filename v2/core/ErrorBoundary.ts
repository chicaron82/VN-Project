/**
 * GLOBAL ERROR BOUNDARY
 * User-friendly error handling with modal UI
 *
 * Features:
 * - Catches unhandled errors and promise rejections
 * - Shows user-friendly modal instead of white screen
 * - Error message mapping to non-technical terms
 * - Recovery options: Reload or Try to Continue
 * - Error logging with localStorage history
 * - Auto-save attempt before showing modal
 */

import { Logger } from '@utils/Logger';

export interface ErrorLogEntry {
    timestamp: string;
    message: string;
    stack?: string;
    currentScene?: string;
    userAgent: string;
    url: string;
    context: string;
}

export class ErrorBoundary {
    private static instance: ErrorBoundary | null = null;
    private errorCount: number = 0;
    private maxErrors: number = 5;
    private errorModal: HTMLElement | null = null;
    private errorHistory: ErrorLogEntry[] = [];
    private readonly MAX_ERROR_HISTORY = 10;
    private readonly STORAGE_KEY = 'uv7_error_log';

    private constructor() {
        this.loadErrorHistory();
        this.init();
    }

    public static getInstance(): ErrorBoundary {
        if (!ErrorBoundary.instance) {
            ErrorBoundary.instance = new ErrorBoundary();
        }
        return ErrorBoundary.instance;
    }

    private init(): void {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            Logger.error('Unhandled Promise Rejection:', event.reason);
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault();
        });

        // Catch uncaught errors
        window.addEventListener('error', (event) => {
            Logger.error('Uncaught Error:', event.error);
            this.handleError(event.error || event.message, 'Uncaught Error');
            event.preventDefault();
        });

        Logger.system('[ErrorBoundary] Global error handlers initialized');
    }

    /**
     * Main error handler
     */
    private handleError(error: unknown, context: string = 'Error'): void {
        this.errorCount++;

        // Haptic feedback for error
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }

        // Log to console
        Logger.error(`[ErrorBoundary ${this.errorCount}/${this.maxErrors}]`, error);

        // Log to history
        this.logError(error, context);

        // Prevent error spam
        if (this.errorCount > this.maxErrors) {
            Logger.warn('[ErrorBoundary] Too many errors, suppressing further error UI');
            return;
        }

        // Attempt auto-save before showing modal
        this.attemptEmergencySave();

        // Show user-friendly error modal
        this.showErrorModal(error, context);
    }

    /**
     * Attempt emergency save before showing error
     */
    private attemptEmergencySave(): void {
        try {
            // Try to access saveSystem from window (if available)
            const saveSystem = (window as any).saveSystem;
            if (saveSystem && typeof saveSystem.forceAutoSave === 'function') {
                saveSystem.forceAutoSave().catch(() => {
                    Logger.warn('[ErrorBoundary] Emergency auto-save failed');
                });
            }
        } catch (e) {
            Logger.warn('[ErrorBoundary] Could not attempt emergency save:', e);
        }
    }

    /**
     * Map technical error to user-friendly message
     */
    private getUserFriendlyMessage(error: unknown): string {
        const errorString = this.getErrorMessage(error).toLowerCase();

        // Network errors
        if (errorString.includes('fetch') ||
            errorString.includes('network') ||
            errorString.includes('failed to fetch') ||
            errorString.includes('net::') ||
            errorString.includes('xhr')) {
            return 'Connection problem. Check your internet.';
        }

        // LocalStorage errors
        if (errorString.includes('localstorage') ||
            errorString.includes('quota') ||
            errorString.includes('storage') ||
            errorString.includes('exceeded')) {
            return 'Storage full. Try clearing browser data.';
        }

        // JSON parse errors
        if (errorString.includes('json') ||
            errorString.includes('parse') ||
            errorString.includes('unexpected token') ||
            errorString.includes('syntax error')) {
            return 'Save data corrupted. Starting fresh may help.';
        }

        // Resource loading errors
        if (errorString.includes('load') ||
            errorString.includes('undefined') ||
            errorString.includes('null') ||
            errorString.includes('not found') ||
            errorString.includes('404')) {
            return 'A resource failed to load. Try reloading.';
        }

        // Script/module errors
        if (errorString.includes('module') ||
            errorString.includes('import') ||
            errorString.includes('script')) {
            return 'Application code failed to load. Try reloading.';
        }

        // Generic fallback
        return 'Something went wrong. Try reloading.';
    }

    /**
     * Extract error message string
     */
    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        if (error && typeof (error as any).message === 'string') {
            return (error as any).message;
        }
        return String(error);
    }

    /**
     * Get current scene from state manager (if available)
     */
    private getCurrentScene(): string {
        try {
            const uv7 = (window as any).uv7;
            if (uv7 && uv7.stateManager) {
                return uv7.stateManager.get('currentScene') || 'unknown';
            }
        } catch (e) {
            // Ignore
        }
        return 'unknown';
    }

    /**
     * Show the error modal
     */
    private showErrorModal(error: unknown, context: string): void {
        // Don't show multiple modals
        if (this.errorModal) {
            this.updateModalMessage(error);
            return;
        }

        this.errorModal = document.createElement('div');
        this.errorModal.className = 'error-modal-overlay';
        this.errorModal.innerHTML = `
            <div class="error-modal-content">
                <div class="error-modal-icon">!</div>
                <h1 class="error-modal-title">SYSTEM ERROR</h1>
                <p class="error-modal-message">${this.getUserFriendlyMessage(error)}</p>
                <p class="error-modal-details">${this.getErrorMessage(error)}</p>
                <div class="error-modal-actions">
                    <button class="error-btn-reload">RELOAD PAGE</button>
                    <button class="error-btn-continue">TRY TO CONTINUE</button>
                </div>
                <details class="error-modal-technical">
                    <summary>Technical Details</summary>
                    <div class="error-modal-technical-content">
                        <p><strong>Context:</strong> ${context}</p>
                        <p><strong>Error Count:</strong> ${this.errorCount}/${this.maxErrors}</p>
                        <p><strong>Scene:</strong> ${this.getCurrentScene()}</p>
                        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                        <p><strong>Stack:</strong></p>
                        <pre>${error instanceof Error && error.stack ? error.stack : 'N/A'}</pre>
                    </div>
                </details>
            </div>
        `;

        document.body.appendChild(this.errorModal);

        // Bind event listeners
        const reloadBtn = this.errorModal.querySelector('.error-btn-reload');
        const continueBtn = this.errorModal.querySelector('.error-btn-continue');

        reloadBtn?.addEventListener('click', () => {
            window.location.reload();
        });

        continueBtn?.addEventListener('click', () => {
            this.attemptRecovery();
        });

        // Focus trap for accessibility
        (reloadBtn as HTMLElement)?.focus();
    }

    /**
     * Update existing modal with new error
     */
    private updateModalMessage(error: unknown): void {
        if (!this.errorModal) return;

        const messageEl = this.errorModal.querySelector('.error-modal-message');
        const detailsEl = this.errorModal.querySelector('.error-modal-details');

        if (messageEl) {
            messageEl.textContent = this.getUserFriendlyMessage(error);
        }
        if (detailsEl) {
            detailsEl.textContent = this.getErrorMessage(error);
        }
    }

    /**
     * Attempt to recover without reloading
     */
    private attemptRecovery(): void {
        Logger.system('[ErrorBoundary] Attempting recovery...');

        // Clear error state
        this.errorCount = 0;

        // Hide modal
        if (this.errorModal) {
            this.errorModal.classList.add('fade-out');
            setTimeout(() => {
                this.errorModal?.remove();
                this.errorModal = null;
            }, 300);
        }

        // Try to resume game if possible
        try {
            const uv7 = (window as any).uv7;
            if (uv7 && uv7.eventBus) {
                // Emit reset event to try to restore view
                uv7.eventBus.emit('game:reset_view', {});
            }
        } catch (e) {
            Logger.warn('[ErrorBoundary] Recovery event failed:', e);
        }

        Logger.system('[ErrorBoundary] Recovery attempted - error count reset');
    }

    /**
     * Log error to history
     */
    private logError(error: unknown, context: string): void {
        const entry: ErrorLogEntry = {
            timestamp: new Date().toISOString(),
            message: this.getErrorMessage(error),
            stack: error instanceof Error ? error.stack : undefined,
            currentScene: this.getCurrentScene(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            context
        };

        // Add to memory history
        this.errorHistory.push(entry);

        // Keep only last N errors in memory
        if (this.errorHistory.length > this.MAX_ERROR_HISTORY) {
            this.errorHistory.shift();
        }

        // Save to localStorage
        this.saveErrorHistory();
    }

    /**
     * Save error history to localStorage
     */
    private saveErrorHistory(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.errorHistory));
        } catch (e) {
            // localStorage might be full or unavailable
            Logger.warn('[ErrorBoundary] Could not save error history:', e);
        }
    }

    /**
     * Load error history from localStorage
     */
    private loadErrorHistory(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.errorHistory = JSON.parse(stored);
            }
        } catch (e) {
            this.errorHistory = [];
        }
    }

    /**
     * Get error history (for debugging)
     */
    public getErrorLog(): ErrorLogEntry[] {
        return [...this.errorHistory];
    }

    /**
     * Clear error history
     */
    public clearErrorLog(): void {
        this.errorHistory = [];
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            // Ignore
        }
        Logger.system('[ErrorBoundary] Error log cleared');
    }

    /**
     * Reset error count and hide modal
     */
    public reset(): void {
        this.errorCount = 0;
        if (this.errorModal) {
            this.errorModal.remove();
            this.errorModal = null;
        }
    }

    /**
     * Manually trigger an error (for testing)
     */
    public triggerTestError(): void {
        this.handleError(new Error('Test error triggered manually'), 'Test');
    }
}

// Auto-initialize singleton
ErrorBoundary.getInstance();
