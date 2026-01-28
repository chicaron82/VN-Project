import { createBanner, BANNER_CONFIGS } from '../../lib/BannerGenerator';

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
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Building Version 848: The Complete Timeline</h2>
                    <p class="section-intro">
                        From first commit to final polish: how <strong>Version 848</strong> evolved
                        from a 50-day speedrun (V1) to a professional rebuild (V2). Every phase documented.
                    </p>
                    <p style="font-size: 1rem; margin-bottom: 2rem; opacity: 0.8;">
                        Toggle between <strong>Story Mode</strong> (chronological journey) and
                        <strong>Dev Log</strong> (reverse timeline) to see how the game came together.
                    </p>

                    <!-- Timeline entries loaded dynamically from timeline.json -->
                    <div class="timeline" id="timeline-container">
                        <!-- Timeline will be populated by TimelineRenderer -->
                    </div>
                </div>
            </section>
        `;
    }
}
