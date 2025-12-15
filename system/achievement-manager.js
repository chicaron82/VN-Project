// ========================================
// DIZEE POLISH: ACHIEVEMENT SYSTEM
// Track player accomplishments and stats
// ========================================

class AchievementManager {
    constructor(game) {
        this.game = game;

        // Define all achievements
        this.achievements = {
            speed_runner: {
                id: 'speed_runner',
                name: 'Speed Runner',
                description: 'Complete any route in under 30 minutes',
                icon: '🏃',
                unlocked: false,
                unlockedAt: null
            },
            archivist: {
                id: 'archivist',
                name: 'Archivist',
                description: 'Collect all 13 notes on Tori\'s route',
                icon: '📚',
                unlocked: false,
                unlockedAt: null
            },
            time_traveler: {
                id: 'time_traveler',
                name: 'Time Traveler',
                description: 'Reach any ending',
                icon: '🔄',
                unlocked: false,
                unlockedAt: null
            },
            heartbreaker: {
                id: 'heartbreaker',
                name: 'Heartbreaker',
                description: 'Reach the bad ending',
                icon: '💔',
                unlocked: false,
                unlockedAt: null
            },
            true_ending: {
                id: 'true_ending',
                name: 'True Ending',
                description: 'Reach the true ending',
                icon: '✨',
                unlocked: false,
                unlockedAt: null
            },
            completionist: {
                id: 'completionist',
                name: 'Completionist',
                description: 'Unlock all endings',
                icon: '🎮',
                unlocked: false,
                unlockedAt: null
            },
            pet_parent: {
                id: 'pet_parent',
                name: 'Pet Parent',
                description: 'Unlock ToriGatchi',
                icon: '🐣',
                unlocked: false,
                unlockedAt: null
            },
            insane: {
                id: 'insane',
                name: 'Insane',
                description: 'Complete Insane Mode',
                icon: '⚡',
                unlocked: false,
                unlockedAt: null
            },
            explorer: {
                id: 'explorer',
                name: 'Explorer',
                description: 'View 100+ dialogue entries in backlog',
                icon: '🔍',
                unlocked: false,
                unlockedAt: null
            },
            tactical_retreat: {
                id: 'tactical_retreat',
                name: 'Tactical Retreat',
                description: 'Used Konami Code to escape INSANE mode',
                icon: '🏃',
                unlocked: false,
                unlockedAt: null
            },
            masochist: {
                id: 'masochist',
                name: 'Masochist',
                description: 'Stayed in INSANE mode after finding the exit',
                icon: '😈',
                unlocked: false,
                unlockedAt: null
            }
        };

        // Load saved achievements
        this.loadAchievements();

        // Track stats for achievements
        this.stats = this.loadStats();
    }

    loadAchievements() {
        try {
            const saved = localStorage.getItem('vn_achievements');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults
                Object.keys(parsed).forEach(id => {
                    if (this.achievements[id]) {
                        this.achievements[id].unlocked = parsed[id].unlocked || false;
                        this.achievements[id].unlockedAt = parsed[id].unlockedAt || null;
                    }
                });
            }
        } catch (e) {
            console.warn('Error loading achievements:', e);
        }
    }

    saveAchievements() {
        try {
            localStorage.setItem('vn_achievements', JSON.stringify(this.achievements));
        } catch (e) {
            console.warn('Error saving achievements:', e);
        }
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('vn_achievement_stats');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Error loading stats:', e);
        }

        return {
            routeStartTime: null,
            backlogViews: 0,
            endingsReached: []
        };
    }

    saveStats() {
        try {
            localStorage.setItem('vn_achievement_stats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Error saving stats:', e);
        }
    }

    unlock(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.warn(`Achievement ${achievementId} not found`);
            return;
        }

        if (achievement.unlocked) {
            console.log(`Achievement ${achievementId} already unlocked`);
            return;
        }

        // Unlock it
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();

        console.log(`🏆 Achievement unlocked: ${achievement.name}`);

        // Save
        this.saveAchievements();

        // Show notification
        this.showAchievementNotification(achievement);

        // Haptic feedback
        if (this.game && this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('achievement', null, 'Achievement unlocked!');
        }
    }

    showAchievementNotification(achievement) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast-content">
                <div class="achievement-toast-icon">${achievement.icon}</div>
                <div class="achievement-toast-text">
                    <div class="achievement-toast-title">ACHIEVEMENT UNLOCKED</div>
                    <div class="achievement-toast-name">${achievement.name}</div>
                    <div class="achievement-toast-desc">${achievement.description}</div>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);
    }

    // ========================================
    // ACHIEVEMENT TRIGGERS
    // ========================================

    checkSpeedRunner() {
        if (!this.stats.routeStartTime) return;

        const elapsed = Date.now() - this.stats.routeStartTime;
        const thirtyMinutes = 30 * 60 * 1000;

        if (elapsed < thirtyMinutes) {
            this.unlock('speed_runner');
        }
    }

    checkArchivist() {
        // Check if all 13 Tori notes collected
        const collectibles = this.game.collectiblesManager;
        if (!collectibles) return;

        const toriTypes = ['z', 'cz', 'zr'];
        let totalCollected = 0;

        toriTypes.forEach(type => {
            if (collectibles.collectedNotes[type]) {
                totalCollected += collectibles.collectedNotes[type].length;
            }
        });

        if (totalCollected >= 13) {
            this.unlock('archivist');
        }
    }

    checkTimeTravel(endingId) {
        if (!this.stats.endingsReached.includes(endingId)) {
            this.stats.endingsReached.push(endingId);
            this.saveStats();
        }

        // First ending
        if (this.stats.endingsReached.length === 1) {
            this.unlock('time_traveler');
        }

        // Check specific endings
        if (endingId === 'bad_ending') {
            this.unlock('heartbreaker');
        }

        if (endingId === 'true_ending') {
            this.unlock('true_ending');
        }

        // Check completionist (all endings)
        const allEndings = ['bad_ending', 'digital_ending', 'true_ending'];
        if (allEndings.every(e => this.stats.endingsReached.includes(e))) {
            this.unlock('completionist');
        }
    }

    checkPetParent() {
        if (localStorage.getItem('torigatchiUnlocked') === 'true') {
            this.unlock('pet_parent');
        }
    }

    checkInsane() {
        // Check if completed on Insane difficulty
        const difficulty = this.game.settingsManager?.settings?.tetherDifficulty;
        if (difficulty === 'insane') {
            this.unlock('insane');
        }
    }

    checkExplorer() {
        this.stats.backlogViews++;
        this.saveStats();

        if (this.stats.backlogViews >= 100) {
            this.unlock('explorer');
        }
    }

    startRouteTimer() {
        this.stats.routeStartTime = Date.now();
        this.saveStats();
    }

    getTotalUnlocked() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    getTotalAchievements() {
        return Object.keys(this.achievements).length;
    }
}

// Initialize when game is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const checkGame = setInterval(() => {
            if (window.game) {
                window.achievementManager = new AchievementManager(window.game);
                window.game.achievementManager = window.achievementManager;
                clearInterval(checkGame);
            }
        }, 100);
    });
}
