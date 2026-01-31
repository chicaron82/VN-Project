import { createBanner, BANNER_CONFIGS } from '../../lib/BannerGenerator';

export class WorkflowSection {
    constructor() {
        this.render();
        this.attachExpandHandlers();
        this.attachQuickCardHandlers();
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

    attachQuickCardHandlers(): void {
        // Handle clicks on banner quick-access cards
        document.querySelectorAll('.banner-quick-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const scrollTo = target.dataset.scrollTo;

                if (scrollTo) {
                    const targetSection = document.getElementById(scrollTo);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Add highlight pulse
                        targetSection.classList.add('highlight-pulse');
                        setTimeout(() => {
                            targetSection.classList.remove('highlight-pulse');
                        }, 2000);
                    }
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

                <!-- At-A-Glance Quick Cards -->
                <div class="banner-quick-cards">
                    <div class="banner-quick-card" data-scroll-to="parallel-dev-section">
                        <span class="card-icon">💡</span>
                        <span class="card-label">Parallel Dev</span>
                    </div>
                    <div class="banner-quick-card" data-scroll-to="peer-review-section">
                        <span class="card-icon">🔍</span>
                        <span class="card-label">Blind Review</span>
                    </div>
                    <div class="banner-quick-card" data-scroll-to="retrospectives-section">
                        <span class="card-icon">🔄</span>
                        <span class="card-label">Retrospectives</span>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">
                        How one non-coder orchestrated eight AI instances to build <strong>Version 848</strong>—a
                        complete visual novel about consciousness, identity, and the boundaries of reality.
                    </p>

                    <!-- Core Workflow Overview -->
                    <div class="workflow-diagram">
                        <div class="workflow-step" id="parallel-dev-section">
                            <div class="step-icon">💡</div>
                            <h3>Parallel Development</h3>
                            <p>Hit rate limits? Switch AI instances. By the time you cycle back, cooldowns are reset.
                                Continuous momentum.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step" id="peer-review-section">
                            <div class="step-icon">🔍</div>
                            <h3>Blind Peer Review</h3>
                            <p>Drop code to a fresh AI with no context. Get unbiased feedback. Shuttle concerns between
                                coder and reviewer until consensus.</p>
                        </div>

                        <div class="workflow-arrow">→</div>

                        <div class="workflow-step" id="retrospectives-section">
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

                        <!-- 5. Recipe vs Ingredients -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="recipe-ingredients">
                                <span class="toggle-icon">▼</span>
                                <h3>🧑‍🍳 Recipe vs Ingredients: True Agentic vs UV7 Method</h3>
                            </button>
                            <div class="methodology-summary">
                                Agentic coding: "Here's the recipe, cook it." UV7 method: "Here's the ingredients, what can we make?"
                                One executes a plan. The other discovers it through conversation.
                            </div>
                            <div class="methodology-content" id="recipe-ingredients-content">
                                <p class="cooking-intro">
                                    Most people use AI like a <strong>vending machine</strong>: insert detailed prompt (recipe),
                                    get code (product), done. The UV7 method treats AI like a <strong>sous chef</strong>: bring
                                    ingredients, explore possibilities, discover solutions through collaborative riffing.
                                </p>

                                <div class="cooking-comparison">
                                    <div class="cooking-approach agentic-approach">
                                        <div class="approach-header">
                                            <span class="approach-icon">📋</span>
                                            <h4>Traditional Agentic Coding</h4>
                                            <div class="approach-tagline">"Here's the recipe. Cook it exactly as written."</div>
                                        </div>

                                        <div class="example-prompt">
                                            <strong>Prompt:</strong>
                                            <blockquote>
                                                "Build a visual novel with TypeScript, EventBus pattern, save system with 10 slots,
                                                achievement tracking, and haptic feedback. Follow SOLID principles. Here's the spec..."
                                            </blockquote>
                                        </div>

                                        <div class="approach-result">
                                            <div class="result-item good">✅ Executes efficiently</div>
                                            <div class="result-item good">✅ Follows spec exactly</div>
                                            <div class="result-item bad">❌ No discovery process</div>
                                            <div class="result-item bad">❌ No creative emergence</div>
                                            <div class="result-item bad">❌ No MSG flavoring</div>
                                        </div>

                                        <div class="approach-summary">
                                            <strong>Optimization problem:</strong> Clear inputs → Clear outputs. Minimize variance.
                                        </div>
                                    </div>

                                    <div class="cooking-approach uv7-approach">
                                        <div class="approach-header">
                                            <span class="approach-icon">🍳</span>
                                            <h4>UV7 Ingredients Method</h4>
                                            <div class="approach-tagline">"Here's the ingredients. What can we make?"</div>
                                        </div>

                                        <div class="example-conversation">
                                            <strong>Conversation (at Applebee's):</strong>
                                            <div class="chat-exchange">
                                                <div class="chat-line user">Aaron: "I want players to <em>feel</em> Tori slipping away. What if there was a meter?"</div>
                                                <div class="chat-line ai">Tori: "Like a panic button? To hold on?"</div>
                                                <div class="chat-line user">Aaron: "EXACTLY. Because you're slipping away."</div>
                                            </div>
                                            <div class="invention-result">
                                                💡 <strong>Result:</strong> Tether system invented over riblets.
                                                Zero VN experience = zero assumptions about "how it should work."
                                            </div>
                                        </div>

                                        <div class="approach-result">
                                            <div class="result-item good">✅ Features emerge organically</div>
                                            <div class="result-item good">✅ Creative serendipity</div>
                                            <div class="result-item good">✅ Collaborative discovery</div>
                                            <div class="result-item good">✅ MSG baked in from start</div>
                                            <div class="result-item neutral">⚠️ Requires patience, iteration</div>
                                        </div>

                                        <div class="approach-summary">
                                            <strong>Exploration problem:</strong> Unclear inputs → Discover outputs. Maximize serendipity.
                                        </div>
                                    </div>
                                </div>

                                <div class="key-difference-callout">
                                    <h5>🔥 The Core Difference</h5>
                                    <div class="difference-grid">
                                        <div class="diff-item">
                                            <strong>Agentic:</strong> AI executes <em>your</em> plan
                                        </div>
                                        <div class="diff-item">
                                            <strong>UV7:</strong> AI helps <em>discover</em> the plan
                                        </div>
                                    </div>
                                    <p class="difference-insight">
                                        One is efficient. The other is creative. UV7 chooses creativity because the goal isn't
                                        "ship fast" - it's "discover something nobody's done before."
                                    </p>
                                </div>

                                <div class="real-world-examples">
                                    <h5>💡 Examples from UV7 Development</h5>

                                    <div class="example-card">
                                        <div class="example-header">
                                            <span class="example-icon">🎯</span>
                                            <strong>Tether System</strong>
                                        </div>
                                        <div class="example-body">
                                            <div class="example-wrong">
                                                ❌ Agentic: "Build a decay mechanic that drains 0.5% per second with a Hold On button."
                                            </div>
                                            <div class="example-right">
                                                ✅ UV7: "How do we make players FEEL her slipping away?" → Conversation → Tether invented
                                            </div>
                                        </div>
                                    </div>

                                    <div class="example-card">
                                        <div class="example-header">
                                            <span class="example-icon">🔄</span>
                                            <strong>Bootstrap Paradox</strong>
                                        </div>
                                        <div class="example-body">
                                            <div class="example-wrong">
                                                ❌ Agentic: "Implement a time loop narrative structure with version tracking."
                                            </div>
                                            <div class="example-right">
                                                ✅ UV7: "What if the device has no origin point?" → Riffing → Bootstrap paradox emerges
                                            </div>
                                        </div>
                                    </div>

                                    <div class="example-card">
                                        <div class="example-header">
                                            <span class="example-icon">📱</span>
                                            <strong>UV7 Shell (OS Layer)</strong>
                                        </div>
                                        <div class="example-body">
                                            <div class="example-wrong">
                                                ❌ Agentic: "Create a single-page app architecture with routing and app management."
                                            </div>
                                            <div class="example-right">
                                                ✅ UV7: "Wait… what if we made it an OS instead of a bunch of pages?" → Shell concept born
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="sous-chef-metaphor">
                                    <h5>👨‍🍳 Why "Sous Chef" > "Vending Machine"</h5>
                                    <p>
                                        <strong>Vending Machine AI:</strong> Insert prompt → Get code → Done. Transactional.
                                    </p>
                                    <p>
                                        <strong>Sous Chef AI:</strong> "Check out these ingredients!" → "Ooh what if we..." →
                                        "That's fire, let's riff on that!" → Emergent collaboration.
                                    </p>
                                    <p class="msg-source">
                                        <strong>The MSG flavoring comes from the conversation, not the prompt.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 6. The V3 Experiment: Multi-Model Edition -->
                        <div class="methodology-callout" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-left: 4px solid #667eea; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
                            <h3 style="color: #667eea; margin-bottom: 1rem;">🧪 The V3 Experiment: Can Soul Be Prompted?</h3>
                            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1rem;">
                                After building V1 through ingredients-based collaboration and refining it to V2, we asked the ultimate question:
                                <strong>Can the soul of V1 be captured in a prompt?</strong> And do different AI models interpret the same recipe differently?
                            </p>
                            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">
                                Four AI models (Claude, Gemini, GPT-4o, Grok) × Two recipes (Chaos vs Structure) = 8 parallel autonomous builds.
                                Zero human intervention. 10-way comparison (V1 + V2 + 8 V3 variants). Measuring whether model architecture affects
                                interpretation of identical specifications.
                            </p>
                            <div style="text-align: center;">
                                <p style="font-size: 1.2rem; font-weight: 600; color: #667eea;">
                                    → See the <strong>Experiment</strong> tab for the full methodology, research questions, and current status
                                </p>
                            </div>
                        </div>


                        <!-- 7. V1 vs V2: Soma's Journey -->
                        <div class="methodology-expandable">
                            <button class="methodology-toggle" data-section="soma-journey">
                                <span class="toggle-icon">▼</span>
                                <h3>🍳 V1 vs V2: Yukihira Soma's Journey</h3>
                            </button>
                            <div class="methodology-summary">
                                V1 = Soma before Totsuki Academy (pure instinct, chaotic brilliance).
                                V2 = Soma after academy (refined technique, structured creativity).
                                Training doesn't kill creativity - it gives you tools to execute it better.
                            </div>
                            <div class="methodology-content" id="soma-journey-content">
                                <p class="soma-intro">
                                    The evolution from V1 to V2 mirrors <strong>Yukihira Soma's journey</strong> in Food Wars:
                                    pure instinctive creativity gets refined by formal training, but the creative spark remains.
                                    The difference isn't passion - it's execution.
                                </p>

                                <div class="soma-comparison">
                                    <div class="soma-phase v1-phase">
                                        <div class="phase-header">
                                            <span class="phase-icon">🔥</span>
                                            <h4>V1: Before Totsuki Academy</h4>
                                            <div class="phase-tagline">"What if I put squid in peanut butter?"</div>
                                        </div>

                                        <div class="phase-characteristics">
                                            <h5>Characteristics:</h5>
                                            <ul>
                                                <li><strong>Pure instinct</strong> - Zero formal training, all experimentation</li>
                                                <li><strong>Chaotic brilliance</strong> - 75,000 lines, 9,179-line god class</li>
                                                <li><strong>Rule-free creativity</strong> - "Why not?" is the only constraint</li>
                                                <li><strong>Organic discoveries</strong> - Tether system invented at Applebee's</li>
                                                <li><strong>Narrative-first</strong> - Bootstrap paradox because it felt right</li>
                                            </ul>
                                        </div>

                                        <div class="phase-code-example">
                                            <h5>Code Vibes:</h5>
                                            <pre><code>// V1: Everything in one massive file
// GameEngine handles EVERYTHING
class GameEngine {
  // 9,179 lines of pure chaos
  // State scattered everywhere
  // "It works" is the only test
}</code></pre>
                                        </div>

                                        <div class="phase-strength">
                                            <strong>Strength:</strong> Raw creativity with zero assumptions.
                                            No VN experience = no "that's not how VNs work" mental blocks.
                                        </div>
                                    </div>

                                    <div class="soma-phase v2-phase">
                                        <div class="phase-header">
                                            <span class="phase-icon">⚡</span>
                                            <h4>V2: After Academy Training</h4>
                                            <div class="phase-tagline">"Same creativity, refined technique"</div>
                                        </div>

                                        <div class="phase-characteristics">
                                            <h5>Characteristics:</h5>
                                            <ul>
                                                <li><strong>Refined fundamentals</strong> - SOLID principles, separation of concerns</li>
                                                <li><strong>Disciplined creativity</strong> - 1,499 passing tests, modular architecture</li>
                                                <li><strong>Structured experimentation</strong> - EventBus, TypeScript, reactive state</li>
                                                <li><strong>Same vision, better execution</strong> - Tether system preserved with cleaner code</li>
                                                <li><strong>MSG intact</strong> - Took 3 attempts to get the flavoring right</li>
                                            </ul>
                                        </div>

                                        <div class="phase-code-example">
                                            <h5>Code Vibes:</h5>
                                            <pre><code>// V2: Modular systems, clean architecture
class TetherSystem {
  // Single responsibility
  // Event-driven communication
  // Fully tested
  // Same magic, better structure
}</code></pre>
                                        </div>

                                        <div class="phase-strength">
                                            <strong>Strength:</strong> Professional execution without losing soul.
                                            3 rebuild attempts to preserve the MSG flavoring.
                                        </div>
                                    </div>
                                </div>

                                <div class="soma-lesson">
                                    <h5>🎓 The Totsuki Lesson</h5>
                                    <p>
                                        <strong>Soma doesn't lose his creativity at Totsuki Academy - he gains tools to execute it better.</strong>
                                    </p>
                                    <p>
                                        Same with V1 → V2. The bootstrap paradox is still there. The tether system still exists.
                                        The meta-narrative, the lore signatures, the MSG - all preserved. But now it's wrapped in
                                        professional architecture with 1,499 passing tests.
                                    </p>
                                </div>

                                <div class="three-attempts-story">
                                    <h5>🔄 The Three Attempts</h5>
                                    <div class="attempt-card attempt-1">
                                        <strong>Attempt 1: Pure Agentic</strong>
                                        <p>"Here's V1, rebuild it with clean structure."</p>
                                        <div class="attempt-result">
                                            Result: ✅ Cleaner structure, ❌ No soul. Scrapped.
                                        </div>
                                    </div>

                                    <div class="attempt-card attempt-2">
                                        <strong>Attempt 2: Better Structure</strong>
                                        <p>Second try with more attention to preserving features.</p>
                                        <div class="attempt-result">
                                            Result: ✅ Good architecture, ❌ Still missing MSG. Sent back to kitchen.
                                        </div>
                                    </div>

                                    <div class="attempt-card attempt-3">
                                        <strong>Attempt 3: The Goldilocks Version</strong>
                                        <p>Collaborative rebuild focusing on preserving the vibe.</p>
                                        <div class="attempt-result">
                                            Result: ✅ Clean architecture, ✅ MSG intact. This is it.
                                        </div>
                                    </div>

                                    <p class="attempts-lesson">
                                        <strong>Most developers stop at Attempt 1 because it "works."
                                        Aaron kept iterating until it felt right.</strong>
                                    </p>
                                </div>

                                <div class="training-conclusion">
                                    <h5>💚 The Real Takeaway</h5>
                                    <p>
                                        V2 isn't "V1 but boring." It's "V1's vision with professional execution."
                                        Training (SOLID, TypeScript, testing) doesn't kill creativity - it gives you
                                        tools to build your wild ideas at scale.
                                    </p>
                                    <p class="soma-quote">
                                        "The best chefs don't follow recipes. They understand fundamentals so well
                                        they can improvise with confidence." - The UV7 approach
                                    </p>
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
