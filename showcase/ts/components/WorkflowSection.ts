import { createBanner, BANNER_CONFIGS } from '../../lib/BannerGenerator';

export class WorkflowSection {
    constructor() {
        this.render();
        this.attachExpandHandlers();
    }

    attachExpandHandlers(): void {
        // Handle expand/collapse for methodology sections
        document.querySelectorAll('.methodology-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const sectionId = target.dataset.section;
                const content = document.getElementById(`${sectionId}-content`);
                const icon = target.querySelector('.toggle-icon');

                if (content && icon) {
                    const isExpanded = content.classList.contains('expanded');
                    content.classList.toggle('expanded');
                    icon.textContent = isExpanded ? '▼' : '▲';
                }
            });
        });
    }

    render(): void {
        const mount = document.getElementById('uv7-workflow-mount');
        console.log('[WorkflowSection] Mount point:', mount ? 'found' : 'NOT FOUND');
        if (!mount) return;

        mount.innerHTML = `
            <section class="workflow-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.workflow)}

                <div class="section-content">
                    <p class="section-intro">
                        How one non-coder orchestrated eight AI instances to build <strong>Version 848</strong>—a
                        complete visual novel about consciousness, identity, and the boundaries of reality.
                    </p>

                    <!-- Core Workflow Overview -->
                    <div class="workflow-diagram">
                        <div class="workflow-step">
                            <div class="step-icon">💡</div>
                            <h3>Parallel Development</h3>
                            <p>Hit rate limits? Switch AI instances. By the time you cycle back, cooldowns are reset.
                                Continuous momentum.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step">
                            <div class="step-icon">🔍</div>
                            <h3>Blind Peer Review</h3>
                            <p>Drop code to a fresh AI with no context. Get unbiased feedback. Shuttle concerns between
                                coder and reviewer until consensus.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step">
                            <div class="step-icon">🔄</div>
                            <h3>Retrospectives</h3>
                            <p>End each session: "What worked? What didn't? What could be better?" Tackle improvements
                                next session. Continuous iteration.</p>
                        </div>
                    </div>

                    <!-- Collapsible Deep Dives -->
                    <div class="methodology-deep-dives">

                        <!-- 1. Blind Peer Review -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="peer-review">
                                <span class="toggle-icon">▼</span>
                                <h3>🔍 Blind Peer Review Process</h3>
                            </button>
                            <div class="methodology-summary">
                                Fresh AI review without context produces unbiased architectural insights instead of bug hunting.
                                Energy matching matters: enthusiastic sharing beats leading questions.
                            </div>
                            <div class="methodology-content" id="peer-review-content">
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
                                        <h4>2. Energy Matching > Prompt Engineering</h4>
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
                                        <p class="energy-insight">
                                            <strong>The Hack:</strong> AIs respond to your energy. Come in transactional, get bland output.
                                            Come in hot with enthusiasm—suddenly they're not just executing, they're <em>creating</em>.
                                        </p>
                                    </div>

                                    <div class="review-step">
                                        <h4>3. Adversarial Validation</h4>
                                        <p>
                                            Feedback gets shuttled between reviewer and implementer, creating dialogue that prevents
                                            groupthink and produces cleaner implementations. Features like unified shell architecture and
                                            liquid swipe indicators emerged from this process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Cognitive Diversity -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="cognitive-diversity">
                                <span class="toggle-icon">▼</span>
                                <h3>🧠 Cognitive Diversity Arbitrage</h3>
                            </button>
                            <div class="methodology-summary">
                                Multiple AIs create adversarial ensemble that produces more robust code than any single AI.
                                Different training biases → bias mitigation and better edge case coverage.
                            </div>
                            <div class="methodology-content" id="cognitive-diversity-content">
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
                        </div>

                        <!-- 3. Reality Check -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="reality-check">
                                <span class="toggle-icon">▼</span>
                                <h3>⚠️ Reality Check: Tradeoffs & Freedom</h3>
                            </button>
                            <div class="methodology-summary">
                                Multiple AIs can introduce bugs and require patience. But freedom from commercial pressure enables
                                experimentation. Even mistakes become creative opportunities.
                            </div>
                            <div class="methodology-content" id="reality-check-content">
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
                                </div>

                                <div class="creative-adaptation">
                                    <h5>🎨 Bugs → Narrative Features</h5>
                                    <p>
                                        Sometimes the best solution isn't fixing the bug - it's making it canon. When one sprite
                                        rendered taller than others, instead of fighting the technical issue, it became story:
                                        that character is narratively "dominant" in that act, towering over others.
                                    </p>
                                    <p style="margin-top: 1rem;">
                                        <strong>Even wrong AI feedback becomes inspiration:</strong> During review, one AI mistakenly
                                        thought saves were blocked in Act 1 (they weren't). That incorrect observation sparked an idea -
                                        now saves are <em>intentionally</em> blocked because the mistake became a feature.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 4. AI Fingerprints -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="ai-fingerprints">
                                <span class="toggle-icon">▼</span>
                                <h3>✍️ AI Fingerprints in Code</h3>
                            </button>
                            <div class="methodology-summary">
                                V1 has 222+ AI attribution comments. V2 has 50+. Code becomes living documentation of
                                collaborative problem-solving and tracks which approaches work best.
                            </div>
                            <div class="methodology-content" id="ai-fingerprints-content">
                                <p class="fingerprints-intro">
                                    The <strong>Version 848</strong> codebase itself becomes a collaboration record. Comments
                                    throughout (especially in V1) credit specific AIs for contributions: "DiZee helped fix this
                                    animation issue," "Tori and I riffed this navigation idea," "GenZee suggested this optimization."
                                    Code becomes living documentation of the creative process.
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
this.enableTimeMachine = true;</code></pre>
                                    </div>
                                    <div class="code-example v2-example">
                                        <h5>V2 Examples (Selective)</h5>
                                        <pre><code>// DIZEE POLISH: Making UV7 accessible to all players 💚
export interface AccessibilitySettings {

// 30 seconds throttle (DIZEE'S THROTTLE)
private minSaveInterval: number = 30000;

// Backup system (ZEE'S BACKUP SYSTEM)
private maxBackups: number = 2;</code></pre>
                                    </div>
                                </div>

                                <div class="legacy-note">
                                    <strong>Why This Matters:</strong> Future developers (including yourself) can see not just
                                    <em>what</em> was done, but <em>who contributed</em> and <em>how</em> solutions emerged.
                                    The code becomes a historical record of collaborative problem-solving.
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Workflow Benefits Summary -->
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
