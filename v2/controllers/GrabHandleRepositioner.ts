import { EventBus } from '@core/EventBus';

type GrabPosition = {
    top: number;
    side: 'left' | 'right';
};

/**
 * GrabHandleRepositioner (Tori's Surgical Port)
 * 
 * Bringing the V1 Gold Standard grab handle behavior to V2.
 * - Drag vertical to reposition
 * - Double-click to swap sides
 * - Persistent position
 */
export class GrabHandleRepositioner {
    private handle: HTMLElement | null;
    // private eventBus: EventBus; // Unused in surgical port
    private position: GrabPosition;

    constructor(_eventBus: EventBus) {
        // this.eventBus = eventBus;

        // Initialize position immediately to satisfy TS definite assignment
        this.position = this.loadPosition();

        this.handle = document.getElementById('sidebar-toggle');

        if (!this.handle) {
            console.warn('[GrabHandle] Toggle button not found (is Sidebar initialized?)');
            return;
        }

        this.applyPosition();
        this.attachEvents();

        console.log('[GrabHandle] Initialized & positioned', this.position);
    }

    private attachEvents() {
        let isDragging = false;
        let startY = 0;

        // V2 Parity: Use specific selectors for mouse events
        this.handle!.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            this.handle!.classList.add('dragging');
            e.preventDefault(); // Prevent text selection
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.position.top += e.clientY - startY;
            startY = e.clientY;
            this.clamp();
            this.applyPosition();
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            this.handle!.classList.remove('dragging');
            this.savePosition();
        });

        // Double-click = swap sides
        this.handle!.addEventListener('dblclick', () => {
            this.position.side = this.position.side === 'left' ? 'right' : 'left';
            this.applyPosition();
            this.savePosition();
            console.log('[GrabHandle] Swapped side ->', this.position.side);
        });

        // Touch Support (for mobile V1 parity)
        this.handle!.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            isDragging = true;
            startY = touch.clientY;
            this.handle!.classList.add('dragging');
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            if (!touch) return;

            // Prevent scrolling while dragging handle
            if (e.cancelable) e.preventDefault();

            this.position.top += touch.clientY - startY;
            startY = touch.clientY;
            this.clamp();
            this.applyPosition();
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            this.handle!.classList.remove('dragging');
            this.savePosition();
        });
    }

    private clamp() {
        // Constraints: Below status bar (top), above bottom usage area
        const min = 48; // 44px status bar + buffer
        const max = window.innerHeight - 120;
        this.position.top = Math.max(min, Math.min(max, this.position.top));
    }

    private applyPosition() {
        if (!this.handle) return;

        this.handle.style.top = `${this.position.top}px`;
        this.handle.style.left = this.position.side === 'left' ? '0' : 'auto';
        this.handle.style.right = this.position.side === 'right' ? '0' : 'auto';

        // Update border radius based on side
        if (this.position.side === 'left') {
            this.handle.style.borderRadius = '0 8px 8px 0';
            this.handle.style.borderLeft = 'none';
            this.handle.style.borderRight = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            this.handle.style.borderRadius = '8px 0 0 8px';
            this.handle.style.borderRight = 'none';
            this.handle.style.borderLeft = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }

    private savePosition() {
        localStorage.setItem('uv7-grab-handle', JSON.stringify(this.position));
    }

    private loadPosition(): GrabPosition {
        try {
            const saved = localStorage.getItem('uv7-grab-handle');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to load grab handle position', e);
        }
        // Default
        return { top: 120, side: 'left' };
    }
}
