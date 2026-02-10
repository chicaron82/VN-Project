// ========================================
// EASTER EGG CONTROLLER
// Hidden content display system
// V2 Port: Core infrastructure + essential easter eggs
// ========================================
//
// "The game within the game."
//
// Orchestrates easter egg overlays triggered by secret codes.
// Each easter egg is a love letter to the crew, the process, or the meta-narrative.
//
// Subsystems (extracted to easterEggs/):
// - OverlayFactory: Overlay DOM creation, styling, lifecycle
// - StaticOverlays: 7 content-display easter eggs
// - KonamiSystem: Interactive code entry + INSANE escape
// - UV7FamilySystem: Family discoveries, toasts, Ronniegatchi
//
// 848 is sacred. 💚🔥💀
//
// - EasterEggController, ported with love
// ========================================

import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../core/StateManager';
import { OverlayFactory } from './easterEggs/OverlayFactory';
import { StaticOverlays } from './easterEggs/StaticOverlays';
import { KonamiSystem } from './easterEggs/KonamiSystem';
import { UV7FamilySystem } from './easterEggs/UV7FamilySystem';
import { Logger } from '@utils/Logger';

export type { OverlayVariant, OverlayConfig } from './easterEggs/OverlayFactory';

// ========================================
// EASTER EGG CONTROLLER
// ========================================

/**
 * EasterEggController
 *
 * Orchestrates all Easter egg overlay displays.
 * Routes secret codes to the appropriate subsystem.
 */
export class EasterEggController {
    private overlayFactory: OverlayFactory;
    private staticOverlays: StaticOverlays;
    private konamiSystem: KonamiSystem;
    private familySystem: UV7FamilySystem;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.overlayFactory = new OverlayFactory();
        this.staticOverlays = new StaticOverlays(this.overlayFactory, stateManager);
        this.konamiSystem = new KonamiSystem(this.overlayFactory, eventBus, stateManager);
        this.familySystem = new UV7FamilySystem(this.overlayFactory, eventBus);

        // Listen for secret code unlocks
        eventBus.on('secret_code:unlocked', (data) => {
            this.handleCodeUnlock(data.code);
        });

        Logger.system('🥚 EasterEggController initialized');
    }

    /**
     * Handle secret code unlock
     * Route to appropriate easter egg display
     */
    private handleCodeUnlock(code: string): void {
        const normalizedCode = code.toLowerCase().trim();

        Logger.system(`🥚 Easter egg triggered: ${normalizedCode}`);

        switch (normalizedCode) {
            case 'uv7crew':    this.staticOverlays.showUV7CrewBios(); break;
            case 'bootstrap':  this.staticOverlays.showLoopTimeline(); break;
            case '848':        this.staticOverlays.showTrueAttemptNumber(); break;
            case 'echo':       this.staticOverlays.showEchoCompilation(); break;
            case 'always3':    this.staticOverlays.showAlwaysCompilation(); break;
            case 'torigatchi': this.staticOverlays.showTorigatchiEasterEgg(); break;
            case 'dizee':      this.staticOverlays.showDizeeEasterEgg(); break;
            default:           Logger.warn(`🥚 No handler for easter egg: ${normalizedCode}`);
        }
    }

    // ========================================
    // PUBLIC API - Delegates to subsystems
    // ========================================

    public showKonamiControllerOverlay(): void { this.konamiSystem.showControllerOverlay(); }
    public showKonamiInsaneEscape(): void { this.konamiSystem.showInsaneEscape(); }
    public showRonniegatchiInspiration(): void { this.familySystem.showRonniegatchiInspiration(); }
    public showUV7FamilyMember(member: string): void { this.familySystem.showFamilyMember(member); }

    public showUV7Toast(name: string, title: string, quote: string, color: string = '#00ff88'): void {
        this.familySystem.showToast(name, title, quote, color);
    }

    public destroy(): void {
        this.overlayFactory.destroyAll();
        Logger.system('🥚 EasterEggController destroyed');
    }
}
