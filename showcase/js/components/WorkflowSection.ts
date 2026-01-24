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
