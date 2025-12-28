// ========================================
// ERROR BOUNDARY - Global Error Handler
// Professional error handling with recovery
// ========================================

/**
 * ErrorBoundary - Global error handler with user-friendly UX
 * 
 * Features:
 * - Catches all unhandled errors
 * - Shows user-friendly error modal
 * - Offers recovery options
 * - Bug report generation
 * - localStorage quota handling
 * - Error logging to Dev Suite
 */

class ErrorBoundary {
    constructor(game) {
        this.game = game;
        this.errors = [];
        this.maxErrors = 50;
        this.isShowingModal = false;

        // Error modal
        this.modal = null;

        // Initialize
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.createModal();
        this.setupGlobalHandlers();
        console.log('🛡️ Error Boundary initialized');
    }

    setupGlobalHandlers() {
        // Catch all unhandled errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || new Error(event.message), {
                type: 'runtime',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'promise',
                promise: event.promise
            });
        });

        // Catch localStorage quota errors
        this.wrapLocalStorage();
    }

    wrapLocalStorage() {
        const originalSetItem = localStorage.setItem;
        const self = this;

        localStorage.setItem = function (key, value) {
            try {
                originalSetItem.call(localStorage, key, value);
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    self.handleQuotaExceeded(key, value);
                } else {
                    throw error;
                }
            }
        };
    }

    // ========================================
    // ERROR HANDLING
    // ========================================

    handleError(error, context = {}) {
        // Log error
        console.error('🛡️ Error Boundary caught:', error);

        // Store error
        this.errors.push({
            error,
            context,
            timestamp: Date.now(),
            gameState: this.captureGameState()
        });

        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to Dev Suite if available
        if (this.game.devSuite) {
            this.game.devSuite.logger.log('error', error.message);
        }

        // Show user-friendly modal
        this.showErrorModal(error, context);
    }

    handleQuotaExceeded(key, value) {
        console.warn('⚠️ localStorage quota exceeded');

        this.showQuotaModal();
    }

    captureGameState() {
        try {
            return {
                currentScene: this.game.currentScene,
                currentRoute: this.game.currentRoute?.name,
                routePoints: this.game.currentRoute?.routePoints,
                tetherLevel: this.game.currentRoute?.tetherSystem?.tetherLevel,
                isPaused: this.game.pauseManager?.isPaused()
            };
        } catch {
            return null;
        }
    }

    // ========================================
    // MODAL UI
    // ========================================

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'error-boundary-modal';
        this.modal.className = 'error-modal hidden';
        this.modal.innerHTML = `
            <div class="error-modal-overlay"></div>
            <div class="error-modal-content">
                <div class="error-modal-header">
                    <span class="error-icon">⚠️</span>
                    <h2 class="error-title">Oops! Something went wrong</h2>
                </div>
                <div class="error-modal-body">
                    <p class="error-message">An unexpected error occurred.</p>
                    <details class="error-details">
                        <summary>Technical Details</summary>
                        <pre class="error-stack"></pre>
                    </details>
                </div>
                <div class="error-modal-actions">
                    <button class="error-btn error-btn-primary" id="error-reload">Reload Page</button>
                    <button class="error-btn error-btn-secondary" id="error-continue">Continue Anyway</button>
                    <button class="error-btn error-btn-secondary" id="error-report">Copy Bug Report</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Setup event listeners
        document.getElementById('error-reload').addEventListener('click', () => {
            location.reload();
        });

        document.getElementById('error-continue').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('error-report').addEventListener('click', () => {
            this.copyBugReport();
        });

        // Close on overlay click
        this.modal.querySelector('.error-modal-overlay').addEventListener('click', () => {
            this.hideModal();
        });
    }

    showErrorModal(error, context) {
        if (this.isShowingModal) return;
        this.isShowingModal = true;

        // Update modal content
        const messageEl = this.modal.querySelector('.error-message');
        const stackEl = this.modal.querySelector('.error-stack');

        messageEl.textContent = error.message || 'An unexpected error occurred.';
        stackEl.textContent = error.stack || 'No stack trace available';

        // Show modal
        this.modal.classList.remove('hidden');

        // Pause game
        if (this.game.pauseManager) {
            this.game.pauseManager.request('error-boundary');
        }
    }

    showQuotaModal() {
        if (this.isShowingModal) return;
        this.isShowingModal = true;

        // Update modal for quota error
        const titleEl = this.modal.querySelector('.error-title');
        const messageEl = this.modal.querySelector('.error-message');
        const detailsEl = this.modal.querySelector('.error-details');

        titleEl.textContent = 'Storage Full';
        messageEl.textContent = 'Your browser storage is full. Would you like to clear old save data?';
        detailsEl.style.display = 'none';

        // Update buttons
        const actionsEl = this.modal.querySelector('.error-modal-actions');
        actionsEl.innerHTML = `
            <button class="error-btn error-btn-primary" id="error-clear-saves">Clear Old Saves</button>
            <button class="error-btn error-btn-secondary" id="error-cancel">Cancel</button>
        `;

        document.getElementById('error-clear-saves').addEventListener('click', () => {
            this.clearOldSaves();
            this.hideModal();
        });

        document.getElementById('error-cancel').addEventListener('click', () => {
            this.hideModal();
        });

        this.modal.classList.remove('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
        this.isShowingModal = false;

        // Resume game
        if (this.game.pauseManager) {
            this.game.pauseManager.release('error-boundary');
        }
    }

    // ========================================
    // BUG REPORTING
    // ========================================

    copyBugReport() {
        const latestError = this.errors[this.errors.length - 1];
        if (!latestError) return;

        const report = this.generateBugReport(latestError);

        navigator.clipboard.writeText(report).then(() => {
            alert('Bug report copied to clipboard! Please share this with the developers.');
        }).catch(() => {
            // Fallback: show in modal
            prompt('Copy this bug report:', report);
        });
    }

    generateBugReport(errorData) {
        const { error, context, timestamp, gameState } = errorData;

        return `
=== V848 Bug Report ===
Time: ${new Date(timestamp).toISOString()}
User Agent: ${navigator.userAgent}

ERROR:
${error.message}

STACK TRACE:
${error.stack}

CONTEXT:
${JSON.stringify(context, null, 2)}

GAME STATE:
${JSON.stringify(gameState, null, 2)}

RECENT ERRORS:
${this.errors.slice(-5).map(e => `- ${e.error.message}`).join('\n')}
========================
        `.trim();
    }

    // ========================================
    // RECOVERY
    // ========================================

    clearOldSaves() {
        try {
            // Get all save slots
            const saves = [];
            for (let i = 1; i <= 12; i++) {
                const key = `v848_save_${i}`;
                const save = localStorage.getItem(key);
                if (save) {
                    try {
                        const data = JSON.parse(save);
                        saves.push({ slot: i, key, timestamp: data.timestamp });
                    } catch {
                        // Corrupted save, mark for deletion
                        saves.push({ slot: i, key, timestamp: 0 });
                    }
                }
            }

            // Sort by timestamp (oldest first)
            saves.sort((a, b) => a.timestamp - b.timestamp);

            // Delete oldest 3 saves
            const toDelete = saves.slice(0, 3);
            toDelete.forEach(save => {
                localStorage.removeItem(save.key);
                localStorage.removeItem(`noteDiscovery_slot${save.slot}`);
            });

            console.log(`🗑️ Cleared ${toDelete.length} old saves`);
            alert(`Cleared ${toDelete.length} old save slots. You can now save your game.`);
        } catch (error) {
            console.error('Failed to clear saves:', error);
            alert('Failed to clear saves. Please try manually deleting browser data.');
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }

    testError() {
        // Use setTimeout to throw async error that will be caught by global handler
        setTimeout(() => {
            throw new Error('Test error from Error Boundary');
        }, 0);
        console.log('⚠️ Test error will be thrown asynchronously...');
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.ErrorBoundary = ErrorBoundary;
}

export { ErrorBoundary };
