/**
 * main.ts
 * Main entry point for UV7 Showcase.
 * Orchestrates all sub-modules.
 */
import './types'; // Import global type definitions
import { initChaosTyper } from './ChaosTyper';
import { initViewMode } from './ViewModeController';
import { initScrollAnimations } from './ScrollAnimator';
import { initSocialShare } from './SocialShare';
import { Sidebar } from './components/Sidebar';
import { NotificationShade } from './components/NotificationShade';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { WorkflowSection } from './components/WorkflowSection';
import { ResultsSection } from './components/ResultsSection';
import { SpotlightSection } from './components/SpotlightSection';
import { EvolutionSection } from './components/EvolutionSection';
import { WhoSection } from './components/WhoSection';

// Data
import { CODE_COMPARISONS } from './data/CodeSnippets';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Components
    const sidebar = new Sidebar();
    new NotificationShade();
    new HeroSection();

    // Initialize Code Comparison
    const initCodeComparison = (): void => {
        if (!window.codeComparisonModal) {
            console.warn('[CodeComparison] Modal not ready yet');
            return;
        }

        const buttons = document.querySelectorAll('.view-diff-button');
        console.log(`[CodeComparison] Found ${buttons.length} buttons`);

        buttons.forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                
                const id = btn.getAttribute('data-comparison-id');
                console.log(`[CodeComparison] Button clicked: ${id}`);
                
                if (id) {
                    const data = CODE_COMPARISONS[id];
                    if (data && window.codeComparisonModal) {
                        window.codeComparisonModal.open(data);
                    } else {
                        console.error(`[CodeComparison] No data found for: ${id}`);
                    }
                }
            });
        });

        console.log('[CodeComparison] Initialized successfully');
    };

    // Defer slightly to ensure DOM is ready
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
