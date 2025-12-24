// ========================================
// EFFECTS CONTROLLER
// Matrix rain transitions and loop init effects
// Extracted from GameEngine - Session 74
// ========================================

/**
 * EffectsController
 * 
 * Handles all visual transition effects:
 * - Loop init screen (version increment display)
 * - Matrix code rain animation
 * - Code rain scene transitions
 * 
 * @class EffectsController
 */
class EffectsController {
    constructor(game) {
        this.game = game;
        this.matrixInterval = null;
        this.transitionRainInterval = null;
        this.loopInitCallback = null;
    }

    // ========================================
    // LOOP INIT SCREEN
    // Version increment display with Matrix rain
    // ========================================

    showLoopInit(callback, currentRoute = null) {
        const loopInitScreen = document.getElementById('loop-init-screen');
        const prevVersionEl = document.getElementById('loop-prev-version');
        const newVersionEl = document.getElementById('loop-new-version');
        const skipButton = document.getElementById('loop-skip-button');
        const continueText = document.querySelector('.loop-init-continue');
        const routeSelection = document.getElementById('loop-route-selection');

        if (!loopInitScreen) {
            console.error('Loop init screen not found');
            if (callback) callback();
            return;
        }

        // Use current version as "previous failed"
        const prevVersion = this.game.loopVersion - 1;
        const newVersion = this.game.loopVersion;

        // Update text
        if (prevVersionEl) prevVersionEl.textContent = prevVersion;
        if (newVersionEl) newVersionEl.textContent = newVersion;

        // Check if player has seen this before
        const loopInitSeen = localStorage.getItem('loopInitSeen') === 'true';

        // Show skip button only if seen before
        if (skipButton) {
            skipButton.style.display = loopInitSeen ? 'inline-block' : 'none';
        }

        // Mark as seen for future runs
        localStorage.setItem('loopInitSeen', 'true');

        // Show screen
        loopInitScreen.style.display = 'flex';

        // Start Matrix code rain
        this.startMatrixRain();

        // Haptic feedback
        if (this.game.triggerSensoryFeedback) {
            setTimeout(() => {
                this.game.triggerSensoryFeedback('denied', null, 'Loop failed');
            }, 200);
            setTimeout(() => {
                this.game.triggerSensoryFeedback('buttonPress', null, 'New loop initializing');
            }, 1500);
        }

        // DIZEE: Show route selection after a delay
        setTimeout(() => {
            // Hide continue text and skip button
            if (continueText) continueText.style.display = 'none';
            if (skipButton) skipButton.style.display = 'none';

            // Show route selection
            if (routeSelection) {
                routeSelection.style.display = 'block';

                // Setup route options
                this.setupRouteSelection(currentRoute, callback);
            }
        }, 2000); // Show route selection after 2 seconds

        console.log(`Loop init screen shown: v${prevVersion} → v${newVersion}`);
    }

    setupRouteSelection(currentRoute, callback) {
        const routeOptions = document.querySelectorAll('.loop-route-option');
        const backToMenuBtn = document.getElementById('loop-back-to-menu');
        let focusedIndex = 0;

        // Determine current route (default to ronnie if not specified)
        const activeRoute = currentRoute || 'ronnie';

        // Highlight current route and set initial focus
        routeOptions.forEach((option, index) => {
            const route = option.dataset.route;

            if (route === activeRoute) {
                option.classList.add('current-route');
                focusedIndex = index;
                option.focus();
            } else {
                option.classList.remove('current-route');
            }

            // Click handler
            option.onclick = () => {
                this.selectRoute(route, callback);
            };

            // Enter key handler
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectRoute(route, callback);
                }
            });
        });

        // Keyboard navigation
        const keyHandler = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();

                // Toggle between routes
                focusedIndex = focusedIndex === 0 ? 1 : 0;
                routeOptions[focusedIndex].focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.backToMenu();
            }
        };

        document.addEventListener('keydown', keyHandler);

        // Store handler for cleanup
        this.routeSelectionKeyHandler = keyHandler;

        // Back to menu button
        if (backToMenuBtn) {
            backToMenuBtn.onclick = () => {
                this.backToMenu();
            };
        }

        console.log(`🎮 Route selection ready. Current route: ${activeRoute}`);
    }

    selectRoute(route, callback) {
        console.log(`🎮 Player selected route: ${route}`);

        // Cleanup keyboard handler
        if (this.routeSelectionKeyHandler) {
            document.removeEventListener('keydown', this.routeSelectionKeyHandler);
            this.routeSelectionKeyHandler = null;
        }

        // Close loop init
        this.closeLoopInit();

        // Start the selected route directly (skip prologue)
        setTimeout(() => {
            this.game.startRoute(route);
        }, 300);
    }

    backToMenu() {
        console.log('🏠 Player chose: Back to Menu');

        // Cleanup keyboard handler
        if (this.routeSelectionKeyHandler) {
            document.removeEventListener('keydown', this.routeSelectionKeyHandler);
            this.routeSelectionKeyHandler = null;
        }

        // Close loop init
        this.closeLoopInit();

        // Show main menu
        setTimeout(() => {
            this.game.showMainMenu();
        }, 300);
    }

    // DIZEE GLOW-UP: Matrix code rain effect
    startMatrixRain() {
        const canvas = document.getElementById('loop-init-matrix');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // THEME INTEGRATION: Use active theme color for code rain 💚
            const theme = ThemeManager.getTheme();
            ctx.fillStyle = theme.primary;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.matrixInterval = setInterval(draw, 33);
    }

    skipLoopInit() {
        // Immediate skip - no animation
        this.closeLoopInit();
    }

    closeLoopInit() {
        const loopInitScreen = document.getElementById('loop-init-screen');
        if (loopInitScreen) {
            loopInitScreen.style.display = 'none';
        }

        // DIZEE GLOW-UP: Stop Matrix code rain
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
        }

        // Execute callback if exists
        if (this.loopInitCallback) {
            this.loopInitCallback();
            this.loopInitCallback = null;
        }
    }

    // ========================================
    // DIZEE: CODE RAIN TRANSITIONS
    // Cyan Matrix rain for scene transitions
    // ========================================

    showCodeRainTransition(callback, duration = 1500) {
        // Create or get overlay canvas
        let canvas = document.getElementById('transition-matrix');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'transition-matrix';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 100000;
                opacity: 0;
                transition: opacity 300ms ease;
                pointer-events: none;
            `;
            document.body.appendChild(canvas);
        }

        // DIZEE: Ensure canvas fills screen (fixes portrait mode issue) 💚
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start rain
        this.startTransitionRain(canvas);

        // DIZEE: Start at full opacity (instant cover) 💚
        canvas.style.opacity = '1';

        // DIZEE: Execute callback immediately (loads next screen underneath rain) 💚
        // Rain is already covering screen, so transition is seamless
        setTimeout(() => {
            if (callback) callback();
        }, 100); // Small delay to ensure rain is rendering

        // Fade out after holding (next screen is already loaded underneath)
        setTimeout(() => {
            canvas.style.opacity = '0';

            setTimeout(() => {
                this.stopTransitionRain();
            }, 300); // Wait for fade out
        }, duration - 300);
    }

    startTransitionRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ZEEZEERAHDIZEECOZEEBELLEPEASYGENZEETORICHICHARONUV7848'; // DIZEE: UV7 Crew names in the code rain 💚
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // DIZEE: Faster drop speed on portrait to fill screen in time 💚
        const isPortrait = canvas.height > canvas.width;
        const dropSpeed = isPortrait ? 3 : 2; // 3x speed on portrait, 2x on landscape

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // THEME INTEGRATION: Use active theme color for code rain 💚
            const theme = ThemeManager.getTheme();
            ctx.fillStyle = theme.primary;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += dropSpeed; // Use variable speed
            }
        };

        this.transitionRainInterval = setInterval(draw, 33);
    }

    stopTransitionRain() {
        if (this.transitionRainInterval) {
            clearInterval(this.transitionRainInterval);
            this.transitionRainInterval = null;
        }

        // Clean up canvas after a delay
        setTimeout(() => {
            const canvas = document.getElementById('transition-matrix');
            if (canvas && canvas.style.opacity === '0') {
                canvas.remove();
            }
        }, 500);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.EffectsController = EffectsController;
}

// ES Module export
export { EffectsController };
