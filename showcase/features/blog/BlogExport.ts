/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE EXPORT
 *
 * Phase 10: Export timeline data in multiple formats
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Export as JSON (raw data)
 * - Export as Markdown (formatted list)
 * - Export respects current filters/search
 * - Download button in toolbar
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

interface ExportEntry {
    id: string;
    date: string;
    title: string;
    description: string;
    features: string[];
    crew: string[];
}

export class BlogExport {
    private exportButton: HTMLElement | null;

    constructor(
        private timelineSelector: string = '.timeline-phases',
        private toolbarSelector: string = '.timeline-toolbar'
    ) {
        this.exportButton = null;
        this.init();
    }

    private init(): void {
        this.createExportButton();
        Logger.ui('💾 [BlogExport] Initialized');
    }

    /**
     * Create export button in toolbar
     */
    private createExportButton(): void {
        const toolbar = document.querySelector(this.toolbarSelector);
        if (!toolbar) return;

        // Create export dropdown
        const exportContainer = document.createElement('div');
        exportContainer.className = 'export-container';
        exportContainer.innerHTML = `
            <button class="timeline-btn export-btn" title="Export Timeline">
                <span>💾</span> Export
            </button>
            <div class="export-dropdown">
                <button class="export-option" data-format="json">
                    <span>📄</span> Export as JSON
                </button>
                <button class="export-option" data-format="markdown">
                    <span>📝</span> Export as Markdown
                </button>
            </div>
        `;

        // Insert at end of toolbar
        toolbar.appendChild(exportContainer);

        this.exportButton = exportContainer.querySelector('.export-btn');
        this.attachListeners(exportContainer);
    }

    /**
     * Attach event listeners
     */
    private attachListeners(container: HTMLElement): void {
        const btn = container.querySelector('.export-btn');
        const dropdown = container.querySelector('.export-dropdown');

        // Toggle dropdown
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('visible');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown?.classList.remove('visible');
        });

        // Export options
        const options = container.querySelectorAll('.export-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const format = option.getAttribute('data-format');
                if (format === 'json') {
                    this.exportAsJSON();
                } else if (format === 'markdown') {
                    this.exportAsMarkdown();
                }
                dropdown?.classList.remove('visible');
            });
        });
    }

    /**
     * Parse timeline entries
     */
    private parseEntries(): ExportEntry[] {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return [];

        const entries: ExportEntry[] = [];
        const items = timeline.querySelectorAll('.timeline-item:not(.search-hidden)');

        items.forEach((item, index) => {
            const id = item.id || `entry-${index}`;

            // Extract date
            const headerElement = item.querySelector('h3');
            const headerText = headerElement?.textContent?.trim() || '';
            const dateMatch = headerText.match(/\((\d{4}-\d{2}-\d{2})\)/);
            const date = dateMatch ? dateMatch[1] : '';

            // Extract title
            const titleElement = item.querySelector('strong');
            const title = titleElement?.textContent?.trim() || 'Untitled';

            // Extract description
            const contentDiv = item.querySelector('.timeline-content');
            const paragraphs = contentDiv?.querySelectorAll('p');
            let description = '';
            if (paragraphs && paragraphs.length > 1) {
                description = paragraphs[1]?.textContent?.trim() || '';
            }

            // Extract features
            const features: string[] = [];
            const featuresList = item.querySelector('.update-list');
            if (featuresList) {
                const featureItems = featuresList.querySelectorAll('li');
                featureItems.forEach(li => {
                    const text = li.textContent?.trim();
                    if (text) features.push(text);
                });
            }

            // Extract crew (if available)
            const crew: string[] = [];
            const crewElement = item.querySelector('.crew-credit');
            if (crewElement) {
                const crewText = crewElement.textContent?.trim() || '';
                const crewMatch = crewText.match(/Credit: (.+)/);
                if (crewMatch) {
                    crew.push(crewMatch[1]);
                }
            }

            entries.push({
                id,
                date,
                title,
                description,
                features,
                crew
            });
        });

        return entries;
    }

    /**
     * Export as JSON
     */
    private exportAsJSON(): void {
        const entries = this.parseEntries();

        const data = {
            exportDate: new Date().toISOString(),
            totalEntries: entries.length,
            entries
        };

        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'timeline-export.json', 'application/json');

        Logger.ui('💾 [BlogExport] Exported', entries.length, 'entries as JSON');
    }

    /**
     * Export as Markdown
     */
    private exportAsMarkdown(): void {
        const entries = this.parseEntries();

        let markdown = '# Timeline Export\n\n';
        markdown += `**Exported:** ${new Date().toLocaleDateString()}\n`;
        markdown += `**Total Entries:** ${entries.length}\n\n`;
        markdown += '---\n\n';

        entries.forEach((entry, index) => {
            markdown += `## ${index + 1}. ${entry.title}\n\n`;

            if (entry.date) {
                markdown += `**Date:** ${entry.date}\n\n`;
            }

            if (entry.description) {
                markdown += `${entry.description}\n\n`;
            }

            if (entry.features.length > 0) {
                markdown += `### Features\n\n`;
                entry.features.forEach(feature => {
                    markdown += `- ${feature}\n`;
                });
                markdown += '\n';
            }

            if (entry.crew.length > 0) {
                markdown += `**Credit:** ${entry.crew.join(', ')}\n\n`;
            }

            markdown += '---\n\n';
        });

        this.downloadFile(markdown, 'timeline-export.md', 'text/markdown');

        Logger.ui('💾 [BlogExport] Exported', entries.length, 'entries as Markdown');
    }

    /**
     * Download file
     */
    private downloadFile(content: string, filename: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * Destroy and cleanup
     */
    public destroy(): void {
        if (this.exportButton) {
            this.exportButton.closest('.export-container')?.remove();
            this.exportButton = null;
        }
        Logger.ui('💾 [BlogExport] Destroyed');
    }
}
