/**
 * ========================================
 * INPUT BINDER
 * Separates HTML presentation from JavaScript logic.
 * Attaches event listeners to static UI elements.
 * ========================================
 */

class InputBinder {
    constructor(game) {
        this.game = game;
        console.log('🔌 InputBinder initialized');
    }

    bindAll() {
        this.bindMainMenu();
        this.bindRouteSelect();
        this.bindGameView();
        this.bindPauseMenu();
        this.bindSettings();
        this.bindSaveLoad();
        this.bindExtras();

        console.log('✅ All UI events bound successfully');
    }

    bindMainMenu() {
        this.bindClick('btn-start-story', () => this.game.startStory());
        this.bindClick('btn-continue', () => this.game.continueGame());
        this.bindClick('btn-load-game-menu', () => this.game.showSaveLoadScreen('load'));
        this.bindClick('btn-open-notes', () => this.game.openStandaloneNotes());
        this.bindClick('torigatchi-menu-btn', () => this.game.openTorigatchiIframe('../Tori-Gatchi/index.html'));
        this.bindClick('btn-settings', () => this.game.showSettings());
        this.bindClick('btn-credits', () => this.game.showCredits());
        this.bindClick('btn-meet-crew', () => this.game.showMeetTheCrew());
        this.bindClick('btn-directors-cut', () => this.game.showDirectorsCut());
        this.bindClick('contact-menu-btn', () => this.game.showContact());
    }

    bindRouteSelect() {
        this.bindClick('route-play-button', () => this.game.startSelectedRoute());
        this.bindClick('back-to-menu', () => this.game.backToMenu());
    }

    bindGameView() {
        this.bindClick('backlog-button', () => this.game.openBacklog());
        this.bindClick('pause-button', () => this.game.saveLoadUI.showPauseMenu());
        this.bindClick('skip-button', () => this.game.toggleSkip());
        this.bindClick('close-backlog', () => this.game.closeBacklog());
    }

    bindPauseMenu() {
        this.bindClick('btn-close-pause-menu', () => this.game.resumeGame());
        this.bindClick('btn-pause-resume', () => this.game.resumeGame());
        this.bindClick('btn-pause-settings', () => this.game.showSettings());
        this.bindClick('fullscreen-button', () => this.game.toggleFullscreen());
        this.bindClick('btn-pause-save', () => this.game.showSaveLoadScreen('save', true));
        this.bindClick('btn-pause-load', () => this.game.showSaveLoadScreen('load', true));
        this.bindClick('btn-pause-main-menu', () => this.game.returnToMainMenu());
    }

    bindSettings() {
        this.bindClick('btn-close-settings', () => this.game.closeSettings());
        this.bindClick('btn-settings-back', () => this.game.closeSettings());
        this.bindClick('btn-settings-reset', () => this.game.resetSettings());
        this.bindClick('settings-fullscreen-btn', () => this.game.toggleFullscreen());
    }

    bindSaveLoad() {
        this.bindClick('btn-close-saveload-x', () => this.game.closeSaveLoadScreen());
        this.bindClick('close-save-load', () => this.game.closeSaveLoadScreen());
        this.bindClick('save-mode-btn', () => this.game.setSaveLoadMode('save'));
        this.bindClick('load-mode-btn', () => this.game.setSaveLoadMode('load'));

        // Slots
        this.bindClick('slot-autosave', () => this.game.handleSaveSlotClick('autosave'));
        this.bindClick('slot-1', () => this.game.handleSaveSlotClick(1));
        this.bindClick('slot-2', () => this.game.handleSaveSlotClick(2));
        this.bindClick('slot-3', () => this.game.handleSaveSlotClick(3));

        // Deletes
        this.bindClick('btn-delete-slot-1', (e) => { e.stopPropagation(); this.game.deleteSaveSlot(1); });
        this.bindClick('btn-delete-slot-2', (e) => { e.stopPropagation(); this.game.deleteSaveSlot(2); });
        this.bindClick('btn-delete-slot-3', (e) => { e.stopPropagation(); this.game.deleteSaveSlot(3); });
    }

    bindExtras() {
        this.bindClick('dev-hud-close', () => this.game.toggleDevHUD());

        // Bootstrap Overlay
        this.bindClick('btn-close-bootstrap-x', () => this.game.closeBootstrap());
        this.bindClick('btn-close-bootstrap-footer', () => this.game.closeBootstrap());

        // Echo Overlay
        this.bindClick('btn-close-echo-x', () => this.game.closeEchoCompilation());
        this.bindClick('btn-close-echo-footer', () => this.game.closeEchoCompilation());

        // Crew Screen
        this.bindClick('btn-close-crew', () => this.game.closeCrew());
        this.bindClick('btn-next-crew', () => this.game.nextCrew());

        // Contact Screen
        this.bindClick('btn-close-contact', () => this.game.closeContact());
        this.bindClick('btn-close-contact-footer', () => this.game.closeContact());

        // Loop Init Screen
        this.bindClick('loop-skip-button', () => this.game.skipLoopInit());
    }

    // Helper to safely bind if element exists
    bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                // DIZEE: Centralized haptic feedback for all buttons
                if (this.game && this.game.triggerSensoryFeedback) {
                    this.game.triggerSensoryFeedback('buttonPress', el, `Button click: ${id}`);
                }
                handler(e);
            });
        } else {
            // Debug log mostly for dev, maybe silence in prod
            // console.warn(`⚠️ InputBinder: Element #${id} not found`);
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.InputBinder = InputBinder;
}

// ES Module export
export { InputBinder };
