/**
 * MarkdownParser Tests
 * Tests for lightweight markdown-to-HTML conversion utility
 */
import { markdownToHtml, escapeHtml } from './MarkdownParser';

describe('MarkdownParser', () => {
    describe('escapeHtml', () => {
        it('should escape angle brackets', () => {
            expect(escapeHtml('<script>alert("xss")</script>')).toContain('&lt;script&gt;');
        });

        it('should escape ampersands', () => {
            expect(escapeHtml('A & B')).toBe('A &amp; B');
        });

        it('should leave plain text unchanged', () => {
            expect(escapeHtml('hello world')).toBe('hello world');
        });
    });

    describe('markdownToHtml', () => {
        it('should return empty string for non-string input', () => {
            expect(markdownToHtml(null)).toBe('');
            expect(markdownToHtml(undefined)).toBe('');
            expect(markdownToHtml(42)).toBe('');
            expect(markdownToHtml('')).toBe('');
        });

        it('should convert headers', () => {
            expect(markdownToHtml('# Title')).toContain('<h1>Title</h1>');
            expect(markdownToHtml('## Subtitle')).toContain('<h2>Subtitle</h2>');
            expect(markdownToHtml('### Section')).toContain('<h3>Section</h3>');
        });

        it('should convert bold text with **', () => {
            const result = markdownToHtml('This is **bold** text');
            expect(result).toContain('<strong>bold</strong>');
        });

        it('should convert bold text with __', () => {
            const result = markdownToHtml('This is __bold__ text');
            expect(result).toContain('<strong>bold</strong>');
        });

        it('should convert italic text with *', () => {
            const result = markdownToHtml('This is *italic* text');
            expect(result).toContain('<em>italic</em>');
        });

        it('should convert italic text with _', () => {
            const result = markdownToHtml('This is _italic_ text');
            expect(result).toContain('<em>italic</em>');
        });

        it('should convert inline code', () => {
            const result = markdownToHtml('Use `const x = 1` here');
            expect(result).toContain('<code>const x = 1</code>');
        });

        it('should convert code blocks with language', () => {
            const result = markdownToHtml('```typescript\nconst x = 1;\n```');
            expect(result).toContain('<pre><code class="language-typescript">');
            expect(result).toContain('const x = 1;');
        });

        it('should convert code blocks without language', () => {
            const result = markdownToHtml('```\nhello\n```');
            expect(result).toContain('<pre><code class="language-plaintext">');
        });

        it('should escape HTML inside code blocks', () => {
            const result = markdownToHtml('```html\n<div>test</div>\n```');
            expect(result).toContain('&lt;div&gt;');
        });

        it('should convert links', () => {
            const result = markdownToHtml('[click here](https://example.com)');
            expect(result).toContain('<a href="https://example.com" target="_blank">click here</a>');
        });

        it('should convert blockquotes', () => {
            const result = markdownToHtml('> This is a quote');
            expect(result).toContain('<blockquote>This is a quote</blockquote>');
        });

        it('should convert unordered lists with *', () => {
            const result = markdownToHtml('* Item 1');
            expect(result).toContain('<li>Item 1</li>');
        });

        it('should convert unordered lists with -', () => {
            const result = markdownToHtml('- Item 1');
            expect(result).toContain('<li>Item 1</li>');
        });

        it('should wrap list items in ul', () => {
            const result = markdownToHtml('- Item 1');
            expect(result).toContain('<ul>');
        });

        it('should convert double newlines to paragraphs', () => {
            const result = markdownToHtml('Paragraph 1\n\nParagraph 2');
            expect(result).toContain('</p><p>');
        });

        it('should handle complex mixed markdown', () => {
            const md = '# Title\n\nSome **bold** and *italic* with `code`';
            const result = markdownToHtml(md);
            expect(result).toContain('<h1>Title</h1>');
            expect(result).toContain('<strong>bold</strong>');
            expect(result).toContain('<em>italic</em>');
            expect(result).toContain('<code>code</code>');
        });
    });
});
