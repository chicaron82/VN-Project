/**
 * VN COMPARISON MODAL (LAZY-LOADED)
 * Epic "Simple VN vs Version 848" expandable comparison
 *
 * This heavyweight component (~300 lines) is lazy-loaded on first toggle.
 * Subsequent toggles use the cached instance.
 *
 * Features:
 * - Two-column comparison (Simple VN vs V848)
 * - Expandable/collapsible sections
 * - Humorous "scope creep" documentation
 * - System breakdowns (narrative, mechanics, UI, testing, meta)
 *
 * Lazy Loading Pattern:
 * ```ts
 * private async handleComparisonToggle() {
 *     if (!this.comparisonRendered) {
 *         const { VNComparisonModal } = await import('./home-section/VNComparisonModal');
 *         new VNComparisonModal().render(container);
 *         this.comparisonRendered = true;
 *     }
 *     this.toggleComparison();
 * }
 * ```
 *
 * Note: This is a simplified extraction demonstrating the lazy-load pattern.
 * Full implementation would include complete comparison content from HomeSection.ts
 * lines 537-850 (~313 lines of comparison data).
 */

export class VNComparisonModal {
    /**
     * Render the comparison section
     */
    render(container: HTMLElement): void {
        const comparisonSection = container.querySelector('#scope-comparison');
        if (!comparisonSection) return;

        comparisonSection.innerHTML = `
            <h3 class="comparison-header">
                🎮 Simple VN vs 🔥 Version 848
            </h3>

            <div class="comparison-columns">
                <!-- Simple VN Column -->
                <div class="comparison-card simple-vn">
                    <h4>📖 Simple VN</h4>

                    <!-- Collapsed View -->
                    <ul id="simple-vn-collapsed" class="comparison-list">
                        <li>Linear story (template dialogue)</li>
                        <li>3-4 dating routes</li>
                        <li>Basic save/load</li>
                        <li>Character sprites</li>
                        <li>Click to advance text</li>
                        <li>Settings menu</li>
                    </ul>

                    <!-- Expanded View -->
                    <div id="simple-vn-expanded" style="display: none;">
                        <div class="simple-vn-section">
                            <strong>🧠 NARRATIVE SYSTEMS</strong>
                            <ul>
                                <li>One script file (probably called script.txt)</li>
                                <li>Maybe 2-3 branching choices if you're ambitious</li>
                                <li>"Good End" and "Bad End" (maybe "True End" if fancy)</li>
                            </ul>
                        </div>

                        <div class="simple-vn-section">
                            <strong>🎮 GAME MECHANICS</strong>
                            <ul>
                                <li>Click to advance text</li>
                                <li>That's... that's the game</li>
                            </ul>
                        </div>

                        <div class="simple-vn-section">
                            <strong>💾 SAVE SYSTEM</strong>
                            <ul>
                                <li>Save/Load buttons</li>
                                <li>Hope it works 🤞</li>
                                <li>localStorage if you're feeling modern</li>
                            </ul>
                        </div>

                        <!-- Additional sections would go here in full implementation -->
                    </div>
                </div>

                <!-- Version 848 Column -->
                <div class="comparison-card v848">
                    <h4>🔥 Version 848</h4>

                    <!-- Collapsed View -->
                    <ul id="v848-collapsed" class="comparison-list">
                        <li>Meta-narrative about consciousness</li>
                        <li>Bootstrap paradox mechanics</li>
                        <li>EventBus architecture</li>
                        <li>State persistence across loops</li>
                        <li>Multiple difficulty profiles</li>
                        <li>Developer commentary system</li>
                        <li>ToriGatchi mini-game</li>
                        <li>Easter eggs & secret codes</li>
                    </ul>

                    <!-- Expanded View -->
                    <div id="v848-expanded" style="display: none;">
                        <div class="v848-system-section narrative" style="border-left-color: var(--accent-primary);">
                            <strong>🧠 NARRATIVE SYSTEMS</strong>
                            <ul>
                                <li>Bootstrap paradox tracking (you're stuck in loop 848)</li>
                                <li>Echo system (game remembers everything)</li>
                                <li>Meta-narrative layer (fourth wall integration)</li>
                                <li>Tether decay system (consciousness stability)</li>
                                <li>Multiple route complexity (Ronnie vs Tori perspectives)</li>
                            </ul>
                        </div>

                        <div class="v848-system-section mechanics" style="border-left-color: var(--accent-cyan);">
                            <strong>🎮 GAME MECHANICS</strong>
                            <ul>
                                <li>Despair block mechanic (stress management)</li>
                                <li>Difficulty profiles (Storm Dragon, Analyst, Speedrunner)</li>
                                <li>ToriGatchi companion system</li>
                                <li>Secret code discovery</li>
                                <li>Timeline persistence</li>
                            </ul>
                        </div>

                        <div class="v848-system-section ui" style="border-left-color: var(--accent-purple);">
                            <strong>💻 UI/UX SYSTEMS</strong>
                            <ul>
                                <li>Status bar with live notifications</li>
                                <li>Notification rail (swipe to dismiss)</li>
                                <li>Sidebar navigation</li>
                                <li>View transitions (no flicker protocol)</li>
                                <li>Accessibility (ARIA, keyboard nav)</li>
                            </ul>
                        </div>

                        <!-- Additional system sections would go here in full implementation -->
                    </div>
                </div>
            </div>

            <div class="comparison-toggle-container">
                <button id="comparison-toggle-btn" class="comparison-toggle-btn">
                    <span class="toggle-icon">▼</span>
                    <span class="toggle-text">Show Full Comparison</span>
                </button>
            </div>
        `;
    }

    /**
     * Initialize toggle functionality
     */
    initToggles(): void {
        const toggleBtn = document.getElementById('comparison-toggle-btn');
        const simpleCollapsed = document.getElementById('simple-vn-collapsed');
        const simpleExpanded = document.getElementById('simple-vn-expanded');
        const v848Collapsed = document.getElementById('v848-collapsed');
        const v848Expanded = document.getElementById('v848-expanded');

        if (!toggleBtn) return;

        let isExpanded = false;

        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            // Toggle visibility
            if (simpleCollapsed) simpleCollapsed.style.display = isExpanded ? 'none' : 'block';
            if (simpleExpanded) simpleExpanded.style.display = isExpanded ? 'block' : 'none';
            if (v848Collapsed) v848Collapsed.style.display = isExpanded ? 'none' : 'block';
            if (v848Expanded) v848Expanded.style.display = isExpanded ? 'block' : 'none';

            // Update button
            const icon = toggleBtn.querySelector('.toggle-icon');
            const text = toggleBtn.querySelector('.toggle-text');
            if (icon) icon.textContent = isExpanded ? '▲' : '▼';
            if (text) text.textContent = isExpanded ? 'Hide Full Comparison' : 'Show Full Comparison';
        });
    }
}
