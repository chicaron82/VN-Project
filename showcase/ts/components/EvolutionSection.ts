import { createBanner, BANNER_CONFIGS } from '../../lib/BannerGenerator';

export class EvolutionSection {
    constructor() {
        this.render();
        this.updateDynamicStats();
    }

    updateDynamicStats(): void {
        // Wait a bit for stats to load
        setTimeout(() => {
            const stats = window.UV7Stats;
            if (!stats) {
                console.warn('📊 UV7Stats not loaded yet for Evolution section');
                return;
            }

            // Update Phases Complete
            if (stats.phasesComplete !== undefined) {
                const phasesValue = document.querySelector('.evolution-metrics .metric-card:nth-child(2) .metric-value');
                if (phasesValue) {
                    phasesValue.textContent = stats.phasesComplete.toString();
                }
            }

            // Update Test Files Count
            if (stats.testsTotal !== undefined) {
                const testsValue = document.querySelector('.evolution-metrics .metric-card:nth-child(3) .metric-value');
                const testsLabel = document.querySelector('.evolution-metrics .metric-card:nth-child(3) .metric-change');
                if (testsValue) {
                    testsValue.textContent = stats.testsTotal.toLocaleString();
                }
                if (testsLabel) {
                    const passing = stats.testsPass ?? stats.testsTotal;
                    const failing = stats.testsFail ?? 0;
                    if (failing > 0) {
                        testsLabel.textContent = `${passing} passing, ${failing} failing`;
                    } else {
                        testsLabel.textContent = `${passing} passing ✓`;
                    }
                }
            }

            // Update TypeScript Errors
            if (stats.tsErrors !== undefined) {
                const errorsValue = document.querySelector('.evolution-metrics .metric-card:nth-child(4) .metric-value');
                const errorsChange = document.querySelector('.evolution-metrics .metric-card:nth-child(4) .metric-change');
                if (errorsValue) {
                    errorsValue.textContent = stats.tsErrors.toString();
                }
                if (errorsChange) {
                    if (stats.tsErrors === 0) {
                        errorsChange.textContent = '✓ Clean';
                        errorsChange.classList.remove('negative');
                    } else {
                        errorsChange.textContent = `→ 0 (goal)`;
                        errorsChange.classList.add('negative');
                    }
                }
            }

            // Update comparison text references
            const strictTypesText = document.querySelector('.comparison-column.col-order .comparison-item:nth-child(3) p');
            if (strictTypesText && stats.tsErrors !== undefined) {
                if (stats.tsErrors === 0) {
                    strictTypesText.textContent = 'TypeScript caught 40+ crashes. All errors resolved. Clean build ✓';
                } else {
                    strictTypesText.textContent = `TypeScript caught 40+ crashes. ${stats.tsErrors} minor errors remain (unused vars, EventBus types). Game runs great anyway.`;
                }
            }

            const testInfraText = document.querySelector('.comparison-column.col-order .comparison-item:nth-child(5) p');
            if (testInfraText && stats.testsTotal !== undefined) {
                const passing = stats.testsPass ?? stats.testsTotal;
                testInfraText.textContent = `${stats.testsTotal} test files with ${passing} tests passing. Full coverage in progress.`;
            }

            console.log('📊 Evolution stats updated:', stats);
        }, 500);
    }

    render(): void {
        const mount = document.getElementById('uv7-evolution-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="evolution-section">
                <!-- Hero Banner -->
                ${createBanner(BANNER_CONFIGS.evolution)}

                <div class="section-content">
                    <p class="section-intro">
                        <strong>Version 848</strong> evolved from a rapid-fire prototype to a production-ready engine.
                        Here's the side-by-side comparison of that transformation.
                    </p>

                    <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
                        Version 848 V1 → V2 Migration
                    </h3>

                    <!-- Metrics Dashboard -->
                    <div class="evolution-metrics">
                        <div class="metric-card">
                            <div class="metric-value">6,247</div>
                            <div class="metric-label">Lines Migrated</div>
                            <div class="metric-change">+20% expansion</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">79</div>
                            <div class="metric-label">Phases Complete</div>
                            <div class="metric-change">~95% ported</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">1,137</div>
                            <div class="metric-label">Test Files</div>
                            <div class="metric-change">1137 passing ✓</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">0</div>
                            <div class="metric-label">TS Errors</div>
                            <div class="metric-change">✓ Clean</div>
                        </div>
                    </div>

                    <div class="comparison-grid">
                        <!-- V1 Chaos Column -->
                        <div class="comparison-column col-chaos">
                            <h3>Version 848 V1: The Prototype</h3>

                            <div class="comparison-item">
                                <h4>🕸️ Spaghetti Dependencies</h4>
                                <p>Systems called each other directly. A circular dependency nightmare where Tethers
                                    broke
                                    the
                                    Menu.</p>
                            </div>

                            <div class="comparison-item">
                                <h4>📄 Hardcoded Data</h4>
                                <p>Dialogue, stats, and logical flags were buried inside JavaScript functions.</p>
                            </div>

                            <div class="comparison-item">
                                <h4>💣 Runtime Risks</h4>
                                <p>"Trust me bro." No types. One typo in a variable name could crash the entire ending
                                    sequence.
                                </p>
                            </div>

                            <div class="comparison-item">
                                <h4>🌍 Global State Chaos</h4>
                                <p>State scattered across window.gameState, localStorage, and closure variables. No
                                    single
                                    source of truth.</p>
                            </div>

                            <div class="comparison-item">
                                <h4>🎲 Manual Testing Only</h4>
                                <p>"It works on my machine." No automated tests. Every change risked breaking something.
                                </p>
                            </div>

                            <div class="comparison-item">
                                <h4>🏗️ Monolithic game-engine.js</h4>
                                <p>2,000+ line god object. Everything in one file. Impossible to maintain.</p>

                            </div>

                            <div class="comparison-item">
                                <h4>🐌 Direct DOM Manipulation</h4>
                                <p>Constant reflows. No batching. Janky animations on older devices.</p>
                            </div>
                        </div>

                        <!-- V2 Order Column -->
                        <div class="comparison-column col-order">
                            <h3>Version 848 V2: The Production Build</h3>

                            <div class="comparison-item">
                                <h4>📡 Event-Driven Core</h4>
                                <p>Decoupled systems via EventBus. Tethers just listen. Menus just listen. Zero direct
                                    dependencies.</p>
                                <button class="view-diff-button" data-comparison-id="event-handling">
                                    <span>🔎 View Code Comparison</span>
                                </button>
                            </div>

                            <div class="comparison-item">
                                <h4>📑 JSON Content</h4>
                                <p>Pure separation of concerns. Narrative logic lives in strict JSON schemas, editable
                                    by
                                    writers.</p>
                            </div>

                            <div class="comparison-item">
                                <h4>🛡️ Strict Types (Mostly)</h4>
                                <p>TypeScript caught 40+ crashes. All errors resolved. Clean build ✓</p>
                            </div>

                            <div class="comparison-item">
                                <h4>🎯 Centralized StateManager</h4>
                                <p>Single source of truth. Immutable state updates. Time-travel debugging ready.</p>
                                <button class="view-diff-button" data-comparison-id="state-management">
                                    <span>🔎 View Code Comparison</span>
                                </button>
                            </div>

                            <div class="comparison-item">
                                <h4>🚧 Test Infrastructure (In Progress)</h4>
                                <p>1137 test files with 1137 tests passing. Full coverage in progress.</p>
                            </div>

                            <div class="comparison-item">
                                <h4>🏛️ Modular Controllers</h4>
                                <p>Single responsibility. Each controller < 300 lines. Easy to understand and
                                        extend.</p>
                                <button class="view-diff-button" data-comparison-id="architecture">
                                    <span>🔎 View Code Comparison</span>
                                </button>
                            </div>

                            <div class="comparison-item">
                                <h4>⚡ Optimized Rendering</h4>
                                <p>Batched updates. RequestAnimationFrame. Smooth 60fps on all devices.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Architecture Diagram -->
                    <div class="architecture-diagram">
                        <h3 class="architecture-title">Architecture Evolution</h3>
                        <div class="architecture-grid">
                            <!-- V1: Tangled Web -->
                            <div class="architecture-side">
                                <h4 style="color: var(--chaos-text, #ff6b6b);">V1: Tangled Dependencies</h4>
                                <div class="tangled-web">
                                    <svg class="tangled-lines" viewBox="0 0 300 300">
                                        <!-- Chaotic connection lines -->
                                        <line x1="50" y1="50" x2="250" y2="250" />
                                        <line x1="250" y1="50" x2="50" y2="250" />
                                        <line x1="150" y1="50" x2="50" y2="150" />
                                        <line x1="250" y1="150" x2="150" y2="250" />
                                        <line x1="50" y1="100" x2="250" y2="200" />
                                        <line x1="100" y1="50" x2="200" y2="250" />
                                    </svg>
                                    <div class="web-node">GameEngine</div>
                                    <div class="web-node">MenuController</div>
                                    <div class="web-node">DialogueSystem</div>
                                    <div class="web-node">SaveSystem</div>
                                    <div class="web-node">TetherSystem</div>
                                    <div class="web-node">AudioManager</div>
                                </div>
                                <p
                                    style="text-align: center; color: rgba(255, 255, 255, 0.6); margin-top: 1rem; font-style: italic;">
                                    Everything calls everything. Circular dependency nightmare.
                                </p>
                            </div>

                            <!-- V2: Clean Layers -->
                            <div class="architecture-side">
                                <h4 style="color: var(--order-text, #00ccff);">V2: Layered Architecture</h4>
                                <div class="clean-layers">
                                    <div class="layer">
                                        <div class="layer-title">🎨 UI Layer</div>
                                        <div class="layer-items">Components, Screens, Animations</div>
                                    </div>
                                    <div class="layer">
                                        <div class="layer-title">🎮 Controllers</div>
                                        <div class="layer-items">Dialogue, Menu, Save, Tether, Audio</div>
                                    </div>
                                    <div class="layer">
                                        <div class="layer-title">⚙️ Managers</div>
                                        <div class="layer-items">State, Tutorial, Debug, Config</div>
                                    </div>
                                    <div class="layer">
                                        <div class="layer-title">🔧 Core Systems</div>
                                        <div class="layer-items">EventBus, Logger, Haptics</div>
                                    </div>
                                </div>
                                <p
                                    style="text-align: center; color: rgba(255, 255, 255, 0.6); margin-top: 1rem; font-style: italic;">
                                    Clear hierarchy. Each layer only talks down. Zero circular dependencies.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Key Takeaways -->
                    <div class="evolution-takeaways"
                        style="margin-top: 3rem; padding: 2rem; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-bottom: 1rem;">🎯 The Transformation</h3>
                        <ul style="list-style: none; padding: 0; color: rgba(255, 255, 255, 0.9);">
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <span style="position: absolute; left: 0; color: #00ff88;">✓</span>
                                <strong>From chaos to clarity:</strong> Spaghetti code → Clean architecture
                            </li>
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <span style="position: absolute; left: 0; color: #00ff88;">✓</span>
                                <strong>From fragile to robust:</strong> Runtime crashes → Compile-time safety
                            </li>
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <span style="position: absolute; left: 0; color: #00ff88;">✓</span>
                                <strong>From manual to automated:</strong> 0 tests → 1137 tests
                            </li>
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <span style="position: absolute; left: 0; color: #00ff88;">✓</span>
                                <strong>From monolith to modular:</strong> 2,000-line god object → Clean controllers
                            </li>
                            <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                                <span style="position: absolute; left: 0; color: #00ff88;">✓</span>
                                <strong>From slow to fast:</strong> 2.4s load → 0.7s load (3x faster)
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="improvements-section">
                <div class="section-content">
                    <h2>Beyond Parity: V2 Improvements</h2>
                    <p class="section-intro">Where the rebuild surpasses the original.</p>

                    <div class="improvements-grid">
                        <div class="improvement-card">
                            <div class="improvement-icon">⚡</div>
                            <h3>3x Faster Load Times</h3>
                            <p>Vite bundling + tree-shaking reduced initial load from 2.4s to 0.7s</p>
                            <span class="metric-badge">+243% faster</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">🎯</div>
                            <h3>Skip Hint UI</h3>
                            <p>Added "PRESS SPACE OR ENTER" hint with pulsing animation - V1 never had this</p>
                            <span class="metric-badge">New Feature</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">🛡️</div>
                            <h3>Type Safety ✓</h3>
                            <p>TypeScript strict mode caught 40+ potential crashes. All errors resolved.</p>
                            <span class="metric-badge">100% type-safe</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">🚧</div>
                            <h3>Test Infrastructure Ready</h3>
                            <p>1137 test files with full passing suite. Vitest configured and running.</p>
                            <span class="metric-badge">Tests Passing ✓</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">📦</div>
                            <h3>60% Smaller Bundle</h3>
                            <p>Optimized from 5MB to 2MB through code splitting and modern tooling</p>
                            <span class="metric-badge">-3MB saved</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">🔄</div>
                            <h3>Hot Module Replacement</h3>
                            <p>Instant feedback during development - no more full page reloads</p>
                            <span class="metric-badge">Dev Experience</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">🎨</div>
                            <h3>Component Lifecycle</h3>
                            <p>Automatic cleanup prevents memory leaks that plagued V1</p>
                            <span class="metric-badge">Stability++</span>
                        </div>

                        <div class="improvement-card">
                            <div class="improvement-icon">📝</div>
                            <h3>JSON Content Schema</h3>
                            <p>Writers can edit story content without touching code</p>
                            <span class="metric-badge">Maintainability</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="roadmap-section">
                <div class="section-content">
                    <h2>Future Roadmap</h2>
                    <p class="section-intro">The architecture is ready. Here's where UV7 goes next.</p>

                    <div class="roadmap-grid">
                        <div class="roadmap-card">
                            <h3>🛠️ Community Mods</h3>
                            <p>Since the story is now JSON, players can drag-and-drop their own "fan fiction" routes
                                into
                                the
                                engine without coding.</p>
                        </div>

                        <div class="roadmap-card">
                            <h3>📱 PWA Offline Mode</h3>
                            <p>Install UV7 to your home screen. Play locally on flights. The engine is already
                                client-side
                                ready.</p>
                        </div>

                        <div class="roadmap-card">
                            <h3>🗣️ Audio Events</h3>
                            <p>Hook the EventBus to an audio system. Different characters trigger specific blips or
                                voice
                                lines
                                automatically.</p>
                        </div>

                        <div class="roadmap-card">
                            <h3>🤖 Auto-Verification</h3>
                            <p>Playwright visual testing to ensure every CSS change doesn't break the mobile layout on
                                400px
                                screens.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
