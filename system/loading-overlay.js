/**
 * ========================================
 * LOADING OVERLAY
 * Promise-based cinematic progress overlay
 * ========================================
 * 
 * Usage in routes:
 *   await game.loadingOverlay.playUploadSequence({
 *     title: "Uploading Tori…",
 *     subtitle: "Do not disconnect.",
 *     durationMs: 3200,
 *     skippable: true,
 *     statusLines: ["Preparing...", "Uploading...", "Verifying...", "Complete."]
 *   });
 * 
 * Returns: { reason: "complete" | "skipped" }
 */

class LoadingOverlay {
    constructor(game) {
        this.game = game;
        this.root = document.body;
        this.el = null;
        this._resolve = null;
        this._raf = null;
        this._skipped = false;
        this._onKey = null;

        // Cache DOM refs
        this._bar = null;
        this._status = null;
        this._skipBtn = null;
        this._percentEl = null;

        console.log('🚀 LoadingOverlay initialized');
    }

    /**
     * Play a cinematic upload/progress sequence
     * @param {Object} options
     * @returns {Promise<{reason: string}>}
     */
    playUploadSequence({
        title = "Uploading…",
        subtitle = "Please wait",
        durationMs = 2600,
        skippable = true,
        statusLines = ["Preparing…", "Processing…", "Uploading…", "Verifying…", "Complete."],
        glitchAt = null, // Optional: percent to trigger glitch effect (e.g., 73)
    } = {}) {
        this._skipped = false;

        // Request pause via PauseManager (centralized coordination)
        if (this.game.pauseManager) {
            this.game.pauseManager.request('loadingOverlay');
        }

        // Also stop tether decay specifically (belt and suspenders)
        if (this.game.currentRoute?.tetherSystem) {
            this.game.currentRoute.tetherSystem.stopDecay();
        }

        this._mount({ title, subtitle, skippable });

        return new Promise((resolve) => {
            this._resolve = resolve;

            const start = performance.now();
            const end = start + durationMs;

            const tick = (now) => {
                if (this._skipped) return;

                const t = Math.min(1, (now - start) / (end - start));

                // Eased progress - fast start, slow middle, snap at end
                let eased;
                if (t < 0.3) {
                    // Fast start
                    eased = t * 2;
                } else if (t < 0.9) {
                    // Slow crawl
                    eased = 0.6 + (t - 0.3) * 0.5;
                } else {
                    // Snap to finish
                    eased = 0.9 + (t - 0.9) * 1;
                }
                eased = Math.min(1, eased);

                const percent = Math.floor(eased * 100);
                this._setProgress(percent);

                // Status line by thresholds
                const idx = Math.min(
                    statusLines.length - 1,
                    Math.floor((percent / 100) * statusLines.length)
                );
                this._setStatus(statusLines[idx]);

                // Optional glitch effect
                if (glitchAt && percent === glitchAt && !this._glitched) {
                    this._glitched = true;
                    this._triggerGlitch();
                }

                if (t >= 1) {
                    this.close({ reason: "complete" });
                    return;
                }
                this._raf = requestAnimationFrame(tick);
            };

            this._raf = requestAnimationFrame(tick);

            if (skippable) this._bindSkip();
        });
    }

    /**
     * Skip the current sequence
     */
    skip() {
        if (!this.el || this._skipped) return;
        this._skipped = true;
        this.close({ reason: "skipped" });
    }

    /**
     * Close the overlay and resolve the promise
     */
    if(this._raf) cancelAnimationFrame(this._raf);
        this._raf = null;

// Release pause via PauseManager
if (this.game.pauseManager) {
    this.game.pauseManager.release('loadingOverlay');
}

// Also resume tether decay specifically
if (this.game.currentRoute?.tetherSystem) {
    this.game.currentRoute.tetherSystem.startDecay();
}

this._unmount();

if (this._resolve) {
    const r = this._resolve;
    this._resolve = null;
    r({ reason });
}
    }

/**
 * Mount the overlay DOM
 */
_mount({ title, subtitle, skippable }) {
    this.el = document.createElement("div");
    this.el.className = "loading-overlay";
    this.el.innerHTML = `
            <div class="loading-card" role="dialog" aria-modal="true" aria-label="Progress">
                <div class="loading-icon">⬆</div>
                <div class="loading-title">${title}</div>
                <div class="loading-subtitle">${subtitle}</div>
                <div class="loading-bar-wrap" aria-label="Progress">
                    <div class="loading-bar" style="width:0%"></div>
                </div>
                <div class="loading-info">
                    <span class="loading-status">Starting…</span>
                    <span class="loading-percent">0%</span>
                </div>
                ${skippable ? `<button class="loading-skip" type="button">Skip ▶</button>` : ``}
            </div>
        `;

    this.root.appendChild(this.el);
    this._cacheRefs();

    // Trigger animation
    requestAnimationFrame(() => {
        if (this.el) this.el.classList.add("is-active");
    });
}

/**
 * Cache DOM references
 */
_cacheRefs() {
    this._bar = this.el.querySelector(".loading-bar");
    this._status = this.el.querySelector(".loading-status");
    this._skipBtn = this.el.querySelector(".loading-skip");
    this._percentEl = this.el.querySelector(".loading-percent");
    this._glitched = false;
}

/**
 * Update progress bar
 */
_setProgress(percent) {
    if (!this._bar) return;
    this._bar.style.width = `${percent}%`;
    if (this._percentEl) {
        this._percentEl.textContent = `${percent}%`;
    }
}

/**
 * Update status text
 */
_setStatus(text) {
    if (this._status) this._status.textContent = text;
}

/**
 * Trigger glitch effect
 */
_triggerGlitch() {
    if (!this.el) return;
    const card = this.el.querySelector('.loading-card');
    if (card) {
        card.classList.add('glitch');
        setTimeout(() => card.classList.remove('glitch'), 300);
    }
}

/**
 * Bind skip handlers
 */
_bindSkip() {
    // Skip button click
    if (this._skipBtn) {
        this._skipBtn.addEventListener("click", () => this.skip(), { once: true });
    }

    // Keyboard (Escape / Space / Enter)
    this._onKey = (e) => {
        if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
            e.preventDefault();
            this.skip();
        }
    };
    window.addEventListener("keydown", this._onKey);

    // Tap anywhere on overlay (not card)
    this.el.addEventListener("click", (e) => {
        if (e.target === this.el) this.skip();
    }, { once: true });
}

/**
 * Unmount and cleanup
 */
_unmount() {
    if (this._onKey) {
        window.removeEventListener("keydown", this._onKey);
        this._onKey = null;
    }

    if (!this.el) return;

    this.el.classList.remove("is-active");

    // Delay removal for fade out
    setTimeout(() => {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }, 200);
}
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.LoadingOverlay = LoadingOverlay;
}

// ES Module export
export { LoadingOverlay };
