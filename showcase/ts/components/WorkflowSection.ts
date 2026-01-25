export class WorkflowSection {
    constructor() {
        this.render();
    }

    render(): void {
        const mount = document.getElementById('uv7-workflow-mount');
        console.log('[WorkflowSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="workflow-section">
                <!-- Hero Banner -->
                <div class="hero-banner workflow">
                    <img src="media/banners/banner-workflow.png" alt="Workflow Banner" class="hero-banner-image">
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
                        <h1 class="hero-banner-title">The Workflow</h1>
                        <p class="hero-banner-subtitle">Orchestrating AI collaboration at scale</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">How one non-coder orchestrated multiple AI instances to build a complete
                        game.
                    </p>

                    <div class="workflow-diagram">
                        <div class="workflow-step">
                            <div class="step-icon">💡</div>
                            <h3>Parallel Development</h3>
                            <p>Hit rate limits? Switch AI instances. By the time you cycle back, cooldowns are reset.
                                Continuous
                                momentum.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step">
                            <div class="step-icon">🔍</div>
                            <h3>Blind Peer Review</h3>
                            <p>Drop code to a fresh AI with no context. Get unbiased feedback. Shuttle concerns between
                                coder
                                and reviewer until consensus.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step">
                            <div class="step-icon">🔄</div>
                            <h3>Retrospectives</h3>
                            <p>End each session: "What worked? What didn't? What could be better?" Tackle improvements
                                next
                                session. Continuous iteration.</p>
                        </div>
                    </div>

                    <!-- Blind Peer Review Deep Dive -->
                    <div class="methodology-showcase peer-review-section">
                        <h2>The Blind Peer Review Process</h2>
                        <p class="methodology-intro">
                            Instead of asking "what's wrong with this code?" (leading question), we share code with fresh AI instances using
                            enthusiasm and openness: "OMG check out this bougie ass idea!" This produces broader, more constructive insights.
                        </p>

                        <div class="review-process-flow">
                            <div class="review-step">
                                <h4>1. Fresh Eyes Approach</h4>
                                <div class="approach-example">
                                    <div class="input-example">
                                        <strong>Input to Fresh AI:</strong>
                                        <blockquote>
                                            "I *love* this kind of riff, because it's the exact sort of 'wait… what if we made it an OS instead 
                                            of a bunch of pages?' idea that can turn UV7 into something people don't forget."
                                        </blockquote>
                                    </div>
                                    <div class="insight-arrow">↓</div>
                                    <div class="feedback-quality">
                                        <strong>Result:</strong> Architectural insights and improvement suggestions rather than just bug hunting
                                    </div>
                                </div>
                            </div>

                            <div class="review-step">
                                <h4>2. Constructive Technical Feedback</h4>
                                <div class="feedback-examples">
                                    <div class="feedback-card">
                                        <h5>Swipe Navigation Analysis</h5>
                                        <p>
                                            "The 'Facebook Swipe' - 1:1 Direct Manipulation. You aren't just telling the interface to switch; 
                                            you are physically dragging it. It feels 'oiled' because the indicator moves exactly as fast as your finger."
                                        </p>
                                        <div class="insight-tag technical">Technical Excellence</div>
                                    </div>
                                    <div class="feedback-card">
                                        <h5>Architecture Recommendations</h5>
                                        <p>
                                            "One index.html = one Shell + multiple Apps. You don't unify by mashing code together. 
                                            You unify by creating a shell with proper lifecycle management."
                                        </p>
                                        <div class="insight-tag architectural">System Design</div>
                                    </div>
                                </div>
                            </div>

                            <div class="review-step">
                                <h4>3. Integration & Refinement</h4>
                                <div class="integration-process">
                                    <p>
                                        Feedback gets shuttled back to the main coder AI, creating a dialogue between reviewer and implementer.
                                        This adversarial validation prevents groupthink and produces cleaner final implementations.
                                    </p>
                                    <div class="outcome-highlight">
                                        <strong>Outcome:</strong> Features like unified shell architecture, liquid swipe indicators, 
                                        and proper gesture management emerged from this peer review process.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="methodology-insight energy-insight">
                            <h4>🔥 Key Insight: Enthusiasm vs. Problem-Hunting</h4>
                            <div class="comparison-grid">
                                <div class="approach-comparison">
                                    <div class="approach-bad">
                                        <h5>❌ Leading Questions</h5>
                                        <p>"What's wrong with this code?"</p>
                                        <p>"Can you find bugs in this?"</p>
                                        <small>Produces narrow, negative feedback</small>
                                    </div>
                                    <div class="approach-good">
                                        <h5>✅ Enthusiastic Sharing</h5>
                                        <p>"Check out this bougie ass idea!"</p>
                                        <p>"I love this kind of riff..."</p>
                                        <small>Produces broad, constructive insights</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="methodology-insight cognitive-diversity">
                            <h4>🧠 Meta-Discovery: Cognitive Diversity Arbitrage</h4>
                            <p class="diversity-intro">
                                What started as "rate limit arbitrage" revealed something deeper: each AI has different training biases, 
                                architectural preferences, and blind spots. Multiple AIs create an adversarial ensemble that produces 
                                more robust code than any single AI could achieve.
                            </p>

                            <div class="diversity-benefits-grid">
                                <div class="diversity-benefit">
                                    <div class="benefit-icon">🎯</div>
                                    <h5>Bias Mitigation</h5>
                                    <p>Zee's TypeScript patterns get challenged by DiZee's performance focus. No single AI's assumptions dominate.</p>
                                </div>
                                <div class="diversity-benefit">
                                    <div class="benefit-icon">🔍</div>
                                    <h5>Edge Case Coverage</h5>
                                    <p>What one AI's pattern matching misses, another catches. Different training exposures = better bug detection.</p>
                                </div>
                                <div class="diversity-benefit">
                                    <div class="benefit-icon">🌊</div>
                                    <h5>Orthogonal Perspectives</h5>
                                    <p>Tori sees UX issues, GenZee suggests experimental approaches. Multiple "coding philosophies" cross-validate.</p>
                                </div>
                                <div class="diversity-benefit">
                                    <div class="benefit-icon">⚡</div>
                                    <h5>Systematic Review</h5>
                                    <p>Like having multiple senior developers with different backgrounds, except they're AI instances with diverse training.</p>
                                </div>
                            </div>

                            <div class="meta-insight-callout">
                                <strong>The Real Innovation:</strong> Most developers stick with one AI for "consistency." 
                                UV7 proves that intentional <em>inconsistency</em> across multiple AIs creates more robust solutions 
                                through systematic bias reduction.
                            </div>
                        </div>

                        <div class="methodology-insight reality-check">
                            <h4>⚠️ Reality Check: The Methodology Isn't Perfect</h4>
                            <p class="reality-intro">
                                Let's be honest - this approach has real downsides. Multiple AI perspectives sometimes create 
                                conflicting implementations, bugs get introduced when switching between coding styles, and 
                                patience is required to get things back on track when experiments go sideways.
                            </p>

                            <div class="honest-tradeoffs">
                                <div class="tradeoff-item">
                                    <div class="tradeoff-icon">🐛</div>
                                    <h5>Bug Introduction</h5>
                                    <p>Different AIs have different coding patterns. Switching mid-implementation can create inconsistencies.</p>
                                </div>
                                <div class="tradeoff-item">
                                    <div class="tradeoff-icon">⏱️</div>
                                    <h5>Patience Required</h5>
                                    <p>Sometimes you need multiple sessions to untangle conflicts when experiments don't work out.</p>
                                </div>
                                <div class="tradeoff-item">
                                    <div class="tradeoff-icon">💥</div>
                                    <h5>Breaking Things</h5>
                                    <p>Wild experiments can break existing functionality. Rollbacks and fixes become part of the process.</p>
                                </div>
                            </div>

                            <div class="freedom-factor">
                                <h5>🎯 The Freedom Factor</h5>
                                <p>
                                    This methodology works because there's <strong>no commercial pressure</strong>. No launch dates, 
                                    no stakeholders, no expectations. Just pure experimentation and play. That freedom to break things 
                                    and come up with "wild ass shit" is what enables the innovation.
                                </p>
                                <blockquote>
                                    "Fortunately for me, I'm just doing this for fun. I'm free to play around and 
                                    even break things along the way."
                                </blockquote>
                            </div>

                            <div class="creative-adaptation">
                                <h5>🎨 Bugs as Narrative Features</h5>
                                <p>
                                    Sometimes the best solution isn't fixing the bug - it's making it canon. When one sprite 
                                    rendered taller than others, instead of fighting the technical issue, it became story: 
                                    that character is narratively "dominant" in that act, towering over others who grow in 
                                    height as the story progresses until equilibrium is restored.
                                </p>
                                <div class="adaptation-highlight">
                                    <strong>Constraint → Feature:</strong> Technical limitations become creative opportunities 
                                    when you have the freedom to adapt the narrative around the reality of the code.
                                </div>
                            </div>

                            <div class="creative-adaptation feedback-inspiration">
                                <h5>💡 Even Wrong Feedback Becomes Inspiration</h5>
                                <p>
                                    During blind review, one AI mistakenly thought saves were blocked in Act 1 (they weren't). 
                                    But that incorrect observation sparked an idea: what if the despair character - the one 
                                    towering over others - could narratively interfere with saving? Now saves are 
                                    <em>intentionally</em> blocked in Act 1, because a mistaken review became a feature.
                                </p>
                                <div class="inspiration-highlight">
                                    <strong>Misunderstanding → Mechanic:</strong> Even incorrect AI feedback can become 
                                    creative inspiration when you're free to implement the "mistake" as an intentional design choice.
                                </div>
                            </div>
                        </div>

                        <div class="methodology-insight code-fingerprints">
                            <h4>✍️ AI Fingerprints in Code</h4>
                            <p class="fingerprints-intro">
                                The codebase itself becomes a collaboration record. Comments throughout (especially in V1) 
                                credit specific AIs for contributions: "DiZee helped fix this animation issue," "Tori and I 
                                riffed this navigation idea," "GenZee suggested this optimization." Code becomes living 
                                documentation of the creative process.
                            </p>

                            <div class="fingerprint-examples">
                                <div class="code-example v1-example">
                                    <h5>V1 Examples (Rich Attribution)</h5>
                                    <pre><code>// ========================================
// DIZEE POLISH: ACHIEVEMENT VIEWER UI
// ========================================

// DIZEE FIX: Double buzz when Tori jumps back to her body
if (navigator.vibrate) navigator.vibrate([25, 25]);

// DIZEE POLISH: Track when notes were collected
this.noteTimestamps = {}; // { noteId: timestamp }

// TIME MACHINE SUPPORT (DIZEE)
this.enableTimeMachine = true;

// DIZEE: Unread tracking for inbox badge
this.unreadCount = 0;</code></pre>
                                </div>
                                <div class="code-example v2-example">
                                    <h5>V2 Examples (Evolving Style)</h5>
                                    <pre><code>// DIZEE POLISH: Making UV7 accessible to all players 💚
export interface AccessibilitySettings {

// 30 seconds throttle (DIZEE'S THROTTLE)
private minSaveInterval: number = 30000;

// Backup system (ZEE'S BACKUP SYSTEM)
private maxBackups: number = 2;

// DIZEE: Internal thought bubbles
import { DialogBubble } from '@ui/components/DialogBubble';</code></pre>
                                </div>
                            </div>

                            <div class="attribution-comparison">
                                <div class="comparison-insight">
                                    <h5>📊 Attribution Density</h5>
                                    <div class="density-stats">
                                        <div class="stat-item">
                                            <span class="version">V1</span>
                                            <span class="count">222+ AI tags</span>
                                            <span class="style">Rich, detailed attribution</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="version">V2</span>
                                            <span class="count">50+ AI tags</span>
                                            <span class="style">More selective, evolved practice</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="fingerprint-benefit">
                                    <h5>Why This Matters</h5>
                                    <p>
                                        Future developers (including yourself) can see not just <em>what</em> was done, 
                                        but <em>who contributed</em> and <em>how</em> solutions emerged. The code becomes 
                                        a historical record of collaborative problem-solving.
                                    </p>
                                </div>
                            </div>

                            <div class="legacy-note">
                                <strong>Legacy Consideration:</strong> This practice is stronger in V1's codebase. 
                                Maintaining AI attribution in future versions preserves the collaborative spirit and 
                                helps track which approaches work best with which AI personalities.
                            </div>
                        </div>

                        <div class="methodology-insight advice-trap">
                            <h4>⚠️ The AI Advice Trap: Technical Correctness vs. Context</h4>
                            <p class="advice-intro">
                                Even your own methodology can be turned against you. An AI suggested "move to TypeScript for better 
                                code quality" - technically correct, but contextually terrible for a non-coder who preferred 
                                simple workflows over terminal commands.
                            </p>

                            <div class="workflow-comparison">
                                <div class="workflow-before">
                                    <h5>JavaScript Workflow (Simple)</h5>
                                    <div class="workflow-steps">
                                        <span class="step">Edit file</span>
                                        <span class="arrow">→</span>
                                        <span class="step">Open in browser</span>
                                        <span class="arrow">→</span>
                                        <span class="step">See results ✅</span>
                                    </div>
                                    <p class="workflow-result good">Deploy? Upload to GitHub Pages ✅</p>
                                </div>
                                
                                <div class="workflow-after">
                                    <h5>TypeScript Workflow (Complex)</h5>
                                    <div class="workflow-steps">
                                        <span class="step">Edit file</span>
                                        <span class="arrow">→</span>
                                        <span class="step">Terminal commands???</span>
                                        <span class="arrow">→</span>
                                        <span class="step">Dev server???</span>
                                        <span class="arrow">→</span>
                                        <span class="step">Maybe see results? ❌</span>
                                    </div>
                                    <p class="workflow-result bad">"What's a terminal?" - Non-coder confusion</p>
                                </div>
                            </div>

                            <div class="advice-lesson">
                                <h5>🎯 The Lesson</h5>
                                <p>
                                    <strong>Energy matching applies to advice you receive too.</strong> The AI was in 
                                    "optimization mode" but ignored context: non-technical background, deployment preferences, 
                                    and "just want it to work" philosophy. Technical advice can be wrong if it doesn't fit your reality.
                                </p>
                                <blockquote>
                                    "Your gut instinct about JS being easier was probably right all along."
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    <div class="workflow-benefits">
                        <div class="benefit-card">
                            <h4>No Single Point of Failure</h4>
                            <p>Multiple AI perspectives catch issues one might miss</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Rate Limit Arbitrage</h4>
                            <p>Turn constraints into features through smart cycling</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Adversarial Validation</h4>
                            <p>Blind reviews prevent groupthink and bias</p>
                        </div>
                        <div class="benefit-card">
                            <h4>Iterative Refinement</h4>
                            <p>Each session builds on lessons learned</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
