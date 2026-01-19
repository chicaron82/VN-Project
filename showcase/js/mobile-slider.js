/**
 * Mobile Slider Controller
 * Handles vertical slider for portrait and horizontal slider for landscape
 * Includes haptic feedback and smooth touch interactions
 */

class MobileSliderController {
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
        this.isPortrait = window.matchMedia('(orientation: portrait)').matches;
        this.hasInteracted = false; // Track user interaction for haptic feedback

        // Enable haptic feedback after first interaction
        document.addEventListener('touchstart', () => {
            this.hasInteracted = true;
        }, { once: true });

        this.init();
    }

    init() {
        // Only initialize on mobile
        if (window.innerWidth > 768) return;

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

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isPortrait = window.matchMedia('(orientation: portrait)').matches;
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
        this.handle.style.transform = this.isPortrait ?
            'translate(-50%, -50%) scale(1.1)' :
            'translate(-50%, -50%) scale(1.1)';

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
            this.handle.style.transform = 'translate(-50%, -50%) scale(1)';

            // Haptic feedback on release (only if user has interacted)
            if (this.hasInteracted && navigator.vibrate) {
                navigator.vibrate(3);
            }
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.handle.style.transform = this.isPortrait ?
            'translate(-50%, -50%) scale(1.1)' :
            'translate(-50%, -50%) scale(1.1)';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.updateSlider(this.isPortrait ? e.clientY : e.clientX);
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.handle.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }

    updateSlider(clientPosition) {
        const rect = this.container.getBoundingClientRect();

        let percentage;
        if (this.isPortrait) {
            // Vertical slider
            const y = clientPosition - rect.top;
            percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
        } else {
            // Horizontal slider
            const x = clientPosition - rect.left;
            percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        }

        this.currentPosition = percentage;
        this.container.style.setProperty('--slider-position', `${percentage}%`);

        // Haptic feedback at center (50%) - only if user has interacted
        if (this.hasInteracted && navigator.vibrate && Math.abs(percentage - 50) < 2) {
            navigator.vibrate(10);
        }
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileSliderController();
    });
} else {
    new MobileSliderController();
}
