/**
 * Load Real Stats Dynamically
 * Fetches stats.json and updates the showcase
 */

(function () {
    'use strict';

    async function loadRealStats() {
        try {
            const response = await fetch('stats.json');
            if (!response.ok) {
                console.warn('📊 stats.json not found, using hardcoded values');
                return;
            }

            const stats = await response.json();
            console.log('📊 Loaded real stats:', stats);

            // Expose globally
            window.UV7Stats = stats;

            // Update test count
            const testStat = document.querySelector('[data-stat-type="tests"] .stat-number');
            if (testStat && stats.testsPass !== undefined) {
                testStat.dataset.target = stats.testsPass;
                testStat.textContent = '0'; // Reset for animation
            }

            // Update Status Bar (System Right)
            const sysRight = document.querySelector('.sys-right');
            if (sysRight && stats.testsPass !== undefined) {
                // If it's already typed, replace it
                if (sysRight.textContent.includes('TESTS:')) {
                    sysRight.textContent = sysRight.textContent.replace(/TESTS: \d+/, `TESTS: ${stats.testsPass}`);
                }

                // Also set an interval to check in case TabController is still typing
                // The typing overwrites textContent, so we need to persist only after it's done?
                // Or better: TabController types it once. If we replace it, we are good.
                // But if we replace it WHILE it's typing, it might be messy.
                // TabController takes ~2 seconds to type.
                // We'll retry a few times.
                setTimeout(() => {
                    const el = document.querySelector('.sys-right');
                    if (el && el.textContent.includes('TESTS:')) {
                        el.textContent = el.textContent.replace(/TESTS: \d+/, `TESTS: ${stats.testsPass}`);
                    }
                }, 2000); // Check again after typing likely finishes
            }

            // Update phase count
            const phaseStat = document.querySelector('[data-stat-type="phases"] .stat-number');
            if (phaseStat && stats.phasesComplete !== undefined) {
                phaseStat.dataset.target = stats.phasesComplete;
                phaseStat.textContent = '0'; // Reset for animation
            }

            // Add TypeScript error stat if it exists
            if (stats.tsErrors !== undefined) {
                addTypeScriptErrorStat(stats.tsErrors);
            }

            // Update Key Achievements (Result Tab)
            const achievementsTests = document.getElementById('achievements-tests');
            if (achievementsTests && stats.testsPass !== undefined) {
                achievementsTests.textContent = `${stats.testsPass} tests`;
            }

            // Re-trigger counter animations if they've already run
            if (window.premiumAnimations && window.premiumAnimations.initAnimatedCounters) {
                window.premiumAnimations.initAnimatedCounters();
            }

            console.log('✅ Stats updated successfully');
        } catch (error) {
            console.error('❌ Failed to load stats:', error);
        }
    }

    function addTypeScriptErrorStat(errorCount) {
        // Check for existing error card (static or dynamic)
        const existing = document.querySelector('[data-stat-type="errors"]') || document.querySelector('[data-stat-type="ts-errors"]');

        if (existing) {
            // Update existing
            const numberEl = existing.querySelector('.stat-number');
            const labelEl = existing.querySelector('.stat-label');
            if (numberEl) {
                numberEl.dataset.target = errorCount;
                numberEl.textContent = '0';
            }
            if (labelEl) labelEl.textContent = `TypeScript ${errorCount === 0 ? '✓ Clean' : 'Errors'}`;
            return;
        }

        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        // Create TS error stat card if none exists
        const tsErrorCard = document.createElement('div');
        tsErrorCard.className = 'stat-card';
        tsErrorCard.dataset.statType = 'ts-errors';
        tsErrorCard.innerHTML = `
            <div class="stat-icon">🔍</div>
            <div class="stat-number" data-target="${errorCount}">0</div>
            <div class="stat-label">TypeScript ${errorCount === 0 ? '✓ Clean' : 'Errors'}</div>
        `;

        // Add to grid (after tests, before phases)
        const phasesCard = document.querySelector('[data-stat-type="phases"]');
        if (phasesCard) {
            statsGrid.insertBefore(tsErrorCard, phasesCard);
        } else {
            statsGrid.appendChild(tsErrorCard);
        }
    }

    // Load stats when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadRealStats);
    } else {
        loadRealStats();
    }

    // Export for manual refresh
    window.loadRealStats = loadRealStats;
})();
