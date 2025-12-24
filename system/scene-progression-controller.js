// ========================================
// SCENE PROGRESSION CONTROLLER
// Extracted from GameEngine (Session 119)
// ========================================
//
// RESPONSIBILITIES:
// - Orchestrate story progression (prologue → route selection → route gameplay)
// - Manage route transitions (cleanup → setup → start)
// - Coordinate version tracking (848 loop counter)
// - Handle route-specific UI configuration
// - Delegate to specialized controllers
//
// DEPENDENCIES (injected via constructor):
// - game (GameEngine) - Access to all managers and state
//
// CRITICAL: Preserves 848 version tracking logic
// ========================================

class SceneProgressionController {
    constructor(game) {
        this.game = game;
        console.log('🎯 SceneProgressionController initialized');
    }

    // ========================================
    // STORY START - PLAYS PROLOGUE FIRST
    // ========================================

    startStory() {
        // Check if skip prologue is unlocked AND enabled in settings
        if (this.game.skipPrologueUnlocked && this.game.settingsManager?.settings?.autoSkipPrologue) {
            // Auto-skip enabled - go straight to routes
            console.log('⏭️ Auto-skip prologue enabled - jumping to route selection');
            this.skipToRouteSelection();
            return;
        }

        // Check if skip is unlocked (but not auto-enabled)
        if (this.game.skipPrologueUnlocked) {
            // Check if prompt has been seen before
            const promptSeen = localStorage.getItem('skipProloguePromptSeen') === 'true';

            if (!promptSeen) {
                // First time seeing prompt - show it
                this.showSkipProloguePrompt();
                return;
            } else {
                // Prompt already seen - respect Settings toggle (defaults to OFF)
                // Since auto-skip is OFF (we checked above), play prologue
                console.log('⏭️ Skip prompt dismissed previously - playing prologue (toggle in Settings to auto-skip)');
                this.startPrologueNormally();
                return;
            }
        }

        // Normal flow - start prologue
        this.startPrologueNormally();
    }

    startPrologueNormally() {
        // Clear backlog from previous session
        if (this.game.backlogManager) {
            this.game.backlogManager.clearHistory();
        }

        // Cleanup Menu Carousel if active
        if (this.game.menuCarousel) {
            this.game.menuCarousel.destroy();
            this.game.menuCarousel = null;
        }

        // Standard prologue start
        this.game.gameState.currentRoute = 'prologue'; // Set current route for tracking
        this.clearAllSprites();

        // Reset game state
        this.game.gameState = {
            flags: {},
            choices: {},
            progress: {},
            sprites: { left: null, right: null }
        };

        // ZEE'S ADDITION: Stop tip rotation 🖤
        this.stopMainMenuTipRotation();

        // Fade out main menu
        this.game.mainMenu.style.opacity = '0';

        setTimeout(() => {
            this.game.mainMenu.style.display = 'none';
            this.game.gameView.style.display = 'flex';

            // Show Game UI Layer
            const gameUI = document.getElementById('game-ui-layer');
            if (gameUI) gameUI.style.display = 'block';

            this.game.dialogueBox.style.display = 'block';

            // Fade in game view
            setTimeout(() => {
                this.game.gameView.style.transition = 'opacity 1s';
                this.game.gameView.style.opacity = '1';
            }, 100);

            // Clear any lingering sprites before starting prologue
            this.clearAllSprites();

            // Start shared prologue
            const prologue = new SharedPrologue(this.game);
            prologue.start();
        }, 800);
    }

    // ========================================
    // SKIP PROLOGUE SYSTEM
    // ========================================

    showSkipProloguePrompt() {
        this.game.routeController.showSkipProloguePrompt();
    }

    skipToRouteSelection() {
        this.game.routeController.skipToRouteSelection();
    }

    // ========================================
    // RONNIE NOTES SYSTEM UNLOCK
    // Unlocks notes viewer for Ronnie's route + Tab 2
    // ========================================

    unlockRonnieNotesSystem() {
        this.game.ronnieNotesUnlocked = true;
        localStorage.setItem('ronnieNotesUnlocked', 'true');
        localStorage.setItem('ronnieTabUnlocked', 'true');

        console.log('📝 Ronnie notes system unlocked! Notes viewer now active for replays.');

        // Unlock the teaser note (already defined in collectibles-manager.js)
        // Access through currentRoute if available (during gameplay)
        if (this.game.currentRoute && this.game.currentRoute.collectiblesManager) {
            this.game.currentRoute.collectiblesManager.unlockNote('ronnie_teaser');
        } else {
            // DIZEE FIX: Use correct localStorage key and structure
            // Directly add to localStorage if called outside of active route
            const savedNotes = JSON.parse(localStorage.getItem('vn_collected_notes') || '{"z":[],"cz":[],"zr":[],"gz":[],"iz":[],"pz":[],"special":[]}');
            if (!savedNotes.special.includes('ronnie_teaser')) {
                savedNotes.special.push('ronnie_teaser');
                localStorage.setItem('vn_collected_notes', JSON.stringify(savedNotes));
                console.log('✅ Ronnie teaser note unlocked (via localStorage)');
            }
        }

        // ZEERAH: Mark feature as unread for notification dot
        if (this.game.standaloneNotesViewer) {
            this.game.standaloneNotesViewer.readStatus['feature_ronnieNotes'] = false;
            this.game.standaloneNotesViewer.saveReadStatus();
            this.game.standaloneNotesViewer.updateNotificationDots();
        }
    }

    // ========================================
    // ROUTE START - CRITICAL 848 VERSION TRACKING
    // ========================================

    startRoute(routeName) {
        console.log(`🚀 Starting route: ${routeName}`);

        // Clear backlog from previous session/route
        if (this.game.backlogManager) {
            this.game.backlogManager.clearHistory();
        }

        // Cleanup Menu Carousel if active
        if (this.game.menuCarousel) {
            this.game.menuCarousel.destroy();
            this.game.menuCarousel = null;
        }

        this.game.gameState.currentRoute = routeName; // Set current route for tracking

        // DIZEE: Apply route-specific theme 🎨
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.setRoute(routeName);
        }

        // DIZEE FIX: Clear game view immediately to prevent old scene flash 💚
        if (this.game.gameView) {
            this.game.gameView.style.backgroundImage = 'none';
        }

        // Clear sprites before starting route (redundant safety check)
        this.clearAllSprites();

        // DIZEE FIX: Reset loop status to 'attempting' when starting new route
        // This prevents [FINAL] from persisting after true ending -> retry -> bad ending
        // ⚠️ CRITICAL 848 VERSION TRACKING - DO NOT MODIFY ⚠️
        if (this.game.loopStatus === 'succeeded' || this.game.loopStatus === 'accepted') {
            const previousStatus = this.game.loopStatus;
            this.incrementVersion(); // Increment version for new attempt (also resets status to 'attempting')
            console.log(`🔄 New attempt after ${previousStatus} - VERSION ${this.game.loopVersion}`);
        }

        // ZEE'S ADDITION: Stop tip rotation 🖤
        this.stopRouteSelectTipRotation();

        // ZEE'S FIX: Restore Insane Mode flags from localStorage 🖤
        // When user commits to Insane in settings, flag is saved to localStorage
        // But gameState gets reinitialized, so we need to restore it here
        const insaneLocked = localStorage.getItem('insaneModeLocked') === 'true';
        if (insaneLocked) {
            // Restore Insane Mode flags to gameState
            if (!this.game.gameState.flags) {
                this.game.gameState.flags = {};
            }
            this.game.gameState.flags.insaneModeActive = true;
            this.game.gameState.flags.insaneModeLocked = true;
            console.log('💀 Insane Mode restored from localStorage');

            // Trigger initial visual corruption on route start
            if (this.game.triggerInsaneVisuals) {
                this.game.triggerInsaneVisuals();
            }

            // ZEE'S FIX: Apply Insane Mode color scheme (cyan → red) 🖤
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.classList.add('insane-mode-active');
                console.log('🔴 Insane Mode color scheme activated');
            }
        }

        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';

        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.game.gameView.style.display = 'flex';

            // Show Game UI Layer
            const gameUI = document.getElementById('game-ui-layer');
            if (gameUI) gameUI.style.display = 'block';
            this.game.dialogueBox.style.display = 'block';

            // Fade in game view
            setTimeout(() => {
                this.game.gameView.style.opacity = '1';
            }, 100);

            // Show notes button for Tori's route (has collectibles)
            if (routeName === 'tori') {
                if (this.game.notesButton) {
                    this.game.notesButton.style.display = 'block';
                }
            } else if (this.hasCompletedAnyEnding()) {
                // Show for other routes only after completing an ending
                if (this.game.notesButton) {
                    this.game.notesButton.style.display = 'block';
                }
            }

            // Show backlog button during gameplay
            const backlogButton = document.getElementById('backlog-button');
            if (backlogButton) {
                backlogButton.style.display = 'block';
            }

            // DIZEE: Show dev commentary button if unlocked (inside dialogue box)
            if (this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
                const dialogueBox = document.getElementById('dialogue-box');

                // Remove existing button if any
                const existingBtn = dialogueBox?.querySelector('.commentary-hint-button');
                if (existingBtn) existingBtn.remove();

                const commentaryBtn = document.createElement('button');
                commentaryBtn.className = 'commentary-hint-button';
                commentaryBtn.innerHTML = '🎙️ COMMENTARY';
                commentaryBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevent dialogue advance
                    this.game.devCommentary.showCommentary('route_selection_dual');
                    // Also show philosophy after a delay
                    setTimeout(() => {
                        this.game.devCommentary.showCommentary('route_selection_philosophy');
                    }, 10000);
                };

                if (dialogueBox) {
                    dialogueBox.appendChild(commentaryBtn);
                }
            }

            // Set route-specific dialogue frame
            this.setDialogueFrame(routeName);

            // DIZEE: Code rain transition before route starts 💚🌧️
            this.showCodeRainTransition(() => {
                // DIZEE FIX: Clean up previous route before starting new one
                if (this.game.currentRoute) {
                    // Call route's cleanup method (handles timers, listeners, references)
                    if (this.game.currentRoute.cleanup) {
                        this.game.currentRoute.cleanup();
                    }
                    // Hide tether UI
                    if (this.game.tetherUI) {
                        this.game.tetherUI.style.display = 'none';
                    }
                    // Clear current route reference
                    this.game.currentRoute = null;
                }

                // Initialize route
                if (routeName === 'ronnie') {
                    this.game.currentRoute = new RonnieRoute(this.game);
                    this.game.currentRoute.start(); // Call start() explicitly

                    // DIZEE: Add route class for choice button theming 💚
                    document.body.classList.add('ronnie-route');
                    document.body.classList.remove('tori-route');
                } else if (routeName === 'tori') {
                    this.game.currentRoute = new ToriRoute(this.game);

                    // INSANE MODE: Make Hold On button a ghost
                    if (this.game.gameState.flags && this.game.gameState.flags.insaneModeActive) {
                        this.makeHoldOnGhost();
                    }

                    this.game.currentRoute.start(); // Tori has explicit .start()

                    // DIZEE: Add route class for choice button theming 💚
                    document.body.classList.add('tori-route');
                    document.body.classList.remove('ronnie-route');
                }

                // Show ESC hint briefly for desktop users
                this.showEscHintBriefly();
            }, 1500); // Code rain transition duration
        }, 1000);
    }

    // ========================================
    // VERSION TRACKING (848 LOOP COUNTER)
    // ========================================

    incrementVersion() {
        return this.game.loopController.increment();
    }

    resetVersion(targetVersion = 848, status = 'attempting') {
        // DEV COMMAND: Reset loop version
        // Usage in console: game.resetVersion(848)
        this.game.loopVersion = parseInt(targetVersion);
        this.game.loopStatus = status;

        localStorage.setItem('loopVersion', this.game.loopVersion.toString());
        localStorage.setItem('loopStatus', this.game.loopStatus);

        this.updateTitleScreen();

        console.log(`🔧 DEV: Version reset to ${this.game.loopVersion}, status: ${this.game.loopStatus}`);
        console.log(`💡 Refresh page to see changes!`);

        return this.game.loopVersion;
    }

    updateTitleScreen() {
        this.game.loopController.updateTitleScreen();
    }

    // ========================================
    // SPRITE MANAGEMENT
    // ========================================

    clearAllSprites() {
        // NEW METHOD: Complete sprite cleanup
        // Remove sprites from DOM
        if (this.game.spriteLeft) {
            this.game.spriteLeft.style.opacity = '0';
            this.game.spriteLeft.style.display = 'none';
            this.game.spriteLeft.style.backgroundImage = '';
            this.game.spriteLeft.classList.remove('sprite-dim');
        }
        if (this.game.spriteRight) {
            this.game.spriteRight.style.opacity = '0';
            this.game.spriteRight.style.display = 'none';
            this.game.spriteRight.style.backgroundImage = '';
            this.game.spriteRight.classList.remove('sprite-dim');
        }

        // Clear tracking state
        this.game.currentSprites = { left: null, right: null };
        this.game.gameState.sprites = { left: null, right: null };

        console.log('All sprites cleared');
    }

    // ========================================
    // ROUTE-SPECIFIC UI CONFIGURATION
    // ========================================

    setDialogueFrame(routeName) {
        // Remove existing route classes from all UI elements
        this.game.dialogueBox.classList.remove('ronnie-route', 'tori-route', 'prologue-style', 'epilogue-style');
        if (this.game.pauseButton) this.game.pauseButton.classList.remove('ronnie-route', 'tori-route');
        if (this.game.pauseContent) this.game.pauseContent.classList.remove('ronnie-route', 'tori-route');
        if (this.game.notesButton) this.game.notesButton.classList.remove('ronnie-route', 'tori-route');
        if (this.game.notesViewer) this.game.notesViewer.classList.remove('ronnie-route', 'tori-route');

        // Apply route-specific theming to all UI
        if (routeName === 'ronnie') {
            this.game.dialogueBox.classList.add('ronnie-route');
            if (this.game.pauseButton) this.game.pauseButton.classList.add('ronnie-route');
            if (this.game.pauseContent) this.game.pauseContent.classList.add('ronnie-route');
            if (this.game.notesButton) this.game.notesButton.classList.add('ronnie-route');
            if (this.game.notesViewer) this.game.notesViewer.classList.add('ronnie-route');
        } else if (routeName === 'tori') {
            this.game.dialogueBox.classList.add('tori-route');
            if (this.game.pauseButton) this.game.pauseButton.classList.add('tori-route');
            if (this.game.pauseContent) this.game.pauseContent.classList.add('tori-route');
            if (this.game.notesButton) this.game.notesButton.classList.add('tori-route');
            if (this.game.notesViewer) this.game.notesViewer.classList.add('tori-route');
        }

        console.log(`UI theme set: ${routeName}`);
    }

    // ========================================
    // DELEGATION TO OTHER CONTROLLERS
    // ========================================

    showCodeRainTransition(callback, duration = 1500) {
        this.game.effectsController?.showCodeRainTransition(callback, duration);
    }

    stopMainMenuTipRotation() {
        this.game.tipsController.stopMainMenuRotation();
    }

    stopRouteSelectTipRotation() {
        this.game.tipsController.stopRouteSelectRotation();
    }

    showEscHintBriefly() {
        this.game.uiController.showEscHintBriefly();
    }

    hasCompletedAnyEnding() {
        return localStorage.getItem('hasCompletedOnce') === 'true';
    }

    makeHoldOnGhost() {
        if (!this.game.holdOnButton) return;

        console.log('💀 INSANE MODE: Hiding Hold On button');

        // DIZEE FIX: Hide Hold On button completely in Insane Mode (Option A - cleaner UX)
        // You removed this safety. It stays gone.
        this.game.holdOnButton.style.display = 'none';
    }

    // ========================================
    // ROUTE SELECTOR INTEGRATION
    // (These methods work with the RouteSelector nested class)
    // ========================================

    selectRoute(route) {
        if (this.game.selectedRoute === route) {
            console.log(`ℹ️ Already on ${route} route`);
            return; // Already selected
        }

        console.log(`🔄 Switching to ${route} route`);
        this.game.selectedRoute = route;

        // Check if elements exist before updating
        if (!this.game.ronniePortrait || !this.game.toriPortrait || !this.game.toggleTrack) {
            console.error('❌ RouteSelector: Portrait or toggle elements missing');
            return;
        }

        // Tori route: Add UI freeze-frame effect
        if (route === 'tori') {
            // Brief freeze-frame stutter (100ms)
            const routeSelectContent = document.getElementById('route-select-content');
            if (routeSelectContent) {
                routeSelectContent.style.opacity = '0.3';
                setTimeout(() => {
                    routeSelectContent.style.opacity = '1';
                }, 100);
            }
        }

        // Update portraits
        if (route === 'ronnie') {
            this.game.ronniePortrait.classList.add('active');
            this.game.toriPortrait.classList.remove('active');
            this.game.toggleTrack.classList.remove('tori-active');
            if (this.game.ronnieInfo) this.game.ronnieInfo.classList.add('active');
            if (this.game.toriInfo) this.game.toriInfo.classList.remove('active');
            if (this.game.routeName) this.game.routeName.textContent = 'RONNIE';
        } else {
            this.game.toriPortrait.classList.add('active');
            this.game.ronniePortrait.classList.remove('active');
            this.game.toggleTrack.classList.add('tori-active');
            if (this.game.toriInfo) this.game.toriInfo.classList.add('active');
            if (this.game.ronnieInfo) this.game.ronnieInfo.classList.remove('active');
            if (this.game.routeName) this.game.routeName.textContent = 'TORI';
        }

        // Update body attribute for button styling
        document.body.setAttribute('data-selected-route', route);

        console.log(`✅ Successfully switched to ${route} route`);
    }

    startSelectedRoute() {
        console.log(`🚀 Starting ${this.game.selectedRoute} route`);

        // DIZEE: Haptic feedback for route start
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('cardSnap', null, 'Route selection confirmed');
        }

        this.startRoute(this.game.selectedRoute);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.SceneProgressionController = SceneProgressionController;
}

// ES Module export
export { SceneProgressionController };
