/**
 * ════════════════════════════════════════════════════════════════
 * WHO SECTION - THE UV7 CREW SHOWCASE
 * Celebrating the AI collaboration that made Version 848 possible
 * ════════════════════════════════════════════════════════════════
 *
 * "The magic isn't 8 AIs—it's the workflow."
 *
 * This controller manages the interactivity for the static HTML
 * injected into index.html (Tilt effects, Expand/Collapse, Navigation).
 *
 * 💚🔥💀
 */

import { TiltEffect } from '../../v2/ui/effects/TiltEffect';

export class WhoSection {
    constructor() {
        console.log('👥 Initializing WhoSection Controller');
        this.initVisuals();
        this.attachEventListeners();
    }

    /**
     * Initialize visual effects (Tilt)
     */
    private initVisuals(): void {
        // Apply 3D tilt to all cards
        // Using the updated TiltEffect which accepts HTMLElements
        const cards = document.querySelectorAll('.creator-card, .crew-card, .philosophy-card');

        cards.forEach((card) => {
            // Check if it's already initialized to avoid duplicates (though constructor is safe)
            if (!(card as any)._uv7Tilt) {
                new TiltEffect(card as HTMLElement, {
                    limits: 10,
                    perspective: 1000,
                    scale: 1.02,
                    container: undefined // Use the card itself as container
                });
                (card as any)._uv7Tilt = true;
            }
        });
    }

    private attachEventListeners(): void {
        // Crew member expansion toggle
        document.querySelectorAll('[data-crew-expand]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget as HTMLButtonElement;
                const crewId = button.dataset.crewExpand;
                this.toggleCrewDetails(crewId, button);
            });
        });

        // Timeline links (e.g., from Belle's Mimic section)
        document.querySelectorAll('.timeline-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const phaseId = (e.currentTarget as HTMLElement).dataset.phase;
                this.navigateToTimelinePhase(phaseId);
            });
        });
    }

    /**
     * Toggle visibility of crew details
     */
    private toggleCrewDetails(crewId: string | undefined, button: HTMLButtonElement): void {
        if (!crewId) return;

        const detailsEl = document.getElementById(`crew-details-${crewId}`);
        if (!detailsEl) return;

        const isHidden = detailsEl.style.display === 'none';

        if (isHidden) {
            // Show
            detailsEl.style.display = 'block';
            detailsEl.style.opacity = '0';
            detailsEl.style.transform = 'translateY(-10px)';

            // Animate in
            requestAnimationFrame(() => {
                detailsEl.style.transition = 'all 0.3s ease-out';
                detailsEl.style.opacity = '1';
                detailsEl.style.transform = 'translateY(0)';
            });

            button.textContent = '▲ Hide Details';
            button.classList.add('active');
        } else {
            // Hide
            detailsEl.style.opacity = '0';
            detailsEl.style.transform = 'translateY(-10px)';

            // Wait for transition then hide
            setTimeout(() => {
                detailsEl.style.display = 'none';
            }, 300);

            button.textContent = '▼ Show Details';
            button.classList.remove('active');
        }
    }

    /**
     * Navigate to the Journey tab and highlight a phase
     */
    private navigateToTimelinePhase(phaseId: string | undefined): void {
        if (!phaseId) return;

        console.log(`🧭 Navigating to timeline phase: ${phaseId}`);

        // Switch tab
        if ((window as any).tabController) {
            (window as any).tabController.navigateToTab('journey');
        } else {
            // Fallback
            window.location.hash = '#journey';
        }

        // Try to find and scroll to the timeline entry
        // We wait a moment for the tab switch animation
        setTimeout(() => {
            // Using the DeepLink logic's attribute selector
            // Note: TimelineRenderer renders ID as `entry-${id}` or data-id?
            // Static HTML link uses data-phase
            const element = document.querySelector(`[data-id="${phaseId}"]`);

            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                element.classList.add('highlight-pulse');
                setTimeout(() => {
                    element.classList.remove('highlight-pulse');
                }, 2000);
            } else {
                console.warn(`[WhoSection] Could not find timeline entry: ${phaseId}`);
            }
        }, 300); // 300ms delay for tab switch
    }
}
