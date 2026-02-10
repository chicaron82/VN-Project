import type { EventBus } from '@core/EventBus';
import { Logger } from '@utils/Logger';

/**
 * ════════════════════════════════════════════════════════════════
 * ACHIEVEMENT HOOKS - V2 Port
 * Phase 22f: Achievement System Integration
 *
 * V1 Parity: system/achievement-hooks.js (124 lines → ~180 lines)
 *
 * Purpose:
 * - Wire achievement triggers to game events
 * - Hook into game engine methods
 * - Monitor collectibles, backlog, ToriGatchi
 * - Track route completion timing
 *
 * Features:
 * - Route start timer hook
 * - Note collection hook
 * - Backlog view hook
 * - ToriGatchi unlock monitoring
 * - Ending achievement checks
 *
 * V1 Parity Notes:
 * - All hook points preserved
 * - Achievement check calls unchanged
 * - Timing intervals unchanged (5000ms ToriGatchi check)
 * - Function wrapping pattern identical
 *
 * DIZEE POLISH: Achievement tracking across game systems 🏆
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface GameReference {
    startRoute?(routeName: string): unknown;
    collectiblesManager?: {
        unlockNote(noteId: string): unknown;
    };
    backlogManager?: {
        show(): unknown;
    };
}

interface AchievementSystemType {
    startRouteTimer(): void;
    checkArchivist(): void;
    checkExplorer(): void;
    checkPetParent(): void;
    checkTimeTravel(endingId: string): void;
    checkSpeedRunner(): void;
    checkInsane(): void;
}

export class AchievementHooks {
    private game: GameReference | null = null;
    private achievementManager: AchievementSystemType | null = null;
    private toriGatchiCheckInterval: number | null = null;

    constructor(_eventBus?: EventBus) {
        // Reserved for future EventBus integration
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize and hook achievement triggers
     */
    public init(game: GameReference, achievementSystem: AchievementSystemType): void {
        this.game = game;
        this.achievementManager = achievementSystem;

        this.hookAchievementTriggers();
        Logger.achievement('🏆 Achievement hooks initialized');
    }

    // ========================================
    // HOOK INSTALLATION
    // ========================================

    /**
     * Hook into game engine methods
     */
    private hookAchievementTriggers(): void {
        if (!this.game || !this.achievementManager) {
            Logger.warn('Game or achievement manager not ready');
            return;
        }

        const game = this.game;
        const achievementMgr = this.achievementManager;

        // ========================================
        // HOOK 1: Route Start Timer
        // ========================================
        if (game.startRoute) {
            const originalStartRoute = game.startRoute.bind(game);
            game.startRoute = function (routeName: string) {
                // Start timer for Speed Runner achievement
                achievementMgr.startRouteTimer();
                Logger.achievement('🏃 Achievement: Route timer started');

                // Call original
                return originalStartRoute(routeName);
            };
        }

        // ========================================
        // HOOK 2: Note Collection
        // ========================================
        if (game.collectiblesManager) {
            const originalUnlockNote = game.collectiblesManager.unlockNote.bind(game.collectiblesManager);
            game.collectiblesManager.unlockNote = function (noteId: string) {
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
            Logger.warn('⚠️ Backlog manager not ready yet, will hook later');
        }

        // ========================================
        // HOOK 4: ToriGatchi Unlock
        // ========================================
        // Check on page load and when localStorage changes
        achievementMgr.checkPetParent();

        // Monitor for ToriGatchi unlock
        this.toriGatchiCheckInterval = window.setInterval(() => {
            if (localStorage.getItem('torigatchiUnlocked') === 'true') {
                achievementMgr.checkPetParent();
            }
        }, 5000);

        Logger.achievement('🏆 Achievement hooks installed successfully');
    }

    // ========================================
    // ENDING ACHIEVEMENTS
    // ========================================

    /**
     * Check achievements on ending
     */
    public checkEndingAchievements(endingId: string): void {
        if (!this.achievementManager) return;

        const achievementMgr = this.achievementManager;

        // Check all ending-related achievements
        achievementMgr.checkTimeTravel(endingId);
        achievementMgr.checkSpeedRunner();
        achievementMgr.checkInsane();

        Logger.achievement(`🏆 Checked achievements for ending: ${endingId}`);
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Cleanup intervals
     */
    public destroy(): void {
        if (this.toriGatchiCheckInterval !== null) {
            clearInterval(this.toriGatchiCheckInterval);
            this.toriGatchiCheckInterval = null;
        }
    }
}

// ========================================
// BROWSER GLOBALS & AUTO-INIT
// ========================================

// Global helper function for V1 compatibility
interface AchievementGlobals {
    checkEndingAchievements?: (endingId: string) => void;
    achievementHooks?: AchievementHooks;
    achievementManager?: AchievementSystemType;
    achievementViewer?: { show(): void };
    game?: GameReference;
}

if (typeof window !== 'undefined') {
    const win = window as typeof window & AchievementGlobals;
    win.checkEndingAchievements = function (endingId: string): void {
        const hooks = win.achievementHooks;
        if (hooks) {
            hooks.checkEndingAchievements(endingId);
        }
    };

    // Auto-initialize
    window.addEventListener('DOMContentLoaded', () => {
        const checkReady = setInterval(() => {
            const achievementManager = win.achievementManager;
            const game = win.game;

            if (achievementManager && game) {
                clearInterval(checkReady);

                // Wire up achievements button
                const achievementsBtn = document.getElementById('btn-achievements');
                if (achievementsBtn) {
                    achievementsBtn.addEventListener('click', () => {
                        const viewer = win.achievementViewer;
                        if (viewer) {
                            viewer.show();
                        }
                    });
                }

                // Initialize hooks
                const hooks = new AchievementHooks();
                hooks.init(game, achievementManager);
                win.achievementHooks = hooks;

                Logger.achievement('Achievement system fully initialized');
            }
        }, 100);
    });
}
