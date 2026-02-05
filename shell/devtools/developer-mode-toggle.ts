/**
 * Developer Mode Toggle Handler
 * 
 * Wires up the developer mode toggle in the shade settings.
 * Uses MutationObserver to wait for the shade to be created.
 */

function initDeveloperModeToggle() {
    const toggle = document.getElementById('developer-mode-toggle');
    if (!toggle) {
        return; // Shade not created yet
    }

    // Get UV7System instance (it's on window in shell mode)
    const system = (window as any).uv7System;
    if (!system || !system.devTools) {
        console.warn('[DeveloperMode] UV7System or DevTools not found');
        return;
    }

    // Set initial state from localStorage
    const isEnabled = localStorage.getItem('uv7-developer-mode') === 'true';
    if (isEnabled) {
        toggle.classList.add('active');
    }

    // Handle toggle clicks
    toggle.addEventListener('click', () => {
        const currentlyEnabled = toggle.classList.contains('active');

        if (currentlyEnabled) {
            toggle.classList.remove('active');
            system.devTools.disableDeveloperMode();
        } else {
            toggle.classList.add('active');
            system.devTools.enableDeveloperMode();
        }
    });

    console.log('[DeveloperMode] Toggle initialized');
}

// Try immediately
initDeveloperModeToggle();

// Also watch for shade to be created dynamically
const observer = new MutationObserver(() => {
    if (document.getElementById('developer-mode-toggle')) {
        initDeveloperModeToggle();
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
