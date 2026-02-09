/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE HEATMAP
 *
 * Phase 9: GitHub-style activity heatmap for timeline
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Visual calendar heatmap of development activity
 * - Color intensity based on entry count per day
 * - Hover shows date + entry count
 * - Click to filter timeline to that date
 * - GitHub contribution graph aesthetic
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

interface DayActivity {
    date: string; // YYYY-MM-DD
    count: number;
    entries: string[]; // Entry IDs
}

export class BlogHeatmap {
    private heatmapContainer: HTMLElement | null;
    private activityMap: Map<string, DayActivity>;
    private maxCount: number;
    private onDateClick?: (date: string) => void;

    constructor(
        private timelineSelector: string = '.timeline-phases',
        private mountPoint: string = '.timeline-heatmap-mount'
    ) {
        this.heatmapContainer = null;
        this.activityMap = new Map();
        this.maxCount = 0;

        this.init();
    }

    private init(): void {
        this.parseActivity();
        this.createHeatmap();
        Logger.ui('🔥 [BlogHeatmap] Initialized with', this.activityMap.size, 'active days');
    }

    /**
     * Parse timeline entries and count by date
     */
    private parseActivity(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        const entries = timeline.querySelectorAll('.timeline-item');

        entries.forEach((entry, index) => {
            // Extract date from entry
            const headerElement = entry.querySelector('h3');
            const dateText = headerElement?.textContent?.trim() || '';

            // Parse date (format: "Phase X: Title (YYYY-MM-DD)")
            const dateMatch = dateText.match(/\((\d{4}-\d{2}-\d{2})\)/);
            if (!dateMatch) return;

            const date = dateMatch[1];
            const entryId = entry.id || `entry-${index}`;

            // Update activity map
            if (this.activityMap.has(date)) {
                const activity = this.activityMap.get(date)!;
                activity.count++;
                activity.entries.push(entryId);
            } else {
                this.activityMap.set(date, {
                    date,
                    count: 1,
                    entries: [entryId]
                });
            }

            // Track max count for color scaling
            const activity = this.activityMap.get(date)!;
            if (activity.count > this.maxCount) {
                this.maxCount = activity.count;
            }
        });
    }

    /**
     * Create heatmap visualization
     */
    private createHeatmap(): void {
        // Find or create mount point
        let mountPoint = document.querySelector(this.mountPoint);
        if (!mountPoint) {
            // Create mount point before timeline
            const timeline = document.querySelector(this.timelineSelector);
            if (timeline && timeline.parentElement) {
                mountPoint = document.createElement('div');
                mountPoint.className = 'timeline-heatmap-mount';
                timeline.parentElement.insertBefore(mountPoint, timeline);
            }
        }

        if (!mountPoint) return;

        this.heatmapContainer = document.createElement('div');
        this.heatmapContainer.className = 'timeline-heatmap';
        this.heatmapContainer.innerHTML = `
            <div class="heatmap-header">
                <h3>Development Activity</h3>
                <p>Click a day to filter timeline</p>
            </div>
            <div class="heatmap-grid"></div>
            <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-colors">
                    <div class="legend-box" data-level="0"></div>
                    <div class="legend-box" data-level="1"></div>
                    <div class="legend-box" data-level="2"></div>
                    <div class="legend-box" data-level="3"></div>
                    <div class="legend-box" data-level="4"></div>
                </div>
                <span>More</span>
            </div>
        `;

        mountPoint.appendChild(this.heatmapContainer);

        // Generate calendar grid
        this.generateGrid();
    }

    /**
     * Generate calendar grid
     */
    private generateGrid(): void {
        const grid = this.heatmapContainer?.querySelector('.heatmap-grid');
        if (!grid) return;

        // Get date range from activity map
        const dates = Array.from(this.activityMap.keys()).sort();
        if (dates.length === 0) return;

        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[dates.length - 1]);

        // Calculate weeks needed
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeksNeeded = Math.ceil(daysDiff / 7) + 1;

        for (let week = 0; week < weeksNeeded; week++) {
            const weekColumn = document.createElement('div');
            weekColumn.className = 'heatmap-week';

            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);

                // Skip if beyond end date
                if (currentDate > endDate) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'heatmap-day empty';
                    weekColumn.appendChild(emptyDay);
                    continue;
                }

                const dateStr = this.formatDate(currentDate);
                const activity = this.activityMap.get(dateStr);
                const level = activity ? this.getActivityLevel(activity.count) : 0;

                const dayElement = document.createElement('div');
                dayElement.className = `heatmap-day level-${level}`;
                dayElement.dataset.date = dateStr;
                dayElement.dataset.count = activity?.count.toString() || '0';
                dayElement.title = activity
                    ? `${dateStr}: ${activity.count} ${activity.count === 1 ? 'entry' : 'entries'}`
                    : `${dateStr}: No activity`;

                // Click handler
                if (activity) {
                    dayElement.addEventListener('click', () => {
                        this.handleDayClick(dateStr);
                    });
                    dayElement.style.cursor = 'pointer';
                }

                weekColumn.appendChild(dayElement);
            }

            grid.appendChild(weekColumn);
        }
    }

    /**
     * Get activity level (0-4) for color scaling
     */
    private getActivityLevel(count: number): number {
        if (count === 0) return 0;
        if (this.maxCount === 1) return 4; // If only 1 entry max, show as full

        const percentage = count / this.maxCount;
        if (percentage >= 0.75) return 4;
        if (percentage >= 0.5) return 3;
        if (percentage >= 0.25) return 2;
        return 1;
    }

    /**
     * Format date as YYYY-MM-DD
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Handle day click - filter timeline
     */
    private handleDayClick(date: string): void {
        Logger.ui('🔥 [BlogHeatmap] Clicked date:', date);

        // Trigger callback if provided
        if (this.onDateClick) {
            this.onDateClick(date);
        }

        // Filter timeline entries
        const activity = this.activityMap.get(date);
        if (!activity) return;

        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        const allEntries = timeline.querySelectorAll('.timeline-item');

        allEntries.forEach(entry => {
            const entryId = entry.id;
            if (activity.entries.includes(entryId)) {
                entry.classList.remove('search-hidden');
                entry.classList.add('heatmap-highlight');
            } else {
                entry.classList.add('search-hidden');
                entry.classList.remove('heatmap-highlight');
            }
        });

        // Scroll to first matching entry
        const firstEntry = document.getElementById(activity.entries[0]);
        if (firstEntry) {
            firstEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Set callback for date click
     */
    public onDateSelect(callback: (date: string) => void): void {
        this.onDateClick = callback;
    }

    /**
     * Clear filter
     */
    public clearFilter(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        const allEntries = timeline.querySelectorAll('.timeline-item');
        allEntries.forEach(entry => {
            entry.classList.remove('search-hidden', 'heatmap-highlight');
        });
    }

    /**
     * Destroy and cleanup
     */
    public destroy(): void {
        if (this.heatmapContainer) {
            this.heatmapContainer.remove();
            this.heatmapContainer = null;
        }
        Logger.ui('🔥 [BlogHeatmap] Destroyed');
    }
}
