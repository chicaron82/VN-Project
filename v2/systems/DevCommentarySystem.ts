// ========================================
// DEV COMMENTARY DATA
// Aaron's behind-the-scenes director's cut
// Unlocked via CHICHARON secret code
// ========================================
//
// "The DVD commentary track for the game."
//
// V1→V2 Port: Faithful transcription with full commentary database,
// display modal system, and secret code integration.
//
// This system preserves all of Aaron's commentary about design decisions,
// origin stories, and the creative process behind every major feature.
//
// 848 is sacred. 💚🔥💀
//
// - DevCommentarySystem, ported with love
// ========================================

import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

// ========================================
// TYPES
// ========================================

export interface CommentaryEntry {
    title: string;
    scene: string;
    content: string;
}

// ========================================
// DEV COMMENTARY SYSTEM
// ========================================

/**
 * DevCommentarySystem
 *
 * Aaron's director's cut commentary on the game's design.
 * Unlocked via CHICHARON secret code.
 *
 * @class DevCommentarySystem
 */
export class DevCommentarySystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private commentary: Record<string, CommentaryEntry>;

    // Active overlay for cleanup
    private activeOverlay: HTMLElement | null = null;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Initialize commentary database
        this.commentary = this.initCommentaryDatabase();

        this.setupEventListeners();

        Logger.system('📝 DevCommentarySystem initialized');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Listen for secret code unlock
        this.eventBus.on('secret_code:unlocked', (data) => {
            if (data.code.toLowerCase() === 'chicharon') {
                this.unlockCommentary();
            }
        });

        // Listen for commentary display requests
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commentary events not yet in GameEvents type
        this.eventBus.on('commentary:show' as any, (data: { sceneId: string }) => {
            this.showCommentary(data.sceneId);
        });

        // Listen for full commentary viewer request
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commentary events not yet in GameEvents type
        this.eventBus.on('commentary:showAll' as any, () => {
            this.showAllCommentary();
        });

        // Auto-notify when scene loads if commentary is available
        this.eventBus.on('scene:load', (data: { sceneId: string }) => {
            if (this.isUnlocked() && this.getCommentary(data.sceneId)) {
                this.eventBus.emit('visual:cue', {
                    type: 'commentary_available',
                    channel: 'ui',
                    sceneId: data.sceneId
                });
            }
        });
    }

    // ========================================
    // UNLOCK / STATUS
    // ========================================

    public isUnlocked(): boolean {
        return localStorage.getItem('devCommentaryUnlocked') === 'true';
    }

    public unlockCommentary(): void {
        localStorage.setItem('devCommentaryUnlocked', 'true');
        this.stateManager.set('secrets.devCommentaryUnlocked', true);

        Logger.ui('📝 Dev Commentary unlocked! Use window.uv7.showCommentary() to view all entries.');

        // Show unlock toast
        this.eventBus.emit('achievement:unlocked', {
            id: 'dev_commentary',
            title: 'Behind the Scenes',
            description: 'Unlocked Developer Commentary',
            icon: '📝'
        });
    }

    // ========================================
    // COMMENTARY ACCESS
    // ========================================

    public getCommentary(sceneId: string): CommentaryEntry | null {
        if (!this.isUnlocked()) return null;
        return this.commentary[sceneId] || null;
    }

    public getAllCommentary(): Array<{ id: string } & CommentaryEntry> {
        if (!this.isUnlocked()) return [];

        return Object.entries(this.commentary).map(([id, data]) => ({
            id,
            ...data
        }));
    }

    // ========================================
    // DISPLAY MODAL SYSTEM
    // ========================================

    /**
     * Show commentary overlay for specific scene
     */
    public showCommentary(sceneId: string): void {
        const data = this.getCommentary(sceneId);
        if (!data) {
            Logger.warn(`No commentary found for scene: ${sceneId}`);
            return;
        }

        this.createCommentaryOverlay(data.title, data.content, data.scene);
    }

    /**
     * Show all commentary in viewer/gallery format
     */
    public showAllCommentary(): void {
        if (!this.isUnlocked()) {
            Logger.warn('Dev Commentary is locked. Unlock with CHICHARON code.');
            return;
        }

        const allEntries = this.getAllCommentary();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dev-commentary-viewer';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create content box
        const box = document.createElement('div');
        box.style.cssText = `
            background: #1a1a2e;
            border: 2px solid #00ff88;
            border-radius: 12px;
            padding: 40px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px #00ff8840;
        `;

        // Build HTML content
        let html = `
            <h2 style="color: #00ff88; font-size: 2em; margin-bottom: 10px; text-shadow: 0 0 10px #00ff8840;">
                DEVELOPER COMMENTARY
            </h2>
            <p style="color: #888; margin-bottom: 30px; font-style: italic;">
                Aaron's behind-the-scenes director's cut
            </p>
        `;

        // Group by category
        const categories = {
            'PROLOGUE': ['prologue_street_bump'],
            'ROUTE SELECTION': ['route_selection_dual', 'route_selection_philosophy'],
            'TORI ROUTE': ['tori_tether_intro', 'tori_echoes_first_appearance', 'tori_echo_merge', 'tori_save_blocked'],
            'ENDINGS': ['bad_ending_retry'],
            'MAIN MENU': ['main_menu_carousel', 'main_menu_mobile', 'main_menu_loop'],
            'FEATURES': ['backlog_time_machine']
        };

        for (const [category, ids] of Object.entries(categories)) {
            html += `<h3 style="color: #00ccff; margin-top: 30px; margin-bottom: 15px; font-size: 1.3em;">${category}</h3>`;

            ids.forEach(id => {
                const entry = allEntries.find(e => e.id === id);
                if (entry) {
                    html += `
                        <div style="margin-bottom: 25px; padding: 15px; background: rgba(0, 255, 136, 0.05); border-left: 3px solid #00ff88; border-radius: 4px;">
                            <h4 style="color: #00ff88; margin-bottom: 5px; font-size: 1.1em;">${entry.title}</h4>
                            <p style="color: #888; font-size: 0.9em; margin-bottom: 10px;">${entry.scene}</p>
                            <p style="color: #fff; line-height: 1.6; font-size: 0.95em;">${entry.content}</p>
                        </div>
                    `;
                }
            });
        }

        box.innerHTML = html;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            background: transparent;
            border: 2px solid #00ff88;
            color: #00ff88;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            margin-top: 20px;
            transition: all 0.2s ease;
        `;

        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = '#00ff88';
            closeBtn.style.color = '#1a1a2e';
        });

        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#00ff88';
        });

        closeBtn.addEventListener('click', () => this.closeOverlay(overlay));
        box.appendChild(closeBtn);

        // Backdrop click to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeOverlay(overlay);
            }
        });

        // ESC key to close
        const escHandler = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                this.closeOverlay(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        overlay.appendChild(box);
        this.activeOverlay = overlay;

        // Show with fade-in
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    /**
     * Create and show commentary overlay
     * (Used by game.showCommentaryOverlay in V1)
     */
    private createCommentaryOverlay(title: string, content: string, scene: string): void {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dev-commentary-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create content box
        const box = document.createElement('div');
        box.style.cssText = `
            background: #1a1a2e;
            border: 2px solid #00ff88;
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px #00ff8840;
        `;

        box.innerHTML = `
            <h2 style="color: #00ff88; font-size: 1.8em; margin-bottom: 10px; text-shadow: 0 0 10px #00ff8840;">
                ${title}
            </h2>
            <p style="color: #888; margin-bottom: 20px; font-size: 0.9em; font-style: italic;">
                ${scene}
            </p>
            <p style="color: #fff; line-height: 1.8; font-size: 1em;">
                ${content}
            </p>
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            background: transparent;
            border: 2px solid #00ff88;
            color: #00ff88;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            margin-top: 20px;
            transition: all 0.2s ease;
        `;

        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = '#00ff88';
            closeBtn.style.color = '#1a1a2e';
        });

        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#00ff88';
        });

        closeBtn.addEventListener('click', () => this.closeOverlay(overlay));
        box.appendChild(closeBtn);

        // Backdrop click to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeOverlay(overlay);
            }
        });

        // ESC key to close
        const escHandler = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                this.closeOverlay(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        overlay.appendChild(box);
        this.activeOverlay = overlay;

        // Show with fade-in
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    /**
     * Close overlay with fade-out
     */
    private closeOverlay(overlay: HTMLElement): void {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            if (this.activeOverlay === overlay) {
                this.activeOverlay = null;
            }
        }, 300);
    }

    // ========================================
    // COMMENTARY DATABASE
    // ========================================

    private initCommentaryDatabase(): Record<string, CommentaryEntry> {
        return {
            // ========================================
            // PROLOGUE COMMENTARY
            // ========================================

            'prologue_street_bump': {
                title: 'The French Vanilla Detail',
                scene: 'Street Bump (Prologue)',
                content: `The French Vanilla coffee Tori picks up for Ronnie? That's how Old Ronnie knows where she'll be for the street bump. He's lived this loop hundreds of times. He knows her routine. That small detail is actually critical to the bootstrap paradox working.`
            },

            // ========================================
            // ROUTE SELECTION COMMENTARY
            // ========================================

            'route_selection_dual': {
                title: 'Why Two Routes?',
                scene: 'Route Selection',
                content: `Originally this was just Ronnie's story. But during that Applebee's dinner with Tori, we realized it would be way more interesting as dual perspectives. Ronnie's route became the traditional VN experience - external POV, trying to save her. Tori's route was me taking the gloves off - internal horror, tether mechanics, echo voices, all the weird experimental shit. Somehow it all fit together.`
            },

            'route_selection_philosophy': {
                title: 'Route Design Philosophy',
                scene: 'Route Selection',
                content: `Ronnie's route was intentionally traditional style VN - choices, dialogue, external perspective. Tori's route was essentially my 'gloves off' moment - let's come up with crazy shit and see if we can make it fit narratively. Tether decay, echo voices, memory fragments, the whole works. Both routes tell the same story but feel completely different to play.`
            },

            // ========================================
            // TORI ROUTE COMMENTARY
            // ========================================

            'tori_tether_intro': {
                title: 'The Tether System Origin',
                scene: 'Tori Route - First Hold On Button',
                content: `This idea came about super early. It was the reason I made it into a dual perspective game. Just sitting in Applebee's riffing ideas with Tori and the what-if was "what if we had a player be more active in the story, needing them to press a button to stabilize her. The lower it is, the more glitches occur."`
            },

            'tori_echoes_first_appearance': {
                title: 'The Despair Height "Bug"',
                scene: 'Tori Route - Echo Trio Introduction',
                content: `Despair being taller than the other echoes was actually a "bug" - Tori rendered the sprite at the wrong resolution. But I turned it into a narrative choice. Despair is dominant in Act 1, so it made sense for her sprite to be taller. As the story progresses, the other sprites "grow," eventually balancing things out.`
            },

            'tori_echo_merge': {
                title: 'Becoming Whole',
                scene: 'Tori Route - Echo Integration',
                content: `The echo merge sequence came when I wanted to show how they become whole. They're all Tori. The fragments, the voices, the perspectives - they're not separate entities. Tori is now one.`
            },

            'tori_save_blocked': {
                title: 'Despair\'s Cage',
                scene: 'Tori Route Act 1 - Blocked Save',
                content: `Despair didn't originally block saves in Act 1. As I was getting reviews from other AIs about the game, they would mistakenly tell me it was a genius move. However, when I confirmed later that saves were allowed, I made it so they wouldn't be. It still fit the narrative - Despair trapping you in Act 1.`
            },

            // ========================================
            // ENDING COMMENTARY
            // ========================================

            'bad_ending_retry': {
                title: 'The Bootstrap Paradox',
                scene: 'Bad Ending - Retry Prompt',
                content: `I was at work when the retry mechanic clicked for me. What if retries weren't just "try again" - what if they were CANON? Every failed attempt is a real timeline. Ronnie gets older with each failure until he becomes the Old Man from the prologue. He goes back to give his younger self the Tamagotchi, creating the loop. Didn't even know this concept had a name (bootstrap paradox) until later.`
            },

            // ========================================
            // MAIN MENU COMMENTARY
            // ========================================

            'main_menu_carousel': {
                title: 'The Price Is Right Carousel',
                scene: 'Main Menu',
                content: `The carousel momentum came from a conversation with Zee. I told her I wanted it to feel like spinning the big wheel on The Price Is Right - you know, where you can flick it hard and watch it zoom then crawl to a stop. Or give it a light flick for precision. She actually built custom physics for that. For a menu.`
            },

            'main_menu_mobile': {
                title: 'Tinder Swipe Energy',
                scene: 'Main Menu (Mobile)',
                content: `For mobile portrait I wanted the cards to swipe like Tinder or Bumble. That satisfying feeling of flicking a card away and watching the next one appear. Zee confirmed it was possible and we just ran with it. Now the whole mobile experience feels native instead of like a cramped-down desktop site.`
            },

            'main_menu_loop': {
                title: 'Menu as Narrative Mirror',
                scene: 'Main Menu Design',
                content: `The menu style upgrade from grid to looping carousel - I wanted it to mirror the story. Like in the bad ending where the end loops back to the beginning. Ronnie failed. He goes back to give his younger self a chance to try again. The menu loops infinitely, just like the timelines.`
            },

            // ========================================
            // FEATURE COMMENTARY
            // ========================================

            'backlog_time_machine': {
                title: 'Backlog as Time Machine',
                scene: 'First Backlog Open',
                content: `Turning the backlog into a time machine was my tweak when I asked what else from standard VNs could we incorporate. Instead of just reading dialogue history, I made it so you could "jump back" to any point. Time travel mechanics built into the UI itself.`
            }
        };
    }

    // ========================================
    // CLEANUP
    // ========================================

    public destroy(): void {
        if (this.activeOverlay) {
            this.activeOverlay.remove();
            this.activeOverlay = null;
        }

        Logger.system('📝 DevCommentarySystem destroyed');
    }
}
