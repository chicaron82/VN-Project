import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectFooters } from './FooterInjector';

describe('FooterInjector', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should inject footer template into all placeholders', () => {
        // Setup: Create template and placeholders
        const template = document.createElement('template');
        template.id = 'footer-template';
        template.innerHTML = `
            <footer class="site-footer">
                <div class="footer-content">
                    <h2>Experience UV7</h2>
                </div>
            </footer>
        `;
        document.body.appendChild(template);

        const placeholder1 = document.createElement('div');
        placeholder1.className = 'footer-placeholder';
        document.body.appendChild(placeholder1);

        const placeholder2 = document.createElement('div');
        placeholder2.className = 'footer-placeholder';
        document.body.appendChild(placeholder2);

        // Act: Inject footers
        injectFooters();

        // Assert: Placeholders should be replaced with footer clones
        const footers = document.querySelectorAll('.site-footer');
        expect(footers.length).toBe(2);
        expect(document.querySelectorAll('.footer-placeholder').length).toBe(0);
        
        // Verify footer content
        footers.forEach(footer => {
            expect(footer.querySelector('h2')?.textContent).toBe('Experience UV7');
        });
    });

    it('should handle missing template gracefully', () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'footer-placeholder';
        document.body.appendChild(placeholder);

        expect(() => injectFooters()).not.toThrow();
        
        // Placeholder should remain unchanged
        expect(document.querySelectorAll('.footer-placeholder').length).toBe(1);
    });

    it('should handle no placeholders gracefully', () => {
        const template = document.createElement('template');
        template.id = 'footer-template';
        template.innerHTML = '<footer class="site-footer"></footer>';
        document.body.appendChild(template);

        expect(() => injectFooters()).not.toThrow();
        expect(document.querySelectorAll('.site-footer').length).toBe(0);
    });
});
