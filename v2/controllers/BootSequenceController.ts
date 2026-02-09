
import { EventBus } from '@core/EventBus';
import { GameEngine } from '@core/GameEngine';
import { LoadingOverlay } from '@ui/components/LoadingOverlay';
import { Logger } from '@utils/Logger';

// We need to handle asset imports. In main.ts they were imported directly.
// We can pass them in, or import them here if they are global assets.
// Given V2 structure, importing them here is cleaner for encapsulation.
import logoImg from '../../assets/UnitedVoices7.png';
import introVideo from '../../assets/UnitedVoices7.mp4';

export class BootSequenceController {
    private app: HTMLElement;
    private eventBus: EventBus;
    private gameEngine: GameEngine;

    constructor(eventBus: EventBus, gameEngine: GameEngine) {
        this.eventBus = eventBus;
        this.gameEngine = gameEngine;

        const appElement = document.getElementById('app');
        if (!appElement) throw new Error('App container not found');
        this.app = appElement;
    }

    public async start(): Promise<void> {
        return new Promise(async (resolve) => {
            let wasSkipped = false; // Track if user skipped

            // Creates the FULL V1 structure required by bougie-boot-sequence.css
            const splashContainer = document.createElement('div');
            splashContainer.id = 'uv7-splash';

            // Initialize Loading Overlay (Global)
            new LoadingOverlay('app', this.eventBus);

            // V1 Structure: Container -> Logo Section (img+video) + Terminal
            splashContainer.innerHTML = `
                <div class="uv7-container">
                    <!-- Logo Section -->
                    <div class="uv7-logo-section">
                        <div class="powered-by-text">Powered by</div>
                        
                        <!-- Static Logo Fallback (Hidden by default via CSS) -->
                        <img src="${logoImg}" class="uv7-logo-static" alt="United Voices 7 Logo">
                        
                        <!-- Animated Reveal Video (Width controlled by JS) -->
                        <div class="uv7-logo-wrap loading" id="uv7-logo-wrap">
                            <div class="uv7-logo-reveal" id="uv7-logo-reveal">
                                <video id="uv7-logo-video" class="uv7-logo-video" preload="auto" muted playsinline>
                                    <source src="${introVideo}" type="video/mp4">
                                </video>
                            </div>
                        </div>
                    </div>

                    <!-- Boot Terminal -->
                    <div id="boot-terminal" class="boot-terminal"></div>
                </div>

                <!-- Skip Button -->
                <button id="uv7-skip-button" class="uv7-skip-btn">
                    SKIP <span class="skip-arrow">→</span>
                </button>
                <div class="boot-skip-hint" style="opacity: 0; transition: opacity 2s ease;">PRESS SPACE OR ENTER</div>
            `;

            this.app.appendChild(splashContainer);

            const terminalElement = splashContainer.querySelector('#boot-terminal') as HTMLElement;
            const skipButton = splashContainer.querySelector('#uv7-skip-button') as HTMLElement;
            const skipHint = splashContainer.querySelector('.boot-skip-hint') as HTMLElement;
            const video = splashContainer.querySelector('#uv7-logo-video') as HTMLVideoElement;

            // V2 Polish: Fade in skip hint after 3 seconds
            setTimeout(() => {
                if (skipHint) skipHint.style.opacity = '0.7';
            }, 3000);

            const videoWrap = splashContainer.querySelector('#uv7-logo-wrap') as HTMLElement;
            const videoReveal = splashContainer.querySelector('#uv7-logo-reveal') as HTMLElement;
            const logoSection = splashContainer.querySelector('.uv7-logo-section') as HTMLElement;

            // V1 Video Logic: Freeze frame
            video.onloadeddata = () => {
                // Seek to first frame and pause
                video.currentTime = 0.01;
                video.pause();
            };

            // Fallback if video fails
            video.onerror = () => {
                Logger.warn('Video failed to load, switching to static logo fallback');
                if (logoSection) logoSection.classList.add('fallback-mode');
            };

            video.load();

            // Use the new BougieBootSequence
            // Dynamic import to keep initial bundle size logic (parity with main.ts)
            const { BootSequence } = await import('@ui/components/BootSequence');

            const boot = new BootSequence(
                terminalElement,
                this.gameEngine,
                (percent: number) => {
                    // Video Reveal Logic (Ported from V1)
                    // Update width for Left-to-Right wipe
                    if (videoReveal) {
                        videoReveal.style.width = `${Math.min(100, Math.max(0, percent))}%`;

                        // Update shimmer speed based on progress (V1 polish)
                        if (percent < 70) videoReveal.style.setProperty('--shimmer-speed', '1.5s');
                        else if (percent < 90) videoReveal.style.setProperty('--shimmer-speed', '1.0s');
                        else videoReveal.style.setProperty('--shimmer-speed', '0.6s');
                    }
                }
            );

            // Bind Skip Button
            const handleSkip = () => {
                wasSkipped = true; // Mark as skipped
                boot.skip();
                // On skip, show full video immediately
                if (videoReveal) videoReveal.style.width = '100%';
                if (video) video.currentTime = video.duration;
            };

            skipButton.addEventListener('click', handleSkip);

            // Bind Keyboard Skip
            const keyHandler = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    handleSkip();
                    document.removeEventListener('keydown', keyHandler);
                }
            };
            document.addEventListener('keydown', keyHandler);

            await boot.start();

            // V1 Parity: If skipped, fuck it - bail immediately with code rain
            if (wasSkipped) {
                Logger.ui('🌧️ Boot skipped - triggering immediate code rain transition');

                // Instant removal, no fade
                splashContainer.remove();

                // Trigger code rain BEFORE showing menu (V1 behavior)
                this.eventBus.emit('effect:code_rain', { duration: 1500 });

                // Resolve after code rain would complete
                setTimeout(() => resolve(), 1500);
                return;
            }

            // Normal completion (Boot finished, NOT skipped)
            if (videoWrap) {
                videoWrap.classList.remove('loading');
                videoWrap.classList.add('ready');
            }

            // Play the video animation now that it's fully revealed
            if (video) {
                video.currentTime = 0; // Reset to start
                video.play().catch(() => { });
            }

            // Wait for video animation to be visible before fading out
            await new Promise(r => setTimeout(r, 2000));

            // Fade out splash
            splashContainer.style.opacity = '0';
            splashContainer.style.transition = 'opacity 0.5s ease-out';

            setTimeout(() => {
                splashContainer.remove();
                resolve();
            }, 500);
        });
    }
}
