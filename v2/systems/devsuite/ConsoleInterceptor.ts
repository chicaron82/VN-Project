/**
 * ConsoleInterceptor - Intercept and capture console output
 *
 * Extracted from DevSuite.ts interceptConsole() method (~43 lines → dedicated module)
 *
 * Handles:
 * - Override console.log/warn/error to capture output
 * - Format objects as JSON for display
 * - Forward logs to dev suite while preserving original console behavior
 * - Support restoration of original console methods
 */

export interface LogCallback {
    (message: string, type: string): void;
}

export class ConsoleInterceptor {
    private logCallback: LogCallback;
    private originalLog: typeof console.log;
    private originalWarn: typeof console.warn;
    private originalError: typeof console.error;
    private isActive: boolean = false;

    constructor(logCallback: LogCallback) {
        this.logCallback = logCallback;
        // Save original console methods immediately
        this.originalLog = console.log.bind(console);
        this.originalWarn = console.warn.bind(console);
        this.originalError = console.error.bind(console);
    }

    /**
     * Safely stringify objects for console display
     */
    private safeStringify(obj: any): string {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return String(obj);
        }
    }

    /**
     * Format console arguments to string
     */
    private formatArgs(args: any[]): string {
        return args.map(arg =>
            typeof arg === 'object' ? this.safeStringify(arg) : String(arg)
        ).join(' ');
    }

    /**
     * Start intercepting console methods
     */
    public start(): void {
        if (this.isActive) return;
        this.isActive = true;

        // Override console.log
        console.log = (...args: any[]) => {
            const message = this.formatArgs(args);
            this.logCallback(message, 'log');
            this.originalLog.apply(console, args);
        };

        // Override console.warn
        console.warn = (...args: any[]) => {
            const message = this.formatArgs(args);
            this.logCallback('⚠️ ' + message, 'warn');
            this.originalWarn.apply(console, args);
        };

        // Override console.error
        console.error = (...args: any[]) => {
            const message = this.formatArgs(args);
            this.logCallback('❌ ' + message, 'error');
            this.originalError.apply(console, args);
        };
    }

    /**
     * Stop intercepting and restore original console methods
     */
    public stop(): void {
        if (!this.isActive) return;
        this.isActive = false;

        console.log = this.originalLog;
        console.warn = this.originalWarn;
        console.error = this.originalError;
    }

    /**
     * Check if interception is active
     */
    public isIntercepting(): boolean {
        return this.isActive;
    }

    /**
     * Restart interception (stop + start)
     */
    public restart(): void {
        this.stop();
        this.start();
    }
}
