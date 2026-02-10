/**
 * Analytics & Performance Monitoring - Phase 4
 * Simple event tracking and performance metrics
 */

import { Logger } from '@utils/Logger';

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    timestamp: string;
}

interface Analytics {
    events: AnalyticsEvent[];
    track(category: string, action: string, label?: string, value?: number): void;
    trackSectionView(sectionName: string): void;
    trackCarouselInteraction(cardTitle: string): void;
    trackButtonClick(buttonName: string): void;
    trackTimelineExpand(phaseName: string): void;
    trackSearch(query: string): void;
    trackShare(platform: string): void;
}

declare global {
    interface Window {
        showcaseAnalytics?: Analytics;
    }
}

// ==========================================
// 1. ANALYTICS TRACKING
// ==========================================

const analytics: Analytics = {
    events: [],

    track(category: string, action: string, label?: string, value?: number): void {
        const event: AnalyticsEvent = {
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);
        Logger.system('📊 Analytics:', event);

        // In production, send to analytics service
        // Example: Google Analytics, Plausible, etc.
        // gtag('event', action, { event_category: category, event_label: label });
    },

    // Track section visibility
    trackSectionView(sectionName: string): void {
        this.track('Section', 'View', sectionName);
    },

    // Track carousel interactions
    trackCarouselInteraction(cardTitle: string): void {
        this.track('Carousel', 'View Card', cardTitle);
    },

    // Track button clicks
    trackButtonClick(buttonName: string): void {
        this.track('Button', 'Click', buttonName);
    },

    // Track timeline interactions
    trackTimelineExpand(phaseName: string): void {
        this.track('Timeline', 'Expand Phase', phaseName);
    },

    // Track search usage
    trackSearch(query: string): void {
        this.track('Search', 'Query', query);
    },

    // Track share actions
    trackShare(platform: string): void {
        this.track('Share', 'Click', platform);
    }
};

// ==========================================
// 2. SECTION SCROLL TRACKING
// ==========================================

function initScrollTracking(): void {
    const sections = document.querySelectorAll('section[class*="-section"]');
    const tracked = new Set<Element>();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !tracked.has(entry.target)) {
                const sectionName = entry.target.className.split(' ')[0];
                analytics.trackSectionView(sectionName);
                tracked.add(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// ==========================================
// 3. INTERACTION TRACKING
// ==========================================

function initInteractionTracking(): void {
    // Track carousel card clicks
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        const card = target.closest('.technical-card');
        if (card) {
            const title = card.querySelector('h3')?.textContent;
            if (title) analytics.trackCarouselInteraction(title);
        }

        // Track timeline phase expansions
        const toggle = target.closest('.expand-toggle');
        if (toggle) {
            const phase = toggle.closest('.timeline-item');
            const title = phase?.querySelector('h3')?.textContent;
            if (title) analytics.trackTimelineExpand(title);
        }

        // Track share buttons
        if (target.closest('.btn-share')) {
            const platform = target.textContent?.includes('X') ? 'Twitter' :
                target.textContent?.includes('Copy') ? 'Copy Link' : 'LinkedIn';
            analytics.trackShare(platform);
        }

        // Track CTA clicks
        const cta = target.closest('.fab-try-it, .hero-cta');
        if (cta) {
            analytics.trackButtonClick('Try It Live');
        }
    });

    // Track search usage
    const searchInput = document.getElementById('timeline-search-input') as HTMLInputElement;
    if (searchInput) {
        let searchTimeout: number;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = window.setTimeout(() => {
                const value = (e.target as HTMLInputElement).value;
                if (value.length > 2) {
                    analytics.trackSearch(value);
                }
            }, 1000); // Debounce 1 second
        });
    }
}

// ==========================================
// 4. PERFORMANCE MONITORING
// ==========================================

function monitorPerformance(): void {
    // Wait for page load
    window.addEventListener('load', () => {
        // Use Performance API (Navigation Timing Level 2)
        if (performance.getEntriesByType) {
            const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
            if (navEntry) {
                const loadTime = Math.round(navEntry.loadEventEnd || navEntry.duration);
                const domReady = Math.round(navEntry.domContentLoadedEventEnd);

                Logger.perf('⚡ Performance Metrics:');
                Logger.perf(`  Load Time: ${loadTime}ms`);
                Logger.perf(`  DOM Ready: ${domReady}ms`);

                analytics.track('Performance', 'Page Load', 'Load Time', loadTime);

                // Update UI if present (Showcase Results)
                const v2Bar = document.getElementById('metric-load-v2-bar') as HTMLElement;
                const v2Value = document.getElementById('metric-load-v2-value');

                if (v2Bar && v2Value) {
                    // Calculate percentage against V1 baseline (approx 2.4s = 2400ms)
                    const v1Baseline = 2400;
                    const percentage = Math.min(100, Math.max(5, (loadTime / v1Baseline) * 100));

                    v2Bar.style.width = `${percentage}%`;
                    v2Value.textContent = `${(loadTime / 1000).toFixed(2)}s`;
                }
            }
        }

        // Core Web Vitals (if supported)
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
                    Logger.perf(`📊 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
                    analytics.track('Performance', 'LCP', 'Largest Contentful Paint',
                        Math.round(lastEntry.renderTime || lastEntry.loadTime || 0));
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch {
                // LCP not supported
            }

            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
                        Logger.perf(`📊 FID: ${(entry.processingStart || 0) - entry.startTime}ms`);
                        analytics.track('Performance', 'FID', 'First Input Delay',
                            Math.round((entry.processingStart || 0) - entry.startTime));
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch {
                // FID not supported
            }
        }
    });
}

// ==========================================
// 5. ERROR TRACKING
// ==========================================

function initErrorTracking(): void {
    window.addEventListener('error', (e) => {
        Logger.error('❌ Error:', e.message, e.filename, e.lineno);
        analytics.track('Error', 'JavaScript Error', e.message);
    });

    window.addEventListener('unhandledrejection', (e) => {
        Logger.error('❌ Unhandled Promise Rejection:', e.reason);
        analytics.track('Error', 'Promise Rejection', String(e.reason));
    });
}

// ==========================================
// INITIALIZATION & EXPORT
// ==========================================

export function initAnalytics(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    init();
}

function init(): void {
    Logger.system('📊 Initializing analytics & monitoring...');

    initScrollTracking();
    initInteractionTracking();
    monitorPerformance();
    initErrorTracking();

    Logger.system('✅ Analytics & monitoring active');
}

// Export analytics for manual use
export { analytics as showcaseAnalytics };

// Expose globally for legacy compatibility
if (typeof window !== 'undefined') {
    window.showcaseAnalytics = analytics;
}
