/**
 * VN COMPARISON SECTION
 * The epic "Simple VN vs Version 848" expandable comparison
 *
 * The dominance move: when V848 expands, its features overflow
 * into the Simple VN column. Peak flex, peak comedy.
 *
 * Extracted from HomeSection (previously inline ~370 lines).
 * 💚🔥💀
 */

export class VNComparisonSection {
    /** Render the full comparison HTML */
    render(): string {
        return `
            <div id="scope-comparison" class="comparison-section">
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

                        <!-- Expanded View (The Joke) -->
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

                            <div class="simple-vn-section">
                                <strong>🎨 UI & VISUALS</strong>
                                <ul>
                                    <li>Background image</li>
                                    <li>Character sprite (2 poses if you're fancy)</li>
                                    <li>Text box at bottom</li>
                                    <li>Settings menu (volume slider)</li>
                                </ul>
                            </div>

                            <div class="simple-vn-section">
                                <strong>📱 RESPONSIVE DESIGN</strong>
                                <ul>
                                    <li>"It displays on screen"</li>
                                    <li>Mobile? ¯\\_(ツ)_/¯</li>
                                </ul>
                            </div>

                            <div class="simple-vn-section">
                                <strong>🛠️ DEV TOOLS</strong>
                                <ul>
                                    <li>Logger.ui()</li>
                                    <li>That's it. That's the list.</li>
                                </ul>
                            </div>

                            <div class="simple-vn-section">
                                <strong>⚙️ ARCHITECTURE</strong>
                                <ul>
                                    <li>one_file.js (4,237 lines)</li>
                                    <li>God help you if you need to debug</li>
                                </ul>
                            </div>

                            <!-- THE OVERFLOW (Hidden until v848 expands) -->
                            <div id="v848-overflow" style="display: none;">
                                <!-- THE DOMINANCE MOVE -->
                                <div style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(102, 126, 234, 0.15)); border-radius: 8px; border: 1px solid var(--accent-primary); text-align: center;">
                                    <p style="font-style: italic; margin: 0; opacity: 0.9; font-size: 0.95rem;">
                                        <strong>...well, I ran out of room on my side, so may as well use up this empty space over here...</strong>
                                    </p>
                                </div>

                                <!-- MORE VERSION 848 FEATURES -->
                                <div class="v848-system-section narrative" style="border-left-color: var(--accent-primary);">
                                    <strong>⚡ EVEN MORE VERSION 848 FEATURES</strong>
                                    <ul>
                                        <li>Advanced state machine (400+ possible game states)</li>
                                        <li>Custom physics engine with hand-tuned momentum curves</li>
                                        <li>Multi-layered save system (quick/auto/manual slots)</li>
                                        <li>Dynamic difficulty adjustment based on player patterns</li>
                                        <li>Accessibility suite (font scaling, contrast modes, reduced motion)</li>
                                        <li>Localization framework (i18n-ready for multiple languages)</li>
                                        <li>Analytics engine (player choice heatmaps, completion metrics)</li>
                                    </ul>
                                </div>

                                <div class="v848-system-section mechanics" style="border-left-color: var(--accent-cyan);">
                                    <strong>💾 ADVANCED PERSISTENCE</strong>
                                    <ul>
                                        <li>Cloud save support ready (cross-device sync architecture)</li>
                                        <li>Automatic backup rotation (protects against corruption)</li>
                                        <li>Save format versioning (migration system for updates)</li>
                                        <li>Compression algorithms (efficient storage without quality loss)</li>
                                        <li>Integrity validation (checksums prevent tampering)</li>
                                    </ul>
                                </div>

                                <div class="v848-system-section ui" style="border-left-color: var(--accent-purple);">
                                    <strong>🎭 POLISH & FEEL</strong>
                                    <ul>
                                        <li>300+ hand-crafted micro-animations</li>
                                        <li>Custom easing functions (that *chef's kiss* feel)</li>
                                        <li>Particle systems synchronized to narrative beats</li>
                                        <li>Dynamic color grading based on scene emotional tone</li>
                                        <li>Spatial audio design with positional effects</li>
                                        <li>Haptic feedback patterns (mobile vibration choreography)</li>
                                    </ul>
                                </div>

                                <div class="v848-system-section testing" style="border-left-color: var(--accent-pink);">
                                    <strong>🔬 PRODUCTION QUALITY</strong>
                                    <ul>
                                        <li>CI/CD pipeline with automated deployments</li>
                                        <li>Performance monitoring (FPS tracking, memory profiling)</li>
                                        <li>Error tracking with stack trace capture</li>
                                        <li>A/B testing framework for narrative experiments</li>
                                        <li>Beta testing infrastructure (staged rollouts)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Toggle Button -->
                        <button id="toggle-simple-vn-details" class="simple-vn-toggle-btn">
                            ▼ Show Details (if you really want to)
                        </button>

                        <div class="comparison-details">
                            ⏱️ Time: 2-4 weeks<br>
                            📦 Size: ~5 MB<br>
                            🧩 Complexity: Linear
                        </div>
                    </div>

                    <!-- Version 848 Column -->
                    <div class="comparison-card v848">
                        <h4>⚡ Version 848</h4>

                        <!-- Collapsed List -->
                        <ul id="v848-collapsed" class="comparison-list">
                            <li>Philosophical narrative (consciousness, loops, paradoxes)</li>
                            <li>Dual protagonists (Ronnie + Tori perspectives)</li>
                            <li>Bootstrap paradox meta-narrative</li>
                            <li>Cross-game communication (VN ↔ ToriGatchi)</li>
                            <li>TypeScript + event-driven architecture</li>
                            <li>1100+ automated tests</li>
                        </ul>

                        <!-- Expanded Full List -->
                        <div id="v848-expanded" style="display: none;">
                            <div class="v848-system-section narrative">
                                <strong>🧠 NARRATIVE SYSTEMS</strong>
                                <ul>
                                    <li>Bootstrap paradox tracker (Loop 848 canonical variable)</li>
                                    <li>Dual-route narrative (external + internal perspectives)</li>
                                    <li>JSON-driven dialogue system with dynamic branching</li>
                                    <li>Meta-narrative layer (nested loops/versions)</li>
                                    <li>Time Machine manager (non-linear jumps + state snapshots)</li>
                                </ul>
                            </div>

                            <div class="v848-system-section mechanics">
                                <strong>🎮 GAME MECHANICS</strong>
                                <ul>
                                    <li>Tether system (reality stability with passive decay)</li>
                                    <li>Insane Mode (ghost buttons, read-only mechanics)</li>
                                    <li>Time machine backlog (click any dialogue to jump back)</li>
                                    <li>Smart pruning (keeps narrative anchors, discards filler)</li>
                                    <li>11 secret codes with utility injections (tetherlock, saveanywhere)</li>
                                    <li>Achievement system with persistent discovery tracking</li>
                                    <li>New Game+ with state persistence across resets</li>
                                    <li>Director's Cut mode (hidden overlay content layer)</li>
                                </ul>
                            </div>

                            <div class="v848-system-section cross-game">
                                <strong>🔗 CROSS-GAME SYSTEMS</strong>
                                <ul>
                                    <li>ToriGatchi integration (separate web app with bilateral state)</li>
                                    <li>VN affects ToriGatchi start states (Optimal vs Desperate)</li>
                                    <li>ToriGatchi endings feed back into main game via localStorage</li>
                                    <li>vn-gateway-bridge.js for cross-app communication</li>
                                </ul>
                            </div>

                            <div class="v848-system-section memory">
                                <strong>🧠 MEMORY & PERSISTENCE</strong>
                                <ul>
                                    <li>Echo memory system (characters remember you across sessions)</li>
                                    <li>Multi-session state tracking with escalating awareness (0-4 levels)</li>
                                    <li>localStorage + IndexedDB hybrid persistence</li>
                                    <li>Save file encryption</li>
                                    <li>Full state snapshots (Tether, Flags, RNG seed) at every step</li>
                                    <li>"Remembered" achievement when all Echoes notice player</li>
                                </ul>
                            </div>

                            <div class="v848-system-section ui">
                                <strong>🎨 UI & VISUALS</strong>
                                <ul>
                                    <li>Custom physics engine (CarouselMomentum with friction + velocity decay)</li>
                                    <li>Strategy Pattern UI adapter (hot-swaps SimpleCarousel ↔ MomentumAdapter)</li>
                                    <li>Dynamic character sprite rendering with positioning</li>
                                    <li>Visual glitching system (CSS filters synced to narrative beats)</li>
                                    <li>CG gallery with unlock tracking</li>
                                    <li>Settings menu with accessibility options</li>
                                    <li>Fourth-wall breaking glitch text effects</li>
                                </ul>
                            </div>

                            <div class="v848-system-section responsive">
                                <strong>📱 RESPONSIVE & UX</strong>
                                <ul>
                                    <li>Dual-layout engine (Portrait stack ↔ Landscape grid)</li>
                                    <li>Desktop mobile emulator (state-driven .force-portrait mode)</li>
                                    <li>Haptic feedback (vibration patterns synced to narrative)</li>
                                    <li>Touch target optimization (Fitts's Law hit-boxes)</li>
                                    <li>Context-aware interactivity (sprites as buttons)</li>
                                    <li>Gesture-driven interactions (Tinder-style card swipes)</li>
                                    <li>Platform-specific feel targets (desktop coasting vs mobile spring-back)</li>
                                </ul>
                            </div>

                            <div class="v848-system-section devtools">
                                <strong>🛠️ DEVELOPER TOOLS (Built-In!)</strong>
                                <ul>
                                    <li>On-device debugging console (DevConsole.js - custom overlay terminal)</li>
                                    <li>Intercepts all logging streams in-game (log/warn/error)</li>
                                    <li>Touch-friendly command palette for mobile debugging</li>
                                    <li>Runtime flag manipulation (settether, unlockact1, etc.)</li>
                                    <li>State inspection tools (view flags, variables, progress)</li>
                                    <li>Hot-swap routes without reloading</li>
                                    <li>Zero USB tethering required - debug on actual device</li>
                                    <li>"Debug in the wild" on phones without desktop tools</li>
                                </ul>
                            </div>

                            <div class="v848-system-section architecture">
                                <strong>⚙️ ARCHITECTURE</strong>
                                <ul>
                                    <li>Event-driven core (EventBus decouples all systems)</li>
                                    <li>Controller-based MVC pattern (single responsibility)</li>
                                    <li>Immutable state manager (time-travel debugging ready)</li>
                                    <li>TypeScript strict mode (40+ caught errors before runtime)</li>
                                    <li>Input abstraction layer (InputBinder decouples logic from views)</li>
                                    <li>Priority-queue asset preloader (critical vs lazy-loading)</li>
                                    <li>Error boundaries (safeExecute catches runtime errors)</li>
                                    <li>Dependency injection for testability</li>
                                </ul>
                            </div>

                            <div class="v848-system-section collectibles">
                                <strong>📧 COLLECTIBLES & SECRETS</strong>
                                <ul>
                                    <li>Full email client UI (unread badges, subject lines, senders)</li>
                                    <li>RNG pity system (forces drop after 3 failures)</li>
                                    <li>Route suppression (blocks lore on first playthrough)</li>
                                    <li>Persistent discovery (codes tracked across hard resets)</li>
                                    <li>Code discovery with runtime flag overrides</li>
                                </ul>
                            </div>

                            <div class="v848-system-section testing">
                                <strong>✅ QUALITY & TESTING</strong>
                                <ul>
                                    <li>1100+ unit tests (Vitest)</li>
                                    <li>Type safety enforcement (zero TypeScript errors)</li>
                                    <li>Zero runtime crashes in main build</li>
                                    <li>State immutability verification</li>
                                    <li>Physics tuning (hand-tuned friction, velocity caps)</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Expand/Collapse Button -->
                        <button id="toggle-v848-details" class="v848-toggle-btn">
                            ▼ Show Everything (Seriously. Everything.)
                        </button>

                        <div class="comparison-details">
                            ⏱️ Time: 50+ days<br>
                            📦 Size: 45+ MB (engine + assets)<br>
                            🧩 Complexity: Enterprise-grade architecture
                        </div>
                    </div>
                </div>

                <p class="comparison-note">
                    One is a game. The other is a <strong>philosophical experience</strong> with layers of narrative, technical sophistication, and emergent gameplay.
                </p>
            </div>
        `;
    }

    /** Wire up expand/collapse buttons for both columns */
    attachEventListeners(): void {
        // Simple VN toggle
        const simpleButton = document.getElementById('toggle-simple-vn-details');
        if (simpleButton) {
            simpleButton.addEventListener('click', () => {
                const collapsed = document.getElementById('simple-vn-collapsed');
                const expanded = document.getElementById('simple-vn-expanded');

                if (expanded && collapsed) {
                    if (expanded.style.display === 'none' || !expanded.style.display) {
                        collapsed.style.display = 'none';
                        expanded.style.display = 'block';
                        simpleButton.textContent = '▲ Okay, I\'ve seen enough';
                    } else {
                        collapsed.style.display = 'block';
                        expanded.style.display = 'none';
                        simpleButton.textContent = '▼ Show Details (if you really want to)';
                    }
                }
            });
        }

        // Version 848 toggle (the monster)
        const v848Button = document.getElementById('toggle-v848-details');
        if (v848Button) {
            v848Button.addEventListener('click', () => {
                const collapsed = document.getElementById('v848-collapsed');
                const expanded = document.getElementById('v848-expanded');
                const overflow = document.getElementById('v848-overflow');

                if (expanded && collapsed) {
                    if (expanded.style.display === 'none' || !expanded.style.display) {
                        // Expand v848 side
                        collapsed.style.display = 'none';
                        expanded.style.display = 'block';
                        v848Button.textContent = '▲ That\'s Enough. I Get It.';

                        // Reveal the overflow (the dominance move!)
                        if (overflow) {
                            overflow.style.display = 'block';
                        }
                    } else {
                        // Collapse v848 side
                        collapsed.style.display = 'block';
                        expanded.style.display = 'none';
                        v848Button.textContent = '▼ Show Everything (Seriously. Everything.)';

                        // Hide the overflow
                        if (overflow) {
                            overflow.style.display = 'none';
                        }
                    }
                }
            });
        }
    }
}
