/**
 * Developer Mode Toggle Handler
 * 
 * Wires up the developer mode toggle in the shade settings.
 * Uses custom events to communicate with ChromeDevTools.
 */

import { Logger } from '@utils/Logger';

function initDeveloperModeToggle(): void {
    const toggle = document.getElementById('developer-mode-toggle');
    if (!toggle) {
        return; // Shade not created yet
    }

    // Check if already initialized
    if (toggle.hasAttribute('data-initialized')) {
        return;
    }
    toggle.setAttribute('data-initialized', 'true');

    // Set initial state from localStorage
    const isEnabled = localStorage.getItem('uv7-developer-mode') === 'true';
    if (isEnabled) {
        toggle.classList.add('active');
    }

    // Handle toggle clicks
    toggle.addEventListener('click', () => {
        const currentlyEnabled = toggle.classList.contains('active');

        if (currentlyEnabled) {
            // Disable developer mode
            toggle.classList.remove('active');
            localStorage.setItem('uv7-developer-mode', 'false');

            // Hide floating button
            const floatingBtn = document.getElementById('devtools-floating-toggle');
            if (floatingBtn) {
                floatingBtn.style.display = 'none';
            }
        } else {
            // Enable developer mode
            toggle.classList.add('active');
            localStorage.setItem('uv7-developer-mode', 'true');

            // Show floating button
            const floatingBtn = document.getElementById('devtools-floating-toggle');
            if (floatingBtn) {
                floatingBtn.style.display = 'flex';
            }
        }

        Logger.system('[DeveloperMode] Toggle changed to:', !currentlyEnabled);
    });

    Logger.system('[DeveloperMode] Toggle initialized, current state:', isEnabled);
}

// Try immediately
initDeveloperModeToggle();

// Also watch for shade to be created dynamically
const observer = new MutationObserver(() => {
    if (document.getElementById('developer-mode-toggle')) {
        initDeveloperModeToggle();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
