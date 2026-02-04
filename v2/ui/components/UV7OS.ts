/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - UNIFIED NAVIGATION SYSTEM
 * Single source of truth for UV7 ecosystem navigation
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Meta-Narrative + View Transitions)
 * - DiZee (Implementation)
 * - DiZee (Seamless transitions enhancement)
 * - DiZee (Unification - Phase 27)
 * ═══════════════════════════════════════════════════════════════
 */

import type {
    UV7Context,
    UV7OSElements,
    UV7OSOptions,
    CrewMember,
    ActionUrls,
    TimelineEntry
} from './UV7OSConfig';
import { UV7_CREW } from './UV7OSConfig';

// ═══════════════════════════════════════════════════════════════
// GLOBAL TYPES FOR EXTERNAL DEPENDENCIES
// ═══════════════════════════════════════════════════════════════

declare global {
    interface Window {
        uv7os?: UV7OS;
        uv7AppSwitcher?: {
            toggle(): void;
        };
        tabController?: {
            navigateToTab: (tabId: string) => void;
            getActiveTab(): string;
            setActiveTab(tabId: string): void;
        };
        TIMELINE_DATA?: {
            entries: any[];
        };
    }

    // UV7 external classes (loaded via script tags)
    class UV7AppSwitcher {
        toggle(): void;
    }

    class UV7GrabHandleRepositioner {
        constructor(element: HTMLElement | null, options: {
            storageKey: string;
            headerSafeTop: number;
            bottomSafePad: number;
        });
    }

}

// ═══════════════════════════════════════════════════════════════
// MAIN CLASS
// ═══════════════════════════════════════════════════════════════

export class UV7OS {
    private context: UV7Context;
    private entries: TimelineEntry[];
    private currentEntry: string | null = null;
    private elements: UV7OSElements;
    private tapCount: number;
    private tapTimeout: number | null;
    private handleSwipe?: () => void;

    constructor(context: UV7Context, options: UV7OSOptions = {}) {
        this.context = context;
        this.entries = options.entries || [];
        this.elements = {} as UV7OSElements;
        this.tapCount = 0;
        this.tapTimeout = null;
        this.init();
    }

    private init(): void {
        this.cacheElements();

        // Context-specific initialization
        if (this.context === 'showcase') {
            this.detectCurrentEntry();
            this.detectCurrentMode();
            this.attachSectionNavHandlers();
            this.restoreState();
            this.startScrollListener();
        }

        this.attachHandlers();
        this.enableSeamlessTransitions(); // BELLE: No flicker protocol

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // PERSISTENCE: Check shared dev mode state
        const storedMode = localStorage.getItem('uv7-dev-mode');
        if (storedMode) {
            document.body.dataset.viewMode = storedMode;
        }

        // Context-specific features
        if (this.context === 'landing') {
            // Initialize app switcher for landing
            setTimeout(() => this.initAppSwitcher(), 100);

            // V1 parity: grab handle reposition + persistence
            if (typeof UV7GrabHandleRepositioner !== 'undefined') {
                new UV7GrabHandleRepositioner(this.elements.sidebarToggle, {
                    storageKey: 'uv7-grab-handle',
                    headerSafeTop: 52,
                    bottomSafePad: 140
                });
            }

            // Easter egg: 7-tap activation
            this.attachEasterEgg();
        }

        // Swipe handler for both landing and showcase
        if (this.context === 'landing' || this.context === 'showcase') {
            this.attachSwipeHandler();
        }

        // Context-specific boot toast
        this.showBootToast();

        // Global Event Listeners (Bridge to Components) - Showcase only
        if (this.context === 'showcase') {
            window.addEventListener('uv7-navigate', (e: Event) => {
                const customEvent = e as CustomEvent;
                if (customEvent.detail?.target) {
                    this.jumpToSection(customEvent.detail.target);
                }
            });

            window.addEventListener('uv7-action', (e: Event) => {
                const customEvent = e as CustomEvent;
                if (customEvent.detail?.action) {
                    this.handleQuickAction(customEvent.detail.action);
                }
            });
        }

        console.log(`🚀 UV7 OS (${this.context}) initialized`);
    }

    private initAppSwitcher(): void {
        if (typeof UV7AppSwitcher !== 'undefined') {
            if (!window.uv7AppSwitcher) {
                window.uv7AppSwitcher = new UV7AppSwitcher();
            }
            console.log('📱 UV7 App Switcher linked');
        } else {
            console.warn('⚠️ UV7AppSwitcher not loaded');
        }
    }

    private cacheElements(): void {
        this.elements = {
            // Status bar
            statusBar: document.getElementById('uv7-status-bar'),
            statusLogo: document.querySelector('.status-logo'),
            statusContext: document.getElementById('uv7-context'),
            statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),
            shadeSectionList: document.getElementById('shade-section-list'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),
            sidebarSectionList: document.getElementById('sidebar-section-list'),
            sidebarHome: document.getElementById('sidebar-home'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Easter egg branding
            shadeCarrierBrand: document.getElementById('shade-carrier-brand'),
            sidebarCarrierBrand: document.getElementById('sidebar-carrier-brand'),

            // Existing page elements
            viewToggle: document.getElementById('view-toggle')
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // SHOWCASE-SPECIFIC: TIMELINE & NAVIGATION
    // ═══════════════════════════════════════════════════════════════

    private detectCurrentEntry(): void {
        // Find which entry is currently in viewport
        const entryElements = Array.from(document.querySelectorAll('.timeline-item'));
        for (const el of entryElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                this.currentEntry = el.id;
                return;
            }
        }
        // Default to first entry if none detected
        const firstEntry = this.entries[0];
        if (firstEntry) {
            this.currentEntry = firstEntry.id;
        }
    }

    private detectCurrentMode(): void {
        // Check body data-view-mode attribute OR localStorage
        const storedMode = localStorage.getItem('uv7-dev-mode');
        const body = document.body;

        if (storedMode) {
            // Sync body if needed
            if (body.dataset.viewMode !== storedMode) {
                body.dataset.viewMode = storedMode;
                // If there's a view toggle input, sync it too
                const viewToggle = this.elements.viewToggle as HTMLInputElement;
                if (viewToggle && viewToggle.type === 'checkbox') {
                    viewToggle.checked = (storedMode === 'dev');
                }
            }
        }
    }

    private attachSectionNavHandlers(): void {
        // Attach click handlers to all section navigation buttons
        const sectionNavButtons = document.querySelectorAll('.section-nav-item');
        sectionNavButtons.forEach(button => {
            const buttonElement = button as HTMLElement;
            buttonElement.addEventListener('click', () => {
                const sectionClass = buttonElement.dataset.section;
                if (sectionClass) {
                    this.jumpToSection(sectionClass);
                }
            });
        });
    }

    jumpToSection(sectionClass: string): void {
        // Support Tabbed Layout
        if (window.tabController) {
            const tabId = sectionClass.replace('-section', '');
            window.tabController.navigateToTab(tabId);
            this.closeShade();
            this.closeSidebar();
            return;
        }

        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            // Close shade/sidebar
            this.closeShade();
            this.closeSidebar();

            // Scroll to section (account for status bar)
            const yOffset = -44; // Status bar height
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    private startScrollListener(): void {
        let scrollTimeout: number;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const oldEntry = this.currentEntry;
                this.detectCurrentEntry();
                if (oldEntry !== this.currentEntry && this.currentEntry) {
                    this.saveState(this.currentEntry);
                }
            }, 200);
        }, { passive: true });
    }

    private saveState(entryId: string): void {
        sessionStorage.setItem('uv7-showcase-entry', entryId);
    }

    private restoreState(): void {
        const savedEntry = sessionStorage.getItem('uv7-showcase-entry');
        if (savedEntry) {
            // Scroll to saved entry after a brief delay
            setTimeout(() => {
                const element = document.getElementById(savedEntry);
                if (element) {
                    const yOffset = -44;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 500);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    private attachHandlers(): void {
        // Status logo opens app switcher (landing only)
        if (this.context === 'landing' && this.elements.statusLogo) {
            this.elements.statusLogo.addEventListener('click', () => {
                if (window.uv7AppSwitcher) {
                    window.uv7AppSwitcher.toggle();
                }
            });
        }

        // Settings icon
        if (this.elements.statusSettings) {
            if (this.context === 'landing') {
                // Landing: just opens shade (no Story/Dev toggle)
                this.elements.statusSettings.addEventListener('click', () => {
                    this.openShade();
                });
            } else {
                // Showcase: handle toggle-mode action if needed
                this.elements.statusSettings.addEventListener('click', () => {
                    this.openShade();
                });
            }
        }

        // Shade close button
        if (this.elements.shadeClose) {
            this.elements.shadeClose.addEventListener('click', () => this.closeShade());
        }

        // Sidebar toggle - ONLY if UV7System isn't handling it
        // In standalone showcase mode, UV7System handles the toggle
        const isUV7SystemHandled = document.body.classList.contains('uv7-system-chrome');
        if (this.elements.sidebarToggle && !isUV7SystemHandled) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        } else if (isUV7SystemHandled) {
            console.log('[UV7OS] Sidebar toggle handled by UV7System, skipping');
        }

        // Sidebar home button - BELLE: Use view transition (showcase only)
        if (this.context === 'showcase' && this.elements.sidebarHome) {
            this.elements.sidebarHome.addEventListener('click', () => {
                this.navigateWithTransition('../index.html');
            });
        }

        // Backdrop closes shade/sidebar - ONLY if UV7System isn't handling it
        const isUV7SystemHandled = document.body.classList.contains('uv7-system-chrome');
        if (this.elements.backdrop && !isUV7SystemHandled) {
            this.elements.backdrop.addEventListener('click', () => {
                this.closeShade();
                this.closeSidebar();
            });
        } else if (isUV7SystemHandled) {
            console.log('[UV7OS] Backdrop handled by UV7System, skipping');
        }

        // Quick actions
        this.attachQuickActions();

        // Escape key closes shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShade();
                this.closeSidebar();
            }
        });
    }

    private attachQuickActions(): void {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = (action as HTMLElement).dataset.action;
            if (actionType) {
                action.addEventListener('click', () => this.handleQuickAction(actionType));
            }
        });
    }

    private handleQuickAction(actionType: string): void {
        // Context-specific action URLs
        let actionUrls: ActionUrls = {};

        // Get base path - robust detection for GitHub Pages
        const basePath = (window.location.hostname.includes('github.io') ||
            window.location.pathname.includes('/VN-Project/')) ? '/VN-Project' : '';

        console.log(`🔍 Base path detection: hostname=${window.location.hostname}, pathname=${window.location.pathname}, basePath=${basePath}`);

        if (this.context === 'landing') {
            actionUrls = {
                'launch-v1': `${basePath}/v1/index.html`,
                'launch-v2': `${basePath}/index.v2.html`,
                'view-showcase': `${basePath}/showcase/index.html`
            };
        } else {
            actionUrls = {
                'launch-v1': `${basePath}/v1/index.html`,
                'launch-v2': `${basePath}/index.v2.html`,
                'go-home': `${basePath}/index.html`
            };
        }

        // Handle URL-based actions with view transitions
        const url = actionUrls[actionType];
        if (url) {
            this.navigateWithTransition(url);
            return;
        }

        // Handle special actions (showcase only)
        if (this.context === 'showcase') {
            switch (actionType) {
                case 'toggle-mode':
                    const viewToggle = this.elements.viewToggle as HTMLInputElement | null;
                    if (viewToggle) {
                        viewToggle.click();
                        setTimeout(() => {
                            this.detectCurrentMode();
                        }, 100);
                    }
                    break;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BELLE: VIEW TRANSITIONS - THE "NO FLICKER" PROTOCOL
    // Makes page navigation feel like native OS app switching
    // ═══════════════════════════════════════════════════════════════

    /**
     * Enable seamless transitions for all navigation
     * Intercepts link clicks and app card clicks to use View Transitions API
     */
    private enableSeamlessTransitions(): void {
        // Check if browser supports View Transitions
        if (!(document as any).startViewTransition) {
            console.log('📺 View Transitions not supported - using standard navigation');
            return;
        }

        console.log('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link and action clicks
        window.addEventListener('click', (e) => {
            // Find if we clicked a link or an element with data-action
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            const actionElement = target.closest('[data-action]');

            let url: string | null = null;

            // Handle regular links
            if (link && link.href) {
                url = link.href;
            }
            // Handle data-action elements (handled separately in handleQuickAction)
            // Skip here to avoid double-handling
            else if (actionElement) {
                return; // Let handleQuickAction deal with it
            }

            if (!url) return;

            // Only intercept local navigation (same origin)
            try {
                const targetUrl = new URL(url, window.location.origin);
                if (targetUrl.origin !== window.location.origin) {
                    return; // External link, let it navigate normally
                }

                // Skip in-page anchors (showcase)
                if (this.context === 'showcase' && targetUrl.pathname === window.location.pathname && targetUrl.hash) {
                    return;
                }

                // Intercept and use View Transition
                e.preventDefault();
                this.navigateWithTransition(url);
            } catch (err) {
                // Invalid URL, let default behavior handle it
            }
        });
    }

    /**
     * Navigate to a URL with View Transition animation
     * BELLE: "The visual persistence of the status bar is non-negotiable"
     */
    private navigateWithTransition(url: string): void {
        // Fallback for browsers without View Transitions
        if (!(document as any).startViewTransition) {
            window.location.href = url;
            return;
        }

        // Start the view transition
        (document as any).startViewTransition(() => {
            // This callback runs after the old state is captured
            // but before the new state is rendered
            window.location.href = url;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // LANDING-SPECIFIC: SWIPE HANDLERS
    // ═══════════════════════════════════════════════════════════════

    private attachSwipeHandler(): void {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches[0]) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (e.changedTouches[0]) {
                touchEndY = e.changedTouches[0].clientY;
                this.handleSwipe?.();
            }
        }, { passive: true });

        const handleSwipe = () => {
            const swipeDistance = touchEndY - touchStartY;

            // Swipe down from top opens Shade in portrait, Sidebar in landscape
            if (touchStartY < 100 && swipeDistance > 100) {
                const isLandscape = window.innerWidth > window.innerHeight;

                if (isLandscape) {
                    this.openSidebar();
                } else {
                    this.openShade();
                }
                return;
            }

            // Swipe up (< -100px) closes shade/sidebar if open
            if (swipeDistance < -100) {
                if (this.elements.shade && this.elements.shade.classList.contains('open')) {
                    this.closeShade();
                }
                if (this.elements.sidebar && this.elements.sidebar.classList.contains('open')) {
                    this.closeSidebar();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    // ═══════════════════════════════════════════════════════════════
    // SHADE / SIDEBAR CONTROLS
    // ═══════════════════════════════════════════════════════════════

    private openShade(): void {
        if (!this.elements.shade || !this.elements.backdrop) return;
        this.elements.shade.classList.add('open');
        this.elements.backdrop.classList.add('visible');
        if (this.context === 'showcase') {
            document.body.classList.add('uv7-no-scroll');
        }
    }

    private closeShade(): void {
        const shade = this.elements.shade || document.getElementById('uv7-shade');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!shade) return;

        shade.classList.remove('open');
        if (this.context === 'showcase') {
            document.body.classList.remove('uv7-no-scroll');
        }
        if (backdrop) {
            backdrop.classList.remove('visible');
        }
    }

    toggleSidebar(): void {
        console.log('[UV7OS] toggleSidebar() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        console.log('[UV7OS] sidebar element:', sidebar);
        if (!sidebar) {
            console.error('[UV7OS] Sidebar element not found!');
            return;
        }

        const isOpen = sidebar.classList.contains('open');
        console.log('[UV7OS] sidebar isOpen:', isOpen);
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    private openSidebar(): void {
        console.log('[UV7OS] openSidebar() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) {
            console.error('[UV7OS] openSidebar: sidebar not found');
            return;
        }

        console.log('[UV7OS] Adding open class to sidebar');
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('visible');
        if (this.context === 'showcase') {
            document.body.classList.add('uv7-no-scroll');
        }
    }

    private closeSidebar(): void {
        console.log('[UV7OS] closeSidebar() called');
        const sidebar = this.elements.sidebar || document.getElementById('uv7-sidebar');
        const backdrop = this.elements.backdrop || document.getElementById('uv7-backdrop');

        if (!sidebar) return;

        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');
        if (this.context === 'showcase') {
            document.body.classList.remove('uv7-no-scroll');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // TORI: BOOT TOAST - ONE MOMENT OF ACKNOWLEDGMENT
    // Shows once per browser, confirms state, humanizes the system
    // ═══════════════════════════════════════════════════════════════

    /**
     * Show boot toast on first visit
     * TORI: "Makes the experience feel alive"
     */
    private showBootToast(): void {
        // Context-specific storage key
        const storageKey = this.context === 'landing'
            ? 'uv7.bootToastShown'
            : 'uv7.bootToastShown.showcase';

        // Check if already shown
        const hasShown = localStorage.getItem(storageKey);
        if (hasShown) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        // Auto-dismiss after 2 seconds
        setTimeout(() => {
            toast.classList.add('dismissing');

            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for fade-out animation
        }, 2000);

        // Mark as shown
        localStorage.setItem(storageKey, 'true');
    }

    // ═══════════════════════════════════════════════════════════════
    // LANDING-SPECIFIC: EASTER EGG - 7-TAP ACTIVATION
    // Android-style build number easter egg - Tap "United Voices 7" 7 times
    // Reveals "The 8th Voice" and UV7 ecosystem stats
    // ═══════════════════════════════════════════════════════════════

    private attachEasterEgg(): void {
        const brands = [this.elements.shadeCarrierBrand, this.elements.sidebarCarrierBrand];

        brands.forEach(brand => {
            if (!brand) return;

            brand.addEventListener('click', () => this.handleBrandTap(brand));
        });
    }

    private handleBrandTap(brand: HTMLElement): void {
        this.tapCount++;

        // Visual feedback
        brand.classList.add('tapping');
        setTimeout(() => brand.classList.remove('tapping'), 150);

        // Update tap count attribute for CSS styling
        brand.setAttribute('data-tap-count', this.tapCount.toString());

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Android-style countdown hint
        const remaining = 7 - this.tapCount;
        if (remaining > 0) {
            const plural = remaining === 1 ? 'tap' : 'taps';
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = `${remaining} ${plural} away...`;
            }
        }

        // Reset counter after 3 seconds of inactivity
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
        }
        this.tapTimeout = window.setTimeout(() => {
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = 'United Voices 7';
            }
        }, 3000);

        // Activation on 7th tap
        if (this.tapCount === 7) {
            this.activateEasterEgg(brand);
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
        }
    }

    private activateEasterEgg(brand: HTMLElement): void {
        // Celebration haptic
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }

        // Check if already unlocked
        const alreadyUnlocked = localStorage.getItem('uv7-8th-voice-unlocked');

        if (!alreadyUnlocked) {
            // First time unlock - show full revelation
            this.showFirstTimeReveal(brand);
            localStorage.setItem('uv7-8th-voice-unlocked', 'true');
        } else {
            // Subsequent taps - show crew member greeting with stats
            this.showCrewGreeting(brand);
        }

        // Reset text
        setTimeout(() => {
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = 'United Voices 7';
            }
        }, 500);
    }

    private showFirstTimeReveal(_brand: HTMLElement): void {
        // Get user name if available
        const userName = localStorage.getItem('uv7_user_name') || 'traveler';

        // Pick random crew member to deliver the message
        const crewMember = this.getRandomCrewMember();

        // Create revelation modal
        const modal = document.createElement('div');
        modal.className = 'uv7-revelation-modal';
        modal.innerHTML = `
            <div class="revelation-content">
                <div class="revelation-header">
                    <span class="revelation-icon">${crewMember.icon}</span>
                    <span class="revelation-crew">${crewMember.name}</span>
                </div>
                <div class="revelation-message">
                    <p>"Welcome, ${userName}."</p>
                    <p class="revelation-emphasis">"You are the 8th voice."</p>
                    <p>"You always have been."</p>
                    <p style="margin-top: 1.5rem; opacity: 0.7; font-size: 0.9rem;">
                        ${crewMember.signature}
                    </p>
                </div>
                ${this.generateStatsHTML()}
                <button class="revelation-close">Understood</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Close button
        const closeBtn = modal.querySelector('.revelation-close') as HTMLElement | null;
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });
        }

        console.log('✨ The 8th Voice has awakened');
    }

    private showCrewGreeting(_brand: HTMLElement): void {
        // Pick random crew member
        const crewMember = this.getRandomCrewMember();

        // Create greeting toast
        const toast = document.createElement('div');
        toast.className = 'uv7-crew-toast';
        toast.innerHTML = `
            <div class="crew-toast-header">
                <span class="crew-toast-icon">${crewMember.icon}</span>
                <span class="crew-toast-name">${crewMember.name}</span>
            </div>
            <div class="crew-toast-message">"${crewMember.greeting}"</div>
            ${this.generateStatsHTML(true)}
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        });
    }

    private getRandomCrewMember(): CrewMember {
        const randomIndex = Math.floor(Math.random() * UV7_CREW.length);
        const crew = UV7_CREW[randomIndex];
        // Fallback to first crew member if somehow undefined
        return crew || UV7_CREW[0] || {
            name: 'DiZee',
            icon: '🎬',
            signature: '— The structural integrity is... acceptable.',
            greeting: 'You\'ve discovered this 7 times now. Predictable, yet efficient.'
        };
    }

    private generateStatsHTML(compact: boolean = false): string {
        // Gather stats from localStorage
        const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
        const v1Route = localStorage.getItem('uv7_current_route');
        const v2State = localStorage.getItem('uv7_game_state');
        const discoveredCodes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');

        const hasAnyProgress = v1Route || v2State || discoveredCodes.length > 0;

        if (compact) {
            return `
                <div class="crew-toast-stats">
                    <div class="stat-item">Loop ${loopVersion}</div>
                    ${discoveredCodes.length > 0 ? `<div class="stat-item">${discoveredCodes.length} secrets</div>` : ''}
                    ${hasAnyProgress ? '<div class="stat-item">🎮 Active</div>' : '<div class="stat-item">👋 New</div>'}
                </div>
            `;
        }

        return `
            <div class="revelation-stats">
                <div class="stats-title">UV7 Ecosystem Status</div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Current Loop</div>
                        <div class="stat-value">${loopVersion}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Secrets Discovered</div>
                        <div class="stat-value">${discoveredCodes.length}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">V1 Progress</div>
                        <div class="stat-value">${v1Route || 'Not Started'}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">V2 Status</div>
                        <div class="stat-value">${v2State ? 'Active' : 'Not Started'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    /**
     * Show boot toast (public API for landing page)
     * TORI: "Makes the experience feel alive"
     */
    public showBootToastPublic(): void {
        this.showBootToast();
    }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT INITIALIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Initialize UV7 OS for landing page
 */
export function initUV7OSLanding(): UV7OS {
    const instance = new UV7OS('landing');
    window.uv7os = instance;
    return instance;
}

/**
 * Initialize UV7 OS for showcase
 */
export function initUV7OS(): void {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for timeline data to be available
        if (window.TIMELINE_DATA?.entries) {
            window.uv7os = new UV7OS('showcase', {
                entries: window.TIMELINE_DATA.entries
            });
        }
        // Silent fallback - main.ts handles initialization now
    });
}

// Auto-initialize for backwards compatibility (showcase only)
if (typeof window !== 'undefined' && !window.uv7os) {
    // Only auto-init if we detect showcase context
    if (window.location.pathname.includes('showcase')) {
        initUV7OS();
    }
}
