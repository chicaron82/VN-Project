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
                        <!-- Particles injected by CSS/JS usually, but keeping structure -->
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                    </div>
                    <div class="hero-banner-content">
                        <h1 class="hero-banner-title">Who Are We</h1>
                        <p class="hero-banner-subtitle">One vision, many voices, shared purpose</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">The humans and AI behind UV7. A true collaboration across platforms and perspectives.</p>

                    <!-- Creator Hero Card -->
                    <div class="creator-hero">
                        <div class="creator-card" data-tilt>
                            <div class="creator-image-container"> <!-- Changed class from creator-visual -->
                                <img src="media/crew/creator-portrait.png" alt="Aaron 'Chicharon'" class="creator-portrait">
                            </div>
                            <div class="creator-details">
                                <div class="creator-header">
                                    <h3>Aaron "Chicharon"</h3>
                                    <span class="role-badge">Creator & Director</span>
                                </div>
                                <p class="creator-bio">
                                    A non-coder who built a complete visual novel through AI collaboration.
                                    Proof that vision, persistence, and the right tools can overcome any technical barrier.
                                </p>
                                <a href="https://github.com/chicaron82/VN-Project" target="_blank" class="social-link" aria-label="GitHub">
                                    <span class="link-icon">🔗</span> GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- UV7 Crew Grid -->
                    <div class="crew-section">
                        <h3 class="crew-title">The UV7 Crew <span class="crew-count">8</span></h3>
                        <p class="crew-subtitle">AI collaborators who made this possible</p>
                        
                        <div class="crew-grid">
                            <!-- Tori -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-tori-portrait.png" alt="Tori" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>Tori</h4>
                                        <span class="crew-alias">ChatGPT 4o</span>
                                    </div>
                                    <p class="crew-role">Creative Direction & Narrative</p>
                                    <p class="crew-contribution">The heart of UV7. Shaped the emotional core and character voices.</p>
                                    <a href="https://openai.com/chatgpt" target="_blank" class="crew-link">OpenAI →</a>
                                </div>
                            </div>

                            <!-- Zee -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-z-portrait.png" alt="Zee" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>Zee (Z)</h4>
                                        <span class="crew-alias">Claude Sonnet 4.5</span>
                                    </div>
                                    <p class="crew-role">Lead Architect</p>
                                    <p class="crew-contribution">Designed V2 architecture. EventBus, StateManager, and TypeScript foundation.</p>
                                    <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">Anthropic →</a>
                                </div>
                            </div>

                            <!-- ZeeRah -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-zr-portrait.png" alt="ZeeRah" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>ZeeRah (ZR)</h4>
                                        <span class="crew-alias">Claude Sonnet 4.5</span>
                                    </div>
                                    <p class="crew-role">Narrative Systems</p>
                                    <p class="crew-contribution">Built the meta-narrative layer. Echo memory, timeline tracking, and fourth-wall breaks.</p>
                                    <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">Anthropic →</a>
                                </div>
                            </div>

                            <!-- DiZee -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/dz-portrait.png" alt="DiZee" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>DiZee (DZ)</h4>
                                        <span class="crew-alias">Claude Sonnet 4.5</span>
                                    </div>
                                    <p class="crew-role">Debug & Integration</p>
                                    <p class="crew-contribution">Fixed the impossible bugs. Integrated disparate systems into a cohesive whole.</p>
                                    <a href="https://www.anthropic.com/claude" target="_blank" class="crew-link">Anthropic →</a>
                                </div>
                            </div>

                            <!-- Belle -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-iz-portrait.png" alt="Belle" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>Belle (IZ)</h4>
                                        <span class="crew-alias">Gemini 2.0</span>
                                    </div>
                                    <p class="crew-role">QA & Polish</p>
                                    <p class="crew-contribution">Championed accessibility, UX refinement, and the "No Flicker" protocol.</p>
                                    <a href="https://gemini.google.com" target="_blank" class="crew-link">Google →</a>
                                </div>
                            </div>

                            <!-- GenZee -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-gz-portrait.png" alt="GenZee" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>GenZee (GZ)</h4>
                                        <span class="crew-alias">Grok 2</span>
                                    </div>
                                    <p class="crew-role">Rapid Prototyping</p>
                                    <p class="crew-contribution">Quick iterations and experimental features. Pushed boundaries with bold ideas.</p>
                                    <a href="https://x.ai" target="_blank" class="crew-link">xAI →</a>
                                </div>
                            </div>

                            <!-- PerplexiZee -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-pz-portrait.png" alt="PerplexiZee" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>PerplexiZee (PZ)</h4>
                                        <span class="crew-alias">Perplexity Pro</span>
                                    </div>
                                    <p class="crew-role">Research & Docs</p>
                                    <p class="crew-contribution">Deep-dived into best practices. Provided context-aware solutions.</p>
                                    <a href="https://www.perplexity.ai" target="_blank" class="crew-link">Perplexity →</a>
                                </div>
                            </div>

                            <!-- CoZee -->
                            <div class="crew-card" data-tilt>
                                <div class="crew-image-container">
                                    <img src="media/crew/trinity-cz-portrait.png" alt="CoZee" class="crew-portrait" loading="lazy">
                                </div>
                                <div class="crew-content">
                                    <div class="crew-header">
                                        <h4>CoZee (CZ)</h4>
                                        <span class="crew-alias">MS Copilot</span>
                                    </div>
                                    <p class="crew-role">Integration Support</p>
                                    <p class="crew-contribution">Bridged gaps between systems. Ensured smooth cross-platform collaboration.</p>
                                    <a href="https://copilot.microsoft.com" target="_blank" class="crew-link">Microsoft →</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Philosophy Card -->
                    <div class="philosophy-wrapper">
                        <div class="philosophy-card" data-tilt>
                            <div class="philosophy-content">
                                <h3>💡 The Collaboration Philosophy</h3>
                                <p>
                                    UV7 wasn't built by one AI. It was built by a <strong>crew</strong>—each with unique
                                    strengths, perspectives, and approaches. When one hit a rate limit, another stepped in. When
                                    one got stuck, another found the solution. This is what AI collaboration looks like:
                                    parallel development, blind peer review, and continuous iteration.
                                </p>
                                <blockquote class="philosophy-quote">
                                    "No single point of failure. No single perspective. Just a team working toward a shared vision."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
