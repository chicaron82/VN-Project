/**
 * Load Real Stats Dynamically
 * Fetches stats.json and updates the showcase
 */

interface Stats {
    testsPass?: number;
    testsFail?: number;
    testsSkip?: number;
    testsTotal?: number;
    phasesComplete?: number;
    tsErrors?: number;
}

declare global {
    interface Window {
        UV7Stats?: Stats;
        premiumAnimations?: {
            initAnimatedCounters?: () => void;
        };
        loadRealStats?: () => Promise<void>;
    }
}

async function loadRealStats(): Promise<void> {
    try {
        const response = await fetch('stats.json');
        if (!response.ok) {
            console.warn('📊 stats.json not found, using hardcoded values');
            return;
        }

        const stats: Stats = await response.json();
        console.log('📊 Loaded real stats:', stats);

        // Expose globally
        window.UV7Stats = stats;

        // Update test count (show passing/failing for transparency)
        const testStat = document.querySelector('[data-stat-type="tests"] .stat-number');
        const testLabel = document.querySelector('[data-stat-type="tests"] .stat-label');

        if (testStat && stats.testsPass !== undefined) {
            // Show total passing as the main number
            testStat.setAttribute('data-target', stats.testsPass.toString());
            testStat.textContent = '0'; // Reset for animation

            // Update label to show breakdown if there are failures/skips
            if (testLabel) {
                if ((stats.testsFail ?? 0) > 0 || (stats.testsSkip ?? 0) > 0) {
                    const parts = [`${stats.testsPass} passing`];
                    if (stats.testsFail && stats.testsFail > 0) parts.push(`${stats.testsFail} failing`);
                    if (stats.testsSkip && stats.testsSkip > 0) parts.push(`${stats.testsSkip} skipped`);
                    testLabel.textContent = `Tests (${parts.join(', ')})`;
                } else {
                    testLabel.textContent = `Tests (${stats.testsPass}/${stats.testsTotal} passing ✓)`;
                }
            }
        }

        // Update Status Bar (System Right)
        const sysRight = document.querySelector('.sys-right');
        if (sysRight && stats.testsPass !== undefined) {
            // Show transparent stats in status bar too
            const testStatus = (stats.testsFail ?? 0) > 0
                ? `TESTS: ${stats.testsPass}/${stats.testsTotal} (${stats.testsFail} failing)`
                : `TESTS: ${stats.testsPass}/${stats.testsTotal} ✓`;

            // If it's already typed, replace it
            if (sysRight.textContent?.includes('TESTS:')) {
                sysRight.textContent = sysRight.textContent.replace(/TESTS: [^\|]+/, testStatus);
            }

            // Also set an interval to check in case TabController is still typing
            setTimeout(() => {
                const el = document.querySelector('.sys-right');
                if (el && el.textContent?.includes('TESTS:')) {
                    el.textContent = el.textContent.replace(/TESTS: [^\|]+/, testStatus);
                }
            }, 2000); // Check again after typing likely finishes
        }

        // Update phase count
        const phaseStat = document.querySelector('[data-stat-type="phases"] .stat-number');
        if (phaseStat && stats.phasesComplete !== undefined) {
            phaseStat.setAttribute('data-target', stats.phasesComplete.toString());
            phaseStat.textContent = '0'; // Reset for animation
        }

        // Add TypeScript error stat if it exists
        if (stats.tsErrors !== undefined) {
            addTypeScriptErrorStat(stats.tsErrors);
        }

        // Update Key Achievements (Result Tab)
        const achievementsTests = document.getElementById('achievements-tests');
        if (achievementsTests && stats.testsPass !== undefined) {
            if ((stats.testsFail ?? 0) > 0) {
                achievementsTests.textContent = `${stats.testsPass}/${stats.testsTotal} tests passing (${stats.testsFail} failing)`;
            } else {
                achievementsTests.textContent = `${stats.testsPass}/${stats.testsTotal} tests passing ✓`;
            }
        }

        // Re-trigger counter animations if they've already run
        if (window.premiumAnimations?.initAnimatedCounters) {
            window.premiumAnimations.initAnimatedCounters();
        }

        console.log('✅ Stats updated successfully');
    } catch (error) {
        console.error('❌ Failed to load stats:', error);
    }
}

function addTypeScriptErrorStat(errorCount: number): void {
    // Check for existing error card (static or dynamic)
    const existing = document.querySelector('[data-stat-type="errors"]') || document.querySelector('[data-stat-type="ts-errors"]');

    if (existing) {
        // Update existing
        const numberEl = existing.querySelector('.stat-number');
        const labelEl = existing.querySelector('.stat-label');
        if (numberEl) {
            numberEl.setAttribute('data-target', errorCount.toString());
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
    tsErrorCard.setAttribute('data-stat-type', 'ts-errors');
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

// Initialize and export
export function initLoadStats(): void {
    // Load stats when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadRealStats);
    } else {
        loadRealStats();
    }

    // Export for manual refresh
    window.loadRealStats = loadRealStats;
}

// Also export the function itself
export { loadRealStats };
