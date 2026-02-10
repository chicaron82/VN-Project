import type { EventBus } from '@core/EventBus';
import '@ui/styles/auto-save-indicator.css';

/**
 * AutoSaveIndicator
 *
 * Small floating indicator that shows save status.
 * Appears in top-right corner when saving, fades out after completion.
 *
 * Listens to:
 * - 'autosave:start' - Show indicator with "Saving..." text
 * - 'autosave:complete' - Update to "Saved!" and fade out
 * - 'save:complete' - Also triggers indicator for manual saves
 */
export class AutoSaveIndicator {
    private container: HTMLElement;
    private eventBus: EventBus;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly HIDE_DELAY_MS = 2000; // Time to show "Saved!" before fading

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.container = this.createDOM();
        this.initListeners();
    }

    private createDOM(): HTMLElement {
        // Reuse existing container if present (singleton pattern)
        const existing = document.getElementById('auto-save-indicator');
        if (existing) {
            return existing;
        }

        const div = document.createElement('div');
        div.id = 'auto-save-indicator';
        div.className = 'auto-save-indicator';
        div.innerHTML = `
            <div class="auto-save-content">
                <span class="auto-save-icon">
                    <span class="save-icon-static">&#128190;</span>
                </span>
                <span class="auto-save-text">Saving...</span>
            </div>
        `;

        document.body.appendChild(div);
        return div;
    }

    private initListeners(): void {
        // Listen for auto-save events
        this.eventBus.on('autosave:start', () => {
            this.show('Saving...');
        });

        this.eventBus.on('autosave:complete', (data) => {
            if (data.success) {
                this.showSuccess('Saved!');
            } else {
                this.showError('Save failed');
            }
        });

        // Also show indicator for manual saves (unified experience)
        this.eventBus.on('save:complete', () => {
            this.showSuccess('Saved!');
        });
    }

    /**
     * Show the indicator with custom text
     */
    public show(text: string = 'Saving...'): void {
        // Clear any pending hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        // Update text
        const textEl = this.container.querySelector('.auto-save-text');
        if (textEl) {
            textEl.textContent = text;
        }

        // Reset classes
        this.container.classList.remove('hidden', 'success', 'error');
        this.container.classList.add('visible', 'saving');
    }

    /**
     * Show success state and schedule hide
     */
    public showSuccess(text: string = 'Saved!'): void {
        const textEl = this.container.querySelector('.auto-save-text');
        if (textEl) {
            textEl.textContent = text;
        }

        this.container.classList.remove('saving', 'error');
        this.container.classList.add('visible', 'success');

        this.scheduleHide();
    }

    /**
     * Show error state and schedule hide
     */
    public showError(text: string = 'Save failed'): void {
        const textEl = this.container.querySelector('.auto-save-text');
        if (textEl) {
            textEl.textContent = text;
        }

        this.container.classList.remove('saving', 'success');
        this.container.classList.add('visible', 'error');

        this.scheduleHide();
    }

    /**
     * Schedule hiding the indicator after delay
     */
    private scheduleHide(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, this.HIDE_DELAY_MS);
    }

    /**
     * Hide the indicator
     */
    public hide(): void {
        this.container.classList.remove('visible', 'saving', 'success', 'error');
        this.container.classList.add('hidden');
        this.hideTimeout = null;
    }

    /**
     * Cleanup - remove from DOM and clear listeners
     */
    public destroy(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        this.container.remove();
    }
}
