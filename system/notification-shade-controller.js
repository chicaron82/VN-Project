// ========================================
// NOTIFICATION SHADE CONTROLLER
// Mobile-first notification shade system
// DIZEE + ZEERAH + GENZEE COLLABORATION
// ========================================

/**
 * NotificationShadeController
 * 
 * Manages the status bar, notification shade (mobile), and sidebar (desktop).
 * Provides platform-native UX patterns for game controls and information.
 * 
 * Features:
 * - Status bar with dynamic info (loop, route, progress, tether)
 * - Swipe-down notification shade (mobile)
 * - Expandable sidebar (desktop)
 * - Auto-hide on idle
 * - Keyboard shortcuts
 * - Route-specific theming
 * 
 * @class NotificationShadeController
 */
class NotificationShadeController {
    constructor(game) {
        this.game = game;
        this.isShadeOpen = false;
        this.isSidebarOpen = false;
        this.idleTimer = null;
        this.idleDelay = 3000; // 3 seconds

        // Touch gesture tracking
        this.touchStartY = 0;
        this.touchStartX = 0;

        // Initialize
        this.initializeElements();
        this.setupEventListeners();
        this.updateStatusBar();

        console.log('✅ NotificationShadeController initialized');
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    initializeElements() {
        // Status bar elements
        this.statusBar = document.getElementById('status-bar');
        this.statusLoop = document.getElementById('status-loop');
        this.statusRoute = document.getElementById('status-route');
        this.statusProgress = document.getElementById('status-progress');
        this.statusTether = document.getElementById('status-tether');
        this.statusLoading = document.getElementById('status-loading');

        // Notification shade elements
        this.shade = document.getElementById('notification-shade');
        this.backdrop = document.getElementById('shade-backdrop');
        this.shadeSave = document.getElementById('shade-save');
        this.shadeLoad = document.getElementById('shade-load');
        this.shadeFullscreen = document.getElementById('shade-fullscreen');
        this.shadeExit = document.getElementById('shade-exit');

        // Shade status elements
        this.shadeRoute = document.getElementById('shade-route');
        this.shadeLoop = document.getElementById('shade-loop');
        this.shadeNotes = document.getElementById('shade-notes');
        this.shadeTetherItem = document.getElementById('shade-tether-item');
        this.shadeTetherValue = document.getElementById('shade-tether-value');

        if (!this.statusBar) {
            console.error('Status bar element not found!');
            return;
        }
    }

    setupEventListeners() {
        // Auto-hide on idle
        this.resetIdleTimer();
        document.addEventListener('mousemove', () => this.resetIdleTimer());
        document.addEventListener('touchstart', () => this.resetIdleTimer());
        document.addEventListener('keydown', () => this.resetIdleTimer());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));

        // Swipe gesture detection (passive: false to allow preventDefault)
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Backdrop click to close
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.hideShade());
        }

        // Quick action buttons
        if (this.shadeSave) this.shadeSave.addEventListener('click', () => this.quickSave());
        if (this.shadeLoad) this.shadeLoad.addEventListener('click', () => this.quickLoad());
        if (this.shadeFullscreen) this.shadeFullscreen.addEventListener('click', () => this.toggleFullscreen());
        if (this.shadeExit) this.shadeExit.addEventListener('click', () => this.returnToMenu());

        console.log('✅ Event listeners setup');
    }

    // ========================================
    // STATUS BAR UPDATES
    // ========================================

    updateStatusBar() {
        if (!this.statusBar) return;

        // Update loop version
        if (this.statusLoop) {
            const loopVersion = this.game.loopVersion || 848;
            this.statusLoop.textContent = `Loop ${loopVersion}`;
        }

        // Update route
        if (this.statusRoute) {
            const routeName = this.getRouteName();
            this.statusRoute.textContent = routeName;

            // Apply route-specific class
            this.statusBar.classList.remove('ronnie-route', 'tori-route');
            if (routeName.includes('Ronnie')) {
                this.statusBar.classList.add('ronnie-route');
            } else if (routeName.includes('Tori')) {
                this.statusBar.classList.add('tori-route');
            }
        }

        // Update progress (notes collected)
        if (this.statusProgress) {
            const notesCollected = this.getNotesCollected();
            const totalNotes = this.getTotalNotes();
            this.statusProgress.textContent = `🖤 ${notesCollected}/${totalNotes}`;
        }

        // Update tether (Tori route only)
        if (this.statusTether) {
            if (this.isToriRoute()) {
                const tetherLevel = this.getTetherLevel();
                this.statusTether.textContent = `💚 ${Math.round(tetherLevel)}%`;
                this.statusTether.classList.add('visible');

                // Critical state
                if (tetherLevel < 20) {
                    this.statusTether.classList.add('critical');
                } else {
                    this.statusTether.classList.remove('critical');
                }

                // Heartbeat animation
                if (tetherLevel > 80 || tetherLevel < 30) {
                    this.statusTether.classList.add('heartbeat');
                } else {
                    this.statusTether.classList.remove('heartbeat');
                }
            } else {
                this.statusTether.classList.remove('visible');
            }
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    getRouteName() {
        if (!this.game.currentRoute) return 'Menu';
        const routeClass = this.game.currentRoute.constructor.name;
        if (routeClass.includes('Ronnie')) return 'Ronnie Route';
        if (routeClass.includes('Tori')) return 'Tori Route';
        return 'Route';
    }

    isToriRoute() {
        if (!this.game.currentRoute) return false;
        return this.game.currentRoute.constructor.name.includes('Tori');
    }

    getNotesCollected() {
        if (!this.game.collectiblesManager) return 0;
        return this.game.collectiblesManager.getCollectedCount() || 0;
    }

    getTotalNotes() {
        if (!this.game.collectiblesManager) return 42;
        return this.game.collectiblesManager.getTotalCount() || 42;
    }

    getTetherLevel() {
        if (!this.game.tetherSystem) return 100;
        return this.game.tetherSystem.tetherLevel || 100;
    }

    // ========================================
    // AUTO-HIDE FUNCTIONALITY
    // ========================================

    resetIdleTimer() {
        // Clear existing timer
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        // Remove idle class
        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        // Set new timer
        this.idleTimer = setTimeout(() => {
            if (this.statusBar && !this.isShadeOpen && !this.isSidebarOpen) {
                this.statusBar.classList.add('idle');
            }
        }, this.idleDelay);
    }

    // ========================================
    // NOTIFICATION SHADE CONTROL
    // ========================================

    showShade() {
        if (this.isShadeOpen) return;

        this.isShadeOpen = true;

        // Update shade content
        this.updateShadeContent();

        // Show shade and backdrop
        if (this.shade) {
            this.shade.classList.add('open');
        }
        if (this.backdrop) {
            this.backdrop.classList.add('visible');
        }

        // Pause game
        if (this.game.isPaused !== undefined) {
            this.game.isPaused = true;
        }

        // Prevent status bar auto-hide
        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        console.log('📱 Notification shade opened');
    }

    hideShade() {
        if (!this.isShadeOpen) return;

        this.isShadeOpen = false;

        // Hide shade and backdrop
        if (this.shade) {
            this.shade.classList.remove('open');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
        }

        // Resume game
        if (this.game.isPaused !== undefined) {
            this.game.isPaused = false;
        }

        // Reset idle timer
        this.resetIdleTimer();

        console.log('📱 Notification shade closed');
    }

    toggleShade() {
        if (this.isShadeOpen) {
            this.hideShade();
        } else {
            this.showShade();
        }
    }

    updateShadeContent() {
        // Update route
        if (this.shadeRoute) {
            this.shadeRoute.textContent = this.getRouteName();
        }

        // Update loop
        if (this.shadeLoop) {
            this.shadeLoop.textContent = this.game.loopVersion || 848;
        }

        // Update notes
        if (this.shadeNotes) {
            const collected = this.getNotesCollected();
            const total = this.getTotalNotes();
            this.shadeNotes.textContent = `${collected}/${total}`;
        }

        // Update tether (Tori route only)
        if (this.shadeTetherItem && this.shadeTetherValue) {
            if (this.isToriRoute()) {
                this.shadeTetherItem.style.display = 'flex';
                this.shadeTetherValue.textContent = `${Math.round(this.getTetherLevel())}%`;
            } else {
                this.shadeTetherItem.style.display = 'none';
            }
        }
    }

    // ========================================
    // SWIPE GESTURE DETECTION
    // ========================================

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        if (!this.touchStartY) return;

        const touchY = e.touches[0].clientY;
        const deltaY = touchY - this.touchStartY;

        // Swipe down from top 50px to open shade
        if (this.touchStartY < 50 && deltaY > 50 && !this.isShadeOpen) {
            e.preventDefault();
            this.showShade();
        }

        // Swipe up on shade to close
        if (this.isShadeOpen && deltaY < -50) {
            e.preventDefault();
            this.hideShade();
        }
    }

    handleTouchEnd(e) {
        this.touchStartY = 0;
        this.touchStartX = 0;
    }

    // ========================================
    // ANIMATIONS
    // ========================================

    pulseLoopNumber() {
        if (this.statusLoop) {
            this.statusLoop.classList.add('pulse');
            setTimeout(() => {
                this.statusLoop.classList.remove('pulse');
            }, 600);
        }
    }

    glitchLoopNumber() {
        if (this.statusLoop && this.statusBar.classList.contains('ronnie-route')) {
            this.statusLoop.classList.add('glitch');
            setTimeout(() => {
                this.statusLoop.classList.remove('glitch');
            }, 300);
        }
    }

    // ========================================
    // LOADING STATE
    // ========================================

    showLoadingState(progress = 0) {
        if (!this.statusBar) return;

        this.statusBar.classList.add('loading');

        const loadingFill = document.querySelector('.loading-fill');
        if (loadingFill) {
            loadingFill.style.width = `${progress}%`;
        }
    }

    hideLoadingState() {
        if (!this.statusBar) return;
        this.statusBar.classList.remove('loading');
        this.updateStatusBar();
    }

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================

    handleKeyboardShortcut(e) {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'escape':
                // Toggle shade/sidebar
                if (this.isShadeOpen) {
                    this.hideShade();
                } else {
                    this.showShade();
                }
                break;
            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.quickSave();
                }
                break;
            case 'l':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.quickLoad();
                }
                break;
            case 'f':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
                break;
            case 'm':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.returnToMenu();
                }
                break;
        }
    }

    // ========================================
    // QUICK ACTIONS
    // ========================================

    quickSave() {
        if (this.game.saveManager) {
            this.game.saveManager.saveGame(1, false, 'Quick Save');
            console.log('💾 Quick save');
        }
    }

    quickLoad() {
        if (this.game.saveLoadUI) {
            this.game.saveLoadUI.showSaveLoadScreen('load');
            console.log('📂 Load menu opened');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            console.log('⛶ Fullscreen enabled');
        } else {
            document.exitFullscreen();
            console.log('⛶ Fullscreen disabled');
        }
    }

    returnToMenu() {
        if (confirm('Return to main menu? Unsaved progress will be lost.')) {
            this.game.showMainMenu();
            console.log('🚪 Returned to menu');
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    update() {
        this.updateStatusBar();
    }

    onLoopIncrement() {
        this.pulseLoopNumber();
        if (this.statusBar.classList.contains('ronnie-route')) {
            this.glitchLoopNumber();
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.NotificationShadeController = NotificationShadeController;
}

// ES Module export
export { NotificationShadeController };
