/**
 * SpotlightTracker - Tracks user interactions and triggers easter eggs
 * Implements the "Remembered" achievement when all cards are viewed
 */
class SpotlightTracker {
    constructor() {
        this.storageKey = 'uv7_spotlight_views';
        this.achievementKey = 'uv7_remembered_unlocked';
        this.viewedCards = this.loadViewedCards();
        this.totalCards = 10;

        this.init();
    }

    init() {
        // Check if achievement was already unlocked
        if (this.isAchievementUnlocked()) {
            console.log('🧠 "Remembered" achievement already unlocked');
        }
    }

    loadViewedCards() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to load viewed cards from localStorage:', e);
            return [];
        }
    }

    saveViewedCards() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.viewedCards));
        } catch (e) {
            console.warn('Failed to save viewed cards to localStorage:', e);
        }
    }

    markCardViewed(cardIndex) {
        if (!this.viewedCards.includes(cardIndex)) {
            this.viewedCards.push(cardIndex);
            this.saveViewedCards();

            console.log(`Card ${cardIndex + 1} viewed. Total: ${this.viewedCards.length}/${this.totalCards}`);

            // Check if all cards have been viewed
            if (this.viewedCards.length === this.totalCards && !this.isAchievementUnlocked()) {
                this.unlockRemembered();
            }
        }
    }

    isAchievementUnlocked() {
        try {
            return localStorage.getItem(this.achievementKey) === 'true';
        } catch (e) {
            return false;
        }
    }

    unlockRemembered() {
        try {
            localStorage.setItem(this.achievementKey, 'true');
            this.showAchievement();
        } catch (e) {
            console.warn('Failed to unlock achievement:', e);
        }
    }

    showAchievement() {
        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        if (prefersReducedMotion) {
            notification.classList.add('reduced-motion');
        }

        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🧠</div>
                <div class="achievement-text">
                    <div class="achievement-title">Achievement Unlocked</div>
                    <div class="achievement-name">"Remembered"</div>
                    <div class="achievement-desc">You've explored all the technical innovations.<br>The Echoes would be proud.</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-hide after 6 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 6000);

        // Play subtle sound effect if available
        this.playAchievementSound();
    }

    playAchievementSound() {
        // Optional: Play a subtle achievement sound
        // This would require an audio file
        try {
            const audio = new Audio('assets/achievement.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Silently fail if audio can't play
            });
        } catch (e) {
            // Audio not available, that's fine
        }
    }

    getRandomCard() {
        return Math.floor(Math.random() * this.totalCards);
    }

    getViewProgress() {
        return {
            viewed: this.viewedCards.length,
            total: this.totalCards,
            percentage: Math.round((this.viewedCards.length / this.totalCards) * 100)
        };
    }

    resetProgress() {
        this.viewedCards = [];
        this.saveViewedCards();
        try {
            localStorage.removeItem(this.achievementKey);
        } catch (e) {
            console.warn('Failed to reset achievement:', e);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.spotlightTracker = new SpotlightTracker();
    });
} else {
    window.spotlightTracker = new SpotlightTracker();
}
