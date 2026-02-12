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

// Import blog components
import { BlogRenderer } from '../features/blog/BlogRenderer';
import { TabController } from './TabController';
import { initAppStateManager } from './AppStateManager';
import { initShowcaseCarousel } from '../components/showcase-carousel';
import { UV7EchoSystem } from '../features/UV7EchoSystem';
import type { CodeComparison, CodeComparisonModal as ICodeComparisonModal } from '../types/types';

// Import section renderers
import { HomeSection } from '../components/HomeSection';
import { JournalSection } from '../components/JournalSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { SpotlightSection } from '../components/SpotlightSection';
import { EvolutionSection } from '../components/EvolutionSectionV2'; // V2: Deep-dive code comparison
import { ExperimentSection } from '../components/ExperimentSection';
import { WhoSection } from '../components/WhoSection';

// Import blog enhancements
import { BlogDeepLink } from '../features/blog/BlogDeepLink';
import { BlogHoverPreview } from '../features/blog/BlogHoverPreview';
import { BlogParallax } from '../features/blog/BlogParallax';
import { BlogBackgrounds } from '../features/blog/BlogBackgrounds';
import { BlogHaptics } from '../features/blog/BlogHaptics';
import { BlogMeta } from '../features/blog/BlogMeta';
import { GlobalSearch } from '../features/GlobalSearch';
import { GentleNudges } from '../controllers/GentleNudges';
import { BougieTracker } from '../controllers/BougieTracker';
import { HomeInteractionController } from '../controllers/HomeInteractionController';
import { SystemBannerController } from '../controllers/SystemBannerController';

// Import showcase UI components
// Sidebar and NotificationShade removed - now using UV7System
import { SystemStatsWidget } from '../components/SystemStatsWidget';
// CodeComparisonModal - LAZY LOADED on first button click (274 lines saved)

// Import effects
import { initTypingEffect } from '../effects/typing-effect';
import { initTilt } from '../../v2/ui/effects/TiltEffect';
import { initAnimatedStats } from '../../v2/ui/effects/AnimatedStats';
import { initPremiumAnimations } from '../effects/premium-animations';

// Import utilities
import { initPerformanceOptimizations } from '../utils/performance';
import { initLoadStats } from '../utils/load-stats';
import { initAnalytics } from '../utils/analytics';
import { initContentFeatures } from '../utils/content-features';
import { initUXEnhancements } from '../../v2/ui/utils/UXEnhancements';
import { injectFooters } from '../components/FooterInjector';
import { Logger } from '@utils/Logger';

Logger.system('%c[SHOWCASE] Initializing...', 'background: #00ff88; color: black; font-weight: bold; padding: 4px;');

// Create UV7 System (same factory pattern as ShowcaseBridge)
function createUV7System(context: string = 'showcase'): { eventBus: EventBus; statusBar: StatusBar; notificationRail: NotificationRail } {
    Logger.system(`🏗️ Creating UV7 System for ${context}`);

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

// Home interactions moved to HomeInteractionController.ts (194 lines extracted)

// Initialize showcase components on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    Logger.system('🚀 Initializing showcase components...');

    // Detect if we're running inside the unified shell (iframe)
    const isInShell = window.self !== window.top;
    Logger.system(`[Showcase] Running in ${isInShell ? 'SHELL' : 'STANDALONE'} mode`);

    // Add class to body for shell-specific styling
    if (isInShell) {
        document.body.classList.add('in-shell-mode');
        Logger.system('⏭️ Skipping UV7 System (shell provides chrome)');
        Logger.system('⏭️ Skipping Sidebar/NotificationShade (shell provides context-aware sidebar)');

        // Hide chrome elements since shell provides them
        const chromeElements = [
            '#uv7-sidebar',
            '#uv7-sidebar-toggle',
            '#uv7-shade',
            '#uv7-backdrop',
            '#uv7-status-bar'
        ];

        chromeElements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                (el as HTMLElement).style.display = 'none';
                Logger.system(`[Showcase] Hiding ${selector} (shell provides it)`);
            }
        });
    } else {
        // =================================================================
        // PHASE 1: CORE SYSTEM (only in standalone mode)
        // =================================================================
        // Initialize UV7System with showcase-specific sidebar

        const { default: UV7System } = await import('../../shell/UV7System');
        const { generateShowcaseSidebarContent, initShowcaseSidebarListeners } = await import('../../shell/templates/ShowcaseSidebarTemplate');

        const uv7System = new UV7System({
            mode: 'standalone',
            appName: 'Showcase',
            prefix: 'showcase',
            sidebarConfig: {
                title: '📖 SHOWCASE',
                content: generateShowcaseSidebarContent(),
                init: initShowcaseSidebarListeners
            }
        });

        await uv7System.init();
        Logger.system('✅ UV7System initialized in standalone mode with showcase sidebar');

        // Create legacy UV7 System for compatibility
        const uv7SystemLegacy = createUV7System('showcase');
        window.uv7Runtime = {
            ...uv7SystemLegacy,
            instance: uv7SystemLegacy.statusBar // TabController expects this
        };
        uv7SystemLegacy.statusBar.show();
        Logger.system('✅ Legacy UV7 System initialized for compatibility');
    }


    // =================================================================
    // PHASE 2: NAVIGATION & CONTENT
    // =================================================================
    // TabController and section renderers must initialize before features
    // that depend on the DOM structure (like BlogRenderer, deep linking, etc.)

    // Initialize Tab Navigation
    const tabController = new TabController();
    window.tabController = tabController; // Expose for legacy compatibility

    // Initialize section renderers (these inject HTML into mount points)
    new HomeSection();
    new JournalSection();
    new WorkflowSection();
    new SpotlightSection();
    new EvolutionSection();
    new ExperimentSection();
    new WhoSection();
    Logger.system('✅ Section renderers initialized');

    // Initialize Home Section interactions (demon lord link, landing cards, crew reactions)
    new HomeInteractionController(tabController);
    Logger.system('✅ Home section interactions initialized');

    // Initialize System Banner (functional app status indicators)
    new SystemBannerController(tabController);
    Logger.system('✅ System banner controller initialized');

    // Inject footers AFTER sections render (DRY optimization)
    injectFooters();

    // =================================================================
    // PHASE 3: BLOG RENDERER & ENHANCEMENTS
    // =================================================================
    // BlogRenderer must initialize FIRST — it populates .timeline-item entries.
    // Blog enhancements query those entries, so they must come AFTER.

    // Initialize BlogRenderer (Journal tab) - creates timeline entries in DOM
    new BlogRenderer('#timeline-container');
    Logger.system('✅ Blog renderer initialized');

    // Blog enhancements (all use deferred patterns: event delegation, IntersectionObserver, RAF)
    const blogDeepLink = new BlogDeepLink();
    new BlogHoverPreview('.timeline-phases');
    new BlogParallax('.timeline-phases');
    new BlogBackgrounds('.timeline-phases');
    new BlogHaptics('.timeline-phases');
    new BlogMeta();
    Logger.system('✅ Blog enhancements initialized (deep linking, hover previews, parallax, backgrounds, haptics, meta)');

    // Initialize Global Search (replaces old blog-specific search)
    new GlobalSearch();
    Logger.system('✅ Global search initialized (Cmd/Ctrl+K to open)');

    // Wire up deep linking to navigate on URL changes
    blogDeepLink.onNavigateChange((params: { entryId?: string; search?: string; filter?: string }) => {
        Logger.system('🔗 [DeepLink] Navigating to:', params);

        // Navigate to entry if present
        if (params.entryId) {
            const element = document.querySelector(`[data-id="${params.entryId}"]`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                element.classList.add('highlight-pulse');
                setTimeout(() => {
                    element.classList.remove('highlight-pulse');
                }, 2000);
            }
        }

        // Note: Search and filter params would need integration with BlogRenderer
        // For now, deep linking only supports entry navigation
    });

    // Manually trigger initial breadcrumb update to ensure it shows
    const initialTab = tabController.getActiveTab();
    tabController.setActiveTab(initialTab);

    // =================================================================
    // PHASE 4: INTERACTION & NAVIGATION
    // =================================================================
    // Scroll-based navigation and visual effects that enhance user interactions.

    // Use native CSS scroll-snap instead of SwipeController
    const tabPanelsContainer = document.querySelector('.tab-panels-container') as HTMLElement;
    if (tabPanelsContainer) {
        let scrollTimeout: number;
        tabPanelsContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                const scrollLeft = tabPanelsContainer.scrollLeft;
                const panelWidth = tabPanelsContainer.clientWidth || window.innerWidth;
                const currentIndex = Math.round(scrollLeft / panelWidth);
                const tabs = ['home', 'journal', 'workflow', 'spotlight', 'evolution', 'experiment', 'who'];
                const expectedTab = tabs[currentIndex];

                if (expectedTab && expectedTab !== tabController.getActiveTab()) {
                    tabController.setActiveTab(expectedTab);
                }
            }, 100); // Reduced from 150 for snappier response
        });
        Logger.system('✅ Scroll-snap navigation initialized');
    }

    // Initialize visual effects
    initTypingEffect();
    initTilt('.hero-banner .hero-banner-image', {
        container: '.hero-banner',
        limits: 15,
        perspective: 1000
    });
    initAnimatedStats();
    initPremiumAnimations();
    Logger.system('✅ Visual effects initialized');

    // =================================================================
    // PHASE 5: UTILITIES & OPTIMIZATION
    // =================================================================
    // Performance, analytics, and utility features that enhance the experience.

    initPerformanceOptimizations();
    initLoadStats();
    initAnalytics();
    initContentFeatures();
    initUXEnhancements();
    Logger.system('✅ Utilities initialized');

    // Initialize Gentle Nudges (scroll inactivity hints)
    const gentleNudges = new GentleNudges();
    (window as unknown as { gentleNudges: GentleNudges }).gentleNudges = gentleNudges; // Expose for debugging

    // Initialize Bougie Tracker (time since last bougie enhancement)
    const bougieTracker = new BougieTracker();
    (window as unknown as { bougieTracker: BougieTracker }).bougieTracker = bougieTracker; // Expose for debugging

    // =================================================================
    // PHASE 6: APP INTEGRATION (standalone only)
    // =================================================================
    // App switcher and state management for multi-app navigation.

    if (!isInShell) {
        initAppStateManager();
        Logger.system('✅ App State Manager initialized');

        // Initialize UV7 App Switcher (proper TypeScript version)
        const appSwitcher = new UV7AppSwitcher();
        window.uv7AppSwitcher = appSwitcher;
        Logger.system('🚀 UV7 App Switcher (BOUGIE EDITION) initialized');
    } else {
        Logger.system('⏭️ Skipping App Switcher (shell mode)');
    }

    // =================================================================
    // PHASE 7: UV7 OS (always, regardless of mode)
    // =================================================================
    // The UV7 OS navigation system that tracks timeline entries.
    // Must initialize AFTER BlogRenderer has processed timeline data.

    if (window.TIMELINE_DATA?.entries) {
        window.uv7os = new UV7OS('showcase', {
            entries: window.TIMELINE_DATA.entries as TimelineEntry[]
        });
        Logger.system('✅ UV7 OS initialized with', window.TIMELINE_DATA.entries.length, 'timeline entries');
    } else {
        // Fallback: create without timeline data (silent)
        window.uv7os = new UV7OS('showcase');
        Logger.system('✅ UV7 OS initialized (no timeline data)');
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
            } else if (action === 'toggle-theme') {
                // Toggle theme using shared ThemeManager
                import('../../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
                    const themeManager = getThemeManager();
                    themeManager.toggle();
                });
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
    new SystemStatsWidget();

    // Initialize UV7 Echo System (context-aware AI crew commentary)
    // Initialize UV7 Echo System (context-aware AI crew commentary)
    new UV7EchoSystem();
    Logger.system('✅ AI Crew echo system initialized');

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
    Logger.system('✅ Sidebar section navigation initialized');

    // Initialize Showcase Carousel (Spotlight tab)
    initShowcaseCarousel();
    Logger.system('✅ Showcase carousel initialized');

    // Initialize Code Comparison Modal (LAZY LOADED)
    // Create proxy that lazy loads on first method call
    let modalInstance: { open: (comparison: CodeComparison) => void } | null = null;
    (window as Window).codeComparisonModal = {
        open: (comparison: CodeComparison) => {
            (async () => {
                if (!modalInstance) {
                    Logger.system('[Lazy Loading] CodeComparisonModal...');
                    const { CodeComparisonModal } = await import('../components/CodeComparisonModal');
                    modalInstance = new CodeComparisonModal() as unknown as { open: (comparison: CodeComparison) => void };
                    Logger.system('✅ Code Comparison Modal loaded');
                }
                if (modalInstance) {
                    modalInstance.open(comparison);
                }
            })();
        },
        close: () => {
            // No-op for proxy
        }
    } as ICodeComparisonModal;
    Logger.system('✅ Code Comparison Modal proxy initialized (lazy)');

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
                        Logger.system(`[Showcase] Navigating to tab: ${tab}`);
                        window.tabController.navigateToTab(tab);
                    }
                    break;

                case 'quick-action':
                    // Handle quick actions
                    Logger.system(`[Showcase] Handling quick action: ${action}`);
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
                        case 'toggle-theme':
                            // Toggle theme using shared ThemeManager
                            import('../../shared/StatusBar/ThemeManager').then(({ getThemeManager }) => {
                                const themeManager = getThemeManager();
                                themeManager.toggle();
                            });
                            break;
                    }
                    break;

                case 'echo-settings':
                    // Trigger echo settings
                    Logger.system('[Showcase] Opening Echo settings');
                    const echoBtn = document.getElementById('echo-settings-trigger');
                    if (echoBtn) {
                        echoBtn.click();
                    }
                    break;

                case 'theme-change':
                    // Apply theme changes from shell
                    const { auto, theme } = event.data;
                    Logger.system(`[Showcase] Received theme change from shell: auto=${auto}, theme=${theme}`);

                    if (auto) {
                        // Clear overrides, let system preference win
                        document.body.classList.remove('light-mode', 'dark-mode');
                        Logger.system('[Showcase] Applied auto theme (cleared overrides)');
                    } else {
                        // Apply manual theme
                        if (theme === 'light') {
                            document.body.classList.add('light-mode');
                            document.body.classList.remove('dark-mode');
                            Logger.system('[Showcase] Applied light mode');
                        } else {
                            document.body.classList.add('dark-mode');
                            document.body.classList.remove('light-mode');
                            Logger.system('[Showcase] Applied dark mode');
                        }
                    }
                    break;
            }
        });
        Logger.system('✅ Parent message listener initialized');
    }

    Logger.system(`✅ Showcase fully initialized - ${isInShell ? 'SHELL' : 'STANDALONE'} mode`);
});
