/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE STATS DASHBOARD
 *
 * Phase 2: Category statistics and visual breakdown
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Calculates and displays timeline entry statistics by category.
 *
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import type { TimelineEntry } from '../../data/timeline';

export interface CategoryStat {
    name: string;
    count: number;
    percentage: number;
    color: string;
    icon: string;
    filter: string; // The type value to filter by
}

export class TimelineStats {
    private entries: TimelineEntry[];
    private stats: CategoryStat[];
    private totalCount: number;

    constructor(entries: TimelineEntry[]) {
        this.entries = entries;
        this.totalCount = entries.length;
        this.stats = this.calculateStats();
    }

    /**
     * Calculate statistics for all categories
     */
    private calculateStats(): CategoryStat[] {
        // Count entries by type
        const typeCounts = new Map<string, number>();

        this.entries.forEach(entry => {
            const type = entry.type || 'other';
            typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        });

        // Define category mappings with colors and icons
        const categoryMap: Record<string, { name: string; color: string; icon: string }> = {
            'highlight': { name: 'Highlights', color: '#00ff88', icon: '⭐' },
            'order-entry': { name: 'Order', color: '#3498db', icon: '🔷' },
            'milestone': { name: 'Milestones', color: '#9b59b6', icon: '🎯' },
            'chaos': { name: 'Chaos', color: '#ff0066', icon: '⚡' },
            'chaos-entry': { name: 'Chaos', color: '#ff0066', icon: '⚡' },
            'insight': { name: 'Insights', color: '#f39c12', icon: '💡' },
            'image': { name: 'Media', color: '#1abc9c', icon: '📸' },
            'critical-entry': { name: 'Critical', color: '#e74c3c', icon: '🚨' },
            'alert': { name: 'Alerts', color: '#e67e22', icon: '⚠️' },
            'reality-check': { name: 'Reality Check', color: '#f1c40f', icon: '🔍' },
            'polish': { name: 'Polish', color: '#2ecc71', icon: '✨' },
            'personal': { name: 'Personal', color: '#e91e63', icon: '💜' },
            'architecture': { name: 'Architecture', color: '#34495e', icon: '🏗️' },
        };

        // Convert to CategoryStat array
        const stats: CategoryStat[] = [];

        // Merge chaos types
        const chaosCount = (typeCounts.get('chaos') || 0) + (typeCounts.get('chaos-entry') || 0);
        if (chaosCount > 0) {
            stats.push({
                name: 'Chaos',
                count: chaosCount,
                percentage: (chaosCount / this.totalCount) * 100,
                color: '#ff0066',
                icon: '⚡',
                filter: 'chaos'
            });
        }

        // Add other categories
        typeCounts.forEach((count, type) => {
            if (type === 'chaos' || type === 'chaos-entry') return; // Already handled

            const categoryInfo = categoryMap[type] || {
                name: type.charAt(0).toUpperCase() + type.slice(1),
                color: '#95a5a6',
                icon: '📋'
            };

            stats.push({
                name: categoryInfo.name,
                count,
                percentage: (count / this.totalCount) * 100,
                color: categoryInfo.color,
                icon: categoryInfo.icon,
                filter: type
            });
        });

        // Sort by count descending
        stats.sort((a, b) => b.count - a.count);

        return stats;
    }

    /**
     * Get all calculated stats
     */
    getStats(): CategoryStat[] {
        return this.stats;
    }

    /**
     * Get top N categories
     */
    getTopCategories(n: number = 5): CategoryStat[] {
        return this.stats.slice(0, n);
    }

    /**
     * Get total entry count
     */
    getTotalCount(): number {
        return this.totalCount;
    }

    /**
     * Render stats dashboard HTML
     */
    renderDashboard(): string {
        const topStats = this.getTopCategories(6);

        return `
            <div class="timeline-stats-dashboard">
                <div class="stats-header">
                    <h3 class="stats-title">📊 Development Overview</h3>
                    <p class="stats-subtitle">Browse ${this.totalCount} phases across the UV7 journey · Click any category to filter</p>
                </div>

                <div class="stats-grid">
                    <!-- Total count card -->
                    <div class="stat-card stat-total stats-show-all-btn">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value stat-count" data-count="${this.totalCount}">${this.totalCount}</div>
                        <div class="stat-label">Total Phases</div>
                        <div class="stat-bar">
                            <div class="stat-bar-fill" style="width: 100%; background: linear-gradient(90deg, #00ff88, #3498db, #9b59b6);"></div>
                        </div>
                    </div>

                    ${topStats.map(stat => `
                        <div class="stat-card" data-category="${stat.filter}">
                            <div class="stat-icon">${stat.icon}</div>
                            <div class="stat-value stat-count" data-count="${stat.count}">${stat.count}</div>
                            <div class="stat-label">${stat.name}</div>
                            <div class="stat-bar">
                                <div class="stat-bar-fill"
                                     style="width: ${stat.percentage}%; background: ${stat.color};"
                                     data-percentage="${stat.percentage.toFixed(1)}">
                                </div>
                            </div>
                            <div class="stat-percentage">${stat.percentage.toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

/**
 * Built with love. "Always. Always. Always." - Storm Dragon
 */
