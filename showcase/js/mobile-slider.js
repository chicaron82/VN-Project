/**
 * Mobile Slider Controller
 * Handles vertical slider for portrait and horizontal slider for landscape
 * Includes haptic feedback and smooth touch interactions
 */

export class MobileSliderController {
    constructor() {
        this.container = document.querySelector('.split-container');
        this.handle = document.querySelector('.slider-handle');
        this.orderLayer = document.querySelector('.layer-order');

        if (!this.container || !this.handle || !this.orderLayer) {
            console.warn('Mobile slider elements not found');
            return;
        }

        this.isDragging = false;
        this.currentPosition = 50; // Start at 50%
        // Match CSS media query exactly: (max-width: 768px) and (orientation: portrait)
        this.isPortrait = window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;
        this.hasInteracted = false; // Track user interaction for haptic feedback

        // Enable haptic feedback after first interaction
        document.addEventListener('touchstart', () => {
            this.hasInteracted = true;
        }, { once: true });

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlider(this.isPortrait ?
            this.container.getBoundingClientRect().height / 2 :
            this.container.getBoundingClientRect().width / 2
        );

        console.log(`🎮 Mobile slider initialized (${this.isPortrait ? 'portrait' : 'landscape'})`);
    }

    setupEventListeners() {
        // Touch events
        this.handle.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Mouse events (for testing in browser DevTools)
        this.handle.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Orientation change - match CSS media query exactly
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isPortrait = window.matchMedia('(max-width: 768px) and (orientation: portrait)').matches;
                this.updateSlider(this.isPortrait ?
                    this.container.getBoundingClientRect().height / 2 :
                    this.container.getBoundingClientRect().width / 2
                );
                console.log(`📱 Orientation changed to ${this.isPortrait ? 'portrait' : 'landscape'}`);
            }, 300);
        });
    }

    handleTouchStart(e) {
        this.isDragging = true;

        // Haptic feedback on grab (only if user has interacted)
        if (this.hasInteracted && navigator.vibrate) {
            navigator.vibrate(5);
        }
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        this.updateSlider(this.isPortrait ? touch.clientY : touch.clientX);
    }

    handleTouchEnd() {
        if (this.isDragging) {
            this.isDragging = false;

            // Haptic feedback on release (only if user has interacted)
            if (this.hasInteracted && navigator.vibrate) {
                navigator.vibrate(3);
            }
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.updateSlider(this.isPortrait ? e.clientY : e.clientX);
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    updateSlider(clientPosition) {
        const rect = this.container.getBoundingClientRect();

        let percentage;
        if (this.isPortrait) {
            // Vertical slider
            const y = clientPosition - rect.top;
            percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));

            // Update clip-path for VERTICAL split
            this.orderLayer.style.clipPath = `polygon(0 ${percentage}%, 100% ${percentage}%, 100% 100%, 0 100%)`;

            // Update handle position (vertical)
            this.handle.style.left = '50%';
            this.handle.style.top = `${percentage}%`;
            this.handle.style.width = '100%';
            this.handle.style.height = '4px';
            this.handle.style.display = 'block';

            // Update knob cursor
            const knob = this.handle.querySelector('.slider-knob');
            if (knob) knob.style.cursor = 'ns-resize';

            console.log(`[Slider] Portrait: ${percentage.toFixed(1)}%`);
        } else {
            // Horizontal slider
            const x = clientPosition - rect.left;
            percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

            // Update clip-path for HORIZONTAL split
            this.orderLayer.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;

            // Update handle position (horizontal)
            this.handle.style.left = `${percentage}%`;
            this.handle.style.top = '0';
            this.handle.style.width = '4px';
            this.handle.style.height = '100%';
            this.handle.style.display = 'block';

            // Update knob cursor
            const knob = this.handle.querySelector('.slider-knob');
            if (knob) knob.style.cursor = 'ew-resize';

            console.log(`[Slider] Landscape: ${percentage.toFixed(1)}%`);
        }

        this.currentPosition = percentage;

        // Haptic feedback at center (50%) - only if user has interacted
        if (this.hasInteracted && navigator.vibrate && Math.abs(percentage - 50) < 2) {
            navigator.vibrate(10);
        }
    }
}

// Initialize on DOM load if not a module (Legacy fallback)
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         new MobileSliderController();
//     });
// } else {
//     new MobileSliderController();
// }
