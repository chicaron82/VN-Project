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
                    <p class="section-intro">From organic chaos to structured harmony in record time.</p>

                    <!-- Timeline entries loaded dynamically from timeline.json -->
                    <div class="timeline" id="timeline-container">
                        <!-- Timeline will be populated by TimelineRenderer -->
                    </div>
                </div>
            </section>
        `;
    }
}
