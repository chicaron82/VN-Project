// ========================================
// SETTINGS TEMPLATE
// HTML template for the settings modal
//
// Extracted from SettingsModal.ts (~370 lines -> dedicated module)
//
// Handles:
// - Full 4-tab settings modal DOM creation
// - General, Sensory, Shortcuts, and Secret Codes tabs
// - All control markup (buttons, toggles, sliders, inputs)
//
// 848 is sacred. 💚🔥💀
// ========================================

/**
 * Create the settings modal DOM structure.
 * Returns the container element with all tabs and controls.
 */
export function createSettingsDOM(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'settings-menu';
    container.style.display = 'none';

    container.innerHTML = `
        <div id="settings-content">
            <button class="close-x" id="btn-close-settings" aria-label="Close settings">X</button>
            <h2>SETTINGS</h2>

            <div class="settings-tabs">
                <button class="settings-tab-btn active" data-tab="general">GENERAL</button>
                <button class="settings-tab-btn" data-tab="sensory">SENSORY</button>
                <button class="settings-tab-btn" data-tab="shortcuts">SHORTCUTS</button>
                <button class="settings-tab-btn" data-tab="codes">SECRET CODES</button>
            </div>

            <div class="settings-tab-content">
                <!-- GENERAL TAB -->
                <div class="tab-panel active" id="tab-general">
                    <div class="settings-section">
                        <h3 class="settings-section-header">Text & Display</h3>

                        <!-- Text Speed -->
                        <div class="setting-row">
                            <label class="setting-label">TEXT SPEED</label>
                            <div class="setting-control">
                                <button class="speed-btn" data-speed="slow">SLOW</button>
                                <button class="speed-btn active" data-speed="normal">NORMAL</button>
                                <button class="speed-btn" data-speed="fast">FAST</button>
                                <button class="speed-btn" data-speed="instant">INSTANT</button>
                            </div>
                        </div>

                        <!-- Font Size -->
                        <div class="setting-row">
                            <label class="setting-label">FONT SIZE</label>
                            <div class="setting-control">
                                <button class="font-size-btn" data-size="small">SMALL</button>
                                <button class="font-size-btn active" data-size="medium">MEDIUM</button>
                                <button class="font-size-btn" data-size="large">LARGE</button>
                            </div>
                        </div>

                        <!-- Display Mode -->
                        <div class="setting-row">
                            <label class="setting-label">DISPLAY MODE</label>
                            <div class="setting-control">
                                <button class="display-mode-btn active" data-mode="auto">AUTO</button>
                                <button class="display-mode-btn" data-mode="portrait">PORTRAIT</button>
                                <button class="display-mode-btn" data-mode="landscape">LANDSCAPE</button>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-header">Gameplay</h3>

                        <!-- Auto-Advance -->
                        <div class="setting-row">
                            <label class="setting-label">AUTO-ADVANCE</label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="auto-advance-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status" id="auto-advance-status">OFF</span>
                            </div>
                        </div>

                        <!-- Auto-Advance Delay -->
                        <div class="setting-row setting-sub-row" id="auto-delay-row" style="display: none;">
                            <label class="setting-label">AUTO DELAY</label>
                            <div class="setting-control slider-control">
                                <span class="slider-label-min">1s</span>
                                <input type="range" id="auto-delay-slider" min="1000" max="10000" step="500" value="2000">
                                <span class="slider-label-max">10s</span>
                                <span class="slider-value" id="auto-delay-value">2.0s</span>
                            </div>
                        </div>

                        <!-- Auto-Skip Prologue -->
                        <div class="setting-row">
                            <label class="setting-label">AUTO-SKIP PROLOGUE</label>
                            <div class="setting-control">
                                <label class="toggle-switch" id="auto-skip-prologue-container">
                                    <input type="checkbox" id="auto-skip-prologue-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status" id="auto-skip-prologue-status">LOCKED</span>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-header">UI Theme</h3>

                        <!-- UI Theme -->
                        <div class="setting-row">
                            <div class="setting-control theme-selector-grid">
                                <button class="theme-pref-btn active" data-theme="auto">AUTO</button>
                                <button class="theme-pref-btn" data-theme="ronnie">RONNIE</button>
                                <button class="theme-pref-btn" data-theme="tori">TORI</button>
                                <button class="theme-pref-btn" data-theme="true">TRUE</button>
                                <button class="theme-pref-btn" data-theme="digital">DIGITAL</button>
                                <button class="theme-pref-btn" data-theme="bad">BAD</button>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-header">Tori's Route Difficulty</h3>

                        <!-- Tether Difficulty -->
                        <div class="setting-row">
                            <div class="difficulty-setting-container">
                                <div class="difficulty-buttons-row">
                                    <div class="setting-control">
                                        <button class="tether-difficulty-btn" data-difficulty="relaxed">RELAXED</button>
                                        <button class="tether-difficulty-btn active" data-difficulty="normal">NORMAL</button>
                                        <button class="tether-difficulty-btn" data-difficulty="intense">INTENSE</button>
                                        <button class="tether-difficulty-btn insane-btn insane-locked" data-difficulty="insane" id="insane-difficulty-btn">
                                            <span class="skull-icon">SKULL</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="difficulty-explanations">
                                    <div class="difficulty-explanation-item">
                                        <strong>Relaxed:</strong> Slower tether decay (more time to read)
                                    </div>
                                    <div class="difficulty-explanation-item">
                                        <strong>Normal:</strong> Balanced experience (recommended)
                                    </div>
                                    <div class="difficulty-explanation-item">
                                        <strong>Intense:</strong> Faster decay (maximum tension)
                                    </div>
                                    <div class="difficulty-explanation-item insane-explanation" id="insane-explanation-locked" style="display: none;">
                                        <strong>SKULL Insane:</strong> <span class="locked-text">Complete Intense difficulty to unlock</span>
                                    </div>
                                    <div class="difficulty-explanation-item insane-explanation" id="insane-explanation-unlocked" style="display: none;">
                                        <strong>SKULL Insane:</strong> <span class="warning-text">No Hold On | No Time Jump | No Mercy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fullscreen -->
                    <div class="setting-row">
                        <label class="setting-label">FULLSCREEN</label>
                        <div class="setting-control">
                            <button class="action-btn" id="settings-fullscreen-btn">TOGGLE FULLSCREEN</button>
                        </div>
                    </div>
                </div>

                <!-- SENSORY TAB -->
                <div class="tab-panel" id="tab-sensory">
                    <div class="settings-section">
                        <h3 class="settings-section-header">Accessibility</h3>

                        <!-- Reduce Motion Toggle -->
                        <div class="setting-row">
                            <label for="reduce-motion-toggle" class="setting-label-column">
                                <span class="setting-name">REDUCE MOTION</span>
                                <span class="setting-description">Minimize animations and transitions</span>
                                <span class="setting-note">Reduces motion for users sensitive to movement</span>
                            </label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="reduce-motion-toggle" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <!-- High Contrast Toggle -->
                        <div class="setting-row">
                            <label for="high-contrast-toggle" class="setting-label-column">
                                <span class="setting-name">HIGH CONTRAST</span>
                                <span class="setting-description">Increase text and UI contrast</span>
                                <span class="setting-note">Makes text easier to read</span>
                            </label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="high-contrast-toggle" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <!-- Comfort Mode Toggle -->
                        <div class="setting-row">
                            <label for="comfort-mode-toggle" class="setting-label-column">
                                <span class="setting-name">COMFORT MODE</span>
                                <span class="setting-description">Disable glitch visual effects</span>
                                <span class="setting-note">Reduces flickering/screen distortion for accessibility</span>
                            </label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="comfort-mode-toggle" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-header">Sensory Intensity</h3>

                        <!-- Comfort Intensity Slider -->
                        <div class="setting-row setting-row-vertical">
                            <label for="comfort-intensity-slider" class="setting-label-column">
                                <span class="setting-name">INTENSITY LEVEL</span>
                                <span class="setting-description">Visual & haptic feedback strength</span>
                                <span class="setting-note">Adjust how punchy glitches and shakes feel.</span>
                            </label>
                            <div class="setting-control intensity-control">
                                <div class="intensity-slider-container">
                                    <div class="intensity-current-label">
                                        <span id="comfort-intensity-label" class="intensity-value-display">Normal</span>
                                    </div>
                                    <input type="range" id="comfort-intensity-slider" min="0" max="3" value="1" step="1" />
                                    <div class="intensity-labels">
                                        <span>Gentle</span>
                                        <span>Normal</span>
                                        <span>Amped</span>
                                        <span class="intensity-insane">INSANE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3 class="settings-section-header">Tutorials</h3>

                        <!-- Tutorials Toggle -->
                        <div class="setting-row">
                            <label class="setting-label">TUTORIALS</label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="tutorial-hints-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status" id="tutorial-hints-status">ON</span>
                            </div>
                        </div>

                        <!-- Reset Tutorials Button -->
                        <div class="setting-row">
                            <label class="setting-label">RESET TUTORIALS</label>
                            <div class="setting-control">
                                <button class="action-btn" id="reset-tutorials-btn">RESET ALL</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SHORTCUTS TAB -->
                <div class="tab-panel" id="tab-shortcuts">
                    <div class="shortcuts-list">
                        <h3>DIALOGUE & GAMEPLAY</h3>
                        <div class="shortcut-item">
                            <span class="shortcut-key">SPACE / ENTER</span>
                            <span class="shortcut-desc">Advance dialogue</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">S</span>
                            <span class="shortcut-desc">Skip typing animation</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">CTRL (Hold)</span>
                            <span class="shortcut-desc">Skip read dialogue (unlocked after 1st ending)</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">H</span>
                            <span class="shortcut-desc">Hide UI (for screenshots)</span>
                        </div>

                        <h3 style="margin-top: 30px;">NAVIGATION</h3>
                        <div class="shortcut-item">
                            <span class="shortcut-key">ARROW KEYS</span>
                            <span class="shortcut-desc">Navigate menus & choices</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">TAB / SHIFT+TAB</span>
                            <span class="shortcut-desc">Cycle through interactive elements</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">1-9 NUMBER KEYS</span>
                            <span class="shortcut-desc">Quick select choices</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">ESC</span>
                            <span class="shortcut-desc">Close overlays / Open pause menu</span>
                        </div>

                        <h3 style="margin-top: 30px;">QUICK ACTIONS</h3>
                        <div class="shortcut-item">
                            <span class="shortcut-key">CTRL + S</span>
                            <span class="shortcut-desc">Quick save to slot 1</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">CTRL + L</span>
                            <span class="shortcut-desc">Quick load from slot 1</span>
                        </div>

                        <h3 style="margin-top: 30px;">MOBILE CONTROLS</h3>
                        <div class="shortcut-item">
                            <span class="shortcut-key">TAP DIALOGUE</span>
                            <span class="shortcut-desc">Advance or skip typing</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">SWIPE UP</span>
                            <span class="shortcut-desc">Scroll dialogue box (Tori's route)</span>
                        </div>

                        <div class="keyboard-shortcuts-footer">
                            <p>Green glow indicates keyboard-focused elements</p>
                        </div>

                        <h3 style="margin-top: 30px;">BOOTSTRAP TIMELINE</h3>
                        <div class="shortcut-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
                            <button class="action-btn" id="view-bootstrap-timeline-btn" style="width: 100%; padding: 15px;">
                                VIEW ATTEMPT HISTORY
                            </button>
                            <span class="shortcut-desc" style="text-align: center; opacity: 0.7;">
                                Track your journey through the loop
                            </span>
                        </div>
                    </div>
                </div>

                <!-- SECRET CODES TAB -->
                <div class="tab-panel" id="tab-codes">
                    <div class="codes-panel">
                        <p class="codes-intro">Enter secret codes found in notes and lore.</p>

                        <div class="code-input-group">
                            <input type="text" id="secret-code-input" placeholder="Enter code here...">
                            <button id="submit-code-btn" class="action-btn">REDEEM CODE</button>
                        </div>

                        <div id="code-success-indicator" style="display: none;">
                            <div class="code-sparkle">*</div>
                            <div class="code-registered">CODE REGISTERED</div>
                        </div>

                        <div id="code-result-message"></div>

                        <div class="codes-discovered">
                            <h3>DISCOVERED CODES (<span id="codes-count">0</span>/11)</h3>
                            <div id="codes-list">
                                <p class="no-codes">No codes discovered yet...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="settings-buttons">
                <button class="settings-menu-button" id="btn-settings-back">BACK</button>
                <button class="settings-menu-button settings-reset-btn" id="btn-settings-reset">RESET TO DEFAULT</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}
