/**
 * UV7OS BOOT TOAST - FIRST VISIT ACKNOWLEDGMENT
 *
 * Shows "UV7 OS ready • All systems nominal" toast on first visit.
 * One-time per context (landing vs showcase) to humanize the system.
 *
 * TORI: "Makes the experience feel alive"
 */

/**
 * Dependencies injected by orchestrator (callback pattern)
 */
export interface UV7OSBootToastDependencies {
    context: 'showcase' | 'landing';
}

export class UV7OSBootToast {
    constructor(private deps: UV7OSBootToastDependencies) {}

    /**
     * Show boot toast on first visit
     * Checks localStorage to avoid showing twice
     */
    show(): void {
        // Context-specific storage key
        const storageKey = this.deps.context === 'landing'
            ? 'uv7.bootToastShown'
            : 'uv7.bootToastShown.showcase';

        // Check if already shown
        const hasShown = localStorage.getItem(storageKey);
        if (hasShown) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        // Auto-dismiss after 2 seconds
        setTimeout(() => {
            toast.classList.add('dismissing');

            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for fade-out animation
        }, 2000);

        // Mark as shown
        localStorage.setItem(storageKey, 'true');
    }

    /**
     * Public API - allow manual triggering (for testing or reset scenarios)
     */
    showPublic(): void {
        // Force show without checking localStorage
        const toast = document.createElement('div');
        toast.className = 'uv7-boot-toast';
        toast.textContent = 'UV7 OS ready • All systems nominal';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('dismissing');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}
