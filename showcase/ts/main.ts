/**
 * UV7 SHOWCASE - MAIN ENTRY POINT
 *
 * Full Vite integration - imports V2 bridge directly from source.
 * All showcase components are now ES modules.
 *
 * "We went full Michelin. No regrets." - The Crew
 */

// Import V2 Bridge directly from source (no pre-built IIFE)
import { EventBus } from '../../v2/core/EventBus';
import { StatusBar } from '../../v2/ui/components/StatusBar';
import { NotificationRail } from '../../v2/ui/components/NotificationRail';
// UV7Context type removed as it is no longer used
import { UV7AppSwitcher } from '../../v2/ui/components/UV7AppSwitcher';
import { UV7OS } from '../../v2/ui/components/UV7OS';
import type { TimelineEntry } from '../../v2/ui/components/UV7OSConfig'; // Import the class directly

// Import showcase components
import { TimelineRenderer } from '../lib/TimelineRenderer';
import { TabController } from '../lib/TabController';
// SwipeController replaced by CSS scroll-snap
// import { MagneticCursor } from './MagneticCursor'; // Disabled to show timeline ripple effects
import { initAppStateManager } from '../lib/AppStateManager';
import { initShowcaseCarousel } from '../lib/components/showcase-carousel';
import { UV7EchoSystem } from '../lib/UV7EchoSystem';
// Remove initUV7OS since we'll create the instance directly
// Remove initGrabHandle since UV7OS handles it automatically

// Import section renderers
import { HomeSection } from './components/HomeSection';
import { JourneySection } from './components/JourneySection';
import { WorkflowSection } from './components/WorkflowSection';
import { ResultsSection } from './components/ResultsSection';
import { SpotlightSection } from './components/SpotlightSection';
import { EvolutionSection } from './components/EvolutionSection';
import { WhoSection } from './components/WhoSection';

// Import timeline enhancements
import { TimelineAnimations } from './TimelineAnimations';
import { TimelineStats } from './TimelineStats';
import { TimelineScrubber } from './TimelineScrubber';
import { TimelineSearch } from './TimelineSearch';

// Import showcase UI components
import { Sidebar } from './components/Sidebar';
import { NotificationShade } from './components/NotificationShade';

// Import effects
import { initTypingEffect } from '../lib/effects/typing-effect';
import { initTilt } from '../../v2/ui/effects/TiltEffect';
import { initAnimatedStats } from '../../v2/ui/effects/AnimatedStats';
import { initPremiumAnimations } from '../lib/effects/premium-animations';

// Import utilities
import { initPerformanceOptimizations } from '../lib/utils/performance';
import { initLoadStats } from '../lib/utils/load-stats';
import { initAnalytics } from '../lib/utils/analytics';
import { initContentFeatures } from '../lib/utils/content-features';
import { initUXEnhancements } from '../../v2/ui/utils/UXEnhancements';
import { injectFooters } from '../lib/FooterInjector';

console.log('%c[SHOWCASE] Initializing...', 'background: #00ff88; color: black; font-weight: bold; padding: 4px;');

// Create UV7 System (same factory pattern as ShowcaseBridge)
function createUV7System(context: string = 'showcase') {
    console.log(`🏗️ Creating UV7 System for ${context}`);

    const eventBus = new EventBus();
    const statusBar = new StatusBar(eventBus, undefined, {});
    const notificationRail = new NotificationRail(eventBus);

    return {
        eventBus,
        statusBar,
        notificationRail,
    };
}

// Expose constructors to window for legacy compatibility
window.UV7System = {
    EventBus,
    StatusBar,
    NotificationRail,
    createStatusBar: createUV7System, // Legacy API compatibility
};

// Initialize showcase components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing showcase components...');

    // Detect if we're running inside the unified shell (iframe)
    const isInShell = window.self !== window.top;
    console.log(`[Showcase] Running in ${isInShell ? 'SHELL' : 'STANDALONE'} mode`);

    // Add class to body for shell-specific styling
    if (isInShell) {
        document.body.classList.add('in-shell-mode');
        console.log('⏭️ Skipping UV7 System (shell provides chrome)');
        console.log('⏭️ Skipping Sidebar/NotificationShade (shell provides context-aware sidebar)');
    } else {
        // Only create UV7 System chrome (status bar, sidebar, etc.) in standalone mode
        const uv7System = createUV7System('showcase');
        window.uv7Runtime = {
            ...uv7System,
            instance: uv7System.statusBar // TabController expects this
        };

        console.log('✅ UV7 System initialized');
        console.log('✅ UV7 Status Bar mounted and visible');
        uv7System.statusBar.show();

        // Initialize UI Components (only in standalone mode)
        new Sidebar();
        new NotificationShade();
        console.log('✅ Sidebar and NotificationShade initialized');
    }

    // Initialize Tab Navigation
    const tabController = new TabController();
    window.tabController = tabController; // Expose for legacy compatibility

    // Initialize section renderers
    new HomeSection();
    new JourneySection();
    new WorkflowSection();
    new ResultsSection();
    new SpotlightSection();
    new EvolutionSection();
    new WhoSection();
    console.log('✅ Section renderers initialized');

    // Inject footers AFTER sections render (DRY optimization)
    injectFooters();

    // Initialize timeline enhancements (MAXIMUM MICHELIN)
    // Note: These are initialized but not stored as they manage themselves
    new TimelineAnimations('.timeline');
    if (window.TIMELINE_DATA?.entries) {
        new TimelineStats(window.TIMELINE_DATA.entries as TimelineEntry[]);
    }
    new TimelineScrubber('#timeline-container');
    const timelineSearch = new TimelineSearch('.timeline', '#timeline-search');
    console.log('✅ Timeline enhancements initialized (animations, stats, scrubber, search)');

    // Wire up search callback to scroll to entry
    timelineSearch.onSelect((entry) => {
        console.log('🔍 [Search] Selected entry:', entry.title);
    });

    // Initialize TimelineRenderer (Journey tab) - must be after JourneySection renders
    new TimelineRenderer('#timeline-container');
    console.log('✅ Timeline renderer initialized');

    // Manually trigger initial breadcrumb update to ensure it shows
    const initialTab = tabController.getActiveTab();
    tabController.setActiveTab(initialTab);

    // Use native CSS scroll-snap instead of SwipeController
    const tabPanelsContainer = document.querySelector('.tab-panels-container') as HTMLElement;
    if (tabPanelsContainer) {
        let scrollTimeout: number;
        tabPanelsContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const scrollLeft = tabPanelsContainer.scrollLeft;
                const panelWidth = window.innerWidth;
                const currentIndex = Math.round(scrollLeft / panelWidth);
                const tabs = ['home', 'journey', 'workflow', 'results', 'spotlight', 'evolution'];
                const expectedTab = tabs[currentIndex];

                if (expectedTab && expectedTab !== tabController.getActiveTab()) {
                    tabController.setActiveTab(expectedTab);
                }
            }, 150);
        });
        console.log('✅ Scroll-snap navigation initialized');
    }

    // Initialize visual effects
    initTypingEffect();
    // new MagneticCursor(); // Disabled to show timeline ripple effects
    initTilt('.hero-banner.home .hero-banner-image', {
        container: '.hero-banner.home',
        limits: 15,
        perspective: 1000
    });
    initAnimatedStats();
    initPremiumAnimations();
    console.log('✅ Visual effects initialized');

    // Initialize utilities
    initPerformanceOptimizations();
    initLoadStats();
    initAnalytics();
    initContentFeatures();
    initUXEnhancements();
    console.log('✅ Utilities initialized');

    // Initialize App State Manager and App Switcher (only in standalone mode)
    if (!isInShell) {
        initAppStateManager();
        console.log('✅ App State Manager initialized');

        // Initialize UV7 App Switcher (proper TypeScript version)
        const appSwitcher = new UV7AppSwitcher();
        window.uv7AppSwitcher = appSwitcher;
        console.log('🚀 UV7 App Switcher (BOUGIE EDITION) initialized');
    } else {
        console.log('⏭️ Skipping App Switcher (shell mode)');
    }

    // Initialize UV7 OS (navigation system) - ALWAYS, even in shell mode
    if (window.TIMELINE_DATA?.entries) {
        window.uv7os = new UV7OS('showcase', {
            entries: window.TIMELINE_DATA.entries as TimelineEntry[]
        });
        console.log('✅ UV7 OS initialized with', window.TIMELINE_DATA.entries.length, 'timeline entries');
    } else {
        // Fallback: create without timeline data (silent)
        window.uv7os = new UV7OS('showcase');
        console.log('✅ UV7 OS initialized (no timeline data)');
    }

    // Grab handle is initialized by UV7OS automatically
    // No need to initialize it here - UV7OS.attachHandlers() already adds click listener

    // Initialize sidebar quick actions - ALWAYS
    document.querySelectorAll('.quick-action').forEach((btn) => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');

            if (action === 'launch-v1') {
                window.location.href = '../index.html#/v1';
            } else if (action === 'launch-v2') {
                window.location.href = '../index.html#/v2';
            } else if (action === 'go-home') {
                window.location.href = '../index.html#/landing';
            } else if (action === 'toggle-mode') {
                // Trigger the status bar toggle button
                const statusToggle = document.getElementById('status-story-dev-toggle');
                if (statusToggle) {
                    statusToggle.click();
                }
            }

            // Close sidebar after any action
            const sidebar = document.getElementById('uv7-sidebar');
            const backdrop = document.getElementById('uv7-backdrop');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                backdrop?.classList.remove('visible');
                document.body.classList.remove('uv7-no-scroll');
            }
        });
    });

    // Initialize animated system stats - ALWAYS (sidebar widget)
    // Initialize animated system stats - ALWAYS (sidebar widget)
    const cpuVal = document.getElementById('sys-cpu');
    const cpuBar = document.getElementById('sys-cpu-bar');
    const ramVal = document.getElementById('sys-ram');
    const ramBar = document.getElementById('sys-ram-bar');

    if (cpuVal && cpuBar && ramVal && ramBar) {
        // Organic Random Walk State
        let chaosLevel = 12;
        let chaosTarget = 12;
        let lastChaosUpdate = 0;

        let bougieLevel = 88;
        let bougieTarget = 92;
        let lastBougieUpdate = 0;

        const updateStats = (timestamp: number) => {
            // Update targets occasionally (Chaos: jittery, Bougie: stable)
            if (timestamp - lastChaosUpdate > 800 + Math.random() * 1000) {
                // Chaos drifts between 5% and 45%, occasionally spiking
                chaosTarget = Math.max(5, Math.min(45, chaosTarget + (Math.random() - 0.5) * 30));
                lastChaosUpdate = timestamp;
            }

            if (timestamp - lastBougieUpdate > 2000 + Math.random() * 2000) {
                // Bougie Factor stays high (85-99%) because we ARE that fancy 💅
                bougieTarget = Math.max(85, Math.min(99, bougieTarget + (Math.random() - 0.5) * 10));
                lastBougieUpdate = timestamp;
            }

            // Smooth interpolation (Lerp)
            // Chaos moves snappier (0.05), Bougie moves elegantly slow (0.01)
            chaosLevel += (chaosTarget - chaosLevel) * 0.05;
            bougieLevel += (bougieTarget - bougieLevel) * 0.01;

            // Render
            const chaosDisplay = Math.round(chaosLevel);
            const bougieDisplay = Math.round(bougieLevel);

            cpuVal.textContent = `${chaosDisplay}%`;
            cpuBar.style.width = `${chaosDisplay}%`;

            ramVal.textContent = `${bougieDisplay}%`;
            ramBar.style.width = `${bougieDisplay}%`;

            requestAnimationFrame(updateStats);
        };

        requestAnimationFrame(updateStats);
        console.log('✅ System stats animated (Mode: Organic Walk)');
    }

    // Initialize UV7 Echo System (context-aware AI crew commentary)
    // Initialize UV7 Echo System (context-aware AI crew commentary)
    new UV7EchoSystem();
    console.log('✅ AI Crew echo system initialized');

    // Initialize sidebar section navigation - ALWAYS
    const sectionNavItems = document.querySelectorAll('.section-nav-item[data-tab]');
    sectionNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (tab && window.tabController) {
                window.tabController.navigateToTab(tab);
                // Close sidebar after navigation
                const sidebar = document.getElementById('uv7-sidebar');
                const backdrop = document.getElementById('uv7-backdrop');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    backdrop?.classList.remove('visible');
                    document.body.classList.remove('uv7-no-scroll');
                }
            }
        });
    });
    console.log('✅ Sidebar section navigation initialized');

    // Initialize Showcase Carousel (Spotlight tab)
    initShowcaseCarousel();
    console.log('✅ Showcase carousel initialized');

    // Listen for messages from parent shell (when running in iframe)
    if (isInShell) {
        window.addEventListener('message', (event) => {
            // Verify message is from parent (basic security)
            if (event.source !== window.parent) return;

            const { type, tab, action } = event.data;

            switch (type) {
                case 'navigate-tab':
                    // Navigate to the specified tab
                    if (tab && window.tabController) {
                        console.log(`[Showcase] Navigating to tab: ${tab}`);
                        window.tabController.navigateToTab(tab);
                    }
                    break;

                case 'quick-action':
                    // Handle quick actions
                    console.log(`[Showcase] Handling quick action: ${action}`);
                    switch (action) {
                        case 'launch-v1':
                            window.parent.location.hash = '#/v1';
                            break;
                        case 'launch-v2':
                            window.parent.location.hash = '#/v2';
                            break;
                        case 'go-home':
                            window.parent.location.hash = '#/';
                            break;
                        case 'toggle-mode':
                            // Toggle story/dev mode
                            const currentMode = document.body.classList.contains('story-mode') ? 'story' : 'dev';
                            if (currentMode === 'story') {
                                document.body.classList.remove('story-mode');
                                document.body.classList.add('dev-mode');
                            } else {
                                document.body.classList.remove('dev-mode');
                                document.body.classList.add('story-mode');
                            }
                            break;
                    }
                    break;

                case 'echo-settings':
                    // Trigger echo settings
                    console.log('[Showcase] Opening Echo settings');
                    const echoBtn = document.getElementById('echo-settings-trigger');
                    if (echoBtn) {
                        echoBtn.click();
                    }
                    break;

                case 'theme-change':
                    // Apply theme changes from shell
                    const { auto, theme } = event.data;
                    console.log(`[Showcase] Received theme change from shell: auto=${auto}, theme=${theme}`);

                    if (auto) {
                        // Clear overrides, let system preference win
                        document.body.classList.remove('light-mode', 'dark-mode');
                        console.log('[Showcase] Applied auto theme (cleared overrides)');
                    } else {
                        // Apply manual theme
                        if (theme === 'light') {
                            document.body.classList.add('light-mode');
                            document.body.classList.remove('dark-mode');
                            console.log('[Showcase] Applied light mode');
                        } else {
                            document.body.classList.add('dark-mode');
                            document.body.classList.remove('light-mode');
                            console.log('[Showcase] Applied dark mode');
                        }
                    }
                    break;
            }
        });
        console.log('✅ Parent message listener initialized');
    }

    console.log(`✅ Showcase fully initialized - ${isInShell ? 'SHELL' : 'STANDALONE'} mode`);
});
