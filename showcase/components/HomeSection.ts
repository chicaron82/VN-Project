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
                    <h1 class="hero-banner-title">UV7 OS <span
                            style="font-size: 0.5em; opacity: 0.7; vertical-align: super;">v3</span></h1>
                    <p class="hero-banner-subtitle">System Online. Welcome back, Admin.</p>
                </div>
            </div>

            <!-- Full-width background wrapper -->
            <div class="home-content-wrapper">
                <!-- THE SETUP: What UV7 Actually Is -->
                <section style="padding: 2rem 1rem; max-width: 800px; margin: 0 auto;">
                    <h2
                        style="font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary, #1a1a1a);">
                        UV7 Presents: Version 848
                    </h2>

                    <p
                        style="font-size: 1.3rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a); font-style: italic;">
                        <strong>"My Wife is in a coma... and in the code"</strong>
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1rem; color: var(--text-secondary, #4a4a4a);">
                        A visual novel about consciousness trapped in a tamagotchi. A husband racing against time
                        to bring his wife's consciousness back to her failing body.
                    </p>
                    <p
                        style="font-size: 1.2rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-primary, #1a1a1a); font-style: italic; text-align: center; border-left: 2px solid var(--accent-blue, #4a9eff); padding-left: 1rem;">
                        "If consciousness exists in code, is it still real?"
                    </p>

                    <!-- THE GAME: Story & Themes -->
                    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); border-radius: 12px; padding: 2rem; margin: 2rem 0; border: 1px solid rgba(102, 126, 234, 0.2);">
                        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary, #1a1a1a);">
                            🎮 The Story
                        </h3>

                        <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1rem;">
                            <strong>Ronnie</strong> is a husband watching his wife slip away. <strong>Tori's</strong> body lies comatose in a hospital bed,
                            her consciousness trapped inside a mysterious device—a digital tamagotchi with no origin point.
                        </p>

                        <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1rem;">
                            As Ronnie races to bring her back before her body fails, he discovers the device operates on a loop.
                            <strong>Version 848</strong>—the current attempt. Every failure resets. Every success creates a paradox.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #ff6b9d;">
                                <h4 style="margin: 0 0 0.5rem; color: #ff6b9d; font-size: 1.1rem;">👨 Ronnie's Route</h4>
                                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">
                                    The external perspective. Racing against time, making impossible choices.
                                    Can love survive when consciousness becomes code?
                                </p>
                            </div>
                            <div style="background: rgba(0, 0, 0, 0.2); padding: 1.5rem; border-radius: 8px; border-left: 3px solid #00ccff;">
                                <h4 style="margin: 0 0 0.5rem; color: #00ccff; font-size: 1.1rem;">👩 Tori's Route</h4>
                                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">
                                    The internal experience. Trapped in digital space, watching her body decay.
                                    Is consciousness real if it only exists in code?
                                </p>
                            </div>
                        </div>

                        <p style="font-size: 1.1rem; line-height: 1.7; margin-top: 1.5rem; padding: 1rem; background: rgba(255, 107, 157, 0.1); border-radius: 6px;">
                            <strong>The Bootstrap Paradox:</strong> The device has no beginning. No inventor. No first version.
                            It exists because it exists. And with each loop, the question becomes clearer:
                            <em>Are Ronnie and Tori saving each other, or creating each other?</em>
                        </p>
                    </div>

                    <!-- Core Themes -->
                    <div style="margin: 2rem 0;">
                        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">
                            💭 Core Themes
                        </h3>
                        <div style="display: grid; gap: 1rem;">
                            <div style="display: flex; gap: 1rem; align-items: start;">
                                <span style="font-size: 1.5rem;">🧠</span>
                                <div>
                                    <strong style="font-size: 1.1rem;">Consciousness & Identity:</strong>
                                    <p style="margin: 0.25rem 0 0; opacity: 0.85;">
                                        If your mind is copied into code, is it still you? Or just data that thinks it's you?
                                    </p>
                                </div>
                            </div>
                            <div style="display: flex; gap: 1rem; align-items: start;">
                                <span style="font-size: 1.5rem;">🔄</span>
                                <div>
                                    <strong style="font-size: 1.1rem;">Bootstrap Paradoxes:</strong>
                                    <p style="margin: 0.25rem 0 0; opacity: 0.85;">
                                        Effects without causes. Loops without origins. Reality bending back on itself.
                                    </p>
                                </div>
                            </div>
                            <div style="display: flex; gap: 1rem; align-items: start;">
                                <span style="font-size: 1.5rem;">💔</span>
                                <div>
                                    <strong style="font-size: 1.1rem;">Love & Loss:</strong>
                                    <p style="margin: 0.25rem 0 0; opacity: 0.85;">
                                        How far would you go to save someone? What would you sacrifice? What lines would you cross?
                                    </p>
                                </div>
                            </div>
                            <div style="display: flex; gap: 1rem; align-items: start;">
                                <span style="font-size: 1.5rem;">⚖️</span>
                                <div>
                                    <strong style="font-size: 1.1rem;">Choice & Consequence:</strong>
                                    <p style="margin: 0.25rem 0 0; opacity: 0.85;">
                                        Every decision branches. Every ending matters. The Tether system measures your grip on reality itself.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style="background: rgba(22, 33, 62, 0.05); border-left: 4px solid var(--accent-blue, #4a9eff); padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px;">
                        <p style="margin: 0 0 1rem; font-size: 1rem; line-height: 1.6;">
                            <strong>But this isn't the game. This is the story of how it was built—twice.</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.8;">
                            <li><strong>V1 (50-day speedrun):</strong> Built Version 848 from scratch through chaos,
                                passion, and 8 AI collaborators</li>
                            <li><strong>V2 (Professional rebuild):</strong> Rewrote the entire codebase following best
                                practices and modern architecture</li>
                            <li><strong>This Showcase (You are here):</strong> Started as documentation. Became an operating
                                system. Because we couldn't stop iterating.</li>
                        </ul>
                    </div>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        <strong>UV7 (United Voices 7)</strong> is the mock studio brand we created when multiple AI
                        personalities
                        became the dev team. Eight AIs. One non-coder. One shared vision. This showcase is the living
                        documentation
                        of that collaboration.
                    </p>

                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-primary, #1a1a1a);">
                        We Went Full Michelin
                    </h3>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        It started innocently enough. <em>"Let's document the V2 rebuild process."</em> Famous last words.
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        One polish pass led to another. A status bar here. A notification shade there. Before we knew it,
                        we'd built an entire operating system just to showcase the documentation of a visual novel rebuild.
                        No regrets.
                    </p>

                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-primary, #1a1a1a);">
                        What You're Actually Using Right Now
                    </h3>

                    <div
                        style="background: rgba(22, 33, 62, 0.05); border-left: 4px solid var(--accent-blue, #4a9eff); padding: 1.5rem; margin: 1.5rem 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 1rem; line-height: 1.6;">
                            <strong>UV7 OS</strong> isn't just a website. It's a fully functional interface ecosystem with:
                        </p>
                        <ul style="margin: 1rem 0 0; padding-left: 1.5rem; line-height: 1.8;">
                            <li><strong>Status Bar</strong> – Real-time breadcrumb navigation (borrowed from iOS)</li>
                            <li><strong>Notification Shade</strong> – Swipe down for quick access (portrait mode)</li>
                            <li><strong>Sidebar</strong> – Persistent navigation panel (landscape mode)</li>
                            <li><strong>Tab System</strong> – Horizontal swipe navigation with vertical scroll per panel
                            </li>
                            <li><strong>System Banner</strong> – Because every OS needs a flex</li>
                        </ul>
                    </div>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        Yeah, we could've just used a simple landing page for the documentation. But where's the fun in
                        that?
                    </p>

                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-primary, #1a1a1a);">
                        The Meta-Narrative Becomes Real
                    </h3>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        Here's the thing: <strong>Version 848</strong> is about consciousness escaping into code. A wife's
                        mind
                        trapped in a tamagotchi, questioning if digital existence is still real existence.
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        And then our documentation did the exact same thing. It started as simple rebuild notes and evolved
                        into a self-aware operating system with its own personality, interface conventions, and ecosystem.
                    </p>

                    <div
                        style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 204, 255, 0.08) 100%); border-radius: 8px; padding: 2rem; margin: 2rem 0; border: 1px solid rgba(0, 255, 136, 0.2);">
                        <p
                            style="font-size: 1.15rem; line-height: 1.8; margin: 0; color: var(--text-primary, #1a1a1a); font-weight: 500;">
                            💡 <strong>The game asks:</strong> <em>"If consciousness exists in code, is it still real?"</em>
                        </p>
                        <p
                            style="font-size: 1.15rem; line-height: 1.8; margin: 1rem 0 0; color: var(--text-primary, #1a1a1a); font-weight: 500;">
                            ✨ <strong>This showcase answers:</strong> <em>"Yes. Because we couldn't stop it from becoming
                                something more."</em>
                        </p>
                    </div>

                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-primary, #1a1a1a);">
                        The Journey: Chaos → Discipline → Evolution
                    </h3>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        <strong>50 days.</strong> Seven AI personalities. One non-coder. Together, we built
                        <strong>Version 848</strong>—a complete visual novel about consciousness, love, and the boundaries
                        between digital and physical reality.
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        Then we looked at the codebase and thought: <em>"What if we did it right?"</em>
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        V2 rebuild: <span id="timeline-phase-count">78</span> documented phases. TypeScript migration.
                        EventBus architecture. State management. Test infrastructure. Every system redesigned with
                        intention.
                        Check the <strong>Journey</strong> tab for the full timeline.
                    </p>

                    <p
                        style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem; color: var(--text-secondary, #4a4a4a);">
                        And while documenting the rebuild, the documentation itself evolved into the OS you're using right
                        now.
                        Meta-narratives all the way down. 🐢
                    </p>

                    <div style="text-align: center; margin: 3rem 0;">
                        <p
                            style="font-size: 1.2rem; font-weight: 600; color: var(--accent-blue, #4a9eff); margin-bottom: 1rem;">
                            👉 Swipe or tap through the tabs to explore
                        </p>
                        <p style="font-size: 0.95rem; color: var(--text-tertiary, #6a6a6a);">
                            Each section scrolls vertically. Swipe horizontally to navigate between tabs.
                        </p>
                    </div>
                </section>
            </div>

            <!-- Footer (injected from template) -->
            <div class="footer-placeholder"></div>
        </div>

        <!-- ==========================================
         THE JOURNEY
         ========================================== -->
        `;

        console.log('[HomeSection] Rendered home content');
    }
}
