import { GameEngine } from '@core/GameEngine';
import { StateManager } from '@core/StateManager';
import { EventBus } from '@core/EventBus';

export type RouteId = 'prologue' | 'ronnie' | 'tori';
export type EndingId = 'ronnie_good' | 'ronnie_bad' | 'ronnie_true' | 'digital_forever' | 'tori_good' | 'tori_bad' | 'true';

/**
 * RouteController
 * 
 * Manages the high-level narrative flow:
 * - Route selection (Tori vs Ronnie)
 * - Prologue skipping
 * - Point tracking for endings
 * - Ending triggering
 */
export class RouteController {
    private engine: GameEngine;
    private stateManager: StateManager;
    private eventBus: EventBus;

    constructor(engine: GameEngine, stateManager: StateManager, eventBus: EventBus) {
        this.engine = engine;
        this.stateManager = stateManager;
        this.eventBus = eventBus;

        this.eventBus.on('ui:retry_choice', (data: any) => {
            this.handleRetryChoice(data.choice, data.route);
        });
    }

    /**
     * Initialize route state
     */
    init(): void {
        // Check loop version, increment if needed happens in StateManager/Engine usually, 
        // but here we might ensure route flags are clean.
    }

    /**
     * Start the story (Prologue or Skip)
     */
    startStory(): void {
        const settings = this.stateManager.get('settings') as any; // Cast to any or helper interface
        const skipUnlocked = localStorage.getItem('skipPrologueUnlocked') === 'true';
        const autoSkip = settings?.autoSkipPrologue === true;

        if (skipUnlocked && autoSkip) {
            this.skipToRouteSelection();
        } else if (skipUnlocked) {
            // Logic for showing prompt would go here (UI event)
            // For now, if unlocked but not autoskip, we just start prologue 
            // explicitly or emit event to show prompt.
            // Emitting event for UI to handle:
            this.eventBus.emit('ui:show_skip_prompt', {});
        } else {
            this.startPrologue();
        }
    }

    /**
     * Start Prologue
     */
    startPrologue(): void {
        this.stateManager.set('currentRoute', 'prologue');
        this.engine.loadScene('prologue_start');
    }

    /**
     * Skip Prologue -> Route Select
     */
    skipToRouteSelection(): void {
        this.stateManager.set('currentRoute', 'none');
        this.stateManager.set('flags.prologueSkipped', true);
        // Emit event to show route selection UI
        this.eventBus.emit('ui:show_route_select', {});
    }

    /**
     * Select and Start a Route
     */
    selectRoute(route: RouteId): void {
        if (route === 'prologue') return; // Cannot select prologue this way

        this.stateManager.set('currentRoute', route);

        // Reset route points
        this.stateManager.set(`points.${route}`, 0);

        // Load first scene of the route
        const firstScene = `${route}_start`; // e.g., 'ronnie_start'
        this.engine.loadScene(firstScene);

    }

    /**
     * Add Points to current route (for endings)
     */
    addPoints(amount: number): void {
        const currentRoute = this.stateManager.get('currentRoute') as string;
        if (!currentRoute || currentRoute === 'prologue') return;

        const key = `points.${currentRoute}`;
        const current = (this.stateManager.get(key) as number) || 0;
        this.stateManager.set(key, current + amount);

        console.log(`✨ Added ${amount} points to ${currentRoute} (Total: ${current + amount})`);
    }

    /**
     * Check for Ending conditions
     */
    checkForEnding(): EndingId | null {
        const currentRoute = this.stateManager.get('currentRoute');
        const points = (this.stateManager.get(`points.${currentRoute}`) as number) || 0;

        // Basic logic stub - to be expanded based on V1 rules
        if (currentRoute === 'ronnie') {
            if (points >= 10) return 'ronnie_good'; // Could map to 'ronnie_true' based on specific flags
            return 'ronnie_bad';
        }
        if (currentRoute === 'tori') {
            if (points >= 10) return 'tori_good';
            return 'tori_bad';
        }

        return null;
    }

    /**
     * Handle end of scene (called when nextSceneId is null)
     * Triggers Endings, Epilogues, or Loop Resets
     */
    handleSceneEnd(lastSceneId: string): void {
        console.log(`🎬 Scene Ended: ${lastSceneId}`);

        // 1. True Route -> Epilogue
        if (lastSceneId === 'trueRoute_final') {
            console.log('🌟 True Ending reached. Formatting reality... [Loading Epilogue]');
            this.engine.loadScene('epilogue_start');
            return;
        }

        // 2. Epilogue End -> Credits
        if (lastSceneId === 'epilogue_knowing') {
            console.log('🏁 Epilogue Complete. Rolling credits...');
            // In V2, we might have a dedicated credits state or scene.
            // For now, let's emit an event or return to main menu
            this.eventBus.emit('ui:show_credits', {});
            // Fallback to main menu after delay if no credits system yet
            setTimeout(() => {
                this.eventBus.emit('ui:show_main_menu', {});
            }, 5000);
            return;
        }

        // 3. Bad Endings -> Loop Retry (V1 Loop Init Screen)
        if (lastSceneId === 'badRoute_retry' || lastSceneId === 'digitalForever_retry') {
            console.log('💔 Bad Ending reached. Initializing Loop Reset...');

            // Increment Loop Version
            const currentVer = this.stateManager.get<number>('game.loopVersion') ?? 848;
            const newVer = currentVer + 1;
            this.stateManager.set('game.loopVersion', newVer);

            // Get current route to prepopulate selection
            const currentRoute = this.stateManager.get<string>('currentRoute') ?? 'ronnie';

            // Trigger UI: Loop Init / Retry Screen
            this.eventBus.emit('ui:show_retry_screen', {
                currentRoute: currentRoute,
                loopVersion: newVer
            });
            return;
        }
    }

    /**
     * Handle user choice from Retry Screen
     */
    handleRetryChoice(choice: 'restart_route' | 'change_perspective', route?: RouteId): void {
        if (choice === 'restart_route') {
            const targetRoute = route || this.stateManager.get<string>('currentRoute') as RouteId || 'ronnie';
            console.log(`🔄 Restarting Route: ${targetRoute}`);
            this.selectRoute(targetRoute);
        } else if (choice === 'change_perspective') {
            console.log('👀 Switching Perspective (Route Select)');
            this.skipToRouteSelection();
        }
    }
}
