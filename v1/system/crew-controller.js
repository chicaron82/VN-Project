// @ts-check
// ========================================
// CREW CONTROLLER - Version 848
// Crew/credits screen navigation
// Extracted from GameEngine for SOLID principles
// ========================================

/**
 * CrewController - Manages the "Meet the Crew" credits screens
 * 
 * Handles navigation through crew member screens with:
 * - Sequential screen display
 * - Fade-in animations
 * - Return to main menu
 * 
 * @class CrewController
 */
class CrewController {
    /**
     * @param {any} game - Game engine reference
     */
    constructor(game) {
        this.game = game;

        // Crew screen state
        this.currentCrewIndex = 0;
        this.totalCrewScreens = 10; // 1-9 inclusive (9 total screens)

        console.log('👥 CrewController initialized');
    }

    /**
     * Show the crew screen and start from first member
     */
    show() {
        const crewScreen = document.getElementById('crew-screen');
        if (!crewScreen) {
            console.error('Crew screen element not found');
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

    /**
     * Display a specific crew screen by index
     * @param {number} index - Screen index (1-based)
     */
    displayScreen(index) {
        // Hide all crew screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            /** @type {HTMLElement} */(screen).style.display = 'none';
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
    next() {
        this.currentCrewIndex++;

        if (this.currentCrewIndex >= this.totalCrewScreens) {
            // Crew screens finished - return to main menu
            this.close();
        } else {
            // Show next crew screen
            this.displayScreen(this.currentCrewIndex);
        }
    }

    /**
     * Close crew screen and return to main menu
     */
    close() {
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

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.CrewController = CrewController;
}

// ES Module export
export { CrewController };
