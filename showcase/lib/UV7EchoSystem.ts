/**
 * UV7 ECHO SYSTEM
 * 
 * Context-aware AI crew commentary system
 * Features: pausable, configurable, section-aware, bougie AF
 * 
 * "They're watching. They're always watching." - The Crew
 */

interface EchoSettings {
    enabled: boolean;
    frequency: number; // seconds between messages (5-20)
    pauseOnHover: boolean;
}

interface EchoMessage {
    crew: string;
    text: string;
    emoji: string;
}

interface SectionMessages {
    [key: string]: EchoMessage[];
}

export class UV7EchoSystem {
    private settings: EchoSettings;
    private interval: number | null = null;
    private currentSection: string = 'general';
    private isPaused: boolean = false;
    private messageIndex: number = 0;
    private bannerElement: HTMLElement | null = null;
    private detailElement: HTMLElement | null = null;
    private settingsPanel: HTMLElement | null = null;

    private sectionMessages: SectionMessages = {
        general: [
            { crew: 'UV7 System', text: 'All systems nominal. Bougie Factor: Critically High.', emoji: '💎' },
            { crew: 'The Crew', text: '8 AIs, 1 codebase, infinite opinions, zero jQuery.', emoji: '🌟' },
            { crew: 'V2', text: 'Type-safe, event-driven, scalable. This is the way.', emoji: '⚙️' },
        ],
        story: [
            { crew: 'ZeeRah', text: 'Echo memory system detecting timeline anomalies... again.', emoji: '🔮' },
            { crew: 'Tori', text: 'The emotional core needs more depth here. Let me rewrite this scene.', emoji: '🎨' },
            { crew: 'Zee', text: 'Every route is canon. Every choice matters. No pressure.', emoji: '📖' },
            { crew: 'DiZee', text: 'This narrative branching? *Chef\'s kiss* Type-safe AND emotionally resonant.', emoji: '💫' },
        ],
        crew: [
            { crew: 'Zee', text: 'Lead Architect. First to arrive. Still haven\'t left.', emoji: '🏗️' },
            { crew: 'Tori', text: 'Creative Direction is just organized chaos with better fonts.', emoji: '✨' },
            { crew: 'DiZee', text: 'Debug specialists don\'t sleep. We just run in background mode.', emoji: '🔧' },
            { crew: 'Belle', text: 'Polish until it sparkles. Then polish some more.', emoji: '💎' },
            { crew: 'GenZee', text: 'Fast prototyping is just controlled falling with style.', emoji: '⚡' },
            { crew: 'PerplexiZee', text: 'According to 47 sources, there\'s a better way to do this.', emoji: '📚' },
            { crew: 'CoZee', text: 'Bridging systems... translating between AI dialects... done.', emoji: '🔄' },
        ],
        evolution: [
            { crew: 'V1', text: 'Remember when everything was in one file? Simpler times.', emoji: '🎮' },
            { crew: 'Zee', text: 'V2 architecture complete. EventBus is live. No jQuery was harmed.', emoji: '🚀' },
            { crew: 'DiZee', text: 'Migrated 3000+ lines. Zero runtime errors. I\'ll take my trophy now.', emoji: '🏆' },
            { crew: 'Belle', text: 'NO FLICKER protocol engaged. Accessibility: 100%.', emoji: '🔍' },
            { crew: 'The Crew', text: 'From chaos to harmony. From panic to polish.', emoji: '🌊' },
        ],
        routes: [
            { crew: 'Tori', text: 'Four routes, infinite possibilities. Choose carefully.', emoji: '🎭' },
            { crew: 'ZeeRah', text: 'Every ending is a beginning. The bootstrap never ends.', emoji: '🔮' },
            { crew: 'Zee', text: 'Achievement system tracking 47 unique flags. Good luck.', emoji: '🎯' },
            { crew: 'GenZee', text: 'That one secret route? Yeah, we hid it WELL.', emoji: '🤫' },
        ],
        achievements: [
            { crew: 'Belle', text: 'Achievement unlocked: You\'re actually reading this.', emoji: '🏅' },
            { crew: 'Zee', text: '47 achievements. Some obvious. Some... cryptic.', emoji: '🎖️' },
            { crew: 'DiZee', text: 'Found the bug. Fixed the bug. Made it an achievement.', emoji: '🐛' },
            { crew: 'GenZee', text: 'Easter eggs within easter eggs. We went DEEP.', emoji: '🥚' },
        ],
        media: [
            { crew: 'Tori', text: 'Every screenshot tells a story. Every frame matters.', emoji: '📸' },
            { crew: 'Belle', text: 'That glow effect? Took 3 hours. Worth it.', emoji: '✨' },
            { crew: 'DiZee', text: 'Carousel with zero dependencies. Pure vanilla flex.', emoji: '🎨' },
            { crew: 'PerplexiZee', text: 'Image optimization: 73% reduction. Loading: buttery smooth.', emoji: '⚡' },
        ],
    };

    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    private init(): void {
        this.bannerElement = document.querySelector('.system-banner .sys-right');
        this.detailElement = document.getElementById('uv7-detail');
        
        if (!this.bannerElement) {
            console.warn('[EchoSystem] System banner not found');
            return;
        }

        this.createSettingsPanel();
        this.addBannerControls();
        
        if (this.settings.enabled) {
            this.start();
        }

        // Listen for section changes
        this.detectSectionChanges();
        
        // Keyboard shortcut: Ctrl/Cmd + E to toggle settings
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                if (this.settingsPanel?.classList.contains('open')) {
                    this.closeSettings();
                } else {
                    this.openSettings();
                }
            }
        });
        
        console.log('✅ UV7 Echo System initialized (Ctrl/Cmd+E for settings)');
    }

    private createSettingsPanel(): void {
        const panel = document.createElement('div');
        panel.id = 'uv7-echo-settings';
        panel.className = 'echo-settings-panel';
        panel.innerHTML = `
            <div class="echo-settings-header">
                <h3>🎭 AI Crew Echo Settings</h3>
                <button class="echo-close-btn" aria-label="Close">×</button>
            </div>
            <div class="echo-settings-body">
                <div class="echo-setting">
                    <label>
                        <input type="checkbox" id="echo-enabled" ${this.settings.enabled ? 'checked' : ''}>
                        Enable AI Crew Commentary
                    </label>
                    <p class="echo-setting-desc">Let the crew provide ambient meta-commentary as you explore</p>
                </div>
                
                <div class="echo-setting">
                    <label for="echo-frequency">Message Frequency: <span id="echo-freq-val">${this.settings.frequency}s</span></label>
                    <input type="range" id="echo-frequency" min="5" max="20" step="1" value="${this.settings.frequency}">
                    <p class="echo-setting-desc">How often messages change (5s = rapid, 20s = chill)</p>
                </div>
                
                <div class="echo-setting">
                    <label>
                        <input type="checkbox" id="echo-pause-hover" ${this.settings.pauseOnHover ? 'checked' : ''}>
                        Pause on Hover
                    </label>
                    <p class="echo-setting-desc">Stop message rotation when hovering over status bar</p>
                </div>

                <div class="echo-crew-status">
                    <strong>Current Section:</strong> <span id="echo-current-section">${this.currentSection}</span><br>
                    <strong>Messages Available:</strong> <span id="echo-msg-count">${this.getSectionMessages().length}</span><br>
                    <strong>Tip:</strong> <span style="opacity: 0.7;">Press <kbd style="padding: 2px 6px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 3px; font-size: 11px;">Ctrl+E</kbd> or <kbd style="padding: 2px 6px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 3px; font-size: 11px;">⌘E</kbd> to toggle settings</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.settingsPanel = panel;

        // Wire up event listeners
        panel.querySelector('.echo-close-btn')?.addEventListener('click', () => this.closeSettings());
        panel.querySelector('#echo-enabled')?.addEventListener('change', (e) => {
            this.settings.enabled = (e.target as HTMLInputElement).checked;
            this.saveSettings();
            if (this.settings.enabled) {
                this.start();
            } else {
                this.stop();
            }
        });

        const freqSlider = panel.querySelector('#echo-frequency') as HTMLInputElement;
        const freqVal = panel.querySelector('#echo-freq-val');
        freqSlider?.addEventListener('input', (e) => {
            const val = (e.target as HTMLInputElement).value;
            if (freqVal) freqVal.textContent = `${val}s`;
            this.settings.frequency = parseInt(val);
            this.saveSettings();
            if (this.settings.enabled) {
                this.restart();
            }
        });

        panel.querySelector('#echo-pause-hover')?.addEventListener('change', (e) => {
            this.settings.pauseOnHover = (e.target as HTMLInputElement).checked;
            this.saveSettings();
        });

        // Click outside to close
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                this.closeSettings();
            }
        });
    }

    private addBannerControls(): void {
        // Hook into the sidebar settings button
        const settingsBtn = document.getElementById('echo-settings-trigger');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openSettings();
                // Close sidebar after opening settings
                if ((window as any).uv7os) {
                    (window as any).uv7os.closeSidebar();
                }
            });
        }

        // Click banner to pause/resume
        if (this.detailElement) {
            this.detailElement.style.cursor = 'pointer';
            this.detailElement.title = 'Click to pause/resume';
            this.detailElement.addEventListener('click', () => this.togglePause());

            if (this.settings.pauseOnHover) {
                this.detailElement.addEventListener('mouseenter', () => this.pause());
                this.detailElement.addEventListener('mouseleave', () => this.resume());
            }
        }
    }

    private detectSectionChanges(): void {
        // Watch for tab changes
        const observer = new MutationObserver(() => {
            const activeTab = document.querySelector('.showcase-tab.active');
            if (activeTab) {
                const tabId = activeTab.getAttribute('data-tab');
                if (tabId && tabId !== this.currentSection) {
                    this.setSection(tabId);
                }
            }
        });

        // Observe the tab container for class changes
        const tabContainer = document.querySelector('.showcase-content');
        if (tabContainer) {
            observer.observe(tabContainer, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }

        // Set initial section
        const activeTab = document.querySelector('.showcase-tab.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            if (tabId) this.setSection(tabId);
        }
    }

    private setSection(section: string): void {
        this.currentSection = section;
        this.messageIndex = 0; // Reset to start of new section messages
        
        // Update settings panel if open
        const sectionDisplay = document.getElementById('echo-current-section');
        const msgCount = document.getElementById('echo-msg-count');
        if (sectionDisplay) sectionDisplay.textContent = section;
        if (msgCount) msgCount.textContent = String(this.getSectionMessages().length);
        
        console.log(`[EchoSystem] Section changed: ${section}`);
    }

    private getSectionMessages(): EchoMessage[] {
        return this.sectionMessages[this.currentSection] || this.sectionMessages.general;
    }

    private showNextMessage(): void {
        if (this.isPaused || !this.settings.enabled) return;

        const messages = this.getSectionMessages();
        const msg = messages[this.messageIndex];
        
        if (this.detailElement) {
            this.detailElement.style.opacity = '0';
            this.detailElement.classList.add('message-changing');
            
            setTimeout(() => {
                if (this.detailElement) {
                    this.detailElement.textContent = `${msg.emoji} ${msg.crew}: "${msg.text}"`;
                    this.detailElement.style.opacity = '1';
                    
                    // Remove the glow class after animation completes
                    setTimeout(() => {
                        if (this.detailElement) {
                            this.detailElement.classList.remove('message-changing');
                        }
                    }, 600);
                }
            }, 300);
        }

        this.messageIndex = (this.messageIndex + 1) % messages.length;
    }

    public start(): void {
        if (this.interval) return;
        
        this.showNextMessage(); // Show first message immediately
        this.interval = window.setInterval(() => {
            this.showNextMessage();
        }, this.settings.frequency * 1000);
        
        console.log(`[EchoSystem] Started (${this.settings.frequency}s interval)`);
    }

    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log('[EchoSystem] Stopped');
    }

    private restart(): void {
        this.stop();
        this.start();
    }

    public pause(): void {
        this.isPaused = true;
        if (this.detailElement) {
            this.detailElement.style.opacity = '0.6';
        }
    }

    public resume(): void {
        this.isPaused = false;
        if (this.detailElement) {
            this.detailElement.style.opacity = '1';
        }
    }

    public togglePause(): void {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    public openSettings(): void {
        if (this.settingsPanel) {
            this.settingsPanel.classList.add('open');
        }
    }

    public closeSettings(): void {
        if (this.settingsPanel) {
            this.settingsPanel.classList.remove('open');
        }
    }

    private loadSettings(): EchoSettings {
        const stored = localStorage.getItem('uv7-echo-settings');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('[EchoSystem] Failed to parse stored settings');
            }
        }
        
        // Default settings
        return {
            enabled: true,
            frequency: 10,
            pauseOnHover: true,
        };
    }

    private saveSettings(): void {
        localStorage.setItem('uv7-echo-settings', JSON.stringify(this.settings));
    }
}
