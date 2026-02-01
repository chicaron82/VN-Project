import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { FunMetricsDashboard } from './FunMetricsDashboard';
import { TIMELINE_DATA } from '../data/timeline';

export class JourneySection {
    constructor() {
        this.render();
        this.initMetricsDashboard();
    }

    private initMetricsDashboard(): void {
        // Inject metrics dashboard after content loads
        setTimeout(() => {
            const container = document.getElementById('timeline-container');
            if (container && container.parentElement) {
                const dashboard = new FunMetricsDashboard(TIMELINE_DATA.entries);
                const dashboardEl = dashboard.render();
                container.parentElement.insertBefore(dashboardEl, container);
            }
        }, 500);
    }

    render(): void {
        const mount = document.getElementById('uv7-journey-mount');
        console.log('[JourneySection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="journey-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.journey)}

                <div class="section-content">
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">⏰ The 50+ Days: A Timeline of Collaborative Fun</h2>
                    <p class="section-intro">
                        Every day we had fun. Breakthroughs, debug hell, experiments, clean refactors, milestones—
                        all of it documented. This isn't just a dev log. It's a creative journey where a non-coder and eight AI collaborators
                        built something neither could have alone.
                    </p>
                    <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.8;">
                        Toggle between <strong>Story Mode</strong> (chronological journey, day 1→today) and
                        <strong>Dev Log</strong> (reverse timeline, today→day 1) to experience the evolution of collaborative creativity.
                    </p>

                    <!-- Metrics dashboard will be injected here -->
                    <!-- Timeline entries loaded dynamically from timeline.json -->
                    <div class="timeline" id="timeline-container">
                        <!-- Timeline will be populated by TimelineRenderer -->
                    </div>
                </div>
            </section>
        `;
    }
}
