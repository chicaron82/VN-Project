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
        this.statusBar = document.getElementById('status-bar');
        this.statusLoop = document.getElementById('status-loop');
        this.statusRoute = document.getElementById('status-route');
        this.statusProgress = document.getElementById('status-progress');
        this.statusTether = document.getElementById('status-tether');
        this.statusLoading = document.getElementById('status-loading');

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
                // Toggle shade/sidebar (Phase 2/3)
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
