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

            // Update test count
            const testStat = document.querySelector('[data-stat-type="tests"] .stat-number');
            if (testStat && stats.testsPass !== undefined) {
                testStat.dataset.target = stats.testsPass;
                testStat.textContent = '0'; // Reset for animation
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
