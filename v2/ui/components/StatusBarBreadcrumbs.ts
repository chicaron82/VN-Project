/**
 * StatusBarBreadcrumbs - Breadcrumb Navigation
 * Extracted from StatusBar.ts (Phase 26 Refactoring)
 *
 * Tori: "Breadcrumbs are the real premium feature"
 * Game: v.848 → Ronnie → Act 2 → Scene 5
 * Showcase: Showcase → Phase 25 → X
 *
 * 💚🔥💀
 */

import { UV7Context, ColorTint } from './StatusBarContext';
import { EventBus } from '../../core/EventBus';

// ========================================
// BREADCRUMB TYPES
// ========================================

/**
 * Breadcrumb segment for navigation
 */
export interface BreadcrumbSegment {
    label: string;
    id: string;
    clickable: boolean;
}

/**
 * State for building breadcrumbs
 */
export interface BreadcrumbState {
    loopVersion?: number;
    route?: string;
    act?: string;
    scene?: string;
    phase?: string;
    section?: string;
}

// ========================================
// BREADCRUMB BUILDER
// ========================================

/**
 * Build breadcrumb trail for current state
 * Game: v.848 → Ronnie → Act 2 → Scene 5
 * Showcase: Showcase → Phase 25 → X
 */
export function buildBreadcrumbs(
    context: UV7Context,
    state: BreadcrumbState
): BreadcrumbSegment[] {
    const segments: BreadcrumbSegment[] = [];

    if (context === 'game') {
        // Loop version (always)
        segments.push({
            label: `v.${state.loopVersion || 848}`,
            id: 'loop',
            clickable: false,
        });

        // Route (if set)
        if (state.route && state.route !== 'menu') {
            segments.push({
                label: state.route.charAt(0).toUpperCase() + state.route.slice(1),
                id: 'route',
                clickable: true,
            });
        }

        // Act (if set)
        if (state.act) {
            segments.push({
                label: state.act,
                id: 'act',
                clickable: true,
            });
        }

        // Scene (if set, shortened)
        if (state.scene) {
            const shortScene = state.scene.replace(/^act\d+_/, '').substring(0, 12);
            segments.push({
                label: shortScene,
                id: 'scene',
                clickable: false,
            });
        }
    } else if (context === 'showcase') {
        // Showcase root
        segments.push({
            label: 'Showcase',
            id: 'showcase',
            clickable: true,
        });

        // Phase/Tab (if set) - don't add "Phase" prefix for tab names
        if (state.phase) {
            // Tab names like "The Journey", "Workflow", etc. should display as-is
            // Phase numbers like "13" should get "Phase" prefix
            const isPhaseNumber = /^\d+$/.test(state.phase);
            segments.push({
                label: isPhaseNumber ? `Phase ${state.phase}` : state.phase,
                id: 'phase',
                clickable: true,
            });
        }

        // Section (if set)
        if (state.section) {
            segments.push({
                label: state.section,
                id: 'section',
                clickable: false,
            });
        }
    }

    return segments;
}

// ========================================
// BREADCRUMB RENDERER
// ========================================

/**
 * BreadcrumbRenderer - Handles DOM rendering of breadcrumbs
 */
export class BreadcrumbRenderer {
    private container: HTMLElement;
    private eventBus: EventBus;
    private currentSegments: BreadcrumbSegment[] = [];
    private currentTint: ColorTint;

    constructor(container: HTMLElement, eventBus: EventBus, initialTint: ColorTint) {
        this.container = container;
        this.eventBus = eventBus;
        this.currentTint = initialTint;
    }

    /**
     * Update the current color tint (for hover effects)
     */
    public setTint(tint: ColorTint): void {
        this.currentTint = tint;
    }

    /**
     * Render breadcrumb segments to DOM
     */
    public render(segments: BreadcrumbSegment[]): void {
        this.currentSegments = segments;
        this.container.innerHTML = '';

        segments.forEach((segment, index) => {
            // Create segment element
            const segmentEl = document.createElement('span');
            segmentEl.className = `breadcrumb-segment ${segment.clickable ? 'clickable' : ''}`;
            segmentEl.textContent = segment.label;
            segmentEl.dataset.id = segment.id;

            // Add click handler for clickable segments
            if (segment.clickable) {
                segmentEl.addEventListener('click', () => {
                    this.handleClick(segment);
                });
            }

            // Add micro-interaction on hover
            segmentEl.addEventListener('mouseenter', () => {
                if (segment.clickable) {
                    segmentEl.style.transform = 'scale(1.05)';
                    segmentEl.style.color = this.currentTint.primary;
                }
            });
            segmentEl.addEventListener('mouseleave', () => {
                segmentEl.style.transform = '';
                segmentEl.style.color = '';
            });

            this.container.appendChild(segmentEl);

            // Add separator (except for last segment)
            if (index < segments.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.textContent = ' › ';
                separator.style.opacity = '0.5';
                separator.style.margin = '0 4px';
                this.container.appendChild(separator);
            }
        });
    }

    /**
     * Handle breadcrumb segment click
     * Tori's recommendation: Emit events, don't do actions directly
     */
    private handleClick(segment: BreadcrumbSegment): void {
        console.log(`🍞 Breadcrumb clicked: ${segment.id} (${segment.label})`);

        // Emit event for controllers to handle navigation
        this.eventBus.emit('ui:screen_change', { screen: `breadcrumb:${segment.id}` });

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }

    /**
     * Get current segments
     */
    public getSegments(): BreadcrumbSegment[] {
        return this.currentSegments;
    }
}
