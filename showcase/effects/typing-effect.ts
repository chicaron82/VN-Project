/**
 * typing-effect.ts
 * Adds a hacker-style typing effect to the home banner subtitle.
 */

export function initTypingEffect(): void {
    const subtitle = document.querySelector('.hero-banner-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.textContent || '';
    subtitle.textContent = ''; // Clear text initially
    (subtitle as HTMLElement).style.opacity = '1'; /* Ensure it's visible for typing */

    let i = 0;
    const speed = 50; // ms per char

    function typeWriter(): void {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Add a blinking cursor at the end
            (subtitle as HTMLElement).style.borderRight = '3px solid var(--accent-blue, #4a9eff)';
            subtitle.classList.add('typing-done');
        }
    }

    // Start after a slight delay
    setTimeout(typeWriter, 800);
}
