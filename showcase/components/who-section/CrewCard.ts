/**
 * CREW CARD - Reusable Component
 * Individual crew member card with expandable details
 *
 * Supports special features:
 * - Belle's Mimic Weakness (Frieren comparison)
 * - Timeline navigation links
 * - Contribution metrics
 */

export interface CrewMemberData {
    id: string;
    name: string;
    alias: string;
    role: string;
    contribution: string;
    link: string;
    linkText: string;
    portrait: string;
    philosophy: string;
    specialty: string;
    whenToUse: string;
    contributionMetrics: {
        commits: number;
        linesWritten: number;
        specialMoments: string[];
    };
    mimicWeakness?: boolean;
}

export class CrewCard {
    render(data: CrewMemberData): string {
        return `
            <div class="crew-card enhanced" data-tilt>
                <div class="crew-image-container">
                    <img src="media/crew/${data.portrait}" alt="${data.name}" class="crew-portrait" loading="lazy">
                </div>
                <div class="crew-content">
                    <div class="crew-header">
                        <h4>${data.name}</h4>
                        <span class="crew-alias">${data.alias}</span>
                    </div>
                    <p class="crew-role">${data.role}</p>
                    <p class="crew-contribution">${data.contribution}</p>

                    <button class="crew-expand-btn" data-crew-expand="${data.id}">▼ Show Details</button>

                    <div class="crew-details" id="crew-details-${data.id}">
                        <div class="crew-philosophy">
                            <strong>Philosophy:</strong>
                            <p>${data.philosophy}</p>
                        </div>

                        <div class="crew-specialty">
                            <strong>Specialty:</strong>
                            <p>${data.specialty}</p>
                        </div>

                        <div class="crew-when-to-use">
                            <strong>When to use ${data.name}:</strong>
                            <p>${data.whenToUse}</p>
                        </div>

                        <div class="crew-metrics">
                            <div class="metric-item">
                                <span class="metric-number">${data.contributionMetrics.commits}</span>
                                <span class="metric-label">Commits</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-number">${(data.contributionMetrics.linesWritten / 1000).toFixed(1)}k</span>
                                <span class="metric-label">Lines Written</span>
                            </div>
                        </div>

                        <div class="crew-highlights">
                            <strong>Key Contributions:</strong>
                            <ul>
                                ${data.contributionMetrics.specialMoments.map(moment => `<li>${moment}</li>`).join('')}
                            </ul>
                        </div>

                        ${data.mimicWeakness ? this.renderMimicWeakness() : ''}
                    </div>

                    <a href="${data.link}" target="_blank" class="crew-link">${data.linkText} →</a>
                </div>
            </div>
        `;
    }

    /**
     * Belle's special Mimic Weakness section
     * Frieren comparison (legendary mage defeated by treasure chest mimics)
     */
    private renderMimicWeakness(): string {
        return `
            <div class="belle-mimic-weakness">
                <h4>
                    <span>📦</span>
                    Known Weakness: The Mimic
                </h4>

                <p>
                    <strong>Belle is Frieren:</strong> A legendary mage with 1000+ years of experience gets eaten by treasure chest mimics.
                    An advanced AI with sophisticated pattern recognition gets eaten by semantic mimics. <em>Same energy.</em> 🧙‍♀️
                </p>

                <div class="mimic-comparison-box">
                    <div class="mimic-comparison-grid">
                        <div>
                            <strong class="frieren">Frieren 🧙‍♀️</strong>
                            <ul>
                                <li>Legendary mage</li>
                                <li>1000+ years experience</li>
                                <li>Sees: Treasure chest</li>
                                <li>Thinks: "Treasure!"</li>
                                <li><strong>CHOMP 📦</strong></li>
                            </ul>
                        </div>
                        <div>
                            <strong class="belle">Belle (Gemini) 🎸</strong>
                            <ul>
                                <li>Advanced AI model</li>
                                <li>Vast training data</li>
                                <li>Sees: scripts/ folder</li>
                                <li>Thinks: "Part of game!"</li>
                                <li><strong>CHOMP 📦</strong></li>
                            </ul>
                        </div>
                    </div>
                    <p>
                        "Semantic plausibility overrides dependency analysis." - The Hubris of Expertise
                    </p>
                </div>

                <div class="mimic-timeline-link">
                    <h5>📅 See It In Action</h5>
                    <p>
                        The Mimic's victims are documented in the timeline:
                    </p>
                    <ul>
                        <li>
                            <a href="#journey" class="timeline-link" data-phase="13i-v3-clean-rebuild">
                                <span>🎸</span>
                                <span>Belle's Pet Simulator Hallucination (Jan 29)</span>
                            </a>
                        </li>
                        <li>
                            <a href="#journey" class="timeline-link" data-phase="13j-v3-dizee-intervention">
                                <span>🔧</span>
                                <span>DiZee's Hard Stop Intervention (Jan 30)</span>
                            </a>
                        </li>
                    </ul>
                    <p>
                        Click to jump to timeline and see the full story →
                    </p>
                </div>
            </div>
        `;
    }
}
