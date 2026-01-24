export class ResultsSection {
    constructor() {
        this.render();
        this.updateDynamicStats();
    }

    updateDynamicStats() {
        // Update timeline entries count dynamically
        setTimeout(() => {
            if (window.TIMELINE_DATA && window.TIMELINE_DATA.entries) {
                const timelineCard = document.querySelector('[data-stat-type="phases"] .stat-number');
                if (timelineCard) {
                    timelineCard.setAttribute('data-target', window.TIMELINE_DATA.entries.length);
                    timelineCard.textContent = '0'; // Reset for animation
                }
            }
            
            // Update days in development
            const startDate = new Date('2026-01-08');
            const today = new Date();
            const daysDiff = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
            const daysCard = document.querySelector('[data-stat-type="days"] .stat-number');
            if (daysCard) {
                daysCard.setAttribute('data-target', daysDiff);
                daysCard.textContent = '0'; // Reset for animation
            }
        }, 100);
    }

    render() {
        const mount = document.getElementById('uv7-results-mount');
        if (!mount) return;

        mount.innerHTML = `
            <section class="results-section">
                <!-- Hero Banner -->
                <div class="hero-banner results">
                    <img src="media/banners/banner-results.png" alt="Results Banner" class="hero-banner-image">
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
                        <h1 class="hero-banner-title">The Results</h1>
                        <p class="hero-banner-subtitle">Vision, AI collaboration, and smart workflow design</p>
                    </div>
                </div>

                <div class="section-content">
                    <p class="section-intro">What happens when you combine vision, AI collaboration, and smart workflow
                        design.
                    </p>

                    <div class="stats-grid">
                        <div class="stat-card" data-stat-type="tests">
                            <div class="stat-icon">🚧</div>
                            <div class="stat-number" data-target="55">0</div>
                            <div class="stat-label">Test Files (Stubbed)</div>
                        </div>
                        <div class="stat-card" data-stat-type="phases">
                            <div class="stat-icon">
                                <svg class="progress-ring" viewBox="0 0 36 36">
                                    <circle class="ring-bg" cx="18" cy="18" r="16" />
                                    <circle class="ring-fill" cx="18" cy="18" r="16" />
                                </svg>
                            </div>
                            <div class="stat-number" data-target="53">0</div>
                            <div class="stat-label">Timeline Entries</div>
                        </div>
                        <div class="stat-card" data-stat-type="days">
                            <div class="stat-icon">📅</div>
                            <div class="stat-number" data-target="16">0</div>
                            <div class="stat-label">Days in Development</div>
                        </div>
                        <div class="stat-card" data-stat-type="errors">
                            <div class="stat-icon">🔧</div>
                            <div class="stat-number" data-target="25">0</div>
                            <div class="stat-label">TS Errors (Minor)</div>
                        </div>
                    </div>

                    <!-- PERFORMANCE METRICS (New) -->
                    <div class="metrics-container">
                        <div class="metric-card">
                            <h4>LOAD TIME</h4>
                            <div class="metric-bar-group">
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V1</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v1" style="width: 100%"></div>
                                    </div>
                                    <span class="metric-value">2.4s</span>
                                </div>
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V2</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v2" id="metric-load-v2-bar" style="width: 30%">
                                        </div>
                                    </div>
                                    <span class="metric-value" id="metric-load-v2-value">0.7s</span>
                                </div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>BUNDLE SIZE</h4>
                            <div class="metric-bar-group">
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V1</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v1" style="width: 100%"></div>
                                    </div>
                                    <span class="metric-value">5MB</span>
                                </div>
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V2</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v2" style="width: 40%"></div>
                                    </div>
                                    <span class="metric-value">2MB</span>
                                </div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>STABILITY</h4>
                            <div class="metric-bar-group">
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V1</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v1" style="width: 85%"></div>
                                    </div>
                                    <span class="metric-value">Low</span>
                                </div>
                                <div class="metric-bar-wrapper">
                                    <span class="metric-label">V2</span>
                                    <div class="metric-track">
                                        <div class="metric-fill fill-v2" style="width: 100%"></div>
                                    </div>
                                    <span class="metric-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="achievements">
                        <h3>Key Achievements</h3>
                        <ul>
                            <li><strong>EventBus Architecture</strong> - Decoupled, type-safe event system</li>
                            <li><strong>Immutable State Management</strong> - Predictable state with time-travel
                                debugging
                            </li>
                            <li><strong>Component-Based UI</strong> - Automatic cleanup, consistent lifecycle</li>
                            <li><strong>Full Content Migration</strong> - 6 acts, all endings, secrets, achievements
                            </li>
                            <li><strong>TypeScript Strict Mode</strong> - ~95% type-safe, 25 minor errors remaining</li>
                            <li><strong>Test Infrastructure</strong> - <span id="achievements-tests">55 test
                                    files</span>
                                structured (implementation in progress)</li>
                            <li><strong>Accessibility Suite</strong> - High contrast, font scaling, reduced motion</li>
                            <li><strong>Meta-Narrative Systems</strong> - Tracking timelines across browser sessions
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        `;
    }
}
