/**
 * Lighthouse CI Configuration
 * Phase 6D: Performance & Accessibility monitoring
 *
 * Run locally: npx lhci autorun
 * CI: Integrated into GitHub Actions workflow
 *
 * Targets:
 * - Performance: 90+
 * - Accessibility: 90+
 * - Best Practices: 90+
 * - SEO: 80+
 */
module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:4173/'],
            startServerCommand: 'npm run preview',
            startServerReadyPattern: 'Local',
            numberOfRuns: 3,
            settings: {
                preset: 'desktop',
            },
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['warn', { minScore: 0.9 }],
                'categories:seo': ['warn', { minScore: 0.8 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
