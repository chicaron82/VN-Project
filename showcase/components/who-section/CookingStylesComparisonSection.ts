/**
 * COOKING STYLES COMPARISON SECTION
 * Same task, different AI approaches
 *
 * Shows how different models approach the same problem differently:
 * - Belle (Gemini): Performance-first (87 lines, heavily optimized)
 * - Zee (Claude): Architecture-first (154 lines, maintainability)
 * - Tori (ChatGPT): UX-first (112 lines, user experience)
 * - DiZee (Claude): Production-first (203 lines, comprehensive)
 *
 * Result: Synthesized all 4 approaches into one superior system
 */

export class CookingStylesComparisonSection {
    render(): string {
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
}
