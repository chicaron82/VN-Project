import type { BlogEntry } from '../../entries/types';
import { MarkdownParser } from './MarkdownParser';
import { BlogDeepLink } from './BlogDeepLink';

/**
 * BlogCard — renders a single BlogEntry as a glassmorphism card
 */
export class BlogCard {
    private entry: BlogEntry;
    private expanded = false;

    constructor(entry: BlogEntry) {
        this.entry = entry;
    }

    render(): HTMLElement {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.id = BlogDeepLink.getAnchorId(this.entry.id);

        card.innerHTML = this.buildCardHTML();

        // Click to expand
        const header = card.querySelector('.card-header');
        header?.addEventListener('click', () => this.toggleExpand(card));

        // Copy link button
        const linkBtn = card.querySelector('.card-link-btn');
        linkBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            BlogDeepLink.copyLink(this.entry.id);
            (linkBtn as HTMLElement).textContent = '✓';
            setTimeout(() => { (linkBtn as HTMLElement).textContent = '🔗'; }, 1500);
        });

        return card;
    }

    private buildCardHTML(): string {
        const e = this.entry;
        const emoji = e.emoji || '📝';
        const date = e.date || '';
        const typeBadge = e.type ? `<span class="type-badge type-${e.type}">${e.type}</span>` : '';
        const modelChip = e.modelId ? `<span class="model-chip model-${e.modelId}">${e.modelId}</span>` : '';

        const tags = (e.tags || [])
            .map(t => `<span class="tag">${t}</span>`)
            .join('');

        const callout = e.callout
            ? `<div class="callout">
                <span class="callout-icon">${e.callout.icon || '💡'}</span>
                <div class="callout-body">
                    <strong>${e.callout.title}</strong>
                    ${e.callout.text ? `<p>${MarkdownParser.parse(e.callout.text)}</p>` : ''}
                    ${e.callout.content ? `<p>${MarkdownParser.parse(e.callout.content)}</p>` : ''}
                </div>
               </div>`
            : '';

        const highlights = (e.highlights || []).length > 0
            ? `<ul class="highlights">
                ${(e.highlights || []).map(h => `<li>${MarkdownParser.parse(h)}</li>`).join('')}
               </ul>`
            : '';

        const summary = e.summary
            ? `<p class="card-summary">${MarkdownParser.parse(e.summary)}</p>`
            : '';

        return `
            <div class="card-header">
                <div class="card-title-row">
                    <span class="card-emoji">${emoji}</span>
                    <h2 class="card-title">${MarkdownParser.escapeHtml(e.title)}</h2>
                    <button class="card-link-btn" title="Copy link">��</button>
                </div>
                ${date ? `<div class="card-date">${date}</div>` : ''}
                ${summary}
            </div>
            <div class="card-body" style="display:none">
                ${callout}
                ${highlights}
            </div>
            <div class="card-footer">
                ${typeBadge}
                ${modelChip}
                <div class="card-tags">${tags}</div>
            </div>
        `;
    }

    private toggleExpand(card: HTMLElement): void {
        this.expanded = !this.expanded;
        const body = card.querySelector('.card-body') as HTMLElement;
        if (body) {
            body.style.display = this.expanded ? 'block' : 'none';
        }
        card.classList.toggle('expanded', this.expanded);
    }
}
