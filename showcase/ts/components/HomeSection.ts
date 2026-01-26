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

            <!-- V1 vs V2 Comparison -->
            <section
                style="padding: 3rem 1rem; max-width: 900px; margin: 0 auto; background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 204, 255, 0.05) 100%); border-radius: 12px;">
                <h2
                    style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; background: linear-gradient(135deg, #00ff88 0%, #00ccff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Version 848: V1 vs V2
                </h2>

                <p
                    style="font-size: 1.15rem; line-height: 1.8; text-align: center; margin-bottom: 2.5rem; color: var(--text-secondary, #4a4a4a); font-style: italic;">
                    V1 was built with passion. V2 was built with passion <strong>AND</strong> discipline.
                </p>

                <!-- The Obvious Wins -->
                <div style="margin-bottom: 2.5rem;">
                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--accent-blue, #4a9eff);">
                        The Obvious Wins 🏆
                    </h3>

                    <div style="display: grid; gap: 1.25rem;">
                        <div
                            style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-left: 4px solid #00ff88; border-radius: 8px;">
                            <h4 style="font-weight: 600; margin-bottom: 0.75rem; color: #00ff88;">TypeScript vs
                                JavaScript</h4>
                            <p style="margin: 0; line-height: 1.6; color: var(--text-secondary, #4a4a4a);">
                                Compile-time safety, full IDE autocomplete, self-documenting code. Errors caught before
                                production, not after.
                            </p>
                        </div>

                        <div
                            style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-left: 4px solid #00ccff; border-radius: 8px;">
                            <h4 style="font-weight: 600; margin-bottom: 0.75rem; color: #00ccff;">Test Coverage</h4>
                            <p style="margin: 0; line-height: 1.6; color: var(--text-secondary, #4a4a4a);">
                                <strong>V1:</strong> 0 tests (hope and pray) → <strong>V2:</strong> <span
                                    id="test-coverage-count">17</span> test files
                                covering core systems. Confidence in changes, regression prevention.
                            </p>
                        </div>

                        <div
                            style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-left: 4px solid #ff3c3c; border-radius: 8px;">
                            <h4 style="font-weight: 600; margin-bottom: 0.75rem; color: #ff3c3c;">Code Reduction</h4>
                            <p style="margin: 0; line-height: 1.6; color: var(--text-secondary, #4a4a4a);">
                                EasterEggController: 2,455 lines (V1) → 1,156 lines (V2) = <strong>53%
                                    reduction</strong>. Same functionality, cleaner implementation.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- The Subtle Touches -->
                <div style="margin-bottom: 2.5rem;">
                    <h3
                        style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--accent-purple, #a78bfa);">
                        The Subtle Touches (You Don't Notice But Definitely Appreciate) ✨
                    </h3>

                    <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem;">
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>EventBus Pattern:</strong> Components don't need to know about each other.
                            Decoupled, testable architecture.
                        </li>
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>Zero CSS Dependencies:</strong> Inline styles = completely portable components that
                            work anywhere.
                        </li>
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>Proper Cleanup:</strong> No memory leaks. Event listeners unsubscribed. Resources
                            freed.
                        </li>
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>Context-Aware Features:</strong> One StatusBar works in game, showcase, and landing.
                            Smart defaults, graceful degradation.
                        </li>
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>Premium Polish:</strong> Smooth fades, proper scroll targets, haptic feedback. Every
                            interaction refined.
                        </li>
                        <li style="padding-left: 1.5rem; position: relative; line-height: 1.7;">
                            <span style="position: absolute; left: 0; color: #00ff88;">→</span>
                            <strong>Preserved Soul:</strong> All of V1's lore, signatures, and personality kept intact.
                            💚🔥💀
                        </li>
                    </ul>
                </div>

                <!-- The Numbers -->
                <div style="background: rgba(0, 0, 0, 0.2); padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                    <h3
                        style="font-family: 'Courier New', monospace; font-size: 1.4rem; margin-bottom: 1.5rem; text-align: center; color: #00ff88;">
                        $ cat comparison.json
                    </h3>
                    <table
                        style="width: 100%; border-collapse: collapse; font-family: 'Courier New', monospace; font-size: 0.95rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid rgba(0, 255, 136, 0.3);">
                                <th style="padding: 0.75rem; text-align: left; color: #00ccff;">Metric</th>
                                <th style="padding: 0.75rem; text-align: center; color: #ff3c3c;">V1</th>
                                <th style="padding: 0.75rem; text-align: center; color: #00ff88;">V2</th>
                            </tr>
                        </thead>
                        <tbody style="color: var(--text-secondary, #4a4a4a);">
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <td style="padding: 0.75rem;">Test Files</td>
                                <td style="padding: 0.75rem; text-align: center;">0</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">40
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <td style="padding: 0.75rem;">Type Safety</td>
                                <td style="padding: 0.75rem; text-align: center;">None (JS)</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">Full
                                    (TS)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <td style="padding: 0.75rem;">EasterEgg LOC</td>
                                <td style="padding: 0.75rem; text-align: center;">2,455</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">
                                    1,156 (-53%)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <td style="padding: 0.75rem;"><code>(window as any)</code> escapes</td>
                                <td style="padding: 0.75rem; text-align: center;">N/A</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">0 ✨
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                <td style="padding: 0.75rem;">Build System</td>
                                <td style="padding: 0.75rem; text-align: center;">Manual &lt;script&gt;</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">Vite
                                    + HMR</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem;">Memory Leaks</td>
                                <td style="padding: 0.75rem; text-align: center;">Yes</td>
                                <td style="padding: 0.75rem; text-align: center; color: #00ff88; font-weight: 600;">
                                    Prevented</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- The Bottom Line -->
                <div
                    style="text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 204, 255, 0.1) 100%); border-radius: 12px;">
                    <p
                        style="font-size: 1.3rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text-primary, #1a1a1a);">
                        The Difference?
                    </p>
                    <p style="font-size: 1.1rem; line-height: 1.7; margin: 0; color: var(--text-secondary, #4a4a4a);">
                        V1 <em>worked</em>. V2 <strong>works correctly, scales cleanly, and feels premium</strong>.
                    </p>
                    <p style="font-size: 1rem; margin-top: 1rem; color: var(--text-tertiary, #6a6a6a);">
                        That's the difference between "shipped" and "engineered to last."
                    </p>
                    <p style="font-size: 1.5rem; margin-top: 1rem;">💚🔥💀</p>
                </div>
            </section>

            <!-- Who Are We Section (merged from Who tab) -->
            <div id="uv7-who-mount"></div>

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
