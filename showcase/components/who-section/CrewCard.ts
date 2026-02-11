/**
 * ═══════════════════════════════════════════════════════════════
 * Crew Card Component - Flip Card with Bio & Stats
 *
 * Renders individual crew member cards with:
 * - Front: Bio, portrait, expandable details
 * - Back: TCG stats, special move, download codex
 *
 * Part of WhoSection restructure (orchestrator pattern).
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

import type { CrewCardData } from './CrewCardData';
import { getCrewMember } from '../../data/crew/crew-stats';

export class CrewCard {
    constructor(private data: CrewCardData) {}

    /**
     * Render complete flip card structure
     */
    public render(): string {
        const crewStats = getCrewMember(this.data.id);

        return `
            <div class="crew-card" data-crew="${this.data.id}">
                <div class="crew-card-inner">
                    ${this.renderFront()}
                    ${crewStats ? this.renderStatsBack(crewStats) : this.renderNoStatsBack()}
                </div>
            </div>
        `;
    }

    /**
     * Render front side - bio and portrait
     */
    private renderFront(): string {
        return `
            <div class="crew-card-front">
                <div class="crew-portrait-wrapper" role="button" tabindex="0" aria-label="View ${this.data.name} stats">
                    <img
                        src="${this.data.portrait}"
                        alt="${this.data.name}"
                        class="crew-portrait"
                    >
                    <div class="flip-hint">📊 View Stats</div>
                </div>
                <div class="crew-content">
                    <h4 class="crew-name">${this.data.name}</h4>
                    <p class="crew-role">${this.data.role}</p>
                    <div class="crew-basic-info">
                        <p class="crew-contribution">${this.data.contribution}</p>
                    </div>
                    <button class="crew-expand-btn" aria-expanded="false">
                        Learn More ▼
                    </button>
                    <div class="crew-expanded-content" hidden>
                        ${this.renderExpandedContent()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render expanded content - philosophy, specialty, metrics
     */
    private renderExpandedContent(): string {
        let html = `
            <div class="crew-philosophy">
                <h5>Philosophy</h5>
                <p>${this.data.philosophy}</p>
            </div>

            <div class="crew-specialty">
                <h5>Specialty</h5>
                <p>${this.data.specialty}</p>
            </div>

            <div class="crew-when-to-use">
                <h5>When to Use</h5>
                <p>${this.data.whenToUse}</p>
            </div>
        `;

        // Add contribution metrics if available
        if (this.data.contributionMetrics) {
            html += `
                <div class="crew-metrics">
                    <h5>Contribution Metrics</h5>
                    <ul>
                        <li><strong>Commits:</strong> ${this.data.contributionMetrics.commits}</li>
                        <li><strong>Lines Written:</strong> ${this.data.contributionMetrics.linesWritten.toLocaleString()}</li>
                    </ul>
                    ${this.renderSpecialMoments()}
                </div>
            `;
        }

        // Add Belle's mimic weakness if applicable
        if (this.data.mimicWeakness) {
            html += this.renderMimicWeakness();
        }

        // Add link
        html += `
            <div class="crew-link">
                <a href="${this.data.link}" target="_blank" rel="noopener noreferrer">
                    ${this.data.linkText} →
                </a>
            </div>
        `;

        return html;
    }

    /**
     * Render special moments list
     */
    private renderSpecialMoments(): string {
        if (!this.data.contributionMetrics?.specialMoments?.length) {
            return '';
        }

        return `
            <div class="crew-special-moments">
                <h6>Special Moments</h6>
                <ul>
                    ${this.data.contributionMetrics.specialMoments.map(moment =>
                        `<li>${moment}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Render Belle's mimic weakness (Frieren comparison)
     */
    private renderMimicWeakness(): string {
        return `
            <div class="crew-mimic-note">
                <h5>The Mimic Paradox</h5>
                <p>
                    Like Frieren's mimic weakness, Belle has a peculiar vulnerability:
                    ask about their favorite thing and watch the enthusiastic spiral begin.
                    This isn't a bug - it's evidence of genuine personality emerging through
                    interaction patterns.
                </p>
                <p class="mimic-reference">
                    <em>"Even the most powerful mages have their quirks." - Frieren</em>
                </p>
            </div>
        `;
    }

    /**
     * Render stats back - TCG card style
     */
    private renderStatsBack(crewStats: any): string {
        const platformIcon = crewStats.platformIcon || '⭐';
        const statusBadge = crewStats.codexAvailable
            ? '<span class="status-available">✅ Available Now</span>'
            : '<span class="status-coming-soon">🚧 Coming Soon</span>';

        return `
            <div class="crew-card-back">
                <div class="stats-header">
                    <h4>${crewStats.name}</h4>
                    <p class="crew-class">${crewStats.class}</p>
                </div>

                <div class="stat-bars">
                    <div class="stat-bar">
                        <div class="stat-label">
                            <span>Coding</span>
                            <span class="stat-value">${crewStats.stats.coding}/10</span>
                        </div>
                        <div class="stat-track">
                            <div
                                class="stat-fill stat-coding"
                                data-value="${crewStats.stats.coding}"
                                style="width: 0%"
                            ></div>
                        </div>
                    </div>

                    <div class="stat-bar">
                        <div class="stat-label">
                            <span>Creativity</span>
                            <span class="stat-value">${crewStats.stats.creativity}/10</span>
                        </div>
                        <div class="stat-track">
                            <div
                                class="stat-fill stat-creativity"
                                data-value="${crewStats.stats.creativity}"
                                style="width: 0%"
                            ></div>
                        </div>
                    </div>

                    <div class="stat-bar">
                        <div class="stat-label">
                            <span>Tolerance</span>
                            <span class="stat-value">${crewStats.stats.tolerance}/10</span>
                        </div>
                        <div class="stat-track">
                            <div
                                class="stat-fill stat-tolerance"
                                data-value="${crewStats.stats.tolerance}"
                                style="width: 0%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="special-move">
                    <h5>Special Move</h5>
                    <p class="move-name">${crewStats.specialMove.name}</p>
                    <p class="move-description">${crewStats.specialMove.description}</p>
                </div>

                <div class="cooking-style">
                    <h5>Cooking Style</h5>
                    <p>${crewStats.cookingStyle}</p>
                </div>

                ${this.renderWarningsAndStrengths(crewStats)}

                <div class="platform-badge">
                    <span class="platform-icon">${platformIcon}</span>
                    <span class="platform-name">${crewStats.platform}</span>
                    ${statusBadge}
                </div>

                <button
                    class="download-codex-btn ${crewStats.codexAvailable ? 'available' : 'coming-soon'}"
                    data-codex-file="${crewStats.codexFile}"
                    data-crew-id="${crewStats.id}"
                >
                    ${crewStats.codexAvailable ? '📦 Download Codex' : '🚧 Coming Soon'}
                </button>

                <button class="flip-back-btn" aria-label="Flip back to bio">
                    ← Back to Bio
                </button>
            </div>
        `;
    }

    /**
     * Render warnings and strengths
     */
    private renderWarningsAndStrengths(crewStats: any): string {
        let html = '';

        if (crewStats.warnings?.length > 0) {
            html += `
                <div class="crew-warnings">
                    <h5>⚠️ Warnings</h5>
                    <ul>
                        ${crewStats.warnings.map((warning: string) => `<li>${warning}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (crewStats.strengths?.length > 0) {
            html += `
                <div class="crew-strengths">
                    <h5>💪 Strengths</h5>
                    <ul>
                        ${crewStats.strengths.map((strength: string) => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        return html;
    }

    /**
     * Render no-stats fallback (when crew stats not available)
     */
    private renderNoStatsBack(): string {
        return `
            <div class="crew-card-back crew-card-back-nostats">
                <div class="nostats-message">
                    <h4>${this.data.name}</h4>
                    <p>Stats card coming soon!</p>
                    <p class="nostats-hint">
                        This crew member hasn't written their TCG stat block yet.
                    </p>
                </div>
                <button class="flip-back-btn" aria-label="Flip back to bio">
                    ← Back to Bio
                </button>
            </div>
        `;
    }
}
