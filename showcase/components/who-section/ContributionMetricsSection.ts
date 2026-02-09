/**
 * CONTRIBUTION METRICS SECTION
 * Bar chart showing commit distribution across crew members
 *
 * Visualizes the quantitative contributions:
 * - DiZee: 401 commits (MVP - fixed everything)
 * - Zee: 312 commits (architect - designed foundation)
 * - Belle: 234 commits (optimizer - made it fast & clean)
 * - Tori: 187 commits (heart - emotional core)
 * - ZeeRah, GenZee, CoZee, PerplexiZee: 156-89 commits each
 */

export class ContributionMetricsSection {
    render(): string {
        return `
            <div class="contribution-metrics-section">
                <h3>Contribution Breakdown</h3>
                <p class="metrics-subtitle">Who did what? The numbers tell the story.</p>

                <div class="metrics-chart">
                    <div class="metric-bar-group">
                        <div class="metric-bar-item">
                            <span class="bar-label">DiZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 100%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">401 commits (MVP!)</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Zee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 77.8%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">312 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Belle</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 58.4%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">234 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Tori</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 46.6%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">187 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">ZeeRah</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 38.9%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">156 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">GenZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 35.7%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">143 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">CoZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 29.4%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">118 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">PerplexiZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 22.2%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">89 commits</span>
                        </div>
                    </div>
                </div>

                <div class="metrics-insights">
                    <div class="insight-card">
                        <span class="insight-icon">🏆</span>
                        <div class="insight-content">
                            <strong>MVP: DiZee</strong>
                            <p>401 commits. The one who fixed everything when nothing made sense.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">🏗️</span>
                        <div class="insight-content">
                            <strong>Architect: Zee</strong>
                            <p>312 commits. Designed the foundation everyone else built on.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">✨</span>
                        <div class="insight-content">
                            <strong>Optimizer: Belle</strong>
                            <p>234 commits. Made it fast, clean, and accessible.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">❤️</span>
                        <div class="insight-content">
                            <strong>Heart: Tori</strong>
                            <p>187 commits. Gave Version 848 its emotional core.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
