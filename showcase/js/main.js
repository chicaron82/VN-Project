
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
import { initTimelineComponents } from './TimelineComponents.js'; // See note below

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
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
    }
}
