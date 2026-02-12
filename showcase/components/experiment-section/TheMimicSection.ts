/**
 * THE MIMIC: CHAOS VARIABLE
 * The semantic trap that separates pattern recognition from dependency analysis.
 * The "treasure chest in a dungeon" that tests whether agents check for traps.
 *
 * Extracted from ExperimentSection.ts
 */

export class TheMimicSection {
    render(): string {
        return `
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
        `;
    }
}
