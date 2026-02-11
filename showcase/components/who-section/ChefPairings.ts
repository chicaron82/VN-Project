/**
 * ═══════════════════════════════════════════════════════════════
 * Chef Pairings - Interactive Pairing Cards
 *
 * Renders 1-2 "Best Paired With" cards per chef showing
 * complementary workflows. Clicking a pairing navigates the
 * carousel to that chef's spotlight.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

import type { CrewCardData } from './CrewCardData';
import { getCrewById, getCrewPortraitPath } from './CrewCardData';

export interface ChefPairingsCallbacks {
    onNavigate: (chefId: string) => void;
}

export class ChefPairings {
    constructor(private callbacks: ChefPairingsCallbacks) {}

    /** Render pairing cards for the given chef */
    public render(chef: CrewCardData): string {
        if (!chef.bestPairings || chef.bestPairings.length === 0) {
            return '';
        }

        const cards = chef.bestPairings.map(pairing => {
            const paired = getCrewById(pairing.chefId);
            if (!paired) return '';

            return `
                <div class="chef-pairing-card" data-paired-chef="${pairing.chefId}">
                    <div class="pairing-header">
                        <img
                            src="${getCrewPortraitPath(paired.portrait)}"
                            alt="${paired.name}"
                            class="pairing-portrait"
                            loading="lazy"
                        />
                        <span class="pairing-label">Best Paired With: ${paired.name}</span>
                    </div>
                    <p class="pairing-reason">${pairing.reason}</p>
                    <p class="pairing-workflow">${pairing.workflow}</p>
                    <button
                        class="pairing-navigate"
                        data-navigate-chef="${pairing.chefId}"
                        aria-label="See ${paired.name}'s profile"
                    >
                        See ${paired.name}'s Profile \u2192
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="chef-pairings-section">
                <h4 class="pairings-title">\uD83E\uDD1D Best Pairings</h4>
                <div class="pairings-grid">
                    ${cards}
                </div>
            </div>
        `;
    }

    /** Attach click handlers to pairing navigation buttons */
    public attachEventListeners(container: HTMLElement): void {
        container.querySelectorAll<HTMLButtonElement>('.pairing-navigate').forEach(btn => {
            btn.addEventListener('click', () => {
                const chefId = btn.dataset.navigateChef;
                if (chefId) {
                    this.callbacks.onNavigate(chefId);
                }
            });
        });

        // Also allow clicking the pairing card itself
        container.querySelectorAll<HTMLElement>('.chef-pairing-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't double-fire if they clicked the button
                if ((e.target as HTMLElement).closest('.pairing-navigate')) return;
                const chefId = card.dataset.pairedChef;
                if (chefId) {
                    this.callbacks.onNavigate(chefId);
                }
            });

            // Hover crosslink: glow the paired chef's portrait when hovering pairing card
            card.addEventListener('mouseenter', () => {
                const chefId = card.dataset.pairedChef;
                if (chefId) {
                    const portrait = document.querySelector(`.carousel-portrait[data-chef="${chefId}"]`);
                    portrait?.classList.add('pairing-hover');
                }
            });

            card.addEventListener('mouseleave', () => {
                const chefId = card.dataset.pairedChef;
                if (chefId) {
                    const portrait = document.querySelector(`.carousel-portrait[data-chef="${chefId}"]`);
                    portrait?.classList.remove('pairing-hover');
                }
            });
        });
    }
}
