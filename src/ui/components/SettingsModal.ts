import { EventBus } from '../../core/EventBus';
import { SettingsSystem } from '../../systems/SettingsSystem';

/**
 * Settings configuration interface
 * NOTE: UV7 intentionally has no audio - uses visual cues + haptics instead
 */
interface GameSettings {
    // Text & Display
    textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
    fontSize: 'small' | 'medium' | 'large';
    displayMode: 'auto' | 'portrait' | 'landscape';

    // Feedback (no audio - intentional design decision)
    hapticEnabled: boolean;

    // Comfort & Accessibility
    comfortIntensity: number;  // 0=Gentle, 1=Normal, 2=Amped, 3=INSANE
    reduceMotion: boolean;
    highContrast: boolean;
    comfortMode: boolean;  // Disable glitch effects

    // Gameplay
    autoAdvance: boolean;
    autoAdvanceDelay: number;  // 1000-10000ms
    autoSkipPrologue: boolean;

    // UI
    uiTheme: string;
    tetherDifficulty: 'relaxed' | 'normal' | 'intense' | 'insane';
    tutorialHints: boolean;
}

/**
 * Default settings values
 */
const DEFAULT_SETTINGS: GameSettings = {
    textSpeed: 'normal',
    fontSize: 'medium',
    displayMode: 'auto',
    hapticEnabled: 'vibrate' in navigator,
    comfortIntensity: 1,
    reduceMotion: false,
    highContrast: false,
    comfortMode: false,
    autoAdvance: false,
    autoAdvanceDelay: 2000,
    autoSkipPrologue: false,
    uiTheme: 'auto',
    tetherDifficulty: 'normal',
    tutorialHints: true
};

export class SettingsModal {
    private container!: HTMLElement;
    private isOpen: boolean = false;
    private currentTab: string = 'general';
    private eventBus: EventBus;
    private settingsSystem: SettingsSystem | null = null;
    private saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    private settings: GameSettings;

    constructor(eventBus: EventBus, settingsSystem?: SettingsSystem) {
        this.eventBus = eventBus;
        this.settingsSystem = settingsSystem || null;
        this.settings = { ...DEFAULT_SETTINGS };

        this.createDOM();
        this.setupEventListeners();
        this.loadSettings();

        // Listen for open/close events
        this.eventBus.on('settings:open', () => this.open());
        this.eventBus.on('settings:close', () => {
            if (this.isOpen) this.close(false);
        });
    }

    private createDOM() {
        this.container = document.createElement('div');
        this.container.id = 'settings-menu';
        this.container.style.display = 'none';

        this.container.innerHTML = `
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

        document.body.appendChild(this.container);
    }

    private setupEventListeners() {
        // Close buttons
        this.container.querySelector('#btn-close-settings')?.addEventListener('click', () => this.close());
        this.container.querySelector('#btn-settings-back')?.addEventListener('click', () => this.close());

        // Tabs
        this.container.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.switchTab(target.dataset.tab || 'general');
            });
        });

        // Text Speed Buttons
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setTextSpeed(target.dataset.speed as GameSettings['textSpeed'] || 'normal');
            });
        });

        // Font Size Buttons
        this.container.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setFontSize(target.dataset.size as GameSettings['fontSize'] || 'medium');
            });
        });

        // Display Mode Buttons
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setDisplayMode(target.dataset.mode as GameSettings['displayMode'] || 'auto');
            });
        });

        // Auto Advance Toggle
        const autoToggle = this.container.querySelector('#auto-advance-toggle') as HTMLInputElement;
        autoToggle?.addEventListener('change', () => {
            this.settings.autoAdvance = autoToggle.checked;
            this.updateToggleStatus('auto-advance-status', autoToggle.checked);
            this.saveSettingDebounced('autoAdvance', autoToggle.checked);

            // Show/hide delay slider
            const delayRow = this.container.querySelector('#auto-delay-row') as HTMLElement;
            if (delayRow) delayRow.style.display = autoToggle.checked ? 'flex' : 'none';
        });

        // Auto Delay Slider
        const delaySlider = this.container.querySelector('#auto-delay-slider') as HTMLInputElement;
        delaySlider?.addEventListener('input', () => {
            const value = parseInt(delaySlider.value);
            this.settings.autoAdvanceDelay = value;
            const valueDisplay = this.container.querySelector('#auto-delay-value');
            if (valueDisplay) valueDisplay.textContent = `${(value / 1000).toFixed(1)}s`;
            this.saveSettingDebounced('autoAdvanceDelay', value);
        });

        // Auto Skip Prologue Toggle
        const skipPrologueToggle = this.container.querySelector('#auto-skip-prologue-toggle') as HTMLInputElement;
        skipPrologueToggle?.addEventListener('change', () => {
            this.settings.autoSkipPrologue = skipPrologueToggle.checked;
            this.updateToggleStatus('auto-skip-prologue-status', skipPrologueToggle.checked);
            this.saveSettingDebounced('autoSkipPrologue', skipPrologueToggle.checked);
        });

        // UI Theme Buttons
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setTheme(target.dataset.theme || 'auto');
            });
        });

        // Tether Difficulty Buttons
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setDifficulty(target.dataset.difficulty as GameSettings['tetherDifficulty'] || 'normal');
            });
        });

        // Fullscreen Button
        const fsBtn = this.container.querySelector('#settings-fullscreen-btn');
        fsBtn?.addEventListener('click', () => this.toggleFullscreen());

        // Haptic Toggle
        const hapticToggle = this.container.querySelector('#haptic-toggle') as HTMLInputElement;
        hapticToggle?.addEventListener('change', () => {
            this.settings.hapticEnabled = hapticToggle.checked;
            this.saveSettingDebounced('hapticEnabled', hapticToggle.checked);
        });

        // Reduce Motion Toggle
        const reduceMotionToggle = this.container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
        reduceMotionToggle?.addEventListener('change', () => {
            this.settings.reduceMotion = reduceMotionToggle.checked;
            this.saveSettingDebounced('reduceMotion', reduceMotionToggle.checked);
            this.applyReduceMotion(reduceMotionToggle.checked);
        });

        // High Contrast Toggle
        const highContrastToggle = this.container.querySelector('#high-contrast-toggle') as HTMLInputElement;
        highContrastToggle?.addEventListener('change', () => {
            this.settings.highContrast = highContrastToggle.checked;
            this.saveSettingDebounced('highContrast', highContrastToggle.checked);
            this.applyHighContrast(highContrastToggle.checked);
        });

        // Comfort Mode Toggle
        const comfortToggle = this.container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
        comfortToggle?.addEventListener('change', () => {
            this.settings.comfortMode = comfortToggle.checked;
            this.saveSettingDebounced('comfortMode', comfortToggle.checked);
            this.applyComfortMode(comfortToggle.checked);
        });

        // Comfort Intensity Slider
        const intensitySlider = this.container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
        intensitySlider?.addEventListener('input', () => {
            const value = parseInt(intensitySlider.value);
            this.settings.comfortIntensity = value;
            this.updateIntensityLabel(value);
            this.saveSettingDebounced('comfortIntensity', value);
        });

        // Tutorial Toggle
        const tutorialToggle = this.container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
        tutorialToggle?.addEventListener('change', () => {
            this.settings.tutorialHints = tutorialToggle.checked;
            this.updateToggleStatus('tutorial-hints-status', tutorialToggle.checked);
            this.saveSettingDebounced('tutorialHints', tutorialToggle.checked);
        });

        // Reset Tutorials Button
        const resetTutorialsBtn = this.container.querySelector('#reset-tutorials-btn');
        resetTutorialsBtn?.addEventListener('click', () => {
            localStorage.removeItem('carouselTutorialDismissed');
            this.saveSettingDebounced('tutorialsReset', true);

            // Visual feedback
            const btn = resetTutorialsBtn as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = 'RESET!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });

        // Reset to Default Button
        const resetBtn = this.container.querySelector('#btn-settings-reset');
        resetBtn?.addEventListener('click', () => {
            if (confirm('Reset all settings to default?')) {
                this.resetToDefaults();
            }
        });

        // Secret Code Submit
        const submitCodeBtn = this.container.querySelector('#submit-code-btn');
        const codeInput = this.container.querySelector('#secret-code-input') as HTMLInputElement;

        submitCodeBtn?.addEventListener('click', () => {
            if (codeInput && codeInput.value.trim()) {
                this.submitSecretCode(codeInput.value.trim());
                codeInput.value = '';
            }
        });

        codeInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && codeInput.value.trim()) {
                this.submitSecretCode(codeInput.value.trim());
                codeInput.value = '';
            }
        });
    }

    private switchTab(tabName: string) {
        this.currentTab = tabName;

        // Update tab buttons
        this.container.querySelectorAll('.settings-tab-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.tab === tabName);
        });

        // Update tab panels
        this.container.querySelectorAll('.tab-panel').forEach(panel => {
            const el = panel as HTMLElement;
            el.classList.toggle('active', el.id === `tab-${tabName}`);
        });
    }

    private setTextSpeed(speed: GameSettings['textSpeed']) {
        this.settings.textSpeed = speed;
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.speed === speed);
        });
        this.saveSettingDebounced('textSpeed', speed);
    }

    private setFontSize(size: GameSettings['fontSize']) {
        this.settings.fontSize = size;
        this.container.querySelectorAll('.font-size-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.size === size);
        });
        this.saveSettingDebounced('fontSize', size);
        this.applyFontSize(size);
    }

    private setDisplayMode(mode: GameSettings['displayMode']) {
        this.settings.displayMode = mode;
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.mode === mode);
        });
        this.saveSettingDebounced('displayMode', mode);
        this.applyDisplayMode(mode);
    }

    private setTheme(theme: string) {
        this.settings.uiTheme = theme;
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.theme === theme);
        });
        this.saveSettingDebounced('uiTheme', theme);
    }

    private setDifficulty(difficulty: GameSettings['tetherDifficulty']) {
        // Check for insane mode lock conditions here
        const insaneLocked = localStorage.getItem('insaneModeUnlocked') !== 'true';
        if (difficulty === 'insane' && insaneLocked) {
            // Show locked message
            return;
        }

        this.settings.tetherDifficulty = difficulty;
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.difficulty === difficulty);
        });
        this.saveSettingDebounced('tetherDifficulty', difficulty);
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    private submitSecretCode(code: string) {
        this.eventBus.emit('secret_code:submit', { code });

        // Show success indicator temporarily
        const indicator = this.container.querySelector('#code-success-indicator') as HTMLElement;
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }

    private updateToggleStatus(elementId: string, checked: boolean) {
        const el = this.container.querySelector(`#${elementId}`);
        if (el) el.textContent = checked ? 'ON' : 'OFF';
    }

    private updateIntensityLabel(value: number) {
        const labels = ['Gentle', 'Normal', 'Amped', 'INSANE'];
        const colors = ['#00ff88', '#0ff', '#ff00ff', '#ff0000'];
        const labelEl = this.container.querySelector('#comfort-intensity-label');

        if (labelEl) {
            labelEl.textContent = labels[value] || 'Normal';
            (labelEl as HTMLElement).style.color = colors[value] || '#0ff';
            (labelEl as HTMLElement).style.textShadow = `0 0 10px ${colors[value] || '#0ff'}`;
        }
    }

    // ========================================
    // SETTINGS PERSISTENCE
    // ========================================

    private saveSettingDebounced(key: string, value: any) {
        // Clear existing timer
        if (this.saveDebounceTimer) {
            clearTimeout(this.saveDebounceTimer);
        }

        // Set new timer for debounced save
        this.saveDebounceTimer = setTimeout(() => {
            this.saveSetting(key, value);
        }, 300);
    }

    private saveSetting(key: string, value: any) {
        // Save to localStorage
        const current = JSON.parse(localStorage.getItem('gameSettings') || '{}');
        current[key] = value;
        localStorage.setItem('gameSettings', JSON.stringify(current));

        // Save to SettingsSystem if available
        if (this.settingsSystem) {
            // @ts-ignore - dynamic key access
            this.settingsSystem.set(key, value);
        }

        // Emit settings:changed event
        this.eventBus.emit('settings:changed', { key, value });
    }

    private loadSettings() {
        // Try localStorage first
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.settings = { ...DEFAULT_SETTINGS, ...parsed };
            } catch (e) {
                console.error('Failed to parse saved settings:', e);
                this.settings = { ...DEFAULT_SETTINGS };
            }
        }

        // Apply loaded settings to UI
        this.applySettingsToUI();

        // Apply settings to game systems
        this.applyAllSettings();
    }

    private applySettingsToUI() {
        // Text Speed
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.speed === this.settings.textSpeed);
        });

        // Font Size
        this.container.querySelectorAll('.font-size-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.size === this.settings.fontSize);
        });

        // Display Mode
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.mode === this.settings.displayMode);
        });

        // Theme
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.theme === this.settings.uiTheme);
        });

        // Difficulty
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.difficulty === this.settings.tetherDifficulty);
        });

        // Auto Advance
        const autoToggle = this.container.querySelector('#auto-advance-toggle') as HTMLInputElement;
        if (autoToggle) {
            autoToggle.checked = this.settings.autoAdvance;
            this.updateToggleStatus('auto-advance-status', this.settings.autoAdvance);
            const delayRow = this.container.querySelector('#auto-delay-row') as HTMLElement;
            if (delayRow) delayRow.style.display = this.settings.autoAdvance ? 'flex' : 'none';
        }

        // Auto Delay
        const delaySlider = this.container.querySelector('#auto-delay-slider') as HTMLInputElement;
        if (delaySlider) {
            delaySlider.value = this.settings.autoAdvanceDelay.toString();
            const valueDisplay = this.container.querySelector('#auto-delay-value');
            if (valueDisplay) valueDisplay.textContent = `${(this.settings.autoAdvanceDelay / 1000).toFixed(1)}s`;
        }

        // Toggles
        const hapticToggle = this.container.querySelector('#haptic-toggle') as HTMLInputElement;
        if (hapticToggle) hapticToggle.checked = this.settings.hapticEnabled;

        const reduceMotionToggle = this.container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
        if (reduceMotionToggle) reduceMotionToggle.checked = this.settings.reduceMotion;

        const highContrastToggle = this.container.querySelector('#high-contrast-toggle') as HTMLInputElement;
        if (highContrastToggle) highContrastToggle.checked = this.settings.highContrast;

        const comfortToggle = this.container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
        if (comfortToggle) comfortToggle.checked = this.settings.comfortMode;

        // Intensity slider
        const intensitySlider = this.container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
        if (intensitySlider) {
            intensitySlider.value = this.settings.comfortIntensity.toString();
            this.updateIntensityLabel(this.settings.comfortIntensity);
        }

        // Tutorial toggle
        const tutorialToggle = this.container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
        if (tutorialToggle) {
            tutorialToggle.checked = this.settings.tutorialHints;
            this.updateToggleStatus('tutorial-hints-status', this.settings.tutorialHints);
        }
    }

    private applyAllSettings() {
        this.applyFontSize(this.settings.fontSize);
        this.applyDisplayMode(this.settings.displayMode);
        this.applyReduceMotion(this.settings.reduceMotion);
        this.applyHighContrast(this.settings.highContrast);
        this.applyComfortMode(this.settings.comfortMode);
    }

    // ========================================
    // APPLY SETTINGS TO GAME SYSTEMS
    // ========================================

    private applyFontSize(size: GameSettings['fontSize']) {
        const sizeMap = { small: '14px', medium: '16px', large: '20px' };
        document.documentElement.style.setProperty('--dialog-font-size', sizeMap[size] || '16px');
        document.body.setAttribute('data-font-size', size);
    }

    private applyDisplayMode(mode: GameSettings['displayMode']) {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        gameContainer.classList.remove('force-portrait', 'force-landscape');
        if (mode === 'portrait') {
            gameContainer.classList.add('force-portrait');
        } else if (mode === 'landscape') {
            gameContainer.classList.add('force-landscape');
        }
    }

    private applyReduceMotion(enabled: boolean) {
        document.body.setAttribute('data-reduce-motion', enabled ? 'true' : 'false');
        if (enabled) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    private applyHighContrast(enabled: boolean) {
        document.body.setAttribute('data-high-contrast', enabled ? 'true' : 'false');
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    private applyComfortMode(enabled: boolean) {
        document.body.setAttribute('data-comfort-mode', enabled ? 'true' : 'false');

        // Find all glitch elements and toggle comfort-mode class
        document.querySelectorAll('.version-glitch').forEach(el => {
            if (enabled) {
                el.classList.add('comfort-mode');
            } else {
                el.classList.remove('comfort-mode');
            }
        });
    }

    private resetToDefaults() {
        this.settings = { ...DEFAULT_SETTINGS };
        localStorage.removeItem('gameSettings');

        // Re-apply to UI and game
        this.applySettingsToUI();
        this.applyAllSettings();

        // Save defaults
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));

        // Emit reset event for each setting
        Object.entries(this.settings).forEach(([key, value]) => {
            this.eventBus.emit('settings:changed', { key, value });
        });
    }

    // ========================================
    // PUBLIC API
    // ========================================

    public open() {
        this.isOpen = true;
        this.container.style.display = 'flex';

        // Re-load settings in case they changed externally
        this.loadSettings();

        // Update secret codes UI if available
        if ((window as any).secretCodesManager) {
            (window as any).secretCodesManager.updateCodesUI();
        }

        console.debug('Settings opened. Active tab:', this.currentTab);
    }

    public close(emitEvent: boolean = true) {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.container.style.display = 'none';

        if (emitEvent) {
            this.eventBus.emit('settings:close', {});
        }
    }

    public getSettings(): GameSettings {
        return { ...this.settings };
    }

    public getSetting<K extends keyof GameSettings>(key: K): GameSettings[K] {
        return this.settings[key];
    }

    public isModalOpen(): boolean {
        return this.isOpen;
    }
}
