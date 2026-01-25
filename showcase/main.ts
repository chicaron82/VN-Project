/**
 * UV7 SHOWCASE - MAIN ENTRY POINT
 *
 * Full Vite integration - imports V2 bridge directly from source.
 * All showcase components are now ES modules.
 *
 * "We went full Michelin. No regrets." - The Crew
 */

// Import V2 Bridge directly from source (no pre-built IIFE)
import { EventBus } from '../v2/core/EventBus';
import { StatusBar } from '../v2/ui/components/StatusBar';
import { NotificationRail } from '../v2/ui/components/NotificationRail';
import type { UV7Context } from '../v2/ui/components/StatusBarContext';
import { UV7AppSwitcher } from '../v2/ui/components/UV7AppSwitcher';
import { UV7OS } from '../v2/ui/components/UV7OS'; // Import the class directly

// Import showcase components
import { TimelineRenderer } from './lib/TimelineRenderer';
import { TabController } from './lib/TabController';
import { SwipeController } from './lib/SwipeController';
import { initAppStateManager } from './lib/AppStateManager';
import { initShowcaseCarousel } from './lib/components/showcase-carousel';
import { initGrabHandle } from '../v2/ui/components/GrabHandle';
// Remove initUV7OS since we'll create the instance directly

// Import section renderers
import { JourneySection } from './js/components/JourneySection';
import { WorkflowSection } from './js/components/WorkflowSection';
import { ResultsSection } from './js/components/ResultsSection';
import { SpotlightSection } from './js/components/SpotlightSection';
import { EvolutionSection } from './js/components/EvolutionSection';
import { WhoSection } from './js/components/WhoSection';

// Import effects
import { initTypingEffect } from './lib/effects/typing-effect';
import { initTilt } from '../v2/ui/effects/TiltEffect';
import { initAnimatedStats } from '../v2/ui/effects/AnimatedStats';
import { initPremiumAnimations } from './lib/effects/premium-animations';

// Import utilities
import { initPerformanceOptimizations } from './lib/utils/performance';
import { initLoadStats } from './lib/utils/load-stats';
import { initAnalytics } from './lib/utils/analytics';
import { initContentFeatures } from './lib/utils/content-features';
import { initUXEnhancements } from '../v2/ui/utils/UXEnhancements';

console.log('%c[SHOWCASE] Initializing...', 'background: #00ff88; color: black; font-weight: bold; padding: 4px;');

// Create UV7 System (same factory pattern as ShowcaseBridge)
function createUV7System(context: UV7Context = 'showcase') {
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

    // Create UV7 System after DOM is ready
    const uv7System = createUV7System('showcase');
    window.uv7Runtime = {
        ...uv7System,
        instance: uv7System.statusBar // TabController expects this
    };

    console.log('✅ UV7 System initialized');
    console.log('✅ UV7 Status Bar mounted and visible');
    uv7System.statusBar.show();

    // Initialize Tab Navigation
    const tabController = new TabController();
    window.tabController = tabController; // Expose for legacy compatibility

    // Initialize section renderers
    new JourneySection();
    new WorkflowSection();
    new ResultsSection();
    new SpotlightSection();
    new EvolutionSection();
    new WhoSection();
    console.log('✅ Section renderers initialized');

    // Initialize TimelineRenderer (Journey tab) - must be after JourneySection renders
    const timelineRenderer = new TimelineRenderer('#timeline-container');
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

    // Initialize App State Manager
    const appStateManager = initAppStateManager();
    console.log('✅ App State Manager initialized');

    // Initialize UV7 App Switcher (proper TypeScript version)
    const appSwitcher = new UV7AppSwitcher();
    window.uv7AppSwitcher = appSwitcher;
    console.log('🚀 UV7 App Switcher (BOUGIE EDITION) initialized');

    // Initialize Grab Handle (for sidebar toggle)
    const sidebarToggle = document.getElementById('uv7-sidebar-toggle');
    if (sidebarToggle) {
        const grabHandle = initGrabHandle(sidebarToggle, {
            storageKey: 'uv7-grab-handle',
            headerSafeTop: 52,
            bottomSafePad: 140,
            onToggle: () => {
                // Toggle sidebar when grab handle is tapped
                console.log('[GrabHandle] onToggle callback - window.uv7os:', window.uv7os);
                if (window.uv7os) {
                    window.uv7os.toggleSidebar();
                } else {
                    console.error('[GrabHandle] window.uv7os is not defined!');
                }
            }
        });
        console.log('✅ Grab handle initialized');
    }

    // Initialize sidebar navigation
    const sidebarApps = document.querySelectorAll('.sidebar-app[data-tab]');
    sidebarApps.forEach(app => {
        app.addEventListener('click', () => {
            const tab = app.getAttribute('data-tab');
            if (tab && window.tabController) {
                window.tabController.switchTab(tab);
                // Close sidebar after navigation
                if (window.uv7os) {
                    window.uv7os.closeSidebar();
                }
            }
        });
    });

    // Initialize Showcase Carousel (Spotlight tab)
    initShowcaseCarousel();
    console.log('✅ Showcase carousel initialized');

    // Initialize UV7 OS (navigation system) - must create instance directly
    // because we're already inside DOMContentLoaded
    if (window.TIMELINE_DATA?.entries) {
        window.uv7os = new UV7OS('showcase', {
            entries: window.TIMELINE_DATA.entries
        });
        console.log('✅ UV7 OS initialized with', window.TIMELINE_DATA.entries.length, 'timeline entries');
    } else {
        // Fallback: create without timeline data
        window.uv7os = new UV7OS('showcase');
        console.warn('⚠️ UV7 OS initialized without timeline data');
    }

    console.log('✅ Showcase fully initialized - all modules loaded');
});
