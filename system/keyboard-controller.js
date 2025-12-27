// ========================================
// KEYBOARD CONTROLLER - DIZEE EXTRACTION
// Global keyboard navigation system
// Extracted from GameEngine to follow SOLID
// ========================================

/**
 * KeyboardController
 * 
 * Handles all global keyboard navigation including:
 * - ESC key hierarchy (close overlays in priority order)
 * - Quick Save/Load (Ctrl+S/L)
 * - Choice selection (number keys)
 * - Arrow key navigation
 * - Tab navigation
 * - Notifications
 * 
 * @class KeyboardController
 */
class KeyboardController {
    constructor(game) {
        this.game = game;

        // Destructure commonly used dependencies to reduce this.game. verbosity
        // These are resolved lazily via getters to handle initialization order
        this.keyboardNav = {
            currentContext: 'none',
            focusedIndex: 0,
            focusableElements: []
        };
    }

    // Lazy getters for commonly used managers (handles initialization order)
    get saveManager() { return this.game.saveManager; }
    get backlogManager() { return this.game.backlogManager; }
    get settingsManager() { return this.game.settingsManager; }
    get saveLoadUI() { return this.game.saveLoadUI; }
    get standaloneNotesViewer() { return this.game.standaloneNotesViewer; }
    get menuCarousel() { return this.game.menuCarousel; }

    // Lazy getters for UI elements
    get choiceMenu() { return this.game.choiceMenu; }
    get choicesContainer() { return this.game.choicesContainer; }
    get gameView() { return this.game.gameView; }
    get pauseContent() { return this.game.pauseContent; }
    get notesViewer() { return this.game.notesViewer; }
    get currentRoute() { return this.game.currentRoute; }

    // ========================================
    // INITIALIZATION
    // ========================================

    initialize() {
        console.log('⌨️ Initializing global keyboard navigation system');

        // Add global keyboard event listener (higher priority than existing ones)
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        }, true); // Use capture phase for priority

        console.log('✅ Keyboard navigation system initialized');
    }

    // ========================================
    // MAIN KEYBOARD HANDLER
    // ========================================

    handleGlobalKeyboard(e) {
        // Skip if typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // ========================================
        // ESC KEY HIERARCHY
        // Close overlays in priority order
        // ========================================
        if (e.key === 'Escape') {
            e.preventDefault();

            // Priority 1: Dev console
            if (typeof DevConsole !== 'undefined' && DevConsole.isOpen && DevConsole.isOpen()) {
                DevConsole.close();
                return;
            }

            // Priority 2: Ending dialog
            const endingDialog = document.getElementById('ending-dialog');
            if (endingDialog && !endingDialog.classList.contains('hidden')) {
                // Don't close ending dialog with ESC - force player to choose
                return;
            }

            // Priority 3: Credits screen
            const creditsModal = document.getElementById('credits-modal');
            if (creditsModal && creditsModal.style.display === 'flex') {
                this.game.hideCredits();
                return;
            }

            // Priority 4: Notes viewer (in-game)
            if (this.notesViewer && this.notesViewer.style.display === 'block') {
                this.game.closeNotesViewer();
                return;
            }

            // Priority 5: Standalone notes viewer (main menu)
            if (this.standaloneNotesViewer && this.standaloneNotesViewer.isOpen) {
                this.standaloneNotesViewer.close();
                return;
            }

            // Priority 6: Backlog
            const backlogOverlay = document.getElementById('backlog-overlay');
            if (backlogOverlay && backlogOverlay.style.display === 'flex') {
                this.backlogManager.close();
                return;
            }

            // Priority 7: Settings menu
            const settingsMenu = document.getElementById('settings-menu');
            if (settingsMenu && settingsMenu.style.display === 'flex') {
                this.settingsManager.closeSettings();
                return;
            }

            // Priority 8: Save/Load UI
            const saveLoadOverlay = document.getElementById('save-load-overlay');
            if (saveLoadOverlay && saveLoadOverlay.style.display === 'flex') {
                this.saveLoadUI.close();
                return;
            }

            // Priority 9: Pause menu (in-game)
            if (this.pauseContent && this.pauseContent.style.display === 'flex') {
                this.game.closePause();
                return;
            }

            // Priority 10: Route selection screen
            const routeSelection = document.getElementById('route-selection');
            if (routeSelection && routeSelection.style.display === 'flex') {
                this.game.showMainMenu();
                return;
            }

            return; // ESC handled
        }

        // ========================================
        // CTRL+S: Quick Save
        // ========================================
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            // Only allow quick save during active gameplay
            if (this.currentRoute && this.gameView.style.display !== 'none') {
                console.log('💾 Quick Save (Ctrl+S) to slot 1');
                this.saveManager.saveGame(1, true); // true = auto-save (no confirmation)
                this.showNotification('⚡ Quick saved to slot 1');
            }
            return;
        }

        // ========================================
        // CTRL+L: Quick Load
        // ========================================
        if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            // Check if save exists
            const saveData = this.saveManager.getSaveData(1);
            if (saveData) {
                console.log('📂 Quick Load (Ctrl+L) from slot 1');
                this.saveManager.loadGame(1);
                this.showNotification('⚡ Quick loaded from slot 1');
            } else {
                this.showNotification('❌ No save in slot 1');
            }
            return;
        }

        // ========================================
        // NUMBER KEYS (1-9): Choice Selection
        // ========================================
        if (e.key >= '1' && e.key <= '9') {
            const choiceNum = parseInt(e.key);

            // Check if choice menu is visible
            if (this.choiceMenu && this.choiceMenu.style.display !== 'none') {
                const choices = this.choicesContainer.querySelectorAll('.choice-button:not([style*="display: none"])');

                if (choiceNum <= choices.length) {
                    e.preventDefault();
                    console.log(`🔢 Number key ${choiceNum} pressed - selecting choice`);
                    choices[choiceNum - 1].click();
                }
            }
            return;
        }

        // ========================================
        // ARROW KEYS: Context-Aware Navigation
        // ========================================
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            this.handleArrowKeyNavigation(e);
            return;
        }

        // ========================================
        // TAB: Cycle Through Focusable Elements
        // ========================================
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
            return;
        }

        // ========================================
        // SPACEBAR / ENTER: Dialogue Advancement
        // Complete typing first, then advance
        // ========================================
        if (e.key === ' ' || e.key === 'Enter') {
            // Skip if in menus/overlays
            const mainMenu = document.getElementById('main-menu');
            const settingsMenu = document.getElementById('settings-menu');
            const saveLoadOverlay = document.getElementById('save-load-overlay');
            const backlogOverlay = document.getElementById('backlog-overlay');

            // Only handle spacebar/enter during active gameplay
            if (this.gameView && this.gameView.style.display !== 'none' &&
                (!mainMenu || mainMenu.style.display === 'none') &&
                (!settingsMenu || settingsMenu.style.display !== 'flex') &&
                (!saveLoadOverlay || saveLoadOverlay.style.display !== 'flex') &&
                (!backlogOverlay || backlogOverlay.style.display !== 'flex')) {

                e.preventDefault();

                // If typewriter is active, complete the typing first
                if (this.game.typewriterController && this.game.typewriterController.isActive()) {
                    console.log('⌨️ Spacebar/Enter: Completing typing');
                    this.game.typewriterController.skip();
                    return;
                }

                // If pagination is active, show next page
                if (this.game.typewriterController && this.game.typewriterController.isPaginating()) {
                    console.log('⌨️ Spacebar/Enter: Next page');
                    this.game.typewriterController.showNextPage();
                    return;
                }

                // Otherwise, advance dialogue
                console.log('⌨️ Spacebar/Enter: Advancing dialogue');
                this.game.typewriterController.handleClick();
                return;
            }
        }

        // ========================================
        // ENTER: Activate Focused Element (Menus)
        // ========================================
        if (e.key === 'Enter') {

            e.preventDefault();

            // Check if we're on the main menu with carousel
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu && mainMenu.style.display === 'flex') {
                // Check if menuCarousel exists and has an active card
                if (this.menuCarousel && this.menuCarousel.getCurrentCard) {
                    const currentCard = this.menuCarousel.getCurrentCard();
                    if (currentCard) {
                        console.log('⏎ Enter pressed on carousel - activating current card');
                        currentCard.click();
                        return;
                    }
                }
            }

            // Default: activate focused element
            const focused = document.activeElement;
            if (focused && (focused.tagName === 'BUTTON' || focused.classList.contains('focusable'))) {
                focused.click();
            }
        }
    }

    // ========================================
    // ARROW KEY NAVIGATION
    // ========================================

    handleArrowKeyNavigation(e) {
        const key = e.key;

        // ========================================
        // CONTEXT 1: Choice Menu
        // ========================================
        if (this.choiceMenu && this.choiceMenu.style.display !== 'none') {
            e.preventDefault();
            const choices = this.choicesContainer.querySelectorAll('.choice-button:not([style*="display: none"])');

            if (choices.length === 0) return;

            // Find currently focused choice
            let currentIndex = -1;
            choices.forEach((choice, i) => {
                if (choice.classList.contains('keyboard-focus')) {
                    currentIndex = i;
                }
            });

            // Calculate new index
            let newIndex = currentIndex;
            if (key === 'ArrowDown' || key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % choices.length;
            } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
                newIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
            }

            // Update focus
            choices.forEach(c => c.classList.remove('keyboard-focus'));
            choices[newIndex].classList.add('keyboard-focus');
            choices[newIndex].focus();

            console.log(`⬆️ Arrow navigation: Choice ${newIndex + 1}/${choices.length}`);
            return;
        }

        // ========================================
        // CONTEXT 2: Ending Dialog (Three-Option System)
        // ========================================
        const endingDialog = document.getElementById('ending-dialog');
        if (endingDialog && !endingDialog.classList.contains('hidden')) {
            // Already handled by existing ending dialog keyboard system
            return;
        }

        // ========================================
        // CONTEXT 3: Main Menu Buttons
        // ========================================
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu && mainMenu.style.display === 'flex') {
            e.preventDefault();
            const buttons = mainMenu.querySelectorAll('button:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }

        // ========================================
        // CONTEXT 4: Route Selection
        // ========================================
        const routeSelection = document.getElementById('route-selection');
        if (routeSelection && routeSelection.style.display === 'flex') {
            e.preventDefault();
            const buttons = routeSelection.querySelectorAll('.route-option:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }

        // ========================================
        // CONTEXT 5: Settings Menu
        // ========================================
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsMenu && settingsMenu.style.display === 'flex') {
            e.preventDefault();
            const focusable = settingsMenu.querySelectorAll('button, input[type="range"], select, .focusable');
            this.navigateButtons(focusable, key);
            return;
        }

        // ========================================
        // CONTEXT 6: Save/Load UI
        // ========================================
        const saveLoadOverlay = document.getElementById('save-load-overlay');
        if (saveLoadOverlay && saveLoadOverlay.style.display === 'flex') {
            e.preventDefault();
            const slots = saveLoadOverlay.querySelectorAll('.save-slot:not([style*="display: none"])');
            this.navigateButtons(slots, key);
            return;
        }

        // ========================================
        // CONTEXT 7: Pause Menu
        // ========================================
        if (this.pauseContent && this.pauseContent.style.display === 'flex') {
            e.preventDefault();
            const buttons = this.pauseContent.querySelectorAll('button:not([style*="display: none"])');
            this.navigateButtons(buttons, key);
            return;
        }
    }

    // ========================================
    // BUTTON NAVIGATION UTILITY
    // ========================================

    navigateButtons(buttons, key) {
        if (buttons.length === 0) return;

        // Find currently focused button
        let currentIndex = -1;
        buttons.forEach((btn, i) => {
            if (btn.classList.contains('keyboard-focus') || btn === document.activeElement) {
                currentIndex = i;
            }
        });

        // If nothing focused, start at first button
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // Calculate new index
        let newIndex = currentIndex;
        if (key === 'ArrowDown' || key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % buttons.length;
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            newIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        }

        // Update focus
        buttons.forEach(btn => btn.classList.remove('keyboard-focus'));
        buttons[newIndex].classList.add('keyboard-focus');
        buttons[newIndex].focus();

        console.log(`⬆️ Button navigation: ${newIndex + 1}/${buttons.length}`);
    }

    // ========================================
    // TAB NAVIGATION
    // ========================================

    handleTabNavigation(e) {
        // Get all focusable elements in the current context
        const focusable = document.querySelectorAll(
            'button:not([disabled]):not([style*="display: none"]), ' +
            'a[href]:not([disabled]), ' +
            'input:not([disabled]):not([type="hidden"]), ' +
            'select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"]), ' +
            '.focusable:not([style*="display: none"])'
        );

        if (focusable.length === 0) return;

        // Filter to only visible elements
        const visible = Array.from(focusable).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });

        if (visible.length === 0) return;

        const currentIndex = visible.indexOf(document.activeElement);
        let nextIndex;

        if (e.shiftKey) {
            // Shift+Tab: Go backwards
            nextIndex = currentIndex <= 0 ? visible.length - 1 : currentIndex - 1;
        } else {
            // Tab: Go forwards
            nextIndex = (currentIndex + 1) % visible.length;
        }

        e.preventDefault();
        visible[nextIndex].focus();
        visible[nextIndex].classList.add('keyboard-focus');

        console.log(`⭾ Tab navigation: ${nextIndex + 1}/${visible.length} (${e.shiftKey ? 'backwards' : 'forwards'})`);
    }

    // ========================================
    // NOTIFICATION DISPLAY
    // ========================================

    showNotification(message, duration = 2000) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('keyboard-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'keyboard-notification';
            notification.className = 'keyboard-notification';
            document.body.appendChild(notification);
        }

        // Show notification
        notification.textContent = message;
        notification.classList.add('visible');

        // Auto-hide after duration
        setTimeout(() => {
            notification.classList.remove('visible');
        }, duration);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.KeyboardController = KeyboardController;
}

// ES Module export
export { KeyboardController };
