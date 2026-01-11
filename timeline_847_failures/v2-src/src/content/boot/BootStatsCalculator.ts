/**
 * UV7 V2 Boot Stats Calculator
 *
 * Generates dynamic boot statistics from player progression.
 * Memory increases, timeline counts, paradox status evolution.
 *
 * The 848 number is canonical - it's the version where the player starts.
 * 847 previous failures happened before the player existed.
 */

export interface BootStats {
  memory: string;
  timelines: string;
  paradox: string;
  paradoxColor: string;
  version: number;
}

export interface AttemptRecord {
  endingType: 'true' | 'bad' | 'corrupted' | 'abandoned';
  result: 'succeeded' | 'failed' | 'abandoned';
}

export interface TimelineData {
  currentAttempt: number;
  attempts: AttemptRecord[];
}

/** Canonical baseline - 847 attempts failed before player started */
const CANONICAL_FAILURES = 847;

/** First playthrough version */
const FIRST_VERSION = 848;

/**
 * Calculate timeline statistics from attempts
 */
function calculateTimelineStats(attempts: AttemptRecord[]): {
  failures: number;
  successes: number;
  abandons: number;
  totalEndings: number;
} {
  let playerFailures = 0;
  let playerSuccesses = 0;
  let abandons = 0;

  for (const attempt of attempts) {
    // Skip corrupted entries (pre-player attempts 843-847)
    if (attempt.endingType === 'corrupted') {
      continue;
    }

    if (attempt.result === 'succeeded' || attempt.endingType === 'true') {
      playerSuccesses++;
    } else if (attempt.result === 'failed') {
      playerFailures++;
    } else if (attempt.result === 'abandoned') {
      abandons++;
    }
  }

  return {
    failures: CANONICAL_FAILURES + playerFailures,
    successes: playerSuccesses,
    abandons,
    totalEndings: CANONICAL_FAILURES + playerFailures + playerSuccesses,
  };
}

/**
 * Calculate paradox status based on player progression
 */
function calculateParadoxStatus(
  currentAttempt: number,
  stats: ReturnType<typeof calculateTimelineStats>,
  attempts: AttemptRecord[]
): { status: string; color: string } {
  const totalAttempts = currentAttempt - FIRST_VERSION;
  const hasRealAttempts = attempts.some((a) => a.endingType !== 'corrupted');

  // FIRST PLAYTHROUGH (848) - Player has never played before
  if (!hasRealAttempts || totalAttempts === 0) {
    return { status: 'INITIALIZING', color: '#00ffff' };
  }

  // INSANE PLAYTHROUGH COUNT (50+ attempts)
  if (totalAttempts >= 50) {
    return { status: '████ ERROR ████', color: '#ff0066' };
  }

  // Calculate success ratio
  const successRatio = stats.totalEndings > 0 ? stats.successes / stats.totalEndings : 0;

  // SINGLE TRUE ENDING - Resolved immediately
  if (totalAttempts === 1 && stats.successes === 1) {
    return { status: 'RESOLVED', color: '#00ff88' };
  }

  // HIGH SUCCESS RATIO (>50% true endings)
  if (successRatio > 0.5) {
    return { status: 'STABLE', color: '#00ff88' };
  }

  // MODERATE SUCCESS RATIO (20-50% true endings)
  if (successRatio > 0.2) {
    return { status: 'FLUCTUATING', color: '#ffaa00' };
  }

  // MANY BAD ENDINGS (10+ failures)
  if (stats.failures >= 10) {
    return { status: 'COLLAPSING', color: '#ff0066' };
  }

  // VERY HIGH ATTEMPT COUNT (30-49 attempts)
  if (totalAttempts >= 30) {
    return { status: 'FRAGMENTING', color: '#bf00ff' };
  }

  // DEFAULT - Mostly failures, still figuring it out
  return { status: 'UNSTABLE', color: '#ff6600' };
}

/**
 * Calculate boot stats based on player's actual progression
 */
export function calculateBootStats(timeline?: TimelineData): BootStats {
  if (!timeline) {
    // First-time player fallback
    return {
      memory: '848 MB',
      timelines: '0 failed, 0 complete, 1 active',
      paradox: 'INITIALIZING',
      paradoxColor: '#00ffff',
      version: FIRST_VERSION,
    };
  }

  const currentAttempt = timeline.currentAttempt;
  const attempts = timeline.attempts || [];

  // MEMORY: Current iteration count as MB
  const memory = `${currentAttempt} MB`;

  // TIMELINE STATS
  const stats = calculateTimelineStats(attempts);
  const timelines = `${stats.failures} failed, ${stats.successes} complete, 1 active`;

  // PARADOX STATUS
  const paradoxData = calculateParadoxStatus(currentAttempt, stats, attempts);

  return {
    memory,
    timelines,
    paradox: paradoxData.status,
    paradoxColor: paradoxData.color,
    version: currentAttempt,
  };
}

/**
 * Get menu footer text based on progression
 */
export function getMenuFooterText(timeline?: TimelineData): string {
  if (!timeline) {
    return '[Version 848 - 847 previous failures]';
  }

  const currentAttempt = timeline.currentAttempt;
  const attempts = timeline.attempts || [];
  const totalPlayerAttempts = currentAttempt - FIRST_VERSION;
  const stats = calculateTimelineStats(attempts);

  if (totalPlayerAttempts === 0) {
    return '[Version 848 - 847 previous failures]';
  }

  if (totalPlayerAttempts === 1 && stats.successes === 1) {
    return `[Version ${currentAttempt} - The loop that closed]`;
  }

  return `[Version ${currentAttempt} - ${stats.failures} previous failures]`;
}
