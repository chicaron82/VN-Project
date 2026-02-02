import { createBanner, BANNER_CONFIGS } from './BannerGenerator';

/**
 * Evolution Section V2 - Deep Dive Edition
 * 
 * Shows ONE compelling comparison with actual code:
 * The Game Engine evolution from V1 chaos to V2 EventBus architecture
 */
export class EvolutionSection {
    constructor() {
        this.render();
        this.setupInteractions();
    }

    render(): void {
        const mount = document.getElementById('uv7-evolution-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="evolution-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.evolution)}

                <div class="section-content">
                    <!-- Evolution Context -->
                    <div class="evolution-context-box">
                        <h3>🔄 Version 848: From Organic Chaos to Sustainable Harmony</h3>
                        <p>
                            This isn't a generic refactoring case study—this is <strong>Version 848's actual evolution</strong>.
                            The visual novel game's codebase went from a 4000-line god class (V1) to a clean EventBus architecture (V2).
                            Same soul, sustainable structure.
                        </p>
                        <p class="evolution-insight">
                            V1 was built through "yes and" energy—TetherManager, SaveSystem, MenuController all tangled together
                            because we were moving fast. V2 asked "what if we made it sustainable?" Same features, cleaner architecture.
                        </p>
                    </div>

                    <!-- The Breaking Point Story -->
                    <div class="evolution-story">
                        <div class="story-header">
                            <span class="story-date">Day 23</span>
                            <h2 class="story-title">The Breaking Point</h2>
                        </div>
                        
                        <div class="story-content">
                            <p>
                                User clicked a tether link. The menu froze. The save system broke. Everything hung. 
                                Had to force reload and lost 20 minutes of progress.
                            </p>
                            
                            <p class="story-reveal">
                                <strong>Why?</strong> Because <code class="inline-code">TetherManager</code> 
                                directly called <code class="inline-code">MenuController.close()</code>, 
                                which triggered <code class="inline-code">SaveSystem.autoSave()</code>, 
                                which needed data from <code class="inline-code">TetherManager.getLevel()</code>.
                            </p>
                            
                            <p class="story-impact">
                                <span class="icon">🔄</span> Circular dependency. The entire system deadlocked. 
                                This wasn't just one bug—it was <em>architectural decay</em>.
                            </p>
                        </div>
                    </div>

                    <!-- The Fix: Code Comparison -->
                    <div class="code-evolution">
                        <h3 class="section-title">The Fix: Decoupling Through Events</h3>
                        
                        <!-- Toggle Control -->
                        <div class="code-toggle-container">
                            <button class="code-toggle-btn active" data-version="v1">
                                <span class="toggle-icon">💥</span>
                                <span class="toggle-label">V1: Tightly Coupled</span>
                            </button>
                            <div class="toggle-slider"></div>
                            <button class="code-toggle-btn" data-version="v2">
                                <span class="toggle-icon">✨</span>
                                <span class="toggle-label">V2: Event-Driven</span>
                            </button>
                        </div>

                        <!-- Code Blocks -->
                        <div class="code-comparison">
                            <!-- V1 Code -->
                            <div class="code-block active" data-version="v1">
                                <div class="code-header">
                                    <span class="code-label">game-engine.js (V1)</span>
                                    <span class="code-meta">~4000 lines • Everything in one file</span>
                                </div>
                                <div class="code-content">
                                    <pre class="code-snippet"><code class="language-javascript"><span class="line-number">1</span><span class="comment">// V1: Direct method calls = tight coupling nightmare</span>
<span class="line-number">2</span>
<span class="line-number">3</span><span class="keyword">class</span> <span class="class-name">TetherManager</span> {
<span class="line-number">4</span>  <span class="function">handleTetherClick</span>() {
<span class="line-number">5</span>    <span class="keyword">this</span>.updateLevel();
<span class="line-number">6</span>    
<span class="line-number">7</span>    <span class="comment">// ❌ Direct call to another system</span>
<span class="line-number bug-line" data-bug="circular">8</span>    window.<span class="variable">menuController</span>.<span class="function">close</span>();<span class="bug-marker" data-bug-id="1">💥</span>
<span class="line-number">9</span>    
<span class="line-number">10</span>    <span class="comment">// ❌ Another direct dependency</span>
<span class="line-number bug-line" data-bug="tight-coupling">11</span>    window.<span class="variable">saveSystem</span>.<span class="function">autoSave</span>();<span class="bug-marker" data-bug-id="2">💥</span>
<span class="line-number">12</span>  }
<span class="line-number">13</span>}
<span class="line-number">14</span>
<span class="line-number">15</span><span class="keyword">class</span> <span class="class-name">MenuController</span> {
<span class="line-number">16</span>  <span class="function">close</span>() {
<span class="line-number">17</span>    <span class="keyword">this</span>.hideMenu();
<span class="line-number">18</span>    
<span class="line-number">19</span>    <span class="comment">// ❌ Calls back to TetherManager!</span>
<span class="line-number bug-line" data-bug="circular">20</span>    <span class="keyword">const</span> level = window.<span class="variable">tetherManager</span>.<span class="function">getLevel</span>();<span class="bug-marker" data-bug-id="3">🔄</span>
<span class="line-number">21</span>    <span class="keyword">this</span>.updateStatusBar(level);
<span class="line-number">22</span>  }
<span class="line-number">23</span>}</code></pre>

                                    <!-- Bug Tooltips -->
                                    <div class="bug-tooltip" data-tooltip-id="1">
                                        <div class="tooltip-header">
                                            <span class="tooltip-icon">💥</span>
                                            <span class="tooltip-title">Tight Coupling</span>
                                        </div>
                                        <p>Direct reference to global MenuController. Can't test TetherManager without MenuController existing.</p>
                                    </div>
                                    
                                    <div class="bug-tooltip" data-tooltip-id="2">
                                        <div class="tooltip-header">
                                            <span class="tooltip-icon">💥</span>
                                            <span class="tooltip-title">Cascade Failure Risk</span>
                                        </div>
                                        <p>If SaveSystem crashes, TetherManager stops working. One bug breaks multiple systems.</p>
                                    </div>
                                    
                                    <div class="bug-tooltip" data-tooltip-id="3">
                                        <div class="tooltip-header">
                                            <span class="tooltip-icon">🔄</span>
                                            <span class="tooltip-title">Circular Dependency</span>
                                        </div>
                                        <p>Menu calls Tether, Tether calls Menu. Creates deadlock during initialization. <strong>This is the bug that froze everything on Day 23.</strong></p>
                                    </div>
                                </div>
                                
                                <div class="code-metrics">
                                    <div class="metric-item bad">
                                        <span class="metric-label">Complexity</span>
                                        <span class="metric-value">47</span>
                                    </div>
                                    <div class="metric-item bad">
                                        <span class="metric-label">Dependencies</span>
                                        <span class="metric-value">Circular</span>
                                    </div>
                                    <div class="metric-item bad">
                                        <span class="metric-label">Testable</span>
                                        <span class="metric-value">No</span>
                                    </div>
                                </div>
                            </div>

                            <!-- V2 Code -->
                            <div class="code-block" data-version="v2">
                                <div class="code-header">
                                    <span class="code-label">GameEngine.ts (V2)</span>
                                    <span class="code-meta">392 lines • Modular architecture</span>
                                </div>
                                <div class="code-content">
                                    <pre class="code-snippet"><code class="language-typescript"><span class="line-number">1</span><span class="comment">// V2: EventBus decouples everything</span>
<span class="line-number">2</span>
<span class="line-number">3</span><span class="keyword">class</span> <span class="class-name">TetherManager</span> {
<span class="line-number">4</span>  <span class="keyword">constructor</span>(<span class="keyword">private</span> eventBus: EventBus) {}
<span class="line-number">5</span>  
<span class="line-number">6</span>  <span class="function">handleTetherClick</span>(): <span class="type">void</span> {
<span class="line-number">7</span>    <span class="keyword">this</span>.updateLevel();
<span class="line-number">8</span>    
<span class="line-number soul-line">9</span>    <span class="comment">// ✨ Emit event - no direct dependency</span><span class="soul-marker">💚</span>
<span class="line-number soul-line">10</span>    <span class="keyword">this</span>.eventBus.<span class="function">emit</span>(<span class="string">'tether:change'</span>, { level });
<span class="line-number">11</span>  }
<span class="line-number">12</span>}
<span class="line-number">13</span>
<span class="line-number">14</span><span class="keyword">class</span> <span class="class-name">MenuController</span> {
<span class="line-number">15</span>  <span class="keyword">constructor</span>(<span class="keyword">private</span> eventBus: EventBus) {
<span class="line-number soul-line">16</span>    <span class="comment">// ✨ Listen for events - zero direct references</span><span class="soul-marker">💚</span>
<span class="line-number soul-line">17</span>    <span class="keyword">this</span>.eventBus.<span class="function">on</span>(<span class="string">'tether:change'</span>, (data) => {
<span class="line-number">18</span>      <span class="keyword">this</span>.updateStatusBar(data.level);
<span class="line-number">19</span>    });
<span class="line-number">20</span>  }
<span class="line-number">21</span>}
<span class="line-number">22</span>
<span class="line-number">23</span><span class="keyword">class</span> <span class="class-name">SaveSystem</span> {
<span class="line-number">24</span>  <span class="keyword">constructor</span>(<span class="keyword">private</span> eventBus: EventBus) {
<span class="line-number soul-line">25</span>    <span class="comment">// ✨ Independent listener - no coupling</span><span class="soul-marker">💚</span>
<span class="line-number soul-line">26</span>    <span class="keyword">this</span>.eventBus.<span class="function">on</span>(<span class="string">'tether:change'</span>, () => {
<span class="line-number">27</span>      <span class="keyword">this</span>.<span class="function">autoSave</span>();
<span class="line-number">28</span>    });
<span class="line-number">29</span>  }
<span class="line-number">30</span>}</code></pre>

                                    <!-- Soul Highlights -->
                                    <div class="soul-tooltip" data-tooltip-id="soul-1">
                                        <div class="tooltip-header">
                                            <span class="tooltip-icon">💚</span>
                                            <span class="tooltip-title">Zero Dependencies</span>
                                        </div>
                                        <p>TetherManager doesn't know MenuController or SaveSystem exist. Can be tested in complete isolation.</p>
                                    </div>
                                </div>
                                
                                <div class="code-metrics">
                                    <div class="metric-item good">
                                        <span class="metric-label">Complexity</span>
                                        <span class="metric-value">6</span>
                                    </div>
                                    <div class="metric-item good">
                                        <span class="metric-label">Dependencies</span>
                                        <span class="metric-value">Zero</span>
                                    </div>
                                    <div class="metric-item good">
                                        <span class="metric-label">Testable</span>
                                        <span class="metric-value">Yes ✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dependency Visualization -->
                    <div class="dependency-viz">
                        <h3 class="section-title">Architecture Evolution</h3>
                        
                        <div class="viz-container">
                            <!-- V1: Spaghetti -->
                            <div class="viz-side" data-version="v1">
                                <h4 class="viz-title">
                                    <span class="viz-icon">🕸️</span>
                                    V1: Tangled Dependencies
                                </h4>
                                
                                <svg class="dependency-graph" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Chaotic lines -->
                                    <line x1="100" y1="80" x2="300" y2="320" class="dep-line bad" />
                                    <line x1="300" y1="80" x2="100" y2="320" class="dep-line bad" />
                                    <line x1="200" y1="80" x2="100" y2="200" class="dep-line bad" />
                                    <line x1="300" y1="200" x2="200" y2="320" class="dep-line bad" />
                                    <line x1="100" y1="120" x2="300" y2="280" class="dep-line bad" />
                                    <line x1="150" y1="80" x2="250" y2="320" class="dep-line bad" />
                                    <line x1="100" y1="200" x2="300" y2="200" class="dep-line bad" />
                                    <circle cx="200" cy="200" r="120" class="dep-circle bad" />
                                    
                                    <!-- Nodes -->
                                    <g class="node" data-node="engine">
                                        <circle cx="200" cy="80" r="35" />
                                        <text x="200" y="85">Engine</text>
                                    </g>
                                    <g class="node" data-node="menu">
                                        <circle cx="100" cy="200" r="35" />
                                        <text x="100" y="205">Menu</text>
                                    </g>
                                    <g class="node" data-node="tether">
                                        <circle cx="300" cy="200" r="35" />
                                        <text x="300" y="205">Tether</text>
                                    </g>
                                    <g class="node" data-node="save">
                                        <circle cx="100" cy="320" r="35" />
                                        <text x="100" y="325">Save</text>
                                    </g>
                                    <g class="node" data-node="dialog">
                                        <circle cx="300" cy="320" r="35" />
                                        <text x="300" y="325">Dialog</text>
                                    </g>
                                </svg>
                                
                                <p class="viz-caption">Everything calls everything. One change breaks three systems.</p>
                            </div>

                            <!-- V2: Clean Hub -->
                            <div class="viz-side" data-version="v2">
                                <h4 class="viz-title">
                                    <span class="viz-icon">⚡</span>
                                    V2: Hub-and-Spoke
                                </h4>
                                
                                <svg class="dependency-graph" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Clean hub lines -->
                                    <line x1="200" y1="200" x2="200" y2="80" class="dep-line good" />
                                    <line x1="200" y1="200" x2="100" y2="140" class="dep-line good" />
                                    <line x1="200" y1="200" x2="100" y2="260" class="dep-line good" />
                                    <line x1="200" y1="200" x2="300" y2="140" class="dep-line good" />
                                    <line x1="200" y1="200" x2="300" y2="260" class="dep-line good" />
                                    <line x1="200" y1="200" x2="200" y2="320" class="dep-line good" />
                                    
                                    <!-- Central hub -->
                                    <g class="node hub">
                                        <circle cx="200" cy="200" r="50" />
                                        <text x="200" y="200" class="hub-text">Event</text>
                                        <text x="200" y="218" class="hub-text">Bus</text>
                                    </g>
                                    
                                    <!-- Spoke nodes -->
                                    <g class="node spoke" data-node="engine">
                                        <circle cx="200" cy="80" r="30" />
                                        <text x="200" y="85">Engine</text>
                                    </g>
                                    <g class="node spoke" data-node="menu">
                                        <circle cx="100" cy="140" r="30" />
                                        <text x="100" y="145">Menu</text>
                                    </g>
                                    <g class="node spoke" data-node="tether">
                                        <circle cx="300" cy="140" r="30" />
                                        <text x="300" y="145">Tether</text>
                                    </g>
                                    <g class="node spoke" data-node="save">
                                        <circle cx="100" cy="260" r="30" />
                                        <text x="100" y="265">Save</text>
                                    </g>
                                    <g class="node spoke" data-node="dialog">
                                        <circle cx="300" cy="260" r="30" />
                                        <text x="300" y="265">Dialog</text>
                                    </g>
                                    <g class="node spoke" data-node="state">
                                        <circle cx="200" cy="320" r="30" />
                                        <text x="200" y="325">State</text>
                                    </g>
                                </svg>
                                
                                <p class="viz-caption">All communication flows through EventBus. Systems are independent.</p>
                            </div>
                        </div>
                    </div>

                    <!-- What Changed / What Stayed -->
                    <div class="evolution-outcome">
                        <div class="outcome-grid">
                            <div class="outcome-card changed">
                                <div class="outcome-header">
                                    <span class="outcome-icon">🔧</span>
                                    <h3>What Changed</h3>
                                </div>
                                <ul class="outcome-list">
                                    <li><strong>Architecture:</strong> Monolithic → Modular with SOLID principles</li>
                                    <li><strong>Communication:</strong> Direct calls → Event-driven pub/sub</li>
                                    <li><strong>Types:</strong> None → Strict TypeScript with 0 errors</li>
                                    <li><strong>Testing:</strong> Manual only → 1137 automated tests passing</li>
                                    <li><strong>File Size:</strong> 4000-line god object → 392-line orchestrator</li>
                                    <li><strong>Load Time:</strong> 2.4s → 0.7s (3x faster)</li>
                                    <li><strong>Bundle:</strong> 5MB → 2MB (60% smaller)</li>
                                </ul>
                            </div>

                            <div class="outcome-card preserved">
                                <div class="outcome-header">
                                    <span class="outcome-icon">💚</span>
                                    <h3>What Stayed (The Soul)</h3>
                                </div>
                                <ul class="outcome-list">
                                    <li><strong>The Story:</strong> Every line of dialogue preserved exactly</li>
                                    <li><strong>The Timing:</strong> Animation speeds, reveal pacing unchanged</li>
                                    <li><strong>The Feeling:</strong> That slow-burn emotional weight intact</li>
                                    <li><strong>The Easter Eggs:</strong> All secret codes and dev commentary</li>
                                    <li><strong>The Characters:</strong> Ronnie, Tori, their journey, their pain</li>
                                    <li><strong>The 848:</strong> The loop iteration. The narrative core.</li>
                                    <li><strong>The Magic:</strong> What made V1 special in the first place</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- The Transformation Summary -->
                    <div class="transformation-summary">
                        <div class="summary-content">
                            <h3 class="summary-title">The Transformation</h3>
                            <p class="summary-text">
                                Version 848 V2 isn't a rewrite. It's <em>evolution</em>. We took 50 days of creative chaos—
                                the beautiful mess that made something magical—and gave it the architecture it deserved. 
                                The bugs are gone. The crashes are fixed. But the <strong>soul?</strong> That's eternal.
                            </p>
                            <p class="summary-text">
                                The EventBus didn't replace the heart of the game. It <em>protected</em> it. By decoupling 
                                the systems, we ensured that future features won't break what's already perfect. The story 
                                can grow. The tech can scale. But the emotional core—<strong>that stays untouched</strong>.
                            </p>
                            <div class="summary-badge">
                                <span class="badge-icon">🎯</span>
                                <span class="badge-text">From Chaos to Clarity, Heart Intact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    setupInteractions(): void {
        // Toggle between V1 and V2 code views
        const toggleButtons = document.querySelectorAll('.code-toggle-btn');
        const codeBlocks = document.querySelectorAll('.code-block');
        
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const version = btn.getAttribute('data-version');
                if (!version) return;

                // Update toggle buttons
                toggleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update code blocks
                codeBlocks.forEach(block => {
                    block.classList.remove('active');
                    if (block.getAttribute('data-version') === version) {
                        block.classList.add('active');
                        this.animateCodeTransition(block as HTMLElement);
                    }
                });
            });
        });

        // Bug marker hover tooltips
        this.setupTooltips('.bug-marker', '.bug-tooltip');
        this.setupTooltips('.soul-marker', '.soul-tooltip');

        // Animate metrics on scroll
        this.setupScrollAnimations();
    }

    setupTooltips(markerSelector: string, tooltipSelector: string): void {
        const markers = document.querySelectorAll(markerSelector);
        markers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                const bugId = (marker as HTMLElement).getAttribute('data-bug-id');
                const tooltip = document.querySelector(`${tooltipSelector}[data-tooltip-id="${bugId}"]`);
                if (tooltip) {
                    const rect = marker.getBoundingClientRect();
                    (tooltip as HTMLElement).style.display = 'block';
                    (tooltip as HTMLElement).style.left = `${rect.left + window.scrollX}px`;
                    (tooltip as HTMLElement).style.top = `${rect.bottom + window.scrollY + 10}px`;
                }
            });

            marker.addEventListener('mouseleave', () => {
                const bugId = (marker as HTMLElement).getAttribute('data-bug-id');
                const tooltip = document.querySelector(`${tooltipSelector}[data-tooltip-id="${bugId}"]`);
                if (tooltip) {
                    (tooltip as HTMLElement).style.display = 'none';
                }
            });
        });
    }

    animateCodeTransition(block: HTMLElement): void {
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            block.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
        });
    }

    setupScrollAnimations(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.outcome-card, .dependency-viz, .transformation-summary').forEach(el => {
            observer.observe(el);
        });
    }
}
