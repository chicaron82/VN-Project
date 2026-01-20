import { EventBus } from '@core/EventBus';

/**
 * NotificationShade - Mobile Quick Action Menu (V1 Parity Port)
 * 
 * Exact port of V1's notification shade with:
 * - V1's exact DOM structure and class names
 * - Two-stage expansion: Carousel (4 actions) → Full Grid (all actions)
 * - Landscape detection: Opens Sidebar on desktop, Shade on mobile
 * - Paged carousel with swipe navigation
 */
/**
 * DIZEE: Note preview interface for shade display
 */
interface NotePreview {
    id: string;
    title: string;
    sender: string;
    snippet: string;
}

export class NotificationShade {
    private eventBus: EventBus;
    private container: HTMLElement;
    private isOpen: boolean = false;
    private isExpanded: boolean = false;
    // DIZEE: Note preview state (V1 parity)
    private currentNotePreview: NotePreview | null = null;
    private notePreviewSection!: HTMLElement;
    private notePreviewTitle!: HTMLElement;
    private notePreviewSnippet!: HTMLElement;

    // V1 Parity: Persistent state (lines 1048-1075)
    private screenshotMode: boolean = false;
    private idleDelay: number = 3000;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = this.createDOM();
        document.body.appendChild(this.container);

        this.setupListeners();
        this.setupNotePreview();
        this.loadPersistentState();
    }

    /**
     * DIZEE: Set up note preview card handlers (V1 parity)
     */
    private setupNotePreview(): void {
        this.notePreviewSection = this.container.querySelector('#notes-preview-section') as HTMLElement;
        this.notePreviewTitle = this.container.querySelector('.note-title') as HTMLElement;
        this.notePreviewSnippet = this.container.querySelector('.note-snippet') as HTMLElement;

        // Click handler for note preview card
        const previewBtn = this.container.querySelector('#note-preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                if (this.currentNotePreview) {
                    // V1 Parity: Haptic feedback
                    if (navigator.vibrate) navigator.vibrate(20);
                    // Open notes and close shade
                    this.eventBus.emit('ui:notes:open', {});
                    this.close();
                }
            });

            // DIZEE: Swipe gesture for dismissing note preview (V1 parity)
            this.setupNoteSwipeGesture(previewBtn as HTMLElement);
        }
    }

    /**
     * DIZEE: Set up swipe gesture for dismissing notes (V1 parity)
     * Swipe left to dismiss, swipe right to open
     */
    private setupNoteSwipeGesture(element: HTMLElement): void {
        let touchStartX = 0;
        let touchStartY = 0;
        let currentTranslateX = 0;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            currentTranslateX = 0;
            element.style.transition = 'none';
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                currentTranslateX = deltaX;
                element.style.transform = `translateX(${deltaX}px)`;
                element.style.opacity = String(1 - Math.abs(deltaX) / 200);
            }
        }, { passive: true });

        element.addEventListener('touchend', () => {
            element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

            if (currentTranslateX < -100) {
                // Swipe left: Dismiss note preview
                element.style.transform = 'translateX(-100%)';
                element.style.opacity = '0';
                setTimeout(() => {
                    this.hideNotePreview();
                    element.style.transform = '';
                    element.style.opacity = '';
                }, 300);
                // V1 Parity: Haptic feedback
                if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
            } else if (currentTranslateX > 100) {
                // Swipe right: Open notes
                this.eventBus.emit('ui:notes:open', {});
                this.close();
            } else {
                // Reset position
                element.style.transform = '';
                element.style.opacity = '';
            }
        });
    }

    private createDOM(): HTMLElement {
        const div = document.createElement('div');
        div.id = 'notification-shade';
        div.className = 'notification-shade';

        // V1 Parity: Exact DOM structure from index.html lines 131-290
        div.innerHTML = `
            <div class="swipe-indicator"></div>

            <!-- Quick Actions - Expandable with Paging -->
            <div class="shade-section quick-actions-container">
                <div class="shade-section-header">
                    <div class="shade-section-title">Quick Actions</div>
                    <div class="expand-hint">⋯⋯</div>
                </div>

                <!-- Quick State: Paged carousel -->
                <div class="quick-actions-carousel">
                    <div class="quick-actions-track">
                        <!-- Page 1: Core Actions -->
                        <div class="quick-actions-page" data-page="0">
                            <button class="quick-action-btn" data-action="save">
                                <span class="quick-action-icon">💾</span>
                                <span>Save</span>
                            </button>
                            <button class="quick-action-btn" data-action="load">
                                <span class="quick-action-icon">📂</span>
                                <span>Load</span>
                            </button>
                            <button class="quick-action-btn" data-action="fullscreen">
                                <span class="quick-action-icon">⛶</span>
                                <span>Full</span>
                            </button>
                            <button class="quick-action-btn" data-action="exit">
                                <span class="quick-action-icon">🚪</span>
                                <span>Exit</span>
                            </button>
                        </div>

                        <!-- Page 2: Tools -->
                        <div class="quick-actions-page" data-page="1">
                            <button class="quick-action-btn" data-action="screenshot">
                                <span class="quick-action-icon">📸</span>
                                <span>Shot</span>
                            </button>
                            <button class="quick-action-btn" data-action="notes">
                                <span class="quick-action-icon">📝</span>
                                <span>Notes</span>
                            </button>
                            <button class="quick-action-btn" data-action="settings">
                                <span class="quick-action-icon">⚙️</span>
                                <span>Set</span>
                            </button>
                            <button class="quick-action-btn" data-action="help">
                                <span class="quick-action-icon">❓</span>
                                <span>Help</span>
                            </button>
                        </div>
                    </div>

                    <!-- Page indicators -->
                    <div class="quick-actions-dots">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                    </div>
                </div>

                <!-- Expanded State: Full grid -->
                <div class="quick-actions-expanded" style="display: none;">
                    <div class="expanded-header">
                        <span>All Actions</span>
                        <button class="edit-btn" id="shade-edit-actions">✏️</button>
                    </div>

                    <div class="expanded-grid">
                        <!-- Page 1 Group -->
                        <div class="expanded-group">
                            <div class="group-label">Default ⭐</div>
                            <div class="expanded-actions">
                                <button class="quick-action-btn" data-action="save">
                                    <span class="quick-action-icon">💾</span>
                                    <span>Save</span>
                                </button>
                                <button class="quick-action-btn" data-action="load">
                                    <span class="quick-action-icon">📂</span>
                                    <span>Load</span>
                                </button>
                                <button class="quick-action-btn" data-action="fullscreen">
                                    <span class="quick-action-icon">⛶</span>
                                    <span>Full</span>
                                </button>
                                <button class="quick-action-btn" data-action="exit">
                                    <span class="quick-action-icon">🚪</span>
                                    <span>Exit</span>
                                </button>
                            </div>
                        </div>

                        <!-- Page 2 Group -->
                        <div class="expanded-group">
                            <div class="group-label">Tools</div>
                            <div class="expanded-actions">
                                <button class="quick-action-btn" data-action="screenshot">
                                    <span class="quick-action-icon">📸</span>
                                    <span>Shot</span>
                                </button>
                                <button class="quick-action-btn" data-action="notes">
                                    <span class="quick-action-icon">📝</span>
                                    <span>Notes</span>
                                </button>
                                <button class="quick-action-btn" data-action="settings">
                                    <span class="quick-action-icon">⚙️</span>
                                    <span>Set</span>
                                </button>
                                <button class="quick-action-btn" data-action="help">
                                    <span class="quick-action-icon">❓</span>
                                    <span>Help</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Details -->
            <div class="shade-section">
                <div class="shade-section-title">Current Status</div>
                <div class="status-details">
                    <div class="status-detail-item">
                        <span class="status-detail-label">Route:</span>
                        <span class="status-detail-value" id="shade-route">Menu</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Loop Version:</span>
                        <span class="status-detail-value" id="shade-loop">848</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Notes Collected:</span>
                        <span class="status-detail-value" id="shade-notes">0/42</span>
                    </div>
                    <div class="status-detail-item" id="shade-tether-item" style="display: none;">
                        <span class="status-detail-label">Tether Level:</span>
                        <span class="status-detail-value" id="shade-tether-value">100%</span>
                    </div>
                </div>
            </div>

            <!-- Note Preview (Email-Style) -->
            <div class="shade-section" id="notes-preview-section" style="display: none;">
                <div class="shade-section-title">Unread Notes</div>
                <div class="note-preview-card" id="note-preview-btn">
                    <span class="note-icon">📝</span>
                    <div class="note-preview-content">
                        <div class="note-title">Note Title</div>
                        <div class="note-snippet">Preview text...</div>
                    </div>
                    <span class="note-arrow">→</span>
                </div>
            </div>

            <!-- UV7 Carrier-Style Footer -->
            <div class="shade-carrier-footer">
                <span class="carrier-logo">UV7</span>
                <span class="carrier-name">United Voices 7</span>
            </div>
        `;

        return div;
    }

    private setupListeners(): void {
        // Toggle event (for KeyboardController)
        this.eventBus.on('ui:shade:toggle', () => this.toggle());

        // V1 Parity: Keyboard shortcuts (lines 861-915)
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));

        // IMPROVEMENT OVER V1: Add touch listeners to entire shade for expansion gesture
        // V1 only listened on quick-actions-container, this makes it work anywhere on shade
        let shadeSwipeStartY = 0;
        let shadeSwipeStartTime = 0;

        this.container.addEventListener('touchstart', (e) => {
            if (!this.isOpen || this.isExpanded) return;
            const touch = e.touches[0];
            if (!touch) return;
            shadeSwipeStartY = touch.clientY;
            shadeSwipeStartTime = Date.now();
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            if (!this.isOpen || this.isExpanded) return;
            const touch = e.changedTouches[0];
            if (!touch) return;

            const deltaY = touch.clientY - shadeSwipeStartY;
            const deltaTime = Date.now() - shadeSwipeStartTime;
            const velocity = deltaY / Math.max(deltaTime, 1);

            // Detect downward swipe for expansion
            // Use either threshold (30px) OR velocity (0.3 px/ms) for responsiveness
            const meetsThreshold = deltaY > 30;
            const meetsVelocity = velocity > 0.3;
            const isQuickSwipe = deltaTime < 500;

            if (isQuickSwipe && (meetsThreshold || meetsVelocity)) {
                console.log('[NotificationShade] Swipe down detected on shade - expanding', {
                    deltaY,
                    velocity: velocity.toFixed(2),
                    method: meetsVelocity ? 'velocity' : 'threshold'
                });
                this.expand();
            }
        }, { passive: true });

        // V1 Parity: Listen to raw swipe_down events directly (like V1's handleTouchMove)
        // NotificationShade manages its own state and routing logic
        this.eventBus.on('input:swipe_down', () => {
            // V1 Parity: Check screen width to decide Sidebar vs Shade (V1 line 589)
            // TORI'S FIX: Explicit routing check
            if (window.innerWidth >= 768) {
                console.log('[NotificationShade] Desktop mode - opening sidebar');
                this.eventBus.emit('ui:sidebar:open', {});
                return;
            }

            // Mobile/Portrait → Handle shade state (V1 line 602 + ExpandableQuickActions line 265)
            if (!this.isOpen) {
                // First swipe: Open shade with carousel
                console.log('[NotificationShade] Opening shade (carousel)');
                this.open();
            } else if (!this.isExpanded) {
                // Second swipe: Expand to full grid
                console.log('[NotificationShade] Expanding to full grid');
                this.expand();
            }
            // If already expanded, do nothing (let swipe_up handle collapse)
        });

        // Swipe Up to collapse/close (V1 pattern)
        this.eventBus.on('input:swipe_up', () => {
            if (this.isExpanded) {
                this.collapse();
            } else if (this.isOpen) {
                this.close();
            }
        });

        // Horizontal swipe for carousel navigation (only when shade is open and NOT expanded)
        this.eventBus.on('input:swipe_left', () => {
            if (this.isOpen && !this.isExpanded) this.nextPage();
        });
        this.eventBus.on('input:swipe_right', () => {
            if (this.isOpen && !this.isExpanded) this.prevPage();
        });

        // Expand hint click
        const expandHint = this.container.querySelector('.expand-hint');
        if (expandHint) {
            expandHint.addEventListener('click', () => {
                if (!this.isExpanded) this.expand();
                else this.collapse();
            });
        }

        // Button actions (delegate to all quick-action-btn)
        this.container.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('.quick-action-btn');
            if (!btn) return;

            const action = (btn as HTMLElement).dataset.action;
            this.handleAction(action);
        });

        // Listen for route updates
        this.eventBus.on('ui:route_changed', (data: { route: string }) => {
            this.updateRouteDisplay(data.route);
        });

        // Listen for status updates
        this.eventBus.on('tether:change', (data) => {
            this.updateTetherDisplay(data.level);
        });

        this.eventBus.on('note:collected', (data) => {
            this.updateNotesDisplay(data.count);
        });
    }

    private handleAction(action: string | undefined): void {
        if (!action) return;

        // V1 Parity: Haptic feedback (20ms for actions)
        if (navigator.vibrate) navigator.vibrate(20);

        switch (action) {
            case 'screenshot':
                console.log('Screenshot action triggered');
                this.close();
                break;
            case 'notes':
                this.eventBus.emit('ui:notes:open', {});
                this.close();
                break;
            case 'help':
                // Placeholder
                break;
            case 'settings':
                this.eventBus.emit('ui:settings', {});
                this.close();
                break;
            case 'save':
                this.eventBus.emit('ui:save_menu', {});
                this.close();
                break;
            case 'load':
                this.eventBus.emit('ui:load_menu', {});
                this.close();
                break;
            case 'exit':
                this.eventBus.emit('ui:main_menu', {});
                this.close();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
        }
    }

    public open(): void {
        // V1 Parity: Simple open logic (V1 line 443-483)
        if (this.isOpen) return;

        this.isOpen = true;
        this.isExpanded = false; // Always start with carousel
        this.container.classList.add('visible');
        this.eventBus.emit('ui:shade:opened', {});

        // V1 Parity: Haptic feedback (V1 line 480)
        if (navigator.vibrate) navigator.vibrate(20);
    }

    public expand(): void {
        if (this.isExpanded) return;
        this.isExpanded = true;

        const carousel = this.container.querySelector('.quick-actions-carousel') as HTMLElement;
        const expandedView = this.container.querySelector('.quick-actions-expanded') as HTMLElement;

        if (carousel) carousel.style.display = 'none';
        if (expandedView) {
            expandedView.style.display = 'block';
            setTimeout(() => expandedView.classList.add('visible'), 10);
        }

        // V1 Parity: Haptic feedback on expand
        if (navigator.vibrate) navigator.vibrate(20);
    }

    public collapse(): void {
        if (!this.isExpanded) return;
        this.isExpanded = false;

        const carousel = this.container.querySelector('.quick-actions-carousel') as HTMLElement;
        const expandedView = this.container.querySelector('.quick-actions-expanded') as HTMLElement;

        if (expandedView) {
            expandedView.classList.remove('visible');
            setTimeout(() => {
                if (expandedView) expandedView.style.display = 'none';
            }, 300);
        }
        if (carousel) carousel.style.display = 'block';

        // V1 Parity: Haptic feedback on collapse
        if (navigator.vibrate) navigator.vibrate(10);
    }

    public close(): void {
        // V1 Parity: Reset state on close (V1 line 485-520)
        if (!this.isOpen) return;

        this.isOpen = false;
        this.isExpanded = false; // V1 line 498-501: calls quickActions.collapse()
        this.container.classList.remove('visible');
        this.eventBus.emit('ui:shade:closed', {});

        // V1 Parity: Haptic feedback (V1 line 517)
        if (navigator.vibrate) navigator.vibrate(10);
    }

    private nextPage(): void {
        this.setPage(1);
    }

    private prevPage(): void {
        this.setPage(0);
    }

    private setPage(pageIndex: number): void {
        const track = this.container.querySelector('.quick-actions-track') as HTMLElement;
        const dots = this.container.querySelectorAll('.quick-actions-dots .dot');

        if (track) {
            // this._currentQuickActionPage = pageIndex;
            // V1 uses percentage: -50% for page 1 (track is 200% wide, each page is 50%)
            track.style.transform = `translateX(-${pageIndex * 50}%)`;

            dots.forEach((dot, index) => {
                if (index === pageIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });

            // V1 Parity: Haptic feedback on page change
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }

    public toggle(): void {
        if (this.isOpen) this.close();
        else this.open();
    }

    private toggleFullscreen(): void {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.warn(err));
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
        this.close();
    }

    private updateRouteDisplay(route: string): void {
        const el = this.container.querySelector('#shade-route');
        if (el) el.textContent = route.toUpperCase();

        // Apply route theming
        this.container.classList.remove('ronnie-route', 'tori-route');
        if (route.includes('ronnie')) this.container.classList.add('ronnie-route');
        if (route.includes('tori')) this.container.classList.add('tori-route');

        // Toggle tether visibility
        const tetherRow = this.container.querySelector('#shade-tether-item') as HTMLElement;
        if (tetherRow) {
            tetherRow.style.display = route.includes('tori') ? 'flex' : 'none';
        }
    }

    private updateTetherDisplay(level: number): void {
        const el = this.container.querySelector('#shade-tether-value');
        if (el) {
            el.textContent = `${Math.round(level)}%`;
            if (level < 20) el.classList.add('critical');
            else el.classList.remove('critical');
        }
    }

    private updateNotesDisplay(count: number): void {
        const el = this.container.querySelector('#shade-notes');
        // TODO: Get total from config or state
        if (el) el.textContent = `${count}/??`;
    }

    // ========================================
    // DIZEE: NOTE PREVIEW MANAGEMENT (V1 Parity)
    // Email-style unread note preview in shade
    // ========================================

    /**
     * Show note preview card in shade
     * V1 Parity: notification-shade-controller.js updateNotePreview()
     */
    public showNotePreview(id: string, title: string, sender: string, snippet: string): void {
        this.currentNotePreview = { id, title, sender, snippet };

        if (this.notePreviewTitle) {
            this.notePreviewTitle.textContent = `${sender}: ${title}`;
        }
        if (this.notePreviewSnippet) {
            this.notePreviewSnippet.textContent = snippet.length > 50
                ? snippet.substring(0, 50) + '...'
                : snippet;
        }
        if (this.notePreviewSection) {
            this.notePreviewSection.style.display = 'block';
            // Animate in
            this.notePreviewSection.classList.add('visible');
        }

        console.log(`📝 Note preview shown: ${sender} - ${title}`);
    }

    /**
     * Hide note preview card
     */
    public hideNotePreview(): void {
        this.currentNotePreview = null;

        if (this.notePreviewSection) {
            this.notePreviewSection.classList.remove('visible');
            setTimeout(() => {
                if (!this.currentNotePreview) {
                    this.notePreviewSection.style.display = 'none';
                }
            }, 300);
        }

        console.log('📝 Note preview hidden');
    }

    /**
     * Check if note preview is showing
     */
    public hasNotePreview(): boolean {
        return this.currentNotePreview !== null;
    }

    /**
     * Get current note preview ID
     */
    public getCurrentNoteId(): string | null {
        return this.currentNotePreview?.id || null;
    }

    // ========================================
    // KEYBOARD SHORTCUTS
    // V1 Parity: notification-shade-controller.js lines 866-915
    // ========================================

    /**
     * Handle keyboard shortcuts
     * V1 Parity: Esc, Ctrl+S/L/F/M
     */
    private handleKeyboardShortcut(e: KeyboardEvent): void {
        // Don't trigger if typing in input
        const target = e.target as HTMLElement;
        if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'escape':
                // Toggle shade (mobile) or sidebar (desktop)
                if (this.isOpen) {
                    this.close();
                } else if (this.isExpanded) {
                    this.collapse();
                } else {
                    const isDesktop = window.innerWidth >= 769;
                    if (isDesktop) {
                        this.eventBus.emit('ui:sidebar:toggle', {});
                    } else {
                        this.open();
                    }
                }
                break;

            case 's':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    // Quick save
                    this.eventBus.emit('ui:save_menu', {});
                    this.close();
                    console.log('💾 Quick save (Ctrl+S)');
                }
                break;

            case 'l':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    // Quick load
                    this.eventBus.emit('ui:load_menu', {});
                    this.close();
                    console.log('📂 Load menu (Ctrl+L)');
                }
                break;

            case 'f':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    // Toggle fullscreen
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => console.warn(err));
                        console.log('⛶ Fullscreen enabled (Ctrl+F)');
                    } else {
                        document.exitFullscreen();
                        console.log('⛶ Fullscreen disabled (Ctrl+F)');
                    }
                }
                break;

            case 'm':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    // Return to menu
                    this.eventBus.emit('ui:main_menu', {});
                    this.close();
                    console.log('🚪 Return to menu (Ctrl+M)');
                }
                break;
        }
    }

    // ========================================
    // PERSISTENT STATE (localStorage)
    // V1 Parity: notification-shade-controller.js lines 1048-1075
    // ========================================

    /**
     * Load persistent state from localStorage
     * V1 Parity: Screenshot mode, idle delay settings
     */
    private loadPersistentState(): void {
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

    /**
     * Save persistent state to localStorage
     * V1 Parity: Called when state changes
     */
    private savePersistentState(): void {
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

    /**
     * Toggle screenshot mode - hide all UI
     * V1 Parity: lines 1002-1023
     */
    public toggleScreenshotMode(): void {
        this.screenshotMode = !this.screenshotMode;

        if (this.screenshotMode) {
            // Hide all UI elements
            this.container.style.display = 'none';
            document.body.classList.add('screenshot-mode');
            this.eventBus.emit('ui:hide_status_bar', {});
            console.log('📸 Screenshot mode: ON');
        } else {
            // Restore UI elements
            this.container.style.display = '';
            document.body.classList.remove('screenshot-mode');
            this.eventBus.emit('ui:show_status_bar', {});
            console.log('📸 Screenshot mode: OFF');
        }

        // Save state
        this.savePersistentState();
    }

    /**
     * Get screenshot mode status
     */
    public isInScreenshotMode(): boolean {
        return this.screenshotMode;
    }

    // ========================================
    // EMERGENCY FALLBACK MENU
    // V1 Parity: notification-shade-controller.js lines 1077-1120
    // ========================================

    /**
     * Show emergency fallback menu if system fails
     * V1 Parity: Red button in top-right corner
     */
    public showEmergencyFallback(): void {
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
                box-shadow: 0 4px 16px rgba(255, 0, 0, 0.5);
            `;
            emergencyBtn.addEventListener('click', () => {
                this.eventBus.emit('settings:open', {});
            });
            document.body.appendChild(emergencyBtn);
        }

        emergencyBtn.style.display = 'flex';
        console.warn('🚨 Emergency fallback menu activated');
    }

    /**
     * Hide emergency fallback menu
     */
    public hideEmergencyFallback(): void {
        const emergencyBtn = document.getElementById('emergency-menu-btn');
        if (emergencyBtn) {
            emergencyBtn.style.display = 'none';
        }
    }
}
