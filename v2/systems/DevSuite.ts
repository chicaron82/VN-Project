// ========================================
// DEV SUITE v2.0
// Full-featured developer debugging suite
// Zee + ZeeRah + CoZee + DiZee Collab 💚🖤
// ========================================
//
// V2 Port of system/dev-suite.js
//
// Features:
// - Tabbed interface (Debug, State, Scenes, Testing, Logs, Watch)
// - Persistent console panel
// - Keyboard shortcuts
// - Drag-to-resize divider
// - Dev presets (save/load game states)
// - Variable watch system
// - Breakpoint system
//
// Entry: OPENCONSOLE secret code
//
// 848 is sacred. 💚🔥💀
// ========================================

// Subsystem imports (existing)
import { DevLogger } from './devsuite/DevLogger';
import { DevPresets } from './devsuite/DevPresets';
import { VariableWatch } from './devsuite/VariableWatch';
import { BreakpointSystem } from './devsuite/BreakpointSystem';
import { ConsoleInterceptor } from './devsuite/ConsoleInterceptor';

// New extracted subsystems
import { DevSuiteDOM } from './devsuite/DevSuiteDOM';
import { DevSuiteConsole } from './devsuite/DevSuiteConsole';
import { DevSuiteGameTools } from './devsuite/DevSuiteGameTools';
import { DevSuiteTabRenderer } from './devsuite/DevSuiteTabRenderer';

// ========================================
// TYPES
// ========================================

export interface GameInstance {
    currentRoute?: any;
    currentScene?: string;
    gameState?: any;
    autoAdvance?: boolean;
    stopAtChoice?: boolean;
    tutorialManager?: any;
    pauseManager?: any;
}

export interface DevSuiteState {
    lastActiveTab: string;
    consoleDividerPosition: number;
    watchVariables: any[];
    consoleHistory: string[];
}

export interface ConsoleLogType {
    timestamp: string;
    type: string;
    message: string;
}

export interface ScreenshotTool {
    download(): Promise<void>;
    copyToClipboard(): Promise<void>;
}

export interface HotReloadSystem {
    showReloadMenu(): void;
}

// ========================================
// DEV SUITE
// ========================================

/**
 * DevSuite - Professional debugging suite for V848
 *
 * Thin orchestrator coordinating extracted subsystems:
 * - DevSuiteDOM: HTML creation + event wiring
 * - DevSuiteTabRenderer: Tab switching + content rendering
 * - DevSuiteConsole: Console input/output
 * - DevSuiteGameTools: Game manipulation + FPS + header actions
 *
 * @class DevSuite
 */
export class DevSuite {
    public game: GameInstance; // Public for subsystem access
    private isOpen: boolean = false;
    // @ts-expect-error - Used for state tracking (written but not read in V1)
    private isMinimized: boolean = false;

    // State persistence
    public state: DevSuiteState; // Public for subsystem access

    // Existing sub-systems
    private logger!: DevLogger;
    private presets!: DevPresets;
    public watch!: VariableWatch; // Public for HTML template access
    public breakpoints!: BreakpointSystem; // Public for DevLogger access
    private consoleInterceptor!: ConsoleInterceptor;

    // New extracted sub-systems
    private dom!: DevSuiteDOM;
    private devConsole!: DevSuiteConsole;
    private gameTools!: DevSuiteGameTools;
    private tabRenderer!: DevSuiteTabRenderer;

    constructor(game: GameInstance) {
        this.game = game;
        this.state = this.loadState();
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    private init(): void {
        // 1. Create DOM
        this.dom = new DevSuiteDOM(this.state.consoleDividerPosition);
        const els = this.dom.getElements();

        // 2. Initialize existing sub-systems
        this.logger = new DevLogger(this as any);
        this.presets = new DevPresets(this as any);
        this.watch = new VariableWatch(this as any);
        this.breakpoints = new BreakpointSystem(this as any);

        // 3. Console (lazy callbacks to gameTools/tabRenderer are safe - resolved at call time)
        this.devConsole = new DevSuiteConsole(els.consoleLog, els.consoleInput, {
            setTether: (val) => this.gameTools.setTether(val),
            jumpToScene: (id) => this.gameTools.jumpToScene(id),
            switchTab: (tab) => this.tabRenderer.switchTab(tab),
            getRoutePoints: () => this.game.currentRoute?.routePoints,
            getFlags: () => this.game.gameState?.flags,
        });

        // 4. Game tools
        this.gameTools = new DevSuiteGameTools({
            game: this.game,
            devSuiteRef: this,
            logger: this.logger,
            presets: this.presets,
            consoleLogEntry: (text, type) => this.devConsole.consoleLogEntry(text, type),
            refreshCurrentTab: () => this.tabRenderer.refreshCurrentTab(),
        });

        // 5. Tab renderer
        this.tabRenderer = new DevSuiteTabRenderer({
            game: this.game,
            logger: this.logger,
            breakpoints: this.breakpoints,
            watch: this.watch,
            getCurrentFPS: () => this.gameTools.getCurrentFPS(),
            getMemoryUsage: () => this.gameTools.getMemoryUsage(),
        }, {
            setTether: (val) => this.gameTools.setTether(val),
            forceEnding: (type) => this.gameTools.forceEnding(type),
            jumpToScene: (id) => this.gameTools.jumpToScene(id),
            onTabChange: (tab) => { this.state.lastActiveTab = tab; },
        });

        // 6. Wire DOM events
        this.dom.setupEventListeners({
            close: () => this.close(),
            minimize: () => this.minimize(),
            maximize: () => this.maximize(),
            toggle: () => this.toggle(),
            switchTab: (tab) => this.tabRenderer.switchTab(tab),
            handleConsoleInput: (e) => this.devConsole.handleConsoleInput(e),
            captureScreenshot: () => this.gameTools.captureScreenshot(),
            showPresetsModal: () => this.gameTools.showPresetsModal(),
            showShortcutsModal: () => this.gameTools.showShortcutsModal(),
            hotReload: () => this.gameTools.hotReload(),
            isOpen: () => this.isOpen,
        });
        this.dom.setupKeyboardShortcuts({
            close: () => this.close(),
            minimize: () => this.minimize(),
            maximize: () => this.maximize(),
            toggle: () => this.toggle(),
            switchTab: (tab) => this.tabRenderer.switchTab(tab),
            handleConsoleInput: (e) => this.devConsole.handleConsoleInput(e),
            captureScreenshot: () => this.gameTools.captureScreenshot(),
            showPresetsModal: () => this.gameTools.showPresetsModal(),
            showShortcutsModal: () => this.gameTools.showShortcutsModal(),
            hotReload: () => this.gameTools.hotReload(),
            isOpen: () => this.isOpen,
        });
        this.dom.setupResizableDivider({
            onResize: (width) => { this.state.consoleDividerPosition = width; },
            onResizeEnd: () => this.saveState(),
        });

        // 7. FPS + console interception
        this.gameTools.startFPSMonitor();
        this.consoleInterceptor = new ConsoleInterceptor((message, type) => {
            this.devConsole.consoleLogEntry(message, type);
        });
        this.consoleInterceptor.start();

        // 8. Initial tab render
        this.tabRenderer.switchTab(this.state.lastActiveTab || 'debug');

        console.log('🛠️ Dev Suite v2.0 initialized');
    }

    // ========================================
    // OPEN / CLOSE / MINIMIZE
    // ========================================

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open(): void {
        const els = this.dom.getElements();
        els.overlay?.classList.remove('hidden');
        els.floatBtn?.classList.add('hidden');
        this.isOpen = true;
        this.isMinimized = false;
        els.consoleInput?.focus();
        this.tabRenderer.refreshCurrentTab();
        console.log('🛠️ Dev Suite opened');
    }

    public close(): void {
        const els = this.dom.getElements();
        els.overlay?.classList.add('hidden');
        els.floatBtn?.classList.add('hidden');
        this.isOpen = false;
        this.isMinimized = false;
        this.saveState();
        console.log('🛠️ Dev Suite closed');
    }

    public minimize(): void {
        const els = this.dom.getElements();
        els.overlay?.classList.add('hidden');
        els.floatBtn?.classList.remove('hidden');
        this.isMinimized = true;
        console.log('🛠️ Dev Suite minimized');
    }

    public maximize(): void {
        const els = this.dom.getElements();
        els.overlay?.classList.remove('hidden');
        els.floatBtn?.classList.add('hidden');
        this.isMinimized = false;
        els.consoleInput?.focus();
        this.tabRenderer.refreshCurrentTab();
        console.log('🛠️ Dev Suite maximized');
    }

    // ========================================
    // PUBLIC API (delegating to subsystems)
    // ========================================

    public refreshCurrentTab(): void { this.tabRenderer.refreshCurrentTab(); }
    public setTether(value: number): void { this.gameTools.setTether(value); }
    public adjustRoutePoint(type: string, delta: number): void { this.gameTools.adjustRoutePoint(type, delta); }
    public filterScenes(query: string): void { this.gameTools.filterScenes(query); }
    public toggleAutoAdvance(): void { this.gameTools.toggleAutoAdvance(); }
    public runToNextChoice(): void { this.gameTools.runToNextChoice(); }
    public copyLogs(): void { this.gameTools.copyLogs(); }
    public clearLogs(): void { this.gameTools.clearLogs(); }

    // Public for DevPresets (DevSuiteInterface duck typing)
    public consoleLogEntry(text: string, type: string = 'system'): void {
        this.devConsole.consoleLogEntry(text, type);
    }
    public jumpToScene(sceneId: string): void { this.gameTools.jumpToScene(sceneId); }

    // ========================================
    // PERSISTENCE
    // ========================================

    private loadState(): DevSuiteState {
        const saved = localStorage.getItem('devSuiteState');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load dev suite state');
            }
        }
        return {
            lastActiveTab: 'debug',
            consoleDividerPosition: 280,
            watchVariables: [],
            consoleHistory: []
        };
    }

    private saveState(): void {
        const state: DevSuiteState = {
            lastActiveTab: this.tabRenderer.getActiveTab(),
            consoleDividerPosition: this.state.consoleDividerPosition,
            watchVariables: this.watch?.watches || [],
            consoleHistory: this.devConsole.getHistory(),
        };
        localStorage.setItem('devSuiteState', JSON.stringify(state));
    }
}

// ========================================
// SUB-SYSTEMS
// ========================================
// Extracted to dedicated modules in devsuite/ directory:
// - DevLogger.ts
// - DevPresets.ts
// - VariableWatch.ts
// - BreakpointSystem.ts
// - ConsoleInterceptor.ts
// - DevSuiteDOM.ts
// - DevSuiteConsole.ts
// - DevSuiteGameTools.ts
// - DevSuiteTabRenderer.ts
