
/**
 * ViewModeController.js
 * Toggles between "Story Mode" and "Dev Mode".
 */
export function initViewMode() {

    function setViewMode(mode) {
        document.body.dataset.viewMode = mode;
        localStorage.setItem('uv7-view-mode', mode);

        // Update toggle button states
        document.querySelectorAll('[data-action="toggle-mode"]').forEach(btn => {
            const label = btn.querySelector('.quick-action-label');
            if (label) label.textContent = mode === 'story' ? 'Switch to Dev' : 'Switch to Story';

            // Also update aria-selected if it's a multi-button toggle
            if (btn.dataset.mode) {
                btn.classList.toggle('active', btn.dataset.mode === mode);
                btn.setAttribute('aria-selected', btn.dataset.mode === mode);
            }
        });

        console.log(`[ViewMode] Switched to ${mode}`);
    }

    function toggleViewMode() {
        const current = document.body.dataset.viewMode || 'story';
        const next = current === 'story' ? 'dev' : 'story';
        setViewMode(next);
    }

    // Initialize state
    const savedMode = localStorage.getItem('uv7-view-mode') || 'story';
    setViewMode(savedMode);

    // --- Event Bindings ---

    // Click handlers for toggle buttons
    document.querySelectorAll('[data-action="toggle-mode"]').forEach(btn => {
        btn.addEventListener('click', toggleViewMode);
    });

    // Handle dedicated mode buttons (if any exist, like in the Michelin header)
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.mode) setViewMode(btn.dataset.mode);
        });
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        const el = document.activeElement;
        const isTyping = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
        if (isTyping) return;

        const key = e.key.toLowerCase();

        // S = Toggle Story/Dev
        if (key === 's') {
            e.preventDefault(); // Prevent 'Save' if browser catches it, though mainly just good hygiene
            toggleViewMode();
        }
    });

    // Export toggle for global usage if needed (optional)
    window.toggleViewMode = toggleViewMode;
}
