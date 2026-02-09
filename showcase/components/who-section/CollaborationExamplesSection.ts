/**
 * COLLABORATION EXAMPLES SECTION
 * Real problems solved through crew collaboration
 *
 * Three case studies:
 * 1. Save System Bug - Tori diagnosed → Zee architected → Belle optimized → DiZee polished
 * 2. Mobile Performance - Belle profiled → PZ researched → DiZee implemented
 * 3. Soul Preservation - ZeeRah cataloged → Tori matched feel → Zee clean implementation
 */

export class CollaborationExamplesSection {
    render(): string {
        return `
            <div class="collaboration-examples-section">
                <h3>Collaboration in Action</h3>
                <p class="examples-subtitle">Real problems. Real solutions. Real teamwork.</p>

                <div class="example-grid">
                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: V1's Save System Was Breaking</h4>
                            <span class="example-badge">Critical Bug</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">Tori</span>
                                <div class="workflow-contribution">
                                    <strong>Diagnosed the bug:</strong>
                                    <p>"State mutations happening twice—users losing progress"</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Zee</span>
                                <div class="workflow-contribution">
                                    <strong>Suggested EventBus fix:</strong>
                                    <p>"Decouple with pub/sub pattern. Single source of truth."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Belle</span>
                                <div class="workflow-contribution">
                                    <strong>Optimized implementation:</strong>
                                    <p>"Cache subscriptions. Batch updates. Guard localStorage size."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">DiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Polished edge cases:</strong>
                                    <p>"What if localStorage is full? What if JSON is corrupted?"</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> SaveManager.ts — 400 lines, 0 bugs, tested by all 4
                        </div>
                    </div>

                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: Performance on Mobile Was Janky</h4>
                            <span class="example-badge">UX Issue</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">Belle</span>
                                <div class="workflow-contribution">
                                    <strong>Profiled the issue:</strong>
                                    <p>"Touch event listeners blocking main thread. 200ms delay."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">PerplexiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Researched solution:</strong>
                                    <p>"Passive listeners prevent scroll jank. Chrome DevTools confirms."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">DiZee</span>
                                <div class="workflow-contribution">
                                    <strong>Implemented fix:</strong>
                                    <p>"Added { passive: true } to all touch listeners. RequestAnimationFrame for updates."</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> Smooth 60fps on all devices. Lighthouse score: 98/100
                        </div>
                    </div>

                    <div class="example-card">
                        <div class="example-header">
                            <h4>Problem: "Make It Feel Like V1"</h4>
                            <span class="example-badge">Soul Preservation</span>
                        </div>

                        <div class="example-workflow">
                            <div class="workflow-item">
                                <span class="workflow-avatar">ZeeRah</span>
                                <div class="workflow-contribution">
                                    <strong>Cataloged V1 quirks:</strong>
                                    <p>"Timing values, lore comments, 848 references. All preserved."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Tori</span>
                                <div class="workflow-contribution">
                                    <strong>Matched the feel:</strong>
                                    <p>"Same typewriter speed. Same fade timing. Same emotional beats."</p>
                                </div>
                            </div>

                            <div class="workflow-arrow">↓</div>

                            <div class="workflow-item">
                                <span class="workflow-avatar">Zee</span>
                                <div class="workflow-contribution">
                                    <strong>Clean implementation:</strong>
                                    <p>"V1's soul, V2's structure. Different code, identical experience."</p>
                                </div>
                            </div>
                        </div>

                        <div class="example-result">
                            <strong>Result:</strong> Blind playtest couldn't tell V1 from V2
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
