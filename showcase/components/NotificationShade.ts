/**
 * NotificationShade Component (Mobile Navigation)
 * Handles rendering, swipe gestures, and interactions for the mobile shade.
 */

interface ShadeElements {
    shade: HTMLElement | null;
    closeBtn: HTMLElement | null;
    backdrop: HTMLElement | null;
    sectionList: HTMLElement | null;
}

export class NotificationShade {
    private touchStartY: number;
    private touchEndY: number;
    private minSwipeDistance: number;
    private el!: ShadeElements;

    constructor() {
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        console.log('🔔 NotificationShade: Starting initialization...');

        // Removed cleanup logic - we now have a permanent #uv7-shade element

        this.cacheElements();
        this.initEvents();
        this.initSettings();
        this.initSwipeHandler();
        console.log('✅ NotificationShade: Fully initialized');
    }

    cacheElements(): void {
        this.el = {
            shade: document.getElementById('uv7-shade'),
            closeBtn: document.querySelector('.shade-close-btn'),
            backdrop: document.getElementById('uv7-backdrop'),
            sectionList: null
        };
    }

    // ===========================================
    // SETTINGS LOGIC (Moved from Sidebar)
    // ===========================================

    private initSettings(): void {
        console.log('🔧 [NotificationShade] Initializing settings...');

        // Wire up close button with debugging
        if (this.el.closeBtn) {
            console.log('✅ [NotificationShade] Close button found:', this.el.closeBtn);
            this.el.closeBtn.addEventListener('click', (e) => {
                console.log('🔘 [NotificationShade] Close button clicked!');
                e.stopPropagation(); // Prevent event bubbling
                this.close();
            });
        } else {
            console.error('❌ [NotificationShade] Close button NOT found! Selector: .shade-close-btn');
        }

        // Also close on backdrop click if shade is open
        if (this.el.backdrop) {
            this.el.backdrop.addEventListener('click', () => {
                console.log('🔘 [NotificationShade] Backdrop clicked');
                if (this.el.shade?.style.display !== 'none') {
                    this.close();
                }
            });
        }

        // 1. Theme Logic - Using shared ThemeManager (single source of truth!)
        // All theme logic is now in shared/StatusBar/ThemeManager.ts
        // This replaces 100+ lines of duplicate code
        const themeToggle = document.getElementById('showcase-theme-toggle');
        const autoToggle = document.getElementById('showcase-theme-auto');
        const manualRow = document.getElementById('manual-theme-row');

        if (themeToggle && autoToggle) {
            // Import and use the shared ThemeManager
            import('../../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
                const themeManager = getThemeManager();

                // Bind UI elements - ThemeManager handles ALL the logic
                themeManager.bindUI({
                    toggle: themeToggle,
                    autoToggle: autoToggle,
                    manualRow: manualRow
                });

                console.log('🎨 [NotificationShade] Theme controls bound to shared ThemeManager');
            }).catch(err => {
                console.warn('[NotificationShade] Could not load ThemeManager, falling back:', err);
            });
        }

        // 2. Echo Settings - Using shared EchoSettingsManager (single source of truth!)
        // All echo logic is now in shared/StatusBar/EchoSettingsManager.ts
        const echoToggle = document.getElementById('showcase-echo-toggle');
        const echoFreq = document.getElementById('showcase-echo-freq') as HTMLInputElement;
        const echoFreqVal = document.getElementById('showcase-echo-freq-val');
        const echoHover = document.getElementById('showcase-echo-hover');

        if (echoToggle && echoFreq && echoHover) {
            import('../../shared/StatusBar/EchoSettingsManager').then(({ getEchoSettingsManager }) => {
                const echoManager = getEchoSettingsManager();

                // Bind UI elements - EchoSettingsManager handles ALL the logic
                echoManager.bindUI({
                    enabledToggle: echoToggle,
                    frequencySlider: echoFreq,
                    frequencyDisplay: echoFreqVal,
                    hoverToggle: echoHover
                });

                console.log('🔊 [NotificationShade] Echo controls bound to shared EchoSettingsManager');
            }).catch(err => {
                console.warn('[NotificationShade] Could not load EchoSettingsManager:', err);
            });
        }
    }

    initEvents(): void {
        const setupEventBusListener = () => {
            const runtime = (window as any).uv7Runtime;
            if (runtime && runtime.eventBus) {
                // Settings Toggle (from cog)
                runtime.eventBus.on('ui:settings:toggle', () => {
                    this.toggle();
                });

                // Shade Toggle (from swipe/status bar) - Context Aware
                runtime.eventBus.on('ui:shade:toggle', () => {
                    // Landscape: Open Sidebar
                    if (window.innerWidth > 768 && window.uv7os) {
                        window.uv7os.toggleSidebar();
                    } else {
                        // Portrait: Open Shade (Settings)
                        this.toggle();
                    }
                });
            } else {
                setTimeout(setupEventBusListener, 100);
            }
        };
        setupEventBusListener();
    }

    toggle(): void {
        if (!this.el.shade) return;

        const isClosed = this.el.shade.style.display === 'none' || this.el.shade.style.display === '';

        if (isClosed) {
            this.open();
        } else {
            this.close();
        }
    }

    open(): void {
        if (this.el.shade) {
            this.el.shade.style.display = 'block';
            // Use setTimeout to allow display:block to apply before adding class for transition
            setTimeout(() => this.el.shade!.classList.add('open'), 10);
        }
        this.el.backdrop?.classList.add('visible');
        document.body.classList.add('uv7-no-scroll');
    }

    close(): void {
        if (this.el.shade) {
            this.el.shade.classList.remove('open');
            setTimeout(() => {
                if (!this.el.shade?.classList.contains('open')) {
                    this.el.shade!.style.display = 'none';
                }
            }, 300); // Transition duration
        }
        this.el.backdrop?.classList.remove('visible');
        document.body.classList.remove('uv7-no-scroll');
    }

    initSwipeHandler(): void {
        document.addEventListener('touchstart', (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.slider-handle') || target.closest('.slider-knob') || target.closest('.split-container')) {
                return;
            }
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e: TouchEvent) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe(): void {
        const distance = this.touchEndY - this.touchStartY;
        const isShadeOpen = this.el.shade && this.el.shade.style.display !== 'none';
        const isSidebarOpen = document.getElementById('uv7-sidebar')?.classList.contains('open');

        // Swipe Up (negative distance) to close whatever is open
        if (distance < -this.minSwipeDistance) {
            if (isShadeOpen) this.close();
            if (isSidebarOpen && window.uv7os) window.uv7os.toggleSidebar();
            return;
        }

        // Swipe Down (positive distance) to open
        const isTopHalf = this.touchStartY < window.innerHeight / 2;
        const isAtScrollTop = window.scrollY < 100;

        if (distance > this.minSwipeDistance && (isTopHalf || isAtScrollTop)) {
            if (window.innerWidth > 768) {
                // Landscape: Open Sidebar
                if (!isSidebarOpen && window.uv7os) window.uv7os.toggleSidebar();
            } else {
                // Portrait: Open Shade (Settings)
                if (!isShadeOpen) this.open();
            }
        }
    }
}
