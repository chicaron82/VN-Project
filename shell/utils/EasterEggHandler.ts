/**
 * ═══════════════════════════════════════════════════════════════
 * EASTER EGG HANDLER - Shared UV7 Easter Egg Logic
 *
 * Extracted from UV7Shell.ts and LandingApp.ts where identical
 * implementations existed. Provides:
 * - 7-tap easter egg modal with UV7 branding
 * - Tap counting with timeout reset
 * - CSS animation injection
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Show the UV7 Easter Egg modal overlay
 */
export function showEasterEggModal(): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
            border: 2px solid #00ff88;
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
        ">
            <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #00ff88; font-size: 28px; margin-bottom: 16px; font-family: 'Outfit', sans-serif;">
                UV7 Easter Egg Unlocked!
            </h2>
            <p style="color: #fff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                <strong>Loop #848</strong><br>
                "Always. Always. Always."<br><br>
                <span style="color: #00ff88;">Seven voices. One vision. Infinite iterations.</span>
            </p>
            <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-bottom: 24px;">
                💚 Built with chaos<br>
                🔥 Refined with discipline<br>
                💀 Perfected with love
            </p>
            <button style="
                background: #00ff88;
                color: #000;
                border: none;
                padding: 12px 32px;
                border-radius: 24px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Outfit', sans-serif;
            ">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || (e.target as HTMLElement).tagName === 'BUTTON') {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        }
    });

    ensureEasterEggStyles();
}

/**
 * Inject CSS animations if not already present
 */
function ensureEasterEggStyles(): void {
    if (document.getElementById('easter-egg-styles')) return;

    const style = document.createElement('style');
    style.id = 'easter-egg-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Create a 7-tap easter egg tracker for a DOM element.
 *
 * @param element - The element to attach the tap listener to
 * @param onToast - Callback to show a progress toast (e.g., "3 more taps...")
 */
export function attachEasterEggTapHandler(
    element: HTMLElement,
    onToast: (message: string) => void
): void {
    let taps = 0;
    let timeout: number | undefined;

    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';

    element.addEventListener('click', () => {
        taps++;

        const remaining = 7 - taps;

        if (taps === 7) {
            showEasterEggModal();
            taps = 0;
        } else if (taps >= 4) {
            onToast(`${remaining} more ${remaining === 1 ? 'tap' : 'taps'} to unlock UV7 secrets...`);
        }

        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            taps = 0;
        }, 2000);
    });
}
