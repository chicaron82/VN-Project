/**
 * UX Enhancements
 * Handles Back to Top button and Slider Interaction Hints
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initSliderHint();
});

function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    // Show/Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initSliderHint() {
    const knob = document.querySelector('.slider-knob');
    if (!knob) return;

    // Add hint class initially
    // Check if user has already interacted in this session
    if (!sessionStorage.getItem('uv7-slider-interacted')) {
        knob.classList.add('hint');
    }

    // Remove hint on first interaction
    const removeHint = () => {
        knob.classList.remove('hint');
        sessionStorage.setItem('uv7-slider-interacted', 'true');

        // Remove listeners
        knob.removeEventListener('mousedown', removeHint);
        knob.removeEventListener('touchstart', removeHint);
        document.removeEventListener('keydown', removeHint); // if they use arrow keys
    };

    knob.addEventListener('mousedown', removeHint);
    knob.addEventListener('touchstart', removeHint, { passive: true });

    // Also remove if they use arrow keys on the slider
    knob.addEventListener('keydown', removeHint);
}
