/**
 * ════════════════════════════════════════════════════════════════
 * WORKFLOW SECTION - THE METHODOLOGY SHOWCASE (ORCHESTRATOR)
 * How UV7 was actually built: discovered systems through collaboration
 * ════════════════════════════════════════════════════════════════
 *
 * REFACTORED: Orchestrator pattern - delegates to focused modules
 * Pattern: Thin orchestrator (~120 lines) + subdirectory modules
 *
 * Components:
 * - WorkflowIntroSection: Hospitality → AI methodology intro
 * - MethodologyAccordion: All 8 expandable methodology sections
 * - WorkflowBenefitsSection: 4 benefit cards summary
 *
 * Event Handling:
 * - Methodology expand/collapse (toggle icons)
 * - Quick card navigation (scroll to sections with highlight)
 *
 * 💚🔥💀
 */

import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { Logger } from '@utils/Logger';
import { WorkflowIntroSection } from './workflow-section/WorkflowIntroSection';
import { MethodologyAccordion } from './workflow-section/MethodologyAccordion';
import { WorkflowBenefitsSection } from './workflow-section/WorkflowBenefitsSection';

export class WorkflowSection {
    // Module instances
    private introSection: WorkflowIntroSection;
    private methodologyAccordion: MethodologyAccordion;
    private benefitsSection: WorkflowBenefitsSection;

    constructor() {
        // Initialize all modules
        this.introSection = new WorkflowIntroSection();
        this.methodologyAccordion = new MethodologyAccordion();
        this.benefitsSection = new WorkflowBenefitsSection();

        this.render();
        this.attachExpandHandlers();
        this.attachQuickCardHandlers();
    }

    /**
     * Attach expand/collapse handlers for methodology sections
     */
    attachExpandHandlers(): void {
        document.querySelectorAll('.methodology-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const sectionId = target.dataset.section;
                const content = document.getElementById(`${sectionId}-content`);
                const icon = target.querySelector('.toggle-icon');

                if (content && icon) {
                    const isExpanded = content.classList.contains('expanded');
                    content.classList.toggle('expanded');
                    icon.textContent = isExpanded ? '▼' : '▲';
                }
            });
        });
    }

    /**
     * Attach click handlers for banner quick-access cards
     */
    attachQuickCardHandlers(): void {
        document.querySelectorAll('.banner-quick-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const scrollTo = target.dataset.scrollTo;

                if (scrollTo) {
                    const targetSection = document.getElementById(scrollTo);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Add highlight pulse
                        targetSection.classList.add('highlight-pulse');
                        setTimeout(() => {
                            targetSection.classList.remove('highlight-pulse');
                        }, 2000);
                    }
                }
            });
        });
    }

    /**
     * Render complete Workflow section
     */
    render(): void {
        const mount = document.getElementById('uv7-workflow-mount');
        Logger.ui('[WorkflowSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="workflow-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.workflow)}

                <div class="section-content">
                    <!-- Workflow Intro -->
                    ${this.introSection.render()}

                    <!-- Methodology Accordion (8 sections) -->
                    ${this.methodologyAccordion.render()}

                    <!-- Workflow Benefits Summary -->
                    ${this.benefitsSection.render()}
                </div>
            </section>
        `;

        // Inject quick cards into banner content area
        const bannerContent = mount.querySelector('.hero-banner-content');
        if (bannerContent) {
            const quickCardsHTML = `
                <div class="banner-quick-cards">
                    <div class="banner-quick-card" data-scroll-to="parallel-dev-section">
                        <span class="card-icon">💡</span>
                        <span class="card-label">Parallel Dev</span>
                    </div>
                    <div class="banner-quick-card" data-scroll-to="peer-review-section">
                        <span class="card-icon">🔍</span>
                        <span class="card-label">Blind Review</span>
                    </div>
                </div>
            `;
            bannerContent.insertAdjacentHTML('beforeend', quickCardsHTML);
        }

        Logger.ui('[WorkflowSection] Rendered workflow content');
    }
}
