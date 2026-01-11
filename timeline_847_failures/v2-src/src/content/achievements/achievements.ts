/**
 * Achievements Data
 *
 * Player accomplishments and progression tracking.
 * Each achievement has unlock conditions and notification settings.
 */

// ========================================
// ACHIEVEMENT TYPES
// ========================================

export type AchievementCategory = 'progression' | 'completion' | 'secret' | 'challenge';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  /** If true, achievement is hidden until unlocked */
  hidden?: boolean;
}

export interface AchievementState {
  unlocked: boolean;
  unlockedAt: number | null;
}

export interface AchievementStats {
  routeStartTime: number | null;
  backlogViews: number;
  endingsReached: string[];
}

// ========================================
// ACHIEVEMENT DEFINITIONS
// ========================================

export const ACHIEVEMENTS: Achievement[] = [
  // PROGRESSION ACHIEVEMENTS
  {
    id: 'time_traveler',
    name: 'Time Traveler',
    description: 'Reach any ending',
    icon: '🔄',
    category: 'progression',
  },
  {
    id: 'heartbreaker',
    name: 'Heartbreaker',
    description: 'Reach the bad ending',
    icon: '💔',
    category: 'progression',
  },
  {
    id: 'true_ending',
    name: 'True Ending',
    description: 'Reach the true ending',
    icon: '✨',
    category: 'progression',
  },

  // COMPLETION ACHIEVEMENTS
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock all endings',
    icon: '🎮',
    category: 'completion',
  },
  {
    id: 'archivist',
    name: 'Archivist',
    description: "Collect all 13 notes on Tori's route",
    icon: '📚',
    category: 'completion',
  },
  {
    id: 'remembered',
    name: 'Remembered',
    description: 'All three echoes have noticed you',
    icon: '👁️',
    category: 'completion',
  },

  // CHALLENGE ACHIEVEMENTS
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete any route in under 30 minutes',
    icon: '🏃',
    category: 'challenge',
  },
  {
    id: 'insane',
    name: 'Insane',
    description: 'Complete Insane Mode',
    icon: '⚡',
    category: 'challenge',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'View 100+ dialogue entries in backlog',
    icon: '🔍',
    category: 'challenge',
  },

  // SECRET ACHIEVEMENTS
  {
    id: 'pet_parent',
    name: 'Pet Parent',
    description: 'Unlock ToriGatchi',
    icon: '🐣',
    category: 'secret',
    hidden: true,
  },
  {
    id: 'tactical_retreat',
    name: 'Tactical Retreat',
    description: 'Used Konami Code to escape INSANE mode',
    icon: '🏃',
    category: 'secret',
    hidden: true,
  },
  {
    id: 'masochist',
    name: 'Masochist',
    description: 'Stayed in INSANE mode after finding the exit',
    icon: '😈',
    category: 'secret',
    hidden: true,
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get achievement by ID
 */
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Get all achievements in a category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Get visible achievements (non-hidden or already unlocked)
 */
export function getVisibleAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.hidden || unlockedIds.includes(a.id));
}

/**
 * Get total achievement count
 */
export function getTotalAchievementCount(): number {
  return ACHIEVEMENTS.length;
}

/**
 * Get default achievement stats
 */
export function getDefaultStats(): AchievementStats {
  return {
    routeStartTime: null,
    backlogViews: 0,
    endingsReached: [],
  };
}

/**
 * Get default achievement state
 */
export function getDefaultAchievementState(): AchievementState {
  return {
    unlocked: false,
    unlockedAt: null,
  };
}

// ========================================
// UNLOCK CONDITIONS
// These define when each achievement should trigger
// ========================================

export interface AchievementCondition {
  achievementId: string;
  check: (stats: AchievementStats, context?: Record<string, unknown>) => boolean;
}

export const ACHIEVEMENT_CONDITIONS: AchievementCondition[] = [
  // Time Traveler - first ending
  {
    achievementId: 'time_traveler',
    check: (stats) => stats.endingsReached.length >= 1,
  },

  // Heartbreaker - bad ending
  {
    achievementId: 'heartbreaker',
    check: (stats) => stats.endingsReached.includes('bad'),
  },

  // True Ending - true ending
  {
    achievementId: 'true_ending',
    check: (stats) => stats.endingsReached.includes('true'),
  },

  // Completionist - all three endings
  {
    achievementId: 'completionist',
    check: (stats) => {
      const allEndings = ['bad', 'digital_forever', 'true'];
      return allEndings.every((e) => stats.endingsReached.includes(e));
    },
  },

  // Speed Runner - under 30 minutes
  {
    achievementId: 'speed_runner',
    check: (stats) => {
      if (!stats.routeStartTime) return false;
      const elapsed = Date.now() - stats.routeStartTime;
      const thirtyMinutes = 30 * 60 * 1000;
      return elapsed < thirtyMinutes;
    },
  },

  // Explorer - 100+ backlog views
  {
    achievementId: 'explorer',
    check: (stats) => stats.backlogViews >= 100,
  },
];

/**
 * Check which achievements should be unlocked based on stats
 */
export function checkAchievementConditions(
  stats: AchievementStats,
  alreadyUnlocked: string[],
  context?: Record<string, unknown>
): string[] {
  const newUnlocks: string[] = [];

  for (const condition of ACHIEVEMENT_CONDITIONS) {
    if (alreadyUnlocked.includes(condition.achievementId)) continue;
    if (condition.check(stats, context)) {
      newUnlocks.push(condition.achievementId);
    }
  }

  return newUnlocks;
}

// ========================================
// METADATA
// ========================================

export const ACHIEVEMENTS_META = {
  id: 'achievements',
  name: 'Achievements',
  description: 'Track your accomplishments and progress.',
  total: ACHIEVEMENTS.length,
  categories: {
    progression: ACHIEVEMENTS.filter((a) => a.category === 'progression').length,
    completion: ACHIEVEMENTS.filter((a) => a.category === 'completion').length,
    challenge: ACHIEVEMENTS.filter((a) => a.category === 'challenge').length,
    secret: ACHIEVEMENTS.filter((a) => a.category === 'secret').length,
  },
  storageKeys: {
    achievements: 'vn_achievements',
    stats: 'vn_achievement_stats',
  },
} as const;
