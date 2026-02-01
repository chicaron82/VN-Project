/**
 * Lazy Loading & Performance Optimizations
 * Handles image lazy loading and deferred script execution
 */

// Lazy Loading for Images
function initLazyLoading(): void {
    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback: Use Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });

        const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// Defer Non-Critical Scripts
function deferNonCriticalScripts(): void {
    // This function can be used to load analytics, social widgets, etc.
    // after the page has fully loaded
}

// Initialize performance optimizations
export function initPerformanceOptimizations(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLazyLoading();
            deferNonCriticalScripts();
        });
    } else {
        initLazyLoading();
        deferNonCriticalScripts();
    }

    console.log('✅ Performance optimizations initialized');
}

// Export individual functions for manual use
export const showcasePerformance = {
    initLazyLoading,
    deferNonCriticalScripts
};
