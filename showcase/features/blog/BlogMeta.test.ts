/**
 * BlogMeta Tests
 * Tests for dynamic document title and meta tag updates
 */

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { ui: vi.fn(), system: vi.fn() }
}));

describe('BlogMeta', () => {
    let BlogMeta: any;

    beforeEach(async () => {
        document.title = 'UV7 Showcase';
        window.location.hash = '';
        document.body.innerHTML = '';

        // Dynamic import to get fresh module each time
        const mod = await import('./BlogMeta');
        BlogMeta = mod.BlogMeta;
    });

    it('should capture default title on construction', () => {
        document.title = 'My Default Title';
        const meta = new BlogMeta();
        meta.destroy();
        expect(document.title).toBe('My Default Title');
    });

    it('should restore title on destroy', () => {
        document.title = 'Original Title';
        const meta = new BlogMeta();
        document.title = 'Changed Title';
        meta.destroy();
        expect(document.title).toBe('Original Title');
    });

    it('should not change title when hash does not start with #entry-', () => {
        const meta = new BlogMeta();
        const originalTitle = document.title;

        window.location.hash = '#something-else';
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        expect(document.title).toBe(originalTitle);
        meta.destroy();
    });

    it('should update title when entry element exists with matching hash', () => {
        document.body.innerHTML = `
            <div id="entry-test-123">
                <strong>Test Entry Title</strong>
                <h3>(2026-02-09)</h3>
            </div>
        `;

        const meta = new BlogMeta();

        window.location.hash = '#entry-test-123';
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        expect(document.title).toContain('2026-02-09');
        expect(document.title).toContain('Test Entry Title');
        expect(document.title).toContain('UV7 Showcase');
        meta.destroy();
    });

    it('should restore title when hash is cleared', () => {
        const meta = new BlogMeta();
        const originalTitle = document.title;

        window.location.hash = '';
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        expect(document.title).toBe(originalTitle);
        meta.destroy();
    });
});
