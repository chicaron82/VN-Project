/**
 * UV7 SHOWCASE - MAIN ENTRY POINT (JavaScript Edition)
 *
 * Clean JavaScript rebuild - no build step required!
 * Just open index.html in a browser and it works.
 *
 * "Sometimes the best technical decision is undoing the previous one." - UV7 Methodology
 */

// Import V2 Bridge components (these stay as TypeScript in v2, that's okay)
import { EventBus } from '../v2/core/EventBus.js';
import { StatusBar } from '../v2/ui/components/StatusBar.js';
import { NotificationRail } from '../v2/ui/components/NotificationRail.js';
import { UV7AppSwitcher } from '../v2/ui/components/UV7AppSwitcher.js';

// Import showcase components (keeping .ts for now - browsers handle it)
import { TimelineRenderer } from './lib/TimelineRenderer.ts';
import { TabController } from './lib/TabController.ts';
import { SwipeController } from './lib/SwipeController.ts';
import { initAppStateManager } from './lib/AppStateManager.ts';
import { initShowcaseCarousel } from './lib/components/showcase-carousel.ts';
import { initGrabHandle } from '../v2/ui/components/GrabHandle.js';
import { initUV7OS } from '../v2/ui/components/UV7OS.js';

// Import section renderers (keeping .ts for now)
import { JourneySection } from './js/components/JourneySection.ts';
import { WorkflowSection } from './js/components/WorkflowSection.ts';
import { ResultsSection } from './js/components/ResultsSection.ts';
import { SpotlightSection } from './js/components/SpotlightSection.ts';
import { EvolutionSection } from './js/components/EvolutionSection.ts';
import { WhoSection } from './js/components/WhoSection.ts';

// Import effects (keeping .ts for now)
import { initTypingEffect } from './lib/effects/typing-effect.ts';
import { initTilt } from '../v2/ui/effects/TiltEffect.js';
import { initAnimatedStats } from '../v2/ui/effects/AnimatedStats.js';
import { initPremiumAnimations } from './lib/effects/premium-animations.ts';

// Import utilities (keeping .ts for now)
import { initPerformanceOptimizations } from './lib/utils/performance.ts';
import { initLoadStats } from './lib/utils/load-stats.ts';
import { initAnalytics } from './lib/utils/analytics.ts';
import { initContentFeatures } from './lib/utils/content-features.ts';
import { initUXEnhancements } from '../v2/ui/utils/UXEnhancements.js';

console.log('%c[SHOWCASE] Initializing...', 'background: #00ff88; color: black; font-weight: bold; padding: 4px;');

// Create UV7 System (same factory pattern as ShowcaseBridge)
function createUV7System(context = 'showcase') {
    const eventBus = new EventBus();

    // Status bar with dynamic context
    const statusBar = new StatusBar(eventBus);
    statusBar.setContext(context);

    // Notification rail
    const notificationRail = new NotificationRail(eventBus);

    // App switcher
    const appSwitcher = new UV7AppSwitcher(eventBus);

    return { eventBus, statusBar, notificationRail, appSwitcher };
}

// Initialize app state manager
const appStateManager = initAppStateManager();

// Initialize UV7 System
const uv7System = createUV7System('showcase');
console.log('✅ UV7 System initialized');

// Initialize UV7 OS (Navigation + Status Bar + Gestures)
initUV7OS({
    context: 'showcase',
    enableStatusBar: true,
    enableNotificationShade: true,
    enableSidebar: true,
    enableAppSwitcher: true
});
console.log('✅ UV7 OS initialized');

// Initialize grab handle (swipe-up indicator at bottom)
initGrabHandle();

// Initialize Tab Controller (with swipe navigation)
const tabController = new TabController({
    tabBarSelector: '.tab-bar',
    tabSelector: '.tab-btn',
    panelSelector: '.tab-panel',
    indicatorSelector: '.tab-indicator',
    enableSwipe: true
});

// Initialize Swipe Controller for horizontal tab navigation
const swipeController = new SwipeController({
    onSwipeLeft: () => tabController.nextTab(),
    onSwipeRight: () => tabController.previousTab()
});

// Initialize section components
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c[SHOWCASE] DOM Ready - Initializing sections...', 'color: #00ff88;');

    // Render all section components
    new JourneySection();
    new WorkflowSection();
    new ResultsSection();
    new SpotlightSection();
    new EvolutionSection();
    new WhoSection();

    console.log('✅ All sections rendered');

    // Initialize Timeline (Journey tab)
    const timelineRenderer = new TimelineRenderer();
    timelineRenderer.render();
    console.log('✅ Timeline rendered');

    // Initialize effects
    initTypingEffect();
    initTilt();
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

    // Initialize showcase carousel
    initShowcaseCarousel();
    console.log('✅ Showcase carousel initialized');

    console.log('%c[SHOWCASE] 🎉 Fully Initialized!', 'background: #00ff88; color: black; font-weight: bold; padding: 8px;');
    console.log('%cBuilt with the UV7 methodology: Chaos → Order → Polish', 'color: #888; font-style: italic;');
});

// Export for debugging
window.UV7Showcase = {
    tabController,
    swipeController,
    appStateManager,
    system: uv7System
};
