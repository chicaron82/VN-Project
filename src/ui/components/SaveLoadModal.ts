/**
 * SaveLoadModal - Save/Load UI with Slots
 *
 * Modal overlay for saving and loading game state.
 * Features:
 * - 3 manual save slots + 1 auto-save slot (read-only)
 * - Slot cards showing: slot number, scene name, timestamp, thumbnail placeholder
 * - Save/Load/Delete operations with confirmation for delete
 * - Route-specific accent colors (cyan for Ronnie, green for Tori)
 * - Mobile responsive with 2x2 grid layout
 */

import { EventBus } from '../../core/EventBus';
import { SaveSystem, SaveMetadata } from '../../systems/SaveSystem';
import { StateManager } from '../../core/StateManager';
import '../../ui/styles/save-load-modal.css';

export type SaveLoadMode = 'save' | 'load';

export class SaveLoadModal {
    private container!: HTMLElement;
    private isOpen: boolean = false;
    private mode: SaveLoadMode = 'load';
    private eventBus: EventBus;
    private saveSystem: SaveSystem;
    private stateManager: StateManager;
    private confirmDialog: HTMLElement | null = null;

    constructor(eventBus: EventBus, saveSystem: SaveSystem, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.saveSystem = saveSystem;
        this.stateManager = stateManager;
        this.createDOM();
        this.setupEventListeners();

        // Listen for open events
        this.eventBus.on('ui:save_menu', () => this.open('save'));
        this.eventBus.on('ui:load_menu', () => this.open('load'));
    }

    private createDOM() {
        this.container = document.createElement('div');
        this.container.id = 'save-load-modal';
        this.container.className = 'save-load-modal';
        this.container.style.display = 'none';

        this.container.innerHTML = `
            <div class="save-load-backdrop"></div>
            <div class="save-load-content">
                <button class="save-load-close" id="btn-close-save-load" aria-label="Close">✕</button>
                <h2 class="save-load-title" id="save-load-title">LOAD GAME</h2>

                <div class="save-slots-grid" id="save-slots-grid">
                    <!-- Slots will be populated dynamically -->
                </div>

                <div class="save-load-footer">
                    <button class="save-load-back-btn" id="btn-save-load-back">BACK</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
    }

    private setupEventListeners() {
        // Close button
        this.container.querySelector('#btn-close-save-load')?.addEventListener('click', () => this.close());
        this.container.querySelector('#btn-save-load-back')?.addEventListener('click', () => this.close());

        // Backdrop click closes modal
        this.container.querySelector('.save-load-backdrop')?.addEventListener('click', () => this.close());

        // ESC key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                // If confirm dialog is open, close it first
                if (this.confirmDialog) {
                    this.closeConfirmDialog();
                } else {
                    this.close();
                }
            }
        });
    }

    private renderSlots() {
        const grid = this.container.querySelector('#save-slots-grid');
        if (!grid) return;

        // Get current route for styling
        const currentRoute = this.stateManager.get<string>('currentRoute') || 'ronnie';
        const routeClass = currentRoute === 'tori' ? 'route-tori' : 'route-ronnie';

        // Clear existing slots
        grid.innerHTML = '';

        // Auto-save slot (slot 0) - read-only in load mode, not available in save mode
        const autoSaveMetadata = this.saveSystem.getSlotMetadata(0);
        const autoSaveCard = this.createSlotCard(0, autoSaveMetadata, true, routeClass);
        grid.appendChild(autoSaveCard);

        // Manual save slots (1-3)
        for (let i = 1; i <= 3; i++) {
            const metadata = this.saveSystem.getSlotMetadata(i);
            const slotCard = this.createSlotCard(i, metadata, false, routeClass);
            grid.appendChild(slotCard);
        }
    }

    private createSlotCard(slotId: number, metadata: SaveMetadata | null, isAutoSave: boolean, routeClass: string): HTMLElement {
        const card = document.createElement('div');
        card.className = `save-slot-card ${routeClass} ${metadata ? 'filled' : 'empty'} ${isAutoSave ? 'auto-save' : ''}`;
        card.dataset.slotId = slotId.toString();

        const slotLabel = isAutoSave ? 'AUTO-SAVE' : `SLOT ${slotId}`;

        if (metadata) {
            // Filled slot
            const timestamp = new Date(metadata.timestamp);
            const dateStr = timestamp.toLocaleDateString();
            const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sceneDisplay = metadata.summary || metadata.sceneId || 'Unknown Scene';

            card.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">${slotLabel}</span>
                    ${isAutoSave ? '<span class="slot-auto-badge">READ-ONLY</span>' : ''}
                </div>
                <div class="slot-thumbnail">
                    <div class="thumbnail-placeholder">
                        <span class="thumbnail-icon">&#x1F4BE;</span>
                    </div>
                </div>
                <div class="slot-info">
                    <div class="slot-scene">${this.escapeHtml(sceneDisplay)}</div>
                    <div class="slot-timestamp">${dateStr} ${timeStr}</div>
                </div>
                <div class="slot-actions">
                    ${this.mode === 'load' ? `
                        <button class="slot-btn slot-load-btn" data-action="load" data-slot="${slotId}">LOAD</button>
                    ` : ''}
                    ${this.mode === 'save' && !isAutoSave ? `
                        <button class="slot-btn slot-save-btn" data-action="save" data-slot="${slotId}">SAVE</button>
                    ` : ''}
                    ${!isAutoSave ? `
                        <button class="slot-btn slot-delete-btn" data-action="delete" data-slot="${slotId}">DELETE</button>
                    ` : ''}
                </div>
            `;
        } else {
            // Empty slot
            card.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">${slotLabel}</span>
                </div>
                <div class="slot-thumbnail">
                    <div class="thumbnail-placeholder empty">
                        <span class="thumbnail-icon">&#x2B50;</span>
                    </div>
                </div>
                <div class="slot-info">
                    <div class="slot-scene empty-text">Empty Slot</div>
                    <div class="slot-timestamp">No data</div>
                </div>
                <div class="slot-actions">
                    ${this.mode === 'save' && !isAutoSave ? `
                        <button class="slot-btn slot-save-btn" data-action="save" data-slot="${slotId}">SAVE</button>
                    ` : ''}
                </div>
            `;
        }

        // Attach event listeners to action buttons
        card.querySelectorAll('.slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = e.currentTarget as HTMLElement;
                const action = target.dataset.action;
                const slot = parseInt(target.dataset.slot || '0');
                this.handleSlotAction(action as string, slot);
            });
        });

        // Card click behavior (for convenience)
        card.addEventListener('click', () => {
            if (metadata) {
                if (this.mode === 'load') {
                    this.handleSlotAction('load', slotId);
                }
            } else if (this.mode === 'save' && !isAutoSave) {
                this.handleSlotAction('save', slotId);
            }
        });

        return card;
    }

    private async handleSlotAction(action: string, slotId: number) {
        switch (action) {
            case 'load':
                await this.loadFromSlot(slotId);
                break;
            case 'save':
                await this.saveToSlot(slotId);
                break;
            case 'delete':
                this.showDeleteConfirmation(slotId);
                break;
        }
    }

    private async loadFromSlot(slotId: number) {
        const success = await this.saveSystem.loadGame(slotId);
        if (success) {
            this.eventBus.emit('load:complete', { slot: slotId });
            this.showFeedback('Game loaded successfully!', 'success');
            this.close();
            // Trigger scene reload after load
            const currentScene = this.stateManager.get<string>('currentScene');
            if (currentScene) {
                this.eventBus.emit('scene:load', { sceneId: currentScene });
            }
        } else {
            this.showFeedback('Failed to load game.', 'error');
        }
    }

    private async saveToSlot(slotId: number) {
        const currentScene = this.stateManager.get<string>('currentScene') || 'Unknown';
        const currentRoute = this.stateManager.get<string>('currentRoute') || 'Unknown';
        const summary = `${currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)} - ${currentScene}`;

        const success = await this.saveSystem.saveGame(slotId, summary);
        if (success) {
            this.eventBus.emit('save:complete', { slot: slotId });
            this.showFeedback('Game saved successfully!', 'success');
            this.renderSlots(); // Refresh to show updated slot
        } else {
            this.showFeedback('Failed to save game.', 'error');
        }
    }

    private showDeleteConfirmation(slotId: number) {
        // Create confirmation dialog
        this.confirmDialog = document.createElement('div');
        this.confirmDialog.className = 'save-load-confirm-overlay';
        this.confirmDialog.innerHTML = `
            <div class="save-load-confirm-dialog">
                <h3>DELETE SAVE?</h3>
                <p>Are you sure you want to delete Slot ${slotId}?</p>
                <p class="confirm-warning">This action cannot be undone.</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-yes" id="confirm-delete-yes">DELETE</button>
                    <button class="confirm-btn confirm-no" id="confirm-delete-no">CANCEL</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.confirmDialog);

        // Event listeners for confirm dialog
        this.confirmDialog.querySelector('#confirm-delete-yes')?.addEventListener('click', () => {
            this.deleteSlot(slotId);
            this.closeConfirmDialog();
        });

        this.confirmDialog.querySelector('#confirm-delete-no')?.addEventListener('click', () => {
            this.closeConfirmDialog();
        });
    }

    private closeConfirmDialog() {
        if (this.confirmDialog) {
            this.confirmDialog.remove();
            this.confirmDialog = null;
        }
    }

    private deleteSlot(slotId: number) {
        this.saveSystem.deleteSlot(slotId);
        this.showFeedback(`Slot ${slotId} deleted.`, 'success');
        this.renderSlots(); // Refresh slots display
    }

    private showFeedback(message: string, type: 'success' | 'error') {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = `save-load-feedback ${type}`;
        feedback.textContent = message;

        const content = this.container.querySelector('.save-load-content');
        if (content) {
            content.appendChild(feedback);

            // Auto-remove after animation
            setTimeout(() => {
                feedback.classList.add('fade-out');
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public open(mode: SaveLoadMode = 'load') {
        this.mode = mode;
        this.isOpen = true;

        // Update title based on mode
        const title = this.container.querySelector('#save-load-title');
        if (title) {
            title.textContent = mode === 'save' ? 'SAVE GAME' : 'LOAD GAME';
        }

        // Update container class for mode-specific styling
        this.container.classList.remove('mode-save', 'mode-load');
        this.container.classList.add(`mode-${mode}`);

        this.renderSlots();
        this.container.style.display = 'flex';

        console.debug('[SaveLoadModal] Opened in', mode, 'mode');
    }

    public close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.container.style.display = 'none';
        this.closeConfirmDialog();
        console.debug('[SaveLoadModal] Closed');
    }

    public isVisible(): boolean {
        return this.isOpen;
    }
}
