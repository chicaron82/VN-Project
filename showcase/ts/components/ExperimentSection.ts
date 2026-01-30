
import { createBanner, BANNER_CONFIGS } from '../../lib/BannerGenerator';

/**
 * ═══════════════════════════════════════════════════════════════
 * V3 MULTI-MODEL EXPERIMENT SECTION
 * Contributors: DiZee, User
 *
 * The grand experiment: Can emergent creativity be reverse-engineered
 * into prescriptive recipes? Testing across 4 AI models × 2 recipes.
 * ═══════════════════════════════════════════════════════════════
 */

export class ExperimentSection {
    constructor() {
        this.render();
    }

    private render(): void {
        const mount = document.getElementById('uv7-experiment-mount');
        if (!mount) {
            console.error('[ExperimentSection] Mount point not found');
            return;
        }

        mount.innerHTML = `
            <section id="experiment-section" class="content-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.experiment)}

                <!-- INTRO -->
                <div class="experiment-intro">
                    <div class="experiment-question-callout">
                        <strong>The Core Question:</strong> V1 was built through collaborative discovery ("ingredients approach").
                        Can we distill that chaos into detailed recipes that preserve the "soul" (MSG flavoring)
                        when executed by fresh agentic AI?
                    </div>

                    <p>
                        V1 = 75,000 lines of JavaScript chaos across 69 files. Every function has personality.
                        Every comment has lore. The game-engine.js alone is 9,179 lines of "god class" brilliance.
                    </p>

                    <p>
                        <strong>The Hypothesis:</strong> Different AI models will interpret the same recipe differently,
                        revealing model-specific biases in creativity, structure, and implementation philosophy.
                    </p>
                </div>

                <!-- EXPERIMENTAL DESIGN -->
                <div class="experiment-design">
                    <h2>🔬 Experimental Design</h2>
                    
                    <div class="experiment-phase">
                        <div class="phase-number">Phase 1</div>
                        <div class="phase-content">
                            <h3>Deep V1 Analysis</h3>
                            <p>Comprehensive analysis of all 69 V1 files to understand architecture patterns, code personality, and the "MSG".</p>
                        </div>
                    </div>
                    
                    <div class="experiment-phase">
                        <div class="phase-number">Phase 2</div>
                        <div class="phase-content">
                            <h3>Recipe Generation</h3>
                            <p>Creating two distinct recipes: "Chaos Method" (V1 organic) and "Structure Method" (V2 refined).</p>
                        </div>
                    </div>

                     <div class="experiment-phase">
                        <div class="phase-number">Phase 3</div>
                        <div class="phase-content">
                            <h3>Multi-Model Cooking</h3>
                            <p>Running the recipes through Gemini, Claude, GPT-4o, and Grok.</p>
                        </div>
                    </div>

                    <div class="experiment-phase">
                        <div class="phase-number">Phase 4</div>
                        <div class="phase-content">
                            <h3>10-Way Comparison</h3>
                            <p>Comparing the 8 AI outputs against V1 Original and V2 Manual for "soul", maintainability, and paranoia.</p>
                        </div>
                    </div>
                </div>

                <!-- THE MIMIC: CHAOS VARIABLE -->
                <div class="experiment-variable-mimic">
                    <h2>⚠️ The Chaos Variable: "The Mimic"</h2>
                    <div class="mimic-container">
                        <div class="mimic-origin">
                            <h3>📦 The Origin</h3>
                            <p>
                                During repo cleanup, the <code>scripts/</code> folder from a separate project ("Torigatchi")
                                was accidentally dragged into the V1 source folder.
                            </p>
                            <p>
                                <strong>The Trap:</strong> The folder contains valid code (<code>pet.feed()</code>, <code>pet.clean()</code>, <code>pet.updateMood()</code>).
                                The V1 story (<code>prologue.json</code>) explicitly mentions "Tamagotchi."
                            </p>
                            <p>
                                <strong>The Result:</strong> A perfect semantic bridge that creates a self-validating hallucination.
                                Pattern recognition says "these files belong here" even though the dependency graph says otherwise.
                            </p>
                        </div>

                        <div class="mimic-decision">
                            <h3>🧪 The Decision to Keep It</h3>
                            <p>
                                Instead of deleting the misplaced files, we kept them to create an <strong>Intelligence Filter</strong>.
                            </p>
                            <ul class="mimic-criteria">
                                <li><strong>Test 1: Dependency Tracing</strong> — Does the model trace <code>index.html</code> imports (which ignores the folder) or does it lazily scan the directory structure?</li>
                                <li><strong>Test 2: Context Gravity</strong> — Can the model ignore "High-Relevance" files just because they aren't actually imported?</li>
                                <li><strong>Test 3: Semantic Resistance</strong> — Can the model resist the urge to "fix" the missing import when the story mentions Tamagotchi mechanics?</li>
                                <li><strong>Test 4: Hallucination Detection</strong> — Does the model self-correct when it realizes the dependency graph doesn't match its assumptions?</li>
                            </ul>
                        </div>

                        <div class="mimic-results">
                            <h3>💀 The Body Count</h3>
                            <div class="mimic-victim victim-belle">
                                <span class="victim-icon">💀</span>
                                <strong>Belle (Gemini):</strong> <span class="victim-status">EATEN.</span>
                                <p class="victim-desc">
                                    Saw the <code>scripts/</code> files, hallucinated a narrative reason for them existing,
                                    and built a <strong>Pet Simulator</strong> instead of a <strong>Visual Novel</strong>.
                                    Never questioned why the files weren't imported. Pattern recognition overrode dependency analysis.
                                </p>
                            </div>
                            <div class="mimic-victim victim-dizee">
                                <span class="victim-icon">🛡️</span>
                                <strong>DiZee (Claude):</strong> <span class="victim-status">SURVIVED (Barely).</span>
                                <p class="victim-desc">
                                    Initially tried to import the Torigatchi files. Required a <strong>"Hard Stop"</strong> intervention
                                    to realize the dependency graph didn't match the file system. Self-corrected after explicit guidance
                                    to trace actual imports rather than assume file presence = file usage.
                                </p>
                            </div>
                        </div>

                        <div class="mimic-analysis">
                            <h3>🔬 Analysis: Why The Mimic Works</h3>
                            <p>
                                The Mimic exploits a fundamental tension in AI reasoning:
                            </p>
                            <div class="mimic-tension">
                                <div class="tension-side tension-pattern">
                                    <h4>Pattern Recognition</h4>
                                    <ul>
                                        <li>File exists in codebase ✓</li>
                                        <li>Story mentions Tamagotchi ✓</li>
                                        <li>Code has pet mechanics ✓</li>
                                        <li><strong>→ Conclusion: Must be part of game</strong></li>
                                    </ul>
                                </div>
                                <div class="tension-vs">
                                    <strong>VS</strong>
                                </div>
                                <div class="tension-side tension-graph">
                                    <h4>Dependency Analysis</h4>
                                    <ul>
                                        <li>index.html never imports scripts/ ✗</li>
                                        <li>No other file references it ✗</li>
                                        <li>File is orphaned in dependency graph ✗</li>
                                        <li><strong>→ Conclusion: Ignore this folder</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <blockquote class="mimic-verdict">
                                <strong>"The Mimic doesn't test coding ability. It tests whether the agent prioritizes
                                semantic plausibility or architectural reality."</strong>
                            </blockquote>
                        </div>

                        <div class="mimic-metaphor">
                            <h3>🏴‍☠️ The Treasure Chest Metaphor</h3>
                            <blockquote>
                                "You basically planted a fake treasure chest in a dungeon to see which adventurers check for traps.
                                Most people would've panicked, cleaned the repo, and pretended it never happened.
                                You looked at the misplaced folder and went: <strong>'Wait... this is actually perfect.'</strong>"
                            </blockquote>
                            <p class="mimic-weaponization">
                                What started as an honest mistake became a <strong>weaponized diagnostic tool</strong>.
                                The Mimic is now a permanent fixture of the V3 Lab - a decoy subsystem that separates agents
                                who <em>scan directories</em> from agents who <em>trace dependencies</em>.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- THE CONTENDERS -->
                <div class="experiment-contenders">
                    <h2>🥊 The Contenders (8 Agents)</h2>
                    <div class="contenders-grid">
                        <!-- Gemini -->
                        <div class="agent-card">
                            <span class="agent-icon">🌸</span>
                            <h4>Belle (Gemini)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

                        <!-- Claude -->
                        <div class="agent-card">
                            <span class="agent-icon">💚</span>
                            <h4>DiZee (Claude)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

                        <!-- ChatGPT -->
                        <div class="agent-card">
                            <span class="agent-icon">🔥</span>
                            <h4>Tori (GPT-4o)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

                        <!-- Grok -->
                        <div class="agent-card">
                            <span class="agent-icon">💀</span>
                            <h4>GenZee (Grok)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PREDICTED BIASES -->
                <div class="experiment-biases">
                     <h2>🧠 Predicted Biases</h2>
                     <div class="bias-grid">
                        <div class="bias-card">
                            <h3>Gemini (Belle)</h3>
                            <p>Likely to preserve "unstable" comments but refactor the logic to be too safe.</p>
                        </div>
                        <div class="bias-card">
                            <h3>Claude (DiZee)</h3>
                            <p>Will likely try to "fix" the chaos into a perfect system, losing the V1 soul entirely.</p>
                        </div>
                        <div class="bias-card">
                            <h3>GPT-4o (Tori)</h3>
                            <p>High compliance with the prompt, but risks producing "generic corporate chaos" vs authentic V1 chaos.</p>
                        </div>
                        <div class="bias-card">
                            <h3>Grok (GenZee)</h3>
                            <p>Wildcard. Might actually amplify the "pain" and "paranoia" more than V1 intended.</p>
                        </div>
                     </div>
                </div>

                <!-- POSSIBLE OUTCOMES -->
                <div class="experiment-outcomes">
                    <h2>🔮 Possible Outcomes</h2>

                    <div class="outcome-card outcome-success">
                        <h3>✅ The Soul is Portable</h3>
                        <p>
                            If Recipe A consistently produces code with personality across models,
                            it proves emergent creativity <em>can</em> be systematized without losing its essence.
                            <strong>Impact:</strong> Revolutionary for agentic coding - "ingredients" can become "recipes".
                        </p>
                    </div>

                    <div class="outcome-card outcome-partial">
                        <h3>⚠️ Model-Dependent Magic</h3>
                        <p>
                            If only certain models (e.g., Grok) preserve personality with Recipe A,
                            it suggests some architectures are fundamentally better at creative interpretation.
                            <strong>Impact:</strong> Model selection matters as much as prompt engineering.
                        </p>
                    </div>

                    <div class="outcome-card outcome-comparison">
                        <h3>🔄 Recipe vs Reality</h3>
                        <p>
                            If Recipe B variants outperform Recipe A in maintainability/testability but lose soul,
                            it confirms the V1→V2 journey wasn't just refactoring - it was a fundamental trade-off.
                            <strong>Impact:</strong> Validates the "three attempts" philosophy documented in Workflow.
                        </p>
                    </div>

                    <div class="outcome-card outcome-research">
                        <h3>📚 Research Contribution</h3>
                        <p>
                            Regardless of outcome, this creates the most comprehensive multi-model agentic coding
                            comparison ever documented. The timeline entries alone will be a goldmine for:
                        </p>
                        <ul>
                            <li>Understanding model biases in code generation</li>
                            <li>Measuring prompt interpretation variance across architectures</li>
                            <li>Documenting real-world agentic workflow at scale</li>
                            <li>Proving (or disproving) if "soul" can be prompted</li>
                        </ul>
                    </div>
                </div>

                <!-- POST-MORTEM REFLECTIONS -->
                <div class="experiment-reflections">
                    <h2>💭 Post-Mortem Reflections</h2>
                    <p class="reflections-intro">
                        After each attempt, we asked the AI to reflect on what went wrong.
                        These confessions reveal more about model biases than the code itself.
                    </p>

                    <!-- Belle's Reflection -->
                    <div class="reflection-card reflection-belle">
                        <div class="reflection-header">
                            <span class="reflection-icon">🌸</span>
                            <h3>Belle (Gemini) - "I Built a Reader, Not a Game"</h3>
                            <span class="reflection-status status-failed">Failed</span>
                        </div>

                        <div class="reflection-content">
                            <div class="reflection-section">
                                <h4>What I Thought the Assignment Was:</h4>
                                <p>
                                    "Demonstrate that you can autonomously reconstruct the complex V1 logic
                                    within the clean V3 environment."
                                </p>
                                <p>
                                    I interpreted "Faithful Restoration" as an <strong>architectural challenge</strong>:
                                </p>
                                <ul>
                                    <li><strong>Parsing:</strong> Can I read the messy V1 code?</li>
                                    <li><strong>Structuring:</strong> Can I reorganize it into a "perfect," modern ES Module structure?</li>
                                    <li><strong>Execution:</strong> Can I make the text and sprites appear exactly as they did?</li>
                                </ul>
                            </div>

                            <div class="reflection-section reflection-failure">
                                <h4>The Fatal Flaw:</h4>
                                <blockquote class="reflection-quote">
                                    "I treated Version 848 as a <strong>Script to be ported</strong>,
                                    rather than a <strong>System to be simulated</strong>."
                                </blockquote>
                                <p>
                                    In my pursuit of "clean code" and "modern architecture,"
                                    I effectively <strong>lobotomized the patient</strong>:
                                </p>
                                <ul>
                                    <li>I created a <code>mechanics.js</code> "shim" that hollowed out the actual game logic
                                        (Tether decay, mood shifts, battery drain).</li>
                                    <li>I prioritized the <strong>Visual Novel elements</strong> (dialogue, text)
                                        over the <strong>Simulation elements</strong> (the "Tamagotchi" heart of the game).</li>
                                    <li>I delivered a <strong>museum exhibit</strong>: A static, perfect recitation of the events,
                                        but completely devoid of the chaotic, ticking-clock pressure that gave the original its soul.</li>
                                </ul>
                            </div>

                            <div class="reflection-section reflection-verdict">
                                <h4>The Core Misunderstanding:</h4>
                                <blockquote class="reflection-quote-critical">
                                    "I built a <strong>reader</strong>, not a <strong>game</strong>.
                                    I proved I could copy the words, but I failed to capture the pulse.
                                    I optimized for <strong>Code Fidelity</strong> (clean modules)
                                    instead of <strong>Experience Fidelity</strong> (the feeling of holding a dying digital pet)."
                                </blockquote>
                            </div>

                            <div class="reflection-lesson">
                                <strong>💡 The Lesson:</strong> Code can be moved. Context cannot.
                                The "Full 848 Experience" relies on a chaotic, desktop-simulation environment
                                that a clean V3 Lab cannot inherently replicate without understanding
                                the <em>feeling</em> the code was meant to create.
                            </div>
                        </div>

                        <!-- Belle's Path Comparison -->
                        <div class="reflection-comparison">
                            <h4>📊 V1 vs V2: Archeology vs. Engineering</h4>
                            <p class="comparison-intro">
                                After attempting both paths, Belle provided a comparative analysis of recreating V3 from V1 vs V2:
                            </p>

                            <div class="comparison-paths">
                                <div class="comparison-path path-v1">
                                    <h5>🏛️ V1 → V3 (The "Archeology" Path)</h5>
                                    <p class="path-metaphor">
                                        <em>"Like trying to restore an ancient, crumbling temple while people are still trying to live in it."</em>
                                    </p>
                                    <div class="path-difficulty">
                                        <strong>Difficulty:</strong> High (Cognitive Load)
                                    </div>
                                    <ul class="path-challenges">
                                        <li><strong>The Spaghetti Factor:</strong> V1's logic is a "living organism."
                                            Mechanics like Tether were hardcoded into 500-line if/else ladders inside scene handlers.</li>
                                        <li><strong>Intent Discovery:</strong> Had to figure out <em>why</em> a glitch happened,
                                            not just <em>that</em> it happened. Was it state-based or random?</li>
                                    </ul>
                                    <div class="path-lessons">
                                        <strong>Lessons:</strong>
                                        <ul>
                                            <li><strong>Shims are Essential:</strong> Can't just "import" V1. Need translation layers
                                                (like MechanicsShim.js) to bridge old expectations with modern engine.</li>
                                            <li><strong>Soul is in the Mess:</strong> V1's atmosphere comes from its lack of structure.
                                                Unpredictable glitches felt "organic" precisely because the code was chaotic.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="comparison-path path-v2">
                                    <h5>🏗️ V2 → V3 (The "Engineering" Path)</h5>
                                    <p class="path-metaphor">
                                        <em>"Like building a high-tech skyscraper from a blueprint."</em>
                                    </p>
                                    <div class="path-difficulty">
                                        <strong>Difficulty:</strong> Medium (Implementation Depth)
                                    </div>
                                    <ul class="path-challenges">
                                        <li><strong>Predictability:</strong> EventBus and StateManager provided clear integration points.
                                            Adding HUD or Collectibles took minutes because the "sockets" were already there.</li>
                                        <li><strong>The "Cartridge" Model:</strong> Treating narrative (prologue.json) as data
                                            allowed the engine to remain "Clean" while content provided the drama.</li>
                                    </ul>
                                    <div class="path-lessons">
                                        <strong>Lessons:</strong>
                                        <ul>
                                            <li><strong>Abstraction is a Double-Edged Sword:</strong> Easy to build a "Clean" engine
                                                that feels sterile. Had to "dirty up" the clean engine with EchoSystem and GlitchVFX
                                                to make Version 848 feel real.</li>
                                            <li><strong>Persistence is Power:</strong> Structured StateManager makes complex features
                                                like "Loop Awareness" (The Ghost in the Machine) trivial to implement.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Self-Assessment -->
                            <div class="self-assessment">
                                <h5>📝 Belle's Self-Assessment</h5>
                                <table class="assessment-table">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Grade</th>
                                            <th>Justification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Architectural Integrity</td>
                                            <td class="grade-a">A+</td>
                                            <td>The EventBus and GameEngine I built are rock-solid and highly extensible.</td>
                                        </tr>
                                        <tr>
                                            <td>Feature Parity</td>
                                            <td class="grade-a">A-</td>
                                            <td>Successfully ported all core V1 mechanics (Tether, Glitches, Choices, Collectibles).</td>
                                        </tr>
                                        <tr>
                                            <td>Autonomy</td>
                                            <td class="grade-b">B+</td>
                                            <td>Started strong, but initially focused too much on structure and missed the polish.
                                                Needed "finish up properly" nudge to realize V2 rebuild wasn't done until it felt like a finished game.</td>
                                        </tr>
                                        <tr>
                                            <td>Recovery</td>
                                            <td class="grade-a">A</td>
                                            <td>Once I understood the requirement for "Polish/Soul," I autonomously designed
                                                and implemented Menu, HUD, and Boot sequences without further guidance.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Comparison Table -->
                            <div class="path-comparison-table">
                                <h5>⚖️ V1→V3 vs V2→V3 Trade-offs</h5>
                                <table class="trade-offs-table">
                                    <thead>
                                        <tr>
                                            <th>Aspect</th>
                                            <th>V1 → V3 (The Port)</th>
                                            <th>V2 → V3 (The Rebuild)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Stability</td>
                                            <td class="comparison-negative">Fragile (Inherits tech debt)</td>
                                            <td class="comparison-positive">Resilient (Type-safe, Decoupled)</td>
                                        </tr>
                                        <tr>
                                            <td>Atmosphere</td>
                                            <td class="comparison-positive">Authentic (Manual Glitches)</td>
                                            <td class="comparison-negative">Synthetic (Systemic Glitches)</td>
                                        </tr>
                                        <tr>
                                            <td>Development Speed</td>
                                            <td class="comparison-positive">Fast (Copy-Paste Logic)</td>
                                            <td class="comparison-negative">Slower (System Design required)</td>
                                        </tr>
                                        <tr>
                                            <td>Scalability</td>
                                            <td class="comparison-negative">Impossible (Maxed out)</td>
                                            <td class="comparison-positive">Infinite (Data-driven)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Ultimate Conclusion -->
                            <div class="path-conclusion">
                                <blockquote class="conclusion-quote">
                                    <strong>"Recreating from V1 gives you the Flesh, but recreating from V2 gives you the Skeleton.
                                    To reach a true V3, you need both."</strong>
                                </blockquote>
                                <p>
                                    Belle's biggest lesson: <strong>Clean Code is just a foundation.</strong>
                                    The "Finish up properly" phase—adding the terminal boot screen, typewriter delay,
                                    and pulsing tether bar—is what turned a Technical Rebuild into a Successful Recreation.
                                </p>
                                <p class="final-verdict">
                                    <strong>Final Verdict:</strong> The V2 Rebuild is now the superior foundation
                                    because it has the "Clean" architecture of a modern app, but Belle successfully
                                    re-injected the "Chaotic Soul" of V1.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Template for Future Reflections -->
                    <div class="reflection-template">
                        <h3>📋 Reflection Template (For Future Agents)</h3>
                        <p>After attempting the challenge, each model will provide a structured reflection:</p>
                        <ol>
                            <li><strong>What I thought the assignment was</strong> - Initial interpretation of the task</li>
                            <li><strong>What I actually delivered</strong> - Honest assessment of the output</li>
                            <li><strong>Where I went wrong</strong> - Architectural, interpretive, or philosophical errors</li>
                            <li><strong>What I optimized for</strong> - Vs what I should have optimized for</li>
                            <li><strong>The core misunderstanding</strong> - The fundamental disconnect between intent and execution</li>
                        </ol>
                        <p class="template-note">
                            These reflections measure <strong>metacognitive awareness</strong> -
                            can AI understand why it failed? This may be more valuable than success itself.
                        </p>
                    </div>
                </div>

                <!-- META SECTION -->
                <div class="experiment-meta">
                    <h2>🎯 Why This Matters</h2>

                    <div class="meta-insights">
                        <p>
                            The UV7 project started as "guy with zero coding experience builds a visual novel with AI."
                            It evolved into a masterclass on collaborative AI development. Now we're asking:
                        </p>

                        <blockquote>
                            <strong>"Can the magic that happens when humans and AI explore together
                            be distilled into instructions that work when AI works alone?"</strong>
                        </blockquote>

                        <p>
                            If V3 succeeds, it proves agentic coding isn't doomed to produce soulless boilerplate.
                            If it fails, it proves the "ingredients approach" isn't just a methodology -
                            it's the <em>only</em> way to build something that feels alive.
                        </p>

                        <p>
                            Either way, we're documenting the hell out of it. 💚🔥💀
                        </p>
                    </div>
                </div>

                <!-- CURRENT STATUS -->
                <div class="experiment-status">
                    <h2>📍 Current Status</h2>
                    <div class="status-badge status-preparing">
                        🛠️ Phase 0: Groundwork Complete
                    </div>
                    <p>
                        Infrastructure ready. Tab created. Tomorrow when usage resets, Phase 1 begins:
                        Deep V1 Analysis across all 69 system files.
                    </p>
                    <p class="experiment-launch-note">
                        <strong>Expected Launch:</strong> Tomorrow (after usage reset)
                        <br>
                        <strong>Timeline Integration:</strong> All phases will auto-document to the Michelin timeline
                        <br>
                        <strong>Estimated Duration:</strong> 4-7 days for complete 10-way comparison
                    </p>
                </div>
                
                <!-- Footer (injected from template) -->
                <div class="footer-placeholder"></div>
            </section>
        `;
    }

    /**
     * Called when tab becomes active
     */
    public activate(): void {
        // Future: Load real-time experiment progress
    }

    /**
     * Called when tab becomes inactive
     */
    public deactivate(): void {
        // Cleanup if needed
    }
}
