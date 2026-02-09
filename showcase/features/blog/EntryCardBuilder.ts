/**
 * ENTRY CARD BUILDER
 * Pure DOM generation for timeline entry cards.
 * Extracted from BlogRenderer — zero dependency on renderer state.
 *
 * All functions take data in and return DOM elements out.
 */

import type { BlogEntry } from '../../data/blog';
import { markdownToHtml } from './MarkdownParser';
import { Logger } from '@utils/Logger';

// --- Utility Lookups (Pure Functions) ---

/**
 * Estimate word count for reading time calculation
 */
export function estimateWordCount(entry: BlogEntry): number {
    let text = entry.title + ' ' + (entry.summary || '');
    if (entry.features) text += ' ' + entry.features.join(' ');
    if (entry.theTimeline) text += ' ' + entry.theTimeline.join(' ');
    if (entry.quote) text += ' ' + entry.quote;
    return text.split(/\s+/).length;
}

/**
 * Determine vibe indicator based on entry tags/type
 */
export function getVibeIndicator(entry: BlogEntry): { emoji: string; label: string } {
    const tags = entry.tags || [];
    const type = entry.type || '';

    // Check for specific keywords in title/summary
    const content = `${entry.title} ${entry.summary || ''}`.toLowerCase();

    if (content.includes('milestone') || content.includes('achievement') || content.includes('complete')) {
        return { emoji: '🎯', label: 'Milestone' };
    }
    if (content.includes('bug') || content.includes('fix') || content.includes('debug')) {
        return { emoji: '💀', label: 'Debug Hell' };
    }
    if (content.includes('refactor') || content.includes('clean')) {
        return { emoji: '✨', label: 'Clean Refactor' };
    }
    if (content.includes('experiment') || content.includes('trying') || tags.includes('v3-lab')) {
        return { emoji: '🤔', label: 'Experiment' };
    }
    if (type === 'breakthrough' || content.includes('breakthrough')) {
        return { emoji: '🔥', label: 'Breakthrough' };
    }

    // Default: Having fun
    return { emoji: '🎮', label: 'Having Fun' };
}

/**
 * Get icon for stat type
 */
export function getStatIcon(statKey: string): string {
    const icons: Record<string, string> = {
        linesAdded: '📊',
        linesChanged: '📝',
        filesChanged: '📁',
        testsAdded: '🧪',
        commits: '💾',
        duration: '⏱️'
    };
    return icons[statKey] || '📊';
}

/**
 * Get contributor signature/catchphrase
 */
export function getContributorSignature(modelId: string): string {
    const signatures: Record<string, string> = {
        dizee: '<em>Built with precision.</em> — DiZee',
        belle: '<em>Chef\'s kiss.</em> 💋 — Belle',
        tori: '<em>Zero regressions.</em> — Tori',
        genzee: '<em>Vibes are immaculate.</em> — Genzee'
    };
    return signatures[modelId] || '';
}

// --- DOM Generators ---

/**
 * Render media carousel (images/video)
 */
export function renderMedia(entry: BlogEntry): HTMLElement | null {
    if (!entry.media || !entry.media.carousel || entry.media.carousel.length === 0) return null;

    const container = document.createElement('div');
    container.className = 'blog-media-carousel';

    entry.media.carousel.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'blog-media-item';

        if (item.type === 'video') {
            wrapper.innerHTML = `
                <video class="blog-media-image" controls>
                    <source src="${item.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                ${item.caption ? `<div class="blog-media-caption">${item.caption}</div>` : ''}
            `;
        } else {
            wrapper.innerHTML = `
                <img src="${item.url}" class="blog-media-image" alt="${item.caption || 'Blog image'}" loading="lazy" />
                ${item.caption ? `<div class="blog-media-caption">${item.caption}</div>` : ''}
            `;
        }

        container.appendChild(wrapper);
    });

    return container;
}

/**
 * Render code comparison card
 */
export function renderCodeComparison(entry: BlogEntry): HTMLElement | null {
    if (!entry.codeComparison) return null;

    const card = document.createElement('div');
    card.className = 'blog-code-comparison-card';

    const { before, after } = entry.codeComparison;

    card.innerHTML = `
        <div class="comparison-preview">
            <div class="comparison-side">
                <div class="comparison-badge badge-before">BEFORE</div>
                <div class="comparison-filename">${before.title}</div>
            </div>
            <div class="comparison-arrow">→</div>
            <div class="comparison-side">
                <div class="comparison-badge badge-after">AFTER</div>
                <div class="comparison-filename">${after.title}</div>
            </div>
        </div>
        <button class="btn-compare">
            <span>⚡ Compare Code</span>
        </button>
    `;

    // Attach event listener
    const btn = card.querySelector('.btn-compare');
    btn?.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card expansion if any
        // Check if global modal exists
        if (window.codeComparisonModal) {
            window.codeComparisonModal.open(entry.codeComparison);
        } else {
            Logger.error('CodeComparisonModal not initialized');
        }
    });

    return card;
}

// --- Main Card Builder ---

/**
 * Create the full DOM element for a single timeline entry card.
 * Pure function — no dependency on BlogRenderer state.
 */
export function createEntryElement(entry: BlogEntry): HTMLElement {
    const item = document.createElement('div');
    item.className = `blog-entry ${entry.type || ''}`;
    item.id = entry.id;
    if (entry.type) item.setAttribute('data-type', entry.type);
    if (entry.modelId) item.setAttribute('data-model-id', entry.modelId);

    const template = document.getElementById('timeline-card-template') as HTMLTemplateElement;
    // Fallback for safety (or tests)
    if (!template) {
        Logger.error('Timeline template missing');
        return item;
    }

    const fragment = template.content.cloneNode(true) as DocumentFragment;


    // --- Header & Metadata ---
    const authorInfo = fragment.querySelector('.blog-author-info')!;
    if (entry.modelId) {
        const names: Record<string, string> = { belle: 'Belle', dizee: 'DiZee', tori: 'Tori', genzee: 'Genzee' };
        const avatars: Record<string, string> = {
            belle: 'assets/trinity-iz-portrait.png',
            dizee: 'assets/dz-portrait.png',
            tori: 'assets/trinity-tori-portrait.png',
            genzee: 'assets/trinity-gz-portrait.png'
        };
        const avatarPath = avatars[entry.modelId];
        const authorName = names[entry.modelId] || entry.modelId;
        authorInfo.innerHTML = avatarPath
            ? `<img src="${avatarPath}" class="blog-avatar" alt="${authorName}" /><span class="blog-author-name">${authorName}</span>`
            : `<span class="blog-author-name">🤖 ${authorName}</span>`;
    }

    const metadata = fragment.querySelector('.blog-metadata')!;
    const wordCount = estimateWordCount(entry);
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const vibe = getVibeIndicator(entry);

    let metaHTML = `<span class="blog-date">${entry.date}</span>`;
    if (entry.tags?.length) metaHTML += ` • <span class="blog-category">${entry.tags[0]}</span>`;
    metaHTML += ` • <span class="blog-reading-time">${readingTime} min read</span>`;
    if (entry.linesOfCode) {
        metaHTML += ` • <span class="blog-loc" title="Lines of Code">📝 ${entry.linesOfCode} LOC</span>`;
    }
    metaHTML += ` • <span class="blog-vibe">${vibe.emoji} ${vibe.label}</span>`;
    metadata.innerHTML = metaHTML;

    // --- Title & Summary ---
    fragment.querySelector('.blog-title')!.innerHTML = `${entry.emoji || ''} ${entry.title}`.trim();
    const summaryEl = fragment.querySelector('.blog-summary')!;
    if (entry.summary) summaryEl.innerHTML = entry.summary;
    else summaryEl.remove();

    // --- Details Section ---
    const details = fragment.querySelector('.timeline-details')!;
    let hasDetails = false;

    // Helper to append generic HTML
    const addSection = (className: string, html: string): void => {
        hasDetails = true;
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = html;
        details.appendChild(div);
    };

    // Description (Main blog post body)
    if (entry.description) {
        const htmlContent = markdownToHtml(entry.description);
        addSection('blog-description', htmlContent);
    }

    // Media Carousel
    const mediaEl = renderMedia(entry);
    if (mediaEl) {
        hasDetails = true;
        details.appendChild(mediaEl);
    }

    // Code Comparison
    const comparisonEl = renderCodeComparison(entry);
    if (comparisonEl) {
        hasDetails = true;
        details.appendChild(comparisonEl);
    }


    if (entry.features) {
        hasDetails = true;
        const ul = document.createElement('ul');
        ul.className = 'update-list';
        entry.features.forEach(f => ul.innerHTML += `<li>${f}</li>`);
        details.appendChild(ul);
    }
    if (entry.theTimeline) {
        hasDetails = true;
        const div = document.createElement('div');
        div.className = 'timeline-subsection';
        div.innerHTML = '<h4 style="color: #888; margin-bottom: 0.5rem;">The Timeline:</h4><ul class="update-list">' +
            entry.theTimeline.map(t => `<li>${t}</li>`).join('') + '</ul>';
        details.appendChild(div);
    }
    if (entry.highlights) {
        hasDetails = true;
        const ul = document.createElement('ul');
        ul.className = 'update-list';
        ul.innerHTML = '<h4 style="color: #888; margin-bottom: 0.5rem;">✨ Highlights</h4>';
        entry.highlights.forEach(h => ul.innerHTML += `<li>${h}</li>`);
        details.appendChild(ul);
    }

    if (entry.callout) {
        addSection('v2-improvement-callout', `
            <div class="callout-icon">${entry.callout.icon || '💡'}</div>
            <div class="callout-content"><strong>${entry.callout.title || 'Insight:'}</strong> ${entry.callout.text}</div>
        `);
    }

    if (entry.technicalDetails) {
        hasDetails = true;
        let html = `<h4 style="color: #888; margin-bottom: 1rem;">${entry.technicalDetails.title}</h4>`;
        entry.technicalDetails.sections.forEach(section => {
            html += `<div class="technical-section">`;
            html += `<h5 style="color: #00ff88; margin-bottom: 0.5rem;">${section.heading}</h5>`;
            html += markdownToHtml(section.content);
            html += `</div>`;
        });
        addSection('technical-details-container', html);
    }

    if (entry.problem) {
        hasDetails = true;
        if (typeof entry.problem === 'string') {
            addSection('problem-section', `<h4 style="color: #ef4444; margin-bottom: 0.5rem;">❌ Problem</h4><p>${entry.problem}</p>`);
        } else {
            addSection('problem-section', `
                <h4 style="color: #ef4444; margin-bottom: 0.5rem;">❌ Problem</h4>
                <p><strong>Description:</strong> ${entry.problem.description}</p>
                <p><strong>Root Cause:</strong> ${entry.problem.rootCause}</p>
            `);
        }
    }

    if (entry.solution) {
        hasDetails = true;
        if (typeof entry.solution === 'string') {
            addSection('solution-section', `<h4 style="color: #00ff88; margin-bottom: 0.5rem;">✅ Solution</h4><p>${entry.solution}</p>`);
        } else {
            let html = `<h4 style="color: #00ff88; margin-bottom: 0.5rem;">✅ Solution</h4>`;
            html += `<p>${entry.solution.approach}</p>`;
            if (entry.solution.features) {
                html += '<ul class="update-list">';
                entry.solution.features.forEach(f => html += `<li>${markdownToHtml(f)}</li>`);
                html += '</ul>';
            }
            if (entry.solution.steps) {
                html += '<ol class="update-list">';
                entry.solution.steps.forEach(s => html += `<li>${markdownToHtml(s)}</li>`);
                html += '</ol>';
            }
            if (entry.solution.code) {
                html += `<pre><code>${entry.solution.code}</code></pre>`;
            }
            addSection('solution-section', html);
        }
    }

    if (entry.lessonsLearned) {
        hasDetails = true;
        const ul = document.createElement('ul');
        ul.className = 'update-list';
        ul.innerHTML = '<h4 style="color: #00ff88; margin-bottom: 0.5rem;">📚 Lessons Learned</h4>';
        entry.lessonsLearned.forEach(l => ul.innerHTML += `<li>${markdownToHtml(l)}</li>`);
        details.appendChild(ul);
    }

    if (entry.commits) {
        hasDetails = true;
        let html = '<h4 style="color: #888; margin-bottom: 0.5rem;">💾 Commits</h4>';
        entry.commits.forEach(commit => {
            html += `<div class="commit-block" style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 4px;">`;
            html += `<div style="font-family: monospace; color: #00ff88; margin-bottom: 0.25rem;"><code>${commit.hash}</code></div>`;
            html += `<div style="margin-bottom: 0.5rem;">${commit.message}</div>`;
            if (commit.files && commit.files.length > 0) {
                html += `<div style="font-size: 0.85rem; color: #888;">Files: ${commit.files.join(', ')}</div>`;
            }
            html += `</div>`;
        });
        addSection('commits-section', html);
    }

    if (entry.quote) addSection('timeline-entry-quote', `<blockquote>${entry.quote}</blockquote>`);

    if (entry.metrics) {
        hasDetails = true;
        const grid = document.createElement('div');
        grid.className = 'stats-mini-grid dev-only';
        grid.innerHTML = Object.entries(entry.metrics).map(([k, v]) => `
            <div class="stat-mini"><span class="stat-num">${v}</span><span class="stat-desc">${k.replace(/([A-Z])/g, ' $1').trim()}</span></div>
        `).join('');
        details.appendChild(grid);

        // Mini Stats Preview (collapsed view)
        const preview = fragment.querySelector('.blog-stats-preview')!;
        preview.innerHTML = Object.entries(entry.metrics).slice(0, 3).map(([k, v]) =>
            `<span class="stat-pill">${getStatIcon(k)} ${v}</span>`
        ).join('');
    }

    if (entry.scorecard) {
        const sc = entry.scorecard;
        addSection('v3-scorecard-container', `
            <h4 class="v3-score-title">🧪 Experiment Scorecard</h4>
            <div class="v3-score-grid">
                <div class="v3-stat-item"><span class="v3-label">Creativity</span><span class="v3-value high">${sc.creativity}/10</span></div>
                <div class="v3-stat-item"><span class="v3-label">Fun Factor</span><span class="v3-value">${sc.funFactor}/10</span></div>
                <div class="v3-stat-item"><span class="v3-label">MSG Sensitivity</span><span class="v3-value">${sc.sensitivity}</span></div>
                <div class="v3-stat-item"><span class="v3-label">Aggression</span><span class="v3-value">${sc.aggression}</span></div>
                <div class="v3-stat-wide">
                    <span class="v3-tag adherence-${sc.adherence.toLowerCase()}">${sc.adherence} Adherence</span>
                    <span class="v3-tag velocity-${sc.velocity.toLowerCase()}">${sc.velocity} Velocity</span>
                </div>
            </div>`);
    }
    if (entry.judgement) {
        const jd = entry.judgement;
        addSection(`v3-judgement-container verdict-${jd.verdict}`, `
            <div class="judge-stamp">${jd.verdict === 'understood' ? 'ASSIGNMENT UNDERSTOOD' : 'ROGUE AGENT'}</div>
            <div class="judge-notes"><span class="judge-icon">${jd.verdict === 'understood' ? '✅' : '❌'}</span><span class="judge-text">${jd.notes}</span></div>
        `);
    }
    if (entry.crewAttribution) {
        const ca = entry.crewAttribution;
        addSection('crew-attribution-block',
            `<h4 class="crew-title">🎬 Crew Contributions</h4><div class="crew-members">` +
            ca.systems.map(m => `<div class="crew-member-card"><span class="crew-icon">${m.icon}</span><div class="crew-info"><span class="crew-name">${m.name}</span><span class="crew-contribution">${m.contribution}</span></div></div>`).join('') +
            `</div>` + (ca.quote ? `<blockquote class="crew-quote">"${ca.quote}"</blockquote>` : '')
        );
    }
    if (entry.footer) addSection('entry-footer-badge', `<span class="footer-icon">${entry.footer.icon}</span> ${entry.footer.text}`);

    if (entry.modelId && hasDetails) {
        const sig = getContributorSignature(entry.modelId);
        if (sig) addSection('contributor-signature', sig);
    }

    // --- Interactions ---
    const btn = fragment.querySelector('.blog-read-more') as HTMLButtonElement;
    if (hasDetails) {
        btn.onclick = (e) => {
            e.stopPropagation();
            item.classList.toggle('expanded');
            btn.innerHTML = item.classList.contains('expanded') ? 'Show Less <span class="arrow">↑</span>' : 'Read More <span class="arrow">↓</span>';
        };
    } else {
        btn.remove();
    }

    // Expand entire card logic (Legacy behavior)
    item.onclick = (e) => {
        // Did we click a button or link?
        if ((e.target as HTMLElement).closest('button, a')) return;
        // Otherwise toggle expand
        if (!item.classList.contains('expanded')) btn.click();
    };

    item.appendChild(fragment);
    // Ensure Highlight Pulse effect still works if called via DeepLink
    // The original code returned 'item', which is the wrapper.
    return item;
}
