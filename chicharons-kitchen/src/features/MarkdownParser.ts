/**
 * MarkdownParser — simple markdown → HTML conversion (no deps)
 * Handles: **bold**, `code`, ```code blocks```, line breaks
 */
export class MarkdownParser {
    static parse(text: string): string {
        if (!text) return '';

        // Code blocks (must come before inline code)
        text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code: string) => {
            return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // Inline code
        text = text.replace(/`([^`]+)`/g, (_, code: string) => {
            return `<code>${this.escapeHtml(code)}</code>`;
        });

        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Line breaks (double newline → paragraph, single → br)
        text = text
            .split(/\n\n+/)
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('\n');

        return text;
    }

    static escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
