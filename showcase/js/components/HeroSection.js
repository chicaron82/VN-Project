import { MobileSliderController } from '../mobile-slider.js';

/**
 * HeroSection Component (Split Slider)
 * Renders the "Chaos vs Order" comparison slider section.
 * Note: Logic for the slider is handled by ComparisonSlider.js
 */
export class HeroSection {
    constructor(containerId = 'uv7-hero-mount') {
        this.containerId = containerId;
        this.render();
        this.initController();
    }

    render() {
        const mount = document.getElementById(this.containerId);
        if (!mount) return;

        mount.innerHTML = `
        <!-- What is UV7? Intro Section -->
        <div class="split-container" id="hero-section">
            <!-- ==========================================
                 LAYER 1: CHAOS (VERSION 1) - THE BOTTOM
                 ========================================== -->
            <div class="layer-chaos">
                <div class="chaos-code-bg">
                    // UV7_legacy_core.js
                    // Initializing organic growth...
                </div>

                <div class="content-wrapper">
                    <div class="header-group">
                        <img src="./UnitedVoices7.png" alt="UV7 Logo" class="project-logo">
                        <h1>CHAOS<br>PROTOCOL</h1>
                    </div>
                    <p>
                        Built on passion, caffeine, and 2 AM brainstorming sessions.
                        Structure was optional. Innovation was mandatory.
                        The organic evolution of UV7.
                    </p>

                    <div class="info-grid">
                        <div class="card clickable" data-section="workflow-section">
                            <h3>ARCHITECTURE</h3>
                            <p>Improvised. "If it works, don't touch it."</p>
                        </div>
                        <div class="card clickable" data-section="results-section">
                            <h3>DATA</h3>
                            <p>Hardcoded in JavaScript functions. Everywhere.</p>
                        </div>
                        <div class="card clickable" data-section="evolution-section">
                            <h3>TEAM</h3>
                            <p>A loose collective of AI personas arguing over features.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==========================================
                 LAYER 2: ORDER (VERSION 2) - THE TOP
                 ========================================== -->
            <div class="layer-order">
                <div class="order-diagram-bg"></div>
                <div class="order-code-bg">// UV7_v2_core.ts
                    // System ready.</div>

                <div class="content-wrapper">
                    <div class="header-group">
                        <div style="width: 100px;"></div> <!-- Spacer for logo balance -->
                        <h1>STRUCTURED<br>HARMONY</h1>
                    </div>
                    <p>
                        Reimagined with purpose. Type-safe, event-driven, and scalable.
                        The disciplined rebuild of a chaotic masterpiece.
                    </p>

                    <div class="info-grid">
                        <div class="card clickable" data-section="workflow-section">
                            <h3>ARCHITECTURE</h3>
                            <p>EventBus, StateManager, and Component-based UI.</p>
                        </div>
                        <div class="card clickable" data-section="results-section">
                            <h3>DATA</h3>
                            <p>Pure JSON schemas validated at runtime.</p>
                        </div>
                        <div class="card clickable" data-section="evolution-section">
                            <h3>TEAM</h3>
                            <p>The UV7 Crew: Optimized, Assigned, and Unified.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==========================================
                 CONTROLS
                 ========================================== -->
            <div class="slider-handle">
                <div class="slider-knob" title="Drag or use ← → arrow keys" role="slider" aria-label="Version Comparison"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">⇄</div>
            </div>

            <!-- Scroll Down Indicator -->
            <div class="scroll-hint">
                <span>Scroll to explore</span>
                <div class="scroll-arrow">↓</div>
            </div>

        </div>
        `;
    }

    initController() {
        // Initialize the mobile slider controller now that HTML is in DOM
        // Delay slightly to ensure layout reflow if needed, though usually direct call is fine
        setTimeout(() => {
            new MobileSliderController();
        }, 50);
    }
}
