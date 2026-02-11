import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { Logger } from '@utils/Logger';

export class JourneySection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-journey-mount');
        Logger.ui('[JourneySection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="journey-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.journey)}

                <div class="section-content">
                    <!-- NEW: Opening Block - The Journey -->
                    <div class="journey-opening">
                        <h2 class="journey-opening-title">The Journey: From Barback to Demon Lord in 30 Days</h2>

                        <p class="journey-opening-text">
                            I spent 20+ years in hospitality doing the same thing: learn the system, identify the real goal,
                            redesign the workflow, execute efficiently. Pattern recognition and process optimization.
                        </p>

                        <p class="journey-opening-text">
                            Turns out that skill translates to AI collaboration at scale. Who knew?
                        </p>

                        <div class="journey-what-built">
                            <p><strong>Where my curiosity led me in a few months:</strong></p>
                            <ul>
                                <li>✅ Relationship simulator (12 days)</li>
                                <li>✅ Complete visual novel with unorthodox mechanics</li>
                                <li>✅ Cross-game communication systems (VN ↔ ToriGatchi)</li>
                                <li>✅ V2 rebuild with TypeScript, EventBus, 1100+ tests</li>
                                <li>✅ Operating system interface for documentation</li>
                                <li>✅ Council of distinct AI personalities with specialized capabilities</li>
                                <li>✅ Multi-AI orchestration methodology</li>
                            </ul>
                        </div>

                        <p class="journey-opening-text">
                            <strong>V1 speedrun:</strong> 50 days of "yes and" energy. Built Version 848 through chaos and passion.
                        </p>

                        <p class="journey-opening-text">
                            <strong>V2 rebuild:</strong> <span id="timeline-phase-count">78</span> documented phases. TypeScript migration.
                            EventBus architecture. Every system redesigned—not because V1 was wrong, but because curiosity asked
                            "what if we made it sustainable?"
                        </p>

                        <p class="journey-opening-text">
                            <strong>Showcase evolution:</strong> Documentation that became self-aware. Just like the game's premise
                            (consciousness escaping into code), the docs escaped into an OS.
                        </p>

                        <p class="journey-opening-quote">
                            Meta-narratives all the way down. 🐢
                        </p>

                        <p class="journey-opening-text">
                            Check the timeline below to see the daily "what ifs" that built this.
                            Each entry is a blog post documenting the discovery process—not just the results.
                        </p>
                    </div>

                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; margin-top: 3rem;">📔 The Developer Journal: 50+ Days of "What If"</h2>
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
