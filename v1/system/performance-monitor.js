// @ts-check
// ========================================
// PERFORMANCE MONITOR
// Lightweight performance tracking utility
// ========================================

/**
 * PerformanceMonitor - Track and log performance metrics
 * Uses the Performance API to measure execution times
 * 
 * @example
 * PerformanceMonitor.mark('scene-start');
 * // ... render scene
 * PerformanceMonitor.measure('scene-render', 'scene-start');
 */
class PerformanceMonitor {
    /**
     * Create a performance mark
     * @param {string} label - Unique label for this mark
     */
    static mark(label) {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(label);
        }
    }

    /**
     * Measure time between two marks
     * @param {string} name - Name for this measurement
     * @param {string} startMark - Starting mark label
     * @param {string} [endMark] - Ending mark label (optional, defaults to now)
     * @returns {number} Duration in milliseconds
     */
    static measure(name, startMark, endMark) {
        if (typeof performance === 'undefined' || !performance.measure) {
            return 0;
        }

        try {
            performance.measure(name, startMark, endMark);
            const measures = performance.getEntriesByName(name);
            if (measures.length > 0) {
                const duration = measures[measures.length - 1].duration;
                console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
                return duration;
            }
        } catch (error) {
            console.warn(`Failed to measure ${name}:`, error);
        }
        return 0;
    }

    /**
     * Clear all marks and measures
     */
    static clear() {
        if (typeof performance !== 'undefined') {
            if (performance.clearMarks) performance.clearMarks();
            if (performance.clearMeasures) performance.clearMeasures();
        }
    }

    /**
     * Get all performance entries
     * @returns {PerformanceEntry[]}
     */
    static getEntries() {
        if (typeof performance !== 'undefined' && performance.getEntries) {
            return performance.getEntries();
        }
        return [];
    }

    /**
     * Log performance summary
     */
    static logSummary() {
        const entries = this.getEntries();
        if (entries.length === 0) {
            console.log('📊 No performance data available');
            return;
        }

        console.group('📊 Performance Summary');
        entries
            .filter(entry => entry.entryType === 'measure')
            .forEach(entry => {
                console.log(`  ${entry.name}: ${entry.duration.toFixed(2)}ms`);
            });
        console.groupEnd();
    }
}

// Export for use in other modules
// @ts-ignore
window.PerformanceMonitor = PerformanceMonitor;
