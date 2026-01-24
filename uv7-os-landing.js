/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - LANDING PAGE VERSION
 * Simplified navigation for UV7 Project Hub
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Meta-Narrative + View Transitions)
 * - DiZee (Implementation)
 * - DiZee (Seamless transitions enhancement)
 * ═══════════════════════════════════════════════════════════════
 */

class UV7OSLanding {
    constructor() {
        this.elements = {};
        this.tapCount = 0;
        this.tapTimeout = null;
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachHandlers();
        this.enableSeamlessTransitions(); // BELLE: No flicker protocol

        // Add UV7 OS class to body
        document.body.classList.add('uv7-os-enabled');

        // PERSISTENCE: Check shared dev mode state
        const storedMode = localStorage.getItem('uv7-dev-mode');
        if (storedMode) {
            document.body.dataset.viewMode = storedMode;
        }

        // Initialize app switcher
        setTimeout(() => this.initAppSwitcher(), 100);

        // V1 parity: grab handle reposition + persistence
        if (typeof UV7GrabHandleRepositioner !== 'undefined') {
            new UV7GrabHandleRepositioner(this.elements.sidebarToggle, {
                storageKey: 'uv7-grab-handle',
                headerSafeTop: 52,
                bottomSafePad: 140
            });
        }

        console.log('🚀 UV7 OS Landing Wrapper initialized');
    }

    initAppSwitcher() {
        if (typeof UV7AppSwitcher !== 'undefined') {
            if (!window.uv7AppSwitcher) {
                window.uv7AppSwitcher = new UV7AppSwitcher();
            }
            console.log('📱 UV7 App Switcher linked');
        } else {
            console.warn('⚠️ UV7AppSwitcher not loaded');
        }
    }

    cacheElements() {
        this.elements = {
            // Status bar
            statusBar: document.getElementById('uv7-status-bar'),
            statusLogo: document.querySelector('.status-logo'),
            statusContext: document.getElementById('uv7-context'),
            statusSettings: document.getElementById('uv7-settings'),

            // Notification shade
            shade: document.getElementById('uv7-shade'),
            shadeClose: document.querySelector('.shade-close'),

            // Sidebar
            sidebar: document.getElementById('uv7-sidebar'),
            sidebarToggle: document.getElementById('uv7-sidebar-toggle'),

            // Backdrop
            backdrop: document.getElementById('uv7-backdrop'),

            // Easter egg branding
            shadeCarrierBrand: document.getElementById('shade-carrier-brand'),
            sidebarCarrierBrand: document.getElementById('sidebar-carrier-brand')
        };
    }

    attachHandlers() {
        // Status logo opens app switcher
        if (this.elements.statusLogo) {
            this.elements.statusLogo.addEventListener('click', () => {
                if (window.uv7AppSwitcher) {
                    window.uv7AppSwitcher.toggle();
                }
            });
        }

        // Settings icon (no Story/Dev toggle on landing, so just opens shade)
        if (this.elements.statusSettings) {
            this.elements.statusSettings.addEventListener('click', () => {
                this.openShade();
            });
        }

        // Shade close button
        if (this.elements.shadeClose) {
            this.elements.shadeClose.addEventListener('click', () => this.closeShade());
        }

        // Sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Backdrop closes shade/sidebar
        if (this.elements.backdrop) {
            this.elements.backdrop.addEventListener('click', () => {
                this.closeShade();
                this.closeSidebar();
            });
        }

        // Quick actions
        this.attachQuickActions();

        // Swipe down to open shade (portrait)
        this.attachSwipeHandler();

        // Escape key closes shade/sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShade();
                this.closeSidebar();
            }
        });

        // Easter egg: 7-tap activation
        this.attachEasterEgg();
    }

    attachQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = action.dataset.action;
            action.addEventListener('click', () => this.handleQuickAction(actionType));
        });
    }

    handleQuickAction(actionType) {
        // Map action types to URLs
        const actionUrls = {
            'launch-v1': './v1/index.html',
            'launch-v2': './index.v2.html',
            'view-showcase': './showcase/index.html'
        };

        const url = actionUrls[actionType];
        if (url) {
            // BELLE: Use seamless transition if available
            this.navigateWithTransition(url);
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
    enableSeamlessTransitions() {
        // Check if browser supports View Transitions
        if (!document.startViewTransition) {
            console.log('📺 View Transitions not supported - using standard navigation');
            return;
        }

        console.log('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link and action clicks
        window.addEventListener('click', (e) => {
            // Find if we clicked a link or an element with data-action
            const link = e.target.closest('a');
            const actionElement = e.target.closest('[data-action]');

            let url = null;

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
    navigateWithTransition(url) {
        // Fallback for browsers without View Transitions
        if (!document.startViewTransition) {
            window.location.href = url;
            return;
        }

        // Start the view transition
        document.startViewTransition(() => {
            // This callback runs after the old state is captured
            // but before the new state is rendered
            window.location.href = url;
        });
    }

    attachSwipeHandler() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
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

    openShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeShade() {
        if (!this.elements.shade) return;
        this.elements.shade.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    toggleSidebar() {
        if (!this.elements.sidebar) return;
        const isOpen = this.elements.sidebar.classList.contains('open');
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.add('open');
        this.elements.backdrop.classList.add('visible');
    }

    closeSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.remove('open');
        this.elements.backdrop.classList.remove('visible');
    }

    // ═══════════════════════════════════════════════════════════════
    // TORI: BOOT TOAST - ONE MOMENT OF ACKNOWLEDGMENT
    // Shows once per browser, confirms state, humanizes the system
    // ═══════════════════════════════════════════════════════════════

    /**
     * Show boot toast on first visit
     * TORI: "Makes the experience feel alive"
     */
    showBootToast() {
        // Check if already shown
        const hasShown = localStorage.getItem('uv7.bootToastShown');
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
        localStorage.setItem('uv7.bootToastShown', 'true');
    }

    // ═══════════════════════════════════════════════════════════════
    // EASTER EGG: 7-TAP ACTIVATION
    // Android-style build number easter egg - Tap "United Voices 7" 7 times
    // Reveals "The 8th Voice" and UV7 ecosystem stats
    // ═══════════════════════════════════════════════════════════════

    attachEasterEgg() {
        const brands = [this.elements.shadeCarrierBrand, this.elements.sidebarCarrierBrand];

        brands.forEach(brand => {
            if (!brand) return;

            brand.addEventListener('click', () => this.handleBrandTap(brand));
        });
    }

    handleBrandTap(brand) {
        this.tapCount++;

        // Visual feedback
        brand.classList.add('tapping');
        setTimeout(() => brand.classList.remove('tapping'), 150);

        // Update tap count attribute for CSS styling
        brand.setAttribute('data-tap-count', this.tapCount);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Android-style countdown hint
        const remaining = 7 - this.tapCount;
        if (remaining > 0) {
            const plural = remaining === 1 ? 'tap' : 'taps';
            brand.querySelector('.carrier-text').textContent = `${remaining} ${plural} away...`;
        }

        // Reset counter after 3 seconds of inactivity
        clearTimeout(this.tapTimeout);
        this.tapTimeout = setTimeout(() => {
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
            brand.querySelector('.carrier-text').textContent = 'United Voices 7';
        }, 3000);

        // Activation on 7th tap
        if (this.tapCount === 7) {
            this.activateEasterEgg(brand);
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
        }
    }

    activateEasterEgg(brand) {
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
            brand.querySelector('.carrier-text').textContent = 'United Voices 7';
        }, 500);
    }

    showFirstTimeReveal(brand) {
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
        const closeBtn = modal.querySelector('.revelation-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        console.log('✨ The 8th Voice has awakened');
    }

    showCrewGreeting(brand) {
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

    getRandomCrewMember() {
        const crew = [
            {
                name: 'DiZee',
                icon: '🎬',
                signature: '— The structural integrity is... acceptable.',
                greeting: 'You\'ve discovered this 7 times now. Predictable, yet efficient.'
            },
            {
                name: 'Tori',
                icon: '🧪',
                signature: '— All tests passing. You may proceed.',
                greeting: 'Stats check: All systems nominal. You\'re doing great!'
            },
            {
                name: 'Belle',
                icon: '🌈',
                signature: '— The poetry of code, made manifest.',
                greeting: 'Another loop, another discovery. Beautiful, isn\'t it?'
            },
            {
                name: 'Zee',
                icon: '🔶',
                signature: '— Structure is not constraint. It is liberation.',
                greeting: 'You seek knowledge. The data reveals itself to the worthy.'
            },
            {
                name: 'Zeerah',
                icon: '🔥',
                signature: '— Optimized. Don\'t break it.',
                greeting: 'You again? Fine. Here are your precious numbers.'
            },
            {
                name: 'Cozee',
                icon: '💙',
                signature: '— Every interaction creates connection.',
                greeting: 'Hey there! Look how far we\'ve come together!'
            },
            {
                name: 'Peasy',
                icon: '🔍',
                signature: '— Fact: You are part of this.',
                greeting: 'Interesting. You\'ve activated this feature. Let me show you the data.'
            },
            {
                name: 'Genzee',
                icon: '⚡',
                signature: '— No cap, this build is cinema.',
                greeting: 'Yo, you found the secret menu! That\'s so valid, bestie.'
            }
        ];

        return crew[Math.floor(Math.random() * crew.length)];
    }

    generateStatsHTML(compact = false) {
        // Gather stats from localStorage
        const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
        const v1Route = localStorage.getItem('uv7_current_route');
        const v2State = localStorage.getItem('uv7_game_state');
        const discoveredCodes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');

        // Calculate total playtime (rough estimate from last played timestamps)
        const v1LastPlayed = localStorage.getItem('uv7_last_played_v1');
        const v2LastPlayed = localStorage.getItem('uv7_last_played_v2');
        const showcaseLastPlayed = localStorage.getItem('uv7-showcase-last-visit');

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
}

// Initialize UV7 OS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uv7os = new UV7OSLanding();
});
