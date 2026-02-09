/**
 * ════════════════════════════════════════════════════════════════
 * CREW CONTROLLER - V2 Port
 * Phase 22d: Credits/Crew Screen Navigation
 *
 * V1 Parity: system/crew-controller.js (133 lines → ~170 lines)
 *
 * Purpose:
 * - Manage "Meet the Crew" credits screens
 * - Sequential screen display with fade-in
 * - Navigate through team member screens
 * - Return to main menu after final screen
 *
 * Features:
 * - Sequential screen progression (credit-1 through credit-9)
 * - Fade-in CSS animations
 * - Dynamic button text ("NEXT >" → "BACK TO MENU")
 * - Auto-hide inactive screens
 * - Main menu return integration
 *
 * V1 Parity Notes:
 * - Screen count unchanged (10 total, 1-9 inclusive)
 * - Fade timing unchanged (50ms delay)
 * - Button text unchanged
 * - CSS class names unchanged (.credit-screen, .active)
 *
 * 👥 "Built with love by the team." - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface GameReference {
    gameView?: HTMLElement;
    mainMenu?: HTMLElement;
}

import { Logger } from '../utils/Logger';

export class CrewController {
    private game: GameReference;

    // Crew screen state
    private currentCrewIndex: number = 0;
    private totalCrewScreens: number = 10; // 1-9 inclusive (9 total screens)

    constructor(game: GameReference) {
        this.game = game;
        Logger.system('👥 CrewController initialized');
    }

    // ========================================
    // SHOW CREW SCREEN
    // ========================================

    /**
     * Show the crew screen and start from first member
     */
    public show(): void {
        const crewScreen = document.getElementById('crew-screen');
        if (!crewScreen) {
            Logger.error('Crew screen element not found');
            return;
        }

        // Initialize crew screen state
        this.currentCrewIndex = 1; // Start at 1 (removed UV7 logo screen)

        // Hide all other UI
        if (this.game?.gameView) this.game.gameView.style.display = 'none';
        if (this.game?.mainMenu) this.game.mainMenu.style.display = 'none';

        // Show crew screen
        crewScreen.style.display = 'flex';

        // Show first crew screen (credit-1: group photo)
        this.displayScreen(1);
    }

    // ========================================
    // SCREEN NAVIGATION
    // ========================================

    /**
     * Display a specific crew screen by index
     */
    private displayScreen(index: number): void {
        // Hide all crew screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            (screen as HTMLElement).style.display = 'none';
            screen.classList.remove('active');
        });

        // Show current screen with fade-in
        const currentScreen = document.getElementById(`credit-${index}`);
        if (currentScreen) {
            currentScreen.style.display = 'flex';
            // Trigger fade-in animation
            setTimeout(() => {
                currentScreen.classList.add('active');
            }, 50);
        }

        // Update next button text (change to "BACK TO MENU" on last screen)
        const nextButton = document.getElementById('next-crew');
        if (nextButton) {
            if (index >= this.totalCrewScreens - 1) {
                nextButton.textContent = 'BACK TO MENU';
                nextButton.style.display = 'block';
            } else {
                nextButton.textContent = 'NEXT >';
                nextButton.style.display = 'block';
            }
        }
    }

    /**
     * Advance to next crew screen or close if at end
     */
    public next(): void {
        this.currentCrewIndex++;

        if (this.currentCrewIndex >= this.totalCrewScreens) {
            // Crew screens finished - return to main menu
            this.close();
        } else {
            // Show next crew screen
            this.displayScreen(this.currentCrewIndex);
        }
    }

    // ========================================
    // CLOSE CREW SCREEN
    // ========================================

    /**
     * Close crew screen and return to main menu
     */
    public close(): void {
        const crewScreen = document.getElementById('crew-screen');
        if (crewScreen) {
            crewScreen.style.display = 'none';
        }

        // Return to main menu
        if (this.game?.mainMenu) {
            this.game.mainMenu.style.display = 'flex';
            this.game.mainMenu.style.opacity = '1';
        }

        // Reset crew state
        this.currentCrewIndex = 0;
    }
}
