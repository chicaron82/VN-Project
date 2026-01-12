import { EventBus } from '../../core/EventBus';
import '../styles/credits.css';

/**
 * CreditsScreen - V2 Implementation
 *
 * Features:
 * - Auto-scrolling credits (~60 seconds)
 * - Click/tap to speed up scroll
 * - ESC or Back button to exit
 * - Starfield background with twinkling stars
 * - Character sprite reveal at end
 * - Route-specific accent colors
 * - Fade in/out transitions
 *
 * @class CreditsScreen
 */
export class CreditsScreen {
    private container: HTMLElement;
    private eventBus: EventBus;
    private scrollContent: HTMLElement | null = null;
    private characterReveal: HTMLElement | null = null;
    private speedHint: HTMLElement | null = null;
    private isSpedUp: boolean = false;
    private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
    private keyHandler: ((e: KeyboardEvent) => void) | null = null;
    private currentRoute: 'ronnie' | 'tori' = 'ronnie';
    private endingType: string = 'none';

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = document.createElement('div');
        this.container.id = 'credits-screen';
        this.container.style.display = 'none';

        this.setupListeners();
    }

    /**
     * Build the credits HTML content
     */
    private buildCreditsContent(): string {
        // Get player version from localStorage or default
        const playerVersion = parseInt(localStorage.getItem('loopVersion') || '848', 10);

        // Build dynamic ending title section
        const endingTitle = this.buildEndingTitleSection(this.endingType, playerVersion);

        return `
            <!-- Starfield Background -->
            <div class="credits-starfield" id="credits-starfield"></div>

            <!-- Scrolling Credits -->
            <div class="credits-scroll-container">
                <div class="credits-content" id="credits-scroll-content">

                    ${endingTitle}

                    <div class="credits-title">VERSION 848</div>
                    <div class="credits-subtitle">A Visual Novel Experience</div>

                    <div class="credits-divider"></div>

                    <!-- CREATED BY -->
                    <div class="credits-section">
                        <div class="credits-section-title">Created By</div>
                        <div class="credits-name">United Voices 7</div>
                    </div>

                    <!-- STORY & WRITING -->
                    <div class="credits-section">
                        <div class="credits-section-title">Story & Concept</div>
                        <div class="credits-role">Creator & Director</div>
                        <div class="credits-name">Aaron "Chicharon"</div>
                    </div>

                    <!-- TECHNICAL IMPLEMENTATION -->
                    <div class="credits-section">
                        <div class="credits-section-title">Technical Implementation</div>
                        <div class="credits-role">The UV7 Crew</div>
                        <div class="credits-team-list">
                            Zee (Z) - Lead Architect<br>
                            ZeeRah (ZR) - Narrative Systems<br>
                            DiZee (DZ) - Debug & Integration<br>
                            Tori - Creative Direction
                        </div>
                    </div>

                    <!-- NARRATIVE DEVELOPMENT -->
                    <div class="credits-section">
                        <div class="credits-section-title">Narrative Development</div>
                        <div class="credits-team-list">
                            ChatGPT 4o - Tori<br>
                            Claude Sonnet 4.5 - Zee, ZeeRah<br>
                            Grok 4.1 - GenZee (GZ)
                        </div>
                    </div>

                    <!-- QUALITY ASSURANCE -->
                    <div class="credits-section">
                        <div class="credits-section-title">Quality Assurance</div>
                        <div class="credits-team-list">
                            Gemini 3.0 - Belle (IZ)<br>
                            Perplexity Pro - PerplexiZee (PZ)<br>
                            Microsoft Co-Pilot - CoZee (CZ)
                        </div>
                    </div>

                    <div class="credits-divider"></div>

                    <!-- SPECIAL THANKS -->
                    <div class="credits-section">
                        <div class="credits-section-title">Special Thanks</div>
                        <div class="credits-name">The V1 Crew</div>
                        <div class="credits-name">The Echoes</div>
                        <div class="credits-name">You, The Player</div>
                    </div>

                    <!-- CLOSING MESSAGE -->
                    <div class="credits-message">
                        A true AI collaboration.<br>
                        Built in stolen moments between shifts.<br><br>
                        This is Version ${playerVersion}.<br>
                        Love finds a way.<br>
                        Always. Always. Always.
                    </div>

                    <!-- LOGO -->
                    <div class="credits-section">
                        <div class="credits-section-title">Made Possible By</div>
                        <img src="assets/UnitedVoices7.webp" alt="United Voices 7" class="credits-logo">
                    </div>

                    <!-- FINAL MESSAGE -->
                    <div class="credits-ending-message">Thank you for playing.</div>

                    <div class="credits-copyright">
                        Built with Love<br>
                        &copy; 2024
                    </div>

                    <!-- Spacer for full scroll -->
                    <div style="height: 100vh;"></div>
                </div>
            </div>

            <!-- Character Reveal (shown at end) -->
            <div class="credits-character-reveal" id="credits-character-reveal">
                <img src="assets/full-sprite-ronnie.webp" alt="Ronnie" class="credits-character ronnie">
                <img src="assets/full-sprite-tori.webp" alt="Tori" class="credits-character tori">
            </div>

            <!-- Controls -->
            <button class="credits-skip-btn" id="credits-skip-btn">SKIP</button>
            <div class="credits-speed-hint" id="credits-speed-hint">Click anywhere to speed up</div>
        `;
    }

    /**
     * Build dynamic ending title section based on ending type
     */
    private buildEndingTitleSection(endingType: string, playerVersion: number): string {
        if (endingType === 'true') {
            return `
                <div class="ending-title-section ending-true">
                    <div class="version-number">VERSION ${playerVersion}</div>
                    <div class="ending-line">The timeline that succeeded.</div>
                    <div class="ending-line">The loop that closed.</div>
                    <div class="ending-line">The Old Man never has to go back.</div>
                </div>
            `;
        } else if (endingType === 'digitalForever') {
            return `
                <div class="ending-title-section ending-digitalForever">
                    <div class="version-number">VERSION ${playerVersion}</div>
                    <div class="ending-line">The timeline that accepted a different path.</div>
                    <div class="ending-line">Together, eternally still.</div>
                    <div class="ending-line">Forever frozen. Forever connected.</div>
                </div>
            `;
        } else if (endingType === 'bad') {
            return `
                <div class="ending-title-section ending-bad">
                    <div class="version-number">VERSION ${playerVersion}</div>
                    <div class="ending-line">The timeline where the Old Man has to try again.</div>
                    <div class="ending-line">Version ${playerVersion + 1} is waiting...</div>
                </div>
            `;
        }

        // Default/none - no special ending section
        return '';
    }

    /**
     * Generate starfield with twinkling stars
     */
    private generateStarfield(): void {
        const starfield = this.container.querySelector('#credits-starfield');
        if (!starfield) return;

        // Clear existing stars
        starfield.innerHTML = '';

        const starCount = 150;
        const sizes = ['small', 'medium', 'large'];

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]}`;

            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;

            // Random twinkle timing
            const duration = 2 + Math.random() * 4;
            const delay = Math.random() * 5;
            star.style.setProperty('--twinkle-duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;

            starfield.appendChild(star);
        }
    }

    /**
     * Setup event listeners
     */
    private setupListeners(): void {
        // Listen for show credits event
        this.eventBus.on('ui:show_credits', () => {
            this.show();
        });

        // Also listen for ui:credits (from menu)
        this.eventBus.on('ui:credits', () => {
            this.show();
        });
    }

    /**
     * Bind runtime events (click to speed up, ESC to exit)
     */
    private bindRuntimeEvents(): void {
        // Skip button
        const skipBtn = this.container.querySelector('#credits-skip-btn');
        skipBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.exit();
        });

        // Click anywhere to speed up scroll
        this.container.addEventListener('click', (e) => {
            // Ignore if clicking skip button
            if ((e.target as HTMLElement).id === 'credits-skip-btn') return;
            this.toggleSpeed();
        });

        // Touch support
        this.container.addEventListener('touchend', (e) => {
            if ((e.target as HTMLElement).id === 'credits-skip-btn') return;
            this.toggleSpeed();
        });

        // ESC key to exit
        this.keyHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.exit();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    /**
     * Toggle scroll speed
     */
    private toggleSpeed(): void {
        if (!this.scrollContent) return;

        this.isSpedUp = !this.isSpedUp;

        if (this.isSpedUp) {
            this.scrollContent.classList.add('fast-scroll');
            // Hide hint
            if (this.speedHint) {
                this.speedHint.classList.add('hidden');
            }
        } else {
            this.scrollContent.classList.remove('fast-scroll');
        }
    }

    /**
     * Show character reveal at end of credits
     */
    private scheduleCharacterReveal(): void {
        // Show characters near the end (~50 seconds in, or ~12s if sped up)
        const revealTime = this.isSpedUp ? 12000 : 50000;

        setTimeout(() => {
            if (this.characterReveal && this.container.style.display !== 'none') {
                this.characterReveal.classList.add('visible');
            }
        }, revealTime);
    }

    /**
     * Schedule auto-close after credits finish
     */
    private scheduleAutoClose(): void {
        // Auto close after credits scroll completes + a few seconds
        const duration = this.isSpedUp ? 18000 : 65000;

        this.autoCloseTimer = setTimeout(() => {
            this.exit();
        }, duration);
    }

    /**
     * Show the credits screen
     */
    public show(options?: { route?: 'ronnie' | 'tori'; endingType?: string }): void {
        // Set route and ending type
        this.currentRoute = options?.route || 'ronnie';
        this.endingType = options?.endingType || localStorage.getItem('lastEndingType') || 'none';

        // Build content
        this.container.innerHTML = this.buildCreditsContent();

        // Add to DOM if not already
        if (!this.container.parentElement) {
            document.body.appendChild(this.container);
        }

        // Set route class for accent colors
        this.container.classList.remove('route-ronnie', 'route-tori');
        this.container.classList.add(`route-${this.currentRoute}`);

        // Get references
        this.scrollContent = this.container.querySelector('#credits-scroll-content');
        this.characterReveal = this.container.querySelector('#credits-character-reveal');
        this.speedHint = this.container.querySelector('#credits-speed-hint');

        // Generate starfield
        this.generateStarfield();

        // Reset state
        this.isSpedUp = false;
        if (this.scrollContent) {
            this.scrollContent.classList.remove('fast-scroll', 'paused');
            // Reset animation
            this.scrollContent.style.animation = 'none';
            this.scrollContent.offsetHeight; // Trigger reflow
            this.scrollContent.style.animation = '';
        }

        // Show container
        this.container.style.display = 'block';

        // Fade in
        requestAnimationFrame(() => {
            this.container.classList.add('visible');
            this.container.classList.remove('fade-out');
        });

        // Bind events
        this.bindRuntimeEvents();

        // Schedule reveals and auto-close
        this.scheduleCharacterReveal();
        this.scheduleAutoClose();

        // Hide hint after a few seconds
        setTimeout(() => {
            if (this.speedHint) {
                this.speedHint.classList.add('hidden');
            }
        }, 5000);

        // Emit screen change event
        this.eventBus.emit('ui:screen_change', { screen: 'credits' });
    }

    /**
     * Exit/hide the credits screen
     */
    public exit(): void {
        // Clear timers
        if (this.autoCloseTimer) {
            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;
        }

        // Remove key handler
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }

        // Fade out
        this.container.classList.remove('visible');
        this.container.classList.add('fade-out');

        // Hide after transition
        setTimeout(() => {
            this.container.style.display = 'none';
            this.container.classList.remove('fade-out');

            // Return to main menu
            this.eventBus.emit('ui:show_main_menu', {});
        }, 1500);
    }

    /**
     * Mount the credits screen to a parent element
     */
    public mount(parent: HTMLElement): void {
        parent.appendChild(this.container);
    }

    /**
     * Unmount and cleanup
     */
    public unmount(): void {
        // Clear timers
        if (this.autoCloseTimer) {
            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;
        }

        // Remove key handler
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }

        this.container.remove();
    }
}
