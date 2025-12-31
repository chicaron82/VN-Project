/**
 * ========================================
 * ASSET LOADER
 * Real asset preloading with progress events
 * ========================================
 * 
 * Emits:
 *   - 'assetprogress' { percent, loaded, total }
 *   - 'assetcomplete' { loaded, failed, total }
 * 
 * Usage:
 *   const loader = new AssetLoader();
 *   loader.on('assetprogress', e => console.log(e.detail.percent));
 *   await loader.preload(['img1.png', 'img2.png']);
 */

class AssetLoader extends EventTarget {
    constructor() {
        super();
        this.loaded = 0;
        this.failed = 0;
        this.total = 0;
        this.displayedProgress = 0;
        this.targetProgress = 0;
        this.interpolationFrame = null;
    }

    /**
     * Preload an array of asset URLs
     * @param {string[]} assetUrls - Array of URLs to preload
     * @returns {Promise<{loaded: number, failed: number, total: number}>}
     */
    preload(assetUrls) {
        return new Promise((resolve) => {
            this.loaded = 0;
            this.failed = 0;
            this.total = assetUrls.length;
            this.displayedProgress = 0;
            this.targetProgress = 0;

            if (this.total === 0) {
                this._emitProgress(100);
                this._emitComplete();
                resolve({ loaded: 0, failed: 0, total: 0 });
                return;
            }

            // Start smooth interpolation loop
            this._startInterpolation();

            const checkComplete = () => {
                if (this.loaded + this.failed >= this.total) {
                    // All assets processed - snap to 100%
                    this.targetProgress = 100;

                    // Wait for interpolation to catch up, then complete
                    setTimeout(() => {
                        this._stopInterpolation();
                        this._emitProgress(100);
                        this._emitComplete();
                        resolve({
                            loaded: this.loaded,
                            failed: this.failed,
                            total: this.total
                        });
                    }, 150); // Small delay for final animation
                }
            };

            assetUrls.forEach(url => {
                this._loadAsset(url)
                    .then(() => {
                        this.loaded++;
                        this.targetProgress = (this.loaded / this.total) * 100;
                        checkComplete();
                    })
                    .catch((err) => {
                        console.warn(`[AssetLoader] Failed to load: ${url}`, err);
                        this.failed++;
                        this.targetProgress = ((this.loaded + this.failed) / this.total) * 100;
                        checkComplete();
                    });
            });
        });
    }

    /**
     * Load a single asset based on file extension
     * @private
     */
    _loadAsset(url) {
        const ext = url.split('.').pop()?.toLowerCase();

        if (['mp3', 'ogg', 'wav', 'm4a'].includes(ext)) {
            return this._loadAudio(url);
        } else {
            return this._loadImage(url);
        }
    }

    /**
     * Load an image
     * @private
     */
    _loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Image load failed: ${url}`));
            img.src = url;
        });
    }

    /**
     * Load an audio file
     * @private
     */
    _loadAudio(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Audio load failed: ${url}`));
            audio.src = url;
            audio.load();
        });
    }

    /**
     * Start smooth progress interpolation
     * @private
     */
    _startInterpolation() {
        const interpolate = () => {
            // Ease toward target (smooth out jumpy progress)
            const diff = this.targetProgress - this.displayedProgress;
            const step = diff * 0.15; // Easing factor

            if (Math.abs(diff) > 0.5) {
                this.displayedProgress += step;
                this._emitProgress(Math.round(this.displayedProgress));
            }

            this.interpolationFrame = requestAnimationFrame(interpolate);
        };

        this.interpolationFrame = requestAnimationFrame(interpolate);
    }

    /**
     * Stop interpolation loop
     * @private
     */
    _stopInterpolation() {
        if (this.interpolationFrame) {
            cancelAnimationFrame(this.interpolationFrame);
            this.interpolationFrame = null;
        }
    }

    /**
     * Emit progress event
     * @private
     */
    _emitProgress(percent) {
        this.dispatchEvent(new CustomEvent('assetprogress', {
            detail: {
                percent: Math.min(100, Math.max(0, percent)),
                loaded: this.loaded,
                total: this.total
            }
        }));
    }

    /**
     * Emit complete event
     * @private
     */
    _emitComplete() {
        this.dispatchEvent(new CustomEvent('assetcomplete', {
            detail: {
                loaded: this.loaded,
                failed: this.failed,
                total: this.total
            }
        }));
    }

    /**
     * Convenience method: listen to events
     * @param {string} event - 'assetprogress' or 'assetcomplete'
     * @param {Function} callback
     */
    on(event, callback) {
        this.addEventListener(event, callback);
        return this; // Chainable
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        this.removeEventListener(event, callback);
        return this;
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.AssetLoader = AssetLoader;
}

// ES Module export
export { AssetLoader };
