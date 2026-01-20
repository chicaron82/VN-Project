import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameEngine } from '../core/GameEngine';

/**
 * ════════════════════════════════════════════════════════════════
 * TIME MACHINE SYSTEM - V2 Port
 * Phase 15d: Full V1 parity for timeline navigation
 *
 * V1 Parity: time-machine-manager.js (417 lines → ~500 lines)
 *
 * Centralized timeline navigation & snapshot system
 * Built from Tori's architecture 💚
 *
 * Features:
 * - Snapshot building with priority levels
 * - Smart pruning (preserves anchors & high priority)
 * - Narrative state manipulation (corrupted, burned, locked)
 * - Insane mode restrictions (only last 2 entries)
 * - Jump validation with sensory feedback
 *
 * 🖤💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */

type Priority = 'low' | 'normal' | 'high' | 'anchor';
type CorruptionMode = 'despair' | 'echo' | 'timeline-break' | 'soft';
type PruneStrategy = 'fifo' | 'smart';

interface Snapshot {
    id: number;
    label: string;
    priority: Priority;
    routeId: string | null;
    sceneId: string | null;
    pageIndex: number | null;
    tether: number | null;
    flags: Record<string, unknown>;
    bgKey: string | null;
    spriteKey: string | null;
    createdAt: number;

    // State for narrative rules
    corrupted: boolean;
    corruptionMode: CorruptionMode | null;
    locked: boolean;
    burned: boolean;
    insaneBlocked: boolean;
}

interface TimeMachineOptions {
    maxEntries?: number;
    pruneStrategy?: PruneStrategy;
}

interface TimeMachineStats {
    total: number;
    max: number;
    locked: number;
    burned: number;
    corrupted: number;
    anchors: number;
}

interface SerializedTimeMachine {
    entries: Snapshot[];
    nextId: number;
}

export class TimeMachineSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private engine: GameEngine;

    // Config
    private maxEntries: number;
    private pruneStrategy: PruneStrategy;

    // In-memory list of snapshots
    private entries: Snapshot[];

    // For assigning unique IDs
    private _nextId: number;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager,
        engine: GameEngine,
        options: TimeMachineOptions = {}
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.engine = engine;

        // Config
        this.maxEntries = options.maxEntries ?? 200; // cap to prevent bloat
        this.pruneStrategy = options.pruneStrategy ?? 'smart'; // 'fifo' | 'smart'

        // In-memory list of snapshots
        this.entries = [];

        // For assigning unique IDs
        this._nextId = 1;

        console.log('⏰ Time Machine System initialized');
    }

    // ════════════════════════════════════════════════════════════════
    // SNAPSHOT BUILDING
    // ════════════════════════════════════════════════════════════════

    /**
     * Build a canonical snapshot of the *current* state
     */
    public buildSnapshot(label: string = '', priority: Priority = 'normal'): Snapshot {
        // Get current position from engine
        const currentRoute = this.stateManager.get('game.currentRoute') as string | null;
        const currentScene = this.stateManager.get('game.currentScene') as string | null;
        const currentPageIndex = this.stateManager.get('game.currentPageIndex') as number | null;

        // Get tether value
        const tether = this.stateManager.get('game.tether') as number | null;

        // Get flags
        const flags = (this.stateManager.get('game.flags') as Record<string, unknown>) ?? {};

        // Get visual state keys
        const bgKey = this.stateManager.get('game.currentBackground') as string | null;
        const spriteKey = this.stateManager.get('game.currentSprite') as string | null;

        const snapshot: Snapshot = {
            id: this._nextId++,
            label,                           // optional human-readable name or debug note
            priority,                        // 'low' | 'normal' | 'high' | 'anchor'
            routeId: currentRoute,
            sceneId: currentScene,
            pageIndex: currentPageIndex,
            tether,
            flags,
            bgKey,
            spriteKey,
            createdAt: Date.now(),

            // State for narrative rules
            corrupted: false,
            corruptionMode: null,            // 'despair' | 'echo' | 'timeline-break'
            locked: false,                   // hard lock: never jumpable
            burned: false,                   // "you can never return here"
            insaneBlocked: false,            // blocked only under insane mode rules
        };

        return snapshot;
    }

    // ════════════════════════════════════════════════════════════════
    // ENTRY MANAGEMENT
    // ════════════════════════════════════════════════════════════════

    /**
     * Add a snapshot to the backlog
     */
    public addCurrentState(label: string = '', priority: Priority = 'normal'): Snapshot | null {
        const snapshot = this.buildSnapshot(label, priority);

        // Don't save snapshots with no meaningful state (e.g., during initialization)
        if (!snapshot.routeId && !snapshot.sceneId) {
            console.log(`⏰ Skipping snapshot (no route/scene): ${label || `#${snapshot.id}`}`);
            return null;
        }

        this.entries.push(snapshot);
        this.pruneIfNeeded();
        console.log(`⏰ Snapshot added: ${label || `#${snapshot.id}`} [${priority}]`);

        // DIZEE: Show optional commentary hint for first entry
        if (this.entries.length === 1) {
            setTimeout(() => {
                this.showCommentaryHint('backlog_time_machine');
            }, 1000);
        }

        return snapshot;
    }

    /**
     * For manual injection if needed
     */
    public addEntry(snapshot: Partial<Snapshot>): Snapshot {
        const fullSnapshot: Snapshot = {
            id: snapshot.id ?? this._nextId++,
            label: snapshot.label ?? '',
            priority: snapshot.priority ?? 'normal',
            routeId: snapshot.routeId ?? null,
            sceneId: snapshot.sceneId ?? null,
            pageIndex: snapshot.pageIndex ?? null,
            tether: snapshot.tether ?? null,
            flags: snapshot.flags ?? {},
            bgKey: snapshot.bgKey ?? null,
            spriteKey: snapshot.spriteKey ?? null,
            createdAt: snapshot.createdAt ?? Date.now(),
            corrupted: snapshot.corrupted ?? false,
            corruptionMode: snapshot.corruptionMode ?? null,
            locked: snapshot.locked ?? false,
            burned: snapshot.burned ?? false,
            insaneBlocked: snapshot.insaneBlocked ?? false,
        };

        this.entries.push(fullSnapshot);
        this.pruneIfNeeded();
        return fullSnapshot;
    }

    private pruneIfNeeded(): void {
        if (this.entries.length <= this.maxEntries) return;

        if (this.pruneStrategy === 'smart') {
            // Smart pruning: never prune anchors, prefer pruning low priority
            const anchors = this.entries.filter(e => e.priority === 'anchor');
            const high = this.entries.filter(e => e.priority === 'high');
            const normal = this.entries.filter(e => e.priority === 'normal');
            const low = this.entries.filter(e => e.priority === 'low');

            // Calculate how many we need to remove
            const toRemove = this.entries.length - this.maxEntries;

            // Remove from low priority first, then normal (FIFO within priority)
            const removed: Snapshot[] = [];

            // Remove low priority
            while (removed.length < toRemove && low.length > 0) {
                const entry = low.shift();
                if (entry) removed.push(entry);
            }

            // Remove normal priority if needed
            while (removed.length < toRemove && normal.length > 0) {
                const entry = normal.shift();
                if (entry) removed.push(entry);
            }

            // Rebuild entries (keeping anchors and high priority)
            this.entries = [...anchors, ...high, ...normal, ...low];

            console.log(`⏰ Pruned ${removed.length} snapshots (smart strategy)`);
        } else {
            // Simple FIFO
            while (this.entries.length > this.maxEntries) {
                const removed = this.entries.shift();
                if (removed) {
                    console.log(`⏰ Pruned snapshot #${removed.id} (FIFO)`);
                }
            }
        }
    }

    // ════════════════════════════════════════════════════════════════
    // QUERY & ACCESS
    // ════════════════════════════════════════════════════════════════

    public getEntries(): Snapshot[] {
        return this.entries.slice(); // shallow copy to avoid external mutation
    }

    public getEntryById(id: number): Snapshot | null {
        return this.entries.find(e => e.id === id) ?? null;
    }

    public getLatestEntry(): Snapshot | null {
        return this.entries[this.entries.length - 1] ?? null;
    }

    // ════════════════════════════════════════════════════════════════
    // NARRATIVE STATE MANIPULATION
    // ════════════════════════════════════════════════════════════════

    public markCorrupted(id: number, mode: CorruptionMode = 'soft'): void {
        const entry = this.getEntryById(id);
        if (!entry) return;

        entry.corrupted = true;
        entry.corruptionMode = mode;
        console.log(`⚠️ Snapshot #${id} corrupted (${mode})`);
    }

    public burnEntry(id: number): void {
        const entry = this.getEntryById(id);
        if (!entry) return;
        entry.burned = true;
        console.log(`🔥 Snapshot #${id} burned - unreachable`);
    }

    public lockEntry(id: number): void {
        const entry = this.getEntryById(id);
        if (!entry) return;
        entry.locked = true;
        console.log(`🔒 Snapshot #${id} locked`);
    }

    /**
     * Burn all entries matching criteria
     */
    public burnEntriesWhere(predicate: (entry: Snapshot) => boolean): void {
        let count = 0;
        this.entries.forEach(entry => {
            if (predicate(entry)) {
                entry.burned = true;
                count++;
            }
        });
        console.log(`🔥 Burned ${count} snapshots`);
    }

    /**
     * Corrupt all entries matching criteria
     */
    public corruptEntriesWhere(
        predicate: (entry: Snapshot) => boolean,
        mode: CorruptionMode = 'despair'
    ): void {
        let count = 0;
        this.entries.forEach(entry => {
            if (predicate(entry)) {
                entry.corrupted = true;
                entry.corruptionMode = mode;
                count++;
            }
        });
        console.log(`⚠️ Corrupted ${count} snapshots (${mode})`);
    }

    // ════════════════════════════════════════════════════════════════
    // JUMP RULES & VALIDATION
    // ════════════════════════════════════════════════════════════════

    /**
     * Core rule check — can we jump to this entry right now?
     */
    public canJumpTo(entry: Snapshot | null, options: { ignoreRules?: boolean } = {}): boolean {
        const { ignoreRules = false } = options;

        if (!entry) return false;
        if (ignoreRules) return true;

        const gameFlags = this.stateManager.get('game.flags') as { insaneModeLocked?: boolean } | undefined;
        const insane = gameFlags?.insaneModeLocked ?? false;

        // Hard locks
        if (entry.locked) return false;
        if (entry.burned) return false;

        // Insane mode special rules
        if (insane) {
            // Only allow jumps to the last 2 entries
            const latest = this.getLatestEntry();
            if (latest) {
                const diff = latest.id - entry.id;
                if (diff > 2) {
                    entry.insaneBlocked = true;
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get human-readable reason for why jump is blocked
     */
    public getBlockReason(entry: Snapshot | null): string | null {
        if (!entry) return 'Entry not found';
        if (entry.locked) return 'This moment is locked';
        if (entry.burned) return 'This moment has burned out of reach';
        if (entry.insaneBlocked) return 'Madness won\'t let you go back that far';
        if (entry.corrupted) {
            if (entry.corruptionMode === 'despair') return 'Despair has tainted this memory';
            if (entry.corruptionMode === 'echo') return 'Echo interference detected';
            return 'This moment is corrupted';
        }
        return null; // No block
    }

    // ════════════════════════════════════════════════════════════════
    // TIME JUMP EXECUTION
    // ════════════════════════════════════════════════════════════════

    /**
     * Attempt a jump — returns true if it succeeded
     */
    public async jumpTo(entryId: number, options: { ignoreRules?: boolean } = {}): Promise<boolean> {
        const { ignoreRules = false } = options;
        const entry = this.getEntryById(entryId);

        if (!entry) {
            console.warn(`⏰ Jump failed: Entry #${entryId} not found`);
            return false;
        }

        if (!this.canJumpTo(entry, { ignoreRules })) {
            const reason = this.getBlockReason(entry);
            console.log(`⏰ Jump blocked: ${reason}`);

            // Sensory denial cue
            const gameFlags = this.stateManager.get('game.flags') as { insaneModeLocked?: boolean } | undefined;
            const insane = gameFlags?.insaneModeLocked ?? false;
            const cueType = insane ? 'harshDenial' : 'denied';

            this.eventBus.emit('visual:cue', { type: cueType, channel: 'critical' });

            // Show notification to player
            if (reason) {
                this.eventBus.emit('ui:notification', {
                    type: 'warning',
                    message: reason
                });
            }

            return false;
        }

        // Perform actual restore
        console.log(`⏰ Jumping to snapshot #${entry.id}: ${entry.label || '(unlabeled)'}`);
        await this.restoreSnapshot(entry);
        return true;
    }

    // ════════════════════════════════════════════════════════════════
    // SNAPSHOT RESTORATION
    // ════════════════════════════════════════════════════════════════

    /**
     * This is the glue between snapshot → engine
     */
    private async restoreSnapshot(entry: Snapshot): Promise<void> {
        // 1) Tell the engine to load the right scene
        if (entry.sceneId) {
            this.engine.loadScene(entry.sceneId);
            console.log(`⏰ Scene restored: ${entry.sceneId}`);
        }

        // 2) Restore tether
        if (typeof entry.tether === 'number') {
            this.stateManager.set('game.tether', entry.tether);
            this.eventBus.emit('tether:set', { value: entry.tether });
            console.log(`⏰ Tether restored: ${entry.tether}`);
        }

        // 3) Restore flags
        if (entry.flags && Object.keys(entry.flags).length > 0) {
            this.stateManager.set('game.flags', entry.flags);
            console.log('⏰ Flags restored');
        }

        // 4) Restore visual state (background, sprites)
        if (entry.bgKey) {
            this.stateManager.set('game.currentBackground', entry.bgKey);
            console.log(`⏰ Background restored: ${entry.bgKey}`);
        }

        if (entry.spriteKey) {
            this.stateManager.set('game.currentSprite', entry.spriteKey);
            console.log(`⏰ Sprite restored: ${entry.spriteKey}`);
        }

        // Emit state restore event
        if (entry.sceneId) {
            this.eventBus.emit('state:restore', {
                sceneId: entry.sceneId,
                reason: 'Time Machine jump'
            });
        }

        // Sensory feedback for successful jump
        this.eventBus.emit('visual:cue', { type: 'timelineGlitch', channel: 'narrative' });

        console.log('⏰ Snapshot restoration complete');
    }

    // ════════════════════════════════════════════════════════════════
    // DEV TOOLS & DEBUGGING
    // ════════════════════════════════════════════════════════════════

    /**
     * Print all entries to console for debugging
     */
    public inspect(): void {
        console.group('⏰ TIME MACHINE INSPECTOR');
        console.log(`Total entries: ${this.entries.length}/${this.maxEntries}`);
        console.log(`Prune strategy: ${this.pruneStrategy}`);
        console.log('');

        this.entries.forEach((entry) => {
            const flags: string[] = [];
            if (entry.locked) flags.push('🔒 LOCKED');
            if (entry.burned) flags.push('🔥 BURNED');
            if (entry.corrupted) flags.push(`⚠️ CORRUPTED (${entry.corruptionMode})`);
            if (entry.insaneBlocked) flags.push('💀 INSANE-BLOCKED');

            console.group(`#${entry.id} [${entry.priority}] ${entry.label || '(unlabeled)'}`);
            console.log(`Route: ${entry.routeId} | Scene: ${entry.sceneId} | Page: ${entry.pageIndex}`);
            console.log(`Tether: ${entry.tether ?? 'N/A'}`);
            console.log(`Created: ${new Date(entry.createdAt).toLocaleTimeString()}`);
            if (flags.length > 0) {
                console.log(`Status: ${flags.join(', ')}`);
            }
            console.groupEnd();
        });

        console.groupEnd();
    }

    /**
     * Get stats for UI display
     */
    public getStats(): TimeMachineStats {
        return {
            total: this.entries.length,
            max: this.maxEntries,
            locked: this.entries.filter(e => e.locked).length,
            burned: this.entries.filter(e => e.burned).length,
            corrupted: this.entries.filter(e => e.corrupted).length,
            anchors: this.entries.filter(e => e.priority === 'anchor').length,
        };
    }

    // ════════════════════════════════════════════════════════════════
    // DEV COMMENTARY HINT
    // ════════════════════════════════════════════════════════════════

    /**
     * DIZEE FIX: Disabled - commentary button now handled in game-engine.js (inside dialogue box)
     * This was creating a duplicate button at top-right of screen instead of in dialogue box
     */
    private showCommentaryHint(_sceneId: string): void {
        // Disabled - button creation moved to game-engine.js startRoute() method
        // The button is now correctly positioned inside the dialogue box
        console.log('⏰ Commentary hint requested (handled by GameEngine)');
    }

    // ════════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ════════════════════════════════════════════════════════════════

    /**
     * Serialize for save file
     */
    public serialize(): SerializedTimeMachine {
        return {
            entries: this.entries,
            nextId: this._nextId,
        };
    }

    /**
     * Restore from save file
     */
    public deserialize(data: SerializedTimeMachine | null): void {
        if (!data) return;
        this.entries = data.entries || [];
        this._nextId = data.nextId || 1;
        console.log(`⏰ Restored ${this.entries.length} snapshots from save`);
    }

    /**
     * Clear all entries
     */
    public clear(): void {
        this.entries = [];
        this._nextId = 1;
        console.log('⏰ Time Machine cleared');
    }
}
