/**
 * typing-effect.js
 * Adds a hacker-style typing effect to the home banner subtitle.
 */

document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-banner-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.textContent;
    subtitle.textContent = ''; // Clear text initially
    subtitle.style.opacity = '1'; /* Ensure it's visible for typing */

    let i = 0;
    const speed = 50; // ms per char

    function typeWriter() {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Add a blinking cursor at the end
            subtitle.style.borderRight = '3px solid var(--accent-blue, #4a9eff)';
            subtitle.classList.add('typing-done');
        }
    }

    // Start after a slight delay
    setTimeout(typeWriter, 800);
});
