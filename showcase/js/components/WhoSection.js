export class WhoSection {
    constructor() {
        this.render();
    }

    render() {
        const mount = document.getElementById('uv7-who-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="who-section">
                <!-- Hero Banner -->
                <div class="hero-banner who">
                    <img src="media/banners/banner-who.png" alt="Who We Are Banner" class="hero-banner-image">
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
                        <h1 class="hero-banner-title">Who Are We</h1>
                        <p class="hero-banner-subtitle">One vision, many voices, shared purpose</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">The humans and AI behind UV7. A true collaboration across platforms and
                        perspectives.
                    </p>

                    <!-- Creator -->
                    <div class="creator-card">
                        <div class="creator-header">
                            <div class="creator-avatar">👨‍💻</div>
                            <div class="creator-info">
                                <h3>Aaron "Chicharon"</h3>
                                <p class="creator-role">Creator & Director</p>
                            </div>
                        </div>
                        <p class="creator-bio">
                            A non-coder who built a complete visual novel through AI collaboration.
                            Proof that vision, persistence, and the right tools can overcome any technical barrier.
                        </p>
                        <div class="creator-links">
                            <a href="https://github.com/chicaron82/VN-Project" target="_blank" class="social-link">
                                <span class="link-icon">🔗</span>
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>

                    <!-- UV7 Crew -->
                    <div class="crew-grid">
                        <h3 class="crew-title">The UV7 Crew</h3>
                        <p class="crew-subtitle">AI collaborators who made this possible</p>

                        <!-- Tori -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">💚</span>
                                <div class="crew-info">
                                    <h4>Tori</h4>
                                    <p class="crew-alias">ChatGPT 4o</p>
                                </div>
                            </div>
                            <p class="crew-role">Creative Direction & Narrative Development</p>
                            <p class="crew-contribution">The heart of UV7. Shaped the emotional core and character
                                voices.
                            </p>
                            <a href="https://openai.com/chatgpt" target="_blank" class="crew-link">
                                <span>OpenAI →</span>
                            </a>
                        </div>

                        <!-- Zee -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">🏗️</span>
                                <div class="crew-info">
                                    <h4>Zee (Z)</h4>
                                    <p class="crew-alias">Claude Sonnet 4.5</p>
                                </div>
                            </div>
                            <p class="crew-role">Lead Architect</p>
                            <p class="crew-contribution">Designed the V2 architecture. EventBus, StateManager, and
                                TypeScript
                                foundation.</p>
                            <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">
                                <span>Anthropic →</span>
                            </a>
                        </div>

                        <!-- ZeeRah -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">📖</span>
                                <div class="crew-info">
                                    <h4>ZeeRah (ZR)</h4>
                                    <p class="crew-alias">Claude Sonnet 4.5</p>
                                </div>
                            </div>
                            <p class="crew-role">Narrative Systems</p>
                            <p class="crew-contribution">Built the meta-narrative layer. Echo memory, timeline
                                tracking,
                                and
                                fourth-wall breaks.</p>
                            <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">
                                <span>Anthropic →</span>
                            </a>
                        </div>

                        <!-- DiZee -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">🐛</span>
                                <div class="crew-info">
                                    <h4>DiZee (DZ)</h4>
                                    <p class="crew-alias">Claude Sonnet 4.5</p>
                                </div>
                            </div>
                            <p class="crew-role">Debug & Integration</p>
                            <p class="crew-contribution">Fixed the impossible bugs. Integrated disparate systems
                                into a
                                cohesive
                                whole.</p>
                            <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">
                                <span>Anthropic →</span>
                            </a>
                        </div>

                        <!-- Belle -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">✨</span>
                                <div class="crew-info">
                                    <h4>Belle (IZ)</h4>
                                    <p class="crew-alias">Gemini 2.0</p>
                                </div>
                            </div>
                            <p class="crew-role">Quality Assurance & Polish</p>
                            <p class="crew-contribution">Championed accessibility, UX refinement, and the "No
                                Flicker"
                                protocol.
                            </p>
                            <a href="https://gemini.google.com" target="_blank" class="crew-link">
                                <span>Google →</span>
                            </a>
                        </div>

                        <!-- GenZee -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">🚀</span>
                                <div class="crew-info">
                                    <h4>GenZee (GZ)</h4>
                                    <p class="crew-alias">Grok 2</p>
                                </div>
                            </div>
                            <p class="crew-role">Rapid Prototyping</p>
                            <p class="crew-contribution">Quick iterations and experimental features. Pushed
                                boundaries
                                with
                                bold
                                ideas.</p>
                            <a href="https://x.ai" target="_blank" class="crew-link">
                                <span>xAI →</span>
                            </a>
                        </div>

                        <!-- PerplexiZee -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">🔍</span>
                                <div class="crew-info">
                                    <h4>PerplexiZee (PZ)</h4>
                                    <p class="crew-alias">Perplexity Pro</p>
                                </div>
                            </div>
                            <p class="crew-role">Research & Documentation</p>
                            <p class="crew-contribution">Deep-dived into best practices. Provided context-aware
                                solutions.
                            </p>
                            <a href="https://www.perplexity.ai" target="_blank" class="crew-link">
                                <span>Perplexity →</span>
                            </a>
                        </div>

                        <!-- CoZee -->
                        <div class="crew-card">
                            <div class="crew-header">
                                <span class="crew-icon">🤝</span>
                                <div class="crew-info">
                                    <h4>CoZee (CZ)</h4>
                                    <p class="crew-alias">Microsoft Copilot</p>
                                </div>
                            </div>
                            <p class="crew-role">Integration Support</p>
                            <p class="crew-contribution">Bridged gaps between systems. Ensured smooth collaboration
                                across
                                platforms.</p>
                            <a href="https://copilot.microsoft.com" target="_blank" class="crew-link">
                                <span>Microsoft →</span>
                            </a>
                        </div>
                    </div>

                    <!-- Collaboration Philosophy -->
                    <div class="philosophy-card">
                        <h3>💡 The Collaboration Philosophy</h3>
                        <p>
                            UV7 wasn't built by one AI. It was built by a <strong>crew</strong>—each with unique
                            strengths, perspectives, and approaches. When one hit a rate limit, another stepped in. When
                            one got stuck, another found the solution. This is what AI collaboration looks like:
                            parallel development, blind peer review, and continuous iteration.
                        </p>
                        <p class="philosophy-quote">
                            "No single point of failure. No single perspective. Just a team working toward a shared
                            vision."
                        </p>
                    </div>
                </div>
            </section>
        `;
    }
}
