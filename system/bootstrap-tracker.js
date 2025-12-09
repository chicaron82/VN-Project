// ========================================
// BOOTSTRAP TIMELINE TRACKER MODULE
// Tracks last 5 player attempts with failure reasons
// Lore-appropriate memory management (older = corrupted)
// ========================================

/**
 * ════════════════════════════════════════════════════════════════
 * BOOTSTRAP-TRACKER.JS - Attempt Timeline System
 * Tracks player's journey through the bootstrap paradox
 * ════════════════════════════════════════════════════════════════
 *
 * FEATURES:
 * - Track last 5 attempts (rolling window)
 * - Record failure/success reasons
 * - Timestamp each attempt
 * - Show older attempts as "corrupted" (memory degradation)
 * - Visual timeline display
 * - Persistence via localStorage
 *
 * LORE INTEGRATION:
 * - Mirrors the 848-attempt bootstrap paradox
 * - Data corruption represents digital consciousness degradation
 * - Personal timeline creates player ownership
 * - "You're on attempt #853" reinforces iteration theme
 *
 * USAGE:
 * - Initialize in GameEngine constructor
 * - Call recordAttempt() when player reaches ending
 * - Call showTimelineModal() to display timeline
 * - Access via BOOTSTRAP secret code or settings button
 * ════════════════════════════════════════════════════════════════
 */

class BootstrapTracker {
    constructor(game) {
        this.game = game;
        this.maxAttempts = 5; // Only keep last 5 attempts
        this.timeline = this.loadTimeline();

        console.log('📜 Bootstrap tracker initialized');
        console.log(`Current attempt: #${this.timeline.currentAttempt}`);
    }

    // ========================================
    // TIMELINE MANAGEMENT
    // ========================================

    loadTimeline() {
        try {
            const saved = localStorage.getItem('bootstrapTimeline');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log(`📜 Loaded timeline with ${parsed.attempts.length} recorded attempts`);
                return parsed;
            }
        } catch (e) {
            console.warn('Failed to load bootstrap timeline:', e);
        }

        // Default timeline - DIZEE FIX: Pre-populate with 5 corrupted attempts (843-847)
        // This creates the narrative weight of 847 failed iterations
        console.log('📜 Initializing bootstrap timeline with corrupted history');
        return {
            currentAttempt: 848, // Start at canonical version number
            attempts: [
                // Last 5 attempts before the player (847-843) - all corrupted
                { number: 847, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 846, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 845, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 844, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 843, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' }
            ]
        };
    }

    saveTimeline() {
        try {
            localStorage.setItem('bootstrapTimeline', JSON.stringify(this.timeline));
            console.log(`📜 Timeline saved (attempt #${this.timeline.currentAttempt})`);
        } catch (e) {
            console.error('Failed to save bootstrap timeline:', e);
        }
    }

    getCurrentAttempt() {
        return this.timeline.currentAttempt;
    }

    incrementAttempt() {
        this.timeline.currentAttempt++;
        this.saveTimeline();
        console.log(`🔄 Attempt incremented to #${this.timeline.currentAttempt}`);
    }

    // ========================================
    // ATTEMPT RECORDING
    // ========================================

    recordAttempt(result, reason, route, endingType) {
        const attempt = {
            number: this.timeline.currentAttempt,
            result: result, // 'failed', 'succeeded'
            reason: reason, // e.g. "Tether depleted", "True ending reached"
            route: route, // 'ronnie' or 'tori'
            endingType: endingType, // 'bad', 'digitalForever', 'true'
            timestamp: Date.now(),
            dateString: this.formatDate(new Date())
        };

        // Add to timeline
        this.timeline.attempts.unshift(attempt); // Add to beginning

        // Keep only last 5 attempts
        if (this.timeline.attempts.length > this.maxAttempts) {
            this.timeline.attempts = this.timeline.attempts.slice(0, this.maxAttempts);
        }

        this.saveTimeline();

        console.log(`📝 Recorded attempt #${attempt.number}: ${result} - ${reason}`);
    }

    formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
    }

    // ========================================
    // FAILURE REASON INFERENCE
    // ========================================

    inferFailureReason(endingType, route, gameState) {
        // Infer reason based on ending type and game state
        if (endingType === 'bad') {
            // Check tether level for Tori's route
            if (route === 'tori') {
                const tetherLevel = gameState?.tetherLevel ?? 0;
                if (tetherLevel <= 0) {
                    return 'Tether depleted';
                }

                // Check for Echo takeover
                if (gameState?.echoTookOver) {
                    return 'Echo takeover';
                }

                return 'Vessel collapse';
            }

            // Ronnie's route bad ending
            return 'Connection lost';
        }

        if (endingType === 'digitalForever') {
            return route === 'tori' ? 'Digital forever ending' : 'Stable but separate';
        }

        if (endingType === 'true') {
            return 'True ending reached';
        }

        return 'Unknown failure';
    }

    // ========================================
    // DISPLAY SYSTEM
    // ========================================

    generateTimelineHTML() {
        let html = '<div class="bootstrap-timeline">';

        // Header
        html += `
            <div class="timeline-header">
                <h3>BOOTSTRAP PARADOX TIMELINE</h3>
                <p class="timeline-subtitle">Tracking your attempts through the loop</p>
            </div>
        `;

        // Current attempt (always shown)
        html += `
            <div class="timeline-entry current">
                <div class="entry-number">Attempt #${this.timeline.currentAttempt} (Current)</div>
                <div class="entry-status">[ACTIVE] You are here</div>
            </div>
        `;

        // Last 5 attempts (including corrupted entries)
        this.timeline.attempts.forEach((attempt, index) => {
            // Check if this is a corrupted entry
            if (attempt.endingType === 'corrupted') {
                html += `
                    <div class="timeline-entry corrupted">
                        <div class="entry-number">Attempt #${attempt.number}</div>
                        <div class="entry-status corrupted-text">
                            ✗ Failed: [DATA CORRUPTED]
                            <div class="entry-meta" style="margin-top: 0.5em;">
                                <span class="entry-date">Date: [UNREADABLE]</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Normal attempt with real data
                const resultIcon = this.getResultIcon(attempt.result, attempt.endingType);
                const resultClass = this.getResultClass(attempt.result, attempt.endingType);

                html += `
                    <div class="timeline-entry ${resultClass}">
                        <div class="entry-number">Attempt #${attempt.number}</div>
                        <div class="entry-details">
                            <div class="entry-result">${resultIcon} ${this.capitalizeFirst(attempt.result)}: ${attempt.reason}</div>
                            <div class="entry-meta">
                                <span class="entry-date">Date: ${attempt.dateString}</span>
                                <span class="entry-route">Route: ${this.getRouteName(attempt.route)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // Degraded attempts message (always show for attempts before the rolling window)
        const oldestInWindow = this.timeline.attempts.length > 0
            ? this.timeline.attempts[this.timeline.attempts.length - 1].number
            : this.timeline.currentAttempt;

        if (oldestInWindow > 1) {
            html += `
                <div class="timeline-entry degraded">
                    <div class="entry-status degraded-text">
                        Attempts #1-${oldestInWindow - 1}
                        <br>
                        [FRAGMENTED - TOO DEGRADED TO RECONSTRUCT]
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    getResultIcon(result, endingType) {
        if (result === 'succeeded') {
            return endingType === 'true' ? '✓' : '◐';
        }
        return '✗';
    }

    getResultClass(result, endingType) {
        if (endingType === 'corrupted') {
            return 'corrupted';
        }
        if (result === 'succeeded') {
            return endingType === 'true' ? 'success-true' : 'success-partial';
        }
        return 'failed';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getRouteName(route) {
        if (route === 'unknown') {
            return '[UNKNOWN]';
        }
        return route === 'ronnie' ? "Ronnie's Perspective" : "Tori's Perspective";
    }

    // ========================================
    // MODAL DISPLAY
    // ========================================

    showTimelineModal() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'bootstrap-timeline-modal';
        overlay.className = 'bootstrap-modal';

        overlay.innerHTML = `
            <div class="bootstrap-modal-content">
                <button class="bootstrap-close" onclick="this.closest('.bootstrap-modal').remove()">✕</button>
                ${this.generateTimelineHTML()}
            </div>
        `;

        document.body.appendChild(overlay);

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        console.log('📜 Bootstrap timeline modal opened');
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    getTotalAttempts() {
        return this.timeline.attempts.length;
    }

    getLastAttempt() {
        return this.timeline.attempts[0] || null;
    }

    reset() {
        this.timeline = {
            currentAttempt: 848,
            attempts: []
        };
        this.saveTimeline();
        console.log('📜 Bootstrap timeline reset to defaults');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootstrapTracker;
}
