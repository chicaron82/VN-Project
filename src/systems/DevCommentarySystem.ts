
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';

export interface CommentaryEntry {
    id: string;
    title: string;
    scene: string; // The scene ID or "context" name
    content: string;
}

export interface CrewStatement {
    name: string;
    text: string;
}

export class DevCommentarySystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private commentaryData: Record<string, CommentaryEntry>;
    private crewStatements: CrewStatement[];

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        this.commentaryData = this.initCommentaryData();
        this.crewStatements = this.initCrewStatements();

        this.bindEvents();
    }

    private bindEvents() {
        this.eventBus.on('scene:load', (data) => {
            this.checkCommentaryForScene(data.sceneId);
        });

        // Potentially listen for specific UI requests if not handled by MenuController directly
    }

    private checkCommentaryForScene(sceneId: string) {
        if (!this.isCommentaryUnlocked()) return;

        // Check if we have commentary for this specific scene ID
        // In V1, keys were like 'prologue_street_bump'. We need to map or check existence.
        // For V2 simplification, we might map specific scene IDs to commentary keys.
        // Or store commentary Key directly in Scene data?
        // For now, let's just check if the ID matches a key or if we have a mapping.

        // Simple mapping for demo:
        const entry = this.commentaryData[sceneId] || this.findCommentaryByPartialMatch(sceneId);

        if (entry) {
            this.eventBus.emit('visual:cue', { type: 'commentary_available', channel: 'ui' });
            // In a real UI we'd show a button. For now, we just emit.
        }
    }

    private findCommentaryByPartialMatch(sceneId: string): CommentaryEntry | undefined {
        // V1 keys are loose. 'prologue_street_bump' matches scene 'prologueScene4'? Maybe not directly.
        // We might need a lookup table.
        // For V2 verification, let's hardcode a few common ones.
        if (sceneId.includes('prologue')) return this.commentaryData['prologue_street_bump'];
        if (sceneId === 'main_menu') return this.commentaryData['main_menu_carousel'];
        return undefined;
    }

    public isCommentaryUnlocked(): boolean {
        return localStorage.getItem('devCommentaryUnlocked') === 'true';
    }

    public isDirectorsCutUnlocked(): boolean {
        return localStorage.getItem('directorsCutUnlocked') === 'true';
    }

    public unlockCommentary() {
        localStorage.setItem('devCommentaryUnlocked', 'true');
        this.stateManager.set('settings.devCommentaryUnlocked', true);
    }

    public getCommentary(key: string): CommentaryEntry | undefined {
        return this.commentaryData[key];
    }

    public getDirectorsCutStatements(): CrewStatement[] {
        return this.crewStatements;
    }

    // ==========================================
    // DATA
    // ==========================================

    private initCommentaryData(): Record<string, CommentaryEntry> {
        return {
            'prologue_street_bump': {
                id: 'prologue_street_bump',
                title: 'The French Vanilla Detail',
                scene: 'Street Bump (Prologue)',
                content: `The French Vanilla coffee Tori picks up for Ronnie? That's how Old Ronnie knows where she'll be for the street bump. He's lived this loop hundreds of times. He knows her routine. That small detail is actually critical to the bootstrap paradox working.`
            },
            'route_selection_dual': {
                id: 'route_selection_dual',
                title: 'Why Two Routes?',
                scene: 'Route Selection',
                content: `Originally this was just Ronnie's story. But during that Applebee's dinner with Tori, we realized it would be way more interesting as dual perspectives.`
            },
            'main_menu_carousel': {
                id: 'main_menu_carousel',
                title: 'The Price Is Right Carousel',
                scene: 'Main Menu',
                content: `The carousel momentum came from a conversation with Zee. I told her I wanted it to feel like spinning the big wheel on The Price Is Right.`
            },
            'bad_ending_retry': {
                id: 'bad_ending_retry',
                title: 'The Bootstrap Paradox',
                scene: 'Bad Ending',
                content: `I was at work when the retry mechanic clicked for me. What if retries weren't just "try again" - what if they were CANON?`
            }
        };
    }

    private initCrewStatements(): CrewStatement[] {
        return [
            {
                name: 'ZeeRah',
                text: `Working with Aaron was like debugging a fever dream that somehow compiled...`
            },
            {
                name: 'DiZee',
                text: `I got called in for "quick fixes" that turned into archeological digs through nested systems...`
            }
        ];
    }
}
