/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE HOVER PREVIEW
 *
 * Phase 7: Show tooltip preview on timeline entry hover
 * Part of MAXIMUM MICHELIN timeline enhancements
 *
 * Features:
 * - Tooltip with title, date, and summary preview
 * - Smart positioning (avoids viewport edges)
 * - Glassmorphism styling
 * - Mobile support (tap to preview)
 * - Smooth fade-in/out animations
 *
 * Credit: ZeeRah's Chaos 😈
 * 848 is sacred. 💚🔥💀
 * ═══════════════════════════════════════════════════════════════
 */

import { Logger } from '@utils/Logger';

export class BlogHoverPreview {
    private tooltip: HTMLElement | null;
    private currentTarget: HTMLElement | null;
    private hideTimeout?: number;
    private isMobile: boolean;

    constructor(private timelineSelector: string = '.timeline-phases') {
        this.tooltip = null;
        this.currentTarget = null;
        this.isMobile = 'ontouchstart' in window;

        this.init();
    }

    private init(): void {
        this.createTooltip();
        this.attachListeners();
        Logger.ui('🎯 [BlogHoverPreview] Initialized');
    }

    /**
     * Create tooltip element
     */
    private createTooltip(): void {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'timeline-hover-preview';
        this.tooltip.innerHTML = `
            <div class="preview-content">
                <div class="preview-date"></div>
                <div class="preview-title"></div>
                <div class="preview-summary"></div>
            </div>
        `;
        document.body.appendChild(this.tooltip);
    }

    /**
     * Attach event listeners to timeline entries
     */
    private attachListeners(): void {
        const timeline = document.querySelector(this.timelineSelector);
        if (!timeline) return;

        // Use event delegation for better performance
        if (this.isMobile) {
            // Mobile: tap to show, tap outside to hide
            timeline.addEventListener('click', (e) => {
                const target = (e.target as HTMLElement).closest('.timeline-item') as HTMLElement;
                if (target) {
                    e.preventDefault();
                    this.showPreview(target, e as MouseEvent);
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.tooltip?.contains(e.target as Node) &&
                    !(e.target as HTMLElement).closest('.timeline-item')) {
                    this.hidePreview();
                }
            });
        } else {
            // Desktop: hover to show
            timeline.addEventListener('mouseover', (e) => {
                const target = (e.target as HTMLElement).closest('.timeline-item') as HTMLElement;
                if (target && target !== this.currentTarget) {
                    this.showPreview(target, e as MouseEvent);
                }
            });

            timeline.addEventListener('mouseout', (e) => {
                const target = (e.target as HTMLElement).closest('.timeline-item') as HTMLElement;
                if (target) {
                    this.scheduleHide();
                }
            });

            // Keep tooltip visible when hovering over it
            this.tooltip?.addEventListener('mouseenter', () => {
                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                }
            });

            this.tooltip?.addEventListener('mouseleave', () => {
                this.hidePreview();
            });
        }
    }

    /**
     * Show preview tooltip
     */
    private showPreview(target: HTMLElement, event: MouseEvent): void {
        if (!this.tooltip) return;

        this.currentTarget = target;

        // Extract entry data
        const titleElement = target.querySelector('strong');
        const title = titleElement?.textContent?.trim() || 'Untitled';

        const headerElement = target.querySelector('h3');
        const date = headerElement?.textContent?.trim() || '';

        const contentDiv = target.querySelector('.timeline-content');
        const paragraphs = contentDiv?.querySelectorAll('p');
        let summary = '';
        if (paragraphs && paragraphs.length > 1) {
            // Get first paragraph after title (usually the summary)
            summary = paragraphs[1]?.textContent?.trim() || '';
            // Truncate to 150 chars
            if (summary.length > 150) {
                summary = summary.substring(0, 150) + '...';
            }
        }

        // Update tooltip content
        const dateEl = this.tooltip.querySelector('.preview-date');
        const titleEl = this.tooltip.querySelector('.preview-title');
        const summaryEl = this.tooltip.querySelector('.preview-summary');

        if (dateEl) dateEl.textContent = date;
        if (titleEl) titleEl.textContent = title;
        if (summaryEl) {
            summaryEl.textContent = summary;
            (summaryEl as HTMLElement).style.display = summary ? 'block' : 'none';
        }

        // Position tooltip
        this.positionTooltip(event);

        // Show tooltip
        this.tooltip.classList.add('visible');

        // Clear any pending hide
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    }

    /**
     * Position tooltip intelligently (avoid viewport edges)
     */
    private positionTooltip(event: MouseEvent): void {
        if (!this.tooltip) return;

        const padding = 16;
        const offset = 12;

        let x = event.clientX + offset;
        let y = event.clientY + offset;

        // Get tooltip dimensions (need to show it first to measure)
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;

        const rect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust horizontal position if tooltip goes off-screen
        if (x + rect.width + padding > viewportWidth) {
            x = event.clientX - rect.width - offset;
        }

        // Adjust vertical position if tooltip goes off-screen
        if (y + rect.height + padding > viewportHeight) {
            y = event.clientY - rect.height - offset;
        }

        // Ensure tooltip doesn't go off left/top edges
        x = Math.max(padding, x);
        y = Math.max(padding, y);

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    /**
     * Schedule tooltip hide with delay
     */
    private scheduleHide(): void {
        this.hideTimeout = window.setTimeout(() => {
            this.hidePreview();
        }, 200); // Small delay to allow moving to tooltip
    }

    /**
     * Hide preview tooltip
     */
    private hidePreview(): void {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
        this.currentTarget = null;
    }

    /**
     * Destroy and cleanup
     */
    public destroy(): void {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        Logger.ui('🎯 [BlogHoverPreview] Destroyed');
    }
}
