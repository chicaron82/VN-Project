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

// Import effects
import { initTypingEffect } from './lib/effects/typing-effect';
import { initTiltEffect } from './lib/effects/tilt-effect';
import { initAnimatedStats } from './lib/effects/animated-stats';

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

    // Initialize visual effects
    initTypingEffect();
    initTiltEffect();
    initAnimatedStats();
    console.log('✅ Visual effects initialized');

    // TODO: Initialize SwipeController if needed
    // TODO: Initialize other components

    console.log('✅ Showcase initialized');
});
