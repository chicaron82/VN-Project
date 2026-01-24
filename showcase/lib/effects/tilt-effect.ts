/**
 * tilt-effect.ts
 * Adds a premium 3D tilt effect to the home hero banner image.
 */

export function initTiltEffect(): void {
    const banner = document.querySelector('.hero-banner.home');
    const image = document.querySelector('.hero-banner.home .hero-banner-image') as HTMLElement;

    if (!banner || !image) return;

    // Config
    const limits = 15; // Max rotation in degrees
    const perspective = 1000;

    banner.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = banner.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        // Calculate percentages
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        // Calculate rotation
        // (0,0) should rotate (-limits, limits)
        // (1,1) should rotate (limits, -limits)
        const xRotation = (yPct - 0.5) * -limits; // Rotate X axis based on Y movement
        const yRotation = (xPct - 0.5) * limits;  // Rotate Y axis based on X movement

        // Apply transform
        // We also translateZ to make it pop out a bit
        image.style.transform = `
            perspective(${perspective}px)
            rotateX(${xRotation}deg)
            rotateY(${yRotation}deg)
            scale(1.05)
        `;
    });

    banner.addEventListener('mouseleave', () => {
        // Reset
        image.style.transform = `
            perspective(${perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;
    });

    // Smooth transition
    image.style.transition = 'transform 0.1s ease-out';
}
