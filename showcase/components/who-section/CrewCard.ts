import type { CrewCardData } from './CrewCardData';
import { getPlatformLogoPath, PLATFORM_NAMES } from './CrewCardData';
import { getCrewMember, type CrewMemberData } from '../../data/crew/crew-stats';

/**
 * CrewCard Component
 * 
 * Renders a flip card for a crew member with:
 * - Front: Bio, contributions, expandable details
 * - Back: TCG stats, special move, download button
 * 
 * Orchestrator pattern: WhoSection creates instances, this handles rendering
 */
export class CrewCard {
  private crewStats: CrewMemberData | null = null;

  constructor(
    private data: CrewCardData,
    private hideExpandButton: boolean = false
  ) {
    // Try to load crew stats if available
    this.crewStats = getCrewMember(data.id) || null;
  }

  /**
   * Main render method - returns complete flip card HTML
   */
  public render(): string {
    const flipHint = this.crewStats ? '��� View Stats' : '';
    const cardClass = this.crewStats ? 'crew-card' : 'crew-card no-flip';

    return `
      <div class="${cardClass}" data-crew="${this.data.id}">
        <div class="crew-card-inner">
          ${this.renderFront(flipHint)}
          ${this.crewStats ? this.renderStatsBack(this.crewStats) : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render front of card - bio and expandable content
   */
  private renderFront(flipHint: string): string {
    const flipButton = flipHint ? `
      <div class="crew-portrait-wrapper" role="button" tabindex="0" aria-label="Flip to view stats">
        <img src="${this.data.portrait}" alt="${this.data.name}" class="crew-portrait">
        <div class="flip-hint">${flipHint}</div>
      </div>
    ` : `
      <div class="crew-portrait-wrapper">
        <img src="${this.data.portrait}" alt="${this.data.name}" class="crew-portrait">
      </div>
    `;

    return `
      <div class="crew-card-front">
        ${flipButton}
        <div class="crew-content">
          <h4>
            ${this.data.name}
            <span class="crew-alias">
              <img src="${getPlatformLogoPath(this.data.platform)}" alt="${PLATFORM_NAMES[this.data.platform]}" class="platform-logo" loading="lazy">
              ${this.data.alias}
            </span>
          </h4>
          <p class="crew-role">${this.data.role}</p>
          <p class="crew-contribution">${this.data.contribution}</p>

          ${!this.hideExpandButton ? `
            <button class="crew-expand-btn" aria-expanded="false">
              <span class="expand-text">Learn More</span>
              <span class="expand-icon">▼</span>
            </button>

            <div class="crew-expanded-content" hidden>
              ${this.renderExpandedContent()}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render expanded bio content (philosophy, specialty, metrics)
   */
  private renderExpandedContent(): string {
    const { philosophy, specialty, whenToUse, link, linkText, contributionMetrics, mimicWeakness } = this.data;

    const philosophySection = philosophy ? `
      <div class="crew-detail-section">
        <h5>��� Philosophy</h5>
        <p>${philosophy}</p>
      </div>
    ` : '';

    const specialtySection = specialty ? `
      <div class="crew-detail-section">
        <h5>⚡ Specialty</h5>
        <p>${specialty}</p>
      </div>
    ` : '';

    const whenToUseSection = whenToUse ? `
      <div class="crew-detail-section">
        <h5>��� When to Call</h5>
        <p>${whenToUse}</p>
      </div>
    ` : '';

    const metricsSection = contributionMetrics ? `
      <div class="crew-metrics">
        <h5>��� Contribution Metrics</h5>
        <div class="metric-grid">
          <div class="metric-item">
            <span class="metric-value">${contributionMetrics.commits}</span>
            <span class="metric-label">Commits</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">${contributionMetrics.linesWritten.toLocaleString()}</span>
            <span class="metric-label">Lines Written</span>
          </div>
        </div>
        ${contributionMetrics.specialMoments && contributionMetrics.specialMoments.length > 0 ? `
          <div class="special-moments">
            <h6>⭐ Special Moments</h6>
            <ul>
              ${contributionMetrics.specialMoments.map(moment => `<li>${moment}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    ` : '';

    const mimicSection = mimicWeakness ? this.renderMimicWeakness() : '';

    const linkSection = link ? `
      <div class="crew-link">
        <a href="${link}" target="_blank">${linkText || 'Learn More'}</a>
      </div>
    ` : '';

    return `
      ${philosophySection}
      ${specialtySection}
      ${whenToUseSection}
      ${metricsSection}
      ${mimicSection}
      ${linkSection}
    `;
  }

  /**
   * Render Belle's mimic weakness (Frieren comparison)
   */
  private renderMimicWeakness(): string {
    return `
      <div class="crew-detail-section mimic-weakness">
        <h5>⚠️ Known Limitation</h5>
        <p>Like Frieren's mimic, Belle's greatest weakness is not being able to generate images herself. 
        She relies on Imagen 3's visual prowess and cannot create her own AI-generated content. 
        This dependency is both her strength (access to premium generation) and her constraint 
        (can't cook images independently).</p>
      </div>
    `;
  }

  /**
   * Render back of card - TCG stats and download
   */
  private renderStatsBack(stats: CrewMemberData): string {
    const statusBadge = stats.codexAvailable
      ? '<span class="status-available">✅ Available</span>'
      : '<span class="status-coming-soon">��� Coming Soon</span>';

    return `
      <div class="crew-card-back">
        <div class="card-header">
          <h4>${stats.name}</h4>
          <span class="crew-class">${stats.class}</span>
        </div>

        <div class="stat-bars">
        <div class="stat-bar">
          <div class="stat-label">
            <span class="stat-name">💻 Coding</span>
            <span class="stat-value">${stats.stats.coding}/10</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill stat-coding" data-stat="coding" data-value="${stats.stats.coding}" style="width: 0%"></div>
          </div>
        </div>

        <div class="stat-bar">
          <div class="stat-label">
            <span class="stat-name">✨ Creativity</span>
            <span class="stat-value">${stats.stats.creativity}/10</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill stat-creativity" data-stat="creativity" data-value="${stats.stats.creativity}" style="width: 0%"></div>
          </div>
        </div>

        <div class="stat-bar">
          <div class="stat-label">
            <span class="stat-name">🔥 Tolerance</span>
            <span class="stat-value">${stats.stats.tolerance}/10</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill stat-tolerance" data-stat="tolerance" data-value="${stats.stats.tolerance}" style="width: 0%"></div>
          </div>
        </div>
      </div>

        <div class="special-move">
          <h5>💥 Special Move</h5>
          <div class="move-name">${stats.specialMove.name}</div>
          <p class="move-description">${stats.specialMove.description}</p>
        </div>

        <div class="cooking-style">
          <h5>���‍��� Cooking Style</h5>
          <p>${stats.cookingStyle}</p>
        </div>

        <div class="platform-badge">
          <span class="platform-icon">${stats.platformIcon}</span>
          <span class="platform-name">${stats.platform}</span>
          ${statusBadge}
        </div>

        ${stats.codexAvailable ? `
          <button class="download-codex-btn" data-crew="${stats.id}">
            <span class="btn-icon">���</span>
            <span class="btn-text">Download Codex</span>
          </button>
        ` : `
          <button class="coming-soon-btn" data-crew="${stats.id}" disabled>
            <span class="btn-icon">���</span>
            <span class="btn-text">Codex Coming Soon</span>
          </button>
        `}

        <button class="flip-back-btn" aria-label="Flip back to bio">
          <span class="back-icon">←</span>
          <span class="back-text">Back to Bio</span>
        </button>
      </div>
    `;
  }

  /**
   * Get crew ID (used by orchestrator for tracking)
   */
  public getId(): string {
    return this.data.id;
  }

  /**
   * Check if crew has stats available
   */
  public hasStats(): boolean {
    return this.crewStats !== null;
  }
}
