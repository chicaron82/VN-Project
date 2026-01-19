/**
 * Analytics & Performance Monitoring - Phase 4
 * Simple event tracking and performance metrics
 */

(function () {
    'use strict';

    // ==========================================
    // 1. ANALYTICS TRACKING
    // ==========================================

    const analytics = {
        events: [],

        track(category, action, label, value) {
            const event = {
                category,
                action,
                label,
                value,
                timestamp: new Date().toISOString()
            };

            this.events.push(event);
            console.log('📊 Analytics:', event);

            // In production, send to analytics service
            // Example: Google Analytics, Plausible, etc.
            // gtag('event', action, { event_category: category, event_label: label });
        },

        // Track section visibility
        trackSectionView(sectionName) {
            this.track('Section', 'View', sectionName);
        },

        // Track carousel interactions
        trackCarouselInteraction(cardTitle) {
            this.track('Carousel', 'View Card', cardTitle);
        },

        // Track button clicks
        trackButtonClick(buttonName) {
            this.track('Button', 'Click', buttonName);
        },

        // Track timeline interactions
        trackTimelineExpand(phaseName) {
            this.track('Timeline', 'Expand Phase', phaseName);
        },

        // Track search usage
        trackSearch(query) {
            this.track('Search', 'Query', query);
        },

        // Track share actions
        trackShare(platform) {
            this.track('Share', 'Click', platform);
        }
    };

    // ==========================================
    // 2. SECTION SCROLL TRACKING
    // ==========================================

    function initScrollTracking() {
        const sections = document.querySelectorAll('section[class*="-section"]');
        const tracked = new Set();

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

    function initInteractionTracking() {
        // Track carousel card clicks
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.technical-card');
            if (card) {
                const title = card.querySelector('h3')?.textContent;
                if (title) analytics.trackCarouselInteraction(title);
            }

            // Track timeline phase expansions
            const toggle = e.target.closest('.expand-toggle');
            if (toggle) {
                const phase = toggle.closest('.timeline-item');
                const title = phase?.querySelector('h3')?.textContent;
                if (title) analytics.trackTimelineExpand(title);
            }

            // Track share buttons
            if (e.target.closest('.btn-share')) {
                const platform = e.target.textContent.includes('X') ? 'Twitter' :
                    e.target.textContent.includes('Copy') ? 'Copy Link' : 'LinkedIn';
                analytics.trackShare(platform);
            }

            // Track CTA clicks
            const cta = e.target.closest('.fab-try-it, .hero-cta');
            if (cta) {
                analytics.trackButtonClick('Try It Live');
            }
        });

        // Track search usage
        const searchInput = document.getElementById('timeline-search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        analytics.trackSearch(e.target.value);
                    }
                }, 1000); // Debounce 1 second
            });
        }
    }

    // ==========================================
    // 4. PERFORMANCE MONITORING
    // ==========================================

    function monitorPerformance() {
        // Wait for page load
        window.addEventListener('load', () => {
            // Use Performance API
            // Use Performance API (Navigation Timing Level 2)
            if (performance.getEntriesByType) {
                const navEntry = performance.getEntriesByType("navigation")[0];
                if (navEntry) {
                    const loadTime = Math.round(navEntry.loadEventEnd || navEntry.duration); // duration is a safe fallback if loadEventEnd is 0
                    const domReady = Math.round(navEntry.domContentLoadedEventEnd);

                    console.log('⚡ Performance Metrics:');
                    console.log(`  Load Time: ${loadTime}ms`);
                    console.log(`  DOM Ready: ${domReady}ms`);

                    analytics.track('Performance', 'Page Load', 'Load Time', loadTime);

                    // Update UI if present (Showcase Results)
                    const v2Bar = document.getElementById('metric-load-v2-bar');
                    const v2Value = document.getElementById('metric-load-v2-value');

                    if (v2Bar && v2Value) {
                        // Calculate percentage against V1 baseline (approx 2.4s = 2400ms)
                        const v1Baseline = 2400;
                        const percentage = Math.min(100, Math.max(5, (loadTime / v1Baseline) * 100));

                        // Inverse logic: Less time = wider bar? No, usually performance bars are "time taken".
                        // But here, V1 is full width (2.4s). V2 should be proportional.
                        v2Bar.style.width = `${percentage}%`;
                        v2Value.textContent = `${(loadTime / 1000).toFixed(2)}s`;
                    }
                }
            } else if (window.performance && window.performance.timing) {
                // Fallback for older browsers
                const timing = window.performance.timing;
                const now = Date.now();
                const loadTime = now - timing.navigationStart; // Use current time avoiding 0 loadEventEnd
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

                console.log('⚡ Performance Metrics (Legacy):');
                console.log(`  Load Time: ${loadTime}ms`);
                console.log(`  DOM Ready: ${domReady}ms`);

                analytics.track('Performance', 'Page Load', 'Load Time', loadTime);
            }

            // Core Web Vitals (if supported)
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint (LCP)
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log(`📊 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
                        analytics.track('Performance', 'LCP', 'Largest Contentful Paint',
                            Math.round(lastEntry.renderTime || lastEntry.loadTime));
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    // LCP not supported
                }

                // First Input Delay (FID)
                try {
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            console.log(`📊 FID: ${entry.processingStart - entry.startTime}ms`);
                            analytics.track('Performance', 'FID', 'First Input Delay',
                                Math.round(entry.processingStart - entry.startTime));
                        });
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });
                } catch (e) {
                    // FID not supported
                }
            }
        });
    }

    // ==========================================
    // 5. ERROR TRACKING
    // ==========================================

    function initErrorTracking() {
        window.addEventListener('error', (e) => {
            console.error('❌ Error:', e.message, e.filename, e.lineno);
            analytics.track('Error', 'JavaScript Error', e.message);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Unhandled Promise Rejection:', e.reason);
            analytics.track('Error', 'Promise Rejection', String(e.reason));
        });
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('📊 Initializing analytics & monitoring...');

        initScrollTracking();
        initInteractionTracking();
        monitorPerformance();
        initErrorTracking();

        console.log('✅ Analytics & monitoring active');
    }

    init();

    // Export analytics for manual use
    window.showcaseAnalytics = analytics;
})();
