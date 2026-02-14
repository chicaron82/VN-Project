/**
 * V3 MULTI-MODEL EXPERIMENT SECTION (Orchestrator)
 * Contributors: DiZee, User
 *
 * The grand experiment: Can emergent creativity be reverse-engineered
 * into prescriptive recipes? Testing across 4 AI models x 2 recipes.
 *
 * Previously 717 lines. Now delegates major sections to sub-components.
 *
 * 💚🔥💀
 */

import { createBanner, BANNER_CONFIGS } from './BannerGenerator';
import { Logger } from '@utils/Logger';
import { TheMimicSection } from './experiment-section/TheMimicSection';
import { PostMortemReflections } from './experiment-section/PostMortemReflections';
import { VisualContrastSection } from './experiment-section/VisualContrastSection';

export class ExperimentSection {
    private mimic = new TheMimicSection();
    private postMortem = new PostMortemReflections();
    private visualContrast = new VisualContrastSection();

    constructor() {
        this.render();
    }

    private render(): void {
        const mount = document.getElementById('uv7-experiment-mount');
        if (!mount) {
            Logger.error('[ExperimentSection] Mount point not found');
            return;
        }

        mount.innerHTML = `
            <section id="experiment-section" class="content-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.experiment)}

                <!-- THE BIG QUESTION -->
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
                </div>

                <!-- INTRO -->
                <div class="experiment-intro">
                    <div class="experiment-question-callout">
                        <strong>Can We Replicate the Fun?</strong> V1 was built through collaborative discovery—organic, emergent, alive.
                        The question: Can we reverse-engineer the "secret sauce"? Can we write recipes detailed enough that fresh AI models
                        can recreate the magic? Or does the vibe die in translation?
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
                ${this.mimic.render()}

                <!-- THE CONTENDERS -->
                <div class="experiment-contenders">
                    <h2>🥊 The Contenders (8 Agents)</h2>
                    <div class="contenders-grid">
                        <div class="agent-card">
                            <span class="agent-icon">🌸</span>
                            <h4>Belle (Gemini)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

                        <div class="agent-card">
                            <span class="agent-icon">💚</span>
                            <h4>DiZee (Claude)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

                        <div class="agent-card">
                            <span class="agent-icon">🔥</span>
                            <h4>Tori (GPT-4o)</h4>
                            <div class="recipe-badges">
                                <span class="badge badge-chaos">Recipe A (Chaos)</span>
                                <span class="badge badge-structure">Recipe B (Structure)</span>
                            </div>
                        </div>

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
                ${this.postMortem.render()}

                <!-- VISUAL COMPARISON -->
                ${this.visualContrast.render()}

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

                <!-- FIELD NOTES -->
                <div class="experiment-meta">
                    <h2>👻 Field Note: The Phantom Crew Incident</h2>

                    <div class="meta-insights">
                        <p>
                            <strong>Feb 14, 2026</strong> — During a routine showcase audit, we discovered four AI crew members
                            that <em>never existed</em>: Michelin, Mochi, Soma, and Kai.
                        </p>

                        <p>
                            A prior AI session pattern-matched project context (Michelin star quality references,
                            Yukihira Soma cooking metaphors) and invented plausible-sounding names. It wrote them to
                            <code>_CREW_STATUS.md</code> — a file loaded every session. Every subsequent AI session
                            read them as canonical truth and propagated them without question.
                        </p>

                        <blockquote>
                            <strong>"The names felt real because the AI believed them. That's the whole problem."</strong>
                        </blockquote>

                        <p>
                            This is exactly the kind of compounding error the V3 experiment is designed to surface.
                            When AI works unsupervised, hallucinations don't just happen once — they self-reinforce
                            through persistent storage. The human caught what no AI session questioned.
                            <a href="#journal" style="color: var(--accent-primary);">Full write-up in the journal →</a>
                        </p>
                    </div>
                </div>

                <!-- CURRENT STATUS -->
                <div class="experiment-status">
                    <h2>📍 Current Status</h2>
                    <div class="status-badge status-preparing">
                        🧪 Phase 1: Deep V1 Analysis Complete
                    </div>
                    <p>
                        V1's 69 system files have been analyzed. Recipe generation is underway.
                        The 10-way comparison framework is ready — when the models cook, we'll know exactly how to measure soul.
                    </p>
                    <p class="experiment-launch-note">
                        <strong>Status:</strong> Recipes in development
                        <br>
                        <strong>Timeline Integration:</strong> All phases will auto-document to the journal
                        <br>
                        <strong>Comparison Framework:</strong> V1 + V2 + 8 V3 variants
                    </p>
                </div>

                <!-- Footer (injected from template) -->
                <div class="footer-placeholder"></div>
            </section>
        `;
    }
}
