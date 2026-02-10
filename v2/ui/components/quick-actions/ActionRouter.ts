// ========================================
// ACTION ROUTER
// Action dispatch, screenshot mode, and help overlay
//
// Extracted from ExpandableQuickActions.ts (~175 lines -> dedicated module)
//
// Handles:
// - Action dispatch to game/shade controllers
// - Screenshot mode toggle (hides/shows UI)
// - Help overlay with gesture guide
//
// 848 is sacred. 💚🔥💀
// ========================================

import { Logger } from '@utils/Logger';

/**
 * Callback contract for action routing dependencies.
 */
export interface ActionRouterDeps {
    saveOpenSaveMenu(): void;
    saveOpenLoadMenu(): void;
    toggleFullscreen(): void;
    shadeReturnToMenu(): void;
    shadeOpenNotesViewer(): void;
    shadeOpenSettings(): void;
    getScreenshotMode(): boolean;
    setScreenshotMode(mode: boolean): void;
    triggerHaptic(type: 'light' | 'medium' | 'heavy'): void;
}

/**
 * ActionRouter
 *
 * Routes quick action button presses to the appropriate
 * game/shade controller methods. Manages screenshot mode
 * and help overlay.
 */
export class ActionRouter {
    private screenshotExitHandler: ((e: Event) => void) | null = null;

    constructor(private deps: ActionRouterDeps) { }

    handleAction(action: string): void {
        Logger.ui(`🎯 Quick action: ${action}`);

        switch (action) {
            case 'save':
                this.deps.saveOpenSaveMenu();
                break;
            case 'load':
                this.deps.saveOpenLoadMenu();
                break;
            case 'fullscreen':
                this.deps.toggleFullscreen();
                break;
            case 'exit':
                this.deps.shadeReturnToMenu();
                break;
            case 'screenshot':
                this.enterScreenshotMode();
                break;
            case 'notes':
                this.deps.shadeOpenNotesViewer();
                break;
            case 'settings':
                this.deps.shadeOpenSettings();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                Logger.warn(`Unknown action: ${action}`);
        }
    }

    private enterScreenshotMode(): void {
        const current = this.deps.getScreenshotMode();
        this.deps.setScreenshotMode(!current);

        if (!current) {
            document.body.classList.add('screenshot-mode');
            Logger.ui('📸 Screenshot mode enabled - tap anywhere to exit');

            this.screenshotExitHandler = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                this.exitScreenshotMode();
            };

            setTimeout(() => {
                if (this.screenshotExitHandler) {
                    document.addEventListener('click', this.screenshotExitHandler, { once: true, capture: true });
                    document.addEventListener('touchend', this.screenshotExitHandler, { once: true, capture: true });
                }
            }, 100);
        } else {
            this.exitScreenshotMode();
        }
    }

    private exitScreenshotMode(): void {
        if (this.screenshotExitHandler) {
            document.removeEventListener('click', this.screenshotExitHandler, { capture: true });
            document.removeEventListener('touchend', this.screenshotExitHandler, { capture: true });
            this.screenshotExitHandler = null;
        }

        this.deps.setScreenshotMode(false);
        document.body.classList.remove('screenshot-mode');
        Logger.ui('📸 Screenshot mode disabled');
    }

    private showHelp(): void {
        const overlay = document.createElement('div');
        overlay.className = 'quick-actions-help-overlay';
        overlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>❓ Quick Actions Guide</h3>
                    <button class="help-close-btn">✕</button>
                </div>
                <div class="help-body">
                    <div class="help-section">
                        <div class="help-title">🔄 Navigation</div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Down</span>
                            <span class="help-desc">Open quick actions carousel</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Down Again</span>
                            <span class="help-desc">Expand to see all actions</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Left/Right</span>
                            <span class="help-desc">Switch between action pages</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Swipe Up</span>
                            <span class="help-desc">Close notification shade</span>
                        </div>
                    </div>

                    <div class="help-section">
                        <div class="help-title">✏️ Customization</div>
                        <div class="help-item">
                            <span class="help-gesture">Edit Button</span>
                            <span class="help-desc">Toggle edit mode (in expanded view)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Drag ⋮⋮</span>
                            <span class="help-desc">Reorder actions (edit mode)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">Tap ⭐</span>
                            <span class="help-desc">Add/remove from carousel (edit mode)</span>
                        </div>
                        <div class="help-item">
                            <span class="help-gesture">ESC Key</span>
                            <span class="help-desc">Exit edit mode</span>
                        </div>
                    </div>

                    <div class="help-section">
                        <div class="help-title">📸 Screenshot Mode</div>
                        <div class="help-item">
                            <span class="help-desc">Hides all UI for clean captures. Tap anywhere to exit.</span>
                        </div>
                    </div>
                </div>
                <div class="help-footer">
                    <button class="help-got-it-btn">Got it!</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeHelp = (): void => {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 200);
        };

        overlay.querySelector('.help-close-btn')?.addEventListener('click', closeHelp);
        overlay.querySelector('.help-got-it-btn')?.addEventListener('click', closeHelp);
        overlay.addEventListener('click', (e: Event) => {
            if (e.target === overlay) closeHelp();
        });

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        this.deps.triggerHaptic('medium');
    }
}
