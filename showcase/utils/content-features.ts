/**
 * Content Features - Phase 3
 * Share functionality, dark mode, timeline search
 */

declare global {
    interface Window {
        shareTwitter?: () => void;
        shareLinkedIn?: () => void;
        copyLink?: () => void;
        contentFeatures?: {
            shareTwitter: () => void;
            shareLinkedIn: () => void;
            copyLink: () => void;
            showToast: (message: string, duration?: number) => void;
        };
    }
}

// ==========================================
// 1. SHARE FUNCTIONALITY
// ==========================================

function initShareButtons(): void {
    // Twitter/X Share
    window.shareTwitter = function () {
        const text = "Check out UV7: A visual novel built in 50 days with AI collaboration. 16 phases, 8 AI crew members, 100% type-safe. 🎮✨";
        const url = window.location.href;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    // LinkedIn Share
    window.shareLinkedIn = function () {
        const url = window.location.href;
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank', 'width=550,height=420');
    };

    // Copy Link
    window.copyLink = function () {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard! 🔗');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showToast('Failed to copy link');
        });
    };

    console.log('🔗 Share functionality initialized');
}

// ==========================================
// 2. DARK MODE TOGGLE
// ==========================================

// Dark Mode logic removed (Handled by NotificationShade)

// ==========================================
// 3. TIMELINE SEARCH/FILTER
// ==========================================

// Timeline Search logic removed (Handled by Michelin renderer)

// ==========================================
// 4. TOAST NOTIFICATIONS
// ==========================================

function showToast(message: string, duration: number = 3000): void {
    const toast = document.createElement('div');
    toast.className = 'feature-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==========================================
// 5. GITHUB SOURCE LINKS
// ==========================================

function addGitHubLinks(): void {
    const technicalCards = document.querySelectorAll('.technical-card');
    const githubBase = 'https://github.com/chicaron82/VN-Project';

    // Map card titles to GitHub paths (you can customize these)
    const cardPaths: Record<string, string> = {
        'Momentum Carousel': '/tree/main/v1/system',
        'UV7 OS': '/tree/main/showcase',
        'App Switcher': '/tree/main/showcase',
        'TypeScript Migration': '/tree/main/v2',
        'EventBus': '/tree/main/v2/core',
        'StateManager': '/tree/main/v2/managers'
    };

    technicalCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const path = cardPaths[title];

        if (path) {
            const linkBtn = document.createElement('a');
            linkBtn.href = githubBase + path;
            linkBtn.target = '_blank';
            linkBtn.className = 'github-source-link';
            linkBtn.innerHTML = '<span>📂</span> View Source';

            const details = card.querySelector('.tech-details');
            if (details) {
                details.appendChild(linkBtn);
            }
        }
    });

    console.log('📂 GitHub source links added');
}

// ==========================================
// INITIALIZATION & EXPORT
// ==========================================

export function initContentFeatures(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    init();
}

function init(): void {
    console.log('🎯 Initializing content features...');

    initShareButtons();
    // Dark mode -> NotificationShade
    // Search -> TimelineRenderer
    addGitHubLinks();

    console.log('✨ Content features ready!');
}

// Export for manual use
export const contentFeatures = {
    shareTwitter: () => window.shareTwitter?.(),
    shareLinkedIn: () => window.shareLinkedIn?.(),
    copyLink: () => window.copyLink?.(),
    showToast
};

// Expose globally for legacy compatibility
if (typeof window !== 'undefined') {
    window.contentFeatures = contentFeatures;
}
