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
                    <!-- Opening Block - The Journal -->
                    <div class="journey-opening">
                        <h2 class="journey-opening-title">The Developer Journal</h2>

                        <p class="journey-opening-text">
                            Every day, another "what if" question. Every answer spawned three more. This is the complete
                            development timeline—the daily discoveries, debug sessions, breakthroughs, and experiments that
                            built Version 848 from nothing to a full visual novel in 50 days, then evolved it into V2's
                            sustainable architecture.
                        </p>

                        <div class="journey-what-built">
                            <p><strong>What got built:</strong></p>
                            <ul>
                                <li>✅ Relationship simulator (ToriGatchi) — 12 days</li>
                                <li>✅ Complete visual novel with meta-narrative mechanics — 50 days</li>
                                <li>✅ Cross-game communication systems (VN ↔ ToriGatchi)</li>
                                <li>✅ V2 rebuild: TypeScript, EventBus, 1,306 tests — <span id="timeline-phase-count">78</span> phases</li>
                                <li>✅ UV7 OS showcase interface — documentation that became self-aware</li>
                                <li>✅ Council of 8 distinct AI collaborators with specialized roles</li>
                            </ul>
                        </div>

                        <p class="journey-opening-quote">
                            "Curiosity compounds when you don't know what's supposed to be impossible."
                        </p>

                        <p class="journey-opening-text">
                            Each timeline entry below is a blog post documenting the journey—not polished retrospectives,
                            but real-time journal entries from someone who didn't know it was supposed to be hard.
                        </p>
                    </div>

                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; margin-top: 3rem;">📔 Timeline: 90+ Days of "What If"</h2>
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
