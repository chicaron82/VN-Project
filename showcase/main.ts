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

// Import showcase components
import { TimelineRenderer } from './lib/TimelineRenderer';
import { TabController } from './lib/TabController';
import { SwipeController } from './lib/SwipeController';
import { initAppStateManager } from './lib/AppStateManager';
import { initShowcaseCarousel } from './lib/components/showcase-carousel';
import { initGrabHandle } from '../v2/ui/components/GrabHandle';
import { initUV7OS } from '../v2/ui/components/UV7OS';

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

// Initialize UV7 System and expose to window for legacy compatibility
const uv7System = createUV7System('showcase');
(window as any).UV7System = {
    EventBus,
    StatusBar,
    NotificationRail,
    createStatusBar: createUV7System, // Legacy API compatibility
};
(window as any).uv7Runtime = uv7System;

console.log('✅ UV7 System initialized');

// Initialize showcase components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing showcase components...');

    // Create status bar
    console.log('🚀 Initializing UV7 Status Bar...');
    (window as any).uv7Runtime = (window as any).UV7System.createStatusBar('status-bar-container', 'showcase');

    // Initialize Tab Navigation
    const tabController = new TabController();
    (window as any).tabController = tabController; // Expose for legacy compatibility

    // Initialize TimelineRenderer (Journey tab)
    const timelineRenderer = new TimelineRenderer('#uv7-journey-mount');
    console.log('✅ Timeline renderer initialized');

    // Manually trigger initial breadcrumb update to ensure it shows
    const initialTab = tabController.getActiveTab();
    tabController.setActiveTab(initialTab);

    // Initialize Swipe Controller for tab navigation
    const tabPanelsContainer = document.querySelector('.tab-panels-container') as HTMLElement;
    if (tabPanelsContainer) {
        const swipeController = new SwipeController(tabController, tabPanelsContainer);
        (window as any).swipeController = swipeController;
        console.log('✅ Swipe controller initialized');
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

    // Initialize Grab Handle (for sidebar toggle)
    const sidebarToggle = document.getElementById('uv7-sidebar-toggle');
    if (sidebarToggle) {
        const grabHandle = initGrabHandle(sidebarToggle, {
            storageKey: 'uv7-grab-handle',
            headerSafeTop: 52,
            bottomSafePad: 140,
            onToggle: () => {
                // Toggle sidebar when grab handle is tapped
                if ((window as any).uv7os) {
                    (window as any).uv7os.toggleSidebar();
                }
            }
        });
        console.log('✅ Grab handle initialized');
    }

    // Initialize Showcase Carousel (Spotlight tab)
    initShowcaseCarousel();
    console.log('✅ Showcase carousel initialized');

    // Initialize UV7 OS (navigation system)
    // Note: This auto-initializes on DOMContentLoaded, so we just log
    console.log('✅ UV7 OS initialized');

    console.log('✅ Showcase fully initialized - all modules loaded');
});
