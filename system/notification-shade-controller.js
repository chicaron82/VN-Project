// @ts-check
// ========================================
// NOTIFICATION SHADE CONTROLLER
// Mobile-first notification shade system
// DIZEE + ZEE + GENZEE COLLABORATION
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
    /**
     * @param {any} game - Game engine instance
     */
    constructor(game) {
        this.game = game;
        this.isShadeOpen = false;
        this.isSidebarOpen = false;
        this.idleTimer = null;
        this.idleDelay = 3000; // 3 seconds
        this.screenshotMode = false; // Hide UI for screenshots

        // Touch gesture tracking
        this.touchStartY = 0;
        this.touchStartX = 0;

        // Email-style notes tracking
        /** @type {{id: string, title: string, content: string}[]} */
        this.unreadNotes = [];
        /** @type {{id: string, title: string, content: string}|null} */
        this.currentNotePreview = null;

        // Load persistent state
        this.loadPersistentState();

        // Initialize
        this.initializeElements();
        this.setupEventListeners();
        this.updateStatusBar();

        // DIZEE: Subscribe to tether level changes for reactive lightning bolt updates
        if (this.game.state) {
            // @ts-ignore - Callback parameters typed by StateManager
            this.game.state.subscribe('tether.level', (newLevel, oldLevel) => {
                console.log(`⚡ Shade: Tether subscription ${oldLevel} → ${newLevel}`);
                this.updateStatusBar();
            });
        }

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
        this.shadeSettings = document.getElementById('shade-settings');

        // Sidebar elements (desktop)
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.sidebarSave = document.getElementById('sidebar-save');
        this.sidebarLoad = document.getElementById('sidebar-load');
        this.sidebarFullscreen = document.getElementById('sidebar-fullscreen');
        this.sidebarExit = document.getElementById('sidebar-exit');
        this.sidebarSettings = document.getElementById('sidebar-settings');

        // Sidebar status elements
        this.sidebarRoute = document.getElementById('sidebar-route');
        this.sidebarLoop = document.getElementById('sidebar-loop');
        this.sidebarNotes = document.getElementById('sidebar-notes');
        this.sidebarTetherItem = document.getElementById('sidebar-tether-item');
        this.sidebarTetherValue = document.getElementById('sidebar-tether-value');

        // New elements - Tether lightning bolt
        this.tetherLightning = document.querySelector('.tether-lightning');
        this.tetherFill = document.querySelector('.tether-fill');
        this.statusTetherValue = document.getElementById('status-tether-value');

        // New elements - Mail icon with badge
        this.statusMail = document.getElementById('status-mail');
        this.mailIcon = document.querySelector('.mail-icon');
        this.unreadBadge = document.querySelector('.unread-badge');

        // New elements - Note preview (shade)
        this.notesPreviewSection = document.getElementById('notes-preview-section');
        /** @type {HTMLElement|null} */
        this.notePreviewBtn = document.getElementById('note-preview-btn');
        this.noteTitle = this.notePreviewBtn?.querySelector('.note-title');
        this.noteSnippet = this.notePreviewBtn?.querySelector('.note-snippet');

        // New elements - Note preview (sidebar)
        this.sidebarNotesPreviewSection = document.getElementById('sidebar-notes-preview-section');
        /** @type {HTMLElement|null} */
        this.sidebarNotePreviewBtn = document.getElementById('sidebar-note-preview-btn');
        this.sidebarNoteTitle = this.sidebarNotePreviewBtn?.querySelector('.note-title');
        this.sidebarNoteSnippet = this.sidebarNotePreviewBtn?.querySelector('.note-snippet');

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
        if (this.shadeSettings) this.shadeSettings.addEventListener('click', () => this.openSettings());

        // Mail icon click to open notes viewer
        if (this.statusMail) {
            this.statusMail.addEventListener('click', () => this.openNotesViewer());
        }

        // Sidebar toggle and buttons
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        if (this.sidebarSave) this.sidebarSave.addEventListener('click', () => this.quickSave());
        if (this.sidebarLoad) this.sidebarLoad.addEventListener('click', () => this.quickLoad());
        if (this.sidebarFullscreen) this.sidebarFullscreen.addEventListener('click', () => this.toggleFullscreen());
        if (this.sidebarExit) this.sidebarExit.addEventListener('click', () => this.returnToMenu());
        if (this.sidebarSettings) this.sidebarSettings.addEventListener('click', () => this.openSettings());

        // Click outside sidebar to close
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                if (this.isSidebarOpen) {
                    this.toggleSidebar();
                } else {
                    this.hideShade();
                }
            });
        }

        console.log('✅ Event listeners setup');
    }

    // ========================================
    // STATUS BAR UPDATES
    // ========================================

    /**
     * Update the status bar with current game state
     * Updates route, notes count, tether level, and mail icon
     * Called reactively when state changes
     * 
     * @example
     * // Manually refresh status bar
     * notificationShade.updateStatusBar();
     */
    updateStatusBar() {
        if (!this.statusBar) return;

        // Update loop version - v.848 is the canonical "source" version
        // The shade shows the actual attempt count
        if (this.statusLoop) {
            this.statusLoop.textContent = 'v.848';
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

        // Update tether (Tori route only) - Lightning bolt with fill
        if (this.statusTether) {
            const isTori = this.isToriRoute();
            console.log(`🔋 Tether update: isToriRoute=${isTori}, statusTether exists=${!!this.statusTether}`);

            if (isTori) {
                const tetherLevel = this.getTetherLevel();
                console.log(`🔋 Tether level: ${tetherLevel}%, statusTetherValue exists=${!!this.statusTetherValue}, tetherFill exists=${!!this.tetherFill}`);

                // Show tether meter (use style.display to override inline style)
                this.statusTether.style.display = 'flex';

                // Update percentage text
                if (this.statusTetherValue) {
                    const newText = `${Math.round(tetherLevel)}%`;
                    console.log(`📝 Setting tether text: "${this.statusTetherValue.textContent}" → "${newText}"`);
                    this.statusTetherValue.textContent = newText;
                }

                // Update lightning bolt fill height
                if (this.tetherFill) {
                    const newHeight = `${tetherLevel}%`;
                    console.log(`📏 Setting fill height: "${/** @type {HTMLElement} */(this.tetherFill).style.height}" → "${newHeight}"`);
                    /** @type {HTMLElement} */(this.tetherFill).style.height = newHeight;
                }

                // Apply state classes
                this.statusTether.classList.remove('warning', 'critical');
                if (tetherLevel < 20) {
                    this.statusTether.classList.add('critical');
                } else if (tetherLevel < 50) {
                    this.statusTether.classList.add('warning');
                }
            } else {
                this.statusTether.style.display = 'none';
            }
        }

        // Update mail icon (unread notes)
        this.updateMailIcon();
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
        // Use route's collectibles manager
        const cm = this.game.currentRoute?.collectiblesManager;
        if (!cm) {
            console.log('📊 Status bar: No collectibles manager found');
            return 0;
        }
        const count = cm.getCollectedCountForCurrentRoute();
        console.log(`📊 Status bar notes collected: ${count}`);
        return count || 0;
    }

    getTotalNotes() {
        // Use route's collectibles manager
        const cm = this.game.currentRoute?.collectiblesManager;
        if (!cm) {
            // No collectibles manager - check route class name for default
            const routeName = this.game.currentRoute?.constructor?.name || '';
            if (routeName.includes('Ronnie')) {
                console.log('📊 Status bar: Ronnie route, no CM, default 13');
                return 13; // Ronnie's total
            }
            console.log('📊 Status bar: No CM, default 16 (Tori)');
            return 16; // Default for Tori route
        }
        const total = cm.getTotalCountForCurrentRoute();
        console.log(`📊 Status bar total notes: ${total}`);
        // Return appropriate default if method returns 0 or undefined
        if (!total || total === 0) {
            const routeName = this.game.currentRoute?.name || '';
            if (routeName === 'ronnie') {
                return 13;
            }
            return 16;
        }
        return total;
    }

    getTetherLevel() {
        // Get from StateManager (reactive source of truth)
        if (this.game.state) {
            return this.game.state.get('tether.level') || 100;
        }
        // Fallback
        if (this.game.tetherSystem) {
            return this.game.tetherSystem.tetherLevel || 100;
        }
        return 100;
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

        // Apply route theming
        if (this.shade) {
            this.applyRouteTheming(this.shade);
        }

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

        // Pause tether decay (Tori route)
        if (this.game.tetherSystem && this.game.tetherSystem.stopDecay) {
            this.game.tetherSystem.stopDecay();
        }

        // Prevent status bar auto-hide
        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        // Haptic feedback
        this.triggerHaptic('medium');

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

        // Resume tether decay (Tori route)
        if (this.game.tetherSystem && this.game.tetherSystem.startDecay) {
            this.game.tetherSystem.startDecay();
        }

        // Reset idle timer
        this.resetIdleTimer();

        // Haptic feedback
        this.triggerHaptic('light');

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
                const tetherLevel = this.getTetherLevel();
                this.shadeTetherValue.textContent = `${Math.round(tetherLevel)}%`;

                // Critical state styling
                if (tetherLevel < 20) {
                    this.shadeTetherValue.classList.add('critical');
                } else {
                    this.shadeTetherValue.classList.remove('critical');
                }
            } else {
                this.shadeTetherItem.style.display = 'none';
            }
        }
    }

    // ========================================
    // SWIPE GESTURE DETECTION
    // ========================================

    /**
     * @param {TouchEvent} e
     */
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    /**
     * @param {TouchEvent} e
     */
    handleTouchMove(e) {
        if (!this.touchStartY) return;

        const touchY = e.touches[0].clientY;
        const deltaY = touchY - this.touchStartY;

        // Check if we're on desktop (sidebar) or mobile (shade)
        const isDesktop = window.innerWidth >= 769;

        // Swipe down from top 50px (including status bar)
        if (this.touchStartY < 50 && deltaY > 50) {
            // Only preventDefault if we're in the valid swipe zone
            if (e.cancelable) {
                e.preventDefault();
            }

            // Open sidebar on desktop, shade on mobile
            if (isDesktop && !this.isSidebarOpen) {
                this.showSidebar();
            } else if (!isDesktop && !this.isShadeOpen) {
                this.showShade();
            }
        }

        // Swipe up to close (works for both)
        if (deltaY < -50) {
            if (e.cancelable) {
                e.preventDefault();
            }

            if (this.isShadeOpen) {
                this.hideShade();
            } else if (this.isSidebarOpen) {
                this.hideSidebar();
            }
        }
    }

    /**
     * @param {TouchEvent} e
     */
    handleTouchEnd(e) {
        this.touchStartY = 0;
        this.touchStartX = 0;
    }

    // ========================================
    // SIDEBAR CONTROL (Desktop)
    // ========================================

    toggleSidebar() {
        if (this.isSidebarOpen) {
            this.hideSidebar();
        } else {
            this.showSidebar();
        }
    }

    showSidebar() {
        if (this.isSidebarOpen) return;

        this.isSidebarOpen = true;

        // Update sidebar content
        this.updateSidebarContent();

        // Update note preview (sets up click handlers)
        this.updateNotePreview();

        // Apply route theming
        if (this.sidebar) {
            this.applyRouteTheming(this.sidebar);
        }

        // Show sidebar and backdrop
        if (this.sidebar) {
            this.sidebar.classList.add('visible'); // Enable opacity/pointer-events
            this.sidebar.classList.add('expanded'); // Slide in
        }
        if (this.backdrop) {
            this.backdrop.classList.add('visible');
        }

        // Pause game
        if (this.game.isPaused !== undefined) {
            this.game.isPaused = true;
        }

        // Pause tether decay (Tori route)
        const tetherSystem = this.game.currentRoute?.tetherSystem;
        if (tetherSystem && tetherSystem.stopDecay) {
            tetherSystem.stopDecay();
        }

        // Prevent status bar auto-hide
        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        // Haptic feedback
        this.triggerHaptic('medium');

        console.log('💻 Sidebar opened');
    }

    hideSidebar() {
        if (!this.isSidebarOpen) return;

        this.isSidebarOpen = false;

        // Hide sidebar and backdrop
        if (this.sidebar) {
            this.sidebar.classList.remove('expanded');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
        }

        // Resume game
        if (this.game.isPaused !== undefined) {
            this.game.isPaused = false;
        }

        // Resume tether decay (Tori route)
        const tetherSystem = this.game.currentRoute?.tetherSystem;
        if (tetherSystem && tetherSystem.startDecay) {
            tetherSystem.startDecay();
        }

        // Reset idle timer
        this.resetIdleTimer();

        // Haptic feedback
        this.triggerHaptic('light');

        console.log('💻 Sidebar closed');
    }

    updateSidebarContent() {
        // Update route
        if (this.sidebarRoute) {
            this.sidebarRoute.textContent = this.getRouteName();
        }

        // Update loop
        if (this.sidebarLoop) {
            this.sidebarLoop.textContent = this.game.loopVersion || 848;
        }

        // Update notes
        if (this.sidebarNotes) {
            const collected = this.getNotesCollected();
            const total = this.getTotalNotes();
            this.sidebarNotes.textContent = `${collected}/${total}`;
        }

        // Update tether (Tori route only)
        if (this.sidebarTetherItem && this.sidebarTetherValue) {
            if (this.isToriRoute()) {
                this.sidebarTetherItem.style.display = 'flex';
                const tetherLevel = this.getTetherLevel();
                this.sidebarTetherValue.textContent = `${Math.round(tetherLevel)}%`;

                // Critical state styling
                if (tetherLevel < 20) {
                    this.sidebarTetherValue.classList.add('critical');
                } else {
                    this.sidebarTetherValue.classList.remove('critical');
                }
            } else {
                this.sidebarTetherItem.style.display = 'none';
            }
        }
    }

    // ========================================
    // ROUTE THEMING
    // ========================================

    /**
     * @param {HTMLElement|null} element
     */
    applyRouteTheming(element) {
        if (!element) return;

        // Remove existing route classes
        element.classList.remove('ronnie-route', 'tori-route');

        // Apply current route class
        const routeName = this.getRouteName();
        if (routeName.includes('Ronnie')) {
            element.classList.add('ronnie-route');
        } else if (routeName.includes('Tori')) {
            element.classList.add('tori-route');
        }
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    triggerHaptic(type = 'light') {
        // Check if Vibration API is supported
        if (!navigator.vibrate) return;

        // Haptic patterns
        const patterns = {
            light: 10,      // Quick tap
            medium: 20,     // Button press
            heavy: [30, 10, 30], // Double pulse
            success: [10, 50, 10], // Success pattern
        };

        // @ts-ignore - Dynamic key access
        const pattern = patterns[type] || patterns.light;

        // Try to vibrate, but don't throw if blocked by browser
        try {
            navigator.vibrate(pattern);
        } catch (error) {
            // Silently fail - vibration blocked until user interaction
        }
    }

    // ========================================
    // ANIMATIONS
    // ========================================

    pulseLoopNumber() {
        if (this.statusLoop) {
            this.statusLoop.classList.add('pulse');
            setTimeout(() => {
                this.statusLoop?.classList.remove('pulse');
            }, 600);
        }
    }

    glitchLoopNumber() {
        if (this.statusLoop && this.statusBar?.classList.contains('ronnie-route')) {
            this.statusLoop.classList.add('glitch');
            setTimeout(() => {
                this.statusLoop?.classList.remove('glitch');
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
            /** @type {HTMLElement} */(loadingFill).style.width = `${progress}%`;
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

    /**
     * @param {KeyboardEvent} e
     */
    handleKeyboardShortcut(e) {
        // Don't trigger if typing in input
        const target = /** @type {HTMLElement} */(e.target);
        if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'escape':
                // Toggle sidebar (desktop) or shade (mobile)
                if (this.isSidebarOpen) {
                    this.hideSidebar();
                } else if (this.isShadeOpen) {
                    this.hideShade();
                } else {
                    // Check if we're on desktop (sidebar visible) or mobile (shade visible)
                    const isDesktop = window.innerWidth >= 769;
                    if (isDesktop) {
                        this.showSidebar();
                    } else {
                        this.showShade();
                    }
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
        this.triggerHaptic('success');
        this.hideSidebar();
        this.hideShade();
        if (this.game.saveManager) {
            this.game.saveManager.saveGame(1, false, 'Quick Save');
            console.log('💾 Quick save');
        }
    }

    quickLoad() {
        this.triggerHaptic('medium');
        this.hideSidebar();
        this.hideShade();
        if (this.game.saveLoadUI) {
            this.game.saveLoadUI.showSaveLoadScreen('load');
            console.log('📂 Load menu opened');
        }
    }

    toggleFullscreen() {
        this.triggerHaptic('medium');
        this.hideSidebar();
        this.hideShade();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            console.log('⛶ Fullscreen enabled');
        } else {
            document.exitFullscreen();
            console.log('⛶ Fullscreen disabled');
        }
    }

    returnToMenu() {
        this.hideSidebar();
        this.hideShade();
        // Use overlay confirmation instead of browser alert
        this.showConfirmation({
            title: 'Return to Main Menu?',
            message: 'Unsaved progress will be lost.',
            confirmText: 'Return to Menu',
            cancelText: 'Stay Here',
            onConfirm: () => {
                this.game.showMainMenu();
                console.log('🚪 Returned to menu');
            }
        });
    }

    openSettings() {
        this.hideSidebar();
        this.hideShade();
        // Use GameEngine's showSettings method
        if (this.game.showSettings) {
            this.game.showSettings();
            console.log('⚙️ Settings opened');
        } else {
            console.warn('Settings not available');
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
        if (this.statusBar?.classList.contains('ronnie-route')) {
            this.glitchLoopNumber();
        }
    }

    // ========================================
    // PHASE 5: ADDITIONAL FEATURES
    // ========================================

    // Screenshot Mode - Hide all UI
    toggleScreenshotMode() {
        this.screenshotMode = !this.screenshotMode;

        if (this.screenshotMode) {
            // Hide all UI elements
            if (this.statusBar) this.statusBar.style.display = 'none';
            if (this.sidebar) this.sidebar.style.display = 'none';
            if (this.sidebarToggle) this.sidebarToggle.style.display = 'none';
            if (this.shade) this.shade.style.display = 'none';
            console.log('📸 Screenshot mode: ON');
        } else {
            // Restore UI elements
            if (this.statusBar) this.statusBar.style.display = '';
            if (this.sidebar) this.sidebar.style.display = '';
            if (this.sidebarToggle) this.sidebarToggle.style.display = '';
            if (this.shade) this.shade.style.display = '';
            console.log('📸 Screenshot mode: OFF');
        }

        // Save state
        this.savePersistentState();
    }

    // Loading State Integration
    showLoadingInStatusBar(message = 'Loading...', progress = 0) {
        if (!this.statusBar) return;

        this.statusBar.classList.add('loading');

        const loadingSpan = this.statusLoading?.querySelector('span');
        if (loadingSpan) {
            loadingSpan.textContent = message;
        }

        const loadingFill = this.statusLoading?.querySelector('.loading-fill');
        if (loadingFill) {
            /** @type {HTMLElement} */(loadingFill).style.width = `${progress}%`;
        }
    }

    hideLoadingInStatusBar() {
        if (!this.statusBar) return;
        this.statusBar.classList.remove('loading');
        this.updateStatusBar();
    }

    // Persistent State (localStorage)
    loadPersistentState() {
        try {
            const saved = localStorage.getItem('notificationShadeState');
            if (saved) {
                const state = JSON.parse(saved);
                this.screenshotMode = state.screenshotMode || false;
                this.idleDelay = state.idleDelay || 3000;
                console.log('💾 Loaded notification shade state');
            }
        } catch (error) {
            console.warn('Failed to load notification shade state:', error);
        }
    }

    savePersistentState() {
        try {
            const state = {
                screenshotMode: this.screenshotMode,
                idleDelay: this.idleDelay,
                timestamp: Date.now()
            };
            localStorage.setItem('notificationShadeState', JSON.stringify(state));
            console.log('💾 Saved notification shade state');
        } catch (error) {
            console.warn('Failed to save notification shade state:', error);
        }
    }

    // Emergency Fallback - Show hamburger menu if system fails
    showEmergencyFallback() {
        // Create emergency menu button if it doesn't exist
        let emergencyBtn = document.getElementById('emergency-menu-btn');

        if (!emergencyBtn) {
            emergencyBtn = document.createElement('button');
            emergencyBtn.id = 'emergency-menu-btn';
            emergencyBtn.innerHTML = '☰';
            emergencyBtn.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 50px;
                height: 50px;
                background: rgba(255, 0, 0, 0.8);
                border: 2px solid #fff;
                border-radius: 50%;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            emergencyBtn.addEventListener('click', () => {
                if (this.game.settingsManager) {
                    this.game.settingsManager.showSettingsMenu();
                }
            });
            document.body.appendChild(emergencyBtn);
        }

        emergencyBtn.style.display = 'flex';
        console.warn('🚨 Emergency fallback menu activated');
    }

    hideEmergencyFallback() {
        const emergencyBtn = document.getElementById('emergency-menu-btn');
        if (emergencyBtn) {
            emergencyBtn.style.display = 'none';
        }
    }

    // ========================================
    // EMAIL-STYLE NOTES SYSTEM
    // ========================================

    updateMailIcon() {
        if (!this.statusMail || !this.unreadBadge) return;

        const unreadCount = this.unreadNotes.length;
        const wasHidden = !this.statusMail.classList.contains('visible');

        if (unreadCount > 0) {
            this.statusMail.classList.add('visible');
            this.statusMail.style.display = 'flex'; // Override inline style="display:none"
            this.unreadBadge.textContent = String(unreadCount);

            // Trigger tutorial when mail icon first shown
            if (wasHidden && this.game?.tutorialManager) {
                // Wait for code rain transition to finish (~1.5s) before showing tutorial
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        this.game.tutorialManager.showHandGesture('tori_first_note', this.statusMail, {
                            text: 'Check your notes!',
                            autoHide: 4000
                        });
                    }, 1500);
                });
            }
        } else {
            this.statusMail.classList.remove('visible');
            this.statusMail.style.display = 'none';
        }
    }

    /**
     * @param {{id: string, title: string, content: string}} noteData
     */
    addUnreadNote(noteData) {
        // Add to unread notes if not already there
        const exists = this.unreadNotes.find(n => n.id === noteData.id);
        if (!exists) {
            this.unreadNotes.push(noteData);
            this.updateMailIcon();
            this.updateNotePreview();
        }
    }

    /**
     * @param {string} noteId
     */
    markNoteAsRead(noteId) {
        this.unreadNotes = this.unreadNotes.filter(n => n.id !== noteId);
        this.updateMailIcon();
        this.updateNotePreview();
    }

    updateNotePreview() {
        // Get most recent unread note
        const latestNote = this.unreadNotes[this.unreadNotes.length - 1];

        if (latestNote) {
            this.currentNotePreview = latestNote;

            // Update shade preview
            if (this.notesPreviewSection) {
                this.notesPreviewSection.style.display = 'block';
                if (this.noteTitle) this.noteTitle.textContent = latestNote.title || 'Untitled Note';
                if (this.noteSnippet) this.noteSnippet.textContent = this.generateSnippet(latestNote.content);
            }

            // Update sidebar preview
            if (this.sidebarNotesPreviewSection) {
                this.sidebarNotesPreviewSection.style.display = 'block';
                if (this.sidebarNoteTitle) this.sidebarNoteTitle.textContent = latestNote.title || 'Untitled Note';
                if (this.sidebarNoteSnippet) this.sidebarNoteSnippet.textContent = this.generateSnippet(latestNote.content);
            }

            // Setup click handlers
            this.setupNotePreviewHandlers();
        } else {
            // Hide previews if no unread notes
            if (this.notesPreviewSection) this.notesPreviewSection.style.display = 'none';
            if (this.sidebarNotesPreviewSection) this.sidebarNotesPreviewSection.style.display = 'none';
        }
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    generateSnippet(content) {
        if (!content) return 'No preview available';

        // Remove HTML tags and get first 2 lines
        const plainText = content.replace(/<[^>]*>/g, '');
        const lines = plainText.split('\n').filter(/** @param {string} line */ line => line.trim());
        const snippet = lines.slice(0, 2).join(' ');

        // Truncate if too long
        return snippet.length > 100 ? snippet.substring(0, 97) + '...' : snippet;
    }

    setupNotePreviewHandlers() {
        // Remove old listeners
        if (this.notePreviewBtn) {
            const newBtn = /** @type {HTMLElement} */(this.notePreviewBtn.cloneNode(true));
            this.notePreviewBtn.replaceWith(newBtn);
            this.notePreviewBtn = newBtn;

            // Click handler
            this.notePreviewBtn?.addEventListener('click', () => this.openNotesViewer());

            // Swipe gesture (mobile)
            this.setupSwipeGesture(this.notePreviewBtn);
        }

        if (this.sidebarNotePreviewBtn) {
            const newBtn = /** @type {HTMLElement} */(this.sidebarNotePreviewBtn.cloneNode(true));
            this.sidebarNotePreviewBtn.replaceWith(newBtn);
            this.sidebarNotePreviewBtn = newBtn;

            // Click handler
            this.sidebarNotePreviewBtn?.addEventListener('click', () => this.openNotesViewer());

            // Swipe gesture (mobile)
            this.setupSwipeGesture(this.sidebarNotePreviewBtn);
        }
    }

    /**
     * @param {HTMLElement} element
     */
    setupSwipeGesture(element) {
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;

        element.addEventListener('touchstart', (/** @type {TouchEvent} */ e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            element.classList.add('swiping');
        }, { passive: true });

        element.addEventListener('touchmove', (/** @type {TouchEvent} */ e) => {
            if (!isSwiping) return;
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;

            // Visual feedback
            if (Math.abs(deltaX) > 50) {
                element.classList.add(deltaX > 0 ? 'swipe-right' : 'swipe-left');
            }
        }, { passive: true });

        element.addEventListener('touchend', () => {
            if (!isSwiping) return;

            const deltaX = currentX - startX;

            // Mark as read if swiped far enough
            if (Math.abs(deltaX) > 100 && this.currentNotePreview) {
                this.triggerHaptic('medium');
                this.markNoteAsRead(this.currentNotePreview.id);
            }

            // Reset
            element.classList.remove('swiping', 'swipe-left', 'swipe-right');
            isSwiping = false;
            startX = 0;
            currentX = 0;
        }, { passive: true });
    }

    openNotesViewer() {
        // Close shade/sidebar
        this.hideShade();
        this.hideSidebar();

        // Open notes viewer via collectibles manager (route-specific)
        const cm = this.game.currentRoute?.collectiblesManager;

        if (cm && cm.showNotesViewer) {
            cm.showNotesViewer();
            this.triggerHaptic('medium');
        } else {
            console.warn('Notes viewer not available (no collectibles manager on current route)');
        }
    }

    /**
     * Public API for game to notify about collected notes
     * Adds note to unread list and updates UI
     * 
     * @param {Object} noteData - Note information
     * @param {string} noteData.id - Unique note ID
     * @param {string} noteData.title - Note title
     * @param {string} noteData.content - Note content
     * 
     * @example
     * // Called when player collects a note
     * notificationShade.onNoteCollected({
     *   id: 'z1',
     *   title: 'Strange Message',
     *   content: 'Something feels off...'
     * });
     */
    // Public API for game to add notes
    onNoteCollected(noteData) {
        this.addUnreadNote({
            id: String(noteData.id || Date.now()),
            title: noteData.title || 'New Note',
            content: noteData.content || ''
        });
    }

    // ========================================
    // CONFIRMATION OVERLAY
    // ========================================

    /**
     * Show a custom confirmation dialog overlay
     * Replaces browser confirm() with styled modal
     * 
     * @param {Object} options - Dialog configuration
     * @param {string} options.title - Dialog title
     * @param {string} options.message - Dialog message
     * @param {string} [options.confirmText='Confirm'] - Confirm button text
     * @param {string} [options.cancelText='Cancel'] - Cancel button text
     * @param {Function} [options.onConfirm] - Callback when confirmed
     * @param {Function} [options.onCancel] - Callback when cancelled
     * 
     * @example
     * // Confirm return to main menu
     * notificationShade.showConfirmation({
     *   title: 'Return to Main Menu?',
     *   message: 'Unsaved progress will be lost.',
     *   confirmText: 'Return',
     *   cancelText: 'Stay',
     *   onConfirm: () => game.showMainMenu()
     * });
     */
    showConfirmation({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'confirmation-overlay';
        overlay.innerHTML = `
            <div class="confirmation-dialog">
                <h2 class="confirmation-title">${title}</h2>
                <p class="confirmation-message">${message}</p>
                <div class="confirmation-buttons">
                    <button class="confirmation-cancel">${cancelText}</button>
                    <button class="confirmation-confirm">${confirmText}</button>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(overlay);

        // Get buttons
        const confirmBtn = overlay.querySelector('.confirmation-confirm');
        const cancelBtn = overlay.querySelector('.confirmation-cancel');

        // Handle confirm
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                overlay.remove();
                this.triggerHaptic('medium');
            });
        }

        // Handle cancel
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (onCancel) onCancel();
                overlay.remove();
                this.triggerHaptic('light');
            });
        }

        // Handle backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (onCancel) onCancel();
                overlay.remove();
                this.triggerHaptic('light');
            }
        });

        // Show overlay with animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore - Assigning to window object
    window.NotificationShadeController = NotificationShadeController;
}

// ES Module export
export { NotificationShadeController };
