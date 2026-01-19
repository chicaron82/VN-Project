// ========================================
// DIZEE POLISH: ACHIEVEMENT VIEWER UI
// ========================================

class AchievementViewer {
    constructor(achievementManager) {
        this.achievementManager = achievementManager;
    }

    show() {
        // Create viewer overlay
        const viewer = document.createElement('div');
        viewer.id = 'achievement-viewer';
        viewer.className = 'achievement-viewer';

        const totalUnlocked = this.achievementManager.getTotalUnlocked();
        const totalAchievements = this.achievementManager.getTotalAchievements();

        viewer.innerHTML = `
            <div class="achievement-viewer-content">
                <button class="achievement-viewer-close" onclick="window.achievementViewer.hide()">✕</button>
                
                <div class="achievement-viewer-header">
                    <div class="achievement-viewer-title">ACHIEVEMENTS</div>
                    <div class="achievement-viewer-progress">${totalUnlocked} / ${totalAchievements}</div>
                </div>

                <div class="achievement-grid">
                    ${this.renderAchievements()}
                </div>
            </div>
        `;

        document.body.appendChild(viewer);

        // Fade in
        setTimeout(() => {
            viewer.style.display = 'flex';
            setTimeout(() => {
                viewer.classList.add('show');
            }, 50);
        }, 10);

        // ESC to close
        this.escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.escHandler);
    }

    renderAchievements() {
        let html = '';

        Object.values(this.achievementManager.achievements).forEach(achievement => {
            const lockedClass = achievement.unlocked ? 'unlocked' : 'locked';
            const statusText = achievement.unlocked ? '✓ UNLOCKED' : '🔒 LOCKED';

            let timestampHTML = '';
            if (achievement.unlocked && achievement.unlockedAt) {
                const relativeTime = this.getRelativeTime(achievement.unlockedAt);
                timestampHTML = `<div class="achievement-card-timestamp">Unlocked ${relativeTime}</div>`;
            }

            html += `
                <div class="achievement-card ${lockedClass}">
                    <div class="achievement-card-icon">${achievement.icon}</div>
                    <div class="achievement-card-name">${achievement.name}</div>
                    <div class="achievement-card-desc">${achievement.description}</div>
                    <div class="achievement-card-status">${statusText}</div>
                    ${timestampHTML}
                </div>
            `;
        });

        return html;
    }

    getRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    }

    hide() {
        const viewer = document.getElementById('achievement-viewer');
        if (viewer) {
            viewer.classList.remove('show');
            setTimeout(() => {
                viewer.remove();
            }, 300);
        }

        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }
    }
}

// Initialize when achievement manager is ready
if (typeof window !== 'undefined') {
    window.AchievementViewer = AchievementViewer;
    window.addEventListener('DOMContentLoaded', () => {
        const checkAchievementManager = setInterval(() => {
            if (window.achievementManager) {
                window.achievementViewer = new AchievementViewer(window.achievementManager);
                clearInterval(checkAchievementManager);
            }
        }, 100);
    });
}

// ES Module export
export { AchievementViewer };
