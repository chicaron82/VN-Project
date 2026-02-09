/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE PLAYBACK
 *
 * Phase 8: Auto-scroll through timeline with playback controls
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Play/pause auto-scroll through timeline
 * - Adjustable speed (0.5x, 1x, 2x, 3x)
 * - Progress indicator
 * - Skip to next/previous entry
 * - Pause on hover
 * - Keyboard shortcuts (Space, ←/→)
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export class BlogPlayback {
    private isPlaying: boolean;
    private currentIndex: number;
    private playbackSpeed: number; // Multiplier: 0.5x, 1x, 2x, 3x
    private baseInterval: number; // Base time between entries (ms)
    private playbackInterval?: number;
    private entries: HTMLElement[];
    private controls: HTMLElement | null;
    private progressBar: HTMLElement | null;
    private pauseOnHover: boolean;

    constructor(
        private timelineSelector: string = '.timeline-phases',
        private baseSpeed: number = 3000 // 3 seconds per entry at 1x speed
    ) {
        this.isPlaying = false;
        this.currentIndex = 0;
        this.playbackSpeed = 1;
        this.baseInterval = baseSpeed;
        this.entries = [];
        this.controls = null;
        this.progressBar = null;
        this.pauseOnHover = true;

        this.init();
    }

    private init(): void {
        this.indexEntries();
        this.createControls();
        this.attachKeyboardShortcuts();
        this.attachHoverPause();
        Logger.ui('▶️ [BlogPlayback] Initialized with', this.entries.length, 'entries');
    }

    /**
     * Index all timeline entries
     */
    private indexEntries(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        this.entries = Array.from(timeline.querySelectorAll('.timeline-item')) as HTMLElement[];
    }

    /**
     * Create playback controls UI
     */
    private createControls(): void {
        this.controls = document.createElement('div');
        this.controls.className = 'timeline-playback-controls';
        this.controls.innerHTML = `
            <div class="playback-buttons">
                <button class="playback-btn" data-action="prev" title="Previous (←)">
                    <span>⏮</span>
                </button>
                <button class="playback-btn playback-play" data-action="play" title="Play/Pause (Space)">
                    <span class="play-icon">▶</span>
                    <span class="pause-icon" style="display: none;">⏸</span>
                </button>
                <button class="playback-btn" data-action="next" title="Next (→)">
                    <span>⏭</span>
                </button>
            </div>
            <div class="playback-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">
                    <span class="current-entry">0</span> / <span class="total-entries">${this.entries.length}</span>
                </div>
            </div>
            <div class="playback-speed">
                <button class="speed-btn" data-speed="0.5">0.5x</button>
                <button class="speed-btn active" data-speed="1">1x</button>
                <button class="speed-btn" data-speed="2">2x</button>
                <button class="speed-btn" data-speed="3">3x</button>
            </div>
        `;

        // Insert controls before timeline
        const timeline = document.querySelector(this.timelineSelector);
        if (timeline && timeline.parentElement) {
            timeline.parentElement.insertBefore(this.controls, timeline);
        }

        this.progressBar = this.controls.querySelector('.progress-fill');

        // Attach control listeners
        this.attachControlListeners();
    }

    /**
     * Attach event listeners to controls
     */
    private attachControlListeners(): void {
        if (!this.controls) return;

        // Play/pause button
        const playBtn = this.controls.querySelector('[data-action="play"]');
        playBtn?.addEventListener('click', () => this.togglePlayback());

        // Previous button
        const prevBtn = this.controls.querySelector('[data-action="prev"]');
        prevBtn?.addEventListener('click', () => this.previous());

        // Next button
        const nextBtn = this.controls.querySelector('[data-action="next"]');
        nextBtn?.addEventListener('click', () => this.next());

        // Speed buttons
        const speedBtns = this.controls.querySelectorAll('.speed-btn');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.getAttribute('data-speed') || '1');
                this.setSpeed(speed);

                // Update active state
                speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Attach keyboard shortcuts
     */
    private attachKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if ((e.target as HTMLElement).tagName === 'INPUT' ||
                (e.target as HTMLElement).tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case ' ': // Space = play/pause
                    e.preventDefault();
                    this.togglePlayback();
                    break;
                case 'ArrowLeft': // ← = previous
                    e.preventDefault();
                    this.previous();
                    break;
                case 'ArrowRight': // → = next
                    e.preventDefault();
                    this.next();
                    break;
            }
        });
    }

    /**
     * Attach hover pause functionality
     */
    private attachHoverPause(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        timeline.addEventListener('mouseenter', () => {
            if (this.pauseOnHover && this.isPlaying) {
                this.pause();
            }
        });

        timeline.addEventListener('mouseleave', () => {
            if (this.pauseOnHover && !this.isPlaying) {
                this.play();
            }
        });
    }

    /**
     * Toggle play/pause
     */
    private togglePlayback(): void {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Start playback
     */
    private play(): void {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.updatePlayButton();

        // Start from current index
        this.playbackInterval = window.setInterval(() => {
            this.next();

            // Stop at end
            if (this.currentIndex >= this.entries.length - 1) {
                this.pause();
                this.currentIndex = 0; // Reset for next play
            }
        }, this.baseInterval / this.playbackSpeed);

        Logger.ui('▶️ [BlogPlayback] Playing at', this.playbackSpeed + 'x speed');
    }

    /**
     * Pause playback
     */
    private pause(): void {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        this.updatePlayButton();

        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
        }

        Logger.ui('⏸ [BlogPlayback] Paused');
    }

    /**
     * Go to next entry
     */
    private next(): void {
        if (this.currentIndex < this.entries.length - 1) {
            this.currentIndex++;
            this.scrollToEntry(this.currentIndex);
            this.updateProgress();
        }
    }

    /**
     * Go to previous entry
     */
    private previous(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollToEntry(this.currentIndex);
            this.updateProgress();
        }
    }

    /**
     * Scroll to specific entry
     */
    private scrollToEntry(index: number): void {
        const entry = this.entries[index];
        if (!entry) return;

        entry.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Highlight current entry
        this.entries.forEach((e, i) => {
            if (i === index) {
                e.classList.add('playback-active');
            } else {
                e.classList.remove('playback-active');
            }
        });
    }

    /**
     * Set playback speed
     */
    private setSpeed(speed: number): void {
        this.playbackSpeed = speed;

        // Restart interval if playing
        if (this.isPlaying) {
            this.pause();
            this.play();
        }

        Logger.ui('⚡ [BlogPlayback] Speed set to', speed + 'x');
    }

    /**
     * Update play/pause button icon
     */
    private updatePlayButton(): void {
        if (!this.controls) return;

        const playIcon = this.controls.querySelector('.play-icon') as HTMLElement;
        const pauseIcon = this.controls.querySelector('.pause-icon') as HTMLElement;

        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    /**
     * Update progress bar and text
     */
    private updateProgress(): void {
        if (!this.controls || !this.progressBar) return;

        const progress = ((this.currentIndex + 1) / this.entries.length) * 100;
        this.progressBar.style.width = `${progress}%`;

        const currentText = this.controls.querySelector('.current-entry');
        if (currentText) {
            currentText.textContent = (this.currentIndex + 1).toString();
        }
    }

    /**
     * Destroy and cleanup
     */
    public destroy(): void {
        this.pause();
        if (this.controls) {
            this.controls.remove();
            this.controls = null;
        }
        Logger.ui('▶️ [BlogPlayback] Destroyed');
    }
}
