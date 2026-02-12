/**
 * POST-MORTEM REFLECTIONS
 * Belle's detailed analysis, self-assessment, path comparison tables,
 * and the reflection template for future agents.
 *
 * Extracted from ExperimentSection.ts
 */

export class PostMortemReflections {
    render(): string {
        return `
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
        `;
    }
}
