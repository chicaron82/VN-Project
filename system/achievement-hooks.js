// ========================================
// DIZEE POLISH: ACHIEVEMENT SYSTEM HOOKS
// Wire up achievement triggers to game events
// ========================================

// Hook into game engine methods
function hookAchievementTriggers() {
    if (!window.game || !window.achievementManager) {
        console.warn('Game or achievement manager not ready');
        return;
    }

    const game = window.game;
    const achievementMgr = window.achievementManager;

    // ========================================
    // HOOK 1: Route Start Timer
    // ========================================
    const originalStartRoute = game.startRoute.bind(game);
    game.startRoute = function (routeName) {
        // Start timer for Speed Runner achievement
        achievementMgr.startRouteTimer();
        console.log('🏃 Achievement: Route timer started');

        // Call original
        return originalStartRoute(routeName);
    };

    // ========================================
    // HOOK 2: Note Collection
    // ========================================
    if (game.collectiblesManager) {
        const originalUnlockNote = game.collectiblesManager.unlockNote.bind(game.collectiblesManager);
        game.collectiblesManager.unlockNote = function (noteId) {
            // Call original
            const result = originalUnlockNote(noteId);

            // Check Archivist achievement after note unlock
            setTimeout(() => {
                achievementMgr.checkArchivist();
            }, 100);

            return result;
        };
    }

    // ========================================
    // HOOK 3: Backlog Views
    // ========================================
    if (game.backlogManager && game.backlogManager.show) {
        const originalShow = game.backlogManager.show.bind(game.backlogManager);
        game.backlogManager.show = function () {
            // Track backlog view for Explorer achievement
            achievementMgr.checkExplorer();

            // Call original
            return originalShow();
        };
    } else {
        console.log('⚠️ Backlog manager not ready yet, will hook later');
    }

    // ========================================
    // HOOK 4: ToriGatchi Unlock
    // ========================================
    // Check on page load and when localStorage changes
    achievementMgr.checkPetParent();

    // Monitor for ToriGatchi unlock
    const checkToriGatchi = setInterval(() => {
        if (localStorage.getItem('torigatchiUnlocked') === 'true') {
            achievementMgr.checkPetParent();
        }
    }, 5000);

    console.log('🏆 Achievement hooks installed successfully');
}

// Helper function to check achievements on ending
window.checkEndingAchievements = function (endingId) {
    if (!window.achievementManager) return;

    const achievementMgr = window.achievementManager;

    // Check all ending-related achievements
    achievementMgr.checkTimeTravel(endingId);
    achievementMgr.checkSpeedRunner();
    achievementMgr.checkInsane();

    console.log(`🏆 Checked achievements for ending: ${endingId}`);
};

// Add this to game initialization
function initializeAchievementHooks() {
    // Wait for achievement manager to be ready
    const checkReady = setInterval(() => {
        if (window.achievementManager && window.game) {
            clearInterval(checkReady);

            // Wire up achievements button
            const achievementsBtn = document.getElementById('btn-achievements');
            if (achievementsBtn) {
                achievementsBtn.addEventListener('click', () => {
                    if (window.achievementViewer) {
                        window.achievementViewer.show();
                    }
                });
            }

            // Hook achievement triggers into game events
            hookAchievementTriggers();

            console.log('Achievement system fully initialized');
        }
    }, 100);
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initializeAchievementHooks);
}
