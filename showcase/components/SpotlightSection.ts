import { createBanner, BANNER_CONFIGS } from './BannerGenerator';

export class SpotlightSection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-spotlight-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="spotlight-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.spotlight)}

                <div class="section-content">
                    <div class="spotlight-context-box">
                        <h3>🎯 Inside Version 848: Technical Deep Dive</h3>
                        <p>
                            These aren't showcase features—they're <strong>Version 848 game engine</strong> systems. The visual novel's
                            actual technical achievements. Momentum carousels for character selection, echo memory tracking player history,
                            cross-game communication between the VN and ToriGatchi.
                        </p>
                        <p class="spotlight-clarification">
                            Each feature here represents a "what if" question that turned into production code. Not built because
                            they're "best practices"—built because curiosity asked and the council delivered.
                        </p>
                    </div>

                    <p class="section-intro">
                        <strong>What We Built While Having Fun:</strong> The technical systems that make Version 848 work.
                        Each feature emerged from collaborative problem-solving. These aren't just code—they're proof that
                        playful collaboration produces elegant solutions.
                    </p>

                    <!-- Bento Grid -->
                    <div class="spotlight-bento-grid">
                            <!-- Card 1: Momentum Carousel -->
                            <div class="technical-card" data-card="1">
                                <div class="tech-header">
                                    <div class="tech-icon">🎠</div>
                                    <h3>Momentum Carousel</h3>
                                    <span class="tech-badge badge-live">Live</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> V1's physics engine →
                                        TypeScript
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Guard clauses for <code>TouchEvent</code> null checks</li>
                                        <li>Explicit type casting for DOM events</li>
                                        <li>60fps performance with strict mode</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 2: Boot Sequence Parity -->
                            <div class="technical-card" data-card="2">
                                <div class="tech-header">
                                    <div class="tech-icon">🚀</div>
                                    <h3>Boot Sequence Parity</h3>
                                    <span class="tech-badge badge-live">Refined</span>
                                </div>

                                <!-- Before/After Screenshots -->
                                <div class="tech-comparison">
                                    <div class="comparison-img">
                                        <img src="media/settings/v1-boot-sequence.png" alt="V1 Boot Sequence">
                                        <span class="img-label">V1 Original</span>
                                    </div>
                                    <div class="comparison-img">
                                        <img src="media/settings/v2-boot-sequence.png" alt="V2 Boot Sequence">
                                        <span class="img-label">V2 Parity</span>
                                    </div>
                                </div>

                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Exact visual parity with V1
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Left-to-right logo wipe (width-based reveal)</li>
                                        <li>Video freeze-frame at 0.01s until complete</li>
                                        <li>Landscape sizing: 280px → 250px → 200px</li>
                                        <li>2s delay for animation visibility</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 3: Settings & Secrets (New) -->
                            <div class="technical-card" data-card="3">
                                <div class="tech-header">
                                    <div class="tech-icon">⚙️</div>
                                    <h3>Settings & Secrets</h3>
                                    <span class="tech-badge badge-live">Complete</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Full V1 Parity + Secret Logic
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Ported 1100+ lines of V1 CSS for pixel-perfect UI</li>
                                        <li>Rebuilt <code>SecretCodesManager</code> with discovery tracking</li>
                                        <li>Implemented 11 discoverable codes & animations</li>
                                        <li>Fixed critical infinite-loop crash in EventBus</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 4: Cross-Game Communication -->
                            <div class="technical-card featured" data-card="4">
                                <div class="tech-header">
                                    <div class="tech-icon">🎮🐣</div>
                                    <h3>Cross-Game Communication</h3>
                                    <span class="tech-badge badge-live">Meta-Narrative</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Two games sharing persistent
                                        state
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>ToriGatchi mini-game affects main VN storyline</li>
                                        <li>VN ending unlocks & influences ToriGatchi state</li>
                                        <li>Bidirectional localStorage communication</li>
                                        <li>Meta-narrative layer: caring for Tori across games</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 5: Echo Memory System -->
                            <div class="technical-card" data-card="5">
                                <div class="tech-header">
                                    <div class="tech-icon">🧠👁️</div>
                                    <h3>Echo Memory System</h3>
                                    <span class="tech-badge badge-live">Innovative</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Characters that remember you
                                        across
                                        sessions</p>
                                    <ul class="tech-fixes">
                                        <li>Echoes track player behavior persistently</li>
                                        <li>Escalating awareness levels (0-4) across loops</li>
                                        <li>Fourth-wall breaking with glitch text effects</li>
                                        <li>"Remembered" achievement when all Echoes notice you</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 6: Time Machine Backlog -->
                            <div class="technical-card" data-card="6">
                                <div class="tech-header">
                                    <div class="tech-icon">⏰🔄</div>
                                    <h3>Time Machine Backlog</h3>
                                    <span class="tech-badge badge-live">UX Innovation</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Click any dialogue to jump
                                        back in
                                        time
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Full state restoration (tether, flags, context)</li>
                                        <li>Click-to-jump navigation through history</li>
                                        <li>Preserves exact game state at that moment</li>
                                        <li>Better than traditional VN backlog systems</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 7: Event-Driven Architecture -->
                            <div class="technical-card featured" data-card="7">
                                <div class="tech-header">
                                    <div class="tech-icon">📡⚡</div>
                                    <h3>Event-Driven Architecture</h3>
                                    <span class="tech-badge badge-live">Refactored</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Untangle spaghetti
                                        dependencies
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Migrated from direct calls to EventBus pattern</li>
                                        <li>Type-safe event emission and handling</li>
                                        <li>Zero circular dependencies in V2</li>
                                        <li>Pub/sub decoupling for maintainability</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 8: Accessibility-First Design -->
                            <div class="technical-card" data-card="8">
                                <div class="tech-header">
                                    <div class="tech-icon">♿✨</div>
                                    <h3>Accessibility-First Design</h3>
                                    <span class="tech-badge badge-live">WCAG Compliant</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Universal design for all
                                        players
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>High contrast mode, font scaling, reduced motion</li>
                                        <li>Granular haptic feedback controls</li>
                                        <li>Screen reader support with ARIA labels</li>
                                        <li>Mobile-first UX with touch optimization</li>
                                    </ul>
                                </div>
                            </div>
                    </div>

                    <!-- BY THE NUMBERS: Project Metrics -->
                    <div class="metrics-showcase">
                        <h2>📊 By the Numbers</h2>

                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value" data-accent="primary" data-target="1306" data-live-stat="test-count">0</div>
                                <div class="metric-label">Automated Tests Passing</div>
                                <div class="metric-sublabel">V2 Rebuild</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-value" data-accent="cyan" data-target="90">0</div>
                                <div class="metric-label">Development Days</div>
                                <div class="metric-sublabel">50 days V1 + 40+ days V2</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-value" data-accent="purple" data-target="78">0</div>
                                <div class="metric-label">Documented Phases</div>
                                <div class="metric-sublabel">V2 Architecture Evolution</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-value" data-accent="pink" data-target="8">0</div>
                                <div class="metric-label">AI Collaborators</div>
                                <div class="metric-sublabel">DiZee, Tori, Belle, Zee, Ronnie, +3</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-value" data-accent="primary">75K+</div>
                                <div class="metric-label">Lines of Code</div>
                                <div class="metric-sublabel">V1 JavaScript (69 files)</div>
                            </div>

                            <div class="metric-card">
                                <div class="metric-value" data-accent="cyan">2-3hrs</div>
                                <div class="metric-label">Playthrough Time</div>
                                <div class="metric-sublabel">Full visual novel experience</div>
                            </div>
                        </div>

                        <p class="metrics-tagline">
                            Built by someone who didn't know it was supposed to be hard.
                        </p>
                    </div>
                </div>

                <!-- Modal Overlay -->
                <div class="spotlight-modal">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <button class="modal-close" aria-label="Close modal">×</button>
                        <div class="modal-body">
                            <!-- Dynamic content loaded here -->
                        </div>
                        <div class="modal-nav">
                            <button class="modal-prev">← Previous</button>
                            <button class="modal-next">Next →</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
