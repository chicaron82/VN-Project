/**
 * GLOBAL ERROR HANDLER
 * Catches uncaught errors and provides graceful degradation
 */

export class ErrorBoundary {
    private static instance: ErrorBoundary | null = null;
    private errorCount: number = 0;
    private maxErrors: number = 5;
    private errorOverlay: HTMLElement | null = null;

    private constructor() {
        this.init();
    }

    public static getInstance(): ErrorBoundary {
        if (!ErrorBoundary.instance) {
            ErrorBoundary.instance = new ErrorBoundary();
        }
        return ErrorBoundary.instance;
    }

    private init() {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            this.handleError(event.reason);
        });

        // Catch uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Uncaught Error:', event.error);
            this.handleError(event.error);
        });

        console.log('✅ Error Boundary initialized');
    }

    private handleError(error: any) {
        this.errorCount++;

        // Log to console
        console.error(`[Error ${this.errorCount}/${this.maxErrors}]`, error);

        // If too many errors, show critical error screen
        if (this.errorCount >= this.maxErrors) {
            this.showCriticalError();
            return;
        }

        // Show recoverable error notification
        this.showErrorNotification(error);
    }

    private showErrorNotification(error: any) {
        const message = error?.message || 'An unexpected error occurred';

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <div class="error-toast-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    <strong>Something went wrong</strong>
                    <p>${message}</p>
                </div>
                <button class="error-dismiss">×</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Manual dismiss
        const dismissBtn = toast.querySelector('.error-dismiss');
        dismissBtn?.addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
    }

    private showCriticalError() {
        if (this.errorOverlay) return; // Already showing

        this.errorOverlay = document.createElement('div');
        this.errorOverlay.className = 'critical-error-overlay';
        this.errorOverlay.innerHTML = `
            <div class="critical-error-content">
                <div class="error-icon-large">💥</div>
                <h1>Something Went Wrong</h1>
                <p>The application encountered multiple errors and needs to restart.</p>
                <div class="error-actions">
                    <button class="btn-reload">Reload Page</button>
                    <button class="btn-report">Report Issue</button>
                </div>
                <details class="error-details">
                    <summary>Technical Details</summary>
                    <p>Error count: ${this.errorCount}</p>
                    <p>User Agent: ${navigator.userAgent}</p>
                    <p>Timestamp: ${new Date().toISOString()}</p>
                </details>
            </div>
        `;

        document.body.appendChild(this.errorOverlay);

        // Reload button
        const reloadBtn = this.errorOverlay.querySelector('.btn-reload');
        reloadBtn?.addEventListener('click', () => {
            window.location.reload();
        });

        // Report button
        const reportBtn = this.errorOverlay.querySelector('.btn-report');
        reportBtn?.addEventListener('click', () => {
            const issueUrl = 'https://github.com/chicaron82/VN-Project/issues/new';
            window.open(issueUrl, '_blank');
        });
    }

    public reset() {
        this.errorCount = 0;
        if (this.errorOverlay) {
            this.errorOverlay.remove();
            this.errorOverlay = null;
        }
    }
}

// Auto-initialize
ErrorBoundary.getInstance();
