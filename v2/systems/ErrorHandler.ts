import { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * ════════════════════════════════════════════════════════════════
 * ERROR HANDLER - V2 Port
 * Phase 20c: Global Error Handling & Recovery
 *
 * V1 Parity: error-handler.js (252 lines → ~310 lines)
 *
 * DIZEE POLISH: Graceful degradation and error recovery
 *
 * Purpose:
 * - Catch unhandled errors and promise rejections
 * - Show user-friendly error messages
 * - Provide recovery options (reload vs continue)
 * - Prevent white screen of death
 * - Log errors for debugging
 *
 * Features:
 * - Global error/rejection handlers
 * - Error spam prevention (max 5 errors)
 * - User-friendly error mapping
 * - localStorage error logging (last 10)
 * - Inline-styled error overlay
 * - Reload or continue recovery options
 *
 * V1 Parity Notes:
 * - Exact same inline styles preserved
 * - All error messages verbatim
 * - Same error count limit (5)
 * - Same error log limit (10)
 * - EventBus integration added for V2 coordination
 *
 * 💚🔥💀 "Graceful degradation is love"
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ErrorLog {
    timestamp: string;
    context: string;
    message: string;
    stack?: string;
    userAgent: string;
    url: string;
}

// Minimal game instance interface
export interface GameInstance {
    // Reserved for future game state access
}

export class ErrorHandler {
    // @ts-expect-error - Reserved for future game state access
    private game: GameInstance;
    // @ts-expect-error - Reserved for future EventBus integration
    private eventBus: EventBus;
    private errorCount: number = 0;
    private maxErrors: number = 5; // Prevent error spam

    constructor(game: GameInstance, eventBus: EventBus) {
        this.game = game;
        this.eventBus = eventBus;

        this.setupGlobalHandlers();
    }

    // ========================================
    // GLOBAL ERROR HANDLERS
    // V1 Parity: error-handler.js lines 29-43
    // ========================================

    private setupGlobalHandlers(): void {
        // Catch unhandled JavaScript errors
        window.addEventListener('error', (event: ErrorEvent) => {
            this.handleError(event.error || event.message, 'Unhandled Error');
            event.preventDefault(); // Prevent console spam
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault();
        });

        Logger.system('✅ Global error handlers initialized');
    }

    // ========================================
    // ERROR HANDLING
    // V1 Parity: error-handler.js lines 45-62
    // ========================================

    public handleError(error: Error | string | unknown, context: string = 'Error'): void {
        this.errorCount++;

        // Log error for debugging
        Logger.error(`[${context}]`, error);

        // Prevent error spam
        if (this.errorCount > this.maxErrors) {
            Logger.warn('⚠️ Too many errors, suppressing further error UI');
            return;
        }

        // Show user-friendly error message
        this.showErrorUI(error, context);

        // Log to analytics (if implemented)
        this.logError(error, context);
    }

    // ========================================
    // ERROR UI
    // V1 Parity: error-handler.js lines 64-86
    // ========================================

    // @ts-expect-error - context parameter reserved for future logging
    private showErrorUI(error: Error | string | unknown, context: string): void {
        // Create or get error overlay
        let errorOverlay = document.getElementById('error-overlay');

        if (!errorOverlay) {
            errorOverlay = this.createErrorOverlay();
        }

        // Update error message
        const errorMessage = document.getElementById('error-message');
        const errorDetails = document.getElementById('error-details');

        if (errorMessage) {
            errorMessage.textContent = this.getUserFriendlyMessage(error);
        }

        if (errorDetails) {
            const errorObj = error as Error;
            errorDetails.textContent = `Technical details: ${errorObj?.message || String(error)}`;
        }

        // Show overlay
        errorOverlay.style.display = 'flex';
    }

    // ========================================
    // ERROR OVERLAY CREATION
    // V1 Parity: error-handler.js lines 88-176
    // Inline styles preserved exactly
    // ========================================

    private createErrorOverlay(): HTMLElement {
        const overlay = document.createElement('div');
        overlay.id = 'error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: 'Courier New', monospace;
        `;

        overlay.innerHTML = `
            <div style="
                max-width: 600px;
                padding: 2rem;
                background: rgba(20, 20, 40, 0.95);
                border: 2px solid #ff4444;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
            ">
                <h2 style="
                    color: #ff4444;
                    font-size: 2em;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
                ">⚠️ SYSTEM ERROR</h2>

                <p id="error-message" style="
                    color: #fff;
                    font-size: 1.2em;
                    margin-bottom: 1rem;
                    line-height: 1.6;
                ">Something went wrong...</p>

                <p id="error-details" style="
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9em;
                    margin-bottom: 2rem;
                    font-style: italic;
                "></p>

                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="error-reload" style="
                        background: #ff4444;
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1em;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 5px;
                        font-family: 'Courier New', monospace;
                    ">RELOAD PAGE</button>

                    <button id="error-continue" style="
                        background: transparent;
                        color: #00ffff;
                        border: 2px solid #00ffff;
                        padding: 0.8rem 2rem;
                        font-size: 1em;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 5px;
                        font-family: 'Courier New', monospace;
                    ">TRY TO CONTINUE</button>
                </div>
            </div>
        `;

        // Add event listeners
        const reloadBtn = overlay.querySelector('#error-reload');
        const continueBtn = overlay.querySelector('#error-continue');

        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                location.reload();
            });
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                overlay.style.display = 'none';
                this.errorCount = 0; // Reset error count
            });
        }

        document.body.appendChild(overlay);
        return overlay;
    }

    // ========================================
    // USER-FRIENDLY ERROR MAPPING
    // V1 Parity: error-handler.js lines 178-200
    // ========================================

    private getUserFriendlyMessage(error: Error | string | unknown): string {
        const errorObj = error as Error;
        const errorString = errorObj?.message || String(error);

        // Map technical errors to user-friendly messages
        if (errorString.includes('fetch') || errorString.includes('network')) {
            return 'Network connection lost. Please check your internet connection.';
        }

        if (errorString.includes('localStorage') || errorString.includes('quota')) {
            return 'Storage is full or unavailable. Try clearing browser data.';
        }

        if (errorString.includes('JSON')) {
            return 'Save data appears to be corrupted. You may need to start fresh.';
        }

        if (errorString.includes('undefined') || errorString.includes('null')) {
            return 'A required resource failed to load. Try refreshing the page.';
        }

        // Default message
        return 'An unexpected error occurred. The game may not function correctly.';
    }

    // ========================================
    // ERROR LOGGING
    // V1 Parity: error-handler.js lines 202-227
    // ========================================

    private logError(error: Error | string | unknown, context: string): void {
        const errorObj = error as Error;

        // Store error for debugging
        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            message: errorObj?.message || String(error),
            stack: errorObj?.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store in localStorage for debugging (limit to last 10 errors)
        try {
            const errors = JSON.parse(localStorage.getItem('error_log') || '[]') as ErrorLog[];
            errors.push(errorLog);

            // Keep only last 10 errors
            if (errors.length > 10) {
                errors.shift();
            }

            localStorage.setItem('error_log', JSON.stringify(errors));
        } catch (e) {
            Logger.error('Failed to log error:', e);
        }
    }

    // ========================================
    // UTILITY METHODS
    // V1 Parity: error-handler.js lines 229-242
    // ========================================

    /**
     * Clear error log
     * V1 Parity: clearErrorLog()
     */
    public clearErrorLog(): void {
        localStorage.removeItem('error_log');
        Logger.system('✅ Error log cleared');
    }

    /**
     * Get error log
     * V1 Parity: getErrorLog()
     */
    public getErrorLog(): ErrorLog[] {
        try {
            return JSON.parse(localStorage.getItem('error_log') || '[]') as ErrorLog[];
        } catch (e) {
            return [];
        }
    }
}
