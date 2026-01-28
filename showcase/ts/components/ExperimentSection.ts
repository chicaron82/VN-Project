
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
