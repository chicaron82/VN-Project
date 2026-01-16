import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameEngine } from '../core/GameEngine';

/**
 * ════════════════════════════════════════════════════════════════
 * SCENE PROGRESSION CONTROLLER - V2 Port
 * Phase 15b: Full V1 parity for story flow orchestration
 *
 * V1 Parity: scene-progression-controller.js (543 lines → ~350 lines)
 *
 * Responsibilities:
 * - Orchestrate story progression (prologue → route selection → route gameplay)
 * - Manage route transitions (cleanup → setup → start)
 * - Coordinate version tracking (848 loop counter)
 * - Handle route-specific UI configuration
 * - Delegate to specialized controllers
 *
 * CRITICAL: Preserves 848 version tracking logic
 *
 * 💚🔥💀 "Every loop matters" - DiZee
 * ════════════════════════════════════════════════════════════════
 */

type RouteId = 'prologue' | 'ronnie' | 'tori';
type LoopStatus = 'attempting' | 'succeeded' | 'accepted' | 'failed';

export class SceneProgressionController {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private engine: GameEngine;

    // DIZEE: State tracking (V1 parity)
    private currentRoute: RouteId | null = null;
    private loopVersion: number = 848;
    private loopStatus: LoopStatus = 'attempting';
    private skipPrologueUnlocked: boolean = false;
    private ronnieNotesUnlocked: boolean = false;

    constructor(eventBus: EventBus, stateManager: StateManager, engine: GameEngine) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.engine = engine;

        this.loadState();
        this.setupEventListeners();

        console.log('🎯 SceneProgressionController initialized');
    }

    // ════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ════════════════════════════════════════════════════════════════

    private loadState(): void {
        // Load loop version (848 is sacred)
        const savedVersion = localStorage.getItem('loopVersion');
        this.loopVersion = savedVersion ? parseInt(savedVersion, 10) : 848;

        // Load loop status
        const savedStatus = localStorage.getItem('loopStatus') as LoopStatus;
        this.loopStatus = savedStatus || 'attempting';

        // Load unlocks
        this.skipPrologueUnlocked = localStorage.getItem('skipPrologueUnlocked') === 'true';
        this.ronnieNotesUnlocked = localStorage.getItem('ronnieNotesUnlocked') === 'true';

        // Sync with StateManager
        this.stateManager.set('game.loopVersion', this.loopVersion);
        this.stateManager.set('game.loopStatus', this.loopStatus);

        console.log(`📊 Loop VERSION ${this.loopVersion}, status: ${this.loopStatus}`);
    }

    private saveState(): void {
        localStorage.setItem('loopVersion', this.loopVersion.toString());
        localStorage.setItem('loopStatus', this.loopStatus);
        this.stateManager.set('game.loopVersion', this.loopVersion);
        this.stateManager.set('game.loopStatus', this.loopStatus);
    }

    private setupEventListeners(): void {
        // Listen for route start requests
        this.eventBus.on('ui:start_game', (data: { route: RouteId }) => {
            this.startRoute(data.route);
        });

        // Listen for prologue complete
        this.eventBus.on('scene:complete', (data: { sceneId: string }) => {
            if (data.sceneId === 'prologue_end') {
                this.onPrologueComplete();
            }
        });
    }

    // ════════════════════════════════════════════════════════════════
    // STORY START - PLAYS PROLOGUE FIRST (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Start the story
     * V1 Parity: startStory() with skip prologue logic
     */
    public startStory(): void {
        const settings = this.stateManager.get('settings') as { autoSkipPrologue?: boolean } | undefined;

        // Check if skip prologue is unlocked AND enabled in settings
        if (this.skipPrologueUnlocked && settings?.autoSkipPrologue) {
            console.log('⏭️ Auto-skip prologue enabled - jumping to route selection');
            this.skipToRouteSelection();
            return;
        }

        // Check if skip is unlocked (but not auto-enabled)
        if (this.skipPrologueUnlocked) {
            const promptSeen = localStorage.getItem('skipProloguePromptSeen') === 'true';

            if (!promptSeen) {
                // First time seeing prompt - show it
                this.showSkipProloguePrompt();
                return;
            } else {
                // Prompt already seen - respect Settings toggle (defaults to OFF)
                console.log('⏭️ Skip prompt dismissed previously - playing prologue');
                this.startPrologueNormally();
                return;
            }
        }

        // Normal flow - start prologue
        this.startPrologueNormally();
    }

    /**
     * Start prologue normally
     * V1 Parity: startPrologueNormally()
     */
    public startPrologueNormally(): void {
        this.currentRoute = 'prologue';
        this.stateManager.set('game.currentRoute', 'prologue');

        // Clear any previous game state
        this.stateManager.set('game.flags', {});
        this.stateManager.set('game.choices', {});

        // Emit UI events
        this.eventBus.emit('ui:screen_change', { screen: 'game' });

        // Load prologue scene
        this.engine.loadScene('prologue_start');

        console.log('📖 Starting prologue...');
    }

    /**
     * Show skip prologue prompt
     */
    private showSkipProloguePrompt(): void {
        this.eventBus.emit('ui:show_skip_prompt', {});
    }

    /**
     * Skip directly to route selection
     * V1 Parity: skipToRouteSelection()
     */
    public skipToRouteSelection(): void {
        this.stateManager.set('game.flags.prologueSkipped', true);
        this.eventBus.emit('ui:show_route_select', {});
        console.log('⏭️ Skipped to route selection');
    }

    /**
     * Called when prologue completes naturally
     */
    private onPrologueComplete(): void {
        // Unlock skip prologue for future playthroughs
        this.skipPrologueUnlocked = true;
        localStorage.setItem('skipPrologueUnlocked', 'true');

        // Show route selection
        this.eventBus.emit('ui:show_route_select', {});
    }

    // ════════════════════════════════════════════════════════════════
    // ROUTE START - CRITICAL 848 VERSION TRACKING (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Start a route
     * V1 Parity: startRoute() with full transition logic
     */
    public startRoute(routeName: RouteId): void {
        if (routeName === 'prologue') {
            this.startPrologueNormally();
            return;
        }

        console.log(`🚀 Starting route: ${routeName}`);

        this.currentRoute = routeName;
        this.stateManager.set('game.currentRoute', routeName);

        // CRITICAL 848 VERSION TRACKING
        // Reset loop status to 'attempting' when starting new route after completion
        if (this.loopStatus === 'succeeded' || this.loopStatus === 'accepted') {
            const previousStatus = this.loopStatus;
            this.incrementVersion();
            console.log(`🔄 New attempt after ${previousStatus} - VERSION ${this.loopVersion}`);
        }

        // Check for Insane Mode
        const insaneLocked = localStorage.getItem('insaneModeLocked') === 'true';
        if (insaneLocked) {
            this.stateManager.set('game.flags.insaneModeActive', true);
            this.stateManager.set('game.flags.insaneModeLocked', true);
            console.log('💀 Insane Mode restored from localStorage');

            // Trigger visual corruption
            this.eventBus.emit('effect:glitch', { intensity: 0.3 });
        }

        // Emit route change for UI theming
        this.eventBus.emit('ui:route_changed', { route: routeName });

        // Show code rain transition before starting
        this.showCodeRainTransition(() => {
            // Load first scene of route
            const firstScene = `${routeName}_start`;
            this.engine.loadScene(firstScene);

            console.log(`✅ Route ${routeName} started`);
        });
    }

    // ════════════════════════════════════════════════════════════════
    // VERSION TRACKING (848 LOOP COUNTER) - V1 Parity
    // ════════════════════════════════════════════════════════════════

    /**
     * Increment loop version
     * V1 Parity: incrementVersion()
     */
    public incrementVersion(): number {
        this.loopVersion += 1;
        this.loopStatus = 'attempting';
        this.saveState();

        this.eventBus.emit('loop:incremented', {
            version: this.loopVersion,
            status: this.loopStatus
        });

        console.log(`📈 Loop VERSION incremented to ${this.loopVersion}`);
        return this.loopVersion;
    }

    /**
     * Reset version (dev command)
     * V1 Parity: resetVersion()
     */
    public resetVersion(targetVersion: number = 848, status: LoopStatus = 'attempting'): number {
        this.loopVersion = targetVersion;
        this.loopStatus = status;
        this.saveState();

        console.log(`🔧 DEV: Version reset to ${this.loopVersion}, status: ${this.loopStatus}`);
        console.log(`💡 Refresh page to see changes!`);

        return this.loopVersion;
    }

    /**
     * Set loop status (for endings)
     */
    public setLoopStatus(status: LoopStatus): void {
        this.loopStatus = status;
        this.saveState();
        console.log(`📊 Loop status set to: ${status}`);
    }

    /**
     * Get current loop version
     */
    public getLoopVersion(): number {
        return this.loopVersion;
    }

    /**
     * Get current loop status
     */
    public getLoopStatus(): LoopStatus {
        return this.loopStatus;
    }

    // ════════════════════════════════════════════════════════════════
    // RONNIE NOTES SYSTEM UNLOCK (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Unlock Ronnie notes system
     * V1 Parity: unlockRonnieNotesSystem()
     */
    public unlockRonnieNotesSystem(): void {
        this.ronnieNotesUnlocked = true;
        localStorage.setItem('ronnieNotesUnlocked', 'true');
        localStorage.setItem('ronnieTabUnlocked', 'true');

        console.log('📝 Ronnie notes system unlocked! Notes viewer now active for replays.');

        // Emit event for UI to update
        this.eventBus.emit('notes:ronnie_unlocked', {});

        // Unlock the teaser note via CollectiblesSystem event
        this.eventBus.emit('note:collected', {
            id: 'ronnie_teaser',
            title: 'A Different Perspective',
            sender: 'System',
            count: 1
        });
    }

    // ════════════════════════════════════════════════════════════════
    // UI TRANSITIONS (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Show code rain transition
     * V1 Parity: showCodeRainTransition()
     */
    private showCodeRainTransition(callback: () => void, duration: number = 1500): void {
        this.eventBus.emit('effect:code_rain', { duration });

        setTimeout(() => {
            callback();
        }, duration);
    }

    /**
     * Check if any ending has been completed
     * V1 Parity: hasCompletedAnyEnding()
     */
    public hasCompletedAnyEnding(): boolean {
        return localStorage.getItem('hasCompletedOnce') === 'true';
    }

    /**
     * Mark game as completed
     */
    public markGameCompleted(): void {
        localStorage.setItem('hasCompletedOnce', 'true');
    }

    // ════════════════════════════════════════════════════════════════
    // ROUTE SELECTION HELPERS (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Get current route
     */
    public getCurrentRoute(): RouteId | null {
        return this.currentRoute;
    }

    /**
     * Check if prologue skip is unlocked
     */
    public isSkipPrologueUnlocked(): boolean {
        return this.skipPrologueUnlocked;
    }

    /**
     * Check if Ronnie notes are unlocked
     */
    public isRonnieNotesUnlocked(): boolean {
        return this.ronnieNotesUnlocked;
    }

    // ════════════════════════════════════════════════════════════════
    // INSANE MODE HELPERS (V1 Parity)
    // ════════════════════════════════════════════════════════════════

    /**
     * Check if Insane Mode is active
     */
    public isInsaneModeActive(): boolean {
        return localStorage.getItem('insaneModeLocked') === 'true';
    }

    /**
     * Lock Insane Mode (no going back)
     */
    public lockInsaneMode(): void {
        localStorage.setItem('insaneModeLocked', 'true');
        this.stateManager.set('game.flags.insaneModeLocked', true);
        console.log('💀 Insane Mode LOCKED. No turning back.');
    }
}
