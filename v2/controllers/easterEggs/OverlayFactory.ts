// ========================================
// OVERLAY FACTORY
// Shared overlay creation infrastructure
//
// Extracted from EasterEggController.ts (~130 lines -> dedicated module)
//
// Handles:
// - Overlay backdrop creation with fade animations
// - Content box styling with variant colors
// - Styled button creation with hover effects
// - Active overlay lifecycle tracking
//
// 848 is sacred. 💚🔥💀
// ========================================

// ========================================
// TYPES
// ========================================

/**
 * Overlay variant for styling
 */
export type OverlayVariant = 'default' | 'error' | 'success' | 'info';

/**
 * Easter egg overlay configuration
 */
export interface OverlayConfig {
    variant?: OverlayVariant;
    id?: string;
    closeOnBackdrop?: boolean;
}

// ========================================
// OVERLAY FACTORY
// ========================================

/**
 * OverlayFactory
 *
 * Creates and manages easter egg overlay DOM elements.
 * Provides consistent styling, animations, and lifecycle tracking.
 */
export class OverlayFactory {
    /** Active overlays for cleanup */
    private activeOverlays: Set<HTMLElement> = new Set();

    /**
     * Get color for variant
     */
    getVariantColor(variant: OverlayVariant): string {
        const colors: Record<OverlayVariant, string> = {
            default: '#00ff88',
            error: '#ff0066',
            success: '#00ff88',
            info: '#00ccff'
        };
        return colors[variant];
    }

    /**
     * Create custom overlay with backdrop
     * Returns overlay and content box for adding content
     */
    createOverlay(config: OverlayConfig = {}): { overlay: HTMLElement; box: HTMLElement } {
        const {
            variant = 'default',
            id = `easter-egg-overlay-${Date.now()}`,
            closeOnBackdrop = true
        } = config;

        // Create overlay backdrop
        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'easter-egg-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create content box
        const box = document.createElement('div');
        box.className = 'easter-egg-box';
        box.style.cssText = `
            background: #1a1a2e;
            border: 2px solid ${this.getVariantColor(variant)};
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px ${this.getVariantColor(variant)}40;
        `;

        // Close on backdrop click
        if (closeOnBackdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeOverlay(overlay);
                }
            });
        }

        overlay.appendChild(box);
        this.activeOverlays.add(overlay);

        return { overlay, box };
    }

    /**
     * Show overlay with fade-in animation
     */
    showOverlay(overlay: HTMLElement): void {
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    /**
     * Close overlay with fade-out animation
     */
    closeOverlay(overlay: HTMLElement): void {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            this.activeOverlays.delete(overlay);
        }, 300);
    }

    /**
     * Create styled button
     */
    createButton(
        text: string,
        onClick: () => void,
        variant: OverlayVariant = 'default'
    ): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'easter-egg-button';
        button.style.cssText = `
            background: transparent;
            border: 2px solid ${this.getVariantColor(variant)};
            color: ${this.getVariantColor(variant)};
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 1em;
            transition: all 0.2s ease;
            margin: 5px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.background = this.getVariantColor(variant);
            button.style.color = '#1a1a2e';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'transparent';
            button.style.color = this.getVariantColor(variant);
        });

        button.addEventListener('click', onClick);

        return button;
    }

    /**
     * Track an externally-created overlay for lifecycle management
     */
    trackOverlay(overlay: HTMLElement): void {
        this.activeOverlays.add(overlay);
    }

    /**
     * Destroy all active overlays
     */
    destroyAll(): void {
        this.activeOverlays.forEach(overlay => {
            overlay.remove();
        });
        this.activeOverlays.clear();
    }
}
