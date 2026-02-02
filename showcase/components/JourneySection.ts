import { createBanner, BANNER_CONFIGS } from './BannerGenerator';

export class JourneySection {
    constructor() {
        this.render();
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
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">📔 The Developer Journal: 50+ Days of "What If"</h2>
                    <p class="section-intro">
                        Every day, another "what if" question. Every entry, a blog post documenting the discovery—
                        breakthroughs, debug hell, experiments, clean refactors, milestones. This isn't just a dev log.
                        It's the journal of how curiosity compounds when a non-coder and eight AI collaborators
                        couldn't stop asking questions.
                    </p>
                    <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.8;">
                        Toggle between <strong>Story Mode</strong> (chronological, day 1→today) and
                        <strong>Dev Log</strong> (reverse timeline, today→day 1) to experience the evolution from different angles.
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
