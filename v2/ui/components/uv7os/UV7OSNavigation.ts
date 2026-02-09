/**
 * UV7OS NAVIGATION - SECTION NAVIGATION & QUICK ACTIONS
 *
 * Handles section jumping, quick actions, view transitions, and app switcher.
 * Context-aware routing for showcase vs landing.
 *
 * "BELLE: The visual persistence of the status bar is non-negotiable." - The Navigator
 */

import type { UV7OSElements } from './UV7OSElements';
import { Logger } from '@utils/Logger';

/**
 * Dependencies injected by orchestrator (callback pattern)
 */
export interface UV7OSNavigationDependencies {
    context: 'showcase' | 'landing';
    closeShade: () => void;
    closeSidebar: () => void;
    detectCurrentMode?: () => void;  // Showcase only
}

/**
 * Quick action URL mapping
 */
interface ActionUrls {
    [key: string]: string;
}

export class UV7OSNavigation {
    constructor(
        private elements: UV7OSElements,
        private deps: UV7OSNavigationDependencies
    ) {}

    /**
     * Attach section navigation handlers (showcase only)
     */
    attachSectionNavHandlers(): void {
        const sectionNavButtons = document.querySelectorAll('.section-nav-item');
        sectionNavButtons.forEach(button => {
            const buttonElement = button as HTMLElement;
            buttonElement.addEventListener('click', () => {
                const sectionClass = buttonElement.dataset.section;
                if (sectionClass) {
                    this.jumpToSection(sectionClass);
                }
            });
        });
    }

    /**
     * Jump to a section in the page
     * Public method called by orchestrator
     */
    jumpToSection(sectionClass: string): void {
        // Support Tabbed Layout
        if (window.tabController) {
            const tabId = sectionClass.replace('-section', '');
            window.tabController.navigateToTab(tabId);
            this.deps.closeShade();
            this.deps.closeSidebar();
            return;
        }

        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            // Close shade/sidebar
            this.deps.closeShade();
            this.deps.closeSidebar();

            // Scroll to section (account for status bar)
            const yOffset = -44; // Status bar height
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    /**
     * Attach quick action handlers
     */
    attachQuickActions(): void {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            const actionType = (action as HTMLElement).dataset.action;
            if (actionType) {
                action.addEventListener('click', () => this.handleQuickAction(actionType));
            }
        });
    }

    /**
     * Handle quick action button clicks
     */
    handleQuickAction(actionType: string): void {
        // Get base path - robust detection for GitHub Pages
        const basePath = (window.location.hostname.includes('github.io') ||
            window.location.pathname.includes('/VN-Project/')) ? '/VN-Project' : '';

        Logger.system(`🔍 Base path detection: hostname=${window.location.hostname}, pathname=${window.location.pathname}, basePath=${basePath}`);

        // Context-specific action URLs
        const actionUrls: ActionUrls = this.deps.context === 'landing' ? {
            'launch-v1': `${basePath}/v1/index.html`,
            'launch-v2': `${basePath}/index.v2.html`,
            'view-showcase': `${basePath}/showcase/index.html`
        } : {
            'launch-v1': `${basePath}/v1/index.html`,
            'launch-v2': `${basePath}/index.v2.html`,
            'go-home': `${basePath}/index.html`
        };

        // Handle URL-based actions with view transitions
        const url = actionUrls[actionType];
        if (url) {
            this.navigateWithTransition(url);
            return;
        }

        // Handle special actions (showcase only)
        if (this.deps.context === 'showcase') {
            switch (actionType) {
                case 'toggle-mode':
                    const viewToggle = this.elements.viewToggle as HTMLInputElement | null;
                    if (viewToggle) {
                        viewToggle.click();
                        setTimeout(() => {
                            this.deps.detectCurrentMode?.();
                        }, 100);
                    }
                    break;
            }
        }
    }

    /**
     * Enable seamless transitions for all navigation
     * Intercepts link clicks and app card clicks to use View Transitions API
     * BELLE: "The visual persistence of the status bar is non-negotiable"
     */
    enableSeamlessTransitions(): void {
        // Check if browser supports View Transitions
        if (!(document as any).startViewTransition) {
            Logger.ui('📺 View Transitions not supported - using standard navigation');
            return;
        }

        Logger.ui('✨ View Transitions enabled - seamless navigation active');

        // Intercept all link and action clicks
        window.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            const appCard = target.closest('.app-card');

            // Handle regular links
            if (link && link.href && !link.target) {
                const href = link.href;
                // Only intercept same-origin or relative links
                if (href.startsWith(window.location.origin) || href.startsWith('/')) {
                    e.preventDefault();
                    this.navigateWithTransition(href);
                }
            }

            // Handle app cards with data-app attribute
            if (appCard) {
                const appType = (appCard as HTMLElement).dataset.app;
                if (appType) {
                    e.preventDefault();
                    const basePath = window.location.hostname.includes('github.io') ? '/VN-Project' : '';

                    const appUrls: { [key: string]: string } = {
                        'v1': `${basePath}/v1/index.html`,
                        'v2': `${basePath}/index.v2.html`,
                        'showcase': `${basePath}/showcase/index.html`
                    };

                    const url = appUrls[appType];
                    if (url) {
                        this.navigateWithTransition(url);
                    }
                }
            }
        });
    }

    /**
     * Navigate to a URL with View Transition animation
     * BELLE: "The visual persistence of the status bar is non-negotiable"
     */
    private navigateWithTransition(url: string): void {
        // Fallback for browsers without View Transitions
        if (!(document as any).startViewTransition) {
            window.location.href = url;
            return;
        }

        // Start the view transition
        (document as any).startViewTransition(() => {
            // This callback runs after the old state is captured
            // but before the new state is rendered
            window.location.href = url;
        });
    }

    /**
     * Initialize app switcher (landing only)
     * Delayed init to allow UV7AppSwitcher to load
     */
    initAppSwitcher(): void {
        setTimeout(() => {
            if (window.uv7AppSwitcher) {
                Logger.system('🔄 App Switcher detected, attaching status logo handler');
                // Handler is attached in orchestrator's attachHandlers
            } else {
                Logger.warn('⚠️ UV7AppSwitcher not loaded');
            }
        }, 100);
    }
}
