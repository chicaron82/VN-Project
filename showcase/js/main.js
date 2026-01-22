
/**
 * main.js
 * Main entry point for UV7 Showcase.
 * Orchestrates all sub-modules.
 */
import { initComparisonSlider } from './ComparisonSlider.js';
import { initChaosTyper } from './ChaosTyper.js';
import { initViewMode } from './ViewModeController.js';
import { initScrollAnimations } from './ScrollAnimator.js';
import { initSocialShare } from './SocialShare.js';
import { Sidebar } from './components/Sidebar.js';
import { NotificationShade } from './components/NotificationShade.js';
import { HeroSection } from './components/HeroSection.js';
import { JourneySection } from './components/JourneySection.js';
import { WorkflowSection } from './components/WorkflowSection.js';
import { ResultsSection } from './components/ResultsSection.js';
import { SpotlightSection } from './components/SpotlightSection.js';
import { EvolutionSection } from './components/EvolutionSection.js';
import { WhoSection } from './components/WhoSection.js';


document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Components (Renders HTML structure)
    new Sidebar();
    new NotificationShade();
    new HeroSection();

    // Core Sections
    new JourneySection();
    new WorkflowSection();
    new ResultsSection();
    new SpotlightSection();
    new EvolutionSection();
    new WhoSection();

    // 2. Initialize Logic & Interactivity
    initComparisonSlider();
    initChaosTyper();
    initViewMode();
    initScrollAnimations();
    initSocialShare();
    initTimelineComponents();

    console.log('[UV7 Showcase] Modules Initialized 🚀');
});

/**
 * Legacy Timeline Initialization
 * (Moved here from script.js parity logic)
 */
function initTimelineComponents() {
    // Retry logic is less needed now that we render JourneySection synchronously above,
    // but kept for robustness.
    if (document.getElementById('timeline-container')) {
        // Ensure TimelineRenderer is loaded (it's a global class from TimelineRenderer.js)
        if (window.TimelineRenderer) {
            const renderer = new window.TimelineRenderer('#timeline-container');

            // Initialize Scrubber
            if (window.TimelineScrubber) {
                new window.TimelineScrubber('body', renderer);
            }
        } else {
            // It might be loaded defer, retry once
            setTimeout(() => {
                if (window.TimelineRenderer) {
                    const renderer = new window.TimelineRenderer('#timeline-container');
                    if (window.TimelineScrubber) new window.TimelineScrubber('body', renderer);
                }
            }, 500);
        }
    } else {
        console.warn('[Timeline] Container not found even after JourneySection init.');
    }
}
