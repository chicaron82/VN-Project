/**
 * UV7 OS - GRAB HANDLE REPOSITIONER (V1 Parity)
 * Works across Landing + Showcase + anywhere that has #uv7-sidebar-toggle
 * Persists position + side to localStorage.
 */

class UV7GrabHandleRepositioner {
    constructor(toggleEl, options = {}) {
        this.el = toggleEl;
        if (!this.el) return;

        this.storageKey = options.storageKey || 'uv7-grab-handle';
        this.headerSafeTop = options.headerSafeTop ?? 52;   // below status bar
        this.bottomSafePad = options.bottomSafePad ?? 120;  // avoid bottom UI
        this.dragThreshold = options.dragThreshold ?? 6;

        this.state = this.load() || { top: 140, side: 'left' };
        this.apply();

        this.bind();
    }

    bind() {
        let dragging = false;
        let startY = 0;
        let startTop = 0;
        let moved = false;

        const onStart = (clientY) => {
            dragging = true;
            moved = false;
            startY = clientY;
            startTop = this.state.top;
            this.el.classList.add('uv7-dragging');
        };

        const onMove = (clientY) => {
            if (!dragging) return;
            const dy = clientY - startY;
            if (Math.abs(dy) > this.dragThreshold) moved = true;

            this.state.top = startTop + dy;
            this.clamp();
            this.apply();
        };

        const onEnd = (clientX) => {
            if (!dragging) return;
            dragging = false;
            this.el.classList.remove('uv7-dragging');

            // If the user dragged enough, persist.
            if (moved) {
                // Side-swap rule: if released past midpoint, snap to that side
                const mid = window.innerWidth / 2;
                this.state.side = clientX >= mid ? 'right' : 'left';
                this.apply();
                this.save();
            }
        };

        // Desktop
        this.el.addEventListener('mousedown', (e) => onStart(e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientY));
        window.addEventListener('mouseup', (e) => onEnd(e.clientX));

        // Mobile
        this.el.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            onStart(t.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            onMove(t.clientY);
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            onEnd(t.clientX);
        }, { passive: true });

        // Optional: double-click swaps side instantly (desktop bougie)
        this.el.addEventListener('dblclick', () => {
            this.state.side = this.state.side === 'left' ? 'right' : 'left';
            this.apply();
            this.save();
        });

        // Re-clamp on resize/orientation change
        window.addEventListener('resize', () => {
            this.clamp();
            this.apply();
            this.save();
        });
    }

    clamp() {
        const min = this.headerSafeTop;
        const max = Math.max(min, window.innerHeight - this.bottomSafePad);
        this.state.top = Math.max(min, Math.min(max, this.state.top));
    }

    apply() {
        this.el.style.position = 'fixed';
        this.el.style.top = `${Math.round(this.state.top)}px`;

        if (this.state.side === 'left') {
            this.el.style.left = '8px';
            this.el.style.right = 'auto';
        } else {
            this.el.style.right = '8px';
            this.el.style.left = 'auto';
        }

        this.el.dataset.side = this.state.side;
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }
}
