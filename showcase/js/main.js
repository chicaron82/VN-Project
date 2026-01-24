
/**
 * main.js
 * Main entry point for UV7 Showcase.
 * Orchestrates all sub-modules.
 */
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


// Data
import { CODE_COMPARISONS } from './data/CodeSnippets.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Components
    const sidebar = new Sidebar();
    new NotificationShade();
    new HeroSection();

    // Initialize Code Comparison
    const initCodeComparison = () => {
        if (!window.codeComparisonModal) {
            console.warn('[CodeComparison] Modal not ready yet');
            return;
        }

        const buttons = document.querySelectorAll('.view-diff-button');
        console.log(`[CodeComparison] Found ${buttons.length} buttons`);

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const id = btn.getAttribute('data-comparison-id');
                console.log(`[CodeComparison] Button clicked: ${id}`);
                
                const data = CODE_COMPARISONS[id];
                if (data) {
                    window.codeComparisonModal.open(data);
                } else {
                    console.error(`[CodeComparison] No data found for: ${id}`);
                }
            });
        });

        console.log('[CodeComparison] Initialized successfully');
    };

    // Defer slighty to ensure DOM is ready
    setTimeout(initCodeComparison, 500);

    // Core Sections
    new JourneySection();
    new WorkflowSection();
    new ResultsSection();
    new SpotlightSection();
    new EvolutionSection();
    new WhoSection();

    // 2. Initialize Logic & Interactivity
    initChaosTyper();
    initViewMode();
    initScrollAnimations();
    initSocialShare();

    // Initialize Code Comparison after sections have rendered
    // This needs to wait for EvolutionSection to mount its content
    requestAnimationFrame(() => {
        initCodeComparison();
    });

    console.log('[UV7 Showcase] Modules Initialized 🚀');
});
