import { createBanner, BANNER_CONFIGS } from './BannerGenerator';

describe('BannerGenerator', () => {
    it('should create a banner with all required elements', () => {
        const html = createBanner(BANNER_CONFIGS.journal);

        expect(html).toContain('class="hero-banner journal"');
        expect(html).toContain('class="hero-banner-image"');
        expect(html).toContain('class="hero-banner-particles"');
        expect(html).toContain('class="hero-banner-content"');
        expect(html).toContain('class="hero-banner-title"');
        expect(html).toContain('class="hero-banner-subtitle"');
    });

    it('should inject config values correctly', () => {
        const html = createBanner(BANNER_CONFIGS.workflow);

        expect(html).toContain('The Workflow');
        expect(html).toContain('How a non-coder and AI built a game engine together');
        expect(html).toContain('media/banners/banner-workflow.png');
        expect(html).toContain('alt="Workflow Banner"');
    });

    it('should generate 10 particle elements', () => {
        const html = createBanner(BANNER_CONFIGS.results);
        const particleCount = (html.match(/class="particle"/g) || []).length;
        expect(particleCount).toBe(10);
    });

    it('should have configs for all sections', () => {
        expect(BANNER_CONFIGS).toHaveProperty('journal');
        expect(BANNER_CONFIGS).toHaveProperty('workflow');
        expect(BANNER_CONFIGS).toHaveProperty('results');
        expect(BANNER_CONFIGS).toHaveProperty('spotlight');
        expect(BANNER_CONFIGS).toHaveProperty('evolution');
    });

    it('should escape HTML in config values', () => {
        const maliciousConfig = {
            title: '<script>alert("xss")</script>',
            subtitle: 'Safe subtitle',
            image: 'test.png',
            alt: 'Test',
            section: 'test-section'
        };

        const html = createBanner(maliciousConfig);

        // Should include the literal string (not execute script)
        expect(html).toContain('&lt;script&gt;');
    });
});
