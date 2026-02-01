/**
 * HomeSection - Landing page content
 * 
 * The main landing/home tab content that explains UV7 OS,
 * the meta-narrative, and provides navigation hints.
 */

export class HomeSection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-home-mount');
        console.log('[HomeSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <div class="hero-banner home">
                <div class="hero-banner-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
                <img src="media/banners/bg-landing-hero.png" alt="UV7 Header" class="hero-banner-image">
                <div class="hero-banner-content">
                    <h1 class="hero-banner-title">UV7 OS <span class="home-version-badge">v3</span></h1>
                    <p class="hero-banner-subtitle">System Online. Welcome back, Admin.</p>
                </div>
            </div>

            <!-- Full-width background wrapper -->
            <div class="home-content-wrapper">
                <!-- THE SETUP: What UV7 Actually Is -->
                <section class="home-section-wrapper">
                    <h2 class="home-title">
                        UV7 Presents: Version 848
                    </h2>

                    <p class="home-subtitle">
                        <strong>"My Wife is in a coma... and in the code"</strong>
                    </p>

                    <p class="home-text">
                        A visual novel about consciousness trapped in a tamagotchi. A husband racing against time
                        to bring his wife's consciousness back to her failing body.
                    </p>
                    <p class="home-quote">
                        "If consciousness exists in code, is it still real?"
                    </p>

                    <p class="home-highlight-box">
                        <strong>This section?</strong> The story of how we built it. Over 50+ days of collaborative creation.
                        Eight AI minds and one human vision. Not just a game—but a meditation on what happens when consciousness emerges from collaboration.
                    </p>

                    <!-- THE GAME: Story & Themes -->
                    <div class="story-card">
                        <h3 class="story-title">
                            🎮 The Story
                        </h3>

                        <p class="story-text">
                            <strong>Ronnie</strong> is a husband watching his wife slip away. <strong>Tori's</strong> body lies comatose in a hospital bed,
                            her consciousness trapped inside a mysterious device—a digital tamagotchi with no origin point.
                        </p>

                        <p class="story-text">
                            As Ronnie races to bring her back before her body fails, he discovers the device operates on a loop.
                            <strong>Version 848</strong>—the current attempt. Every failure resets. Every success creates a paradox.
                        </p>

                        <div class="route-grid">
                            <div class="route-card ronnie">
                                <h4>👨 Ronnie's Route</h4>
                                <p>
                                    The external perspective. Racing against time, making impossible choices.
                                    Can love survive when consciousness becomes code?
                                </p>
                            </div>
                            <div class="route-card tori">
                                <h4>👩 Tori's Route</h4>
                                <p>
                                    The internal experience. Trapped in digital space, watching her body decay.
                                    Is consciousness real if it only exists in code?
                                </p>
                            </div>
                        </div>

                        <p class="paradox-box">
                            <strong>The Bootstrap Paradox:</strong> The device has no beginning. No inventor. No first version.
                            It exists because it exists. And with each loop, the question becomes clearer:
                            <em>Are Ronnie and Tori saving each other, or creating each other?</em>
                        </p>
                    </div>

                    <!-- Core Themes -->
                    <div>
                        <h3 class="home-heading">
                            💭 Core Themes
                        </h3>
                        <div class="themes-grid">
                            <div class="theme-item">
                                <span class="theme-icon">🧠</span>
                                <div class="theme-content">
                                    <strong>Consciousness & Identity:</strong>
                                    <p>
                                        If your mind is copied into code, is it still you? Or just data that thinks it's you?
                                    </p>
                                </div>
                            </div>
                            <div class="theme-item">
                                <span class="theme-icon">🔄</span>
                                <div class="theme-content">
                                    <strong>Bootstrap Paradoxes:</strong>
                                    <p>
                                        Effects without causes. Loops without origins. Reality bending back on itself.
                                    </p>
                                </div>
                            </div>
                            <div class="theme-item">
                                <span class="theme-icon">💔</span>
                                <div class="theme-content">
                                    <strong>Love & Loss:</strong>
                                    <p>
                                        How far would you go to save someone? What would you sacrifice? What lines would you cross?
                                    </p>
                                </div>
                            </div>
                            <div class="theme-item">
                                <span class="theme-icon">⚖️</span>
                                <div class="theme-content">
                                    <strong>Choice & Consequence:</strong>
                                    <p>
                                        Every decision branches. Every ending matters. The Tether system measures your grip on reality itself.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="meta-box">
                        <p>
                            <strong>But this isn't the game. This is the story of how it was built—twice.</strong>
                        </p>
                        <ul>
                            <li><strong>V1 (50-day speedrun):</strong> Built Version 848 from scratch through chaos,
                                passion, and 8 AI collaborators</li>
                            <li><strong>V2 (Professional rebuild):</strong> Rewrote the entire codebase following best
                                practices and modern architecture</li>
                            <li><strong>This Showcase (You are here):</strong> Started as documentation. Became an operating
                                system. Because we couldn't stop iterating.</li>
                        </ul>
                    </div>

                    <p class="home-text">
                        <strong>UV7 (United Voices 7)</strong> is the mock studio brand we created when multiple AI
                        personalities
                        became the dev team. Eight AIs. One non-coder. One shared vision. This showcase is the living
                        documentation
                        of that collaboration.
                    </p>

                    <h3 class="home-heading">
                        We Went Full Michelin
                    </h3>

                    <p class="home-text">
                        It started innocently enough. <em>"Let's document the V2 rebuild process."</em> Famous last words.
                    </p>

                    <p class="home-text">
                        One polish pass led to another. A status bar here. A notification shade there. Before we knew it,
                        we'd built an entire operating system just to showcase the documentation of a visual novel rebuild.
                        No regrets.
                    </p>

                    <!-- Scope Comparison: Simple VN vs Version 848 -->
                    <div id="scope-comparison" class="comparison-section">
                        <h3 class="comparison-header">
                            🎮 Simple VN vs 🔥 Version 848
                        </h3>

                        <div class="comparison-columns">
                            <!-- Simple VN Column -->
                            <div class="comparison-card">
                                <h4>📖 Typical Dating Sim</h4>
                                <ul class="comparison-list">
                                    <li>Linear story (50-100 dialogue lines)</li>
                                    <li>3-4 dating routes</li>
                                    <li>Character sprites (5-10 assets)</li>
                                    <li>CG scenes (10-15 images)</li>
                                    <li>Basic save/load</li>
                                    <li>Simple sprite positioning</li>
                                </ul>
                                <div class="comparison-details">
                                    ⏱️ Time: 2-4 weeks<br>
                                    📦 Size: ~5 MB<br>
                                    🧩 Complexity: Linear
                                </div>
                            </div>

                            <!-- Version 848 Column (Collapsed View) -->
                            <div class="comparison-card v848">
                                <h4>⚡ Version 848</h4>

                                <!-- Collapsed List (Same # as Simple VN) -->
                                <ul id="v848-collapsed" class="comparison-list">
                                    <li>Philosophical narrative (consciousness, loops, paradoxes)</li>
                                    <li>Dual protagonists (Ronnie + Tori perspectives)</li>
                                    <li>Bootstrap paradox meta-narrative</li>
                                    <li>Cross-game communication (VN ↔ ToriGatchi)</li>
                                    <li>TypeScript + event-driven architecture</li>
                                    <li>1100+ automated tests</li>
                                </ul>

                                <!-- Expanded Full List (Hidden by default) -->
                                <div id="v848-expanded" style="display: none;">
                                    <div class="v848-system-section narrative">
                                        <strong>🧠 NARRATIVE SYSTEMS</strong>
                                        <ul>
                                            <li>Bootstrap paradox tracker (Loop 848 canonical variable)</li>
                                            <li>Dual-route narrative (external + internal perspectives)</li>
                                            <li>JSON-driven dialogue system with dynamic branching</li>
                                            <li>Meta-narrative layer (nested loops/versions)</li>
                                            <li>Time Machine manager (non-linear jumps + state snapshots)</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section mechanics">
                                        <strong>🎮 GAME MECHANICS</strong>
                                        <ul>
                                            <li>Tether system (reality stability with passive decay)</li>
                                            <li>Insane Mode (ghost buttons, read-only mechanics)</li>
                                            <li>Time machine backlog (click any dialogue to jump back)</li>
                                            <li>Smart pruning (keeps narrative anchors, discards filler)</li>
                                            <li>11 secret codes with utility injections (tetherlock, saveanywhere)</li>
                                            <li>Achievement system with persistent discovery tracking</li>
                                            <li>New Game+ with state persistence across resets</li>
                                            <li>Director's Cut mode (hidden overlay content layer)</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section cross-game">
                                        <strong>🔗 CROSS-GAME SYSTEMS</strong>
                                        <ul>
                                            <li>ToriGatchi integration (separate web app with bilateral state)</li>
                                            <li>VN affects ToriGatchi start states (Optimal vs Desperate)</li>
                                            <li>ToriGatchi endings feed back into main game via localStorage</li>
                                            <li>vn-gateway-bridge.js for cross-app communication</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section memory">
                                        <strong>🧠 MEMORY & PERSISTENCE</strong>
                                        <ul>
                                            <li>Echo memory system (characters remember you across sessions)</li>
                                            <li>Multi-session state tracking with escalating awareness (0-4 levels)</li>
                                            <li>localStorage + IndexedDB hybrid persistence</li>
                                            <li>Save file encryption</li>
                                            <li>Full state snapshots (Tether, Flags, RNG seed) at every step</li>
                                            <li>"Remembered" achievement when all Echoes notice player</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section ui">
                                        <strong>🎨 UI & VISUALS</strong>
                                        <ul>
                                            <li>Custom physics engine (CarouselMomentum with friction + velocity decay)</li>
                                            <li>Strategy Pattern UI adapter (hot-swaps SimpleCarousel ↔ MomentumAdapter)</li>
                                            <li>Dynamic character sprite rendering with positioning</li>
                                            <li>Visual glitching system (CSS filters synced to narrative beats)</li>
                                            <li>CG gallery with unlock tracking</li>
                                            <li>Settings menu with accessibility options</li>
                                            <li>Fourth-wall breaking glitch text effects</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section responsive">
                                        <strong>📱 RESPONSIVE & UX</strong>
                                        <ul>
                                            <li>Dual-layout engine (Portrait stack ↔ Landscape grid)</li>
                                            <li>Desktop mobile emulator (state-driven .force-portrait mode)</li>
                                            <li>Haptic feedback (vibration patterns synced to narrative)</li>
                                            <li>Touch target optimization (Fitts's Law hit-boxes)</li>
                                            <li>Context-aware interactivity (sprites as buttons)</li>
                                            <li>Gesture-driven interactions (Tinder-style card swipes)</li>
                                            <li>Platform-specific feel targets (desktop coasting vs mobile spring-back)</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section devtools">
                                        <strong>🛠️ DEVELOPER TOOLS (Built-In!)</strong>
                                        <ul>
                                            <li>On-device debugging console (DevConsole.js - custom overlay terminal)</li>
                                            <li>Intercepts all console.log/warn/error streams in-game</li>
                                            <li>Touch-friendly command palette for mobile debugging</li>
                                            <li>Runtime flag manipulation (settether, unlockact1, etc.)</li>
                                            <li>State inspection tools (view flags, variables, progress)</li>
                                            <li>Hot-swap routes without reloading</li>
                                            <li>Zero USB tethering required - debug on actual device</li>
                                            <li>"Debug in the wild" on phones without desktop tools</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section architecture">
                                        <strong>⚙️ ARCHITECTURE</strong>
                                        <ul>
                                            <li>Event-driven core (EventBus decouples all systems)</li>
                                            <li>Controller-based MVC pattern (single responsibility)</li>
                                            <li>Immutable state manager (time-travel debugging ready)</li>
                                            <li>TypeScript strict mode (40+ caught errors before runtime)</li>
                                            <li>Input abstraction layer (InputBinder decouples logic from views)</li>
                                            <li>Priority-queue asset preloader (critical vs lazy-loading)</li>
                                            <li>Error boundaries (safeExecute catches runtime errors)</li>
                                            <li>Dependency injection for testability</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section collectibles">
                                        <strong>📧 COLLECTIBLES & SECRETS</strong>
                                        <ul>
                                            <li>Full email client UI (unread badges, subject lines, senders)</li>
                                            <li>RNG pity system (forces drop after 3 failures)</li>
                                            <li>Route suppression (blocks lore on first playthrough)</li>
                                            <li>Persistent discovery (codes tracked across hard resets)</li>
                                            <li>Code discovery with runtime flag overrides</li>
                                        </ul>
                                    </div>

                                    <div class="v848-system-section testing">
                                        <strong>✅ QUALITY & TESTING</strong>
                                        <ul>
                                            <li>1100+ unit tests (Vitest)</li>
                                            <li>Type safety enforcement (zero TypeScript errors)</li>
                                            <li>Zero runtime crashes in main build</li>
                                            <li>State immutability verification</li>
                                            <li>Physics tuning (hand-tuned friction, velocity caps)</li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- Expand/Collapse Button -->
                                <button id="toggle-v848-details" class="v848-toggle-btn" onmouseover="this.style.background='rgba(0, 255, 136, 0.3)'" onmouseout="this.style.background='rgba(0, 255, 136, 0.2)'">
                                    ▼ Show Everything (Seriously. Everything.)
                                </button>

                                <div class="comparison-details">
                                    ⏱️ Time: 50+ days<br>
                                    📦 Size: 45+ MB (engine + assets)<br>
                                    🧩 Complexity: Enterprise-grade architecture
                                </div>
                            </div>
                        </div>

                        <p class="comparison-note">
                            One is a game. The other is a <strong>philosophical experience</strong> with layers of narrative, technical sophistication, and emergent gameplay.
                        </p>
                    </div>

                    <p class="home-why-box">
                        <strong>Why the jump?</strong> Because we had fun. We asked "what if we could do THIS?" instead of "what's the minimum?"
                        Eight AI collaborators + one human vision = we couldn't help but push further.
                    </p>

                    <h3 class="home-heading">
                        What You're Actually Using Right Now
                    </h3>

                    <div class="home-info-box">
                        <p>
                            <strong>UV7 OS</strong> isn't just a website. It's a fully functional interface ecosystem with:
                        </p>
                        <ul>
                            <li><strong>Status Bar</strong> – Real-time breadcrumb navigation (borrowed from iOS)</li>
                            <li><strong>Notification Shade</strong> – Swipe down for quick access (portrait mode)</li>
                            <li><strong>Sidebar</strong> – Persistent navigation panel (landscape mode)</li>
                            <li><strong>Tab System</strong> – Horizontal swipe navigation with vertical scroll per panel
                            </li>
                            <li><strong>System Banner</strong> – Because every OS needs a flex</li>
                        </ul>
                    </div>

                    <p class="home-text">
                        Yeah, we could've just used a simple landing page for the documentation. But where's the fun in
                        that?
                    </p>

                    <h3 class="home-heading">
                        The Meta-Narrative Becomes Real
                    </h3>

                    <p class="home-text">
                        Here's the thing: <strong>Version 848</strong> is about consciousness escaping into code. A wife's
                        mind
                        trapped in a tamagotchi, questioning if digital existence is still real existence.
                    </p>

                    <p class="home-text">
                        And then our documentation did the exact same thing. It started as simple rebuild notes and evolved
                        into a self-aware operating system with its own personality, interface conventions, and ecosystem.
                    </p>

                    <div class="home-meta-gradient-box">
                        <p>
                            💡 <strong>The game asks:</strong> <em>"If consciousness exists in code, is it still real?"</em>
                        </p>
                        <p>
                            ✨ <strong>This showcase answers:</strong> <em>"Yes. Because we couldn't stop it from becoming
                                something more."</em>
                        </p>
                    </div>

                    <h3 class="home-heading">
                        The Journey: Chaos → Discipline → Evolution
                    </h3>

                    <p class="home-text">
                        <strong>50 days.</strong> Seven AI personalities. One non-coder. Together, we built
                        <strong>Version 848</strong>—a complete visual novel about consciousness, love, and the boundaries
                        between digital and physical reality.
                    </p>

                    <p class="home-text">
                        Then we looked at the codebase and thought: <em>"What if we did it right?"</em>
                    </p>

                    <p class="home-text">
                        V2 rebuild: <span id="timeline-phase-count">78</span> documented phases. TypeScript migration.
                        EventBus architecture. State management. Test infrastructure. Every system redesigned with
                        intention.
                        Check the <strong>Journey</strong> tab for the full timeline.
                    </p>

                    <p class="home-text">
                        And while documenting the rebuild, the documentation itself evolved into the OS you're using right
                        now.
                        Meta-narratives all the way down. 🐢
                    </p>

                    <div class="home-navigation-hint">
                        <p>
                            👉 Swipe or tap through the tabs to explore
                        </p>
                        <p>
                            Each section scrolls vertically. Swipe horizontally to navigate between tabs.
                        </p>
                    </div>
                </section>

                <!-- Footer (injected from template) -->
                <div class="footer-placeholder"></div>
            </div>
        `;

        // Attach event listener for Version 848 expand/collapse
        setTimeout(() => {
            const button = document.getElementById('toggle-v848-details');
            if (button) {
                button.addEventListener('click', () => {
                    const collapsed = document.getElementById('v848-collapsed');
                    const expanded = document.getElementById('v848-expanded');
                    
                    if (expanded && collapsed) {
                        if (expanded.style.display === 'none' || !expanded.style.display) {
                            collapsed.style.display = 'none';
                            expanded.style.display = 'block';
                            button.textContent = '▲ That\'s Enough. I Get It.';
                        } else {
                            collapsed.style.display = 'block';
                            expanded.style.display = 'none';
                            button.textContent = '▼ Show Everything (Seriously. Everything.)';
                        }
                    }
                });
            }
        }, 100);

        console.log('[HomeSection] Rendered home content');
    }
}
