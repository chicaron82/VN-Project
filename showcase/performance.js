/**
 * Lazy Loading & Performance Optimizations
 * Handles image lazy loading and deferred script execution
 */

(function () {
    'use strict';

    // Lazy Loading for Images
    function initLazyLoading() {
        // Check for native lazy loading support
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.setAttribute('loading', 'lazy');
            });
        } else {
            // Fallback: Use Intersection Observer
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01
            });

            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Defer Non-Critical Scripts
    function deferNonCriticalScripts() {
        // This function can be used to load analytics, social widgets, etc.
        // after the page has fully loaded

        // Example: Load analytics after page load
        // const script = document.createElement('script');
        // script.src = 'analytics.js';
        // script.defer = true;
        // document.body.appendChild(script);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLazyLoading();
            deferNonCriticalScripts();
        });
    } else {
        initLazyLoading();
        deferNonCriticalScripts();
    }

    // Export for manual use if needed
    window.showcasePerformance = {
        initLazyLoading,
        deferNonCriticalScripts
    };
})();
