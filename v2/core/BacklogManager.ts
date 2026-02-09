// import { GameEngine } from './GameEngine'; // Unused
import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { Logger } from '@utils/Logger';

export interface BacklogEntry {
    character: string;
    text: string;
    voice?: string;
    timestamp: number;
    // V1 Parity: State Snapshot
    sceneId: string;
    tetherLevel: number | null;
    currentBackground: string | null;
    currentSprites: string[]; // URLs or IDs
    flags: Record<string, boolean>;
    isJumpable: boolean;
    isDistorted: boolean;
}

export class BacklogManager {
    // private gameEngine: GameEngine; // Unused
    private eventBus: EventBus;
    private stateManager: StateManager;

    private maxEntries: number = 100;
    private history: BacklogEntry[] = [];

    // V1 Parity: Fixed points that cannot be jumped to
    private lockedScenes: string[] = [
        'despair_hijack',
        'beat1_iceCream',
        'beat1_despairOverride',
        'echo_merge_sequence',
        'final_integration',
        'loop_failure',
        'device_activation',
        'gateway_confrontation'
    ];

    // V1 Parity: Narrators that cannot be jumped to
    private lockedNarrators: string[] = ['System', 'ERROR', 'Despair', '???', 'STATIC', 'CORRUPTION'];

    constructor(eventBus: EventBus, stateManager: StateManager) {
        // this.gameEngine = gameEngine;
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.eventBus.on('dialog:show', (data: any) => {
            if (data.entry) {
                this.addEntry(data.entry);
            }
        });

        // Clear backlog on new game or load (if specific event exists, otherwise managed manually)
        this.eventBus.on('state:reset', () => this.clear());
    }

    /**
     * Add a line to the backlog with full state snapshot
     */
    public addEntry(dialogData: { character: string; text: string; voice?: string }): void {
        const character = dialogData.character || 'Narration';
        const text = dialogData.text;

        if (!text || text.trim() === '') return;

        // Capture current state
        const currentScene = this.stateManager.get<string>('currentScene') || 'unknown';
        const tetherLevel = this.stateManager.get<number>('tetherLevel') ?? null;
        const flags = this.stateManager.get<Record<string, boolean>>('flags') ?? {};

        // TODO: Need a reliable way to get current background/sprites if not in StateManager
        // For now assuming they might be, or we need to add them to StateManager
        // In V2, these might be part of the scene definition, but dynamic changes need state tracking
        const currentBackground = this.stateManager.get<string>('currentBackground') || null;
        const currentSprites = this.stateManager.get<string[]>('currentSprites') || [];

        const isJumpable = this.checkJumpability(character, currentScene);
        const isDistorted = this.lockedNarrators.includes(character); // Simple heuristic for now

        const entry: BacklogEntry = {
            character,
            text,
            voice: dialogData.voice,
            timestamp: Date.now(),
            sceneId: currentScene,
            tetherLevel,
            currentBackground,
            currentSprites,
            flags: JSON.parse(JSON.stringify(flags)), // Deep copy flags
            isJumpable,
            isDistorted
        };

        this.history.push(entry);

        // FIFO limit
        if (this.history.length > this.maxEntries) {
            this.history.shift();
        }

        // Persist to StateManager so it's saved? 
        // V1 Parity: Backlog is part of session, cleared on restart. 
        // Should it be saved? V1 settings-manager.js logic suggests it's cleared on route change but maybe not persistent across saves?
        // Actually V1 says "Clear backlog from previous session/route". 
        // We will keep it in memory for now.
        // Update: Implementation plan says "Integration with StateManager to persist history in save files."
        this.stateManager.set('backlog', this.history);
    }

    private checkJumpability(character: string, sceneId: string): boolean {
        // 1. Locked Narrators
        if (this.lockedNarrators.includes(character)) return false;

        // 2. Locked Scenes
        if (this.lockedScenes.some(locked => sceneId.includes(locked))) return false;

        // 3. Endings/Credits
        if (sceneId.includes('ending_') || sceneId.includes('credits')) return false;

        return true;
    }

    public getEntries(): BacklogEntry[] {
        return [...this.history];
    }

    public clear(): void {
        this.history = [];
        this.stateManager.set('backlog', []);
    }

    /**
     * V1 "Time Machine" Functionality
     */
    public jumpToEntry(index: number): void {
        if (index < 0 || index >= this.history.length) {
            Logger.warn(`[BacklogManager] Invalid jump index: ${index}`);
            return;
        }

        const entry = this.history[index];
        if (!entry) return;

        // 1. Check Insane Mode
        // "insaneModeLocked" flag from V1
        const flags = this.stateManager.get<Record<string, boolean>>('flags') ?? {};
        if (flags.insaneModeLocked || flags.insaneModeActive) { // Using both just in case
            this.eventBus.emit('ui:notification', {
                type: 'warning',
                message: 'TIME MACHINE DISABLED\nForward is the only direction.'
            });
            return;
        }

        // 2. Check Jumpability
        if (!entry.isJumpable) {
            this.eventBus.emit('ui:notification', {
                type: 'error',
                message: 'CRITICAL NARRATIVE CHECKPOINT\nThis moment cannot be revisited.'
            });
            return;
        }

        Logger.ui(`[BacklogManager] Jumping to past: ${entry.sceneId}`);

        // 3. Prepare State Restoration
        // Set flag for "Fixed Points" to know this is a jump
        const newFlags = { ...entry.flags, isBacklogJump: true };

        // Update StateManager
        this.stateManager.set('currentScene', entry.sceneId);
        this.stateManager.set('tetherLevel', entry.tetherLevel);
        this.stateManager.set('flags', newFlags);
        if (entry.currentBackground) this.stateManager.set('currentBackground', entry.currentBackground);
        if (entry.currentSprites) this.stateManager.set('currentSprites', entry.currentSprites);

        // 4. Emit Restoration Event
        // GameEngine or SceneController needs to pick this up and reload the scene content
        this.eventBus.emit('state:restore', {
            sceneId: entry.sceneId,
            reason: 'backlog-jump'
        });

        // 5. Close specific UI if needed (usually handled by UI component)
        this.eventBus.emit('ui:backlog:close', {});
    }
}
