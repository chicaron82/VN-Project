
import { StateManager } from '@core/StateManager';

export interface BootstrapAttempt {
    number: number;
    result: 'failed' | 'succeeded';
    reason: string;
    route: 'ronnie' | 'tori' | 'unknown';
    endingType: 'bad' | 'digitalForever' | 'true' | 'corrupted';
    timestamp: number | null;
    dateString: string;
}

export interface BootstrapTimeline {
    currentAttempt: number;
    attempts: BootstrapAttempt[];
}

/**
 * BootstrapTracker
 *
 * Tracks the "Bootstrap Paradox" timeline (attempt history).
 * Mirroring V1 logic: keeps last 5 attempts, supports "corrupted" history.
 *
 * V2 ENHANCEMENTS:
 * - Full display system with modal UI
 * - HTML generation for timeline visualization
 * - Lore-appropriate memory degradation display
 * - EventBus integration ready
 *
 * "Tracking your attempts through the loop."
 * 848 is sacred. 💚🔥💀
 */
export class BootstrapTracker {
    private stateManager: StateManager;
    private timeline: BootstrapTimeline;
    private readonly STORAGE_KEY = 'uv7_bootstrap_timeline';
    private readonly MAX_ATTEMPTS = 5;

    constructor(stateManager: StateManager) {
        this.stateManager = stateManager;
        this.timeline = this.loadTimeline();

        // Sync current attempt to state manager for easy access
        this.stateManager.set('game.loopVersion', this.timeline.currentAttempt);

        console.log('📜 Bootstrap tracker initialized');
        console.log(`Current attempt: #${this.timeline.currentAttempt}`);
    }

    private loadTimeline(): BootstrapTimeline {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load bootstrap timeline:', e);
        }

        return this.createDefaultTimeline();
    }

    private createDefaultTimeline(): BootstrapTimeline {
        // Pre-populate with corrupted history (Lore: Attempts 843-847)
        return {
            currentAttempt: 848,
            attempts: [
                { number: 847, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 846, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 845, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 844, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' },
                { number: 843, result: 'failed', reason: '[DATA CORRUPTED]', route: 'unknown', endingType: 'corrupted', timestamp: null, dateString: '[UNREADABLE]' }
            ]
        };
    }

    private saveTimeline(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.timeline));
            // Sync state
            this.stateManager.set('game.loopVersion', this.timeline.currentAttempt);
        } catch (e) {
            console.error('Failed to save bootstrap timeline:', e);
        }
    }

    public recordAttempt(
        result: 'failed' | 'succeeded',
        reason: string,
        route: 'ronnie' | 'tori',
        endingType: 'bad' | 'digitalForever' | 'true'
    ): void {
        const attempt: BootstrapAttempt = {
            number: this.timeline.currentAttempt,
            result,
            reason,
            route,
            endingType,
            timestamp: Date.now(),
            dateString: new Date().toLocaleString()
        };

        // Add to beginning
        this.timeline.attempts.unshift(attempt);

        // Limit size
        if (this.timeline.attempts.length > this.MAX_ATTEMPTS) {
            this.timeline.attempts = this.timeline.attempts.slice(0, this.MAX_ATTEMPTS);
        }

        // Increment attempt counter for NEXT run
        this.timeline.currentAttempt++;

        this.saveTimeline();
        console.log(`📝 Recorded attempt #${attempt.number}: ${result} - ${reason}`);
    }

    /**
     * Manually increment attempt counter (e.g. on simple retry without full record)
     */
    public incrementAttempt(): void {
        this.timeline.currentAttempt++;
        this.saveTimeline();
    }

    public getHistory(): Readonly<BootstrapTimeline> {
        return this.timeline;
    }

    public getCurrentAttempt(): number {
        return this.timeline.currentAttempt;
    }

    public reset(): void {
        this.timeline = this.createDefaultTimeline();
        this.saveTimeline();
    }

    // ========================================
    // DISPLAY SYSTEM
    // ========================================

    /**
     * Show bootstrap timeline modal
     * Displays full attempt history with visual timeline
     */
    public showTimelineModal(): void {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'bootstrap-timeline-modal';
        overlay.className = 'bootstrap-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        overlay.innerHTML = `
            <div class="bootstrap-modal-content" style="
                background: #1a1a2e;
                border: 2px solid #00ff88;
                border-radius: 12px;
                padding: 40px;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 30px #00ff8840;
            ">
                <button class="bootstrap-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: transparent;
                    border: 2px solid #00ff88;
                    color: #00ff88;
                    font-size: 1.5em;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    transition: all 0.2s ease;
                ">✕</button>
                ${this.generateTimelineHTML()}
            </div>
        `;

        document.body.appendChild(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Close button handler
        const closeBtn = overlay.querySelector('.bootstrap-close');
        closeBtn?.addEventListener('click', () => {
            this.closeModal(overlay);
        });

        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
            }
        });

        // Close on ESC
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.closeModal(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        console.log('📜 Bootstrap timeline modal opened');
    }

    /**
     * Close modal with fade-out animation
     */
    private closeModal(overlay: HTMLElement): void {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    /**
     * Generate timeline HTML
     */
    private generateTimelineHTML(): string {
        let html = '<div class="bootstrap-timeline" style="color: #fff; font-family: \'Courier New\', monospace;">';

        // Header
        html += `
            <div class="timeline-header" style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #00ff88; font-size: 2em; margin-bottom: 10px; text-shadow: 0 0 10px #00ff8840;">
                    BOOTSTRAP PARADOX TIMELINE
                </h3>
                <p class="timeline-subtitle" style="color: #888; font-size: 0.95em;">
                    Tracking your attempts through the loop
                </p>
            </div>
        `;

        // Current attempt (always shown)
        html += `
            <div class="timeline-entry current" style="
                background: #00ff8820;
                border: 2px solid #00ff88;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            ">
                <div class="entry-number" style="color: #00ff88; font-weight: bold; margin-bottom: 5px;">
                    Attempt #${this.timeline.currentAttempt} (Current)
                </div>
                <div class="entry-status" style="color: #fff;">
                    [ACTIVE] You are here
                </div>
            </div>
        `;

        // Last 5 attempts (including corrupted entries)
        this.timeline.attempts.forEach((attempt) => {
            if (attempt.endingType === 'corrupted') {
                html += this.generateCorruptedEntryHTML(attempt);
            } else {
                html += this.generateNormalEntryHTML(attempt);
            }
        });

        // Degraded attempts message
        const oldestInWindow = this.timeline.attempts.length > 0
            ? this.timeline.attempts[this.timeline.attempts.length - 1].number
            : this.timeline.currentAttempt;

        if (oldestInWindow > 1) {
            html += `
                <div class="timeline-entry degraded" style="
                    background: #ff006620;
                    border: 2px solid #ff0066;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 15px;
                ">
                    <div class="entry-status degraded-text" style="color: #ff0066; text-align: center; font-size: 0.9em;">
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

    /**
     * Generate HTML for corrupted entry
     */
    private generateCorruptedEntryHTML(attempt: BootstrapAttempt): string {
        return `
            <div class="timeline-entry corrupted" style="
                background: #88888820;
                border: 2px solid #888;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                opacity: 0.6;
            ">
                <div class="entry-number" style="color: #888; font-weight: bold; margin-bottom: 5px;">
                    Attempt #${attempt.number}
                </div>
                <div class="entry-status corrupted-text" style="color: #888;">
                    ✗ Failed: [DATA CORRUPTED]
                    <div class="entry-meta" style="margin-top: 0.5em; font-size: 0.85em;">
                        <span class="entry-date">Date: [UNREADABLE]</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for normal entry
     */
    private generateNormalEntryHTML(attempt: BootstrapAttempt): string {
        const resultIcon = this.getResultIcon(attempt.result, attempt.endingType);
        const color = this.getEntryColor(attempt.result, attempt.endingType);

        return `
            <div class="timeline-entry" style="
                background: ${color}20;
                border: 2px solid ${color};
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            ">
                <div class="entry-number" style="color: ${color}; font-weight: bold; margin-bottom: 5px;">
                    Attempt #${attempt.number}
                </div>
                <div class="entry-details">
                    <div class="entry-result" style="color: #fff; margin-bottom: 8px;">
                        ${resultIcon} ${this.capitalizeFirst(attempt.result)}: ${attempt.reason}
                    </div>
                    <div class="entry-meta" style="color: #888; font-size: 0.85em;">
                        <span class="entry-date" style="margin-right: 15px;">Date: ${attempt.dateString}</span>
                        <span class="entry-route">Route: ${this.getRouteName(attempt.route)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get result icon
     */
    private getResultIcon(result: string, endingType: string): string {
        if (result === 'succeeded') {
            return endingType === 'true' ? '✓' : '◐';
        }
        return '✗';
    }

    /**
     * Get entry color based on result
     */
    private getEntryColor(result: string, endingType: string): string {
        if (endingType === 'corrupted') {
            return '#888';
        }
        if (result === 'succeeded') {
            return endingType === 'true' ? '#00ff88' : '#00ccff';
        }
        return '#ff0066';
    }

    /**
     * Capitalize first letter
     */
    private capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get display name for route
     */
    private getRouteName(route: string): string {
        if (route === 'unknown') {
            return '[UNKNOWN]';
        }
        return route === 'ronnie' ? "Ronnie's Perspective" : "Tori's Perspective";
    }
}
