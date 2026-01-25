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

    // Initialize sidebar quick actions
    document.querySelectorAll('.quick-action').forEach((btn) => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            if (action === 'launch-v1') {
                window.location.href = '/VN-Project/v1/';
            } else if (action === 'launch-v2') {
                window.location.href = '/VN-Project/index.v2.html';
            } else if (action === 'go-home') {
                window.location.href = '/VN-Project/';
            } else if (action === 'toggle-mode') {
                // Toggle between story and dev mode
                const currentMode = document.body.dataset.viewMode || 'story';
                const newMode = currentMode === 'story' ? 'dev' : 'story';
                document.body.dataset.viewMode = newMode;
                localStorage.setItem('uv7-dev-mode', newMode);
            }
        });
    });

    // Initialize animated system stats (fake but cool!)
    const cpuVal = document.getElementById('sys-cpu');
    const cpuBar = document.getElementById('sys-cpu-bar');
    const ramVal = document.getElementById('sys-ram');
    const ramBar = document.getElementById('sys-ram-bar');

    if (cpuVal && cpuBar && ramVal && ramBar) {
        setInterval(() => {
            // CHAOS METER: jittery, spikes randomly (5-35%)
            const cpu = Math.floor(Math.random() * 30) + 5;
            // Bougie Factor: consistently high (85-95%) because we fancy 💅
            const ram = 85 + Math.floor(Math.random() * 10);
            
            cpuVal.textContent = `${cpu}%`;
            cpuBar.style.width = `${cpu}%`;
            ramVal.textContent = `${ram}%`;
            ramBar.style.width = `${ram}%`;
        }, 2000);
        console.log('✅ System stats animated (Bougie Factor: Always High)');
    }

    // Initialize AI Crew Echo Messages (stock ticker style)
    const crewMessages = [
        '� Zee: "V2 architecture complete. EventBus is live. No jQuery was harmed."',
        '🎨 DiZee: "Found the bug. Fixed the bug. Refactored the entire module. You\'re welcome."',
        '📊 Tori: "The emotional core needs more depth here. Let me rewrite this scene."',
        '🔮 ZeeRah: "Echo memory system detecting timeline anomalies... again."',
        '🔍 Belle: "NO FLICKER protocol engaged. Accessibility: 100%. Polish: Michelin-level."',
        '⚡ GenZee: "Let\'s try something crazy. What could go wrong?"',
        '📚 PerplexiZee: "According to 47 sources, there\'s a better way to do this."',
        '🔧 CoZee: "Bridging systems... translating between AI dialects... done."',
        '💎 UV7 System: "All systems nominal. Bougie Factor: Critically High."',
        '🎮 V1: "Remember when everything was in one file? Simpler times."',
        '⚙️ V2: "Type-safe, event-driven, scalable. This is the way."',
        '🌟 The Crew: "8 AIs, 1 codebase, infinite opinions, zero jQuery."'
    ];
    
    let messageIndex = 0;
    const statusDetail = document.getElementById('uv7-detail');
    
    if (statusDetail) {
        setInterval(() => {
            messageIndex = (messageIndex + 1) % crewMessages.length;
            statusDetail.textContent = crewMessages[messageIndex];
        }, 8000); // Change message every 8 seconds
        console.log('✅ AI Crew echo messages initialized');
    }

    // Initialize sidebar section navigation
    const sectionNavItems = document.querySelectorAll('.section-nav-item[data-tab]');
    sectionNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
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
