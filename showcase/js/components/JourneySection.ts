export class JourneySection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-journey-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="journey-section">
                <!-- Hero Banner -->
                <div class="hero-banner journey">
                    <img src="media/banners/banner-journey.png" alt="Journey Banner" class="hero-banner-image">
                    <div class="hero-banner-particles">
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                    </div>
                    <div class="hero-banner-content">
                        <h1 class="hero-banner-title">The Journey</h1>
                        <p class="hero-banner-subtitle">From organic chaos to structured harmony in record time</p>
                    </div>
                </div>

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
