// ========================================
// GLOBAL ERROR HANDLER (DIZEE POLISH)
// Graceful degradation and error recovery
// ========================================

/**
 * ErrorHandler
 * 
 * Provides global error handling, graceful degradation,
 * and user-friendly error recovery UI.
 * 
 * Features:
 * - Catches unhandled errors
 * - Logs errors for debugging
 * - Shows user-friendly error messages
 * - Provides recovery options
 * - Prevents white screen of death
 * 
 * @class ErrorHandler
 */
class ErrorHandler {
    constructor(game) {
        this.game = game;
        this.errorCount = 0;
        this.maxErrors = 5; // Prevent error spam
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Catch unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, 'Unhandled Error');
            event.preventDefault(); // Prevent console spam
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault();
        });

        console.log('✅ Global error handlers initialized');
    }

    handleError(error, context = 'Error') {
        this.errorCount++;

        // Log error for debugging
        console.error(`[${context}]`, error);

        // Prevent error spam
        if (this.errorCount > this.maxErrors) {
            console.warn('⚠️ Too many errors, suppressing further error UI');
            return;
        }

        // Show user-friendly error message
        this.showErrorUI(error, context);

        // Log to analytics (if implemented)
        this.logError(error, context);
    }

    showErrorUI(error, context) {
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
            errorDetails.textContent = `Technical details: ${error?.message || error}`;
        }

        // Show overlay
        errorOverlay.style.display = 'flex';
    }

    createErrorOverlay() {
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
        overlay.querySelector('#error-reload').addEventListener('click', () => {
            location.reload();
        });

        overlay.querySelector('#error-continue').addEventListener('click', () => {
            overlay.style.display = 'none';
            this.errorCount = 0; // Reset error count
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    getUserFriendlyMessage(error) {
        const errorString = error?.message || String(error);

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

    logError(error, context) {
        // Store error for debugging
        const errorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            message: error?.message || String(error),
            stack: error?.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store in localStorage for debugging (limit to last 10 errors)
        try {
            const errors = JSON.parse(localStorage.getItem('error_log') || '[]');
            errors.push(errorLog);

            // Keep only last 10 errors
            if (errors.length > 10) {
                errors.shift();
            }

            localStorage.setItem('error_log', JSON.stringify(errors));
        } catch (e) {
            console.error('Failed to log error:', e);
        }
    }

    // Helper: Clear error log
    clearErrorLog() {
        localStorage.removeItem('error_log');
        console.log('✅ Error log cleared');
    }

    // Helper: Get error log
    getErrorLog() {
        try {
            return JSON.parse(localStorage.getItem('error_log') || '[]');
        } catch (e) {
            return [];
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.ErrorHandler = ErrorHandler;
}

// ES Module export
export { ErrorHandler };
