/**
 * COLLABORATION WORKFLOW SECTION
 * Explains how the UV7 crew actually works together
 *
 * Real examples from Version 848 development:
 * - Parallel development (multiple AIs, different approaches)
 * - Blind peer review (fresh eyes catch what original author missed)
 * - Cognitive diversity (different models, different strengths)
 * - Continuous iteration (ship → test → refine → repeat)
 */

export class CollaborationWorkflowSection {
    render(): string {
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
}
