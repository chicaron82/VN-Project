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

        // 1. Theme Logic (Auto + Manual)
        const themeToggle = document.getElementById('showcase-theme-toggle');
        const autoToggle = document.getElementById('showcase-theme-auto');
        const manualRow = document.getElementById('manual-theme-row');

        if (themeToggle && autoToggle) {
            // State defaults
            const isAuto = localStorage.getItem('uv7-theme-auto') !== 'false'; // Default to true
            const currentTheme = localStorage.getItem('uv7-theme') || 'dark';

            console.log(`[Theme] Init: auto=${isAuto}, theme=${currentTheme}`);

            // Helper to apply theme
            const applyTheme = (auto: boolean, theme: string) => {
                console.log(`[Theme] Applying: auto=${auto}, theme=${theme}`);
                // Update Auto Toggle UI
                if (auto) {
                    autoToggle.classList.add('active');
                    if (manualRow) manualRow.style.opacity = '0.5';
                    if (manualRow) manualRow.style.pointerEvents = 'none';

                    // Clear overrides so OS preference wins
                    document.body.classList.remove('light-mode', 'dark-mode');
                } else {
                    autoToggle.classList.remove('active');
                    if (manualRow) manualRow.style.opacity = '1';
                    if (manualRow) manualRow.style.pointerEvents = 'auto';

                    // Apply manual override based on stored preference
                    if (theme === 'light') {
                        document.body.classList.add('light-mode');
                        document.body.classList.remove('dark-mode');
                        themeToggle.classList.add('active'); // Visually ON
                    } else {
                        document.body.classList.add('dark-mode');
                        document.body.classList.remove('light-mode');
                        themeToggle.classList.remove('active'); // Visually OFF
                    }
                }
            };

            // Init
            applyTheme(isAuto, currentTheme);

            // Listen for theme changes from shell (when showcase is iframe'd)
            window.addEventListener('storage', (e) => {
                if (e.key === 'uv7-theme-auto' || e.key === 'uv7-theme') {
                    const newIsAuto = localStorage.getItem('uv7-theme-auto') !== 'false';
                    const newTheme = localStorage.getItem('uv7-theme') || 'dark';
                    console.log(`[Showcase Theme] Storage event: auto=${newIsAuto}, theme=${newTheme}`);
                    applyTheme(newIsAuto, newTheme);
                }
            });

            // Listen for postMessage from shell (when showcase is iframe'd)
            window.addEventListener('message', (e) => {
                if (e.data && e.data.type === 'theme-change') {
                    const { auto, theme } = e.data;
                    console.log(`[Showcase Theme] PostMessage from shell: auto=${auto}, theme=${theme}`);
                    applyTheme(auto, theme);
                }
            });

            // Auto Toggle Handler
            autoToggle.addEventListener('click', () => {
                const newAutoState = !autoToggle.classList.contains('active');
                localStorage.setItem('uv7-theme-auto', newAutoState ? 'true' : 'false');

                // If turning off auto, revert to currently stored manual theme
                const storedTheme = localStorage.getItem('uv7-theme') || 'dark';
                applyTheme(newAutoState, storedTheme);

                // Toast
                if ((window as any).contentFeatures?.showToast) {
                    (window as any).contentFeatures.showToast(
                        newAutoState ? '⚙️ Synced with System' : '🎨 Manual Mode Enabled',
                        2000
                    );
                }
                console.log(`[Theme] Auto mode: ${newAutoState ? 'ON' : 'OFF'}, Theme: ${storedTheme}`);
            });

            // Manual Toggle Handler
            themeToggle.addEventListener('click', () => {
                // Only works if Auto is OFF (though pointer-events should prevent this)
                if (autoToggle.classList.contains('active')) return;

                // Robust Toggle: Read from Storage, Flip, and Save
                const currentStored = localStorage.getItem('uv7-theme') || 'dark';
                const newTheme = currentStored === 'light' ? 'dark' : 'light';

                localStorage.setItem('uv7-theme', newTheme);
                applyTheme(false, newTheme);

                // Toast
                const icon = newTheme === 'dark' ? '🌙' : '☀️';
                if ((window as any).contentFeatures?.showToast) {
                    (window as any).contentFeatures.showToast(
                        `${icon} Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`,
                        2000
                    );
                }
                console.log(`[Theme] Manual toggle: ${currentStored} → ${newTheme}`);
            });
        }

        // 2. Echo Settings
        const echoToggle = document.getElementById('showcase-echo-toggle');
        const echoFreq = document.getElementById('showcase-echo-freq') as HTMLInputElement;
        const echoFreqVal = document.getElementById('showcase-echo-freq-val');
        const echoHover = document.getElementById('showcase-echo-hover');

        if (echoToggle && echoFreq && echoHover) {
            // Load state
            let settings = { enabled: true, frequency: 10, pauseOnHover: true };
            try {
                const stored = localStorage.getItem('uv7-echo-settings');
                if (stored) settings = JSON.parse(stored);
            } catch (e) { }

            // Apply to UI
            if (settings.enabled) echoToggle.classList.add('active');
            echoFreq.value = settings.frequency.toString();
            if (echoFreqVal) echoFreqVal.textContent = `${settings.frequency}s`;
            if (settings.pauseOnHover) echoHover.classList.add('active');

            // Save Handler
            const saveSettings = () => {
                const newSettings = {
                    enabled: echoToggle.classList.contains('active'),
                    frequency: parseInt(echoFreq.value),
                    pauseOnHover: echoHover.classList.contains('active')
                };
                localStorage.setItem('uv7-echo-settings', JSON.stringify(newSettings));
                // Dispatch event for other components
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'uv7-echo-settings',
                    newValue: JSON.stringify(newSettings)
                }));
            };

            // Bind events
            echoToggle.addEventListener('click', () => {
                echoToggle.classList.toggle('active');
                saveSettings();
            });

            echoHover.addEventListener('click', () => {
                echoHover.classList.toggle('active');
                saveSettings();
            });

            echoFreq.addEventListener('input', (e) => {
                const val = (e.target as HTMLInputElement).value;
                if (echoFreqVal) echoFreqVal.textContent = `${val}s`;
                saveSettings();
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
