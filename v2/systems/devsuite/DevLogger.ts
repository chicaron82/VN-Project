/**
 * DevLogger - Console log storage and management
 *
 * Extracted from DevSuite.ts (~22 lines → dedicated module)
 * V1 Parity: dev-suite.js lines 1109-1126 (18 lines)
 *
 * Handles:
 * - Store console logs with timestamps
 * - Limit log buffer to prevent memory bloat
 * - Check breakpoints on new log entries
 * - Support different log types (log, warn, error, success, system)
 */

export interface ConsoleLogType {
    timestamp: string;
    type: string;
    message: string;
}

export interface DevSuiteInterface {
    breakpoints?: any;
}

export class DevLogger {
    private suite: DevSuiteInterface;
    public logs: ConsoleLogType[]; // Public for DevSuite UI access
    private maxLogs: number;

    constructor(suite: DevSuiteInterface, maxLogs: number = 500) {
        this.suite = suite;
        this.logs = [];
        this.maxLogs = maxLogs;
    }

    /**
     * Add a log entry
     */
    public log(type: string, message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.unshift({ timestamp, type, message });

        // Trim to maxLogs (FIFO - oldest logs removed)
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        // Check breakpoints if system exists
        if (this.suite.breakpoints) {
            this.suite.breakpoints.check(type, { message });
        }
    }

    /**
     * Get all logs (newest first)
     */
    public getLogs(): ConsoleLogType[] {
        return [...this.logs];
    }

    /**
     * Clear all logs
     */
    public clear(): void {
        this.logs = [];
    }

    /**
     * Get logs filtered by type
     */
    public getByType(type: string): ConsoleLogType[] {
        return this.logs.filter((log) => log.type === type);
    }

    /**
     * Get recent logs (last N entries)
     */
    public getRecent(count: number): ConsoleLogType[] {
        return this.logs.slice(0, count);
    }

    /**
     * Search logs by message content
     */
    public search(query: string): ConsoleLogType[] {
        const lowerQuery = query.toLowerCase();
        return this.logs.filter((log) =>
            log.message.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get log count by type
     */
    public getStats(): Record<string, number> {
        const stats: Record<string, number> = {};
        this.logs.forEach((log) => {
            stats[log.type] = (stats[log.type] || 0) + 1;
        });
        return stats;
    }

    /**
     * Export logs as JSON
     */
    public export(): string {
        return JSON.stringify(this.logs, null, 2);
    }
}
