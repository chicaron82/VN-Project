import type { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';
import { Logger } from '@utils/Logger';

/**
 * SpriteController
 *
 * Manages character sprite display including:
 * - Standard left/right sprite positioning
 * - Echo sprite system (Tori route - three separate sprites)
 * - Echo growth stages (act1, act2, act3)
 * - Echo merge sequence animation
 * - Active speaker highlighting
 */

export type EchoGrowthStage = 'act1' | 'act2' | 'act3';

export interface SpriteState {
    left: string | null;
    right: string | null;
    echoGroupActive: boolean;
    echoGrowthStage: EchoGrowthStage;
}

export class SpriteController {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private viewport: HTMLElement | null = null;

    private state: SpriteState = {
        left: null,
        right: null,
        echoGroupActive: false,
        echoGrowthStage: 'act1'
    };

    // Echo sprite paths
    private readonly ECHO_SPRITES = {
        echo1: '../assets/full-sprite-echo1.webp',
        echo2: '../assets/full-sprite-echo2.webp',
        despair: '../assets/full-sprite-despair.webp',
        tori: '../assets/full-sprite-tori.webp'
    };

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Listen for echo-specific events
        this.eventBus.on('sprite:show_echo_group', () => this.displayEchoGroup());
        this.eventBus.on('sprite:set_echo_stage', (data) => this.setEchoGrowthStage(data.stage));
        this.eventBus.on('sprite:trigger_echo_merge', (data) => this.triggerEchoMerge(data.callback));
        this.eventBus.on('sprite:hide_all', () => this.hideAllSprites());
    }

    /**
     * Set the viewport element for sprite rendering
     */
    setViewport(viewport: HTMLElement): void {
        this.viewport = viewport;
    }

    // ========================================
    // STANDARD SPRITE DISPLAY
    // ========================================

    /**
     * Display a sprite at the specified position
     */
    showSprite(position: 'left' | 'right', spritePath: string): void {
        if (!this.viewport) return;

        // If echo group is active and we're setting right sprite, clear echo group first
        if (position === 'right' && this.state.echoGroupActive) {
            this.clearEchoGroup();
        }

        const existingSprite = this.viewport.querySelector(`.sprite-${position}`) as HTMLElement;

        if (existingSprite) {
            // Update existing sprite
            existingSprite.style.backgroundImage = `url('${spritePath}')`;
            existingSprite.style.opacity = '1';
        } else {
            // Create new sprite element — CSS handles all positioning
            const sprite = document.createElement('div');
            sprite.className = `character-sprite sprite-${position}`;
            sprite.style.backgroundImage = `url('${spritePath}')`;
            sprite.style.opacity = '0';
            this.viewport.appendChild(sprite);

            // Fade in
            requestAnimationFrame(() => {
                sprite.style.opacity = '1';
            });
        }

        this.state[position] = spritePath;
    }

    /**
     * Hide sprite at position
     */
    hideSprite(position: 'left' | 'right'): void {
        if (!this.viewport) return;

        const sprite = this.viewport.querySelector(`.sprite-${position}`) as HTMLElement;
        if (sprite) {
            sprite.style.opacity = '0';
            setTimeout(() => sprite.remove(), 300);
        }

        this.state[position] = null;
    }

    /**
     * Hide all sprites
     */
    hideAllSprites(): void {
        this.hideSprite('left');
        this.hideSprite('right');
        if (this.state.echoGroupActive) {
            this.clearEchoGroup();
        }
    }

    // ========================================
    // ECHO SPRITE SYSTEM (TORI ROUTE)
    // ========================================

    /**
     * Display the three Echo sprites as a group
     */
    displayEchoGroup(): void {
        if (!this.viewport) return;

        // Clear any existing right sprite
        this.hideSprite('right');

        // Create echo group container — CSS handles all positioning
        const echoGroup = document.createElement('div');
        echoGroup.id = 'echo-group';
        echoGroup.className = 'echo-group';
        echoGroup.style.opacity = '0';

        // Create three echo sprites
        const echo1 = this.createEchoSprite('echo-1-sprite', this.ECHO_SPRITES.echo1);
        const echo2 = this.createEchoSprite('echo-2-sprite', this.ECHO_SPRITES.echo2);
        const despair = this.createEchoSprite('despair-sprite', this.ECHO_SPRITES.despair);

        echoGroup.appendChild(echo1);
        echoGroup.appendChild(echo2);
        echoGroup.appendChild(despair);

        this.viewport.appendChild(echoGroup);

        // Fade in
        requestAnimationFrame(() => {
            echoGroup.style.opacity = '1';
        });

        this.state.echoGroupActive = true;

        // Apply current growth stage
        this.setEchoGrowthStage(this.state.echoGrowthStage);

        Logger.ui('[SpriteController] Echo group displayed');
    }

    /**
     * Create an individual echo sprite element
     */
    private createEchoSprite(id: string, spritePath: string): HTMLElement {
        // CSS handles sizing/positioning via .echo-sprite + #id selectors
        const sprite = document.createElement('div');
        sprite.id = id;
        sprite.className = 'echo-sprite';
        sprite.style.backgroundImage = `url('${spritePath}')`;
        return sprite;
    }

    /**
     * Set the echo growth stage (affects sprite heights)
     */
    setEchoGrowthStage(stage: EchoGrowthStage): void {
        this.state.echoGrowthStage = stage;

        // Store in state manager for persistence
        this.stateManager.set('echoGrowthStage', stage);

        if (!this.viewport) return;

        const echoGroup = this.viewport.querySelector('#echo-group');
        if (!echoGroup) {
            Logger.ui('[SpriteController] Echo growth stage stored, will apply when echoes display');
            return;
        }

        // Remove existing stage classes
        echoGroup.classList.remove('echo-growth-act1', 'echo-growth-act2', 'echo-growth-act3');

        // CSS classes handle all height modifications
        echoGroup.classList.add(`echo-growth-${stage}`);

        Logger.ui(`[SpriteController] Echo growth: ${stage}`);
    }

    /**
     * Clear the echo group
     */
    private clearEchoGroup(): void {
        if (!this.viewport) return;

        const echoGroup = this.viewport.querySelector('#echo-group');
        if (echoGroup) {
            (echoGroup as HTMLElement).style.opacity = '0';
            setTimeout(() => echoGroup.remove(), 300);
        }

        this.state.echoGroupActive = false;
    }

    // ========================================
    // ECHO MERGE SEQUENCE
    // ========================================

    /**
     * Trigger the echo merge animation
     * The three echoes slide together and fade, revealing Tori
     */
    triggerEchoMerge(callback?: () => void): void {
        if (!this.viewport) {
            callback?.();
            return;
        }

        const echoGroup = this.viewport.querySelector('#echo-group') as HTMLElement;
        const echo1 = this.viewport.querySelector('#echo-1-sprite') as HTMLElement;
        const echo2 = this.viewport.querySelector('#echo-2-sprite') as HTMLElement;
        const despair = this.viewport.querySelector('#despair-sprite') as HTMLElement;

        if (!echoGroup || !echo1 || !echo2 || !despair) {
            Logger.ui('[SpriteController] Echo merge: sprites not found, skipping animation');
            callback?.();
            return;
        }

        Logger.ui('[SpriteController] Starting echo merge sequence...');

        // Emit merge start event
        this.eventBus.emit('effect:echo_merge_start', {});

        // Phase 1: Echoes slide toward center (1.5s)
        echo1.style.transition = 'transform 1.5s ease-in-out, opacity 1.5s ease-out';
        echo2.style.transition = 'transform 1.5s ease-in-out, opacity 1.5s ease-out';
        despair.style.transition = 'transform 1.5s ease-in-out, opacity 1.5s ease-out';

        echo1.style.transform = 'translateX(100%)';
        echo2.style.transform = 'translateX(0)';
        despair.style.transform = 'translateX(-100%)';

        // Phase 2: Fade out echoes (simultaneous with slide)
        setTimeout(() => {
            echo1.style.opacity = '0';
            echo2.style.opacity = '0';
            despair.style.opacity = '0';
        }, 500);

        // Phase 3: Remove echo group and show Tori (after 1.5s)
        setTimeout(() => {
            echoGroup.remove();
            this.state.echoGroupActive = false;

            // Create and show Tori sprite — CSS handles positioning
            const tori = document.createElement('div');
            tori.className = 'character-sprite sprite-right tori-merged';
            tori.style.backgroundImage = `url('${this.ECHO_SPRITES.tori}')`;
            tori.style.opacity = '0';
            this.viewport!.appendChild(tori);

            // Phase 4: Fade in Tori (0.5s)
            requestAnimationFrame(() => {
                tori.style.opacity = '1';
            });

            this.state.right = this.ECHO_SPRITES.tori;

            Logger.ui('[SpriteController] Echo merge visual complete, holding moment...');

            // Emit merge complete event
            this.eventBus.emit('effect:echo_merge_complete', {});

            // Phase 5: Hold for 2.5 seconds to let the moment breathe
            setTimeout(() => {
                Logger.ui('[SpriteController] Echo merge sequence complete!');
                callback?.();
            }, 2500);

        }, 1500);
    }

    // ========================================
    // ACTIVE SPEAKER HIGHLIGHTING
    // ========================================

    /**
     * Dim non-speaking character sprites
     */
    highlightSpeaker(speaker: string): void {
        if (!this.viewport) return;

        const leftSprite = this.viewport.querySelector('.sprite-left') as HTMLElement;
        const rightSprite = this.viewport.querySelector('.sprite-right') as HTMLElement;
        const echoGroup = this.viewport.querySelector('#echo-group') as HTMLElement;

        const speakerLower = speaker.toLowerCase();

        // Determine which side the speaker is on
        const isTori = speakerLower.includes('tori');
        const isRonnie = speakerLower.includes('ronnie');
        const isEcho = speakerLower.includes('echo') || speakerLower.includes('despair');

        // Standard sprite highlighting
        if (leftSprite) {
            const leftIsSpeaker = (isRonnie && this.state.left?.includes('ronnie')) ||
                                  (isTori && this.state.left?.includes('tori'));
            leftSprite.style.filter = leftIsSpeaker ? 'none' : 'brightness(0.5)';
        }

        if (rightSprite && !this.state.echoGroupActive) {
            const rightIsSpeaker = (isRonnie && this.state.right?.includes('ronnie')) ||
                                   (isTori && this.state.right?.includes('tori'));
            rightSprite.style.filter = rightIsSpeaker ? 'none' : 'brightness(0.5)';
        }

        // Echo group highlighting
        if (echoGroup && this.state.echoGroupActive) {
            const echo1 = echoGroup.querySelector('#echo-1-sprite') as HTMLElement;
            const echo2 = echoGroup.querySelector('#echo-2-sprite') as HTMLElement;
            const despairSprite = echoGroup.querySelector('#despair-sprite') as HTMLElement;

            if (echo1) echo1.style.filter = speakerLower.includes('echo 1') ? 'none' : 'brightness(0.5)';
            if (echo2) echo2.style.filter = speakerLower.includes('echo 2') ? 'none' : 'brightness(0.5)';
            if (despairSprite) despairSprite.style.filter = speakerLower.includes('despair') ? 'none' : 'brightness(0.5)';

            // If it's Tori speaking (internal), dim all echoes slightly
            if (isTori && !isEcho) {
                if (echo1) echo1.style.filter = 'brightness(0.7)';
                if (echo2) echo2.style.filter = 'brightness(0.7)';
                if (despairSprite) despairSprite.style.filter = 'brightness(0.7)';
            }
        }
    }

    /**
     * Reset all sprite highlighting
     */
    resetHighlighting(): void {
        if (!this.viewport) return;

        const sprites = this.viewport.querySelectorAll('.character-sprite, .echo-sprite');
        sprites.forEach(sprite => {
            (sprite as HTMLElement).style.filter = 'none';
        });
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    /**
     * Get current sprite state
     */
    getState(): SpriteState {
        return { ...this.state };
    }

    /**
     * Restore sprites from saved state
     */
    restoreState(savedState: Partial<SpriteState>): void {
        if (savedState.left) {
            this.showSprite('left', savedState.left);
        }
        if (savedState.right && !savedState.echoGroupActive) {
            this.showSprite('right', savedState.right);
        }
        if (savedState.echoGroupActive) {
            this.displayEchoGroup();
        }
        if (savedState.echoGrowthStage) {
            this.setEchoGrowthStage(savedState.echoGrowthStage);
        }
    }

    /**
     * Check if echo group is currently active
     */
    isEchoGroupActive(): boolean {
        return this.state.echoGroupActive;
    }

    // ========================================
    // SPRITE ANIMATIONS
    // ========================================

    /**
     * DIZEE: Fade sequence for prologue vision (Ronnie -> Old Man -> Ronnie)
     * Used in prologue when Tori sees glimpse of Old Man Ronnie
     *
     * @param position - Which sprite container ('left' or 'right')
     * @param sprite1 - First sprite (young Ronnie)
     * @param sprite2 - Second sprite (old Ronnie)
     * @param duration - Total animation duration in ms (default 4000)
     */
    fadeSpritesSequence(position: 'left' | 'right', sprite1: string, sprite2: string, duration: number = 4000): void {
        if (!this.viewport) {
            Logger.error('[SpriteController] fadeSpritesSequence: No viewport');
            return;
        }

        const container = this.viewport.querySelector(`.sprite-${position}`) as HTMLElement;
        if (!container) {
            Logger.error(`[SpriteController] fadeSpritesSequence: No sprite container found for position ${position}`);
            Logger.ui('[SpriteController] Available sprites:', this.viewport.querySelectorAll('.character-sprite'));
            return;
        }

        Logger.ui(`[SpriteController] Starting fade sequence at ${position}: ${sprite1} -> ${sprite2} -> ${sprite1}`);
        Logger.ui(`[SpriteController] Current container state:`, {
            display: container.style.display,
            opacity: container.style.opacity,
            backgroundImage: container.style.backgroundImage
        });

        // Start with sprite1 (young Ronnie)
        container.style.backgroundImage = `url('${sprite1}')`;
        container.style.display = 'block';
        container.style.opacity = '1';

        const timing = duration / 4; // Split into 4 phases
        Logger.ui(`[SpriteController] Timing per phase: ${timing}ms`);

        // Phase 1: Fade out sprite1
        setTimeout(() => {
            Logger.ui('[SpriteController] Phase 1: Fading out sprite1');
            container.style.transition = 'opacity 0.8s ease';
            container.style.opacity = '0.2';
        }, timing);

        // Phase 2: Switch to sprite2 (Old Man) at lowest opacity
        setTimeout(() => {
            Logger.ui('[SpriteController] Phase 2: Switching to sprite2 (Old Man)');
            container.style.backgroundImage = `url('${sprite2}')`;
            container.style.opacity = '1';
        }, timing * 1.8);

        // Phase 3: Hold Old Man briefly, then fade
        setTimeout(() => {
            Logger.ui('[SpriteController] Phase 3: Fading out sprite2');
            container.style.opacity = '0.2';
        }, timing * 2.8);

        // Phase 4: Switch back to sprite1 (young Ronnie) and restore visibility
        setTimeout(() => {
            Logger.ui('[SpriteController] Phase 4: Switching back to sprite1 (young Ronnie)');
            container.style.backgroundImage = `url('${sprite1}')`;
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.6s ease';
        }, timing * 3.5);
    }
}
