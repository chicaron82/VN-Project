/**
 * ═══════════════════════════════════════════════════════════════
 * FUN METRICS DASHBOARD
 * Aggregates timeline data to show collaborative creation metrics
 * ═══════════════════════════════════════════════════════════════
 */

import type { TimelineEntry } from '../data/timeline/types';

export interface FunMetrics {
    totalDays: number;
    milestones: number;
    breakthroughs: number;
    debugSessions: number;
    experiments: number;
    cleanRefactors: number;
    crewContributions: Record<string, number>;
    totalFunFactor: number;
    averageFunFactor: number;
}

export class FunMetricsDashboard {
    private entries: TimelineEntry[];

    constructor(entries: TimelineEntry[]) {
        this.entries = entries;
    }

    /**
     * Calculate all fun metrics from timeline entries
     */
    calculateMetrics(): FunMetrics {
        const metrics: FunMetrics = {
            totalDays: this.entries.length,
            milestones: 0,
            breakthroughs: 0,
            debugSessions: 0,
            experiments: 0,
            cleanRefactors: 0,
            crewContributions: {},
            totalFunFactor: 0,
            averageFunFactor: 0,
        };

        // Process each entry
        this.entries.forEach((entry) => {
            // Count by type
            const type = (entry.type || '').toLowerCase();
            if (type.includes('milestone')) metrics.milestones++;
            if (type.includes('breakthrough')) metrics.breakthroughs++;
            if (type === 'debug' || type.includes('debug')) metrics.debugSessions++;
            if (type.includes('experiment') || entry.tags?.includes('experiment')) metrics.experiments++;
            if (type.includes('refactor') || type.includes('clean')) metrics.cleanRefactors++;

            // Track crew contributions
            if (entry.modelId) {
                metrics.crewContributions[entry.modelId] = (metrics.crewContributions[entry.modelId] || 0) + 1;
            }

            // Aggregate fun factor if available
            if (entry.scorecard?.funFactor) {
                metrics.totalFunFactor += entry.scorecard.funFactor;
            }
        });

        // Calculate average fun factor
        const entriesWithFunFactor = this.entries.filter(e => e.scorecard?.funFactor).length;
        metrics.averageFunFactor = entriesWithFunFactor > 0 ? Math.round(metrics.totalFunFactor / entriesWithFunFactor) : 0;

        return metrics;
    }

    /**
     * Render the metrics dashboard
     */
    render(): HTMLElement {
        const metrics = this.calculateMetrics();
        const dashboard = document.createElement('div');
        dashboard.className = 'fun-metrics-dashboard';

        // Crew color map
        const crewColors: Record<string, string> = {
            belle: 'rgba(255, 107, 157, 0.2)',
            dizee: 'rgba(102, 126, 234, 0.2)',
            tori: 'rgba(0, 204, 255, 0.2)',
            genzee: 'rgba(0, 255, 136, 0.2)',
        };

        const crewNames: Record<string, string> = {
            belle: 'Belle',
            dizee: 'DiZee',
            tori: 'Tori',
            genzee: 'Genzee',
        };

        const crewIcons: Record<string, string> = {
            belle: '💋',
            dizee: '⚡',
            tori: '❄️',
            genzee: '✨',
        };

        // Build crew contributions display
        let crewContributionsHTML = '';
        Object.entries(metrics.crewContributions)
            .sort(([, a], [, b]) => b - a)
            .forEach(([crew, count]) => {
                const name = crewNames[crew] || crew;
                const icon = crewIcons[crew] || '🤖';
                const color = crewColors[crew] || 'rgba(150, 150, 150, 0.2)';
                const percentage = Math.round((count / metrics.totalDays) * 100);
                crewContributionsHTML += `
                    <div class="crew-stat" style="background: ${color}; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">${icon} ${name}</span>
                            <span style="font-size: 0.9rem; opacity: 0.8;">${count} days (${percentage}%)</span>
                        </div>
                        <div style="height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden;">
                            <div style="height: 100%; background: currentColor; width: ${percentage}%; opacity: 0.7;"></div>
                        </div>
                    </div>
                `;
            });

        dashboard.innerHTML = `
            <div style="padding: 2rem; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(0, 204, 255, 0.05)); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.2); margin-bottom: 2rem;">
                <h3 style="font-size: 1.4rem; margin-bottom: 1.5rem; font-weight: 700;">📊 Days Having Fun: The Metrics</h3>

                <!-- Primary Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="metric-card" style="background: rgba(0, 255, 136, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #00ff88; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #00ff88;">${metrics.totalDays}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">Total Days</div>
                    </div>

                    <div class="metric-card" style="background: rgba(255, 107, 157, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #ff6b9d; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #ff6b9d;">${metrics.milestones}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">🎯 Milestones</div>
                    </div>

                    <div class="metric-card" style="background: rgba(255, 193, 7, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #ffc107; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #ffc107;">${metrics.breakthroughs}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">🔥 Breakthroughs</div>
                    </div>

                    <div class="metric-card" style="background: rgba(244, 67, 54, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #f44336; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #f44336;">${metrics.debugSessions}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">💀 Debug Hell</div>
                    </div>

                    <div class="metric-card" style="background: rgba(156, 39, 176, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #9c27b0; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #9c27b0;">${metrics.experiments}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">🧪 Experiments</div>
                    </div>

                    <div class="metric-card" style="background: rgba(76, 175, 80, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #4caf50; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: 700; color: #4caf50;">${metrics.cleanRefactors}</div>
                        <div style="font-size: 0.95rem; opacity: 0.8; margin-top: 0.5rem;">✨ Clean Refactors</div>
                    </div>
                </div>

                <!-- Crew Contributions Section -->
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <h4 style="font-size: 1.1rem; margin-bottom: 1rem; font-weight: 600;">🎭 Crew Contributions</h4>
                    ${crewContributionsHTML}
                </div>

                <!-- Fun Factor -->
                ${metrics.averageFunFactor > 0 ? `
                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 8px; text-align: center;">
                        <span style="opacity: 0.8;">Average Fun Factor:</span>
                        <span style="font-size: 1.3rem; font-weight: 700; margin-left: 0.5rem;">${metrics.averageFunFactor}/10 🎮</span>
                    </div>
                ` : ''}
            </div>
        `;

        return dashboard;
    }
}
