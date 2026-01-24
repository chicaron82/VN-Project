/**
 * landing-tilt.js
 * Adds a premium 3D tilt effect to the landing page hero logo.
 */

document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const logo = document.querySelector('.main-brand-logo');

    if (!hero || !logo) return;

    // Config
    const limits = 20; // Max rotation in degrees (more aggressive for landing)
    const perspective = 1200;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = x / rect.width;
        const yPct = y / rect.height;

        const xRotation = (yPct - 0.5) * -limits;
        const yRotation = (xPct - 0.5) * limits;

        // Tilt the logo
        logo.style.transform = `
            perspective(${perspective}px) 
            rotateX(${xRotation}deg) 
            rotateY(${yRotation}deg) 
            scale(1.1)
        `;

        // Also subtle tilt to the glow
        const glow = document.querySelector('.brand-glow');
        if (glow) {
            glow.style.transform = `
                perspective(${perspective}px) 
                translateZ(-50px)
                rotateX(${xRotation * 0.5}deg) 
                rotateY(${yRotation * 0.5}deg) 
                scale(1.2)
            `;
        }
    });

    hero.addEventListener('mouseleave', () => {
        logo.style.transform = `
            perspective(${perspective}px) 
            rotateX(0deg) 
            rotateY(0deg) 
            scale(1)
        `;

        const glow = document.querySelector('.brand-glow');
        if (glow) {
            glow.style.transform = ''; // Return to CSS animation
        }
    });

    logo.style.transition = 'transform 0.2s ease-out';
});
