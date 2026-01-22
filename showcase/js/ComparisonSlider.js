
/**
 * ComparisonSlider.js
 * Handles the "V1 vs V2" split slider logic.
 */
export function initComparisonSlider() {
    // Only run on desktop - MobileSliderController handles mobile
    if (window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches) {
        console.log('📱 Skipping ComparisonSlider (mobile detected)');
        return;
    }

    const sliderContainer = document.querySelector('.split-container');
    const layerOrder = document.querySelector('.layer-order');
    const handle = document.querySelector('.slider-handle');

    if (!sliderContainer || !layerOrder || !handle) return;

    // State
    let isDragging = false;
    let position = 50; // Percentage
    let ticking = false;

    // --- Interaction Handlers ---

    function onPointerDown(e) {
        isDragging = true;
        sliderContainer.style.cursor = 'ew-resize';
        // Prevent default drag behavior for images
        e.preventDefault();
    }

    function onPointerUp() {
        isDragging = false;
        sliderContainer.style.cursor = 'default';
    }

    function onPointerMove(clientX) {
        if (!isDragging) return;

        if (!ticking) {
            requestAnimationFrame(() => {
                const width = window.innerWidth;
                let pct = (clientX / width) * 100;

                // Constraints
                pct = Math.max(0, Math.min(100, pct));

                updateSlider(pct);
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateSlider(pct) {
        position = pct;
        // Update Clip Path for the top layer (Order)
        layerOrder.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
        // Update Handle position
        handle.style.left = `${pct}%`;
    }

    // --- Event Bindings ---

    const knob = handle.querySelector('.slider-knob');

    // Mouse Events
    if (knob) knob.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX));

    // Touch Events
    if (knob) {
        knob.addEventListener('touchstart', (e) => {
            onPointerDown(e);
            // Prevent scrolling when starting drag on handle
            e.preventDefault();
        }, { passive: false });
    }

    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchmove', (e) => {
        onPointerMove(e.touches[0].clientX);
    }, { passive: false });

    // Keyboard Events
    document.addEventListener('keydown', (e) => {
        // Only if slider is relevant (maybe add check later, but parity with script.js means always on)
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            updateSlider(Math.max(0, position - 5));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            updateSlider(Math.min(100, position + 5));
        }
    });

    // Initial Position
    updateSlider(50);
}
