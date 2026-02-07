/**
 * VariableWatch - Expression evaluation and formatting
 *
 * Extracted from DevSuite.ts (~45 lines → dedicated module)
 * V1 Parity: dev-suite.js lines 1238-1276 (39 lines)
 *
 * Handles:
 * - Watch variable expressions (e.g., "game.currentScene")
 * - Evaluate expressions using eval() (controlled environment)
 * - Format values for display (truncate long objects)
 * - Persist watched variables to state
 */

export interface WatchVariable {
    expression: string;
    id: number;
}

export interface DevSuiteInterface {
    state: any;
    saveState(): void;
}

export class VariableWatch {
    private suite: DevSuiteInterface;
    public watches: WatchVariable[];
    // @ts-expect-error - Reserved for future auto-refresh implementation
    private refreshInterval: number;

    constructor(suite: DevSuiteInterface) {
        this.suite = suite;
        this.watches = suite.state.watchVariables || [];
        this.refreshInterval = 500;
    }

    /**
     * Add a new watch expression
     */
    public addWatch(expression: string): void {
        this.watches.push({ expression, id: Date.now() });
        this.suite.saveState();
    }

    /**
     * Remove a watch by ID
     */
    public remove(id: number): void {
        this.watches = this.watches.filter((w) => w.id !== id);
        this.suite.saveState();
    }

    /**
     * Clear all watches
     */
    public clearAll(): void {
        this.watches = [];
        this.suite.saveState();
    }

    /**
     * Get all current watches
     */
    public getAll(): WatchVariable[] {
        return [...this.watches];
    }

    /**
     * Evaluate a watch expression
     * SECURITY: Only use in controlled dev environment!
     */
    public evaluate(expression: string): any {
        try {
            // eslint-disable-next-line no-eval
            return eval(expression);
        } catch (e: any) {
            return `Error: ${e.message}`;
        }
    }

    /**
     * Format a value for display
     * Truncates long objects/arrays to 50 chars
     */
    public formatValue(val: any): string {
        if (val === undefined) return 'undefined';
        if (val === null) return 'null';
        if (typeof val === 'object') {
            try {
                const str = JSON.stringify(val);
                return str.length > 50 ? str.slice(0, 50) + '...' : str;
            } catch {
                return '[Object]';
            }
        }
        return String(val);
    }

    /**
     * Evaluate and format all watches
     * Returns array of [expression, formattedValue] tuples
     */
    public evaluateAll(): Array<[string, string]> {
        return this.watches.map((w) => {
            const value = this.evaluate(w.expression);
            const formatted = this.formatValue(value);
            return [w.expression, formatted];
        });
    }
}
