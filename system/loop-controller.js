// ========================================
// LOOP CONTROLLER
// Loop/Version system and title screen management
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * LoopController
 * 
 * Manages the loop version system and title screen visual updates.
 * Tracks player journey through failed timelines.
 * 
 * @class LoopController
 */
class LoopController {
    constructor(game) {
        this.game = game;
    }

    // ========================================
    // TITLE SCREEN UPDATE
    // ========================================

    updateTitleScreen() {
        // Update browser tab title
        document.title = `VERSION ${this.game.loopVersion}`;

        // Update main menu H1
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (mainMenuTitle) {
            mainMenuTitle.textContent = `VERSION ${this.game.loopVersion}`;

            // VISUAL DEGRADATION SYSTEM:
            // As version climbs, the system shows strain
            if (this.game.loopStatus === 'succeeded') {
                // TRUE ENDING: Gold/Stable
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#ffd700';
                mainMenuTitle.textContent += ' [FINAL]';
            } else if (this.game.loopStatus === 'accepted') {
                // DIGITAL FOREVER: Cyan/Stable
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#0ff';
                mainMenuTitle.textContent += ' [ETERNAL]';
            } else if (this.game.loopVersion > 848) {
                // FAILED LOOPS: Red glitch + intensity based on attempts
                mainMenuTitle.classList.add('version-glitch');

                // Color degradation as attempts climb
                const failureCount = this.game.loopVersion - 848;
                if (failureCount < 5) {
                    mainMenuTitle.style.color = '#ff6b6b'; // Light red
                } else if (failureCount < 10) {
                    mainMenuTitle.style.color = '#ff4444'; // Medium red
                } else {
                    mainMenuTitle.style.color = '#ff0000'; // Deep red - desperate
                }
            } else {
                // DEFAULT 848: Clean cyan
                mainMenuTitle.classList.remove('version-glitch');
                mainMenuTitle.style.color = '#0ff';
            }
        }

        // ========================================
        // ZEE'S ADDITION: UPDATE SUBTITLE AND FOOTER DYNAMICALLY 🖤
        // Makes version number feel weighted and reactive
        // ========================================

        const subtitle = document.querySelector('.subtitle');
        const footer = document.querySelector('.menu-footer');

        if (subtitle && footer) {
            // Remove any existing state classes
            footer.classList.remove('succeeded', 'failed');

            if (this.game.loopStatus === 'succeeded') {
                // TRUE ENDING STATE - Player broke the loop
                subtitle.textContent = 'The Timeline That Succeeded';
                footer.textContent = `[Version ${this.game.loopVersion} - The loop that closed]`;
                footer.classList.add('succeeded');

                console.log('✨ Main menu updated: TRUE ENDING state');

            } else if (this.game.loopStatus === 'accepted') {
                // DIGITAL FOREVER STATE - Player chose eternal digital union
                subtitle.textContent = 'Forever Frozen, Forever Together';
                footer.textContent = `[Version ${this.game.loopVersion} - Digital permanence achieved]`;
                footer.classList.add('succeeded'); // Same glow as true ending

                console.log('💫 Main menu updated: DIGITAL FOREVER state');

            } else if (this.game.loopVersion > 848) {
                // FAILED AND INCREMENTED - Player got bad ending and version incremented
                subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
                footer.textContent = `[Version ${this.game.loopVersion} - Attempt in progress]`;
                footer.classList.add('failed');

                console.log(`🔄 Main menu updated: FAILED state (v${this.game.loopVersion})`);

            } else {
                // DEFAULT STATE - First playthrough or version 848 attempting
                subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
                footer.textContent = `[Version ${this.game.loopVersion} - 847 previous failures]`;

                console.log('📍 Main menu updated: DEFAULT state (v848)');
            }
        } else {
            // Elements not found - log warning but don't crash
            if (!subtitle) console.warn('⚠️ .subtitle element not found in DOM');
            if (!footer) console.warn('⚠️ .menu-footer element not found in DOM');
        }
    }

    // ========================================
    // VERSION MANAGEMENT
    // ========================================

    increment() {
        // RETRY - increment version, reset to attempting
        this.game.loopVersion++;
        this.game.loopStatus = 'attempting';

        // Save to localStorage
        localStorage.setItem('loopVersion', this.game.loopVersion.toString());
        localStorage.setItem('loopStatus', this.game.loopStatus);

        // Update display
        this.updateTitleScreen();

        console.log(`🔄 Loop incremented to VERSION ${this.game.loopVersion}`);

        return this.game.loopVersion;
    }

    break() {
        // TRUE ENDING - lock version as succeeded
        this.game.loopStatus = 'succeeded';

        // Save to localStorage
        localStorage.setItem('loopStatus', this.game.loopStatus);

        // Update display (removes glitch)
        this.updateTitleScreen();

        console.log(`✨ Loop broken! VERSION ${this.game.loopVersion} SUCCEEDED`);
    }

    accept() {
        // DIGITAL FOREVER - lock version as accepted
        this.game.loopStatus = 'accepted';

        // Save to localStorage
        localStorage.setItem('loopStatus', this.game.loopStatus);

        // Update display (removes glitch)
        this.updateTitleScreen();

        console.log(`💫 Ending accepted. VERSION ${this.game.loopVersion} locked.`);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.LoopController = LoopController;
}

// ES Module export
export { LoopController };
