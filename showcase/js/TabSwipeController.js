// @ts-check
/**
 * ═══════════════════════════════════════════════════════════════
 * TAB SWIPE CONTROLLER v2 - CSS Scroll-Snap Based
 * ═══════════════════════════════════════════════════════════════
 * 
 * Rebuilt from scratch using CSS scroll-snap for native feel.
 * 
 * How it works:
 * - Container is a horizontal scroll container with scroll-snap
 * - Panels are 100% width, laid out side-by-side
 * - Browser handles the 1:1 finger tracking and physics
 * - JS only syncs the indicator and notifies TabController
 * 
 * This approach lets the platform handle the hard stuff (momentum,
 * rubber-banding, smooth scrolling) while we handle the state.
 * ═══════════════════════════════════════════════════════════════
 */

export class TabSwipeController {
    /**
     * @param {Object} config
     * @param {HTMLElement} config.container - The scroll container
     * @param {NodeListOf<HTMLElement>} config.panels - Tab panels
     * @param {HTMLElement} config.indicator - Tab indicator element
     * @param {HTMLElement} config.tabBar - Tab bar element
     * @param {Function} config.onTabChange - Called with new index on swipe
     * @param {Function} config.getCurrentIndex - Returns current tab index
     */
    constructor(config) {
        this.container = config.container;
        this.panels = config.panels;
        this.indicator = config.indicator;
        this.tabBar = config.tabBar;
        this.onTabChange = config.onTabChange;
        this.getCurrentIndex = config.getCurrentIndex;

        this.tabCount = this.panels.length;
        this.scrollTimeout = null;
        this.lastIndex = 0;
        this.isUserScrolling = false;
        this.isProgrammaticScroll = false;

        this.init();
    }

    init() {
        // Enable swipe CSS layout
        this.container.classList.add('swipe-enabled');

        // Get initial index and scroll to it
        this.lastIndex = this.getCurrentIndex();
        
        // Debug: log panel order
        console.log('📋 Panel order:', Array.from(this.panels).map(p => p.dataset.panel));
        
        // Defer initial scroll to after CSS applies
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.scrollToIndex(this.lastIndex, false);
                this.updateIndicator();
                
                // Force layout recalculation for all panels
                this.panels.forEach(panel => {
                    panel.style.display = 'block';
                    // Trigger reflow
                    void panel.offsetHeight;
                });
                
                // Trigger resize event for responsive components
                window.dispatchEvent(new Event('resize'));
                
                console.log('✅ TabSwipeController v2 initialized at tab', this.lastIndex);
            });
        });

        // Listen for scroll
        this.container.addEventListener('scroll', this.onScroll, { passive: true });

        // Detect user-initiated scroll
        this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
        this.container.addEventListener('mousedown', this.onMouseDown);

        // Sync on resize
        window.addEventListener('resize', this.onResize);
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    onTouchStart = () => {
        if (!this.isProgrammaticScroll) {
            this.isUserScrolling = true;
        }
    };

    onMouseDown = () => {
        if (!this.isProgrammaticScroll) {
            this.isUserScrolling = true;
        }
    };

    onScroll = () => {
        // Live update indicator
        this.updateIndicator();

        // Debounce end detection
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(this.onScrollEnd, 100);
    };

    onScrollEnd = () => {
        const newIndex = this.getVisibleIndex();
        
        // Only notify if user swiped (not programmatic)
        if (newIndex !== this.lastIndex && this.isUserScrolling) {
            // Prevent skipping multiple panels - only allow movement of 1 panel at a time
            const diff = newIndex - this.lastIndex;
            const correctedIndex = this.lastIndex + (diff > 0 ? 1 : (diff < 0 ? -1 : 0));
            
            if (correctedIndex !== newIndex) {
                console.log(`🛑 Prevented skip: ${this.lastIndex} → ${newIndex}, correcting to ${correctedIndex}`);
                this.scrollToIndex(correctedIndex, true);
                this.lastIndex = correctedIndex;
                this.onTabChange(correctedIndex);
            } else {
                console.log(`👆 Swipe: ${this.lastIndex} → ${newIndex}`);
                this.lastIndex = newIndex;
                this.onTabChange(newIndex);
            }
        }

        this.isUserScrolling = false;
        this.isProgrammaticScroll = false;
    };

    onResize = () => {
        this.scrollToIndex(this.lastIndex, false);
        this.updateIndicator();
    };

    // ═══════════════════════════════════════════════════════════════
    // SCROLL CONTROL
    // ═══════════════════════════════════════════════════════════════

    /**
     * Get which panel is most visible
     * @returns {number}
     */
    getVisibleIndex() {
        const w = this.container.offsetWidth;
        if (w === 0) return 0;
        const scrollLeft = this.container.scrollLeft;
        const index = Math.round(scrollLeft / w);
        console.log(`📏 Scroll: ${scrollLeft}px, Width: ${w}px, Index: ${index}`);
        return index;
    }

    /**
     * Scroll to tab index
     * @param {number} index
     * @param {boolean} smooth
     */
    scrollToIndex(index, smooth = true) {
        const w = this.container.offsetWidth;
        const target = index * w;

        this.isProgrammaticScroll = true;
        
        this.container.scrollTo({
            left: target,
            behavior: smooth ? 'smooth' : 'instant'
        });

        this.lastIndex = index;
        console.log(`📍 Scroll to tab ${index} (${target}px)`);
    }

    /**
     * External call to sync position (from TabController)
     * @param {number} index
     */
    syncToTab(index) {
        // Always scroll to ensure we're at the right position
        // The getVisibleIndex check was causing issues when state got out of sync
        this.scrollToIndex(index, true);
    }

    // ═══════════════════════════════════════════════════════════════
    // INDICATOR - Smooth interpolation during scroll
    // ═══════════════════════════════════════════════════════════════

    updateIndicator() {
        if (!this.indicator || !this.tabBar) return;

        const w = this.container.offsetWidth;
        if (w === 0) return;

        // Calculate scroll progress (0 = tab 0, 1 = tab 1, etc)
        const progress = this.container.scrollLeft / w;

        // Get tab buttons for positions
        const btns = this.tabBar.querySelectorAll('[data-tab]');
        if (btns.length === 0) return;

        // Which two tabs are we between?
        const i = Math.floor(progress);
        const j = Math.min(i + 1, btns.length - 1);
        const t = progress - i; // 0-1 interpolation factor

        const btnA = /** @type {HTMLElement} */ (btns[i]);
        const btnB = /** @type {HTMLElement} */ (btns[j]);
        if (!btnA) return;

        const rectA = btnA.getBoundingClientRect();
        const rectB = btnB.getBoundingClientRect();
        const barRect = this.tabBar.getBoundingClientRect();

        // LERP position and width
        const left = rectA.left + (rectB.left - rectA.left) * t - barRect.left;
        const width = rectA.width + (rectB.width - rectA.width) * t;

        this.indicator.style.transform = `translateX(${left}px)`;
        this.indicator.style.width = `${width}px`;
    }

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    destroy() {
        this.container.removeEventListener('scroll', this.onScroll);
        this.container.removeEventListener('touchstart', this.onTouchStart);
        this.container.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('resize', this.onResize);
        this.container.classList.remove('swipe-enabled');
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    }
}
