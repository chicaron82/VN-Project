/**
 * HeroSection Component
 * Clean hero section without the comparison slider gimmick.
 * Comparison content is available in the Evolution tab.
 */
export class HeroSection {
    private containerId: string;

    constructor(containerId: string = 'uv7-hero-mount') {
        this.containerId = containerId;
        this.render();
        this.updateDynamicStats();
    }

    render(): void {
        const mount = document.getElementById(this.containerId);
        if (!mount) return;

        mount.innerHTML = `
        <!-- Hero Section -->
        <div class="hero-container" id="hero-section">
            <div class="hero-content">
                <div class="hero-header">
                    <img src="media/banners/UnitedVoices7.png" alt="UV7 Logo" class="hero-logo">
                    <h1 class="hero-title">Version 848</h1>
                    <p class="hero-subtitle">From Chaos to Harmony</p>
                </div>
                
                <p class="hero-description">
                    A visual novel rebuilt from passion to precision. 
                    What started as organic chaos became structured harmony—
                    601 tests, type-safe architecture, and the AI crew that made it happen.
                </p>

                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="stat-tests">601</span>
                        <span class="stat-label">Passing Tests</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-timeline">53</span>
                        <span class="stat-label">Timeline Entries</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="stat-days">16</span>
                        <span class="stat-label">Rebuild Days</span>
                    </div>
                </div>
            </div>

            <!-- Scroll Down Indicator -->
            <div class="scroll-hint">
                <span>Scroll to explore</span>
                <div class="scroll-arrow">↓</div>
            </div>
        </div>
        `;
    }

    updateDynamicStats(): void {
        // Update timeline count from global TIMELINE_DATA if available
        setTimeout(() => {
            const timelineEl = document.getElementById('stat-timeline');
            const daysEl = document.getElementById('stat-days');

            if (timelineEl && window.TIMELINE_DATA && window.TIMELINE_DATA.entries) {
                timelineEl.textContent = window.TIMELINE_DATA.entries.length.toString();
            }

            if (daysEl) {
                // Calculate days from Jan 8, 2026 to today
                const startDate = new Date('2026-01-08');
                const today = new Date();
                const daysDiff = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                daysEl.textContent = daysDiff.toString();
            }
        }, 100);
    }
}
