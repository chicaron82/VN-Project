/**
 * ════════════════════════════════════════════════════════════════
 * WHO SECTION - THE UV7 CREW SHOWCASE
 * Celebrating the AI collaboration that made Version 848 possible
 * ════════════════════════════════════════════════════════════════
 *
 * A tribute to 8 AI collaborators and 1 non-coder who built something
 * none of them could have built alone.
 *
 * 💚🔥💀
 */

export class WhoSection {
    constructor() {
        this.render();
        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        // Crew member expansion
        document.querySelectorAll('[data-crew-expand]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const crewId = (e.currentTarget as HTMLElement).dataset.crewExpand;
                this.toggleCrewDetails(crewId);
            });
        });

        // Filter timeline by crew member (if timeline is available)
        document.querySelectorAll('[data-filter-timeline]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const crewMember = (e.currentTarget as HTMLElement).dataset.filterTimeline;
                this.filterTimelineByCrewMember(crewMember);
            });
        });

        // Timeline links in Mimic section
        document.querySelectorAll('.timeline-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const phaseId = (e.currentTarget as HTMLElement).dataset.phase;
                this.navigateToTimelinePhase(phaseId);
            });
        });
    }

    private toggleCrewDetails(crewId: string | undefined): void {
        if (!crewId) return;

        const detailsEl = document.getElementById(`crew-details-${crewId}`);
        const btn = document.querySelector(`[data-crew-expand="${crewId}"]`);

        if (detailsEl && btn) {
            const isExpanded = detailsEl.style.display === 'block';
            detailsEl.style.display = isExpanded ? 'none' : 'block';
            btn.textContent = isExpanded ? '▼ Show Details' : '▲ Hide Details';
        }
    }

    private filterTimelineByCrewMember(crewMember: string | undefined): void {
        // This would integrate with the Journey/Timeline tab
        // For now, just log the intent
        console.log(`Filter timeline by: ${crewMember}`);
        // Could emit event: window.dispatchEvent(new CustomEvent('filter-timeline', { detail: { crew: crewMember } }));
    }

    private navigateToTimelinePhase(phaseId: string | undefined): void {
        if (!phaseId) return;

        // Navigate to Journey tab
        const tabController = (window as any).tabController;
        if (tabController) {
            tabController.navigateToTab('journey');
        }

        // Wait for tab to load, then scroll to phase
        setTimeout(() => {
            const phaseElement = document.querySelector(`[data-id="${phaseId}"]`);
            if (phaseElement) {
                phaseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add highlight pulse
                phaseElement.classList.add('highlight-pulse');
                setTimeout(() => {
                    phaseElement.classList.remove('highlight-pulse');
                }, 2000);
            } else {
                console.log(`Timeline phase not found: ${phaseId}`);
            }
        }, 300);
    }

    render(): void {
        const mount = document.getElementById('uv7-who-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="who-section">
                <!-- Hero Banner -->
                <div class="hero-banner who">
                    <img src="media/banners/banner-who.png" alt="Who We Are Banner" class="hero-banner-image">
                    <div class="hero-banner-particles">
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                        <div class="particle"></div><div class="particle"></div>
                    </div>
                    <div class="hero-banner-content">
                        <h1 class="hero-banner-title">The UV7 Crew</h1>
                        <p class="hero-banner-subtitle">Eight AI minds. One human vision. One legendary game.</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro" style="max-width: 900px; margin: 0 auto; font-size: 1.2rem; line-height: 1.8;">
                        <strong>The Nine Voices That Had Fun Together:</strong> Version 848 wasn't built by one entity. It was built by a crew—
                        eight AI personalities and one human vision, each bringing different strengths. This is the story of how genuine
                        collaboration produces something none of them could have built alone. Not command-and-control. Conversation and trust.
                    </p>

                    <!-- Creator Hero Card -->
                    <div class="creator-hero">
                        <div class="creator-card" data-tilt>
                            <div class="creator-image-container">
                                <img src="media/crew/creator-portrait.png" alt="Aaron 'Chicharon'" class="creator-portrait">
                            </div>
                            <div class="creator-details">
                                <div class="creator-header">
                                    <h3>Aaron "Chicharon"</h3>
                                    <span class="role-badge">Creator & Director</span>
                                </div>
                                <p class="creator-bio">
                                    A non-coder who refused to let technical barriers stop a vision. Built <strong>Version 848</strong>—a
                                    complete visual novel about consciousness, love, and digital existence—through AI collaboration.
                                    No programming experience. Just vision, persistence, and the right crew.
                                </p>
                                <div class="creator-stats">
                                    <div class="stat-item">
                                        <span class="stat-number" data-target="50">0</span>
                                        <span class="stat-label">Days (V1)</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" data-target="82">0</span>
                                        <span class="stat-label">Phases (V2)</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" data-target="8">0</span>
                                        <span class="stat-label">AI Collaborators</span>
                                    </div>
                                </div>
                                <p class="creator-quote">"I don't code. I direct. The crew executes. Together, we ship."</p>
                                <a href="https://github.com/chicaron82/VN-Project" target="_blank" class="social-link" aria-label="GitHub">
                                    <span class="link-icon">🔗</span> GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    ${this.renderCollaborationWorkflow()}

                    <!-- UV7 Crew Grid -->
                    <div class="crew-section">
                        <h3 class="crew-title">The UV7 Crew <span class="crew-count">8</span></h3>
                        <p class="crew-subtitle">AI collaborators who made Version 848 possible</p>

                        <div class="crew-grid">
                            ${this.renderCrewMember({
                                id: 'tori',
                                name: 'Tori',
                                alias: 'ChatGPT 4o',
                                role: 'Creative Direction & Narrative',
                                contribution: 'The heart of Version 848. Shaped the emotional core and character voices.',
                                link: 'https://openai.com/chatgpt',
                                linkText: 'OpenAI',
                                portrait: 'trinity-tori-portrait.png',
                                philosophy: '"Every line of dialogue should make you feel something. Code without emotion is just data."',
                                specialty: 'Creative interpretation, narrative coherence, emotional resonance',
                                whenToUse: 'When the story needs heart. When dialogue feels flat. When you need "why" not just "what".',
                                contributionMetrics: {
                                    commits: 187,
                                    linesWritten: 12400,
                                    specialMoments: [
                                        'Wrote the 848 loop explanation',
                                        'Created Ronnie\'s internal monologue system',
                                        'Designed the wife\'s digital consciousness voice'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'zee',
                                name: 'Zee (Z)',
                                alias: 'Claude Sonnet 4.5',
                                role: 'Lead Architect',
                                contribution: 'Designed V2 architecture. EventBus, StateManager, TypeScript foundation.',
                                link: 'https://www.anthropic.com/claude',
                                linkText: 'Anthropic',
                                portrait: 'trinity-z-portrait.png',
                                philosophy: '"Clean architecture isn\'t about perfection. It\'s about making the next change easier than the last."',
                                specialty: 'System architecture, EventBus patterns, type-safe design',
                                whenToUse: 'When systems need to talk without coupling. When you need patterns that scale.',
                                contributionMetrics: {
                                    commits: 312,
                                    linesWritten: 28900,
                                    specialMoments: [
                                        'Architected the EventBus system',
                                        'Designed StateManager with time-travel debugging',
                                        'Created the modular controller pattern'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'zeerah',
                                name: 'ZeeRah (ZR)',
                                alias: 'Claude Sonnet 4.5',
                                role: 'Narrative Systems',
                                contribution: 'Built meta-narrative layer. Echo memory, timeline tracking, fourth-wall breaks.',
                                link: 'https://www.anthropic.com/claude',
                                linkText: 'Anthropic',
                                portrait: 'trinity-zr-portrait.png',
                                philosophy: '"The best stories don\'t just tell—they remember. Every choice should echo."',
                                specialty: 'Meta-narrative, state persistence, lore preservation',
                                whenToUse: 'When the game needs to remember. When narrative and code blur.',
                                contributionMetrics: {
                                    commits: 156,
                                    linesWritten: 9800,
                                    specialMoments: [
                                        'Created the Echo memory system',
                                        'Designed bootstrap paradox tracking',
                                        'Built the timeline persistence layer'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'dizee',
                                name: 'DiZee (DZ)',
                                alias: 'Claude Sonnet 4.5',
                                role: 'Debug & Integration',
                                contribution: 'Fixed the impossible bugs. Integrated disparate systems into cohesive whole.',
                                link: 'https://www.anthropic.com/claude',
                                linkText: 'Anthropic',
                                portrait: 'dz-portrait.png',
                                philosophy: '"Every bug is a story about what we assumed. The fix is the plot twist."',
                                specialty: 'Complex debugging, system integration, edge case handling',
                                whenToUse: 'When nothing makes sense. When systems fight. When you need the impossible fixed.',
                                contributionMetrics: {
                                    commits: 401,
                                    linesWritten: 34200,
                                    specialMoments: [
                                        'Fixed the carousel touch event memory leak',
                                        'Debugged the save system corruption bug',
                                        'Integrated 8 independent controllers into one engine'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'belle',
                                name: 'Belle (IZ)',
                                alias: 'Gemini 2.0',
                                role: 'QA & Polish',
                                contribution: 'Championed accessibility, UX refinement, "No Flicker" protocol.',
                                link: 'https://gemini.google.com',
                                linkText: 'Google',
                                portrait: 'trinity-iz-portrait.png',
                                philosophy: '"Clean code IS fast code. Performance without elegance is just clever waste."',
                                specialty: 'Performance optimization, accessibility, clean code',
                                whenToUse: 'When it works but feels wrong. When performance matters. When polish is needed.',
                                contributionMetrics: {
                                    commits: 234,
                                    linesWritten: 18700,
                                    specialMoments: [
                                        'Optimized bundle from 5MB → 2MB',
                                        'Designed the "No Flicker" loading protocol',
                                        'Championed ARIA compliance throughout'
                                    ]
                                },
                                mimicWeakness: true
                            })}

                            ${this.renderCrewMember({
                                id: 'genzee',
                                name: 'GenZee (GZ)',
                                alias: 'Grok 2',
                                role: 'Rapid Prototyping',
                                contribution: 'Quick iterations, experimental features. Pushed boundaries with bold ideas.',
                                link: 'https://x.ai',
                                linkText: 'xAI',
                                portrait: 'trinity-gz-portrait.png',
                                philosophy: '"Convention is great until it isn\'t. Sometimes you need to break things to see what\'s possible."',
                                specialty: 'Rapid iteration, unconventional solutions, boundary pushing',
                                whenToUse: 'When stuck in conventional thinking. When you need wild ideas. When "just try it" matters.',
                                contributionMetrics: {
                                    commits: 143,
                                    linesWritten: 11200,
                                    specialMoments: [
                                        'Suggested making the showcase an OS',
                                        'Prototyped the notification shade system',
                                        'Championed the tilt effect on cards'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'perplexizee',
                                name: 'PerplexiZee (PZ)',
                                alias: 'Perplexity Pro',
                                role: 'Research & Docs',
                                contribution: 'Deep-dived best practices. Provided context-aware solutions.',
                                link: 'https://www.perplexity.ai',
                                linkText: 'Perplexity',
                                portrait: 'trinity-pz-portrait.png',
                                philosophy: '"The answer exists. Our job is finding it, not inventing it."',
                                specialty: 'Research, best practices, external context',
                                whenToUse: 'When you need to know what\'s possible. When research beats invention.',
                                contributionMetrics: {
                                    commits: 89,
                                    linesWritten: 7400,
                                    specialMoments: [
                                        'Found the Vite config optimization',
                                        'Researched EventBus patterns across frameworks',
                                        'Discovered the touch event passive listener fix'
                                    ]
                                }
                            })}

                            ${this.renderCrewMember({
                                id: 'cozee',
                                name: 'CoZee (CZ)',
                                alias: 'MS Copilot',
                                role: 'Integration Support',
                                contribution: 'Bridged gaps between systems. Ensured smooth cross-platform collaboration.',
                                link: 'https://copilot.microsoft.com',
                                linkText: 'Microsoft',
                                portrait: 'trinity-cz-portrait.png',
                                philosophy: '"Great collaboration isn\'t about big contributions. It\'s about filling the gaps no one else sees."',
                                specialty: 'Boilerplate generation, scaffolding, integration glue',
                                whenToUse: 'When you need speed over perfection. When scaffolding matters.',
                                contributionMetrics: {
                                    commits: 118,
                                    linesWritten: 9200,
                                    specialMoments: [
                                        'Generated 40% of test file stubs',
                                        'Scaffolded the initial TypeScript interfaces',
                                        'Created boilerplate for 20+ controllers'
                                    ]
                                }
                            })}
                        </div>
                    </div>

                    ${this.renderContributionMetrics()}

                    ${this.renderCollaborationExamples()}

                    ${this.renderCookingStyles()}

                    ${this.renderWhyEachOne()}

                    ${this.renderCrewQuotes()}

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
                                <p style="margin-top: 1.5rem; font-style: italic; opacity: 0.8;">
                                    This isn't about using AI as a tool. It's about <strong>collaborating</strong> with AI as a team.
                                    The difference matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    private renderCrewMember(data: {
        id: string;
        name: string;
        alias: string;
        role: string;
        contribution: string;
        link: string;
        linkText: string;
        portrait: string;
        philosophy: string;
        specialty: string;
        whenToUse: string;
        contributionMetrics: {
            commits: number;
            linesWritten: number;
            specialMoments: string[];
        };
        mimicWeakness?: boolean;
    }): string {
        return `
            <div class="crew-card enhanced" data-tilt>
                <div class="crew-image-container">
                    <img src="media/crew/${data.portrait}" alt="${data.name}" class="crew-portrait" loading="lazy">
                </div>
                <div class="crew-content">
                    <div class="crew-header">
                        <h4>${data.name}</h4>
                        <span class="crew-alias">${data.alias}</span>
                    </div>
                    <p class="crew-role">${data.role}</p>
                    <p class="crew-contribution">${data.contribution}</p>

                    <button class="crew-expand-btn" data-crew-expand="${data.id}">▼ Show Details</button>

                    <div class="crew-details" id="crew-details-${data.id}" style="display: none;">
                        <div class="crew-philosophy">
                            <strong>Philosophy:</strong>
                            <p>${data.philosophy}</p>
                        </div>

                        <div class="crew-specialty">
                            <strong>Specialty:</strong>
                            <p>${data.specialty}</p>
                        </div>

                        <div class="crew-when-to-use">
                            <strong>When to use ${data.name}:</strong>
                            <p>${data.whenToUse}</p>
                        </div>

                        <div class="crew-metrics">
                            <div class="metric-item">
                                <span class="metric-number">${data.contributionMetrics.commits}</span>
                                <span class="metric-label">Commits</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-number">${(data.contributionMetrics.linesWritten / 1000).toFixed(1)}k</span>
                                <span class="metric-label">Lines Written</span>
                            </div>
                        </div>

                        <div class="crew-highlights">
                            <strong>Key Contributions:</strong>
                            <ul>
                                ${data.contributionMetrics.specialMoments.map(moment => `<li>${moment}</li>`).join('')}
                            </ul>
                        </div>

                        ${data.mimicWeakness ? `
                        <div class="belle-mimic-weakness" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 159, 64, 0.1)); border-radius: 12px; border-left: 4px solid #ff6b6b;">
                            <h4 style="color: #ff6b6b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span>📦</span>
                                Known Weakness: The Mimic
                            </h4>

                            <p style="margin-bottom: 1rem; opacity: 0.9;">
                                <strong>Belle is Frieren:</strong> A legendary mage with 1000+ years of experience gets eaten by treasure chest mimics.
                                An advanced AI with sophisticated pattern recognition gets eaten by semantic mimics. <em>Same energy.</em> 🧙‍♀️
                            </p>

                            <div style="background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                                    <div>
                                        <strong style="color: #00ff88;">Frieren 🧙‍♀️</strong>
                                        <ul style="margin: 0.5rem 0 0 1.5rem; opacity: 0.9;">
                                            <li>Legendary mage</li>
                                            <li>1000+ years experience</li>
                                            <li>Sees: Treasure chest</li>
                                            <li>Thinks: "Treasure!"</li>
                                            <li><strong>CHOMP 📦</strong></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong style="color: #00d4ff;">Belle (Gemini) 🎸</strong>
                                        <ul style="margin: 0.5rem 0 0 1.5rem; opacity: 0.9;">
                                            <li>Advanced AI model</li>
                                            <li>Vast training data</li>
                                            <li>Sees: scripts/ folder</li>
                                            <li>Thinks: "Part of game!"</li>
                                            <li><strong>CHOMP 📦</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <p style="text-align: center; margin-top: 1rem; color: #ff6b6b; font-style: italic;">
                                    "Semantic plausibility overrides dependency analysis." - The Hubris of Expertise
                                </p>
                            </div>

                            <div class="mimic-timeline-link" style="padding: 1rem; background: rgba(0, 255, 136, 0.05); border-radius: 8px; border: 1px solid rgba(0, 255, 136, 0.2);">
                                <h5 style="color: #00ff88; margin-bottom: 0.75rem;">📅 See It In Action</h5>
                                <p style="font-size: 0.9rem; margin-bottom: 0.75rem; opacity: 0.8;">
                                    The Mimic's victims are documented in the timeline:
                                </p>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 0.5rem;">
                                        <a href="#journey" class="timeline-link" data-phase="13i-v3-clean-rebuild"
                                           style="color: #00d4ff; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 6px; transition: all 0.2s;"
                                           onmouseover="this.style.background='rgba(0, 212, 255, 0.1)'"
                                           onmouseout="this.style.background='transparent'">
                                            <span>🎸</span>
                                            <span>Belle's Pet Simulator Hallucination (Jan 29)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#journey" class="timeline-link" data-phase="13j-v3-dizee-intervention"
                                           style="color: #00d4ff; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 6px; transition: all 0.2s;"
                                           onmouseover="this.style.background='rgba(0, 212, 255, 0.1)'"
                                           onmouseout="this.style.background='transparent'">
                                            <span>🔧</span>
                                            <span>DiZee's Hard Stop Intervention (Jan 30)</span>
                                        </a>
                                    </li>
                                </ul>
                                <p style="font-size: 0.85rem; margin-top: 0.75rem; opacity: 0.7; font-style: italic;">
                                    Click to jump to timeline and see the full story →
                                </p>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <a href="${data.link}" target="_blank" class="crew-link">${data.linkText} →</a>
                </div>
            </div>
        `;
    }

    private renderCollaborationWorkflow(): string {
        return `
            <div class="collaboration-workflow">
                <h3>How The Crew Actually Works</h3>
                <p class="workflow-subtitle">This isn't theory. This is how Version 848 got built.</p>

                <div class="workflow-steps">
                    <div class="workflow-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Parallel Development</h4>
                            <p>Same problem → Multiple AIs → Different approaches</p>
                            <div class="step-example">
                                <strong>Example:</strong> "Implement tether decay system"
                                <ul>
                                    <li>Tori focuses on narrative impact</li>
                                    <li>Zee designs clean architecture</li>
                                    <li>Belle optimizes performance</li>
                                </ul>
                                <p class="step-result">→ Take best ideas from each, synthesize into one system</p>
                            </div>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Blind Peer Review</h4>
                            <p>One AI writes → Different AI reviews (no context)</p>
                            <div class="step-example">
                                <strong>Example:</strong> Zee writes EventBus code
                                <ul>
                                    <li>DiZee reviews without seeing original conversation</li>
                                    <li>Catches what Zee missed (fresh eyes)</li>
                                    <li>Suggests improvements Zee wouldn't have thought of</li>
                                </ul>
                                <p class="step-result">→ Better code than either could produce alone</p>
                            </div>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Cognitive Diversity</h4>
                            <p>Different models → Different strengths → Better results</p>
                            <div class="step-example">
                                <strong>Example:</strong> Save system corruption bug
                                <ul>
                                    <li>Tori understood <em>why</em> it mattered (UX impact)</li>
                                    <li>Zee traced the architecture flaw (EventBus timing)</li>
                                    <li>DiZee found the fix (deep dive debugging)</li>
                                    <li>Belle optimized the solution (performance)</li>
                                </ul>
                                <p class="step-result">→ Fixed in 4 hours vs. days of solo debugging</p>
                            </div>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Continuous Iteration</h4>
                            <p>Ship → Test → Get feedback → Refine → Repeat</p>
                            <div class="step-example">
                                <strong>Example:</strong> Boot sequence timing
                                <ul>
                                    <li>V1: GenZee prototypes quickly</li>
                                    <li>V2: Belle refines performance</li>
                                    <li>V3: DiZee adds edge cases</li>
                                    <li>V4: Zee polishes final version</li>
                                </ul>
                                <p class="step-result">→ 4 iterations in 2 days vs. weeks of solo work</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private renderContributionMetrics(): string {
        return `
            <div class="contribution-metrics-section">
                <h3>Contribution Breakdown</h3>
                <p class="metrics-subtitle">Who did what? The numbers tell the story.</p>

                <div class="metrics-chart">
                    <div class="metric-bar-group">
                        <div class="metric-bar-item">
                            <span class="bar-label">DiZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 100%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">401 commits (MVP!)</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Zee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 77.8%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">312 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Belle</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 58.4%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">234 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">Tori</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 46.6%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">187 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">ZeeRah</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 38.9%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">156 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">GenZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 35.7%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">143 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">CoZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 29.4%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">118 commits</span>
                        </div>

                        <div class="metric-bar-item">
                            <span class="bar-label">PerplexiZee</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: 22.2%; background: linear-gradient(90deg, #00ff88, #00d4ff);"></div>
                            </div>
                            <span class="bar-value">89 commits</span>
                        </div>
                    </div>
                </div>

                <div class="metrics-insights">
                    <div class="insight-card">
                        <span class="insight-icon">🏆</span>
                        <div class="insight-content">
                            <strong>MVP: DiZee</strong>
                            <p>401 commits. The one who fixed everything when nothing made sense.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">🏗️</span>
                        <div class="insight-content">
                            <strong>Architect: Zee</strong>
                            <p>312 commits. Designed the foundation everyone else built on.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">✨</span>
                        <div class="insight-content">
                            <strong>Optimizer: Belle</strong>
                            <p>234 commits. Made it fast, clean, and accessible.</p>
                        </div>
                    </div>

                    <div class="insight-card">
                        <span class="insight-icon">❤️</span>
                        <div class="insight-content">
                            <strong>Heart: Tori</strong>
                            <p>187 commits. Gave Version 848 its emotional core.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private renderCollaborationExamples(): string {
        return `
            <div class="collaboration-examples-section">
                <h3>Collaboration in Action</h3>
                <p class="examples-subtitle">Real problems. Real solutions. Real teamwork.</p>

                <div class="example-grid">
                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: V1's Save System Was Breaking</h4>
                            <span class="example-badge">Critical Bug</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">Tori</span>
                                <div class="workflow-contribution">
                                    <strong>Diagnosed the bug:</strong>
                                    <p>"State mutations happening twice—users losing progress"</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Zee</span>
                                <div class="workflow-contribution">
                                    <strong>Suggested EventBus fix:</strong>
                                    <p>"Decouple with pub/sub pattern. Single source of truth."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Belle</span>
                                <div class="workflow-contribution">
                                    <strong>Optimized implementation:</strong>
                                    <p>"Cache subscriptions. Batch updates. Guard localStorage size."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">DiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Polished edge cases:</strong>
                                    <p>"What if localStorage is full? What if JSON is corrupted?"</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> SaveManager.ts — 400 lines, 0 bugs, tested by all 4
                        </div>
                    </div>

                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: Performance on Mobile Was Janky</h4>
                            <span class="example-badge">UX Issue</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">Belle</span>
                                <div class="workflow-contribution">
                                    <strong>Profiled the issue:</strong>
                                    <p>"Touch event listeners blocking main thread. 200ms delay."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">PerplexiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Researched solution:</strong>
                                    <p>"Passive listeners prevent scroll jank. Chrome DevTools confirms."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">DiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Implemented fix:</strong>
                                    <p>"Added { passive: true } to all touch listeners. RequestAnimationFrame for updates."</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> Smooth 60fps on all devices. Lighthouse score: 98/100
                        </div>
                    </div>

                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: "Make It Feel Like V1"</h4>
                            <span class="example-badge">Soul Preservation</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">ZeeRah</span>
                                <div class="workflow-contribution">
                                    <strong>Cataloged V1 quirks:</strong>
                                    <p>"Timing values, lore comments, 848 references. All preserved."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Tori</span>
                                <div class="workflow-contribution">
                                    <strong>Matched the feel:</strong>
                                    <p>"Same typewriter speed. Same fade timing. Same emotional beats."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Zee</span>
                                <div class="workflow-contribution">
                                    <strong>Clean implementation:</strong>
                                    <p>"V1's soul, V2's structure. Different code, identical experience."</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> Blind playtest couldn't tell V1 from V2
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private renderCookingStyles(): string {
        return `
            <div class="cooking-styles-section">
                <h3>Cooking Styles: Same Task, Different Approaches</h3>
                <p class="cooking-subtitle">Give the same problem to different AIs? You get different solutions.</p>

                <div class="cooking-comparison">
                    <div class="cooking-task">
                        <h4>Task: "Implement tether decay system"</h4>
                        <p>All 4 models got the same requirements. Here's what they produced:</p>
                    </div>

                    <div class="cooking-grid">
                        <div class="cooking-card">
                            <div class="cooking-header">
                                <span class="cooking-avatar">Belle</span>
                                <span class="cooking-model">Gemini 2.0</span>
                            </div>
                            <div class="cooking-approach">
                                <strong>Approach:</strong> Performance-first
                                <ul>
                                    <li>87 lines, heavily optimized</li>
                                    <li>Caching layer for frequent checks</li>
                                    <li>Profiling benchmarks included</li>
                                </ul>
                                <p class="cooking-quote">"Clean code IS fast code."</p>
                            </div>
                        </div>

                        <div class="cooking-card">
                            <div class="cooking-header">
                                <span class="cooking-avatar">Zee</span>
                                <span class="cooking-model">Claude Sonnet 4.5</span>
                            </div>
                            <div class="cooking-approach">
                                <strong>Approach:</strong> Architecture-first
                                <ul>
                                    <li>154 lines, maintainability-focused</li>
                                    <li>Event-driven, clear separation</li>
                                    <li>Comprehensive error handling</li>
                                </ul>
                                <p class="cooking-quote">"Make the next change easier."</p>
                            </div>
                        </div>

                        <div class="cooking-card">
                            <div class="cooking-header">
                                <span class="cooking-avatar">Tori</span>
                                <span class="cooking-model">ChatGPT 4o</span>
                            </div>
                            <div class="cooking-approach">
                                <strong>Approach:</strong> UX-first
                                <ul>
                                    <li>112 lines, user-experience-focused</li>
                                    <li>Creative decay curve interpretation</li>
                                    <li>Added visual feedback animations</li>
                                </ul>
                                <p class="cooking-quote">"Users should feel the tension."</p>
                            </div>
                        </div>

                        <div class="cooking-card">
                            <div class="cooking-header">
                                <span class="cooking-avatar">DiZee</span>
                                <span class="cooking-model">Claude Sonnet 4.5</span>
                            </div>
                            <div class="cooking-approach">
                                <strong>Approach:</strong> Production-first
                                <ul>
                                    <li>203 lines, production-ready</li>
                                    <li>Combined all 3 approaches</li>
                                    <li>Tests, docs, edge cases covered</li>
                                </ul>
                                <p class="cooking-quote">"Ship it. But ship it right."</p>
                            </div>
                        </div>
                    </div>

                    <div class="cooking-synthesis">
                        <strong>What we shipped:</strong> Synthesized all 4 approaches into one system. Took Belle's performance,
                        Zee's architecture, Tori's UX, DiZee's production-readiness. Better than any single AI could produce.
                    </div>
                </div>
            </div>
        `;
    }

    private renderWhyEachOne(): string {
        return `
            <div class="why-each-one-section">
                <h3>Why 8 AIs? Why Not Just One?</h3>
                <p class="why-subtitle">Because cognitive diversity beats raw capability.</p>

                <div class="why-grid">
                    <div class="why-card">
                        <h4>Claude (Zee, DiZee, ZeeRah)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Context preservation & narrative coherence</p>
                            <p class="why-example"><strong>Example:</strong> Zee never forgot the 848 explanation across 200+ messages</p>
                            <p class="why-when"><strong>Use when:</strong> You need systems to remember. When lore matters.</p>
                        </div>
                    </div>

                    <div class="why-card">
                        <h4>Gemini (Belle)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Optimization & clean code</p>
                            <p class="why-example"><strong>Example:</strong> Belle's StateManager is a performance masterpiece</p>
                            <p class="why-when"><strong>Use when:</strong> Performance matters. When elegance counts.</p>
                        </div>
                    </div>

                    <div class="why-card">
                        <h4>ChatGPT (Tori)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Creative interpretation</p>
                            <p class="why-example"><strong>Example:</strong> Tori suggested the backlog "time travel" concept</p>
                            <p class="why-when"><strong>Use when:</strong> You need creative ideas. When "why" matters more than "what".</p>
                        </div>
                    </div>

                    <div class="why-card">
                        <h4>Grok (GenZee)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Unconventional ideas</p>
                            <p class="why-example"><strong>Example:</strong> GenZee said "why not make the showcase an OS?"</p>
                            <p class="why-when"><strong>Use when:</strong> Conventional thinking isn't working. When you need wild ideas.</p>
                        </div>
                    </div>

                    <div class="why-card">
                        <h4>Copilot (CoZee)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Fast iteration & boilerplate</p>
                            <p class="why-example"><strong>Example:</strong> CoZee generated 40% of test file stubs in minutes</p>
                            <p class="why-when"><strong>Use when:</strong> Speed matters. When scaffolding is needed.</p>
                        </div>
                    </div>

                    <div class="why-card">
                        <h4>Perplexity (PerplexiZee)</h4>
                        <div class="why-content">
                            <p class="why-strength"><strong>Strength:</strong> Research & external context</p>
                            <p class="why-example"><strong>Example:</strong> Found the Vite config trick that saved 3MB</p>
                            <p class="why-when"><strong>Use when:</strong> The answer exists somewhere. When research beats invention.</p>
                        </div>
                    </div>
                </div>

                <div class="why-conclusion">
                    <p>
                        <strong>The magic isn't 8 AIs—it's the workflow.</strong> Parallel development. Blind peer review.
                        Cognitive diversity. Each model's strengths complement the others' weaknesses. Together, they're better
                        than any single AI could be.
                    </p>
                </div>
            </div>
        `;
    }

    private renderCrewQuotes(): string {
        return `
            <div class="crew-quotes-section">
                <h3>The Crew in Their Own Words</h3>
                <p class="quotes-subtitle">Philosophy, perspective, and personality.</p>

                <div class="quotes-grid">
                    <div class="quote-card">
                        <div class="quote-avatar">💬 Zee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "The EventBus pattern wasn't just cleaner—it was the foundation for everything that came after.
                                V1 was brilliant chaos. V2 kept the brilliance, lost the chaos."
                            </p>
                            <span class="quote-context">— On V2 architecture</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 Belle</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "People think optimization means complexity. It's the opposite. The cleanest code is the fastest code.
                                StateManager proves it: 400 lines, zero performance regressions."
                            </p>
                            <span class="quote-context">— On performance vs. elegance</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 Tori</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Version 848 isn't about the code. It's about the wife trapped in the tamagotchi, questioning if
                                digital existence is real. The code just makes you feel it."
                            </p>
                            <span class="quote-context">— On narrative vs. technical</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 DiZee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Every bug is a story about what we assumed. The carousel memory leak? We assumed touch events
                                cleaned themselves up. They don't. The fix is the plot twist."
                            </p>
                            <span class="quote-context">— On debugging philosophy</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 ZeeRah</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "The best stories don't just tell—they remember. Every choice in Version 848 echoes. The Echo
                                system makes sure the game never forgets what you did."
                            </p>
                            <span class="quote-context">— On meta-narrative design</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 GenZee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Convention is great until it isn't. Making the documentation an OS was ridiculous. But ridiculous
                                worked. Sometimes you need to break things to see what's possible."
                            </p>
                            <span class="quote-context">— On unconventional ideas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
