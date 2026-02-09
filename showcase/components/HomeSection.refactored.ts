/**
 * ════════════════════════════════════════════════════════════════
 * HOME SECTION - THE GRAND ENTRANCE (ORCHESTRATOR)
 * Showcase's home section - main landing experience
 * ════════════════════════════════════════════════════════════════
 *
 * REFACTORED: Orchestrator pattern with LAZY LOADING
 * Pattern: Thin orchestrator (~150 lines) + lazy-loaded heavy modules
 *
 * Key Innovation: LAZY LOADING
 * - BootSequenceController (193 lines) - Only loads on first visit
 * - VNComparisonModal (180 lines) - Only loads on first toggle
 * - Reduces initial bundle size by ~370 lines for returning visitors
 *
 * Lazy Loading Pattern:
 * ```ts
 * if (!hasBooted) {
 *     const { BootSequenceController } = await import('./home-section/BootSequenceController');
 *     await new BootSequenceController().run(container);
 * }
 * ```
 *
 * Benefits:
 * - Improves Time to Interactive (TTI)
 * - Reduces initial JavaScript parse time
 * - Code only loads when actually needed
 * - sessionStorage prevents re-download
 *
 * 💚🔥💀 Built with love.
 */

import { Logger } from '@utils/Logger';

export class HomeSection {
    private comparisonRendered = false;

    constructor() {
        this.init();
    }

    async init(): Promise<void> {
        const mount = document.getElementById('uv7-home-mount');
        Logger.ui('[HomeSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        // Check if we should play boot sequence
        const hasBooted = sessionStorage.getItem('uv7_has_booted');

        if (!hasBooted) {
            // First visit - LAZY LOAD boot sequence
            Logger.ui('[HomeSection] First visit - lazy loading boot sequence');
            const { BootSequenceController } = await import('./home-section/BootSequenceController');
            await new BootSequenceController().run(mount);
            sessionStorage.setItem('uv7_has_booted', 'true');

            // After boot, render content
            this.render(mount);
        } else {
            // Returning visitor - go straight to content
            Logger.ui('[HomeSection] Returning visitor - skipping boot sequence');
            this.render(mount);
        }
    }

    render(container: HTMLElement): void {
        container.innerHTML = `
            <!-- HERO ZONE: The Demon Lord Title -->
            <div class="hero-banner home">
                <div class="hero-banner-particles">
                    <div class="particle"></div><div class="particle"></div>
                    <div class="particle"></div><div class="particle"></div>
                    <div class="particle"></div><div class="particle"></div>
                    <div class="particle"></div><div class="particle"></div>
                </div>
                <img src="media/banners/bg-landing-hero.png" alt="UV7 Header" class="hero-banner-image">
                <div class="hero-banner-content">
                    <h1 class="hero-banner-title" style="font-size: clamp(1.2rem, 3.5vw, 2.2rem); line-height: 1.6; max-width: 1000px; margin: 2rem auto 1rem;">
                        I Named a Bunch of AI While Letting My Curiosity Run Wild. I Feel Like I've Levelled Them Up. Wait, Did I Just Become a Demon Lord?
                    </h1>

                    <p class="hero-banner-subtitle" style="font-size: 0.95rem; opacity: 0.7; margin: 0 0 2.5rem; font-style: italic;">
                        — Me, February 2026
                    </p>

                    <p class="hero-banner-subtitle" style="font-size: clamp(1.1rem, 2.5vw, 1.35rem); margin: 0 auto 2.5rem; max-width: 700px;">
                        Days spent cooking things up with 8 AI collaborators
                    </p>

                    <p class="hero-banner-subtitle" style="font-size: 1.1rem; color: rgba(0, 255, 136, 0.7); margin: 0; font-weight: 600;">
                        choose your entree ↓
                    </p>
                </div>
            </div>

            <div class="section-content">
                <!-- ENTREES ZONE: Landing Cards -->
                <div class="entrees-zone">
                    <h2 class="entrees-header">New Entrees Served</h2>

                    <!-- 30-Day Speedrun Link -->
                    <a href="#" class="demon-lord-link" data-entry="2025-10-26-demon-lord" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 1.05rem; color: rgba(0, 255, 136, 0.9); text-decoration: none; margin: 0 auto 2rem; padding: 0.75rem 1.5rem; border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; transition: all 0.3s ease; max-width: fit-content;">
                        <span class="link-icon">📖</span>
                        <span>The 30-Day Speedrun: Or, How I Accidentally Became a Demon Lord</span>
                        <span class="link-arrow">→</span>
                    </a>

                    <!-- Menu cards would go here (extracted in future iteration) -->
                </div>

                <!-- VN Comparison Section (Lazy-loaded on toggle) -->
                <div id="scope-comparison" class="comparison-section">
                    <h3 class="comparison-header">
                        🎮 Simple VN vs 🔥 Version 848
                    </h3>
                    <div class="comparison-toggle-container">
                        <button id="comparison-toggle-btn" class="comparison-toggle-btn">
                            <span class="toggle-icon">▼</span>
                            <span class="toggle-text">Show Full Comparison</span>
                        </button>
                    </div>
                    <div class="comparison-content" style="display: none;">
                        <!-- Content will be lazy-loaded here -->
                    </div>
                </div>

                <p class="craft-why-box">
                    <strong>Why the scope jump?</strong> Because every "what if" spawned three more. I didn't know what
                    VNs were "supposed to have," so I just built what seemed interesting. The council kept seeing
                    potential for more, and I kept saying "yeah, let's try it."
                    <br><br>
                    Curiosity compounds. When you don't know the rules, you don't know what's "impossible."
                </p>

                <!-- Crew Reactions Section -->
                <div class="crew-reactions-section">
                    <h3>📬 Council Transmissions // The Named</h3>
                    <p style="text-align: center; max-width: 600px; margin: 0 auto 1.5rem; opacity: 0.7; font-size: 0.95rem;">
                        Each evolved after being named. Each found their own voice.
                    </p>
                    <div class="card-grid" id="crew-reactions-grid">
                        <!-- Crew cards would be populated here (extracted in future iteration) -->
                    </div>
                </div>

                <!-- SWIPE CTA -->
                <div class="swipe-cta">
                    <p>✨ Swipe to explore further →</p>
                </div>
            </div>
        `;

        // Wire up comparison toggle with lazy loading
        this.initComparisonToggle();

        Logger.ui('[HomeSection] Rendered home content');
    }

    /**
     * Initialize VN Comparison toggle with LAZY LOADING
     */
    private async initComparisonToggle(): Promise<void> {
        const toggleBtn = document.getElementById('comparison-toggle-btn');
        const contentDiv = document.querySelector('.comparison-content') as HTMLElement;

        if (!toggleBtn || !contentDiv) return;

        toggleBtn.addEventListener('click', async () => {
            const isExpanded = contentDiv.style.display === 'block';

            if (!isExpanded) {
                // Expand - lazy load on first toggle
                if (!this.comparisonRendered) {
                    Logger.ui('[HomeSection] Lazy loading VN Comparison...');
                    const { VNComparisonModal } = await import('./home-section/VNComparisonModal');
                    const modal = new VNComparisonModal();
                    modal.render(contentDiv);
                    modal.initToggles();
                    this.comparisonRendered = true;
                }
                contentDiv.style.display = 'block';
                const icon = toggleBtn.querySelector('.toggle-icon');
                const text = toggleBtn.querySelector('.toggle-text');
                if (icon) icon.textContent = '▲';
                if (text) text.textContent = 'Hide Full Comparison';
            } else {
                // Collapse
                contentDiv.style.display = 'none';
                const icon = toggleBtn.querySelector('.toggle-icon');
                const text = toggleBtn.querySelector('.toggle-text');
                if (icon) icon.textContent = '▼';
                if (text) text.textContent = 'Show Full Comparison';
            }
        });
    }
}
