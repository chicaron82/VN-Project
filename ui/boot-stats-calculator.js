// @ts-check
// ========================================
// BOOT STATS CALCULATOR
// Generates dynamic boot statistics from bootstrap tracker
// Memory increases, timeline counts, paradox status evolution
// ========================================

/**
 * Calculates dynamic boot stats based on player's actual progression
 * @param {Object} bootstrapTracker - Bootstrap tracker instance
 * @returns {{memory: string, timelines: string, paradox: string, paradoxColor: string}}
 */
function calculateBootStats(bootstrapTracker) {
    if (!bootstrapTracker || !bootstrapTracker.timeline) {
        // Fallback for first load before tracker exists
        return {
            memory: '848 MB',
            timelines: '0 failed, 0 complete, 1 active',
            paradox: 'INITIALIZING',
            paradoxColor: '#00ffff'
        };
    }

    const timeline = bootstrapTracker.timeline;
    const currentAttempt = timeline.currentAttempt;
    const attempts = timeline.attempts || [];

    // MEMORY: Base 848 MB + current iteration count
    // 848 is the canonical starting version, memory grows with each playthrough
    const memory = `${currentAttempt} MB`;

    // TIMELINE STATS: Count failed vs successful attempts
    const stats = calculateTimelineStats(attempts);
    const timelines = `${stats.failures} failed, ${stats.successes} complete, 1 active`;

    // PARADOX STATUS: Based on ending ratios and progression
    const paradoxData = calculateParadoxStatus(currentAttempt, stats, attempts);

    return {
        memory,
        timelines,
        paradox: paradoxData.status,
        paradoxColor: paradoxData.color
    };
}

/**
 * Calculate timeline statistics from attempts
 * Preserves canonical 847 failed attempts as baseline
 * @param {Array<Object>} attempts - Array of attempt records
 * @returns {{failures: number, successes: number, abandons: number, totalEndings: number}}
 */
function calculateTimelineStats(attempts) {
    // CANONICAL BASELINE: 847 attempts failed before player started (848 is first playthrough)
    const CANONICAL_FAILURES = 847;

    let playerFailures = 0;
    let playerSuccesses = 0;
    let abandons = 0;

    attempts.forEach(attempt => {
        // Skip corrupted entries (pre-player attempts 843-847) - already counted in baseline
        if (attempt.endingType === 'corrupted') {
            return;
        }

        if (attempt.result === 'succeeded' || attempt.endingType === 'true') {
            playerSuccesses++;
        } else if (attempt.result === 'failed') {
            playerFailures++;
        } else if (attempt.result === 'abandoned') {
            abandons++;
        }
    });

    return {
        failures: CANONICAL_FAILURES + playerFailures, // Total failures = canon baseline + player failures
        successes: playerSuccesses,
        abandons,
        totalEndings: CANONICAL_FAILURES + playerFailures + playerSuccesses
    };
}

/**
 * Calculate paradox status based on player progression
 * @param {number} currentAttempt - Current attempt number
 * @param {{failures: number, successes: number, abandons: number, totalEndings: number}} stats - Timeline stats
 * @param {Array<Object>} attempts - Array of attempt records
 * @returns {{status: string, color: string}}
 */
function calculateParadoxStatus(currentAttempt, stats, attempts) {
    const totalAttempts = currentAttempt - 848; // How many times player has played
    const hasRealAttempts = attempts.some(a => a.endingType !== 'corrupted');

    // FIRST PLAYTHROUGH (848) - Player has never played before
    if (!hasRealAttempts || totalAttempts === 0) {
        return {
            status: 'INITIALIZING',
            color: '#00ffff'
        };
    }

    // INSANE PLAYTHROUGH COUNT (50+ attempts)
    if (totalAttempts >= 50) {
        return {
            status: '████ ERROR ████',
            color: '#ff0066'
        };
    }

    // Calculate success ratio
    const successRatio = stats.totalEndings > 0 ? stats.successes / stats.totalEndings : 0;

    // SINGLE TRUE ENDING - Resolved immediately
    if (totalAttempts === 1 && stats.successes === 1) {
        return {
            status: 'RESOLVED',
            color: '#00ff88'
        };
    }

    // HIGH SUCCESS RATIO (>50% true endings)
    if (successRatio > 0.5) {
        return {
            status: 'STABLE',
            color: '#00ff88'
        };
    }

    // MODERATE SUCCESS RATIO (20-50% true endings)
    if (successRatio > 0.2) {
        return {
            status: 'FLUCTUATING',
            color: '#ffaa00'
        };
    }

    // MANY BAD ENDINGS (10+ failures)
    if (stats.failures >= 10) {
        return {
            status: 'COLLAPSING',
            color: '#ff0066'
        };
    }

    // VERY HIGH ATTEMPT COUNT (30-49 attempts)
    if (totalAttempts >= 30) {
        return {
            status: 'FRAGMENTING',
            color: '#bf00ff'
        };
    }

    // DEFAULT - Mostly failures, still figuring it out
    return {
        status: 'UNSTABLE',
        color: '#ff6600'
    };
}

/**
 * Get dynamic boot stats for display in boot sequence
 * Safe wrapper that handles missing tracker gracefully
 * @param {Object} [game] - Game engine instance
 * @returns {{memory: string, timelines: string, paradox: string, paradoxColor: string}}
 */
function getDynamicBootStats(game) {
    try {
        if (game && game.bootstrapTracker) {
            return calculateBootStats(game.bootstrapTracker);
        }
    } catch (e) {
        console.warn('Boot stats calculator: Failed to get dynamic stats, using fallback', e);
    }

    // Fallback to first-time experience
    return {
        memory: '848 MB',
        timelines: '0 failed, 0 complete, 1 active',
        paradox: 'INITIALIZING',
        paradoxColor: '#00ffff'
    };
}

/**
 * Update main menu version footer with dynamic stats
 * @param {Object} [game] - Game engine instance
 */
function updateMenuFooter(game) {
    const footerEl = document.getElementById('menu-footer');
    if (!footerEl) return;

    try {
        if (!game || !game.bootstrapTracker) {
            // Default first-time message
            footerEl.textContent = '[Version 848 - 847 previous failures]';
            return;
        }

        const tracker = game.bootstrapTracker;
        const currentAttempt = tracker.getCurrentAttempt();
        const timeline = tracker.timeline;
        const attempts = timeline.attempts || [];

        // Count player attempts (exclude corrupted)
        const playerAttempts = attempts.filter(a => a.endingType !== 'corrupted');
        const totalPlayerAttempts = currentAttempt - 848; // How many times player has played

        // Calculate failures (847 baseline + player failures)
        const stats = calculateTimelineStats(attempts);

        if (totalPlayerAttempts === 0) {
            // First playthrough
            footerEl.textContent = '[Version 848 - 847 previous failures]';
        } else if (totalPlayerAttempts === 1 && stats.successes === 1) {
            // Perfect first run
            footerEl.textContent = `[Version ${currentAttempt} - The loop that closed]`;
        } else {
            // Ongoing attempts
            const totalFailures = stats.failures; // Already includes 847 baseline
            footerEl.textContent = `[Version ${currentAttempt} - ${totalFailures} previous failures]`;
        }
    } catch (e) {
        console.warn('Failed to update menu footer:', e);
        footerEl.textContent = '[Version 848 - 847 previous failures]';
    }
}

// Export for use in boot sequence and game engine
// @ts-ignore
window.getDynamicBootStats = getDynamicBootStats;
// @ts-ignore
window.updateMenuFooter = updateMenuFooter;

console.log('📊 Boot stats calculator loaded');
