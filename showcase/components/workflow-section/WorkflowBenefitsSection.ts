/**
 * WORKFLOW BENEFITS SECTION
 * 4-card summary of key workflow benefits:
 * - No single point of failure
 * - Rate limit arbitrage
 * - Adversarial validation
 * - Iterative refinement
 */

export class WorkflowBenefitsSection {
    render(): string {
        return `
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
        `;
    }
}
