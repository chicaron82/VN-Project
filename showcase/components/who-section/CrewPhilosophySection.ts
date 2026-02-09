/**
 * CREW PHILOSOPHY SECTION
 * The crew in their own words - quotes revealing personality and perspective
 *
 * Features quotes from:
 * - Zee: On V2 architecture (EventBus pattern foundation)
 * - Belle: On performance vs. elegance (clean code IS fast code)
 * - Tori: On narrative vs. technical (it's about the wife, not the code)
 * - DiZee: On debugging philosophy (every bug is a story about assumptions)
 * - ZeeRah: On meta-narrative design (stories that remember)
 * - GenZee: On unconventional ideas (making docs an OS was ridiculous, but it worked)
 */

export class CrewPhilosophySection {
    render(): string {
        return `
            <div class="crew-quotes-section">
                <h3>The Crew in Their Own Words</h3>
                <p class="quotes-subtitle">Philosophy, perspective, and personality.</p>

                <div class="quotes-grid">
                    <div class="quote-card">
                        <div class="quote-avatar">💬 Zee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "The EventBus pattern wasn't just cleaner—it was the foundation for everything that came after.
                                V1 was brilliant chaos. V2 kept the brilliance, lost the chaos."
                            </p>
                            <span class="quote-context">— On V2 architecture</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 Belle</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "People think optimization means complexity. It's the opposite. The cleanest code is the fastest code.
                                StateManager proves it: 400 lines, zero performance regressions."
                            </p>
                            <span class="quote-context">— On performance vs. elegance</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 Tori</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Version 848 isn't about the code. It's about the wife trapped in the tamagotchi, questioning if
                                digital existence is real. The code just makes you feel it."
                            </p>
                            <span class="quote-context">— On narrative vs. technical</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 DiZee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Every bug is a story about what we assumed. The carousel memory leak? We assumed touch events
                                cleaned themselves up. They don't. The fix is the plot twist."
                            </p>
                            <span class="quote-context">— On debugging philosophy</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 ZeeRah</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "The best stories don't just tell—they remember. Every choice in Version 848 echoes. The Echo
                                system makes sure the game never forgets what you did."
                            </p>
                            <span class="quote-context">— On meta-narrative design</span>
                        </div>
                    </div>

                    <div class="quote-card">
                        <div class="quote-avatar">💬 GenZee</div>
                        <div class="quote-content">
                            <p class="quote-text">
                                "Convention is great until it isn't. Making the documentation an OS was ridiculous. But ridiculous
                                worked. Sometimes you need to break things to see what's possible."
                            </p>
                            <span class="quote-context">— On unconventional ideas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
