/**
 * ════════════════════════════════════════════════════════════════
 * TIPS CONTROLLER - V2 Port
 * Phase 22c: Rotating Tips System
 *
 * V1 Parity: system/tips-controller.js (142 lines → ~180 lines)
 *
 * Purpose:
 * - Display rotating gameplay tips on main menu
 * - Display rotating tips on route selection screen
 * - Fade transitions between tips
 * - 8-second rotation interval
 *
 * Features:
 * - Automatic tip rotation with intervals
 * - Fade-out/fade-in CSS transitions
 * - Loop through tip arrays
 * - Start/stop rotation on screen change
 * - Delegates to UIController for tip content
 *
 * V1 Parity Notes:
 * - Rotation timing unchanged (8000ms)
 * - Fade duration unchanged (800ms)
 * - CSS class names unchanged (tip-fade-out)
 * - UIController delegation preserved
 *
 * ZEE'S ADDITION: Ambient discovery system 🖤
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

import { Logger } from '@utils/Logger';

interface GameReference {
    uiController: {
        getMainMenuTips(): string[];
        getRouteSelectTips(): string[];
    };
}

export class TipsController {
    private game: GameReference;

    // Tip elements
    private mainMenuTipElement: HTMLElement | null = null;
    private routeSelectTipElement: HTMLElement | null = null;

    // Rotation intervals
    private mainMenuTipInterval: number | null = null;
    private routeSelectTipInterval: number | null = null;

    // Current indices
    private currentMainMenuTipIndex: number = 0;
    private currentRouteSelectTipIndex: number = 0;

    constructor(game: GameReference) {
        this.game = game;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    public init(): void {
        // Cache tip elements
        this.mainMenuTipElement = document.getElementById('main-menu-tip');
        this.routeSelectTipElement = document.getElementById('route-select-tip');
        Logger.ui('🖤 Rotating tips system initialized');
    }

    // ========================================
    // TIP POOLS (from UIController)
    // ========================================

    private getMainMenuTips(): string[] {
        return this.game.uiController.getMainMenuTips();
    }

    private getRouteSelectTips(): string[] {
        return this.game.uiController.getRouteSelectTips();
    }

    // ========================================
    // MAIN MENU TIP ROTATION
    // ========================================

    public startMainMenuRotation(): void {
        // Stop any existing rotation
        this.stopMainMenuRotation();

        if (!this.mainMenuTipElement) return;

        const tips = this.getMainMenuTips();

        // Rotate every 8 seconds
        this.mainMenuTipInterval = window.setInterval(() => {
            // Fade out current tip
            this.mainMenuTipElement!.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentMainMenuTipIndex = (this.currentMainMenuTipIndex + 1) % tips.length;

                // Update text
                if (this.mainMenuTipElement) {
                    this.mainMenuTipElement.textContent = tips[this.currentMainMenuTipIndex] || '';
                }

                // Fade back in
                this.mainMenuTipElement!.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        Logger.ui('🔄 Main menu tip rotation started');
    }

    public stopMainMenuRotation(): void {
        if (this.mainMenuTipInterval !== null) {
            clearInterval(this.mainMenuTipInterval);
            this.mainMenuTipInterval = null;
            Logger.ui('⏸️ Main menu tip rotation stopped');
        }
    }

    // ========================================
    // ROUTE SELECT TIP ROTATION
    // ========================================

    public startRouteSelectRotation(): void {
        // Stop any existing rotation
        this.stopRouteSelectRotation();

        if (!this.routeSelectTipElement) return;

        const tips = this.getRouteSelectTips();

        // Rotate every 8 seconds
        this.routeSelectTipInterval = window.setInterval(() => {
            // Fade out current tip
            this.routeSelectTipElement!.classList.add('tip-fade-out');

            setTimeout(() => {
                // Update index (loop back to 0 after last tip)
                this.currentRouteSelectTipIndex = (this.currentRouteSelectTipIndex + 1) % tips.length;

                // Update text
                if (this.routeSelectTipElement) {
                    this.routeSelectTipElement.textContent = tips[this.currentRouteSelectTipIndex] || '';
                }

                // Fade back in
                this.routeSelectTipElement!.classList.remove('tip-fade-out');
            }, 800); // Match CSS transition duration
        }, 8000);

        Logger.ui('🔄 Route select tip rotation started');
    }

    public stopRouteSelectRotation(): void {
        if (this.routeSelectTipInterval !== null) {
            clearInterval(this.routeSelectTipInterval);
            this.routeSelectTipInterval = null;
            Logger.ui('⏸️ Route select tip rotation stopped');
        }
    }
}
