// ========================================
// DEV SUITE CONSOLE
// Input handling, command dispatch, log output
//
// Extracted from DevSuite.ts (lines 830-947)
//
// 848 is sacred. 💚🔥💀
// ========================================

/**
 * Callback contract for console commands that need orchestrator access.
 */
export interface DevSuiteConsoleCallbacks {
    setTether(value: number): void;
    jumpToScene(sceneId: string): void;
    switchTab(tab: string): void;
    getRoutePoints(): any;
    getFlags(): any;
}

/**
 * DevSuiteConsole
 *
 * Manages console input/output: command history navigation,
 * command parsing/dispatch, and DOM log output.
 */
export class DevSuiteConsole {
    private consoleHistory: string[] = [];
    private historyIndex: number = -1;

    constructor(
        private consoleLog: HTMLElement | null,
        private consoleInput: HTMLInputElement | null,
        private callbacks: DevSuiteConsoleCallbacks
    ) {}

    // ========================================
    // INPUT HANDLING
    // ========================================

    handleConsoleInput(e: KeyboardEvent): void {
        if (e.key === 'Enter' && !e.shiftKey) {
            const cmd = this.consoleInput?.value.trim() || '';
            if (cmd) {
                this.consoleHistory.push(cmd);
                this.historyIndex = this.consoleHistory.length;
                this.runConsoleCommand(cmd);
                if (this.consoleInput) this.consoleInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                if (this.consoleInput) {
                    this.consoleInput.value = this.consoleHistory[this.historyIndex] || '';
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.consoleHistory.length - 1) {
                this.historyIndex++;
                if (this.consoleInput) {
                    this.consoleInput.value = this.consoleHistory[this.historyIndex] || '';
                }
            } else {
                this.historyIndex = this.consoleHistory.length;
                if (this.consoleInput) this.consoleInput.value = '';
            }
        }
    }

    // ========================================
    // COMMAND DISPATCH
    // ========================================

    private runConsoleCommand(cmd: string): void {
        this.consoleLogEntry(`> ${cmd}`, 'user');

        const parts = cmd.split(' ');
        const command = parts[0]?.toLowerCase() || '';
        const args = parts.slice(1);

        const commands: Record<string, () => string | undefined> = {
            'help': () => this.showConsoleHelp(),
            'clear': () => { if (this.consoleLog) this.consoleLog.innerHTML = ''; return undefined; },
            'tether': () => {
                const val = parseInt(args[0] || '');
                if (!isNaN(val)) {
                    this.callbacks.setTether(val);
                    return `Tether set to ${val}%`;
                }
                return 'Usage: tether <0-100>';
            },
            'jump': () => {
                if (args[0]) {
                    this.callbacks.jumpToScene(args[0]);
                    return `Jumped to ${args[0]}`;
                }
                return 'Usage: jump <sceneId>';
            },
            'tab': () => {
                if (args[0]) {
                    this.callbacks.switchTab(args[0]);
                    return `Switched to ${args[0]} tab`;
                }
                return 'Usage: tab <debug|state|scenes|testing|logs|watch>';
            },
            'rp': () => {
                const rp = this.callbacks.getRoutePoints();
                return rp ? JSON.stringify(rp, null, 2) : 'No route active';
            },
            'flags': () => {
                const flags = this.callbacks.getFlags();
                return flags ? JSON.stringify(flags, null, 2) : 'No flags';
            },
            'eval': () => {
                try {
                    // eslint-disable-next-line no-eval -- DevSuite console intentionally supports eval for debugging
                    const result = eval(args.join(' '));
                    return String(result);
                } catch (e: any) {
                    return `Error: ${e.message}`;
                }
            }
        };

        if (commands[command]) {
            const result = commands[command]();
            if (result) this.consoleLogEntry(result, 'success');
        } else {
            this.consoleLogEntry(`Unknown command: ${command}. Type 'help' for commands.`, 'error');
        }
    }

    private showConsoleHelp(): undefined {
        const help = [
            'COMMANDS:',
            '  help          - Show this help',
            '  clear         - Clear console',
            '  tether <0-100> - Set tether level',
            '  jump <scene>  - Jump to scene',
            '  tab <name>    - Switch tab',
            '  rp            - Show route points',
            '  flags         - Show active flags',
            '  eval <expr>   - Evaluate JavaScript'
        ];
        help.forEach(line => this.consoleLogEntry(line, 'system'));
        return undefined;
    }

    // ========================================
    // LOG OUTPUT
    // ========================================

    consoleLogEntry(text: string, type: string = 'system'): void {
        const entry = document.createElement('div');
        entry.className = `console-entry ${type}`;
        entry.textContent = text;
        this.consoleLog?.appendChild(entry);
        if (this.consoleLog) {
            this.consoleLog.scrollTop = this.consoleLog.scrollHeight;
        }
    }

    // ========================================
    // STATE ACCESSORS
    // ========================================

    getHistory(): string[] {
        return this.consoleHistory.slice(-50);
    }
}
