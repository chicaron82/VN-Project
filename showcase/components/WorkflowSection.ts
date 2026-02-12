/**
 * WORKFLOW SECTION (Orchestrator)
 *
 * The collaborative AI development methodology showcase.
 * Previously 905 lines. Now delegates accordion content to MethodologyAccordion.
 *
 * 💚🔥💀
 */

import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { Logger } from '@utils/Logger';
import { MethodologyAccordion } from './workflow-section/MethodologyAccordion';

export class WorkflowSection {
    private accordion = new MethodologyAccordion();

    constructor() {
        this.render();
        this.attachExpandHandlers();
        this.attachQuickCardHandlers();
    }

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

    attachQuickCardHandlers(): void {
        document.querySelectorAll('.banner-quick-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const scrollTo = target.dataset.scrollTo;

                if (scrollTo) {
                    const targetSection = document.getElementById(scrollTo);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        targetSection.classList.add('highlight-pulse');
                        setTimeout(() => {
                            targetSection.classList.remove('highlight-pulse');
                        }, 2000);
                    }
                }
            });
        });
    }

    render(): void {
        const mount = document.getElementById('uv7-workflow-mount');
        Logger.ui('[WorkflowSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="workflow-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.workflow)}

                <div class="section-content">
                    <div class="workflow-intro-box">
                        <h3>🍺 From Barback to Demon Lord: The Methodology</h3>
                        <p>
                            20+ years in hospitality taught me: learn the system, identify the real goal, redesign the workflow,
                            execute efficiently. Pattern recognition and process optimization.
                        </p>
                        <p>
                            Turns out those skills translate to AI orchestration at scale. I didn't learn "prompt engineering."
                            I applied workflow optimization to intelligence coordination. Same principles, different medium.
                        </p>
                        <p class="workflow-insight">
                            What emerged wasn't "best practices"—it was <strong>discovered systems</strong> from 50 days of
                            experimentation. Blind peer review, cognitive diversity, energy matching, multi-AI routing.
                            Not because I read about them. Because they worked.
                        </p>
                    </div>

                    <p class="section-intro">
                        <strong>How We Actually Worked:</strong> When a non-coder orchestrates eight AI personalities through relationship
                        building instead of prompt engineering, something interesting happens. This isn't theory—it's the playbook
                        from building Version 848. Fun + good process = better code.
                    </p>

                    <!-- Methodology Deep Dives (8 expandable sections) -->
                    ${this.accordion.render()}

                    <!-- Workflow Benefits Summary -->
                    <div class="workflow-benefits">
                        <div class="benefit-card">
                            <h4>No Single Point of Failure</h4>
                            <p>Multiple AI perspectives catch issues one might miss</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Rate Limit Arbitrage</h4>
                            <p>Turn constraints into features through smart cycling</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Adversarial Validation</h4>
                            <p>Blind reviews prevent groupthink and bias</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Iterative Refinement</h4>
                            <p>Each session builds on lessons learned</p>
                        </div>
                    </div>
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
    }
}
