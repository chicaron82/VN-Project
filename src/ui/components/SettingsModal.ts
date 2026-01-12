import { EventBus } from '../../core/EventBus';

export class SettingsModal {
    private container!: HTMLElement;
    private isOpen: boolean = false;
    private currentTab: string = 'general';
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
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
                <button class="close-x" id="btn-close-settings">✕</button>
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
                        <div class="setting-row" id="auto-delay-row" style="display: none;">
                            <label class="setting-label">AUTO DELAY</label>
                            <div class="setting-control">
                                <input type="range" id="auto-delay-slider" min="1000" max="5000" step="500" value="2000">
                                <span id="auto-delay-value">2.0s</span>
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

                        <!-- Display Mode -->
                        <div class="setting-row">
                            <label class="setting-label">DISPLAY MODE</label>
                            <div class="setting-control">
                                <button class="display-mode-btn active" data-mode="auto">AUTO</button>
                                <button class="display-mode-btn" data-mode="portrait">PORTRAIT</button>
                                <button class="display-mode-btn" data-mode="landscape">LANDSCAPE</button>
                            </div>
                        </div>

                        <!-- UI Theme -->
                        <div class="setting-row">
                            <label class="setting-label">UI THEME</label>
                            <div class="setting-control theme-selector-grid">
                                <button class="theme-pref-btn active" data-theme="auto">AUTO</button>
                                <button class="theme-pref-btn" data-theme="ronnie">💙 RONNIE</button>
                                <button class="theme-pref-btn" data-theme="tori">🖤 TORI</button>
                                <button class="theme-pref-btn" data-theme="true">💚 TRUE</button>
                                <button class="theme-pref-btn" data-theme="digital">💜 DIGITAL</button>
                                <button class="theme-pref-btn" data-theme="bad">❤️ BAD</button>
                            </div>
                        </div>

                        <!-- Tether Difficulty -->
                        <div class="setting-row">
                            <div class="difficulty-setting-container">
                                <div class="difficulty-buttons-row">
                                    <label class="setting-label">TORI'S ROUTE DIFFICULTY</label>
                                    <div class="setting-control">
                                        <button class="tether-difficulty-btn" data-difficulty="relaxed">RELAXED</button>
                                        <button class="tether-difficulty-btn active" data-difficulty="normal">NORMAL</button>
                                        <button class="tether-difficulty-btn" data-difficulty="intense">INTENSE</button>
                                        <button class="tether-difficulty-btn insane-btn insane-locked" data-difficulty="insane" id="insane-difficulty-btn">
                                            <span class="skull-icon">💀</span>
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
                                        <strong>💀 Insane:</strong> <span class="locked-text">Complete Intense difficulty to unlock</span>
                                    </div>
                                    <div class="difficulty-explanation-item insane-explanation" id="insane-explanation-unlocked" style="display: none;">
                                        <strong>💀 Insane:</strong> <span class="warning-text">No Hold On | No Time Jump | No Mercy</span>
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
                        <!-- Tutorials Toggle -->
                        <div class="setting-row">
                            <label class="setting-label">TUTORIALS 👆</label>
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

                        <!-- Haptic Feedback Toggle -->
                        <div class="setting-row">
                            <label for="haptic-toggle" class="setting-label-column">
                                <span class="setting-name">HAPTIC FEEDBACK 📳</span>
                                <span class="setting-description">Vibration for key moments (mobile)</span>
                                <span class="setting-note">⚠️ Android optimized. Limited iPhone support.</span>
                            </label>
                            <div class="setting-control">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="haptic-toggle" />
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <!-- Comfort Mode Toggle -->
                        <div class="setting-row">
                            <label for="comfort-mode-toggle" class="setting-label-column">
                                <span class="setting-name">COMFORT MODE 🛡️</span>
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

                        <!-- Reduce Motion Toggle -->
                        <div class="setting-row">
                            <label for="reduce-motion-toggle" class="setting-label-column">
                                <span class="setting-name">REDUCE MOTION ♿</span>
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

                        <!-- Sensory Intensity Slider -->
                        <div class="setting-row">
                            <label for="comfort-intensity-slider" class="setting-label-column">
                                <span class="setting-name">SENSORY INTENSITY 💫</span>
                                <span class="setting-description">Visual & haptic feedback strength</span>
                                <span class="setting-note">Adjust how punchy glitches and shakes feel.</span>
                                <span class="setting-warning" style="color: #ff0066; text-shadow: 0 0 8px rgba(255, 0, 102, 0.6); font-weight: bold; margin-top: 8px; display: block;">
                                    ⚠️ INSANE MODE IGNORES THIS - Always maxed out
                                </span>
                            </label>
                            <div class="setting-control">
                                <div class="intensity-slider-container">
                                    <div class="intensity-current-label">
                                        <span id="comfort-intensity-label" style="color: #0ff; text-shadow: 0 0 10px #0ff; font-weight: bold; font-size: 1.1em;">Normal</span>
                                    </div>
                                    <input type="range" id="comfort-intensity-slider" min="0" max="2" value="1" step="1" />
                                    <div class="intensity-labels">
                                        <span>Gentle</span>
                                        <span>Normal</span>
                                        <span>Amped</span>
                                    </div>
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
                                <p>💡 Green glow indicates keyboard-focused elements</p>
                            </div>

                            <h3 style="margin-top: 30px;">BOOTSTRAP TIMELINE</h3>
                            <div class="shortcut-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
                                <button class="action-btn" id="view-bootstrap-timeline-btn" style="width: 100%; padding: 15px;">
                                    📜 VIEW ATTEMPT HISTORY
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
                                <div class="code-sparkle">✨</div>
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

                <!-- Buttons -->
                <div class="settings-buttons">
                    <button class="settings-menu-button" id="btn-settings-back">BACK</button>
                    <button class="settings-menu-button" id="btn-settings-reset">RESET TO DEFAULT</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
    }

    private setupEventListeners() {
        // Close button
        this.container.querySelector('#btn-close-settings')?.addEventListener('click', () => this.close());
        this.container.querySelector('#btn-settings-back')?.addEventListener('click', () => this.close());

        // Tabs
        this.container.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.switchTab(target.dataset.tab || 'general');
            });
        });

        // Text Speed
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setTextSpeed(target.dataset.speed || 'normal');
            });
        });

        // Auto Advance Toggle
        const autoToggle = this.container.querySelector('#auto-advance-toggle') as HTMLInputElement;
        autoToggle?.addEventListener('change', () => {
            this.updateToggleStatus('auto-advance-status', autoToggle.checked);
            this.saveSetting('autoAdvance', autoToggle.checked);
            // Show/hide delay slider
            const delayRow = this.container.querySelector('#auto-delay-row') as HTMLElement;
            if (delayRow) delayRow.style.display = autoToggle.checked ? 'flex' : 'none';
        });

        // Auto Delay Slider
        const delaySlider = this.container.querySelector('#auto-delay-slider') as HTMLInputElement;
        delaySlider?.addEventListener('input', () => {
            const value = parseInt(delaySlider.value);
            const valueDisplay = this.container.querySelector('#auto-delay-value');
            if (valueDisplay) valueDisplay.textContent = `${(value / 1000).toFixed(1)}s`;
            this.saveSetting('autoAdvanceDelay', value);
        });

        // Display Mode
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setDisplayMode(target.dataset.mode || 'auto');
            });
        });

        // UI Theme
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setTheme(target.dataset.theme || 'auto');
            });
        });

        // Tether Difficulty
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.setDifficulty(target.dataset.difficulty || 'normal');
            });
        });

        // Fullscreen
        const fsBtn = this.container.querySelector('#settings-fullscreen-btn');
        fsBtn?.addEventListener('click', () => this.toggleFullscreen());

        // Tutorials Toggle
        const tutorialToggle = this.container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
        tutorialToggle?.addEventListener('change', () => {
            this.updateToggleStatus('tutorial-hints-status', tutorialToggle.checked);
            this.saveSetting('tutorialHints', tutorialToggle.checked);
        });

        // Reset Tutorials
        const resetTutorialsBtn = this.container.querySelector('#reset-tutorials-btn');
        resetTutorialsBtn?.addEventListener('click', () => {
            this.saveSetting('tutorialsReset', true);
            alert('Tutorials reset! They will appear again on next playthrough.');
        });

        // Haptic Toggle
        const hapticToggle = this.container.querySelector('#haptic-toggle') as HTMLInputElement;
        hapticToggle?.addEventListener('change', () => {
            this.saveSetting('hapticEnabled', hapticToggle.checked);
        });

        // Comfort Mode Toggle
        const comfortToggle = this.container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
        comfortToggle?.addEventListener('change', () => {
            this.saveSetting('comfortMode', comfortToggle.checked);
        });

        // Reduce Motion Toggle
        const reduceMotionToggle = this.container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
        reduceMotionToggle?.addEventListener('change', () => {
            this.saveSetting('reduceMotion', reduceMotionToggle.checked);
        });

        // Sensory Intensity Slider
        const intensitySlider = this.container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
        intensitySlider?.addEventListener('input', () => {
            const value = parseInt(intensitySlider.value);
            const labels = ['Gentle', 'Normal', 'Amped'];
            const labelEl = this.container.querySelector('#comfort-intensity-label');
            if (labelEl) labelEl.textContent = labels[value] || 'Normal';
            this.saveSetting('sensoryIntensity', value);
        });

        // Reset to Default
        const resetBtn = this.container.querySelector('#btn-settings-reset');
        resetBtn?.addEventListener('click', () => {
            if (confirm('Reset all settings to default?')) {
                localStorage.removeItem('gameSettings');
                this.loadSettings();
                alert('Settings reset to default!');
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
    }

    private switchTab(tabName: string) {
        this.currentTab = tabName;

        // Update buttons
        this.container.querySelectorAll('.settings-tab-btn').forEach(btn => {
            const el = btn as HTMLElement;
            if (el.dataset.tab === tabName) el.classList.add('active');
            else el.classList.remove('active');
        });

        // Update panels
        this.container.querySelectorAll('.tab-panel').forEach(panel => {
            const el = panel as HTMLElement;
            if (el.id === `tab-${tabName}`) el.classList.add('active');
            else el.classList.remove('active');
        });

        // Save active tab
        this.saveSetting('activeTab', tabName);
    }

    private setTextSpeed(speed: string) {
        this.container.querySelectorAll('.speed-btn').forEach(btn => {
            const el = btn as HTMLElement;
            if (el.dataset.speed === speed) el.classList.add('active');
            else el.classList.remove('active');
        });
        this.saveSetting('textSpeed', speed);
    }

    private setDisplayMode(mode: string) {
        this.container.querySelectorAll('.display-mode-btn').forEach(btn => {
            const el = btn as HTMLElement;
            if (el.dataset.mode === mode) el.classList.add('active');
            else el.classList.remove('active');
        });
        this.saveSetting('displayMode', mode);
    }

    private setTheme(theme: string) {
        this.container.querySelectorAll('.theme-pref-btn').forEach(btn => {
            const el = btn as HTMLElement;
            if (el.dataset.theme === theme) el.classList.add('active');
            else el.classList.remove('active');
        });
        this.saveSetting('uiTheme', theme);
    }

    private setDifficulty(difficulty: string) {
        this.container.querySelectorAll('.tether-difficulty-btn').forEach(btn => {
            const el = btn as HTMLElement;
            if (el.dataset.difficulty === difficulty) el.classList.add('active');
            else el.classList.remove('active');
        });
        this.saveSetting('tetherDifficulty', difficulty);
    }

    private toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    private submitSecretCode(code: string) {
        // Emit event for secret code system to handle
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

    private saveSetting(key: string, value: any) {
        // Save to localStorage
        const current = JSON.parse(localStorage.getItem('gameSettings') || '{}');
        current[key] = value;
        localStorage.setItem('gameSettings', JSON.stringify(current));

        this.eventBus.emit('settings:changed', { key, value });
    }

    private loadSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');

        // Apply active tab (persistence)
        if (settings.activeTab) {
            this.currentTab = settings.activeTab;
            this.switchTab(settings.activeTab);
        }

        // Apply text speed
        if (settings.textSpeed) this.setTextSpeed(settings.textSpeed);

        // Apply display mode
        if (settings.displayMode) this.setDisplayMode(settings.displayMode);

        // Apply theme
        if (settings.uiTheme) this.setTheme(settings.uiTheme);

        // Apply difficulty
        if (settings.tetherDifficulty) this.setDifficulty(settings.tetherDifficulty);

        // Apply toggles
        const autoToggle = this.container.querySelector('#auto-advance-toggle') as HTMLInputElement;
        if (autoToggle && settings.autoAdvance !== undefined) {
            autoToggle.checked = settings.autoAdvance;
            this.updateToggleStatus('auto-advance-status', settings.autoAdvance);
            const delayRow = this.container.querySelector('#auto-delay-row') as HTMLElement;
            if (delayRow) delayRow.style.display = settings.autoAdvance ? 'flex' : 'none';
        }

        const tutorialToggle = this.container.querySelector('#tutorial-hints-toggle') as HTMLInputElement;
        if (tutorialToggle && settings.tutorialHints !== undefined) {
            tutorialToggle.checked = settings.tutorialHints;
            this.updateToggleStatus('tutorial-hints-status', settings.tutorialHints);
        }

        const hapticToggle = this.container.querySelector('#haptic-toggle') as HTMLInputElement;
        if (hapticToggle && settings.hapticEnabled !== undefined) {
            hapticToggle.checked = settings.hapticEnabled;
        }

        const comfortToggle = this.container.querySelector('#comfort-mode-toggle') as HTMLInputElement;
        if (comfortToggle && settings.comfortMode !== undefined) {
            comfortToggle.checked = settings.comfortMode;
        }

        const reduceMotionToggle = this.container.querySelector('#reduce-motion-toggle') as HTMLInputElement;
        if (reduceMotionToggle && settings.reduceMotion !== undefined) {
            reduceMotionToggle.checked = settings.reduceMotion;
        }

        // Apply sliders
        const delaySlider = this.container.querySelector('#auto-delay-slider') as HTMLInputElement;
        if (delaySlider && settings.autoAdvanceDelay !== undefined) {
            delaySlider.value = settings.autoAdvanceDelay.toString();
            const valueDisplay = this.container.querySelector('#auto-delay-value');
            if (valueDisplay) valueDisplay.textContent = `${(settings.autoAdvanceDelay / 1000).toFixed(1)}s`;
        }

        const intensitySlider = this.container.querySelector('#comfort-intensity-slider') as HTMLInputElement;
        if (intensitySlider && settings.sensoryIntensity !== undefined) {
            intensitySlider.value = settings.sensoryIntensity.toString();
            const labels = ['Gentle', 'Normal', 'Amped'];
            const labelEl = this.container.querySelector('#comfort-intensity-label');
            if (labelEl) labelEl.textContent = labels[settings.sensoryIntensity] || 'Normal';
        }
    }

    public open() {
        this.isOpen = true;
        this.container.style.display = 'flex';
        // Re-load settings in case they changed externally
        this.loadSettings();
        // Update secret codes UI
        if (window.secretCodesManager) {
            window.secretCodesManager.updateCodesUI();
        }
        console.debug("Settings Active:", this.isOpen, "Tab:", this.currentTab);
    }

    public close(emitEvent: boolean = true) {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.container.style.display = 'none';
        if (emitEvent) {
            this.eventBus.emit('settings:close', {}); // Notify others
        }
    }
}
