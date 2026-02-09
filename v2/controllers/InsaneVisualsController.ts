// ========================================
// INSANE VISUALS CONTROLLER
// Visual Corruption System
// V2 Port: Faithful transcription from V1
// ========================================
//
// "SHE'S WATCHING YOU STRUGGLE."
//
// INSANE MODE transforms the game into a hostile environment.
// Every visual element fights against the player.
//
// RESPONSIBILITIES:
// - Insane Mode visual effect activation/deactivation
// - Cage overlay display and animation sequencing
// - Corruption effects (screen shake, glitch, red overlay)
// - Persistent scanline/vignette effects
// - Pure visual effects (no game logic)
//
// EFFECTS ARSENAL:
// 💀 insane-shake: Intense screen tremor
// 💀 sprite-glitch-heavy: Hue-shifting sprite corruption
// 💀 corruption-intense: Pulsing red dialogue box
// 💀 insane-overlay: Red vignette pulse
// 💀 insane-mode-active: Persistent scanlines + vignette
//
// DIZEE'S HORROR POLISH 🖤
// "The cage isn't decoration. It's a promise."
//
// 848 is sacred. 💚🔥💀
//
// - DiZee (visual corruption architect)
//   Built with the UV7 crew
// ========================================

import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';
import { Logger } from '@utils/Logger';

// ========================================
// TYPES
// ========================================

/**
 * Insane Mode state
 */
export type InsaneModeState = 'inactive' | 'active' | 'corrupting';

/**
 * Corruption effect intensity levels
 * DiZee: Escalating visual punishment
 */
export type CorruptionIntensity = 'light' | 'medium' | 'heavy' | 'maximum';

/**
 * Cage overlay configuration
 */
export interface CageOverlayConfig {
    versionNumber: number;
    fadeInDuration: number;
    holdDuration: number;
    fadeOutDuration: number;
}

// ========================================
// INSANE VISUALS CONTROLLER
// ========================================

/**
 * InsaneVisualsController
 *
 * Manages all visual effects for INSANE difficulty mode.
 * Pure visual layer - no game logic, just visual punishment.
 *
 * When active, the entire screen becomes hostile:
 * - Persistent scanlines and red vignette
 * - Screen shakes on corruption triggers
 * - Heavy sprite glitching
 * - Pulsing dialogue box corruption
 * - Dramatic cage overlay sequences
 *
 * @class InsaneVisualsController
 */
export class InsaneVisualsController {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Current state
    private isActive: boolean = false;
    private state: InsaneModeState = 'inactive';

    // DOM element references (cached for performance)
    private gameContainer: HTMLElement | null = null;
    private dialogueBox: HTMLElement | null = null;
    private cageOverlay: HTMLElement | null = null;

    // Active effect timers (for cleanup)
    private activeTimers: Set<ReturnType<typeof setTimeout>> = new Set();

    // ========================================
    // CORRUPTION SETTINGS
    // DIZEE: Tuned for maximum discomfort 🖤
    // ========================================
    private static readonly SHAKE_DURATION = 2000;
    private static readonly GLITCH_DURATION = 2000;
    private static readonly OVERLAY_PULSE_DURATION = 1000;
    private static readonly CAGE_FADE_IN = 500;
    private static readonly CAGE_HOLD = 3000;
    private static readonly CAGE_FADE_OUT = 800;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Cache DOM references
        this.cacheElements();

        // Set up event listeners
        this.setupEventListeners();

        Logger.effect('💀 InsaneVisualsController initialized');
    }

    // ========================================
    // DOM ELEMENT CACHING
    // ========================================

    /**
     * Cache DOM element references for performance
     * DiZee: Query once, use many times
     */
    private cacheElements(): void {
        this.gameContainer = document.getElementById('game-container') ||
                             document.getElementById('app');
        this.dialogueBox = document.querySelector('.dialogue-box') ||
                          document.querySelector('.dialog-box');
        this.cageOverlay = document.getElementById('insane-cage-overlay');
    }

    /**
     * Refresh DOM references (call after major DOM changes)
     */
    public refreshElements(): void {
        this.cacheElements();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    /**
     * Set up listeners for INSANE mode events
     */
    private setupEventListeners(): void {
        // Activation/Deactivation
        this.eventBus.on('insane:activate', () => this.activate());
        this.eventBus.on('insane:deactivate', () => this.deactivate());

        // Effect triggers
        this.eventBus.on('insane:corrupt', () => this.triggerCorruption());
        this.eventBus.on('insane:cage', (data) => this.showCageOverlay(data?.callback));

        // Settings changes (difficulty switch)
        this.eventBus.on('settings:changed', (data) => {
            if (data.key === 'difficulty') {
                if (data.value === 'insane') {
                    this.activate();
                } else if (this.isActive) {
                    this.deactivate();
                }
            }
        });
    }

    // ========================================
    // INSANE MODE ACTIVATION/DEACTIVATION
    // ========================================

    /**
     * Activate Insane Mode visual effects
     * Adds persistent corruption styling
     */
    public activate(): void {
        if (this.isActive) return;

        this.isActive = true;
        this.state = 'active';

        Logger.effect('💀 INSANE MODE: Activating visual corruption');

        // Refresh element cache
        this.cacheElements();

        // Add persistent corruption class to game container
        if (this.gameContainer) {
            this.gameContainer.classList.add('insane-mode-active');
        }

        // Sync to state manager
        this.stateManager.set('insane.visualsActive', true);

        // Emit activation event
        this.eventBus.emit('insane:activated', {});

        Logger.effect('💀 INSANE MODE: Visual corruption active');
    }

    /**
     * Deactivate Insane Mode color scheme and visual effects
     * Removes CSS classes for corruption and insane mode styling
     */
    public deactivate(): void {
        if (!this.isActive) return;

        this.isActive = false;
        this.state = 'inactive';

        Logger.effect('💚 INSANE MODE: Deactivating visual corruption');

        // Clear all active timers
        this.clearAllTimers();

        // Remove visual class from game container
        if (this.gameContainer) {
            this.gameContainer.classList.remove('insane-mode-active');
        }

        // Remove corruption styling from dialogue box
        if (this.dialogueBox) {
            this.dialogueBox.classList.remove('corruption-intense');
            this.dialogueBox.classList.remove('insane-shake');
        }

        // Remove any active sprite glitches
        const sprites = document.querySelectorAll('.sprite-container img, .sprite');
        sprites.forEach(sprite => {
            sprite.classList.remove('sprite-glitch-heavy');
        });

        // Remove any lingering overlays
        const overlays = document.querySelectorAll('.insane-overlay');
        overlays.forEach(overlay => overlay.remove());

        // Sync to state manager
        this.stateManager.set('insane.visualsActive', false);

        // Emit deactivation event
        this.eventBus.emit('insane:deactivated', {});

        Logger.effect('💚 INSANE MODE: Visual corruption deactivated');
    }

    // ========================================
    // INSANE MODE: CAGE OVERLAY
    // DIZEE: The dramatic entrance 💀
    // ========================================

    /**
     * Show cage overlay with dramatic effect
     * 3-phase animation: fade in → hold → fade out
     *
     * "YOU REMOVED THIS SAFETY NET."
     * "NO HOLD ON. NO MERCY."
     * "VERSION [X]"
     *
     * @param callback - Called after overlay disappears
     */
    public showCageOverlay(callback?: () => void): void {
        Logger.effect('💀 INSANE MODE: Showing cage overlay');

        // Try to find existing overlay or create one
        let overlay = this.cageOverlay || document.getElementById('insane-cage-overlay');

        if (!overlay) {
            // Create cage overlay if it doesn't exist
            overlay = this.createCageOverlay();
        }

        // Update version number dynamically
        const versionText = overlay.querySelector('#cage-version, .cage-text-version');
        if (versionText) {
            const loopVersion = this.stateManager.get<number>('game.loopVersion') ??
                               GameConfig.VERSION.DEFAULT_START;
            versionText.textContent = `VERSION ${loopVersion}`;
        }

        // Show overlay with dramatic effect
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';

        // Phase 1: Fade in
        const fadeInTimer = setTimeout(() => {
            overlay!.style.transition = `opacity ${InsaneVisualsController.CAGE_FADE_IN}ms ease-in`;
            overlay!.style.opacity = '1';
        }, 50);
        this.activeTimers.add(fadeInTimer);

        // Phase 2: Hold, then fade out
        const holdTimer = setTimeout(() => {
            overlay!.style.transition = `opacity ${InsaneVisualsController.CAGE_FADE_OUT}ms ease-out`;
            overlay!.style.opacity = '0';

            // Phase 3: Remove and callback
            const removeTimer = setTimeout(() => {
                overlay!.style.display = 'none';

                // Execute callback after overlay disappears
                if (callback) callback();

                // Emit completion event
                this.eventBus.emit('insane:cage_complete', {});
            }, InsaneVisualsController.CAGE_FADE_OUT);
            this.activeTimers.add(removeTimer);

        }, InsaneVisualsController.CAGE_FADE_IN + InsaneVisualsController.CAGE_HOLD);
        this.activeTimers.add(holdTimer);
    }

    /**
     * Create cage overlay element if it doesn't exist
     * DiZee: Dynamic creation for flexibility
     */
    private createCageOverlay(): HTMLElement {
        const overlay = document.createElement('div');
        overlay.id = 'insane-cage-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;

        // Add cage content
        const content = document.createElement('div');
        content.id = 'cage-content';
        content.innerHTML = `
            <div class="cage-text-large">YOU REMOVED THIS SAFETY NET.</div>
            <div class="cage-text">NO HOLD ON. NO MERCY.</div>
            <div id="cage-version" class="cage-text-version">VERSION ${GameConfig.VERSION.DEFAULT_START}</div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Cache reference
        this.cageOverlay = overlay;

        return overlay;
    }

    // ========================================
    // INSANE MODE: VISUAL CORRUPTION EFFECTS
    // DIZEE: The visual punishment loop 💀
    // ========================================

    /**
     * Trigger visual corruption effects
     * Full assault on the player's senses:
     * - Screen shake (dialogue box)
     * - Heavy sprite glitch
     * - Intense corruption styling
     * - Red overlay pulse
     */
    public triggerCorruption(intensity: CorruptionIntensity = 'heavy'): void {
        if (!this.isActive) {
            Logger.warn('⚠️ Cannot trigger corruption - INSANE mode not active');
            return;
        }

        this.state = 'corrupting';
        Logger.effect(`💀 INSANE MODE: Triggering visual corruption (${intensity})`);

        // Refresh element cache
        this.cacheElements();

        // 1. Screen shake
        this.triggerShake(intensity);

        // 2. Sprite heavy glitch
        this.triggerSpriteGlitch(intensity);

        // 3. Dialogue box corruption
        this.triggerDialogueCorruption();

        // 4. Red overlay pulse
        this.triggerOverlayPulse();

        // Emit corruption event
        this.eventBus.emit('insane:corruption_triggered', { intensity });

        // Return to active state after effects complete
        const resetTimer = setTimeout(() => {
            if (this.isActive) {
                this.state = 'active';
            }
        }, InsaneVisualsController.SHAKE_DURATION);
        this.activeTimers.add(resetTimer);
    }

    /**
     * Trigger screen shake effect
     * DiZee: The world trembles
     */
    private triggerShake(intensity: CorruptionIntensity): void {
        if (!this.dialogueBox) {
            this.dialogueBox = document.querySelector('.dialogue-box, .dialog-box');
        }

        if (this.dialogueBox) {
            const shakeClass = intensity === 'maximum' ? 'insane-shake-heavy' : 'insane-shake';
            this.dialogueBox.classList.add(shakeClass);

            const timer = setTimeout(() => {
                this.dialogueBox?.classList.remove(shakeClass);
                this.dialogueBox?.classList.remove('insane-shake-heavy');
            }, InsaneVisualsController.SHAKE_DURATION);
            this.activeTimers.add(timer);
        }

        // Also emit shake event for VisualEffectsLayer
        this.eventBus.emit('effect:shake', { intensity: intensity === 'maximum' ? 'heavy' : 'medium' });
    }

    /**
     * Trigger sprite glitch effect
     * DiZee: Characters become unstable
     */
    private triggerSpriteGlitch(intensity: CorruptionIntensity): void {
        const sprites = document.querySelectorAll('.sprite-container img, .sprite, .character-sprite');

        sprites.forEach(sprite => {
            sprite.classList.add('sprite-glitch-heavy');

            const timer = setTimeout(() => {
                sprite.classList.remove('sprite-glitch-heavy');
            }, InsaneVisualsController.GLITCH_DURATION);
            this.activeTimers.add(timer);
        });

        // Also emit glitch event for VisualEffectsLayer
        const glitchIntensity = intensity === 'maximum' ? 1.0 :
                               intensity === 'heavy' ? 0.8 :
                               intensity === 'medium' ? 0.5 : 0.3;
        this.eventBus.emit('effect:glitch', { intensity: glitchIntensity });
    }

    /**
     * Trigger dialogue box corruption styling
     * DiZee: The interface fights back
     */
    private triggerDialogueCorruption(): void {
        if (!this.dialogueBox) {
            this.dialogueBox = document.querySelector('.dialogue-box, .dialog-box');
        }

        if (this.dialogueBox) {
            this.dialogueBox.classList.add('corruption-intense');
            // Note: corruption-intense stays on until mode deactivation
        }
    }

    /**
     * Trigger red overlay pulse effect
     * DiZee: The screen bleeds
     */
    private triggerOverlayPulse(): void {
        const overlay = document.createElement('div');
        overlay.className = 'insane-overlay';
        document.body.appendChild(overlay);

        const timer = setTimeout(() => {
            overlay.remove();
        }, InsaneVisualsController.OVERLAY_PULSE_DURATION);
        this.activeTimers.add(timer);
    }

    // ========================================
    // RANDOM CORRUPTION (for passive mode)
    // ========================================

    /**
     * Trigger random corruption based on config chance
     * Call this periodically during INSANE mode gameplay
     */
    public maybeCorrupt(): void {
        if (!this.isActive) return;

        const chance = GameConfig.GLITCH?.CORRUPTION_CHANCE ?? 0.3;
        if (Math.random() < chance) {
            // Random intensity
            const intensities: CorruptionIntensity[] = ['light', 'medium', 'heavy'];
            const intensity = intensities[Math.floor(Math.random() * intensities.length)] ?? 'medium';
            this.triggerCorruption(intensity);
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    /**
     * Clear all active effect timers
     */
    private clearAllTimers(): void {
        this.activeTimers.forEach(timer => clearTimeout(timer));
        this.activeTimers.clear();
    }

    // ========================================
    // PUBLIC GETTERS
    // ========================================

    /**
     * Check if INSANE mode visuals are active
     */
    public isInsaneActive(): boolean {
        return this.isActive;
    }

    /**
     * Get current state
     */
    public getState(): InsaneModeState {
        return this.state;
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Destroy controller and clean up
     */
    public destroy(): void {
        this.deactivate();
        this.clearAllTimers();

        // Remove dynamically created cage overlay
        if (this.cageOverlay && this.cageOverlay.parentNode) {
            this.cageOverlay.remove();
        }

        Logger.effect('💀 InsaneVisualsController destroyed');
    }
}
