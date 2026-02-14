/**
 * MARKDOWN PARSER - Lightweight Utility
 * Simple markdown to HTML converter without external dependencies.
 * Extracted from BlogRenderer for reuse across the showcase.
 */

/**
 * Escape HTML to prevent XSS in code blocks
 */
export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Simple markdown to HTML converter
 * Handles basic markdown syntax without external dependencies
 */
export function markdownToHtml(markdown: unknown): string {
    if (typeof markdown !== 'string' || !markdown) return '';
    let html: string = markdown;

    // Code blocks (```language ... ```)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Tables (| col | col | ... with |---|---| separator)
    html = html.replace(/(?:^|\n)((?:\|[^\n]+\|\n)+)/g, (_match, tableBlock: string) => {
        const rows = tableBlock.trim().split('\n').filter(r => r.trim());
        if (rows.length < 2) return tableBlock;

        // Check for separator row (|---|---|)
        const sepIndex = rows.findIndex(r => /^\|[\s\-:|]+\|$/.test(r.trim()));
        if (sepIndex < 1) return tableBlock;

        const parseRow = (row: string): string[] =>
            row.split('|').slice(1, -1).map(cell => cell.trim());

        const headerCells = parseRow(rows[sepIndex - 1]);
        const thead = `<thead><tr>${headerCells.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;

        const bodyRows = rows.slice(sepIndex + 1);
        const tbody = bodyRows.length
            ? `<tbody>${bodyRows.map(r => `<tr>${parseRow(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`
            : '';

        return `<table class="md-table">${thead}${tbody}</table>`;
    });

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes (> text)
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks (double newline = paragraph)
    html = html.replace(/\n\n/g, '</p><p>');
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
}
