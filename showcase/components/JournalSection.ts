import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { Logger } from '@utils/Logger';

export class JournalSection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-journal-mount');
        Logger.ui('[JournalSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="journal-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.journal)}

                <div class="section-content">
                    <!-- Opening Block - The Journal -->
                    <div class="journal-opening">
                        <h2 class="journal-opening-title">The Developer Journal</h2>

                        <p class="journal-opening-text">
                            Every day, another "what if" question. Every answer spawned three more. These aren't polished
                            retrospectives—they're real-time journal entries from someone who didn't know it was supposed
                            to be hard. Breakthroughs, debug hell, experiments, clean refactors, milestones. The complete
                            timeline of how curiosity compounds when a non-coder and eight AI collaborators couldn't stop
                            asking questions.
                        </p>

                        <div class="journal-what-built">
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

                        <p class="journal-opening-quote">
                            "Curiosity compounds when you don't know what's supposed to be impossible."
                        </p>
                    </div>

                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; margin-top: 3rem;">📔 Timeline: 115+ Days of "What If"</h2>

                    <!-- Filter bar will be injected here by JournalFilterBar -->
                    <div id="journal-filter-mount"></div>

                    <!-- Timeline entries loaded dynamically -->
                    <div class="timeline" id="timeline-container">
                        <!-- Timeline will be populated by BlogRenderer -->
                    </div>
                </div>
            </section>
        `;
    }
}
