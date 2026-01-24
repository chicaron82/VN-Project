/**
 * Global Window Interface Augmentation
 * Defines all custom window properties used across the showcase
 */

import type { CodeComparisonModal } from '../js/components/CodeComparisonModal';
import type { TabController } from '../lib/TabController';
import type { SwipeController } from '../lib/SwipeController';

declare global {
  interface Window {
    // ChaosTyper background context switching
    updateBackgroundContext?: (phaseId: string) => void;

    // Code comparison modal
    codeComparisonModal?: CodeComparisonModal;

    // Prism syntax highlighter (external library)
    Prism?: {
      highlightAll: () => void;
      highlightElement: (element: Element) => void;
    };

    // Confetti system
    uv7Confetti?: {
      trigger: (options?: any) => void;
    };

    // Social sharing functions
    shareTwitter?: () => void;
    copyLink?: () => void;
    shareLinkedIn?: () => void;

    // View mode toggle
    toggleViewMode?: () => void;

    // UV7 System bridge
    UV7System?: any; // TODO: Type this properly
    uv7Runtime?: any;

    // Tab navigation
    tabController?: TabController;
    swipeController?: SwipeController;

    // UV7 OS navigation
    uv7os?: {
      toggleSidebar: () => void;
    };

    // App state manager
    UV7AppStateManager?: any; // TODO: Type this properly

    // Game state (for code examples)
    gameState?: any;

    // Showcase analytics
    showcaseAnalytics?: any;

    // Load stats utility
    UV7Stats?: any;
    loadRealStats?: () => void;

    // Content features
    contentFeatures?: any;

    // Premium animations
    premiumAnimations?: any;

    // Spotlight carousel
    spotlightCarousel?: any;

    // App switcher
    UV7AppSwitcher?: any;
  }
}

export {};
