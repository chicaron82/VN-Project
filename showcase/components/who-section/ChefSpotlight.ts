/**
 * ═══════════════════════════════════════════════════════════════
 * Chef Spotlight - Active Chef Full Profile Renderer
 *
 * Renders the complete spotlight panel for the active chef:
 * bio, metrics, cooking style/specialty, collaboration example,
 * pairings, and extended quote. Delegates flip card to CrewCard
 * and pairings to ChefPairings.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

import type { CrewCardData } from './CrewCardData';
import { getCrewPortraitPath, CREW_DATA } from './CrewCardData';
import { CrewCard } from './CrewCard';
import { ChefPairings, type ChefPairingsCallbacks } from './ChefPairings';

export class ChefSpotlight {
    private pairings: ChefPairings;
    private onNavigate: (chefId: string) => void;

    constructor(pairingsCallbacks: ChefPairingsCallbacks) {
        this.pairings = new ChefPairings(pairingsCallbacks);
        this.onNavigate = pairingsCallbacks.onNavigate;
    }

    /** Render complete spotlight for the given chef */
    public render(chef: CrewCardData): string {
        return `
            <div class="spotlight-content" data-chef-id="${chef.id}">
                <div class="spotlight-layout">
                    <div class="spotlight-card-column">
                        ${this.renderFlipCard(chef)}
                    </div>
                    <div class="spotlight-info-column">
                        ${this.renderBio(chef)}
                        ${this.renderPhilosophy(chef)}
                        ${this.renderSpecialtyOrCooking(chef)}
                    </div>
                </div>

                ${this.renderMetrics(chef)}
                ${this.renderCollaboration(chef)}
                ${this.pairings.render(chef)}
                ${this.renderExtendedQuote(chef)}
            </div>
        `;
    }

    /** Attach event listeners (pairings, stat animations, crew name links) */
    public attachEventListeners(container: HTMLElement): void {
        this.pairings.attachEventListeners(container);
        this.animateEntrance(container);
        this.attachCrewNameLinks(container);
    }

    /** Attach click handlers to crew name links in collaboration text */
    private attachCrewNameLinks(container: HTMLElement): void {
        container.querySelectorAll<HTMLElement>('.crew-name-link').forEach(link => {
            link.addEventListener('click', () => {
                const chefId = link.dataset.crewId;
                if (chefId) {
                    this.onNavigate(chefId);
                }
            });
        });
    }

    // ─── Private Render Methods ──────────────────────────────

    private renderFlipCard(chef: CrewCardData): string {
        const cardData: CrewCardData = {
            ...chef,
            portrait: getCrewPortraitPath(chef.portrait),
        };
        const card = new CrewCard(cardData, true); // Hide expand button in carousel spotlight
        return card.render();
    }

    private renderBio(chef: CrewCardData): string {
        return `
            <div class="spotlight-bio">
                <div class="spotlight-name-row">
                    <h3 class="spotlight-name">${chef.name}</h3>
                    <span class="spotlight-alias">${chef.alias}</span>
                </div>
                <span class="spotlight-role" style="border-color: ${chef.signatureColor}; color: ${chef.signatureColor}">
                    ${chef.role}
                </span>
                <p class="spotlight-contribution">${chef.contribution}</p>
            </div>
        `;
    }

    private renderPhilosophy(chef: CrewCardData): string {
        return `
            <blockquote class="spotlight-philosophy" style="border-left-color: ${chef.signatureColor}">
                ${chef.philosophy}
            </blockquote>
        `;
    }

    private renderSpecialtyOrCooking(chef: CrewCardData): string {
        const sections: string[] = [];

        // Specialty & When to Use (all chefs)
        sections.push(`
            <div class="spotlight-specialty">
                <h4>Specialty</h4>
                <p>${chef.specialty}</p>
                <h4>When to Call</h4>
                <p>${chef.whenToUse}</p>
            </div>
        `);

        // Cooking approach (4 chefs) or specialty highlight (4 chefs)
        if (chef.cookingApproach) {
            const ca = chef.cookingApproach;
            sections.push(`
                <div class="spotlight-cooking-approach">
                    <h4>\uD83D\uDC68\u200D\uD83C\uDF73 Cooking Style: ${ca.approach}</h4>
                    <div class="cooking-details">
                        <span class="cooking-lines">${ca.lineCount} lines</span>
                        <ul>
                            ${ca.details.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                        <p class="cooking-quote">"${ca.quote}"</p>
                    </div>
                </div>
            `);
        } else if (chef.specialtyHighlight) {
            const sh = chef.specialtyHighlight;
            sections.push(`
                <div class="spotlight-specialty-highlight">
                    <h4>\u2B50 Specialty Dish</h4>
                    <p class="highlight-strength"><strong>Strength:</strong> ${sh.strength}</p>
                    <p class="highlight-example"><strong>Example:</strong> ${sh.example}</p>
                    <p class="highlight-when"><strong>Use when:</strong> ${sh.useWhen}</p>
                </div>
            `);
        }

        return sections.join('');
    }

    private renderMetrics(chef: CrewCardData): string {
        const m = chef.contributionMetrics;
        const maxCommits = 401; // DiZee's MVP count for percentage calculation

        return `
            <div class="spotlight-metrics">
                <h4>Contribution Metrics</h4>
                <div class="spotlight-stats-row">
                    <div class="spotlight-stat">
                        <span class="stat-counter" data-target="${m.commits}">0</span>
                        <span class="stat-label">Commits</span>
                    </div>
                    <div class="spotlight-stat">
                        <span class="stat-counter" data-target="${m.linesWritten}">0</span>
                        <span class="stat-label">Lines Written</span>
                    </div>
                </div>
                <div class="spotlight-commit-bar">
                    <div class="bar-track">
                        <div
                            class="bar-fill spotlight-bar-fill"
                            style="--target-width: ${(m.commits / maxCommits * 100).toFixed(1)}%; --bar-color: ${chef.signatureColor}"
                            data-width="${(m.commits / maxCommits * 100).toFixed(1)}%"
                        ></div>
                    </div>
                </div>
                <div class="spotlight-moments">
                    <h5>Special Moments</h5>
                    <ul>
                        ${m.specialMoments.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    private renderCollaboration(chef: CrewCardData): string {
        if (!chef.collaborationExample) return '';

        const ex = chef.collaborationExample;
        return `
            <div class="spotlight-collaboration">
                <h4>Collaboration in Action</h4>
                <div class="collab-card">
                    <div class="collab-header">
                        <span class="collab-problem">${ex.problem}</span>
                        <span class="collab-badge">${ex.badge}</span>
                    </div>
                    <p class="collab-role">${this.linkifyCrewNames(ex.role)}</p>
                    <p class="collab-result"><strong>Result:</strong> ${this.linkifyCrewNames(ex.result)}</p>
                </div>
            </div>
        `;
    }

    /** Replace crew member names in text with clickable links */
    private linkifyCrewNames(text: string): string {
        let result = text;

        // Build regex pattern from crew names (longest first to avoid partial matches)
        const crewNames = CREW_DATA.map(c => c.name).sort((a, b) => b.length - a.length);
        const pattern = new RegExp(`\\b(${crewNames.join('|')})\\b`, 'gi');

        result = result.replace(pattern, (match) => {
            // Find the crew member by name (case-insensitive)
            const crew = CREW_DATA.find(c => c.name.toLowerCase() === match.toLowerCase());
            if (!crew) return match;

            return `<span class="crew-name-link" data-crew-id="${crew.id}" style="color: ${crew.signatureColor}; cursor: pointer; text-decoration: underline dotted; text-underline-offset: 2px;">${match}</span>`;
        });

        return result;
    }

    private renderExtendedQuote(chef: CrewCardData): string {
        if (!chef.extendedQuote) return '';

        const q = chef.extendedQuote;
        return `
            <div class="spotlight-extended-quote">
                <blockquote class="extended-quote-text" style="border-left-color: ${chef.signatureColor}">
                    "${q.text}"
                </blockquote>
                <span class="extended-quote-context">\u2014 ${q.context}</span>
            </div>
        `;
    }

    // ─── Animations ──────────────────────────────────────────

    private animateEntrance(container: HTMLElement): void {
        // Animate stat counters
        container.querySelectorAll<HTMLElement>('.stat-counter').forEach(el => {
            const target = parseInt(el.dataset.target || '0', 10);
            this.countUp(el, 0, target, 1000);
        });

        // Animate commit bar
        container.querySelectorAll<HTMLElement>('.spotlight-bar-fill').forEach(bar => {
            const width = bar.dataset.width || '0%';
            requestAnimationFrame(() => {
                bar.style.width = width;
            });
        });
    }

    private countUp(el: HTMLElement, start: number, end: number, duration: number): void {
        const startTime = performance.now();
        const format = end >= 1000 ? (n: number) => n.toLocaleString() : (n: number) => String(n);

        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = format(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }
}
