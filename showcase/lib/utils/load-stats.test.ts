import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadRealStats } from './load-stats';

// Mock fetch
global.fetch = vi.fn();

describe('loadRealStats', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = `
            <div class="stats-grid">
                <div data-stat-type="tests">
                    <div class="stat-number"></div>
                    <div class="stat-label"></div>
                </div>
                <div data-stat-type="phases">
                    <div class="stat-number"></div>
                </div>
                <!-- Other elements that might be queried -->
                <div class="stat-card" data-stat-type="achievements">
                     <div class="stat-label"></div>
                </div>
                <div id="system-status-right"></div>
            </div>
        `;
    });

    it('should fetch stats.json and update DOM', async () => {
        const mockStats = {
            testsPass: 100,
            testsFail: 5,
            testsSkip: 2,
            testsTotal: 107,
            phasesComplete: 10,
            tsErrors: 0,
            daysInDevelopment: 5,
            lastUpdated: new Date().toISOString()
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockStats
        });

        await loadRealStats();

        // Check fetch call
        expect(global.fetch).toHaveBeenCalledWith('stats.json');

        // Check DOM updates
        const testStat = document.querySelector('[data-stat-type="tests"] .stat-number');
        expect(testStat?.getAttribute('data-target')).toBe('100');
        
        // Window global should be set
        expect(window.UV7Stats).toEqual(mockStats);
    });

    it('should handle fetch failure gracefully', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false
        });

        const consoleSpy = vi.spyOn(console, 'warn');
        await loadRealStats();

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('stats.json not found'));
    });
    
    it('should handle clean test run (0 failures)', async () => {
         const mockStats = {
            testsPass: 100,
            testsFail: 0,
            testsSkip: 0,
            testsTotal: 100
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockStats
        });

        await loadRealStats();
        
        const testLabel = document.querySelector('[data-stat-type="tests"] .stat-label');
        // Logic might not change label if clean, depending on implementation
        // But let's verify no error text added
        expect(testLabel?.textContent).not.toContain('fail');
    });

    it('should display failures if present', async () => {
         const mockStats = {
            testsPass: 80,
            testsFail: 20,
            testsSkip: 0,
            testsTotal: 100
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockStats
        });

        await loadRealStats();
        
        const testLabel = document.querySelector('[data-stat-type="tests"] .stat-label');
        expect(testLabel?.textContent).toContain('20 fail');
    });
});
