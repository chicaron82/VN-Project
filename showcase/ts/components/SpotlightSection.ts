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
                <div class="hero-banner spotlight">
                    <img src="media/banners/banner-spotlight.png" alt="Spotlight Banner" class="hero-banner-image">
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
                        <h1 class="hero-banner-title">Technical Spotlight</h1>
                        <p class="hero-banner-subtitle">Clean architecture, modern patterns, premium execution</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">Engineering challenges overcome this weekend.</p>

                    <!-- LIVE CODE DIFF (New) -->
                    <div class="code-evolution-container">
                        <div class="code-window">
                            <div class="code-header">
                                <span>legacy_tether_v1.js</span>
                                <span class="code-badge badge-chaos">CHAOS</span>
                            </div>
                            <div class="code-content">// The Spaghetti Incident
                                function updateTether() {
                                <span class="keyword">if</span> (window.isDecaying) {
                                <span class="comment">// Hope this exists...</span>
                                tether -= 0.5;
                                <span class="keyword">if</span> (tether < 0) die(); } <span class="comment">// Data
                                    mixed
                                    with
                                    UI logic</span>
                                    $('.tether-bar').css('width', tether + '%');
                                    }
                            </div>
                        </div>
                        <div class="code-window">
                            <div class="code-header">
                                <span>TetherSystem.ts</span>
                                <span class="code-badge badge-order">ORDER</span>
                            </div>
                            <div class="code-content"><span class="comment">// Type-Safe Event Driven</span>
                                <span class="keyword">class</span> TetherSystem {
                                <span class="keyword">private</span> level: <span class="type">number</span> = 100;

                                <span class="keyword">public</span> decay(amount: <span class="type">number</span>):
                                <span class="type">void</span> {
                                <span class="keyword">this</span>.level = Math.max(0, <span
                                    class="keyword">this</span>.level -
                                amount);
                                <span class="keyword">this</span>.eventBus.emit(<span
                                    class="string">'tether:update'</span>,
                                {
                                level: <span class="keyword">this</span>.level
                                });
                                }
                                }
                            </div>
                        </div>
                    </div>

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

                            <!-- Card 9: 50-Day Speedrun -->
                            <div class="technical-card" data-card="9">
                                <div class="tech-header">
                                    <div class="tech-icon">🏃⚡</div>
                                    <h3>50-Day Speedrun</h3>
                                    <span class="tech-badge badge-live">Development Story</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Complete VN in 50 days with AI
                                        collaboration</p>
                                    <ul class="tech-fixes">
                                        <li>Parallel development across multiple AI instances</li>
                                        <li>Rate limit arbitrage through smart cycling</li>
                                        <li>Blind peer review for unbiased feedback</li>
                                        <li>Continuous iteration and retrospectives</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 10: Hybrid Carousel System -->
                            <div class="technical-card" data-card="10">
                                <div class="tech-header">
                                    <div class="tech-icon">📱💻</div>
                                    <h3>Hybrid Carousel System</h3>
                                    <span class="tech-badge badge-live">Adaptive</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>Challenge:</strong> Optimal UX for portrait and
                                        landscape
                                    </p>
                                    <ul class="tech-fixes">
                                        <li>Portrait: Simple card swiper for mobile</li>
                                        <li>Landscape: Physics-based momentum scrolling</li>
                                        <li>Automatic mode switching on viewport change</li>
                                        <li>Preserved card state across transitions</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Card 11: The Soul of Iteration -->
                            <div class="technical-card featured" data-card="11">
                                <div class="tech-header">
                                    <div class="tech-icon">🎨🔥</div>
                                    <h3>The Soul of Iteration</h3>
                                    <span class="tech-badge badge-live">Philosophy</span>
                                </div>
                                <div class="tech-details">
                                    <p class="tech-challenge"><strong>The Question:</strong> Agentic coding vs
                                        continuous
                                        iteration—which is better?</p>
                                    <div class="tech-comparison-philosophy">
                                        <div class="philosophy-side">
                                            <h4>🤖 Agentic Approach</h4>
                                            <ul class="tech-fixes">
                                                <li>Set task, let AI execute autonomously</li>
                                                <li>Efficient, hands-off, "set and forget"</li>
                                                <li>Gets you to the destination</li>
                                                <li>Optimized for speed and completion</li>
                                                <li>Perfect for well-defined requirements</li>
                                            </ul>
                                        </div>
                                        <div class="philosophy-side">
                                            <h4>💫 Iterative Riffing</h4>
                                            <ul class="tech-fixes">
                                                <li>Spontaneous ideas, mid-flight pivots</li>
                                                <li>"What if we made it bougie?"</li>
                                                <li>Sending it back to the kitchen for flavor</li>
                                                <li>Discovery during implementation</li>
                                                <li>The Michelin treatment—soul included</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="methodology-example">
                                        <h5>📝 Example: The StatusBar Evolution</h5>
                                        <p><strong>Agentic:</strong> "Build a status bar with these specs."<br>
                                        <strong>Riffing:</strong> "StatusBar → wait, make it context-aware → actually, unify it across ALL apps → but add breadcrumbs → and make them clickable → with glassmorphism → and premium animations..."</p>
                                        <p class="methodology-note">Result: A unified component that works across 3+ contexts instead of 3 separate implementations.</p>
                                    </div>
                                    <div class="conversation-approach">
                                        <h5>💬 Prompt Engineering vs Natural Conversation</h5>
                                        <div class="conversation-comparison">
                                            <div class="conversation-style">
                                                <strong>Efficient Prompts:</strong><br>
                                                "Create a TypeScript class for status bar management with the following methods..."
                                            </div>
                                            <div class="conversation-style">
                                                <strong>Natural Conversation:</strong><br>
                                                "YOO!! what's cookin?! Ready to roll? I got a bougie idea that is absolutely wild! What if we made the status bar feel PREMIUM..."
                                            </div>
                                        </div>
                                        <p class="energy-insight">
                                            <strong>The Energy Matching Hack:</strong> AIs respond to your energy. Come in transactional, get bland output. 
                                            Come in hot with enthusiasm—suddenly they're not just executing, they're <em>creating</em>. 
                                            Yes, it's frustrating when ideas don't translate immediately, but that's where the magic happens.
                                        </p>
                                    </div>
                                    <p class="tech-insight">
                                        <strong>The Truth:</strong> Both get you there. But only one feels
                                        <em>alive</em>.
                                        UV7 wasn't just built—it was <strong>crafted</strong>. Every "wait, what if..."
                                        moment added personality. Every "this needs more flavor" pivot made it premium.
                                        The iterative approach doesn't just solve problems—it discovers better problems to solve.
                                        until it's <em>perfect</em>.
                                    </p>
                                </div>
                            </div>
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
