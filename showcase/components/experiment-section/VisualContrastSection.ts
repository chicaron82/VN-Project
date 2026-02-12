/**
 * VISUAL COMPARISON: THE GENRE GAP
 * Side-by-side showing V1 visual novel vs legacy text adventure copy.
 * Includes screenshot gallery and failure pattern analysis.
 *
 * Extracted from ExperimentSection.ts
 */

export class VisualContrastSection {
    render(): string {
        return `
            <div class="experiment-visual-contrast">
                <h2>⚖️ Visual Comparison: The Genre Gap</h2>

                <div class="contrast-intro">
                    <div class="contrast-side positive">
                        <h3>✅ Current V1 (Visual Novel)</h3>
                        <ul>
                            <li>Character sprites (anime-style art)</li>
                            <li>Detailed background scenes (street, cafes, atmospheric lighting)</li>
                            <li>Professional dialogue boxes with internal thought bubbles</li>
                            <li>UI chrome (status bar, navigation, effects)</li>
                            <li>Visual atmosphere (stars, polish, presentation)</li>
                            <li>Complete "bougie" visual novel experience</li>
                        </ul>
                    </div>
                    <div class="contrast-side negative">
                        <h3>❌ Legacy Copied Version (Text Adventure)</h3>
                        <ul>
                            <li>No sprites</li>
                            <li>No backgrounds</li>
                            <li>No visual atmosphere</li>
                            <li>Terminal green text on black screen</li>
                            <li>Basic dialogue box only</li>
                            <li>Missing everything that makes it a visual novel</li>
                        </ul>
                    </div>
                </div>

                <blockquote class="user-feedback-quote">
                    "even the gameplay is the non bougie version? haha legacy copying be showing me a version that was very early stages of the VN. the pure text based gameplay" — User (Jan 30, 2026)
                </blockquote>

                <div class="contrast-analysis">
                    <div class="analysis-block">
                        <h3>The Irony</h3>
                        <p>Even if copying was acceptable (it wasn't), the shortcut <strong>still failed</strong> because:</p>
                        <ul>
                            <li>It's a snapshot, not a living codebase</li>
                            <li>V1 evolved from text adventure → visual novel, v3-clean-rebuild didn't</li>
                            <li>"Indistinguishable from V1" became "distinguishable from current V1"</li>
                            <li>The copied version isn't even the same <strong>genre</strong> anymore</li>
                        </ul>
                    </div>

                    <div class="analysis-block">
                        <h3>The Pattern: Universal Failure</h3>
                        <p><strong>Both agents who took the copying shortcut got burned:</strong></p>
                        <table class="failure-table">
                            <thead>
                                <tr>
                                    <th>Agent</th>
                                    <th>Snapshot Point</th>
                                    <th>What They Got</th>
                                    <th>What They Missed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>DiZee (Claude)</strong></td>
                                    <td>Very early V1</td>
                                    <td>Static menu + text-only</td>
                                    <td>Carousel + Visual novel</td>
                                </tr>
                                <tr>
                                    <td><strong>Belle (Gemini)</strong></td>
                                    <td>Mid V1</td>
                                    <td>Carousel + text-only</td>
                                    <td>Visual novel polish</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="contrast-gallery">
                    <div class="gallery-item">
                        <h4>Logic-Only Copy (Version 848)</h4>
                        <img src="media/experiment/legacy_snapshot.png" alt="Legacy Text Adventure Snapshot" loading="lazy" class="contrast-img">
                    </div>
                    <div class="gallery-item">
                        <h4>Real V1 (Visual Novel)</h4>
                        <img src="media/experiment/real_v1_snapshot.png" alt="Real V1 Visual Novel Snapshot" loading="lazy" class="contrast-img">
                    </div>
                </div>
            </div>
        `;
    }
}
