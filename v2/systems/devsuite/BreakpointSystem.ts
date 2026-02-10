/**
 * BreakpointSystem - Conditional breakpoints for debugging
 *
 * Extracted from DevSuite.ts (~49 lines → dedicated module)
 * V1 Parity: dev-suite.js lines 1278-1323 (46 lines)
 *
 * Handles:
 * - Conditional breakpoints (choice made, scene transition, note unlocked)
 * - Tether threshold breakpoint
 * - Pause game and switch to logs tab on breakpoint hit
 */

export interface BreakpointConfig {
    choiceMade: boolean;
    sceneTransition: boolean;
    noteUnlocked: boolean;
    tetherThreshold: {
        enabled: boolean;
        value: number;
    };
}

export interface DevSuiteInterface {
    game: Record<string, unknown>;
    open(): void;
    switchTab(tab: string): void;
    consoleLogEntry(message: string, type: string): void;
}

export class BreakpointSystem {
    private suite: DevSuiteInterface;
    public breakpoints: BreakpointConfig; // Public for DevSuite UI access

    constructor(suite: DevSuiteInterface) {
        this.suite = suite;
        this.breakpoints = {
            choiceMade: false,
            sceneTransition: false,
            noteUnlocked: false,
            tetherThreshold: { enabled: false, value: 30 },
        };
    }

    /**
     * Get current breakpoint configuration
     */
    public getConfig(): BreakpointConfig {
        return { ...this.breakpoints };
    }

    /**
     * Toggle a breakpoint on/off
     */
    public toggle(type: string): void {
        if (type === 'tetherThreshold') {
            this.breakpoints.tetherThreshold.enabled = !this.breakpoints.tetherThreshold.enabled;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bp = this.breakpoints as any;
            bp[type] = !bp[type];
        }
    }

    /**
     * Set tether threshold value
     */
    public setTetherThreshold(value: number): void {
        this.breakpoints.tetherThreshold.value = value;
    }

    /**
     * Check if event should trigger a breakpoint
     */
    public check(eventType: string, data: { message?: string }): void {
        let shouldBreak = false;
        let message = '';

        if (eventType === 'choice' && this.breakpoints.choiceMade) {
            shouldBreak = true;
            message = `Choice made: ${data.message}`;
        } else if (eventType === 'scene' && this.breakpoints.sceneTransition) {
            shouldBreak = true;
            message = data.message || '';
        } else if (eventType === 'note' && this.breakpoints.noteUnlocked) {
            shouldBreak = true;
            message = data.message || '';
        }

        if (shouldBreak) {
            this.triggerBreak(message);
        }
    }

    /**
     * Trigger breakpoint: pause game and open logs
     */
    private triggerBreak(message: string): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.suite.game as any).pauseManager?.request('breakpoint');
        this.suite.open();
        this.suite.switchTab('logs');
        this.suite.consoleLogEntry(`🔴 BREAKPOINT: ${message}`, 'error');
    }
}
