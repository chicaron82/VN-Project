// ========================================
// DIZEE POLISH: MOBILE UX ENHANCEMENTS
// ========================================

class MobileUXManager {
    constructor(game) {
        this.game = game;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50; // Minimum distance for swipe
        this.lastTap = 0; // For double-tap detection

        this.init();
    }

    init() {
        // Add swipe gesture for advancing dialogue
        this.setupSwipeGestures();

        // Add scroll indicators to internal thought bubbles
        this.setupScrollIndicators();

        // Add double-tap to toggle fullscreen
        this.setupDoubleTap();
    }

    setupSwipeGestures() {
        const gameView = document.getElementById('game-view');
        if (!gameView) return;

        gameView.addEventListener('touchstart', (e) => {
            // Don't interfere with UI elements
            if (e.target.closest('button') || e.target.closest('.choice-button')) {
                return;
            }

            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        gameView.addEventListener('touchend', (e) => {
            // Don't interfere with UI elements
            if (e.target.closest('button') || e.target.closest('.choice-button')) {
                return;
            }

            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;

            this.handleSwipe();
        }, { passive: true });
    }

    setupDoubleTap() {
        // Listen on both game-view and scene-background for double-tap
        const targets = [
            document.getElementById('game-view'),
            document.getElementById('scene-background')
        ].filter(el => el); // Filter out nulls

        targets.forEach(target => {
            target.addEventListener('touchend', (e) => {
                // Check for double tap
                const currentTime = new Date().getTime();
                const tapLength = currentTime - this.lastTap;

                // Double tap detected (within 300ms)
                if (tapLength < 300 && tapLength > 0) {
                    // Don't trigger if tapping critical UI
                    if (!e.target.closest('button') && !e.target.closest('.choice-button')) {
                        this.toggleFullscreen();
                        e.preventDefault(); // Prevent zoom
                    }
                }

                this.lastTap = currentTime;
            });
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // Check if it's more horizontal than vertical
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
            return; // Vertical swipe, ignore
        }

        // Check if swipe distance is sufficient
        if (Math.abs(deltaX) < this.minSwipeDistance) {
            return; // Too short
        }

        // Left swipe = advance dialogue
        if (deltaX < 0) {
            // Trigger the same action as clicking/spacebar
            if (this.game && this.game.handleInput) {
                this.game.handleInput('CONFIRM');
            }
        }
    }

    setupScrollIndicators() {
        // Use MutationObserver to detect when internal thought bubbles are created
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('internal-bubble')) {
                        this.addScrollIndicator(node);
                    }
                });
            });
        });

        const gameView = document.getElementById('game-view');
        if (gameView) {
            observer.observe(gameView, { childList: true, subtree: true });
        }
    }

    addScrollIndicator(bubble) {
        // Check if content is scrollable
        const checkScrollable = () => {
            if (bubble.scrollHeight > bubble.clientHeight) {
                bubble.classList.add('has-scroll');

                // Add scroll indicator if not already present
                if (!bubble.querySelector('.scroll-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'scroll-indicator';
                    indicator.innerHTML = '↓';
                    bubble.appendChild(indicator);

                    // Hide indicator when scrolled to bottom
                    bubble.addEventListener('scroll', () => {
                        const isAtBottom = bubble.scrollHeight - bubble.scrollTop <= bubble.clientHeight + 5;
                        indicator.style.opacity = isAtBottom ? '0' : '1';
                    });
                }
            }
        };

        // Check after content is rendered
        setTimeout(checkScrollable, 100);
    }
}

// Initialize when game engine is ready
if (typeof window !== 'undefined') {
    window.MobileUXManager = MobileUXManager;
    window.addEventListener('DOMContentLoaded', () => {
        const checkGame = setInterval(() => {
            if (window.game) {
                window.mobileUXManager = new MobileUXManager(window.game);
                clearInterval(checkGame);
            }
        }, 100);
    });
}

// ES Module export
export { MobileUXManager };
