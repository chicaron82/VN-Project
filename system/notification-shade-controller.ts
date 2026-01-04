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

interface NoteData {
    id: string;
    title: string;
    content: string;
}

interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export class NotificationShadeController {
    private game: any;
    private isShadeOpen = false;
    private isSidebarOpen = false;
    private idleTimer: number | null = null;
    private idleDelay = 3000;
    private screenshotMode = false;
    private touchStartY = 0;
    private _touchStartX = 0; // Reserved for future horizontal swipe detection
    private unreadNotes: NoteData[] = [];
    private currentNotePreview: NoteData | null = null;

    // Expandable quick actions
    private quickActions: any = null;

    // Orientation change handling
    private orientationMediaQuery: MediaQueryList | null = null;
    private handleOrientationChange: ((e: MediaQueryListEvent) => void) | null = null;

    // DOM - Status bar
    private statusBar: HTMLElement | null = null;
    private statusLoop: HTMLElement | null = null;
    private statusRoute: HTMLElement | null = null;
    private statusProgress: HTMLElement | null = null;
    private statusTether: HTMLElement | null = null;
    private statusTetherValue: HTMLElement | null = null;
    private statusLoading: HTMLElement | null = null;

    // DOM - Notification shade
    private shade: HTMLElement | null = null;
    private backdrop: HTMLElement | null = null;
    private shadeSave: HTMLElement | null = null;
    private shadeLoad: HTMLElement | null = null;
    private shadeFullscreen: HTMLElement | null = null;
    private shadeExit: HTMLElement | null = null;
    private shadeRoute: HTMLElement | null = null;
    private shadeLoop: HTMLElement | null = null;
    private shadeNotes: HTMLElement | null = null;
    private shadeTetherItem: HTMLElement | null = null;
    private shadeTetherValue: HTMLElement | null = null;
    private shadeSettings: HTMLElement | null = null;

    // DOM - Sidebar
    private sidebar: HTMLElement | null = null;
    private sidebarToggle: HTMLElement | null = null;
    private sidebarSave: HTMLElement | null = null;
    private sidebarLoad: HTMLElement | null = null;
    private sidebarFullscreen: HTMLElement | null = null;
    private sidebarExit: HTMLElement | null = null;
    private sidebarSettings: HTMLElement | null = null;
    private sidebarRoute: HTMLElement | null = null;
    private sidebarLoop: HTMLElement | null = null;
    private sidebarNotes: HTMLElement | null = null;
    private sidebarTetherItem: HTMLElement | null = null;
    private sidebarTetherValue: HTMLElement | null = null;

    // DOM - Tether & Mail
    private tetherFill: Element | null = null;
    private _tetherLightning: Element | null = null; // Reserved for lightning bolt animations
    private statusMail: HTMLElement | null = null;
    private _mailIcon: Element | null = null; // Reserved for mail icon animations
    private unreadBadge: Element | null = null;

    // DOM - Note preview
    private notesPreviewSection: HTMLElement | null = null;
    private notePreviewBtn: HTMLElement | null = null;
    private noteTitle: Element | null = null;
    private noteSnippet: Element | null = null;
    private sidebarNotesPreviewSection: HTMLElement | null = null;
    private sidebarNotePreviewBtn: HTMLElement | null = null;
    private sidebarNoteTitle: Element | null = null;
    private sidebarNoteSnippet: Element | null = null;

    // DOM - Sidebar layers (iOS-style depth)
    private sidebarLayers: HTMLElement | null = null;
    private primaryLayer: HTMLElement | null = null;
    private secondaryLayer: HTMLElement | null = null;

    // Layer swipe state
    private layerSwipeStartX = 0;
    private layerSwipeStartTime = 0;
    private isLayerDragging = false;
    private isToolsRevealed = false;

    constructor(game: any) {
        this.game = game;
        this.isShadeOpen = false;
        this.isSidebarOpen = false;
        this.idleTimer = null;
        this.idleDelay = 3000;
        this.screenshotMode = false;

        // Touch gesture tracking
        this.touchStartY = 0;
        this.touchStartX = 0;

        // Email-style notes tracking
        this.unreadNotes = [];
        this.currentNotePreview = null;

        // Load persistent state
        this.loadPersistentState();

        // Initialize
        this.initializeElements();
        this.setupEventListeners();
        this.updateStatusBar();

        // Subscribe to tether level changes for reactive lightning bolt updates
        if (this.game.state) {
            this.game.state.subscribe('tether.level', (newLevel: number, oldLevel: number) => {
                console.log(`⚡ Shade: Tether subscription ${oldLevel} → ${newLevel}`);
                this.updateStatusBar();
            });
        }

        // Initialize Expandable Quick Actions (MICHELIN EDITION)
        if (typeof (window as any).ExpandableQuickActions !== 'undefined') {
            this.quickActions = new (window as any).ExpandableQuickActions(this);
        } else {
            console.warn('ExpandableQuickActions not loaded');
        }

        // Initialize sidebar depth layer swipe (iOS-style)
        this.initSidebarLayerSwipe();

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

        // Tether lightning bolt
        this._tetherLightning = document.querySelector('.tether-lightning');
        this.tetherFill = document.querySelector('.tether-fill');
        this.statusTetherValue = document.getElementById('status-tether-value');

        // Mail icon with badge
        this.statusMail = document.getElementById('status-mail');
        this._mailIcon = document.querySelector('.mail-icon');
        this.unreadBadge = document.querySelector('.unread-badge');

        // Note preview (shade)
        this.notesPreviewSection = document.getElementById('notes-preview-section');
        this.notePreviewBtn = document.getElementById('note-preview-btn');
        this.noteTitle = this.notePreviewBtn?.querySelector('.note-title') || null;
        this.noteSnippet = this.notePreviewBtn?.querySelector('.note-snippet') || null;

        // Note preview (sidebar)
        this.sidebarNotesPreviewSection = document.getElementById('sidebar-notes-preview-section');
        this.sidebarNotePreviewBtn = document.getElementById('sidebar-note-preview-btn');
        this.sidebarNoteTitle = this.sidebarNotePreviewBtn?.querySelector('.note-title') || null;
        this.sidebarNoteSnippet = this.sidebarNotePreviewBtn?.querySelector('.note-snippet') || null;

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

        // Swipe gesture detection
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

        // Orientation change: Close sidebar when rotating to portrait
        this.orientationMediaQuery = window.matchMedia('(orientation: portrait)');
        this.handleOrientationChange = (e: MediaQueryListEvent) => {
            if (e.matches && this.isSidebarOpen) {
                console.log('📱 Orientation changed to portrait - closing sidebar');
                this.hideSidebar();
            }
        };
        this.orientationMediaQuery.addEventListener('change', this.handleOrientationChange);

        // Also handle resize for desktop testing
        window.addEventListener('resize', () => {
            const isPortrait = window.innerHeight > window.innerWidth;
            if (isPortrait && this.isSidebarOpen) {
                console.log('📱 Window resized to portrait - closing sidebar');
                this.hideSidebar();
            }
        });

        console.log('✅ Event listeners setup');
    }

    // ========================================
    // STATUS BAR UPDATES
    // ========================================

    updateStatusBar() {
        if (!this.statusBar) return;

        // Update loop version
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

        // Update progress (notes collected) - only show in routes
        if (this.statusProgress) {
            const routeName = this.getRouteName();
            const hideCounter = ['Menu', 'Prologue', 'Route Select', 'Epilogue'].includes(routeName);
            if (hideCounter) {
                this.statusProgress.style.display = 'none';
            } else {
                this.statusProgress.style.display = 'inline';
                const notesCollected = this.getNotesCollected();
                const totalNotes = this.getTotalNotes();
                this.statusProgress.textContent = `🖤 ${notesCollected}/${totalNotes}`;
            }
        }

        // Update tether (Tori route only)
        if (this.statusTether) {
            const isTori = this.isToriRoute();
            console.log(`🔋 Tether update: isToriRoute=${isTori}`);

            if (isTori) {
                const tetherLevel = this.getTetherLevel();
                console.log(`🔋 Tether level: ${tetherLevel}%`);

                this.statusTether.style.display = 'flex';

                if (this.statusTetherValue) {
                    this.statusTetherValue.textContent = `${Math.round(tetherLevel)}%`;
                }

                if (this.tetherFill) {
                    (this.tetherFill as HTMLElement).style.height = `${tetherLevel}%`;
                }

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

        this.updateMailIcon();
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    getRouteName(): string {
        // Check for route select screen
        const routeSelect = document.getElementById('route-select');
        if (routeSelect) {
            const computed = window.getComputedStyle(routeSelect);
            const isVisible = computed.display !== 'none' && parseFloat(computed.opacity) > 0;
            if (isVisible) {
                return 'Route Select';
            }
        }

        if (!this.game.currentRoute) return 'Menu';

        const routeClass = this.game.currentRoute.constructor.name;

        if (routeClass.includes('SharedPrologue') || routeClass === 'Prologue') return 'Prologue';
        if (routeClass.includes('Epilogue')) return 'Epilogue';
        if (routeClass.includes('Ronnie')) return 'Ronnie Route';
        if (routeClass.includes('Tori')) return 'Tori Route';

        return 'Route';
    }

    isToriRoute(): boolean {
        if (!this.game.currentRoute) return false;
        return this.game.currentRoute.constructor.name.includes('Tori');
    }

    getNotesCollected(): number {
        const cm = this.game.currentRoute?.collectiblesManager || this.game.collectiblesManager;
        if (!cm) return 0;
        return cm.getCollectedCountForCurrentRoute?.() || 0;
    }

    getTotalNotes(): number {
        const cm = this.game.currentRoute?.collectiblesManager || this.game.collectiblesManager;
        if (!cm) {
            const routeName = this.game.currentRoute?.constructor?.name || '';
            if (routeName.includes('Ronnie')) return 13;
            return 16;
        }
        const total = cm.getTotalCountForCurrentRoute?.() || 16;
        if (!total || total === 0) {
            const routeName = this.game.currentRoute?.name || '';
            if (routeName === 'ronnie') return 13;
            return 16;
        }
        return total;
    }

    getTetherLevel(): number {
        if (this.game.state) {
            return this.game.state.get('tether.level') || 100;
        }
        if (this.game.tetherSystem) {
            return this.game.tetherSystem.tetherLevel || 100;
        }
        return 100;
    }

    // ========================================
    // AUTO-HIDE FUNCTIONALITY
    // ========================================

    resetIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        this.idleTimer = setTimeout(() => {
            if (this.statusBar && !this.isShadeOpen && !this.isSidebarOpen) {
                this.statusBar.classList.add('idle');
            }
        }, this.idleDelay) as unknown as number;
    }

    // ========================================
    // NOTIFICATION SHADE CONTROL
    // ========================================

    showShade() {
        if (this.isShadeOpen) return;

        this.isShadeOpen = true;
        this.updateShadeContent();

        if (this.shade) {
            this.applyRouteTheming(this.shade);
            this.shade.classList.add('open');
        }
        if (this.backdrop) {
            this.backdrop.classList.add('visible');
        }

        if (this.game.isPaused !== undefined) {
            this.game.isPaused = true;
        }

        if (this.game.tetherSystem?.stopDecay) {
            this.game.tetherSystem.stopDecay();
        }

        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        this.triggerHaptic('medium');
        console.log('📱 Notification shade opened');
    }

    hideShade() {
        if (!this.isShadeOpen) return;

        this.isShadeOpen = false;

        if (this.shade) {
            this.shade.classList.remove('open');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
        }

        if (this.quickActions) {
            this.quickActions.collapse();
        }

        if (this.game.isPaused !== undefined) {
            this.game.isPaused = false;
        }

        if (this.game.tetherSystem?.startDecay) {
            this.game.tetherSystem.startDecay();
        }

        this.resetIdleTimer();
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
        if (this.shadeRoute) {
            this.shadeRoute.textContent = this.getRouteName();
        }

        if (this.shadeLoop) {
            this.shadeLoop.textContent = this.game.loopVersion || '848';
        }

        if (this.shadeNotes) {
            const collected = this.getNotesCollected();
            const total = this.getTotalNotes();
            this.shadeNotes.textContent = `${collected}/${total}`;
        }

        if (this.shadeTetherItem && this.shadeTetherValue) {
            if (this.isToriRoute()) {
                this.shadeTetherItem.style.display = 'flex';
                const tetherLevel = this.getTetherLevel();
                this.shadeTetherValue.textContent = `${Math.round(tetherLevel)}%`;

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

    handleTouchStart(e: TouchEvent) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e: TouchEvent) {
        if (!this.touchStartY) return;

        const touchY = e.touches[0].clientY;
        const deltaY = touchY - this.touchStartY;
        const isDesktop = window.innerWidth >= 769;

        if (this.touchStartY < 50 && deltaY > 50) {
            if (e.cancelable) e.preventDefault();

            if (isDesktop && !this.isSidebarOpen) {
                this.showSidebar();
            } else if (!isDesktop && !this.isShadeOpen) {
                this.showShade();
            }
        }

        if (deltaY < -50) {
            if (e.cancelable) e.preventDefault();

            if (this.isShadeOpen) {
                this.hideShade();
            } else if (this.isSidebarOpen) {
                this.hideSidebar();
            }
        }
    }

    handleTouchEnd(_e: TouchEvent) {
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
        this.updateSidebarContent();
        this.updateNotePreview();

        if (this.sidebar) {
            this.applyRouteTheming(this.sidebar);
            this.sidebar.classList.add('visible');
            this.sidebar.classList.add('expanded');
        }
        if (this.backdrop) {
            this.backdrop.classList.add('visible');
        }

        if (this.game.isPaused !== undefined) {
            this.game.isPaused = true;
        }

        const tetherSystem = this.game.currentRoute?.tetherSystem;
        if (tetherSystem?.stopDecay) {
            tetherSystem.stopDecay();
        }

        if (this.statusBar) {
            this.statusBar.classList.remove('idle');
        }

        this.triggerHaptic('medium');

        if (this.game.grabHandleRepositioner) {
            this.game.grabHandleRepositioner.updateTogglePositionForExpandedSidebar();
        }

        console.log('💻 Sidebar opened');
    }

    hideSidebar() {
        if (!this.isSidebarOpen) return;

        this.isSidebarOpen = false;

        if (this.sidebar) {
            this.sidebar.classList.remove('expanded');
        }
        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
        }

        if (this.game.isPaused !== undefined) {
            this.game.isPaused = false;
        }

        const tetherSystem = this.game.currentRoute?.tetherSystem;
        if (tetherSystem?.startDecay) {
            tetherSystem.startDecay();
        }

        this.resetIdleTimer();
        this.triggerHaptic('light');

        if (this.game.grabHandleRepositioner) {
            this.game.grabHandleRepositioner.applyPosition();
        }

        console.log('💻 Sidebar closed');
    }

    updateSidebarContent() {
        if (this.sidebarRoute) {
            this.sidebarRoute.textContent = this.getRouteName();
        }

        if (this.sidebarLoop) {
            this.sidebarLoop.textContent = this.game.loopVersion || '848';
        }

        if (this.sidebarNotes) {
            const collected = this.getNotesCollected();
            const total = this.getTotalNotes();
            this.sidebarNotes.textContent = `${collected}/${total}`;
        }

        if (this.sidebarTetherItem && this.sidebarTetherValue) {
            if (this.isToriRoute()) {
                this.sidebarTetherItem.style.display = 'flex';
                const tetherLevel = this.getTetherLevel();
                this.sidebarTetherValue.textContent = `${Math.round(tetherLevel)}%`;

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

    applyRouteTheming(element: HTMLElement | null) {
        if (!element) return;

        element.classList.remove('ronnie-route', 'tori-route');

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
        if (!navigator.vibrate) return;

        const patterns: { [key: string]: number | number[] } = {
            light: 10,
            medium: 20,
            heavy: [30, 10, 30],
            success: [10, 50, 10],
        };

        const pattern = patterns[type] || patterns.light;

        try {
            navigator.vibrate(pattern);
        } catch (error) {
            // Silently fail
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
            (loadingFill as HTMLElement).style.width = `${progress}%`;
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

    handleKeyboardShortcut(e: KeyboardEvent) {
        const target = e.target as HTMLElement;
        if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'escape':
                if (this.isSidebarOpen) {
                    this.hideSidebar();
                } else if (this.isShadeOpen) {
                    this.hideShade();
                } else {
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

    toggleScreenshotMode() {
        this.screenshotMode = !this.screenshotMode;

        if (this.screenshotMode) {
            if (this.statusBar) this.statusBar.style.display = 'none';
            if (this.sidebar) this.sidebar.style.display = 'none';
            if (this.sidebarToggle) this.sidebarToggle.style.display = 'none';
            if (this.shade) this.shade.style.display = 'none';
            console.log('📸 Screenshot mode: ON');
        } else {
            if (this.statusBar) this.statusBar.style.display = '';
            if (this.sidebar) this.sidebar.style.display = '';
            if (this.sidebarToggle) this.sidebarToggle.style.display = '';
            if (this.shade) this.shade.style.display = '';
            console.log('📸 Screenshot mode: OFF');
        }

        this.savePersistentState();
    }

    showLoadingInStatusBar(message = 'Loading...', progress = 0) {
        if (!this.statusBar) return;

        this.statusBar.classList.add('loading');

        const loadingSpan = this.statusLoading?.querySelector('span');
        if (loadingSpan) {
            loadingSpan.textContent = message;
        }

        const loadingFill = this.statusLoading?.querySelector('.loading-fill');
        if (loadingFill) {
            (loadingFill as HTMLElement).style.width = `${progress}%`;
        }
    }

    hideLoadingInStatusBar() {
        if (!this.statusBar) return;
        this.statusBar.classList.remove('loading');
        this.updateStatusBar();
    }

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

    showEmergencyFallback() {
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
            this.statusMail.style.display = 'flex';
            this.unreadBadge.textContent = String(unreadCount);

            if (wasHidden && this.game?.tutorialManager) {
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

    addUnreadNote(noteData: NoteData) {
        const exists = this.unreadNotes.find(n => n.id === noteData.id);
        if (!exists) {
            this.unreadNotes.push(noteData);
            this.updateMailIcon();
            this.updateNotePreview();
        }
    }

    markNoteAsRead(noteId: string) {
        this.unreadNotes = this.unreadNotes.filter(n => n.id !== noteId);
        this.updateMailIcon();
        this.updateNotePreview();
    }

    updateNotePreview() {
        const latestNote = this.unreadNotes[this.unreadNotes.length - 1];

        if (latestNote) {
            this.currentNotePreview = latestNote;

            if (this.notesPreviewSection) {
                this.notesPreviewSection.style.display = 'block';
                if (this.noteTitle) this.noteTitle.textContent = latestNote.title || 'Untitled Note';
                if (this.noteSnippet) this.noteSnippet.textContent = this.generateSnippet(latestNote.content);
            }

            if (this.sidebarNotesPreviewSection) {
                this.sidebarNotesPreviewSection.style.display = 'block';
                if (this.sidebarNoteTitle) this.sidebarNoteTitle.textContent = latestNote.title || 'Untitled Note';
                if (this.sidebarNoteSnippet) this.sidebarNoteSnippet.textContent = this.generateSnippet(latestNote.content);
            }

            this.setupNotePreviewHandlers();
        } else {
            if (this.notesPreviewSection) this.notesPreviewSection.style.display = 'none';
            if (this.sidebarNotesPreviewSection) this.sidebarNotesPreviewSection.style.display = 'none';
        }
    }

    generateSnippet(content: string): string {
        if (!content) return 'No preview available';

        const plainText = content.replace(/<[^>]*>/g, '');
        const lines = plainText.split('\n').filter((line: string) => line.trim());
        const snippet = lines.slice(0, 2).join(' ');

        return snippet.length > 100 ? snippet.substring(0, 97) + '...' : snippet;
    }

    setupNotePreviewHandlers() {
        if (this.notePreviewBtn) {
            const newBtn = this.notePreviewBtn.cloneNode(true) as HTMLElement;
            this.notePreviewBtn.replaceWith(newBtn);
            this.notePreviewBtn = newBtn;

            this.notePreviewBtn.addEventListener('click', () => this.openNotesViewer());
            this.setupSwipeGesture(this.notePreviewBtn);
        }

        if (this.sidebarNotePreviewBtn) {
            const newBtn = this.sidebarNotePreviewBtn.cloneNode(true) as HTMLElement;
            this.sidebarNotePreviewBtn.replaceWith(newBtn);
            this.sidebarNotePreviewBtn = newBtn;

            this.sidebarNotePreviewBtn.addEventListener('click', () => this.openNotesViewer());
            this.setupSwipeGesture(this.sidebarNotePreviewBtn);
        }
    }

    setupSwipeGesture(element: HTMLElement) {
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;

        element.addEventListener('touchstart', (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            element.classList.add('swiping');
        }, { passive: true });

        element.addEventListener('touchmove', (e: TouchEvent) => {
            if (!isSwiping) return;
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;

            if (Math.abs(deltaX) > 50) {
                element.classList.add(deltaX > 0 ? 'swipe-right' : 'swipe-left');
            }
        }, { passive: true });

        element.addEventListener('touchend', () => {
            if (!isSwiping) return;

            const deltaX = currentX - startX;

            if (Math.abs(deltaX) > 100 && this.currentNotePreview) {
                this.triggerHaptic('medium');
                this.markNoteAsRead(this.currentNotePreview.id);
            }

            element.classList.remove('swiping', 'swipe-left', 'swipe-right');
            isSwiping = false;
            startX = 0;
            currentX = 0;
        }, { passive: true });
    }

    openNotesViewer() {
        this.hideShade();
        this.hideSidebar();

        if (this.game && typeof this.game.openStandaloneNotes === 'function') {
            this.game.openStandaloneNotes();
            this.triggerHaptic('medium');
        } else {
            console.warn('Notes viewer not available (game.openStandaloneNotes not found)');
        }
    }

    onNoteCollected(noteData: any) {
        this.addUnreadNote({
            id: String(noteData.id || Date.now()),
            title: noteData.title || 'New Note',
            content: noteData.content || ''
        });
    }

    // ========================================
    // CONFIRMATION OVERLAY
    // ========================================

    showConfirmation({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: ConfirmationOptions) {
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

        document.body.appendChild(overlay);

        const confirmBtn = overlay.querySelector('.confirmation-confirm');
        const cancelBtn = overlay.querySelector('.confirmation-cancel');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                overlay.remove();
                this.triggerHaptic('medium');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (onCancel) onCancel();
                overlay.remove();
                this.triggerHaptic('light');
            });
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (onCancel) onCancel();
                overlay.remove();
                this.triggerHaptic('light');
            }
        });

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
    }

    // ========================================
    // SIDEBAR DEPTH LAYER SWIPE HANDLING
    // iOS-STYLE REVEAL ANIMATION
    // ========================================

    initSidebarLayerSwipe() {
        this.sidebarLayers = document.querySelector('.sidebar-layers');
        this.primaryLayer = document.querySelector('.primary-layer');
        this.secondaryLayer = document.querySelector('.secondary-layer');

        if (!this.sidebarLayers || !this.primaryLayer) {
            console.warn('⚠️ Sidebar layers not found');
            return;
        }

        this.layerSwipeStartX = 0;
        this.layerSwipeStartTime = 0;
        this.isLayerDragging = false;
        this.isToolsRevealed = false;

        this.primaryLayer.addEventListener('touchstart', (e) => this.handleLayerSwipeStart(e), { passive: false });
        this.primaryLayer.addEventListener('touchmove', (e) => this.handleLayerSwipeMove(e), { passive: false });
        this.primaryLayer.addEventListener('touchend', (e) => this.handleLayerSwipeEnd(e), { passive: false });

        this.secondaryLayer?.addEventListener('touchstart', (e) => this.handleLayerSwipeStart(e), { passive: false });
        this.secondaryLayer?.addEventListener('touchmove', (e) => this.handleLayerSwipeMove(e), { passive: false });
        this.secondaryLayer?.addEventListener('touchend', (e) => this.handleLayerSwipeEnd(e), { passive: false });

        this.sidebarLayers.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement)?.closest('.quick-action-btn') as HTMLElement;
            if (!btn) return;

            const action = btn.dataset.action;
            if (action) {
                this.handleLayerAction(action);
            }
        });

        console.log('✅ Sidebar layer swipe initialized');
    }

    handleLayerSwipeStart(e: TouchEvent) {
        const touch = e.touches[0];
        this.layerSwipeStartX = touch.clientX;
        this.layerSwipeStartTime = Date.now();
        this.isLayerDragging = true;

        this.sidebarLayers?.classList.add('dragging');
    }

    handleLayerSwipeMove(e: TouchEvent) {
        if (!this.isLayerDragging) return;

        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - (this.layerSwipeStartX || 0);

        e.preventDefault();

        if (this.primaryLayer) {
            const layerWidth = this.primaryLayer.offsetWidth || 200;

            if (this.isToolsRevealed) {
                const percent = Math.max(0, Math.min(85, 85 + (deltaX / layerWidth) * 85));
                this.primaryLayer.style.transform = `translateX(${percent}%)`;
            } else {
                const percent = Math.max(0, Math.min(85, (deltaX / layerWidth) * 85));
                this.primaryLayer.style.transform = `translateX(${percent}%)`;
            }
        }
    }

    handleLayerSwipeEnd(e: TouchEvent) {
        if (!this.isLayerDragging) return;

        this.isLayerDragging = false;
        this.sidebarLayers?.classList.remove('dragging');

        if (this.primaryLayer) {
            this.primaryLayer.style.transform = '';
        }

        const touch = e.changedTouches[0];
        if (!touch) return;
        const deltaX = touch.clientX - (this.layerSwipeStartX || 0);
        const deltaTime = Date.now() - (this.layerSwipeStartTime || 0);
        const velocity = deltaX / Math.max(deltaTime, 1);

        const threshold = 50;
        const velocityThreshold = 0.3;

        if (this.isToolsRevealed) {
            if (deltaX < -threshold || velocity < -velocityThreshold) {
                this.hideToolsLayer();
            }
        } else {
            if (deltaX > threshold || velocity > velocityThreshold) {
                this.revealToolsLayer();
            }
        }
    }

    revealToolsLayer() {
        if (!this.sidebarLayers) return;

        this.sidebarLayers.classList.add('tools-revealed');
        this.isToolsRevealed = true;
        this.triggerHaptic('medium');

        console.log('🔧 Tools layer revealed');
    }

    hideToolsLayer() {
        if (!this.sidebarLayers) return;

        this.sidebarLayers.classList.remove('tools-revealed');
        this.isToolsRevealed = false;
        this.triggerHaptic('light');

        console.log('⚡ Core layer restored');
    }

    handleLayerAction(action: string) {
        console.log(`🎯 Layer action: ${action}`);

        switch (action) {
            case 'save':
                this.quickSave();
                break;
            case 'load':
                this.quickLoad();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
            case 'exit':
                this.returnToMenu();
                break;
            case 'screenshot':
                this.game.toggleUI?.();
                this.hideSidebar();
                break;
            case 'notes':
                this.openNotesViewer();
                break;
            case 'settings':
                this.openSettings();
                break;
            case 'help':
                this.quickActions?.showHelp?.();
                break;
            default:
                console.warn(`Unknown layer action: ${action}`);
        }
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    (window as any).NotificationShadeController = NotificationShadeController;
}
