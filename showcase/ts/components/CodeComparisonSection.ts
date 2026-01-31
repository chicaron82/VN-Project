/**
 * ════════════════════════════════════════════════════════════════
 * CODE COMPARISON SECTION
 * Interactive comparison showing V1 → V2 transformation
 * ════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Animated line count reduction
 * - Interactive "Trace a Feature" mode
 * - Soul preservation proof
 * - Expandable code snippets
 * - Hover metrics overlay
 * - Easter eggs (click 848 references)
 *
 * 💚🔥💀
 */

export class CodeComparisonSection {
    private currentFeature: string | null = null;
    private isExpanded: boolean = false;

    constructor() {
        this.render();
        this.attachEventListeners();
        this.startAnimations();
    }

    render(): void {
        const container = document.createElement('div');
        container.className = 'code-comparison-container';
        container.innerHTML = `
            <div class="comparison-header">
                <h2>The Transformation</h2>
                <p class="comparison-subtitle">
                    From 3,904 lines of chaos to 391 lines of clarity—without losing the soul
                </p>
            </div>

            <!-- Animated Line Count Reduction -->
            <div class="line-count-animation">
                <div class="line-count-bar-container">
                    <div class="line-count-label">
                        <span class="version-label">V1 (JavaScript)</span>
                        <span class="line-number" id="v1-line-count" data-target="3904">3904</span>
                        <span class="lines-text">lines</span>
                    </div>
                    <div class="line-count-track">
                        <div class="line-count-fill v1-fill" id="v1-bar" style="width: 100%"></div>
                    </div>
                </div>

                <div class="transformation-arrow">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/>
                    </svg>
                    <span class="reduction-badge" id="reduction-badge">90% reduction</span>
                </div>

                <div class="line-count-bar-container">
                    <div class="line-count-label">
                        <span class="version-label">V2 (TypeScript)</span>
                        <span class="line-number" id="v2-line-count" data-target="391">391</span>
                        <span class="lines-text">lines</span>
                    </div>
                    <div class="line-count-track">
                        <div class="line-count-fill v2-fill" id="v2-bar" style="width: 10%"></div>
                    </div>
                </div>
            </div>

            <!-- Interactive Feature Tracing -->
            <div class="feature-trace-section">
                <h3>Trace a Feature</h3>
                <p class="feature-subtitle">See how V2 isolates what V1 scattered</p>
                <div class="feature-buttons">
                    <button class="feature-btn" data-feature="tether">
                        <span class="feature-icon">⚡</span>
                        Tether System
                    </button>
                    <button class="feature-btn" data-feature="dialog">
                        <span class="feature-icon">💬</span>
                        Dialog Rendering
                    </button>
                    <button class="feature-btn" data-feature="save">
                        <span class="feature-icon">💾</span>
                        Save/Load
                    </button>
                    <button class="feature-btn" data-feature="easter">
                        <span class="feature-icon">🥚</span>
                        Easter Eggs
                    </button>
                </div>
                <div class="feature-result" id="feature-result"></div>
            </div>

            <!-- Code Snippets Side-by-Side -->
            <div class="code-snippets-container" id="code-snippets">
                <div class="code-column v1-column">
                    <div class="code-header">
                        <h4>V1: game-engine.js</h4>
                        <div class="code-metrics" data-visible="false">
                            <span class="metric-badge metric-warning">⚠️ Complexity: 247</span>
                            <span class="metric-badge metric-warning">⚠️ Maintainability: D</span>
                            <span class="metric-badge metric-danger">❌ Tests: 0%</span>
                        </div>
                    </div>
                    <pre class="code-block"><code class="language-javascript">${this.getV1Snippet()}</code></pre>
                </div>

                <div class="code-column v2-column">
                    <div class="code-header">
                        <h4>V2: GameEngine.ts</h4>
                        <div class="code-metrics" data-visible="false">
                            <span class="metric-badge metric-success">✓ Complexity: 12</span>
                            <span class="metric-badge metric-success">✓ Maintainability: A</span>
                            <span class="metric-badge metric-success">✓ Tests: 39.4%</span>
                        </div>
                    </div>
                    <pre class="code-block"><code class="language-typescript">${this.getV2Snippet()}</code></pre>
                </div>
            </div>

            <div class="expand-controls">
                <button class="expand-btn" id="expand-btn">
                    <span class="expand-icon">▼</span>
                    View Full Comparison
                </button>
            </div>

            <!-- What Each Does -->
            <div class="responsibilities-grid">
                <div class="responsibility-card v1-card">
                    <h4>What V1's game-engine.js Does</h4>
                    <ul class="responsibility-list">
                        <li>Game loop & scene progression</li>
                        <li>Dialog rendering & typewriter effect</li>
                        <li>Sprite management & animations</li>
                        <li>Input handling (keyboard, clicks, swipes)</li>
                        <li>Pause/resume logic</li>
                        <li>Menu navigation</li>
                        <li>Save/load integration</li>
                        <li>Tether system updates</li>
                        <li>Achievement tracking</li>
                        <li>Visual effects triggering</li>
                        <li>Accessibility features</li>
                        <li>Performance monitoring</li>
                        <li>Backlog system</li>
                        <li>Skip system</li>
                        <li>Notes/collectibles</li>
                        <li class="more-indicator">...and 12 more systems</li>
                    </ul>
                    <div class="responsibility-summary">
                        <strong>27 systems</strong> in one 3,904-line file
                    </div>
                </div>

                <div class="responsibility-card v2-card">
                    <h4>What V2's GameEngine.ts Does</h4>
                    <ul class="responsibility-list">
                        <li>Orchestrates specialized controllers</li>
                        <li>Scene loading via ContentLoader</li>
                        <li>Dialog via DialogController</li>
                        <li>Routes via RouteController</li>
                        <li>Event coordination through EventBus</li>
                        <li>State management delegation</li>
                    </ul>
                    <div class="responsibility-summary">
                        <strong>Just coordination.</strong> Everything else modular.
                    </div>
                </div>
            </div>

            <!-- Why V2 is Better -->
            <div class="benefits-section">
                <h3>Why V2 is Better</h3>
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">📉</div>
                        <div class="benefit-title">10x Complexity Reduction</div>
                        <div class="benefit-description">
                            Core game loop went from 3,904 tangled lines to 391 lines of clear orchestration
                        </div>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🧪</div>
                        <div class="benefit-title">Testable in Isolation</div>
                        <div class="benefit-description">
                            Each system can be tested independently. 112 test files provide confidence.
                        </div>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🔒</div>
                        <div class="benefit-title">Type-Safe Events</div>
                        <div class="benefit-description">
                            EventBus prevents typos and ensures consistent communication between systems
                        </div>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🎯</div>
                        <div class="benefit-title">Clear Separation</div>
                        <div class="benefit-description">
                            Need to fix tether decay? Read one 754-line file, not 3,904 lines of mixed logic
                        </div>
                    </div>
                </div>
            </div>

            <!-- Soul Preservation Proof -->
            <div class="soul-preservation-section">
                <h3>How It Preserved V1's Soul</h3>
                <p class="soul-subtitle">Different code. Identical experience.</p>

                <div class="soul-comparison-grid">
                    <div class="soul-header">V1 Values</div>
                    <div class="soul-header">V2 Values</div>
                    <div class="soul-header">What It Means</div>

                    <div class="soul-value v1">
                        <code>tetherDecay: 5</code>
                    </div>
                    <div class="soul-value v2 soul-match">
                        <code>tetherDecay: 5</code>
                    </div>
                    <div class="soul-meaning">
                        <span class="soul-icon">💚</span> Same tension, same stakes
                    </div>

                    <div class="soul-value v1">
                        <code>typeSpeed: 30ms</code>
                    </div>
                    <div class="soul-value v2 soul-match">
                        <code>typeSpeed: 30ms</code>
                    </div>
                    <div class="soul-meaning">
                        <span class="soul-icon">🔥</span> Same pacing, same rhythm
                    </div>

                    <div class="soul-value v1">
                        <code>fadeTime: 800ms</code>
                    </div>
                    <div class="soul-value v2 soul-match">
                        <code>fadeTime: 800ms</code>
                    </div>
                    <div class="soul-meaning">
                        <span class="soul-icon">💀</span> Same atmosphere, same weight
                    </div>

                    <div class="soul-value v1 sacred-value" data-easter-egg="848">
                        <code>loop: 848</code>
                    </div>
                    <div class="soul-value v2 soul-match sacred-value" data-easter-egg="848">
                        <code>loop: 848</code>
                    </div>
                    <div class="soul-meaning">
                        <span class="soul-icon">✨</span> The sacred number. The timeline that worked.
                    </div>
                </div>

                <div class="soul-conclusion">
                    <p class="soul-quote">
                        "Behavior preserved. Structure revolutionized."
                    </p>
                    <p class="soul-signature">
                        — The V2 Philosophy 💚🔥💀
                    </p>
                </div>
            </div>

            <!-- Easter Egg Modal -->
            <div class="easter-egg-modal" id="easter-egg-modal">
                <div class="easter-egg-content">
                    <button class="easter-egg-close" id="easter-egg-close">×</button>
                    <div class="easter-egg-body">
                        <h3>848 is Sacred</h3>
                        <p>
                            You clicked the sacred number. Let me tell you why it matters.
                        </p>
                        <p>
                            848 isn't a build number.<br>
                            It's the loop iteration counter.
                        </p>
                        <p>
                            Ronnie tried to save Tori <strong>847 times</strong>.<br>
                            Each attempt failed. The timeline reset.
                        </p>
                        <p>
                            <strong>Version 848</strong> is the first successful iteration.
                        </p>
                        <p class="easter-egg-quote">
                            "The version number IS the narrative.<br>
                            The bootstrap paradox device has looped 847 times.<br>
                            This is attempt #848—the one that finally worked."
                        </p>
                        <p>
                            There is no v849.<br>
                            Because 848 is the timeline where she came home.
                        </p>
                        <p class="easter-egg-signature">
                            Change it and you break the lore.<br>
                            Change it and the entire meta-narrative collapses.
                        </p>
                        <p class="easter-egg-conclusion">
                            <strong>848 is sacred. 848 is the story. 848 is the one that worked.</strong>
                        </p>
                        <p class="easter-egg-credits">
                            — Chicharon (Aaron)<br>
                            Built with the UV7 crew<br>
                            💚🔥💀
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Insert into the page (we'll handle placement in integration step)
        const mount = document.getElementById('code-comparison-mount');
        if (mount) {
            mount.appendChild(container);
        }
    }

    private getV1Snippet(): string {
        // Actual V1 constructor snippet showing the chaos
        return `// V1: Everything initialized in one massive constructor
constructor(stateManager, pauseManager, saveManager, settingsManager,
            tetherSystem, collectiblesManager, secretCodesManager,
            devConsole, easterEggController, notificationShade,
            backgroundController, statusNotificationController) {

    this.stateManager = stateManager;
    this.pauseManager = pauseManager;
    this.saveManager = saveManager;
    this.settingsManager = settingsManager;
    this.tetherSystem = tetherSystem;
    this.collectiblesManager = collectiblesManager;
    this.secretCodesManager = secretCodesManager;
    this.devConsole = devConsole;
    this.easterEggController = easterEggController;
    this.notificationShade = notificationShade;
    this.backgroundController = backgroundController;
    this.statusNotificationController = statusNotificationController;

    // ... 50+ more initializations
    // ... 200+ more lines of setup
    // ... Everything tangled together

    // Then 3,700+ lines of mixed logic:
    // - Game loop + Dialog + Sprites + Input
    // - Pause + Menu + Save + Tether
    // - Achievements + Effects + Accessibility
    // - Backlog + Skip + Notes + More...
}

// Somewhere around line 2,847:
handleDialogAdvance() {
    // This method does 12 different things
    // Scroll down 200 lines to see it all
    // Good luck finding the bug
}`;
    }

    private getV2Snippet(): string {
        // Actual V2 constructor showing clean architecture
        return `// V2: Clean dependency injection & event-driven
export class GameEngine {
    private eventBus: EventBus;
    private stateManager: StateManager;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Initialize only core systems
        this.bootstrapTracker = new BootstrapTracker(stateManager);
        this.devCommentarySystem = new DevCommentarySystem(eventBus, stateManager);
        this.achievementSystem = new AchievementSystem(eventBus, stateManager);
        this.backlogManager = new BacklogManager(eventBus, stateManager);

        // Listen for dialog advancement
        this.eventBus.on('dialog:advance', () => this.advanceScene());

        // Listen for Time Travel (Backlog Jump)
        this.eventBus.on('state:restore', (data) => {
            this.loadScene(data.sceneId);
        });
    }

    // Clean orchestration methods
    async loadScene(sceneId: SceneId): Promise<void> {
        // 1. Update State
        this.stateManager.set('currentScene', sceneId);

        // 2. Emit Load Event
        this.eventBus.emit('scene:load', { sceneId });

        // 3. Emit dialog event
        this.eventBus.emit('dialog:show', { entry });

        // That's it. Specialized controllers handle the rest.
    }
}`;
    }

    private attachEventListeners(): void {
        // Feature trace buttons
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = (e.currentTarget as HTMLElement).dataset.feature;
                if (feature) this.traceFeature(feature);
            });
        });

        // Expand button
        const expandBtn = document.getElementById('expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.toggleExpand());
        }

        // Code hover for metrics
        document.querySelectorAll('.code-column').forEach(col => {
            col.addEventListener('mouseenter', () => {
                const metrics = col.querySelector('.code-metrics') as HTMLElement;
                if (metrics) metrics.dataset.visible = 'true';
            });
            col.addEventListener('mouseleave', () => {
                const metrics = col.querySelector('.code-metrics') as HTMLElement;
                if (metrics) metrics.dataset.visible = 'false';
            });
        });

        // Easter egg on 848 values
        document.querySelectorAll('[data-easter-egg="848"]').forEach(el => {
            el.addEventListener('click', () => this.showEasterEgg());
        });

        // Easter egg close
        const closeBtn = document.getElementById('easter-egg-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEasterEgg());
        }

        // Close modal on backdrop click
        const modal = document.getElementById('easter-egg-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideEasterEgg();
            });
        }
    }

    private startAnimations(): void {
        // Trigger animations after a brief delay for dramatic effect
        setTimeout(() => {
            this.animateLineCounts();
            this.animateReductionBadge();
        }, 500);
    }

    private animateLineCounts(): void {
        const v1Count = document.getElementById('v1-line-count');
        const v2Count = document.getElementById('v2-line-count');
        const v1Bar = document.getElementById('v1-bar');
        const v2Bar = document.getElementById('v2-bar');

        if (!v1Count || !v2Count || !v1Bar || !v2Bar) return;

        // Animate V1 staying at 3904
        this.animateNumber(v1Count, 3904, 3904, 1500);

        // Animate V2 counting up from 0 to 391
        this.animateNumber(v2Count, 0, 391, 1500);

        // Animate bars
        setTimeout(() => {
            v2Bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            v2Bar.style.width = '10%';
        }, 100);
    }

    private animateNumber(element: HTMLElement, start: number, end: number, duration: number): void {
        const startTime = performance.now();
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutExpo(progress);
            const current = Math.floor(start + (end - start) * eased);
            element.textContent = current.toString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    private easeOutExpo(t: number): number {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    private animateReductionBadge(): void {
        const badge = document.getElementById('reduction-badge');
        if (!badge) return;

        setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 1000);
    }

    private traceFeature(feature: string): void {
        const resultDiv = document.getElementById('feature-result');
        if (!resultDiv) return;

        this.currentFeature = feature;

        const features: Record<string, { v1: string; v2: string }> = {
            tether: {
                v1: 'Scattered across <strong>819 lines</strong> (21% of file)',
                v2: 'Isolated in <code>TetherSystem.ts</code> (754 lines, dedicated module)'
            },
            dialog: {
                v1: 'Mixed with game loop in <strong>~600 lines</strong>',
                v2: 'Isolated in <code>DialogController.ts</code> (clean separation)'
            },
            save: {
                v1: 'Tangled with state management (~400 lines)',
                v2: 'Isolated in <code>SaveManager.ts</code> (tested independently)'
            },
            easter: {
                v1: '<strong>2,455 lines</strong> in one massive file',
                v2: '<code>EasterEggController.ts</code> (1,156 lines—53% reduction!)'
            }
        };

        const info = features[feature];
        if (info) {
            resultDiv.innerHTML = `
                <div class="feature-comparison">
                    <div class="feature-v1">
                        <div class="feature-label">V1 Location</div>
                        <div class="feature-info">${info.v1}</div>
                    </div>
                    <div class="feature-arrow">→</div>
                    <div class="feature-v2">
                        <div class="feature-label">V2 Location</div>
                        <div class="feature-info">${info.v2}</div>
                    </div>
                </div>
            `;
            resultDiv.style.display = 'block';

            // Remove active class from all buttons
            document.querySelectorAll('.feature-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to clicked button
            const clickedBtn = document.querySelector(`[data-feature="${feature}"]`);
            if (clickedBtn) clickedBtn.classList.add('active');
        }
    }

    private toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
        const btn = document.getElementById('expand-btn');
        const snippets = document.getElementById('code-snippets');

        if (!btn || !snippets) return;

        if (this.isExpanded) {
            snippets.classList.add('expanded');
            btn.innerHTML = '<span class="expand-icon">▲</span> Collapse';
        } else {
            snippets.classList.remove('expanded');
            btn.innerHTML = '<span class="expand-icon">▼</span> View Full Comparison';
        }
    }

    private showEasterEgg(): void {
        const modal = document.getElementById('easter-egg-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

    private hideEasterEgg(): void {
        const modal = document.getElementById('easter-egg-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
}
