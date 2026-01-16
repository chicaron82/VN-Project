import { EventBus } from '@core/EventBus';

/**
 * ════════════════════════════════════════════════════════════════
 * PERFORMANCE MONITOR - V2 Port
 * Phase 21d: Performance Tracking System
 *
 * V1 Parity: performance-monitor.js (97 lines → ~130 lines)
 *
 * Purpose:
 * - Track execution time of critical operations
 * - Uses browser Performance API (mark, measure)
 * - Log performance summaries for debugging
 * - Lightweight monitoring with feature detection
 *
 * Features:
 * - mark(label): Set performance marker
 * - measure(name, start, end): Calculate duration between markers
 * - clear(): Clear all performance entries
 * - getEntries(): Retrieve all measurements
 * - logSummary(): Console log all measurements
 *
 * V1 Parity Notes:
 * - All static methods preserved
 * - Console logging format identical
 * - Feature detection for browser support
 * - Error handling on measure()
 *
 * ⏱️ "Track everything. Optimize what matters."
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface PerformanceMonitorEntry {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
}

export class PerformanceMonitor {
    // @ts-expect-error - Reserved for future EventBus integration
    private static eventBus: EventBus | null = null;

    /**
     * Initialize PerformanceMonitor with EventBus (for future integration)
     * V1 Parity: Not in V1, but added for V2 consistency
     */
    public static initialize(eventBus: EventBus): void {
        PerformanceMonitor.eventBus = eventBus;
        console.log('⏱️ PerformanceMonitor initialized');
    }

    // ========================================
    // MARK: Set Performance Marker
    // V1 Parity: performance-monitor.js lines 11-23
    // ========================================

    /**
     * Set a performance marker at the current time.
     * @param label - Unique identifier for this marker
     */
    public static mark(label: string): void {
        if (typeof performance !== 'undefined' && performance.mark) {
            try {
                performance.mark(label);
            } catch (error) {
                console.warn(`⚠️ PerformanceMonitor: Failed to mark "${label}"`, error);
            }
        } else {
            // Fallback: Performance API not available
            console.warn('⚠️ PerformanceMonitor: Performance API not available');
        }
    }

    // ========================================
    // MEASURE: Calculate Duration Between Markers
    // V1 Parity: performance-monitor.js lines 25-42
    // ========================================

    /**
     * Measure duration between two markers and log result.
     * @param name - Name for this measurement
     * @param startMark - Label of start marker
     * @param endMark - Label of end marker
     * @returns Duration in milliseconds (or null if failed)
     */
    public static measure(name: string, startMark: string, endMark: string): number | null {
        if (typeof performance === 'undefined' || !performance.measure) {
            console.warn('⚠️ PerformanceMonitor: Performance API not available');
            return null;
        }

        try {
            performance.measure(name, startMark, endMark);

            // Retrieve the measurement
            const measures = performance.getEntriesByName(name);
            if (measures.length === 0) {
                console.warn(`⚠️ PerformanceMonitor: No measure found for "${name}"`);
                return null;
            }

            const measure = measures[measures.length - 1];
            if (!measure) {
                console.warn(`⚠️ PerformanceMonitor: Measure is undefined for "${name}"`);
                return null;
            }

            const duration = measure.duration;
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);

            return duration;
        } catch (error) {
            console.warn(`⚠️ PerformanceMonitor: Failed to measure "${name}"`, error);
            return null;
        }
    }

    // ========================================
    // CLEAR: Remove All Performance Entries
    // V1 Parity: performance-monitor.js lines 44-53
    // ========================================

    /**
     * Clear all performance marks and measures.
     */
    public static clear(): void {
        if (typeof performance !== 'undefined' && performance.clearMarks && performance.clearMeasures) {
            try {
                performance.clearMarks();
                performance.clearMeasures();
                console.log('🧹 PerformanceMonitor: Cleared all marks and measures');
            } catch (error) {
                console.warn('⚠️ PerformanceMonitor: Failed to clear entries', error);
            }
        } else {
            console.warn('⚠️ PerformanceMonitor: Performance API not available');
        }
    }

    // ========================================
    // GET ENTRIES: Retrieve All Measurements
    // V1 Parity: performance-monitor.js lines 55-66
    // ========================================

    /**
     * Get all performance entries (marks and measures).
     * @returns Array of performance entries
     */
    public static getEntries(): PerformanceMonitorEntry[] {
        if (typeof performance === 'undefined' || !performance.getEntries) {
            console.warn('⚠️ PerformanceMonitor: Performance API not available');
            return [];
        }

        try {
            const entries = performance.getEntries();
            return entries.map((entry) => ({
                name: entry.name,
                entryType: entry.entryType,
                startTime: entry.startTime,
                duration: entry.duration,
            }));
        } catch (error) {
            console.warn('⚠️ PerformanceMonitor: Failed to get entries', error);
            return [];
        }
    }

    // ========================================
    // LOG SUMMARY: Console Log All Measurements
    // V1 Parity: performance-monitor.js lines 68-80
    // ========================================

    /**
     * Log a summary of all performance measurements to console.
     */
    public static logSummary(): void {
        if (typeof performance === 'undefined' || !performance.getEntries) {
            console.warn('⚠️ PerformanceMonitor: Performance API not available');
            return;
        }

        try {
            const entries = performance.getEntries();

            console.log('⏱️ ═══════════════════════════════════════');
            console.log('⏱️ PERFORMANCE SUMMARY');
            console.log('⏱️ ═══════════════════════════════════════');

            // Filter and display measures only
            const measures = entries.filter((entry) => entry.entryType === 'measure');

            if (measures.length === 0) {
                console.log('⏱️ No measurements recorded');
            } else {
                measures.forEach((entry) => {
                    console.log(`  ${entry.name}: ${entry.duration.toFixed(2)}ms`);
                });
            }

            console.log('⏱️ ═══════════════════════════════════════');
        } catch (error) {
            console.warn('⚠️ PerformanceMonitor: Failed to log summary', error);
        }
    }
}
